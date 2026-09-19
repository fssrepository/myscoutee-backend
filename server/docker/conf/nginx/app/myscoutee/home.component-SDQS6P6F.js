import {
  cloneGameFilter,
  createInitialGameFilter,
  getGameUserFacet,
  getGameUserInterests,
  getGameUserValues,
  isGameFilterActive,
  normalizeGameFilter,
  parseGameHeightCm
} from "./chunk-NJMZZHNL.js";
import {
  HomeHeaderComponent
} from "./chunk-6EWA7OZ4.js";
import {
  ProfileStore
} from "./chunk-O6ZAHHD6.js";
import "./chunk-22I4RYEC.js";
import "./chunk-2XAMZBDM.js";
import {
  SmartListComponent
} from "./chunk-QPGRMBRW.js";
import {
  ActivitiesPopupStore
} from "./chunk-5GUOJYST.js";
import {
  PairCardComponent,
  SingleCardComponent
} from "./chunk-KO4GQHHA.js";
import "./chunk-IPHHDSOR.js";
import "./chunk-EA3MO7BB.js";
import "./chunk-5VDIJXBA.js";
import "./chunk-Z7T4C7EV.js";
import {
  ExplanationGuideService
} from "./chunk-JNYVIKB6.js";
import "./chunk-522CXB3E.js";
import "./chunk-HWWKH4YJ.js";
import "./chunk-LFVP4M73.js";
import "./chunk-ADBOYRJ7.js";
import "./chunk-53UGBDSO.js";
import {
  backendUnavailable
} from "./chunk-67ETDNJE.js";
import {
  DeploymentConfigurationService
} from "./chunk-MOUXN75Y.js";
import {
  I18nPipe,
  MatIcon,
  MatIconModule
} from "./chunk-L6HJFJOR.js";
import "./chunk-LFBAVSTX.js";
import {
  AppRuntimeStore,
  GameService,
  USER_BY_ID_LOAD_CONTEXT_KEY,
  UsersService
} from "./chunk-RP5GBSNO.js";
import "./chunk-HGLCBXAR.js";
import "./chunk-OY7NWTMT.js";
import {
  APP_STATIC_DATA
} from "./chunk-EWHSEKAB.js";
import "./chunk-LM6UNLJK.js";
import "./chunk-NOXIMZYO.js";
import "./chunk-UR2UG3BQ.js";
import "./chunk-7B4ZHEVS.js";
import "./chunk-6SKBB3AJ.js";
import "./chunk-YXATI2WQ.js";
import "./chunk-QXOIA7DH.js";
import "./chunk-EVFFULVM.js";
import "./chunk-7WMBE6WE.js";
import {
  ActivityStore,
  UserProfileStore
} from "./chunk-IEWB22H3.js";
import "./chunk-UKS3QROH.js";
import "./chunk-C6JV7CA3.js";
import "./chunk-N7OBXPJA.js";
import "./chunk-AOUY6FNC.js";
import {
  CommonModule,
  NgClass
} from "./chunk-SCHUURLR.js";
import "./chunk-CYVMX3LD.js";
import "./chunk-HDBJPOT3.js";
import "./chunk-LDZENZ35.js";
import "./chunk-DZ6OOOZN.js";
import "./chunk-ODJSNRFC.js";
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostListener,
  ViewChild,
  __spreadProps,
  __spreadValues,
  effect,
  from,
  inject,
  setClassMetadata,
  setClassMetadataAsync,
  signal,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefer,
  ɵɵdeferOnImmediate,
  ɵɵdefineComponent,
  ɵɵdirectiveInject,
  ɵɵdomTemplate,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵloadQuery,
  ɵɵnextContext,
  ɵɵpipe,
  ɵɵpipeBind1,
  ɵɵpipeBind2,
  ɵɵproperty,
  ɵɵpureFunction1,
  ɵɵqueryRefresh,
  ɵɵreference,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIdentity,
  ɵɵresetView,
  ɵɵresolveWindow,
  ɵɵrestoreView,
  ɵɵtemplate,
  ɵɵtemplateRefExtractor,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵviewQuery
} from "./chunk-EV3I3YNV.js";

