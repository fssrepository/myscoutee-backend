import {
  resolveSideMenuPresentation
} from "./chunk-PS66FV4D.js";
import "./chunk-F5B73CZX.js";
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
import "./chunk-JWRKXGRX.js";
import "./chunk-LWXWCSPP.js";
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
import {
  MatRipple,
  MatRippleModule
} from "./chunk-T5TB7V7K.js";
import {
  MatIcon,
  MatIconModule
} from "./chunk-J4QS2YUJ.js";
import "./chunk-XCPZRRU5.js";
import "./chunk-LGGVU5AE.js";
import "./chunk-6RAUJLMB.js";
import "./chunk-JQCFZPHN.js";
import "./chunk-J5KOSTYM.js";
import "./chunk-MC3W6CB7.js";
import {
  APP_STATIC_DATA
} from "./chunk-FAW3YKWN.js";
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
  DatePipe,
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
  __spreadProps,
  __spreadValues,
  computed,
  effect,
  inject,
  setClassMetadata,
  signal,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵclassMap,
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
  ɵɵnextContext,
  ɵɵpipe,
  ɵɵpipeBind2,
  ɵɵproperty,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIdentity,
  ɵɵresetView,
  ɵɵresolveWindow,
  ɵɵrestoreView,
  ɵɵstyleProp,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1
} from "./chunk-FMXFYYCS.js";

