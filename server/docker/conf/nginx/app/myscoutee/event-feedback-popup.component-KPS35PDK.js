import "./chunk-ODDEQXQS.js";
import "./chunk-AN73Y4IE.js";
import "./chunk-GNEKNDCW.js";
import "./chunk-WYVDSPFZ.js";
import "./chunk-BUOFGNAG.js";
import "./chunk-KRAZWVUD.js";
import "./chunk-2VWK4OSJ.js";
import "./chunk-ES5OB5SK.js";
import "./chunk-SYKOEE4K.js";
import {
  MemberMenuStore
} from "./chunk-KQF6FQ63.js";
import {
  ActivitiesPopupStore
} from "./chunk-3YAFT4SR.js";
import {
  SmartListComponent
} from "./chunk-Y4B3F23A.js";
import "./chunk-QYKZJD5O.js";
import "./chunk-RED67KQG.js";
import "./chunk-2K5TOPNO.js";
import {
  FormFlowComponent
} from "./chunk-P2HUD7M2.js";
import "./chunk-K3APHISM.js";
import "./chunk-6Y23C6K6.js";
import {
  EventFeedbackFilterMenuConverter,
  EventFeedbackFormFlowConverter,
  EventFeedbackInfoCardConverter,
  EventFeedbackListPresentationConverter,
  EventFeedbackOrganizerCarouselSectionConverter,
  EventFeedbackOrganizerInfoCardConverter,
  EventFeedbackOrganizerItemConverter,
  EventFeedbackOrganizerMessageGroupConverter
} from "./chunk-LMBNG6A3.js";
import "./chunk-G54GNJUE.js";
import "./chunk-CHNSKMNQ.js";
import "./chunk-MCKAV5IN.js";
import {
  InfoCardComponent
} from "./chunk-TKEWFTMJ.js";
import "./chunk-4VYYFWRA.js";
import "./chunk-QEZI4ZBE.js";
import "./chunk-HM5TGMNU.js";
import "./chunk-NG77W5PE.js";
import {
  PopupComponent
} from "./chunk-JP2VWQOK.js";
import "./chunk-VEYRCVMX.js";
import "./chunk-MVR37RGJ.js";
import {
  DefaultValueAccessor,
  FormsModule,
  IndicatorComponent,
  NgControlStatus,
  NgControlStatusGroup,
  NgForm,
  NgModel,
  ɵNgNoValidate
} from "./chunk-FOAFZS65.js";
import "./chunk-OAYWPJGG.js";
import {
  DialogStore
} from "./chunk-6TR3Z2F3.js";
import "./chunk-U46O4F4Y.js";
import {
  MatIcon,
  MatIconModule
} from "./chunk-EDHGCWPF.js";
import "./chunk-CUDLB52K.js";
import "./chunk-DZBHLGEX.js";
import "./chunk-ZJ74HL3J.js";
import {
  ExplanationGuideService
} from "./chunk-4TW3IAAR.js";
import {
  EventsService
} from "./chunk-4AR3TCEY.js";
import "./chunk-PK4DOAMC.js";
import {
  AppRuntimeStore
} from "./chunk-XDZ3ISNV.js";
import "./chunk-XQJEDEHI.js";
import "./chunk-BHFMDA67.js";
import "./chunk-Q3344WPR.js";
import "./chunk-ILMZK7SM.js";
import "./chunk-4FWVIYNI.js";
import "./chunk-7MTG4XZU.js";
import {
  CommonModule,
  NgClass
} from "./chunk-J7IJFFQ2.js";
import "./chunk-XQACYBVS.js";
import "./chunk-YKC4KBEC.js";
import "./chunk-B2DKYQGD.js";
import {
  ActivityStore,
  UserProfileStore
} from "./chunk-KLUOB5SD.js";
import {
  EventFeedbackDetailDto,
  EventFeedbackPageResultDto
} from "./chunk-6POEHVT7.js";
import "./chunk-2ENBQWLU.js";
import "./chunk-LERGHE7K.js";
import "./chunk-D6ZHKNYF.js";
import "./chunk-SKAK727J.js";
import {
  Component,
  TemplateRef,
  ViewChild,
  __spreadProps,
  __spreadValues,
  computed,
  effect,
  from,
  inject,
  setClassMetadata,
  signal,
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
  ɵɵloadQuery,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵpureFunction1,
  ɵɵpureFunction2,
  ɵɵqueryRefresh,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIdentity,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵsanitizeUrl,
  ɵɵstyleProp,
  ɵɵtemplate,
  ɵɵtemplateRefExtractor,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2,
  ɵɵtextInterpolate3,
  ɵɵviewQuery
} from "./chunk-XJL7SWH7.js";