// src/app/home/components/home/home.component.ts
var _c0 = ["homeSmartList"];
var HomeComponent_Conditional_2_Defer_1_DepsFn = () => [import("./home-game-filter-popup.component-3J6DC6NL.js").then((m) => m.HomeGameFilterPopupComponent)];
var _c1 = (a0) => ({ presentation: "fullscreen", state: a0 });
function HomeComponent_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "div", 2);
  }
}
function HomeComponent_Conditional_1_Conditional_2_For_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "option", 13);
  }
  if (rf & 2) {
    const suggestion_r4 = ctx.$implicit;
    \u0275\u0275property("value", suggestion_r4);
  }
}
function HomeComponent_Conditional_1_Conditional_2_For_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "option", 13);
  }
  if (rf & 2) {
    const suggestion_r5 = ctx.$implicit;
    \u0275\u0275property("value", suggestion_r5);
  }
}
function HomeComponent_Conditional_1_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "section", 5)(1, "label", 10)(2, "input", 11);
    \u0275\u0275listener("input", function HomeComponent_Conditional_1_Conditional_2_Template_input_input_2_listener($event) {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.onLeftSocialQueryChanged(($event.target.value ?? "").toString()));
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(3, "label", 10)(4, "input", 11);
    \u0275\u0275listener("input", function HomeComponent_Conditional_1_Conditional_2_Template_input_input_4_listener($event) {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.onRightSocialQueryChanged(($event.target.value ?? "").toString()));
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(5, "datalist", 12);
    \u0275\u0275repeaterCreate(6, HomeComponent_Conditional_1_Conditional_2_For_7_Template, 1, 1, "option", 13, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "datalist", 14);
    \u0275\u0275repeaterCreate(9, HomeComponent_Conditional_1_Conditional_2_For_10_Template, 1, 1, "option", 13, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275property("value", ctx_r1.leftSocialQuery)("placeholder", ctx_r1.isFriendsInCommonMode ? "Search person or event" : "Search friend or event")("disabled", !ctx_r1.memberActionsAvailable);
    \u0275\u0275attribute("list", "home-social-left-suggestions")("aria-label", ctx_r1.isFriendsInCommonMode ? "Person" : "Friend A");
    \u0275\u0275advance(2);
    \u0275\u0275property("value", ctx_r1.rightSocialQuery)("placeholder", ctx_r1.isFriendsInCommonMode ? "Search common friend" : "Search friend or event")("disabled", !ctx_r1.memberActionsAvailable);
    \u0275\u0275attribute("list", "home-social-right-suggestions")("aria-label", ctx_r1.isFriendsInCommonMode ? "Common friend" : "Friend B");
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r1.socialQuerySuggestions("left"));
    \u0275\u0275advance(3);
    \u0275\u0275repeater(ctx_r1.socialQuerySuggestions("right"));
  }
}
function HomeComponent_Conditional_1_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "div", 7);
  }
}
function HomeComponent_Conditional_1_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 8)(1, "mat-icon");
    \u0275\u0275text(2, "block");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "h2");
    \u0275\u0275text(4);
    \u0275\u0275pipe(5, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "p");
    \u0275\u0275text(7);
    \u0275\u0275pipe(8, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "p");
    \u0275\u0275text(10);
    \u0275\u0275pipe(11, "i18n");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(5, 3, "your.account.is.blocked", "Your account is blocked"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(8, 6, "your.profile.is.still.visible.to.you.but.rating.matching.profile.editing.assets.events.and.invitations.are.paused", "Your profile is still visible to you, but rating, matching, profile editing, assets, events, and invitations are paused."));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(11, 9, "open.chats.from.the.menu.to.contact.myscoutee.support.they.can.review.the.block.and.tell.you.what.information.is.needed", "Open Chats from the menu to contact MyScoutee support. They can review the block and tell you what information is needed."));
  }
}
function HomeComponent_Conditional_1_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 9)(1, "mat-icon");
    \u0275\u0275text(2, "visibility_off");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "h2");
    \u0275\u0275text(4);
    \u0275\u0275pipe(5, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "p");
    \u0275\u0275text(7);
    \u0275\u0275pipe(8, "i18n");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(5, 2, ctx_r1.gameVisibilityPausedTitle));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(8, 4, ctx_r1.gameVisibilityPausedDescription));
  }
}
function HomeComponent_Conditional_1_Conditional_7_ng_template_1_Conditional_0_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "app-pair-card", 17);
    \u0275\u0275listener("detailClick", function HomeComponent_Conditional_1_Conditional_7_ng_template_1_Conditional_0_Conditional_0_Template_app_pair_card_detailClick_0_listener($event) {
      \u0275\u0275restoreView(_r6);
      const ctx_r1 = \u0275\u0275nextContext(5);
      return \u0275\u0275resetView(ctx_r1.openProfileView($event));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r6 = \u0275\u0275nextContext(2);
    const row_r8 = ctx_r6.$implicit;
    const renderState_r9 = ctx_r6.renderState;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275property("card", ctx_r1.homePairCard(row_r8, \u0275\u0275pureFunction1(1, _c1, renderState_r9)));
  }
}
function HomeComponent_Conditional_1_Conditional_7_ng_template_1_Conditional_0_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r10 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "app-single-card", 17);
    \u0275\u0275listener("detailClick", function HomeComponent_Conditional_1_Conditional_7_ng_template_1_Conditional_0_Conditional_1_Template_app_single_card_detailClick_0_listener($event) {
      \u0275\u0275restoreView(_r10);
      const ctx_r1 = \u0275\u0275nextContext(5);
      return \u0275\u0275resetView(ctx_r1.openProfileView($event));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r6 = \u0275\u0275nextContext(2);
    const row_r8 = ctx_r6.$implicit;
    const renderState_r9 = ctx_r6.renderState;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275property("card", ctx_r1.homeSingleCard(row_r8, \u0275\u0275pureFunction1(1, _c1, renderState_r9)));
  }
}
function HomeComponent_Conditional_1_Conditional_7_ng_template_1_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, HomeComponent_Conditional_1_Conditional_7_ng_template_1_Conditional_0_Conditional_0_Template, 1, 3, "app-pair-card", 16)(1, HomeComponent_Conditional_1_Conditional_7_ng_template_1_Conditional_0_Conditional_1_Template, 1, 3, "app-single-card", 16);
  }
  if (rf & 2) {
    const row_r8 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275conditional(row_r8.mode === "pair" ? 0 : 1);
  }
}
function HomeComponent_Conditional_1_Conditional_7_ng_template_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, HomeComponent_Conditional_1_Conditional_7_ng_template_1_Conditional_0_Template, 2, 1);
  }
  if (rf & 2) {
    const row_r8 = ctx.$implicit;
    \u0275\u0275conditional(row_r8 ? 0 : -1);
  }
}
function HomeComponent_Conditional_1_Conditional_7_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r11 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "app-smart-list", 18, 1);
    \u0275\u0275listener("stateChange", function HomeComponent_Conditional_1_Conditional_7_Conditional_3_Template_app_smart_list_stateChange_0_listener($event) {
      \u0275\u0275restoreView(_r11);
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.onHomeSmartListStateChange($event));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275nextContext();
    const homeFullscreenItemTemplate_r12 = \u0275\u0275reference(2);
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("config", ctx_r1.homeSmartListConfig)("loadPage", ctx_r1.homeSmartListLoadPage)("fullscreenItemTemplate", homeFullscreenItemTemplate_r12)("query", ctx_r1.homeSmartListQuery);
  }
}
function HomeComponent_Conditional_1_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 7);
    \u0275\u0275template(1, HomeComponent_Conditional_1_Conditional_7_ng_template_1_Template, 1, 1, "ng-template", null, 0, \u0275\u0275templateRefExtractor);
    \u0275\u0275conditionalCreate(3, HomeComponent_Conditional_1_Conditional_7_Conditional_3_Template, 2, 4, "app-smart-list", 15);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(3);
    \u0275\u0275conditional(ctx_r1.homeSmartListQueryReady ? 3 : -1);
  }
}
function HomeComponent_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 3)(1, "app-home-header", 4);
    \u0275\u0275listener("itemSelect", function HomeComponent_Conditional_1_Template_app_home_header_itemSelect_1_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onHomeHeaderMenuSelect($event));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(2, HomeComponent_Conditional_1_Conditional_2_Template, 11, 10, "section", 5);
    \u0275\u0275elementStart(3, "section", 6);
    \u0275\u0275conditionalCreate(4, HomeComponent_Conditional_1_Conditional_4_Template, 1, 0, "div", 7)(5, HomeComponent_Conditional_1_Conditional_5_Template, 12, 12, "div", 8)(6, HomeComponent_Conditional_1_Conditional_6_Template, 9, 6, "div", 9)(7, HomeComponent_Conditional_1_Conditional_7_Template, 4, 1, "div", 7);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("ngClass", ctx_r1.gamePageStatusClass());
    \u0275\u0275advance();
    \u0275\u0275property("branding", ctx_r1.deploymentBranding())("items", ctx_r1.homeHeaderMenuItems())("showControls", !ctx_r1.isAvatarProfileSettled || ctx_r1.homeHeaderControlsReady);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.showSocialQueryInputs() ? 2 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r1.isBlockedUserStatusPending ? 4 : ctx_r1.isBlockedUser ? 5 : ctx_r1.isGameVisibilityPaused ? 6 : 7);
  }
}
function HomeComponent_Conditional_2_Defer_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r13 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "app-home-game-filter-popup", 19);
    \u0275\u0275listener("closed", function HomeComponent_Conditional_2_Defer_0_Template_app_home_game_filter_popup_closed_0_listener($event) {
      \u0275\u0275restoreView(_r13);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.onGameFilterPopupClosed($event));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("context", ctx_r1.gameFilterPopupContext)("saving", ctx_r1.isGameFilterSaving);
  }
}
function HomeComponent_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domTemplate(0, HomeComponent_Conditional_2_Defer_0_Template, 1, 2);
    \u0275\u0275defer(1, 0, HomeComponent_Conditional_2_Defer_1_DepsFn);
    \u0275\u0275deferOnImmediate();
  }
}
var PROFILE_DETAIL_LABEL_KEYS = {
  name: "profile.name",
  city: "profile.city",
  birthday: "profile.birthday",
  height: "profile.height",
  physique: "profile.physique",
  languages: "profile.languages",
  horoscope: "profile.horoscope",
  gender: "profile.gender",
  interest: "profile.details.interest",
  drinking: "profile.details.drinking",
  smoking: "profile.details.smoking",
  workout: "profile.details.workout",
  pets: "profile.details.pets",
  "family plans": "profile.details.familyPlans",
  children: "profile.details.children",
  "love style": "profile.details.loveStyle",
  "communication style": "profile.details.communicationStyle",
  "sexual orientation": "profile.details.sexualOrientation",
  religion: "profile.details.religion",
  values: "profile.details.values"
};
var PUBLIC_PROFILE_DETAIL_KEYS = new Set(APP_STATIC_DATA.profileDetailGroupTemplates.flatMap((group) => group.rows.filter((row) => row.privacy === "Public").map((row) => row.labelKey.trim().toLowerCase())));
var HomeComponent = class _HomeComponent {
  cdr;
  activitiesStore;
  profileStore;
  explanationGuide;
  gameService;
  usersService;
  deploymentBranding = inject(DeploymentConfigurationService).branding;
  userProfileStore = inject(UserProfileStore);
  runtimeStore = inject(AppRuntimeStore);
  activityStore = inject(ActivityStore);
  static MOBILE_VIEWPORT_MAX_WIDTH_PX = 760;
  static PAIR_MODE_SPLIT_DEFAULT_PERCENT = 50;
  static PAIR_MODE_SPLIT_MIN_PERCENT = 0;
  static PAIR_MODE_SPLIT_MAX_PERCENT = 100;
  static GAME_STACK_PRELOAD_THRESHOLD = 2;
  static GAME_STACK_PAGE_SIZE_SINGLE = 10;
  static GAME_STACK_PAGE_SIZE_PAIR = 10;
  static GAME_STACK_PHOTO_PRELOAD_TARGET = 12;
  static GAME_RATING_CONFIRMATION_MS = 120;
  gameFilterInterestGroups = APP_STATIC_DATA.homeGameFilterInterestGroups;
  gameFilterValuesGroups = APP_STATIC_DATA.homeGameFilterValuesGroups;
  userFacetById = APP_STATIC_DATA.homeUserFacetById;
  homeModeOptions = [
    { key: "single", label: "Preferences", icon: "person" },
    { key: "friends-in-common", label: "Friends in Common", icon: "diversity_3" },
    { key: "separated-friends", label: "Inside Network", icon: "group_add" },
    { key: "outside-network", label: "Outside Network", icon: "groups" }
  ];
  users = [];
  selectedRating = 0;
  selectedHomeMode = "single";
  leftSocialQuery = "";
  rightSocialQuery = "";
  cardIndex = 0;
  isRatingBarBlinking = false;
  isCandidateImageLoading = false;
  isCandidateImageIndicatorRevealing = false;
  leavingGameCard = null;
  leavingPairModeWomanCard = null;
  leavingPairModeManCard = null;
  selectedCandidateImageIndex = 0;
  pairModeWomanImageIndex = 0;
  pairModeManImageIndex = 0;
  pairModeSplitPercent = _HomeComponent.PAIR_MODE_SPLIT_DEFAULT_PERCENT;
  isPairModeSplitDragging = false;
  isPairModeWomanImageLoading = false;
  isPairModeManImageLoading = false;
  isPairModeWomanImageIndicatorRevealing = false;
  isPairModeManImageIndicatorRevealing = false;
  gameStackCardsLoaded = 0;
  gameInitialCardsLoadPending = false;
  candidateImageZoom = 1;
  candidateImagePanX = 0;
  candidateImagePanY = 0;
  localPopup = null;
  activeUserId = "";
  gameFilter;
  gameFilterPopupContext = null;
  isGameFilterSaving = false;
  failedCandidateImageUrls = /* @__PURE__ */ new Set();
  preloadedGameImageUrls = /* @__PURE__ */ new Set();
  pendingGameImageUrls = /* @__PURE__ */ new Set();
  ratingBarBlinkTimeout = null;
  ratingAdvanceTimer = null;
  candidateImageIndicatorRevealTimer = null;
  candidateImageLoadingPulseTimer = null;
  pairModeWomanImageIndicatorRevealTimer = null;
  pairModeManImageIndicatorRevealTimer = null;
  pairModeWomanImageLoadingPulseTimer = null;
  pairModeManImageLoadingPulseTimer = null;
  gameCardLeaveTimer = null;
  gameStackPaginationKey = "";
  gameStackPaginating = false;
  gameStackExhausted = false;
  homeSmartListQueryKey = "";
  homeSmartListRefreshRevision = 0;
  unregisterExplanationContext = null;
  inFlightServiceCardStackReloadKey = null;
  queuedServiceCardStackReloadKey = null;
  initialServiceCardStackLoadPromise = null;
  isCandidateImageDragging = false;
  candidateDragOffsetX = 0;
  candidateDragOffsetY = 0;
  activeTouchId = null;
  pairModeSplitPointerId = null;
  pairModeSplitBounds = null;
  awaitingUserBootstrapRef = signal(false, ...ngDevMode ? [{ debugName: "awaitingUserBootstrapRef" }] : (
    /* istanbul ignore next */
    []
  ));
  awaitingUserByIdLoadingSeen = false;
  lastHandledActiveUserId = "";
  lastHandledProfileSavedRevision = 0;
  homeSmartList;
  homeSmartListQueryReady = false;
  homeSmartListQuery = {};
  homeSmartListConfig = {
    pageSize: _HomeComponent.GAME_STACK_PAGE_SIZE_SINGLE,
    mobilePageSizeCap: null,
    presentation: "fullscreen",
    showBackgroundLoadingProgress: true,
    headerProgress: {
      enabled: true,
      state: () => this.runtimeStore.isDataSourceAvailable() ? "active" : "inactive"
    },
    trackBy: (_index, row) => row.id,
    emptyLabel: () => this.noCandidateTitle,
    emptyDescription: () => this.noCandidateDescription,
    pagination: {
      mode: "rating-stars",
      ratingBarConfig: (row) => row ? this.gameRatingBarConfig : null,
      ratingBarValue: () => this.selectedRating,
      onRatingSelect: (row, score) => this.onHomeSmartListRatingSelect(row, score)
    }
  };
  homeSmartListLoadPage = (query) => from(this.loadHomeSmartListPage(query));
  get isPairMode() {
    return this.isOutsideNetworkMode || this.isSeparatedFriendsMode;
  }
  get isOutsideNetworkMode() {
    return this.selectedHomeMode === "outside-network";
  }
  get isSeparatedFriendsMode() {
    return this.selectedHomeMode === "separated-friends";
  }
  get isFriendsInCommonMode() {
    return this.selectedHomeMode === "friends-in-common";
  }
  constructor(cdr, activitiesStore, profileStore, explanationGuide, gameService, usersService) {
    this.cdr = cdr;
    this.activitiesStore = activitiesStore;
    this.profileStore = profileStore;
    this.explanationGuide = explanationGuide;
    this.gameService = gameService;
    this.usersService = usersService;
    this.users = this.gameService.getGameCardsUsersSnapshot();
    this.unregisterExplanationContext = this.explanationGuide.registerContext("home.game");
    this.activeUserId = this.getActiveUserId();
    const initialFilter = createInitialGameFilter(this.activeUser);
    this.gameFilter = cloneGameFilter(initialFilter);
    if (this.activeUserId) {
      this.lastHandledActiveUserId = this.activeUserId;
      this.handleActiveUserChanged(this.activeUserId);
    } else {
      this.syncHomeSmartListQuery();
      this.homeSmartListQueryReady = true;
    }
    const activeUserIdSignal = this.userProfileStore.activeUserId;
    const profileSavedSignal = this.userProfileStore.profileSaved;
    this.lastHandledProfileSavedRevision = profileSavedSignal()?.revision ?? 0;
    const userByIdLoadState = this.runtimeStore.selectLoadingState(USER_BY_ID_LOAD_CONTEXT_KEY);
    effect(() => {
      const targetUserId = activeUserIdSignal().trim();
      if (!targetUserId || targetUserId === this.lastHandledActiveUserId) {
        return;
      }
      this.lastHandledActiveUserId = targetUserId;
      this.handleActiveUserChanged(targetUserId);
    });
    effect(() => {
      const profileSaved = profileSavedSignal();
      if (!profileSaved || profileSaved.revision === this.lastHandledProfileSavedRevision) {
        return;
      }
      this.lastHandledProfileSavedRevision = profileSaved.revision;
      this.reloadHomeSmartListAfterProfileSave();
    });
    effect(() => {
      if (!this.awaitingUserBootstrapRef()) {
        return;
      }
      const status = userByIdLoadState().status;
      const activeProfile = this.userProfileStore.activeUserProfile();
      const alreadyLoaded = activeProfile?.id === this.activeUserId;
      if (status === "loading") {
        this.awaitingUserByIdLoadingSeen = true;
        return;
      }
      const terminalStatus = status === "success" || status === "error" || status === "timeout";
      if (status === "idle" && !alreadyLoaded) {
        return;
      }
      if (!this.awaitingUserByIdLoadingSeen && !alreadyLoaded && !terminalStatus) {
        return;
      }
      if (activeProfile) {
        this.upsertHomeUser(activeProfile);
      }
      const previousReloadKey = this.serviceCardStackReloadKey();
      this.awaitingUserBootstrapRef.set(false);
      this.awaitingUserByIdLoadingSeen = false;
      this.applyFilterPreferencesFromUserProfileStore();
      if (this.gameInitialCardsLoadPending) {
        if (previousReloadKey !== this.serviceCardStackReloadKey()) {
          this.resetServiceCardState();
          this.resetGameStackPaginationState(false);
        }
        this.syncHomeSmartListQuery();
        this.homeSmartListQueryReady = true;
      }
      this.cdr.markForCheck();
    });
  }
  ngOnDestroy() {
    this.stopPairModeSplitDrag();
    if (this.ratingBarBlinkTimeout) {
      clearTimeout(this.ratingBarBlinkTimeout);
      this.ratingBarBlinkTimeout = null;
    }
    this.clearPendingRatingAdvanceTimer();
    if (this.candidateImageIndicatorRevealTimer) {
      clearTimeout(this.candidateImageIndicatorRevealTimer);
      this.candidateImageIndicatorRevealTimer = null;
    }
    this.clearCandidateImageLoadingPulseTimer();
    this.clearPairModeCandidateImageIndicatorRevealTimer("woman");
    this.clearPairModeCandidateImageIndicatorRevealTimer("man");
    this.clearPairModeCandidateImageLoadingPulseTimer("woman");
    this.clearPairModeCandidateImageLoadingPulseTimer("man");
    if (this.gameCardLeaveTimer) {
      clearTimeout(this.gameCardLeaveTimer);
      this.gameCardLeaveTimer = null;
    }
    this.cancelGameStackPaginationLoad();
    this.unregisterExplanationContext?.();
    this.unregisterExplanationContext = null;
  }
  get activeUser() {
    const localUser = this.users.find((user) => user.id === this.activeUserId) ?? this.users[0] ?? null;
    const contextUser = this.userProfileStore.activeUserProfile();
    if (!localUser) {
      return contextUser ? this.toHomeUser(contextUser) : this.createFallbackActiveUser();
    }
    if (!contextUser || contextUser.id !== localUser.id) {
      return localUser;
    }
    return this.mergeActiveUserFromContext(localUser, contextUser);
  }
  get isAccountReactivationPending() {
    return this.profileStore.deletedAccountReactivationPending();
  }
  get homeHeaderControlsReady() {
    return !this.isAccountReactivationPending && this.isAvatarProfileSettled && !this.isBlockedUser && !this.isGameVisibilityPaused && this.homeSmartListQueryReady;
  }
  get canOpenHistory() {
    return this.isAvatarProfileSettled;
  }
  get isAvatarProfileSettled() {
    return this.runtimeStore.getLoadingState(USER_BY_ID_LOAD_CONTEXT_KEY).status === "success";
  }
  get isBlockedUserStatusPending() {
    return this.activeUser.profileStatus === "blocked" && !this.isAvatarProfileSettled;
  }
  get isBlockedUser() {
    return this.avatarLoadedUser?.profileStatus === "blocked" && this.isAvatarProfileSettled;
  }
  get isDataSourceAvailable() {
    return this.runtimeStore.isDataSourceAvailable();
  }
  get memberActionsAvailable() {
    return this.isDataSourceAvailable && !this.userProfileStore.activeUserLocationMissing();
  }
  get isGameVisibilityPaused() {
    if (!this.isAvatarProfileSettled || this.isBlockedUser) {
      return false;
    }
    const status = this.resolvedActiveProfileStatus();
    return status === "friends only" || status === "host only" || status === "inactive" || status === "deleted";
  }
  get gameVisibilityPausedTitle() {
    if (this.resolvedActiveProfileStatus() === "inactive") {
      return "your.profile.is.inactive";
    }
    return "game.discovery.is.paused";
  }
  get gameVisibilityPausedDescription() {
    if (this.resolvedActiveProfileStatus() === "inactive") {
      return "set.your.profile.back.to.public.if.you.want.to.rate.profiles.and.appear.in.game.suggestions";
    }
    return "change.your.profile.visibility.to.public.if.you.want.to.rate.profiles.and.appear.in.game.suggestions";
  }
  get avatarLoadedUser() {
    const user = this.userProfileStore.activeUserProfile();
    return user?.id === this.activeUserId ? user : null;
  }
  resolvedActiveProfileStatus() {
    return this.avatarLoadedUser?.profileStatus ?? this.activeUser.profileStatus ?? "public";
  }
  get historyBadgeCount() {
    if (!this.canOpenHistory) {
      return 0;
    }
    return this.activityStore.resolveUserCounter(this.activeUser.id, "game", this.activeUser.activities.game);
  }
  gamePageStatusClass() {
    if (!this.isDataSourceAvailable) {
      return "game-page-status-offline";
    }
    const profileStatus = this.isBlockedUserStatusPending ? "public" : this.avatarLoadedUser?.profileStatus ?? this.activeUser.profileStatus;
    switch (profileStatus) {
      case "friends only":
        return "game-page-status-friends";
      case "host only":
        return "game-page-status-host";
      case "inactive":
        return "game-page-status-inactive";
      case "blocked":
        return "game-page-status-blocked";
      case "public":
      default:
        return "game-page-status-public";
    }
  }
  get candidatePool() {
    const serviceStack = this.gameService.peekUserGameCardsStackSnapshot(this.activeUserId);
    const hasResolvedServiceStack = serviceStack.cardUserIds.length > 0 || serviceStack.socialCards.length > 0 || serviceStack.nextCursor !== null || serviceStack.filterCount !== null;
    if (this.isFriendsInCommonMode && hasResolvedServiceStack) {
      const usersById = new Map(this.users.map((user) => [user.id, user]));
      return this.visibleFriendsInCommonSocialCards(serviceStack.socialCards).map((card) => usersById.get(card.userId)).filter((user) => !!user);
    }
    if (!this.isPairMode && hasResolvedServiceStack) {
      const usersById = new Map(this.users.map((user) => [user.id, user]));
      return serviceStack.cardUserIds.map((id) => usersById.get(id)).filter((user) => !!user);
    }
    const excludedUserIds = new Set(this.gameService.queryExcludedGameCardUserIds(this.activeUserId, this.selectedHomeMode));
    const metUserIds = this.selectedHomeMode !== "single" ? null : new Set(this.gameService.queryMetUserIds(this.activeUserId));
    return this.users.filter((user) => user.id !== this.activeUserId).filter((user) => this.isGameCandidateVisibleForSelectedMode(user)).filter((user) => !excludedUserIds.has(user.id)).filter((user) => !metUserIds || !metUserIds.has(user.id)).filter((user) => this.matchesFilter(user));
  }
  get activeCandidate() {
    const pool = this.candidatePool;
    if (pool.length === 0 || this.cardIndex < 0) {
      return null;
    }
    const visibleCount = Math.min(this.gameStackCardsLoaded, pool.length);
    if (this.cardIndex >= visibleCount) {
      return null;
    }
    return pool[this.cardIndex] ?? null;
  }
  get pairModeWomanCandidate() {
    return this.pairModeCandidateForGender("woman");
  }
  get pairModeManCandidate() {
    return this.pairModeCandidateForGender("man");
  }
  get hasPairModeCandidates() {
    return this.pairModeWomanCandidate !== null && this.pairModeManCandidate !== null;
  }
  get pairModeSplitCssValue() {
    if (!this.isCompactViewport()) {
      return `${_HomeComponent.PAIR_MODE_SPLIT_DEFAULT_PERCENT}%`;
    }
    return `${this.pairModeSplitPercent}%`;
  }
  get isPairModeWomanCollapsed() {
    return this.isCompactViewport() && this.pairModeSplitPercent <= 0.1;
  }
  get isPairModeManCollapsed() {
    return this.isCompactViewport() && this.pairModeSplitPercent >= 99.9;
  }
  get hasCandidatesForCurrentMode() {
    return this.isPairMode ? this.hasPairModeCandidates : this.activeCandidate !== null;
  }
  get hasFilteredCandidates() {
    if (this.isFriendsInCommonMode) {
      return this.socialFriendsInCommonSingleRows().length > 0;
    }
    if (this.isPairMode) {
      return this.socialPairRows().length > 0;
    }
    return this.candidatePool.length > 0;
  }
  get filterBadgeCount() {
    const overrideTotal = this.gameService.peekUserGameCardsStackSnapshot(this.activeUser.id).filterCount;
    if (this.gameInitialCardsLoadPending) {
      if (overrideTotal === null) {
        return 0;
      }
      return Math.max(0, overrideTotal);
    }
    const fallback = Math.max(0, this.totalRoundsForCurrentMode() - this.cardIndex);
    if (overrideTotal === null) {
      return fallback;
    }
    return Math.max(0, overrideTotal);
  }
  get hasRemainingCandidatesForCurrentMode() {
    return this.filterBadgeCount > 0;
  }
  get isAwaitingMoreGameCards() {
    return this.gameStackPaginating;
  }
  get noCandidateTitle() {
    if (!this.usersService.localModeEnabled && (!this.runtimeStore.isOnline() || backendUnavailable()))
      return "No network";
    if (this.gameInitialCardsLoadPending || this.isAwaitingMoreGameCards) {
      return "Loading more cards";
    }
    if (this.hasFilteredCandidates && !this.hasRemainingCandidatesForCurrentMode) {
      return "No more profiles";
    }
    if (this.hasFilteredCandidates) {
      return "No cards available";
    }
    return "No matching profiles";
  }
  get noCandidateDescription() {
    if (!this.usersService.localModeEnabled && (!this.runtimeStore.isOnline() || backendUnavailable())) {
      return "Saved tickets remain available. Profiles need a connection.";
    }
    if (this.gameInitialCardsLoadPending || this.isAwaitingMoreGameCards) {
      return "Preloading the next stack in the background.";
    }
    if (this.hasFilteredCandidates && !this.hasRemainingCandidatesForCurrentMode) {
      return "You have reached the end of this stack.";
    }
    if (this.hasFilteredCandidates) {
      return "Change filters to get more cards.";
    }
    return "Adjust age or profile traits in filter settings.";
  }
  get ratingScale() {
    return Array.from({ length: 10 }, (_, index) => index + 1);
  }
  get gameRatingBarConfig() {
    return {
      scale: this.ratingScale,
      label: "Affinity",
      actionLabel: "Go",
      presentation: "fullscreen",
      blinkOnSelect: false,
      readonly: !this.memberActionsAvailable || this.isBlockedUser,
      animation: this.isRatingBarBlinking ? "blink" : "default"
    };
  }
  get isFilterActive() {
    return isGameFilterActive(this.gameFilter, this.activeUser);
  }
  selectedHomeModeLabel() {
    return this.homeModeOptions.find((option) => option.key === this.selectedHomeMode)?.label ?? "Preferences";
  }
  selectedHomeModeIcon() {
    return this.homeModeOptions.find((option) => option.key === this.selectedHomeMode)?.icon ?? "person";
  }
  homeHeaderMenuItems() {
    return [
      {
        id: "home-mode",
        label: this.selectedHomeModeLabel(),
        icon: this.selectedHomeModeIcon(),
        kind: "select-trigger",
        layout: "pill",
        palette: this.homeModePalette(this.selectedHomeMode),
        disabled: !this.homeHeaderControlsReady || !this.memberActionsAvailable || this.isBlockedUser,
        ariaLabel: "Select game mode",
        items: this.homeModeOptions.map((option) => ({
          id: `home-mode:${option.key}`,
          label: option.label,
          icon: option.icon,
          kind: "radio",
          active: option.key === this.selectedHomeMode,
          checked: option.key === this.selectedHomeMode,
          palette: this.homeModePalette(option.key),
          surface: "tinted",
          context: { action: "mode", mode: option.key }
        }))
      },
      {
        id: "home-filter",
        icon: "filter_alt",
        kind: "action",
        palette: "filter",
        disabled: !this.homeHeaderControlsReady || !this.memberActionsAvailable || this.isBlockedUser,
        counter: this.filterBadgeCount > 0 ? { value: this.filterBadgeCount, max: 99 } : null,
        ariaLabel: "Open profile filters",
        context: { action: "filter" }
      },
      {
        id: "home-history",
        icon: "history",
        kind: "action",
        palette: "gold",
        disabled: !this.homeHeaderControlsReady || !this.memberActionsAvailable || !this.canOpenHistory || this.isBlockedUser,
        counter: this.historyBadgeCount > 0 ? { value: this.historyBadgeCount, max: 99 } : null,
        ariaLabel: "Open game history",
        context: { action: "history" }
      }
    ];
  }
  onHomeHeaderMenuSelect(event) {
    const context = event.context;
    if (!context) {
      return;
    }
    switch (context.action) {
      case "mode":
        this.selectHomeMode(context.mode);
        return;
      case "filter":
        this.openFilter();
        return;
      case "history":
        this.openHistory();
        return;
    }
  }
  homeModePalette(mode) {
    const map = {
      single: "blue",
      "outside-network": "violet",
      "separated-friends": "orange",
      "friends-in-common": "green"
    };
    return map[mode] ?? "blue";
  }
  showSocialQueryInputs() {
    return this.isSeparatedFriendsMode;
  }
  socialQuerySuggestions(side) {
    const values = /* @__PURE__ */ new Set();
    const socialCards = this.socialCardsForCurrentMode(this.gameService.peekUserGameCardsStackSnapshot(this.activeUserId).socialCards);
    for (const card of socialCards) {
      const primaryUser = this.userById(card.userId);
      const secondaryUser = this.userById(side === "left" ? card.userId : card.secondaryUserId ?? card.bridgeUserId ?? "");
      if (primaryUser?.name) {
        values.add(primaryUser.name);
      }
      if (secondaryUser?.name) {
        values.add(secondaryUser.name);
      }
      if (card.eventName?.trim()) {
        values.add(card.eventName.trim());
      }
    }
    return [...values].slice(0, 24);
  }
  homeSingleCard(row, options) {
    const candidate = row?.mode === "single" ? row.candidate : null;
    return {
      rowId: row?.id ?? "home-single-empty",
      slides: this.homeCandidateSlides(candidate, row?.mode === "single" ? row.socialCard : void 0),
      statusBadgeLabel: this.candidateActivityBadge(candidate),
      profileView: candidate ? {
        userId: candidate.id,
        label: candidate.name
      } : null,
      contextBadge: row?.mode === "single" ? this.homeSocialContextBadge(row.socialCard) : null,
      presentation: options?.presentation ?? "fullscreen",
      state: options?.state ?? "default"
    };
  }
  homePairCard(row, options) {
    const round = row?.mode === "pair" ? row.round : null;
    const presentation = options?.presentation ?? "fullscreen";
    return {
      rowId: row?.id ?? "home-pair-empty",
      stackClasses: ["activities-rate-profile-stack-pair"],
      slots: [
        this.homePairCardSlot("woman", this.homePairSlotLabel(round?.socialCard, "left"), round?.woman ?? null, round?.socialCard),
        this.homePairCardSlot("man", this.homePairSlotLabel(round?.socialCard, "right"), round?.man ?? null, round?.socialCard)
      ],
      presentation,
      state: options?.state ?? "default"
    };
  }
  onHomeSmartListStateChange(change) {
    const cursorChanged = change.cursorIndex !== this.cardIndex;
    this.cardIndex = change.cursorIndex;
    this.gameStackCardsLoaded = change.items.length;
    if (cursorChanged) {
      this.clearPendingRatingAdvanceTimer();
    }
    if (change.loading || change.initialLoading || this.gameInitialCardsLoadPending) {
      return;
    }
    this.maybeStartGameStackPaginationLoad();
  }
  openProfileView(profileView) {
    if (!this.memberActionsAvailable)
      return;
    this.profileStore.openProfileView(profileView);
  }
  setRating(value) {
    if (!this.memberActionsAvailable || this.isBlockedUser)
      return;
    this.stopPairModeSplitDrag();
    if (this.ratingAdvanceTimer) {
      return;
    }
    const currentCandidate = this.isPairMode ? this.hasPairModeCandidates ? this.pairModeWomanCandidate : null : this.activeCandidate;
    if (!currentCandidate) {
      this.maybeStartGameStackPaginationLoad();
      return;
    }
    if (this.isPairMode) {
      const woman = this.pairModeWomanCandidate;
      const man = this.pairModeManCandidate;
      if (!woman || !man) {
        this.maybeStartGameStackPaginationLoad();
        return;
      }
      this.gameService.recordUserGameCardPairRating(this.activeUserId, woman.id, man.id, value, this.isSeparatedFriendsMode ? "separated-friends" : void 0);
    } else {
      const activeSocialCard = this.isFriendsInCommonMode ? this.visibleFriendsInCommonSocialCards(this.gameService.peekUserGameCardsStackSnapshot(this.activeUserId).socialCards).find((card) => card.userId.trim() === currentCandidate.id) : void 0;
      this.gameService.recordUserGameCardRating(this.activeUserId, currentCandidate.id, value, "single", activeSocialCard?.socialContext === "friends-in-common" ? "friends-in-common" : void 0, activeSocialCard?.bridgeUserId, activeSocialCard?.bridgeCount);
    }
    this.selectedRating = value;
    this.triggerRatingBarBlink();
    this.ratingAdvanceTimer = setTimeout(() => {
      this.ratingAdvanceTimer = null;
      const hasUpcomingRound = this.cardIndex + 1 < this.totalRoundsForCurrentMode();
      if (hasUpcomingRound) {
        if (this.isPairMode) {
          this.startPairModeCardLeaveAnimation(value);
        } else {
          this.startGameCardLeaveAnimation(currentCandidate, value);
        }
      }
      this.cardIndex += 1;
      this.selectedRating = 0;
      this.maybeStartGameStackPaginationLoad();
      this.preloadGameImageWindow();
      this.resetCandidateImageState();
      this.beginCandidateImageLoadingForCurrentSelection(true);
      this.cdr.markForCheck();
    }, _HomeComponent.GAME_RATING_CONFIRMATION_MS);
  }
  selectHomeMode(mode) {
    if (!this.memberActionsAvailable || this.isBlockedUser) {
      return;
    }
    const normalizedMode = this.normalizeHomeMode(mode);
    if (this.selectedHomeMode === normalizedMode) {
      return;
    }
    this.stopPairModeSplitDrag();
    this.selectedHomeMode = normalizedMode;
    this.userProfileStore.clearUserFilterCountOverride(this.activeUserId);
    this.resetServiceCardState();
    this.cardIndex = 0;
    this.leftSocialQuery = "";
    this.rightSocialQuery = "";
    this.resetCandidateImageState();
    this.resetGameStackPaginationState(false);
    this.syncHomeSmartListQuery();
    this.gameInitialCardsLoadPending = true;
    if (this.homeSmartList) {
      this.homeSmartList.reload();
      return;
    }
    void this.reloadServiceCardStack();
  }
  onLeftSocialQueryChanged(value) {
    this.leftSocialQuery = value.trimStart();
    this.reloadSocialModeCards();
  }
  onRightSocialQueryChanged(value) {
    this.rightSocialQuery = value.trimStart();
    this.reloadSocialModeCards();
  }
  openHistory() {
    if (!this.memberActionsAvailable || !this.canOpenHistory || this.isBlockedUser) {
      return;
    }
    const initialRateFilter = this.isPairMode ? "pair-given" : "individual-given";
    this.activitiesStore.openActivities("rates", void 0, initialRateFilter, this.isSeparatedFriendsMode || this.isFriendsInCommonMode);
  }
  closeLocalPopup() {
    this.localPopup = null;
    this.gameFilterPopupContext = null;
  }
  openFilter() {
    if (!this.memberActionsAvailable || this.isBlockedUser) {
      return;
    }
    this.gameFilterPopupContext = this.createGameFilterPopupContext();
    this.localPopup = "filter";
  }
  async onGameFilterPopupClosed(filter) {
    if (!filter) {
      if (this.isGameFilterSaving) {
        return;
      }
      this.gameFilterPopupContext = null;
      this.localPopup = null;
      return;
    }
    this.gameFilter = normalizeGameFilter(filter);
    this.isGameFilterSaving = true;
    this.cdr.markForCheck();
    try {
      await this.usersService.saveUserFilterPreferences(this.activeUserId, this.gameFilter);
    } finally {
      this.isGameFilterSaving = false;
    }
    this.gameFilterPopupContext = null;
    this.localPopup = null;
    this.userProfileStore.clearUserFilterCountOverride(this.activeUserId);
    this.resetServiceCardState();
    this.cardIndex = 0;
    this.resetCandidateImageState();
    this.resetGameStackPaginationState(false);
    this.syncHomeSmartListQuery();
    this.gameInitialCardsLoadPending = true;
    if (this.homeSmartList) {
      this.homeSmartList.reload();
      return;
    }
    void this.reloadServiceCardStack();
  }
  gameCardOverlay(candidate, imageIndex) {
    const safeImageIndex = Math.max(0, imageIndex);
    const cards = this.gameCardOverlayCards(candidate);
    if (safeImageIndex >= cards.length) {
      return null;
    }
    return cards[safeImageIndex] ?? null;
  }
  gameCardOverlayCards(candidate) {
    const cards = [];
    const seen = /* @__PURE__ */ new Set();
    const usedLabels = /* @__PURE__ */ new Set();
    const pushPair = (primaryLabel, secondaryLabel) => {
      const normalizedPrimaryLabel = this.normalizeOverlayLabel(primaryLabel);
      const normalizedSecondaryLabel = this.normalizeOverlayLabel(secondaryLabel);
      if (usedLabels.has(normalizedPrimaryLabel) || usedLabels.has(normalizedSecondaryLabel)) {
        return;
      }
      const primaryValue = this.publicOverlayDetailValue(candidate, primaryLabel);
      const secondaryValue = this.publicOverlayDetailValue(candidate, secondaryLabel);
      if (!primaryValue || !secondaryValue) {
        return;
      }
      const primary = `${primaryLabel} \xB7 ${primaryValue}`;
      const secondary = `${secondaryLabel} \xB7 ${secondaryValue}`;
      const key = `${primary}::${secondary}`;
      if (seen.has(key)) {
        return;
      }
      seen.add(key);
      usedLabels.add(normalizedPrimaryLabel);
      usedLabels.add(normalizedSecondaryLabel);
      cards.push({ primary, secondary });
    };
    pushPair("Name", "City");
    pushPair("Languages", "Horoscope");
    pushPair("Workout", "Pets");
    pushPair("Gender", "City");
    pushPair("Height", "Physique");
    pushPair("Drinking", "Smoking");
    pushPair("Interest", "Values");
    pushPair("Communication style", "Love style");
    pushPair("Family plans", "Children");
    pushPair("Religion", "Sexual orientation");
    return cards;
  }
  publicOverlayDetailValue(candidate, label) {
    const normalizedLabel = this.normalizeOverlayLabel(label);
    const normalizedKey = this.normalizeOverlayLabel(PROFILE_DETAIL_LABEL_KEYS[normalizedLabel] ?? label);
    if (!PUBLIC_PROFILE_DETAIL_KEYS.has(normalizedKey)) {
      return "";
    }
    const facet = this.userFacet(candidate);
    switch (normalizedKey) {
      case "profile.name":
        return candidate.name;
      case "profile.city":
        return candidate.city;
      case "profile.languages":
        return this.compactList(candidate.languages, 2);
      case "profile.horoscope":
        return candidate.horoscope;
      case "profile.gender":
        return candidate.gender === "woman" ? "Woman" : "Man";
      case "profile.details.workout":
        return facet.workout;
      case "profile.details.pets":
        return facet.pets;
      case "profile.height":
        return candidate.height;
      case "profile.physique":
        return candidate.physique;
      case "profile.details.drinking":
        return facet.drinking;
      case "profile.details.smoking":
        return facet.smoking;
      case "profile.details.interest":
        return this.compactList(this.userInterests(candidate), 2);
      case "profile.details.values":
        return this.compactList(this.userValues(candidate), 2);
      case "profile.details.communicationstyle":
        return facet.communicationStyle;
      case "profile.details.lovestyle":
        return facet.loveStyle;
      case "profile.details.familyplans":
        return facet.familyPlans;
      case "profile.details.children":
        return facet.children;
      case "profile.details.religion":
        return facet.religion;
      case "profile.details.sexualorientation":
        return facet.sexualOrientation;
      default:
        return "";
    }
  }
  normalizeOverlayLabel(value) {
    return value.trim().toLowerCase();
  }
  compactList(values, maxItems) {
    if (values.length === 0) {
      return "";
    }
    const selected = values.slice(0, Math.max(1, maxItems));
    if (values.length <= selected.length) {
      return selected.join(", ");
    }
    return `${selected.join(", ")} +${values.length - selected.length}`;
  }
  get candidateImageStack() {
    return this.activeCandidate ? this.imageStackForCandidate(this.activeCandidate) : [];
  }
  get candidateImage() {
    if (this.candidateImageStack.length === 0) {
      return null;
    }
    const safeIndex = Math.min(this.selectedCandidateImageIndex, this.candidateImageStack.length - 1);
    const imageUrl = this.candidateImageStack[safeIndex] ?? null;
    if (!imageUrl || this.failedCandidateImageUrls.has(imageUrl)) {
      return null;
    }
    return imageUrl;
  }
  gameCardIndicatorIndexes(count) {
    return Array.from({ length: count }, (_, index) => index);
  }
  onCandidateImageAssetReady(imageUrl) {
    if (!imageUrl || imageUrl !== this.candidateImage) {
      return;
    }
    this.markGameImagePreloaded(imageUrl);
    if (this.candidateImageLoadingPulseTimer) {
      return;
    }
    const hadPendingLoad = this.isCandidateImageLoading;
    this.isCandidateImageLoading = false;
    if (hadPendingLoad) {
      this.triggerCandidateImageIndicatorReveal();
    }
  }
  onCandidateImageAssetError(imageUrl) {
    this.onCandidateImageAssetReady(imageUrl);
    if (!imageUrl) {
      return;
    }
    this.pendingGameImageUrls.delete(imageUrl);
    this.failedCandidateImageUrls.add(imageUrl);
    const nextAvailableImageIndex = this.candidateImageStack.findIndex((url) => !this.failedCandidateImageUrls.has(url));
    if (nextAvailableImageIndex >= 0 && nextAvailableImageIndex !== this.selectedCandidateImageIndex) {
      this.selectCandidateImage(nextAvailableImageIndex);
      return;
    }
    this.cdr.markForCheck();
  }
  selectCandidateImage(index) {
    if (index < 0 || index >= this.candidateImageStack.length) {
      return;
    }
    if (index === this.selectedCandidateImageIndex) {
      return;
    }
    this.selectedCandidateImageIndex = index;
    this.candidateImageZoom = 1;
    this.candidateImagePanX = 0;
    this.candidateImagePanY = 0;
    this.isCandidateImageDragging = false;
    this.beginCandidateImageLoadingForCurrentSelection(true);
  }
  onCandidateImageWheel(event) {
    if (!this.candidateImage) {
      return;
    }
    event.preventDefault();
    const zoomDelta = event.deltaY < 0 ? 0.12 : -0.12;
    this.candidateImageZoom = this.clamp(this.candidateImageZoom + zoomDelta, 1, 3.5);
    this.clampCandidateImagePan();
  }
  onCandidateImageMouseDown(event) {
    if (this.candidateImageZoom <= 1) {
      return;
    }
    this.isCandidateImageDragging = true;
    this.candidateDragOffsetX = event.clientX - this.candidateImagePanX;
    this.candidateDragOffsetY = event.clientY - this.candidateImagePanY;
  }
  onCandidateImageMouseMove(event) {
    if (!this.isCandidateImageDragging) {
      return;
    }
    this.candidateImagePanX = event.clientX - this.candidateDragOffsetX;
    this.candidateImagePanY = event.clientY - this.candidateDragOffsetY;
    this.clampCandidateImagePan();
  }
  onCandidateImageMouseUp() {
    this.isCandidateImageDragging = false;
  }
  onCandidateImageTouchStart(event) {
    if (this.candidateImageZoom <= 1 || event.touches.length === 0) {
      return;
    }
    const touch = event.touches[0];
    this.activeTouchId = touch.identifier;
    this.isCandidateImageDragging = true;
    this.candidateDragOffsetX = touch.clientX - this.candidateImagePanX;
    this.candidateDragOffsetY = touch.clientY - this.candidateImagePanY;
  }
  onCandidateImageTouchMove(event) {
    if (!this.isCandidateImageDragging || this.activeTouchId === null) {
      return;
    }
    const touch = Array.from(event.touches).find((item) => item.identifier === this.activeTouchId);
    if (!touch) {
      return;
    }
    event.preventDefault();
    this.candidateImagePanX = touch.clientX - this.candidateDragOffsetX;
    this.candidateImagePanY = touch.clientY - this.candidateDragOffsetY;
    this.clampCandidateImagePan();
  }
  onCandidateImageTouchEnd() {
    this.isCandidateImageDragging = false;
    this.activeTouchId = null;
  }
  get candidateInitials() {
    return this.activeCandidate ? this.initialsForCandidate(this.activeCandidate) : "NO";
  }
  pairModeCandidateImageStack(candidate) {
    return candidate ? this.imageStackForCandidate(candidate) : [];
  }
  pairModeCandidateImageIndex(gender) {
    return gender === "woman" ? this.pairModeWomanImageIndex : this.pairModeManImageIndex;
  }
  isPairModeCandidateImageLoading(gender) {
    return gender === "woman" ? this.isPairModeWomanImageLoading : this.isPairModeManImageLoading;
  }
  isPairModeCandidateImageIndicatorRevealing(gender) {
    return gender === "woman" ? this.isPairModeWomanImageIndicatorRevealing : this.isPairModeManImageIndicatorRevealing;
  }
  pairModeCandidateImage(candidate, gender) {
    if (!candidate) {
      return null;
    }
    const stack = this.pairModeCandidateImageStack(candidate);
    if (stack.length === 0) {
      return null;
    }
    const safeIndex = Math.min(this.pairModeCandidateImageIndex(gender), stack.length - 1);
    const imageUrl = stack[safeIndex] ?? null;
    if (imageUrl && !this.failedCandidateImageUrls.has(imageUrl)) {
      return imageUrl;
    }
    return stack.find((url) => !this.failedCandidateImageUrls.has(url)) ?? null;
  }
  selectPairModeCandidateImage(gender, index) {
    const candidate = gender === "woman" ? this.pairModeWomanCandidate : this.pairModeManCandidate;
    if (!candidate) {
      return;
    }
    const stack = this.pairModeCandidateImageStack(candidate);
    if (index < 0 || index >= stack.length) {
      return;
    }
    if (index === this.pairModeCandidateImageIndex(gender)) {
      return;
    }
    if (gender === "woman") {
      this.pairModeWomanImageIndex = index;
    } else {
      this.pairModeManImageIndex = index;
    }
    this.beginPairModeCandidateImageLoading(gender, true);
  }
  onPairModeCandidateImageReady(candidate, gender, imageUrl) {
    if (!this.isPairMode || !imageUrl) {
      return;
    }
    this.markGameImagePreloaded(imageUrl);
    const hasForcedPulseTimer = gender === "woman" ? this.pairModeWomanImageLoadingPulseTimer !== null : this.pairModeManImageLoadingPulseTimer !== null;
    if (hasForcedPulseTimer) {
      return;
    }
    const currentImage = this.pairModeCandidateImage(candidate, gender);
    if (imageUrl !== currentImage) {
      return;
    }
    const hadPendingLoad = this.isPairModeCandidateImageLoading(gender);
    const finalizeReady = () => {
      if (!this.isPairMode) {
        return;
      }
      const latestImage = this.pairModeCandidateImage(candidate, gender);
      if (latestImage !== imageUrl) {
        return;
      }
      if (gender === "woman") {
        this.isPairModeWomanImageLoading = false;
      } else {
        this.isPairModeManImageLoading = false;
      }
      if (hadPendingLoad) {
        this.triggerPairModeCandidateImageIndicatorReveal(gender);
        return;
      }
      this.cdr.markForCheck();
    };
    if (hadPendingLoad) {
      setTimeout(() => finalizeReady(), 80);
      return;
    }
    finalizeReady();
  }
  onPairModeCandidateImageError(candidate, gender, imageUrl) {
    this.onPairModeCandidateImageReady(candidate, gender, imageUrl);
    if (!imageUrl) {
      return;
    }
    this.pendingGameImageUrls.delete(imageUrl);
    this.failedCandidateImageUrls.add(imageUrl);
    const stack = this.pairModeCandidateImageStack(candidate);
    const nextAvailableImageIndex = stack.findIndex((url) => !this.failedCandidateImageUrls.has(url));
    if (nextAvailableImageIndex >= 0 && nextAvailableImageIndex !== this.pairModeCandidateImageIndex(gender)) {
      this.selectPairModeCandidateImage(gender, nextAvailableImageIndex);
      return;
    }
    this.cdr.markForCheck();
  }
  onPairModeSplitHandlePointerDown(event, stackElement) {
    if (!this.isPairMode || !this.isCompactViewport() || !stackElement) {
      return;
    }
    const bounds = stackElement.getBoundingClientRect();
    if (bounds.width <= 0) {
      return;
    }
    this.pairModeSplitBounds = { left: bounds.left, width: bounds.width };
    this.pairModeSplitPointerId = event.pointerId;
    this.isPairModeSplitDragging = true;
    this.updatePairModeSplitFromClientX(event.clientX);
    if (event.cancelable) {
      event.preventDefault();
    }
    event.stopPropagation();
    const target = event.currentTarget;
    if (target?.setPointerCapture) {
      target.setPointerCapture(event.pointerId);
    }
    this.cdr.markForCheck();
  }
  pairModeCandidateInitials(candidate) {
    return candidate ? this.initialsForCandidate(candidate) : "\u2205";
  }
  candidateActivityBadge(candidate) {
    if (!candidate) {
      return null;
    }
    const status = candidate.statusText?.trim();
    if (!status) {
      return null;
    }
    const normalized = status.toLowerCase();
    if (normalized.includes("active") || normalized.includes("akt")) {
      return "Active recently";
    }
    return status;
  }
  handleActiveUserChanged(userId) {
    this.stopPairModeSplitDrag();
    this.activeUserId = userId;
    this.localPopup = null;
    this.gameFilterPopupContext = null;
    this.resetServiceCardState();
    const initialFilter = createInitialGameFilter(this.activeUser);
    this.gameFilter = cloneGameFilter(initialFilter);
    this.applyFilterPreferencesFromUserProfileStore();
    this.homeSmartListQueryReady = false;
    this.cardIndex = 0;
    this.resetCandidateImageState();
    this.resetGameStackPaginationState(false);
    this.gameInitialCardsLoadPending = true;
    this.awaitingUserBootstrapRef.set(true);
    this.awaitingUserByIdLoadingSeen = false;
    this.cdr.markForCheck();
  }
  reloadHomeSmartListAfterProfileSave() {
    if (!this.activeUserId) {
      return;
    }
    this.homeSmartListRefreshRevision += 1;
    this.resetServiceCardState();
    this.cardIndex = 0;
    this.resetCandidateImageState();
    this.resetGameStackPaginationState(false);
    this.syncHomeSmartListQuery();
    this.homeSmartListQueryReady = true;
    this.gameInitialCardsLoadPending = true;
    if (this.homeSmartList) {
      this.homeSmartList.reload();
    } else {
      void this.reloadServiceCardStack();
    }
    this.cdr.markForCheck();
  }
  resetServiceCardState() {
    this.clearPendingRatingAdvanceTimer();
    this.gameService.resetUserGameCardsStack(this.activeUserId);
  }
  clearPendingRatingAdvanceTimer() {
    if (this.ratingAdvanceTimer) {
      clearTimeout(this.ratingAdvanceTimer);
      this.ratingAdvanceTimer = null;
    }
    this.selectedRating = 0;
  }
  applyFilterPreferencesFromUserProfileStore() {
    const next = this.userProfileStore.resolveUserFilterPreferences(this.activeUserId, createInitialGameFilter(this.activeUser));
    this.gameFilter = normalizeGameFilter(next);
  }
  gameFilterForRequest() {
    return this.gameFilter;
  }
  async reloadServiceCardStack() {
    const reloadKey = this.serviceCardStackReloadKey();
    if (this.gameService.isUserGameCardsStackRequestInFlight(this.activeUserId)) {
      if (this.inFlightServiceCardStackReloadKey !== reloadKey) {
        this.queuedServiceCardStackReloadKey = reloadKey;
      }
      return;
    }
    const requestUserId = this.activeUserId;
    this.inFlightServiceCardStackReloadKey = reloadKey;
    this.queuedServiceCardStackReloadKey = null;
    const shouldReloadSmartList = this.gameInitialCardsLoadPending === false;
    try {
      const serviceStack = await this.gameService.loadInitialUserGameCardsStackPage(this.activeUserId, this.gameFilterForRequest(), this.gameStackPageSizeForCurrentMode(), this.selectedHomeMode, this.leftSocialQuery.trim() || null, this.rightSocialQuery.trim() || null);
      if (requestUserId !== this.activeUserId) {
        return;
      }
      if (reloadKey !== this.serviceCardStackReloadKey()) {
        this.queuedServiceCardStackReloadKey = this.serviceCardStackReloadKey();
        return;
      }
      this.mergeGameStackUsersIntoHomeUsers();
      this.syncGameStackLoadedStateFromSnapshot(serviceStack);
      this.preloadGameImageWindow();
      if (!this.queuedServiceCardStackReloadKey) {
        this.gameInitialCardsLoadPending = false;
      }
      if (shouldReloadSmartList && !this.queuedServiceCardStackReloadKey) {
        this.homeSmartList?.reload();
      }
    } finally {
      this.inFlightServiceCardStackReloadKey = null;
      const queuedReloadKey = requestUserId === this.activeUserId ? this.queuedServiceCardStackReloadKey : null;
      if (!queuedReloadKey) {
        this.gameInitialCardsLoadPending = false;
      }
      this.cdr.markForCheck();
      if (queuedReloadKey) {
        this.queuedServiceCardStackReloadKey = null;
        if (queuedReloadKey !== reloadKey) {
          this.resetServiceCardState();
          this.resetGameStackPaginationState(false);
          this.syncHomeSmartListQuery();
        }
        void this.reloadServiceCardStack();
      }
    }
  }
  onWindowPointerMove(event) {
    if (!this.isPairModeSplitDragging || this.pairModeSplitPointerId !== event.pointerId) {
      return;
    }
    if (event.cancelable) {
      event.preventDefault();
    }
    this.updatePairModeSplitFromClientX(event.clientX);
  }
  onWindowPointerUp(event) {
    if (this.pairModeSplitPointerId !== event.pointerId) {
      return;
    }
    this.stopPairModeSplitDrag();
  }
  onWindowPointerCancel(event) {
    if (this.pairModeSplitPointerId !== event.pointerId) {
      return;
    }
    this.stopPairModeSplitDrag();
  }
  getActiveUserId() {
    const activeUserId = this.userProfileStore.activeUserId().trim();
    if (activeUserId) {
      return activeUserId;
    }
    if (this.users.length === 0) {
      return "";
    }
    return this.users[0].id;
  }
  clampCandidateImagePan() {
    const bound = (this.candidateImageZoom - 1) * 140;
    this.candidateImagePanX = this.clamp(this.candidateImagePanX, -bound, bound);
    this.candidateImagePanY = this.clamp(this.candidateImagePanY, -bound, bound);
  }
  updatePairModeSplitFromClientX(clientX) {
    if (!this.pairModeSplitBounds || this.pairModeSplitBounds.width <= 0) {
      return;
    }
    const relative = (clientX - this.pairModeSplitBounds.left) / this.pairModeSplitBounds.width * 100;
    this.pairModeSplitPercent = this.clamp(relative, _HomeComponent.PAIR_MODE_SPLIT_MIN_PERCENT, _HomeComponent.PAIR_MODE_SPLIT_MAX_PERCENT);
    this.cdr.markForCheck();
  }
  stopPairModeSplitDrag() {
    if (!this.isPairModeSplitDragging && this.pairModeSplitPointerId === null && this.pairModeSplitBounds === null) {
      return;
    }
    this.isPairModeSplitDragging = false;
    this.pairModeSplitPointerId = null;
    this.pairModeSplitBounds = null;
    this.cdr.markForCheck();
  }
  isCompactViewport() {
    return typeof globalThis.innerWidth === "number" && globalThis.innerWidth <= _HomeComponent.MOBILE_VIEWPORT_MAX_WIDTH_PX;
  }
  clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }
  syncHomeSmartListQuery() {
    const filterKey = JSON.stringify({
      gameFilter: this.gameFilter,
      leftSocialQuery: this.leftSocialQuery.trim(),
      rightSocialQuery: this.rightSocialQuery.trim()
    });
    const queryKey = `${this.activeUserId}|${this.selectedHomeMode}|${filterKey}`;
    if (this.homeSmartListQueryKey === queryKey) {
      return;
    }
    this.homeSmartListQueryKey = queryKey;
    this.homeSmartListQuery = {
      filters: {
        activeUserId: this.activeUserId,
        mode: this.selectedHomeMode,
        filterKey
      }
    };
  }
  async loadHomeSmartListPage(query) {
    if (this.isBlockedUserStatusPending || this.isBlockedUser || this.isGameVisibilityPaused) {
      return {
        items: [],
        total: 0,
        nextCursor: null
      };
    }
    if (!query.filters?.activeUserId?.trim()) {
      return {
        items: [],
        total: 0,
        nextCursor: null
      };
    }
    await this.waitForInitialHomeGameStack(query);
    await this.ensureHomeSmartListRowsAvailable(query);
    const pageSize = Number.isFinite(query.pageSize) ? Math.max(1, Math.trunc(Number(query.pageSize))) : this.gameStackPageSizeForCurrentMode();
    const startIndex = Math.max(0, query.page) * pageSize;
    const endIndex = startIndex + pageSize;
    const total = this.totalRoundsForCurrentMode();
    return {
      items: this.homeSmartListRowsPage(startIndex, endIndex),
      total,
      nextCursor: endIndex < total ? String(endIndex) : null
    };
  }
  async waitForInitialHomeGameStack(query) {
    if (this.awaitingUserBootstrapRef() && query.page === 0) {
      while (this.awaitingUserBootstrapRef()) {
        await this.waitForHomeGameStackTick();
      }
    }
    if (query.page > 0 || this.gameInitialCardsLoadPending === false) {
      return;
    }
    await this.ensureInitialServiceCardStackLoaded();
  }
  async ensureInitialServiceCardStackLoaded() {
    if (!this.gameInitialCardsLoadPending) {
      return;
    }
    if (!this.initialServiceCardStackLoadPromise) {
      this.initialServiceCardStackLoadPromise = this.reloadServiceCardStack().finally(() => {
        this.initialServiceCardStackLoadPromise = null;
      });
    }
    await this.initialServiceCardStackLoadPromise;
  }
  waitForHomeGameStackTick() {
    return new Promise((resolve) => {
      setTimeout(() => resolve(), 16);
    });
  }
  async ensureHomeSmartListRowsAvailable(query) {
    if (!this.gameService.shouldUseUserGameCardsStack(this.activeUserId)) {
      return;
    }
    const pageSize = Number.isFinite(query.pageSize) ? Math.max(1, Math.trunc(Number(query.pageSize))) : this.gameStackPageSizeForCurrentMode();
    const requiredCount = (Math.max(0, query.page) + 1) * pageSize;
    let pageRequestAttempted = false;
    while (this.availableServiceRowsCount() < requiredCount) {
      const snapshot = this.gameService.peekUserGameCardsStackSnapshot(this.activeUserId);
      if (snapshot.requestInFlight) {
        await this.waitForHomeGameStackTick();
        continue;
      }
      const forceRequest = snapshot.nextCursor === null && !this.hasUnloadedRemainingServiceRows(snapshot);
      if (forceRequest && pageRequestAttempted) {
        return;
      }
      const previousCursor = snapshot.nextCursor;
      const previousLoadedCount = this.loadedServiceRowsCount(snapshot);
      const nextSnapshot = await this.gameService.loadNextUserGameCardsStackPage(this.activeUserId, this.gameFilterForRequest(), this.gameStackPageSizeForCurrentMode(), this.selectedHomeMode, this.leftSocialQuery.trim() || null, this.rightSocialQuery.trim() || null, void 0, forceRequest);
      pageRequestAttempted = true;
      this.mergeGameStackUsersIntoHomeUsers();
      if (nextSnapshot.nextCursor === previousCursor && this.loadedServiceRowsCount(nextSnapshot) <= previousLoadedCount) {
        return;
      }
    }
  }
  loadedServiceRowsCount(serviceStack) {
    if (this.isFriendsInCommonMode) {
      return serviceStack.socialCards.filter((card) => card.socialContext === "friends-in-common").length;
    }
    if (this.isPairMode) {
      return this.socialCardsForCurrentMode(serviceStack.socialCards).length;
    }
    return serviceStack.cardUserIds.length;
  }
  loadedRemainingServiceRowsCount(serviceStack) {
    if (this.isFriendsInCommonMode) {
      return this.visibleFriendsInCommonSocialCards(serviceStack.socialCards).length;
    }
    if (this.isPairMode) {
      const ratedPairKeys = new Set(this.gameService.queryExcludedGameCardPairKeys(this.activeUserId));
      return this.socialCardsForCurrentMode(serviceStack.socialCards).filter((card) => {
        const secondUserId = card.secondaryUserId?.trim() || card.bridgeUserId?.trim() || "";
        return !ratedPairKeys.has(this.sortedHomePairKey(card.userId, secondUserId));
      }).length;
    }
    const excludedUserIds = new Set(this.gameService.queryExcludedGameCardUserIds(this.activeUserId, this.selectedHomeMode));
    return serviceStack.cardUserIds.filter((id) => !excludedUserIds.has(id.trim())).length;
  }
  hasUnloadedRemainingServiceRows(serviceStack) {
    if (serviceStack.filterCount === null) {
      return false;
    }
    return serviceStack.filterCount > this.loadedRemainingServiceRowsCount(serviceStack);
  }
  availableServiceRowsCount() {
    const snapshot = this.gameService.peekUserGameCardsStackSnapshot(this.activeUserId);
    if (this.isFriendsInCommonMode) {
      return snapshot.socialCards.filter((card) => card.socialContext === "friends-in-common").length;
    }
    if (this.isPairMode) {
      return this.socialCardsForCurrentMode(snapshot.socialCards).length;
    }
    return this.isPairMode ? this.pairModeCycleSize() : this.candidatePool.length;
  }
  homeSmartListRowsPage(startIndex, endIndex) {
    if (this.isFriendsInCommonMode) {
      return this.socialFriendsInCommonSingleRows().slice(startIndex, endIndex);
    }
    if (this.isPairMode) {
      return this.socialPairRows().slice(startIndex, endIndex);
    }
    return this.candidatePool.slice(startIndex, endIndex).map((candidate) => ({
      id: `single:${candidate.id}`,
      mode: "single",
      candidate
    }));
  }
  async onHomeSmartListRatingSelect(row, score) {
    if (!this.memberActionsAvailable || this.isBlockedUser)
      return;
    if (!row || this.ratingAdvanceTimer) {
      return;
    }
    if (row.mode === "pair") {
      const woman = row.round.woman;
      const man = row.round.man;
      if (!woman || !man) {
        return;
      }
      this.gameService.recordUserGameCardPairRating(this.activeUserId, woman.id, man.id, score, row.round.socialCard?.socialContext === "separated-friends" ? "separated-friends" : void 0);
    } else {
      this.gameService.recordUserGameCardRating(this.activeUserId, row.candidate.id, score, "single", row.socialCard?.socialContext === "friends-in-common" ? "friends-in-common" : void 0, row.socialCard?.bridgeUserId, row.socialCard?.bridgeCount);
    }
    const ratedRowId = row.id;
    this.selectedRating = score;
    this.triggerRatingBarBlink();
    this.ratingAdvanceTimer = setTimeout(() => {
      this.ratingAdvanceTimer = null;
      if (this.homeSmartList?.cursorItem()?.id === ratedRowId) {
        this.selectedRating = 0;
        this.cdr.markForCheck();
      }
    }, _HomeComponent.GAME_RATING_CONFIRMATION_MS + 24);
  }
  homeCandidateSlides(candidate, socialCard) {
    if (!candidate) {
      return [{
        imageUrl: "",
        primaryLine: "No card available",
        secondaryLine: "Adjust filters to load more profiles",
        placeholderLabel: "\u2205"
      }];
    }
    const overlays = this.gameCardOverlayCards(candidate);
    const initials = this.initialsForCandidate(candidate);
    return this.imageStackForCandidate(candidate).map((imageUrl, index) => {
      const overlay = overlays[index] ?? overlays[0] ?? null;
      return {
        imageUrl,
        primaryLine: overlay?.primary ?? this.homeCandidatePrimaryLine(candidate, socialCard),
        secondaryLine: this.homeCandidateSecondaryLine(candidate, socialCard, overlay?.secondary),
        placeholderLabel: initials
      };
    });
  }
  homePairCardSlot(gender, label, candidate, socialCard) {
    return {
      key: gender,
      label,
      tone: gender,
      slides: this.homeCandidateSlides(candidate, socialCard),
      statusBadgeLabel: this.candidateActivityBadge(candidate),
      profileView: candidate ? {
        userId: candidate.id,
        label: candidate.name
      } : null
    };
  }
  socialPairRows() {
    return this.socialCardsForCurrentMode(this.gameService.peekUserGameCardsStackSnapshot(this.activeUserId).socialCards).map((card) => ({
      id: card.id,
      mode: "pair",
      round: {
        woman: this.userById(card.userId),
        man: this.userById(card.secondaryUserId ?? ""),
        socialCard: card
      }
    })).filter((row) => !!row.round.woman && !!row.round.man);
  }
  socialFriendsInCommonSingleRows() {
    return this.gameService.peekUserGameCardsStackSnapshot(this.activeUserId).socialCards.filter((card) => card.socialContext === "friends-in-common").flatMap((card) => {
      const candidate = this.userById(card.userId);
      return candidate ? [{
        id: card.id,
        mode: "single",
        candidate,
        socialCard: card
      }] : [];
    });
  }
  socialCardsForCurrentMode(cards) {
    if (this.isFriendsInCommonMode) {
      return cards.filter((card) => card.socialContext === "friends-in-common");
    }
    if (this.isSeparatedFriendsMode) {
      return cards.filter((card) => card.socialContext === "separated-friends");
    }
    if (this.isOutsideNetworkMode) {
      return cards.filter((card) => !card.socialContext);
    }
    return [];
  }
  visibleFriendsInCommonSocialCards(cards) {
    const excludedUserIds = new Set(this.gameService.queryExcludedGameCardUserIds(this.activeUserId, "friends-in-common"));
    const byCandidateUserId = /* @__PURE__ */ new Map();
    for (const card of cards) {
      if (card.socialContext !== "friends-in-common") {
        continue;
      }
      const candidateUserId = card.userId.trim();
      if (!candidateUserId || excludedUserIds.has(candidateUserId)) {
        continue;
      }
      const existing = byCandidateUserId.get(candidateUserId);
      if (!existing || (card.bridgeCount ?? 0) > (existing.bridgeCount ?? 0)) {
        byCandidateUserId.set(candidateUserId, card);
      }
    }
    return [...byCandidateUserId.values()];
  }
  sortedHomePairKey(leftUserId, rightUserId) {
    return [leftUserId.trim(), rightUserId.trim()].sort((left, right) => left.localeCompare(right)).join(":");
  }
  isGameCandidateVisibleForSelectedMode(user) {
    if (this.isSeparatedFriendsMode) {
      return user.profileStatus === "public" || user.profileStatus === "friends only";
    }
    return user.profileStatus === "public";
  }
  userById(userId) {
    return this.users.find((user) => user.id === userId) ?? null;
  }
  homeSocialContextBadge(card) {
    if (card?.socialContext !== "friends-in-common") {
      return null;
    }
    const bridgeUser = this.userById(card.bridgeUserId ?? "");
    if (!bridgeUser) {
      return null;
    }
    const bridgeCount = Math.max(0, Math.trunc(Number(card.bridgeCount) || 0));
    return {
      label: bridgeUser.initials || this.initialsForCandidate(bridgeUser),
      imageUrl: this.imageStackForCandidate(bridgeUser)[0] ?? null,
      counterLabel: bridgeCount > 1 ? `+${bridgeCount - 1}` : null,
      title: this.homeSocialContextBadgeTitle(bridgeUser.name, bridgeCount),
      ariaLabel: `View ${bridgeUser.name} profile`,
      profileView: {
        userId: bridgeUser.id,
        label: bridgeUser.name
      }
    };
  }
  homeSocialContextBadgeTitle(bridgeName, bridgeCount) {
    const extraCount = Math.max(0, Math.trunc(Number(bridgeCount) || 0) - 1);
    return extraCount > 0 ? `Shown via ${bridgeName} and ${extraCount} more` : `Shown via ${bridgeName}`;
  }
  homePairSlotLabel(socialCard, side) {
    if (!socialCard) {
      return side === "left" ? "Person A" : "Person B";
    }
    if (socialCard.socialContext === "friends-in-common") {
      return side === "left" ? "Person" : "Common friend";
    }
    if (!socialCard.socialContext) {
      return side === "left" ? "Person A" : "Person B";
    }
    return side === "left" ? "Friend A" : "Friend B";
  }
  homeCandidatePrimaryLine(candidate, socialCard) {
    if (socialCard?.socialContext === "friends-in-common") {
      return `${candidate.name}, ${candidate.age}`;
    }
    return `${candidate.name}, ${candidate.age}`;
  }
  homeCandidateSecondaryLine(candidate, socialCard, fallback) {
    if (socialCard?.socialContext === "friends-in-common") {
      const bridgeName = this.userById(socialCard.bridgeUserId ?? "")?.name ?? "Shared friend";
      return socialCard.eventName?.trim() ? `${bridgeName} \xB7 ${socialCard.eventName.trim()}` : `${bridgeName} \xB7 ${candidate.city}`;
    }
    if (socialCard?.socialContext === "separated-friends") {
      return socialCard.eventName?.trim() || fallback || candidate.city;
    }
    return fallback || candidate.city;
  }
  reloadSocialModeCards() {
    if (!this.isSeparatedFriendsMode && !this.isFriendsInCommonMode) {
      return;
    }
    this.userProfileStore.clearUserFilterCountOverride(this.activeUserId);
    this.resetServiceCardState();
    this.cardIndex = 0;
    this.resetCandidateImageState();
    this.resetGameStackPaginationState(false);
    this.syncHomeSmartListQuery();
    this.gameInitialCardsLoadPending = true;
    void this.reloadServiceCardStack();
  }
  normalizeHomeMode(mode) {
    return mode === "outside-network" || mode === "separated-friends" || mode === "friends-in-common" ? mode : "single";
  }
  resetCandidateImageState() {
    this.stopPairModeSplitDrag();
    this.selectedCandidateImageIndex = 0;
    this.pairModeWomanImageIndex = 0;
    this.pairModeManImageIndex = 0;
    this.isPairModeWomanImageLoading = false;
    this.isPairModeManImageLoading = false;
    this.isPairModeWomanImageIndicatorRevealing = false;
    this.isPairModeManImageIndicatorRevealing = false;
    this.candidateImageZoom = 1;
    this.candidateImagePanX = 0;
    this.candidateImagePanY = 0;
    this.isCandidateImageDragging = false;
    this.activeTouchId = null;
    this.clearPairModeCandidateImageIndicatorRevealTimer("woman");
    this.clearPairModeCandidateImageIndicatorRevealTimer("man");
    this.clearCandidateImageLoadingPulseTimer();
    this.clearPairModeCandidateImageLoadingPulseTimer("woman");
    this.clearPairModeCandidateImageLoadingPulseTimer("man");
    this.failedCandidateImageUrls.clear();
  }
  createGameFilterPopupContext() {
    return {
      activeUser: this.activeUser,
      filter: cloneGameFilter(this.gameFilter),
      users: this.users,
      userFacets: this.userFacetById,
      interestOptionGroups: this.gameFilterInterestGroups,
      valueOptionGroups: this.gameFilterValuesGroups
    };
  }
  matchesFilter(user) {
    return this.matchesUserWithFilter(user, this.gameFilter);
  }
  matchesUserWithFilter(user, filter) {
    if (user.age < filter.ageMin || user.age > filter.ageMax) {
      return false;
    }
    const userHeight = parseGameHeightCm(user.height);
    if (userHeight !== null && (userHeight < filter.heightMinCm || userHeight > filter.heightMaxCm)) {
      return false;
    }
    if (filter.interests.length > 0) {
      const hasInterestMatch = this.userInterests(user).some((interest) => filter.interests.includes(interest));
      if (!hasInterestMatch) {
        return false;
      }
    }
    if (filter.values.length > 0) {
      const hasValuesMatch = this.userValues(user).some((value) => filter.values.includes(value));
      if (!hasValuesMatch) {
        return false;
      }
    }
    const facet = this.userFacet(user);
    if (filter.smoking.length > 0 && !filter.smoking.includes(facet.smoking)) {
      return false;
    }
    if (filter.drinking.length > 0 && !filter.drinking.includes(facet.drinking)) {
      return false;
    }
    if (filter.workout.length > 0 && !filter.workout.includes(facet.workout)) {
      return false;
    }
    if (filter.pets.length > 0 && !filter.pets.includes(facet.pets)) {
      return false;
    }
    if (filter.familyPlans.length > 0 && !filter.familyPlans.includes(facet.familyPlans)) {
      return false;
    }
    if (filter.children.length > 0 && !filter.children.includes(facet.children)) {
      return false;
    }
    if (filter.loveStyles.length > 0 && !filter.loveStyles.includes(facet.loveStyle)) {
      return false;
    }
    if (filter.communicationStyles.length > 0 && !filter.communicationStyles.includes(facet.communicationStyle)) {
      return false;
    }
    if (filter.sexualOrientations.length > 0 && !filter.sexualOrientations.includes(facet.sexualOrientation)) {
      return false;
    }
    if (filter.religions.length > 0 && !filter.religions.includes(facet.religion)) {
      return false;
    }
    if (filter.physiques.length > 0 && !filter.physiques.includes(user.physique)) {
      return false;
    }
    if (filter.languages.length > 0) {
      const hasLanguageMatch = user.languages.some((language) => filter.languages.includes(language));
      if (!hasLanguageMatch) {
        return false;
      }
    }
    if (filter.genders.length > 0 && !filter.genders.includes(user.gender)) {
      return false;
    }
    if (filter.horoscopes.length > 0 && !filter.horoscopes.includes(user.horoscope)) {
      return false;
    }
    if (filter.traitLabels.length > 0 && !filter.traitLabels.includes(user.traitLabel)) {
      return false;
    }
    return true;
  }
  userInterests(user) {
    return getGameUserInterests(user, this.userFacetById);
  }
  userValues(user) {
    return getGameUserValues(user, this.userFacetById);
  }
  userFacet(user) {
    return getGameUserFacet(user, this.userFacetById);
  }
  pairModeCandidateForGender(gender) {
    const visibleCount = Math.min(this.gameStackCardsLoaded, this.pairModeCycleSize());
    if (this.cardIndex < 0 || this.cardIndex >= visibleCount) {
      return null;
    }
    const round = this.pairModeRoundAt(this.cardIndex);
    if (!round) {
      return null;
    }
    return gender === "woman" ? round.woman : round.man;
  }
  pairModeCycleSize() {
    return this.pairModeRounds().length;
  }
  pairModeRounds() {
    if (this.isPairMode) {
      return this.socialPairRows().map((row) => row.round);
    }
    return [];
  }
  pairModeRoundAt(index) {
    if (index < 0) {
      return null;
    }
    const rounds = this.pairModeRounds();
    if (index >= rounds.length) {
      return null;
    }
    return rounds[index] ?? null;
  }
  imageStackForCandidate(candidate) {
    const explicitImages = (candidate.images ?? []).filter(Boolean);
    if (explicitImages.length > 0) {
      return explicitImages;
    }
    const genderFolder = candidate.gender === "woman" ? "women" : "men";
    const baseSeed = this.hashText(`game-card-image:${candidate.id}:${candidate.gender}`);
    const portraitIndexes = [];
    for (let offset = 0; offset < 8 && portraitIndexes.length < 3; offset += 1) {
      const portraitIndex = (baseSeed + offset * 17) % 100;
      if (!portraitIndexes.includes(portraitIndex)) {
        portraitIndexes.push(portraitIndex);
      }
    }
    return portraitIndexes.map((index) => `https://randomuser.me/api/portraits/${genderFolder}/${index}.jpg`);
  }
  initialsForCandidate(candidate) {
    const parts = candidate.name.split(" ").filter(Boolean);
    if (parts.length === 0) {
      return "U";
    }
    if (parts.length === 1) {
      return parts[0].slice(0, 2).toUpperCase();
    }
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  beginCandidateImageLoadingForCurrentSelection(forceLoadingPulse = false) {
    if (this.isPairMode) {
      this.beginPairModeCandidateImageLoading("woman", forceLoadingPulse);
      this.beginPairModeCandidateImageLoading("man", forceLoadingPulse);
      this.maybeStartGameStackPaginationLoad();
      return;
    }
    if (!this.candidateImage) {
      this.isCandidateImageLoading = false;
      this.isCandidateImageIndicatorRevealing = false;
      this.clearCandidateImageIndicatorRevealTimer();
      this.clearCandidateImageLoadingPulseTimer();
      this.maybeStartGameStackPaginationLoad();
      this.cdr.markForCheck();
      return;
    }
    const activeImage = this.candidateImage;
    const isPreloaded = this.isGameImagePreloaded(activeImage);
    this.isCandidateImageLoading = !isPreloaded;
    this.isCandidateImageIndicatorRevealing = false;
    this.clearCandidateImageIndicatorRevealTimer();
    this.clearCandidateImageLoadingPulseTimer();
    if (forceLoadingPulse && isPreloaded) {
      this.isCandidateImageLoading = true;
      this.candidateImageLoadingPulseTimer = setTimeout(() => {
        this.candidateImageLoadingPulseTimer = null;
        if (this.isPairMode || this.candidateImage !== activeImage) {
          return;
        }
        this.isCandidateImageLoading = false;
        this.isCandidateImageIndicatorRevealing = false;
        this.cdr.markForCheck();
      }, 420);
      this.cdr.markForCheck();
      return;
    }
    if (!this.isCandidateImageLoading) {
      this.triggerCandidateImageIndicatorReveal();
      return;
    }
    this.cdr.markForCheck();
  }
  triggerCandidateImageIndicatorReveal() {
    this.clearCandidateImageIndicatorRevealTimer();
    this.isCandidateImageIndicatorRevealing = false;
    this.cdr.markForCheck();
    const startReveal = () => {
      this.isCandidateImageIndicatorRevealing = true;
      this.cdr.markForCheck();
      this.candidateImageIndicatorRevealTimer = setTimeout(() => {
        this.isCandidateImageIndicatorRevealing = false;
        this.candidateImageIndicatorRevealTimer = null;
        this.cdr.markForCheck();
      }, 320);
    };
    if (typeof globalThis.requestAnimationFrame === "function") {
      globalThis.requestAnimationFrame(() => startReveal());
      return;
    }
    setTimeout(() => startReveal(), 0);
  }
  clearCandidateImageIndicatorRevealTimer() {
    if (this.candidateImageIndicatorRevealTimer) {
      clearTimeout(this.candidateImageIndicatorRevealTimer);
      this.candidateImageIndicatorRevealTimer = null;
    }
  }
  clearCandidateImageLoadingPulseTimer() {
    if (this.candidateImageLoadingPulseTimer) {
      clearTimeout(this.candidateImageLoadingPulseTimer);
      this.candidateImageLoadingPulseTimer = null;
    }
  }
  beginPairModeCandidateImageLoading(gender, forceLoadingPulse = false) {
    const candidate = gender === "woman" ? this.pairModeWomanCandidate : this.pairModeManCandidate;
    const imageUrl = this.pairModeCandidateImage(candidate, gender);
    if (!imageUrl) {
      if (gender === "woman") {
        this.isPairModeWomanImageLoading = false;
        this.isPairModeWomanImageIndicatorRevealing = false;
      } else {
        this.isPairModeManImageLoading = false;
        this.isPairModeManImageIndicatorRevealing = false;
      }
      this.clearPairModeCandidateImageIndicatorRevealTimer(gender);
      this.clearPairModeCandidateImageLoadingPulseTimer(gender);
      this.cdr.markForCheck();
      return;
    }
    const isPreloaded = this.isGameImagePreloaded(imageUrl);
    if (gender === "woman") {
      this.isPairModeWomanImageLoading = !isPreloaded;
      this.isPairModeWomanImageIndicatorRevealing = false;
    } else {
      this.isPairModeManImageLoading = !isPreloaded;
      this.isPairModeManImageIndicatorRevealing = false;
    }
    this.clearPairModeCandidateImageIndicatorRevealTimer(gender);
    this.clearPairModeCandidateImageLoadingPulseTimer(gender);
    if (forceLoadingPulse && isPreloaded) {
      if (gender === "woman") {
        this.isPairModeWomanImageLoading = true;
        this.pairModeWomanImageLoadingPulseTimer = setTimeout(() => {
          this.pairModeWomanImageLoadingPulseTimer = null;
          if (!this.isPairMode || this.pairModeCandidateImage(this.pairModeWomanCandidate, "woman") !== imageUrl) {
            return;
          }
          this.isPairModeWomanImageLoading = false;
          this.isPairModeWomanImageIndicatorRevealing = false;
          this.cdr.markForCheck();
        }, 420);
      } else {
        this.isPairModeManImageLoading = true;
        this.pairModeManImageLoadingPulseTimer = setTimeout(() => {
          this.pairModeManImageLoadingPulseTimer = null;
          if (!this.isPairMode || this.pairModeCandidateImage(this.pairModeManCandidate, "man") !== imageUrl) {
            return;
          }
          this.isPairModeManImageLoading = false;
          this.isPairModeManImageIndicatorRevealing = false;
          this.cdr.markForCheck();
        }, 420);
      }
      this.cdr.markForCheck();
      return;
    }
    if (!this.isPairModeCandidateImageLoading(gender)) {
      this.triggerPairModeCandidateImageIndicatorReveal(gender);
      return;
    }
    this.cdr.markForCheck();
  }
  triggerPairModeCandidateImageIndicatorReveal(gender) {
    this.clearPairModeCandidateImageIndicatorRevealTimer(gender);
    if (gender === "woman") {
      this.isPairModeWomanImageIndicatorRevealing = false;
    } else {
      this.isPairModeManImageIndicatorRevealing = false;
    }
    this.cdr.markForCheck();
    const startReveal = () => {
      if (gender === "woman") {
        this.isPairModeWomanImageIndicatorRevealing = true;
      } else {
        this.isPairModeManImageIndicatorRevealing = true;
      }
      this.cdr.markForCheck();
      const timer = setTimeout(() => {
        if (gender === "woman") {
          this.isPairModeWomanImageIndicatorRevealing = false;
          this.pairModeWomanImageIndicatorRevealTimer = null;
        } else {
          this.isPairModeManImageIndicatorRevealing = false;
          this.pairModeManImageIndicatorRevealTimer = null;
        }
        this.cdr.markForCheck();
      }, 320);
      if (gender === "woman") {
        this.pairModeWomanImageIndicatorRevealTimer = timer;
      } else {
        this.pairModeManImageIndicatorRevealTimer = timer;
      }
    };
    if (typeof globalThis.requestAnimationFrame === "function") {
      globalThis.requestAnimationFrame(() => startReveal());
      return;
    }
    setTimeout(() => startReveal(), 0);
  }
  clearPairModeCandidateImageIndicatorRevealTimer(gender) {
    if (gender === "woman") {
      if (this.pairModeWomanImageIndicatorRevealTimer) {
        clearTimeout(this.pairModeWomanImageIndicatorRevealTimer);
        this.pairModeWomanImageIndicatorRevealTimer = null;
      }
      return;
    }
    if (this.pairModeManImageIndicatorRevealTimer) {
      clearTimeout(this.pairModeManImageIndicatorRevealTimer);
      this.pairModeManImageIndicatorRevealTimer = null;
    }
  }
  clearPairModeCandidateImageLoadingPulseTimer(gender) {
    if (gender === "woman") {
      if (this.pairModeWomanImageLoadingPulseTimer) {
        clearTimeout(this.pairModeWomanImageLoadingPulseTimer);
        this.pairModeWomanImageLoadingPulseTimer = null;
      }
      return;
    }
    if (this.pairModeManImageLoadingPulseTimer) {
      clearTimeout(this.pairModeManImageLoadingPulseTimer);
      this.pairModeManImageLoadingPulseTimer = null;
    }
  }
  startGameCardLeaveAnimation(candidate, rating) {
    this.leavingPairModeWomanCard = null;
    this.leavingPairModeManCard = null;
    const stack = this.imageStackForCandidate(candidate);
    const safeImageIndex = stack.length === 0 ? 0 : Math.min(this.selectedCandidateImageIndex, stack.length - 1);
    this.leavingGameCard = {
      candidate,
      imageUrl: stack[safeImageIndex] ?? null,
      imageCount: stack.length,
      imageIndex: safeImageIndex,
      initials: this.initialsForCandidate(candidate),
      rating
    };
    if (this.gameCardLeaveTimer) {
      clearTimeout(this.gameCardLeaveTimer);
      this.gameCardLeaveTimer = null;
    }
    this.gameCardLeaveTimer = setTimeout(() => {
      this.leavingGameCard = null;
      this.leavingPairModeWomanCard = null;
      this.leavingPairModeManCard = null;
      this.gameCardLeaveTimer = null;
      this.cdr.markForCheck();
    }, 440);
  }
  startPairModeCardLeaveAnimation(rating) {
    this.leavingGameCard = null;
    this.leavingPairModeWomanCard = this.buildPairModeLeavingCardState(this.pairModeWomanCandidate, "woman", rating);
    this.leavingPairModeManCard = this.buildPairModeLeavingCardState(this.pairModeManCandidate, "man", rating);
    if (!this.leavingPairModeWomanCard && !this.leavingPairModeManCard) {
      return;
    }
    if (this.gameCardLeaveTimer) {
      clearTimeout(this.gameCardLeaveTimer);
      this.gameCardLeaveTimer = null;
    }
    this.gameCardLeaveTimer = setTimeout(() => {
      this.leavingGameCard = null;
      this.leavingPairModeWomanCard = null;
      this.leavingPairModeManCard = null;
      this.gameCardLeaveTimer = null;
      this.cdr.markForCheck();
    }, 440);
  }
  buildPairModeLeavingCardState(candidate, gender, rating) {
    if (!candidate) {
      return null;
    }
    const stack = this.pairModeCandidateImageStack(candidate);
    const selectedImageIndex = gender === "woman" ? this.pairModeWomanImageIndex : this.pairModeManImageIndex;
    const safeImageIndex = stack.length === 0 ? 0 : Math.min(selectedImageIndex, stack.length - 1);
    return {
      candidate,
      imageUrl: stack[safeImageIndex] ?? null,
      imageCount: stack.length,
      imageIndex: safeImageIndex,
      initials: this.initialsForCandidate(candidate),
      rating
    };
  }
  triggerRatingBarBlink() {
    if (this.ratingBarBlinkTimeout) {
      clearTimeout(this.ratingBarBlinkTimeout);
      this.ratingBarBlinkTimeout = null;
    }
    this.isRatingBarBlinking = false;
    this.cdr.markForCheck();
    const startBlink = () => {
      this.isRatingBarBlinking = true;
      this.cdr.markForCheck();
      this.ratingBarBlinkTimeout = setTimeout(() => {
        this.isRatingBarBlinking = false;
        this.ratingBarBlinkTimeout = null;
        this.cdr.markForCheck();
      }, 420);
    };
    if (typeof globalThis.requestAnimationFrame === "function") {
      globalThis.requestAnimationFrame(() => startBlink());
      return;
    }
    setTimeout(() => startBlink(), 0);
  }
  totalRoundsForCurrentMode() {
    const serviceStack = this.gameService.peekUserGameCardsStackSnapshot(this.activeUserId);
    if (serviceStack.cardUserIds.length > 0 || serviceStack.socialCards.length > 0 || serviceStack.nextCursor !== null) {
      if (serviceStack.filterCount !== null) {
        return Math.max(this.gameStackCardsLoaded, Math.max(0, this.cardIndex) + serviceStack.filterCount);
      }
      const loadedCount = this.loadedServiceRowsCount(serviceStack);
      return loadedCount + (serviceStack.nextCursor !== null ? 1 : 0);
    }
    return this.candidatePool.length;
  }
  gameStackPaginationStateKey() {
    const filterKey = JSON.stringify({
      gameFilter: this.gameFilter,
      leftSocialQuery: this.leftSocialQuery.trim(),
      rightSocialQuery: this.rightSocialQuery.trim()
    });
    return `${this.activeUserId}|${this.selectedHomeMode}|${filterKey}`;
  }
  serviceCardStackReloadKey() {
    return `${this.gameStackPaginationStateKey()}|${this.homeSmartListRefreshRevision}`;
  }
  gameStackPageSizeForCurrentMode() {
    return this.isPairMode ? _HomeComponent.GAME_STACK_PAGE_SIZE_PAIR : _HomeComponent.GAME_STACK_PAGE_SIZE_SINGLE;
  }
  hasMoreRoundsForCurrentMode() {
    return this.gameStackCardsLoaded < this.totalRoundsForCurrentMode();
  }
  resetGameStackPaginationState(loadFirstPageImmediately = true) {
    this.cancelGameStackPaginationLoad();
    this.gameStackPaginationKey = this.gameStackPaginationStateKey();
    this.gameStackExhausted = false;
    const totalRounds = this.totalRoundsForCurrentMode();
    this.gameStackCardsLoaded = loadFirstPageImmediately ? Math.min(totalRounds, this.gameStackPageSizeForCurrentMode()) : 0;
    this.cardIndex = Math.min(this.cardIndex, this.gameStackCardsLoaded);
    this.cdr.markForCheck();
  }
  syncGameStackLoadedStateFromSnapshot(serviceStack) {
    this.cancelGameStackPaginationLoad();
    this.gameStackPaginationKey = this.gameStackPaginationStateKey();
    const loadedCount = this.isPairMode || this.isFriendsInCommonMode ? this.loadedServiceRowsCount(serviceStack) : serviceStack.cardUserIds.length;
    this.gameStackCardsLoaded = loadedCount;
    this.gameStackExhausted = loadedCount <= 0 && serviceStack.nextCursor === null;
    this.cardIndex = Math.min(this.cardIndex, this.gameStackCardsLoaded);
    this.cdr.markForCheck();
  }
  maybeStartGameStackPaginationLoad() {
    const stateKey = this.gameStackPaginationStateKey();
    if (stateKey !== this.gameStackPaginationKey) {
      this.resetGameStackPaginationState();
    }
    if (this.gameStackPaginating) {
      return;
    }
    if (!this.canAttemptGameStackLoad()) {
      this.gameStackExhausted = true;
      return;
    }
    const remainingCards = Math.max(0, this.gameStackCardsLoaded - (this.cardIndex + 1));
    if (remainingCards > _HomeComponent.GAME_STACK_PRELOAD_THRESHOLD) {
      return;
    }
    if (this.gameStackExhausted) {
      return;
    }
    if (!this.hasMoreRoundsForCurrentMode() && !this.gameService.shouldUseUserGameCardsStack(this.activeUserId)) {
      this.gameStackExhausted = true;
      return;
    }
    this.startGameStackPaginationLoad();
  }
  startGameStackPaginationLoad() {
    if (this.gameService.shouldUseUserGameCardsStack(this.activeUserId)) {
      this.startServiceCardPaginationLoad();
      return;
    }
    if (this.gameStackPaginating) {
      return;
    }
    if (!this.canAttemptGameStackLoad()) {
      this.gameStackExhausted = true;
      return;
    }
    if (!this.hasMoreRoundsForCurrentMode()) {
      this.gameStackExhausted = true;
      return;
    }
    this.gameStackPaginating = true;
    const finalizePaginationLoad = () => {
      const totalRounds = this.totalRoundsForCurrentMode();
      const previousLoaded = this.gameStackCardsLoaded;
      this.gameStackCardsLoaded = Math.min(totalRounds, this.gameStackCardsLoaded + this.gameStackPageSizeForCurrentMode());
      const loadedMoreCards = this.gameStackCardsLoaded > previousLoaded;
      this.gameStackExhausted = !loadedMoreCards;
      this.gameStackPaginating = false;
      this.preloadGameImageWindow();
      this.beginCandidateImageLoadingForCurrentSelection(true);
      this.cdr.markForCheck();
    };
    finalizePaginationLoad();
  }
  startServiceCardPaginationLoad() {
    if (this.gameStackPaginating || this.gameService.isUserGameCardsStackRequestInFlight(this.activeUserId)) {
      return;
    }
    const smartList = this.homeSmartList;
    if (!smartList) {
      return;
    }
    this.gameStackPaginating = true;
    void smartList.preloadNextListPage({ force: true }).then(() => {
      const serviceStack = this.gameService.peekUserGameCardsStackSnapshot(this.activeUserId);
      this.gameStackCardsLoaded = smartList.visibleItemCount();
      this.gameStackExhausted = serviceStack.nextCursor === null && !this.hasUnloadedRemainingServiceRows(serviceStack);
      this.preloadGameImageWindow();
      this.beginCandidateImageLoadingForCurrentSelection(true);
    }).catch(() => {
      this.gameStackExhausted = true;
    }).finally(() => {
      this.gameStackPaginating = false;
      this.cdr.markForCheck();
    });
  }
  cancelGameStackPaginationLoad() {
    this.gameStackPaginating = false;
  }
  canAttemptGameStackLoad() {
    if (this.isPairMode) {
      return this.pairModeCycleSize() > 0;
    }
    return this.candidatePool.length > 0;
  }
  preloadGameImageWindow() {
    const totalRounds = this.totalRoundsForCurrentMode();
    if (totalRounds === 0) {
      return;
    }
    let preloadedCount = 0;
    for (let roundIndex = this.cardIndex; roundIndex < totalRounds; roundIndex += 1) {
      const roundCandidates = this.gameCandidatesForRound(roundIndex);
      for (const candidate of roundCandidates) {
        const stack = this.imageStackForCandidate(candidate);
        for (const url of stack) {
          if (!url || this.failedCandidateImageUrls.has(url)) {
            continue;
          }
          if (this.isGameImagePreloaded(url)) {
            continue;
          }
          this.preloadGameImageUrl(url);
          preloadedCount += 1;
          if (preloadedCount >= _HomeComponent.GAME_STACK_PHOTO_PRELOAD_TARGET) {
            return;
          }
        }
      }
    }
  }
  gameCandidatesForRound(roundIndex) {
    if (roundIndex < 0) {
      return [];
    }
    if (this.isPairMode) {
      const round = this.pairModeRoundAt(roundIndex);
      if (!round) {
        return [];
      }
      const candidates = [];
      if (round.woman) {
        candidates.push(round.woman);
      }
      if (round.man) {
        candidates.push(round.man);
      }
      return candidates;
    }
    const candidate = this.candidatePool[roundIndex] ?? null;
    return candidate ? [candidate] : [];
  }
  preloadGameImageUrl(url) {
    if (!url || this.pendingGameImageUrls.has(url) || this.preloadedGameImageUrls.has(url)) {
      return;
    }
    if (typeof Image === "undefined") {
      return;
    }
    this.pendingGameImageUrls.add(url);
    const image = new Image();
    image.onload = () => this.markGameImagePreloaded(url);
    image.onerror = () => {
      this.pendingGameImageUrls.delete(url);
    };
    image.src = url;
  }
  markGameImagePreloaded(url) {
    if (!url) {
      return;
    }
    this.pendingGameImageUrls.delete(url);
    this.preloadedGameImageUrls.add(url);
  }
  isGameImagePreloaded(url) {
    return !!url && this.preloadedGameImageUrls.has(url);
  }
  upsertHomeUser(user) {
    const nextUser = this.toHomeUser(user);
    const existingIndex = this.users.findIndex((item) => item.id === nextUser.id);
    if (existingIndex >= 0) {
      this.users = this.users.map((item, index) => index === existingIndex ? nextUser : item);
      return;
    }
    this.users = [nextUser, ...this.users];
  }
  mergeGameStackUsersIntoHomeUsers() {
    const snapshotUsers = this.gameService.getGameCardsUsersSnapshot();
    if (snapshotUsers.length === 0) {
      return;
    }
    const byId = new Map(this.users.map((user) => [user.id, user]));
    for (const user of snapshotUsers) {
      byId.set(user.id, user);
    }
    this.users = Array.from(byId.values());
  }
  toHomeUser(user) {
    return __spreadProps(__spreadValues({}, user), {
      languages: [...user.languages ?? []],
      images: [...user.images ?? []],
      activities: {
        game: user.activities?.game ?? 0,
        chats: user.activities?.chats ?? 0,
        invitations: user.activities?.invitations ?? 0,
        events: user.activities?.events ?? 0,
        hosting: user.activities?.hosting ?? 0,
        cars: user.activities?.cars ?? 0,
        accommodation: user.activities?.accommodation ?? 0,
        supplies: user.activities?.supplies ?? 0,
        tickets: user.activities?.tickets ?? 0,
        contacts: user.activities?.contacts ?? 0,
        feedback: user.activities?.feedback ?? 0,
        adminJobs: user.activities?.adminJobs ?? 0,
        adminMetrics: user.activities?.adminMetrics ?? 0
      }
    });
  }
  createFallbackActiveUser() {
    return {
      id: this.activeUserId || this.userProfileStore.activeUserId().trim(),
      name: "",
      age: 30,
      birthday: "",
      city: "",
      height: "",
      physique: "",
      languages: [],
      horoscope: "",
      initials: "",
      gender: "woman",
      statusText: "",
      hostTier: "",
      traitLabel: "",
      completion: 0,
      headline: "",
      about: "",
      affinity: 0,
      locationCoordinates: void 0,
      images: [],
      impressions: void 0,
      profileStatus: "public",
      activities: {
        game: 0,
        chats: 0,
        invitations: 0,
        events: 0,
        hosting: 0,
        cars: 0,
        accommodation: 0,
        supplies: 0,
        tickets: 0,
        contacts: 0,
        feedback: 0,
        adminJobs: 0,
        adminMetrics: 0
      }
    };
  }
  mergeActiveUserFromContext(localUser, contextUser) {
    return __spreadProps(__spreadValues({}, localUser), {
      name: contextUser.name,
      age: contextUser.age,
      birthday: contextUser.birthday,
      city: contextUser.city,
      height: contextUser.height,
      physique: contextUser.physique,
      languages: [...contextUser.languages ?? localUser.languages],
      horoscope: contextUser.horoscope,
      initials: contextUser.initials,
      gender: contextUser.gender,
      statusText: contextUser.statusText,
      hostTier: contextUser.hostTier,
      traitLabel: contextUser.traitLabel,
      completion: contextUser.completion,
      headline: contextUser.headline,
      about: contextUser.about,
      images: [...contextUser.images ?? localUser.images ?? []],
      profileStatus: contextUser.profileStatus,
      activities: {
        game: contextUser.activities?.game ?? localUser.activities.game,
        chats: contextUser.activities?.chats ?? localUser.activities.chats,
        invitations: contextUser.activities?.invitations ?? localUser.activities.invitations,
        events: contextUser.activities?.events ?? localUser.activities.events,
        hosting: contextUser.activities?.hosting ?? localUser.activities.hosting,
        cars: contextUser.activities?.cars ?? localUser.activities.cars ?? 0,
        accommodation: contextUser.activities?.accommodation ?? localUser.activities.accommodation ?? 0,
        supplies: contextUser.activities?.supplies ?? localUser.activities.supplies ?? 0,
        tickets: contextUser.activities?.tickets ?? localUser.activities.tickets ?? 0,
        contacts: contextUser.activities?.contacts ?? localUser.activities.contacts ?? 0,
        feedback: contextUser.activities?.feedback ?? localUser.activities.feedback ?? 0,
        adminJobs: contextUser.activities?.adminJobs ?? localUser.activities.adminJobs ?? 0,
        adminMetrics: contextUser.activities?.adminMetrics ?? localUser.activities.adminMetrics ?? 0
      }
    });
  }
  hashText(value) {
    let hash = 0;
    for (let index = 0; index < value.length; index += 1) {
      hash = (hash * 31 + value.charCodeAt(index)) % 104729;
    }
    return Math.abs(hash);
  }
  static \u0275fac = function HomeComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _HomeComponent)(\u0275\u0275directiveInject(ChangeDetectorRef), \u0275\u0275directiveInject(ActivitiesPopupStore), \u0275\u0275directiveInject(ProfileStore), \u0275\u0275directiveInject(ExplanationGuideService), \u0275\u0275directiveInject(GameService), \u0275\u0275directiveInject(UsersService));
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _HomeComponent, selectors: [["app-home"]], viewQuery: function HomeComponent_Query(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275viewQuery(_c0, 5);
    }
    if (rf & 2) {
      let _t;
      \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.homeSmartList = _t.first);
    }
  }, hostBindings: function HomeComponent_HostBindings(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275listener("pointermove", function HomeComponent_pointermove_HostBindingHandler($event) {
        return ctx.onWindowPointerMove($event);
      }, \u0275\u0275resolveWindow)("pointerup", function HomeComponent_pointerup_HostBindingHandler($event) {
        return ctx.onWindowPointerUp($event);
      }, \u0275\u0275resolveWindow)("pointercancel", function HomeComponent_pointercancel_HostBindingHandler($event) {
        return ctx.onWindowPointerCancel($event);
      }, \u0275\u0275resolveWindow);
    }
  }, decls: 3, vars: 2, consts: [["homeFullscreenItemTemplate", ""], ["homeSmartList", ""], ["aria-hidden", "true", 1, "game-page", "game-page-reactivation-pending"], [1, "game-page", 3, "ngClass"], [3, "itemSelect", "branding", "items", "showControls"], [1, "game-social-query-bar"], [1, "game-layout-single"], [1, "game-card-deck"], [1, "game-blocked-panel"], [1, "game-blocked-panel", "game-visibility-panel"], [1, "game-social-query-field"], ["type", "text", 3, "input", "value", "placeholder", "disabled"], ["id", "home-social-left-suggestions"], [3, "value"], ["id", "home-social-right-suggestions"], ["presentation", "fullscreen", 1, "home-smart-list", 3, "config", "loadPage", "fullscreenItemTemplate", "query"], [3, "card"], [3, "detailClick", "card"], ["presentation", "fullscreen", 1, "home-smart-list", 3, "stateChange", "config", "loadPage", "fullscreenItemTemplate", "query"], [3, "closed", "context", "saving"]], template: function HomeComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275conditionalCreate(0, HomeComponent_Conditional_0_Template, 1, 0, "div", 2)(1, HomeComponent_Conditional_1_Template, 8, 6, "div", 3);
      \u0275\u0275conditionalCreate(2, HomeComponent_Conditional_2_Template, 3, 0);
    }
    if (rf & 2) {
      \u0275\u0275conditional(ctx.isAccountReactivationPending ? 0 : 1);
      \u0275\u0275advance(2);
      \u0275\u0275conditional(!ctx.isAccountReactivationPending && ctx.localPopup === "filter" && ctx.gameFilterPopupContext ? 2 : -1);
    }
  }, dependencies: [
    CommonModule,
    NgClass,
    MatIconModule,
    MatIcon,
    HomeHeaderComponent,
    SmartListComponent,
    SingleCardComponent,
    PairCardComponent,
    I18nPipe
  ], styles: ['\n.game-page[_ngcontent-%COMP%] {\n  width: min(1160px, 100vw - 2rem);\n  margin: 0 auto;\n  min-height: calc(100vh - 2rem);\n  display: flex;\n  flex-direction: column;\n  border: 1px solid rgba(21, 38, 62, 0.14);\n  border-radius: 18px;\n  padding: 0.9rem;\n  box-sizing: border-box;\n  background:\n    radial-gradient(\n      circle at 20% -10%,\n      var(--deployment-brand-shadow),\n      transparent 36%),\n    radial-gradient(\n      circle at 95% 0%,\n      color-mix(in srgb, var(--deployment-brand-secondary) 14%, transparent),\n      transparent 34%),\n    #f8faff;\n}\n@media (max-width: 760px) {\n  .game-page[_ngcontent-%COMP%] {\n    width: 100%;\n    min-height: 100%;\n    height: 100%;\n    max-height: 100%;\n    border-radius: 18px;\n    padding: 0.9rem;\n    box-sizing: border-box;\n    overflow: hidden;\n  }\n}\n[_nghost-%COMP%] {\n  display: block;\n}\n.game-page.game-page-status-public[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #e6f6ef 0%,\n      #d9f0e6 100%);\n}\n.game-page.game-page-status-friends[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #e8f1fd 0%,\n      #dfeaf9 100%);\n}\n.game-page.game-page-status-host[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f6efe2 0%,\n      #eee4d2 100%);\n}\n.game-page.game-page-status-inactive[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f2f3f5 0%,\n      #e8ebef 100%);\n}\n.game-page.game-page-status-blocked[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #fff2f2 0%,\n      #f8dede 100%);\n  border-color: rgba(180, 52, 64, 0.28);\n}\n.game-page.game-page-status-offline[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #cbd0d7 0%,\n      #aeb5bf 100%);\n  border-color: rgba(35, 44, 57, 0.32);\n  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.34);\n}\n.game-page.game-page-reactivation-pending[_ngcontent-%COMP%] {\n  min-height: calc(100vh - 2rem);\n  border-color: transparent;\n  background: transparent;\n  box-shadow: none;\n}\n.game-layout-single[_ngcontent-%COMP%] {\n  margin-top: 0.68rem;\n  flex: 1 1 auto;\n  min-height: 0;\n  display: flex;\n  flex-direction: column;\n  gap: 0.56rem;\n  --game-stack-inline-gap: 0.28rem;\n}\n.game-social-query-bar[_ngcontent-%COMP%] {\n  margin-top: 0.6rem;\n  display: grid;\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n  gap: 0.72rem;\n  align-items: start;\n}\n.game-social-query-field[_ngcontent-%COMP%] {\n  min-width: 0;\n  display: block;\n}\n.game-social-query-field[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  width: 100%;\n  min-height: 36px;\n  padding: 0.54rem 0.8rem;\n  border-radius: 14px;\n  border: 1px solid rgba(31, 72, 114, 0.18);\n  background: rgba(255, 255, 255, 0.88);\n  color: #17304a;\n  font: inherit;\n  font-size: 0.78rem;\n  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.58);\n  box-sizing: border-box;\n}\n.game-social-query-field[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]:focus {\n  outline: none;\n  border-color: rgba(46, 105, 177, 0.42);\n  box-shadow: 0 0 0 3px rgba(108, 164, 232, 0.16);\n}\n.game-social-query-field[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]:disabled {\n  border-color: rgba(46, 54, 65, 0.16);\n  background: rgba(228, 231, 235, 0.82);\n  color: rgba(48, 56, 67, 0.48);\n  cursor: not-allowed;\n}\n.game-stack-progress-row[_ngcontent-%COMP%] {\n  flex: 0 0 auto;\n  padding: 0 var(--game-stack-inline-gap);\n}\n.game-card-deck[_ngcontent-%COMP%] {\n  position: relative;\n  flex: 1 1 auto;\n  min-height: 0;\n  display: flex;\n}\n.game-blocked-panel[_ngcontent-%COMP%] {\n  width: min(560px, 100%);\n  max-width: 100%;\n  margin: 4.2rem auto 0;\n  padding: 1.4rem;\n  border: 1px solid rgba(177, 54, 67, 0.24);\n  border-radius: 12px;\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 248, 248, 0.96),\n      rgba(253, 237, 237, 0.96));\n  color: #6b2630;\n  text-align: center;\n  box-shadow: 0 18px 44px rgba(117, 30, 42, 0.12);\n  box-sizing: border-box;\n  overflow-wrap: anywhere;\n}\n.game-blocked-panel[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 2.6rem;\n  height: 2.6rem;\n  font-size: 2.6rem;\n  color: #b13546;\n}\n.game-blocked-panel[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n  margin: 0.55rem 0 0.4rem;\n  font-size: 1.22rem;\n}\n.game-blocked-panel[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0.35rem auto;\n  max-width: 46ch;\n  color: #7a3a43;\n  line-height: 1.45;\n}\n.game-visibility-panel[_ngcontent-%COMP%] {\n  border-color: rgba(54, 83, 128, 0.22);\n  background:\n    linear-gradient(\n      180deg,\n      rgba(248, 251, 255, 0.96),\n      rgba(235, 241, 250, 0.96));\n  color: #243a59;\n  box-shadow: 0 18px 44px rgba(35, 58, 89, 0.12);\n}\n.game-visibility-panel[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #496f9f;\n}\n.game-visibility-panel[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  color: #405879;\n}\n.home-smart-list[_ngcontent-%COMP%] {\n  flex: 1 1 auto;\n  min-width: 0;\n  min-height: 0;\n}\n[_nghost-%COMP%]     .home-smart-list .smart-list__fullscreen-surface {\n  padding-top: 0;\n}\n.game-card-main[_ngcontent-%COMP%] {\n  border: 0;\n  border-radius: 14px;\n  background: transparent;\n  overflow: hidden;\n  position: relative;\n  display: flex;\n  flex-direction: column;\n  flex: 1 1 auto;\n  min-height: 0;\n}\n.game-card-main-active[_ngcontent-%COMP%] {\n  z-index: 1;\n}\n.game-card-main-leaving[_ngcontent-%COMP%] {\n  position: absolute;\n  inset: 0;\n  z-index: 3;\n  pointer-events: none;\n  transform-origin: top right;\n  animation: _ngcontent-%COMP%_game-card-page-curl 420ms cubic-bezier(0.18, 0.64, 0.24, 1) forwards;\n}\n@keyframes _ngcontent-%COMP%_game-card-page-curl {\n  0% {\n    transform: perspective(1400px) translateX(0) translateY(0) rotateY(0deg) rotateZ(0deg) scale(1);\n    opacity: 1;\n  }\n  30% {\n    transform: perspective(1400px) translateX(-8%) translateY(1%) rotateY(-24deg) rotateZ(-2deg) scale(0.995);\n    opacity: 0.96;\n  }\n  100% {\n    transform: perspective(1400px) translateX(-145%) translateY(8%) rotateY(-82deg) rotateZ(-11deg) scale(0.94);\n    opacity: 0;\n  }\n}\n.card-content[_ngcontent-%COMP%] {\n  padding: 0.7rem 0.76rem 0.44rem;\n}\n.card-content[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 1.1rem;\n  color: #1f2d44;\n}\n.card-content[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0.26rem 0 0;\n  color: rgba(21, 36, 58, 0.74);\n  font-size: 0.84rem;\n}\n.card-content.card-content-empty[_ngcontent-%COMP%] {\n  min-height: 92px;\n}\n.card-content.card-content-empty.card-content-empty-loading[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  color: rgba(32, 71, 113, 0.82);\n}\n.card-image-area[_ngcontent-%COMP%] {\n  margin: 0 var(--game-stack-inline-gap);\n  border-radius: 12px;\n  border: 0;\n  flex: 1 1 auto;\n  min-height: clamp(360px, 62vh, 760px);\n  background:\n    linear-gradient(\n      155deg,\n      rgba(219, 234, 255, 0.66),\n      rgba(255, 241, 230, 0.54)),\n    #f8fbff;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  position: relative;\n  overflow: hidden;\n}\n.game-pair-stack[_ngcontent-%COMP%] {\n  --game-pair-split: 50%;\n  --game-pair-gap: clamp(0.28rem, 0.8vw, 0.52rem);\n  --game-pair-pad: 0.42rem;\n  margin: 0 var(--game-stack-inline-gap);\n  flex: 1 1 auto;\n  min-height: 0;\n  display: grid;\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n  grid-template-rows: minmax(0, 1fr);\n  gap: var(--game-pair-gap);\n  padding: var(--game-pair-pad);\n  border: 1px solid rgba(34, 54, 84, 0.24);\n  border-radius: 14px;\n  background:\n    linear-gradient(\n      180deg,\n      #1b2c45 0%,\n      #132238 100%);\n  box-sizing: border-box;\n  position: relative;\n}\n.game-pair-stack.is-resizing[_ngcontent-%COMP%] {\n  -webkit-user-select: none;\n  user-select: none;\n}\n.game-pair-resize-handle[_ngcontent-%COMP%] {\n  display: none;\n}\n.game-pair-resize-handle-grip[_ngcontent-%COMP%] {\n  display: block;\n}\n.game-pair-mini-card[_ngcontent-%COMP%] {\n  position: relative;\n  border-radius: 12px;\n  border: 1px solid rgba(255, 255, 255, 0.28);\n  overflow: hidden;\n  min-height: 0;\n  background: rgba(8, 17, 30, 0.18);\n  box-shadow: 0 10px 22px rgba(6, 18, 36, 0.3);\n}\n.game-pair-mini-card.is-collapsed[_ngcontent-%COMP%] {\n  border-color: transparent;\n  box-shadow: none;\n}\n.game-pair-mini-card.is-collapsed[_ngcontent-%COMP%]   .game-pair-mini-card-content[_ngcontent-%COMP%] {\n  opacity: 0;\n  pointer-events: none;\n}\n.game-pair-mini-card-leaving[_ngcontent-%COMP%] {\n  position: absolute;\n  inset: 0;\n  border-radius: inherit;\n  overflow: hidden;\n  z-index: 5;\n  pointer-events: none;\n}\n.game-pair-mini-card-content[_ngcontent-%COMP%] {\n  width: 100%;\n  height: 100%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  position: relative;\n}\n.game-pair-mini-image-frame[_ngcontent-%COMP%] {\n  position: relative;\n  width: 100%;\n  height: 100%;\n  border-radius: 12px;\n  overflow: hidden;\n}\n.game-pair-mini-image-frame[_ngcontent-%COMP%]   .card-image-placeholder[_ngcontent-%COMP%] {\n  position: absolute;\n  left: 50%;\n  top: 50%;\n  transform: translate(-50%, -50%);\n}\n.game-pair-mini-photo[_ngcontent-%COMP%] {\n  width: 100%;\n  height: 100%;\n  object-fit: cover;\n  display: block;\n  border-radius: inherit;\n}\n.game-pair-mini-image-indicators[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 0.28rem;\n  left: 0.34rem;\n  right: 0.34rem;\n  margin: 0;\n  z-index: 10;\n  padding: 0.12rem 0.24rem;\n  border-radius: 7px;\n  background: rgba(10, 18, 31, 0.38);\n  gap: 5px;\n}\n.game-pair-mini-image-indicators[_ngcontent-%COMP%]   .game-image-stack-line[_ngcontent-%COMP%], \n.game-single-image-indicators[_ngcontent-%COMP%]   .game-image-stack-line[_ngcontent-%COMP%] {\n  height: 4px;\n  border: 1px solid rgba(28, 42, 64, 0.36);\n  background: rgba(167, 177, 192, 0.9);\n  opacity: 1;\n}\n.game-pair-mini-image-indicators[_ngcontent-%COMP%]   .game-image-stack-line.active[_ngcontent-%COMP%], \n.game-single-image-indicators[_ngcontent-%COMP%]   .game-image-stack-line.active[_ngcontent-%COMP%] {\n  border-color: rgba(248, 252, 255, 0.86);\n  background: rgba(250, 252, 255, 0.98);\n  box-shadow: 0 0 0 1px rgba(10, 20, 34, 0.12);\n}\n.game-pair-mini-image-indicators[_ngcontent-%COMP%]   .game-image-stack-line.active.is-loading[_ngcontent-%COMP%], \n.game-single-image-indicators[_ngcontent-%COMP%]   .game-image-stack-line.active.is-loading[_ngcontent-%COMP%] {\n  background: rgba(229, 236, 245, 0.98);\n  animation: _ngcontent-%COMP%_game-image-line-loading 500ms ease 1;\n}\n.game-pair-mini-image-indicators[_ngcontent-%COMP%]   .game-image-stack-line.active.is-revealing[_ngcontent-%COMP%], \n.game-single-image-indicators[_ngcontent-%COMP%]   .game-image-stack-line.active.is-revealing[_ngcontent-%COMP%] {\n  animation: _ngcontent-%COMP%_game-image-line-reveal 240ms ease-out 1;\n}\n.game-pair-mini-image-frame[_ngcontent-%COMP%]   .game-image-hit-area[_ngcontent-%COMP%] {\n  z-index: 2;\n}\n.game-pair-mini-card-label[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 0.64rem;\n  left: 0.52rem;\n  z-index: 5;\n  border-radius: 999px;\n  border: 1px solid rgba(212, 229, 249, 0.42);\n  background: rgba(8, 18, 35, 0.62);\n  color: #f5f9ff;\n  font-size: 0.68rem;\n  font-weight: 700;\n  letter-spacing: 0.02em;\n  line-height: 1;\n  padding: 0.16rem 0.45rem;\n}\n.game-pair-mini-card-woman[_ngcontent-%COMP%]   .game-pair-mini-card-label[_ngcontent-%COMP%] {\n  background: rgba(109, 42, 118, 0.64);\n}\n.game-pair-mini-card-man[_ngcontent-%COMP%]   .game-pair-mini-card-label[_ngcontent-%COMP%] {\n  background: rgba(36, 74, 127, 0.66);\n}\n.game-pair-mini-card[_ngcontent-%COMP%]   .game-card-image-overlay[_ngcontent-%COMP%] {\n  left: 0;\n  right: 0;\n  bottom: 0;\n  padding: 0.7rem 0.72rem 0.68rem;\n  border-radius: 0;\n}\n.game-pair-rating-badge[_ngcontent-%COMP%] {\n  position: absolute;\n  bottom: 4.5rem;\n  transform: translate(-50%, 0);\n  left: var(--game-pair-split, 50%);\n  right: auto;\n  z-index: 32;\n  min-height: 26px;\n  border: 2px solid rgba(187, 136, 22, 0.58);\n  border-radius: 999px;\n  background:\n    linear-gradient(\n      180deg,\n      #fff9e9 0%,\n      #fff1cb 100%);\n  color: #9f6915;\n  font-size: 0.76rem;\n  font-weight: 800;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.24rem;\n  padding: 0.16rem 0.56rem;\n  box-shadow: inset 0 0 0 1px rgba(255, 245, 215, 0.72), 0 8px 16px rgba(10, 22, 40, 0.28);\n  white-space: nowrap;\n  pointer-events: none;\n}\n.game-pair-rating-badge[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 14px;\n  height: 14px;\n  font-size: 14px;\n  line-height: 14px;\n}\n.game-pair-rating-badge.is-blink[_ngcontent-%COMP%] {\n  animation: _ngcontent-%COMP%_game-rating-stars-blink 0.42s ease-in-out 1;\n}\n.game-card-active-badge[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 0.64rem;\n  right: 0.56rem;\n  z-index: 11;\n  border-radius: 999px;\n  border: 1px solid rgba(148, 225, 182, 0.56);\n  background: rgba(8, 34, 18, 0.74);\n  color: #e9ffef;\n  font-size: 0.68rem;\n  font-weight: 700;\n  letter-spacing: 0.01em;\n  line-height: 1;\n  padding: 0.17rem 0.5rem;\n  pointer-events: none;\n  white-space: nowrap;\n  max-width: calc(100% - 1.24rem);\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.game-card-active-badge-leaving[_ngcontent-%COMP%] {\n  animation: _ngcontent-%COMP%_game-card-active-badge-leaving 420ms cubic-bezier(0.18, 0.64, 0.24, 1) forwards;\n}\n@keyframes _ngcontent-%COMP%_game-card-active-badge-leaving {\n  0% {\n    opacity: 1;\n    transform: translate3d(0, 0, 0) scale(1);\n  }\n  45% {\n    opacity: 0.9;\n    transform: translate3d(-1px, 1px, 0) scale(0.98);\n  }\n  100% {\n    opacity: 0;\n    transform: translate3d(-4px, 6px, 0) scale(0.9);\n  }\n}\n.game-pair-mini-card-empty[_ngcontent-%COMP%] {\n  position: relative;\n  width: 100%;\n  height: 100%;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  gap: 0.3rem;\n  color: rgba(28, 42, 61, 0.78);\n  text-align: center;\n}\n.game-pair-mini-card-empty[_ngcontent-%COMP%]   .card-image-placeholder[_ngcontent-%COMP%] {\n  width: 66px;\n  height: 66px;\n  font-size: 1.26rem;\n}\n.game-pair-mini-card-empty[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 0.74rem;\n  font-weight: 600;\n}\n.game-image-load-probe[_ngcontent-%COMP%] {\n  position: absolute;\n  width: 1px;\n  height: 1px;\n  opacity: 0;\n  pointer-events: none;\n}\n.card-image-content[_ngcontent-%COMP%] {\n  width: 100%;\n  min-height: inherit;\n  height: 100%;\n  background-position: center;\n  background-size: cover;\n  background-repeat: no-repeat;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  transform-origin: center;\n  transition: transform 0.14s ease-out;\n  cursor: default;\n  position: relative;\n  touch-action: none;\n}\n.game-card-image-overlay[_ngcontent-%COMP%] {\n  position: absolute;\n  left: 0.72rem;\n  right: 0.72rem;\n  top: auto;\n  bottom: 0.68rem;\n  z-index: 4;\n  border-radius: 12px;\n  padding: 0.54rem 0.66rem 0.6rem;\n  background:\n    linear-gradient(\n      180deg,\n      rgba(8, 18, 35, 0.72) 0%,\n      rgba(8, 18, 35, 0.46) 72%,\n      rgba(8, 18, 35, 0.16) 100%);\n  color: #f5f9ff;\n  border: 1px solid rgba(213, 227, 248, 0.22);\n  -webkit-backdrop-filter: blur(2px);\n  backdrop-filter: blur(2px);\n  pointer-events: none;\n}\n.game-card-image-overlay-primary[_ngcontent-%COMP%], \n.game-card-image-overlay-secondary[_ngcontent-%COMP%] {\n  margin: 0;\n  text-shadow: 0 1px 2px rgba(5, 10, 20, 0.5);\n}\n.game-card-image-overlay-primary[_ngcontent-%COMP%] {\n  font-size: 0.95rem;\n  font-weight: 800;\n  letter-spacing: 0.01em;\n  line-height: 1.2;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.game-card-image-overlay-secondary[_ngcontent-%COMP%] {\n  margin-top: 0.24rem;\n  font-size: 0.77rem;\n  font-weight: 600;\n  line-height: 1.28;\n  color: rgba(229, 239, 255, 0.94);\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.card-image-content.is-draggable[_ngcontent-%COMP%] {\n  cursor: grab;\n}\n.card-image-content.is-draggable[_ngcontent-%COMP%]:active {\n  cursor: grabbing;\n}\n.game-image-stack-indicators[_ngcontent-%COMP%] {\n  margin: 0 0.72rem 0.42rem;\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(0, 1fr));\n  gap: 4px;\n}\n.game-single-image-indicators[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 0.2rem;\n  left: 0.52rem;\n  right: 0.52rem;\n  margin: 0;\n  z-index: 10;\n  padding: 0.16rem 0.34rem;\n  border-radius: 8px;\n  background: rgba(10, 18, 31, 0.38);\n  gap: 5px;\n}\n.game-image-stack-line[_ngcontent-%COMP%] {\n  border: 0;\n  height: 3px;\n  border-radius: 999px;\n  background: rgba(242, 181, 93, 0.68);\n  cursor: pointer;\n  padding: 0;\n  transform-origin: center center;\n}\n.game-image-stack-line.active[_ngcontent-%COMP%] {\n  background: rgba(116, 255, 193, 0.98);\n}\n.game-image-stack-line.active.is-loading[_ngcontent-%COMP%] {\n  background: rgba(229, 236, 245, 0.98);\n  animation: _ngcontent-%COMP%_game-image-line-loading 500ms ease 1;\n}\n.game-image-stack-line.active.is-revealing[_ngcontent-%COMP%] {\n  animation: _ngcontent-%COMP%_game-image-line-reveal 240ms ease-out 1;\n}\n@keyframes _ngcontent-%COMP%_game-image-line-loading {\n  0% {\n    transform: scaleX(0.84);\n    opacity: 0.58;\n  }\n  100% {\n    transform: scaleX(1);\n    opacity: 1;\n  }\n}\n@keyframes _ngcontent-%COMP%_game-image-line-reveal {\n  0% {\n    transform: scaleX(0.92);\n    opacity: 0.88;\n    background: rgba(215, 225, 238, 0.95);\n  }\n  100% {\n    transform: scaleX(1);\n    opacity: 1;\n    background: rgba(250, 252, 255, 0.98);\n  }\n}\n.game-image-hit-area[_ngcontent-%COMP%] {\n  position: absolute;\n  inset: 0;\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(0, 1fr));\n  gap: 4px;\n  z-index: 2;\n}\n.game-image-hit-segment[_ngcontent-%COMP%] {\n  border: 0;\n  background: transparent;\n  padding: 0;\n  cursor: pointer;\n  width: 100%;\n  height: 100%;\n}\n.card-image-placeholder[_ngcontent-%COMP%] {\n  width: 84px;\n  height: 84px;\n  border-radius: 50%;\n  background:\n    linear-gradient(\n      145deg,\n      #4f7cff,\n      #7a3eff 60%,\n      #f04eab);\n  color: #fff;\n  font-weight: 800;\n  font-size: 1.72rem;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  letter-spacing: 0.03em;\n}\n.rating-stars[_ngcontent-%COMP%] {\n  margin: 0.56rem var(--game-stack-inline-gap) 0.72rem;\n  flex: 0 0 auto;\n  display: grid;\n  grid-template-columns: repeat(10, minmax(0, 1fr));\n  gap: 0.28rem;\n}\n.game-rating-dock[_ngcontent-%COMP%] {\n  flex: 0 0 auto;\n  padding: 0 var(--game-stack-inline-gap) 0.72rem;\n}\n.game-rating-dock[_ngcontent-%COMP%]   .rating-stars[_ngcontent-%COMP%] {\n  margin: 0;\n}\n.rating-stars.rating-stars-static[_ngcontent-%COMP%]   .star-btn[_ngcontent-%COMP%] {\n  pointer-events: none;\n  cursor: default;\n}\n.rating-stars.is-blink[_ngcontent-%COMP%] {\n  animation: _ngcontent-%COMP%_game-rating-stars-blink 0.42s ease-in-out 1;\n}\n.star-btn[_ngcontent-%COMP%] {\n  width: 100%;\n  min-width: 0;\n  min-height: 31px;\n  border-radius: 999px;\n  border: 1px solid rgba(22, 40, 64, 0.22);\n  background: #fff;\n  color: rgba(96, 111, 133, 0.9);\n  font-size: 0.98rem;\n  line-height: 1;\n  cursor: pointer;\n  will-change: transform, opacity;\n  backface-visibility: hidden;\n}\n.star-btn.filled[_ngcontent-%COMP%] {\n  color: #f2ba31;\n  border-color: rgba(193, 145, 34, 0.44);\n  background:\n    linear-gradient(\n      180deg,\n      #fff9e9 0%,\n      #fff2d0 100%);\n}\n@keyframes _ngcontent-%COMP%_game-rating-stars-blink {\n  0%, 100% {\n    filter: brightness(1);\n  }\n  50% {\n    filter: brightness(1.12) saturate(1.1);\n  }\n}\n.game-popup[_ngcontent-%COMP%] {\n  position: fixed;\n  inset: 0;\n  z-index: 2200;\n  display: flex;\n  align-items: flex-start;\n  justify-content: center;\n  padding: 1rem;\n}\n.game-popup-backdrop[_ngcontent-%COMP%] {\n  position: absolute;\n  inset: 0;\n  background: rgba(0, 0, 0, 0.44);\n}\n.game-popup-panel[_ngcontent-%COMP%] {\n  position: relative;\n  z-index: 1;\n  width: min(680px, 100vw - 1rem);\n  border-radius: 12px;\n  background: #fff;\n  border: 1px solid rgba(15, 23, 42, 0.14);\n  overflow: hidden;\n}\n.game-popup-panel[_ngcontent-%COMP%]   header[_ngcontent-%COMP%] {\n  padding: 0.58rem 0.72rem;\n  border-bottom: 1px solid rgba(15, 23, 42, 0.1);\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n}\n.game-popup-panel[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 1rem;\n  color: #1f2d44;\n}\n.game-filter-popup-header[_ngcontent-%COMP%] {\n  padding: 0.62rem 0.72rem;\n}\n.game-filter-popup-header-actions[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.44rem;\n  transition: opacity 0.14s ease;\n}\n.game-filter-popup-header-actions.is-hidden[_ngcontent-%COMP%] {\n  opacity: 0;\n  visibility: hidden;\n  pointer-events: none;\n}\n.popup-filter-meta[_ngcontent-%COMP%] {\n  border: 1px solid rgba(67, 95, 131, 0.24);\n  border-radius: 999px;\n  background: #eef4ff;\n  color: #2b4e79;\n  font-size: 0.68rem;\n  font-weight: 700;\n  line-height: 1;\n  padding: 0.22rem 0.46rem;\n}\n.popup-filter-meta.active[_ngcontent-%COMP%] {\n  background: #e8f8ee;\n  border-color: rgba(63, 148, 88, 0.32);\n  color: #22603c;\n}\n.game-popup-close-btn[_ngcontent-%COMP%] {\n  width: 32px;\n  height: 32px;\n  border: 1px solid rgba(64, 90, 123, 0.26);\n  border-radius: 999px;\n  background:\n    linear-gradient(\n      180deg,\n      #f2f7ff 0%,\n      #e8f1ff 100%);\n  color: #375e92;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  cursor: pointer;\n  padding: 0;\n}\n.game-popup-close-btn[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 18px;\n  height: 18px;\n  font-size: 18px;\n  line-height: 18px;\n}\n.game-popup-apply-btn[_ngcontent-%COMP%] {\n  width: 32px;\n  height: 32px;\n  border: 1px solid rgba(63, 148, 88, 0.38);\n  border-radius: 999px;\n  background:\n    linear-gradient(\n      180deg,\n      #d9f3df 0%,\n      #c6e9cf 100%);\n  color: #26653c;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  cursor: pointer;\n  padding: 0;\n}\n.game-popup-apply-btn[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 18px;\n  height: 18px;\n  font-size: 18px;\n  line-height: 18px;\n}\n.game-popup-panel[_ngcontent-%COMP%]    > header[_ngcontent-%COMP%]    > button[_ngcontent-%COMP%] {\n  border: 1px solid rgba(15, 23, 42, 0.2);\n  border-radius: 999px;\n  background: #fff;\n  color: #1f2d44;\n  font: inherit;\n  font-size: 0.8rem;\n  padding: 0.28rem 0.64rem;\n  cursor: pointer;\n}\n.game-popup-body[_ngcontent-%COMP%] {\n  padding: 0.75rem;\n  display: grid;\n  gap: 0.45rem;\n}\n.game-popup-body[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0;\n  color: rgba(15, 23, 42, 0.72);\n}\n.game-filter-popup-panel[_ngcontent-%COMP%] {\n  width: min(1160px, 100vw - 2rem);\n  height: calc(100vh - 2rem);\n  height: calc(100dvh - 2rem);\n  max-height: calc(100vh - 2rem);\n  max-height: calc(100dvh - 2rem);\n  box-sizing: border-box;\n  border-radius: 14px;\n  border-color: rgba(31, 56, 89, 0.18);\n  background:\n    linear-gradient(\n      180deg,\n      #ffffff 0%,\n      #f8fbff 100%);\n  display: flex;\n  flex-direction: column;\n}\n.game-filter-body[_ngcontent-%COMP%] {\n  position: relative;\n  flex: 1 1 auto;\n  min-height: 0;\n  overflow: auto;\n  padding: 0.4rem;\n  grid-template-columns: 1fr;\n  gap: 0.72rem;\n  align-items: start;\n}\n.game-filter-body.has-selector-open[_ngcontent-%COMP%] {\n  overflow: hidden;\n}\n.game-filter-body.has-selector-open[_ngcontent-%COMP%]   .game-filter-layout-columns[_ngcontent-%COMP%] {\n  pointer-events: none;\n  -webkit-user-select: none;\n  user-select: none;\n}\n.game-filter-layout-columns[_ngcontent-%COMP%] {\n  grid-column: 1/-1;\n  display: grid;\n  grid-template-columns: 1fr;\n  gap: 0.72rem;\n  align-items: start;\n}\n.game-filter-layout-col[_ngcontent-%COMP%] {\n  min-width: 0;\n  display: grid;\n  gap: 0.72rem;\n  align-content: start;\n}\n.game-filter-group[_ngcontent-%COMP%] {\n  border: 1px solid rgba(105, 126, 156, 0.24);\n  border-radius: 14px;\n  background:\n    linear-gradient(\n      180deg,\n      #f8fbff 0%,\n      #edf4ff 100%);\n  padding: 0.62rem;\n  display: grid;\n  gap: 0.48rem;\n}\n.game-filter-group-head[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  padding-bottom: 0.22rem;\n  border-bottom: 1px solid rgba(74, 102, 139, 0.22);\n}\n.game-filter-group-head[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 0.84rem;\n  letter-spacing: 0.01em;\n  color: #20385c;\n}\n.game-filter-group-basics[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f2f7ff 0%,\n      #e8f0fb 100%);\n  border-color: rgba(58, 108, 168, 0.28);\n}\n.game-filter-group-basics[_ngcontent-%COMP%]   .game-filter-group-head[_ngcontent-%COMP%] {\n  border-bottom-color: rgba(58, 108, 168, 0.24);\n}\n.game-filter-group-basics[_ngcontent-%COMP%]   .game-filter-group-head[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n  color: #214772;\n}\n.game-filter-group-beliefs[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f4f1ff 0%,\n      #ebe6fb 100%);\n  border-color: rgba(98, 84, 163, 0.28);\n}\n.game-filter-group-beliefs[_ngcontent-%COMP%]   .game-filter-group-head[_ngcontent-%COMP%] {\n  border-bottom-color: rgba(98, 84, 163, 0.24);\n}\n.game-filter-group-beliefs[_ngcontent-%COMP%]   .game-filter-group-head[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n  color: #4f438b;\n}\n.game-filter-group-lifestyle[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #eef8f3 0%,\n      #e4f2ea 100%);\n  border-color: rgba(49, 124, 82, 0.28);\n}\n.game-filter-group-lifestyle[_ngcontent-%COMP%]   .game-filter-group-head[_ngcontent-%COMP%] {\n  border-bottom-color: rgba(49, 124, 82, 0.24);\n}\n.game-filter-group-lifestyle[_ngcontent-%COMP%]   .game-filter-group-head[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n  color: #2f6f45;\n}\n.game-filter-group-relationships[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #fff4ee 0%,\n      #f7e9df 100%);\n  border-color: rgba(160, 90, 51, 0.28);\n}\n.game-filter-group-relationships[_ngcontent-%COMP%]   .game-filter-group-head[_ngcontent-%COMP%] {\n  border-bottom-color: rgba(160, 90, 51, 0.24);\n}\n.game-filter-group-relationships[_ngcontent-%COMP%]   .game-filter-group-head[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n  color: #7d4e33;\n}\n.game-filter-section-head[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.4rem;\n}\n.game-filter-section-head[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 0.82rem;\n  color: #213b5f;\n}\n.game-filter-value-badge[_ngcontent-%COMP%] {\n  border: 1px solid rgba(39, 73, 114, 0.22);\n  border-radius: 999px;\n  background:\n    linear-gradient(\n      180deg,\n      #f0f6ff 0%,\n      #e6eefb 100%);\n  color: #22436a;\n  font-size: 0.74rem;\n  font-weight: 800;\n  line-height: 1;\n  padding: 0.26rem 0.5rem;\n  white-space: nowrap;\n}\n.game-filter-slider-wrap[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.44rem;\n  padding: 0 2rem;\n  overflow: hidden;\n}\n.game-filter-slider-wrap[_ngcontent-%COMP%]   mat-slider[_ngcontent-%COMP%] {\n  width: 100%;\n}\n.game-filter-group-basics[_ngcontent-%COMP%]   .game-filter-slider-wrap[_ngcontent-%COMP%]   mat-slider[_ngcontent-%COMP%] {\n  --mdc-slider-active-track-color: #2f6fbe;\n  --mdc-slider-inactive-track-color: rgba(57, 88, 130, 0.36);\n  --mdc-slider-handle-color: #1463be;\n  --mdc-slider-focus-handle-color: #1463be;\n  --mdc-slider-hover-handle-color: #1463be;\n  --mdc-slider-pressed-handle-color: #0f5bac;\n}\n[_nghost-%COMP%]     .game-filter-slider-wrap .mdc-slider__thumb::before, \n[_nghost-%COMP%]     .game-filter-slider-wrap .mdc-slider__thumb::after {\n  display: none;\n}\n[_nghost-%COMP%]     .game-filter-group-basics .game-filter-slider-wrap .mdc-slider__track--inactive {\n  background-color: rgba(57, 88, 130, 0.36) !important;\n  opacity: 1;\n}\n[_nghost-%COMP%]     .game-filter-group-basics .game-filter-slider-wrap .mdc-slider__track--active_fill {\n  border-color: #2f6fbe !important;\n}\n.game-filter-nav-btn[_ngcontent-%COMP%] {\n  position: relative;\n  width: 100%;\n  border-radius: 12px;\n  border: 1px solid rgba(34, 66, 106, 0.24);\n  background:\n    linear-gradient(\n      180deg,\n      #f6faff 0%,\n      #ebf2ff 100%);\n  color: #1f3d64;\n  font: inherit;\n  display: inline-flex;\n  align-items: center;\n  justify-content: flex-start;\n  gap: 0.5rem;\n  text-align: left;\n  cursor: pointer;\n  padding: 0.5rem 0.56rem 0.5rem 0.62rem;\n}\n.game-filter-nav-copy[_ngcontent-%COMP%] {\n  flex: 1 1 auto;\n  min-width: 0;\n  display: grid;\n  gap: 0;\n}\n.game-filter-nav-title[_ngcontent-%COMP%] {\n  display: block;\n  font-size: 0.78rem;\n  font-weight: 800;\n  line-height: 1.12;\n  padding-right: 2.9rem;\n  padding-bottom: 0.3rem;\n  margin-bottom: 0.34rem;\n  border-bottom: 1px solid rgba(64, 94, 132, 0.28);\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.game-filter-nav-summary[_ngcontent-%COMP%] {\n  margin-top: 0;\n  font-size: 0.72rem;\n  color: rgba(32, 55, 87, 0.82);\n  line-height: 1.2;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.game-filter-nav-summary-muted[_ngcontent-%COMP%] {\n  color: rgba(47, 67, 97, 0.56);\n}\n.game-filter-nav-separator[_ngcontent-%COMP%] {\n  display: none;\n}\n.game-filter-nav-badge-row[_ngcontent-%COMP%] {\n  min-width: 0;\n  display: flex;\n  align-items: center;\n  gap: 0.3rem;\n  overflow: hidden;\n}\n.game-filter-nav-badge-chip[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  min-width: 0;\n  max-width: 100%;\n  border-radius: 9px;\n  border: 1px solid var(--game-filter-nav-chip-border, rgba(79, 103, 138, 0.28));\n  background: var(--game-filter-nav-chip-bg, linear-gradient(180deg, #edf3fb 0%, #e3ebf8 100%));\n  color: var(--game-filter-nav-chip-color, #2f4f77);\n  font-size: 0.74rem;\n  font-weight: 700;\n  line-height: 1;\n  padding: 0.28rem 0.54rem;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.game-filter-nav-overflow-inline[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 0.15rem;\n  right: 2.1rem;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  min-width: 1.9rem;\n  border-radius: 9px;\n  border: 1px solid var(--game-filter-nav-chip-border, rgba(88, 105, 127, 0.34));\n  background: var(--game-filter-nav-chip-bg, linear-gradient(180deg, #eef2f7 0%, #e4e9f0 100%));\n  color: var(--game-filter-nav-chip-color, #4a5f78);\n  font-size: 0.74rem;\n  font-weight: 800;\n  line-height: 1;\n  padding: 0.26rem 0.5rem;\n  white-space: nowrap;\n}\n.game-filter-nav-btn[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  align-self: center;\n  flex: 0 0 20px;\n  width: 20px;\n  height: 20px;\n  font-size: 20px;\n  line-height: 20px;\n  color: rgba(36, 65, 103, 0.68);\n}\n.game-filter-chip-grid[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 0.36rem;\n}\n.game-filter-chip[_ngcontent-%COMP%] {\n  border: 1px solid rgba(41, 70, 106, 0.22);\n  border-radius: 999px;\n  background: #f4f8ff;\n  color: #234066;\n  font: inherit;\n  font-size: 0.78rem;\n  font-weight: 700;\n  padding: 0.3rem 0.58rem;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.26rem;\n  cursor: pointer;\n  transition:\n    background-color 0.14s ease,\n    border-color 0.14s ease,\n    color 0.14s ease,\n    box-shadow 0.14s ease;\n}\n.game-filter-chip[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 14px;\n  height: 14px;\n  font-size: 14px;\n  line-height: 14px;\n}\n.game-filter-chip.active[_ngcontent-%COMP%] {\n  border-color: rgba(27, 85, 158, 0.5);\n  background:\n    linear-gradient(\n      180deg,\n      #dcebff 0%,\n      #cfe3ff 100%);\n  color: #123e70;\n  box-shadow: inset 0 0 0 1px rgba(30, 73, 127, 0.24), 0 1px 2px rgba(24, 53, 86, 0.16);\n}\n.game-filter-group-relationships[_ngcontent-%COMP%] {\n  grid-template-columns: 1fr;\n  align-content: start;\n}\n.game-filter-group-relationships[_ngcontent-%COMP%]   .game-filter-group-head[_ngcontent-%COMP%] {\n  grid-column: 1/-1;\n}\n.game-filter-group-relationships[_ngcontent-%COMP%]   .game-filter-nav-btn[_ngcontent-%COMP%] {\n  min-width: 0;\n}\n.game-filter-selector-overlay[_ngcontent-%COMP%] {\n  position: absolute;\n  inset: 0;\n  z-index: 7;\n  display: flex;\n  align-items: flex-start;\n  justify-content: center;\n  padding: 0.4rem;\n  pointer-events: auto;\n  background: rgba(241, 246, 255, 0.72);\n  -webkit-backdrop-filter: blur(1px);\n  backdrop-filter: blur(1px);\n}\n.game-filter-selector-panel[_ngcontent-%COMP%] {\n  border: 1px solid rgba(31, 56, 89, 0.18);\n  border-radius: 14px;\n  background:\n    linear-gradient(\n      180deg,\n      #ffffff 0%,\n      #f8fbff 100%);\n  position: relative;\n  width: 100%;\n  padding: 0.62rem;\n  display: flex;\n  flex-direction: column;\n  gap: 0.48rem;\n  align-items: stretch;\n  align-content: flex-start;\n  justify-content: flex-start;\n  pointer-events: auto;\n  height: auto;\n  max-height: 100%;\n  margin: 0;\n  overflow: auto;\n  box-shadow: 0 18px 34px rgba(12, 26, 46, 0.26);\n}\n.game-filter-selector-head[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.44rem;\n  padding-bottom: 0.22rem;\n  border-bottom: 1px solid rgba(74, 102, 139, 0.22);\n}\n.game-filter-selector-back[_ngcontent-%COMP%] {\n  border: 0;\n  background: transparent;\n  color: #203c64;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.28rem;\n  font: inherit;\n  font-size: 0.82rem;\n  font-weight: 800;\n  padding: 0;\n  cursor: pointer;\n}\n.game-filter-selector-back[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n  line-height: 16px;\n}\n.game-filter-selector-clear[_ngcontent-%COMP%] {\n  border: 1px solid rgba(41, 73, 110, 0.24);\n  border-radius: 999px;\n  background: rgba(255, 255, 255, 0.82);\n  color: #284970;\n  font: inherit;\n  font-size: 0.72rem;\n  font-weight: 700;\n  line-height: 1;\n  padding: 0.3rem 0.52rem;\n  cursor: pointer;\n}\n.game-filter-selector-selected[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 0.34rem;\n}\n.game-filter-selector-chip[_ngcontent-%COMP%] {\n  border: 1px solid rgba(35, 68, 107, 0.24);\n  border-radius: 999px;\n  background: rgba(255, 255, 255, 0.92);\n  color: #234368;\n  font: inherit;\n  font-size: 0.72rem;\n  font-weight: 700;\n  line-height: 1;\n  padding: 0.26rem 0.48rem;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.16rem;\n  cursor: pointer;\n}\n.game-filter-selector-chip[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 13px;\n  height: 13px;\n  font-size: 13px;\n  line-height: 13px;\n}\n.game-filter-selector-empty[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 0.74rem;\n  color: rgba(31, 54, 86, 0.62);\n  font-style: italic;\n}\n.game-filter-language-entry[_ngcontent-%COMP%] {\n  margin-top: 0.08rem;\n}\n.game-filter-language-input-wrap[_ngcontent-%COMP%] {\n  position: relative;\n  display: block;\n}\n.game-filter-language-input-wrap[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  width: 100%;\n  box-sizing: border-box;\n  border: 1px solid rgba(58, 81, 114, 0.24);\n  border-radius: 10px;\n  padding: 0.5rem 2.1rem 0.5rem 0.58rem;\n  background: #f8fafd;\n  color: #213d61;\n  font: inherit;\n}\n.game-filter-language-submit-btn[_ngcontent-%COMP%] {\n  position: absolute;\n  right: 0.38rem;\n  top: 50%;\n  transform: translateY(-50%);\n  width: 28px;\n  height: 28px;\n  border: 1px solid rgba(56, 83, 119, 0.24);\n  border-radius: 8px;\n  background:\n    linear-gradient(\n      180deg,\n      #edf3fb 0%,\n      #e3ecf8 100%);\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  cursor: pointer;\n  padding: 0;\n}\n.game-filter-language-submit-btn[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n  line-height: 16px;\n  color: #34577f;\n}\n.game-filter-language-options[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.35rem;\n  max-height: min(48vh, 360px);\n  overflow-y: auto;\n  padding-right: 0.06rem;\n}\n.game-filter-language-option[_ngcontent-%COMP%] {\n  width: 100%;\n  border: 1px solid rgba(62, 89, 121, 0.22);\n  border-radius: 12px;\n  background:\n    linear-gradient(\n      180deg,\n      #eef3fb 0%,\n      #e6edf8 100%);\n  color: #2b4a70;\n  font: inherit;\n  font-size: 0.9rem;\n  padding: 0.56rem 0.62rem;\n  text-align: left;\n  display: inline-flex;\n  align-items: center;\n  justify-content: flex-start;\n  cursor: pointer;\n}\n.game-filter-language-option-main[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.42rem;\n}\n.game-filter-language-option-main[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n  line-height: 16px;\n}\n.game-filter-language-option.game-filter-language-tone-1[_ngcontent-%COMP%], \n.game-filter-selector-chip.game-filter-language-tone-1[_ngcontent-%COMP%] {\n  background: #eaf4ff;\n  border-color: rgba(63, 122, 179, 0.34);\n  color: #2f6090;\n}\n.game-filter-language-option.game-filter-language-tone-2[_ngcontent-%COMP%], \n.game-filter-selector-chip.game-filter-language-tone-2[_ngcontent-%COMP%] {\n  background: #edf8f4;\n  border-color: rgba(75, 127, 113, 0.34);\n  color: #2f695b;\n}\n.game-filter-language-option.game-filter-language-tone-3[_ngcontent-%COMP%], \n.game-filter-selector-chip.game-filter-language-tone-3[_ngcontent-%COMP%] {\n  background: #f1f2ff;\n  border-color: rgba(70, 95, 187, 0.34);\n  color: #394f9c;\n}\n.game-filter-language-option.game-filter-language-tone-4[_ngcontent-%COMP%], \n.game-filter-selector-chip.game-filter-language-tone-4[_ngcontent-%COMP%] {\n  background: #fff2f8;\n  border-color: rgba(161, 72, 117, 0.34);\n  color: #8d3f66;\n}\n.game-filter-language-option.game-filter-language-tone-5[_ngcontent-%COMP%], \n.game-filter-selector-chip.game-filter-language-tone-5[_ngcontent-%COMP%] {\n  background: #fbf4ea;\n  border-color: rgba(125, 79, 36, 0.34);\n  color: #704822;\n}\n.game-filter-language-option.game-filter-language-tone-6[_ngcontent-%COMP%], \n.game-filter-selector-chip.game-filter-language-tone-6[_ngcontent-%COMP%] {\n  background: #eff4f9;\n  border-color: rgba(77, 102, 127, 0.34);\n  color: #415872;\n}\n.game-filter-language-option.game-filter-language-tone-7[_ngcontent-%COMP%], \n.game-filter-selector-chip.game-filter-language-tone-7[_ngcontent-%COMP%] {\n  background: #f7f5ea;\n  border-color: rgba(128, 109, 66, 0.34);\n  color: #746237;\n}\n.game-filter-language-option.game-filter-language-tone-8[_ngcontent-%COMP%], \n.game-filter-selector-chip.game-filter-language-tone-8[_ngcontent-%COMP%] {\n  background: #edf5ff;\n  border-color: rgba(45, 122, 160, 0.34);\n  color: #2f6782;\n}\n.game-filter-selector-option-group[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.34rem;\n  border: 1px solid transparent;\n  border-radius: 12px;\n  padding: 0.4rem 0.42rem;\n}\n.game-filter-selector-option-group-head[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.34rem;\n}\n.game-filter-selector-option-group-tag[_ngcontent-%COMP%] {\n  border-radius: 999px;\n  border: 1px solid rgba(52, 86, 128, 0.28);\n  background: rgba(255, 255, 255, 0.74);\n  color: #2f527d;\n  font-size: 0.67rem;\n  font-weight: 800;\n  letter-spacing: 0.02em;\n  line-height: 1;\n  padding: 0.2rem 0.52rem;\n  text-transform: uppercase;\n  white-space: nowrap;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.24rem;\n}\n.game-filter-selector-option-group-tag-icon[_ngcontent-%COMP%] {\n  width: 12px;\n  height: 12px;\n  font-size: 12px;\n  line-height: 12px;\n  text-transform: none;\n}\n.game-filter-selector-option-group-line[_ngcontent-%COMP%] {\n  display: block;\n  height: 1px;\n  width: 100%;\n  background: rgba(84, 111, 147, 0.34);\n}\n.game-filter-actions[_ngcontent-%COMP%] {\n  grid-column: 1/-1;\n  display: flex;\n  justify-content: flex-end;\n  gap: 0.44rem;\n  padding-top: 0.12rem;\n}\n.filter-btn[_ngcontent-%COMP%] {\n  border-radius: 10px;\n  border: 1px solid rgba(36, 64, 99, 0.24);\n  font: inherit;\n  font-size: 0.82rem;\n  font-weight: 700;\n  padding: 0.42rem 0.68rem;\n  cursor: pointer;\n}\n.filter-btn.filter-btn-reset[_ngcontent-%COMP%] {\n  background: #fff;\n  color: #1f3659;\n}\n.filter-btn.filter-btn-apply[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #4f8fdf 0%,\n      #3e79c4 100%);\n  border-color: rgba(34, 96, 176, 0.46);\n  color: #fff;\n}\n.game-filter-selector-tone-interest[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #eaf8f5 0%,\n      #e0f2ee 100%);\n  border-color: rgba(45, 125, 120, 0.32);\n  --game-filter-nav-chip-bg:\n    linear-gradient(\n      180deg,\n      #dff1ec 0%,\n      #d2e8e1 100%);\n  --game-filter-nav-chip-border: rgba(45, 125, 120, 0.42);\n  --game-filter-nav-chip-color: #2a6662;\n}\n.game-filter-selector-tone-values[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f0ecff 0%,\n      #e8e1fa 100%);\n  border-color: rgba(95, 78, 160, 0.32);\n  --game-filter-nav-chip-bg:\n    linear-gradient(\n      180deg,\n      #e8e2fb 0%,\n      #ddd4f6 100%);\n  --game-filter-nav-chip-border: rgba(95, 78, 160, 0.42);\n  --game-filter-nav-chip-color: #4d3f8f;\n}\n.game-filter-selector-tone-physique[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #eef5ff 0%,\n      #e3eefc 100%);\n  border-color: rgba(46, 102, 181, 0.32);\n  --game-filter-nav-chip-bg:\n    linear-gradient(\n      180deg,\n      #e0ecfb 0%,\n      #d4e4f7 100%);\n  --game-filter-nav-chip-border: rgba(46, 102, 181, 0.42);\n  --game-filter-nav-chip-color: #2f5f9b;\n}\n.game-filter-selector-tone-languages[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #edf8ee 0%,\n      #e2f1e4 100%);\n  border-color: rgba(44, 126, 72, 0.32);\n  --game-filter-nav-chip-bg:\n    linear-gradient(\n      180deg,\n      #e0f1e2 0%,\n      #d4e8d7 100%);\n  --game-filter-nav-chip-border: rgba(44, 126, 72, 0.42);\n  --game-filter-nav-chip-color: #2f6b42;\n}\n.game-filter-selector-tone-gender[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #fff4ea 0%,\n      #ffecdd 100%);\n  border-color: rgba(165, 94, 24, 0.32);\n  --game-filter-nav-chip-bg:\n    linear-gradient(\n      180deg,\n      #fbe8d8 0%,\n      #f4ddc8 100%);\n  --game-filter-nav-chip-border: rgba(165, 94, 24, 0.42);\n  --game-filter-nav-chip-color: #8f5524;\n}\n.game-filter-selector-tone-horoscope[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f6f3ea 0%,\n      #eee9dc 100%);\n  border-color: rgba(128, 109, 66, 0.32);\n  --game-filter-nav-chip-bg:\n    linear-gradient(\n      180deg,\n      #ece7da 0%,\n      #e4dece 100%);\n  --game-filter-nav-chip-border: rgba(128, 109, 66, 0.42);\n  --game-filter-nav-chip-color: #6d5c36;\n}\n.game-filter-selector-tone-traits[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #fff1f4 0%,\n      #f9e6ed 100%);\n  border-color: rgba(160, 70, 111, 0.32);\n  --game-filter-nav-chip-bg:\n    linear-gradient(\n      180deg,\n      #fbe4ed 0%,\n      #f3d6e2 100%);\n  --game-filter-nav-chip-border: rgba(160, 70, 111, 0.42);\n  --game-filter-nav-chip-color: #904465;\n}\n.game-filter-selector-tone-smoking[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #e8f5ef 0%,\n      #deeee7 100%);\n  border-color: rgba(60, 133, 108, 0.32);\n  --game-filter-nav-chip-bg:\n    linear-gradient(\n      180deg,\n      #dceee6 0%,\n      #cfe4da 100%);\n  --game-filter-nav-chip-border: rgba(60, 133, 108, 0.42);\n  --game-filter-nav-chip-color: #2f6e58;\n}\n.game-filter-selector-tone-drinking[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #edf3ff 0%,\n      #e3ebfa 100%);\n  border-color: rgba(68, 96, 150, 0.32);\n  --game-filter-nav-chip-bg:\n    linear-gradient(\n      180deg,\n      #e0e9fb 0%,\n      #d5e0f7 100%);\n  --game-filter-nav-chip-border: rgba(68, 96, 150, 0.42);\n  --game-filter-nav-chip-color: #35598f;\n}\n.game-filter-selector-tone-workout[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #edf8ee 0%,\n      #e2f1e4 100%);\n  border-color: rgba(44, 126, 72, 0.32);\n  --game-filter-nav-chip-bg:\n    linear-gradient(\n      180deg,\n      #e0f1e2 0%,\n      #d4e8d7 100%);\n  --game-filter-nav-chip-border: rgba(44, 126, 72, 0.42);\n  --game-filter-nav-chip-color: #2f6b42;\n}\n.game-filter-selector-tone-pets[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #fff5ea 0%,\n      #ffeddc 100%);\n  border-color: rgba(166, 95, 31, 0.32);\n  --game-filter-nav-chip-bg:\n    linear-gradient(\n      180deg,\n      #fae9d8 0%,\n      #f3dfc9 100%);\n  --game-filter-nav-chip-border: rgba(166, 95, 31, 0.42);\n  --game-filter-nav-chip-color: #8f5a2e;\n}\n.game-filter-selector-tone-family[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #fff2ea 0%,\n      #ffe8de 100%);\n  border-color: rgba(160, 90, 51, 0.32);\n  --game-filter-nav-chip-bg:\n    linear-gradient(\n      180deg,\n      #fbe6da 0%,\n      #f3d9cb 100%);\n  --game-filter-nav-chip-border: rgba(160, 90, 51, 0.42);\n  --game-filter-nav-chip-color: #8c5432;\n}\n.game-filter-selector-tone-children[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #eef8ff 0%,\n      #e2f0fb 100%);\n  border-color: rgba(45, 122, 160, 0.32);\n  --game-filter-nav-chip-bg:\n    linear-gradient(\n      180deg,\n      #e0edf8 0%,\n      #d4e5f3 100%);\n  --game-filter-nav-chip-border: rgba(45, 122, 160, 0.42);\n  --game-filter-nav-chip-color: #2d6486;\n}\n.game-filter-selector-tone-love[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #fff1f4 0%,\n      #f9e6ed 100%);\n  border-color: rgba(160, 70, 111, 0.32);\n  --game-filter-nav-chip-bg:\n    linear-gradient(\n      180deg,\n      #fbe4ed 0%,\n      #f3d6e2 100%);\n  --game-filter-nav-chip-border: rgba(160, 70, 111, 0.42);\n  --game-filter-nav-chip-color: #904465;\n}\n.game-filter-selector-tone-communication[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f2f1ff 0%,\n      #e8e5fb 100%);\n  border-color: rgba(97, 82, 164, 0.32);\n  --game-filter-nav-chip-bg:\n    linear-gradient(\n      180deg,\n      #e5e2f8 0%,\n      #dad4f2 100%);\n  --game-filter-nav-chip-border: rgba(97, 82, 164, 0.42);\n  --game-filter-nav-chip-color: #554890;\n}\n.game-filter-selector-tone-orientation[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #eef9f3 0%,\n      #e3f4ea 100%);\n  border-color: rgba(40, 125, 72, 0.32);\n  --game-filter-nav-chip-bg:\n    linear-gradient(\n      180deg,\n      #e0f1e5 0%,\n      #d3e8da 100%);\n  --game-filter-nav-chip-border: rgba(40, 125, 72, 0.42);\n  --game-filter-nav-chip-color: #2b6a40;\n}\n.game-filter-selector-tone-religion[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f6f3ea 0%,\n      #eee9dc 100%);\n  border-color: rgba(128, 109, 66, 0.32);\n  --game-filter-nav-chip-bg:\n    linear-gradient(\n      180deg,\n      #ece7da 0%,\n      #e4dece 100%);\n  --game-filter-nav-chip-border: rgba(128, 109, 66, 0.42);\n  --game-filter-nav-chip-color: #6d5c36;\n}\n.game-filter-selector-tone-neutral[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f6faff 0%,\n      #edf3ff 100%);\n  border-color: rgba(70, 96, 132, 0.3);\n  --game-filter-nav-chip-bg:\n    linear-gradient(\n      180deg,\n      #e8eff9 0%,\n      #dde6f2 100%);\n  --game-filter-nav-chip-border: rgba(70, 96, 132, 0.42);\n  --game-filter-nav-chip-color: #3d5878;\n}\n.game-filter-selector-panel[class*=game-filter-selector-tone-][_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f8fbff 0%,\n      #edf4ff 100%);\n  border-color: rgba(105, 126, 156, 0.24);\n}\n.game-filter-group-tone-social[_ngcontent-%COMP%] {\n  color: #2f6aaf;\n  border-color: rgba(47, 106, 175, 0.36);\n}\n.game-filter-selector-option-group.game-filter-group-tone-social[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(223, 236, 255, 0.5) 0%,\n      rgba(223, 236, 255, 0.28) 100%);\n}\n.game-filter-selector-option-group-line.game-filter-group-tone-social[_ngcontent-%COMP%] {\n  background: rgba(47, 106, 175, 0.34);\n}\n.game-filter-group-tone-arts[_ngcontent-%COMP%] {\n  color: #6a57a8;\n  border-color: rgba(106, 87, 168, 0.36);\n}\n.game-filter-selector-option-group.game-filter-group-tone-arts[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(235, 227, 255, 0.5) 0%,\n      rgba(235, 227, 255, 0.28) 100%);\n}\n.game-filter-selector-option-group-line.game-filter-group-tone-arts[_ngcontent-%COMP%] {\n  background: rgba(106, 87, 168, 0.34);\n}\n.game-filter-group-tone-food[_ngcontent-%COMP%] {\n  color: #a5662f;\n  border-color: rgba(165, 102, 47, 0.36);\n}\n.game-filter-selector-option-group.game-filter-group-tone-food[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 236, 221, 0.56) 0%,\n      rgba(255, 236, 221, 0.32) 100%);\n}\n.game-filter-selector-option-group-line.game-filter-group-tone-food[_ngcontent-%COMP%] {\n  background: rgba(165, 102, 47, 0.3);\n}\n.game-filter-group-tone-active[_ngcontent-%COMP%] {\n  color: #317c52;\n  border-color: rgba(49, 124, 82, 0.36);\n}\n.game-filter-selector-option-group.game-filter-group-tone-active[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(222, 243, 231, 0.56) 0%,\n      rgba(222, 243, 231, 0.32) 100%);\n}\n.game-filter-selector-option-group-line.game-filter-group-tone-active[_ngcontent-%COMP%] {\n  background: rgba(49, 124, 82, 0.34);\n}\n.game-filter-group-tone-mind[_ngcontent-%COMP%] {\n  color: #2f7b77;\n  border-color: rgba(47, 123, 119, 0.36);\n}\n.game-filter-selector-option-group.game-filter-group-tone-mind[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(220, 241, 239, 0.56) 0%,\n      rgba(220, 241, 239, 0.32) 100%);\n}\n.game-filter-selector-option-group-line.game-filter-group-tone-mind[_ngcontent-%COMP%] {\n  background: rgba(47, 123, 119, 0.3);\n}\n.game-filter-group-tone-family[_ngcontent-%COMP%] {\n  color: #9c5e33;\n  border-color: rgba(156, 94, 51, 0.34);\n}\n.game-filter-selector-option-group.game-filter-group-tone-family[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 232, 219, 0.52) 0%,\n      rgba(255, 232, 219, 0.3) 100%);\n}\n.game-filter-selector-option-group-line.game-filter-group-tone-family[_ngcontent-%COMP%] {\n  background: rgba(156, 94, 51, 0.3);\n}\n.game-filter-group-tone-ambition[_ngcontent-%COMP%] {\n  color: #8b4f67;\n  border-color: rgba(139, 79, 103, 0.34);\n}\n.game-filter-selector-option-group.game-filter-group-tone-ambition[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(249, 228, 236, 0.56) 0%,\n      rgba(249, 228, 236, 0.32) 100%);\n}\n.game-filter-selector-option-group-line.game-filter-group-tone-ambition[_ngcontent-%COMP%] {\n  background: rgba(139, 79, 103, 0.3);\n}\n.game-filter-group-tone-lifestyle[_ngcontent-%COMP%] {\n  color: #2f7b77;\n  border-color: rgba(47, 123, 119, 0.34);\n}\n.game-filter-selector-option-group.game-filter-group-tone-lifestyle[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(221, 241, 239, 0.56) 0%,\n      rgba(221, 241, 239, 0.32) 100%);\n}\n.game-filter-selector-option-group-line.game-filter-group-tone-lifestyle[_ngcontent-%COMP%] {\n  background: rgba(47, 123, 119, 0.3);\n}\n.game-filter-group-tone-beliefs[_ngcontent-%COMP%] {\n  color: #7a664a;\n  border-color: rgba(122, 102, 74, 0.34);\n}\n.game-filter-selector-option-group.game-filter-group-tone-beliefs[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(245, 238, 224, 0.56) 0%,\n      rgba(245, 238, 224, 0.32) 100%);\n}\n.game-filter-selector-option-group-line.game-filter-group-tone-beliefs[_ngcontent-%COMP%] {\n  background: rgba(122, 102, 74, 0.3);\n}\n.game-filter-group-tone-identity[_ngcontent-%COMP%] {\n  color: #6254a3;\n  border-color: rgba(98, 84, 163, 0.34);\n}\n.game-filter-selector-option-group.game-filter-group-tone-identity[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(230, 226, 250, 0.56) 0%,\n      rgba(230, 226, 250, 0.32) 100%);\n}\n.game-filter-selector-option-group-line.game-filter-group-tone-identity[_ngcontent-%COMP%] {\n  background: rgba(98, 84, 163, 0.3);\n}\n.game-pair-mini-image-frame[_ngcontent-%COMP%] {\n  width: 100%;\n  max-width: none;\n  margin: 0;\n}\n.game-pair-mini-photo[_ngcontent-%COMP%] {\n  width: 100%;\n  height: 100%;\n  max-width: none;\n  object-fit: cover;\n}\n.game-card-image-overlay[_ngcontent-%COMP%] {\n  right: auto;\n  width: clamp(250px, 34%, 420px);\n  max-width: calc(100% - 1.44rem);\n}\n.game-pair-mini-card[_ngcontent-%COMP%]   .game-card-image-overlay[_ngcontent-%COMP%] {\n  right: 0;\n  width: auto;\n  max-width: none;\n}\n.game-filter-layout-columns[_ngcontent-%COMP%] {\n  grid-template-columns: minmax(0, 1.05fr) minmax(0, 1fr) minmax(0, 1fr);\n  align-items: stretch;\n}\n.game-filter-layout-col[_ngcontent-%COMP%] {\n  align-content: stretch;\n}\n.game-filter-layout-col-lifestyle[_ngcontent-%COMP%]    > .game-filter-group-lifestyle[_ngcontent-%COMP%], \n.game-filter-layout-col-relationships[_ngcontent-%COMP%]    > .game-filter-group-relationships[_ngcontent-%COMP%], \n.game-filter-layout-col-basics[_ngcontent-%COMP%]    > .game-filter-group-beliefs[_ngcontent-%COMP%] {\n  height: 100%;\n}\n.game-filter-layout-col-relationships[_ngcontent-%COMP%]    > .game-filter-group-relationships[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n}\n.game-filter-layout-col-relationships[_ngcontent-%COMP%]   .game-filter-nav-btn[_ngcontent-%COMP%] {\n  flex: 1 1 0;\n  min-height: 3.45rem;\n}\n@media (max-width: 760px) {\n  .game-card-deck[_ngcontent-%COMP%] {\n    --rate-card-image-fit: contain;\n  }\n  [_nghost-%COMP%] {\n    height: 100%;\n    min-height: 0;\n  }\n  .game-popup[_ngcontent-%COMP%] {\n    padding: 0;\n    align-items: stretch;\n    justify-content: stretch;\n  }\n  .game-social-query-bar[_ngcontent-%COMP%] {\n    grid-template-columns: repeat(2, minmax(0, 1fr));\n    gap: 0.4rem;\n  }\n  .game-card-image-overlay[_ngcontent-%COMP%] {\n    right: 0.72rem;\n    width: auto;\n    max-width: none;\n  }\n  .game-pair-mini-card[_ngcontent-%COMP%]   .game-card-image-overlay[_ngcontent-%COMP%] {\n    right: 0;\n    width: auto;\n    max-width: none;\n  }\n  .game-layout-single[_ngcontent-%COMP%] {\n    min-height: 0;\n    flex: 1 1 auto;\n    --game-stack-inline-gap: 0.2rem;\n  }\n  .game-blocked-panel[_ngcontent-%COMP%] {\n    width: 100%;\n    margin-top: 3.4rem;\n    padding: 1.2rem 0.9rem;\n  }\n  .game-blocked-panel[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n    max-width: 100%;\n  }\n  .game-stack-progress-row[_ngcontent-%COMP%] {\n    padding: 0 var(--game-stack-inline-gap);\n  }\n  .game-card-deck[_ngcontent-%COMP%], \n   .game-card-main[_ngcontent-%COMP%] {\n    min-height: 0;\n    flex: 1 1 auto;\n  }\n  .game-pair-stack[_ngcontent-%COMP%] {\n    height: 100%;\n    --game-pair-gap: 0;\n    --game-pair-pad: 0.3rem;\n    display: flex;\n    align-items: stretch;\n    gap: 0;\n  }\n  .game-pair-mini-card[_ngcontent-%COMP%] {\n    min-width: 0;\n  }\n  .game-pair-mini-card-woman[_ngcontent-%COMP%] {\n    flex: 0 0 var(--game-pair-split);\n    width: var(--game-pair-split);\n    border-top-right-radius: 0;\n    border-bottom-right-radius: 0;\n    border-right-width: 0;\n  }\n  .game-pair-mini-card-man[_ngcontent-%COMP%] {\n    flex: 0 0 calc(100% - var(--game-pair-split));\n    width: calc(100% - var(--game-pair-split));\n    margin-left: -1px;\n    border-top-left-radius: 0;\n    border-bottom-left-radius: 0;\n  }\n  .game-pair-mini-card-woman[_ngcontent-%COMP%]   .game-pair-mini-image-frame[_ngcontent-%COMP%] {\n    border-top-right-radius: 0;\n    border-bottom-right-radius: 0;\n  }\n  .game-pair-mini-card-man[_ngcontent-%COMP%]   .game-pair-mini-image-frame[_ngcontent-%COMP%] {\n    border-top-left-radius: 0;\n    border-bottom-left-radius: 0;\n  }\n  .game-pair-resize-handle[_ngcontent-%COMP%] {\n    position: absolute;\n    display: inline-flex;\n    align-items: center;\n    justify-content: center;\n    left: var(--game-pair-split);\n    top: var(--game-pair-pad);\n    bottom: var(--game-pair-pad);\n    width: 20px;\n    transform: translateX(-50%);\n    border: 0;\n    padding: 0;\n    margin: 0;\n    background: transparent;\n    z-index: 26;\n    touch-action: none;\n    cursor: ew-resize;\n  }\n  .game-pair-resize-handle[_ngcontent-%COMP%]::before {\n    content: "";\n    position: absolute;\n    inset: 0;\n  }\n  .game-pair-resize-handle-grip[_ngcontent-%COMP%] {\n    width: 4px;\n    height: 36%;\n    min-height: 52px;\n    border-radius: 999px;\n    border: 1px solid rgba(166, 196, 232, 0.74);\n    background:\n      linear-gradient(\n        180deg,\n        rgba(241, 247, 255, 0.94) 0%,\n        rgba(218, 232, 249, 0.9) 100%);\n    box-shadow: 0 0 0 1px rgba(9, 22, 40, 0.14), 0 8px 14px rgba(6, 18, 36, 0.34);\n    pointer-events: none;\n  }\n  .game-pair-stack.is-resizing[_ngcontent-%COMP%]   .game-pair-resize-handle-grip[_ngcontent-%COMP%] {\n    background:\n      linear-gradient(\n        180deg,\n        rgba(255, 247, 227, 0.96) 0%,\n        rgba(255, 229, 165, 0.9) 100%);\n    border-color: rgba(218, 168, 51, 0.86);\n  }\n  .card-image-area[_ngcontent-%COMP%], \n   .card-image-content[_ngcontent-%COMP%] {\n    min-height: 0;\n  }\n  .card-image-area[_ngcontent-%COMP%] {\n    flex: 1 1 auto;\n  }\n  .rating-stars[_ngcontent-%COMP%] {\n    grid-template-columns: repeat(5, minmax(0, 1fr));\n    gap: 0.24rem;\n  }\n  .game-rating-dock[_ngcontent-%COMP%] {\n    padding: 0 var(--game-stack-inline-gap) calc(0.64rem + env(safe-area-inset-bottom));\n    touch-action: manipulation;\n    content-visibility: auto;\n  }\n  .star-btn[_ngcontent-%COMP%] {\n    min-height: 29px;\n    font-size: 0.94rem;\n  }\n  .game-filter-popup-header[_ngcontent-%COMP%] {\n    padding: 0.58rem 0.64rem;\n  }\n  .game-filter-popup-header-actions[_ngcontent-%COMP%] {\n    gap: 0.34rem;\n  }\n  .popup-filter-meta[_ngcontent-%COMP%] {\n    font-size: 0.64rem;\n    padding: 0.2rem 0.4rem;\n  }\n  .game-popup-close-btn[_ngcontent-%COMP%] {\n    width: 30px;\n    height: 30px;\n  }\n  .game-popup-apply-btn[_ngcontent-%COMP%] {\n    width: 30px;\n    height: 30px;\n  }\n  .game-filter-popup-panel[_ngcontent-%COMP%] {\n    width: 100vw;\n    max-width: 100vw;\n    min-height: 100dvh;\n    height: 100dvh;\n    max-height: 100dvh;\n    border-radius: 0;\n    border-left-width: 0;\n    border-right-width: 0;\n  }\n  .game-filter-body[_ngcontent-%COMP%] {\n    padding: 0.4rem 0.4rem calc(0.75rem + env(safe-area-inset-bottom));\n    max-height: none;\n    overflow-y: auto;\n    overflow-x: hidden;\n    overscroll-behavior: contain;\n    -webkit-overflow-scrolling: touch;\n  }\n  .game-filter-selector-overlay[_ngcontent-%COMP%] {\n    inset: 0;\n    padding: 0.4rem 0.2rem calc(0.6rem + env(safe-area-inset-bottom));\n  }\n  .game-filter-selector-panel[_ngcontent-%COMP%] {\n    width: 100%;\n    height: auto;\n    max-height: 100%;\n  }\n  .game-filter-layout-columns[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n    padding-bottom: calc(0.5rem + env(safe-area-inset-bottom));\n  }\n  .game-filter-layout-col[_ngcontent-%COMP%] {\n    align-content: start;\n  }\n  .game-filter-layout-col-lifestyle[_ngcontent-%COMP%]    > .game-filter-group-lifestyle[_ngcontent-%COMP%], \n   .game-filter-layout-col-relationships[_ngcontent-%COMP%]    > .game-filter-group-relationships[_ngcontent-%COMP%], \n   .game-filter-layout-col-basics[_ngcontent-%COMP%]    > .game-filter-group-beliefs[_ngcontent-%COMP%] {\n    height: auto;\n  }\n  .game-filter-layout-col-relationships[_ngcontent-%COMP%]    > .game-filter-group-relationships[_ngcontent-%COMP%] {\n    display: grid;\n    flex-direction: initial;\n  }\n  .game-filter-layout-col-relationships[_ngcontent-%COMP%]   .game-filter-nav-btn[_ngcontent-%COMP%] {\n    flex: initial;\n    min-height: 0;\n  }\n}\n/*# sourceMappingURL=home.component.css.map */'], changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadataAsync(HomeComponent, () => [import("./home-game-filter-popup.component-3J6DC6NL.js").then((m) => m.HomeGameFilterPopupComponent)], (HomeGameFilterPopupComponent) => {
    setClassMetadata(HomeComponent, [{
      type: Component,
      args: [{ selector: "app-home", standalone: true, changeDetection: ChangeDetectionStrategy.OnPush, imports: [
        CommonModule,
        MatIconModule,
        HomeHeaderComponent,
        SmartListComponent,
        SingleCardComponent,
        PairCardComponent,
        HomeGameFilterPopupComponent,
        I18nPipe
      ], template: `@if (isAccountReactivationPending) {
  <div class="game-page game-page-reactivation-pending" aria-hidden="true"></div>
} @else {
<div class="game-page" [ngClass]="gamePageStatusClass()">
  <app-home-header
    [branding]="deploymentBranding()"
    [items]="homeHeaderMenuItems()"
    [showControls]="!isAvatarProfileSettled || homeHeaderControlsReady"
    (itemSelect)="onHomeHeaderMenuSelect($event)"
  ></app-home-header>

  @if (showSocialQueryInputs()) {
    <section class="game-social-query-bar">
      <label class="game-social-query-field">
        <input
          type="text"
          [value]="leftSocialQuery"
          [attr.list]="'home-social-left-suggestions'"
          [attr.aria-label]="isFriendsInCommonMode ? 'Person' : 'Friend A'"
          [placeholder]="isFriendsInCommonMode ? 'Search person or event' : 'Search friend or event'"
          [disabled]="!memberActionsAvailable"
          (input)="onLeftSocialQueryChanged(($any($event.target).value ?? '').toString())"
          />
      </label>
      <label class="game-social-query-field">
        <input
          type="text"
          [value]="rightSocialQuery"
          [attr.list]="'home-social-right-suggestions'"
          [attr.aria-label]="isFriendsInCommonMode ? 'Common friend' : 'Friend B'"
          [placeholder]="isFriendsInCommonMode ? 'Search common friend' : 'Search friend or event'"
          [disabled]="!memberActionsAvailable"
          (input)="onRightSocialQueryChanged(($any($event.target).value ?? '').toString())"
          />
      </label>
      <datalist id="home-social-left-suggestions">
        @for (suggestion of socialQuerySuggestions('left'); track suggestion) {
          <option [value]="suggestion"></option>
        }
      </datalist>
      <datalist id="home-social-right-suggestions">
        @for (suggestion of socialQuerySuggestions('right'); track suggestion) {
          <option [value]="suggestion"></option>
        }
      </datalist>
    </section>
  }

  <section class="game-layout-single">
    @if (isBlockedUserStatusPending) {
      <div class="game-card-deck"></div>
    } @else if (isBlockedUser) {
      <div class="game-blocked-panel">
        <mat-icon>block</mat-icon>
        <h2>{{ 'your.account.is.blocked' | i18n: 'Your account is blocked' }}</h2>
        <p>{{ 'your.profile.is.still.visible.to.you.but.rating.matching.profile.editing.assets.events.and.invitations.are.paused' | i18n: 'Your profile is still visible to you, but rating, matching, profile editing, assets, events, and invitations are paused.' }}</p>
        <p>{{ 'open.chats.from.the.menu.to.contact.myscoutee.support.they.can.review.the.block.and.tell.you.what.information.is.needed' | i18n: 'Open Chats from the menu to contact MyScoutee support. They can review the block and tell you what information is needed.' }}</p>
      </div>
    } @else if (isGameVisibilityPaused) {
      <div class="game-blocked-panel game-visibility-panel">
        <mat-icon>visibility_off</mat-icon>
        <h2>{{ gameVisibilityPausedTitle | i18n }}</h2>
        <p>{{ gameVisibilityPausedDescription | i18n }}</p>
      </div>
    } @else {
    <div class="game-card-deck">
      <ng-template #homeFullscreenItemTemplate let-row let-renderState="renderState">
        @if (row) {
          @if (row.mode === 'pair') {
            <app-pair-card
              [card]="homePairCard(row, { presentation: 'fullscreen', state: renderState })"
              (detailClick)="openProfileView($event)"
            ></app-pair-card>
          } @else {
            <app-single-card
              [card]="homeSingleCard(row, { presentation: 'fullscreen', state: renderState })"
              (detailClick)="openProfileView($event)"
            ></app-single-card>
          }
        }
      </ng-template>

      @if (homeSmartListQueryReady) {
        <app-smart-list
          #homeSmartList
          class="home-smart-list"
          [config]="homeSmartListConfig"
          [loadPage]="homeSmartListLoadPage"
          [fullscreenItemTemplate]="homeFullscreenItemTemplate"
          presentation="fullscreen"
          [query]="homeSmartListQuery"
          (stateChange)="onHomeSmartListStateChange($event)"
        ></app-smart-list>
      }
    </div>
    }
  </section>
</div>
}

@if (!isAccountReactivationPending && localPopup === 'filter' && gameFilterPopupContext) {
  @defer (on immediate) {
    <app-home-game-filter-popup
      [context]="gameFilterPopupContext"
      [saving]="isGameFilterSaving"
      (closed)="onGameFilterPopupClosed($event)"
    ></app-home-game-filter-popup>
  }
}
`, styles: ['/* src/app/home/components/home/home.component.scss */\n.game-page {\n  width: min(1160px, 100vw - 2rem);\n  margin: 0 auto;\n  min-height: calc(100vh - 2rem);\n  display: flex;\n  flex-direction: column;\n  border: 1px solid rgba(21, 38, 62, 0.14);\n  border-radius: 18px;\n  padding: 0.9rem;\n  box-sizing: border-box;\n  background:\n    radial-gradient(\n      circle at 20% -10%,\n      var(--deployment-brand-shadow),\n      transparent 36%),\n    radial-gradient(\n      circle at 95% 0%,\n      color-mix(in srgb, var(--deployment-brand-secondary) 14%, transparent),\n      transparent 34%),\n    #f8faff;\n}\n@media (max-width: 760px) {\n  .game-page {\n    width: 100%;\n    min-height: 100%;\n    height: 100%;\n    max-height: 100%;\n    border-radius: 18px;\n    padding: 0.9rem;\n    box-sizing: border-box;\n    overflow: hidden;\n  }\n}\n:host {\n  display: block;\n}\n.game-page.game-page-status-public {\n  background:\n    linear-gradient(\n      180deg,\n      #e6f6ef 0%,\n      #d9f0e6 100%);\n}\n.game-page.game-page-status-friends {\n  background:\n    linear-gradient(\n      180deg,\n      #e8f1fd 0%,\n      #dfeaf9 100%);\n}\n.game-page.game-page-status-host {\n  background:\n    linear-gradient(\n      180deg,\n      #f6efe2 0%,\n      #eee4d2 100%);\n}\n.game-page.game-page-status-inactive {\n  background:\n    linear-gradient(\n      180deg,\n      #f2f3f5 0%,\n      #e8ebef 100%);\n}\n.game-page.game-page-status-blocked {\n  background:\n    linear-gradient(\n      180deg,\n      #fff2f2 0%,\n      #f8dede 100%);\n  border-color: rgba(180, 52, 64, 0.28);\n}\n.game-page.game-page-status-offline {\n  background:\n    linear-gradient(\n      180deg,\n      #cbd0d7 0%,\n      #aeb5bf 100%);\n  border-color: rgba(35, 44, 57, 0.32);\n  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.34);\n}\n.game-page.game-page-reactivation-pending {\n  min-height: calc(100vh - 2rem);\n  border-color: transparent;\n  background: transparent;\n  box-shadow: none;\n}\n.game-layout-single {\n  margin-top: 0.68rem;\n  flex: 1 1 auto;\n  min-height: 0;\n  display: flex;\n  flex-direction: column;\n  gap: 0.56rem;\n  --game-stack-inline-gap: 0.28rem;\n}\n.game-social-query-bar {\n  margin-top: 0.6rem;\n  display: grid;\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n  gap: 0.72rem;\n  align-items: start;\n}\n.game-social-query-field {\n  min-width: 0;\n  display: block;\n}\n.game-social-query-field input {\n  width: 100%;\n  min-height: 36px;\n  padding: 0.54rem 0.8rem;\n  border-radius: 14px;\n  border: 1px solid rgba(31, 72, 114, 0.18);\n  background: rgba(255, 255, 255, 0.88);\n  color: #17304a;\n  font: inherit;\n  font-size: 0.78rem;\n  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.58);\n  box-sizing: border-box;\n}\n.game-social-query-field input:focus {\n  outline: none;\n  border-color: rgba(46, 105, 177, 0.42);\n  box-shadow: 0 0 0 3px rgba(108, 164, 232, 0.16);\n}\n.game-social-query-field input:disabled {\n  border-color: rgba(46, 54, 65, 0.16);\n  background: rgba(228, 231, 235, 0.82);\n  color: rgba(48, 56, 67, 0.48);\n  cursor: not-allowed;\n}\n.game-stack-progress-row {\n  flex: 0 0 auto;\n  padding: 0 var(--game-stack-inline-gap);\n}\n.game-card-deck {\n  position: relative;\n  flex: 1 1 auto;\n  min-height: 0;\n  display: flex;\n}\n.game-blocked-panel {\n  width: min(560px, 100%);\n  max-width: 100%;\n  margin: 4.2rem auto 0;\n  padding: 1.4rem;\n  border: 1px solid rgba(177, 54, 67, 0.24);\n  border-radius: 12px;\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 248, 248, 0.96),\n      rgba(253, 237, 237, 0.96));\n  color: #6b2630;\n  text-align: center;\n  box-shadow: 0 18px 44px rgba(117, 30, 42, 0.12);\n  box-sizing: border-box;\n  overflow-wrap: anywhere;\n}\n.game-blocked-panel .mat-icon {\n  width: 2.6rem;\n  height: 2.6rem;\n  font-size: 2.6rem;\n  color: #b13546;\n}\n.game-blocked-panel h2 {\n  margin: 0.55rem 0 0.4rem;\n  font-size: 1.22rem;\n}\n.game-blocked-panel p {\n  margin: 0.35rem auto;\n  max-width: 46ch;\n  color: #7a3a43;\n  line-height: 1.45;\n}\n.game-visibility-panel {\n  border-color: rgba(54, 83, 128, 0.22);\n  background:\n    linear-gradient(\n      180deg,\n      rgba(248, 251, 255, 0.96),\n      rgba(235, 241, 250, 0.96));\n  color: #243a59;\n  box-shadow: 0 18px 44px rgba(35, 58, 89, 0.12);\n}\n.game-visibility-panel .mat-icon {\n  color: #496f9f;\n}\n.game-visibility-panel p {\n  color: #405879;\n}\n.home-smart-list {\n  flex: 1 1 auto;\n  min-width: 0;\n  min-height: 0;\n}\n:host ::ng-deep .home-smart-list .smart-list__fullscreen-surface {\n  padding-top: 0;\n}\n.game-card-main {\n  border: 0;\n  border-radius: 14px;\n  background: transparent;\n  overflow: hidden;\n  position: relative;\n  display: flex;\n  flex-direction: column;\n  flex: 1 1 auto;\n  min-height: 0;\n}\n.game-card-main-active {\n  z-index: 1;\n}\n.game-card-main-leaving {\n  position: absolute;\n  inset: 0;\n  z-index: 3;\n  pointer-events: none;\n  transform-origin: top right;\n  animation: game-card-page-curl 420ms cubic-bezier(0.18, 0.64, 0.24, 1) forwards;\n}\n@keyframes game-card-page-curl {\n  0% {\n    transform: perspective(1400px) translateX(0) translateY(0) rotateY(0deg) rotateZ(0deg) scale(1);\n    opacity: 1;\n  }\n  30% {\n    transform: perspective(1400px) translateX(-8%) translateY(1%) rotateY(-24deg) rotateZ(-2deg) scale(0.995);\n    opacity: 0.96;\n  }\n  100% {\n    transform: perspective(1400px) translateX(-145%) translateY(8%) rotateY(-82deg) rotateZ(-11deg) scale(0.94);\n    opacity: 0;\n  }\n}\n.card-content {\n  padding: 0.7rem 0.76rem 0.44rem;\n}\n.card-content h2 {\n  margin: 0;\n  font-size: 1.1rem;\n  color: #1f2d44;\n}\n.card-content p {\n  margin: 0.26rem 0 0;\n  color: rgba(21, 36, 58, 0.74);\n  font-size: 0.84rem;\n}\n.card-content.card-content-empty {\n  min-height: 92px;\n}\n.card-content.card-content-empty.card-content-empty-loading p {\n  color: rgba(32, 71, 113, 0.82);\n}\n.card-image-area {\n  margin: 0 var(--game-stack-inline-gap);\n  border-radius: 12px;\n  border: 0;\n  flex: 1 1 auto;\n  min-height: clamp(360px, 62vh, 760px);\n  background:\n    linear-gradient(\n      155deg,\n      rgba(219, 234, 255, 0.66),\n      rgba(255, 241, 230, 0.54)),\n    #f8fbff;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  position: relative;\n  overflow: hidden;\n}\n.game-pair-stack {\n  --game-pair-split: 50%;\n  --game-pair-gap: clamp(0.28rem, 0.8vw, 0.52rem);\n  --game-pair-pad: 0.42rem;\n  margin: 0 var(--game-stack-inline-gap);\n  flex: 1 1 auto;\n  min-height: 0;\n  display: grid;\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n  grid-template-rows: minmax(0, 1fr);\n  gap: var(--game-pair-gap);\n  padding: var(--game-pair-pad);\n  border: 1px solid rgba(34, 54, 84, 0.24);\n  border-radius: 14px;\n  background:\n    linear-gradient(\n      180deg,\n      #1b2c45 0%,\n      #132238 100%);\n  box-sizing: border-box;\n  position: relative;\n}\n.game-pair-stack.is-resizing {\n  -webkit-user-select: none;\n  user-select: none;\n}\n.game-pair-resize-handle {\n  display: none;\n}\n.game-pair-resize-handle-grip {\n  display: block;\n}\n.game-pair-mini-card {\n  position: relative;\n  border-radius: 12px;\n  border: 1px solid rgba(255, 255, 255, 0.28);\n  overflow: hidden;\n  min-height: 0;\n  background: rgba(8, 17, 30, 0.18);\n  box-shadow: 0 10px 22px rgba(6, 18, 36, 0.3);\n}\n.game-pair-mini-card.is-collapsed {\n  border-color: transparent;\n  box-shadow: none;\n}\n.game-pair-mini-card.is-collapsed .game-pair-mini-card-content {\n  opacity: 0;\n  pointer-events: none;\n}\n.game-pair-mini-card-leaving {\n  position: absolute;\n  inset: 0;\n  border-radius: inherit;\n  overflow: hidden;\n  z-index: 5;\n  pointer-events: none;\n}\n.game-pair-mini-card-content {\n  width: 100%;\n  height: 100%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  position: relative;\n}\n.game-pair-mini-image-frame {\n  position: relative;\n  width: 100%;\n  height: 100%;\n  border-radius: 12px;\n  overflow: hidden;\n}\n.game-pair-mini-image-frame .card-image-placeholder {\n  position: absolute;\n  left: 50%;\n  top: 50%;\n  transform: translate(-50%, -50%);\n}\n.game-pair-mini-photo {\n  width: 100%;\n  height: 100%;\n  object-fit: cover;\n  display: block;\n  border-radius: inherit;\n}\n.game-pair-mini-image-indicators {\n  position: absolute;\n  top: 0.28rem;\n  left: 0.34rem;\n  right: 0.34rem;\n  margin: 0;\n  z-index: 10;\n  padding: 0.12rem 0.24rem;\n  border-radius: 7px;\n  background: rgba(10, 18, 31, 0.38);\n  gap: 5px;\n}\n.game-pair-mini-image-indicators .game-image-stack-line,\n.game-single-image-indicators .game-image-stack-line {\n  height: 4px;\n  border: 1px solid rgba(28, 42, 64, 0.36);\n  background: rgba(167, 177, 192, 0.9);\n  opacity: 1;\n}\n.game-pair-mini-image-indicators .game-image-stack-line.active,\n.game-single-image-indicators .game-image-stack-line.active {\n  border-color: rgba(248, 252, 255, 0.86);\n  background: rgba(250, 252, 255, 0.98);\n  box-shadow: 0 0 0 1px rgba(10, 20, 34, 0.12);\n}\n.game-pair-mini-image-indicators .game-image-stack-line.active.is-loading,\n.game-single-image-indicators .game-image-stack-line.active.is-loading {\n  background: rgba(229, 236, 245, 0.98);\n  animation: game-image-line-loading 500ms ease 1;\n}\n.game-pair-mini-image-indicators .game-image-stack-line.active.is-revealing,\n.game-single-image-indicators .game-image-stack-line.active.is-revealing {\n  animation: game-image-line-reveal 240ms ease-out 1;\n}\n.game-pair-mini-image-frame .game-image-hit-area {\n  z-index: 2;\n}\n.game-pair-mini-card-label {\n  position: absolute;\n  top: 0.64rem;\n  left: 0.52rem;\n  z-index: 5;\n  border-radius: 999px;\n  border: 1px solid rgba(212, 229, 249, 0.42);\n  background: rgba(8, 18, 35, 0.62);\n  color: #f5f9ff;\n  font-size: 0.68rem;\n  font-weight: 700;\n  letter-spacing: 0.02em;\n  line-height: 1;\n  padding: 0.16rem 0.45rem;\n}\n.game-pair-mini-card-woman .game-pair-mini-card-label {\n  background: rgba(109, 42, 118, 0.64);\n}\n.game-pair-mini-card-man .game-pair-mini-card-label {\n  background: rgba(36, 74, 127, 0.66);\n}\n.game-pair-mini-card .game-card-image-overlay {\n  left: 0;\n  right: 0;\n  bottom: 0;\n  padding: 0.7rem 0.72rem 0.68rem;\n  border-radius: 0;\n}\n.game-pair-rating-badge {\n  position: absolute;\n  bottom: 4.5rem;\n  transform: translate(-50%, 0);\n  left: var(--game-pair-split, 50%);\n  right: auto;\n  z-index: 32;\n  min-height: 26px;\n  border: 2px solid rgba(187, 136, 22, 0.58);\n  border-radius: 999px;\n  background:\n    linear-gradient(\n      180deg,\n      #fff9e9 0%,\n      #fff1cb 100%);\n  color: #9f6915;\n  font-size: 0.76rem;\n  font-weight: 800;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.24rem;\n  padding: 0.16rem 0.56rem;\n  box-shadow: inset 0 0 0 1px rgba(255, 245, 215, 0.72), 0 8px 16px rgba(10, 22, 40, 0.28);\n  white-space: nowrap;\n  pointer-events: none;\n}\n.game-pair-rating-badge .mat-icon {\n  width: 14px;\n  height: 14px;\n  font-size: 14px;\n  line-height: 14px;\n}\n.game-pair-rating-badge.is-blink {\n  animation: game-rating-stars-blink 0.42s ease-in-out 1;\n}\n.game-card-active-badge {\n  position: absolute;\n  top: 0.64rem;\n  right: 0.56rem;\n  z-index: 11;\n  border-radius: 999px;\n  border: 1px solid rgba(148, 225, 182, 0.56);\n  background: rgba(8, 34, 18, 0.74);\n  color: #e9ffef;\n  font-size: 0.68rem;\n  font-weight: 700;\n  letter-spacing: 0.01em;\n  line-height: 1;\n  padding: 0.17rem 0.5rem;\n  pointer-events: none;\n  white-space: nowrap;\n  max-width: calc(100% - 1.24rem);\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.game-card-active-badge-leaving {\n  animation: game-card-active-badge-leaving 420ms cubic-bezier(0.18, 0.64, 0.24, 1) forwards;\n}\n@keyframes game-card-active-badge-leaving {\n  0% {\n    opacity: 1;\n    transform: translate3d(0, 0, 0) scale(1);\n  }\n  45% {\n    opacity: 0.9;\n    transform: translate3d(-1px, 1px, 0) scale(0.98);\n  }\n  100% {\n    opacity: 0;\n    transform: translate3d(-4px, 6px, 0) scale(0.9);\n  }\n}\n.game-pair-mini-card-empty {\n  position: relative;\n  width: 100%;\n  height: 100%;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  gap: 0.3rem;\n  color: rgba(28, 42, 61, 0.78);\n  text-align: center;\n}\n.game-pair-mini-card-empty .card-image-placeholder {\n  width: 66px;\n  height: 66px;\n  font-size: 1.26rem;\n}\n.game-pair-mini-card-empty p {\n  margin: 0;\n  font-size: 0.74rem;\n  font-weight: 600;\n}\n.game-image-load-probe {\n  position: absolute;\n  width: 1px;\n  height: 1px;\n  opacity: 0;\n  pointer-events: none;\n}\n.card-image-content {\n  width: 100%;\n  min-height: inherit;\n  height: 100%;\n  background-position: center;\n  background-size: cover;\n  background-repeat: no-repeat;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  transform-origin: center;\n  transition: transform 0.14s ease-out;\n  cursor: default;\n  position: relative;\n  touch-action: none;\n}\n.game-card-image-overlay {\n  position: absolute;\n  left: 0.72rem;\n  right: 0.72rem;\n  top: auto;\n  bottom: 0.68rem;\n  z-index: 4;\n  border-radius: 12px;\n  padding: 0.54rem 0.66rem 0.6rem;\n  background:\n    linear-gradient(\n      180deg,\n      rgba(8, 18, 35, 0.72) 0%,\n      rgba(8, 18, 35, 0.46) 72%,\n      rgba(8, 18, 35, 0.16) 100%);\n  color: #f5f9ff;\n  border: 1px solid rgba(213, 227, 248, 0.22);\n  -webkit-backdrop-filter: blur(2px);\n  backdrop-filter: blur(2px);\n  pointer-events: none;\n}\n.game-card-image-overlay-primary,\n.game-card-image-overlay-secondary {\n  margin: 0;\n  text-shadow: 0 1px 2px rgba(5, 10, 20, 0.5);\n}\n.game-card-image-overlay-primary {\n  font-size: 0.95rem;\n  font-weight: 800;\n  letter-spacing: 0.01em;\n  line-height: 1.2;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.game-card-image-overlay-secondary {\n  margin-top: 0.24rem;\n  font-size: 0.77rem;\n  font-weight: 600;\n  line-height: 1.28;\n  color: rgba(229, 239, 255, 0.94);\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.card-image-content.is-draggable {\n  cursor: grab;\n}\n.card-image-content.is-draggable:active {\n  cursor: grabbing;\n}\n.game-image-stack-indicators {\n  margin: 0 0.72rem 0.42rem;\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(0, 1fr));\n  gap: 4px;\n}\n.game-single-image-indicators {\n  position: absolute;\n  top: 0.2rem;\n  left: 0.52rem;\n  right: 0.52rem;\n  margin: 0;\n  z-index: 10;\n  padding: 0.16rem 0.34rem;\n  border-radius: 8px;\n  background: rgba(10, 18, 31, 0.38);\n  gap: 5px;\n}\n.game-image-stack-line {\n  border: 0;\n  height: 3px;\n  border-radius: 999px;\n  background: rgba(242, 181, 93, 0.68);\n  cursor: pointer;\n  padding: 0;\n  transform-origin: center center;\n}\n.game-image-stack-line.active {\n  background: rgba(116, 255, 193, 0.98);\n}\n.game-image-stack-line.active.is-loading {\n  background: rgba(229, 236, 245, 0.98);\n  animation: game-image-line-loading 500ms ease 1;\n}\n.game-image-stack-line.active.is-revealing {\n  animation: game-image-line-reveal 240ms ease-out 1;\n}\n@keyframes game-image-line-loading {\n  0% {\n    transform: scaleX(0.84);\n    opacity: 0.58;\n  }\n  100% {\n    transform: scaleX(1);\n    opacity: 1;\n  }\n}\n@keyframes game-image-line-reveal {\n  0% {\n    transform: scaleX(0.92);\n    opacity: 0.88;\n    background: rgba(215, 225, 238, 0.95);\n  }\n  100% {\n    transform: scaleX(1);\n    opacity: 1;\n    background: rgba(250, 252, 255, 0.98);\n  }\n}\n.game-image-hit-area {\n  position: absolute;\n  inset: 0;\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(0, 1fr));\n  gap: 4px;\n  z-index: 2;\n}\n.game-image-hit-segment {\n  border: 0;\n  background: transparent;\n  padding: 0;\n  cursor: pointer;\n  width: 100%;\n  height: 100%;\n}\n.card-image-placeholder {\n  width: 84px;\n  height: 84px;\n  border-radius: 50%;\n  background:\n    linear-gradient(\n      145deg,\n      #4f7cff,\n      #7a3eff 60%,\n      #f04eab);\n  color: #fff;\n  font-weight: 800;\n  font-size: 1.72rem;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  letter-spacing: 0.03em;\n}\n.rating-stars {\n  margin: 0.56rem var(--game-stack-inline-gap) 0.72rem;\n  flex: 0 0 auto;\n  display: grid;\n  grid-template-columns: repeat(10, minmax(0, 1fr));\n  gap: 0.28rem;\n}\n.game-rating-dock {\n  flex: 0 0 auto;\n  padding: 0 var(--game-stack-inline-gap) 0.72rem;\n}\n.game-rating-dock .rating-stars {\n  margin: 0;\n}\n.rating-stars.rating-stars-static .star-btn {\n  pointer-events: none;\n  cursor: default;\n}\n.rating-stars.is-blink {\n  animation: game-rating-stars-blink 0.42s ease-in-out 1;\n}\n.star-btn {\n  width: 100%;\n  min-width: 0;\n  min-height: 31px;\n  border-radius: 999px;\n  border: 1px solid rgba(22, 40, 64, 0.22);\n  background: #fff;\n  color: rgba(96, 111, 133, 0.9);\n  font-size: 0.98rem;\n  line-height: 1;\n  cursor: pointer;\n  will-change: transform, opacity;\n  backface-visibility: hidden;\n}\n.star-btn.filled {\n  color: #f2ba31;\n  border-color: rgba(193, 145, 34, 0.44);\n  background:\n    linear-gradient(\n      180deg,\n      #fff9e9 0%,\n      #fff2d0 100%);\n}\n@keyframes game-rating-stars-blink {\n  0%, 100% {\n    filter: brightness(1);\n  }\n  50% {\n    filter: brightness(1.12) saturate(1.1);\n  }\n}\n.game-popup {\n  position: fixed;\n  inset: 0;\n  z-index: 2200;\n  display: flex;\n  align-items: flex-start;\n  justify-content: center;\n  padding: 1rem;\n}\n.game-popup-backdrop {\n  position: absolute;\n  inset: 0;\n  background: rgba(0, 0, 0, 0.44);\n}\n.game-popup-panel {\n  position: relative;\n  z-index: 1;\n  width: min(680px, 100vw - 1rem);\n  border-radius: 12px;\n  background: #fff;\n  border: 1px solid rgba(15, 23, 42, 0.14);\n  overflow: hidden;\n}\n.game-popup-panel header {\n  padding: 0.58rem 0.72rem;\n  border-bottom: 1px solid rgba(15, 23, 42, 0.1);\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n}\n.game-popup-panel h2 {\n  margin: 0;\n  font-size: 1rem;\n  color: #1f2d44;\n}\n.game-filter-popup-header {\n  padding: 0.62rem 0.72rem;\n}\n.game-filter-popup-header-actions {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.44rem;\n  transition: opacity 0.14s ease;\n}\n.game-filter-popup-header-actions.is-hidden {\n  opacity: 0;\n  visibility: hidden;\n  pointer-events: none;\n}\n.popup-filter-meta {\n  border: 1px solid rgba(67, 95, 131, 0.24);\n  border-radius: 999px;\n  background: #eef4ff;\n  color: #2b4e79;\n  font-size: 0.68rem;\n  font-weight: 700;\n  line-height: 1;\n  padding: 0.22rem 0.46rem;\n}\n.popup-filter-meta.active {\n  background: #e8f8ee;\n  border-color: rgba(63, 148, 88, 0.32);\n  color: #22603c;\n}\n.game-popup-close-btn {\n  width: 32px;\n  height: 32px;\n  border: 1px solid rgba(64, 90, 123, 0.26);\n  border-radius: 999px;\n  background:\n    linear-gradient(\n      180deg,\n      #f2f7ff 0%,\n      #e8f1ff 100%);\n  color: #375e92;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  cursor: pointer;\n  padding: 0;\n}\n.game-popup-close-btn .mat-icon {\n  width: 18px;\n  height: 18px;\n  font-size: 18px;\n  line-height: 18px;\n}\n.game-popup-apply-btn {\n  width: 32px;\n  height: 32px;\n  border: 1px solid rgba(63, 148, 88, 0.38);\n  border-radius: 999px;\n  background:\n    linear-gradient(\n      180deg,\n      #d9f3df 0%,\n      #c6e9cf 100%);\n  color: #26653c;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  cursor: pointer;\n  padding: 0;\n}\n.game-popup-apply-btn .mat-icon {\n  width: 18px;\n  height: 18px;\n  font-size: 18px;\n  line-height: 18px;\n}\n.game-popup-panel > header > button {\n  border: 1px solid rgba(15, 23, 42, 0.2);\n  border-radius: 999px;\n  background: #fff;\n  color: #1f2d44;\n  font: inherit;\n  font-size: 0.8rem;\n  padding: 0.28rem 0.64rem;\n  cursor: pointer;\n}\n.game-popup-body {\n  padding: 0.75rem;\n  display: grid;\n  gap: 0.45rem;\n}\n.game-popup-body p {\n  margin: 0;\n  color: rgba(15, 23, 42, 0.72);\n}\n.game-filter-popup-panel {\n  width: min(1160px, 100vw - 2rem);\n  height: calc(100vh - 2rem);\n  height: calc(100dvh - 2rem);\n  max-height: calc(100vh - 2rem);\n  max-height: calc(100dvh - 2rem);\n  box-sizing: border-box;\n  border-radius: 14px;\n  border-color: rgba(31, 56, 89, 0.18);\n  background:\n    linear-gradient(\n      180deg,\n      #ffffff 0%,\n      #f8fbff 100%);\n  display: flex;\n  flex-direction: column;\n}\n.game-filter-body {\n  position: relative;\n  flex: 1 1 auto;\n  min-height: 0;\n  overflow: auto;\n  padding: 0.4rem;\n  grid-template-columns: 1fr;\n  gap: 0.72rem;\n  align-items: start;\n}\n.game-filter-body.has-selector-open {\n  overflow: hidden;\n}\n.game-filter-body.has-selector-open .game-filter-layout-columns {\n  pointer-events: none;\n  -webkit-user-select: none;\n  user-select: none;\n}\n.game-filter-layout-columns {\n  grid-column: 1/-1;\n  display: grid;\n  grid-template-columns: 1fr;\n  gap: 0.72rem;\n  align-items: start;\n}\n.game-filter-layout-col {\n  min-width: 0;\n  display: grid;\n  gap: 0.72rem;\n  align-content: start;\n}\n.game-filter-group {\n  border: 1px solid rgba(105, 126, 156, 0.24);\n  border-radius: 14px;\n  background:\n    linear-gradient(\n      180deg,\n      #f8fbff 0%,\n      #edf4ff 100%);\n  padding: 0.62rem;\n  display: grid;\n  gap: 0.48rem;\n}\n.game-filter-group-head {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  padding-bottom: 0.22rem;\n  border-bottom: 1px solid rgba(74, 102, 139, 0.22);\n}\n.game-filter-group-head h3 {\n  margin: 0;\n  font-size: 0.84rem;\n  letter-spacing: 0.01em;\n  color: #20385c;\n}\n.game-filter-group-basics {\n  background:\n    linear-gradient(\n      180deg,\n      #f2f7ff 0%,\n      #e8f0fb 100%);\n  border-color: rgba(58, 108, 168, 0.28);\n}\n.game-filter-group-basics .game-filter-group-head {\n  border-bottom-color: rgba(58, 108, 168, 0.24);\n}\n.game-filter-group-basics .game-filter-group-head h3 {\n  color: #214772;\n}\n.game-filter-group-beliefs {\n  background:\n    linear-gradient(\n      180deg,\n      #f4f1ff 0%,\n      #ebe6fb 100%);\n  border-color: rgba(98, 84, 163, 0.28);\n}\n.game-filter-group-beliefs .game-filter-group-head {\n  border-bottom-color: rgba(98, 84, 163, 0.24);\n}\n.game-filter-group-beliefs .game-filter-group-head h3 {\n  color: #4f438b;\n}\n.game-filter-group-lifestyle {\n  background:\n    linear-gradient(\n      180deg,\n      #eef8f3 0%,\n      #e4f2ea 100%);\n  border-color: rgba(49, 124, 82, 0.28);\n}\n.game-filter-group-lifestyle .game-filter-group-head {\n  border-bottom-color: rgba(49, 124, 82, 0.24);\n}\n.game-filter-group-lifestyle .game-filter-group-head h3 {\n  color: #2f6f45;\n}\n.game-filter-group-relationships {\n  background:\n    linear-gradient(\n      180deg,\n      #fff4ee 0%,\n      #f7e9df 100%);\n  border-color: rgba(160, 90, 51, 0.28);\n}\n.game-filter-group-relationships .game-filter-group-head {\n  border-bottom-color: rgba(160, 90, 51, 0.24);\n}\n.game-filter-group-relationships .game-filter-group-head h3 {\n  color: #7d4e33;\n}\n.game-filter-section-head {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.4rem;\n}\n.game-filter-section-head h4 {\n  margin: 0;\n  font-size: 0.82rem;\n  color: #213b5f;\n}\n.game-filter-value-badge {\n  border: 1px solid rgba(39, 73, 114, 0.22);\n  border-radius: 999px;\n  background:\n    linear-gradient(\n      180deg,\n      #f0f6ff 0%,\n      #e6eefb 100%);\n  color: #22436a;\n  font-size: 0.74rem;\n  font-weight: 800;\n  line-height: 1;\n  padding: 0.26rem 0.5rem;\n  white-space: nowrap;\n}\n.game-filter-slider-wrap {\n  display: grid;\n  gap: 0.44rem;\n  padding: 0 2rem;\n  overflow: hidden;\n}\n.game-filter-slider-wrap mat-slider {\n  width: 100%;\n}\n.game-filter-group-basics .game-filter-slider-wrap mat-slider {\n  --mdc-slider-active-track-color: #2f6fbe;\n  --mdc-slider-inactive-track-color: rgba(57, 88, 130, 0.36);\n  --mdc-slider-handle-color: #1463be;\n  --mdc-slider-focus-handle-color: #1463be;\n  --mdc-slider-hover-handle-color: #1463be;\n  --mdc-slider-pressed-handle-color: #0f5bac;\n}\n:host ::ng-deep .game-filter-slider-wrap .mdc-slider__thumb::before,\n:host ::ng-deep .game-filter-slider-wrap .mdc-slider__thumb::after {\n  display: none;\n}\n:host ::ng-deep .game-filter-group-basics .game-filter-slider-wrap .mdc-slider__track--inactive {\n  background-color: rgba(57, 88, 130, 0.36) !important;\n  opacity: 1;\n}\n:host ::ng-deep .game-filter-group-basics .game-filter-slider-wrap .mdc-slider__track--active_fill {\n  border-color: #2f6fbe !important;\n}\n.game-filter-nav-btn {\n  position: relative;\n  width: 100%;\n  border-radius: 12px;\n  border: 1px solid rgba(34, 66, 106, 0.24);\n  background:\n    linear-gradient(\n      180deg,\n      #f6faff 0%,\n      #ebf2ff 100%);\n  color: #1f3d64;\n  font: inherit;\n  display: inline-flex;\n  align-items: center;\n  justify-content: flex-start;\n  gap: 0.5rem;\n  text-align: left;\n  cursor: pointer;\n  padding: 0.5rem 0.56rem 0.5rem 0.62rem;\n}\n.game-filter-nav-copy {\n  flex: 1 1 auto;\n  min-width: 0;\n  display: grid;\n  gap: 0;\n}\n.game-filter-nav-title {\n  display: block;\n  font-size: 0.78rem;\n  font-weight: 800;\n  line-height: 1.12;\n  padding-right: 2.9rem;\n  padding-bottom: 0.3rem;\n  margin-bottom: 0.34rem;\n  border-bottom: 1px solid rgba(64, 94, 132, 0.28);\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.game-filter-nav-summary {\n  margin-top: 0;\n  font-size: 0.72rem;\n  color: rgba(32, 55, 87, 0.82);\n  line-height: 1.2;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.game-filter-nav-summary-muted {\n  color: rgba(47, 67, 97, 0.56);\n}\n.game-filter-nav-separator {\n  display: none;\n}\n.game-filter-nav-badge-row {\n  min-width: 0;\n  display: flex;\n  align-items: center;\n  gap: 0.3rem;\n  overflow: hidden;\n}\n.game-filter-nav-badge-chip {\n  display: inline-flex;\n  align-items: center;\n  min-width: 0;\n  max-width: 100%;\n  border-radius: 9px;\n  border: 1px solid var(--game-filter-nav-chip-border, rgba(79, 103, 138, 0.28));\n  background: var(--game-filter-nav-chip-bg, linear-gradient(180deg, #edf3fb 0%, #e3ebf8 100%));\n  color: var(--game-filter-nav-chip-color, #2f4f77);\n  font-size: 0.74rem;\n  font-weight: 700;\n  line-height: 1;\n  padding: 0.28rem 0.54rem;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.game-filter-nav-overflow-inline {\n  position: absolute;\n  top: 0.15rem;\n  right: 2.1rem;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  min-width: 1.9rem;\n  border-radius: 9px;\n  border: 1px solid var(--game-filter-nav-chip-border, rgba(88, 105, 127, 0.34));\n  background: var(--game-filter-nav-chip-bg, linear-gradient(180deg, #eef2f7 0%, #e4e9f0 100%));\n  color: var(--game-filter-nav-chip-color, #4a5f78);\n  font-size: 0.74rem;\n  font-weight: 800;\n  line-height: 1;\n  padding: 0.26rem 0.5rem;\n  white-space: nowrap;\n}\n.game-filter-nav-btn .mat-icon {\n  align-self: center;\n  flex: 0 0 20px;\n  width: 20px;\n  height: 20px;\n  font-size: 20px;\n  line-height: 20px;\n  color: rgba(36, 65, 103, 0.68);\n}\n.game-filter-chip-grid {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 0.36rem;\n}\n.game-filter-chip {\n  border: 1px solid rgba(41, 70, 106, 0.22);\n  border-radius: 999px;\n  background: #f4f8ff;\n  color: #234066;\n  font: inherit;\n  font-size: 0.78rem;\n  font-weight: 700;\n  padding: 0.3rem 0.58rem;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.26rem;\n  cursor: pointer;\n  transition:\n    background-color 0.14s ease,\n    border-color 0.14s ease,\n    color 0.14s ease,\n    box-shadow 0.14s ease;\n}\n.game-filter-chip .mat-icon {\n  width: 14px;\n  height: 14px;\n  font-size: 14px;\n  line-height: 14px;\n}\n.game-filter-chip.active {\n  border-color: rgba(27, 85, 158, 0.5);\n  background:\n    linear-gradient(\n      180deg,\n      #dcebff 0%,\n      #cfe3ff 100%);\n  color: #123e70;\n  box-shadow: inset 0 0 0 1px rgba(30, 73, 127, 0.24), 0 1px 2px rgba(24, 53, 86, 0.16);\n}\n.game-filter-group-relationships {\n  grid-template-columns: 1fr;\n  align-content: start;\n}\n.game-filter-group-relationships .game-filter-group-head {\n  grid-column: 1/-1;\n}\n.game-filter-group-relationships .game-filter-nav-btn {\n  min-width: 0;\n}\n.game-filter-selector-overlay {\n  position: absolute;\n  inset: 0;\n  z-index: 7;\n  display: flex;\n  align-items: flex-start;\n  justify-content: center;\n  padding: 0.4rem;\n  pointer-events: auto;\n  background: rgba(241, 246, 255, 0.72);\n  -webkit-backdrop-filter: blur(1px);\n  backdrop-filter: blur(1px);\n}\n.game-filter-selector-panel {\n  border: 1px solid rgba(31, 56, 89, 0.18);\n  border-radius: 14px;\n  background:\n    linear-gradient(\n      180deg,\n      #ffffff 0%,\n      #f8fbff 100%);\n  position: relative;\n  width: 100%;\n  padding: 0.62rem;\n  display: flex;\n  flex-direction: column;\n  gap: 0.48rem;\n  align-items: stretch;\n  align-content: flex-start;\n  justify-content: flex-start;\n  pointer-events: auto;\n  height: auto;\n  max-height: 100%;\n  margin: 0;\n  overflow: auto;\n  box-shadow: 0 18px 34px rgba(12, 26, 46, 0.26);\n}\n.game-filter-selector-head {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.44rem;\n  padding-bottom: 0.22rem;\n  border-bottom: 1px solid rgba(74, 102, 139, 0.22);\n}\n.game-filter-selector-back {\n  border: 0;\n  background: transparent;\n  color: #203c64;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.28rem;\n  font: inherit;\n  font-size: 0.82rem;\n  font-weight: 800;\n  padding: 0;\n  cursor: pointer;\n}\n.game-filter-selector-back .mat-icon {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n  line-height: 16px;\n}\n.game-filter-selector-clear {\n  border: 1px solid rgba(41, 73, 110, 0.24);\n  border-radius: 999px;\n  background: rgba(255, 255, 255, 0.82);\n  color: #284970;\n  font: inherit;\n  font-size: 0.72rem;\n  font-weight: 700;\n  line-height: 1;\n  padding: 0.3rem 0.52rem;\n  cursor: pointer;\n}\n.game-filter-selector-selected {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 0.34rem;\n}\n.game-filter-selector-chip {\n  border: 1px solid rgba(35, 68, 107, 0.24);\n  border-radius: 999px;\n  background: rgba(255, 255, 255, 0.92);\n  color: #234368;\n  font: inherit;\n  font-size: 0.72rem;\n  font-weight: 700;\n  line-height: 1;\n  padding: 0.26rem 0.48rem;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.16rem;\n  cursor: pointer;\n}\n.game-filter-selector-chip .mat-icon {\n  width: 13px;\n  height: 13px;\n  font-size: 13px;\n  line-height: 13px;\n}\n.game-filter-selector-empty {\n  margin: 0;\n  font-size: 0.74rem;\n  color: rgba(31, 54, 86, 0.62);\n  font-style: italic;\n}\n.game-filter-language-entry {\n  margin-top: 0.08rem;\n}\n.game-filter-language-input-wrap {\n  position: relative;\n  display: block;\n}\n.game-filter-language-input-wrap input {\n  width: 100%;\n  box-sizing: border-box;\n  border: 1px solid rgba(58, 81, 114, 0.24);\n  border-radius: 10px;\n  padding: 0.5rem 2.1rem 0.5rem 0.58rem;\n  background: #f8fafd;\n  color: #213d61;\n  font: inherit;\n}\n.game-filter-language-submit-btn {\n  position: absolute;\n  right: 0.38rem;\n  top: 50%;\n  transform: translateY(-50%);\n  width: 28px;\n  height: 28px;\n  border: 1px solid rgba(56, 83, 119, 0.24);\n  border-radius: 8px;\n  background:\n    linear-gradient(\n      180deg,\n      #edf3fb 0%,\n      #e3ecf8 100%);\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  cursor: pointer;\n  padding: 0;\n}\n.game-filter-language-submit-btn .mat-icon {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n  line-height: 16px;\n  color: #34577f;\n}\n.game-filter-language-options {\n  display: grid;\n  gap: 0.35rem;\n  max-height: min(48vh, 360px);\n  overflow-y: auto;\n  padding-right: 0.06rem;\n}\n.game-filter-language-option {\n  width: 100%;\n  border: 1px solid rgba(62, 89, 121, 0.22);\n  border-radius: 12px;\n  background:\n    linear-gradient(\n      180deg,\n      #eef3fb 0%,\n      #e6edf8 100%);\n  color: #2b4a70;\n  font: inherit;\n  font-size: 0.9rem;\n  padding: 0.56rem 0.62rem;\n  text-align: left;\n  display: inline-flex;\n  align-items: center;\n  justify-content: flex-start;\n  cursor: pointer;\n}\n.game-filter-language-option-main {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.42rem;\n}\n.game-filter-language-option-main .mat-icon {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n  line-height: 16px;\n}\n.game-filter-language-option.game-filter-language-tone-1,\n.game-filter-selector-chip.game-filter-language-tone-1 {\n  background: #eaf4ff;\n  border-color: rgba(63, 122, 179, 0.34);\n  color: #2f6090;\n}\n.game-filter-language-option.game-filter-language-tone-2,\n.game-filter-selector-chip.game-filter-language-tone-2 {\n  background: #edf8f4;\n  border-color: rgba(75, 127, 113, 0.34);\n  color: #2f695b;\n}\n.game-filter-language-option.game-filter-language-tone-3,\n.game-filter-selector-chip.game-filter-language-tone-3 {\n  background: #f1f2ff;\n  border-color: rgba(70, 95, 187, 0.34);\n  color: #394f9c;\n}\n.game-filter-language-option.game-filter-language-tone-4,\n.game-filter-selector-chip.game-filter-language-tone-4 {\n  background: #fff2f8;\n  border-color: rgba(161, 72, 117, 0.34);\n  color: #8d3f66;\n}\n.game-filter-language-option.game-filter-language-tone-5,\n.game-filter-selector-chip.game-filter-language-tone-5 {\n  background: #fbf4ea;\n  border-color: rgba(125, 79, 36, 0.34);\n  color: #704822;\n}\n.game-filter-language-option.game-filter-language-tone-6,\n.game-filter-selector-chip.game-filter-language-tone-6 {\n  background: #eff4f9;\n  border-color: rgba(77, 102, 127, 0.34);\n  color: #415872;\n}\n.game-filter-language-option.game-filter-language-tone-7,\n.game-filter-selector-chip.game-filter-language-tone-7 {\n  background: #f7f5ea;\n  border-color: rgba(128, 109, 66, 0.34);\n  color: #746237;\n}\n.game-filter-language-option.game-filter-language-tone-8,\n.game-filter-selector-chip.game-filter-language-tone-8 {\n  background: #edf5ff;\n  border-color: rgba(45, 122, 160, 0.34);\n  color: #2f6782;\n}\n.game-filter-selector-option-group {\n  display: grid;\n  gap: 0.34rem;\n  border: 1px solid transparent;\n  border-radius: 12px;\n  padding: 0.4rem 0.42rem;\n}\n.game-filter-selector-option-group-head {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.34rem;\n}\n.game-filter-selector-option-group-tag {\n  border-radius: 999px;\n  border: 1px solid rgba(52, 86, 128, 0.28);\n  background: rgba(255, 255, 255, 0.74);\n  color: #2f527d;\n  font-size: 0.67rem;\n  font-weight: 800;\n  letter-spacing: 0.02em;\n  line-height: 1;\n  padding: 0.2rem 0.52rem;\n  text-transform: uppercase;\n  white-space: nowrap;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.24rem;\n}\n.game-filter-selector-option-group-tag-icon {\n  width: 12px;\n  height: 12px;\n  font-size: 12px;\n  line-height: 12px;\n  text-transform: none;\n}\n.game-filter-selector-option-group-line {\n  display: block;\n  height: 1px;\n  width: 100%;\n  background: rgba(84, 111, 147, 0.34);\n}\n.game-filter-actions {\n  grid-column: 1/-1;\n  display: flex;\n  justify-content: flex-end;\n  gap: 0.44rem;\n  padding-top: 0.12rem;\n}\n.filter-btn {\n  border-radius: 10px;\n  border: 1px solid rgba(36, 64, 99, 0.24);\n  font: inherit;\n  font-size: 0.82rem;\n  font-weight: 700;\n  padding: 0.42rem 0.68rem;\n  cursor: pointer;\n}\n.filter-btn.filter-btn-reset {\n  background: #fff;\n  color: #1f3659;\n}\n.filter-btn.filter-btn-apply {\n  background:\n    linear-gradient(\n      180deg,\n      #4f8fdf 0%,\n      #3e79c4 100%);\n  border-color: rgba(34, 96, 176, 0.46);\n  color: #fff;\n}\n.game-filter-selector-tone-interest {\n  background:\n    linear-gradient(\n      180deg,\n      #eaf8f5 0%,\n      #e0f2ee 100%);\n  border-color: rgba(45, 125, 120, 0.32);\n  --game-filter-nav-chip-bg:\n    linear-gradient(\n      180deg,\n      #dff1ec 0%,\n      #d2e8e1 100%);\n  --game-filter-nav-chip-border: rgba(45, 125, 120, 0.42);\n  --game-filter-nav-chip-color: #2a6662;\n}\n.game-filter-selector-tone-values {\n  background:\n    linear-gradient(\n      180deg,\n      #f0ecff 0%,\n      #e8e1fa 100%);\n  border-color: rgba(95, 78, 160, 0.32);\n  --game-filter-nav-chip-bg:\n    linear-gradient(\n      180deg,\n      #e8e2fb 0%,\n      #ddd4f6 100%);\n  --game-filter-nav-chip-border: rgba(95, 78, 160, 0.42);\n  --game-filter-nav-chip-color: #4d3f8f;\n}\n.game-filter-selector-tone-physique {\n  background:\n    linear-gradient(\n      180deg,\n      #eef5ff 0%,\n      #e3eefc 100%);\n  border-color: rgba(46, 102, 181, 0.32);\n  --game-filter-nav-chip-bg:\n    linear-gradient(\n      180deg,\n      #e0ecfb 0%,\n      #d4e4f7 100%);\n  --game-filter-nav-chip-border: rgba(46, 102, 181, 0.42);\n  --game-filter-nav-chip-color: #2f5f9b;\n}\n.game-filter-selector-tone-languages {\n  background:\n    linear-gradient(\n      180deg,\n      #edf8ee 0%,\n      #e2f1e4 100%);\n  border-color: rgba(44, 126, 72, 0.32);\n  --game-filter-nav-chip-bg:\n    linear-gradient(\n      180deg,\n      #e0f1e2 0%,\n      #d4e8d7 100%);\n  --game-filter-nav-chip-border: rgba(44, 126, 72, 0.42);\n  --game-filter-nav-chip-color: #2f6b42;\n}\n.game-filter-selector-tone-gender {\n  background:\n    linear-gradient(\n      180deg,\n      #fff4ea 0%,\n      #ffecdd 100%);\n  border-color: rgba(165, 94, 24, 0.32);\n  --game-filter-nav-chip-bg:\n    linear-gradient(\n      180deg,\n      #fbe8d8 0%,\n      #f4ddc8 100%);\n  --game-filter-nav-chip-border: rgba(165, 94, 24, 0.42);\n  --game-filter-nav-chip-color: #8f5524;\n}\n.game-filter-selector-tone-horoscope {\n  background:\n    linear-gradient(\n      180deg,\n      #f6f3ea 0%,\n      #eee9dc 100%);\n  border-color: rgba(128, 109, 66, 0.32);\n  --game-filter-nav-chip-bg:\n    linear-gradient(\n      180deg,\n      #ece7da 0%,\n      #e4dece 100%);\n  --game-filter-nav-chip-border: rgba(128, 109, 66, 0.42);\n  --game-filter-nav-chip-color: #6d5c36;\n}\n.game-filter-selector-tone-traits {\n  background:\n    linear-gradient(\n      180deg,\n      #fff1f4 0%,\n      #f9e6ed 100%);\n  border-color: rgba(160, 70, 111, 0.32);\n  --game-filter-nav-chip-bg:\n    linear-gradient(\n      180deg,\n      #fbe4ed 0%,\n      #f3d6e2 100%);\n  --game-filter-nav-chip-border: rgba(160, 70, 111, 0.42);\n  --game-filter-nav-chip-color: #904465;\n}\n.game-filter-selector-tone-smoking {\n  background:\n    linear-gradient(\n      180deg,\n      #e8f5ef 0%,\n      #deeee7 100%);\n  border-color: rgba(60, 133, 108, 0.32);\n  --game-filter-nav-chip-bg:\n    linear-gradient(\n      180deg,\n      #dceee6 0%,\n      #cfe4da 100%);\n  --game-filter-nav-chip-border: rgba(60, 133, 108, 0.42);\n  --game-filter-nav-chip-color: #2f6e58;\n}\n.game-filter-selector-tone-drinking {\n  background:\n    linear-gradient(\n      180deg,\n      #edf3ff 0%,\n      #e3ebfa 100%);\n  border-color: rgba(68, 96, 150, 0.32);\n  --game-filter-nav-chip-bg:\n    linear-gradient(\n      180deg,\n      #e0e9fb 0%,\n      #d5e0f7 100%);\n  --game-filter-nav-chip-border: rgba(68, 96, 150, 0.42);\n  --game-filter-nav-chip-color: #35598f;\n}\n.game-filter-selector-tone-workout {\n  background:\n    linear-gradient(\n      180deg,\n      #edf8ee 0%,\n      #e2f1e4 100%);\n  border-color: rgba(44, 126, 72, 0.32);\n  --game-filter-nav-chip-bg:\n    linear-gradient(\n      180deg,\n      #e0f1e2 0%,\n      #d4e8d7 100%);\n  --game-filter-nav-chip-border: rgba(44, 126, 72, 0.42);\n  --game-filter-nav-chip-color: #2f6b42;\n}\n.game-filter-selector-tone-pets {\n  background:\n    linear-gradient(\n      180deg,\n      #fff5ea 0%,\n      #ffeddc 100%);\n  border-color: rgba(166, 95, 31, 0.32);\n  --game-filter-nav-chip-bg:\n    linear-gradient(\n      180deg,\n      #fae9d8 0%,\n      #f3dfc9 100%);\n  --game-filter-nav-chip-border: rgba(166, 95, 31, 0.42);\n  --game-filter-nav-chip-color: #8f5a2e;\n}\n.game-filter-selector-tone-family {\n  background:\n    linear-gradient(\n      180deg,\n      #fff2ea 0%,\n      #ffe8de 100%);\n  border-color: rgba(160, 90, 51, 0.32);\n  --game-filter-nav-chip-bg:\n    linear-gradient(\n      180deg,\n      #fbe6da 0%,\n      #f3d9cb 100%);\n  --game-filter-nav-chip-border: rgba(160, 90, 51, 0.42);\n  --game-filter-nav-chip-color: #8c5432;\n}\n.game-filter-selector-tone-children {\n  background:\n    linear-gradient(\n      180deg,\n      #eef8ff 0%,\n      #e2f0fb 100%);\n  border-color: rgba(45, 122, 160, 0.32);\n  --game-filter-nav-chip-bg:\n    linear-gradient(\n      180deg,\n      #e0edf8 0%,\n      #d4e5f3 100%);\n  --game-filter-nav-chip-border: rgba(45, 122, 160, 0.42);\n  --game-filter-nav-chip-color: #2d6486;\n}\n.game-filter-selector-tone-love {\n  background:\n    linear-gradient(\n      180deg,\n      #fff1f4 0%,\n      #f9e6ed 100%);\n  border-color: rgba(160, 70, 111, 0.32);\n  --game-filter-nav-chip-bg:\n    linear-gradient(\n      180deg,\n      #fbe4ed 0%,\n      #f3d6e2 100%);\n  --game-filter-nav-chip-border: rgba(160, 70, 111, 0.42);\n  --game-filter-nav-chip-color: #904465;\n}\n.game-filter-selector-tone-communication {\n  background:\n    linear-gradient(\n      180deg,\n      #f2f1ff 0%,\n      #e8e5fb 100%);\n  border-color: rgba(97, 82, 164, 0.32);\n  --game-filter-nav-chip-bg:\n    linear-gradient(\n      180deg,\n      #e5e2f8 0%,\n      #dad4f2 100%);\n  --game-filter-nav-chip-border: rgba(97, 82, 164, 0.42);\n  --game-filter-nav-chip-color: #554890;\n}\n.game-filter-selector-tone-orientation {\n  background:\n    linear-gradient(\n      180deg,\n      #eef9f3 0%,\n      #e3f4ea 100%);\n  border-color: rgba(40, 125, 72, 0.32);\n  --game-filter-nav-chip-bg:\n    linear-gradient(\n      180deg,\n      #e0f1e5 0%,\n      #d3e8da 100%);\n  --game-filter-nav-chip-border: rgba(40, 125, 72, 0.42);\n  --game-filter-nav-chip-color: #2b6a40;\n}\n.game-filter-selector-tone-religion {\n  background:\n    linear-gradient(\n      180deg,\n      #f6f3ea 0%,\n      #eee9dc 100%);\n  border-color: rgba(128, 109, 66, 0.32);\n  --game-filter-nav-chip-bg:\n    linear-gradient(\n      180deg,\n      #ece7da 0%,\n      #e4dece 100%);\n  --game-filter-nav-chip-border: rgba(128, 109, 66, 0.42);\n  --game-filter-nav-chip-color: #6d5c36;\n}\n.game-filter-selector-tone-neutral {\n  background:\n    linear-gradient(\n      180deg,\n      #f6faff 0%,\n      #edf3ff 100%);\n  border-color: rgba(70, 96, 132, 0.3);\n  --game-filter-nav-chip-bg:\n    linear-gradient(\n      180deg,\n      #e8eff9 0%,\n      #dde6f2 100%);\n  --game-filter-nav-chip-border: rgba(70, 96, 132, 0.42);\n  --game-filter-nav-chip-color: #3d5878;\n}\n.game-filter-selector-panel[class*=game-filter-selector-tone-] {\n  background:\n    linear-gradient(\n      180deg,\n      #f8fbff 0%,\n      #edf4ff 100%);\n  border-color: rgba(105, 126, 156, 0.24);\n}\n.game-filter-group-tone-social {\n  color: #2f6aaf;\n  border-color: rgba(47, 106, 175, 0.36);\n}\n.game-filter-selector-option-group.game-filter-group-tone-social {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(223, 236, 255, 0.5) 0%,\n      rgba(223, 236, 255, 0.28) 100%);\n}\n.game-filter-selector-option-group-line.game-filter-group-tone-social {\n  background: rgba(47, 106, 175, 0.34);\n}\n.game-filter-group-tone-arts {\n  color: #6a57a8;\n  border-color: rgba(106, 87, 168, 0.36);\n}\n.game-filter-selector-option-group.game-filter-group-tone-arts {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(235, 227, 255, 0.5) 0%,\n      rgba(235, 227, 255, 0.28) 100%);\n}\n.game-filter-selector-option-group-line.game-filter-group-tone-arts {\n  background: rgba(106, 87, 168, 0.34);\n}\n.game-filter-group-tone-food {\n  color: #a5662f;\n  border-color: rgba(165, 102, 47, 0.36);\n}\n.game-filter-selector-option-group.game-filter-group-tone-food {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 236, 221, 0.56) 0%,\n      rgba(255, 236, 221, 0.32) 100%);\n}\n.game-filter-selector-option-group-line.game-filter-group-tone-food {\n  background: rgba(165, 102, 47, 0.3);\n}\n.game-filter-group-tone-active {\n  color: #317c52;\n  border-color: rgba(49, 124, 82, 0.36);\n}\n.game-filter-selector-option-group.game-filter-group-tone-active {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(222, 243, 231, 0.56) 0%,\n      rgba(222, 243, 231, 0.32) 100%);\n}\n.game-filter-selector-option-group-line.game-filter-group-tone-active {\n  background: rgba(49, 124, 82, 0.34);\n}\n.game-filter-group-tone-mind {\n  color: #2f7b77;\n  border-color: rgba(47, 123, 119, 0.36);\n}\n.game-filter-selector-option-group.game-filter-group-tone-mind {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(220, 241, 239, 0.56) 0%,\n      rgba(220, 241, 239, 0.32) 100%);\n}\n.game-filter-selector-option-group-line.game-filter-group-tone-mind {\n  background: rgba(47, 123, 119, 0.3);\n}\n.game-filter-group-tone-family {\n  color: #9c5e33;\n  border-color: rgba(156, 94, 51, 0.34);\n}\n.game-filter-selector-option-group.game-filter-group-tone-family {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 232, 219, 0.52) 0%,\n      rgba(255, 232, 219, 0.3) 100%);\n}\n.game-filter-selector-option-group-line.game-filter-group-tone-family {\n  background: rgba(156, 94, 51, 0.3);\n}\n.game-filter-group-tone-ambition {\n  color: #8b4f67;\n  border-color: rgba(139, 79, 103, 0.34);\n}\n.game-filter-selector-option-group.game-filter-group-tone-ambition {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(249, 228, 236, 0.56) 0%,\n      rgba(249, 228, 236, 0.32) 100%);\n}\n.game-filter-selector-option-group-line.game-filter-group-tone-ambition {\n  background: rgba(139, 79, 103, 0.3);\n}\n.game-filter-group-tone-lifestyle {\n  color: #2f7b77;\n  border-color: rgba(47, 123, 119, 0.34);\n}\n.game-filter-selector-option-group.game-filter-group-tone-lifestyle {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(221, 241, 239, 0.56) 0%,\n      rgba(221, 241, 239, 0.32) 100%);\n}\n.game-filter-selector-option-group-line.game-filter-group-tone-lifestyle {\n  background: rgba(47, 123, 119, 0.3);\n}\n.game-filter-group-tone-beliefs {\n  color: #7a664a;\n  border-color: rgba(122, 102, 74, 0.34);\n}\n.game-filter-selector-option-group.game-filter-group-tone-beliefs {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(245, 238, 224, 0.56) 0%,\n      rgba(245, 238, 224, 0.32) 100%);\n}\n.game-filter-selector-option-group-line.game-filter-group-tone-beliefs {\n  background: rgba(122, 102, 74, 0.3);\n}\n.game-filter-group-tone-identity {\n  color: #6254a3;\n  border-color: rgba(98, 84, 163, 0.34);\n}\n.game-filter-selector-option-group.game-filter-group-tone-identity {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(230, 226, 250, 0.56) 0%,\n      rgba(230, 226, 250, 0.32) 100%);\n}\n.game-filter-selector-option-group-line.game-filter-group-tone-identity {\n  background: rgba(98, 84, 163, 0.3);\n}\n.game-pair-mini-image-frame {\n  width: 100%;\n  max-width: none;\n  margin: 0;\n}\n.game-pair-mini-photo {\n  width: 100%;\n  height: 100%;\n  max-width: none;\n  object-fit: cover;\n}\n.game-card-image-overlay {\n  right: auto;\n  width: clamp(250px, 34%, 420px);\n  max-width: calc(100% - 1.44rem);\n}\n.game-pair-mini-card .game-card-image-overlay {\n  right: 0;\n  width: auto;\n  max-width: none;\n}\n.game-filter-layout-columns {\n  grid-template-columns: minmax(0, 1.05fr) minmax(0, 1fr) minmax(0, 1fr);\n  align-items: stretch;\n}\n.game-filter-layout-col {\n  align-content: stretch;\n}\n.game-filter-layout-col-lifestyle > .game-filter-group-lifestyle,\n.game-filter-layout-col-relationships > .game-filter-group-relationships,\n.game-filter-layout-col-basics > .game-filter-group-beliefs {\n  height: 100%;\n}\n.game-filter-layout-col-relationships > .game-filter-group-relationships {\n  display: flex;\n  flex-direction: column;\n}\n.game-filter-layout-col-relationships .game-filter-nav-btn {\n  flex: 1 1 0;\n  min-height: 3.45rem;\n}\n@media (max-width: 760px) {\n  .game-card-deck {\n    --rate-card-image-fit: contain;\n  }\n  :host {\n    height: 100%;\n    min-height: 0;\n  }\n  .game-popup {\n    padding: 0;\n    align-items: stretch;\n    justify-content: stretch;\n  }\n  .game-social-query-bar {\n    grid-template-columns: repeat(2, minmax(0, 1fr));\n    gap: 0.4rem;\n  }\n  .game-card-image-overlay {\n    right: 0.72rem;\n    width: auto;\n    max-width: none;\n  }\n  .game-pair-mini-card .game-card-image-overlay {\n    right: 0;\n    width: auto;\n    max-width: none;\n  }\n  .game-layout-single {\n    min-height: 0;\n    flex: 1 1 auto;\n    --game-stack-inline-gap: 0.2rem;\n  }\n  .game-blocked-panel {\n    width: 100%;\n    margin-top: 3.4rem;\n    padding: 1.2rem 0.9rem;\n  }\n  .game-blocked-panel p {\n    max-width: 100%;\n  }\n  .game-stack-progress-row {\n    padding: 0 var(--game-stack-inline-gap);\n  }\n  .game-card-deck,\n  .game-card-main {\n    min-height: 0;\n    flex: 1 1 auto;\n  }\n  .game-pair-stack {\n    height: 100%;\n    --game-pair-gap: 0;\n    --game-pair-pad: 0.3rem;\n    display: flex;\n    align-items: stretch;\n    gap: 0;\n  }\n  .game-pair-mini-card {\n    min-width: 0;\n  }\n  .game-pair-mini-card-woman {\n    flex: 0 0 var(--game-pair-split);\n    width: var(--game-pair-split);\n    border-top-right-radius: 0;\n    border-bottom-right-radius: 0;\n    border-right-width: 0;\n  }\n  .game-pair-mini-card-man {\n    flex: 0 0 calc(100% - var(--game-pair-split));\n    width: calc(100% - var(--game-pair-split));\n    margin-left: -1px;\n    border-top-left-radius: 0;\n    border-bottom-left-radius: 0;\n  }\n  .game-pair-mini-card-woman .game-pair-mini-image-frame {\n    border-top-right-radius: 0;\n    border-bottom-right-radius: 0;\n  }\n  .game-pair-mini-card-man .game-pair-mini-image-frame {\n    border-top-left-radius: 0;\n    border-bottom-left-radius: 0;\n  }\n  .game-pair-resize-handle {\n    position: absolute;\n    display: inline-flex;\n    align-items: center;\n    justify-content: center;\n    left: var(--game-pair-split);\n    top: var(--game-pair-pad);\n    bottom: var(--game-pair-pad);\n    width: 20px;\n    transform: translateX(-50%);\n    border: 0;\n    padding: 0;\n    margin: 0;\n    background: transparent;\n    z-index: 26;\n    touch-action: none;\n    cursor: ew-resize;\n  }\n  .game-pair-resize-handle::before {\n    content: "";\n    position: absolute;\n    inset: 0;\n  }\n  .game-pair-resize-handle-grip {\n    width: 4px;\n    height: 36%;\n    min-height: 52px;\n    border-radius: 999px;\n    border: 1px solid rgba(166, 196, 232, 0.74);\n    background:\n      linear-gradient(\n        180deg,\n        rgba(241, 247, 255, 0.94) 0%,\n        rgba(218, 232, 249, 0.9) 100%);\n    box-shadow: 0 0 0 1px rgba(9, 22, 40, 0.14), 0 8px 14px rgba(6, 18, 36, 0.34);\n    pointer-events: none;\n  }\n  .game-pair-stack.is-resizing .game-pair-resize-handle-grip {\n    background:\n      linear-gradient(\n        180deg,\n        rgba(255, 247, 227, 0.96) 0%,\n        rgba(255, 229, 165, 0.9) 100%);\n    border-color: rgba(218, 168, 51, 0.86);\n  }\n  .card-image-area,\n  .card-image-content {\n    min-height: 0;\n  }\n  .card-image-area {\n    flex: 1 1 auto;\n  }\n  .rating-stars {\n    grid-template-columns: repeat(5, minmax(0, 1fr));\n    gap: 0.24rem;\n  }\n  .game-rating-dock {\n    padding: 0 var(--game-stack-inline-gap) calc(0.64rem + env(safe-area-inset-bottom));\n    touch-action: manipulation;\n    content-visibility: auto;\n  }\n  .star-btn {\n    min-height: 29px;\n    font-size: 0.94rem;\n  }\n  .game-filter-popup-header {\n    padding: 0.58rem 0.64rem;\n  }\n  .game-filter-popup-header-actions {\n    gap: 0.34rem;\n  }\n  .popup-filter-meta {\n    font-size: 0.64rem;\n    padding: 0.2rem 0.4rem;\n  }\n  .game-popup-close-btn {\n    width: 30px;\n    height: 30px;\n  }\n  .game-popup-apply-btn {\n    width: 30px;\n    height: 30px;\n  }\n  .game-filter-popup-panel {\n    width: 100vw;\n    max-width: 100vw;\n    min-height: 100dvh;\n    height: 100dvh;\n    max-height: 100dvh;\n    border-radius: 0;\n    border-left-width: 0;\n    border-right-width: 0;\n  }\n  .game-filter-body {\n    padding: 0.4rem 0.4rem calc(0.75rem + env(safe-area-inset-bottom));\n    max-height: none;\n    overflow-y: auto;\n    overflow-x: hidden;\n    overscroll-behavior: contain;\n    -webkit-overflow-scrolling: touch;\n  }\n  .game-filter-selector-overlay {\n    inset: 0;\n    padding: 0.4rem 0.2rem calc(0.6rem + env(safe-area-inset-bottom));\n  }\n  .game-filter-selector-panel {\n    width: 100%;\n    height: auto;\n    max-height: 100%;\n  }\n  .game-filter-layout-columns {\n    grid-template-columns: 1fr;\n    padding-bottom: calc(0.5rem + env(safe-area-inset-bottom));\n  }\n  .game-filter-layout-col {\n    align-content: start;\n  }\n  .game-filter-layout-col-lifestyle > .game-filter-group-lifestyle,\n  .game-filter-layout-col-relationships > .game-filter-group-relationships,\n  .game-filter-layout-col-basics > .game-filter-group-beliefs {\n    height: auto;\n  }\n  .game-filter-layout-col-relationships > .game-filter-group-relationships {\n    display: grid;\n    flex-direction: initial;\n  }\n  .game-filter-layout-col-relationships .game-filter-nav-btn {\n    flex: initial;\n    min-height: 0;\n  }\n}\n/*# sourceMappingURL=home.component.css.map */\n'] }]
    }], () => [{ type: ChangeDetectorRef }, { type: ActivitiesPopupStore }, { type: ProfileStore }, { type: ExplanationGuideService }, { type: GameService }, { type: UsersService }], { homeSmartList: [{
      type: ViewChild,
      args: ["homeSmartList"]
    }], onWindowPointerMove: [{
      type: HostListener,
      args: ["window:pointermove", ["$event"]]
    }], onWindowPointerUp: [{
      type: HostListener,
      args: ["window:pointerup", ["$event"]]
    }], onWindowPointerCancel: [{
      type: HostListener,
      args: ["window:pointercancel", ["$event"]]
    }] });
  });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(HomeComponent, { className: "HomeComponent", filePath: "app/home/components/home/home.component.ts", lineNumber: 176 });
})();
export {
  HomeComponent
};
//# sourceMappingURL=home.component-SDQS6P6F.js.map