// src/app/profile/components/impressions-popup/impressions-popup.component.ts
var _forTrack0 = ($index, $item) => $item.id;
function ProfileImpressionsPopupComponent_Conditional_0_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 4);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const vm_r1 = \u0275\u0275nextContext();
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.profileInitials(vm_r1.user));
  }
}
function ProfileImpressionsPopupComponent_Conditional_0_Conditional_5_For_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "span");
  }
  if (rf & 2) {
    const \u0275$index_17_r3 = ctx.$index;
    const vm_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("active", \u0275$index_17_r3 === vm_r1.profilePhotoIndex);
  }
}
function ProfileImpressionsPopupComponent_Conditional_0_Conditional_5_For_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 12);
    \u0275\u0275listener("click", function ProfileImpressionsPopupComponent_Conditional_0_Conditional_5_For_5_Template_button_click_0_listener($event) {
      const \u0275$index_22_r5 = \u0275\u0275restoreView(_r4).$index;
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.selectProfilePhoto(\u0275$index_22_r5, $event));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const \u0275$index_22_r5 = ctx.$index;
    \u0275\u0275attribute("aria-label", "Show profile photo " + (\u0275$index_22_r5 + 1));
  }
}
function ProfileImpressionsPopupComponent_Conditional_0_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 8);
    \u0275\u0275repeaterCreate(1, ProfileImpressionsPopupComponent_Conditional_0_Conditional_5_For_2_Template, 1, 2, "span", 9, \u0275\u0275componentInstance().trackProfilePhoto, true);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 10);
    \u0275\u0275repeaterCreate(4, ProfileImpressionsPopupComponent_Conditional_0_Conditional_5_For_5_Template, 1, 1, "button", 11, \u0275\u0275componentInstance().trackProfilePhoto, true);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const vm_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275repeater(vm_r1.profilePhotos);
    \u0275\u0275advance(3);
    \u0275\u0275repeater(vm_r1.profilePhotos);
  }
}
function ProfileImpressionsPopupComponent_Conditional_0_Conditional_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "small");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const vm_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(vm_r1.user.headline || vm_r1.user.statusText);
  }
}
function ProfileImpressionsPopupComponent_Conditional_0_Conditional_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 6)(1, "mat-icon");
    \u0275\u0275text(2, "insights");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "strong");
    \u0275\u0275text(4, "No available data yet");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "span");
    \u0275\u0275text(6, "Impressions appear after real host or attendee activity.");
    \u0275\u0275elementEnd()();
  }
}
function ProfileImpressionsPopupComponent_Conditional_0_Conditional_16_For_33_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 29);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const item_r6 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(item_r6);
  }
}
function ProfileImpressionsPopupComponent_Conditional_0_Conditional_16_Conditional_39_For_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 41);
    \u0275\u0275listener("click", function ProfileImpressionsPopupComponent_Conditional_0_Conditional_16_Conditional_39_For_3_Template_button_click_0_listener() {
      const \u0275$index_127_r8 = \u0275\u0275restoreView(_r7).$index;
      const ctx_r1 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r1.selectHostTrait(\u0275$index_127_r8));
    });
    \u0275\u0275elementStart(1, "span", 42);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span", 43);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "span", 44);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const item_r9 = ctx.$implicit;
    const \u0275$index_127_r8 = ctx.$index;
    const vm_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275classProp("is-active", \u0275$index_127_r8 === vm_r1.hostTraitIndex);
    \u0275\u0275property("ngClass", item_r9.toneClass)("matRippleColor", "rgba(84, 112, 176, 0.16)");
    \u0275\u0275attribute("aria-label", "Open host trait " + item_r9.label);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("#", \u0275$index_127_r8 + 1);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(item_r9.label);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("", item_r9.percent, "%");
  }
}
function ProfileImpressionsPopupComponent_Conditional_0_Conditional_16_Conditional_39_Conditional_4_Conditional_18_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "date");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const trait_r10 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(2, 1, trait_r10.lastRatedAtIso, "MMM d"));
  }
}
function ProfileImpressionsPopupComponent_Conditional_0_Conditional_16_Conditional_39_Conditional_4_For_21_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 52);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const item_r11 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(item_r11);
  }
}
function ProfileImpressionsPopupComponent_Conditional_0_Conditional_16_Conditional_39_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 40)(1, "div", 45)(2, "div", 46)(3, "span", 47)(4, "mat-icon");
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "div")(7, "strong");
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "p");
    \u0275\u0275text(10);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(11, "span", 48);
    \u0275\u0275text(12);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(13, "div", 49);
    \u0275\u0275element(14, "span");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "div", 50)(16, "span");
    \u0275\u0275text(17);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(18, ProfileImpressionsPopupComponent_Conditional_0_Conditional_16_Conditional_39_Conditional_4_Conditional_18_Template, 3, 4, "span");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "div", 51);
    \u0275\u0275repeaterCreate(20, ProfileImpressionsPopupComponent_Conditional_0_Conditional_16_Conditional_39_Conditional_4_For_21_Template, 2, 1, "span", 52, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const trait_r10 = ctx;
    const vm_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275property("ngClass", vm_r1.hostActiveTraitCard.toneClass);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(trait_r10.icon);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(trait_r10.label);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(trait_r10.coreVibe);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("", trait_r10.percent, "%");
    \u0275\u0275advance(2);
    \u0275\u0275styleProp("width", trait_r10.percent, "%");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1("", trait_r10.evidenceCount, " signals");
    \u0275\u0275advance();
    \u0275\u0275conditional(trait_r10.lastRatedAtIso ? 18 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(trait_r10.highlights);
  }
}
function ProfileImpressionsPopupComponent_Conditional_0_Conditional_16_Conditional_39_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 31)(1, "div", 38);
    \u0275\u0275repeaterCreate(2, ProfileImpressionsPopupComponent_Conditional_0_Conditional_16_Conditional_39_For_3_Template, 7, 8, "button", 39, _forTrack0);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(4, ProfileImpressionsPopupComponent_Conditional_0_Conditional_16_Conditional_39_Conditional_4_Template, 22, 9, "div", 40);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_5_0;
    const vm_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(vm_r1.hostTraitCards);
    \u0275\u0275advance(2);
    \u0275\u0275conditional((tmp_5_0 = vm_r1.hostActiveTraitCard) ? 4 : -1, tmp_5_0);
  }
}
function ProfileImpressionsPopupComponent_Conditional_0_Conditional_16_Conditional_40_For_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 52);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const item_r12 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(item_r12);
  }
}
function ProfileImpressionsPopupComponent_Conditional_0_Conditional_16_Conditional_40_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 28);
    \u0275\u0275repeaterCreate(1, ProfileImpressionsPopupComponent_Conditional_0_Conditional_16_Conditional_40_For_2_Template, 2, 1, "span", 52, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const vm_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("impressions-chip-list-updated", vm_r1.pulseFlags.hostChips);
    \u0275\u0275advance();
    \u0275\u0275repeater(vm_r1.hostPersonalityBadgeItems);
  }
}
function ProfileImpressionsPopupComponent_Conditional_0_Conditional_16_For_48_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 34);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const item_r13 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(item_r13);
  }
}
function ProfileImpressionsPopupComponent_Conditional_0_Conditional_16_For_76_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 29);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const item_r14 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(item_r14);
  }
}
function ProfileImpressionsPopupComponent_Conditional_0_Conditional_16_Conditional_82_For_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r15 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 41);
    \u0275\u0275listener("click", function ProfileImpressionsPopupComponent_Conditional_0_Conditional_16_Conditional_82_For_3_Template_button_click_0_listener() {
      const \u0275$index_266_r16 = \u0275\u0275restoreView(_r15).$index;
      const ctx_r1 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r1.selectMemberTrait(\u0275$index_266_r16));
    });
    \u0275\u0275elementStart(1, "span", 42);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span", 43);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "span", 44);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const item_r17 = ctx.$implicit;
    const \u0275$index_266_r16 = ctx.$index;
    const vm_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275classProp("is-active", \u0275$index_266_r16 === vm_r1.memberTraitIndex);
    \u0275\u0275property("ngClass", item_r17.toneClass)("matRippleColor", "rgba(84, 112, 176, 0.16)");
    \u0275\u0275attribute("aria-label", "Open member trait " + item_r17.label);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("#", \u0275$index_266_r16 + 1);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(item_r17.label);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("", item_r17.percent, "%");
  }
}
function ProfileImpressionsPopupComponent_Conditional_0_Conditional_16_Conditional_82_Conditional_4_Conditional_18_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "date");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const trait_r18 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(2, 1, trait_r18.lastRatedAtIso, "MMM d"));
  }
}
function ProfileImpressionsPopupComponent_Conditional_0_Conditional_16_Conditional_82_Conditional_4_For_21_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 52);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const item_r19 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(item_r19);
  }
}
function ProfileImpressionsPopupComponent_Conditional_0_Conditional_16_Conditional_82_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 40)(1, "div", 45)(2, "div", 46)(3, "span", 47)(4, "mat-icon");
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "div")(7, "strong");
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "p");
    \u0275\u0275text(10);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(11, "span", 48);
    \u0275\u0275text(12);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(13, "div", 49);
    \u0275\u0275element(14, "span");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "div", 50)(16, "span");
    \u0275\u0275text(17);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(18, ProfileImpressionsPopupComponent_Conditional_0_Conditional_16_Conditional_82_Conditional_4_Conditional_18_Template, 3, 4, "span");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "div", 51);
    \u0275\u0275repeaterCreate(20, ProfileImpressionsPopupComponent_Conditional_0_Conditional_16_Conditional_82_Conditional_4_For_21_Template, 2, 1, "span", 52, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const trait_r18 = ctx;
    const vm_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275property("ngClass", vm_r1.memberActiveTraitCard.toneClass);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(trait_r18.icon);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(trait_r18.label);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(trait_r18.coreVibe);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("", trait_r18.percent, "%");
    \u0275\u0275advance(2);
    \u0275\u0275styleProp("width", trait_r18.percent, "%");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1("", trait_r18.evidenceCount, " signals");
    \u0275\u0275advance();
    \u0275\u0275conditional(trait_r18.lastRatedAtIso ? 18 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(trait_r18.highlights);
  }
}
function ProfileImpressionsPopupComponent_Conditional_0_Conditional_16_Conditional_82_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 31)(1, "div", 38);
    \u0275\u0275repeaterCreate(2, ProfileImpressionsPopupComponent_Conditional_0_Conditional_16_Conditional_82_For_3_Template, 7, 8, "button", 39, _forTrack0);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(4, ProfileImpressionsPopupComponent_Conditional_0_Conditional_16_Conditional_82_Conditional_4_Template, 22, 9, "div", 40);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_5_0;
    const vm_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(vm_r1.memberTraitCards);
    \u0275\u0275advance(2);
    \u0275\u0275conditional((tmp_5_0 = vm_r1.memberActiveTraitCard) ? 4 : -1, tmp_5_0);
  }
}
function ProfileImpressionsPopupComponent_Conditional_0_Conditional_16_Conditional_83_For_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 52);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const item_r20 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(item_r20);
  }
}
function ProfileImpressionsPopupComponent_Conditional_0_Conditional_16_Conditional_83_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 28);
    \u0275\u0275repeaterCreate(1, ProfileImpressionsPopupComponent_Conditional_0_Conditional_16_Conditional_83_For_2_Template, 2, 1, "span", 52, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const vm_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("impressions-chip-list-updated", vm_r1.pulseFlags.memberChips);
    \u0275\u0275advance();
    \u0275\u0275repeater(vm_r1.memberPersonalityBadgeItems);
  }
}
function ProfileImpressionsPopupComponent_Conditional_0_Conditional_16_For_91_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 34);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const item_r21 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(item_r21);
  }
}
function ProfileImpressionsPopupComponent_Conditional_0_Conditional_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 7)(1, "div", 13)(2, "div", 14)(3, "mat-icon");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "span", 15)(6, "span", 16);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "span", 17);
    \u0275\u0275text(9, "Host");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(10, "div", 18)(11, "span", 19)(12, "span", 20);
    \u0275\u0275text(13, "Rate");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "span", 21);
    \u0275\u0275text(15);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(16, "span", 22)(17, "span", 20);
    \u0275\u0275text(18, "People / Events");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "span", 21);
    \u0275\u0275text(20);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(21, "span", 23)(22, "span", 20);
    \u0275\u0275text(23, "Returnees / NoShow");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(24, "span", 21);
    \u0275\u0275text(25);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(26, "div", 24)(27, "div", 25)(28, "span", 26);
    \u0275\u0275text(29, "Vibe");
    \u0275\u0275elementEnd();
    \u0275\u0275element(30, "span", 27);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(31, "div", 28);
    \u0275\u0275repeaterCreate(32, ProfileImpressionsPopupComponent_Conditional_0_Conditional_16_For_33_Template, 2, 1, "span", 29, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(34, "div", 24)(35, "div", 30)(36, "span", 26);
    \u0275\u0275text(37, "Personality");
    \u0275\u0275elementEnd();
    \u0275\u0275element(38, "span", 27);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(39, ProfileImpressionsPopupComponent_Conditional_0_Conditional_16_Conditional_39_Template, 5, 1, "div", 31)(40, ProfileImpressionsPopupComponent_Conditional_0_Conditional_16_Conditional_40_Template, 3, 2, "div", 32);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(41, "div", 24)(42, "div", 33)(43, "span", 26);
    \u0275\u0275text(44, "Category");
    \u0275\u0275elementEnd();
    \u0275\u0275element(45, "span", 27);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(46, "div", 28);
    \u0275\u0275repeaterCreate(47, ProfileImpressionsPopupComponent_Conditional_0_Conditional_16_For_48_Template, 2, 1, "span", 34, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(49, "div", 35)(50, "div", 36)(51, "mat-icon");
    \u0275\u0275text(52);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(53, "span", 15)(54, "span", 16);
    \u0275\u0275text(55);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(56, "span", 17);
    \u0275\u0275text(57, "Attendee");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(58, "div", 37)(59, "span", 22)(60, "span", 20);
    \u0275\u0275text(61, "People / Events");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(62, "span", 21);
    \u0275\u0275text(63);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(64, "span", 23)(65, "span", 20);
    \u0275\u0275text(66, "Returnees / NoShow");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(67, "span", 21);
    \u0275\u0275text(68);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(69, "div", 24)(70, "div", 25)(71, "span", 26);
    \u0275\u0275text(72, "Vibe");
    \u0275\u0275elementEnd();
    \u0275\u0275element(73, "span", 27);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(74, "div", 28);
    \u0275\u0275repeaterCreate(75, ProfileImpressionsPopupComponent_Conditional_0_Conditional_16_For_76_Template, 2, 1, "span", 29, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(77, "div", 24)(78, "div", 30)(79, "span", 26);
    \u0275\u0275text(80, "Personality");
    \u0275\u0275elementEnd();
    \u0275\u0275element(81, "span", 27);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(82, ProfileImpressionsPopupComponent_Conditional_0_Conditional_16_Conditional_82_Template, 5, 1, "div", 31)(83, ProfileImpressionsPopupComponent_Conditional_0_Conditional_16_Conditional_83_Template, 3, 2, "div", 32);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(84, "div", 24)(85, "div", 33)(86, "span", 26);
    \u0275\u0275text(87, "Category");
    \u0275\u0275elementEnd();
    \u0275\u0275element(88, "span", 27);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(89, "div", 28);
    \u0275\u0275repeaterCreate(90, ProfileImpressionsPopupComponent_Conditional_0_Conditional_16_For_91_Template, 2, 1, "span", 34, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const vm_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("ngClass", vm_r1.hostTierPresentation.toneClass);
    \u0275\u0275advance(2);
    \u0275\u0275classMap(vm_r1.hostTierPresentation.colorClass);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(vm_r1.hostTierPresentation.icon);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(vm_r1.user.hostTier.replace(" Host", ""));
    \u0275\u0275advance(3);
    \u0275\u0275classProp("popup-impressions-badge-updated", vm_r1.pulseFlags.hostTop);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(vm_r1.hostAverageRating);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(vm_r1.hostPeopleMet + " / " + vm_r1.hostTotalEvents);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(vm_r1.hostRepeatSummary + " / " + vm_r1.hostAttendanceNoShowSummary);
    \u0275\u0275advance(6);
    \u0275\u0275classProp("impressions-chip-list-updated", vm_r1.pulseFlags.hostChips);
    \u0275\u0275advance();
    \u0275\u0275repeater(vm_r1.hostVibeBadgeItems);
    \u0275\u0275advance(7);
    \u0275\u0275conditional(vm_r1.hostTraitCards.length > 0 ? 39 : 40);
    \u0275\u0275advance(7);
    \u0275\u0275classProp("impressions-chip-list-updated", vm_r1.pulseFlags.hostChips);
    \u0275\u0275advance();
    \u0275\u0275repeater(vm_r1.hostCategoryBadgeItems);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngClass", vm_r1.traitPresentation.toneClass);
    \u0275\u0275advance(2);
    \u0275\u0275classMap(vm_r1.traitPresentation.colorClass);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(vm_r1.traitPresentation.icon);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(vm_r1.memberImpressionTitle.replace(" Attendee", ""));
    \u0275\u0275advance(3);
    \u0275\u0275classProp("popup-impressions-badge-updated", vm_r1.pulseFlags.memberTop);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(vm_r1.memberPeopleMet + " / " + vm_r1.memberTotalEvents);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(vm_r1.memberReturneesSummary + " / " + vm_r1.memberNoShowCount);
    \u0275\u0275advance(6);
    \u0275\u0275classProp("impressions-chip-list-updated", vm_r1.pulseFlags.memberChips);
    \u0275\u0275advance();
    \u0275\u0275repeater(vm_r1.memberVibeBadgeItems);
    \u0275\u0275advance(7);
    \u0275\u0275conditional(vm_r1.memberTraitCards.length > 0 ? 82 : 83);
    \u0275\u0275advance(7);
    \u0275\u0275classProp("impressions-chip-list-updated", vm_r1.pulseFlags.memberChips);
    \u0275\u0275advance();
    \u0275\u0275repeater(vm_r1.memberCategoryBadgeItems);
  }
}
function ProfileImpressionsPopupComponent_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "app-popup", 0)(1, "div", 1)(2, "section", 2)(3, "article", 3);
    \u0275\u0275conditionalCreate(4, ProfileImpressionsPopupComponent_Conditional_0_Conditional_4_Template, 2, 1, "span", 4);
    \u0275\u0275conditionalCreate(5, ProfileImpressionsPopupComponent_Conditional_0_Conditional_5_Template, 6, 0);
    \u0275\u0275elementStart(6, "div", 5)(7, "h3");
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "p")(10, "mat-icon");
    \u0275\u0275text(11, "location_on");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "span");
    \u0275\u0275text(13);
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(14, ProfileImpressionsPopupComponent_Conditional_0_Conditional_14_Template, 2, 1, "small");
    \u0275\u0275elementEnd()()();
    \u0275\u0275conditionalCreate(15, ProfileImpressionsPopupComponent_Conditional_0_Conditional_15_Template, 7, 0, "div", 6)(16, ProfileImpressionsPopupComponent_Conditional_0_Conditional_16_Template, 92, 29, "div", 7);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const vm_r1 = ctx;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("model", ctx_r1.impressionsPopupModel(vm_r1))("zIndex", ctx_r1.impressionsPopupZIndex());
    \u0275\u0275advance(3);
    \u0275\u0275styleProp("background-image", vm_r1.activeProfilePhoto ? "url(" + vm_r1.activeProfilePhoto + ")" : null);
    \u0275\u0275classProp("has-photo", !!vm_r1.activeProfilePhoto);
    \u0275\u0275property("ngClass", ctx_r1.profileAvatarClass(vm_r1.user));
    \u0275\u0275advance();
    \u0275\u0275conditional(!vm_r1.activeProfilePhoto ? 4 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(vm_r1.profilePhotos.length > 1 ? 5 : -1);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r1.displayTitle(vm_r1.user));
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(vm_r1.user.city || "City not set yet");
    \u0275\u0275advance();
    \u0275\u0275conditional(vm_r1.user.headline || vm_r1.user.statusText ? 14 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(!vm_r1.hasAvailableData ? 15 : 16);
  }
}
var ProfileImpressionsPopupComponent = class _ProfileImpressionsPopupComponent {
  static PULSE_DURATION_MS = 460;
  static DEFAULT_PULSE_FLAGS = {
    hostTop: false,
    memberTop: false,
    hostChips: false,
    memberChips: false
  };
  userProfileStore = inject(UserProfileStore);
  profileStore = inject(ProfileStore);
  personalityTraitCatalog = APP_STATIC_DATA.personalityTraitCatalog;
  pulseFlagsRef = signal(__spreadValues({}, _ProfileImpressionsPopupComponent.DEFAULT_PULSE_FLAGS), ...ngDevMode ? [{ debugName: "pulseFlagsRef" }] : (
    /* istanbul ignore next */
    []
  ));
  hostTraitIndexRef = signal(0, ...ngDevMode ? [{ debugName: "hostTraitIndexRef" }] : (
    /* istanbul ignore next */
    []
  ));
  memberTraitIndexRef = signal(0, ...ngDevMode ? [{ debugName: "memberTraitIndexRef" }] : (
    /* istanbul ignore next */
    []
  ));
  profilePhotoIndexRef = signal(0, ...ngDevMode ? [{ debugName: "profilePhotoIndexRef" }] : (
    /* istanbul ignore next */
    []
  ));
  lastPopupOpen = false;
  lastTrackedUserId = "";
  lastTrackedImpressions = null;
  pulseTimers = {};
  popupOpen = this.profileStore.impressionsPopupOpen;
  viewModel = computed(() => {
    const selectedUserId = this.profileStore.impressionsPopupUserId().trim() || this.userProfileStore.activeUserId().trim();
    const user = selectedUserId ? this.userProfileStore.getUserProfile(selectedUserId) ?? (selectedUserId === this.userProfileStore.activeUserId().trim() ? this.userProfileStore.activeUserProfile() : null) : null;
    if (!user) {
      return null;
    }
    const hasAvailableData = this.hasUserImpressionsData(user);
    const hostTraitCards = hasAvailableData ? this.resolveTraitCards(user, "host") : [];
    const memberTraitCards = hasAvailableData ? this.resolveTraitCards(user, "member") : [];
    const hostTraitIndex = this.normalizeTraitIndex(this.hostTraitIndexRef(), hostTraitCards.length);
    const memberTraitIndex = this.normalizeTraitIndex(this.memberTraitIndexRef(), memberTraitCards.length);
    const profilePhotos = this.profilePhotos(user);
    const profilePhotoIndex = this.normalizeTraitIndex(this.profilePhotoIndexRef(), profilePhotos.length);
    const hostTierPresentation = resolveSideMenuPresentation("hostTier", user.hostTier);
    const traitPresentation = resolveSideMenuPresentation("trait", user.traitLabel ?? "");
    return {
      user,
      profilePhotos,
      activeProfilePhoto: profilePhotos[profilePhotoIndex] ?? "",
      profilePhotoIndex,
      hasAvailableData,
      pulseFlags: this.pulseFlagsRef(),
      hostTierPresentation,
      traitPresentation,
      memberImpressionTitle: traitPresentation.memberTitle ?? "Attendee",
      hostAverageRating: this.resolveHostAverageRating(user),
      hostTotalEvents: this.resolveHostTotalEvents(user),
      hostPeopleMet: this.resolveHostPeopleMet(user),
      hostRepeatSummary: this.resolveHostRepeatSummary(user),
      hostAttendanceNoShowSummary: this.resolveHostAttendanceNoShowSummary(user),
      hostVibeBadgeItems: this.resolveHostVibeBadgeItems(user),
      hostTraitCards,
      hostTraitIndex,
      hostActiveTraitCard: hostTraitCards[hostTraitIndex] ?? null,
      hostPersonalityBadgeItems: this.resolveHostPersonalityBadgeItems(user),
      hostCategoryBadgeItems: this.resolveHostCategoryBadgeItems(user),
      memberTotalEvents: this.resolveMemberTotalEvents(user),
      memberPeopleMet: this.resolveMemberPeopleMet(user),
      memberReturneesSummary: this.resolveMemberReturneesSummary(user),
      memberNoShowCount: this.resolveMemberNoShowCount(user),
      memberVibeBadgeItems: this.resolveMemberVibeBadgeItems(user),
      memberTraitCards,
      memberTraitIndex,
      memberActiveTraitCard: memberTraitCards[memberTraitIndex] ?? null,
      memberPersonalityBadgeItems: this.resolveMemberPersonalityBadgeItems(user),
      memberCategoryBadgeItems: this.resolveMemberCategoryBadgeItems(user)
    };
  }, ...ngDevMode ? [{ debugName: "viewModel" }] : (
    /* istanbul ignore next */
    []
  ));
  impressionsPopupModel(vm) {
    const context = this.profileStore.impressionsPopupContext();
    const contextLabel = `${context?.contextLabel ?? ""}`.trim();
    const sourceLabel = `${context?.sourceLabel ?? ""}`.trim();
    const title = contextLabel ? `${this.displayTitle(vm.user)} \xB7 ${contextLabel}` : `${this.displayTitle(vm.user)} \xB7 Impressions`;
    return {
      title,
      subtitle: sourceLabel || null,
      ariaLabel: title,
      closeAriaLabel: "Close",
      translateTitle: false,
      translateSubtitle: false,
      size: "wide",
      height: "auto",
      headerTone: "accent",
      onClose: () => this.closePopup()
    };
  }
  impressionsPopupZIndex() {
    return 2640;
  }
  displayTitle(user) {
    const name = `${user.name ?? ""}`.trim() || "Profile";
    return user.age > 0 ? `${name}, ${user.age}` : name;
  }
  profileInitials(user) {
    const source = `${user.initials ?? ""}`.trim() || `${user.name ?? ""}`.trim() || "Profile";
    return AppUtils.initialsFromText(source);
  }
  profileAvatarClass(user) {
    return [`user-color-${user.gender === "woman" ? "woman" : "man"}`];
  }
  selectProfilePhoto(index, event) {
    event.stopPropagation();
    const photos = this.viewModel()?.profilePhotos ?? [];
    if (photos.length <= 1) {
      return;
    }
    this.profilePhotoIndexRef.set(Math.max(0, Math.min(index, photos.length - 1)));
  }
  trackProfilePhoto(index, photo) {
    return `${index}:${photo}`;
  }
  constructor() {
    effect(() => {
      const isOpen = this.popupOpen();
      const selectedUserId = this.profileStore.impressionsPopupUserId().trim() || this.userProfileStore.activeUserId().trim();
      const user = selectedUserId ? this.userProfileStore.getUserProfile(selectedUserId) ?? (selectedUserId === this.userProfileStore.activeUserId().trim() ? this.userProfileStore.activeUserProfile() : null) : null;
      const userId = user?.id.trim() ?? selectedUserId;
      const currentImpressions = userId ? this.userProfileStore.getUserImpressions(userId) ?? user?.impressions ?? null : null;
      if (!isOpen || !userId) {
        if (this.lastPopupOpen && this.lastTrackedUserId) {
          this.finalizePopupSession(this.lastTrackedUserId);
        }
        this.lastPopupOpen = false;
        this.lastTrackedUserId = userId;
        this.lastTrackedImpressions = this.cloneImpressions(currentImpressions);
        this.resetTraitCarouselIndices();
        this.resetPulseFlags();
        return;
      }
      if (!this.lastPopupOpen || this.lastTrackedUserId !== userId) {
        if (this.lastPopupOpen && this.lastTrackedUserId && this.lastTrackedUserId !== userId) {
          this.finalizePopupSession(this.lastTrackedUserId);
        }
        this.lastPopupOpen = true;
        this.lastTrackedUserId = userId;
        this.lastTrackedImpressions = this.cloneImpressions(currentImpressions);
        this.resetTraitCarouselIndices();
        this.resetPulseFlags();
        return;
      }
      const previous = this.lastTrackedImpressions;
      const nextHost = currentImpressions?.host;
      const nextMember = currentImpressions?.member;
      if (this.hasImpressionsTopMetricsChanged(previous?.host, nextHost)) {
        this.triggerPulse("hostTop");
      }
      if (this.hasImpressionsTopMetricsChanged(previous?.member, nextMember)) {
        this.triggerPulse("memberTop");
      }
      if (this.hasImpressionsChipListsChanged(previous?.host, nextHost)) {
        this.triggerPulse("hostChips");
      }
      if (this.hasImpressionsChipListsChanged(previous?.member, nextMember)) {
        this.triggerPulse("memberChips");
      }
      this.lastPopupOpen = true;
      this.lastTrackedUserId = userId;
      this.lastTrackedImpressions = this.cloneImpressions(currentImpressions);
    });
  }
  onWindowEscape(event) {
    if (!this.popupOpen()) {
      return;
    }
    event.stopPropagation();
    this.closePopup();
  }
  closePopup() {
    const userId = this.profileStore.impressionsPopupUserId().trim() || this.userProfileStore.activeUserId().trim();
    this.userProfileStore.markUserRealtimeImpressionsClosed(userId);
    this.profileStore.closeImpressionsPopup();
  }
  ngOnDestroy() {
    this.clearPulseTimers();
  }
  hasUserImpressionsData(user) {
    return this.hasImpressionsData(this.userProfileStore.getUserImpressions(user.id) ?? user.impressions);
  }
  hasImpressionsData(impressions) {
    return this.hasImpressionsSectionData(impressions?.host) || this.hasImpressionsSectionData(impressions?.member);
  }
  hasImpressionsSectionData(section) {
    if (!section) {
      return false;
    }
    const hasPositiveMetric = [
      section.averageRating,
      section.peopleMet,
      section.totalEvents,
      section.repeatCount,
      section.noShowCount
    ].some((value) => Number.isFinite(value) && Number(value) > 0);
    const hasBadges = [
      section.vibeBadges,
      section.personalityBadges,
      section.categoryBadges
    ].some((items) => (items ?? []).some((item) => item.trim().length > 0));
    const hasTraits = (section.personalityTraits ?? []).some((trait) => `${trait.id ?? trait.label ?? ""}`.trim().length > 0 && (Number.isFinite(trait.percent) && Number(trait.percent) > 0 || Number.isFinite(trait.evidenceCount) && Number(trait.evidenceCount) > 0));
    return hasPositiveMetric || hasBadges || hasTraits;
  }
  selectHostTrait(index) {
    const vm = this.viewModel();
    if (!vm || index < 0 || index >= vm.hostTraitCards.length) {
      return;
    }
    this.hostTraitIndexRef.set(index);
  }
  selectMemberTrait(index) {
    const vm = this.viewModel();
    if (!vm || index < 0 || index >= vm.memberTraitCards.length) {
      return;
    }
    this.memberTraitIndexRef.set(index);
  }
  activeUserImpressionsSection(user, kind) {
    const impressions = this.userProfileStore.getUserImpressions(user.id) ?? user.impressions ?? null;
    if (!impressions) {
      return null;
    }
    return impressions[kind] ?? null;
  }
  finalizePopupSession(userId) {
    this.userProfileStore.clearUserImpressionChangeFlags(userId);
    const current = this.userProfileStore.getUserImpressions(userId);
    if (current) {
      this.userProfileStore.setUserImpressions(userId, __spreadProps(__spreadValues({}, current), {
        host: current.host ? __spreadProps(__spreadValues({}, current.host), {
          unreadCount: 0
        }) : void 0,
        member: current.member ? __spreadProps(__spreadValues({}, current.member), {
          unreadCount: 0
        }) : void 0
      }));
    }
  }
  resetPulseFlags() {
    this.clearPulseTimers();
    this.pulseFlagsRef.set(__spreadValues({}, _ProfileImpressionsPopupComponent.DEFAULT_PULSE_FLAGS));
  }
  resetTraitCarouselIndices() {
    this.hostTraitIndexRef.set(0);
    this.memberTraitIndexRef.set(0);
    this.profilePhotoIndexRef.set(0);
  }
  profilePhotos(user) {
    return [...new Set((Array.isArray(user.images) ? user.images : []).map((image) => `${image ?? ""}`.trim()).filter(Boolean))];
  }
  clearPulseTimers() {
    for (const timer of Object.values(this.pulseTimers)) {
      if (timer) {
        clearTimeout(timer);
      }
    }
    for (const key of Object.keys(this.pulseTimers)) {
      delete this.pulseTimers[key];
    }
  }
  triggerPulse(key) {
    this.pulseFlagsRef.update((state) => __spreadProps(__spreadValues({}, state), {
      [key]: true
    }));
    const existingTimer = this.pulseTimers[key];
    if (existingTimer) {
      clearTimeout(existingTimer);
    }
    this.pulseTimers[key] = setTimeout(() => {
      this.pulseFlagsRef.update((state) => __spreadProps(__spreadValues({}, state), {
        [key]: false
      }));
      delete this.pulseTimers[key];
    }, _ProfileImpressionsPopupComponent.PULSE_DURATION_MS);
  }
  cloneImpressions(impressions) {
    if (!impressions) {
      return null;
    }
    return {
      host: impressions.host ? __spreadProps(__spreadValues({}, impressions.host), {
        vibeBadges: [...impressions.host.vibeBadges ?? []],
        personalityBadges: [...impressions.host.personalityBadges ?? []],
        personalityTraits: (impressions.host.personalityTraits ?? []).map((trait) => __spreadValues({}, trait)),
        categoryBadges: [...impressions.host.categoryBadges ?? []]
      }) : void 0,
      member: impressions.member ? __spreadProps(__spreadValues({}, impressions.member), {
        vibeBadges: [...impressions.member.vibeBadges ?? []],
        personalityBadges: [...impressions.member.personalityBadges ?? []],
        personalityTraits: (impressions.member.personalityTraits ?? []).map((trait) => __spreadValues({}, trait)),
        categoryBadges: [...impressions.member.categoryBadges ?? []]
      }) : void 0
    };
  }
  impressionSectionMetric(value) {
    if (!Number.isFinite(value)) {
      return null;
    }
    return Math.max(0, Math.trunc(Number(value)));
  }
  impressionSectionRating(value) {
    if (!Number.isFinite(value)) {
      return null;
    }
    return AppUtils.clampNumber(Number(value), 0, 5);
  }
  impressionSectionBadgeList(items) {
    if (!Array.isArray(items)) {
      return null;
    }
    const normalized = items.map((item) => item.trim()).filter((item) => item.length > 0);
    return normalized.length > 0 ? normalized : null;
  }
  sortImpressionsBadgeItems(items) {
    const parsed = items.map((item) => this.parseImpressionsBadgeItem(item));
    parsed.sort((left, right) => {
      if (left.percent !== null && right.percent !== null && left.percent !== right.percent) {
        return right.percent - left.percent;
      }
      if (left.percent !== null && right.percent === null) {
        return -1;
      }
      if (left.percent === null && right.percent !== null) {
        return 1;
      }
      return left.label.localeCompare(right.label);
    });
    return parsed.map((entry) => entry.original);
  }
  parseImpressionsBadgeItem(item) {
    const original = item.trim();
    const percentMatch = original.match(/^(.*?)(\d{1,3})%$/);
    if (!percentMatch) {
      return {
        original,
        label: original.toLowerCase(),
        percent: null
      };
    }
    return {
      original,
      label: percentMatch[1].trim().toLowerCase(),
      percent: Math.max(0, Math.min(100, Number.parseInt(percentMatch[2], 10) || 0))
    };
  }
  normalizeTraitIndex(index, length) {
    if (length <= 0) {
      return 0;
    }
    return Math.max(0, Math.min(length - 1, Math.trunc(Number(index) || 0)));
  }
  resolveTraitCards(user, kind) {
    const section = this.activeUserImpressionsSection(user, kind);
    const cardsById = /* @__PURE__ */ new Map();
    for (const trait of section?.personalityTraits ?? []) {
      const card = this.resolveTraitCard(trait.id ?? trait.label ?? "", trait.label ?? "");
      if (!card) {
        continue;
      }
      const nextCard = __spreadProps(__spreadValues({}, card), {
        percent: Math.max(0, Math.trunc(Number(trait.percent) || 0)),
        evidenceCount: Math.max(0, Math.trunc(Number(trait.evidenceCount) || 0)),
        lastRatedAtIso: trait.lastRatedAtIso?.trim() || null
      });
      const existing = cardsById.get(nextCard.id);
      if (!existing || this.sortResolvedTraitCards(nextCard, existing) < 0) {
        cardsById.set(nextCard.id, nextCard);
      }
    }
    return [...cardsById.values()].sort((left, right) => this.sortResolvedTraitCards(left, right)).slice(0, 3);
  }
  resolveTraitCard(traitKey, fallbackLabel) {
    const normalizedKey = `${traitKey ?? ""}`.trim().toLowerCase();
    const normalizedLabel = `${fallbackLabel ?? ""}`.trim().toLowerCase();
    const match = this.personalityTraitCatalog.find((trait) => trait.id === normalizedKey || trait.label.toLowerCase() === normalizedKey || trait.label.toLowerCase() === normalizedLabel || trait.aliases.some((alias) => alias.toLowerCase() === normalizedKey || alias.toLowerCase() === normalizedLabel));
    if (!match) {
      return null;
    }
    return {
      id: match.id,
      label: match.label,
      icon: match.icon,
      coreVibe: match.coreVibe,
      highlights: [...match.highlights],
      percent: 0,
      evidenceCount: 0,
      lastRatedAtIso: null,
      toneClass: match.toneClass
    };
  }
  resolveHostAverageRating(user) {
    const loaded = this.impressionSectionRating(this.activeUserImpressionsSection(user, "host")?.averageRating);
    if (loaded !== null) {
      return loaded.toFixed(1);
    }
    return "0.0";
  }
  resolveHostTotalEvents(user) {
    const loaded = this.impressionSectionMetric(this.activeUserImpressionsSection(user, "host")?.totalEvents);
    if (loaded !== null) {
      return loaded;
    }
    return 0;
  }
  resolveHostAttendanceNoShowSummary(user) {
    const loaded = this.impressionSectionMetric(this.activeUserImpressionsSection(user, "host")?.noShowCount);
    if (loaded !== null) {
      return `${loaded}`;
    }
    return "0";
  }
  resolveHostRepeatSummary(user) {
    const loaded = this.impressionSectionMetric(this.activeUserImpressionsSection(user, "host")?.repeatCount);
    if (loaded !== null) {
      return `${loaded}`;
    }
    return "0";
  }
  resolveHostPeopleMet(user) {
    const loaded = this.impressionSectionMetric(this.activeUserImpressionsSection(user, "host")?.peopleMet);
    if (loaded !== null) {
      return loaded;
    }
    return 0;
  }
  resolveHostVibeBadgeItems(user) {
    const loaded = this.impressionSectionBadgeList(this.activeUserImpressionsSection(user, "host")?.vibeBadges);
    if (loaded) {
      return this.sortImpressionsBadgeItems(loaded);
    }
    return [];
  }
  resolveHostPersonalityBadgeItems(user) {
    const traitCards = this.resolveTraitCards(user, "host");
    if (traitCards.length > 0) {
      return traitCards.map((trait) => `${trait.label} ${trait.percent}%`);
    }
    const loaded = this.impressionSectionBadgeList(this.activeUserImpressionsSection(user, "host")?.personalityBadges);
    if (loaded) {
      return this.sortImpressionsBadgeItems(loaded);
    }
    return [];
  }
  resolveHostCategoryBadgeItems(user) {
    const loaded = this.impressionSectionBadgeList(this.activeUserImpressionsSection(user, "host")?.categoryBadges);
    if (loaded) {
      return this.sortImpressionsBadgeItems(loaded);
    }
    return [];
  }
  resolveMemberTotalEvents(user) {
    const loaded = this.impressionSectionMetric(this.activeUserImpressionsSection(user, "member")?.totalEvents);
    if (loaded !== null) {
      return loaded;
    }
    return 0;
  }
  resolveMemberNoShowCount(user) {
    const loaded = this.impressionSectionMetric(this.activeUserImpressionsSection(user, "member")?.noShowCount);
    if (loaded !== null) {
      return loaded;
    }
    return 0;
  }
  resolveMemberPeopleMet(user) {
    const loaded = this.impressionSectionMetric(this.activeUserImpressionsSection(user, "member")?.peopleMet);
    if (loaded !== null) {
      return loaded;
    }
    return 0;
  }
  resolveMemberReturneesSummary(user) {
    const loaded = this.impressionSectionMetric(this.activeUserImpressionsSection(user, "member")?.repeatCount);
    if (loaded !== null) {
      return `${loaded}`;
    }
    return "0";
  }
  resolveMemberVibeBadgeItems(user) {
    const loaded = this.impressionSectionBadgeList(this.activeUserImpressionsSection(user, "member")?.vibeBadges);
    if (loaded) {
      return this.sortImpressionsBadgeItems(loaded);
    }
    return [];
  }
  resolveMemberPersonalityBadgeItems(user) {
    const traitCards = this.resolveTraitCards(user, "member");
    if (traitCards.length > 0) {
      return traitCards.map((trait) => `${trait.label} ${trait.percent}%`);
    }
    const loaded = this.impressionSectionBadgeList(this.activeUserImpressionsSection(user, "member")?.personalityBadges);
    if (loaded) {
      return this.sortImpressionsBadgeItems(loaded);
    }
    return [];
  }
  resolveMemberCategoryBadgeItems(user) {
    const loaded = this.impressionSectionBadgeList(this.activeUserImpressionsSection(user, "member")?.categoryBadges);
    if (loaded) {
      return this.sortImpressionsBadgeItems(loaded);
    }
    return [];
  }
  hasImpressionsTopMetricsChanged(previous, next) {
    if (!next) {
      return false;
    }
    if (!previous) {
      return true;
    }
    return (this.impressionSectionRating(previous.averageRating) ?? -1) !== (this.impressionSectionRating(next.averageRating) ?? -1) || (this.impressionSectionMetric(previous.peopleMet) ?? -1) !== (this.impressionSectionMetric(next.peopleMet) ?? -1) || (this.impressionSectionMetric(previous.totalEvents) ?? -1) !== (this.impressionSectionMetric(next.totalEvents) ?? -1) || (this.impressionSectionMetric(previous.repeatCount) ?? -1) !== (this.impressionSectionMetric(next.repeatCount) ?? -1) || (this.impressionSectionMetric(previous.noShowCount) ?? -1) !== (this.impressionSectionMetric(next.noShowCount) ?? -1);
  }
  hasImpressionsChipListsChanged(previous, next) {
    if (!next) {
      return false;
    }
    if (!previous) {
      return true;
    }
    return JSON.stringify(this.sortImpressionsBadgeItems(previous.vibeBadges ?? [])) !== JSON.stringify(this.sortImpressionsBadgeItems(next.vibeBadges ?? [])) || JSON.stringify(this.normalizeImpressionTraits(previous.personalityTraits)) !== JSON.stringify(this.normalizeImpressionTraits(next.personalityTraits)) || JSON.stringify(this.sortImpressionsBadgeItems(previous.personalityBadges ?? [])) !== JSON.stringify(this.sortImpressionsBadgeItems(next.personalityBadges ?? [])) || JSON.stringify(this.sortImpressionsBadgeItems(previous.categoryBadges ?? [])) !== JSON.stringify(this.sortImpressionsBadgeItems(next.categoryBadges ?? []));
  }
  normalizeImpressionTraits(traits) {
    return [...traits ?? []].map((trait) => ({
      id: this.resolveTraitIdentity(trait.id ?? "", trait.label ?? ""),
      percent: Math.max(0, Math.trunc(Number(trait.percent) || 0)),
      evidenceCount: Math.max(0, Math.trunc(Number(trait.evidenceCount) || 0)),
      lastRatedAtIso: trait.lastRatedAtIso?.trim() || null
    })).filter((trait) => trait.id.length > 0).sort((left, right) => this.sortResolvedTraitCards({
      label: left.id,
      percent: left.percent,
      evidenceCount: left.evidenceCount,
      lastRatedAtIso: left.lastRatedAtIso
    }, {
      label: right.id,
      percent: right.percent,
      evidenceCount: right.evidenceCount,
      lastRatedAtIso: right.lastRatedAtIso
    }));
  }
  resolveTraitIdentity(traitId, traitLabel) {
    return this.resolveTraitCard(traitId, traitLabel)?.id ?? `${traitId ?? traitLabel ?? ""}`.trim();
  }
  sortResolvedTraitCards(left, right) {
    if (left.percent !== right.percent) {
      return right.percent - left.percent;
    }
    if (left.evidenceCount !== right.evidenceCount) {
      return right.evidenceCount - left.evidenceCount;
    }
    const leftRatedAt = this.toSortableIsoDate(left.lastRatedAtIso);
    const rightRatedAt = this.toSortableIsoDate(right.lastRatedAtIso);
    if (leftRatedAt !== rightRatedAt) {
      return rightRatedAt - leftRatedAt;
    }
    return left.label.localeCompare(right.label);
  }
  toSortableIsoDate(value) {
    const parsed = Date.parse(value?.trim() ?? "");
    return Number.isFinite(parsed) ? parsed : 0;
  }
  static \u0275fac = function ProfileImpressionsPopupComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ProfileImpressionsPopupComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ProfileImpressionsPopupComponent, selectors: [["app-profile-impressions-popup"]], hostBindings: function ProfileImpressionsPopupComponent_HostBindings(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275listener("keydown.escape", function ProfileImpressionsPopupComponent_keydown_escape_HostBindingHandler($event) {
        return ctx.onWindowEscape($event);
      }, \u0275\u0275resolveWindow);
    }
  }, decls: 1, vars: 1, consts: [[3, "model", "zIndex"], [1, "profile-impressions-popup"], [1, "profile-impressions-person-stage"], [1, "profile-impressions-person-card", 3, "ngClass"], [1, "profile-impressions-person-initials"], [1, "profile-impressions-person-overlay"], [1, "profile-impressions-empty-state"], [1, "social-proof-grid"], ["aria-hidden", "true", 1, "profile-impressions-person-indicators"], [3, "active"], [1, "profile-impressions-person-hit-area"], ["type", "button"], ["type", "button", 3, "click"], [1, "editor-list-card", "social-proof-card", "social-proof-card-modern", "social-proof-card-host", 3, "ngClass"], [1, "social-proof-identity-pill", "social-proof-identity-pill-host"], [1, "social-proof-identity-label"], [1, "social-proof-identity-main"], [1, "social-proof-identity-sub"], [1, "popup-impressions-badge", "popup-impressions-badge-host"], [1, "popup-impressions-badge-segment", "popup-impressions-rate-rate"], [1, "popup-impressions-badge-label"], [1, "popup-impressions-badge-value"], [1, "popup-impressions-badge-segment", "popup-impressions-rate-people"], [1, "popup-impressions-badge-segment", "popup-impressions-rate-return"], [1, "social-proof-section-block"], [1, "social-proof-section-head", "section-vibe"], [1, "section-tag"], [1, "section-line"], [1, "social-proof-chip-list"], [1, "social-proof-chip", "chip-vibe"], [1, "social-proof-section-head", "section-personality"], [1, "personality-trait-carousel"], [1, "social-proof-chip-list", 3, "impressions-chip-list-updated"], [1, "social-proof-section-head", "section-category"], [1, "social-proof-chip", "chip-category"], [1, "editor-list-card", "social-proof-card", "social-proof-card-modern", "social-proof-card-member", 3, "ngClass"], [1, "social-proof-identity-pill", "social-proof-identity-pill-member"], [1, "popup-impressions-badge", "popup-impressions-badge-member"], [1, "personality-trait-pill-strip"], ["type", "button", "matRipple", "", 1, "personality-trait-pill", 3, "is-active", "ngClass", "matRippleColor"], [1, "personality-trait-card", 3, "ngClass"], ["type", "button", "matRipple", "", 1, "personality-trait-pill", 3, "click", "ngClass", "matRippleColor"], [1, "personality-trait-pill-rank"], [1, "personality-trait-pill-label"], [1, "personality-trait-pill-percent"], [1, "personality-trait-card-head"], [1, "personality-trait-card-title"], [1, "personality-trait-card-icon"], [1, "personality-trait-card-percent"], [1, "personality-trait-card-bar"], [1, "personality-trait-card-meta"], [1, "personality-trait-card-highlights"], [1, "social-proof-chip", "chip-personality"]], template: function ProfileImpressionsPopupComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275conditionalCreate(0, ProfileImpressionsPopupComponent_Conditional_0_Template, 17, 13, "app-popup", 0);
    }
    if (rf & 2) {
      let tmp_0_0;
      \u0275\u0275conditional((tmp_0_0 = ctx.popupOpen() && ctx.viewModel()) ? 0 : -1, tmp_0_0);
    }
  }, dependencies: [CommonModule, NgClass, MatIconModule, MatIcon, MatRippleModule, MatRipple, PopupComponent, DatePipe], styles: ['\n[_nghost-%COMP%] {\n  display: contents;\n}\n.profile-impressions-popup[_ngcontent-%COMP%] {\n  width: 100%;\n  min-height: 0;\n  box-sizing: border-box;\n  padding: 0.35rem;\n  font-family:\n    "Nunito Sans",\n    "Segoe UI",\n    sans-serif;\n  text-align: left;\n}\n.profile-impressions-popup[_ngcontent-%COMP%]   .profile-impressions-person-stage[_ngcontent-%COMP%] {\n  display: grid;\n  place-items: center;\n  width: 100%;\n  margin: 0 auto 0.9rem;\n}\n.profile-impressions-popup[_ngcontent-%COMP%]   .profile-impressions-person-card[_ngcontent-%COMP%] {\n  position: relative;\n  width: min(330px, 100%);\n  aspect-ratio: 3/4;\n  min-height: 0;\n  overflow: hidden;\n  isolation: isolate;\n  border: 1px solid rgba(22, 42, 72, 0.24);\n  border-radius: 14px;\n  background-color: #13243a;\n  background-position: center;\n  background-size: cover;\n  box-shadow: 0 18px 42px rgba(18, 32, 54, 0.22);\n}\n.profile-impressions-popup[_ngcontent-%COMP%]   .profile-impressions-person-card[_ngcontent-%COMP%]::after {\n  content: "";\n  position: absolute;\n  inset: 0;\n  z-index: 1;\n  pointer-events: none;\n  background:\n    linear-gradient(\n      180deg,\n      rgba(8, 16, 28, 0.16) 0%,\n      rgba(8, 15, 28, 0.12) 42%,\n      rgba(8, 15, 28, 0.86) 100%),\n    radial-gradient(\n      circle at 50% 18%,\n      rgba(255, 255, 255, 0.12),\n      transparent 44%);\n}\n.profile-impressions-popup[_ngcontent-%COMP%]   .profile-impressions-person-initials[_ngcontent-%COMP%] {\n  position: absolute;\n  inset: 0;\n  display: grid;\n  place-items: center;\n  color: rgba(255, 255, 255, 0.92);\n  font-size: 3rem;\n  font-weight: 950;\n  letter-spacing: 0;\n}\n.profile-impressions-popup[_ngcontent-%COMP%]   .profile-impressions-person-indicators[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 0.42rem;\n  left: 0.48rem;\n  right: 0.48rem;\n  z-index: 4;\n  display: grid;\n  grid-auto-flow: column;\n  grid-auto-columns: 1fr;\n  gap: 0.22rem;\n}\n.profile-impressions-popup[_ngcontent-%COMP%]   .profile-impressions-person-indicators[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  position: relative;\n  height: 4px;\n  overflow: hidden;\n  border-radius: 999px;\n  background: rgba(255, 255, 255, 0.36);\n  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.18);\n}\n.profile-impressions-popup[_ngcontent-%COMP%]   .profile-impressions-person-indicators[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]::after {\n  content: "";\n  position: absolute;\n  inset: 0;\n  opacity: 0;\n  background: #fff;\n  transform: scaleX(0.12);\n  transform-origin: left center;\n}\n.profile-impressions-popup[_ngcontent-%COMP%]   .profile-impressions-person-indicators[_ngcontent-%COMP%]   span.active[_ngcontent-%COMP%]::after {\n  opacity: 1;\n  transform: scaleX(1);\n}\n.profile-impressions-popup[_ngcontent-%COMP%]   .profile-impressions-person-hit-area[_ngcontent-%COMP%] {\n  position: absolute;\n  inset: 0;\n  z-index: 3;\n  display: grid;\n  grid-auto-flow: column;\n  grid-auto-columns: 1fr;\n}\n.profile-impressions-popup[_ngcontent-%COMP%]   .profile-impressions-person-hit-area[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] {\n  padding: 0;\n  border: 0;\n  background: transparent;\n  cursor: pointer;\n}\n.profile-impressions-popup[_ngcontent-%COMP%]   .profile-impressions-person-overlay[_ngcontent-%COMP%] {\n  position: absolute;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  z-index: 5;\n  padding: 1rem;\n  color: #fff;\n}\n.profile-impressions-popup[_ngcontent-%COMP%]   .profile-impressions-person-overlay[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 1.1rem;\n  font-weight: 950;\n  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.42);\n}\n.profile-impressions-popup[_ngcontent-%COMP%]   .profile-impressions-person-overlay[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.22rem;\n  margin: 0.24rem 0 0;\n  color: rgba(255, 255, 255, 0.94);\n  font-size: 0.84rem;\n  font-weight: 850;\n  text-shadow: 0 1px 6px rgba(0, 0, 0, 0.42);\n}\n.profile-impressions-popup[_ngcontent-%COMP%]   .profile-impressions-person-overlay[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 18px;\n  height: 18px;\n  font-size: 18px;\n  line-height: 18px;\n}\n.profile-impressions-popup[_ngcontent-%COMP%]   .profile-impressions-person-overlay[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n  display: block;\n  margin-top: 0.42rem;\n  color: rgba(255, 255, 255, 0.86);\n  font-size: 0.76rem;\n  font-weight: 800;\n  line-height: 1.35;\n}\n.profile-impressions-popup[_ngcontent-%COMP%]   .profile-impressions-empty-state[_ngcontent-%COMP%] {\n  min-height: 260px;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  gap: 0.5rem;\n  padding: 2rem;\n  border: 1px dashed rgba(48, 78, 116, 0.28);\n  border-radius: 14px;\n  background:\n    linear-gradient(\n      180deg,\n      #f8fbff 0%,\n      #f2f7fb 100%);\n  color: #30435f;\n  text-align: center;\n}\n.profile-impressions-popup[_ngcontent-%COMP%]   .profile-impressions-empty-state[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 32px;\n  height: 32px;\n  font-size: 32px;\n  line-height: 32px;\n  color: #64809f;\n}\n.profile-impressions-popup[_ngcontent-%COMP%]   .profile-impressions-empty-state[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  font-size: 1rem;\n  font-weight: 900;\n}\n.profile-impressions-popup[_ngcontent-%COMP%]   .profile-impressions-empty-state[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  max-width: 320px;\n  color: #62738b;\n  font-size: 0.84rem;\n  font-weight: 700;\n  line-height: 1.35;\n}\n.profile-impressions-popup[_ngcontent-%COMP%]   .social-proof-grid[_ngcontent-%COMP%] {\n  display: grid;\n  width: min(980px, 100%);\n  margin: 0 auto;\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n  gap: 0.9rem;\n  justify-items: stretch;\n}\n.profile-impressions-popup[_ngcontent-%COMP%]   .social-proof-card.social-proof-card-modern[_ngcontent-%COMP%] {\n  position: relative;\n  max-width: none;\n  min-height: auto;\n  padding: 7rem 1rem 1.05rem;\n  border-radius: 14px;\n  border: 1px solid rgba(29, 42, 68, 0.14);\n  background:\n    linear-gradient(\n      180deg,\n      #f8f7fc 0%,\n      #f2f2f8 100%);\n  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.78), 0 4px 12px rgba(24, 33, 54, 0.05);\n}\n.profile-impressions-popup[_ngcontent-%COMP%]   .social-proof-card.social-proof-card-modern.impression-shortcut-tone-platinum[_ngcontent-%COMP%] {\n  border-color: rgba(72, 160, 183, 0.22);\n  background:\n    linear-gradient(\n      180deg,\n      #f6fdff 0%,\n      #eef8fb 100%);\n}\n.profile-impressions-popup[_ngcontent-%COMP%]   .social-proof-card.social-proof-card-modern.impression-shortcut-tone-gold[_ngcontent-%COMP%] {\n  border-color: rgba(189, 141, 51, 0.2);\n  background:\n    linear-gradient(\n      180deg,\n      #fffcf5 0%,\n      #fff7ec 100%);\n}\n.profile-impressions-popup[_ngcontent-%COMP%]   .social-proof-card.social-proof-card-modern.impression-shortcut-tone-silver[_ngcontent-%COMP%] {\n  border-color: rgba(111, 134, 164, 0.2);\n  background:\n    linear-gradient(\n      180deg,\n      #f7faff 0%,\n      #eef3f9 100%);\n}\n.profile-impressions-popup[_ngcontent-%COMP%]   .social-proof-card.social-proof-card-modern.impression-shortcut-tone-bronze[_ngcontent-%COMP%] {\n  border-color: rgba(178, 103, 62, 0.2);\n  background:\n    linear-gradient(\n      180deg,\n      #fff8f4 0%,\n      #fef0e6 100%);\n}\n.profile-impressions-popup[_ngcontent-%COMP%]   .social-proof-card.social-proof-card-modern.impression-shortcut-tone-empath[_ngcontent-%COMP%] {\n  border-color: rgba(184, 92, 116, 0.22);\n  background:\n    linear-gradient(\n      180deg,\n      #fff8fa 0%,\n      #fef0f4 100%);\n}\n.profile-impressions-popup[_ngcontent-%COMP%]   .social-proof-card.social-proof-card-modern.impression-shortcut-tone-creative[_ngcontent-%COMP%] {\n  border-color: rgba(122, 76, 196, 0.2);\n  background:\n    linear-gradient(\n      180deg,\n      #faf7ff 0%,\n      #f1ebfd 100%);\n}\n.profile-impressions-popup[_ngcontent-%COMP%]   .social-proof-card.social-proof-card-modern.impression-shortcut-tone-reliable[_ngcontent-%COMP%] {\n  border-color: rgba(61, 146, 94, 0.2);\n  background:\n    linear-gradient(\n      180deg,\n      #f6fcf7 0%,\n      #edf7ef 100%);\n}\n.profile-impressions-popup[_ngcontent-%COMP%]   .social-proof-card.social-proof-card-modern.impression-shortcut-tone-adventurer[_ngcontent-%COMP%] {\n  border-color: rgba(47, 139, 174, 0.2);\n  background:\n    linear-gradient(\n      180deg,\n      #f5fbff 0%,\n      #ecf6fb 100%);\n}\n.profile-impressions-popup[_ngcontent-%COMP%]   .social-proof-card.social-proof-card-modern.impression-shortcut-tone-thinker[_ngcontent-%COMP%] {\n  border-color: rgba(80, 108, 168, 0.2);\n  background:\n    linear-gradient(\n      180deg,\n      #f7f9ff 0%,\n      #edf1fb 100%);\n}\n.profile-impressions-popup[_ngcontent-%COMP%]   .social-proof-card.social-proof-card-modern.impression-shortcut-tone-social[_ngcontent-%COMP%] {\n  border-color: rgba(45, 138, 139, 0.2);\n  background:\n    linear-gradient(\n      180deg,\n      #f5fcfc 0%,\n      #ebf7f7 100%);\n}\n.profile-impressions-popup[_ngcontent-%COMP%]   .social-proof-card.social-proof-card-modern.impression-shortcut-tone-playful[_ngcontent-%COMP%] {\n  border-color: rgba(183, 95, 47, 0.2);\n  background:\n    linear-gradient(\n      180deg,\n      #fff9f4 0%,\n      #fef1e7 100%);\n}\n.profile-impressions-popup[_ngcontent-%COMP%]   .social-proof-card.social-proof-card-modern.impression-shortcut-tone-ambitious[_ngcontent-%COMP%] {\n  border-color: rgba(79, 113, 190, 0.2);\n  background:\n    linear-gradient(\n      180deg,\n      #f6f9ff 0%,\n      #edf2fb 100%);\n}\n.profile-impressions-popup[_ngcontent-%COMP%]   .social-proof-card.social-proof-card-modern[_ngcontent-%COMP%]   .social-proof-section-block[_ngcontent-%COMP%]:first-of-type {\n  margin-top: 0;\n}\n.profile-impressions-popup[_ngcontent-%COMP%]   .social-proof-identity-pill[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 0;\n  left: 0;\n  transform: translate(-0.36rem, -0.42rem);\n  display: inline-flex;\n  width: fit-content;\n  max-width: 100%;\n  min-height: 36px;\n  margin: 0;\n  padding: 0.34rem 0.72rem;\n  align-items: center;\n  gap: 0.45rem;\n  border-radius: 14px;\n  border: 1px solid rgba(140, 118, 206, 0.4);\n  background:\n    linear-gradient(\n      180deg,\n      #efeaff 0%,\n      #e5ddfb 100%);\n  color: #2e3153;\n  font-size: clamp(0.84rem, 1.05vw, 1.02rem);\n  font-weight: 800;\n  line-height: 1;\n  z-index: 3;\n  box-shadow: 0 4px 10px rgba(31, 44, 70, 0.16);\n}\n.profile-impressions-popup[_ngcontent-%COMP%]   .social-proof-card.social-proof-card-modern[_ngcontent-%COMP%]   .social-proof-identity-pill[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 18px;\n  height: 18px;\n  font-size: 18px;\n  line-height: 18px;\n}\n.profile-impressions-popup[_ngcontent-%COMP%]   .social-proof-identity-label[_ngcontent-%COMP%] {\n  display: inline-flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  gap: 0.1rem;\n  line-height: 1;\n  text-align: center;\n}\n.profile-impressions-popup[_ngcontent-%COMP%]   .social-proof-identity-main[_ngcontent-%COMP%] {\n  font-size: 0.94em;\n  font-weight: 800;\n  line-height: 1.05;\n  letter-spacing: 0.01em;\n}\n.profile-impressions-popup[_ngcontent-%COMP%]   .social-proof-identity-sub[_ngcontent-%COMP%] {\n  font-size: 0.72em;\n  font-weight: 700;\n  line-height: 1.08;\n  letter-spacing: 0.07em;\n  opacity: 0.86;\n  text-transform: uppercase;\n}\n.profile-impressions-popup[_ngcontent-%COMP%]   .social-proof-identity-pill-host[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #e9f9ff 0%,\n      #d9f0fb 100%);\n  border-color: rgba(72, 160, 183, 0.44);\n  color: #204f67;\n}\n.profile-impressions-popup[_ngcontent-%COMP%]   .social-proof-identity-pill-member[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #fff0f4 0%,\n      #fde6ee 100%);\n  border-color: rgba(184, 92, 116, 0.4);\n  color: #7d3550;\n}\n.profile-impressions-popup[_ngcontent-%COMP%]   .social-proof-identity-pill-member[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #c05779;\n}\n.profile-impressions-popup[_ngcontent-%COMP%]   .popup-impressions-badge[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 3.5rem;\n  left: 50%;\n  z-index: 1;\n  display: inline-flex;\n  width: min(21rem, 100% - 1rem);\n  max-width: none;\n  align-items: stretch;\n  overflow: hidden;\n  border: 1px solid rgba(106, 118, 142, 0.24);\n  border-radius: 14px;\n  transform: translateX(-50%);\n}\n.profile-impressions-popup[_ngcontent-%COMP%]   .popup-impressions-badge-updated[_ngcontent-%COMP%] {\n  animation: _ngcontent-%COMP%_profile-popup-impressions-badge-blink 0.44s ease;\n}\n.profile-impressions-popup[_ngcontent-%COMP%]   .popup-impressions-badge-segment[_ngcontent-%COMP%] {\n  display: flex;\n  min-height: 40px;\n  min-width: 0;\n  flex: 1 1 0;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  gap: 0.08rem;\n  padding: 0.34rem 0.58rem;\n  border-right: 1px solid rgba(106, 118, 142, 0.22);\n  text-align: center;\n}\n.profile-impressions-popup[_ngcontent-%COMP%]   .popup-impressions-badge-segment[_ngcontent-%COMP%]:last-child {\n  border-right: 0;\n}\n.profile-impressions-popup[_ngcontent-%COMP%]   .popup-impressions-badge-label[_ngcontent-%COMP%] {\n  font-family: inherit;\n  font-size: 0.7rem;\n  font-weight: 700;\n  line-height: 1.08;\n  letter-spacing: 0.03em;\n  text-transform: uppercase;\n  text-align: center;\n  white-space: normal;\n  overflow-wrap: anywhere;\n}\n.profile-impressions-popup[_ngcontent-%COMP%]   .popup-impressions-badge-value[_ngcontent-%COMP%] {\n  color: #111827;\n  font-size: 0.78rem;\n  font-weight: 900;\n  line-height: 1.05;\n  white-space: nowrap;\n}\n.profile-impressions-popup[_ngcontent-%COMP%]   .popup-impressions-rate-rate[_ngcontent-%COMP%] {\n  border-color: rgba(179, 127, 49, 0.24);\n  background: #fff7ec;\n}\n.profile-impressions-popup[_ngcontent-%COMP%]   .popup-impressions-rate-people[_ngcontent-%COMP%] {\n  border-color: rgba(53, 126, 83, 0.24);\n  background: #eff8f3;\n}\n.profile-impressions-popup[_ngcontent-%COMP%]   .popup-impressions-rate-return[_ngcontent-%COMP%] {\n  border-color: rgba(89, 93, 162, 0.24);\n  background: #f3f3ff;\n}\n.profile-impressions-popup[_ngcontent-%COMP%]   .social-proof-section-block[_ngcontent-%COMP%] {\n  margin-top: 0.52rem;\n}\n.profile-impressions-popup[_ngcontent-%COMP%]   .social-proof-section-head[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: flex-start;\n  gap: 0.52rem;\n  margin-bottom: 0.56rem;\n}\n.profile-impressions-popup[_ngcontent-%COMP%]   .section-tag[_ngcontent-%COMP%] {\n  display: inline-flex;\n  min-height: 28px;\n  align-items: center;\n  justify-content: center;\n  padding: 0.16rem 0.78rem;\n  border-radius: 999px;\n  background:\n    linear-gradient(\n      180deg,\n      #ece9f8 0%,\n      #e4e0f3 100%);\n  color: #59577b;\n  font-size: 0.68rem;\n  font-weight: 800;\n  letter-spacing: 0.05em;\n  text-transform: uppercase;\n  white-space: nowrap;\n}\n.profile-impressions-popup[_ngcontent-%COMP%]   .section-line[_ngcontent-%COMP%] {\n  height: 1px;\n  flex: 1;\n  background: rgba(113, 124, 150, 0.32);\n}\n.profile-impressions-popup[_ngcontent-%COMP%]   .social-proof-section-head.section-vibe[_ngcontent-%COMP%]   .section-tag[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #eaf2ff 0%,\n      #dfeafa 100%);\n  color: #2d5ea8;\n}\n.profile-impressions-popup[_ngcontent-%COMP%]   .social-proof-section-head.section-vibe[_ngcontent-%COMP%]   .section-line[_ngcontent-%COMP%] {\n  background: rgba(59, 108, 179, 0.34);\n}\n.profile-impressions-popup[_ngcontent-%COMP%]   .social-proof-section-head.section-category[_ngcontent-%COMP%]   .section-tag[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #e9f7ef 0%,\n      #def1e7 100%);\n  color: #2d7d47;\n}\n.profile-impressions-popup[_ngcontent-%COMP%]   .social-proof-section-head.section-category[_ngcontent-%COMP%]   .section-line[_ngcontent-%COMP%] {\n  background: rgba(45, 125, 71, 0.34);\n}\n.profile-impressions-popup[_ngcontent-%COMP%]   .social-proof-section-head.section-personality[_ngcontent-%COMP%]   .section-tag[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f0ebfb 0%,\n      #e7def7 100%);\n  color: #6a45a3;\n}\n.profile-impressions-popup[_ngcontent-%COMP%]   .social-proof-section-head.section-personality[_ngcontent-%COMP%]   .section-line[_ngcontent-%COMP%] {\n  background: rgba(106, 69, 163, 0.34);\n}\n.profile-impressions-popup[_ngcontent-%COMP%]   .social-proof-chip-list[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  justify-content: flex-start;\n  gap: 0.28rem;\n}\n.profile-impressions-popup[_ngcontent-%COMP%]   .social-proof-chip[_ngcontent-%COMP%] {\n  display: inline-flex;\n  width: fit-content;\n  max-width: 100%;\n  min-height: 24px;\n  align-items: center;\n  justify-content: center;\n  padding: 0.16rem 0.52rem;\n  border: 1px solid rgba(107, 119, 146, 0.33);\n  border-radius: 999px;\n  background:\n    linear-gradient(\n      180deg,\n      #f4f5fb 0%,\n      #eceef8 100%);\n  color: #243a67;\n  font-size: clamp(0.66rem, 0.9vw, 0.8rem);\n  font-weight: 800;\n  line-height: 1.15;\n  text-align: center;\n  white-space: nowrap;\n}\n.profile-impressions-popup[_ngcontent-%COMP%]   .personality-trait-carousel[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 0.55rem;\n}\n.profile-impressions-popup[_ngcontent-%COMP%]   .personality-trait-pill-strip[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(3, minmax(0, 1fr));\n  gap: 0.38rem;\n}\n.profile-impressions-popup[_ngcontent-%COMP%]   .personality-trait-pill[_ngcontent-%COMP%] {\n  --trait-accent: #6a45a3;\n  --trait-accent-soft: rgba(106, 69, 163, 0.18);\n  --trait-surface:\n    linear-gradient(\n      180deg,\n      #fbf8ff 0%,\n      #f2ebff 100%);\n  position: relative;\n  overflow: hidden;\n  display: grid;\n  gap: 0.12rem;\n  padding: 0.52rem 0.6rem;\n  border: 1px solid rgba(116, 127, 156, 0.22);\n  border-radius: 14px;\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 255, 255, 0.94) 0%,\n      rgba(243, 245, 250, 0.98) 100%);\n  color: #3b4560;\n  text-align: left;\n  cursor: pointer;\n  transition:\n    border-color 0.18s ease,\n    box-shadow 0.18s ease,\n    background 0.18s ease;\n}\n.profile-impressions-popup[_ngcontent-%COMP%]   .personality-trait-pill[_ngcontent-%COMP%]:hover {\n  border-color: rgba(89, 108, 153, 0.34);\n  box-shadow: 0 6px 16px rgba(37, 45, 68, 0.08);\n}\n.profile-impressions-popup[_ngcontent-%COMP%]   .personality-trait-pill.is-active[_ngcontent-%COMP%] {\n  border-color: rgba(255, 255, 255, 0.96);\n  background: var(--trait-surface);\n  box-shadow:\n    0 0 0 1.5px var(--trait-accent-soft),\n    inset 0 0 0 1px rgba(255, 255, 255, 0.92),\n    0 8px 22px color-mix(in srgb, var(--trait-accent) 14%, transparent);\n}\n.profile-impressions-popup[_ngcontent-%COMP%]   .personality-trait-pill.is-active[_ngcontent-%COMP%]   .personality-trait-pill-rank[_ngcontent-%COMP%], \n.profile-impressions-popup[_ngcontent-%COMP%]   .personality-trait-pill.is-active[_ngcontent-%COMP%]   .personality-trait-pill-percent[_ngcontent-%COMP%] {\n  color: var(--trait-accent);\n}\n.profile-impressions-popup[_ngcontent-%COMP%]   .personality-trait-pill-rank[_ngcontent-%COMP%] {\n  color: #7b859e;\n  font-size: 0.66rem;\n  font-weight: 800;\n  letter-spacing: 0.08em;\n  text-transform: uppercase;\n}\n.profile-impressions-popup[_ngcontent-%COMP%]   .personality-trait-pill-label[_ngcontent-%COMP%] {\n  color: #1f2937;\n  font-size: 0.82rem;\n  font-weight: 900;\n  line-height: 1.12;\n}\n.profile-impressions-popup[_ngcontent-%COMP%]   .personality-trait-pill-percent[_ngcontent-%COMP%] {\n  color: #4d618a;\n  font-size: 0.76rem;\n  font-weight: 800;\n}\n.profile-impressions-popup[_ngcontent-%COMP%]   .personality-trait-card[_ngcontent-%COMP%] {\n  --trait-accent: #6a45a3;\n  --trait-accent-soft: rgba(106, 69, 163, 0.18);\n  --trait-surface:\n    linear-gradient(\n      180deg,\n      #fbf8ff 0%,\n      #f2ebff 100%);\n  display: flex;\n  flex-direction: column;\n  gap: 0.55rem;\n  padding: 0.82rem 0.84rem 0.88rem;\n  border: 1px solid var(--trait-accent-soft);\n  border-radius: 18px;\n  background: var(--trait-surface);\n  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.9), 0 10px 24px rgba(41, 49, 70, 0.08);\n}\n.profile-impressions-popup[_ngcontent-%COMP%]   .personality-trait-card-head[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: flex-start;\n  justify-content: space-between;\n  gap: 0.75rem;\n}\n.profile-impressions-popup[_ngcontent-%COMP%]   .personality-trait-card-title[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0.72rem;\n}\n.profile-impressions-popup[_ngcontent-%COMP%]   .personality-trait-card-title[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  display: block;\n  color: #1f2937;\n  font-size: 0.98rem;\n  font-weight: 900;\n  line-height: 1.1;\n}\n.profile-impressions-popup[_ngcontent-%COMP%]   .personality-trait-card-title[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0.18rem 0 0;\n  color: #56627f;\n  font-size: 0.77rem;\n  font-weight: 700;\n  line-height: 1.3;\n}\n.profile-impressions-popup[_ngcontent-%COMP%]   .personality-trait-card-icon[_ngcontent-%COMP%] {\n  display: inline-flex;\n  width: 2.45rem;\n  height: 2.45rem;\n  align-items: center;\n  justify-content: center;\n  border-radius: 999px;\n  background: rgba(255, 255, 255, 0.75);\n  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.94);\n  color: var(--trait-accent);\n}\n.profile-impressions-popup[_ngcontent-%COMP%]   .personality-trait-card-icon[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 1.25rem;\n  height: 1.25rem;\n  font-size: 1.25rem;\n  line-height: 1.25rem;\n}\n.profile-impressions-popup[_ngcontent-%COMP%]   .personality-trait-card-percent[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  min-width: 3rem;\n  min-height: 2.1rem;\n  padding: 0.2rem 0.55rem;\n  border-radius: 999px;\n  background: rgba(255, 255, 255, 0.82);\n  color: var(--trait-accent);\n  font-size: 0.94rem;\n  font-weight: 900;\n  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.94);\n}\n.profile-impressions-popup[_ngcontent-%COMP%]   .personality-trait-card-bar[_ngcontent-%COMP%] {\n  position: relative;\n  height: 0.48rem;\n  overflow: hidden;\n  border-radius: 999px;\n  background: rgba(91, 103, 130, 0.12);\n}\n.profile-impressions-popup[_ngcontent-%COMP%]   .personality-trait-card-bar[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  display: block;\n  height: 100%;\n  border-radius: inherit;\n  background:\n    linear-gradient(\n      90deg,\n      var(--trait-accent) 0%,\n      color-mix(in srgb, var(--trait-accent) 68%, white) 100%);\n  box-shadow: 0 4px 12px color-mix(in srgb, var(--trait-accent) 30%, transparent);\n}\n.profile-impressions-popup[_ngcontent-%COMP%]   .personality-trait-card-meta[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  align-items: center;\n  gap: 0.4rem 0.7rem;\n  color: #5d6783;\n  font-size: 0.72rem;\n  font-weight: 800;\n}\n.profile-impressions-popup[_ngcontent-%COMP%]   .personality-trait-card-highlights[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 0.28rem;\n}\n.profile-impressions-popup[_ngcontent-%COMP%]   .personality-trait-card.trait-tone-social[_ngcontent-%COMP%], \n.profile-impressions-popup[_ngcontent-%COMP%]   .personality-trait-pill.trait-tone-social[_ngcontent-%COMP%] {\n  --trait-accent: #dd5c82;\n  --trait-accent-soft: rgba(221, 92, 130, 0.22);\n  --trait-surface:\n    linear-gradient(\n      180deg,\n      #fff7fb 0%,\n      #fdebf3 100%);\n}\n.profile-impressions-popup[_ngcontent-%COMP%]   .personality-trait-card.trait-tone-deep[_ngcontent-%COMP%], \n.profile-impressions-popup[_ngcontent-%COMP%]   .personality-trait-pill.trait-tone-deep[_ngcontent-%COMP%] {\n  --trait-accent: #5a66b4;\n  --trait-accent-soft: rgba(90, 102, 180, 0.2);\n  --trait-surface:\n    linear-gradient(\n      180deg,\n      #f7f8ff 0%,\n      #ebedff 100%);\n}\n.profile-impressions-popup[_ngcontent-%COMP%]   .personality-trait-card.trait-tone-adventure[_ngcontent-%COMP%], \n.profile-impressions-popup[_ngcontent-%COMP%]   .personality-trait-pill.trait-tone-adventure[_ngcontent-%COMP%] {\n  --trait-accent: #eb8b2d;\n  --trait-accent-soft: rgba(235, 139, 45, 0.22);\n  --trait-surface:\n    linear-gradient(\n      180deg,\n      #fff8ef 0%,\n      #ffefd9 100%);\n}\n.profile-impressions-popup[_ngcontent-%COMP%]   .personality-trait-card.trait-tone-reliable[_ngcontent-%COMP%], \n.profile-impressions-popup[_ngcontent-%COMP%]   .personality-trait-pill.trait-tone-reliable[_ngcontent-%COMP%] {\n  --trait-accent: #2f8b7a;\n  --trait-accent-soft: rgba(47, 139, 122, 0.22);\n  --trait-surface:\n    linear-gradient(\n      180deg,\n      #f3fffb 0%,\n      #e2f7f0 100%);\n}\n.profile-impressions-popup[_ngcontent-%COMP%]   .personality-trait-card.trait-tone-creative[_ngcontent-%COMP%], \n.profile-impressions-popup[_ngcontent-%COMP%]   .personality-trait-pill.trait-tone-creative[_ngcontent-%COMP%] {\n  --trait-accent: #8b5fd1;\n  --trait-accent-soft: rgba(139, 95, 209, 0.22);\n  --trait-surface:\n    linear-gradient(\n      180deg,\n      #fbf7ff 0%,\n      #f0e7ff 100%);\n}\n.profile-impressions-popup[_ngcontent-%COMP%]   .personality-trait-card.trait-tone-empath[_ngcontent-%COMP%], \n.profile-impressions-popup[_ngcontent-%COMP%]   .personality-trait-pill.trait-tone-empath[_ngcontent-%COMP%] {\n  --trait-accent: #d15f77;\n  --trait-accent-soft: rgba(209, 95, 119, 0.22);\n  --trait-surface:\n    linear-gradient(\n      180deg,\n      #fff8f8 0%,\n      #fdebed 100%);\n}\n.profile-impressions-popup[_ngcontent-%COMP%]   .personality-trait-card.trait-tone-ambitious[_ngcontent-%COMP%], \n.profile-impressions-popup[_ngcontent-%COMP%]   .personality-trait-pill.trait-tone-ambitious[_ngcontent-%COMP%] {\n  --trait-accent: #406ecf;\n  --trait-accent-soft: rgba(64, 110, 207, 0.22);\n  --trait-surface:\n    linear-gradient(\n      180deg,\n      #f7faff 0%,\n      #e9f1ff 100%);\n}\n.profile-impressions-popup[_ngcontent-%COMP%]   .personality-trait-card.trait-tone-playful[_ngcontent-%COMP%], \n.profile-impressions-popup[_ngcontent-%COMP%]   .personality-trait-pill.trait-tone-playful[_ngcontent-%COMP%] {\n  --trait-accent: #d77b2f;\n  --trait-accent-soft: rgba(215, 123, 47, 0.22);\n  --trait-surface:\n    linear-gradient(\n      180deg,\n      #fffaf2 0%,\n      #ffeedb 100%);\n}\n.profile-impressions-popup[_ngcontent-%COMP%]   .social-proof-chip.chip-personality[_ngcontent-%COMP%] {\n  color: #4d3e69;\n}\n.profile-impressions-popup[_ngcontent-%COMP%]   .social-proof-chip.chip-category[_ngcontent-%COMP%] {\n  color: #2c5e46;\n}\n.profile-impressions-popup[_ngcontent-%COMP%]   .impressions-chip-list-updated[_ngcontent-%COMP%]   .social-proof-chip[_ngcontent-%COMP%] {\n  animation: _ngcontent-%COMP%_profile-popup-impressions-chip-pulse 0.38s ease;\n}\n.profile-impressions-popup[_ngcontent-%COMP%]   .impressions-chip-list-updated[_ngcontent-%COMP%]   .social-proof-chip[_ngcontent-%COMP%]:nth-child(2n) {\n  animation-delay: 0.04s;\n}\n.profile-impressions-popup[_ngcontent-%COMP%]   .impressions-chip-list-updated[_ngcontent-%COMP%]   .social-proof-chip[_ngcontent-%COMP%]:nth-child(3n) {\n  animation-delay: 0.08s;\n}\n@keyframes _ngcontent-%COMP%_profile-popup-impressions-badge-blink {\n  0% {\n    filter: brightness(1) saturate(1);\n  }\n  45% {\n    filter: brightness(1.08) saturate(1.06);\n  }\n  100% {\n    filter: brightness(1) saturate(1);\n  }\n}\n@keyframes _ngcontent-%COMP%_profile-popup-impressions-chip-pulse {\n  0% {\n    transform: translateY(0) scale(1);\n    filter: brightness(1);\n  }\n  45% {\n    transform: translateY(-1px) scale(1.02);\n    filter: brightness(1.08);\n  }\n  100% {\n    transform: translateY(0) scale(1);\n    filter: brightness(1);\n  }\n}\n@media (max-width: 760px) {\n  .profile-impressions-popup[_ngcontent-%COMP%] {\n    padding: 0.05rem;\n  }\n  .profile-impressions-popup[_ngcontent-%COMP%]   .profile-impressions-person-card[_ngcontent-%COMP%] {\n    width: min(280px, 100%);\n  }\n  .profile-impressions-popup[_ngcontent-%COMP%]   .social-proof-grid[_ngcontent-%COMP%] {\n    grid-template-columns: minmax(0, 1fr);\n    gap: 1.1rem;\n  }\n  .profile-impressions-popup[_ngcontent-%COMP%]   .social-proof-card.social-proof-card-modern[_ngcontent-%COMP%] {\n    padding-top: 6rem;\n  }\n  .profile-impressions-popup[_ngcontent-%COMP%]   .social-proof-identity-pill[_ngcontent-%COMP%] {\n    min-height: 32px;\n    padding: 0.25rem 0.56rem;\n    transform: translate(-0.18rem, -0.34rem);\n    font-size: 0.8rem;\n  }\n  .profile-impressions-popup[_ngcontent-%COMP%]   .popup-impressions-badge[_ngcontent-%COMP%] {\n    top: 3rem;\n    display: inline-flex;\n    max-width: calc(100% - 2px);\n    flex-wrap: nowrap;\n  }\n  .profile-impressions-popup[_ngcontent-%COMP%]   .popup-impressions-badge-segment[_ngcontent-%COMP%] {\n    min-height: 34px;\n    min-width: 0;\n    flex: 1 1 0;\n    padding: 0.2rem 0.34rem;\n  }\n  .profile-impressions-popup[_ngcontent-%COMP%]   .popup-impressions-badge-label[_ngcontent-%COMP%] {\n    display: -webkit-box;\n    width: 100%;\n    min-width: 0;\n    font-size: 0.7rem;\n    overflow: hidden;\n    -webkit-box-orient: vertical;\n    -webkit-line-clamp: 2;\n    text-align: center;\n    white-space: normal;\n    overflow-wrap: anywhere;\n  }\n  .profile-impressions-popup[_ngcontent-%COMP%]   .popup-impressions-badge-value[_ngcontent-%COMP%] {\n    font-size: 0.72rem;\n    white-space: nowrap;\n  }\n  .profile-impressions-popup[_ngcontent-%COMP%]   .personality-trait-pill-strip[_ngcontent-%COMP%] {\n    grid-template-columns: repeat(3, minmax(0, 1fr));\n    gap: 0.28rem;\n  }\n  .profile-impressions-popup[_ngcontent-%COMP%]   .personality-trait-pill[_ngcontent-%COMP%] {\n    gap: 0.08rem;\n    padding: 0.38rem 0.34rem;\n    border-radius: 12px;\n  }\n  .profile-impressions-popup[_ngcontent-%COMP%]   .personality-trait-pill-rank[_ngcontent-%COMP%] {\n    font-size: 0.56rem;\n    letter-spacing: 0.05em;\n  }\n  .profile-impressions-popup[_ngcontent-%COMP%]   .personality-trait-pill-label[_ngcontent-%COMP%] {\n    font-size: 0.72rem;\n  }\n  .profile-impressions-popup[_ngcontent-%COMP%]   .personality-trait-pill-percent[_ngcontent-%COMP%] {\n    font-size: 0.66rem;\n  }\n  .profile-impressions-popup[_ngcontent-%COMP%]   .personality-trait-card-head[_ngcontent-%COMP%] {\n    flex-direction: column;\n  }\n  .profile-impressions-popup[_ngcontent-%COMP%]   .personality-trait-card-percent[_ngcontent-%COMP%] {\n    min-width: 0;\n  }\n}\n/*# sourceMappingURL=impressions-popup.component.css.map */'] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ProfileImpressionsPopupComponent, [{
    type: Component,
    args: [{ selector: "app-profile-impressions-popup", standalone: true, imports: [CommonModule, MatIconModule, MatRippleModule, PopupComponent], template: `@if (popupOpen() && viewModel(); as vm) {
  <app-popup [model]="impressionsPopupModel(vm)" [zIndex]="impressionsPopupZIndex()">
    <div class="profile-impressions-popup">
        <section class="profile-impressions-person-stage">
          <article
            class="profile-impressions-person-card"
            [class.has-photo]="!!vm.activeProfilePhoto"
            [ngClass]="profileAvatarClass(vm.user)"
            [style.backgroundImage]="vm.activeProfilePhoto ? 'url(' + vm.activeProfilePhoto + ')' : null"
            >
            @if (!vm.activeProfilePhoto) {
              <span class="profile-impressions-person-initials">{{ profileInitials(vm.user) }}</span>
            }
            @if (vm.profilePhotos.length > 1) {
              <div class="profile-impressions-person-indicators" aria-hidden="true">
                @for (photo of vm.profilePhotos; track trackProfilePhoto($index, photo); let index = $index) {
                  <span [class.active]="index === vm.profilePhotoIndex"></span>
                }
              </div>
              <div class="profile-impressions-person-hit-area">
                @for (photo of vm.profilePhotos; track trackProfilePhoto($index, photo); let index = $index) {
                  <button
                    type="button"
                    (click)="selectProfilePhoto(index, $event)"
                    [attr.aria-label]="'Show profile photo ' + (index + 1)"
                  ></button>
                }
              </div>
            }
            <div class="profile-impressions-person-overlay">
              <h3>{{ displayTitle(vm.user) }}</h3>
              <p>
                <mat-icon>location_on</mat-icon>
                <span>{{ vm.user.city || 'City not set yet' }}</span>
              </p>
              @if (vm.user.headline || vm.user.statusText) {
                <small>{{ vm.user.headline || vm.user.statusText }}</small>
              }
            </div>
          </article>
        </section>
        @if (!vm.hasAvailableData) {
          <div class="profile-impressions-empty-state">
            <mat-icon>insights</mat-icon>
            <strong>No available data yet</strong>
            <span>Impressions appear after real host or attendee activity.</span>
          </div>
        } @else {
        <div class="social-proof-grid">
          <div
            class="editor-list-card social-proof-card social-proof-card-modern social-proof-card-host"
            [ngClass]="vm.hostTierPresentation.toneClass"
            >
            <div class="social-proof-identity-pill social-proof-identity-pill-host">
              <mat-icon [class]="vm.hostTierPresentation.colorClass">{{ vm.hostTierPresentation.icon }}</mat-icon>
              <span class="social-proof-identity-label">
                <span class="social-proof-identity-main">{{ vm.user.hostTier.replace(' Host', '') }}</span>
                <span class="social-proof-identity-sub">Host</span>
              </span>
            </div>
            <div class="popup-impressions-badge popup-impressions-badge-host" [class.popup-impressions-badge-updated]="vm.pulseFlags.hostTop">
              <span class="popup-impressions-badge-segment popup-impressions-rate-rate">
                <span class="popup-impressions-badge-label">Rate</span>
                <span class="popup-impressions-badge-value">{{ vm.hostAverageRating }}</span>
              </span>
              <span class="popup-impressions-badge-segment popup-impressions-rate-people">
                <span class="popup-impressions-badge-label">People / Events</span>
                <span class="popup-impressions-badge-value">{{ vm.hostPeopleMet + ' / ' + vm.hostTotalEvents }}</span>
              </span>
              <span class="popup-impressions-badge-segment popup-impressions-rate-return">
                <span class="popup-impressions-badge-label">Returnees / NoShow</span>
                <span class="popup-impressions-badge-value">{{ vm.hostRepeatSummary + ' / ' + vm.hostAttendanceNoShowSummary }}</span>
              </span>
            </div>
            <div class="social-proof-section-block">
              <div class="social-proof-section-head section-vibe">
                <span class="section-tag">Vibe</span>
                <span class="section-line"></span>
              </div>
              <div class="social-proof-chip-list" [class.impressions-chip-list-updated]="vm.pulseFlags.hostChips">
                @for (item of vm.hostVibeBadgeItems; track item) {
                  <span class="social-proof-chip chip-vibe">{{ item }}</span>
                }
              </div>
            </div>
            <div class="social-proof-section-block">
              <div class="social-proof-section-head section-personality">
                <span class="section-tag">Personality</span>
                <span class="section-line"></span>
              </div>
              @if (vm.hostTraitCards.length > 0) {
                <div class="personality-trait-carousel">
                  <div class="personality-trait-pill-strip">
                    @for (item of vm.hostTraitCards; track item.id; let index = $index) {
                      <button
                        type="button"
                        class="personality-trait-pill"
                        [class.is-active]="index === vm.hostTraitIndex"
                        [ngClass]="item.toneClass"
                        (click)="selectHostTrait(index)"
                        matRipple
                        [matRippleColor]="'rgba(84, 112, 176, 0.16)'"
                        [attr.aria-label]="'Open host trait ' + item.label"
                        >
                        <span class="personality-trait-pill-rank">#{{ index + 1 }}</span>
                        <span class="personality-trait-pill-label">{{ item.label }}</span>
                        <span class="personality-trait-pill-percent">{{ item.percent }}%</span>
                      </button>
                    }
                  </div>
                  @if (vm.hostActiveTraitCard; as trait) {
                    <div class="personality-trait-card" [ngClass]="vm.hostActiveTraitCard.toneClass">
                      <div class="personality-trait-card-head">
                        <div class="personality-trait-card-title">
                          <span class="personality-trait-card-icon"><mat-icon>{{ trait.icon }}</mat-icon></span>
                          <div>
                            <strong>{{ trait.label }}</strong>
                            <p>{{ trait.coreVibe }}</p>
                          </div>
                        </div>
                        <span class="personality-trait-card-percent">{{ trait.percent }}%</span>
                      </div>
                      <div class="personality-trait-card-bar">
                        <span [style.width.%]="trait.percent"></span>
                      </div>
                      <div class="personality-trait-card-meta">
                        <span>{{ trait.evidenceCount }} signals</span>
                        @if (trait.lastRatedAtIso) {
                          <span>{{ trait.lastRatedAtIso | date:'MMM d' }}</span>
                        }
                      </div>
                      <div class="personality-trait-card-highlights">
                        @for (item of trait.highlights; track item) {
                          <span class="social-proof-chip chip-personality">{{ item }}</span>
                        }
                      </div>
                    </div>
                  }
                </div>
              } @else {
                <div class="social-proof-chip-list" [class.impressions-chip-list-updated]="vm.pulseFlags.hostChips">
                  @for (item of vm.hostPersonalityBadgeItems; track item) {
                    <span class="social-proof-chip chip-personality">{{ item }}</span>
                  }
                </div>
              }
            </div>
            <div class="social-proof-section-block">
              <div class="social-proof-section-head section-category">
                <span class="section-tag">Category</span>
                <span class="section-line"></span>
              </div>
              <div class="social-proof-chip-list" [class.impressions-chip-list-updated]="vm.pulseFlags.hostChips">
                @for (item of vm.hostCategoryBadgeItems; track item) {
                  <span class="social-proof-chip chip-category">{{ item }}</span>
                }
              </div>
            </div>
          </div>
          <div
            class="editor-list-card social-proof-card social-proof-card-modern social-proof-card-member"
            [ngClass]="vm.traitPresentation.toneClass"
            >
            <div class="social-proof-identity-pill social-proof-identity-pill-member">
              <mat-icon [class]="vm.traitPresentation.colorClass">{{ vm.traitPresentation.icon }}</mat-icon>
              <span class="social-proof-identity-label">
                <span class="social-proof-identity-main">{{ vm.memberImpressionTitle.replace(' Attendee', '') }}</span>
                <span class="social-proof-identity-sub">Attendee</span>
              </span>
            </div>
            <div class="popup-impressions-badge popup-impressions-badge-member" [class.popup-impressions-badge-updated]="vm.pulseFlags.memberTop">
              <span class="popup-impressions-badge-segment popup-impressions-rate-people">
                <span class="popup-impressions-badge-label">People / Events</span>
                <span class="popup-impressions-badge-value">{{ vm.memberPeopleMet + ' / ' + vm.memberTotalEvents }}</span>
              </span>
              <span class="popup-impressions-badge-segment popup-impressions-rate-return">
                <span class="popup-impressions-badge-label">Returnees / NoShow</span>
                <span class="popup-impressions-badge-value">{{ vm.memberReturneesSummary + ' / ' + vm.memberNoShowCount }}</span>
              </span>
            </div>
            <div class="social-proof-section-block">
              <div class="social-proof-section-head section-vibe">
                <span class="section-tag">Vibe</span>
                <span class="section-line"></span>
              </div>
              <div class="social-proof-chip-list" [class.impressions-chip-list-updated]="vm.pulseFlags.memberChips">
                @for (item of vm.memberVibeBadgeItems; track item) {
                  <span class="social-proof-chip chip-vibe">{{ item }}</span>
                }
              </div>
            </div>
            <div class="social-proof-section-block">
              <div class="social-proof-section-head section-personality">
                <span class="section-tag">Personality</span>
                <span class="section-line"></span>
              </div>
              @if (vm.memberTraitCards.length > 0) {
                <div class="personality-trait-carousel">
                  <div class="personality-trait-pill-strip">
                    @for (item of vm.memberTraitCards; track item.id; let index = $index) {
                      <button
                        type="button"
                        class="personality-trait-pill"
                        [class.is-active]="index === vm.memberTraitIndex"
                        [ngClass]="item.toneClass"
                        (click)="selectMemberTrait(index)"
                        matRipple
                        [matRippleColor]="'rgba(84, 112, 176, 0.16)'"
                        [attr.aria-label]="'Open member trait ' + item.label"
                        >
                        <span class="personality-trait-pill-rank">#{{ index + 1 }}</span>
                        <span class="personality-trait-pill-label">{{ item.label }}</span>
                        <span class="personality-trait-pill-percent">{{ item.percent }}%</span>
                      </button>
                    }
                  </div>
                  @if (vm.memberActiveTraitCard; as trait) {
                    <div class="personality-trait-card" [ngClass]="vm.memberActiveTraitCard.toneClass">
                      <div class="personality-trait-card-head">
                        <div class="personality-trait-card-title">
                          <span class="personality-trait-card-icon"><mat-icon>{{ trait.icon }}</mat-icon></span>
                          <div>
                            <strong>{{ trait.label }}</strong>
                            <p>{{ trait.coreVibe }}</p>
                          </div>
                        </div>
                        <span class="personality-trait-card-percent">{{ trait.percent }}%</span>
                      </div>
                      <div class="personality-trait-card-bar">
                        <span [style.width.%]="trait.percent"></span>
                      </div>
                      <div class="personality-trait-card-meta">
                        <span>{{ trait.evidenceCount }} signals</span>
                        @if (trait.lastRatedAtIso) {
                          <span>{{ trait.lastRatedAtIso | date:'MMM d' }}</span>
                        }
                      </div>
                      <div class="personality-trait-card-highlights">
                        @for (item of trait.highlights; track item) {
                          <span class="social-proof-chip chip-personality">{{ item }}</span>
                        }
                      </div>
                    </div>
                  }
                </div>
              } @else {
                <div class="social-proof-chip-list" [class.impressions-chip-list-updated]="vm.pulseFlags.memberChips">
                  @for (item of vm.memberPersonalityBadgeItems; track item) {
                    <span class="social-proof-chip chip-personality">{{ item }}</span>
                  }
                </div>
              }
            </div>
            <div class="social-proof-section-block">
              <div class="social-proof-section-head section-category">
                <span class="section-tag">Category</span>
                <span class="section-line"></span>
              </div>
              <div class="social-proof-chip-list" [class.impressions-chip-list-updated]="vm.pulseFlags.memberChips">
                @for (item of vm.memberCategoryBadgeItems; track item) {
                  <span class="social-proof-chip chip-category">{{ item }}</span>
                }
              </div>
            </div>
          </div>
        </div>
        }
    </div>
  </app-popup>
}
`, styles: ['/* src/app/profile/components/impressions-popup/impressions-popup.component.scss */\n:host {\n  display: contents;\n}\n.profile-impressions-popup {\n  width: 100%;\n  min-height: 0;\n  box-sizing: border-box;\n  padding: 0.35rem;\n  font-family:\n    "Nunito Sans",\n    "Segoe UI",\n    sans-serif;\n  text-align: left;\n}\n.profile-impressions-popup .profile-impressions-person-stage {\n  display: grid;\n  place-items: center;\n  width: 100%;\n  margin: 0 auto 0.9rem;\n}\n.profile-impressions-popup .profile-impressions-person-card {\n  position: relative;\n  width: min(330px, 100%);\n  aspect-ratio: 3/4;\n  min-height: 0;\n  overflow: hidden;\n  isolation: isolate;\n  border: 1px solid rgba(22, 42, 72, 0.24);\n  border-radius: 14px;\n  background-color: #13243a;\n  background-position: center;\n  background-size: cover;\n  box-shadow: 0 18px 42px rgba(18, 32, 54, 0.22);\n}\n.profile-impressions-popup .profile-impressions-person-card::after {\n  content: "";\n  position: absolute;\n  inset: 0;\n  z-index: 1;\n  pointer-events: none;\n  background:\n    linear-gradient(\n      180deg,\n      rgba(8, 16, 28, 0.16) 0%,\n      rgba(8, 15, 28, 0.12) 42%,\n      rgba(8, 15, 28, 0.86) 100%),\n    radial-gradient(\n      circle at 50% 18%,\n      rgba(255, 255, 255, 0.12),\n      transparent 44%);\n}\n.profile-impressions-popup .profile-impressions-person-initials {\n  position: absolute;\n  inset: 0;\n  display: grid;\n  place-items: center;\n  color: rgba(255, 255, 255, 0.92);\n  font-size: 3rem;\n  font-weight: 950;\n  letter-spacing: 0;\n}\n.profile-impressions-popup .profile-impressions-person-indicators {\n  position: absolute;\n  top: 0.42rem;\n  left: 0.48rem;\n  right: 0.48rem;\n  z-index: 4;\n  display: grid;\n  grid-auto-flow: column;\n  grid-auto-columns: 1fr;\n  gap: 0.22rem;\n}\n.profile-impressions-popup .profile-impressions-person-indicators span {\n  position: relative;\n  height: 4px;\n  overflow: hidden;\n  border-radius: 999px;\n  background: rgba(255, 255, 255, 0.36);\n  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.18);\n}\n.profile-impressions-popup .profile-impressions-person-indicators span::after {\n  content: "";\n  position: absolute;\n  inset: 0;\n  opacity: 0;\n  background: #fff;\n  transform: scaleX(0.12);\n  transform-origin: left center;\n}\n.profile-impressions-popup .profile-impressions-person-indicators span.active::after {\n  opacity: 1;\n  transform: scaleX(1);\n}\n.profile-impressions-popup .profile-impressions-person-hit-area {\n  position: absolute;\n  inset: 0;\n  z-index: 3;\n  display: grid;\n  grid-auto-flow: column;\n  grid-auto-columns: 1fr;\n}\n.profile-impressions-popup .profile-impressions-person-hit-area button {\n  padding: 0;\n  border: 0;\n  background: transparent;\n  cursor: pointer;\n}\n.profile-impressions-popup .profile-impressions-person-overlay {\n  position: absolute;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  z-index: 5;\n  padding: 1rem;\n  color: #fff;\n}\n.profile-impressions-popup .profile-impressions-person-overlay h3 {\n  margin: 0;\n  font-size: 1.1rem;\n  font-weight: 950;\n  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.42);\n}\n.profile-impressions-popup .profile-impressions-person-overlay p {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.22rem;\n  margin: 0.24rem 0 0;\n  color: rgba(255, 255, 255, 0.94);\n  font-size: 0.84rem;\n  font-weight: 850;\n  text-shadow: 0 1px 6px rgba(0, 0, 0, 0.42);\n}\n.profile-impressions-popup .profile-impressions-person-overlay p .mat-icon {\n  width: 18px;\n  height: 18px;\n  font-size: 18px;\n  line-height: 18px;\n}\n.profile-impressions-popup .profile-impressions-person-overlay small {\n  display: block;\n  margin-top: 0.42rem;\n  color: rgba(255, 255, 255, 0.86);\n  font-size: 0.76rem;\n  font-weight: 800;\n  line-height: 1.35;\n}\n.profile-impressions-popup .profile-impressions-empty-state {\n  min-height: 260px;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  gap: 0.5rem;\n  padding: 2rem;\n  border: 1px dashed rgba(48, 78, 116, 0.28);\n  border-radius: 14px;\n  background:\n    linear-gradient(\n      180deg,\n      #f8fbff 0%,\n      #f2f7fb 100%);\n  color: #30435f;\n  text-align: center;\n}\n.profile-impressions-popup .profile-impressions-empty-state .mat-icon {\n  width: 32px;\n  height: 32px;\n  font-size: 32px;\n  line-height: 32px;\n  color: #64809f;\n}\n.profile-impressions-popup .profile-impressions-empty-state strong {\n  font-size: 1rem;\n  font-weight: 900;\n}\n.profile-impressions-popup .profile-impressions-empty-state span {\n  max-width: 320px;\n  color: #62738b;\n  font-size: 0.84rem;\n  font-weight: 700;\n  line-height: 1.35;\n}\n.profile-impressions-popup .social-proof-grid {\n  display: grid;\n  width: min(980px, 100%);\n  margin: 0 auto;\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n  gap: 0.9rem;\n  justify-items: stretch;\n}\n.profile-impressions-popup .social-proof-card.social-proof-card-modern {\n  position: relative;\n  max-width: none;\n  min-height: auto;\n  padding: 7rem 1rem 1.05rem;\n  border-radius: 14px;\n  border: 1px solid rgba(29, 42, 68, 0.14);\n  background:\n    linear-gradient(\n      180deg,\n      #f8f7fc 0%,\n      #f2f2f8 100%);\n  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.78), 0 4px 12px rgba(24, 33, 54, 0.05);\n}\n.profile-impressions-popup .social-proof-card.social-proof-card-modern.impression-shortcut-tone-platinum {\n  border-color: rgba(72, 160, 183, 0.22);\n  background:\n    linear-gradient(\n      180deg,\n      #f6fdff 0%,\n      #eef8fb 100%);\n}\n.profile-impressions-popup .social-proof-card.social-proof-card-modern.impression-shortcut-tone-gold {\n  border-color: rgba(189, 141, 51, 0.2);\n  background:\n    linear-gradient(\n      180deg,\n      #fffcf5 0%,\n      #fff7ec 100%);\n}\n.profile-impressions-popup .social-proof-card.social-proof-card-modern.impression-shortcut-tone-silver {\n  border-color: rgba(111, 134, 164, 0.2);\n  background:\n    linear-gradient(\n      180deg,\n      #f7faff 0%,\n      #eef3f9 100%);\n}\n.profile-impressions-popup .social-proof-card.social-proof-card-modern.impression-shortcut-tone-bronze {\n  border-color: rgba(178, 103, 62, 0.2);\n  background:\n    linear-gradient(\n      180deg,\n      #fff8f4 0%,\n      #fef0e6 100%);\n}\n.profile-impressions-popup .social-proof-card.social-proof-card-modern.impression-shortcut-tone-empath {\n  border-color: rgba(184, 92, 116, 0.22);\n  background:\n    linear-gradient(\n      180deg,\n      #fff8fa 0%,\n      #fef0f4 100%);\n}\n.profile-impressions-popup .social-proof-card.social-proof-card-modern.impression-shortcut-tone-creative {\n  border-color: rgba(122, 76, 196, 0.2);\n  background:\n    linear-gradient(\n      180deg,\n      #faf7ff 0%,\n      #f1ebfd 100%);\n}\n.profile-impressions-popup .social-proof-card.social-proof-card-modern.impression-shortcut-tone-reliable {\n  border-color: rgba(61, 146, 94, 0.2);\n  background:\n    linear-gradient(\n      180deg,\n      #f6fcf7 0%,\n      #edf7ef 100%);\n}\n.profile-impressions-popup .social-proof-card.social-proof-card-modern.impression-shortcut-tone-adventurer {\n  border-color: rgba(47, 139, 174, 0.2);\n  background:\n    linear-gradient(\n      180deg,\n      #f5fbff 0%,\n      #ecf6fb 100%);\n}\n.profile-impressions-popup .social-proof-card.social-proof-card-modern.impression-shortcut-tone-thinker {\n  border-color: rgba(80, 108, 168, 0.2);\n  background:\n    linear-gradient(\n      180deg,\n      #f7f9ff 0%,\n      #edf1fb 100%);\n}\n.profile-impressions-popup .social-proof-card.social-proof-card-modern.impression-shortcut-tone-social {\n  border-color: rgba(45, 138, 139, 0.2);\n  background:\n    linear-gradient(\n      180deg,\n      #f5fcfc 0%,\n      #ebf7f7 100%);\n}\n.profile-impressions-popup .social-proof-card.social-proof-card-modern.impression-shortcut-tone-playful {\n  border-color: rgba(183, 95, 47, 0.2);\n  background:\n    linear-gradient(\n      180deg,\n      #fff9f4 0%,\n      #fef1e7 100%);\n}\n.profile-impressions-popup .social-proof-card.social-proof-card-modern.impression-shortcut-tone-ambitious {\n  border-color: rgba(79, 113, 190, 0.2);\n  background:\n    linear-gradient(\n      180deg,\n      #f6f9ff 0%,\n      #edf2fb 100%);\n}\n.profile-impressions-popup .social-proof-card.social-proof-card-modern .social-proof-section-block:first-of-type {\n  margin-top: 0;\n}\n.profile-impressions-popup .social-proof-identity-pill {\n  position: absolute;\n  top: 0;\n  left: 0;\n  transform: translate(-0.36rem, -0.42rem);\n  display: inline-flex;\n  width: fit-content;\n  max-width: 100%;\n  min-height: 36px;\n  margin: 0;\n  padding: 0.34rem 0.72rem;\n  align-items: center;\n  gap: 0.45rem;\n  border-radius: 14px;\n  border: 1px solid rgba(140, 118, 206, 0.4);\n  background:\n    linear-gradient(\n      180deg,\n      #efeaff 0%,\n      #e5ddfb 100%);\n  color: #2e3153;\n  font-size: clamp(0.84rem, 1.05vw, 1.02rem);\n  font-weight: 800;\n  line-height: 1;\n  z-index: 3;\n  box-shadow: 0 4px 10px rgba(31, 44, 70, 0.16);\n}\n.profile-impressions-popup .social-proof-card.social-proof-card-modern .social-proof-identity-pill .mat-icon {\n  width: 18px;\n  height: 18px;\n  font-size: 18px;\n  line-height: 18px;\n}\n.profile-impressions-popup .social-proof-identity-label {\n  display: inline-flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  gap: 0.1rem;\n  line-height: 1;\n  text-align: center;\n}\n.profile-impressions-popup .social-proof-identity-main {\n  font-size: 0.94em;\n  font-weight: 800;\n  line-height: 1.05;\n  letter-spacing: 0.01em;\n}\n.profile-impressions-popup .social-proof-identity-sub {\n  font-size: 0.72em;\n  font-weight: 700;\n  line-height: 1.08;\n  letter-spacing: 0.07em;\n  opacity: 0.86;\n  text-transform: uppercase;\n}\n.profile-impressions-popup .social-proof-identity-pill-host {\n  background:\n    linear-gradient(\n      180deg,\n      #e9f9ff 0%,\n      #d9f0fb 100%);\n  border-color: rgba(72, 160, 183, 0.44);\n  color: #204f67;\n}\n.profile-impressions-popup .social-proof-identity-pill-member {\n  background:\n    linear-gradient(\n      180deg,\n      #fff0f4 0%,\n      #fde6ee 100%);\n  border-color: rgba(184, 92, 116, 0.4);\n  color: #7d3550;\n}\n.profile-impressions-popup .social-proof-identity-pill-member .mat-icon {\n  color: #c05779;\n}\n.profile-impressions-popup .popup-impressions-badge {\n  position: absolute;\n  top: 3.5rem;\n  left: 50%;\n  z-index: 1;\n  display: inline-flex;\n  width: min(21rem, 100% - 1rem);\n  max-width: none;\n  align-items: stretch;\n  overflow: hidden;\n  border: 1px solid rgba(106, 118, 142, 0.24);\n  border-radius: 14px;\n  transform: translateX(-50%);\n}\n.profile-impressions-popup .popup-impressions-badge-updated {\n  animation: profile-popup-impressions-badge-blink 0.44s ease;\n}\n.profile-impressions-popup .popup-impressions-badge-segment {\n  display: flex;\n  min-height: 40px;\n  min-width: 0;\n  flex: 1 1 0;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  gap: 0.08rem;\n  padding: 0.34rem 0.58rem;\n  border-right: 1px solid rgba(106, 118, 142, 0.22);\n  text-align: center;\n}\n.profile-impressions-popup .popup-impressions-badge-segment:last-child {\n  border-right: 0;\n}\n.profile-impressions-popup .popup-impressions-badge-label {\n  font-family: inherit;\n  font-size: 0.7rem;\n  font-weight: 700;\n  line-height: 1.08;\n  letter-spacing: 0.03em;\n  text-transform: uppercase;\n  text-align: center;\n  white-space: normal;\n  overflow-wrap: anywhere;\n}\n.profile-impressions-popup .popup-impressions-badge-value {\n  color: #111827;\n  font-size: 0.78rem;\n  font-weight: 900;\n  line-height: 1.05;\n  white-space: nowrap;\n}\n.profile-impressions-popup .popup-impressions-rate-rate {\n  border-color: rgba(179, 127, 49, 0.24);\n  background: #fff7ec;\n}\n.profile-impressions-popup .popup-impressions-rate-people {\n  border-color: rgba(53, 126, 83, 0.24);\n  background: #eff8f3;\n}\n.profile-impressions-popup .popup-impressions-rate-return {\n  border-color: rgba(89, 93, 162, 0.24);\n  background: #f3f3ff;\n}\n.profile-impressions-popup .social-proof-section-block {\n  margin-top: 0.52rem;\n}\n.profile-impressions-popup .social-proof-section-head {\n  display: flex;\n  align-items: center;\n  justify-content: flex-start;\n  gap: 0.52rem;\n  margin-bottom: 0.56rem;\n}\n.profile-impressions-popup .section-tag {\n  display: inline-flex;\n  min-height: 28px;\n  align-items: center;\n  justify-content: center;\n  padding: 0.16rem 0.78rem;\n  border-radius: 999px;\n  background:\n    linear-gradient(\n      180deg,\n      #ece9f8 0%,\n      #e4e0f3 100%);\n  color: #59577b;\n  font-size: 0.68rem;\n  font-weight: 800;\n  letter-spacing: 0.05em;\n  text-transform: uppercase;\n  white-space: nowrap;\n}\n.profile-impressions-popup .section-line {\n  height: 1px;\n  flex: 1;\n  background: rgba(113, 124, 150, 0.32);\n}\n.profile-impressions-popup .social-proof-section-head.section-vibe .section-tag {\n  background:\n    linear-gradient(\n      180deg,\n      #eaf2ff 0%,\n      #dfeafa 100%);\n  color: #2d5ea8;\n}\n.profile-impressions-popup .social-proof-section-head.section-vibe .section-line {\n  background: rgba(59, 108, 179, 0.34);\n}\n.profile-impressions-popup .social-proof-section-head.section-category .section-tag {\n  background:\n    linear-gradient(\n      180deg,\n      #e9f7ef 0%,\n      #def1e7 100%);\n  color: #2d7d47;\n}\n.profile-impressions-popup .social-proof-section-head.section-category .section-line {\n  background: rgba(45, 125, 71, 0.34);\n}\n.profile-impressions-popup .social-proof-section-head.section-personality .section-tag {\n  background:\n    linear-gradient(\n      180deg,\n      #f0ebfb 0%,\n      #e7def7 100%);\n  color: #6a45a3;\n}\n.profile-impressions-popup .social-proof-section-head.section-personality .section-line {\n  background: rgba(106, 69, 163, 0.34);\n}\n.profile-impressions-popup .social-proof-chip-list {\n  display: flex;\n  flex-wrap: wrap;\n  justify-content: flex-start;\n  gap: 0.28rem;\n}\n.profile-impressions-popup .social-proof-chip {\n  display: inline-flex;\n  width: fit-content;\n  max-width: 100%;\n  min-height: 24px;\n  align-items: center;\n  justify-content: center;\n  padding: 0.16rem 0.52rem;\n  border: 1px solid rgba(107, 119, 146, 0.33);\n  border-radius: 999px;\n  background:\n    linear-gradient(\n      180deg,\n      #f4f5fb 0%,\n      #eceef8 100%);\n  color: #243a67;\n  font-size: clamp(0.66rem, 0.9vw, 0.8rem);\n  font-weight: 800;\n  line-height: 1.15;\n  text-align: center;\n  white-space: nowrap;\n}\n.profile-impressions-popup .personality-trait-carousel {\n  display: flex;\n  flex-direction: column;\n  gap: 0.55rem;\n}\n.profile-impressions-popup .personality-trait-pill-strip {\n  display: grid;\n  grid-template-columns: repeat(3, minmax(0, 1fr));\n  gap: 0.38rem;\n}\n.profile-impressions-popup .personality-trait-pill {\n  --trait-accent: #6a45a3;\n  --trait-accent-soft: rgba(106, 69, 163, 0.18);\n  --trait-surface:\n    linear-gradient(\n      180deg,\n      #fbf8ff 0%,\n      #f2ebff 100%);\n  position: relative;\n  overflow: hidden;\n  display: grid;\n  gap: 0.12rem;\n  padding: 0.52rem 0.6rem;\n  border: 1px solid rgba(116, 127, 156, 0.22);\n  border-radius: 14px;\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 255, 255, 0.94) 0%,\n      rgba(243, 245, 250, 0.98) 100%);\n  color: #3b4560;\n  text-align: left;\n  cursor: pointer;\n  transition:\n    border-color 0.18s ease,\n    box-shadow 0.18s ease,\n    background 0.18s ease;\n}\n.profile-impressions-popup .personality-trait-pill:hover {\n  border-color: rgba(89, 108, 153, 0.34);\n  box-shadow: 0 6px 16px rgba(37, 45, 68, 0.08);\n}\n.profile-impressions-popup .personality-trait-pill.is-active {\n  border-color: rgba(255, 255, 255, 0.96);\n  background: var(--trait-surface);\n  box-shadow:\n    0 0 0 1.5px var(--trait-accent-soft),\n    inset 0 0 0 1px rgba(255, 255, 255, 0.92),\n    0 8px 22px color-mix(in srgb, var(--trait-accent) 14%, transparent);\n}\n.profile-impressions-popup .personality-trait-pill.is-active .personality-trait-pill-rank,\n.profile-impressions-popup .personality-trait-pill.is-active .personality-trait-pill-percent {\n  color: var(--trait-accent);\n}\n.profile-impressions-popup .personality-trait-pill-rank {\n  color: #7b859e;\n  font-size: 0.66rem;\n  font-weight: 800;\n  letter-spacing: 0.08em;\n  text-transform: uppercase;\n}\n.profile-impressions-popup .personality-trait-pill-label {\n  color: #1f2937;\n  font-size: 0.82rem;\n  font-weight: 900;\n  line-height: 1.12;\n}\n.profile-impressions-popup .personality-trait-pill-percent {\n  color: #4d618a;\n  font-size: 0.76rem;\n  font-weight: 800;\n}\n.profile-impressions-popup .personality-trait-card {\n  --trait-accent: #6a45a3;\n  --trait-accent-soft: rgba(106, 69, 163, 0.18);\n  --trait-surface:\n    linear-gradient(\n      180deg,\n      #fbf8ff 0%,\n      #f2ebff 100%);\n  display: flex;\n  flex-direction: column;\n  gap: 0.55rem;\n  padding: 0.82rem 0.84rem 0.88rem;\n  border: 1px solid var(--trait-accent-soft);\n  border-radius: 18px;\n  background: var(--trait-surface);\n  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.9), 0 10px 24px rgba(41, 49, 70, 0.08);\n}\n.profile-impressions-popup .personality-trait-card-head {\n  display: flex;\n  align-items: flex-start;\n  justify-content: space-between;\n  gap: 0.75rem;\n}\n.profile-impressions-popup .personality-trait-card-title {\n  display: flex;\n  align-items: center;\n  gap: 0.72rem;\n}\n.profile-impressions-popup .personality-trait-card-title strong {\n  display: block;\n  color: #1f2937;\n  font-size: 0.98rem;\n  font-weight: 900;\n  line-height: 1.1;\n}\n.profile-impressions-popup .personality-trait-card-title p {\n  margin: 0.18rem 0 0;\n  color: #56627f;\n  font-size: 0.77rem;\n  font-weight: 700;\n  line-height: 1.3;\n}\n.profile-impressions-popup .personality-trait-card-icon {\n  display: inline-flex;\n  width: 2.45rem;\n  height: 2.45rem;\n  align-items: center;\n  justify-content: center;\n  border-radius: 999px;\n  background: rgba(255, 255, 255, 0.75);\n  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.94);\n  color: var(--trait-accent);\n}\n.profile-impressions-popup .personality-trait-card-icon .mat-icon {\n  width: 1.25rem;\n  height: 1.25rem;\n  font-size: 1.25rem;\n  line-height: 1.25rem;\n}\n.profile-impressions-popup .personality-trait-card-percent {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  min-width: 3rem;\n  min-height: 2.1rem;\n  padding: 0.2rem 0.55rem;\n  border-radius: 999px;\n  background: rgba(255, 255, 255, 0.82);\n  color: var(--trait-accent);\n  font-size: 0.94rem;\n  font-weight: 900;\n  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.94);\n}\n.profile-impressions-popup .personality-trait-card-bar {\n  position: relative;\n  height: 0.48rem;\n  overflow: hidden;\n  border-radius: 999px;\n  background: rgba(91, 103, 130, 0.12);\n}\n.profile-impressions-popup .personality-trait-card-bar span {\n  display: block;\n  height: 100%;\n  border-radius: inherit;\n  background:\n    linear-gradient(\n      90deg,\n      var(--trait-accent) 0%,\n      color-mix(in srgb, var(--trait-accent) 68%, white) 100%);\n  box-shadow: 0 4px 12px color-mix(in srgb, var(--trait-accent) 30%, transparent);\n}\n.profile-impressions-popup .personality-trait-card-meta {\n  display: flex;\n  flex-wrap: wrap;\n  align-items: center;\n  gap: 0.4rem 0.7rem;\n  color: #5d6783;\n  font-size: 0.72rem;\n  font-weight: 800;\n}\n.profile-impressions-popup .personality-trait-card-highlights {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 0.28rem;\n}\n.profile-impressions-popup .personality-trait-card.trait-tone-social,\n.profile-impressions-popup .personality-trait-pill.trait-tone-social {\n  --trait-accent: #dd5c82;\n  --trait-accent-soft: rgba(221, 92, 130, 0.22);\n  --trait-surface:\n    linear-gradient(\n      180deg,\n      #fff7fb 0%,\n      #fdebf3 100%);\n}\n.profile-impressions-popup .personality-trait-card.trait-tone-deep,\n.profile-impressions-popup .personality-trait-pill.trait-tone-deep {\n  --trait-accent: #5a66b4;\n  --trait-accent-soft: rgba(90, 102, 180, 0.2);\n  --trait-surface:\n    linear-gradient(\n      180deg,\n      #f7f8ff 0%,\n      #ebedff 100%);\n}\n.profile-impressions-popup .personality-trait-card.trait-tone-adventure,\n.profile-impressions-popup .personality-trait-pill.trait-tone-adventure {\n  --trait-accent: #eb8b2d;\n  --trait-accent-soft: rgba(235, 139, 45, 0.22);\n  --trait-surface:\n    linear-gradient(\n      180deg,\n      #fff8ef 0%,\n      #ffefd9 100%);\n}\n.profile-impressions-popup .personality-trait-card.trait-tone-reliable,\n.profile-impressions-popup .personality-trait-pill.trait-tone-reliable {\n  --trait-accent: #2f8b7a;\n  --trait-accent-soft: rgba(47, 139, 122, 0.22);\n  --trait-surface:\n    linear-gradient(\n      180deg,\n      #f3fffb 0%,\n      #e2f7f0 100%);\n}\n.profile-impressions-popup .personality-trait-card.trait-tone-creative,\n.profile-impressions-popup .personality-trait-pill.trait-tone-creative {\n  --trait-accent: #8b5fd1;\n  --trait-accent-soft: rgba(139, 95, 209, 0.22);\n  --trait-surface:\n    linear-gradient(\n      180deg,\n      #fbf7ff 0%,\n      #f0e7ff 100%);\n}\n.profile-impressions-popup .personality-trait-card.trait-tone-empath,\n.profile-impressions-popup .personality-trait-pill.trait-tone-empath {\n  --trait-accent: #d15f77;\n  --trait-accent-soft: rgba(209, 95, 119, 0.22);\n  --trait-surface:\n    linear-gradient(\n      180deg,\n      #fff8f8 0%,\n      #fdebed 100%);\n}\n.profile-impressions-popup .personality-trait-card.trait-tone-ambitious,\n.profile-impressions-popup .personality-trait-pill.trait-tone-ambitious {\n  --trait-accent: #406ecf;\n  --trait-accent-soft: rgba(64, 110, 207, 0.22);\n  --trait-surface:\n    linear-gradient(\n      180deg,\n      #f7faff 0%,\n      #e9f1ff 100%);\n}\n.profile-impressions-popup .personality-trait-card.trait-tone-playful,\n.profile-impressions-popup .personality-trait-pill.trait-tone-playful {\n  --trait-accent: #d77b2f;\n  --trait-accent-soft: rgba(215, 123, 47, 0.22);\n  --trait-surface:\n    linear-gradient(\n      180deg,\n      #fffaf2 0%,\n      #ffeedb 100%);\n}\n.profile-impressions-popup .social-proof-chip.chip-personality {\n  color: #4d3e69;\n}\n.profile-impressions-popup .social-proof-chip.chip-category {\n  color: #2c5e46;\n}\n.profile-impressions-popup .impressions-chip-list-updated .social-proof-chip {\n  animation: profile-popup-impressions-chip-pulse 0.38s ease;\n}\n.profile-impressions-popup .impressions-chip-list-updated .social-proof-chip:nth-child(2n) {\n  animation-delay: 0.04s;\n}\n.profile-impressions-popup .impressions-chip-list-updated .social-proof-chip:nth-child(3n) {\n  animation-delay: 0.08s;\n}\n@keyframes profile-popup-impressions-badge-blink {\n  0% {\n    filter: brightness(1) saturate(1);\n  }\n  45% {\n    filter: brightness(1.08) saturate(1.06);\n  }\n  100% {\n    filter: brightness(1) saturate(1);\n  }\n}\n@keyframes profile-popup-impressions-chip-pulse {\n  0% {\n    transform: translateY(0) scale(1);\n    filter: brightness(1);\n  }\n  45% {\n    transform: translateY(-1px) scale(1.02);\n    filter: brightness(1.08);\n  }\n  100% {\n    transform: translateY(0) scale(1);\n    filter: brightness(1);\n  }\n}\n@media (max-width: 760px) {\n  .profile-impressions-popup {\n    padding: 0.05rem;\n  }\n  .profile-impressions-popup .profile-impressions-person-card {\n    width: min(280px, 100%);\n  }\n  .profile-impressions-popup .social-proof-grid {\n    grid-template-columns: minmax(0, 1fr);\n    gap: 1.1rem;\n  }\n  .profile-impressions-popup .social-proof-card.social-proof-card-modern {\n    padding-top: 6rem;\n  }\n  .profile-impressions-popup .social-proof-identity-pill {\n    min-height: 32px;\n    padding: 0.25rem 0.56rem;\n    transform: translate(-0.18rem, -0.34rem);\n    font-size: 0.8rem;\n  }\n  .profile-impressions-popup .popup-impressions-badge {\n    top: 3rem;\n    display: inline-flex;\n    max-width: calc(100% - 2px);\n    flex-wrap: nowrap;\n  }\n  .profile-impressions-popup .popup-impressions-badge-segment {\n    min-height: 34px;\n    min-width: 0;\n    flex: 1 1 0;\n    padding: 0.2rem 0.34rem;\n  }\n  .profile-impressions-popup .popup-impressions-badge-label {\n    display: -webkit-box;\n    width: 100%;\n    min-width: 0;\n    font-size: 0.7rem;\n    overflow: hidden;\n    -webkit-box-orient: vertical;\n    -webkit-line-clamp: 2;\n    text-align: center;\n    white-space: normal;\n    overflow-wrap: anywhere;\n  }\n  .profile-impressions-popup .popup-impressions-badge-value {\n    font-size: 0.72rem;\n    white-space: nowrap;\n  }\n  .profile-impressions-popup .personality-trait-pill-strip {\n    grid-template-columns: repeat(3, minmax(0, 1fr));\n    gap: 0.28rem;\n  }\n  .profile-impressions-popup .personality-trait-pill {\n    gap: 0.08rem;\n    padding: 0.38rem 0.34rem;\n    border-radius: 12px;\n  }\n  .profile-impressions-popup .personality-trait-pill-rank {\n    font-size: 0.56rem;\n    letter-spacing: 0.05em;\n  }\n  .profile-impressions-popup .personality-trait-pill-label {\n    font-size: 0.72rem;\n  }\n  .profile-impressions-popup .personality-trait-pill-percent {\n    font-size: 0.66rem;\n  }\n  .profile-impressions-popup .personality-trait-card-head {\n    flex-direction: column;\n  }\n  .profile-impressions-popup .personality-trait-card-percent {\n    min-width: 0;\n  }\n}\n/*# sourceMappingURL=impressions-popup.component.css.map */\n'] }]
  }], () => [], { onWindowEscape: [{
    type: HostListener,
    args: ["window:keydown.escape", ["$event"]]
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ProfileImpressionsPopupComponent, { className: "ProfileImpressionsPopupComponent", filePath: "app/profile/components/impressions-popup/impressions-popup.component.ts", lineNumber: 98 });
})();
export {
  ProfileImpressionsPopupComponent
};
//# sourceMappingURL=impressions-popup.component-A7IQPQT2.js.map