// src/app/activity/components/event-feedback-popup/event-feedback-popup.component.ts
var _c0 = ["eventFeedbackItemTemplate"];
var _c1 = ["eventFeedbackSmartList"];
var _c2 = (a0) => ({ menu: "info-card", card: a0 });
var _c3 = (a0, a1) => [a0, a1];
var _forTrack0 = ($index, $item) => $item.key;
var _forTrack1 = ($index, $item) => $item.dayKey;
var _forTrack2 = ($index, $item) => $item.id;
function EventFeedbackPopupComponent_Conditional_1_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 7);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.eventFeedbackListSubmitMessage());
  }
}
function EventFeedbackPopupComponent_Conditional_1_ng_template_6_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 9)(1, "app-info-card", 10);
    \u0275\u0275listener("mediaEndClick", function EventFeedbackPopupComponent_Conditional_1_ng_template_6_Template_app_info_card_mediaEndClick_1_listener() {
      const item_r4 = \u0275\u0275restoreView(_r3).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.onEventFeedbackCardPrimaryAction(item_r4));
    })("menuAction", function EventFeedbackPopupComponent_Conditional_1_ng_template_6_Template_app_info_card_menuAction_1_listener($event) {
      const item_r4 = \u0275\u0275restoreView(_r3).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.onEventFeedbackCardMenuAction(item_r4, $event));
    });
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const item_r4 = ctx.$implicit;
    \u0275\u0275classProp("is-feedbacked", item_r4.status === "feedbacked")("is-removed", item_r4.status === "removed")("is-own-event", item_r4.status === "own-event");
    \u0275\u0275advance();
    \u0275\u0275property("card", item_r4)("useSharedMenuTrigger", true)("sharedMenuContext", \u0275\u0275pureFunction1(9, _c2, item_r4));
  }
}
function EventFeedbackPopupComponent_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 5)(1, "app-popup", 4)(2, "div", 6);
    \u0275\u0275conditionalCreate(3, EventFeedbackPopupComponent_Conditional_1_Conditional_3_Template, 2, 1, "div", 7);
    \u0275\u0275elementStart(4, "app-smart-list", 8, 0);
    \u0275\u0275listener("menuItemSelect", function EventFeedbackPopupComponent_Conditional_1_Template_app_smart_list_menuItemSelect_4_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onEventFeedbackDispatchedMenuSelect($event));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275template(6, EventFeedbackPopupComponent_Conditional_1_ng_template_6_Template, 2, 11, "ng-template", null, 1, \u0275\u0275templateRefExtractor);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275classProp("event-feedback-parent-hidden", ctx_r1.isStackedPopupOpen());
    \u0275\u0275advance();
    \u0275\u0275property("model", ctx_r1.eventFeedbackPopupModel())("zIndex", ctx_r1.eventFeedbackPopupZIndex());
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r1.eventFeedbackListSubmitMessage() ? 3 : -1);
    \u0275\u0275advance();
    \u0275\u0275property("config", ctx_r1.eventFeedbackSmartListConfig)("loadPage", ctx_r1.eventFeedbackSmartListLoadPage)("itemTemplate", ctx_r1.eventFeedbackItemTemplateRef ?? null)("query", ctx_r1.eventFeedbackSmartListQuery);
  }
}
function EventFeedbackPopupComponent_Conditional_2_Conditional_2_Conditional_1_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "article", 16);
    \u0275\u0275element(1, "app-indicator", 18);
    \u0275\u0275elementStart(2, "span");
    \u0275\u0275text(3, "Loading feedback");
    \u0275\u0275elementEnd()();
  }
}
function EventFeedbackPopupComponent_Conditional_2_Conditional_2_Conditional_1_Conditional_1_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 7);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(5);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.eventFeedbackSubmitMessage());
  }
}
function EventFeedbackPopupComponent_Conditional_2_Conditional_2_Conditional_1_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "article", 17)(1, "app-form-flow", 19);
    \u0275\u0275listener("save", function EventFeedbackPopupComponent_Conditional_2_Conditional_2_Conditional_1_Conditional_1_Template_app_form_flow_save_1_listener($event) {
      \u0275\u0275restoreView(_r5);
      const ctx_r1 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r1.onEventFeedbackFlowSave($event));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(2, EventFeedbackPopupComponent_Conditional_2_Conditional_2_Conditional_1_Conditional_1_Conditional_2_Template, 2, 1, "div", 7);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(4);
    \u0275\u0275advance();
    \u0275\u0275property("model", ctx_r1.eventFeedbackFlowModel())("ngModel", ctx_r1.eventFeedbackDetailValue())("saving", ctx_r1.eventFeedbackSubmitting())("disabled", ctx_r1.eventFeedbackSubmitting());
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.eventFeedbackSubmitMessage() ? 2 : -1);
  }
}
function EventFeedbackPopupComponent_Conditional_2_Conditional_2_Conditional_1_Conditional_2_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 7);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(5);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.eventFeedbackSubmitMessage());
  }
}
function EventFeedbackPopupComponent_Conditional_2_Conditional_2_Conditional_1_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "article", 15);
    \u0275\u0275conditionalCreate(1, EventFeedbackPopupComponent_Conditional_2_Conditional_2_Conditional_1_Conditional_2_Conditional_1_Template, 2, 1, "div", 7);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(4);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.eventFeedbackSubmitMessage() ? 1 : -1);
  }
}
function EventFeedbackPopupComponent_Conditional_2_Conditional_2_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, EventFeedbackPopupComponent_Conditional_2_Conditional_2_Conditional_1_Conditional_0_Template, 4, 0, "article", 16)(1, EventFeedbackPopupComponent_Conditional_2_Conditional_2_Conditional_1_Conditional_1_Template, 3, 5, "article", 17)(2, EventFeedbackPopupComponent_Conditional_2_Conditional_2_Conditional_1_Conditional_2_Template, 2, 1, "article", 15);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275conditional(ctx_r1.eventFeedbackDetailLoading() ? 0 : ctx_r1.hasEventFeedbackCards() ? 1 : 2);
  }
}
function EventFeedbackPopupComponent_Conditional_2_Conditional_2_Conditional_2_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 7);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(4);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.eventFeedbackSubmitMessage());
  }
}
function EventFeedbackPopupComponent_Conditional_2_Conditional_2_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "article", 15);
    \u0275\u0275conditionalCreate(1, EventFeedbackPopupComponent_Conditional_2_Conditional_2_Conditional_2_Conditional_1_Template, 2, 1, "div", 7);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.eventFeedbackSubmitMessage() ? 1 : -1);
  }
}
function EventFeedbackPopupComponent_Conditional_2_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 12);
    \u0275\u0275conditionalCreate(1, EventFeedbackPopupComponent_Conditional_2_Conditional_2_Conditional_1_Template, 3, 1)(2, EventFeedbackPopupComponent_Conditional_2_Conditional_2_Conditional_2_Template, 2, 1, "article", 15);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275conditional(!ctx_r1.eventFeedbackSubmitted() ? 1 : 2);
  }
}
function EventFeedbackPopupComponent_Conditional_2_Conditional_3_Conditional_1_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 21);
    \u0275\u0275element(1, "app-indicator", 18);
    \u0275\u0275elementEnd();
  }
}
function EventFeedbackPopupComponent_Conditional_2_Conditional_3_Conditional_1_Conditional_2_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "app-info-card", 24);
  }
  if (rf & 2) {
    \u0275\u0275property("card", ctx);
  }
}
function EventFeedbackPopupComponent_Conditional_2_Conditional_3_Conditional_1_Conditional_2_Conditional_3_For_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 32);
    \u0275\u0275listener("click", function EventFeedbackPopupComponent_Conditional_2_Conditional_3_Conditional_1_Conditional_2_Conditional_3_For_4_Template_button_click_0_listener() {
      const \u0275$index_88_r7 = \u0275\u0275restoreView(_r6).$index;
      const ctx_r1 = \u0275\u0275nextContext(6);
      return \u0275\u0275resetView(ctx_r1.selectOrganizerEventFeedbackCarousel(\u0275$index_88_r7));
    });
    \u0275\u0275elementStart(1, "span", 33)(2, "span", 34);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "span", 35);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const section_r8 = ctx.$implicit;
    const \u0275$index_88_r7 = ctx.$index;
    const ctx_r1 = \u0275\u0275nextContext(6);
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction2(5, _c3, section_r8.toneClass, ctx_r1.organizerEventFeedbackCarouselIndex() === \u0275$index_88_r7 ? "is-active" : ""));
    \u0275\u0275attribute("aria-label", "Open organizer feedback section " + section_r8.label);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(section_r8.label);
    \u0275\u0275advance();
    \u0275\u0275attribute("title", section_r8.topCount + " of " + section_r8.responseCount + " responses selected this");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", section_r8.topCount, " ");
  }
}
function EventFeedbackPopupComponent_Conditional_2_Conditional_3_Conditional_1_Conditional_2_Conditional_3_Conditional_5_For_20_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 42)(1, "mat-icon");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "strong");
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const stat_r9 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(stat_r9.icon);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(stat_r9.label);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(stat_r9.count);
  }
}
function EventFeedbackPopupComponent_Conditional_2_Conditional_3_Conditional_1_Conditional_2_Conditional_3_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 31)(1, "div", 36)(2, "div", 37)(3, "span", 38)(4, "mat-icon");
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "div")(7, "strong");
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "p");
    \u0275\u0275text(10);
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(11, "div", 39);
    \u0275\u0275element(12, "span");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "div", 40)(14, "span");
    \u0275\u0275text(15);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "span");
    \u0275\u0275text(17);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(18, "div", 41);
    \u0275\u0275repeaterCreate(19, EventFeedbackPopupComponent_Conditional_2_Conditional_3_Conditional_1_Conditional_2_Conditional_3_Conditional_5_For_20_Template, 7, 3, "span", 42, _forTrack0);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const section_r10 = ctx;
    \u0275\u0275property("ngClass", section_r10.toneClass);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(section_r10.icon);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(section_r10.topLabel);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(section_r10.subtitle);
    \u0275\u0275advance(2);
    \u0275\u0275styleProp("width", section_r10.progressPercent, "%");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate3(" ", section_r10.topCount, " of ", section_r10.responseCount, " ", section_r10.responseCount === 1 ? "response" : "responses", " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate2(" ", section_r10.optionCount, " ", section_r10.optionCount === 1 ? "option" : "options", " ");
    \u0275\u0275advance(2);
    \u0275\u0275repeater(section_r10.items);
  }
}
function EventFeedbackPopupComponent_Conditional_2_Conditional_3_Conditional_1_Conditional_2_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "section", 25)(1, "div", 28)(2, "div", 29);
    \u0275\u0275repeaterCreate(3, EventFeedbackPopupComponent_Conditional_2_Conditional_3_Conditional_1_Conditional_2_Conditional_3_For_4_Template, 6, 8, "button", 30, _forTrack0);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(5, EventFeedbackPopupComponent_Conditional_2_Conditional_3_Conditional_1_Conditional_2_Conditional_3_Conditional_5_Template, 21, 11, "div", 31);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    let tmp_7_0;
    const ctx_r1 = \u0275\u0275nextContext(5);
    \u0275\u0275advance(3);
    \u0275\u0275repeater(ctx_r1.organizerEventFeedbackCarouselSections());
    \u0275\u0275advance(2);
    \u0275\u0275conditional((tmp_7_0 = ctx_r1.organizerEventFeedbackActiveCarouselSection()) ? 5 : -1, tmp_7_0);
  }
}
function EventFeedbackPopupComponent_Conditional_2_Conditional_3_Conditional_1_Conditional_2_Conditional_5_For_1_For_4_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "img", 48);
  }
  if (rf & 2) {
    const message_r11 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275property("src", message_r11.viewerImageUrl, \u0275\u0275sanitizeUrl)("alt", message_r11.viewerName);
  }
}
function EventFeedbackPopupComponent_Conditional_2_Conditional_3_Conditional_1_Conditional_2_Conditional_5_For_1_For_4_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const message_r11 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(message_r11.viewerInitials);
  }
}
function EventFeedbackPopupComponent_Conditional_2_Conditional_3_Conditional_1_Conditional_2_Conditional_5_For_1_For_4_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 51);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const message_r11 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(message_r11.overallLabel);
  }
}
function EventFeedbackPopupComponent_Conditional_2_Conditional_3_Conditional_1_Conditional_2_Conditional_5_For_1_For_4_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 51);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const message_r11 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(message_r11.improveLabel);
  }
}
function EventFeedbackPopupComponent_Conditional_2_Conditional_3_Conditional_1_Conditional_2_Conditional_5_For_1_For_4_For_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 52);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const traitLabel_r12 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(traitLabel_r12);
  }
}
function EventFeedbackPopupComponent_Conditional_2_Conditional_3_Conditional_1_Conditional_2_Conditional_5_For_1_For_4_Conditional_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 53)(1, "strong");
    \u0275\u0275text(2, "Event opinion");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "p");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const message_r11 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(message_r11.eventComment);
  }
}
function EventFeedbackPopupComponent_Conditional_2_Conditional_3_Conditional_1_Conditional_2_Conditional_5_For_1_For_4_Conditional_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 54)(1, "strong");
    \u0275\u0275text(2, "Note to organizer");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "p");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const message_r11 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(message_r11.organizerNote);
  }
}
function EventFeedbackPopupComponent_Conditional_2_Conditional_3_Conditional_1_Conditional_2_Conditional_5_For_1_For_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "article", 45)(1, "div", 46)(2, "div", 47);
    \u0275\u0275conditionalCreate(3, EventFeedbackPopupComponent_Conditional_2_Conditional_3_Conditional_1_Conditional_2_Conditional_5_For_1_For_4_Conditional_3_Template, 1, 2, "img", 48)(4, EventFeedbackPopupComponent_Conditional_2_Conditional_3_Conditional_1_Conditional_2_Conditional_5_For_1_For_4_Conditional_4_Template, 2, 1, "span");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "div", 49)(6, "h5");
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "p");
    \u0275\u0275text(9);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(10, "div", 50);
    \u0275\u0275conditionalCreate(11, EventFeedbackPopupComponent_Conditional_2_Conditional_3_Conditional_1_Conditional_2_Conditional_5_For_1_For_4_Conditional_11_Template, 2, 1, "span", 51);
    \u0275\u0275conditionalCreate(12, EventFeedbackPopupComponent_Conditional_2_Conditional_3_Conditional_1_Conditional_2_Conditional_5_For_1_For_4_Conditional_12_Template, 2, 1, "span", 51);
    \u0275\u0275repeaterCreate(13, EventFeedbackPopupComponent_Conditional_2_Conditional_3_Conditional_1_Conditional_2_Conditional_5_For_1_For_4_For_14_Template, 2, 1, "span", 52, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(15, EventFeedbackPopupComponent_Conditional_2_Conditional_3_Conditional_1_Conditional_2_Conditional_5_For_1_For_4_Conditional_15_Template, 5, 1, "div", 53);
    \u0275\u0275conditionalCreate(16, EventFeedbackPopupComponent_Conditional_2_Conditional_3_Conditional_1_Conditional_2_Conditional_5_For_1_For_4_Conditional_16_Template, 5, 1, "div", 54);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const message_r11 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275property("ngClass", "user-color-" + message_r11.viewerGender);
    \u0275\u0275advance();
    \u0275\u0275conditional(message_r11.viewerImageUrl ? 3 : 4);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(message_r11.viewerName);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(message_r11.timeLabel || "Recent feedback");
    \u0275\u0275advance(2);
    \u0275\u0275conditional(message_r11.overallLabel ? 11 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(message_r11.improveLabel ? 12 : -1);
    \u0275\u0275advance();
    \u0275\u0275repeater(message_r11.traitLabels);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(message_r11.eventComment ? 15 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(message_r11.organizerNote ? 16 : -1);
  }
}
function EventFeedbackPopupComponent_Conditional_2_Conditional_3_Conditional_1_Conditional_2_Conditional_5_For_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 43);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "div", 44);
    \u0275\u0275repeaterCreate(3, EventFeedbackPopupComponent_Conditional_2_Conditional_3_Conditional_1_Conditional_2_Conditional_5_For_1_For_4_Template, 17, 8, "article", 45, _forTrack2);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const group_r13 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(group_r13.label);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(group_r13.items);
  }
}
function EventFeedbackPopupComponent_Conditional_2_Conditional_3_Conditional_1_Conditional_2_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275repeaterCreate(0, EventFeedbackPopupComponent_Conditional_2_Conditional_3_Conditional_1_Conditional_2_Conditional_5_For_1_Template, 5, 1, null, null, _forTrack1);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(5);
    \u0275\u0275repeater(ctx_r1.organizerEventFeedbackMessageGroups());
  }
}
function EventFeedbackPopupComponent_Conditional_2_Conditional_3_Conditional_1_Conditional_2_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 27);
    \u0275\u0275text(1, "No feedback has been submitted for this event yet.");
    \u0275\u0275elementEnd();
  }
}
function EventFeedbackPopupComponent_Conditional_2_Conditional_3_Conditional_1_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 22)(1, "div", 23);
    \u0275\u0275conditionalCreate(2, EventFeedbackPopupComponent_Conditional_2_Conditional_3_Conditional_1_Conditional_2_Conditional_2_Template, 1, 1, "app-info-card", 24);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(3, EventFeedbackPopupComponent_Conditional_2_Conditional_3_Conditional_1_Conditional_2_Conditional_3_Template, 6, 1, "section", 25);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "section", 26);
    \u0275\u0275conditionalCreate(5, EventFeedbackPopupComponent_Conditional_2_Conditional_3_Conditional_1_Conditional_2_Conditional_5_Template, 2, 0)(6, EventFeedbackPopupComponent_Conditional_2_Conditional_3_Conditional_1_Conditional_2_Conditional_6_Template, 2, 0, "p", 27);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_5_0;
    const ctx_r1 = \u0275\u0275nextContext(4);
    \u0275\u0275advance(2);
    \u0275\u0275conditional((tmp_5_0 = ctx_r1.selectedOrganizerEventFeedbackInfoCard()) ? 2 : -1, tmp_5_0);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.organizerEventFeedbackCarouselSections().length > 0 ? 3 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r1.organizerEventFeedbackMessageGroups().length > 0 ? 5 : 6);
  }
}
function EventFeedbackPopupComponent_Conditional_2_Conditional_3_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "article", 20);
    \u0275\u0275conditionalCreate(1, EventFeedbackPopupComponent_Conditional_2_Conditional_3_Conditional_1_Conditional_1_Template, 2, 0, "div", 21)(2, EventFeedbackPopupComponent_Conditional_2_Conditional_3_Conditional_1_Conditional_2_Template, 7, 3);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.organizerEventFeedbackStatLoading() ? 1 : 2);
  }
}
function EventFeedbackPopupComponent_Conditional_2_Conditional_3_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "article", 15)(1, "p");
    \u0275\u0275text(2, "Choose an own event to review its feedback.");
    \u0275\u0275elementEnd()();
  }
}
function EventFeedbackPopupComponent_Conditional_2_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 13);
    \u0275\u0275conditionalCreate(1, EventFeedbackPopupComponent_Conditional_2_Conditional_3_Conditional_1_Template, 3, 1, "article", 20)(2, EventFeedbackPopupComponent_Conditional_2_Conditional_3_Conditional_2_Template, 3, 0, "article", 15);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_2_0;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_2_0 = ctx_r1.selectedOrganizerEventFeedbackItem()) ? 1 : 2, tmp_2_0);
  }
}
function EventFeedbackPopupComponent_Conditional_2_Conditional_4_Conditional_1_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 56);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(4);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.eventFeedbackNoteSubmitMessage());
  }
}
function EventFeedbackPopupComponent_Conditional_2_Conditional_4_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r14 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "article", 55)(1, "h4");
    \u0275\u0275text(2, "Organizer Feedback");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "p");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(5, EventFeedbackPopupComponent_Conditional_2_Conditional_4_Conditional_1_Conditional_5_Template, 2, 1, "div", 56);
    \u0275\u0275elementStart(6, "form", 57);
    \u0275\u0275listener("ngSubmit", function EventFeedbackPopupComponent_Conditional_2_Conditional_4_Conditional_1_Template_form_ngSubmit_6_listener() {
      \u0275\u0275restoreView(_r14);
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.submitEventFeedbackNote());
    });
    \u0275\u0275elementStart(7, "label")(8, "span");
    \u0275\u0275text(9, "Feedback");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "textarea", 58);
    \u0275\u0275listener("ngModelChange", function EventFeedbackPopupComponent_Conditional_2_Conditional_4_Conditional_1_Template_textarea_ngModelChange_10_listener($event) {
      \u0275\u0275restoreView(_r14);
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.eventFeedbackNoteForm.set({ eventId: ctx_r1.eventFeedbackNoteForm().eventId, text: $event }));
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(11, "div", 59)(12, "button", 60);
    \u0275\u0275listener("click", function EventFeedbackPopupComponent_Conditional_2_Conditional_4_Conditional_1_Template_button_click_12_listener() {
      \u0275\u0275restoreView(_r14);
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.closeStackedPopup());
    });
    \u0275\u0275text(13, "Cancel");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "button", 61);
    \u0275\u0275text(15, "Submit feedback");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1("Add textual feedback for the event organizer of ", ctx_r1.eventFeedbackCurrentEventTitle(), ".");
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.eventFeedbackNoteSubmitMessage() ? 5 : -1);
    \u0275\u0275advance(5);
    \u0275\u0275property("ngModel", ctx_r1.eventFeedbackNoteForm().text);
    \u0275\u0275advance(4);
    \u0275\u0275property("disabled", !ctx_r1.canSubmitEventFeedbackNote());
  }
}
function EventFeedbackPopupComponent_Conditional_2_Conditional_4_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r15 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "article", 15)(1, "div", 7);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 59)(4, "button", 62);
    \u0275\u0275listener("click", function EventFeedbackPopupComponent_Conditional_2_Conditional_4_Conditional_2_Template_button_click_4_listener() {
      \u0275\u0275restoreView(_r15);
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.closeStackedPopup());
    });
    \u0275\u0275text(5, "Done");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.eventFeedbackNoteSubmitMessage());
  }
}
function EventFeedbackPopupComponent_Conditional_2_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 14);
    \u0275\u0275conditionalCreate(1, EventFeedbackPopupComponent_Conditional_2_Conditional_4_Conditional_1_Template, 16, 4, "article", 55)(2, EventFeedbackPopupComponent_Conditional_2_Conditional_4_Conditional_2_Template, 6, 1, "article", 15);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275conditional(!ctx_r1.eventFeedbackNoteSubmitted() ? 1 : 2);
  }
}
function EventFeedbackPopupComponent_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "app-popup", 4)(1, "div", 11);
    \u0275\u0275conditionalCreate(2, EventFeedbackPopupComponent_Conditional_2_Conditional_2_Template, 3, 1, "div", 12);
    \u0275\u0275conditionalCreate(3, EventFeedbackPopupComponent_Conditional_2_Conditional_3_Template, 3, 1, "div", 13);
    \u0275\u0275conditionalCreate(4, EventFeedbackPopupComponent_Conditional_2_Conditional_4_Template, 3, 1, "div", 14);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("model", ctx_r1.eventFeedbackStackedPopupModel())("zIndex", ctx_r1.eventFeedbackStackedPopupZIndex());
    \u0275\u0275advance();
    \u0275\u0275classProp("event-feedback-stacked-content--detail", ctx_r1.stackedPopupMode() === "eventFeedback")("event-feedback-stacked-content--organizer", ctx_r1.stackedPopupMode() === "organizerEventFeedback")("event-feedback-stacked-content--note", ctx_r1.stackedPopupMode() === "eventFeedbackNote");
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.stackedPopupMode() === "eventFeedback" ? 2 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.stackedPopupMode() === "organizerEventFeedback" ? 3 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.stackedPopupMode() === "eventFeedbackNote" ? 4 : -1);
  }
}
var EventFeedbackPopupComponent = class _EventFeedbackPopupComponent {
  userProfileStore = inject(UserProfileStore);
  runtimeStore = inject(AppRuntimeStore);
  activityStore = inject(ActivityStore);
  memberMenuStore = inject(MemberMenuStore);
  activitiesPopupStore = inject(ActivitiesPopupStore);
  eventsService = inject(EventsService);
  explanationGuide = inject(ExplanationGuideService);
  dialogStore = inject(DialogStore);
  unregisterExplanationContext = null;
  explanationContextActive = false;
  lastHandledNavigatorEventFeedbackRequestMs = 0;
  lastAppliedEventFeedbackSubmitUpdatedMs = 0;
  eventFeedbackRealtimeContextKey = "";
  eventFeedbackRealtimeCounters;
  eventFeedbackRealtimeRefreshInFlight = false;
  eventFeedbackRealtimeRefreshQueued = false;
  isPopupOpen = signal(false, ...ngDevMode ? [{ debugName: "isPopupOpen" }] : (
    /* istanbul ignore next */
    []
  ));
  isStackedPopupOpen = signal(false, ...ngDevMode ? [{ debugName: "isStackedPopupOpen" }] : (
    /* istanbul ignore next */
    []
  ));
  stackedPopupMode = signal(null, ...ngDevMode ? [{ debugName: "stackedPopupMode" }] : (
    /* istanbul ignore next */
    []
  ));
  eventFeedbackListFilter = signal("pending", ...ngDevMode ? [{ debugName: "eventFeedbackListFilter" }] : (
    /* istanbul ignore next */
    []
  ));
  eventFeedbackListSubmitMessage = signal("", ...ngDevMode ? [{ debugName: "eventFeedbackListSubmitMessage" }] : (
    /* istanbul ignore next */
    []
  ));
  selectedEventFeedbackEventId = signal(null, ...ngDevMode ? [{ debugName: "selectedEventFeedbackEventId" }] : (
    /* istanbul ignore next */
    []
  ));
  selectedOrganizerEventFeedbackEventId = signal(null, ...ngDevMode ? [{ debugName: "selectedOrganizerEventFeedbackEventId" }] : (
    /* istanbul ignore next */
    []
  ));
  organizerEventFeedbackStatDto = signal(null, ...ngDevMode ? [{ debugName: "organizerEventFeedbackStatDto" }] : (
    /* istanbul ignore next */
    []
  ));
  organizerEventFeedbackStatLoading = signal(false, ...ngDevMode ? [{ debugName: "organizerEventFeedbackStatLoading" }] : (
    /* istanbul ignore next */
    []
  ));
  eventFeedbackNoteForm = signal({ eventId: "", text: "" }, ...ngDevMode ? [{ debugName: "eventFeedbackNoteForm" }] : (
    /* istanbul ignore next */
    []
  ));
  eventFeedbackNoteSubmitted = signal(false, ...ngDevMode ? [{ debugName: "eventFeedbackNoteSubmitted" }] : (
    /* istanbul ignore next */
    []
  ));
  eventFeedbackNoteSubmitMessage = signal("", ...ngDevMode ? [{ debugName: "eventFeedbackNoteSubmitMessage" }] : (
    /* istanbul ignore next */
    []
  ));
  eventFeedbackNoteSaving = signal(false, ...ngDevMode ? [{ debugName: "eventFeedbackNoteSaving" }] : (
    /* istanbul ignore next */
    []
  ));
  eventFeedbackPageResult = signal(null, ...ngDevMode ? [{ debugName: "eventFeedbackPageResult" }] : (
    /* istanbul ignore next */
    []
  ));
  eventFeedbackDetailDto = signal(null, ...ngDevMode ? [{ debugName: "eventFeedbackDetailDto" }] : (
    /* istanbul ignore next */
    []
  ));
  eventFeedbackDetailValue = signal(new EventFeedbackDetailDto(), ...ngDevMode ? [{ debugName: "eventFeedbackDetailValue" }] : (
    /* istanbul ignore next */
    []
  ));
  eventFeedbackDetailLoading = signal(false, ...ngDevMode ? [{ debugName: "eventFeedbackDetailLoading" }] : (
    /* istanbul ignore next */
    []
  ));
  eventFeedbackSubmitting = signal(false, ...ngDevMode ? [{ debugName: "eventFeedbackSubmitting" }] : (
    /* istanbul ignore next */
    []
  ));
  eventFeedbackSubmitMessage = signal("", ...ngDevMode ? [{ debugName: "eventFeedbackSubmitMessage" }] : (
    /* istanbul ignore next */
    []
  ));
  eventFeedbackSubmitted = signal(false, ...ngDevMode ? [{ debugName: "eventFeedbackSubmitted" }] : (
    /* istanbul ignore next */
    []
  ));
  hasEventFeedbackCards = computed(() => (this.eventFeedbackDetailDto()?.cards.length ?? 0) > 0, ...ngDevMode ? [{ debugName: "hasEventFeedbackCards" }] : (
    /* istanbul ignore next */
    []
  ));
  eventFeedbackFilterCountDelta = signal({}, ...ngDevMode ? [{ debugName: "eventFeedbackFilterCountDelta" }] : (
    /* istanbul ignore next */
    []
  ));
  organizerEventFeedbackStatRequestKey = "";
  eventFeedbackFilterMenu = computed(() => EventFeedbackFilterMenuConverter.convert({
    result: this.eventFeedbackPageResult(),
    activeFilter: this.eventFeedbackListFilter(),
    delta: this.eventFeedbackFilterCountDelta()
  }), ...ngDevMode ? [{ debugName: "eventFeedbackFilterMenu" }] : (
    /* istanbul ignore next */
    []
  ));
  organizerEventFeedbackItems = computed(() => {
    const result = this.eventFeedbackPageResult();
    return result ? EventFeedbackOrganizerItemConverter.convertList(result.organizerItems, { result }) : [];
  }, ...ngDevMode ? [{ debugName: "organizerEventFeedbackItems" }] : (
    /* istanbul ignore next */
    []
  ));
  selectedOrganizerEventFeedbackItem = computed(() => {
    const eventId = this.selectedOrganizerEventFeedbackEventId()?.trim() ?? "";
    if (!eventId) {
      return null;
    }
    return this.organizerEventFeedbackItems().find((item) => item.eventId === eventId) ?? null;
  }, ...ngDevMode ? [{ debugName: "selectedOrganizerEventFeedbackItem" }] : (
    /* istanbul ignore next */
    []
  ));
  selectedOrganizerEventFeedbackInfoCard = computed(() => {
    const item = this.selectedOrganizerEventFeedbackItem();
    return item ? EventFeedbackOrganizerInfoCardConverter.convert(item, { showAction: false }) : null;
  }, ...ngDevMode ? [{ debugName: "selectedOrganizerEventFeedbackInfoCard" }] : (
    /* istanbul ignore next */
    []
  ));
  organizerEventFeedbackMessageGroups = computed(() => EventFeedbackOrganizerMessageGroupConverter.convert({
    result: this.eventFeedbackPageResult(),
    eventId: this.selectedOrganizerEventFeedbackEventId() ?? ""
  }), ...ngDevMode ? [{ debugName: "organizerEventFeedbackMessageGroups" }] : (
    /* istanbul ignore next */
    []
  ));
  organizerEventFeedbackCarouselIndex = signal(0, ...ngDevMode ? [{ debugName: "organizerEventFeedbackCarouselIndex" }] : (
    /* istanbul ignore next */
    []
  ));
  organizerEventFeedbackCarouselSections = computed(() => EventFeedbackOrganizerCarouselSectionConverter.convert({
    stat: this.organizerEventFeedbackStatDto()
  }), ...ngDevMode ? [{ debugName: "organizerEventFeedbackCarouselSections" }] : (
    /* istanbul ignore next */
    []
  ));
  organizerEventFeedbackActiveCarouselSection = computed(() => {
    const sections = this.organizerEventFeedbackCarouselSections();
    if (sections.length === 0) {
      return null;
    }
    return sections[this.organizerEventFeedbackCarouselIndex()] ?? sections[0] ?? null;
  }, ...ngDevMode ? [{ debugName: "organizerEventFeedbackActiveCarouselSection" }] : (
    /* istanbul ignore next */
    []
  ));
  eventFeedbackSmartListQuery = {
    filters: {
      filter: "pending",
      userId: ""
    }
  };
  eventFeedbackItemTemplateRef;
  set eventFeedbackItemTemplate(value) {
    this.eventFeedbackItemTemplateRef = value;
  }
  eventFeedbackSmartList;
  eventFeedbackSmartListLoadPage = (query) => from(this.loadEventFeedbackPage(query));
  eventFeedbackSmartListConfig = {
    pageSize: 12,
    defaultView: "list",
    headerProgress: {
      enabled: true,
      state: () => this.runtimeStore.isOnline() ? "active" : "inactive"
    },
    emptyLabel: "Event Feedback",
    emptyDescription: (query) => EventFeedbackListPresentationConverter.convert({
      result: this.eventFeedbackPageResult(),
      filter: query.filters?.filter ?? "pending"
    }).emptyDescription,
    showStickyHeader: true,
    showGroupMarker: ({ groupIndex, scrollable }) => groupIndex > 0 || scrollable,
    groupBy: (item, query) => EventFeedbackListPresentationConverter.convert({
      result: this.eventFeedbackPageResult(),
      itemId: item.id,
      filter: query.filters?.filter ?? this.eventFeedbackListFilter()
    }).groupLabel,
    listLayout: "card-grid",
    desktopColumns: 3,
    snapMode: "mandatory",
    scrollPaddingTop: "2.6rem",
    stickyHeaderClass: "event-feedback-sticky-header",
    containerClass: {
      "experience-card-list": true,
      "assets-card-list": true,
      "event-feedback-event-list": true
    },
    trackBy: (_index, item) => item.id
  };
  eventFeedbackPopupModel() {
    return {
      title: "Event Feedback",
      ariaLabel: "Event Feedback",
      closeAriaLabel: "Close",
      size: "wide",
      height: "full",
      headerTone: "accent",
      bodyLayout: "fill",
      headerControls: this.eventFeedbackPopupHeaderControls(),
      onClose: (event) => this.closePopup(event),
      onMenuSelect: (event) => this.onEventFeedbackPopupMenuSelect(event)
    };
  }
  eventFeedbackPopupZIndex() {
    return 12500;
  }
  eventFeedbackStackedPopupModel() {
    const isFullHeight = this.stackedPopupMode() === "eventFeedback" || this.stackedPopupMode() === "organizerEventFeedback";
    return {
      title: this.eventFeedbackStackedPopupTitle(),
      subtitle: this.eventFeedbackStackedPopupSubtitle(),
      ariaLabel: this.eventFeedbackStackedPopupTitle(),
      closeAriaLabel: "Close",
      size: isFullHeight ? "wide" : "default",
      height: isFullHeight ? "full" : "auto",
      headerTone: "accent",
      bodyLayout: isFullHeight ? "fill" : "default",
      backdropTone: "dim",
      onClose: (event) => this.closeStackedPopup(event)
    };
  }
  eventFeedbackStackedPopupZIndex() {
    return 12600;
  }
  eventFeedbackPopupHeaderControls() {
    const filterMenu = this.eventFeedbackFilterMenu();
    return [{
      kind: "menu",
      id: "event-feedback-filter",
      trigger: filterMenu.trigger,
      items: filterMenu.items,
      mobileBreakpointPx: 900
    }];
  }
  eventFeedbackStackedPopupTitle() {
    switch (this.stackedPopupMode()) {
      case "eventFeedback":
        return "Event Feedback";
      case "organizerEventFeedback":
        return "Own Event Feedback";
      default:
        return "Organizer Feedback";
    }
  }
  eventFeedbackStackedPopupSubtitle() {
    if (this.stackedPopupMode() !== "eventFeedback" && this.stackedPopupMode() !== "organizerEventFeedback") {
      return null;
    }
    return this.eventFeedbackCurrentEventTitle();
  }
  onEventFeedbackPopupMenuSelect(event) {
    this.onEventFeedbackMenuSelect(event.itemSelect);
  }
  onEventFeedbackMenuSelect(event) {
    if (event.context?.menu !== "filter") {
      return;
    }
    this.selectEventFeedbackListFilter(event.context.filter, event.sourceEvent);
  }
  onEventFeedbackDispatchedMenuSelect(event) {
    const context = event.context;
    if (context?.menu !== "info-card") {
      return;
    }
    this.onEventFeedbackCardMenuAction(context.card, {
      id: context.card.id,
      actionId: context.action.id,
      action: context.action,
      card: context.card
    });
  }
  constructor() {
    effect(() => {
      this.setExplanationContext(this.isPopupOpen());
    });
    effect(() => {
      const request = this.memberMenuStore.navigatorEventFeedbackRequest();
      if (!request || request.updatedMs <= this.lastHandledNavigatorEventFeedbackRequestMs) {
        return;
      }
      this.lastHandledNavigatorEventFeedbackRequestMs = request.updatedMs;
      this.memberMenuStore.clearNavigatorEventFeedbackRequest();
      this.openPopup();
    });
    effect(() => {
      const filter = this.eventFeedbackListFilter();
      const userId = this.userProfileStore.activeUserId().trim();
      const currentFilters = this.eventFeedbackSmartListQuery.filters;
      if (currentFilters?.filter === filter && currentFilters?.userId === userId) {
        return;
      }
      this.eventFeedbackSmartListQuery = {
        filters: {
          filter,
          userId
        }
      };
    });
    effect(() => {
      const selectedEventId = this.selectedOrganizerEventFeedbackEventId();
      const stackedMode = this.stackedPopupMode();
      if (stackedMode !== "organizerEventFeedback" || !selectedEventId) {
        return;
      }
      this.organizerEventFeedbackCarouselIndex.set(0);
    });
    effect(() => {
      const sections = this.organizerEventFeedbackCarouselSections();
      const currentIndex = this.organizerEventFeedbackCarouselIndex();
      if (sections.length === 0) {
        if (currentIndex !== 0) {
          this.organizerEventFeedbackCarouselIndex.set(0);
        }
        return;
      }
      if (currentIndex >= sections.length) {
        this.organizerEventFeedbackCarouselIndex.set(sections.length - 1);
      }
    });
    effect(() => {
      const isOpen = this.isPopupOpen();
      const userId = this.activeUserId();
      const counters = this.activityStore.counterOverridesByUserId()[userId]?.eventFeedback;
      const contextKey = `${isOpen ? "open" : "closed"}:${userId}`;
      if (contextKey !== this.eventFeedbackRealtimeContextKey) {
        this.eventFeedbackRealtimeContextKey = contextKey;
        this.eventFeedbackRealtimeCounters = counters;
        return;
      }
      if (!isOpen || !userId || counters === this.eventFeedbackRealtimeCounters) {
        this.eventFeedbackRealtimeCounters = counters;
        return;
      }
      this.eventFeedbackRealtimeCounters = counters;
      this.queueEventFeedbackRealtimeRefresh();
    });
    effect(() => {
      const sync = this.activityStore.activityEventFeedbackSubmitSync();
      if (!sync || sync.updatedMs <= this.lastAppliedEventFeedbackSubmitUpdatedMs) {
        return;
      }
      this.lastAppliedEventFeedbackSubmitUpdatedMs = sync.updatedMs;
      this.applyActivityEventFeedbackSubmitSync(sync.dto);
    });
  }
  ngOnDestroy() {
    this.clearExplanationContext();
  }
  queueEventFeedbackRealtimeRefresh() {
    if (!this.isPopupOpen()) {
      return;
    }
    if (this.eventFeedbackRealtimeRefreshInFlight) {
      this.eventFeedbackRealtimeRefreshQueued = true;
      return;
    }
    const smartList = this.eventFeedbackSmartList;
    if (!smartList) {
      return;
    }
    this.eventFeedbackRealtimeRefreshInFlight = true;
    void smartList.refreshVisibleItems().catch(() => void 0).finally(() => {
      this.eventFeedbackRealtimeRefreshInFlight = false;
      if (!this.eventFeedbackRealtimeRefreshQueued) {
        return;
      }
      this.eventFeedbackRealtimeRefreshQueued = false;
      this.queueEventFeedbackRealtimeRefresh();
    });
  }
  openPopup() {
    this.eventFeedbackListFilter.set("pending");
    this.eventFeedbackListSubmitMessage.set("");
    this.selectedEventFeedbackEventId.set(null);
    this.selectedOrganizerEventFeedbackEventId.set(null);
    this.clearOrganizerEventFeedbackStat();
    this.eventFeedbackPageResult.set(null);
    this.eventFeedbackFilterCountDelta.set({});
    this.isPopupOpen.set(true);
  }
  setExplanationContext(isOpen) {
    if (this.explanationContextActive === isOpen) {
      return;
    }
    this.clearExplanationContext();
    if (isOpen) {
      this.explanationContextActive = true;
      this.unregisterExplanationContext = this.explanationGuide.registerContext("event.feedback");
    }
  }
  clearExplanationContext() {
    this.unregisterExplanationContext?.();
    this.unregisterExplanationContext = null;
    this.explanationContextActive = false;
  }
  closePopup(event) {
    event?.stopPropagation();
    this.isPopupOpen.set(false);
  }
  closeStackedPopup(event) {
    event?.stopPropagation();
    this.isStackedPopupOpen.set(false);
    this.stackedPopupMode.set(null);
    this.selectedOrganizerEventFeedbackEventId.set(null);
    this.clearOrganizerEventFeedbackStat();
  }
  selectEventFeedbackListFilter(filter, event) {
    event?.stopPropagation();
    this.eventFeedbackListFilter.set(filter);
    this.selectedOrganizerEventFeedbackEventId.set(null);
    this.clearOrganizerEventFeedbackStat();
  }
  eventFeedbackCurrentEventTitle() {
    const eventId = this.selectedOrganizerEventFeedbackEventId() ?? this.selectedEventFeedbackEventId() ?? this.eventFeedbackNoteForm().eventId;
    return this.eventFeedbackPageResult()?.eventTitleById(eventId) ?? "this event";
  }
  openEventFeedbackDetail(item, event) {
    event?.stopPropagation();
    this.selectedEventFeedbackEventId.set(item.eventId);
    this.stackedPopupMode.set("eventFeedback");
    this.isStackedPopupOpen.set(true);
  }
  isEventFeedbackDetailLoadCurrent(eventId) {
    return this.selectedEventFeedbackEventId() === eventId.trim() && this.stackedPopupMode() === "eventFeedback";
  }
  completeEmptyEventFeedbackDetail(title) {
    this.eventFeedbackListSubmitMessage.set(`${title} is already in Feedbacked.`);
    this.eventFeedbackListFilter.set("feedbacked");
    this.closeStackedPopup();
  }
  openEventFeedbackNotePopup(item, event) {
    event?.stopPropagation();
    this.selectedEventFeedbackEventId.set(item.eventId);
    this.eventFeedbackNoteForm.set({
      eventId: item.eventId,
      text: this.eventFeedbackPageResult()?.state.organizerNotesByEventId[item.eventId]?.trim() ?? ""
    });
    this.eventFeedbackNoteSubmitted.set(false);
    this.eventFeedbackNoteSubmitMessage.set("");
    this.stackedPopupMode.set("eventFeedbackNote");
    this.isStackedPopupOpen.set(true);
  }
  canSubmitEventFeedbackNote() {
    return !this.eventFeedbackNoteSaving() && this.eventFeedbackNoteForm().text.trim().length >= 8;
  }
  applyEventFeedbackNoteSubmitted() {
    if (this.eventFeedbackNoteForm().text.trim().length < 8) {
      return;
    }
    const noteForm = this.eventFeedbackNoteForm();
    const eventId = noteForm.eventId.trim();
    const trimmedText = noteForm.text.trim();
    this.eventFeedbackPageResult.update((result) => result?.patchOrganizerNote(eventId, trimmedText) ?? null);
    this.eventFeedbackNoteSubmitted.set(true);
    const message = `Organizer feedback saved for ${this.eventFeedbackCurrentEventTitle()}.`;
    this.eventFeedbackNoteSubmitMessage.set(message);
    this.eventFeedbackListSubmitMessage.set(message);
  }
  patchEventFeedbackItem(before, after) {
    const pageResult = this.eventFeedbackPageResult();
    const delta = pageResult?.filterCountDelta(before, after) ?? {};
    this.eventFeedbackFilterCountDelta.update((current) => __spreadProps(__spreadValues({}, current), {
      "own-events": (current["own-events"] ?? 0) + (delta["own-events"] ?? 0),
      pending: (current.pending ?? 0) + (delta.pending ?? 0),
      feedbacked: (current.feedbacked ?? 0) + (delta.feedbacked ?? 0),
      removed: (current.removed ?? 0) + (delta.removed ?? 0)
    }));
    this.eventFeedbackPageResult.set(pageResult?.patchItem(after) ?? null);
  }
  applyEventFeedbackItemRemoved(item) {
    const pageResult = this.eventFeedbackPageResult();
    this.patchEventFeedbackItem(item, pageResult?.removeItem(item) ?? item);
    this.eventFeedbackListSubmitMessage.set(`${item.title} moved to Removed without feedback.`);
  }
  applyEventFeedbackItemRestored(item) {
    const pageResult = this.eventFeedbackPageResult();
    this.patchEventFeedbackItem(item, pageResult?.restoreItem(item) ?? item);
    this.eventFeedbackListSubmitMessage.set(`${item.title} moved back to Pending.`);
  }
  onEventFeedbackCardPrimaryAction(card) {
    const item = this.eventFeedbackPageResult()?.itemById(card.id) ?? null;
    if (!item) {
      return;
    }
    if (item.isOwnEvent) {
      this.openOrganizerEventFeedback(item.eventId);
      return;
    }
    if (!(this.eventFeedbackPageResult()?.itemMatchesFilter(item, "pending") ?? false)) {
      return;
    }
    void this.startEventFeedback(item);
  }
  onEventFeedbackCardMenuAction(card, event) {
    const item = this.eventFeedbackPageResult()?.itemById(card.id) ?? null;
    if (!item) {
      return;
    }
    if (item.isOwnEvent) {
      return;
    }
    if (event.actionId === "startFeedback") {
      void this.startEventFeedback(item);
      return;
    }
    if (event.actionId === "removeFeedback") {
      this.openRemoveEventFeedbackDialog(item);
      return;
    }
    if (event.actionId === "restoreFeedback") {
      this.openRestoreEventFeedbackDialog(item);
      return;
    }
    if (event.actionId === "viewSubmittedFeedback") {
      void this.openSubmittedEventFeedback(item);
      return;
    }
    this.openEventFeedbackNotePopup(item);
  }
  async openSubmittedEventFeedback(item) {
    if (!item.isFeedbacked) {
      return;
    }
    await this.activitiesPopupStore.ensureEventFeedbackRatedDetailPopupLoaded();
    this.activitiesPopupStore.openEventFeedbackRatedDetail({
      userId: this.activeUserId(),
      eventId: item.eventId,
      eventTitle: item.title
    });
  }
  openRemoveEventFeedbackDialog(item) {
    this.openEventFeedbackDialog(this.eventFeedbackDialogContent("remove"), async () => {
      await this.eventsService.removeEventFeedbackEvent(this.activeUserId(), item.eventId);
      this.applyEventFeedbackItemRemoved(item);
      this.removeVisibleEventFeedbackItem(item.eventId);
    });
  }
  openRestoreEventFeedbackDialog(item) {
    this.openEventFeedbackDialog(this.eventFeedbackDialogContent("restore"), async () => {
      await this.eventsService.restoreEventFeedbackEvent(this.activeUserId(), item.eventId);
      this.applyEventFeedbackItemRestored(item);
      this.removeVisibleEventFeedbackItem(item.eventId);
    });
  }
  openEventFeedbackDialog(content, onConfirm) {
    this.dialogStore.open(__spreadProps(__spreadValues({}, content), {
      onConfirm
    }));
  }
  eventFeedbackDialogContent(action) {
    if (action === "remove") {
      return {
        title: "event.feedback.confirm.remove.title",
        message: "event.feedback.confirm.remove.message",
        warningMessage: "event.feedback.confirm.remove.warning",
        confirmLabel: "remove",
        busyConfirmLabel: "removing",
        confirmTone: "danger",
        failureMessage: "event.feedback.confirm.remove.failure"
      };
    }
    return {
      title: "event.feedback.confirm.restore.title",
      message: "event.feedback.confirm.restore.message",
      confirmLabel: "restore.feedback",
      busyConfirmLabel: "restoring",
      confirmTone: "accent",
      failureMessage: "event.feedback.confirm.restore.failure"
    };
  }
  removeVisibleEventFeedbackItem(eventId) {
    const smartList = this.eventFeedbackSmartList;
    const normalizedEventId = eventId.trim();
    if (!smartList || !normalizedEventId) {
      return;
    }
    const currentItems = [...smartList.itemsSnapshot()];
    const nextItems = currentItems.filter((item) => item.id !== normalizedEventId);
    if (nextItems.length === currentItems.length) {
      return;
    }
    smartList.replaceVisibleItems(nextItems, {
      total: Math.max(nextItems.length, smartList.totalItemCount() - 1)
    });
  }
  async loadEventFeedbackPage(query) {
    const page = Math.max(0, Math.trunc(Number(query.page) || 0));
    const pageSize = Math.max(1, Math.trunc(Number(query.pageSize) || 1));
    const filter = query.filters?.filter ?? this.eventFeedbackListFilter();
    const normalizedUserId = (query.filters?.userId?.trim() || this.activeUserId()).trim();
    if (!normalizedUserId) {
      this.eventFeedbackPageResult.set(null);
      return { items: [], total: 0 };
    }
    const result = await this.eventsService.loadEventFeedbackPage({
      userId: normalizedUserId,
      filter,
      page,
      pageSize
    });
    if (this.activeUserId() !== normalizedUserId) {
      return { items: [], total: 0 };
    }
    const pageResult = new EventFeedbackPageResultDto(result);
    this.eventFeedbackPageResult.set(pageResult);
    this.eventFeedbackFilterCountDelta.set({});
    return {
      items: EventFeedbackInfoCardConverter.convertList(pageResult.items, { state: pageResult.state }),
      total: result.total
    };
  }
  activeUserId() {
    return this.userProfileStore.activeUserProfile()?.id?.trim() || this.userProfileStore.activeUserId().trim();
  }
  async startEventFeedback(item, event) {
    event?.stopPropagation();
    if (!(this.eventFeedbackPageResult()?.itemMatchesFilter(item, "pending") ?? false)) {
      return;
    }
    const userId = this.activeUserId();
    const eventId = item.eventId.trim();
    this.openEventFeedbackDetail(item);
    this.clearLoadedEventFeedbackDetail(eventId);
    this.eventFeedbackDetailLoading.set(true);
    this.eventFeedbackSubmitting.set(false);
    this.eventFeedbackSubmitted.set(false);
    this.eventFeedbackSubmitMessage.set("");
    if (!userId || !eventId) {
      this.applyLoadedEventFeedbackDetail(new EventFeedbackDetailDto({
        eventId,
        title: item.title,
        cards: []
      }), item.title);
      this.eventFeedbackDetailLoading.set(false);
      return;
    }
    try {
      const detail = await this.eventsService.loadEventFeedback({ userId, eventId });
      this.applyLoadedEventFeedbackDetail(detail, item.title);
    } finally {
      if (this.isEventFeedbackDetailLoadCurrent(eventId)) {
        this.eventFeedbackDetailLoading.set(false);
      }
    }
  }
  eventFeedbackFlowModel = computed(() => EventFeedbackFormFlowConverter.convert(this.eventFeedbackDetailDto(), { eventTitle: this.eventFeedbackCurrentEventTitle() }), ...ngDevMode ? [{ debugName: "eventFeedbackFlowModel" }] : (
    /* istanbul ignore next */
    []
  ));
  async onEventFeedbackFlowSave(event) {
    if (this.eventFeedbackSubmitted() || this.eventFeedbackSubmitting()) {
      return;
    }
    const submittedAtIso = (/* @__PURE__ */ new Date()).toISOString();
    const feedback = new EventFeedbackDetailDto(this.eventFeedbackDetailDto()).withFormValue(event.value).submitted({ submittedAtIso });
    if (!feedback.eventId || feedback.cards.length === 0) {
      return;
    }
    this.eventFeedbackDetailValue.set(feedback);
    this.eventFeedbackSubmitting.set(true);
    try {
      const persisted = await this.eventsService.submitEventFeedback(this.activeUserId(), feedback);
      this.activityStore.emitActivityEventFeedbackSubmit(persisted);
      this.eventFeedbackSubmitted.set(true);
      this.eventFeedbackSubmitMessage.set(`Feedback submitted successfully for ${this.eventFeedbackCurrentEventTitle()}.`);
      this.clearLoadedEventFeedbackDetail(persisted.eventId);
    } catch {
      this.eventFeedbackSubmitMessage.set("Feedback could not be saved. Please try again.");
    } finally {
      this.eventFeedbackSubmitting.set(false);
    }
  }
  applyLoadedEventFeedbackDetail(detail, fallbackTitle) {
    if (!this.isEventFeedbackDetailLoadCurrent(detail.eventId)) {
      return;
    }
    const pendingDetail = detail.pending({
      activeUserId: this.activeUserId(),
      fallbackTitle
    });
    if (pendingDetail.cards.length === 0) {
      this.clearLoadedEventFeedbackDetail(pendingDetail.eventId);
      this.completeEmptyEventFeedbackDetail(fallbackTitle);
      return;
    }
    this.eventFeedbackDetailDto.set(pendingDetail);
    this.eventFeedbackDetailValue.set(pendingDetail.withEmptyAnswers());
  }
  clearLoadedEventFeedbackDetail(eventId = "") {
    this.eventFeedbackDetailDto.set(null);
    this.eventFeedbackDetailValue.set(new EventFeedbackDetailDto({ eventId }));
    this.eventFeedbackSubmitting.set(false);
  }
  applyActivityEventFeedbackSubmitSync(dto) {
    const eventId = dto.eventId.trim();
    if (!eventId) {
      return;
    }
    const pageResult = this.eventFeedbackPageResult();
    const sourceItem = pageResult?.itemById(eventId) ?? null;
    if (!pageResult || !sourceItem || sourceItem.isOwnEvent) {
      return;
    }
    const nextItem = pageResult.applySubmitToItem(sourceItem, dto);
    this.patchEventFeedbackItem(sourceItem, nextItem);
    if (!this.eventFeedbackSmartList) {
      return;
    }
    const currentItems = [...this.eventFeedbackSmartList.itemsSnapshot()];
    const currentIndex = currentItems.findIndex((item) => item.id === eventId);
    if (currentIndex < 0) {
      return;
    }
    const nextItems = [...currentItems];
    if (!pageResult.itemMatchesFilter(nextItem, this.eventFeedbackListFilter())) {
      nextItems.splice(currentIndex, 1);
      this.eventFeedbackSmartList.replaceVisibleItems(nextItems, {
        total: Math.max(nextItems.length, this.eventFeedbackSmartList.totalItemCount() - 1)
      });
      return;
    }
    nextItems[currentIndex] = EventFeedbackInfoCardConverter.convert(nextItem, {
      state: this.eventFeedbackPageResult()?.state ?? null
    });
    this.eventFeedbackSmartList.replaceVisibleItems(nextItems, {
      total: this.eventFeedbackSmartList.totalItemCount()
    });
  }
  async submitEventFeedbackNote() {
    if (!this.canSubmitEventFeedbackNote()) {
      return;
    }
    const userId = this.activeUserId();
    const noteForm = this.eventFeedbackNoteForm();
    const eventId = noteForm.eventId.trim();
    const text = noteForm.text.trim();
    if (!userId || !eventId) {
      return;
    }
    this.eventFeedbackNoteSaving.set(true);
    this.eventFeedbackNoteSubmitMessage.set("");
    try {
      await this.eventsService.saveEventFeedbackNote({ userId, eventId, text });
      this.applyEventFeedbackNoteSubmitted();
    } catch {
      this.eventFeedbackNoteSubmitMessage.set("The note could not be saved. Please try again.");
    } finally {
      this.eventFeedbackNoteSaving.set(false);
    }
  }
  openOrganizerEventFeedback(eventId) {
    const normalizedEventId = eventId.trim();
    if (!normalizedEventId) {
      return;
    }
    this.eventFeedbackListFilter.set("own-events");
    this.selectedOrganizerEventFeedbackEventId.set(normalizedEventId);
    this.clearOrganizerEventFeedbackStat();
    this.stackedPopupMode.set("organizerEventFeedback");
    this.isStackedPopupOpen.set(true);
    void this.loadOrganizerEventFeedbackStat(normalizedEventId);
  }
  async loadOrganizerEventFeedbackStat(eventId) {
    const normalizedEventId = eventId.trim();
    const userId = this.activeUserId();
    const requestKey = `${userId}::${normalizedEventId}`;
    this.organizerEventFeedbackStatRequestKey = requestKey;
    this.organizerEventFeedbackStatDto.set(null);
    if (!userId || !normalizedEventId) {
      this.organizerEventFeedbackStatLoading.set(false);
      return;
    }
    this.organizerEventFeedbackStatLoading.set(true);
    try {
      const stat = await this.eventsService.loadEventFeedbackStatById({
        userId,
        eventId: normalizedEventId
      });
      if (this.isOrganizerEventFeedbackStatLoadCurrent(requestKey, normalizedEventId)) {
        this.organizerEventFeedbackStatDto.set(stat);
      }
    } finally {
      if (this.isOrganizerEventFeedbackStatLoadCurrent(requestKey, normalizedEventId)) {
        this.organizerEventFeedbackStatLoading.set(false);
      }
    }
  }
  isOrganizerEventFeedbackStatLoadCurrent(requestKey, eventId) {
    return this.organizerEventFeedbackStatRequestKey === requestKey && this.selectedOrganizerEventFeedbackEventId() === eventId.trim() && this.stackedPopupMode() === "organizerEventFeedback";
  }
  clearOrganizerEventFeedbackStat() {
    this.organizerEventFeedbackStatRequestKey = "";
    this.organizerEventFeedbackStatDto.set(null);
    this.organizerEventFeedbackStatLoading.set(false);
  }
  selectOrganizerEventFeedbackCarousel(index) {
    const sections = this.organizerEventFeedbackCarouselSections();
    if (index < 0 || index >= sections.length) {
      return;
    }
    this.organizerEventFeedbackCarouselIndex.set(index);
  }
  static \u0275fac = function EventFeedbackPopupComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _EventFeedbackPopupComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _EventFeedbackPopupComponent, selectors: [["app-event-feedback-popup"]], viewQuery: function EventFeedbackPopupComponent_Query(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275viewQuery(_c0, 5, TemplateRef)(_c1, 5);
    }
    if (rf & 2) {
      let _t;
      \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.eventFeedbackItemTemplate = _t.first);
      \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.eventFeedbackSmartList = _t.first);
    }
  }, decls: 3, vars: 2, consts: [["eventFeedbackSmartList", ""], ["eventFeedbackItemTemplate", ""], [1, "event-feedback-popup-module"], [1, "event-feedback-parent-popup", 3, "event-feedback-parent-hidden"], [3, "model", "zIndex"], [1, "event-feedback-parent-popup"], [1, "support-popup", "event-feedback-list-popup"], [1, "support-submit-success"], [1, "event-feedback-list-surface", 3, "menuItemSelect", "config", "loadPage", "itemTemplate", "query"], [1, "event-feedback-info-card-shell"], [3, "mediaEndClick", "menuAction", "card", "useSharedMenuTrigger", "sharedMenuContext"], [1, "event-feedback-stacked-content"], [1, "support-popup", "event-feedback-popup"], [1, "support-popup", "event-feedback-organizer-popup"], [1, "support-popup"], [1, "editor-list-card", "support-card", "event-feedback-empty-card"], [1, "editor-list-card", "support-card", "event-feedback-loading-card"], [1, "editor-list-card", "support-card", "event-feedback-shell", "event-feedback-flow-shell"], ["kind", "load-ring", "state", "loading"], [1, "event-feedback-form-flow", 3, "save", "model", "ngModel", "saving", "disabled"], [1, "editor-list-card", "support-card", "event-feedback-organizer-shell"], [1, "event-feedback-organizer-loading"], [1, "event-feedback-organizer-overview-grid"], [1, "event-feedback-info-card-shell", "event-feedback-organizer-info-card-shell"], [1, "event-feedback-organizer-hero-card", 3, "card"], [1, "event-feedback-organizer-carousel-panel"], [1, "event-feedback-organizer-messages"], [1, "event-feedback-organizer-empty-copy"], [1, "event-feedback-organizer-carousel"], [1, "event-feedback-organizer-carousel-pill-strip"], ["type", "button", 1, "event-feedback-organizer-carousel-pill", 3, "ngClass"], [1, "event-feedback-organizer-carousel-card", 3, "ngClass"], ["type", "button", 1, "event-feedback-organizer-carousel-pill", 3, "click", "ngClass"], [1, "event-feedback-organizer-carousel-pill-head"], [1, "event-feedback-organizer-carousel-pill-label"], [1, "event-feedback-organizer-carousel-pill-badge"], [1, "event-feedback-organizer-carousel-card-head"], [1, "event-feedback-organizer-carousel-card-title"], [1, "event-feedback-organizer-carousel-card-icon"], [1, "event-feedback-organizer-carousel-card-bar"], [1, "event-feedback-organizer-carousel-card-meta"], [1, "event-feedback-organizer-carousel-card-highlights"], [1, "event-feedback-organizer-carousel-chip"], [1, "event-feedback-organizer-group-marker"], [1, "event-feedback-organizer-message-list"], [1, "event-feedback-organizer-message-card"], [1, "event-feedback-organizer-message-head"], [1, "event-feedback-organizer-message-avatar", 3, "ngClass"], [3, "src", "alt"], [1, "event-feedback-organizer-message-meta"], [1, "event-feedback-organizer-message-chips"], [1, "event-feedback-organizer-message-chip"], [1, "event-feedback-organizer-message-chip", "event-feedback-organizer-message-chip-trait"], [1, "event-feedback-organizer-message-opinion"], [1, "event-feedback-organizer-message-note"], [1, "editor-list-card", "support-card"], [1, "support-submit-error"], [1, "support-form", 3, "ngSubmit"], ["rows", "4", "name", "eventFeedbackNoteText", "placeholder", "What should be improved for this event next time?", 3, "ngModelChange", "ngModel"], [1, "popup-actions", "support-actions"], ["type", "button", 1, "link-btn", "neutral-btn", 3, "click"], ["type", "submit", 1, "link-btn", "primary-btn", 3, "disabled"], ["type", "button", 1, "link-btn", "primary-btn", 3, "click"]], template: function EventFeedbackPopupComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 2);
      \u0275\u0275conditionalCreate(1, EventFeedbackPopupComponent_Conditional_1_Template, 8, 9, "div", 3);
      \u0275\u0275conditionalCreate(2, EventFeedbackPopupComponent_Conditional_2_Template, 5, 11, "app-popup", 4);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.isPopupOpen() ? 1 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.isStackedPopupOpen() ? 2 : -1);
    }
  }, dependencies: [
    CommonModule,
    NgClass,
    FormsModule,
    \u0275NgNoValidate,
    DefaultValueAccessor,
    NgControlStatus,
    NgControlStatusGroup,
    NgModel,
    NgForm,
    MatIconModule,
    MatIcon,
    FormFlowComponent,
    IndicatorComponent,
    PopupComponent,
    SmartListComponent,
    InfoCardComponent
  ], styles: ['\n[_nghost-%COMP%] {\n  display: contents;\n}\n[_nghost-%COMP%] {\n  --interactive-motion-duration: 160ms;\n  --interactive-motion-ease: cubic-bezier(0.22, 1, 0.36, 1);\n  --interactive-hover-lift: -1px;\n  --interactive-hover-scale: 1.01;\n  --interactive-hover-brightness: 1.01;\n  --interactive-press-scale: 0.97;\n  --interactive-press-brightness: 0.97;\n}\n[_ngcontent-%COMP%]:where(button, a[href], [role=button], .link-btn, .popup-view-fab, .popup-header-add-btn, .activities-view-option, .profile-status-select-wrap, .profile-details-values-btn, .profile-details-privacy-btn, .profile-privacy-menu-option, .popup-close, .date-picker-btn, .avatar-edit-btn, .experience-form-close-btn, .image-editor-grid button, .image-stack-line, .image-stack-hit-segment, .mobile-profile-selector-close-btn, .mobile-profile-selector-option, .popup-panel-profile-selector .profile-filter-selector-clear, .popup-panel-profile-selector .profile-filter-selector-chip, .popup-panel-profile-selector .profile-selector-chip, .item-action-menu-btn, .experience-action-btn, .header-icon-btn, .chat-header-members, .activities-row-item-clickable, .activities-card-btn, .asset-source-icon, .event-editor-members-trigger, .motion-card, [data-motion=card]):not(.motion-static):not([data-motion=none]) {\n  -webkit-tap-highlight-color: transparent;\n  transition:\n    transform var(--interactive-motion-duration) var(--interactive-motion-ease),\n    filter var(--interactive-motion-duration) var(--interactive-motion-ease),\n    box-shadow var(--interactive-motion-duration) var(--interactive-motion-ease),\n    background-color var(--interactive-motion-duration) var(--interactive-motion-ease),\n    border-color var(--interactive-motion-duration) var(--interactive-motion-ease),\n    color var(--interactive-motion-duration) var(--interactive-motion-ease);\n  transform-origin: center;\n}\n[_ngcontent-%COMP%]:where(button, a[href], [role=button], .link-btn, .popup-view-fab, .popup-header-add-btn, .activities-view-option, .profile-status-select-wrap, .profile-details-values-btn, .profile-details-privacy-btn, .profile-privacy-menu-option, .popup-close, .date-picker-btn, .avatar-edit-btn, .experience-form-close-btn, .image-editor-grid button, .image-stack-line, .image-stack-hit-segment, .mobile-profile-selector-close-btn, .mobile-profile-selector-option, .popup-panel-profile-selector .profile-filter-selector-clear, .popup-panel-profile-selector .profile-filter-selector-chip, .popup-panel-profile-selector .profile-selector-chip, .item-action-menu-btn, .experience-action-btn, .header-icon-btn, .chat-header-members, .activities-row-item-clickable, .activities-card-btn, .asset-source-icon, .event-editor-members-trigger, .motion-card, [data-motion=card]):not(.motion-static):not([data-motion=none]):focus-visible {\n  outline: 2px solid rgba(66, 110, 182, 0.44);\n  outline-offset: 2px;\n}\n@media (hover: hover) and (pointer: fine) {\n  [_ngcontent-%COMP%]:where(button, a[href], [role=button], .link-btn, .popup-view-fab, .popup-header-add-btn, .activities-view-option, .profile-status-select-wrap, .profile-details-values-btn, .profile-details-privacy-btn, .profile-privacy-menu-option, .popup-close, .date-picker-btn, .avatar-edit-btn, .experience-form-close-btn, .image-editor-grid button, .image-stack-line, .image-stack-hit-segment, .mobile-profile-selector-close-btn, .mobile-profile-selector-option, .popup-panel-profile-selector .profile-filter-selector-clear, .popup-panel-profile-selector .profile-filter-selector-chip, .popup-panel-profile-selector .profile-selector-chip, .item-action-menu-btn, .experience-action-btn, .header-icon-btn, .chat-header-members, .activities-row-item-clickable, .activities-card-btn, .asset-source-icon, .event-editor-members-trigger, .motion-card, [data-motion=card]):not(.motion-static):not([data-motion=none]):not(:disabled):not([aria-disabled=true]):hover {\n    transform: translateY(var(--interactive-hover-lift)) scale(var(--interactive-hover-scale));\n    filter: brightness(var(--interactive-hover-brightness));\n  }\n  [_ngcontent-%COMP%]:where(button, a[href], [role=button], .link-btn, .popup-view-fab, .popup-header-add-btn, .activities-view-option, .profile-status-select-wrap, .profile-details-values-btn, .profile-details-privacy-btn, .profile-privacy-menu-option, .popup-close, .date-picker-btn, .avatar-edit-btn, .experience-form-close-btn, .image-editor-grid button, .image-stack-line, .image-stack-hit-segment, .mobile-profile-selector-close-btn, .mobile-profile-selector-option, .popup-panel-profile-selector .profile-filter-selector-clear, .popup-panel-profile-selector .profile-filter-selector-chip, .popup-panel-profile-selector .profile-selector-chip, .item-action-menu-btn, .experience-action-btn, .header-icon-btn, .chat-header-members, .activities-row-item-clickable, .activities-card-btn, .asset-source-icon, .event-editor-members-trigger, .motion-card, [data-motion=card]):not(.motion-static):not([data-motion=none]):not(:disabled):not([aria-disabled=true]):active {\n    transform: scale(var(--interactive-press-scale));\n    filter: brightness(var(--interactive-press-brightness));\n  }\n  [_ngcontent-%COMP%]:where(.motion-card, [data-motion=card]):not(.motion-static):not([data-motion=none]):hover {\n    box-shadow: 0 3px 10px rgba(16, 29, 48, 0.14);\n  }\n}\n@keyframes _ngcontent-%COMP%_shared-mobile-touch-feedback {\n  0% {\n    transform: scale(1);\n    filter: brightness(1);\n  }\n  45% {\n    transform: scale(var(--interactive-press-scale));\n    filter: brightness(var(--interactive-press-brightness));\n  }\n  100% {\n    transform: scale(1);\n    filter: brightness(1);\n  }\n}\n@media (hover: none), (pointer: coarse) {\n  [_ngcontent-%COMP%]:where(button, a[href], [role=button], .link-btn, .popup-view-fab, .popup-header-add-btn, .activities-view-option, .profile-status-select-wrap, .profile-details-values-btn, .profile-details-privacy-btn, .profile-privacy-menu-option, .popup-close, .date-picker-btn, .avatar-edit-btn, .experience-form-close-btn, .image-editor-grid button, .image-stack-line, .image-stack-hit-segment, .mobile-profile-selector-close-btn, .mobile-profile-selector-option, .popup-panel-profile-selector .profile-filter-selector-clear, .popup-panel-profile-selector .profile-filter-selector-chip, .popup-panel-profile-selector .profile-selector-chip, .item-action-menu-btn, .experience-action-btn, .header-icon-btn, .chat-header-members, .activities-row-item-clickable, .activities-card-btn, .asset-source-icon, .event-editor-members-trigger, .motion-card, [data-motion=card]):not(.motion-static):not([data-motion=none]):not(:disabled):not([aria-disabled=true]):active {\n    animation: _ngcontent-%COMP%_shared-mobile-touch-feedback 0.2s ease;\n  }\n}\n.app-popup[_ngcontent-%COMP%], \n.mobile-profile-selector-sheet-wrap[_ngcontent-%COMP%], \n.popup-surface[_ngcontent-%COMP%], \n.experience-form-popup[_ngcontent-%COMP%] {\n  font-family:\n    "Nunito Sans",\n    "Segoe UI",\n    sans-serif;\n}\n.app-popup[_ngcontent-%COMP%]   button[_ngcontent-%COMP%], \n.app-popup[_ngcontent-%COMP%]   input[_ngcontent-%COMP%], \n.app-popup[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%], \n.app-popup[_ngcontent-%COMP%]   select[_ngcontent-%COMP%], \n.app-popup[_ngcontent-%COMP%]   .mat-mdc-select[_ngcontent-%COMP%], \n.app-popup[_ngcontent-%COMP%]   .mat-mdc-select-value-text[_ngcontent-%COMP%], \n.app-popup[_ngcontent-%COMP%]   .mat-mdc-option[_ngcontent-%COMP%], \n.popup-surface[_ngcontent-%COMP%]   button[_ngcontent-%COMP%], \n.popup-surface[_ngcontent-%COMP%]   input[_ngcontent-%COMP%], \n.popup-surface[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%], \n.popup-surface[_ngcontent-%COMP%]   select[_ngcontent-%COMP%], \n.popup-surface[_ngcontent-%COMP%]   .mat-mdc-select[_ngcontent-%COMP%], \n.popup-surface[_ngcontent-%COMP%]   .mat-mdc-select-value-text[_ngcontent-%COMP%], \n.popup-surface[_ngcontent-%COMP%]   .mat-mdc-option[_ngcontent-%COMP%], \n.experience-form-popup[_ngcontent-%COMP%]   button[_ngcontent-%COMP%], \n.experience-form-popup[_ngcontent-%COMP%]   input[_ngcontent-%COMP%], \n.experience-form-popup[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%], \n.experience-form-popup[_ngcontent-%COMP%]   select[_ngcontent-%COMP%], \n.experience-form-popup[_ngcontent-%COMP%]   .mat-mdc-select[_ngcontent-%COMP%], \n.experience-form-popup[_ngcontent-%COMP%]   .mat-mdc-select-value-text[_ngcontent-%COMP%], \n.experience-form-popup[_ngcontent-%COMP%]   .mat-mdc-option[_ngcontent-%COMP%], \n.mobile-profile-selector-sheet-wrap[_ngcontent-%COMP%]   button[_ngcontent-%COMP%], \n.mobile-profile-selector-sheet-wrap[_ngcontent-%COMP%]   input[_ngcontent-%COMP%], \n.mobile-profile-selector-sheet-wrap[_ngcontent-%COMP%]   .mat-mdc-option[_ngcontent-%COMP%] {\n  font-family: inherit;\n}\n.popup-filter-picker[_ngcontent-%COMP%], \n.activities-view-picker[_ngcontent-%COMP%] {\n  position: relative;\n  z-index: 60;\n  margin-left: auto;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.34rem;\n}\n.popup-filter-picker-secondary[_ngcontent-%COMP%], \n.activities-secondary-picker[_ngcontent-%COMP%] {\n  position: relative;\n  z-index: 61;\n}\n.selector-like[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.35rem;\n}\n.profile-status-select-wrap.popup-compact-select[_ngcontent-%COMP%], \n.profile-status-select-wrap.activities-compact-select[_ngcontent-%COMP%], \n.profile-status-select-wrap.assets-compact-select[_ngcontent-%COMP%] {\n  width: fit-content !important;\n  min-width: 0 !important;\n  max-width: 100%;\n}\n.profile-status-select-wrap.popup-compact-select[_ngcontent-%COMP%]   .mat-mdc-select[_ngcontent-%COMP%], \n.profile-status-select-wrap.activities-compact-select[_ngcontent-%COMP%]   .mat-mdc-select[_ngcontent-%COMP%], \n.profile-status-select-wrap.assets-compact-select[_ngcontent-%COMP%]   .mat-mdc-select[_ngcontent-%COMP%] {\n  width: auto;\n  min-width: 0;\n}\n.profile-status-select-wrap.popup-compact-select[_ngcontent-%COMP%]   .mat-mdc-select-trigger[_ngcontent-%COMP%], \n.profile-status-select-wrap.activities-compact-select[_ngcontent-%COMP%]   .mat-mdc-select-trigger[_ngcontent-%COMP%], \n.profile-status-select-wrap.assets-compact-select[_ngcontent-%COMP%]   .mat-mdc-select-trigger[_ngcontent-%COMP%] {\n  width: auto !important;\n  min-width: 0;\n}\n.profile-status-select-wrap.popup-compact-select[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%], \n.profile-status-select-wrap.activities-compact-select[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%], \n.profile-status-select-wrap.assets-compact-select[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%] {\n  width: auto;\n  min-width: 0;\n}\n.profile-status-select-wrap.popup-filter-no-badge[_ngcontent-%COMP%], \n.profile-status-select-wrap.activities-filter-no-badge[_ngcontent-%COMP%] {\n  min-width: 0;\n}\n.profile-status-select-wrap.popup-filter-no-badge[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%], \n.profile-status-select-wrap.activities-filter-no-badge[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%] {\n  width: auto !important;\n  flex: 0 1 auto;\n}\n.profile-status-select-wrap.popup-filter-no-badge[_ngcontent-%COMP%]   .mat-mdc-select[_ngcontent-%COMP%], \n.profile-status-select-wrap.activities-filter-no-badge[_ngcontent-%COMP%]   .mat-mdc-select[_ngcontent-%COMP%] {\n  width: auto;\n  min-width: 0;\n}\n.profile-status-select-wrap.popup-filter-no-badge[_ngcontent-%COMP%]   .mat-mdc-select-trigger[_ngcontent-%COMP%], \n.profile-status-select-wrap.activities-filter-no-badge[_ngcontent-%COMP%]   .mat-mdc-select-trigger[_ngcontent-%COMP%] {\n  width: auto !important;\n}\n.profile-status-select-wrap.popup-filter-no-badge[_ngcontent-%COMP%]   .mat-mdc-select-arrow-wrapper[_ngcontent-%COMP%], \n.profile-status-select-wrap.activities-filter-no-badge[_ngcontent-%COMP%]   .mat-mdc-select-arrow-wrapper[_ngcontent-%COMP%] {\n  margin-left: 0.28rem;\n}\n.profile-status-select-wrap[_ngcontent-%COMP%] {\n  min-width: 174px;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.38rem;\n  border: 1px solid #c8d3e2;\n  border-radius: 999px;\n  box-shadow: 0 2px 6px rgba(38, 60, 92, 0.08);\n  padding: 0.12rem 0.5rem 0.12rem 0.84rem;\n  background: #f8f9fb;\n}\n.profile-status-select-wrap.selector-like[_ngcontent-%COMP%] {\n  min-height: 36px;\n}\n.status-option-content[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: flex-start;\n  gap: 0.2rem;\n  text-transform: lowercase;\n  width: 100%;\n  min-width: 0;\n}\n.status-option-content[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]:last-child {\n  white-space: nowrap;\n}\n.status-option-content[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n  line-height: 16px;\n  flex: 0 0 16px;\n}\n.rate-filter-count-badge[_ngcontent-%COMP%] {\n  margin-left: auto;\n  width: 20px;\n  height: 20px;\n  border-radius: 50%;\n  border: 1px solid #fff;\n  background: #d84d4d;\n  color: #fff;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  padding: 0;\n  font-size: 0.68rem;\n  font-weight: 800;\n  line-height: 1;\n  box-shadow: 0 2px 8px rgba(120, 24, 24, 0.22);\n}\n.rate-filter-trigger-badge[_ngcontent-%COMP%] {\n  position: absolute;\n  top: -8px;\n  right: -8px;\n  margin-left: 0;\n  z-index: 2;\n}\n.popup-filter-control[_ngcontent-%COMP%], \n.activities-rate-filter-select[_ngcontent-%COMP%], \n.activities-primary-filter-select[_ngcontent-%COMP%], \n.activities-event-scope-filter-select[_ngcontent-%COMP%], \n.activities-chat-context-filter-select[_ngcontent-%COMP%] {\n  position: relative;\n  overflow: visible;\n}\n.popup-filter-panel[_ngcontent-%COMP%], \n.activities-view-picker-panel[_ngcontent-%COMP%] {\n  position: absolute;\n  top: calc(100% + 0.32rem);\n  right: 0;\n  border: 1px solid rgba(39, 62, 94, 0.22);\n  border-radius: 10px;\n  background: #fff;\n  box-shadow: 0 10px 24px rgba(17, 29, 48, 0.22);\n  padding: 0.24rem;\n  min-width: 128px;\n  z-index: 40;\n  display: grid;\n  gap: 0.16rem;\n}\n.popup-filter-option[_ngcontent-%COMP%], \n.activities-view-option[_ngcontent-%COMP%] {\n  border: 0;\n  background: #fff;\n  border-radius: 8px;\n  min-height: 32px;\n  padding: 0.34rem 0.44rem;\n  display: inline-flex;\n  align-items: center;\n  justify-content: flex-start;\n  gap: 0.34rem;\n  color: #1e3658;\n  cursor: pointer;\n  text-align: left;\n}\n.popup-filter-option[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%], \n.activities-view-option[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n}\n.popup-filter-option[_ngcontent-%COMP%]   span[_ngcontent-%COMP%], \n.activities-view-option[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  font-size: 0.78rem;\n  font-weight: 700;\n}\n.popup-filter-option[_ngcontent-%COMP%]    > span[_ngcontent-%COMP%]:not(.rate-filter-count-badge), \n.activities-view-option[_ngcontent-%COMP%]    > span[_ngcontent-%COMP%]:not(.rate-filter-count-badge) {\n  flex: 1 1 auto;\n  min-width: 0;\n  text-align: left;\n}\n.popup-mobile-filter-picker[_ngcontent-%COMP%], \n.activities-mobile-primary-filter-picker[_ngcontent-%COMP%], \n.activities-mobile-event-scope-filter-picker[_ngcontent-%COMP%], \n.activities-mobile-chat-context-filter-picker[_ngcontent-%COMP%], \n.activities-mobile-rate-filter-picker[_ngcontent-%COMP%] {\n  position: relative;\n}\n.popup-mobile-filter-panel[_ngcontent-%COMP%], \n.activities-mobile-filter-panel[_ngcontent-%COMP%], \n.activities-mobile-rate-filter-panel[_ngcontent-%COMP%] {\n  top: calc(100% + 0.24rem);\n  right: 0;\n  min-width: 210px;\n  z-index: 65;\n}\n.popup-mobile-sheet-title[_ngcontent-%COMP%], \n.activities-mobile-sheet-title[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.28rem;\n  padding: 0 0.14rem;\n  color: #1c3354;\n  font-size: 0.94rem;\n  font-weight: 800;\n}\n.popup-mobile-sheet-title[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%], \n.activities-mobile-sheet-title[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 17px;\n  height: 17px;\n  font-size: 17px;\n  line-height: 17px;\n}\n:is(.popup-filter-bar[_ngcontent-%COMP%], .experience-toolbar[_ngcontent-%COMP%], .assets-toolbar[_ngcontent-%COMP%])   .popup-view-fab[_ngcontent-%COMP%]   span[_ngcontent-%COMP%], \n[_ngcontent-%COMP%]:is(.popup-filter-bar, .experience-toolbar, .assets-toolbar)   .profile-status-select-wrap[_ngcontent-%COMP%]   .mat-mdc-select[_ngcontent-%COMP%], \n[_ngcontent-%COMP%]:is(.popup-filter-bar, .experience-toolbar, .assets-toolbar)   .profile-status-select-wrap[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]:last-child, \n[_ngcontent-%COMP%]:is(.popup-filter-bar, .experience-toolbar, .assets-toolbar)   .profile-status-select-wrap[_ngcontent-%COMP%]   .mat-mdc-select-value-text[_ngcontent-%COMP%] {\n  font-weight: 400 !important;\n}\n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.status-option .status-option-content {\n  display: grid;\n  grid-template-columns: auto minmax(0, 1fr) auto;\n  align-items: center;\n  width: 100%;\n  min-width: 0;\n  column-gap: 0.34rem;\n}\n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.status-option .rate-filter-count-badge {\n  margin-left: 0;\n  justify-self: end;\n}\n[_nghost-%COMP%]     .cdk-overlay-pane:has(.mat-mdc-select-panel.selector-options-panel), \n[_nghost-%COMP%]     .cdk-overlay-pane:has(.mat-mdc-select-panel.status-options-panel) {\n  min-width: var(--app-selector-panel-min-width, 184px) !important;\n}\n[_nghost-%COMP%]     .mat-mdc-select-panel.selector-options-panel, \n[_nghost-%COMP%]     .mat-mdc-select-panel.status-options-panel {\n  min-width: var(--app-selector-panel-min-width, 184px) !important;\n}\n@media (max-width: 760px) {\n  .popup-mobile-filter-panel[_ngcontent-%COMP%]   .popup-filter-option[_ngcontent-%COMP%], \n   .popup-mobile-filter-panel[_ngcontent-%COMP%]   .activities-view-option[_ngcontent-%COMP%], \n   .activities-mobile-filter-panel[_ngcontent-%COMP%]   .popup-filter-option[_ngcontent-%COMP%], \n   .activities-mobile-filter-panel[_ngcontent-%COMP%]   .activities-view-option[_ngcontent-%COMP%], \n   .activities-mobile-rate-filter-panel[_ngcontent-%COMP%]   .popup-filter-option[_ngcontent-%COMP%], \n   .activities-mobile-rate-filter-panel[_ngcontent-%COMP%]   .activities-view-option[_ngcontent-%COMP%] {\n    width: 100%;\n    min-width: 0;\n    box-sizing: border-box;\n    border: 1px solid rgba(58, 81, 114, 0.24);\n    border-radius: 12px;\n    background: #f7f9fd;\n    min-height: 42px;\n    padding: 0.46rem 0.62rem;\n    justify-content: flex-start;\n    gap: 0.36rem;\n  }\n  .popup-mobile-filter-panel[_ngcontent-%COMP%]   .popup-filter-option.active[_ngcontent-%COMP%], \n   .popup-mobile-filter-panel[_ngcontent-%COMP%]   .activities-view-option.active[_ngcontent-%COMP%], \n   .activities-mobile-filter-panel[_ngcontent-%COMP%]   .popup-filter-option.active[_ngcontent-%COMP%], \n   .activities-mobile-filter-panel[_ngcontent-%COMP%]   .activities-view-option.active[_ngcontent-%COMP%], \n   .activities-mobile-rate-filter-panel[_ngcontent-%COMP%]   .popup-filter-option.active[_ngcontent-%COMP%], \n   .activities-mobile-rate-filter-panel[_ngcontent-%COMP%]   .activities-view-option.active[_ngcontent-%COMP%] {\n    box-shadow: inset 0 0 0 1px rgba(24, 46, 76, 0.24);\n    filter: brightness(0.95);\n  }\n  .popup-mobile-filter-panel[_ngcontent-%COMP%]   .popup-filter-option[_ngcontent-%COMP%]   .rate-filter-count-badge[_ngcontent-%COMP%], \n   .popup-mobile-filter-panel[_ngcontent-%COMP%]   .activities-view-option[_ngcontent-%COMP%]   .rate-filter-count-badge[_ngcontent-%COMP%], \n   .activities-mobile-filter-panel[_ngcontent-%COMP%]   .popup-filter-option[_ngcontent-%COMP%]   .rate-filter-count-badge[_ngcontent-%COMP%], \n   .activities-mobile-filter-panel[_ngcontent-%COMP%]   .activities-view-option[_ngcontent-%COMP%]   .rate-filter-count-badge[_ngcontent-%COMP%], \n   .activities-mobile-rate-filter-panel[_ngcontent-%COMP%]   .popup-filter-option[_ngcontent-%COMP%]   .rate-filter-count-badge[_ngcontent-%COMP%], \n   .activities-mobile-rate-filter-panel[_ngcontent-%COMP%]   .activities-view-option[_ngcontent-%COMP%]   .rate-filter-count-badge[_ngcontent-%COMP%] {\n    margin-left: auto;\n    flex: 0 0 auto;\n  }\n  [_nghost-%COMP%]     .cdk-overlay-pane:has(.mat-mdc-select-panel.profile-bottom-sheet-panel) {\n    position: fixed !important;\n    left: 0 !important;\n    right: 0 !important;\n    bottom: 0 !important;\n    top: auto !important;\n    width: 100vw !important;\n    max-width: 100vw !important;\n    transform: none !important;\n  }\n  [_nghost-%COMP%]     .mat-mdc-select-panel.profile-bottom-sheet-panel {\n    width: 100vw !important;\n    max-width: 100vw !important;\n    max-height: min(54vh, 420px) !important;\n    margin: 0 !important;\n    border-radius: 16px 16px 0 0 !important;\n    border: 1px solid #d6deea;\n    border-bottom: 0;\n    box-shadow: 0 -14px 28px rgba(15, 29, 52, 0.24);\n    padding-top: 0.38rem;\n    padding-bottom: max(0.55rem, env(safe-area-inset-bottom));\n  }\n}\n.popup-view-fab[_ngcontent-%COMP%] {\n  height: 34px;\n  border: 1px solid rgba(39, 62, 94, 0.22);\n  border-radius: 999px;\n  background: #f3f7ff;\n  color: #2c4c74;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.25rem;\n  padding: 0 0.62rem;\n  cursor: pointer;\n}\n.popup-view-fab[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n}\n.popup-view-fab[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  font-size: 0.74rem;\n  font-weight: 700;\n  white-space: nowrap;\n}\n.event-visibility-picker[_ngcontent-%COMP%] {\n  position: relative;\n  z-index: 22;\n  margin-left: auto;\n  flex: 0 0 auto;\n}\n.event-visibility-trigger[_ngcontent-%COMP%] {\n  flex-wrap: nowrap;\n}\n.profile-status-header-picker[_ngcontent-%COMP%]   .event-visibility-trigger.status-public[_ngcontent-%COMP%], \n.profile-status-header-picker[_ngcontent-%COMP%]   .activities-view-option.status-public[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #e6f6ef);\n}\n.profile-status-header-picker[_ngcontent-%COMP%]   .event-visibility-trigger.status-friends[_ngcontent-%COMP%], \n.profile-status-header-picker[_ngcontent-%COMP%]   .activities-view-option.status-friends[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #e8f1fd);\n}\n.profile-status-header-picker[_ngcontent-%COMP%]   .event-visibility-trigger.status-host[_ngcontent-%COMP%], \n.profile-status-header-picker[_ngcontent-%COMP%]   .activities-view-option.status-host[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #f6efe2);\n}\n.profile-status-header-picker[_ngcontent-%COMP%]   .event-visibility-trigger.status-inactive[_ngcontent-%COMP%], \n.profile-status-header-picker[_ngcontent-%COMP%]   .activities-view-option.status-inactive[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #f2f3f5);\n}\n.profile-status-header-picker[_ngcontent-%COMP%]   .event-visibility-trigger[_ngcontent-%COMP%]   .mat-icon.status-public[_ngcontent-%COMP%], \n.profile-status-header-picker[_ngcontent-%COMP%]   .activities-view-option.status-public[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #2f8f66;\n}\n.profile-status-header-picker[_ngcontent-%COMP%]   .event-visibility-trigger[_ngcontent-%COMP%]   .mat-icon.status-friends[_ngcontent-%COMP%], \n.profile-status-header-picker[_ngcontent-%COMP%]   .activities-view-option.status-friends[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #1b57a1;\n}\n.profile-status-header-picker[_ngcontent-%COMP%]   .event-visibility-trigger[_ngcontent-%COMP%]   .mat-icon.status-host[_ngcontent-%COMP%], \n.profile-status-header-picker[_ngcontent-%COMP%]   .activities-view-option.status-host[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #87580f;\n}\n.profile-status-header-picker[_ngcontent-%COMP%]   .event-visibility-trigger[_ngcontent-%COMP%]   .mat-icon.status-inactive[_ngcontent-%COMP%], \n.profile-status-header-picker[_ngcontent-%COMP%]   .activities-view-option.status-inactive[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #5b6573;\n}\n.app-popup[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%], \n.app-popup[_ngcontent-%COMP%]   input[_ngcontent-%COMP%], \n.app-popup[_ngcontent-%COMP%]   select[_ngcontent-%COMP%], \n.popup-surface[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%], \n.popup-surface[_ngcontent-%COMP%]   input[_ngcontent-%COMP%], \n.popup-surface[_ngcontent-%COMP%]   select[_ngcontent-%COMP%], \n.experience-form-popup[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%], \n.experience-form-popup[_ngcontent-%COMP%]   input[_ngcontent-%COMP%], \n.experience-form-popup[_ngcontent-%COMP%]   select[_ngcontent-%COMP%], \n.mobile-profile-selector-sheet-wrap[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  width: 100%;\n  border: 1px solid rgba(15, 27, 47, 0.16);\n  border-radius: 10px;\n  padding: 0.48rem 0.56rem;\n  font: inherit;\n  color: var(--text-main);\n  background: #fff;\n}\n.app-popup[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%], \n.popup-surface[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%], \n.experience-form-popup[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%] {\n  resize: vertical;\n}\n.app-popup[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%]:focus, \n.app-popup[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]:focus, \n.app-popup[_ngcontent-%COMP%]   select[_ngcontent-%COMP%]:focus, \n.popup-surface[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%]:focus, \n.popup-surface[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]:focus, \n.popup-surface[_ngcontent-%COMP%]   select[_ngcontent-%COMP%]:focus, \n.experience-form-popup[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%]:focus, \n.experience-form-popup[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]:focus, \n.experience-form-popup[_ngcontent-%COMP%]   select[_ngcontent-%COMP%]:focus, \n.mobile-profile-selector-sheet-wrap[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]:focus {\n  outline: 0;\n  border-color: rgba(52, 103, 182, 0.72);\n  box-shadow: 0 0 0 3px rgba(55, 116, 212, 0.14);\n}\n.popup-surface-form-grid[_ngcontent-%COMP%], \n.experience-form-grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n  max-width: none;\n  width: 100%;\n  margin: 0;\n  justify-content: stretch;\n  align-content: start;\n  align-items: start;\n  column-gap: 1rem;\n  row-gap: 0.9rem;\n}\n.popup-surface-form-grid[_ngcontent-%COMP%]   label[_ngcontent-%COMP%], \n.experience-form-grid[_ngcontent-%COMP%]   label[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-rows: min-content;\n  gap: 0;\n  font-weight: 600;\n  color: rgba(26, 44, 69, 0.88);\n}\n.popup-surface-form-grid[_ngcontent-%COMP%]   input[_ngcontent-%COMP%], \n.experience-form-grid[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  min-height: 40px;\n  padding: 0.56rem 0.72rem;\n  font-size: 0.88rem;\n  line-height: 1.25;\n  box-sizing: border-box;\n}\n.popup-surface-form-grid[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%], \n.experience-form-grid[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%] {\n  min-height: 96px;\n  padding: 0.56rem 0.72rem;\n  font-size: 0.88rem;\n  line-height: 1.25;\n  box-sizing: border-box;\n}\n.popup-surface-form-grid[_ngcontent-%COMP%]   .profile-status-select-wrap.selector-like[_ngcontent-%COMP%], \n.experience-form-grid[_ngcontent-%COMP%]   .profile-status-select-wrap.selector-like[_ngcontent-%COMP%] {\n  min-height: 40px;\n  height: 40px;\n  box-sizing: border-box;\n}\n.popup-surface-form-grid[_ngcontent-%COMP%]   .mat-mdc-select-trigger[_ngcontent-%COMP%], \n.experience-form-grid[_ngcontent-%COMP%]   .mat-mdc-select-trigger[_ngcontent-%COMP%] {\n  min-height: 32px;\n}\n.popup-surface-description-field[_ngcontent-%COMP%], \n.experience-description-field[_ngcontent-%COMP%] {\n  grid-column: 1/-1;\n}\n.popup-surface-actions[_ngcontent-%COMP%], \n.experience-form-actions[_ngcontent-%COMP%] {\n  justify-content: center;\n  padding-top: 0.2rem;\n}\n.popup-actions[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 0.45rem;\n  flex-wrap: wrap;\n}\n.link-btn[_ngcontent-%COMP%] {\n  border: 1px solid var(--line-strong);\n  border-radius: 999px;\n  background: #fff;\n  color: #1f3350;\n  font: inherit;\n  font-size: 0.83rem;\n  padding: 0.38rem 0.76rem;\n  cursor: pointer;\n}\n.neutral-btn[_ngcontent-%COMP%] {\n  background: #f2f4fa;\n  border-color: rgba(23, 33, 54, 0.12);\n}\n.primary-btn[_ngcontent-%COMP%] {\n  background: #4776b7;\n  border-color: #4776b7;\n  color: #fff;\n}\n.profile-status-select-wrap[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%], \n.date-picker-btn[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n  line-height: 16px;\n  color: #566b86;\n}\n.profile-status-select-wrap[_ngcontent-%COMP%]   .mat-mdc-select[_ngcontent-%COMP%] {\n  min-width: 80px;\n  width: 100%;\n  font-size: 0.8rem;\n  font-weight: 700;\n  text-transform: lowercase;\n}\n.profile-status-select-wrap[_ngcontent-%COMP%]   .mat-mdc-select-trigger[_ngcontent-%COMP%] {\n  width: 100%;\n  justify-content: flex-start;\n}\n.profile-status-select-wrap[_ngcontent-%COMP%]   .mat-mdc-select-arrow-wrapper[_ngcontent-%COMP%] {\n  margin-left: auto;\n}\n.status-public[_ngcontent-%COMP%] {\n  color: #2f8f66;\n}\n.status-friends[_ngcontent-%COMP%] {\n  color: #1b57a1;\n}\n.status-host[_ngcontent-%COMP%] {\n  color: #87580f;\n}\n.status-inactive[_ngcontent-%COMP%] {\n  color: #5b6573;\n}\n.status-option-content[_ngcontent-%COMP%]   .status-public[_ngcontent-%COMP%] {\n  color: #2f8f66;\n}\n.status-option-content[_ngcontent-%COMP%]   .status-friends[_ngcontent-%COMP%] {\n  color: #1b57a1;\n}\n.status-option-content[_ngcontent-%COMP%]   .status-host[_ngcontent-%COMP%] {\n  color: #87580f;\n}\n.status-option-content[_ngcontent-%COMP%]   .status-inactive[_ngcontent-%COMP%] {\n  color: #5b6573;\n}\n.profile-status-select-wrap.status-public[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #2f8f66;\n}\n.profile-status-select-wrap.status-friends[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #1b57a1;\n}\n.profile-status-select-wrap.status-host[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #87580f;\n}\n.profile-status-select-wrap.status-inactive[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #5b6573;\n}\n.profile-details-values-btn[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n  line-height: 16px;\n  color: rgba(44, 67, 100, 0.72);\n}\n.profile-details-values-btn[_ngcontent-%COMP%] {\n  min-height: 36px;\n  height: 36px;\n  box-sizing: border-box;\n  padding-top: 0;\n  padding-bottom: 0;\n}\n.profile-details-values-btn[_ngcontent-%COMP%]   .status-option-content.profile-details-selected-badges[_ngcontent-%COMP%] {\n  display: inline-grid;\n  grid-template-columns: minmax(0, 1fr) auto;\n  align-items: center;\n  column-gap: 0.26rem;\n  min-width: 0;\n  width: 100%;\n}\n.profile-details-values-btn.profile-details-values-tone-values[_ngcontent-%COMP%]   .profile-details-inline-chip[_ngcontent-%COMP%] {\n  max-width: calc(100% - 2.6rem);\n}\n.profile-details-values-btn.profile-details-values-tone-interest[_ngcontent-%COMP%]   .profile-details-inline-chip[_ngcontent-%COMP%] {\n  max-width: calc((100% - 3.2rem) / 2);\n}\n.profile-details-values-btn.profile-details-values-tone-values[_ngcontent-%COMP%]   .profile-details-inline-overflow[_ngcontent-%COMP%] {\n  color: #1e6b5a;\n}\n.profile-details-values-btn.profile-details-values-tone-interest[_ngcontent-%COMP%]   .profile-details-inline-overflow[_ngcontent-%COMP%] {\n  color: #2e5a90;\n}\n.values-header-chips[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  flex-wrap: wrap;\n  gap: 0.28rem;\n  flex: 0 0 100%;\n  margin-left: 0;\n  margin-top: 0.34rem;\n  max-width: 100%;\n  overflow: visible;\n  white-space: normal;\n  padding-bottom: 0;\n}\n.popup-title-values[_ngcontent-%COMP%] {\n  margin-right: 0.38rem;\n}\n.values-selected-chip[_ngcontent-%COMP%] {\n  border: 1px solid rgba(76, 99, 136, 0.3);\n  background:\n    linear-gradient(\n      180deg,\n      #f7f9ff 0%,\n      #eef3ff 100%);\n  color: #24416a;\n  border-radius: 999px;\n  min-height: 26px;\n  padding: 0.18rem 0.46rem;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.26rem;\n  font-size: 0.7rem;\n  font-weight: 700;\n  cursor: pointer;\n  flex: 0 0 auto;\n}\n.values-selected-chip[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 12px;\n  height: 12px;\n  font-size: 12px;\n  line-height: 12px;\n}\n.values-selected-chip.section-family[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #fff1ea 0%,\n      #ffe6dd 100%);\n  border-color: rgba(160, 90, 51, 0.32);\n  color: #8b4d2b;\n}\n.values-selected-chip.section-ambition[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #fff7e8 0%,\n      #ffefd7 100%);\n  border-color: rgba(160, 106, 20, 0.32);\n  color: #9a6614;\n}\n.values-selected-chip.section-lifestyle[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #eaf8f5 0%,\n      #e0f2ee 100%);\n  border-color: rgba(45, 125, 120, 0.32);\n  color: #2a6e6a;\n}\n.values-selected-chip.section-beliefs[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f0ecff 0%,\n      #e8e1fa 100%);\n  border-color: rgba(95, 78, 160, 0.32);\n  color: #564793;\n}\n.values-selected-chip.section-social[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #ecf4ff 0%,\n      #e1ecfb 100%);\n  border-color: rgba(45, 94, 168, 0.32);\n  color: #2d5ea8;\n}\n.values-selected-chip.section-arts[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f2edfb 0%,\n      #e9e2f9 100%);\n  border-color: rgba(103, 76, 164, 0.32);\n  color: #654ca1;\n}\n.values-selected-chip.section-food[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #fff4e8 0%,\n      #fee9d6 100%);\n  border-color: rgba(170, 97, 28, 0.32);\n  color: #9d611c;\n}\n.values-selected-chip.section-active[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #edf8ee 0%,\n      #e2f1e4 100%);\n  border-color: rgba(44, 126, 72, 0.32);\n  color: #2d7d47;\n}\n.values-selected-chip.section-mind[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #eaf8f6 0%,\n      #def1ee 100%);\n  border-color: rgba(37, 124, 118, 0.32);\n  color: #2d7d78;\n}\n.values-selected-chip.section-identity[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f4f0ff 0%,\n      #e9e3fb 100%);\n  border-color: rgba(88, 78, 159, 0.32);\n  color: #5a4ea0;\n}\n.readonly-select[_ngcontent-%COMP%] {\n  width: fit-content;\n  min-width: 0;\n  max-width: 130px;\n  justify-content: center;\n  margin-top: 2px;\n  padding-left: 0.44rem;\n  padding-right: 0.44rem;\n}\n.readonly-field[_ngcontent-%COMP%] {\n  min-height: 34px;\n  border: 1px solid rgba(15, 27, 47, 0.16);\n  border-radius: 10px;\n  padding: 0.4rem 0.56rem;\n  background: #f7fafe;\n  color: #23476f;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.26rem;\n  font-weight: 700;\n}\n.readonly-field[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n  line-height: 16px;\n}\n.zodiac-symbol[_ngcontent-%COMP%] {\n  font-size: 1.1rem;\n  font-weight: 800;\n  line-height: 1;\n}\n.zodiac-label[_ngcontent-%COMP%] {\n  font-size: 0.9rem;\n  font-weight: 700;\n  min-width: 0;\n  text-align: center;\n}\n.readonly-select.zodiac-aries[_ngcontent-%COMP%] {\n  background: #fdf1f1;\n  color: #9f2f2f;\n}\n.readonly-select.zodiac-taurus[_ngcontent-%COMP%] {\n  background: #f7f3eb;\n  color: #6e4b2b;\n}\n.readonly-select.zodiac-gemini[_ngcontent-%COMP%] {\n  background: #fdf8e9;\n  color: #7d5a12;\n}\n.readonly-select.zodiac-cancer[_ngcontent-%COMP%] {\n  background: #eef4ff;\n  color: #2d5b8e;\n}\n.readonly-select.zodiac-leo[_ngcontent-%COMP%] {\n  background: #fff3e8;\n  color: #8f4b0d;\n}\n.readonly-select.zodiac-virgo[_ngcontent-%COMP%] {\n  background: #edf8ef;\n  color: #2b6b3d;\n}\n.readonly-select.zodiac-libra[_ngcontent-%COMP%] {\n  background: #f2eefc;\n  color: #60439d;\n}\n.readonly-select.zodiac-scorpio[_ngcontent-%COMP%] {\n  background: #f9edf2;\n  color: #7b3150;\n}\n.readonly-select.zodiac-sagittarius[_ngcontent-%COMP%] {\n  background: #eef1ff;\n  color: #2f4a9a;\n}\n.readonly-select.zodiac-capricorn[_ngcontent-%COMP%] {\n  background: #eff2f5;\n  color: #364653;\n}\n.readonly-select.zodiac-aquarius[_ngcontent-%COMP%] {\n  background: #ebf7fb;\n  color: #1d5f7a;\n}\n.readonly-select.zodiac-pisces[_ngcontent-%COMP%] {\n  background: #eef2ff;\n  color: #294b8f;\n}\n.physique-slim[_ngcontent-%COMP%] {\n  color: #3f7ab3;\n}\n.physique-lean[_ngcontent-%COMP%] {\n  color: #3f8f5f;\n}\n.physique-athletic[_ngcontent-%COMP%] {\n  color: #2f7e4d;\n}\n.physique-fit[_ngcontent-%COMP%] {\n  color: #465fbb;\n}\n.physique-curvy[_ngcontent-%COMP%] {\n  color: #a14875;\n}\n.physique-muscular[_ngcontent-%COMP%] {\n  color: #7d4f24;\n}\n.physique-average[_ngcontent-%COMP%] {\n  color: #4d667f;\n}\n.physique-select-wrap.physique-slim[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #eaf3fb 0%,\n      #dfebf8 100%);\n  border-color: rgba(63, 122, 179, 0.34);\n}\n.physique-select-wrap.physique-lean[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #eaf6ee 0%,\n      #def0e5 100%);\n  border-color: rgba(63, 143, 95, 0.34);\n}\n.physique-select-wrap.physique-athletic[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #e8f5ec 0%,\n      #dff0e6 100%);\n  border-color: rgba(47, 126, 77, 0.34);\n}\n.physique-select-wrap.physique-fit[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #ebf0ff 0%,\n      #e1e8fc 100%);\n  border-color: rgba(70, 95, 187, 0.34);\n}\n.physique-select-wrap.physique-curvy[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f7edf3 0%,\n      #f0e3ec 100%);\n  border-color: rgba(161, 72, 117, 0.36);\n}\n.physique-select-wrap.physique-muscular[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f6efe9 0%,\n      #ede3d8 100%);\n  border-color: rgba(125, 79, 36, 0.36);\n}\n.physique-select-wrap.physique-average[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #eef2f6 0%,\n      #e5ebf1 100%);\n  border-color: rgba(77, 102, 127, 0.34);\n}\n.physique-select-wrap.physique-slim[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #3f7ab3;\n}\n.physique-select-wrap.physique-lean[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #3f8f5f;\n}\n.physique-select-wrap.physique-athletic[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #2f7e4d;\n}\n.physique-select-wrap.physique-fit[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #465fbb;\n}\n.physique-select-wrap.physique-curvy[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #a14875;\n}\n.physique-select-wrap.physique-muscular[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #7d4f24;\n}\n.physique-select-wrap.physique-average[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #4d667f;\n}\n.experience-filter-all[_ngcontent-%COMP%] {\n  color: #694ea6;\n}\n.experience-filter-workspace[_ngcontent-%COMP%] {\n  color: #a1485a;\n}\n.experience-filter-school[_ngcontent-%COMP%] {\n  color: #2d5ea8;\n}\n.experience-filter-online[_ngcontent-%COMP%] {\n  color: #2d7d47;\n}\n.experience-filter-project[_ngcontent-%COMP%] {\n  color: #6550a0;\n}\n.experience-filter-select.experience-filter-all[_ngcontent-%COMP%], \n.experience-type-select.experience-filter-project[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #efe8ff 0%,\n      #e8defc 100%);\n  border-color: rgba(103, 76, 164, 0.32);\n}\n.experience-filter-select.experience-filter-workspace[_ngcontent-%COMP%], \n.experience-type-select.experience-filter-workspace[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #fff1f3 0%,\n      #ffe6ea 100%);\n  border-color: rgba(169, 72, 90, 0.32);\n}\n.experience-filter-select.experience-filter-school[_ngcontent-%COMP%], \n.experience-type-select.experience-filter-school[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #eaf4ff 0%,\n      #e1ecfb 100%);\n  border-color: rgba(45, 94, 168, 0.32);\n}\n.experience-type-select.experience-filter-online[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #edf8ee 0%,\n      #e2f1e4 100%);\n  border-color: rgba(44, 126, 72, 0.32);\n}\n.experience-type-select.experience-filter-project[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f4f0ff 0%,\n      #e9e3fb 100%);\n}\n.experience-type-select[_ngcontent-%COMP%] {\n  min-width: 0;\n  max-width: 100%;\n  min-height: 40px;\n}\n.experience-type-field[_ngcontent-%COMP%], \n.experience-title-field[_ngcontent-%COMP%], \n.experience-city-field[_ngcontent-%COMP%] {\n  width: 100%;\n  justify-self: stretch;\n}\n.experience-org-field[_ngcontent-%COMP%] {\n  width: 100%;\n  justify-self: stretch;\n}\n.experience-type-select[_ngcontent-%COMP%] {\n  width: 100%;\n}\n.experience-date-range-field[_ngcontent-%COMP%] {\n  width: 100%;\n  max-width: none;\n  margin: 0;\n  background: transparent;\n}\n.experience-date-range-label[_ngcontent-%COMP%] {\n  grid-column: 1/2;\n  width: 100%;\n  justify-self: stretch;\n}\n.experience-date-range-field[_ngcontent-%COMP%]   .mat-mdc-text-field-wrapper[_ngcontent-%COMP%] {\n  min-height: 42px;\n  border-radius: 10px;\n  background: #fff;\n  border: 1px solid rgba(136, 156, 186, 0.5);\n  box-shadow: none;\n}\n.experience-date-range-field[_ngcontent-%COMP%]   .mat-mdc-form-field-subscript-wrapper[_ngcontent-%COMP%] {\n  margin-top: 0.24rem;\n}\n.experience-date-range-field[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  border: 0 !important;\n  box-shadow: none !important;\n  border-radius: 0 !important;\n  background: transparent !important;\n  min-width: 0;\n  width: 100%;\n  padding: 0 !important;\n  min-height: 0 !important;\n  height: auto !important;\n  line-height: 1.25;\n}\n.experience-date-range-field[_ngcontent-%COMP%]   .mat-datepicker-toggle[_ngcontent-%COMP%] {\n  margin-right: 0.2rem;\n}\n.experience-date-range-field[_ngcontent-%COMP%]   .mat-mdc-form-field-hint-wrapper[_ngcontent-%COMP%], \n.experience-date-range-field[_ngcontent-%COMP%]   .mat-mdc-form-field-hint[_ngcontent-%COMP%] {\n  color: rgba(30, 49, 74, 0.65);\n  font-size: 0.72rem;\n}\n.experience-date-range-field[_ngcontent-%COMP%]   .mat-date-range-input-container[_ngcontent-%COMP%] {\n  width: 100%;\n  display: grid;\n  grid-template-columns: minmax(96px, 1fr) auto minmax(96px, 1fr);\n  align-items: center;\n  column-gap: 0.34rem;\n  min-width: 0;\n}\n.experience-date-range-field[_ngcontent-%COMP%]   .mat-date-range-input-separator[_ngcontent-%COMP%] {\n  margin: 0 0.28rem;\n  flex: 0 0 auto;\n  white-space: nowrap;\n}\n.experience-date-range-field[_ngcontent-%COMP%]   .mat-date-range-input-start-wrapper[_ngcontent-%COMP%], \n.experience-date-range-field[_ngcontent-%COMP%]   .mat-date-range-input-end-wrapper[_ngcontent-%COMP%] {\n  width: 100%;\n  max-width: 100%;\n  overflow: visible;\n  min-width: 0;\n}\n.experience-date-range-field[_ngcontent-%COMP%]   .mat-date-range-input-inner[_ngcontent-%COMP%] {\n  font-size: 0.96rem;\n  min-width: 0 !important;\n  width: 100% !important;\n  text-overflow: clip;\n  white-space: nowrap;\n  line-height: 1.25;\n}\n.experience-date-range-field[_ngcontent-%COMP%]   .mat-mdc-form-field-flex[_ngcontent-%COMP%] {\n  min-width: 0;\n  border-bottom: 0 !important;\n  box-shadow: none !important;\n  align-items: center !important;\n}\n.experience-date-range-field[_ngcontent-%COMP%]   .mat-mdc-form-field-infix[_ngcontent-%COMP%] {\n  padding-top: 0 !important;\n  padding-bottom: 0 !important;\n  min-height: 34px !important;\n  height: 34px;\n  display: flex;\n  align-items: center;\n}\n.experience-date-range-field[_ngcontent-%COMP%]   .mdc-line-ripple[_ngcontent-%COMP%], \n.experience-date-range-field[_ngcontent-%COMP%]   .mat-mdc-form-field-line-ripple[_ngcontent-%COMP%], \n.experience-date-range-field[_ngcontent-%COMP%]   .mdc-line-ripple--deactivating[_ngcontent-%COMP%], \n.experience-date-range-field[_ngcontent-%COMP%]   .mdc-line-ripple--active[_ngcontent-%COMP%] {\n  display: none !important;\n  opacity: 0 !important;\n  transform: scaleX(0) !important;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.experience-filter-all {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #efe8ff);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.experience-filter-workspace {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #fff1f3);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.experience-filter-school {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #eaf4ff);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.experience-filter-online {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #edf8ee);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.experience-filter-project {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #f4f0ff);\n}\n.mobile-profile-language-chip.language-tone-1[_ngcontent-%COMP%], \n.mobile-profile-selector-option.language-tone-1[_ngcontent-%COMP%], \n[_nghost-%COMP%]     .mat-mdc-option.language-tone-1 {\n  background: #eaf4ff;\n  border-color: rgba(63, 122, 179, 0.34);\n  color: #2f6090;\n}\n.mobile-profile-language-chip.language-tone-2[_ngcontent-%COMP%], \n.mobile-profile-selector-option.language-tone-2[_ngcontent-%COMP%], \n[_nghost-%COMP%]     .mat-mdc-option.language-tone-2 {\n  background: #edf8f4;\n  border-color: rgba(75, 127, 113, 0.34);\n  color: #2f695b;\n}\n.mobile-profile-language-chip.language-tone-3[_ngcontent-%COMP%], \n.mobile-profile-selector-option.language-tone-3[_ngcontent-%COMP%], \n[_nghost-%COMP%]     .mat-mdc-option.language-tone-3 {\n  background: #f1f2ff;\n  border-color: rgba(70, 95, 187, 0.34);\n  color: #394f9c;\n}\n.mobile-profile-language-chip.language-tone-4[_ngcontent-%COMP%], \n.mobile-profile-selector-option.language-tone-4[_ngcontent-%COMP%], \n[_nghost-%COMP%]     .mat-mdc-option.language-tone-4 {\n  background: #fff2f8;\n  border-color: rgba(161, 72, 117, 0.34);\n  color: #8d3f66;\n}\n.mobile-profile-language-chip.language-tone-5[_ngcontent-%COMP%], \n.mobile-profile-selector-option.language-tone-5[_ngcontent-%COMP%], \n[_nghost-%COMP%]     .mat-mdc-option.language-tone-5 {\n  background: #fbf4ea;\n  border-color: rgba(125, 79, 36, 0.34);\n  color: #704822;\n}\n.mobile-profile-language-chip.language-tone-6[_ngcontent-%COMP%], \n.mobile-profile-selector-option.language-tone-6[_ngcontent-%COMP%], \n[_nghost-%COMP%]     .mat-mdc-option.language-tone-6 {\n  background: #eff4f9;\n  border-color: rgba(77, 102, 127, 0.34);\n  color: #415872;\n}\n.mobile-profile-language-chip.language-tone-7[_ngcontent-%COMP%], \n.mobile-profile-selector-option.language-tone-7[_ngcontent-%COMP%], \n[_nghost-%COMP%]     .mat-mdc-option.language-tone-7 {\n  background: #f7f5ea;\n  border-color: rgba(128, 109, 66, 0.34);\n  color: #746237;\n}\n.mobile-profile-language-chip.language-tone-8[_ngcontent-%COMP%], \n.mobile-profile-selector-option.language-tone-8[_ngcontent-%COMP%], \n[_nghost-%COMP%]     .mat-mdc-option.language-tone-8 {\n  background: #edf5ff;\n  border-color: rgba(45, 122, 160, 0.34);\n  color: #2f6782;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-1 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #eaf2ff);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-2 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #ebf7ef);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-3 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #fff1e3);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-4 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #efecfc);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-5 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #f3f8e9);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-6 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #fceef3);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-7 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #edf7ff);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-8 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #f6f2e9);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-1 .status-option-content {\n  color: #2d63a9;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-2 .status-option-content {\n  color: #2a7a49;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-3 .status-option-content {\n  color: #9b6018;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-4 .status-option-content {\n  color: #6153a2;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-5 .status-option-content {\n  color: #61812a;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-6 .status-option-content {\n  color: #9f446d;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-7 .status-option-content {\n  color: #2e7898;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-8 .status-option-content {\n  color: #806c3f;\n}\n.mobile-profile-selector-option.detail-tone-1[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #eef5ff 0%,\n      #e3eefc 100%);\n  border-color: rgba(46, 102, 181, 0.32);\n}\n.mobile-profile-selector-option.detail-tone-2[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #eef9f3 0%,\n      #e3f4ea 100%);\n  border-color: rgba(40, 125, 72, 0.32);\n}\n.mobile-profile-selector-option.detail-tone-3[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #fff4ea 0%,\n      #ffecdd 100%);\n  border-color: rgba(165, 94, 24, 0.32);\n}\n.mobile-profile-selector-option.detail-tone-4[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f2f1ff 0%,\n      #e8e5fb 100%);\n  border-color: rgba(97, 82, 164, 0.32);\n}\n.mobile-profile-selector-option.detail-tone-5[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f6f9ef 0%,\n      #edf3e1 100%);\n  border-color: rgba(95, 128, 36, 0.32);\n}\n.mobile-profile-selector-option.detail-tone-6[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #fff1f4 0%,\n      #f9e6ed 100%);\n  border-color: rgba(160, 70, 111, 0.32);\n}\n.mobile-profile-selector-option.detail-tone-7[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #edf8ff 0%,\n      #e2f0fb 100%);\n  border-color: rgba(45, 122, 160, 0.32);\n}\n.mobile-profile-selector-option.detail-tone-8[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f6f3ea 0%,\n      #eee9dc 100%);\n  border-color: rgba(128, 109, 66, 0.32);\n}\n.mobile-profile-selector-option.status-public[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #e6f6ef 0%,\n      #d9f0e6 100%);\n  border-color: rgba(47, 143, 102, 0.34);\n}\n.mobile-profile-selector-option.status-friends[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #e8f1fd 0%,\n      #dfeaf9 100%);\n  border-color: rgba(27, 87, 161, 0.34);\n}\n.mobile-profile-selector-option.status-host[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f6efe2 0%,\n      #eee4d2 100%);\n  border-color: rgba(135, 88, 15, 0.36);\n}\n.mobile-profile-selector-option.status-inactive[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f2f3f5 0%,\n      #e8ebef 100%);\n  border-color: rgba(91, 101, 115, 0.32);\n}\n.mobile-profile-selector-option.physique-slim[_ngcontent-%COMP%] {\n  background: #eaf4ff;\n  border-color: rgba(63, 122, 179, 0.34);\n}\n.mobile-profile-selector-option.physique-lean[_ngcontent-%COMP%] {\n  background: #edf8f4;\n  border-color: rgba(75, 127, 113, 0.34);\n}\n.mobile-profile-selector-option.physique-athletic[_ngcontent-%COMP%] {\n  background: #e8f5ec;\n  border-color: rgba(47, 126, 77, 0.34);\n}\n.mobile-profile-selector-option.physique-fit[_ngcontent-%COMP%] {\n  background: #f1f2ff;\n  border-color: rgba(70, 95, 187, 0.34);\n}\n.mobile-profile-selector-option.physique-curvy[_ngcontent-%COMP%] {\n  background: #fff2f8;\n  border-color: rgba(161, 72, 117, 0.34);\n}\n.mobile-profile-selector-option.physique-muscular[_ngcontent-%COMP%] {\n  background: #fbf4ea;\n  border-color: rgba(125, 79, 36, 0.34);\n}\n.mobile-profile-selector-option.physique-average[_ngcontent-%COMP%] {\n  background: #eff4f9;\n  border-color: rgba(77, 102, 127, 0.34);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .values-selector-popup.profile-selector-popup[_ngcontent-%COMP%] {\n  gap: 0.56rem;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-filter-selector-head[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.44rem;\n  padding-bottom: 0.22rem;\n  border-bottom: 1px solid rgba(74, 102, 139, 0.22);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-filter-selector-head-label[_ngcontent-%COMP%] {\n  color: #203c64;\n  font-size: 0.82rem;\n  font-weight: 800;\n  line-height: 1.2;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-filter-selector-clear[_ngcontent-%COMP%] {\n  border: 1px solid rgba(41, 73, 110, 0.24);\n  border-radius: 999px;\n  background: rgba(255, 255, 255, 0.82);\n  color: #284970;\n  font: inherit;\n  font-size: 0.72rem;\n  font-weight: 700;\n  line-height: 1;\n  padding: 0.3rem 0.52rem;\n  cursor: pointer;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-filter-selector-clear.is-hidden[_ngcontent-%COMP%] {\n  visibility: hidden;\n  pointer-events: none;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-filter-selector-selected[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 0.34rem;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-filter-selector-chip[_ngcontent-%COMP%] {\n  border: 1px solid rgba(35, 68, 107, 0.24);\n  border-radius: 999px;\n  background: rgba(255, 255, 255, 0.92);\n  color: #234368;\n  font: inherit;\n  font-size: 0.72rem;\n  font-weight: 700;\n  line-height: 1;\n  padding: 0.26rem 0.48rem;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.16rem;\n  cursor: pointer;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-filter-selector-chip[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 13px;\n  height: 13px;\n  font-size: 13px;\n  line-height: 13px;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-filter-selector-empty[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 0.74rem;\n  color: rgba(31, 54, 86, 0.62);\n  font-style: italic;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.34rem;\n  border: 1px solid transparent;\n  border-radius: 12px;\n  padding: 0.4rem 0.42rem;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-head[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.34rem;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-tag[_ngcontent-%COMP%] {\n  border-radius: 999px;\n  border: 1px solid rgba(52, 86, 128, 0.28);\n  background: rgba(255, 255, 255, 0.74);\n  color: #2f527d;\n  font-size: 0.67rem;\n  font-weight: 800;\n  letter-spacing: 0.02em;\n  line-height: 1;\n  padding: 0.2rem 0.52rem;\n  text-transform: uppercase;\n  white-space: nowrap;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.24rem;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-tag-icon[_ngcontent-%COMP%] {\n  width: 12px;\n  height: 12px;\n  font-size: 12px;\n  line-height: 12px;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-line[_ngcontent-%COMP%] {\n  display: block;\n  width: 100%;\n  height: 1px;\n  background: rgba(84, 111, 147, 0.34);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-chip-grid[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 0.36rem;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-chip[_ngcontent-%COMP%] {\n  border: 1px solid rgba(41, 70, 106, 0.22);\n  border-radius: 999px;\n  background: #f4f8ff;\n  color: #234066;\n  font: inherit;\n  font-size: 0.78rem;\n  font-weight: 700;\n  padding: 0.3rem 0.58rem;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.26rem;\n  cursor: pointer;\n  transition:\n    background-color 0.14s ease,\n    border-color 0.14s ease,\n    color 0.14s ease,\n    box-shadow 0.14s ease;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-chip.active[_ngcontent-%COMP%] {\n  border-color: rgba(27, 85, 158, 0.5);\n  background:\n    linear-gradient(\n      180deg,\n      #dcebff 0%,\n      #cfe3ff 100%);\n  color: #123e70;\n  box-shadow: inset 0 0 0 1px rgba(30, 73, 127, 0.24), 0 1px 2px rgba(24, 53, 86, 0.16);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group.section-family[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 232, 219, 0.52) 0%,\n      rgba(255, 232, 219, 0.3) 100%);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group.section-ambition[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 242, 216, 0.52) 0%,\n      rgba(255, 242, 216, 0.3) 100%);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group.section-lifestyle[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(221, 241, 239, 0.56) 0%,\n      rgba(221, 241, 239, 0.32) 100%);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group.section-beliefs[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(230, 226, 250, 0.56) 0%,\n      rgba(230, 226, 250, 0.32) 100%);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group.section-social[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(223, 236, 255, 0.5) 0%,\n      rgba(223, 236, 255, 0.28) 100%);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group.section-arts[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(235, 227, 255, 0.5) 0%,\n      rgba(235, 227, 255, 0.28) 100%);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group.section-food[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 236, 221, 0.52) 0%,\n      rgba(255, 236, 221, 0.3) 100%);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group.section-active[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(222, 243, 231, 0.56) 0%,\n      rgba(222, 243, 231, 0.32) 100%);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group.section-mind[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(219, 242, 238, 0.56) 0%,\n      rgba(219, 242, 238, 0.32) 100%);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group.section-identity[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(230, 226, 250, 0.56) 0%,\n      rgba(230, 226, 250, 0.32) 100%);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-tag.section-family[_ngcontent-%COMP%] {\n  border-color: rgba(156, 94, 51, 0.34);\n  color: #9c5e33;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-tag.section-ambition[_ngcontent-%COMP%] {\n  border-color: rgba(160, 106, 20, 0.34);\n  color: #9b6717;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-tag.section-lifestyle[_ngcontent-%COMP%] {\n  border-color: rgba(47, 123, 119, 0.34);\n  color: #2f7b77;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-tag.section-beliefs[_ngcontent-%COMP%] {\n  border-color: rgba(95, 78, 160, 0.34);\n  color: #5f4ea0;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-tag.section-social[_ngcontent-%COMP%] {\n  border-color: rgba(47, 106, 175, 0.36);\n  color: #2f6aaf;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-tag.section-arts[_ngcontent-%COMP%] {\n  border-color: rgba(106, 87, 168, 0.36);\n  color: #6a57a8;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-tag.section-food[_ngcontent-%COMP%] {\n  border-color: rgba(170, 97, 28, 0.34);\n  color: #a55e18;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-tag.section-active[_ngcontent-%COMP%] {\n  border-color: rgba(49, 124, 82, 0.36);\n  color: #317c52;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-tag.section-mind[_ngcontent-%COMP%] {\n  border-color: rgba(37, 124, 118, 0.34);\n  color: #2b7c76;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-tag.section-identity[_ngcontent-%COMP%] {\n  border-color: rgba(98, 84, 163, 0.34);\n  color: #6254a3;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-line.section-family[_ngcontent-%COMP%] {\n  background: rgba(156, 94, 51, 0.3);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-line.section-ambition[_ngcontent-%COMP%] {\n  background: rgba(160, 106, 20, 0.32);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-line.section-lifestyle[_ngcontent-%COMP%] {\n  background: rgba(47, 123, 119, 0.3);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-line.section-beliefs[_ngcontent-%COMP%] {\n  background: rgba(95, 78, 160, 0.3);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-line.section-social[_ngcontent-%COMP%] {\n  background: rgba(47, 106, 175, 0.34);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-line.section-arts[_ngcontent-%COMP%] {\n  background: rgba(106, 87, 168, 0.34);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-line.section-food[_ngcontent-%COMP%] {\n  background: rgba(170, 97, 28, 0.32);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-line.section-active[_ngcontent-%COMP%] {\n  background: rgba(49, 124, 82, 0.34);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-line.section-mind[_ngcontent-%COMP%] {\n  background: rgba(37, 124, 118, 0.34);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-line.section-identity[_ngcontent-%COMP%] {\n  background: rgba(98, 84, 163, 0.3);\n}\n[_nghost-%COMP%]     .mat-mdc-option.mdc-list-item--selected:not(.mdc-list-item--disabled):not(.status-option) {\n  background: #f0f5fc;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.mdc-list-item--selected:not(.mdc-list-item--disabled) {\n  filter: brightness(0.95);\n  box-shadow: inset 0 0 0 1px rgba(24, 46, 76, 0.2);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option {\n  background: #fff;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option:not(:last-child) {\n  border-bottom: 1px solid #e6edf7;\n}\n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.hide-selected-option, \n[_nghost-%COMP%]     .status-options-panel .mat-mdc-option.hide-selected-option {\n  min-height: 0 !important;\n  height: 0 !important;\n  padding-top: 0 !important;\n  padding-bottom: 0 !important;\n  border: 0 !important;\n  margin: 0 !important;\n  opacity: 0 !important;\n  pointer-events: none !important;\n  overflow: hidden !important;\n}\n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option {\n  background: #fff;\n}\n[_nghost-%COMP%]     .mat-mdc-select-panel.selector-options-panel, \n[_nghost-%COMP%]     .mat-mdc-select-panel.status-options-panel {\n  margin-top: 8px !important;\n  margin-bottom: 8px !important;\n}\n[_nghost-%COMP%]     .mat-mdc-select-panel.selector-options-panel.mat-mdc-select-panel-above, \n[_nghost-%COMP%]     .mat-mdc-select-panel.status-options-panel.mat-mdc-select-panel-above, \n[_nghost-%COMP%]     .cdk-overlay-pane .mat-mdc-select-panel.selector-options-panel.mat-mdc-select-panel-above, \n[_nghost-%COMP%]     .cdk-overlay-pane .mat-mdc-select-panel.status-options-panel.mat-mdc-select-panel-above {\n  margin-top: 0 !important;\n  margin-bottom: 18px !important;\n  transform: translateY(-10px) !important;\n}\n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.status-option.status-public, \n[_nghost-%COMP%]     .status-options-panel .mat-mdc-option.status-option.status-public {\n  --mdc-list-list-item-container-color: #def3e9;\n  --mat-mdc-option-selected-container-color: #def3e9;\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #def3e9) !important;\n}\n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.status-option.status-friends, \n[_nghost-%COMP%]     .status-options-panel .mat-mdc-option.status-option.status-friends {\n  --mdc-list-list-item-container-color: #e3eefb;\n  --mat-mdc-option-selected-container-color: #e3eefb;\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #e3eefb) !important;\n}\n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.status-option.status-host, \n[_nghost-%COMP%]     .status-options-panel .mat-mdc-option.status-option.status-host {\n  --mdc-list-list-item-container-color: #f3ead8;\n  --mat-mdc-option-selected-container-color: #f3ead8;\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #f3ead8) !important;\n}\n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.status-option.status-inactive, \n[_nghost-%COMP%]     .status-options-panel .mat-mdc-option.status-option.status-inactive {\n  --mdc-list-list-item-container-color: #eceff3;\n  --mat-mdc-option-selected-container-color: #eceff3;\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #eceff3) !important;\n}\n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.status-option.status-public .status-option-content, \n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.status-option.status-public .status-option-content .mat-icon, \n[_nghost-%COMP%]     .status-options-panel .mat-mdc-option.status-option.status-public .status-option-content, \n[_nghost-%COMP%]     .status-options-panel .mat-mdc-option.status-option.status-public .status-option-content .mat-icon {\n  color: #2f8f66 !important;\n}\n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.status-option.status-friends .status-option-content, \n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.status-option.status-friends .status-option-content .mat-icon, \n[_nghost-%COMP%]     .status-options-panel .mat-mdc-option.status-option.status-friends .status-option-content, \n[_nghost-%COMP%]     .status-options-panel .mat-mdc-option.status-option.status-friends .status-option-content .mat-icon {\n  color: #1b57a1 !important;\n}\n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.status-option.status-host .status-option-content, \n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.status-option.status-host .status-option-content .mat-icon, \n[_nghost-%COMP%]     .status-options-panel .mat-mdc-option.status-option.status-host .status-option-content, \n[_nghost-%COMP%]     .status-options-panel .mat-mdc-option.status-option.status-host .status-option-content .mat-icon {\n  color: #87580f !important;\n}\n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.status-option.status-inactive .status-option-content, \n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.status-option.status-inactive .status-option-content .mat-icon, \n[_nghost-%COMP%]     .status-options-panel .mat-mdc-option.status-option.status-inactive .status-option-content, \n[_nghost-%COMP%]     .status-options-panel .mat-mdc-option.status-option.status-inactive .status-option-content .mat-icon {\n  color: #5b6573 !important;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.physique-slim {\n  background: #eaf4ff;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.physique-lean {\n  background: #edf8f4;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.physique-athletic {\n  background: #e8f5ec;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.physique-fit {\n  background: #f1f2ff;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.physique-curvy {\n  background: #fff2f8;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.physique-muscular {\n  background: #fbf4ea;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.physique-average {\n  background: #eff4f9;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.physique-slim .status-option-content {\n  color: #3f7ab3;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.physique-lean .status-option-content {\n  color: #3f8f5f;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.physique-athletic .status-option-content {\n  color: #2f7e4d;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.physique-fit .status-option-content {\n  color: #465fbb;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.physique-curvy .status-option-content {\n  color: #a14875;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.physique-muscular .status-option-content {\n  color: #7d4f24;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.physique-average .status-option-content {\n  color: #4d667f;\n}\n[_nghost-%COMP%]     .mat-mdc-select-panel.physique-options-panel {\n  width: auto !important;\n  max-width: 220px !important;\n  min-width: 0 !important;\n}\n[_nghost-%COMP%]     .physique-options-panel .mat-mdc-option {\n  padding-right: 8px;\n}\n[_nghost-%COMP%]     .physique-options-panel .mat-mdc-option .mat-pseudo-checkbox {\n  margin-left: 4px;\n}\n@media (max-width: 760px) {\n  .experience-form-grid[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n    max-width: none;\n    justify-content: stretch;\n    row-gap: 0.72rem;\n  }\n  .experience-date-range-label[_ngcontent-%COMP%] {\n    grid-column: 1/-1;\n  }\n  .experience-date-range-field[_ngcontent-%COMP%]   .mat-date-range-input-container[_ngcontent-%COMP%] {\n    grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);\n  }\n  .profile-details-privacy-fab[_ngcontent-%COMP%]   .privacy-fab-actions[_ngcontent-%COMP%] {\n    position: fixed;\n    left: 0.5rem;\n    right: 0.5rem;\n    bottom: max(0.5rem, env(safe-area-inset-bottom));\n    top: auto;\n    transform: translateY(12px) scale(0.98);\n    transform-origin: bottom center;\n    justify-content: center;\n    gap: 0.46rem;\n    padding: 0.46rem 0.56rem;\n    border: 1px solid rgba(42, 68, 102, 0.2);\n    border-radius: 14px;\n    background: #fff;\n    box-shadow: 0 -12px 24px rgba(18, 31, 51, 0.22);\n  }\n  .profile-details-privacy-fab.open[_ngcontent-%COMP%]   .privacy-fab-actions[_ngcontent-%COMP%] {\n    transform: translateY(0) scale(1);\n  }\n}\n.event-feedback-popup-module[_ngcontent-%COMP%], \n.event-feedback-parent-popup[_ngcontent-%COMP%] {\n  display: contents;\n}\n.event-feedback-parent-hidden[_ngcontent-%COMP%] {\n  visibility: hidden;\n  pointer-events: none;\n}\n.event-feedback-stacked-content[_ngcontent-%COMP%] {\n  width: 100%;\n  min-height: 0;\n  display: flex;\n  flex: 1 1 auto;\n  flex-direction: column;\n}\n.event-feedback-stacked-content--detail[_ngcontent-%COMP%], \n.event-feedback-stacked-content--organizer[_ngcontent-%COMP%] {\n  height: 100%;\n  overflow: hidden;\n}\n.event-feedback-stacked-content--organizer[_ngcontent-%COMP%] {\n  overflow-y: auto;\n  overflow-x: hidden;\n}\n.link-btn[_ngcontent-%COMP%] {\n  border: 1px solid rgba(23, 33, 54, 0.2);\n  border-radius: 14px;\n  background: #fff;\n  color: #1f3350;\n  font: inherit;\n  font-size: 0.83rem;\n  padding: 0.46rem 0.82rem;\n  cursor: pointer;\n  transition:\n    transform 0.16s ease,\n    box-shadow 0.16s ease,\n    opacity 0.16s ease,\n    background 0.16s ease;\n}\n.link-btn[_ngcontent-%COMP%]:not(:disabled):hover {\n  transform: translateY(-1px);\n}\n.link-btn[_ngcontent-%COMP%]:not(:disabled):active {\n  transform: translateY(0);\n}\n.neutral-btn[_ngcontent-%COMP%] {\n  background: #f2f4fa;\n  border-color: rgba(23, 33, 54, 0.12);\n}\n.primary-btn[_ngcontent-%COMP%] {\n  background: #4776b7;\n  border-color: #4776b7;\n  color: #fff;\n}\n.editor-list-card[_ngcontent-%COMP%] {\n  border: 1px solid rgba(13, 25, 44, 0.12);\n  border-radius: 11px;\n  padding: 0.56rem;\n  background: #fbfdff;\n}\n.editor-list-card[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 0.9rem;\n  color: var(--text-main);\n}\n.editor-list-card[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin-top: 0.26rem;\n  font-size: 0.78rem;\n  color: rgba(23, 41, 66, 0.72);\n}\n.support-popup[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 0.5rem;\n}\n.support-card[_ngcontent-%COMP%] {\n  background: #fff;\n}\n.support-form[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 0.48rem;\n  margin-top: 0.54rem;\n  min-width: 0;\n}\n.support-form[_ngcontent-%COMP%]   label[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 0.22rem;\n  min-width: 0;\n}\n.support-form[_ngcontent-%COMP%]   label[_ngcontent-%COMP%]    > span[_ngcontent-%COMP%] {\n  font-size: 0.75rem;\n  font-weight: 700;\n  color: rgba(29, 47, 72, 0.9);\n}\n.support-form[_ngcontent-%COMP%]   input[_ngcontent-%COMP%], \n.support-form[_ngcontent-%COMP%]   select[_ngcontent-%COMP%], \n.support-form[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%] {\n  width: 100%;\n  max-width: 100%;\n  min-width: 0;\n  box-sizing: border-box;\n  border: 1px solid rgba(15, 27, 47, 0.16);\n  border-radius: 10px;\n  padding: 0.48rem 0.56rem;\n  font: inherit;\n  color: var(--text-main);\n  background: #fff;\n}\n.support-form[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]:focus, \n.support-form[_ngcontent-%COMP%]   select[_ngcontent-%COMP%]:focus, \n.support-form[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%]:focus {\n  outline: 0;\n  border-color: rgba(52, 103, 182, 0.72);\n  box-shadow: 0 0 0 3px rgba(55, 116, 212, 0.14);\n}\n.support-form[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%] {\n  min-height: 96px;\n  resize: vertical;\n}\n.support-submit-success[_ngcontent-%COMP%] {\n  border: 1px solid rgba(41, 131, 84, 0.35);\n  border-radius: 10px;\n  background:\n    linear-gradient(\n      180deg,\n      rgba(220, 249, 231, 0.95) 0%,\n      rgba(208, 245, 223, 0.95) 100%);\n  color: #1f6f48;\n  font-size: 0.78rem;\n  font-weight: 700;\n  line-height: 1.35;\n  padding: 0.52rem 0.58rem;\n}\n.support-submit-error[_ngcontent-%COMP%] {\n  border: 1px solid rgba(180, 35, 46, 0.32);\n  border-radius: 10px;\n  background: rgba(255, 235, 238, 0.96);\n  color: #a61f2b;\n  font-size: 0.78rem;\n  font-weight: 700;\n  line-height: 1.35;\n  padding: 0.52rem 0.58rem;\n}\n.support-actions[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: flex-end;\n  align-items: center;\n  gap: 0.45rem;\n  flex-wrap: wrap;\n}\n.support-actions[_ngcontent-%COMP%]   .primary-btn[_ngcontent-%COMP%]:disabled {\n  background:\n    linear-gradient(\n      180deg,\n      #d9e2f2 0%,\n      #c9d4e8 100%);\n  border-color: rgba(74, 103, 145, 0.32);\n  color: rgba(29, 51, 83, 0.72);\n  cursor: not-allowed;\n  box-shadow: none;\n  opacity: 1;\n}\n.event-feedback-list-popup[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 0.44rem;\n  height: 100%;\n  min-height: 0;\n}\napp-smart-list.event-feedback-list-surface[_ngcontent-%COMP%] {\n  display: flex;\n  flex: 1 1 auto;\n  min-height: 0;\n}\n.event-feedback-event-list[_ngcontent-%COMP%] {\n  flex: 1;\n  min-height: 0;\n  overflow-y: auto;\n  overflow-x: hidden;\n  display: grid;\n  gap: 0.44rem;\n}\n[_nghost-%COMP%]     .event-feedback-list-surface .smart-list__header-progress-shell {\n  z-index: 8;\n}\n[_nghost-%COMP%]     .event-feedback-info-card-shell .ui-info-card {\n  background:\n    linear-gradient(\n      180deg,\n      #f8faff 0%,\n      #f1f6ff 100%);\n  border-color: rgba(53, 89, 139, 0.22);\n}\n[_nghost-%COMP%]     .event-feedback-info-card-shell.is-feedbacked .ui-info-card {\n  background:\n    linear-gradient(\n      180deg,\n      #edf8ef 0%,\n      #e3f3e7 100%);\n  border-color: rgba(57, 127, 77, 0.26);\n}\n[_nghost-%COMP%]     .event-feedback-info-card-shell.is-removed .ui-info-card {\n  background:\n    linear-gradient(\n      180deg,\n      #fff2f2 0%,\n      #fce7e7 100%);\n  border-color: rgba(170, 80, 80, 0.28);\n}\n[_nghost-%COMP%]     .event-feedback-info-card-shell .ui-info-card__leading {\n  border: 1px solid rgba(59, 93, 136, 0.28);\n  background: rgba(255, 255, 255, 0.84);\n}\n[_nghost-%COMP%]     .event-feedback-info-card-shell .ui-info-card__overlay-action--end {\n  min-width: 102px;\n  border-color: rgba(95, 61, 152, 0.36);\n  background:\n    linear-gradient(\n      180deg,\n      #f6efff 0%,\n      #ebdfff 100%);\n  color: #5f3d98;\n}\n@media (hover: hover) and (pointer: fine) {\n  [_nghost-%COMP%]     .event-feedback-info-card-shell button.ui-info-card__overlay-action--end:hover {\n    transform: translateY(-1px);\n    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.82), 0 10px 22px rgba(38, 18, 68, 0.2);\n    filter: brightness(1.04);\n  }\n}\n[_nghost-%COMP%]     .event-feedback-info-card-shell.is-feedbacked .ui-info-card__overlay-action--end, \n[_nghost-%COMP%]     .event-feedback-info-card-shell.is-removed .ui-info-card__overlay-action--end {\n  opacity: 0.74;\n}\n[_nghost-%COMP%]     .event-feedback-info-card-shell .ui-info-card__detail-row {\n  margin-top: 0.02rem;\n  font-size: 0.72rem;\n  font-weight: 700;\n  color: rgba(42, 62, 91, 0.86);\n}\n[_nghost-%COMP%]     .event-feedback-info-card-shell .ui-info-card__detail-row:last-of-type {\n  color: rgba(39, 60, 89, 0.72);\n}\n[_nghost-%COMP%]     .event-feedback-info-card-shell .ui-info-card__menu {\n  z-index: 180;\n}\n[_nghost-%COMP%]     .event-feedback-info-card-shell.is-own-event .ui-info-card__overlay-action--end {\n  min-width: 118px;\n  border-color: rgba(180, 111, 45, 0.34);\n  background:\n    linear-gradient(\n      180deg,\n      #fff3df 0%,\n      #ffe8c7 100%);\n  color: #8a5418;\n}\n.event-feedback-sticky-header[_ngcontent-%COMP%] {\n  z-index: 26;\n  margin-bottom: 0;\n  box-shadow: 0 0.34rem 0 rgba(255, 255, 255, 0.98);\n}\n.event-feedback-organizer-popup[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  width: 100%;\n}\n.event-feedback-organizer-shell[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 0.9rem;\n  width: 100%;\n  max-width: none;\n  box-sizing: border-box;\n}\n.event-feedback-organizer-loading[_ngcontent-%COMP%] {\n  min-height: min(56vh, 28rem);\n  display: grid;\n  place-items: center;\n}\n.event-feedback-organizer-overview-grid[_ngcontent-%COMP%] {\n  --event-feedback-organizer-overview-height: 244px;\n  display: grid;\n  grid-template-columns: minmax(300px, 360px) minmax(0, 1fr);\n  gap: 0.9rem;\n  align-items: start;\n}\n.event-feedback-organizer-info-card-shell[_ngcontent-%COMP%] {\n  width: 100%;\n  max-width: 360px;\n  height: var(--event-feedback-organizer-overview-height);\n  align-self: start;\n}\n.event-feedback-organizer-info-card-shell[_ngcontent-%COMP%], \n.event-feedback-organizer-hero-card[_ngcontent-%COMP%] {\n  display: block;\n  width: 100%;\n  max-width: 100%;\n  height: 100%;\n}\n[_nghost-%COMP%]     .event-feedback-organizer-hero-card .ui-info-card {\n  width: 100%;\n  height: 100%;\n  max-width: none;\n  gap: 0.32rem;\n  padding: 0.58rem 0.62rem;\n  border-radius: 12px;\n}\n[_nghost-%COMP%]     .event-feedback-organizer-hero-card .ui-info-card__media {\n  height: 130px;\n  border-radius: 10px;\n}\n[_nghost-%COMP%]     .event-feedback-organizer-hero-card .ui-info-card__title {\n  font-size: 0.84rem;\n}\n[_nghost-%COMP%]     .event-feedback-organizer-hero-card .ui-info-card__meta-row {\n  font-size: 0.74rem;\n}\n[_nghost-%COMP%]     .event-feedback-organizer-hero-card .ui-info-card__detail-row {\n  font-size: 0.74rem;\n}\n.event-feedback-organizer-messages[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 0.56rem;\n}\n.event-feedback-organizer-carousel-panel[_ngcontent-%COMP%] {\n  min-width: 0;\n  height: var(--event-feedback-organizer-overview-height);\n  align-self: stretch;\n  box-sizing: border-box;\n}\n.event-feedback-organizer-carousel[_ngcontent-%COMP%] {\n  display: grid;\n  height: 100%;\n  grid-template-rows: auto minmax(0, 1fr);\n  gap: 0.28rem;\n  min-height: 0;\n}\n.event-feedback-organizer-carousel-pill-strip[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(3, minmax(0, 1fr));\n  gap: 0.26rem;\n}\n.event-feedback-organizer-carousel-pill[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  min-height: 36px;\n  padding: 0.22rem 0.34rem;\n  border: 1px solid rgba(116, 127, 156, 0.18);\n  border-radius: 13px;\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 255, 255, 0.94) 0%,\n      rgba(243, 245, 250, 0.98) 100%);\n  color: #3b4560;\n  text-align: left;\n  cursor: pointer;\n  transition:\n    transform 0.18s ease,\n    border-color 0.18s ease,\n    box-shadow 0.18s ease,\n    background 0.18s ease;\n}\n.event-feedback-organizer-carousel-pill[_ngcontent-%COMP%]:hover {\n  transform: translateY(-1px);\n  border-color: rgba(89, 108, 153, 0.3);\n  box-shadow: 0 6px 16px rgba(37, 45, 68, 0.08);\n}\n.event-feedback-organizer-carousel-pill.is-active[_ngcontent-%COMP%] {\n  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.88), 0 8px 22px rgba(57, 84, 142, 0.08);\n}\n.event-feedback-organizer-carousel-pill-head[_ngcontent-%COMP%] {\n  display: flex;\n  width: 100%;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.3rem;\n}\n.event-feedback-organizer-carousel-pill-label[_ngcontent-%COMP%] {\n  color: #1f2937;\n  font-size: 0.7rem;\n  font-weight: 900;\n  line-height: 1.08;\n  min-width: 0;\n}\n.event-feedback-organizer-carousel-pill-badge[_ngcontent-%COMP%] {\n  display: inline-flex;\n  flex: 0 0 auto;\n  align-items: center;\n  justify-content: center;\n  min-width: 1.22rem;\n  min-height: 1.04rem;\n  padding: 0.02rem 0.24rem;\n  border-radius: 999px;\n  border: 1px solid rgba(187, 120, 33, 0.24);\n  background:\n    linear-gradient(\n      180deg,\n      #fff1d4 0%,\n      #ffdca0 100%);\n  color: #8b530c;\n  font-size: 0.58rem;\n  font-weight: 900;\n  line-height: 1;\n  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.94);\n}\n.event-feedback-organizer-carousel-pill.event-feedback-organizer-carousel-card-tone-overall[_ngcontent-%COMP%] {\n  border-color: rgba(47, 139, 174, 0.18);\n  background:\n    linear-gradient(\n      180deg,\n      #f7fbff 0%,\n      #edf5fd 100%);\n}\n.event-feedback-organizer-carousel-pill.event-feedback-organizer-carousel-card-tone-overall.is-active[_ngcontent-%COMP%] {\n  border-color: rgba(47, 139, 174, 0.32);\n  background:\n    linear-gradient(\n      180deg,\n      #eef7ff 0%,\n      #e3f0fb 100%);\n}\n.event-feedback-organizer-carousel-pill.event-feedback-organizer-carousel-card-tone-improve[_ngcontent-%COMP%] {\n  border-color: rgba(184, 92, 116, 0.16);\n  background:\n    linear-gradient(\n      180deg,\n      #fff8fa 0%,\n      #fef1f5 100%);\n}\n.event-feedback-organizer-carousel-pill.event-feedback-organizer-carousel-card-tone-improve.is-active[_ngcontent-%COMP%] {\n  border-color: rgba(184, 92, 116, 0.28);\n  background:\n    linear-gradient(\n      180deg,\n      #fff2f6 0%,\n      #fde8ef 100%);\n}\n.event-feedback-organizer-carousel-pill.event-feedback-organizer-carousel-card-tone-traits[_ngcontent-%COMP%] {\n  border-color: rgba(122, 76, 196, 0.16);\n  background:\n    linear-gradient(\n      180deg,\n      #fbf8ff 0%,\n      #f3ecff 100%);\n}\n.event-feedback-organizer-carousel-pill.event-feedback-organizer-carousel-card-tone-traits.is-active[_ngcontent-%COMP%] {\n  border-color: rgba(122, 76, 196, 0.28);\n  background:\n    linear-gradient(\n      180deg,\n      #f6f0ff 0%,\n      #eee4ff 100%);\n}\n.event-feedback-organizer-carousel-card[_ngcontent-%COMP%] {\n  --organizer-accent: #6a45a3;\n  --organizer-accent-soft: rgba(106, 69, 163, 0.18);\n  --organizer-surface:\n    linear-gradient(\n      180deg,\n      #fbf8ff 0%,\n      #f2ebff 100%);\n  display: flex;\n  flex-direction: column;\n  gap: 0.36rem;\n  min-height: 0;\n  height: 100%;\n  box-sizing: border-box;\n  padding: 0.56rem 0.62rem 0.6rem;\n  border: 1px solid var(--organizer-accent-soft);\n  border-radius: 18px;\n  background: var(--organizer-surface);\n  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.9), 0 10px 24px rgba(41, 49, 70, 0.08);\n  overflow: hidden;\n}\n.event-feedback-organizer-carousel-card-tone-overall[_ngcontent-%COMP%] {\n  --organizer-accent: #2d5ea8;\n  --organizer-accent-soft: rgba(47, 139, 174, 0.2);\n  --organizer-surface:\n    linear-gradient(\n      180deg,\n      #f5fbff 0%,\n      #ecf6fb 100%);\n}\n.event-feedback-organizer-carousel-card-tone-improve[_ngcontent-%COMP%] {\n  --organizer-accent: #b95577;\n  --organizer-accent-soft: rgba(184, 92, 116, 0.2);\n  --organizer-surface:\n    linear-gradient(\n      180deg,\n      #fff8fa 0%,\n      #fef0f4 100%);\n}\n.event-feedback-organizer-carousel-card-tone-traits[_ngcontent-%COMP%] {\n  --organizer-accent: #6a45a3;\n  --organizer-accent-soft: rgba(122, 76, 196, 0.2);\n  --organizer-surface:\n    linear-gradient(\n      180deg,\n      #faf7ff 0%,\n      #f1ebfd 100%);\n}\n.event-feedback-organizer-carousel-card-head[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: flex-start;\n  justify-content: space-between;\n  gap: 0.58rem;\n}\n.event-feedback-organizer-carousel-card-title[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0.52rem;\n}\n.event-feedback-organizer-carousel-card-title[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  display: block;\n  color: #1f2937;\n  font-size: 0.82rem;\n  font-weight: 900;\n  line-height: 1.08;\n}\n.event-feedback-organizer-carousel-card-title[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0.14rem 0 0;\n  color: #56627f;\n  font-size: 0.66rem;\n  font-weight: 700;\n  line-height: 1.22;\n}\n.event-feedback-organizer-carousel-card-icon[_ngcontent-%COMP%] {\n  display: inline-flex;\n  width: 1.86rem;\n  height: 1.86rem;\n  align-items: center;\n  justify-content: center;\n  border-radius: 999px;\n  background: rgba(255, 255, 255, 0.76);\n  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.94);\n  color: var(--organizer-accent);\n}\n.event-feedback-organizer-carousel-card-icon[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 0.96rem;\n  height: 0.96rem;\n  font-size: 0.96rem;\n  line-height: 0.96rem;\n}\n.event-feedback-organizer-carousel-card-bar[_ngcontent-%COMP%] {\n  position: relative;\n  height: 0.34rem;\n  overflow: hidden;\n  border-radius: 999px;\n  background: rgba(91, 103, 130, 0.12);\n}\n.event-feedback-organizer-carousel-card-bar[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  display: block;\n  height: 100%;\n  border-radius: inherit;\n  background:\n    linear-gradient(\n      90deg,\n      var(--organizer-accent) 0%,\n      color-mix(in srgb, var(--organizer-accent) 68%, white) 100%);\n  box-shadow: 0 4px 12px color-mix(in srgb, var(--organizer-accent) 30%, transparent);\n}\n.event-feedback-organizer-carousel-card-meta[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  align-items: center;\n  gap: 0.28rem 0.56rem;\n  color: #5d6783;\n  font-size: 0.64rem;\n  font-weight: 800;\n}\n.event-feedback-organizer-carousel-card-highlights[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 0.22rem;\n}\n.event-feedback-organizer-carousel-chip[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.26rem;\n  max-width: 100%;\n  min-height: 21px;\n  padding: 0.1rem 0.38rem;\n  border: 1px solid rgba(107, 119, 146, 0.28);\n  border-radius: 999px;\n  background:\n    linear-gradient(\n      180deg,\n      #f4f5fb 0%,\n      #eceef8 100%);\n  color: #243a67;\n  font-size: 0.62rem;\n  font-weight: 800;\n  line-height: 1.15;\n}\n.event-feedback-organizer-carousel-chip[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 12px;\n  height: 12px;\n  font-size: 12px;\n  line-height: 12px;\n}\n.event-feedback-organizer-carousel-chip[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  color: #17375d;\n}\n.event-feedback-organizer-section-head[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: flex-start;\n  gap: 0.52rem;\n}\n.event-feedback-organizer-section-tag[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  min-height: 28px;\n  margin: 0;\n  padding: 0.16rem 0.78rem;\n  border-radius: 999px;\n  font-size: 0.68rem;\n  font-weight: 800;\n  letter-spacing: 0.05em;\n  text-transform: uppercase;\n  white-space: nowrap;\n}\n.event-feedback-organizer-section-line[_ngcontent-%COMP%] {\n  height: 1px;\n  flex: 1;\n  background: rgba(113, 124, 150, 0.32);\n}\n.event-feedback-organizer-message-list[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 0.56rem;\n}\n.event-feedback-organizer-group-marker[_ngcontent-%COMP%] {\n  margin-top: 0.18rem;\n  font-size: 0.72rem;\n  font-weight: 800;\n  letter-spacing: 0.04em;\n  color: rgba(44, 76, 116, 0.72);\n  text-transform: uppercase;\n}\n.event-feedback-organizer-message-card[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 0.48rem;\n  padding: 0.72rem 0.78rem;\n  border-radius: 18px;\n  border: 1px solid rgba(56, 90, 137, 0.14);\n  background:\n    linear-gradient(\n      180deg,\n      rgba(249, 251, 255, 0.96) 0%,\n      rgba(241, 246, 255, 0.98) 100%);\n}\n.event-feedback-organizer-message-head[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0.56rem;\n}\n.event-feedback-organizer-message-avatar[_ngcontent-%COMP%] {\n  position: relative;\n  flex: 0 0 42px;\n  width: 42px;\n  height: 42px;\n  border-radius: 999px;\n  border: 1px solid rgba(34, 65, 102, 0.16);\n  background-color: #35587f;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  font-size: 0.76rem;\n  font-weight: 800;\n  color: #fff;\n  overflow: hidden;\n  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.24);\n}\n.event-feedback-organizer-message-avatar[_ngcontent-%COMP%]   img[_ngcontent-%COMP%] {\n  width: 100%;\n  height: 100%;\n  object-fit: cover;\n  display: block;\n}\n.event-feedback-organizer-message-avatar.user-color-woman[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      145deg,\n      #d3754c,\n      #ac4a24);\n}\n.event-feedback-organizer-message-avatar.user-color-man[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      145deg,\n      #3572a4,\n      #194364);\n}\n.event-feedback-organizer-message-avatar[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  line-height: 1;\n  letter-spacing: 0.02em;\n  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.26);\n}\n.event-feedback-organizer-message-meta[_ngcontent-%COMP%] {\n  flex: 1 1 auto;\n  min-width: 0;\n}\n.event-feedback-organizer-message-meta[_ngcontent-%COMP%]   h5[_ngcontent-%COMP%], \n.event-feedback-organizer-message-meta[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0;\n}\n.event-feedback-organizer-message-meta[_ngcontent-%COMP%]   h5[_ngcontent-%COMP%] {\n  font-size: 0.84rem;\n  font-weight: 800;\n  color: #213d63;\n}\n.event-feedback-organizer-message-meta[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin-top: 0.08rem;\n  font-size: 0.7rem;\n  color: rgba(41, 67, 104, 0.7);\n}\n.event-feedback-organizer-message-chips[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 0.34rem;\n}\n.event-feedback-organizer-message-chip[_ngcontent-%COMP%] {\n  padding: 0.24rem 0.44rem;\n  border-radius: 999px;\n  background: rgba(86, 115, 158, 0.12);\n  color: #31537f;\n  font-size: 0.66rem;\n  font-weight: 700;\n}\n.event-feedback-organizer-message-chip-trait[_ngcontent-%COMP%] {\n  background: rgba(118, 92, 171, 0.12);\n  color: #6846a0;\n}\n.event-feedback-organizer-message-opinion[_ngcontent-%COMP%], \n.event-feedback-organizer-message-note[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.2rem;\n  margin: 0;\n  padding: 0.55rem 0.62rem;\n  border-radius: 12px;\n  background: rgba(76, 118, 176, 0.08);\n  margin: 0;\n  font-size: 0.78rem;\n  line-height: 1.45;\n  color: rgba(33, 52, 82, 0.84);\n}\n.event-feedback-organizer-message-opinion[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%], \n.event-feedback-organizer-message-note[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  font-size: 0.66rem;\n  color: rgba(39, 69, 108, 0.7);\n  text-transform: uppercase;\n}\n.event-feedback-organizer-message-opinion[_ngcontent-%COMP%]   p[_ngcontent-%COMP%], \n.event-feedback-organizer-message-note[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0;\n}\n.event-feedback-organizer-message-note[_ngcontent-%COMP%] {\n  background: rgba(237, 172, 76, 0.1);\n}\n.event-feedback-organizer-empty-copy[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 0.78rem;\n  color: rgba(41, 67, 104, 0.72);\n}\n.event-feedback-event-card[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f8faff 0%,\n      #f1f6ff 100%);\n  border-color: rgba(53, 89, 139, 0.22);\n}\n.event-feedback-leading-icon[_ngcontent-%COMP%] {\n  border: 1px solid rgba(59, 93, 136, 0.28);\n  background: rgba(255, 255, 255, 0.84);\n}\n.friends-picker-card[_ngcontent-%COMP%] {\n  position: relative;\n  width: min(100%, 320px);\n  min-height: 250px;\n  border-radius: 13px;\n  border: 1px solid rgba(30, 51, 81, 0.24);\n  background-size: cover;\n  background-position: center;\n  overflow: hidden;\n}\n.friends-picker-card[_ngcontent-%COMP%]::after {\n  content: "";\n  position: absolute;\n  inset: 0;\n  background:\n    linear-gradient(\n      180deg,\n      rgba(8, 16, 28, 0.14) 0%,\n      rgba(8, 15, 28, 0.82) 100%);\n}\n.friends-picker-card-meta[_ngcontent-%COMP%] {\n  position: absolute;\n  left: 0.52rem;\n  right: 0.52rem;\n  bottom: 0.46rem;\n  z-index: 2;\n}\n.friends-picker-card-meta[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%] {\n  margin: 0;\n  color: #fff;\n  font-size: 0.9rem;\n  font-weight: 800;\n  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.55);\n}\n.friends-picker-card-meta[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0.1rem 0 0;\n  color: rgba(245, 249, 255, 0.96);\n  font-size: 0.74rem;\n  font-weight: 700;\n  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.58);\n}\n.member-card-status-chip[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 0.48rem;\n  left: 0.48rem;\n  z-index: 4;\n  width: 32px;\n  height: 32px;\n  border-radius: 50%;\n  border: 1px solid rgba(255, 255, 255, 0.88);\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  pointer-events: none;\n  box-shadow: 0 3px 10px rgba(10, 20, 34, 0.28);\n}\n.member-card-status-chip[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n  line-height: 16px;\n}\n.subevent-member-card-meta[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%] {\n  color: #fff;\n}\n.subevent-member-card-meta[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  color: rgba(245, 249, 255, 0.96);\n}\n.member-status-admin[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #e8f0ff 0%,\n      #d9e7ff 100%);\n  color: #2b5d9d;\n}\n.member-status-manager[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #fff8e8 0%,\n      #fbeecf 100%);\n  color: #956215;\n}\n.member-status-member[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #ecfaef 0%,\n      #dcf2e2 100%);\n  color: #2a7644;\n}\n.member-status-invite-pending[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #fff6e8 0%,\n      #ffe8c9 100%);\n  color: #9c6121;\n}\n.member-status-awaiting-approval[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #fff0f3 0%,\n      #ffdce3 100%);\n  color: #a93046;\n}\n.event-feedback-popup[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 0.44rem;\n  height: 100%;\n  min-height: 0;\n}\n.event-feedback-shell[_ngcontent-%COMP%] {\n  display: grid;\n  height: 100%;\n  min-height: 0;\n  grid-template-rows: minmax(0, 1fr) auto auto;\n  position: relative;\n}\n.event-feedback-flow-shell[_ngcontent-%COMP%] {\n  border: 0;\n  background: transparent;\n  padding: 0;\n  overflow: visible;\n}\n.event-feedback-form-flow[_ngcontent-%COMP%] {\n  display: block;\n  min-height: 0;\n  height: 100%;\n}\n[_nghost-%COMP%]     .event-feedback-form-flow .form-flow__slide-nav {\n  left: 2px;\n  right: 2px;\n}\n.event-feedback-loading-card[_ngcontent-%COMP%] {\n  flex: 1 1 auto;\n  min-height: 0;\n  display: grid;\n  place-items: center;\n  align-content: center;\n  gap: 0.6rem;\n  border: 0;\n  background: transparent;\n  padding: 0;\n  text-align: center;\n  color: #536a84;\n}\n.event-feedback-loading-card[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  font-size: 0.78rem;\n  font-weight: 700;\n}\n.event-feedback-empty-card[_ngcontent-%COMP%] {\n  text-align: left;\n}\n@media (max-width: 760px) {\n  .event-feedback-organizer-overview-grid[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n    --event-feedback-organizer-overview-height: auto;\n  }\n  .event-feedback-organizer-info-card-shell[_ngcontent-%COMP%], \n   .event-feedback-organizer-carousel-panel[_ngcontent-%COMP%] {\n    height: auto;\n  }\n  .event-feedback-organizer-carousel[_ngcontent-%COMP%] {\n    height: auto;\n  }\n  .event-feedback-organizer-carousel-card[_ngcontent-%COMP%] {\n    min-height: 0;\n  }\n  .event-feedback-organizer-info-card-shell[_ngcontent-%COMP%] {\n    max-width: none;\n  }\n  .event-feedback-organizer-carousel-pill-strip[_ngcontent-%COMP%] {\n    gap: 0.26rem;\n  }\n  .event-feedback-organizer-carousel-pill[_ngcontent-%COMP%] {\n    min-height: 34px;\n    padding: 0.2rem 0.3rem;\n  }\n  .event-feedback-organizer-carousel-pill-label[_ngcontent-%COMP%] {\n    font-size: 0.68rem;\n  }\n  .event-feedback-organizer-carousel-pill-badge[_ngcontent-%COMP%] {\n    min-width: 1.14rem;\n    min-height: 1rem;\n    font-size: 0.55rem;\n  }\n  .event-feedback-organizer-message-card[_ngcontent-%COMP%] {\n    padding: 0.64rem 0.68rem;\n  }\n}\n/*# sourceMappingURL=event-feedback-popup.component.css.map */'] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(EventFeedbackPopupComponent, [{
    type: Component,
    args: [{ selector: "app-event-feedback-popup", standalone: true, imports: [
      CommonModule,
      FormsModule,
      MatIconModule,
      FormFlowComponent,
      IndicatorComponent,
      PopupComponent,
      SmartListComponent,
      InfoCardComponent
    ], template: `<div class="event-feedback-popup-module">
  @if (isPopupOpen()) {
    <div class="event-feedback-parent-popup" [class.event-feedback-parent-hidden]="isStackedPopupOpen()">
      <app-popup [model]="eventFeedbackPopupModel()" [zIndex]="eventFeedbackPopupZIndex()">
        <div class="support-popup event-feedback-list-popup">
          @if (eventFeedbackListSubmitMessage()) {
            <div class="support-submit-success">{{ eventFeedbackListSubmitMessage() }}</div>
          }
          <app-smart-list
            #eventFeedbackSmartList
            class="event-feedback-list-surface"
            [config]="eventFeedbackSmartListConfig"
            [loadPage]="eventFeedbackSmartListLoadPage"
            [itemTemplate]="eventFeedbackItemTemplateRef ?? null"
            [query]="eventFeedbackSmartListQuery"
            (menuItemSelect)="onEventFeedbackDispatchedMenuSelect($event)"
          ></app-smart-list>
          <ng-template #eventFeedbackItemTemplate let-item>
            <div
              class="event-feedback-info-card-shell"
              [class.is-feedbacked]="item.status === 'feedbacked'"
              [class.is-removed]="item.status === 'removed'"
              [class.is-own-event]="item.status === 'own-event'"
              >
              <app-info-card
                [card]="item"
                [useSharedMenuTrigger]="true"
                [sharedMenuContext]="{ menu: 'info-card', card: item }"
                (mediaEndClick)="onEventFeedbackCardPrimaryAction(item)"
                (menuAction)="onEventFeedbackCardMenuAction(item, $event)"
              ></app-info-card>
            </div>
          </ng-template>
        </div>
      </app-popup>
    </div>
  }

  @if (isStackedPopupOpen()) {
    <app-popup [model]="eventFeedbackStackedPopupModel()" [zIndex]="eventFeedbackStackedPopupZIndex()">
      <div
        class="event-feedback-stacked-content"
        [class.event-feedback-stacked-content--detail]="stackedPopupMode() === 'eventFeedback'"
        [class.event-feedback-stacked-content--organizer]="stackedPopupMode() === 'organizerEventFeedback'"
        [class.event-feedback-stacked-content--note]="stackedPopupMode() === 'eventFeedbackNote'"
        >
          @if (stackedPopupMode() === 'eventFeedback') {
            <div class="support-popup event-feedback-popup">
              @if (!eventFeedbackSubmitted()) {
                @if (eventFeedbackDetailLoading()) {
                  <article class="editor-list-card support-card event-feedback-loading-card">
                    <app-indicator kind="load-ring" state="loading"></app-indicator>
                    <span>Loading feedback</span>
                  </article>
                } @else if (hasEventFeedbackCards()) {
                  <article class="editor-list-card support-card event-feedback-shell event-feedback-flow-shell">
                    <app-form-flow
                      class="event-feedback-form-flow"
                      [model]="eventFeedbackFlowModel()"
                      [ngModel]="eventFeedbackDetailValue()"
                      [saving]="eventFeedbackSubmitting()"
                      [disabled]="eventFeedbackSubmitting()"
                      (save)="onEventFeedbackFlowSave($event)"
                    ></app-form-flow>
                    @if (eventFeedbackSubmitMessage()) {
                      <div class="support-submit-success">{{ eventFeedbackSubmitMessage() }}</div>
                    }
                  </article>
                } @else {
                  <article class="editor-list-card support-card event-feedback-empty-card">
                    @if (eventFeedbackSubmitMessage()) {
                      <div class="support-submit-success">{{ eventFeedbackSubmitMessage() }}</div>
                    }
                  </article>
                }
              } @else {
                <article class="editor-list-card support-card event-feedback-empty-card">
                  @if (eventFeedbackSubmitMessage()) {
                    <div class="support-submit-success">{{ eventFeedbackSubmitMessage() }}</div>
                  }
                </article>
              }
            </div>
          }
          @if (stackedPopupMode() === 'organizerEventFeedback') {
            <div class="support-popup event-feedback-organizer-popup">
              @if (selectedOrganizerEventFeedbackItem(); as item) {
                <article class="editor-list-card support-card event-feedback-organizer-shell">
                  @if (organizerEventFeedbackStatLoading()) {
                    <div class="event-feedback-organizer-loading">
                      <app-indicator kind="load-ring" state="loading"></app-indicator>
                    </div>
                  } @else {
                  <div class="event-feedback-organizer-overview-grid">
                    <div class="event-feedback-info-card-shell event-feedback-organizer-info-card-shell">
                      @if (selectedOrganizerEventFeedbackInfoCard(); as detailCard) {
                        <app-info-card
                          class="event-feedback-organizer-hero-card"
                          [card]="detailCard"
                        ></app-info-card>
                      }
                    </div>

                    @if (organizerEventFeedbackCarouselSections().length > 0) {
                      <section class="event-feedback-organizer-carousel-panel">
                        <div class="event-feedback-organizer-carousel">
                          <div class="event-feedback-organizer-carousel-pill-strip">
                            @for (section of organizerEventFeedbackCarouselSections(); track section.key; let index = $index) {
                              <button
                                type="button"
                                class="event-feedback-organizer-carousel-pill"
                                [ngClass]="[section.toneClass, organizerEventFeedbackCarouselIndex() === index ? 'is-active' : '']"
                                (click)="selectOrganizerEventFeedbackCarousel(index)"
                                [attr.aria-label]="'Open organizer feedback section ' + section.label"
                                >
                                <span class="event-feedback-organizer-carousel-pill-head">
                                  <span class="event-feedback-organizer-carousel-pill-label">{{ section.label }}</span>
                                  <span
                                    class="event-feedback-organizer-carousel-pill-badge"
                                    [attr.title]="section.topCount + ' of ' + section.responseCount + ' responses selected this'"
                                    >
                                    {{ section.topCount }}
                                  </span>
                                </span>
                              </button>
                            }
                          </div>

                          @if (organizerEventFeedbackActiveCarouselSection(); as section) {
                            <div class="event-feedback-organizer-carousel-card" [ngClass]="section.toneClass">
                              <div class="event-feedback-organizer-carousel-card-head">
                                <div class="event-feedback-organizer-carousel-card-title">
                                  <span class="event-feedback-organizer-carousel-card-icon"><mat-icon>{{ section.icon }}</mat-icon></span>
                                  <div>
                                    <strong>{{ section.topLabel }}</strong>
                                    <p>{{ section.subtitle }}</p>
                                  </div>
                                </div>
                              </div>
                              <div class="event-feedback-organizer-carousel-card-bar">
                                <span [style.width.%]="section.progressPercent"></span>
                              </div>
                              <div class="event-feedback-organizer-carousel-card-meta">
                                <span>
                                  {{ section.topCount }} of {{ section.responseCount }}
                                  {{ section.responseCount === 1 ? 'response' : 'responses' }}
                                </span>
                                <span>
                                  {{ section.optionCount }}
                                  {{ section.optionCount === 1 ? 'option' : 'options' }}
                                </span>
                              </div>
                              <div class="event-feedback-organizer-carousel-card-highlights">
                                @for (stat of section.items; track stat.key) {
                                  <span class="event-feedback-organizer-carousel-chip">
                                    <mat-icon>{{ stat.icon }}</mat-icon>
                                    <span>{{ stat.label }}</span>
                                    <strong>{{ stat.count }}</strong>
                                  </span>
                                }
                              </div>
                            </div>
                          }
                        </div>
                      </section>
                    }
                  </div>

                  <section class="event-feedback-organizer-messages">
                    @if (organizerEventFeedbackMessageGroups().length > 0) {
                      @for (group of organizerEventFeedbackMessageGroups(); track group.dayKey) {
                        <div class="event-feedback-organizer-group-marker">{{ group.label }}</div>
                        <div class="event-feedback-organizer-message-list">
                          @for (message of group.items; track message.id) {
                            <article class="event-feedback-organizer-message-card">
                              <div class="event-feedback-organizer-message-head">
                                <div
                                  class="event-feedback-organizer-message-avatar"
                                  [ngClass]="'user-color-' + message.viewerGender"
                                  >
                                  @if (message.viewerImageUrl) {
                                    <img [src]="message.viewerImageUrl" [alt]="message.viewerName" />
                                  } @else {
                                    <span>{{ message.viewerInitials }}</span>
                                  }
                                </div>
                                <div class="event-feedback-organizer-message-meta">
                                  <h5>{{ message.viewerName }}</h5>
                                  <p>{{ message.timeLabel || 'Recent feedback' }}</p>
                                </div>
                              </div>
                              <div class="event-feedback-organizer-message-chips">
                                @if (message.overallLabel) {
                                  <span class="event-feedback-organizer-message-chip">{{ message.overallLabel }}</span>
                                }
                                @if (message.improveLabel) {
                                  <span class="event-feedback-organizer-message-chip">{{ message.improveLabel }}</span>
                                }
                                @for (traitLabel of message.traitLabels; track traitLabel) {
                                  <span class="event-feedback-organizer-message-chip event-feedback-organizer-message-chip-trait">{{ traitLabel }}</span>
                                }
                              </div>
                              @if (message.eventComment) {
                                <div class="event-feedback-organizer-message-opinion">
                                  <strong>Event opinion</strong>
                                  <p>{{ message.eventComment }}</p>
                                </div>
                              }
                              @if (message.organizerNote) {
                                <div class="event-feedback-organizer-message-note">
                                  <strong>Note to organizer</strong>
                                  <p>{{ message.organizerNote }}</p>
                                </div>
                              }
                            </article>
                          }
                        </div>
                      }
                    } @else {
                      <p class="event-feedback-organizer-empty-copy">No feedback has been submitted for this event yet.</p>
                    }
                  </section>
                  }
                </article>
              } @else {
                <article class="editor-list-card support-card event-feedback-empty-card">
                  <p>Choose an own event to review its feedback.</p>
                </article>
              }
            </div>
          }
          @if (stackedPopupMode() === 'eventFeedbackNote') {
            <div class="support-popup">
              @if (!eventFeedbackNoteSubmitted()) {
                <article class="editor-list-card support-card">
                  <h4>Organizer Feedback</h4>
                  <p>Add textual feedback for the event organizer of {{ eventFeedbackCurrentEventTitle() }}.</p>
                  @if (eventFeedbackNoteSubmitMessage()) {
                    <div class="support-submit-error">{{ eventFeedbackNoteSubmitMessage() }}</div>
                  }
                  <form class="support-form" (ngSubmit)="submitEventFeedbackNote()">
                    <label>
                      <span>Feedback</span>
                      <textarea
                        rows="4"
                        name="eventFeedbackNoteText"
                        [ngModel]="eventFeedbackNoteForm().text"
                        (ngModelChange)="eventFeedbackNoteForm.set({ eventId: eventFeedbackNoteForm().eventId, text: $event })"
                        placeholder="What should be improved for this event next time?"
                      ></textarea>
                    </label>
                    <div class="popup-actions support-actions">
                      <button type="button" class="link-btn neutral-btn" (click)="closeStackedPopup()">Cancel</button>
                      <button type="submit" class="link-btn primary-btn" [disabled]="!canSubmitEventFeedbackNote()">Submit feedback</button>
                    </div>
                  </form>
                </article>
              } @else {
                <article class="editor-list-card support-card event-feedback-empty-card">
                  <div class="support-submit-success">{{ eventFeedbackNoteSubmitMessage() }}</div>
                  <div class="popup-actions support-actions">
                    <button type="button" class="link-btn primary-btn" (click)="closeStackedPopup()">Done</button>
                  </div>
                </article>
              }
            </div>
          }
      </div>
    </app-popup>
  }
</div>
`, styles: ['/* src/app/activity/components/event-feedback-popup/event-feedback-popup.component.scss */\n:host {\n  display: contents;\n}\n:host {\n  --interactive-motion-duration: 160ms;\n  --interactive-motion-ease: cubic-bezier(0.22, 1, 0.36, 1);\n  --interactive-hover-lift: -1px;\n  --interactive-hover-scale: 1.01;\n  --interactive-hover-brightness: 1.01;\n  --interactive-press-scale: 0.97;\n  --interactive-press-brightness: 0.97;\n}\n:where(button, a[href], [role=button], .link-btn, .popup-view-fab, .popup-header-add-btn, .activities-view-option, .profile-status-select-wrap, .profile-details-values-btn, .profile-details-privacy-btn, .profile-privacy-menu-option, .popup-close, .date-picker-btn, .avatar-edit-btn, .experience-form-close-btn, .image-editor-grid button, .image-stack-line, .image-stack-hit-segment, .mobile-profile-selector-close-btn, .mobile-profile-selector-option, .popup-panel-profile-selector .profile-filter-selector-clear, .popup-panel-profile-selector .profile-filter-selector-chip, .popup-panel-profile-selector .profile-selector-chip, .item-action-menu-btn, .experience-action-btn, .header-icon-btn, .chat-header-members, .activities-row-item-clickable, .activities-card-btn, .asset-source-icon, .event-editor-members-trigger, .motion-card, [data-motion=card]):not(.motion-static):not([data-motion=none]) {\n  -webkit-tap-highlight-color: transparent;\n  transition:\n    transform var(--interactive-motion-duration) var(--interactive-motion-ease),\n    filter var(--interactive-motion-duration) var(--interactive-motion-ease),\n    box-shadow var(--interactive-motion-duration) var(--interactive-motion-ease),\n    background-color var(--interactive-motion-duration) var(--interactive-motion-ease),\n    border-color var(--interactive-motion-duration) var(--interactive-motion-ease),\n    color var(--interactive-motion-duration) var(--interactive-motion-ease);\n  transform-origin: center;\n}\n:where(button, a[href], [role=button], .link-btn, .popup-view-fab, .popup-header-add-btn, .activities-view-option, .profile-status-select-wrap, .profile-details-values-btn, .profile-details-privacy-btn, .profile-privacy-menu-option, .popup-close, .date-picker-btn, .avatar-edit-btn, .experience-form-close-btn, .image-editor-grid button, .image-stack-line, .image-stack-hit-segment, .mobile-profile-selector-close-btn, .mobile-profile-selector-option, .popup-panel-profile-selector .profile-filter-selector-clear, .popup-panel-profile-selector .profile-filter-selector-chip, .popup-panel-profile-selector .profile-selector-chip, .item-action-menu-btn, .experience-action-btn, .header-icon-btn, .chat-header-members, .activities-row-item-clickable, .activities-card-btn, .asset-source-icon, .event-editor-members-trigger, .motion-card, [data-motion=card]):not(.motion-static):not([data-motion=none]):focus-visible {\n  outline: 2px solid rgba(66, 110, 182, 0.44);\n  outline-offset: 2px;\n}\n@media (hover: hover) and (pointer: fine) {\n  :where(button, a[href], [role=button], .link-btn, .popup-view-fab, .popup-header-add-btn, .activities-view-option, .profile-status-select-wrap, .profile-details-values-btn, .profile-details-privacy-btn, .profile-privacy-menu-option, .popup-close, .date-picker-btn, .avatar-edit-btn, .experience-form-close-btn, .image-editor-grid button, .image-stack-line, .image-stack-hit-segment, .mobile-profile-selector-close-btn, .mobile-profile-selector-option, .popup-panel-profile-selector .profile-filter-selector-clear, .popup-panel-profile-selector .profile-filter-selector-chip, .popup-panel-profile-selector .profile-selector-chip, .item-action-menu-btn, .experience-action-btn, .header-icon-btn, .chat-header-members, .activities-row-item-clickable, .activities-card-btn, .asset-source-icon, .event-editor-members-trigger, .motion-card, [data-motion=card]):not(.motion-static):not([data-motion=none]):not(:disabled):not([aria-disabled=true]):hover {\n    transform: translateY(var(--interactive-hover-lift)) scale(var(--interactive-hover-scale));\n    filter: brightness(var(--interactive-hover-brightness));\n  }\n  :where(button, a[href], [role=button], .link-btn, .popup-view-fab, .popup-header-add-btn, .activities-view-option, .profile-status-select-wrap, .profile-details-values-btn, .profile-details-privacy-btn, .profile-privacy-menu-option, .popup-close, .date-picker-btn, .avatar-edit-btn, .experience-form-close-btn, .image-editor-grid button, .image-stack-line, .image-stack-hit-segment, .mobile-profile-selector-close-btn, .mobile-profile-selector-option, .popup-panel-profile-selector .profile-filter-selector-clear, .popup-panel-profile-selector .profile-filter-selector-chip, .popup-panel-profile-selector .profile-selector-chip, .item-action-menu-btn, .experience-action-btn, .header-icon-btn, .chat-header-members, .activities-row-item-clickable, .activities-card-btn, .asset-source-icon, .event-editor-members-trigger, .motion-card, [data-motion=card]):not(.motion-static):not([data-motion=none]):not(:disabled):not([aria-disabled=true]):active {\n    transform: scale(var(--interactive-press-scale));\n    filter: brightness(var(--interactive-press-brightness));\n  }\n  :where(.motion-card, [data-motion=card]):not(.motion-static):not([data-motion=none]):hover {\n    box-shadow: 0 3px 10px rgba(16, 29, 48, 0.14);\n  }\n}\n@keyframes shared-mobile-touch-feedback {\n  0% {\n    transform: scale(1);\n    filter: brightness(1);\n  }\n  45% {\n    transform: scale(var(--interactive-press-scale));\n    filter: brightness(var(--interactive-press-brightness));\n  }\n  100% {\n    transform: scale(1);\n    filter: brightness(1);\n  }\n}\n@media (hover: none), (pointer: coarse) {\n  :where(button, a[href], [role=button], .link-btn, .popup-view-fab, .popup-header-add-btn, .activities-view-option, .profile-status-select-wrap, .profile-details-values-btn, .profile-details-privacy-btn, .profile-privacy-menu-option, .popup-close, .date-picker-btn, .avatar-edit-btn, .experience-form-close-btn, .image-editor-grid button, .image-stack-line, .image-stack-hit-segment, .mobile-profile-selector-close-btn, .mobile-profile-selector-option, .popup-panel-profile-selector .profile-filter-selector-clear, .popup-panel-profile-selector .profile-filter-selector-chip, .popup-panel-profile-selector .profile-selector-chip, .item-action-menu-btn, .experience-action-btn, .header-icon-btn, .chat-header-members, .activities-row-item-clickable, .activities-card-btn, .asset-source-icon, .event-editor-members-trigger, .motion-card, [data-motion=card]):not(.motion-static):not([data-motion=none]):not(:disabled):not([aria-disabled=true]):active {\n    animation: shared-mobile-touch-feedback 0.2s ease;\n  }\n}\n.app-popup,\n.mobile-profile-selector-sheet-wrap,\n.popup-surface,\n.experience-form-popup {\n  font-family:\n    "Nunito Sans",\n    "Segoe UI",\n    sans-serif;\n}\n.app-popup button,\n.app-popup input,\n.app-popup textarea,\n.app-popup select,\n.app-popup .mat-mdc-select,\n.app-popup .mat-mdc-select-value-text,\n.app-popup .mat-mdc-option,\n.popup-surface button,\n.popup-surface input,\n.popup-surface textarea,\n.popup-surface select,\n.popup-surface .mat-mdc-select,\n.popup-surface .mat-mdc-select-value-text,\n.popup-surface .mat-mdc-option,\n.experience-form-popup button,\n.experience-form-popup input,\n.experience-form-popup textarea,\n.experience-form-popup select,\n.experience-form-popup .mat-mdc-select,\n.experience-form-popup .mat-mdc-select-value-text,\n.experience-form-popup .mat-mdc-option,\n.mobile-profile-selector-sheet-wrap button,\n.mobile-profile-selector-sheet-wrap input,\n.mobile-profile-selector-sheet-wrap .mat-mdc-option {\n  font-family: inherit;\n}\n.popup-filter-picker,\n.activities-view-picker {\n  position: relative;\n  z-index: 60;\n  margin-left: auto;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.34rem;\n}\n.popup-filter-picker-secondary,\n.activities-secondary-picker {\n  position: relative;\n  z-index: 61;\n}\n.selector-like {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.35rem;\n}\n.profile-status-select-wrap.popup-compact-select,\n.profile-status-select-wrap.activities-compact-select,\n.profile-status-select-wrap.assets-compact-select {\n  width: fit-content !important;\n  min-width: 0 !important;\n  max-width: 100%;\n}\n.profile-status-select-wrap.popup-compact-select .mat-mdc-select,\n.profile-status-select-wrap.activities-compact-select .mat-mdc-select,\n.profile-status-select-wrap.assets-compact-select .mat-mdc-select {\n  width: auto;\n  min-width: 0;\n}\n.profile-status-select-wrap.popup-compact-select .mat-mdc-select-trigger,\n.profile-status-select-wrap.activities-compact-select .mat-mdc-select-trigger,\n.profile-status-select-wrap.assets-compact-select .mat-mdc-select-trigger {\n  width: auto !important;\n  min-width: 0;\n}\n.profile-status-select-wrap.popup-compact-select .status-option-content,\n.profile-status-select-wrap.activities-compact-select .status-option-content,\n.profile-status-select-wrap.assets-compact-select .status-option-content {\n  width: auto;\n  min-width: 0;\n}\n.profile-status-select-wrap.popup-filter-no-badge,\n.profile-status-select-wrap.activities-filter-no-badge {\n  min-width: 0;\n}\n.profile-status-select-wrap.popup-filter-no-badge .status-option-content,\n.profile-status-select-wrap.activities-filter-no-badge .status-option-content {\n  width: auto !important;\n  flex: 0 1 auto;\n}\n.profile-status-select-wrap.popup-filter-no-badge .mat-mdc-select,\n.profile-status-select-wrap.activities-filter-no-badge .mat-mdc-select {\n  width: auto;\n  min-width: 0;\n}\n.profile-status-select-wrap.popup-filter-no-badge .mat-mdc-select-trigger,\n.profile-status-select-wrap.activities-filter-no-badge .mat-mdc-select-trigger {\n  width: auto !important;\n}\n.profile-status-select-wrap.popup-filter-no-badge .mat-mdc-select-arrow-wrapper,\n.profile-status-select-wrap.activities-filter-no-badge .mat-mdc-select-arrow-wrapper {\n  margin-left: 0.28rem;\n}\n.profile-status-select-wrap {\n  min-width: 174px;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.38rem;\n  border: 1px solid #c8d3e2;\n  border-radius: 999px;\n  box-shadow: 0 2px 6px rgba(38, 60, 92, 0.08);\n  padding: 0.12rem 0.5rem 0.12rem 0.84rem;\n  background: #f8f9fb;\n}\n.profile-status-select-wrap.selector-like {\n  min-height: 36px;\n}\n.status-option-content {\n  display: flex;\n  align-items: center;\n  justify-content: flex-start;\n  gap: 0.2rem;\n  text-transform: lowercase;\n  width: 100%;\n  min-width: 0;\n}\n.status-option-content span:last-child {\n  white-space: nowrap;\n}\n.status-option-content .mat-icon {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n  line-height: 16px;\n  flex: 0 0 16px;\n}\n.rate-filter-count-badge {\n  margin-left: auto;\n  width: 20px;\n  height: 20px;\n  border-radius: 50%;\n  border: 1px solid #fff;\n  background: #d84d4d;\n  color: #fff;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  padding: 0;\n  font-size: 0.68rem;\n  font-weight: 800;\n  line-height: 1;\n  box-shadow: 0 2px 8px rgba(120, 24, 24, 0.22);\n}\n.rate-filter-trigger-badge {\n  position: absolute;\n  top: -8px;\n  right: -8px;\n  margin-left: 0;\n  z-index: 2;\n}\n.popup-filter-control,\n.activities-rate-filter-select,\n.activities-primary-filter-select,\n.activities-event-scope-filter-select,\n.activities-chat-context-filter-select {\n  position: relative;\n  overflow: visible;\n}\n.popup-filter-panel,\n.activities-view-picker-panel {\n  position: absolute;\n  top: calc(100% + 0.32rem);\n  right: 0;\n  border: 1px solid rgba(39, 62, 94, 0.22);\n  border-radius: 10px;\n  background: #fff;\n  box-shadow: 0 10px 24px rgba(17, 29, 48, 0.22);\n  padding: 0.24rem;\n  min-width: 128px;\n  z-index: 40;\n  display: grid;\n  gap: 0.16rem;\n}\n.popup-filter-option,\n.activities-view-option {\n  border: 0;\n  background: #fff;\n  border-radius: 8px;\n  min-height: 32px;\n  padding: 0.34rem 0.44rem;\n  display: inline-flex;\n  align-items: center;\n  justify-content: flex-start;\n  gap: 0.34rem;\n  color: #1e3658;\n  cursor: pointer;\n  text-align: left;\n}\n.popup-filter-option .mat-icon,\n.activities-view-option .mat-icon {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n}\n.popup-filter-option span,\n.activities-view-option span {\n  font-size: 0.78rem;\n  font-weight: 700;\n}\n.popup-filter-option > span:not(.rate-filter-count-badge),\n.activities-view-option > span:not(.rate-filter-count-badge) {\n  flex: 1 1 auto;\n  min-width: 0;\n  text-align: left;\n}\n.popup-mobile-filter-picker,\n.activities-mobile-primary-filter-picker,\n.activities-mobile-event-scope-filter-picker,\n.activities-mobile-chat-context-filter-picker,\n.activities-mobile-rate-filter-picker {\n  position: relative;\n}\n.popup-mobile-filter-panel,\n.activities-mobile-filter-panel,\n.activities-mobile-rate-filter-panel {\n  top: calc(100% + 0.24rem);\n  right: 0;\n  min-width: 210px;\n  z-index: 65;\n}\n.popup-mobile-sheet-title,\n.activities-mobile-sheet-title {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.28rem;\n  padding: 0 0.14rem;\n  color: #1c3354;\n  font-size: 0.94rem;\n  font-weight: 800;\n}\n.popup-mobile-sheet-title .mat-icon,\n.activities-mobile-sheet-title .mat-icon {\n  width: 17px;\n  height: 17px;\n  font-size: 17px;\n  line-height: 17px;\n}\n:is(.popup-filter-bar, .experience-toolbar, .assets-toolbar) .popup-view-fab span,\n:is(.popup-filter-bar, .experience-toolbar, .assets-toolbar) .profile-status-select-wrap .mat-mdc-select,\n:is(.popup-filter-bar, .experience-toolbar, .assets-toolbar) .profile-status-select-wrap .status-option-content span:last-child,\n:is(.popup-filter-bar, .experience-toolbar, .assets-toolbar) .profile-status-select-wrap .mat-mdc-select-value-text {\n  font-weight: 400 !important;\n}\n:host ::ng-deep .selector-options-panel .mat-mdc-option.status-option .status-option-content {\n  display: grid;\n  grid-template-columns: auto minmax(0, 1fr) auto;\n  align-items: center;\n  width: 100%;\n  min-width: 0;\n  column-gap: 0.34rem;\n}\n:host ::ng-deep .selector-options-panel .mat-mdc-option.status-option .rate-filter-count-badge {\n  margin-left: 0;\n  justify-self: end;\n}\n:host ::ng-deep .cdk-overlay-pane:has(.mat-mdc-select-panel.selector-options-panel),\n:host ::ng-deep .cdk-overlay-pane:has(.mat-mdc-select-panel.status-options-panel) {\n  min-width: var(--app-selector-panel-min-width, 184px) !important;\n}\n:host ::ng-deep .mat-mdc-select-panel.selector-options-panel,\n:host ::ng-deep .mat-mdc-select-panel.status-options-panel {\n  min-width: var(--app-selector-panel-min-width, 184px) !important;\n}\n@media (max-width: 760px) {\n  .popup-mobile-filter-panel .popup-filter-option,\n  .popup-mobile-filter-panel .activities-view-option,\n  .activities-mobile-filter-panel .popup-filter-option,\n  .activities-mobile-filter-panel .activities-view-option,\n  .activities-mobile-rate-filter-panel .popup-filter-option,\n  .activities-mobile-rate-filter-panel .activities-view-option {\n    width: 100%;\n    min-width: 0;\n    box-sizing: border-box;\n    border: 1px solid rgba(58, 81, 114, 0.24);\n    border-radius: 12px;\n    background: #f7f9fd;\n    min-height: 42px;\n    padding: 0.46rem 0.62rem;\n    justify-content: flex-start;\n    gap: 0.36rem;\n  }\n  .popup-mobile-filter-panel .popup-filter-option.active,\n  .popup-mobile-filter-panel .activities-view-option.active,\n  .activities-mobile-filter-panel .popup-filter-option.active,\n  .activities-mobile-filter-panel .activities-view-option.active,\n  .activities-mobile-rate-filter-panel .popup-filter-option.active,\n  .activities-mobile-rate-filter-panel .activities-view-option.active {\n    box-shadow: inset 0 0 0 1px rgba(24, 46, 76, 0.24);\n    filter: brightness(0.95);\n  }\n  .popup-mobile-filter-panel .popup-filter-option .rate-filter-count-badge,\n  .popup-mobile-filter-panel .activities-view-option .rate-filter-count-badge,\n  .activities-mobile-filter-panel .popup-filter-option .rate-filter-count-badge,\n  .activities-mobile-filter-panel .activities-view-option .rate-filter-count-badge,\n  .activities-mobile-rate-filter-panel .popup-filter-option .rate-filter-count-badge,\n  .activities-mobile-rate-filter-panel .activities-view-option .rate-filter-count-badge {\n    margin-left: auto;\n    flex: 0 0 auto;\n  }\n  :host ::ng-deep .cdk-overlay-pane:has(.mat-mdc-select-panel.profile-bottom-sheet-panel) {\n    position: fixed !important;\n    left: 0 !important;\n    right: 0 !important;\n    bottom: 0 !important;\n    top: auto !important;\n    width: 100vw !important;\n    max-width: 100vw !important;\n    transform: none !important;\n  }\n  :host ::ng-deep .mat-mdc-select-panel.profile-bottom-sheet-panel {\n    width: 100vw !important;\n    max-width: 100vw !important;\n    max-height: min(54vh, 420px) !important;\n    margin: 0 !important;\n    border-radius: 16px 16px 0 0 !important;\n    border: 1px solid #d6deea;\n    border-bottom: 0;\n    box-shadow: 0 -14px 28px rgba(15, 29, 52, 0.24);\n    padding-top: 0.38rem;\n    padding-bottom: max(0.55rem, env(safe-area-inset-bottom));\n  }\n}\n.popup-view-fab {\n  height: 34px;\n  border: 1px solid rgba(39, 62, 94, 0.22);\n  border-radius: 999px;\n  background: #f3f7ff;\n  color: #2c4c74;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.25rem;\n  padding: 0 0.62rem;\n  cursor: pointer;\n}\n.popup-view-fab .mat-icon {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n}\n.popup-view-fab span {\n  font-size: 0.74rem;\n  font-weight: 700;\n  white-space: nowrap;\n}\n.event-visibility-picker {\n  position: relative;\n  z-index: 22;\n  margin-left: auto;\n  flex: 0 0 auto;\n}\n.event-visibility-trigger {\n  flex-wrap: nowrap;\n}\n.profile-status-header-picker .event-visibility-trigger.status-public,\n.profile-status-header-picker .activities-view-option.status-public {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #e6f6ef);\n}\n.profile-status-header-picker .event-visibility-trigger.status-friends,\n.profile-status-header-picker .activities-view-option.status-friends {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #e8f1fd);\n}\n.profile-status-header-picker .event-visibility-trigger.status-host,\n.profile-status-header-picker .activities-view-option.status-host {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #f6efe2);\n}\n.profile-status-header-picker .event-visibility-trigger.status-inactive,\n.profile-status-header-picker .activities-view-option.status-inactive {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #f2f3f5);\n}\n.profile-status-header-picker .event-visibility-trigger .mat-icon.status-public,\n.profile-status-header-picker .activities-view-option.status-public .mat-icon {\n  color: #2f8f66;\n}\n.profile-status-header-picker .event-visibility-trigger .mat-icon.status-friends,\n.profile-status-header-picker .activities-view-option.status-friends .mat-icon {\n  color: #1b57a1;\n}\n.profile-status-header-picker .event-visibility-trigger .mat-icon.status-host,\n.profile-status-header-picker .activities-view-option.status-host .mat-icon {\n  color: #87580f;\n}\n.profile-status-header-picker .event-visibility-trigger .mat-icon.status-inactive,\n.profile-status-header-picker .activities-view-option.status-inactive .mat-icon {\n  color: #5b6573;\n}\n.app-popup textarea,\n.app-popup input,\n.app-popup select,\n.popup-surface textarea,\n.popup-surface input,\n.popup-surface select,\n.experience-form-popup textarea,\n.experience-form-popup input,\n.experience-form-popup select,\n.mobile-profile-selector-sheet-wrap input {\n  width: 100%;\n  border: 1px solid rgba(15, 27, 47, 0.16);\n  border-radius: 10px;\n  padding: 0.48rem 0.56rem;\n  font: inherit;\n  color: var(--text-main);\n  background: #fff;\n}\n.app-popup textarea,\n.popup-surface textarea,\n.experience-form-popup textarea {\n  resize: vertical;\n}\n.app-popup textarea:focus,\n.app-popup input:focus,\n.app-popup select:focus,\n.popup-surface textarea:focus,\n.popup-surface input:focus,\n.popup-surface select:focus,\n.experience-form-popup textarea:focus,\n.experience-form-popup input:focus,\n.experience-form-popup select:focus,\n.mobile-profile-selector-sheet-wrap input:focus {\n  outline: 0;\n  border-color: rgba(52, 103, 182, 0.72);\n  box-shadow: 0 0 0 3px rgba(55, 116, 212, 0.14);\n}\n.popup-surface-form-grid,\n.experience-form-grid {\n  display: grid;\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n  max-width: none;\n  width: 100%;\n  margin: 0;\n  justify-content: stretch;\n  align-content: start;\n  align-items: start;\n  column-gap: 1rem;\n  row-gap: 0.9rem;\n}\n.popup-surface-form-grid label,\n.experience-form-grid label {\n  display: grid;\n  grid-template-rows: min-content;\n  gap: 0;\n  font-weight: 600;\n  color: rgba(26, 44, 69, 0.88);\n}\n.popup-surface-form-grid input,\n.experience-form-grid input {\n  min-height: 40px;\n  padding: 0.56rem 0.72rem;\n  font-size: 0.88rem;\n  line-height: 1.25;\n  box-sizing: border-box;\n}\n.popup-surface-form-grid textarea,\n.experience-form-grid textarea {\n  min-height: 96px;\n  padding: 0.56rem 0.72rem;\n  font-size: 0.88rem;\n  line-height: 1.25;\n  box-sizing: border-box;\n}\n.popup-surface-form-grid .profile-status-select-wrap.selector-like,\n.experience-form-grid .profile-status-select-wrap.selector-like {\n  min-height: 40px;\n  height: 40px;\n  box-sizing: border-box;\n}\n.popup-surface-form-grid .mat-mdc-select-trigger,\n.experience-form-grid .mat-mdc-select-trigger {\n  min-height: 32px;\n}\n.popup-surface-description-field,\n.experience-description-field {\n  grid-column: 1/-1;\n}\n.popup-surface-actions,\n.experience-form-actions {\n  justify-content: center;\n  padding-top: 0.2rem;\n}\n.popup-actions {\n  display: flex;\n  gap: 0.45rem;\n  flex-wrap: wrap;\n}\n.link-btn {\n  border: 1px solid var(--line-strong);\n  border-radius: 999px;\n  background: #fff;\n  color: #1f3350;\n  font: inherit;\n  font-size: 0.83rem;\n  padding: 0.38rem 0.76rem;\n  cursor: pointer;\n}\n.neutral-btn {\n  background: #f2f4fa;\n  border-color: rgba(23, 33, 54, 0.12);\n}\n.primary-btn {\n  background: #4776b7;\n  border-color: #4776b7;\n  color: #fff;\n}\n.profile-status-select-wrap .mat-icon,\n.date-picker-btn .mat-icon {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n  line-height: 16px;\n  color: #566b86;\n}\n.profile-status-select-wrap .mat-mdc-select {\n  min-width: 80px;\n  width: 100%;\n  font-size: 0.8rem;\n  font-weight: 700;\n  text-transform: lowercase;\n}\n.profile-status-select-wrap .mat-mdc-select-trigger {\n  width: 100%;\n  justify-content: flex-start;\n}\n.profile-status-select-wrap .mat-mdc-select-arrow-wrapper {\n  margin-left: auto;\n}\n.status-public {\n  color: #2f8f66;\n}\n.status-friends {\n  color: #1b57a1;\n}\n.status-host {\n  color: #87580f;\n}\n.status-inactive {\n  color: #5b6573;\n}\n.status-option-content .status-public {\n  color: #2f8f66;\n}\n.status-option-content .status-friends {\n  color: #1b57a1;\n}\n.status-option-content .status-host {\n  color: #87580f;\n}\n.status-option-content .status-inactive {\n  color: #5b6573;\n}\n.profile-status-select-wrap.status-public .status-option-content .mat-icon {\n  color: #2f8f66;\n}\n.profile-status-select-wrap.status-friends .status-option-content .mat-icon {\n  color: #1b57a1;\n}\n.profile-status-select-wrap.status-host .status-option-content .mat-icon {\n  color: #87580f;\n}\n.profile-status-select-wrap.status-inactive .status-option-content .mat-icon {\n  color: #5b6573;\n}\n.profile-details-values-btn .mat-icon {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n  line-height: 16px;\n  color: rgba(44, 67, 100, 0.72);\n}\n.profile-details-values-btn {\n  min-height: 36px;\n  height: 36px;\n  box-sizing: border-box;\n  padding-top: 0;\n  padding-bottom: 0;\n}\n.profile-details-values-btn .status-option-content.profile-details-selected-badges {\n  display: inline-grid;\n  grid-template-columns: minmax(0, 1fr) auto;\n  align-items: center;\n  column-gap: 0.26rem;\n  min-width: 0;\n  width: 100%;\n}\n.profile-details-values-btn.profile-details-values-tone-values .profile-details-inline-chip {\n  max-width: calc(100% - 2.6rem);\n}\n.profile-details-values-btn.profile-details-values-tone-interest .profile-details-inline-chip {\n  max-width: calc((100% - 3.2rem) / 2);\n}\n.profile-details-values-btn.profile-details-values-tone-values .profile-details-inline-overflow {\n  color: #1e6b5a;\n}\n.profile-details-values-btn.profile-details-values-tone-interest .profile-details-inline-overflow {\n  color: #2e5a90;\n}\n.values-header-chips {\n  display: flex;\n  align-items: center;\n  flex-wrap: wrap;\n  gap: 0.28rem;\n  flex: 0 0 100%;\n  margin-left: 0;\n  margin-top: 0.34rem;\n  max-width: 100%;\n  overflow: visible;\n  white-space: normal;\n  padding-bottom: 0;\n}\n.popup-title-values {\n  margin-right: 0.38rem;\n}\n.values-selected-chip {\n  border: 1px solid rgba(76, 99, 136, 0.3);\n  background:\n    linear-gradient(\n      180deg,\n      #f7f9ff 0%,\n      #eef3ff 100%);\n  color: #24416a;\n  border-radius: 999px;\n  min-height: 26px;\n  padding: 0.18rem 0.46rem;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.26rem;\n  font-size: 0.7rem;\n  font-weight: 700;\n  cursor: pointer;\n  flex: 0 0 auto;\n}\n.values-selected-chip .mat-icon {\n  width: 12px;\n  height: 12px;\n  font-size: 12px;\n  line-height: 12px;\n}\n.values-selected-chip.section-family {\n  background:\n    linear-gradient(\n      180deg,\n      #fff1ea 0%,\n      #ffe6dd 100%);\n  border-color: rgba(160, 90, 51, 0.32);\n  color: #8b4d2b;\n}\n.values-selected-chip.section-ambition {\n  background:\n    linear-gradient(\n      180deg,\n      #fff7e8 0%,\n      #ffefd7 100%);\n  border-color: rgba(160, 106, 20, 0.32);\n  color: #9a6614;\n}\n.values-selected-chip.section-lifestyle {\n  background:\n    linear-gradient(\n      180deg,\n      #eaf8f5 0%,\n      #e0f2ee 100%);\n  border-color: rgba(45, 125, 120, 0.32);\n  color: #2a6e6a;\n}\n.values-selected-chip.section-beliefs {\n  background:\n    linear-gradient(\n      180deg,\n      #f0ecff 0%,\n      #e8e1fa 100%);\n  border-color: rgba(95, 78, 160, 0.32);\n  color: #564793;\n}\n.values-selected-chip.section-social {\n  background:\n    linear-gradient(\n      180deg,\n      #ecf4ff 0%,\n      #e1ecfb 100%);\n  border-color: rgba(45, 94, 168, 0.32);\n  color: #2d5ea8;\n}\n.values-selected-chip.section-arts {\n  background:\n    linear-gradient(\n      180deg,\n      #f2edfb 0%,\n      #e9e2f9 100%);\n  border-color: rgba(103, 76, 164, 0.32);\n  color: #654ca1;\n}\n.values-selected-chip.section-food {\n  background:\n    linear-gradient(\n      180deg,\n      #fff4e8 0%,\n      #fee9d6 100%);\n  border-color: rgba(170, 97, 28, 0.32);\n  color: #9d611c;\n}\n.values-selected-chip.section-active {\n  background:\n    linear-gradient(\n      180deg,\n      #edf8ee 0%,\n      #e2f1e4 100%);\n  border-color: rgba(44, 126, 72, 0.32);\n  color: #2d7d47;\n}\n.values-selected-chip.section-mind {\n  background:\n    linear-gradient(\n      180deg,\n      #eaf8f6 0%,\n      #def1ee 100%);\n  border-color: rgba(37, 124, 118, 0.32);\n  color: #2d7d78;\n}\n.values-selected-chip.section-identity {\n  background:\n    linear-gradient(\n      180deg,\n      #f4f0ff 0%,\n      #e9e3fb 100%);\n  border-color: rgba(88, 78, 159, 0.32);\n  color: #5a4ea0;\n}\n.readonly-select {\n  width: fit-content;\n  min-width: 0;\n  max-width: 130px;\n  justify-content: center;\n  margin-top: 2px;\n  padding-left: 0.44rem;\n  padding-right: 0.44rem;\n}\n.readonly-field {\n  min-height: 34px;\n  border: 1px solid rgba(15, 27, 47, 0.16);\n  border-radius: 10px;\n  padding: 0.4rem 0.56rem;\n  background: #f7fafe;\n  color: #23476f;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.26rem;\n  font-weight: 700;\n}\n.readonly-field .mat-icon {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n  line-height: 16px;\n}\n.zodiac-symbol {\n  font-size: 1.1rem;\n  font-weight: 800;\n  line-height: 1;\n}\n.zodiac-label {\n  font-size: 0.9rem;\n  font-weight: 700;\n  min-width: 0;\n  text-align: center;\n}\n.readonly-select.zodiac-aries {\n  background: #fdf1f1;\n  color: #9f2f2f;\n}\n.readonly-select.zodiac-taurus {\n  background: #f7f3eb;\n  color: #6e4b2b;\n}\n.readonly-select.zodiac-gemini {\n  background: #fdf8e9;\n  color: #7d5a12;\n}\n.readonly-select.zodiac-cancer {\n  background: #eef4ff;\n  color: #2d5b8e;\n}\n.readonly-select.zodiac-leo {\n  background: #fff3e8;\n  color: #8f4b0d;\n}\n.readonly-select.zodiac-virgo {\n  background: #edf8ef;\n  color: #2b6b3d;\n}\n.readonly-select.zodiac-libra {\n  background: #f2eefc;\n  color: #60439d;\n}\n.readonly-select.zodiac-scorpio {\n  background: #f9edf2;\n  color: #7b3150;\n}\n.readonly-select.zodiac-sagittarius {\n  background: #eef1ff;\n  color: #2f4a9a;\n}\n.readonly-select.zodiac-capricorn {\n  background: #eff2f5;\n  color: #364653;\n}\n.readonly-select.zodiac-aquarius {\n  background: #ebf7fb;\n  color: #1d5f7a;\n}\n.readonly-select.zodiac-pisces {\n  background: #eef2ff;\n  color: #294b8f;\n}\n.physique-slim {\n  color: #3f7ab3;\n}\n.physique-lean {\n  color: #3f8f5f;\n}\n.physique-athletic {\n  color: #2f7e4d;\n}\n.physique-fit {\n  color: #465fbb;\n}\n.physique-curvy {\n  color: #a14875;\n}\n.physique-muscular {\n  color: #7d4f24;\n}\n.physique-average {\n  color: #4d667f;\n}\n.physique-select-wrap.physique-slim {\n  background:\n    linear-gradient(\n      180deg,\n      #eaf3fb 0%,\n      #dfebf8 100%);\n  border-color: rgba(63, 122, 179, 0.34);\n}\n.physique-select-wrap.physique-lean {\n  background:\n    linear-gradient(\n      180deg,\n      #eaf6ee 0%,\n      #def0e5 100%);\n  border-color: rgba(63, 143, 95, 0.34);\n}\n.physique-select-wrap.physique-athletic {\n  background:\n    linear-gradient(\n      180deg,\n      #e8f5ec 0%,\n      #dff0e6 100%);\n  border-color: rgba(47, 126, 77, 0.34);\n}\n.physique-select-wrap.physique-fit {\n  background:\n    linear-gradient(\n      180deg,\n      #ebf0ff 0%,\n      #e1e8fc 100%);\n  border-color: rgba(70, 95, 187, 0.34);\n}\n.physique-select-wrap.physique-curvy {\n  background:\n    linear-gradient(\n      180deg,\n      #f7edf3 0%,\n      #f0e3ec 100%);\n  border-color: rgba(161, 72, 117, 0.36);\n}\n.physique-select-wrap.physique-muscular {\n  background:\n    linear-gradient(\n      180deg,\n      #f6efe9 0%,\n      #ede3d8 100%);\n  border-color: rgba(125, 79, 36, 0.36);\n}\n.physique-select-wrap.physique-average {\n  background:\n    linear-gradient(\n      180deg,\n      #eef2f6 0%,\n      #e5ebf1 100%);\n  border-color: rgba(77, 102, 127, 0.34);\n}\n.physique-select-wrap.physique-slim .status-option-content .mat-icon {\n  color: #3f7ab3;\n}\n.physique-select-wrap.physique-lean .status-option-content .mat-icon {\n  color: #3f8f5f;\n}\n.physique-select-wrap.physique-athletic .status-option-content .mat-icon {\n  color: #2f7e4d;\n}\n.physique-select-wrap.physique-fit .status-option-content .mat-icon {\n  color: #465fbb;\n}\n.physique-select-wrap.physique-curvy .status-option-content .mat-icon {\n  color: #a14875;\n}\n.physique-select-wrap.physique-muscular .status-option-content .mat-icon {\n  color: #7d4f24;\n}\n.physique-select-wrap.physique-average .status-option-content .mat-icon {\n  color: #4d667f;\n}\n.experience-filter-all {\n  color: #694ea6;\n}\n.experience-filter-workspace {\n  color: #a1485a;\n}\n.experience-filter-school {\n  color: #2d5ea8;\n}\n.experience-filter-online {\n  color: #2d7d47;\n}\n.experience-filter-project {\n  color: #6550a0;\n}\n.experience-filter-select.experience-filter-all,\n.experience-type-select.experience-filter-project {\n  background:\n    linear-gradient(\n      180deg,\n      #efe8ff 0%,\n      #e8defc 100%);\n  border-color: rgba(103, 76, 164, 0.32);\n}\n.experience-filter-select.experience-filter-workspace,\n.experience-type-select.experience-filter-workspace {\n  background:\n    linear-gradient(\n      180deg,\n      #fff1f3 0%,\n      #ffe6ea 100%);\n  border-color: rgba(169, 72, 90, 0.32);\n}\n.experience-filter-select.experience-filter-school,\n.experience-type-select.experience-filter-school {\n  background:\n    linear-gradient(\n      180deg,\n      #eaf4ff 0%,\n      #e1ecfb 100%);\n  border-color: rgba(45, 94, 168, 0.32);\n}\n.experience-type-select.experience-filter-online {\n  background:\n    linear-gradient(\n      180deg,\n      #edf8ee 0%,\n      #e2f1e4 100%);\n  border-color: rgba(44, 126, 72, 0.32);\n}\n.experience-type-select.experience-filter-project {\n  background:\n    linear-gradient(\n      180deg,\n      #f4f0ff 0%,\n      #e9e3fb 100%);\n}\n.experience-type-select {\n  min-width: 0;\n  max-width: 100%;\n  min-height: 40px;\n}\n.experience-type-field,\n.experience-title-field,\n.experience-city-field {\n  width: 100%;\n  justify-self: stretch;\n}\n.experience-org-field {\n  width: 100%;\n  justify-self: stretch;\n}\n.experience-type-select {\n  width: 100%;\n}\n.experience-date-range-field {\n  width: 100%;\n  max-width: none;\n  margin: 0;\n  background: transparent;\n}\n.experience-date-range-label {\n  grid-column: 1/2;\n  width: 100%;\n  justify-self: stretch;\n}\n.experience-date-range-field .mat-mdc-text-field-wrapper {\n  min-height: 42px;\n  border-radius: 10px;\n  background: #fff;\n  border: 1px solid rgba(136, 156, 186, 0.5);\n  box-shadow: none;\n}\n.experience-date-range-field .mat-mdc-form-field-subscript-wrapper {\n  margin-top: 0.24rem;\n}\n.experience-date-range-field input {\n  border: 0 !important;\n  box-shadow: none !important;\n  border-radius: 0 !important;\n  background: transparent !important;\n  min-width: 0;\n  width: 100%;\n  padding: 0 !important;\n  min-height: 0 !important;\n  height: auto !important;\n  line-height: 1.25;\n}\n.experience-date-range-field .mat-datepicker-toggle {\n  margin-right: 0.2rem;\n}\n.experience-date-range-field .mat-mdc-form-field-hint-wrapper,\n.experience-date-range-field .mat-mdc-form-field-hint {\n  color: rgba(30, 49, 74, 0.65);\n  font-size: 0.72rem;\n}\n.experience-date-range-field .mat-date-range-input-container {\n  width: 100%;\n  display: grid;\n  grid-template-columns: minmax(96px, 1fr) auto minmax(96px, 1fr);\n  align-items: center;\n  column-gap: 0.34rem;\n  min-width: 0;\n}\n.experience-date-range-field .mat-date-range-input-separator {\n  margin: 0 0.28rem;\n  flex: 0 0 auto;\n  white-space: nowrap;\n}\n.experience-date-range-field .mat-date-range-input-start-wrapper,\n.experience-date-range-field .mat-date-range-input-end-wrapper {\n  width: 100%;\n  max-width: 100%;\n  overflow: visible;\n  min-width: 0;\n}\n.experience-date-range-field .mat-date-range-input-inner {\n  font-size: 0.96rem;\n  min-width: 0 !important;\n  width: 100% !important;\n  text-overflow: clip;\n  white-space: nowrap;\n  line-height: 1.25;\n}\n.experience-date-range-field .mat-mdc-form-field-flex {\n  min-width: 0;\n  border-bottom: 0 !important;\n  box-shadow: none !important;\n  align-items: center !important;\n}\n.experience-date-range-field .mat-mdc-form-field-infix {\n  padding-top: 0 !important;\n  padding-bottom: 0 !important;\n  min-height: 34px !important;\n  height: 34px;\n  display: flex;\n  align-items: center;\n}\n.experience-date-range-field .mdc-line-ripple,\n.experience-date-range-field .mat-mdc-form-field-line-ripple,\n.experience-date-range-field .mdc-line-ripple--deactivating,\n.experience-date-range-field .mdc-line-ripple--active {\n  display: none !important;\n  opacity: 0 !important;\n  transform: scaleX(0) !important;\n}\n:host ::ng-deep .mat-mdc-option.status-option.experience-filter-all {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #efe8ff);\n}\n:host ::ng-deep .mat-mdc-option.status-option.experience-filter-workspace {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #fff1f3);\n}\n:host ::ng-deep .mat-mdc-option.status-option.experience-filter-school {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #eaf4ff);\n}\n:host ::ng-deep .mat-mdc-option.status-option.experience-filter-online {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #edf8ee);\n}\n:host ::ng-deep .mat-mdc-option.status-option.experience-filter-project {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #f4f0ff);\n}\n.mobile-profile-language-chip.language-tone-1,\n.mobile-profile-selector-option.language-tone-1,\n:host ::ng-deep .mat-mdc-option.language-tone-1 {\n  background: #eaf4ff;\n  border-color: rgba(63, 122, 179, 0.34);\n  color: #2f6090;\n}\n.mobile-profile-language-chip.language-tone-2,\n.mobile-profile-selector-option.language-tone-2,\n:host ::ng-deep .mat-mdc-option.language-tone-2 {\n  background: #edf8f4;\n  border-color: rgba(75, 127, 113, 0.34);\n  color: #2f695b;\n}\n.mobile-profile-language-chip.language-tone-3,\n.mobile-profile-selector-option.language-tone-3,\n:host ::ng-deep .mat-mdc-option.language-tone-3 {\n  background: #f1f2ff;\n  border-color: rgba(70, 95, 187, 0.34);\n  color: #394f9c;\n}\n.mobile-profile-language-chip.language-tone-4,\n.mobile-profile-selector-option.language-tone-4,\n:host ::ng-deep .mat-mdc-option.language-tone-4 {\n  background: #fff2f8;\n  border-color: rgba(161, 72, 117, 0.34);\n  color: #8d3f66;\n}\n.mobile-profile-language-chip.language-tone-5,\n.mobile-profile-selector-option.language-tone-5,\n:host ::ng-deep .mat-mdc-option.language-tone-5 {\n  background: #fbf4ea;\n  border-color: rgba(125, 79, 36, 0.34);\n  color: #704822;\n}\n.mobile-profile-language-chip.language-tone-6,\n.mobile-profile-selector-option.language-tone-6,\n:host ::ng-deep .mat-mdc-option.language-tone-6 {\n  background: #eff4f9;\n  border-color: rgba(77, 102, 127, 0.34);\n  color: #415872;\n}\n.mobile-profile-language-chip.language-tone-7,\n.mobile-profile-selector-option.language-tone-7,\n:host ::ng-deep .mat-mdc-option.language-tone-7 {\n  background: #f7f5ea;\n  border-color: rgba(128, 109, 66, 0.34);\n  color: #746237;\n}\n.mobile-profile-language-chip.language-tone-8,\n.mobile-profile-selector-option.language-tone-8,\n:host ::ng-deep .mat-mdc-option.language-tone-8 {\n  background: #edf5ff;\n  border-color: rgba(45, 122, 160, 0.34);\n  color: #2f6782;\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-1 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #eaf2ff);\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-2 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #ebf7ef);\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-3 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #fff1e3);\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-4 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #efecfc);\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-5 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #f3f8e9);\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-6 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #fceef3);\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-7 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #edf7ff);\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-8 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #f6f2e9);\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-1 .status-option-content {\n  color: #2d63a9;\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-2 .status-option-content {\n  color: #2a7a49;\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-3 .status-option-content {\n  color: #9b6018;\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-4 .status-option-content {\n  color: #6153a2;\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-5 .status-option-content {\n  color: #61812a;\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-6 .status-option-content {\n  color: #9f446d;\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-7 .status-option-content {\n  color: #2e7898;\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-8 .status-option-content {\n  color: #806c3f;\n}\n.mobile-profile-selector-option.detail-tone-1 {\n  background:\n    linear-gradient(\n      180deg,\n      #eef5ff 0%,\n      #e3eefc 100%);\n  border-color: rgba(46, 102, 181, 0.32);\n}\n.mobile-profile-selector-option.detail-tone-2 {\n  background:\n    linear-gradient(\n      180deg,\n      #eef9f3 0%,\n      #e3f4ea 100%);\n  border-color: rgba(40, 125, 72, 0.32);\n}\n.mobile-profile-selector-option.detail-tone-3 {\n  background:\n    linear-gradient(\n      180deg,\n      #fff4ea 0%,\n      #ffecdd 100%);\n  border-color: rgba(165, 94, 24, 0.32);\n}\n.mobile-profile-selector-option.detail-tone-4 {\n  background:\n    linear-gradient(\n      180deg,\n      #f2f1ff 0%,\n      #e8e5fb 100%);\n  border-color: rgba(97, 82, 164, 0.32);\n}\n.mobile-profile-selector-option.detail-tone-5 {\n  background:\n    linear-gradient(\n      180deg,\n      #f6f9ef 0%,\n      #edf3e1 100%);\n  border-color: rgba(95, 128, 36, 0.32);\n}\n.mobile-profile-selector-option.detail-tone-6 {\n  background:\n    linear-gradient(\n      180deg,\n      #fff1f4 0%,\n      #f9e6ed 100%);\n  border-color: rgba(160, 70, 111, 0.32);\n}\n.mobile-profile-selector-option.detail-tone-7 {\n  background:\n    linear-gradient(\n      180deg,\n      #edf8ff 0%,\n      #e2f0fb 100%);\n  border-color: rgba(45, 122, 160, 0.32);\n}\n.mobile-profile-selector-option.detail-tone-8 {\n  background:\n    linear-gradient(\n      180deg,\n      #f6f3ea 0%,\n      #eee9dc 100%);\n  border-color: rgba(128, 109, 66, 0.32);\n}\n.mobile-profile-selector-option.status-public {\n  background:\n    linear-gradient(\n      180deg,\n      #e6f6ef 0%,\n      #d9f0e6 100%);\n  border-color: rgba(47, 143, 102, 0.34);\n}\n.mobile-profile-selector-option.status-friends {\n  background:\n    linear-gradient(\n      180deg,\n      #e8f1fd 0%,\n      #dfeaf9 100%);\n  border-color: rgba(27, 87, 161, 0.34);\n}\n.mobile-profile-selector-option.status-host {\n  background:\n    linear-gradient(\n      180deg,\n      #f6efe2 0%,\n      #eee4d2 100%);\n  border-color: rgba(135, 88, 15, 0.36);\n}\n.mobile-profile-selector-option.status-inactive {\n  background:\n    linear-gradient(\n      180deg,\n      #f2f3f5 0%,\n      #e8ebef 100%);\n  border-color: rgba(91, 101, 115, 0.32);\n}\n.mobile-profile-selector-option.physique-slim {\n  background: #eaf4ff;\n  border-color: rgba(63, 122, 179, 0.34);\n}\n.mobile-profile-selector-option.physique-lean {\n  background: #edf8f4;\n  border-color: rgba(75, 127, 113, 0.34);\n}\n.mobile-profile-selector-option.physique-athletic {\n  background: #e8f5ec;\n  border-color: rgba(47, 126, 77, 0.34);\n}\n.mobile-profile-selector-option.physique-fit {\n  background: #f1f2ff;\n  border-color: rgba(70, 95, 187, 0.34);\n}\n.mobile-profile-selector-option.physique-curvy {\n  background: #fff2f8;\n  border-color: rgba(161, 72, 117, 0.34);\n}\n.mobile-profile-selector-option.physique-muscular {\n  background: #fbf4ea;\n  border-color: rgba(125, 79, 36, 0.34);\n}\n.mobile-profile-selector-option.physique-average {\n  background: #eff4f9;\n  border-color: rgba(77, 102, 127, 0.34);\n}\n.popup-panel-profile-selector .values-selector-popup.profile-selector-popup {\n  gap: 0.56rem;\n}\n.popup-panel-profile-selector .profile-filter-selector-head {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.44rem;\n  padding-bottom: 0.22rem;\n  border-bottom: 1px solid rgba(74, 102, 139, 0.22);\n}\n.popup-panel-profile-selector .profile-filter-selector-head-label {\n  color: #203c64;\n  font-size: 0.82rem;\n  font-weight: 800;\n  line-height: 1.2;\n}\n.popup-panel-profile-selector .profile-filter-selector-clear {\n  border: 1px solid rgba(41, 73, 110, 0.24);\n  border-radius: 999px;\n  background: rgba(255, 255, 255, 0.82);\n  color: #284970;\n  font: inherit;\n  font-size: 0.72rem;\n  font-weight: 700;\n  line-height: 1;\n  padding: 0.3rem 0.52rem;\n  cursor: pointer;\n}\n.popup-panel-profile-selector .profile-filter-selector-clear.is-hidden {\n  visibility: hidden;\n  pointer-events: none;\n}\n.popup-panel-profile-selector .profile-filter-selector-selected {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 0.34rem;\n}\n.popup-panel-profile-selector .profile-filter-selector-chip {\n  border: 1px solid rgba(35, 68, 107, 0.24);\n  border-radius: 999px;\n  background: rgba(255, 255, 255, 0.92);\n  color: #234368;\n  font: inherit;\n  font-size: 0.72rem;\n  font-weight: 700;\n  line-height: 1;\n  padding: 0.26rem 0.48rem;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.16rem;\n  cursor: pointer;\n}\n.popup-panel-profile-selector .profile-filter-selector-chip .mat-icon {\n  width: 13px;\n  height: 13px;\n  font-size: 13px;\n  line-height: 13px;\n}\n.popup-panel-profile-selector .profile-filter-selector-empty {\n  margin: 0;\n  font-size: 0.74rem;\n  color: rgba(31, 54, 86, 0.62);\n  font-style: italic;\n}\n.popup-panel-profile-selector .profile-selector-option-group {\n  display: grid;\n  gap: 0.34rem;\n  border: 1px solid transparent;\n  border-radius: 12px;\n  padding: 0.4rem 0.42rem;\n}\n.popup-panel-profile-selector .profile-selector-option-group-head {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.34rem;\n}\n.popup-panel-profile-selector .profile-selector-option-group-tag {\n  border-radius: 999px;\n  border: 1px solid rgba(52, 86, 128, 0.28);\n  background: rgba(255, 255, 255, 0.74);\n  color: #2f527d;\n  font-size: 0.67rem;\n  font-weight: 800;\n  letter-spacing: 0.02em;\n  line-height: 1;\n  padding: 0.2rem 0.52rem;\n  text-transform: uppercase;\n  white-space: nowrap;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.24rem;\n}\n.popup-panel-profile-selector .profile-selector-option-group-tag-icon {\n  width: 12px;\n  height: 12px;\n  font-size: 12px;\n  line-height: 12px;\n}\n.popup-panel-profile-selector .profile-selector-option-group-line {\n  display: block;\n  width: 100%;\n  height: 1px;\n  background: rgba(84, 111, 147, 0.34);\n}\n.popup-panel-profile-selector .profile-selector-chip-grid {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 0.36rem;\n}\n.popup-panel-profile-selector .profile-selector-chip {\n  border: 1px solid rgba(41, 70, 106, 0.22);\n  border-radius: 999px;\n  background: #f4f8ff;\n  color: #234066;\n  font: inherit;\n  font-size: 0.78rem;\n  font-weight: 700;\n  padding: 0.3rem 0.58rem;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.26rem;\n  cursor: pointer;\n  transition:\n    background-color 0.14s ease,\n    border-color 0.14s ease,\n    color 0.14s ease,\n    box-shadow 0.14s ease;\n}\n.popup-panel-profile-selector .profile-selector-chip.active {\n  border-color: rgba(27, 85, 158, 0.5);\n  background:\n    linear-gradient(\n      180deg,\n      #dcebff 0%,\n      #cfe3ff 100%);\n  color: #123e70;\n  box-shadow: inset 0 0 0 1px rgba(30, 73, 127, 0.24), 0 1px 2px rgba(24, 53, 86, 0.16);\n}\n.popup-panel-profile-selector .profile-selector-option-group.section-family {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 232, 219, 0.52) 0%,\n      rgba(255, 232, 219, 0.3) 100%);\n}\n.popup-panel-profile-selector .profile-selector-option-group.section-ambition {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 242, 216, 0.52) 0%,\n      rgba(255, 242, 216, 0.3) 100%);\n}\n.popup-panel-profile-selector .profile-selector-option-group.section-lifestyle {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(221, 241, 239, 0.56) 0%,\n      rgba(221, 241, 239, 0.32) 100%);\n}\n.popup-panel-profile-selector .profile-selector-option-group.section-beliefs {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(230, 226, 250, 0.56) 0%,\n      rgba(230, 226, 250, 0.32) 100%);\n}\n.popup-panel-profile-selector .profile-selector-option-group.section-social {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(223, 236, 255, 0.5) 0%,\n      rgba(223, 236, 255, 0.28) 100%);\n}\n.popup-panel-profile-selector .profile-selector-option-group.section-arts {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(235, 227, 255, 0.5) 0%,\n      rgba(235, 227, 255, 0.28) 100%);\n}\n.popup-panel-profile-selector .profile-selector-option-group.section-food {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 236, 221, 0.52) 0%,\n      rgba(255, 236, 221, 0.3) 100%);\n}\n.popup-panel-profile-selector .profile-selector-option-group.section-active {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(222, 243, 231, 0.56) 0%,\n      rgba(222, 243, 231, 0.32) 100%);\n}\n.popup-panel-profile-selector .profile-selector-option-group.section-mind {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(219, 242, 238, 0.56) 0%,\n      rgba(219, 242, 238, 0.32) 100%);\n}\n.popup-panel-profile-selector .profile-selector-option-group.section-identity {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(230, 226, 250, 0.56) 0%,\n      rgba(230, 226, 250, 0.32) 100%);\n}\n.popup-panel-profile-selector .profile-selector-option-group-tag.section-family {\n  border-color: rgba(156, 94, 51, 0.34);\n  color: #9c5e33;\n}\n.popup-panel-profile-selector .profile-selector-option-group-tag.section-ambition {\n  border-color: rgba(160, 106, 20, 0.34);\n  color: #9b6717;\n}\n.popup-panel-profile-selector .profile-selector-option-group-tag.section-lifestyle {\n  border-color: rgba(47, 123, 119, 0.34);\n  color: #2f7b77;\n}\n.popup-panel-profile-selector .profile-selector-option-group-tag.section-beliefs {\n  border-color: rgba(95, 78, 160, 0.34);\n  color: #5f4ea0;\n}\n.popup-panel-profile-selector .profile-selector-option-group-tag.section-social {\n  border-color: rgba(47, 106, 175, 0.36);\n  color: #2f6aaf;\n}\n.popup-panel-profile-selector .profile-selector-option-group-tag.section-arts {\n  border-color: rgba(106, 87, 168, 0.36);\n  color: #6a57a8;\n}\n.popup-panel-profile-selector .profile-selector-option-group-tag.section-food {\n  border-color: rgba(170, 97, 28, 0.34);\n  color: #a55e18;\n}\n.popup-panel-profile-selector .profile-selector-option-group-tag.section-active {\n  border-color: rgba(49, 124, 82, 0.36);\n  color: #317c52;\n}\n.popup-panel-profile-selector .profile-selector-option-group-tag.section-mind {\n  border-color: rgba(37, 124, 118, 0.34);\n  color: #2b7c76;\n}\n.popup-panel-profile-selector .profile-selector-option-group-tag.section-identity {\n  border-color: rgba(98, 84, 163, 0.34);\n  color: #6254a3;\n}\n.popup-panel-profile-selector .profile-selector-option-group-line.section-family {\n  background: rgba(156, 94, 51, 0.3);\n}\n.popup-panel-profile-selector .profile-selector-option-group-line.section-ambition {\n  background: rgba(160, 106, 20, 0.32);\n}\n.popup-panel-profile-selector .profile-selector-option-group-line.section-lifestyle {\n  background: rgba(47, 123, 119, 0.3);\n}\n.popup-panel-profile-selector .profile-selector-option-group-line.section-beliefs {\n  background: rgba(95, 78, 160, 0.3);\n}\n.popup-panel-profile-selector .profile-selector-option-group-line.section-social {\n  background: rgba(47, 106, 175, 0.34);\n}\n.popup-panel-profile-selector .profile-selector-option-group-line.section-arts {\n  background: rgba(106, 87, 168, 0.34);\n}\n.popup-panel-profile-selector .profile-selector-option-group-line.section-food {\n  background: rgba(170, 97, 28, 0.32);\n}\n.popup-panel-profile-selector .profile-selector-option-group-line.section-active {\n  background: rgba(49, 124, 82, 0.34);\n}\n.popup-panel-profile-selector .profile-selector-option-group-line.section-mind {\n  background: rgba(37, 124, 118, 0.34);\n}\n.popup-panel-profile-selector .profile-selector-option-group-line.section-identity {\n  background: rgba(98, 84, 163, 0.3);\n}\n:host ::ng-deep .mat-mdc-option.mdc-list-item--selected:not(.mdc-list-item--disabled):not(.status-option) {\n  background: #f0f5fc;\n}\n:host ::ng-deep .mat-mdc-option.status-option.mdc-list-item--selected:not(.mdc-list-item--disabled) {\n  filter: brightness(0.95);\n  box-shadow: inset 0 0 0 1px rgba(24, 46, 76, 0.2);\n}\n:host ::ng-deep .mat-mdc-option.status-option {\n  background: #fff;\n}\n:host ::ng-deep .mat-mdc-option.status-option:not(:last-child) {\n  border-bottom: 1px solid #e6edf7;\n}\n:host ::ng-deep .selector-options-panel .mat-mdc-option.hide-selected-option,\n:host ::ng-deep .status-options-panel .mat-mdc-option.hide-selected-option {\n  min-height: 0 !important;\n  height: 0 !important;\n  padding-top: 0 !important;\n  padding-bottom: 0 !important;\n  border: 0 !important;\n  margin: 0 !important;\n  opacity: 0 !important;\n  pointer-events: none !important;\n  overflow: hidden !important;\n}\n:host ::ng-deep .selector-options-panel .mat-mdc-option {\n  background: #fff;\n}\n:host ::ng-deep .mat-mdc-select-panel.selector-options-panel,\n:host ::ng-deep .mat-mdc-select-panel.status-options-panel {\n  margin-top: 8px !important;\n  margin-bottom: 8px !important;\n}\n:host ::ng-deep .mat-mdc-select-panel.selector-options-panel.mat-mdc-select-panel-above,\n:host ::ng-deep .mat-mdc-select-panel.status-options-panel.mat-mdc-select-panel-above,\n:host ::ng-deep .cdk-overlay-pane .mat-mdc-select-panel.selector-options-panel.mat-mdc-select-panel-above,\n:host ::ng-deep .cdk-overlay-pane .mat-mdc-select-panel.status-options-panel.mat-mdc-select-panel-above {\n  margin-top: 0 !important;\n  margin-bottom: 18px !important;\n  transform: translateY(-10px) !important;\n}\n:host ::ng-deep .selector-options-panel .mat-mdc-option.status-option.status-public,\n:host ::ng-deep .status-options-panel .mat-mdc-option.status-option.status-public {\n  --mdc-list-list-item-container-color: #def3e9;\n  --mat-mdc-option-selected-container-color: #def3e9;\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #def3e9) !important;\n}\n:host ::ng-deep .selector-options-panel .mat-mdc-option.status-option.status-friends,\n:host ::ng-deep .status-options-panel .mat-mdc-option.status-option.status-friends {\n  --mdc-list-list-item-container-color: #e3eefb;\n  --mat-mdc-option-selected-container-color: #e3eefb;\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #e3eefb) !important;\n}\n:host ::ng-deep .selector-options-panel .mat-mdc-option.status-option.status-host,\n:host ::ng-deep .status-options-panel .mat-mdc-option.status-option.status-host {\n  --mdc-list-list-item-container-color: #f3ead8;\n  --mat-mdc-option-selected-container-color: #f3ead8;\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #f3ead8) !important;\n}\n:host ::ng-deep .selector-options-panel .mat-mdc-option.status-option.status-inactive,\n:host ::ng-deep .status-options-panel .mat-mdc-option.status-option.status-inactive {\n  --mdc-list-list-item-container-color: #eceff3;\n  --mat-mdc-option-selected-container-color: #eceff3;\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #eceff3) !important;\n}\n:host ::ng-deep .selector-options-panel .mat-mdc-option.status-option.status-public .status-option-content,\n:host ::ng-deep .selector-options-panel .mat-mdc-option.status-option.status-public .status-option-content .mat-icon,\n:host ::ng-deep .status-options-panel .mat-mdc-option.status-option.status-public .status-option-content,\n:host ::ng-deep .status-options-panel .mat-mdc-option.status-option.status-public .status-option-content .mat-icon {\n  color: #2f8f66 !important;\n}\n:host ::ng-deep .selector-options-panel .mat-mdc-option.status-option.status-friends .status-option-content,\n:host ::ng-deep .selector-options-panel .mat-mdc-option.status-option.status-friends .status-option-content .mat-icon,\n:host ::ng-deep .status-options-panel .mat-mdc-option.status-option.status-friends .status-option-content,\n:host ::ng-deep .status-options-panel .mat-mdc-option.status-option.status-friends .status-option-content .mat-icon {\n  color: #1b57a1 !important;\n}\n:host ::ng-deep .selector-options-panel .mat-mdc-option.status-option.status-host .status-option-content,\n:host ::ng-deep .selector-options-panel .mat-mdc-option.status-option.status-host .status-option-content .mat-icon,\n:host ::ng-deep .status-options-panel .mat-mdc-option.status-option.status-host .status-option-content,\n:host ::ng-deep .status-options-panel .mat-mdc-option.status-option.status-host .status-option-content .mat-icon {\n  color: #87580f !important;\n}\n:host ::ng-deep .selector-options-panel .mat-mdc-option.status-option.status-inactive .status-option-content,\n:host ::ng-deep .selector-options-panel .mat-mdc-option.status-option.status-inactive .status-option-content .mat-icon,\n:host ::ng-deep .status-options-panel .mat-mdc-option.status-option.status-inactive .status-option-content,\n:host ::ng-deep .status-options-panel .mat-mdc-option.status-option.status-inactive .status-option-content .mat-icon {\n  color: #5b6573 !important;\n}\n:host ::ng-deep .mat-mdc-option.status-option.physique-slim {\n  background: #eaf4ff;\n}\n:host ::ng-deep .mat-mdc-option.status-option.physique-lean {\n  background: #edf8f4;\n}\n:host ::ng-deep .mat-mdc-option.status-option.physique-athletic {\n  background: #e8f5ec;\n}\n:host ::ng-deep .mat-mdc-option.status-option.physique-fit {\n  background: #f1f2ff;\n}\n:host ::ng-deep .mat-mdc-option.status-option.physique-curvy {\n  background: #fff2f8;\n}\n:host ::ng-deep .mat-mdc-option.status-option.physique-muscular {\n  background: #fbf4ea;\n}\n:host ::ng-deep .mat-mdc-option.status-option.physique-average {\n  background: #eff4f9;\n}\n:host ::ng-deep .mat-mdc-option.status-option.physique-slim .status-option-content {\n  color: #3f7ab3;\n}\n:host ::ng-deep .mat-mdc-option.status-option.physique-lean .status-option-content {\n  color: #3f8f5f;\n}\n:host ::ng-deep .mat-mdc-option.status-option.physique-athletic .status-option-content {\n  color: #2f7e4d;\n}\n:host ::ng-deep .mat-mdc-option.status-option.physique-fit .status-option-content {\n  color: #465fbb;\n}\n:host ::ng-deep .mat-mdc-option.status-option.physique-curvy .status-option-content {\n  color: #a14875;\n}\n:host ::ng-deep .mat-mdc-option.status-option.physique-muscular .status-option-content {\n  color: #7d4f24;\n}\n:host ::ng-deep .mat-mdc-option.status-option.physique-average .status-option-content {\n  color: #4d667f;\n}\n:host ::ng-deep .mat-mdc-select-panel.physique-options-panel {\n  width: auto !important;\n  max-width: 220px !important;\n  min-width: 0 !important;\n}\n:host ::ng-deep .physique-options-panel .mat-mdc-option {\n  padding-right: 8px;\n}\n:host ::ng-deep .physique-options-panel .mat-mdc-option .mat-pseudo-checkbox {\n  margin-left: 4px;\n}\n@media (max-width: 760px) {\n  .experience-form-grid {\n    grid-template-columns: 1fr;\n    max-width: none;\n    justify-content: stretch;\n    row-gap: 0.72rem;\n  }\n  .experience-date-range-label {\n    grid-column: 1/-1;\n  }\n  .experience-date-range-field .mat-date-range-input-container {\n    grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);\n  }\n  .profile-details-privacy-fab .privacy-fab-actions {\n    position: fixed;\n    left: 0.5rem;\n    right: 0.5rem;\n    bottom: max(0.5rem, env(safe-area-inset-bottom));\n    top: auto;\n    transform: translateY(12px) scale(0.98);\n    transform-origin: bottom center;\n    justify-content: center;\n    gap: 0.46rem;\n    padding: 0.46rem 0.56rem;\n    border: 1px solid rgba(42, 68, 102, 0.2);\n    border-radius: 14px;\n    background: #fff;\n    box-shadow: 0 -12px 24px rgba(18, 31, 51, 0.22);\n  }\n  .profile-details-privacy-fab.open .privacy-fab-actions {\n    transform: translateY(0) scale(1);\n  }\n}\n.event-feedback-popup-module,\n.event-feedback-parent-popup {\n  display: contents;\n}\n.event-feedback-parent-hidden {\n  visibility: hidden;\n  pointer-events: none;\n}\n.event-feedback-stacked-content {\n  width: 100%;\n  min-height: 0;\n  display: flex;\n  flex: 1 1 auto;\n  flex-direction: column;\n}\n.event-feedback-stacked-content--detail,\n.event-feedback-stacked-content--organizer {\n  height: 100%;\n  overflow: hidden;\n}\n.event-feedback-stacked-content--organizer {\n  overflow-y: auto;\n  overflow-x: hidden;\n}\n.link-btn {\n  border: 1px solid rgba(23, 33, 54, 0.2);\n  border-radius: 14px;\n  background: #fff;\n  color: #1f3350;\n  font: inherit;\n  font-size: 0.83rem;\n  padding: 0.46rem 0.82rem;\n  cursor: pointer;\n  transition:\n    transform 0.16s ease,\n    box-shadow 0.16s ease,\n    opacity 0.16s ease,\n    background 0.16s ease;\n}\n.link-btn:not(:disabled):hover {\n  transform: translateY(-1px);\n}\n.link-btn:not(:disabled):active {\n  transform: translateY(0);\n}\n.neutral-btn {\n  background: #f2f4fa;\n  border-color: rgba(23, 33, 54, 0.12);\n}\n.primary-btn {\n  background: #4776b7;\n  border-color: #4776b7;\n  color: #fff;\n}\n.editor-list-card {\n  border: 1px solid rgba(13, 25, 44, 0.12);\n  border-radius: 11px;\n  padding: 0.56rem;\n  background: #fbfdff;\n}\n.editor-list-card h4 {\n  margin: 0;\n  font-size: 0.9rem;\n  color: var(--text-main);\n}\n.editor-list-card p {\n  margin-top: 0.26rem;\n  font-size: 0.78rem;\n  color: rgba(23, 41, 66, 0.72);\n}\n.support-popup {\n  display: flex;\n  flex-direction: column;\n  gap: 0.5rem;\n}\n.support-card {\n  background: #fff;\n}\n.support-form {\n  display: flex;\n  flex-direction: column;\n  gap: 0.48rem;\n  margin-top: 0.54rem;\n  min-width: 0;\n}\n.support-form label {\n  display: flex;\n  flex-direction: column;\n  gap: 0.22rem;\n  min-width: 0;\n}\n.support-form label > span {\n  font-size: 0.75rem;\n  font-weight: 700;\n  color: rgba(29, 47, 72, 0.9);\n}\n.support-form input,\n.support-form select,\n.support-form textarea {\n  width: 100%;\n  max-width: 100%;\n  min-width: 0;\n  box-sizing: border-box;\n  border: 1px solid rgba(15, 27, 47, 0.16);\n  border-radius: 10px;\n  padding: 0.48rem 0.56rem;\n  font: inherit;\n  color: var(--text-main);\n  background: #fff;\n}\n.support-form input:focus,\n.support-form select:focus,\n.support-form textarea:focus {\n  outline: 0;\n  border-color: rgba(52, 103, 182, 0.72);\n  box-shadow: 0 0 0 3px rgba(55, 116, 212, 0.14);\n}\n.support-form textarea {\n  min-height: 96px;\n  resize: vertical;\n}\n.support-submit-success {\n  border: 1px solid rgba(41, 131, 84, 0.35);\n  border-radius: 10px;\n  background:\n    linear-gradient(\n      180deg,\n      rgba(220, 249, 231, 0.95) 0%,\n      rgba(208, 245, 223, 0.95) 100%);\n  color: #1f6f48;\n  font-size: 0.78rem;\n  font-weight: 700;\n  line-height: 1.35;\n  padding: 0.52rem 0.58rem;\n}\n.support-submit-error {\n  border: 1px solid rgba(180, 35, 46, 0.32);\n  border-radius: 10px;\n  background: rgba(255, 235, 238, 0.96);\n  color: #a61f2b;\n  font-size: 0.78rem;\n  font-weight: 700;\n  line-height: 1.35;\n  padding: 0.52rem 0.58rem;\n}\n.support-actions {\n  display: flex;\n  justify-content: flex-end;\n  align-items: center;\n  gap: 0.45rem;\n  flex-wrap: wrap;\n}\n.support-actions .primary-btn:disabled {\n  background:\n    linear-gradient(\n      180deg,\n      #d9e2f2 0%,\n      #c9d4e8 100%);\n  border-color: rgba(74, 103, 145, 0.32);\n  color: rgba(29, 51, 83, 0.72);\n  cursor: not-allowed;\n  box-shadow: none;\n  opacity: 1;\n}\n.event-feedback-list-popup {\n  display: flex;\n  flex-direction: column;\n  gap: 0.44rem;\n  height: 100%;\n  min-height: 0;\n}\napp-smart-list.event-feedback-list-surface {\n  display: flex;\n  flex: 1 1 auto;\n  min-height: 0;\n}\n.event-feedback-event-list {\n  flex: 1;\n  min-height: 0;\n  overflow-y: auto;\n  overflow-x: hidden;\n  display: grid;\n  gap: 0.44rem;\n}\n:host ::ng-deep .event-feedback-list-surface .smart-list__header-progress-shell {\n  z-index: 8;\n}\n:host ::ng-deep .event-feedback-info-card-shell .ui-info-card {\n  background:\n    linear-gradient(\n      180deg,\n      #f8faff 0%,\n      #f1f6ff 100%);\n  border-color: rgba(53, 89, 139, 0.22);\n}\n:host ::ng-deep .event-feedback-info-card-shell.is-feedbacked .ui-info-card {\n  background:\n    linear-gradient(\n      180deg,\n      #edf8ef 0%,\n      #e3f3e7 100%);\n  border-color: rgba(57, 127, 77, 0.26);\n}\n:host ::ng-deep .event-feedback-info-card-shell.is-removed .ui-info-card {\n  background:\n    linear-gradient(\n      180deg,\n      #fff2f2 0%,\n      #fce7e7 100%);\n  border-color: rgba(170, 80, 80, 0.28);\n}\n:host ::ng-deep .event-feedback-info-card-shell .ui-info-card__leading {\n  border: 1px solid rgba(59, 93, 136, 0.28);\n  background: rgba(255, 255, 255, 0.84);\n}\n:host ::ng-deep .event-feedback-info-card-shell .ui-info-card__overlay-action--end {\n  min-width: 102px;\n  border-color: rgba(95, 61, 152, 0.36);\n  background:\n    linear-gradient(\n      180deg,\n      #f6efff 0%,\n      #ebdfff 100%);\n  color: #5f3d98;\n}\n@media (hover: hover) and (pointer: fine) {\n  :host ::ng-deep .event-feedback-info-card-shell button.ui-info-card__overlay-action--end:hover {\n    transform: translateY(-1px);\n    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.82), 0 10px 22px rgba(38, 18, 68, 0.2);\n    filter: brightness(1.04);\n  }\n}\n:host ::ng-deep .event-feedback-info-card-shell.is-feedbacked .ui-info-card__overlay-action--end,\n:host ::ng-deep .event-feedback-info-card-shell.is-removed .ui-info-card__overlay-action--end {\n  opacity: 0.74;\n}\n:host ::ng-deep .event-feedback-info-card-shell .ui-info-card__detail-row {\n  margin-top: 0.02rem;\n  font-size: 0.72rem;\n  font-weight: 700;\n  color: rgba(42, 62, 91, 0.86);\n}\n:host ::ng-deep .event-feedback-info-card-shell .ui-info-card__detail-row:last-of-type {\n  color: rgba(39, 60, 89, 0.72);\n}\n:host ::ng-deep .event-feedback-info-card-shell .ui-info-card__menu {\n  z-index: 180;\n}\n:host ::ng-deep .event-feedback-info-card-shell.is-own-event .ui-info-card__overlay-action--end {\n  min-width: 118px;\n  border-color: rgba(180, 111, 45, 0.34);\n  background:\n    linear-gradient(\n      180deg,\n      #fff3df 0%,\n      #ffe8c7 100%);\n  color: #8a5418;\n}\n.event-feedback-sticky-header {\n  z-index: 26;\n  margin-bottom: 0;\n  box-shadow: 0 0.34rem 0 rgba(255, 255, 255, 0.98);\n}\n.event-feedback-organizer-popup {\n  display: flex;\n  flex-direction: column;\n  width: 100%;\n}\n.event-feedback-organizer-shell {\n  display: flex;\n  flex-direction: column;\n  gap: 0.9rem;\n  width: 100%;\n  max-width: none;\n  box-sizing: border-box;\n}\n.event-feedback-organizer-loading {\n  min-height: min(56vh, 28rem);\n  display: grid;\n  place-items: center;\n}\n.event-feedback-organizer-overview-grid {\n  --event-feedback-organizer-overview-height: 244px;\n  display: grid;\n  grid-template-columns: minmax(300px, 360px) minmax(0, 1fr);\n  gap: 0.9rem;\n  align-items: start;\n}\n.event-feedback-organizer-info-card-shell {\n  width: 100%;\n  max-width: 360px;\n  height: var(--event-feedback-organizer-overview-height);\n  align-self: start;\n}\n.event-feedback-organizer-info-card-shell,\n.event-feedback-organizer-hero-card {\n  display: block;\n  width: 100%;\n  max-width: 100%;\n  height: 100%;\n}\n:host ::ng-deep .event-feedback-organizer-hero-card .ui-info-card {\n  width: 100%;\n  height: 100%;\n  max-width: none;\n  gap: 0.32rem;\n  padding: 0.58rem 0.62rem;\n  border-radius: 12px;\n}\n:host ::ng-deep .event-feedback-organizer-hero-card .ui-info-card__media {\n  height: 130px;\n  border-radius: 10px;\n}\n:host ::ng-deep .event-feedback-organizer-hero-card .ui-info-card__title {\n  font-size: 0.84rem;\n}\n:host ::ng-deep .event-feedback-organizer-hero-card .ui-info-card__meta-row {\n  font-size: 0.74rem;\n}\n:host ::ng-deep .event-feedback-organizer-hero-card .ui-info-card__detail-row {\n  font-size: 0.74rem;\n}\n.event-feedback-organizer-messages {\n  display: flex;\n  flex-direction: column;\n  gap: 0.56rem;\n}\n.event-feedback-organizer-carousel-panel {\n  min-width: 0;\n  height: var(--event-feedback-organizer-overview-height);\n  align-self: stretch;\n  box-sizing: border-box;\n}\n.event-feedback-organizer-carousel {\n  display: grid;\n  height: 100%;\n  grid-template-rows: auto minmax(0, 1fr);\n  gap: 0.28rem;\n  min-height: 0;\n}\n.event-feedback-organizer-carousel-pill-strip {\n  display: grid;\n  grid-template-columns: repeat(3, minmax(0, 1fr));\n  gap: 0.26rem;\n}\n.event-feedback-organizer-carousel-pill {\n  display: flex;\n  align-items: center;\n  min-height: 36px;\n  padding: 0.22rem 0.34rem;\n  border: 1px solid rgba(116, 127, 156, 0.18);\n  border-radius: 13px;\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 255, 255, 0.94) 0%,\n      rgba(243, 245, 250, 0.98) 100%);\n  color: #3b4560;\n  text-align: left;\n  cursor: pointer;\n  transition:\n    transform 0.18s ease,\n    border-color 0.18s ease,\n    box-shadow 0.18s ease,\n    background 0.18s ease;\n}\n.event-feedback-organizer-carousel-pill:hover {\n  transform: translateY(-1px);\n  border-color: rgba(89, 108, 153, 0.3);\n  box-shadow: 0 6px 16px rgba(37, 45, 68, 0.08);\n}\n.event-feedback-organizer-carousel-pill.is-active {\n  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.88), 0 8px 22px rgba(57, 84, 142, 0.08);\n}\n.event-feedback-organizer-carousel-pill-head {\n  display: flex;\n  width: 100%;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.3rem;\n}\n.event-feedback-organizer-carousel-pill-label {\n  color: #1f2937;\n  font-size: 0.7rem;\n  font-weight: 900;\n  line-height: 1.08;\n  min-width: 0;\n}\n.event-feedback-organizer-carousel-pill-badge {\n  display: inline-flex;\n  flex: 0 0 auto;\n  align-items: center;\n  justify-content: center;\n  min-width: 1.22rem;\n  min-height: 1.04rem;\n  padding: 0.02rem 0.24rem;\n  border-radius: 999px;\n  border: 1px solid rgba(187, 120, 33, 0.24);\n  background:\n    linear-gradient(\n      180deg,\n      #fff1d4 0%,\n      #ffdca0 100%);\n  color: #8b530c;\n  font-size: 0.58rem;\n  font-weight: 900;\n  line-height: 1;\n  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.94);\n}\n.event-feedback-organizer-carousel-pill.event-feedback-organizer-carousel-card-tone-overall {\n  border-color: rgba(47, 139, 174, 0.18);\n  background:\n    linear-gradient(\n      180deg,\n      #f7fbff 0%,\n      #edf5fd 100%);\n}\n.event-feedback-organizer-carousel-pill.event-feedback-organizer-carousel-card-tone-overall.is-active {\n  border-color: rgba(47, 139, 174, 0.32);\n  background:\n    linear-gradient(\n      180deg,\n      #eef7ff 0%,\n      #e3f0fb 100%);\n}\n.event-feedback-organizer-carousel-pill.event-feedback-organizer-carousel-card-tone-improve {\n  border-color: rgba(184, 92, 116, 0.16);\n  background:\n    linear-gradient(\n      180deg,\n      #fff8fa 0%,\n      #fef1f5 100%);\n}\n.event-feedback-organizer-carousel-pill.event-feedback-organizer-carousel-card-tone-improve.is-active {\n  border-color: rgba(184, 92, 116, 0.28);\n  background:\n    linear-gradient(\n      180deg,\n      #fff2f6 0%,\n      #fde8ef 100%);\n}\n.event-feedback-organizer-carousel-pill.event-feedback-organizer-carousel-card-tone-traits {\n  border-color: rgba(122, 76, 196, 0.16);\n  background:\n    linear-gradient(\n      180deg,\n      #fbf8ff 0%,\n      #f3ecff 100%);\n}\n.event-feedback-organizer-carousel-pill.event-feedback-organizer-carousel-card-tone-traits.is-active {\n  border-color: rgba(122, 76, 196, 0.28);\n  background:\n    linear-gradient(\n      180deg,\n      #f6f0ff 0%,\n      #eee4ff 100%);\n}\n.event-feedback-organizer-carousel-card {\n  --organizer-accent: #6a45a3;\n  --organizer-accent-soft: rgba(106, 69, 163, 0.18);\n  --organizer-surface:\n    linear-gradient(\n      180deg,\n      #fbf8ff 0%,\n      #f2ebff 100%);\n  display: flex;\n  flex-direction: column;\n  gap: 0.36rem;\n  min-height: 0;\n  height: 100%;\n  box-sizing: border-box;\n  padding: 0.56rem 0.62rem 0.6rem;\n  border: 1px solid var(--organizer-accent-soft);\n  border-radius: 18px;\n  background: var(--organizer-surface);\n  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.9), 0 10px 24px rgba(41, 49, 70, 0.08);\n  overflow: hidden;\n}\n.event-feedback-organizer-carousel-card-tone-overall {\n  --organizer-accent: #2d5ea8;\n  --organizer-accent-soft: rgba(47, 139, 174, 0.2);\n  --organizer-surface:\n    linear-gradient(\n      180deg,\n      #f5fbff 0%,\n      #ecf6fb 100%);\n}\n.event-feedback-organizer-carousel-card-tone-improve {\n  --organizer-accent: #b95577;\n  --organizer-accent-soft: rgba(184, 92, 116, 0.2);\n  --organizer-surface:\n    linear-gradient(\n      180deg,\n      #fff8fa 0%,\n      #fef0f4 100%);\n}\n.event-feedback-organizer-carousel-card-tone-traits {\n  --organizer-accent: #6a45a3;\n  --organizer-accent-soft: rgba(122, 76, 196, 0.2);\n  --organizer-surface:\n    linear-gradient(\n      180deg,\n      #faf7ff 0%,\n      #f1ebfd 100%);\n}\n.event-feedback-organizer-carousel-card-head {\n  display: flex;\n  align-items: flex-start;\n  justify-content: space-between;\n  gap: 0.58rem;\n}\n.event-feedback-organizer-carousel-card-title {\n  display: flex;\n  align-items: center;\n  gap: 0.52rem;\n}\n.event-feedback-organizer-carousel-card-title strong {\n  display: block;\n  color: #1f2937;\n  font-size: 0.82rem;\n  font-weight: 900;\n  line-height: 1.08;\n}\n.event-feedback-organizer-carousel-card-title p {\n  margin: 0.14rem 0 0;\n  color: #56627f;\n  font-size: 0.66rem;\n  font-weight: 700;\n  line-height: 1.22;\n}\n.event-feedback-organizer-carousel-card-icon {\n  display: inline-flex;\n  width: 1.86rem;\n  height: 1.86rem;\n  align-items: center;\n  justify-content: center;\n  border-radius: 999px;\n  background: rgba(255, 255, 255, 0.76);\n  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.94);\n  color: var(--organizer-accent);\n}\n.event-feedback-organizer-carousel-card-icon .mat-icon {\n  width: 0.96rem;\n  height: 0.96rem;\n  font-size: 0.96rem;\n  line-height: 0.96rem;\n}\n.event-feedback-organizer-carousel-card-bar {\n  position: relative;\n  height: 0.34rem;\n  overflow: hidden;\n  border-radius: 999px;\n  background: rgba(91, 103, 130, 0.12);\n}\n.event-feedback-organizer-carousel-card-bar span {\n  display: block;\n  height: 100%;\n  border-radius: inherit;\n  background:\n    linear-gradient(\n      90deg,\n      var(--organizer-accent) 0%,\n      color-mix(in srgb, var(--organizer-accent) 68%, white) 100%);\n  box-shadow: 0 4px 12px color-mix(in srgb, var(--organizer-accent) 30%, transparent);\n}\n.event-feedback-organizer-carousel-card-meta {\n  display: flex;\n  flex-wrap: wrap;\n  align-items: center;\n  gap: 0.28rem 0.56rem;\n  color: #5d6783;\n  font-size: 0.64rem;\n  font-weight: 800;\n}\n.event-feedback-organizer-carousel-card-highlights {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 0.22rem;\n}\n.event-feedback-organizer-carousel-chip {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.26rem;\n  max-width: 100%;\n  min-height: 21px;\n  padding: 0.1rem 0.38rem;\n  border: 1px solid rgba(107, 119, 146, 0.28);\n  border-radius: 999px;\n  background:\n    linear-gradient(\n      180deg,\n      #f4f5fb 0%,\n      #eceef8 100%);\n  color: #243a67;\n  font-size: 0.62rem;\n  font-weight: 800;\n  line-height: 1.15;\n}\n.event-feedback-organizer-carousel-chip .mat-icon {\n  width: 12px;\n  height: 12px;\n  font-size: 12px;\n  line-height: 12px;\n}\n.event-feedback-organizer-carousel-chip strong {\n  color: #17375d;\n}\n.event-feedback-organizer-section-head {\n  display: flex;\n  align-items: center;\n  justify-content: flex-start;\n  gap: 0.52rem;\n}\n.event-feedback-organizer-section-tag {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  min-height: 28px;\n  margin: 0;\n  padding: 0.16rem 0.78rem;\n  border-radius: 999px;\n  font-size: 0.68rem;\n  font-weight: 800;\n  letter-spacing: 0.05em;\n  text-transform: uppercase;\n  white-space: nowrap;\n}\n.event-feedback-organizer-section-line {\n  height: 1px;\n  flex: 1;\n  background: rgba(113, 124, 150, 0.32);\n}\n.event-feedback-organizer-message-list {\n  display: flex;\n  flex-direction: column;\n  gap: 0.56rem;\n}\n.event-feedback-organizer-group-marker {\n  margin-top: 0.18rem;\n  font-size: 0.72rem;\n  font-weight: 800;\n  letter-spacing: 0.04em;\n  color: rgba(44, 76, 116, 0.72);\n  text-transform: uppercase;\n}\n.event-feedback-organizer-message-card {\n  display: flex;\n  flex-direction: column;\n  gap: 0.48rem;\n  padding: 0.72rem 0.78rem;\n  border-radius: 18px;\n  border: 1px solid rgba(56, 90, 137, 0.14);\n  background:\n    linear-gradient(\n      180deg,\n      rgba(249, 251, 255, 0.96) 0%,\n      rgba(241, 246, 255, 0.98) 100%);\n}\n.event-feedback-organizer-message-head {\n  display: flex;\n  align-items: center;\n  gap: 0.56rem;\n}\n.event-feedback-organizer-message-avatar {\n  position: relative;\n  flex: 0 0 42px;\n  width: 42px;\n  height: 42px;\n  border-radius: 999px;\n  border: 1px solid rgba(34, 65, 102, 0.16);\n  background-color: #35587f;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  font-size: 0.76rem;\n  font-weight: 800;\n  color: #fff;\n  overflow: hidden;\n  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.24);\n}\n.event-feedback-organizer-message-avatar img {\n  width: 100%;\n  height: 100%;\n  object-fit: cover;\n  display: block;\n}\n.event-feedback-organizer-message-avatar.user-color-woman {\n  background:\n    linear-gradient(\n      145deg,\n      #d3754c,\n      #ac4a24);\n}\n.event-feedback-organizer-message-avatar.user-color-man {\n  background:\n    linear-gradient(\n      145deg,\n      #3572a4,\n      #194364);\n}\n.event-feedback-organizer-message-avatar span {\n  line-height: 1;\n  letter-spacing: 0.02em;\n  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.26);\n}\n.event-feedback-organizer-message-meta {\n  flex: 1 1 auto;\n  min-width: 0;\n}\n.event-feedback-organizer-message-meta h5,\n.event-feedback-organizer-message-meta p {\n  margin: 0;\n}\n.event-feedback-organizer-message-meta h5 {\n  font-size: 0.84rem;\n  font-weight: 800;\n  color: #213d63;\n}\n.event-feedback-organizer-message-meta p {\n  margin-top: 0.08rem;\n  font-size: 0.7rem;\n  color: rgba(41, 67, 104, 0.7);\n}\n.event-feedback-organizer-message-chips {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 0.34rem;\n}\n.event-feedback-organizer-message-chip {\n  padding: 0.24rem 0.44rem;\n  border-radius: 999px;\n  background: rgba(86, 115, 158, 0.12);\n  color: #31537f;\n  font-size: 0.66rem;\n  font-weight: 700;\n}\n.event-feedback-organizer-message-chip-trait {\n  background: rgba(118, 92, 171, 0.12);\n  color: #6846a0;\n}\n.event-feedback-organizer-message-opinion,\n.event-feedback-organizer-message-note {\n  display: grid;\n  gap: 0.2rem;\n  margin: 0;\n  padding: 0.55rem 0.62rem;\n  border-radius: 12px;\n  background: rgba(76, 118, 176, 0.08);\n  margin: 0;\n  font-size: 0.78rem;\n  line-height: 1.45;\n  color: rgba(33, 52, 82, 0.84);\n}\n.event-feedback-organizer-message-opinion strong,\n.event-feedback-organizer-message-note strong {\n  font-size: 0.66rem;\n  color: rgba(39, 69, 108, 0.7);\n  text-transform: uppercase;\n}\n.event-feedback-organizer-message-opinion p,\n.event-feedback-organizer-message-note p {\n  margin: 0;\n}\n.event-feedback-organizer-message-note {\n  background: rgba(237, 172, 76, 0.1);\n}\n.event-feedback-organizer-empty-copy {\n  margin: 0;\n  font-size: 0.78rem;\n  color: rgba(41, 67, 104, 0.72);\n}\n.event-feedback-event-card {\n  background:\n    linear-gradient(\n      180deg,\n      #f8faff 0%,\n      #f1f6ff 100%);\n  border-color: rgba(53, 89, 139, 0.22);\n}\n.event-feedback-leading-icon {\n  border: 1px solid rgba(59, 93, 136, 0.28);\n  background: rgba(255, 255, 255, 0.84);\n}\n.friends-picker-card {\n  position: relative;\n  width: min(100%, 320px);\n  min-height: 250px;\n  border-radius: 13px;\n  border: 1px solid rgba(30, 51, 81, 0.24);\n  background-size: cover;\n  background-position: center;\n  overflow: hidden;\n}\n.friends-picker-card::after {\n  content: "";\n  position: absolute;\n  inset: 0;\n  background:\n    linear-gradient(\n      180deg,\n      rgba(8, 16, 28, 0.14) 0%,\n      rgba(8, 15, 28, 0.82) 100%);\n}\n.friends-picker-card-meta {\n  position: absolute;\n  left: 0.52rem;\n  right: 0.52rem;\n  bottom: 0.46rem;\n  z-index: 2;\n}\n.friends-picker-card-meta h4 {\n  margin: 0;\n  color: #fff;\n  font-size: 0.9rem;\n  font-weight: 800;\n  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.55);\n}\n.friends-picker-card-meta p {\n  margin: 0.1rem 0 0;\n  color: rgba(245, 249, 255, 0.96);\n  font-size: 0.74rem;\n  font-weight: 700;\n  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.58);\n}\n.member-card-status-chip {\n  position: absolute;\n  top: 0.48rem;\n  left: 0.48rem;\n  z-index: 4;\n  width: 32px;\n  height: 32px;\n  border-radius: 50%;\n  border: 1px solid rgba(255, 255, 255, 0.88);\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  pointer-events: none;\n  box-shadow: 0 3px 10px rgba(10, 20, 34, 0.28);\n}\n.member-card-status-chip .mat-icon {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n  line-height: 16px;\n}\n.subevent-member-card-meta h4 {\n  color: #fff;\n}\n.subevent-member-card-meta p {\n  color: rgba(245, 249, 255, 0.96);\n}\n.member-status-admin {\n  background:\n    linear-gradient(\n      180deg,\n      #e8f0ff 0%,\n      #d9e7ff 100%);\n  color: #2b5d9d;\n}\n.member-status-manager {\n  background:\n    linear-gradient(\n      180deg,\n      #fff8e8 0%,\n      #fbeecf 100%);\n  color: #956215;\n}\n.member-status-member {\n  background:\n    linear-gradient(\n      180deg,\n      #ecfaef 0%,\n      #dcf2e2 100%);\n  color: #2a7644;\n}\n.member-status-invite-pending {\n  background:\n    linear-gradient(\n      180deg,\n      #fff6e8 0%,\n      #ffe8c9 100%);\n  color: #9c6121;\n}\n.member-status-awaiting-approval {\n  background:\n    linear-gradient(\n      180deg,\n      #fff0f3 0%,\n      #ffdce3 100%);\n  color: #a93046;\n}\n.event-feedback-popup {\n  display: flex;\n  flex-direction: column;\n  gap: 0.44rem;\n  height: 100%;\n  min-height: 0;\n}\n.event-feedback-shell {\n  display: grid;\n  height: 100%;\n  min-height: 0;\n  grid-template-rows: minmax(0, 1fr) auto auto;\n  position: relative;\n}\n.event-feedback-flow-shell {\n  border: 0;\n  background: transparent;\n  padding: 0;\n  overflow: visible;\n}\n.event-feedback-form-flow {\n  display: block;\n  min-height: 0;\n  height: 100%;\n}\n:host ::ng-deep .event-feedback-form-flow .form-flow__slide-nav {\n  left: 2px;\n  right: 2px;\n}\n.event-feedback-loading-card {\n  flex: 1 1 auto;\n  min-height: 0;\n  display: grid;\n  place-items: center;\n  align-content: center;\n  gap: 0.6rem;\n  border: 0;\n  background: transparent;\n  padding: 0;\n  text-align: center;\n  color: #536a84;\n}\n.event-feedback-loading-card span {\n  font-size: 0.78rem;\n  font-weight: 700;\n}\n.event-feedback-empty-card {\n  text-align: left;\n}\n@media (max-width: 760px) {\n  .event-feedback-organizer-overview-grid {\n    grid-template-columns: 1fr;\n    --event-feedback-organizer-overview-height: auto;\n  }\n  .event-feedback-organizer-info-card-shell,\n  .event-feedback-organizer-carousel-panel {\n    height: auto;\n  }\n  .event-feedback-organizer-carousel {\n    height: auto;\n  }\n  .event-feedback-organizer-carousel-card {\n    min-height: 0;\n  }\n  .event-feedback-organizer-info-card-shell {\n    max-width: none;\n  }\n  .event-feedback-organizer-carousel-pill-strip {\n    gap: 0.26rem;\n  }\n  .event-feedback-organizer-carousel-pill {\n    min-height: 34px;\n    padding: 0.2rem 0.3rem;\n  }\n  .event-feedback-organizer-carousel-pill-label {\n    font-size: 0.68rem;\n  }\n  .event-feedback-organizer-carousel-pill-badge {\n    min-width: 1.14rem;\n    min-height: 1rem;\n    font-size: 0.55rem;\n  }\n  .event-feedback-organizer-message-card {\n    padding: 0.64rem 0.68rem;\n  }\n}\n/*# sourceMappingURL=event-feedback-popup.component.css.map */\n'] }]
  }], () => [], { eventFeedbackItemTemplate: [{
    type: ViewChild,
    args: ["eventFeedbackItemTemplate", { read: TemplateRef }]
  }], eventFeedbackSmartList: [{
    type: ViewChild,
    args: ["eventFeedbackSmartList"]
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(EventFeedbackPopupComponent, { className: "EventFeedbackPopupComponent", filePath: "app/activity/components/event-feedback-popup/event-feedback-popup.component.ts", lineNumber: 108 });
})();
export {
  EventFeedbackPopupComponent
};
//# sourceMappingURL=event-feedback-popup.component-KPS35PDK.js.map
