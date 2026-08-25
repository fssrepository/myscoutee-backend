import {
  LazyBgImageDirective
} from "./chunk-QEZI4ZBE.js";
import {
  PopupPresenceStore
} from "./chunk-MVR37RGJ.js";
import {
  AppMenuTriggerComponent,
  CounterBadgePipe,
  I18nPipe,
  IndicatorComponent
} from "./chunk-FOAFZS65.js";
import {
  MatIcon,
  MatIconModule
} from "./chunk-EDHGCWPF.js";
import {
  AppUtils
} from "./chunk-ILMZK7SM.js";
import {
  CommonModule,
  NgClass,
  NgTemplateOutlet
} from "./chunk-J7IJFFQ2.js";
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  HostListener,
  Injectable,
  Input,
  Output,
  __spreadProps,
  __spreadValues,
  effect,
  inject,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵclassProp,
  ɵɵcomponentInstance,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵdefineInjectable,
  ɵɵelement,
  ɵɵelementContainer,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵpipe,
  ɵɵpipeBind1,
  ɵɵprojection,
  ɵɵprojectionDef,
  ɵɵproperty,
  ɵɵpureFunction0,
  ɵɵpureFunction1,
  ɵɵreference,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIdentity,
  ɵɵresetView,
  ɵɵresolveWindow,
  ɵɵrestoreView,
  ɵɵsanitizeUrl,
  ɵɵstyleProp,
  ɵɵtemplate,
  ɵɵtemplateRefExtractor,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1
} from "./chunk-XJL7SWH7.js";

// src/app/shared/ui/components/core/smart-list/card/card.types.ts
var CARD_MENU_ACTIONS = {
  accept: { label: "accept", icon: "done", tone: "accent" },
  addOrganizerNote: { label: "add.organizer.note", icon: "edit_note" },
  askOrganizer: { label: "ask.organizer", icon: "support_agent" },
  assetAvailability: { label: "asset.availability", icon: "event_available", tone: "accent" },
  bookEvent: { label: "book.event", icon: "person_add", tone: "accent" },
  borrowAsset: { label: "borrow", icon: "volunteer_activism", tone: "accent" },
  capacity: { label: "capacity", icon: "groups" },
  contactOwner: { label: "contact.owner", icon: "support_agent" },
  continueBooking: { label: "event.checkout.continue.booking", icon: "shopping_basket", tone: "accent" },
  continueBookingPending: { label: "event.checkout.continue.booking", icon: "shopping_basket", tone: "warning" },
  delete: { label: "delete", icon: "delete", tone: "destructive" },
  deleteEvent: { label: "delete.event", icon: "delete", tone: "destructive" },
  edit: { label: "edit", icon: "edit", tone: "accent" },
  editAsset: { label: "edit.asset", icon: "edit" },
  editEvent: { label: "edit.event", icon: "edit" },
  editOrganizerNote: { label: "edit.organizer.note", icon: "edit_note" },
  externalInfo: { label: "External Info", icon: "open_in_new", tone: "accent" },
  feature: { label: "feature", icon: "star", tone: "accent" },
  joinResource: { label: "join.resource", icon: "login", tone: "accent" },
  joinWaitlist: { label: "join.waiting.list", icon: "hourglass_empty", tone: "accent" },
  leaveEvent: { label: "leave.event", icon: "exit_to_app", tone: "warning" },
  leaveResource: { label: "leave.resource", icon: "logout" },
  makeManager: { label: "asset.requests.promote.to.manager", icon: "manage_accounts", tone: "accent" },
  revokeManager: { label: "Visszavon\xE1s", icon: "person_remove", tone: "warning" },
  manage: { label: "manage", icon: "settings", tone: "accent" },
  manageEvent: { label: "manage.event", icon: "settings" },
  markSolved: { label: "admin.review.action.mark.solved", icon: "check_circle", tone: "accent" },
  markUnresolved: { label: "admin.review.action.mark.unresolved", icon: "restart_alt", tone: "warning" },
  markNotificationRead: { label: "Mark as read", icon: "done_all", tone: "accent" },
  notifyParticipants: { label: "notify.participants", icon: "support_agent" },
  paymentSummary: { label: "event.checkout.payment.summary", icon: "receipt_long", tone: "positive" },
  publish: { label: "publish", icon: "campaign", tone: "accent" },
  rejectInvitation: { label: "reject.invitation", icon: "block", tone: "destructive" },
  remove: { label: "reject", icon: "delete", tone: "destructive" },
  removeAssignment: { label: "remove", icon: "link_off", tone: "destructive" },
  removeFeedback: { label: "remove", icon: "remove_circle", tone: "destructive" },
  reportManager: { label: "report.manager", icon: "flag", tone: "warning" },
  reportOrganizer: { label: "report.organizer", icon: "flag", tone: "warning" },
  reportOwner: { label: "report.owner", icon: "flag", tone: "warning" },
  requestJoin: { label: "request.join", icon: "person_add", tone: "accent" },
  restore: { label: "restore", icon: "restore_from_trash" },
  restoreFeedback: { label: "restore.feedback", icon: "restore" },
  route: { label: "route", icon: "route" },
  share: { label: "share", icon: "ios_share" },
  shareAsset: { label: "share.asset", icon: "ios_share" },
  shareEvent: { label: "share.event", icon: "ios_share" },
  startFeedback: { label: "start.feedback", icon: "play_arrow" },
  supportBlock: { label: "activities.support.case.action.block", icon: "block", tone: "destructive" },
  supportPick: { label: "activities.support.case.action.pick", icon: "person_add", tone: "accent" },
  supportReopen: { label: "activities.support.case.action.reopen", icon: "restart_alt" },
  supportSolve: { label: "activities.support.case.action.solve", icon: "check_circle", tone: "accent" },
  supportUnpick: { label: "activities.support.case.action.unpick", icon: "person_remove" },
  takeOver: { label: "take.over", icon: "verified_user", tone: "review" },
  unfeature: { label: "unfeature", icon: "star_outline", tone: "warning" },
  unpublish: { label: "unpublish", icon: "visibility_off", tone: "warning" },
  view: { label: "view.event", icon: "visibility" },
  viewArticle: { label: "Read more", icon: "auto_stories", tone: "accent" },
  viewAsset: { label: "view.asset", icon: "edit_square" },
  viewInvitation: { label: "view.invitation", icon: "visibility" },
  viewSubmittedFeedback: { label: "View my feedback", icon: "rate_review", tone: "accent" }
};

// src/app/shared/ui/components/core/smart-list/card/info-card/info-card.component.ts
var _c0 = () => [];
var _c1 = (a0) => ({ $implicit: a0 });
function InfoCardComponent_Conditional_2_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-icon");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.mediaIcon());
  }
}
function InfoCardComponent_Conditional_2_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "small");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.mediaSubtitle());
  }
}
function InfoCardComponent_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 3);
    \u0275\u0275conditionalCreate(1, InfoCardComponent_Conditional_2_Conditional_1_Template, 2, 1, "mat-icon");
    \u0275\u0275elementStart(2, "strong");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(4, InfoCardComponent_Conditional_2_Conditional_4_Template, 2, 1, "small");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.mediaIcon() ? 1 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.mediaTitle());
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.mediaSubtitle() ? 4 : -1);
  }
}
function InfoCardComponent_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 4);
    \u0275\u0275element(1, "app-indicator", 16);
    \u0275\u0275elementEnd();
  }
}
function InfoCardComponent_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-icon", 5);
    \u0275\u0275text(1, "image_not_supported");
    \u0275\u0275elementEnd();
  }
}
function InfoCardComponent_Conditional_5_Conditional_0_ng_container_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainer(0);
  }
}
function InfoCardComponent_Conditional_5_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 19);
    \u0275\u0275pipe(1, "i18n");
    \u0275\u0275listener("click", function InfoCardComponent_Conditional_5_Conditional_0_Template_button_click_0_listener($event) {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.onMediaStartActivated($event));
    });
    \u0275\u0275template(2, InfoCardComponent_Conditional_5_Conditional_0_ng_container_2_Template, 1, 0, "ng-container", 20);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const mediaStart_r3 = \u0275\u0275nextContext();
    const ctx_r0 = \u0275\u0275nextContext();
    const overlayContent_r4 = \u0275\u0275reference(21);
    \u0275\u0275classProp("ui-info-card__overlay-action--avatar", ctx_r0.overlayVariant(mediaStart_r3) === "avatar")("ui-info-card__overlay-action--badge", ctx_r0.overlayVariant(mediaStart_r3) === "badge")("ui-info-card__overlay-action--toggle", ctx_r0.overlayVariant(mediaStart_r3) === "toggle")("ui-info-card__overlay-action--shape-circle", ctx_r0.overlayShape(mediaStart_r3) === "circle")("ui-info-card__overlay-action--layout-avatar-metric", ctx_r0.overlayLayout(mediaStart_r3) === "avatar-metric")("ui-info-card__overlay-action--layout-badge-with-leading-accessory", ctx_r0.overlayLayout(mediaStart_r3) === "badge-with-leading-accessory")("ui-info-card__overlay-action--tone-default", ctx_r0.overlayTone(mediaStart_r3) === "default")("ui-info-card__overlay-action--tone-stage", ctx_r0.overlayTone(mediaStart_r3) === "stage")("ui-info-card__overlay-action--tone-cool", ctx_r0.overlayTone(mediaStart_r3) === "cool")("ui-info-card__overlay-action--tone-cool-mid", ctx_r0.overlayTone(mediaStart_r3) === "cool-mid")("ui-info-card__overlay-action--tone-neutral", ctx_r0.overlayTone(mediaStart_r3) === "neutral")("ui-info-card__overlay-action--tone-warm-mid", ctx_r0.overlayTone(mediaStart_r3) === "warm-mid")("ui-info-card__overlay-action--tone-warm", ctx_r0.overlayTone(mediaStart_r3) === "warm")("ui-info-card__overlay-action--tone-public", ctx_r0.overlayTone(mediaStart_r3) === "public")("ui-info-card__overlay-action--tone-friends", ctx_r0.overlayTone(mediaStart_r3) === "friends")("ui-info-card__overlay-action--tone-invitation", ctx_r0.overlayTone(mediaStart_r3) === "invitation")("ui-info-card__overlay-action--tone-full", ctx_r0.overlayTone(mediaStart_r3) === "full")("ui-info-card__overlay-action--tone-inactive", ctx_r0.overlayTone(mediaStart_r3) === "inactive")("ui-info-card__overlay-action--tone-selected", ctx_r0.overlayTone(mediaStart_r3) === "selected")("ui-info-card__overlay-action--tone-review", ctx_r0.overlayTone(mediaStart_r3) === "review")("ui-info-card__overlay-action--tone-blocked", ctx_r0.overlayTone(mediaStart_r3) === "blocked")("ui-info-card__overlay-action--tone-deleted", ctx_r0.overlayTone(mediaStart_r3) === "deleted")("ui-info-card__overlay-action--tone-woman", ctx_r0.overlayTone(mediaStart_r3) === "woman")("ui-info-card__overlay-action--tone-man", ctx_r0.overlayTone(mediaStart_r3) === "man")("ui-info-card__overlay-action--tone-1", ctx_r0.overlayTone(mediaStart_r3) === "tone-1")("ui-info-card__overlay-action--tone-2", ctx_r0.overlayTone(mediaStart_r3) === "tone-2")("ui-info-card__overlay-action--tone-3", ctx_r0.overlayTone(mediaStart_r3) === "tone-3")("ui-info-card__overlay-action--tone-4", ctx_r0.overlayTone(mediaStart_r3) === "tone-4")("ui-info-card__overlay-action--tone-5", ctx_r0.overlayTone(mediaStart_r3) === "tone-5")("ui-info-card__overlay-action--tone-6", ctx_r0.overlayTone(mediaStart_r3) === "tone-6")("ui-info-card__overlay-action--tone-7", ctx_r0.overlayTone(mediaStart_r3) === "tone-7")("ui-info-card__overlay-action--tone-8", ctx_r0.overlayTone(mediaStart_r3) === "tone-8");
    \u0275\u0275property("disabled", mediaStart_r3.disabled);
    \u0275\u0275attribute("aria-label", \u0275\u0275pipeBind1(1, 68, mediaStart_r3.ariaLabel || ctx_r0.overlayLabel(mediaStart_r3)));
    \u0275\u0275advance(2);
    \u0275\u0275property("ngTemplateOutlet", overlayContent_r4)("ngTemplateOutletContext", \u0275\u0275pureFunction1(70, _c1, mediaStart_r3));
  }
}
function InfoCardComponent_Conditional_5_Conditional_1_ng_container_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainer(0);
  }
}
function InfoCardComponent_Conditional_5_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 21);
    \u0275\u0275template(1, InfoCardComponent_Conditional_5_Conditional_1_ng_container_1_Template, 1, 0, "ng-container", 20);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const mediaStart_r3 = \u0275\u0275nextContext();
    const ctx_r0 = \u0275\u0275nextContext();
    const overlayContent_r4 = \u0275\u0275reference(21);
    \u0275\u0275classProp("ui-info-card__overlay-action--avatar", ctx_r0.overlayVariant(mediaStart_r3) === "avatar")("ui-info-card__overlay-action--badge", ctx_r0.overlayVariant(mediaStart_r3) === "badge")("ui-info-card__overlay-action--toggle", ctx_r0.overlayVariant(mediaStart_r3) === "toggle")("ui-info-card__overlay-action--shape-circle", ctx_r0.overlayShape(mediaStart_r3) === "circle")("ui-info-card__overlay-action--tone-default", ctx_r0.overlayTone(mediaStart_r3) === "default")("ui-info-card__overlay-action--tone-stage", ctx_r0.overlayTone(mediaStart_r3) === "stage")("ui-info-card__overlay-action--layout-avatar-metric", ctx_r0.overlayLayout(mediaStart_r3) === "avatar-metric")("ui-info-card__overlay-action--layout-badge-with-leading-accessory", ctx_r0.overlayLayout(mediaStart_r3) === "badge-with-leading-accessory")("ui-info-card__overlay-action--tone-cool", ctx_r0.overlayTone(mediaStart_r3) === "cool")("ui-info-card__overlay-action--tone-cool-mid", ctx_r0.overlayTone(mediaStart_r3) === "cool-mid")("ui-info-card__overlay-action--tone-neutral", ctx_r0.overlayTone(mediaStart_r3) === "neutral")("ui-info-card__overlay-action--tone-warm-mid", ctx_r0.overlayTone(mediaStart_r3) === "warm-mid")("ui-info-card__overlay-action--tone-warm", ctx_r0.overlayTone(mediaStart_r3) === "warm")("ui-info-card__overlay-action--tone-public", ctx_r0.overlayTone(mediaStart_r3) === "public")("ui-info-card__overlay-action--tone-friends", ctx_r0.overlayTone(mediaStart_r3) === "friends")("ui-info-card__overlay-action--tone-invitation", ctx_r0.overlayTone(mediaStart_r3) === "invitation")("ui-info-card__overlay-action--tone-full", ctx_r0.overlayTone(mediaStart_r3) === "full")("ui-info-card__overlay-action--tone-inactive", ctx_r0.overlayTone(mediaStart_r3) === "inactive")("ui-info-card__overlay-action--tone-selected", ctx_r0.overlayTone(mediaStart_r3) === "selected")("ui-info-card__overlay-action--tone-review", ctx_r0.overlayTone(mediaStart_r3) === "review")("ui-info-card__overlay-action--tone-blocked", ctx_r0.overlayTone(mediaStart_r3) === "blocked")("ui-info-card__overlay-action--tone-deleted", ctx_r0.overlayTone(mediaStart_r3) === "deleted")("ui-info-card__overlay-action--tone-woman", ctx_r0.overlayTone(mediaStart_r3) === "woman")("ui-info-card__overlay-action--tone-man", ctx_r0.overlayTone(mediaStart_r3) === "man")("ui-info-card__overlay-action--tone-1", ctx_r0.overlayTone(mediaStart_r3) === "tone-1")("ui-info-card__overlay-action--tone-2", ctx_r0.overlayTone(mediaStart_r3) === "tone-2")("ui-info-card__overlay-action--tone-3", ctx_r0.overlayTone(mediaStart_r3) === "tone-3")("ui-info-card__overlay-action--tone-4", ctx_r0.overlayTone(mediaStart_r3) === "tone-4")("ui-info-card__overlay-action--tone-5", ctx_r0.overlayTone(mediaStart_r3) === "tone-5")("ui-info-card__overlay-action--tone-6", ctx_r0.overlayTone(mediaStart_r3) === "tone-6")("ui-info-card__overlay-action--tone-7", ctx_r0.overlayTone(mediaStart_r3) === "tone-7")("ui-info-card__overlay-action--tone-8", ctx_r0.overlayTone(mediaStart_r3) === "tone-8");
    \u0275\u0275attribute("aria-hidden", true);
    \u0275\u0275advance();
    \u0275\u0275property("ngTemplateOutlet", overlayContent_r4)("ngTemplateOutletContext", \u0275\u0275pureFunction1(67, _c1, mediaStart_r3));
  }
}
function InfoCardComponent_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, InfoCardComponent_Conditional_5_Conditional_0_Template, 3, 72, "button", 17)(1, InfoCardComponent_Conditional_5_Conditional_1_Template, 2, 69, "span", 18);
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275conditional(ctx_r0.isOverlayInteractive(ctx) ? 0 : 1);
  }
}
function InfoCardComponent_Conditional_6_Conditional_0_ng_container_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainer(0);
  }
}
function InfoCardComponent_Conditional_6_Conditional_0_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 25);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "counterBadge");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const mediaEnd_r6 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(2, 1, mediaEnd_r6.pendingCount));
  }
}
function InfoCardComponent_Conditional_6_Conditional_0_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 26);
    \u0275\u0275element(1, "app-indicator", 27);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275property("durationMs", 1500);
  }
}
function InfoCardComponent_Conditional_6_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 24);
    \u0275\u0275pipe(1, "i18n");
    \u0275\u0275listener("click", function InfoCardComponent_Conditional_6_Conditional_0_Template_button_click_0_listener($event) {
      \u0275\u0275restoreView(_r5);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.onMediaEndActivated($event));
    });
    \u0275\u0275template(2, InfoCardComponent_Conditional_6_Conditional_0_ng_container_2_Template, 1, 0, "ng-container", 20);
    \u0275\u0275conditionalCreate(3, InfoCardComponent_Conditional_6_Conditional_0_Conditional_3_Template, 3, 3, "span", 25);
    \u0275\u0275conditionalCreate(4, InfoCardComponent_Conditional_6_Conditional_0_Conditional_4_Template, 2, 1, "span", 26);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const mediaEnd_r6 = \u0275\u0275nextContext();
    const ctx_r0 = \u0275\u0275nextContext();
    const overlayContent_r4 = \u0275\u0275reference(21);
    \u0275\u0275classProp("ui-info-card__overlay-action--avatar", ctx_r0.overlayVariant(mediaEnd_r6) === "avatar")("ui-info-card__overlay-action--badge", ctx_r0.overlayVariant(mediaEnd_r6) === "badge")("ui-info-card__overlay-action--toggle", ctx_r0.overlayVariant(mediaEnd_r6) === "toggle")("ui-info-card__overlay-action--shape-circle", ctx_r0.overlayShape(mediaEnd_r6) === "circle")("ui-info-card__overlay-action--layout-avatar-metric", ctx_r0.overlayLayout(mediaEnd_r6) === "avatar-metric")("ui-info-card__overlay-action--layout-badge-with-leading-accessory", ctx_r0.overlayLayout(mediaEnd_r6) === "badge-with-leading-accessory")("asset-occupancy-badge-full", ctx_r0.overlayTone(mediaEnd_r6) === "full")("ui-info-card__overlay-action--tone-default", ctx_r0.overlayTone(mediaEnd_r6) === "default")("ui-info-card__overlay-action--tone-stage", ctx_r0.overlayTone(mediaEnd_r6) === "stage")("ui-info-card__overlay-action--tone-stage-active", ctx_r0.overlayTone(mediaEnd_r6) === "stage-active")("ui-info-card__overlay-action--tone-stage-scheduled", ctx_r0.overlayTone(mediaEnd_r6) === "stage-scheduled")("ui-info-card__overlay-action--tone-stage-blocked", ctx_r0.overlayTone(mediaEnd_r6) === "stage-blocked")("ui-info-card__overlay-action--tone-stage-start", ctx_r0.overlayTone(mediaEnd_r6) === "stage-start")("ui-info-card__overlay-action--tone-stage-review", ctx_r0.overlayTone(mediaEnd_r6) === "stage-review")("ui-info-card__overlay-action--tone-stage-finalized", ctx_r0.overlayTone(mediaEnd_r6) === "stage-finalized")("ui-info-card__overlay-action--tone-stage-suspended", ctx_r0.overlayTone(mediaEnd_r6) === "stage-suspended")("ui-info-card__overlay-action--tone-cool", ctx_r0.overlayTone(mediaEnd_r6) === "cool")("ui-info-card__overlay-action--tone-cool-mid", ctx_r0.overlayTone(mediaEnd_r6) === "cool-mid")("ui-info-card__overlay-action--tone-neutral", ctx_r0.overlayTone(mediaEnd_r6) === "neutral")("ui-info-card__overlay-action--tone-warm-mid", ctx_r0.overlayTone(mediaEnd_r6) === "warm-mid")("ui-info-card__overlay-action--tone-warm", ctx_r0.overlayTone(mediaEnd_r6) === "warm")("ui-info-card__overlay-action--tone-public", ctx_r0.overlayTone(mediaEnd_r6) === "public")("ui-info-card__overlay-action--tone-friends", ctx_r0.overlayTone(mediaEnd_r6) === "friends")("ui-info-card__overlay-action--tone-invitation", ctx_r0.overlayTone(mediaEnd_r6) === "invitation")("ui-info-card__overlay-action--tone-full", ctx_r0.overlayTone(mediaEnd_r6) === "full")("ui-info-card__overlay-action--tone-inactive", ctx_r0.overlayTone(mediaEnd_r6) === "inactive")("ui-info-card__overlay-action--tone-selected", ctx_r0.overlayTone(mediaEnd_r6) === "selected")("ui-info-card__overlay-action--tone-review", ctx_r0.overlayTone(mediaEnd_r6) === "review")("ui-info-card__overlay-action--tone-blocked", ctx_r0.overlayTone(mediaEnd_r6) === "blocked")("ui-info-card__overlay-action--tone-deleted", ctx_r0.overlayTone(mediaEnd_r6) === "deleted")("ui-info-card__overlay-action--tone-woman", ctx_r0.overlayTone(mediaEnd_r6) === "woman")("ui-info-card__overlay-action--tone-man", ctx_r0.overlayTone(mediaEnd_r6) === "man")("ui-info-card__overlay-action--tone-1", ctx_r0.overlayTone(mediaEnd_r6) === "tone-1")("ui-info-card__overlay-action--tone-2", ctx_r0.overlayTone(mediaEnd_r6) === "tone-2")("ui-info-card__overlay-action--tone-3", ctx_r0.overlayTone(mediaEnd_r6) === "tone-3")("ui-info-card__overlay-action--tone-4", ctx_r0.overlayTone(mediaEnd_r6) === "tone-4")("ui-info-card__overlay-action--tone-5", ctx_r0.overlayTone(mediaEnd_r6) === "tone-5")("ui-info-card__overlay-action--tone-6", ctx_r0.overlayTone(mediaEnd_r6) === "tone-6")("ui-info-card__overlay-action--tone-7", ctx_r0.overlayTone(mediaEnd_r6) === "tone-7")("ui-info-card__overlay-action--tone-8", ctx_r0.overlayTone(mediaEnd_r6) === "tone-8")("ui-info-card__overlay-action--ring-active", ctx_r0.overlayProgressRing(mediaEnd_r6));
    \u0275\u0275property("disabled", mediaEnd_r6.disabled);
    \u0275\u0275attribute("aria-label", \u0275\u0275pipeBind1(1, 88, mediaEnd_r6.ariaLabel || ctx_r0.overlayLabel(mediaEnd_r6)));
    \u0275\u0275advance(2);
    \u0275\u0275property("ngTemplateOutlet", overlayContent_r4)("ngTemplateOutletContext", \u0275\u0275pureFunction1(90, _c1, mediaEnd_r6));
    \u0275\u0275advance();
    \u0275\u0275conditional((mediaEnd_r6.pendingCount ?? 0) > 0 ? 3 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.overlayProgressRing(mediaEnd_r6) ? 4 : -1);
  }
}
function InfoCardComponent_Conditional_6_Conditional_1_ng_container_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainer(0);
  }
}
function InfoCardComponent_Conditional_6_Conditional_1_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 25);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "counterBadge");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const mediaEnd_r6 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(2, 1, mediaEnd_r6.pendingCount));
  }
}
function InfoCardComponent_Conditional_6_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 28);
    \u0275\u0275template(1, InfoCardComponent_Conditional_6_Conditional_1_ng_container_1_Template, 1, 0, "ng-container", 20);
    \u0275\u0275conditionalCreate(2, InfoCardComponent_Conditional_6_Conditional_1_Conditional_2_Template, 3, 3, "span", 25);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const mediaEnd_r6 = \u0275\u0275nextContext();
    const ctx_r0 = \u0275\u0275nextContext();
    const overlayContent_r4 = \u0275\u0275reference(21);
    \u0275\u0275classProp("ui-info-card__overlay-action--avatar", ctx_r0.overlayVariant(mediaEnd_r6) === "avatar")("ui-info-card__overlay-action--badge", ctx_r0.overlayVariant(mediaEnd_r6) === "badge")("ui-info-card__overlay-action--toggle", ctx_r0.overlayVariant(mediaEnd_r6) === "toggle")("ui-info-card__overlay-action--shape-circle", ctx_r0.overlayShape(mediaEnd_r6) === "circle")("ui-info-card__overlay-action--layout-avatar-metric", ctx_r0.overlayLayout(mediaEnd_r6) === "avatar-metric")("ui-info-card__overlay-action--layout-badge-with-leading-accessory", ctx_r0.overlayLayout(mediaEnd_r6) === "badge-with-leading-accessory")("asset-occupancy-badge-full", ctx_r0.overlayTone(mediaEnd_r6) === "full")("ui-info-card__overlay-action--tone-default", ctx_r0.overlayTone(mediaEnd_r6) === "default")("ui-info-card__overlay-action--tone-stage", ctx_r0.overlayTone(mediaEnd_r6) === "stage")("ui-info-card__overlay-action--tone-stage-active", ctx_r0.overlayTone(mediaEnd_r6) === "stage-active")("ui-info-card__overlay-action--tone-stage-scheduled", ctx_r0.overlayTone(mediaEnd_r6) === "stage-scheduled")("ui-info-card__overlay-action--tone-stage-blocked", ctx_r0.overlayTone(mediaEnd_r6) === "stage-blocked")("ui-info-card__overlay-action--tone-stage-start", ctx_r0.overlayTone(mediaEnd_r6) === "stage-start")("ui-info-card__overlay-action--tone-stage-review", ctx_r0.overlayTone(mediaEnd_r6) === "stage-review")("ui-info-card__overlay-action--tone-stage-finalized", ctx_r0.overlayTone(mediaEnd_r6) === "stage-finalized")("ui-info-card__overlay-action--tone-stage-suspended", ctx_r0.overlayTone(mediaEnd_r6) === "stage-suspended")("ui-info-card__overlay-action--tone-cool", ctx_r0.overlayTone(mediaEnd_r6) === "cool")("ui-info-card__overlay-action--tone-cool-mid", ctx_r0.overlayTone(mediaEnd_r6) === "cool-mid")("ui-info-card__overlay-action--tone-neutral", ctx_r0.overlayTone(mediaEnd_r6) === "neutral")("ui-info-card__overlay-action--tone-warm-mid", ctx_r0.overlayTone(mediaEnd_r6) === "warm-mid")("ui-info-card__overlay-action--tone-warm", ctx_r0.overlayTone(mediaEnd_r6) === "warm")("ui-info-card__overlay-action--tone-public", ctx_r0.overlayTone(mediaEnd_r6) === "public")("ui-info-card__overlay-action--tone-friends", ctx_r0.overlayTone(mediaEnd_r6) === "friends")("ui-info-card__overlay-action--tone-invitation", ctx_r0.overlayTone(mediaEnd_r6) === "invitation")("ui-info-card__overlay-action--tone-full", ctx_r0.overlayTone(mediaEnd_r6) === "full")("ui-info-card__overlay-action--tone-inactive", ctx_r0.overlayTone(mediaEnd_r6) === "inactive")("ui-info-card__overlay-action--tone-selected", ctx_r0.overlayTone(mediaEnd_r6) === "selected")("ui-info-card__overlay-action--tone-review", ctx_r0.overlayTone(mediaEnd_r6) === "review")("ui-info-card__overlay-action--tone-blocked", ctx_r0.overlayTone(mediaEnd_r6) === "blocked")("ui-info-card__overlay-action--tone-deleted", ctx_r0.overlayTone(mediaEnd_r6) === "deleted")("ui-info-card__overlay-action--tone-woman", ctx_r0.overlayTone(mediaEnd_r6) === "woman")("ui-info-card__overlay-action--tone-man", ctx_r0.overlayTone(mediaEnd_r6) === "man")("ui-info-card__overlay-action--tone-1", ctx_r0.overlayTone(mediaEnd_r6) === "tone-1")("ui-info-card__overlay-action--tone-2", ctx_r0.overlayTone(mediaEnd_r6) === "tone-2")("ui-info-card__overlay-action--tone-3", ctx_r0.overlayTone(mediaEnd_r6) === "tone-3")("ui-info-card__overlay-action--tone-4", ctx_r0.overlayTone(mediaEnd_r6) === "tone-4")("ui-info-card__overlay-action--tone-5", ctx_r0.overlayTone(mediaEnd_r6) === "tone-5")("ui-info-card__overlay-action--tone-6", ctx_r0.overlayTone(mediaEnd_r6) === "tone-6")("ui-info-card__overlay-action--tone-7", ctx_r0.overlayTone(mediaEnd_r6) === "tone-7")("ui-info-card__overlay-action--tone-8", ctx_r0.overlayTone(mediaEnd_r6) === "tone-8");
    \u0275\u0275attribute("aria-hidden", true);
    \u0275\u0275advance();
    \u0275\u0275property("ngTemplateOutlet", overlayContent_r4)("ngTemplateOutletContext", \u0275\u0275pureFunction1(84, _c1, mediaEnd_r6));
    \u0275\u0275advance();
    \u0275\u0275conditional((mediaEnd_r6.pendingCount ?? 0) > 0 ? 2 : -1);
  }
}
function InfoCardComponent_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, InfoCardComponent_Conditional_6_Conditional_0_Template, 5, 92, "button", 22)(1, InfoCardComponent_Conditional_6_Conditional_1_Template, 3, 86, "span", 23);
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275conditional(ctx_r0.isOverlayInteractive(ctx) ? 0 : 1);
  }
}
function InfoCardComponent_Conditional_7_ng_container_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainer(0);
  }
}
function InfoCardComponent_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 29);
    \u0275\u0275pipe(1, "i18n");
    \u0275\u0275template(2, InfoCardComponent_Conditional_7_ng_container_2_Template, 1, 0, "ng-container", 20);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const mediaBottomEnd_r7 = ctx;
    const ctx_r0 = \u0275\u0275nextContext();
    const overlayContent_r4 = \u0275\u0275reference(21);
    \u0275\u0275classProp("ui-info-card__overlay-action--avatar", ctx_r0.overlayVariant(mediaBottomEnd_r7) === "avatar")("ui-info-card__overlay-action--badge", ctx_r0.overlayVariant(mediaBottomEnd_r7) === "badge")("ui-info-card__overlay-action--toggle", ctx_r0.overlayVariant(mediaBottomEnd_r7) === "toggle")("ui-info-card__overlay-action--shape-circle", ctx_r0.overlayShape(mediaBottomEnd_r7) === "circle")("ui-info-card__overlay-action--layout-avatar-metric", ctx_r0.overlayLayout(mediaBottomEnd_r7) === "avatar-metric")("ui-info-card__overlay-action--layout-badge-with-leading-accessory", ctx_r0.overlayLayout(mediaBottomEnd_r7) === "badge-with-leading-accessory")("ui-info-card__overlay-action--tone-stage-scheduled", ctx_r0.overlayTone(mediaBottomEnd_r7) === "stage-scheduled")("ui-info-card__overlay-action--tone-stage-review", ctx_r0.overlayTone(mediaBottomEnd_r7) === "stage-review")("ui-info-card__overlay-action--tone-neutral", ctx_r0.overlayTone(mediaBottomEnd_r7) === "neutral");
    \u0275\u0275attribute("aria-hidden", mediaBottomEnd_r7.ariaLabel ? null : true)("aria-label", mediaBottomEnd_r7.ariaLabel ? \u0275\u0275pipeBind1(1, 22, mediaBottomEnd_r7.ariaLabel) : null);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngTemplateOutlet", overlayContent_r4)("ngTemplateOutletContext", \u0275\u0275pureFunction1(24, _c1, mediaBottomEnd_r7));
  }
}
function InfoCardComponent_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 30)(1, "mat-icon");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const leadingIcon_r8 = ctx;
    \u0275\u0275classProp("ui-info-card__leading--public", leadingIcon_r8.tone === "public")("ui-info-card__leading--stage", leadingIcon_r8.tone === "stage")("ui-info-card__leading--friends", leadingIcon_r8.tone === "friends")("ui-info-card__leading--invitation", leadingIcon_r8.tone === "invitation")("ui-info-card__leading--pending", leadingIcon_r8.tone === "pending");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(leadingIcon_r8.icon);
  }
}
function InfoCardComponent_For_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 11);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const row_r9 = ctx.$implicit;
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275attribute("data-i18n-ignore", (ctx_r0.card == null ? null : ctx_r0.card.i18nIgnoreContent) ? "" : null);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(row_r9);
  }
}
function InfoCardComponent_Conditional_15_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "app-menu-trigger", 31);
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275property("menuId", ctx_r0.sharedMenuId())("title", ctx_r0.sharedMenuTitle())("trigger", ctx_r0.sharedMenuTrigger())("items", ctx_r0.sharedMenuItems())("context", ctx_r0.sharedMenuContext);
  }
}
function InfoCardComponent_Conditional_15_Conditional_2_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 34);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "counterBadge");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(2, 1, ctx_r0.card == null ? null : ctx_r0.card.menuBadgeCount), " ");
  }
}
function InfoCardComponent_Conditional_15_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r10 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 33);
    \u0275\u0275pipe(1, "i18n");
    \u0275\u0275listener("pointerdown", function InfoCardComponent_Conditional_15_Conditional_2_Template_button_pointerdown_0_listener($event) {
      \u0275\u0275restoreView(_r10);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.onMenuTriggerPointerDown($event));
    })("click", function InfoCardComponent_Conditional_15_Conditional_2_Template_button_click_0_listener($event) {
      \u0275\u0275restoreView(_r10);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.toggleMenu($event));
    });
    \u0275\u0275elementStart(2, "mat-icon");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(4, InfoCardComponent_Conditional_15_Conditional_2_Conditional_4_Template, 3, 3, "span", 34);
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("is-open", ctx_r0.menuTriggerOpen);
    \u0275\u0275attribute("aria-label", \u0275\u0275pipeBind1(1, 6, "open.card.actions"))("aria-expanded", ctx_r0.menuTriggerOpen);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r0.menuTriggerOpen ? "close" : "more_vert");
    \u0275\u0275advance();
    \u0275\u0275conditional(((ctx_r0.card == null ? null : ctx_r0.card.menuBadgeCount) ?? 0) > 0 ? 4 : -1);
  }
}
function InfoCardComponent_Conditional_15_Conditional_3_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 36);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx);
  }
}
function InfoCardComponent_Conditional_15_Conditional_3_For_3_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r11 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 38);
    \u0275\u0275listener("click", function InfoCardComponent_Conditional_15_Conditional_3_For_3_Conditional_0_Template_button_click_0_listener($event) {
      const menuAction_r12 = \u0275\u0275restoreView(_r11);
      const action_r13 = \u0275\u0275nextContext().$implicit;
      const ctx_r0 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r0.onMenuActionSelected(action_r13, menuAction_r12, $event));
    });
    \u0275\u0275elementStart(1, "mat-icon");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4);
    \u0275\u0275pipe(5, "i18n");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const menuAction_r12 = ctx;
    \u0275\u0275classProp("item-action-menu-btn-publish", menuAction_r12.tone === "accent")("item-action-menu-btn-review", menuAction_r12.tone === "review")("item-action-menu-btn-warning", menuAction_r12.tone === "warning")("item-action-menu-btn-destructive", menuAction_r12.tone === "destructive");
    \u0275\u0275property("ngClass", "ui-info-card__menu-action--" + (menuAction_r12.tone ?? "default"));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(menuAction_r12.icon);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(5, 11, menuAction_r12.label));
  }
}
function InfoCardComponent_Conditional_15_Conditional_3_For_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, InfoCardComponent_Conditional_15_Conditional_3_For_3_Conditional_0_Template, 6, 13, "button", 37);
  }
  if (rf & 2) {
    let tmp_13_0;
    const action_r13 = ctx.$implicit;
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275conditional((tmp_13_0 = ctx_r0.availableActions[action_r13]) ? 0 : -1, tmp_13_0);
  }
}
function InfoCardComponent_Conditional_15_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 35);
    \u0275\u0275listener("click", function InfoCardComponent_Conditional_15_Conditional_3_Template_div_click_0_listener($event) {
      return $event.stopPropagation();
    });
    \u0275\u0275conditionalCreate(1, InfoCardComponent_Conditional_15_Conditional_3_Conditional_1_Template, 2, 1, "div", 36);
    \u0275\u0275repeaterCreate(2, InfoCardComponent_Conditional_15_Conditional_3_For_3_Template, 1, 1, null, null, \u0275\u0275componentInstance().trackByActionId, true);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_10_0;
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("is-open", ctx_r0.menuOpen)("ui-info-card__menu--mobile", ctx_r0.isMobileView)("ui-info-card__menu--desktop", !ctx_r0.isMobileView)("item-action-menu-mobile", ctx_r0.isMobileView)("item-action-menu-desktop", !ctx_r0.isMobileView)("ui-info-card__menu--open-up", ctx_r0.menuOpenUp)("is-open-up", ctx_r0.menuOpenUp);
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_10_0 = ctx_r0.resolvedMenuTitle()) ? 1 : -1, tmp_10_0);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r0.card == null ? null : ctx_r0.card.menuActions);
  }
}
function InfoCardComponent_Conditional_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 12);
    \u0275\u0275conditionalCreate(1, InfoCardComponent_Conditional_15_Conditional_1_Template, 1, 5, "app-menu-trigger", 31)(2, InfoCardComponent_Conditional_15_Conditional_2_Template, 5, 8);
    \u0275\u0275conditionalCreate(3, InfoCardComponent_Conditional_15_Conditional_3_Template, 4, 15, "div", 32);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.useSharedMenuTrigger ? 1 : 2);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r0.menuOpen && !ctx_r0.useSharedMenu && !ctx_r0.useSharedMenuTrigger ? 3 : -1);
  }
}
function InfoCardComponent_Conditional_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 39);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275styleProp("--ui-info-card-description-lines", ctx_r0.descriptionLines())("--ui-info-card-description-max-height", ctx_r0.descriptionMaxHeight());
    \u0275\u0275attribute("data-i18n-ignore", (ctx_r0.card == null ? null : ctx_r0.card.i18nIgnoreContent) ? "" : null);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.card == null ? null : ctx_r0.card.description, " ");
  }
}
function InfoCardComponent_For_18_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 40);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const row_r14 = ctx.$implicit;
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275classProp("ui-info-card__detail-row--mono", ctx_r0.detailStyle() === "mono");
    \u0275\u0275attribute("data-i18n-ignore", (ctx_r0.card == null ? null : ctx_r0.card.i18nIgnoreContent) ? "" : null);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", row_r14, " ");
  }
}
function InfoCardComponent_Conditional_19_For_2_Conditional_0_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-icon");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx);
  }
}
function InfoCardComponent_Conditional_19_For_2_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r15 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 44);
    \u0275\u0275pipe(1, "i18n");
    \u0275\u0275listener("click", function InfoCardComponent_Conditional_19_For_2_Conditional_0_Template_button_click_0_listener($event) {
      \u0275\u0275restoreView(_r15);
      const chip_r16 = \u0275\u0275nextContext().$implicit;
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.onFooterChipActivated(chip_r16, $event));
    });
    \u0275\u0275conditionalCreate(2, InfoCardComponent_Conditional_19_For_2_Conditional_0_Conditional_2_Template, 2, 1, "mat-icon");
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4);
    \u0275\u0275pipe(5, "i18n");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    let tmp_15_0;
    const chip_r16 = \u0275\u0275nextContext().$implicit;
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275property("ngClass", ctx_r0.footerChipClassList(chip_r16));
    \u0275\u0275attribute("aria-label", \u0275\u0275pipeBind1(1, 4, chip_r16.ariaLabel || chip_r16.label));
    \u0275\u0275advance(2);
    \u0275\u0275conditional((tmp_15_0 = ctx_r0.footerChipIcon(chip_r16)) ? 2 : -1, tmp_15_0);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(5, 6, chip_r16.label));
  }
}
function InfoCardComponent_Conditional_19_For_2_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 43);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "i18n");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const chip_r16 = \u0275\u0275nextContext().$implicit;
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275property("ngClass", ctx_r0.footerChipClassList(chip_r16));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(2, 2, chip_r16.label), " ");
  }
}
function InfoCardComponent_Conditional_19_For_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, InfoCardComponent_Conditional_19_For_2_Conditional_0_Template, 6, 8, "button", 42)(1, InfoCardComponent_Conditional_19_For_2_Conditional_1_Template, 3, 4, "span", 43);
  }
  if (rf & 2) {
    const chip_r16 = ctx.$implicit;
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275conditional(ctx_r0.isFooterChipInteractive(chip_r16) ? 0 : 1);
  }
}
function InfoCardComponent_Conditional_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 41);
    \u0275\u0275repeaterCreate(1, InfoCardComponent_Conditional_19_For_2_Template, 2, 1, null, null, \u0275\u0275componentInstance().trackByFooterChip, true);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275classProp("ui-info-card__footer-chips--actions", ctx_r0.hasFooterActions());
    \u0275\u0275advance();
    \u0275\u0275repeater((ctx_r0.card == null ? null : ctx_r0.card.footerChips) ?? \u0275\u0275pureFunction0(2, _c0));
  }
}
function InfoCardComponent_ng_template_20_Case_0_Conditional_0_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-icon");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const accessory_r17 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(accessory_r17.icon);
  }
}
function InfoCardComponent_ng_template_20_Case_0_Conditional_0_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const accessory_r17 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(accessory_r17.label);
  }
}
function InfoCardComponent_ng_template_20_Case_0_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 48);
    \u0275\u0275conditionalCreate(1, InfoCardComponent_ng_template_20_Case_0_Conditional_0_Conditional_1_Template, 2, 1, "mat-icon");
    \u0275\u0275conditionalCreate(2, InfoCardComponent_ng_template_20_Case_0_Conditional_0_Conditional_2_Template, 2, 1, "span");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const accessory_r17 = ctx;
    \u0275\u0275classProp("ui-info-card__overlay-leading-accessory--tone-default", accessory_r17.tone === "default")("ui-info-card__overlay-leading-accessory--tone-woman", accessory_r17.tone === "woman")("ui-info-card__overlay-leading-accessory--tone-man", accessory_r17.tone === "man")("ui-info-card__overlay-leading-accessory--tone-1", accessory_r17.tone === "tone-1")("ui-info-card__overlay-leading-accessory--tone-2", accessory_r17.tone === "tone-2")("ui-info-card__overlay-leading-accessory--tone-3", accessory_r17.tone === "tone-3")("ui-info-card__overlay-leading-accessory--tone-4", accessory_r17.tone === "tone-4")("ui-info-card__overlay-leading-accessory--tone-5", accessory_r17.tone === "tone-5")("ui-info-card__overlay-leading-accessory--tone-6", accessory_r17.tone === "tone-6")("ui-info-card__overlay-leading-accessory--tone-7", accessory_r17.tone === "tone-7")("ui-info-card__overlay-leading-accessory--tone-8", accessory_r17.tone === "tone-8");
    \u0275\u0275advance();
    \u0275\u0275conditional(accessory_r17.icon ? 1 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(accessory_r17.label ? 2 : -1);
  }
}
function InfoCardComponent_ng_template_20_Case_0_Conditional_1_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const action_r18 = \u0275\u0275nextContext(3).$implicit;
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.overlayDetailLabel(action_r18));
  }
}
function InfoCardComponent_ng_template_20_Case_0_Conditional_1_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-icon");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx);
  }
}
function InfoCardComponent_ng_template_20_Case_0_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 47);
    \u0275\u0275conditionalCreate(1, InfoCardComponent_ng_template_20_Case_0_Conditional_1_Conditional_1_Template, 2, 1, "span");
    \u0275\u0275conditionalCreate(2, InfoCardComponent_ng_template_20_Case_0_Conditional_1_Conditional_2_Template, 2, 1, "mat-icon");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_6_0;
    const action_r18 = \u0275\u0275nextContext(2).$implicit;
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.overlayDetailLabel(action_r18) ? 1 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_6_0 = ctx_r0.overlayDetailIcon(action_r18)) ? 2 : -1, tmp_6_0);
  }
}
function InfoCardComponent_ng_template_20_Case_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, InfoCardComponent_ng_template_20_Case_0_Conditional_0_Template, 3, 24, "span", 46);
    \u0275\u0275conditionalCreate(1, InfoCardComponent_ng_template_20_Case_0_Conditional_1_Template, 3, 2, "span", 47);
  }
  if (rf & 2) {
    let tmp_4_0;
    const action_r18 = \u0275\u0275nextContext().$implicit;
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275conditional((tmp_4_0 = ctx_r0.overlayLeadingAccessory(action_r18)) ? 0 : -1, tmp_4_0);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.overlayDetailLabel(action_r18) || ctx_r0.overlayDetailIcon(action_r18) ? 1 : -1);
  }
}
function InfoCardComponent_ng_template_20_Case_1_Conditional_1_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-icon");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const accessory_r19 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(accessory_r19.icon);
  }
}
function InfoCardComponent_ng_template_20_Case_1_Conditional_1_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "i18n");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const accessory_r19 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(2, 1, accessory_r19.label));
  }
}
function InfoCardComponent_ng_template_20_Case_1_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 50);
    \u0275\u0275conditionalCreate(1, InfoCardComponent_ng_template_20_Case_1_Conditional_1_Conditional_1_Template, 2, 1, "mat-icon");
    \u0275\u0275conditionalCreate(2, InfoCardComponent_ng_template_20_Case_1_Conditional_1_Conditional_2_Template, 3, 3, "span");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const accessory_r19 = ctx;
    \u0275\u0275classProp("ui-info-card__overlay-leading-accessory--tone-default", accessory_r19.tone === "default")("ui-info-card__overlay-leading-accessory--tone-positive", accessory_r19.tone === "positive")("ui-info-card__overlay-leading-accessory--tone-negative", accessory_r19.tone === "negative")("ui-info-card__overlay-leading-accessory--tone-woman", accessory_r19.tone === "woman")("ui-info-card__overlay-leading-accessory--tone-man", accessory_r19.tone === "man")("ui-info-card__overlay-leading-accessory--tone-1", accessory_r19.tone === "tone-1")("ui-info-card__overlay-leading-accessory--tone-2", accessory_r19.tone === "tone-2")("ui-info-card__overlay-leading-accessory--tone-3", accessory_r19.tone === "tone-3")("ui-info-card__overlay-leading-accessory--tone-4", accessory_r19.tone === "tone-4")("ui-info-card__overlay-leading-accessory--tone-5", accessory_r19.tone === "tone-5")("ui-info-card__overlay-leading-accessory--tone-6", accessory_r19.tone === "tone-6")("ui-info-card__overlay-leading-accessory--tone-7", accessory_r19.tone === "tone-7")("ui-info-card__overlay-leading-accessory--tone-8", accessory_r19.tone === "tone-8");
    \u0275\u0275advance();
    \u0275\u0275conditional(accessory_r19.icon ? 1 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(accessory_r19.label ? 2 : -1);
  }
}
function InfoCardComponent_ng_template_20_Case_1_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "i18n");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const action_r18 = \u0275\u0275nextContext(2).$implicit;
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(2, 1, ctx_r0.overlayLabel(action_r18)));
  }
}
function InfoCardComponent_ng_template_20_Case_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 45);
    \u0275\u0275conditionalCreate(1, InfoCardComponent_ng_template_20_Case_1_Conditional_1_Template, 3, 28, "span", 49);
    \u0275\u0275conditionalCreate(2, InfoCardComponent_ng_template_20_Case_1_Conditional_2_Template, 3, 3, "span");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_4_0;
    const action_r18 = \u0275\u0275nextContext().$implicit;
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_4_0 = ctx_r0.overlayLeadingAccessory(action_r18)) ? 1 : -1, tmp_4_0);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.overlayLabel(action_r18) ? 2 : -1);
  }
}
function InfoCardComponent_ng_template_20_Case_2_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "img", 51);
  }
  if (rf & 2) {
    \u0275\u0275property("src", ctx, \u0275\u0275sanitizeUrl);
  }
}
function InfoCardComponent_ng_template_20_Case_2_Conditional_1_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-icon");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx);
  }
}
function InfoCardComponent_ng_template_20_Case_2_Conditional_1_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "i18n");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const action_r18 = \u0275\u0275nextContext(3).$implicit;
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(2, 1, ctx_r0.overlayLabel(action_r18)));
  }
}
function InfoCardComponent_ng_template_20_Case_2_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, InfoCardComponent_ng_template_20_Case_2_Conditional_1_Conditional_0_Template, 2, 1, "mat-icon");
    \u0275\u0275conditionalCreate(1, InfoCardComponent_ng_template_20_Case_2_Conditional_1_Conditional_1_Template, 3, 3, "span");
  }
  if (rf & 2) {
    let tmp_5_0;
    const action_r18 = \u0275\u0275nextContext(2).$implicit;
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275conditional((tmp_5_0 = ctx_r0.overlayIcon(action_r18)) ? 0 : -1, tmp_5_0);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.overlayLabel(action_r18) ? 1 : -1);
  }
}
function InfoCardComponent_ng_template_20_Case_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, InfoCardComponent_ng_template_20_Case_2_Conditional_0_Template, 1, 1, "img", 51)(1, InfoCardComponent_ng_template_20_Case_2_Conditional_1_Template, 2, 2);
  }
  if (rf & 2) {
    let tmp_4_0;
    const action_r18 = \u0275\u0275nextContext().$implicit;
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275conditional((tmp_4_0 = ctx_r0.overlayImageUrl(action_r18)) ? 0 : 1, tmp_4_0);
  }
}
function InfoCardComponent_ng_template_20_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, InfoCardComponent_ng_template_20_Case_0_Template, 2, 2)(1, InfoCardComponent_ng_template_20_Case_1_Template, 3, 2, "span", 45)(2, InfoCardComponent_ng_template_20_Case_2_Template, 2, 1);
  }
  if (rf & 2) {
    let tmp_3_0;
    const action_r18 = ctx.$implicit;
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275conditional((tmp_3_0 = ctx_r0.overlayLayout(action_r18)) === "avatar-metric" ? 0 : tmp_3_0 === "badge-with-leading-accessory" ? 1 : 2);
  }
}
var InfoCardComponent = class _InfoCardComponent {
  static MOBILE_BREAKPOINT_PX = 760;
  static activeSharedMenuInstance = null;
  static activeDocumentMenuInstance = null;
  static documentPointerDownListener = null;
  static documentPointerDownTarget = null;
  hostRef = inject(ElementRef);
  cdr = inject(ChangeDetectorRef);
  availableActions = CARD_MENU_ACTIONS;
  card = null;
  useSharedMenu = false;
  useSharedMenuTrigger = false;
  sharedMenuContext = null;
  cardClick = new EventEmitter();
  mediaStartClick = new EventEmitter();
  mediaEndClick = new EventEmitter();
  menuAction = new EventEmitter();
  menuRequest = new EventEmitter();
  isMobileView = false;
  menuOpen = false;
  menuOpenUp = false;
  get menuTriggerOpen() {
    return this.menuOpen;
  }
  constructor() {
    this.syncMobileViewFromViewport();
  }
  ngOnDestroy() {
    if (_InfoCardComponent.activeSharedMenuInstance === this) {
      _InfoCardComponent.activeSharedMenuInstance = null;
    }
    if (_InfoCardComponent.activeDocumentMenuInstance === this) {
      _InfoCardComponent.clearDocumentMenuInstance(this);
    }
  }
  onViewportResize() {
    this.syncMobileViewFromViewport();
  }
  onEscapePressed(event) {
    if (!this.menuOpen) {
      return;
    }
    event.stopPropagation();
    this.closeMenu();
  }
  onCardActivated(event) {
    if (!this.card?.clickable) {
      return;
    }
    event?.stopPropagation();
    this.cardClick.emit({
      id: this.card.id,
      card: this.card
    });
  }
  cardImageUrl() {
    if (this.isTitleMedia()) {
      return null;
    }
    const imageUrl = AppUtils.mediaImageVariantUrl(this.card?.imageUrl, "medium");
    return imageUrl || null;
  }
  isTitleMedia() {
    return this.card?.mediaMode === "title";
  }
  mediaTitle() {
    return `${this.card?.mediaTitle ?? this.card?.title ?? ""}`.trim();
  }
  mediaSubtitle() {
    return `${this.card?.mediaSubtitle ?? ""}`.trim();
  }
  mediaIcon() {
    return `${this.card?.mediaIcon ?? this.card?.leadingIcon?.icon ?? ""}`.trim();
  }
  mediaTone() {
    return this.card?.mediaTone ?? "default";
  }
  onMediaStartActivated(event) {
    if (!this.card || !this.isOverlayInteractive(this.card.mediaStart)) {
      return;
    }
    event.stopPropagation();
    if (this.emitOverlayMenuAction(this.card.mediaStart, event)) {
      return;
    }
    this.mediaStartClick.emit({
      id: this.card.id,
      card: this.card
    });
  }
  onMediaEndActivated(event) {
    if (!this.card || !this.isOverlayInteractive(this.card.mediaEnd)) {
      return;
    }
    event.stopPropagation();
    if (this.emitOverlayMenuAction(this.card.mediaEnd, event)) {
      return;
    }
    this.mediaEndClick.emit({
      id: this.card.id,
      card: this.card
    });
  }
  emitOverlayMenuAction(action, event) {
    if (!this.card) {
      return false;
    }
    const resolvedAction = this.resolveOverlayMenuAction(action);
    if (!resolvedAction) {
      return false;
    }
    event.preventDefault();
    this.menuAction.emit({
      id: this.card.id,
      actionId: resolvedAction.id,
      action: resolvedAction,
      card: this.card
    });
    return true;
  }
  onMenuTriggerPointerDown(event) {
    event.stopPropagation();
  }
  toggleMenu(event) {
    event.preventDefault();
    event.stopPropagation();
    if (!this.card || !this.hasMenuActions()) {
      return;
    }
    const trigger = event.currentTarget;
    if (this.useSharedMenu) {
      const wasOpen = this.menuOpen;
      if (wasOpen) {
        this.closeMenu();
        if (_InfoCardComponent.activeSharedMenuInstance === this) {
          _InfoCardComponent.activeSharedMenuInstance = null;
        }
      } else {
        _InfoCardComponent.activeSharedMenuInstance?.closeMenu();
        _InfoCardComponent.activeSharedMenuInstance = this;
        this.menuOpenUp = this.shouldOpenMenuUp(trigger);
        this.menuOpen = true;
        this.cdr.markForCheck();
      }
      this.menuRequest.emit({
        id: this.card.id,
        card: this.card,
        actions: this.card.menuActions ?? [],
        title: this.sharedMenuTitle(),
        triggerRect: this.resolveMenuTriggerRect(trigger),
        openUp: this.shouldOpenMenuUp(trigger),
        closeTrigger: () => this.closeMenu()
      });
      return;
    }
    if (this.menuOpen) {
      this.closeMenu();
      return;
    }
    _InfoCardComponent.activeDocumentMenuInstance?.closeMenu();
    _InfoCardComponent.setDocumentMenuInstance(this);
    this.menuOpenUp = this.shouldOpenMenuUp(trigger);
    this.menuOpen = true;
    this.cdr.markForCheck();
  }
  closeMenu(event) {
    event?.stopPropagation();
    if (!this.menuOpen && !this.menuOpenUp) {
      return;
    }
    this.menuOpen = false;
    this.menuOpenUp = false;
    if (_InfoCardComponent.activeSharedMenuInstance === this) {
      _InfoCardComponent.activeSharedMenuInstance = null;
    }
    if (_InfoCardComponent.activeDocumentMenuInstance === this) {
      _InfoCardComponent.clearDocumentMenuInstance(this);
    }
    this.cdr.markForCheck();
  }
  onMenuActionSelected(action, config, event) {
    if (!this.card) {
      return;
    }
    const resolvedAction = __spreadValues({
      id: action
    }, config);
    event.preventDefault();
    event.stopPropagation();
    this.menuAction.emit({
      id: this.card.id,
      actionId: resolvedAction.id,
      action: resolvedAction,
      card: this.card
    });
    this.closeMenu();
  }
  isOverlayInteractive(action) {
    return !!action && action.interactive !== false && !action.disabled;
  }
  overlayVariant(action) {
    return action?.variant ?? "badge";
  }
  overlayLayout(action) {
    return action?.layout ?? "default";
  }
  overlayShape(action) {
    return action?.shape ?? "default";
  }
  overlayTone(action) {
    return action?.tone ?? "default";
  }
  overlayLeadingAccessory(action) {
    return action?.leadingAccessory ?? null;
  }
  overlayLabel(action) {
    if (!action) {
      return "";
    }
    if (action.selected && action.selectedLabel) {
      return action.selectedLabel;
    }
    return action.label ?? "";
  }
  overlayDetailLabel(action) {
    return action?.detailLabel ?? "";
  }
  overlayIcon(action) {
    if (!action) {
      return null;
    }
    if (action.selected && action.selectedIcon) {
      return action.selectedIcon;
    }
    return action.icon ?? null;
  }
  overlayImageUrl(action) {
    return AppUtils.mediaImageVariantUrl(action?.imageUrl, "small");
  }
  overlayDetailIcon(action) {
    return action?.detailIcon ?? null;
  }
  overlayProgressRing(action) {
    return action?.progressRing === true;
  }
  resolveOverlayMenuAction(action) {
    const actionId = `${action?.actionId ?? ""}`.trim();
    if (!actionId) {
      return null;
    }
    const config = CARD_MENU_ACTIONS[actionId];
    if (config) {
      return __spreadValues({
        id: actionId
      }, config);
    }
    return {
      id: actionId,
      label: action?.ariaLabel || this.overlayLabel(action) || actionId,
      icon: this.overlayIcon(action) ?? "touch_app",
      tone: action?.actionTone ?? void 0
    };
  }
  visibleMetaRows() {
    const rows = this.card?.metaRows ?? [];
    const limit = this.card?.metaRowsLimit;
    if (!Number.isFinite(limit) || limit <= 0) {
      return rows;
    }
    return rows.slice(0, Math.trunc(limit));
  }
  descriptionLines() {
    const value = Math.trunc(Number(this.card?.descriptionLines));
    return Number.isFinite(value) && value > 0 ? value : 2;
  }
  descriptionMaxHeight() {
    return `${this.descriptionLines() * 1.4}em`;
  }
  detailStyle() {
    return this.card?.detailStyle ?? "default";
  }
  hasMenuActions() {
    if ((this.useSharedMenu || this.useSharedMenuTrigger) && this.card?.hasMenuOptions === true) {
      return true;
    }
    return (this.card?.menuActions?.length ?? 0) > 0;
  }
  resolvedMenuTitle() {
    if (this.card?.menuTitle === null) {
      return "";
    }
    return `${this.card?.menuTitle ?? this.card?.title ?? ""}`.trim();
  }
  sharedMenuTitle() {
    return this.resolvedMenuTitle() || null;
  }
  sharedMenuId() {
    return `info-card-actions-${this.card?.id ?? "unknown"}`;
  }
  sharedMenuTrigger() {
    const menuBadgeCount = Math.max(0, Math.trunc(Number(this.card?.menuBadgeCount) || 0));
    return {
      icon: "more_vert",
      closeIcon: "close",
      hideLabel: true,
      layout: "icon",
      palette: "default",
      counter: menuBadgeCount > 0 ? { value: menuBadgeCount, max: 99 } : null,
      ariaLabel: "Open menu"
    };
  }
  sharedMenuItems() {
    const card = this.card;
    if (!card?.menuActions?.length) {
      return [];
    }
    return card.menuActions.flatMap((actionId) => {
      const config = CARD_MENU_ACTIONS[actionId];
      if (!config) {
        return [];
      }
      const action = __spreadValues({
        id: actionId
      }, config);
      return [{
        id: actionId,
        label: config.label,
        icon: config.icon,
        palette: this.sharedMenuActionPalette(config.tone),
        surface: "tinted",
        context: __spreadProps(__spreadValues({}, this.sharedMenuContext ?? {}), {
          card,
          action
        })
      }];
    });
  }
  hasFooterChips() {
    return (this.card?.footerChips?.length ?? 0) > 0;
  }
  isFooterChipInteractive(chip) {
    const actionId = chip.actionId;
    return !!actionId && !!CARD_MENU_ACTIONS[actionId];
  }
  hasFooterActions() {
    return (this.card?.footerChips ?? []).some((chip) => this.isFooterChipInteractive(chip));
  }
  footerChipClassList(chip) {
    const classes = ["values-selected-chip"];
    const toneClass = `${chip.toneClass ?? ""}`.trim();
    if (toneClass) {
      classes.push(toneClass);
    }
    const actionId = chip.actionId;
    const actionTone = actionId ? CARD_MENU_ACTIONS[actionId]?.tone ?? "default" : "";
    if (this.isFooterChipInteractive(chip)) {
      classes.push("ui-info-card__footer-chip--button");
      classes.push(`ui-info-card__footer-chip--action-${actionTone}`);
    }
    return classes;
  }
  footerChipIcon(chip) {
    const icon = `${chip.icon ?? ""}`.trim();
    if (icon) {
      return icon;
    }
    const actionId = chip.actionId;
    return actionId ? `${CARD_MENU_ACTIONS[actionId]?.icon ?? ""}`.trim() : "";
  }
  onFooterChipActivated(chip, event) {
    if (!this.card || !chip.actionId) {
      return;
    }
    const actionConfig = CARD_MENU_ACTIONS[chip.actionId];
    if (!actionConfig) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    this.menuAction.emit({
      id: this.card.id,
      actionId: chip.actionId,
      action: __spreadProps(__spreadValues({
        id: chip.actionId
      }, actionConfig), {
        label: chip.label || actionConfig.label,
        icon: chip.icon || actionConfig.icon
      }),
      card: this.card
    });
  }
  trackByActionId(index, action) {
    return action || index;
  }
  trackByFooterChip(index, chip) {
    return `${chip.label}:${chip.toneClass ?? ""}:${chip.actionId ?? ""}:${this.footerChipIcon(chip)}:${index}`;
  }
  sharedMenuActionPalette(tone) {
    switch (tone) {
      case "positive":
        return "teal";
      case "accent":
        return "brown";
      case "warning":
      case "review":
        return "orange";
      case "destructive":
        return "danger";
      default:
        return "default";
    }
  }
  rootClassList() {
    const classes = ["ui-info-card"];
    if ((this.card?.id ?? "").startsWith("asset:")) {
      classes.push("ui-info-card--owned-asset");
    }
    if (this.card?.surfaceTone && this.card.surfaceTone !== "default") {
      classes.push(`ui-info-card--tone-${this.card.surfaceTone}`);
    }
    if (this.card?.state && this.card.state !== "default") {
      classes.push(`ui-info-card--state-${this.card.state}`);
    }
    if (this.card?.clickable) {
      classes.push("ui-info-card--clickable");
    }
    if (this.menuOpen) {
      classes.push("ui-info-card--menu-open");
    }
    return classes;
  }
  cardAccentHue() {
    const hue = Math.trunc(Number(this.card?.accentHue));
    return Number.isFinite(hue) ? `${AppUtils.clampNumber(hue, 0, 360)}` : null;
  }
  syncMobileViewFromViewport() {
    if (typeof window === "undefined") {
      this.isMobileView = false;
      return;
    }
    const next = window.innerWidth <= _InfoCardComponent.MOBILE_BREAKPOINT_PX;
    if (next === this.isMobileView) {
      return;
    }
    this.isMobileView = next;
    this.cdr.markForCheck();
  }
  shouldOpenMenuUp(trigger) {
    if (this.isMobileView || typeof window === "undefined" || !trigger) {
      return false;
    }
    const rect = trigger.getBoundingClientRect();
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    const estimatedMenuHeight = 248;
    const spaceBelow = viewportHeight - rect.bottom;
    const spaceAbove = rect.top;
    return spaceBelow < estimatedMenuHeight && spaceAbove > spaceBelow;
  }
  resolveMenuTriggerRect(trigger) {
    if (typeof window === "undefined" || !trigger) {
      return null;
    }
    const rect = trigger.getBoundingClientRect();
    return {
      left: rect.left,
      top: rect.top,
      right: rect.right,
      bottom: rect.bottom,
      width: rect.width,
      height: rect.height
    };
  }
  static setDocumentMenuInstance(instance) {
    _InfoCardComponent.activeDocumentMenuInstance = instance;
    _InfoCardComponent.ensureDocumentPointerDownListener(instance.hostRef.nativeElement.ownerDocument);
  }
  static clearDocumentMenuInstance(instance) {
    if (_InfoCardComponent.activeDocumentMenuInstance !== instance) {
      return;
    }
    _InfoCardComponent.activeDocumentMenuInstance = null;
    _InfoCardComponent.releaseDocumentPointerDownListener();
  }
  static ensureDocumentPointerDownListener(documentRef) {
    if (_InfoCardComponent.documentPointerDownListener && _InfoCardComponent.documentPointerDownTarget === documentRef) {
      return;
    }
    _InfoCardComponent.releaseDocumentPointerDownListener();
    const listener = (event) => _InfoCardComponent.onDocumentPointerDown(event);
    documentRef.addEventListener("pointerdown", listener);
    _InfoCardComponent.documentPointerDownListener = listener;
    _InfoCardComponent.documentPointerDownTarget = documentRef;
  }
  static releaseDocumentPointerDownListener() {
    if (!_InfoCardComponent.documentPointerDownListener || !_InfoCardComponent.documentPointerDownTarget) {
      return;
    }
    _InfoCardComponent.documentPointerDownTarget.removeEventListener("pointerdown", _InfoCardComponent.documentPointerDownListener);
    _InfoCardComponent.documentPointerDownListener = null;
    _InfoCardComponent.documentPointerDownTarget = null;
  }
  static onDocumentPointerDown(event) {
    const instance = _InfoCardComponent.activeDocumentMenuInstance;
    if (!instance?.menuOpen) {
      return;
    }
    const target = event.target;
    if (target instanceof Node && instance.hostRef.nativeElement.contains(target)) {
      return;
    }
    instance.closeMenu();
  }
  static \u0275fac = function InfoCardComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _InfoCardComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _InfoCardComponent, selectors: [["app-info-card"]], hostBindings: function InfoCardComponent_HostBindings(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275listener("resize", function InfoCardComponent_resize_HostBindingHandler() {
        return ctx.onViewportResize();
      }, \u0275\u0275resolveWindow)("keydown.escape", function InfoCardComponent_keydown_escape_HostBindingHandler($event) {
        return ctx.onEscapePressed($event);
      }, \u0275\u0275resolveWindow);
    }
  }, inputs: { card: "card", useSharedMenu: "useSharedMenu", useSharedMenuTrigger: "useSharedMenuTrigger", sharedMenuContext: "sharedMenuContext" }, outputs: { cardClick: "cardClick", mediaStartClick: "mediaStartClick", mediaEndClick: "mediaEndClick", menuAction: "menuAction", menuRequest: "menuRequest" }, decls: 22, vars: 29, consts: [["overlayContent", ""], [1, "experience-item-card", "asset-item-card", 3, "click", "ngClass"], [1, "ui-info-card__media", 3, "appLazyBgImage"], [1, "ui-info-card__media-title-content"], ["aria-hidden", "true", 1, "ui-info-card__image-loader"], [1, "ui-info-card__placeholder-icon"], [1, "ui-info-card__overlay-action", "ui-info-card__overlay-action--bottom-end", "asset-occupancy-badge", "asset-occupancy-badge-static", 3, "ui-info-card__overlay-action--avatar", "ui-info-card__overlay-action--badge", "ui-info-card__overlay-action--toggle", "ui-info-card__overlay-action--shape-circle", "ui-info-card__overlay-action--layout-avatar-metric", "ui-info-card__overlay-action--layout-badge-with-leading-accessory", "ui-info-card__overlay-action--tone-stage-scheduled", "ui-info-card__overlay-action--tone-stage-review", "ui-info-card__overlay-action--tone-neutral"], [1, "ui-info-card__head"], [1, "ui-info-card__leading", 3, "ui-info-card__leading--public", "ui-info-card__leading--stage", "ui-info-card__leading--friends", "ui-info-card__leading--invitation", "ui-info-card__leading--pending"], [1, "ui-info-card__meta"], [1, "ui-info-card__title"], [1, "ui-info-card__meta-row"], [1, "ui-info-card__actions"], [1, "ui-info-card__description", 3, "--ui-info-card-description-lines", "--ui-info-card-description-max-height"], [1, "ui-info-card__detail-row", 3, "ui-info-card__detail-row--mono"], [1, "ui-info-card__footer-chips", 3, "ui-info-card__footer-chips--actions"], ["kind", "spinner-ring", "size", "sm"], ["type", "button", 1, "ui-info-card__overlay-action", "ui-info-card__overlay-action--start", 3, "ui-info-card__overlay-action--avatar", "ui-info-card__overlay-action--badge", "ui-info-card__overlay-action--toggle", "ui-info-card__overlay-action--shape-circle", "ui-info-card__overlay-action--layout-avatar-metric", "ui-info-card__overlay-action--layout-badge-with-leading-accessory", "ui-info-card__overlay-action--tone-default", "ui-info-card__overlay-action--tone-stage", "ui-info-card__overlay-action--tone-cool", "ui-info-card__overlay-action--tone-cool-mid", "ui-info-card__overlay-action--tone-neutral", "ui-info-card__overlay-action--tone-warm-mid", "ui-info-card__overlay-action--tone-warm", "ui-info-card__overlay-action--tone-public", "ui-info-card__overlay-action--tone-friends", "ui-info-card__overlay-action--tone-invitation", "ui-info-card__overlay-action--tone-full", "ui-info-card__overlay-action--tone-inactive", "ui-info-card__overlay-action--tone-selected", "ui-info-card__overlay-action--tone-review", "ui-info-card__overlay-action--tone-blocked", "ui-info-card__overlay-action--tone-deleted", "ui-info-card__overlay-action--tone-woman", "ui-info-card__overlay-action--tone-man", "ui-info-card__overlay-action--tone-1", "ui-info-card__overlay-action--tone-2", "ui-info-card__overlay-action--tone-3", "ui-info-card__overlay-action--tone-4", "ui-info-card__overlay-action--tone-5", "ui-info-card__overlay-action--tone-6", "ui-info-card__overlay-action--tone-7", "ui-info-card__overlay-action--tone-8", "disabled"], [1, "ui-info-card__overlay-action", "ui-info-card__overlay-action--start", 3, "ui-info-card__overlay-action--avatar", "ui-info-card__overlay-action--badge", "ui-info-card__overlay-action--toggle", "ui-info-card__overlay-action--shape-circle", "ui-info-card__overlay-action--tone-default", "ui-info-card__overlay-action--tone-stage", "ui-info-card__overlay-action--layout-avatar-metric", "ui-info-card__overlay-action--layout-badge-with-leading-accessory", "ui-info-card__overlay-action--tone-cool", "ui-info-card__overlay-action--tone-cool-mid", "ui-info-card__overlay-action--tone-neutral", "ui-info-card__overlay-action--tone-warm-mid", "ui-info-card__overlay-action--tone-warm", "ui-info-card__overlay-action--tone-public", "ui-info-card__overlay-action--tone-friends", "ui-info-card__overlay-action--tone-invitation", "ui-info-card__overlay-action--tone-full", "ui-info-card__overlay-action--tone-inactive", "ui-info-card__overlay-action--tone-selected", "ui-info-card__overlay-action--tone-review", "ui-info-card__overlay-action--tone-blocked", "ui-info-card__overlay-action--tone-deleted", "ui-info-card__overlay-action--tone-woman", "ui-info-card__overlay-action--tone-man", "ui-info-card__overlay-action--tone-1", "ui-info-card__overlay-action--tone-2", "ui-info-card__overlay-action--tone-3", "ui-info-card__overlay-action--tone-4", "ui-info-card__overlay-action--tone-5", "ui-info-card__overlay-action--tone-6", "ui-info-card__overlay-action--tone-7", "ui-info-card__overlay-action--tone-8"], ["type", "button", 1, "ui-info-card__overlay-action", "ui-info-card__overlay-action--start", 3, "click", "disabled"], [4, "ngTemplateOutlet", "ngTemplateOutletContext"], [1, "ui-info-card__overlay-action", "ui-info-card__overlay-action--start"], ["type", "button", 1, "ui-info-card__overlay-action", "ui-info-card__overlay-action--end", "asset-occupancy-badge", 3, "ui-info-card__overlay-action--avatar", "ui-info-card__overlay-action--badge", "ui-info-card__overlay-action--toggle", "ui-info-card__overlay-action--shape-circle", "ui-info-card__overlay-action--layout-avatar-metric", "ui-info-card__overlay-action--layout-badge-with-leading-accessory", "asset-occupancy-badge-full", "ui-info-card__overlay-action--tone-default", "ui-info-card__overlay-action--tone-stage", "ui-info-card__overlay-action--tone-stage-active", "ui-info-card__overlay-action--tone-stage-scheduled", "ui-info-card__overlay-action--tone-stage-blocked", "ui-info-card__overlay-action--tone-stage-start", "ui-info-card__overlay-action--tone-stage-review", "ui-info-card__overlay-action--tone-stage-finalized", "ui-info-card__overlay-action--tone-stage-suspended", "ui-info-card__overlay-action--tone-cool", "ui-info-card__overlay-action--tone-cool-mid", "ui-info-card__overlay-action--tone-neutral", "ui-info-card__overlay-action--tone-warm-mid", "ui-info-card__overlay-action--tone-warm", "ui-info-card__overlay-action--tone-public", "ui-info-card__overlay-action--tone-friends", "ui-info-card__overlay-action--tone-invitation", "ui-info-card__overlay-action--tone-full", "ui-info-card__overlay-action--tone-inactive", "ui-info-card__overlay-action--tone-selected", "ui-info-card__overlay-action--tone-review", "ui-info-card__overlay-action--tone-blocked", "ui-info-card__overlay-action--tone-deleted", "ui-info-card__overlay-action--tone-woman", "ui-info-card__overlay-action--tone-man", "ui-info-card__overlay-action--tone-1", "ui-info-card__overlay-action--tone-2", "ui-info-card__overlay-action--tone-3", "ui-info-card__overlay-action--tone-4", "ui-info-card__overlay-action--tone-5", "ui-info-card__overlay-action--tone-6", "ui-info-card__overlay-action--tone-7", "ui-info-card__overlay-action--tone-8", "ui-info-card__overlay-action--ring-active", "disabled"], [1, "ui-info-card__overlay-action", "ui-info-card__overlay-action--end", "asset-occupancy-badge", "asset-occupancy-badge-static", 3, "ui-info-card__overlay-action--avatar", "ui-info-card__overlay-action--badge", "ui-info-card__overlay-action--toggle", "ui-info-card__overlay-action--shape-circle", "ui-info-card__overlay-action--layout-avatar-metric", "ui-info-card__overlay-action--layout-badge-with-leading-accessory", "asset-occupancy-badge-full", "ui-info-card__overlay-action--tone-default", "ui-info-card__overlay-action--tone-stage", "ui-info-card__overlay-action--tone-stage-active", "ui-info-card__overlay-action--tone-stage-scheduled", "ui-info-card__overlay-action--tone-stage-blocked", "ui-info-card__overlay-action--tone-stage-start", "ui-info-card__overlay-action--tone-stage-review", "ui-info-card__overlay-action--tone-stage-finalized", "ui-info-card__overlay-action--tone-stage-suspended", "ui-info-card__overlay-action--tone-cool", "ui-info-card__overlay-action--tone-cool-mid", "ui-info-card__overlay-action--tone-neutral", "ui-info-card__overlay-action--tone-warm-mid", "ui-info-card__overlay-action--tone-warm", "ui-info-card__overlay-action--tone-public", "ui-info-card__overlay-action--tone-friends", "ui-info-card__overlay-action--tone-invitation", "ui-info-card__overlay-action--tone-full", "ui-info-card__overlay-action--tone-inactive", "ui-info-card__overlay-action--tone-selected", "ui-info-card__overlay-action--tone-review", "ui-info-card__overlay-action--tone-blocked", "ui-info-card__overlay-action--tone-deleted", "ui-info-card__overlay-action--tone-woman", "ui-info-card__overlay-action--tone-man", "ui-info-card__overlay-action--tone-1", "ui-info-card__overlay-action--tone-2", "ui-info-card__overlay-action--tone-3", "ui-info-card__overlay-action--tone-4", "ui-info-card__overlay-action--tone-5", "ui-info-card__overlay-action--tone-6", "ui-info-card__overlay-action--tone-7", "ui-info-card__overlay-action--tone-8"], ["type", "button", 1, "ui-info-card__overlay-action", "ui-info-card__overlay-action--end", "asset-occupancy-badge", 3, "click", "disabled"], [1, "ui-info-card__pending-badge", "card-badge", "asset-request-badge"], ["aria-hidden", "true", 1, "ui-info-card__overlay-action-ring"], ["kind", "action-ring", "shape", "button", "state", "loading", 3, "durationMs"], [1, "ui-info-card__overlay-action", "ui-info-card__overlay-action--end", "asset-occupancy-badge", "asset-occupancy-badge-static"], [1, "ui-info-card__overlay-action", "ui-info-card__overlay-action--bottom-end", "asset-occupancy-badge", "asset-occupancy-badge-static"], [1, "ui-info-card__leading"], ["kind", "select", 3, "menuId", "title", "trigger", "items", "context"], [1, "ui-info-card__menu", "item-action-menu", 3, "is-open", "ui-info-card__menu--mobile", "ui-info-card__menu--desktop", "item-action-menu-mobile", "item-action-menu-desktop", "ui-info-card__menu--open-up", "is-open-up"], ["type", "button", "aria-haspopup", "menu", 1, "ui-info-card__menu-trigger", "experience-action-btn", "experience-action-menu-trigger", "motion-static", 3, "pointerdown", "click"], [1, "ui-info-card__menu-counter", "ui-info-card__pending-badge", "card-badge", "asset-request-badge"], [1, "ui-info-card__menu", "item-action-menu", 3, "click"], [1, "ui-info-card__menu-title", "item-action-menu-title"], ["type", "button", 1, "ui-info-card__menu-action", "item-action-menu-btn", 3, "ngClass", "item-action-menu-btn-publish", "item-action-menu-btn-review", "item-action-menu-btn-warning", "item-action-menu-btn-destructive"], ["type", "button", 1, "ui-info-card__menu-action", "item-action-menu-btn", 3, "click", "ngClass"], [1, "ui-info-card__description"], [1, "ui-info-card__detail-row"], [1, "ui-info-card__footer-chips"], ["type", "button", 1, "ui-info-card__footer-chip", 3, "ngClass"], [1, "ui-info-card__footer-chip", 3, "ngClass"], ["type", "button", 1, "ui-info-card__footer-chip", 3, "click", "ngClass"], [1, "ui-info-card__overlay-badge-body"], [1, "ui-info-card__overlay-leading-accessory", "ui-info-card__overlay-leading-accessory--avatar-metric", 3, "ui-info-card__overlay-leading-accessory--tone-default", "ui-info-card__overlay-leading-accessory--tone-woman", "ui-info-card__overlay-leading-accessory--tone-man", "ui-info-card__overlay-leading-accessory--tone-1", "ui-info-card__overlay-leading-accessory--tone-2", "ui-info-card__overlay-leading-accessory--tone-3", "ui-info-card__overlay-leading-accessory--tone-4", "ui-info-card__overlay-leading-accessory--tone-5", "ui-info-card__overlay-leading-accessory--tone-6", "ui-info-card__overlay-leading-accessory--tone-7", "ui-info-card__overlay-leading-accessory--tone-8"], [1, "ui-info-card__overlay-detail"], [1, "ui-info-card__overlay-leading-accessory", "ui-info-card__overlay-leading-accessory--avatar-metric"], [1, "ui-info-card__overlay-leading-accessory", "ui-info-card__overlay-leading-accessory--badge", 3, "ui-info-card__overlay-leading-accessory--tone-default", "ui-info-card__overlay-leading-accessory--tone-positive", "ui-info-card__overlay-leading-accessory--tone-negative", "ui-info-card__overlay-leading-accessory--tone-woman", "ui-info-card__overlay-leading-accessory--tone-man", "ui-info-card__overlay-leading-accessory--tone-1", "ui-info-card__overlay-leading-accessory--tone-2", "ui-info-card__overlay-leading-accessory--tone-3", "ui-info-card__overlay-leading-accessory--tone-4", "ui-info-card__overlay-leading-accessory--tone-5", "ui-info-card__overlay-leading-accessory--tone-6", "ui-info-card__overlay-leading-accessory--tone-7", "ui-info-card__overlay-leading-accessory--tone-8"], [1, "ui-info-card__overlay-leading-accessory", "ui-info-card__overlay-leading-accessory--badge"], ["alt", "", 1, "ui-info-card__overlay-avatar-image", 3, "src"]], template: function InfoCardComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "article", 1);
      \u0275\u0275listener("click", function InfoCardComponent_Template_article_click_0_listener($event) {
        return ctx.onCardActivated($event);
      });
      \u0275\u0275elementStart(1, "div", 2);
      \u0275\u0275conditionalCreate(2, InfoCardComponent_Conditional_2_Template, 5, 3, "span", 3);
      \u0275\u0275conditionalCreate(3, InfoCardComponent_Conditional_3_Template, 2, 0, "span", 4);
      \u0275\u0275conditionalCreate(4, InfoCardComponent_Conditional_4_Template, 2, 0, "mat-icon", 5);
      \u0275\u0275conditionalCreate(5, InfoCardComponent_Conditional_5_Template, 2, 1);
      \u0275\u0275conditionalCreate(6, InfoCardComponent_Conditional_6_Template, 2, 1);
      \u0275\u0275conditionalCreate(7, InfoCardComponent_Conditional_7_Template, 3, 26, "span", 6);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(8, "div", 7);
      \u0275\u0275conditionalCreate(9, InfoCardComponent_Conditional_9_Template, 3, 11, "span", 8);
      \u0275\u0275elementStart(10, "div", 9)(11, "h4", 10);
      \u0275\u0275text(12);
      \u0275\u0275elementEnd();
      \u0275\u0275repeaterCreate(13, InfoCardComponent_For_14_Template, 2, 2, "p", 11, \u0275\u0275repeaterTrackByIdentity);
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(15, InfoCardComponent_Conditional_15_Template, 4, 2, "div", 12);
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(16, InfoCardComponent_Conditional_16_Template, 2, 6, "p", 13);
      \u0275\u0275repeaterCreate(17, InfoCardComponent_For_18_Template, 2, 4, "p", 14, \u0275\u0275repeaterTrackByIdentity);
      \u0275\u0275conditionalCreate(19, InfoCardComponent_Conditional_19_Template, 3, 3, "div", 15);
      \u0275\u0275elementEnd();
      \u0275\u0275template(20, InfoCardComponent_ng_template_20_Template, 3, 1, "ng-template", null, 0, \u0275\u0275templateRefExtractor);
    }
    if (rf & 2) {
      let tmp_12_0;
      let tmp_13_0;
      let tmp_14_0;
      let tmp_17_0;
      \u0275\u0275styleProp("--ui-info-card-accent-hue", ctx.cardAccentHue());
      \u0275\u0275property("ngClass", ctx.rootClassList());
      \u0275\u0275attribute("data-group-label", ctx.card == null ? null : ctx.card.groupLabel)("data-info-card-id", ctx.card == null ? null : ctx.card.id);
      \u0275\u0275advance();
      \u0275\u0275classProp("ui-info-card__media--placeholder", !(ctx.card == null ? null : ctx.card.imageUrl) && !ctx.isTitleMedia())("ui-info-card__media--title", ctx.isTitleMedia())("ui-info-card__media--tone-neutral", ctx.mediaTone() === "neutral");
      \u0275\u0275property("appLazyBgImage", ctx.cardImageUrl());
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.isTitleMedia() ? 2 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional((ctx.card == null ? null : ctx.card.imageUrl) && !ctx.isTitleMedia() ? 3 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(!(ctx.card == null ? null : ctx.card.imageUrl) && !ctx.isTitleMedia() ? 4 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional((tmp_12_0 = ctx.card == null ? null : ctx.card.mediaStart) ? 5 : -1, tmp_12_0);
      \u0275\u0275advance();
      \u0275\u0275conditional((tmp_13_0 = ctx.card == null ? null : ctx.card.mediaEnd) ? 6 : -1, tmp_13_0);
      \u0275\u0275advance();
      \u0275\u0275conditional((tmp_14_0 = ctx.card == null ? null : ctx.card.mediaBottomEnd) ? 7 : -1, tmp_14_0);
      \u0275\u0275advance();
      \u0275\u0275classProp("ui-info-card__head--with-actions", ctx.hasMenuActions())("ui-info-card__head--without-leading", !(ctx.card == null ? null : ctx.card.leadingIcon));
      \u0275\u0275advance();
      \u0275\u0275conditional((tmp_17_0 = ctx.card == null ? null : ctx.card.leadingIcon) ? 9 : -1, tmp_17_0);
      \u0275\u0275advance(2);
      \u0275\u0275attribute("data-i18n-ignore", (ctx.card == null ? null : ctx.card.i18nIgnoreContent) ? "" : null);
      \u0275\u0275advance();
      \u0275\u0275textInterpolate(ctx.card == null ? null : ctx.card.title);
      \u0275\u0275advance();
      \u0275\u0275repeater(ctx.visibleMetaRows());
      \u0275\u0275advance(2);
      \u0275\u0275conditional(ctx.hasMenuActions() ? 15 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional((ctx.card == null ? null : ctx.card.description) ? 16 : -1);
      \u0275\u0275advance();
      \u0275\u0275repeater((ctx.card == null ? null : ctx.card.detailRows) ?? \u0275\u0275pureFunction0(28, _c0));
      \u0275\u0275advance(2);
      \u0275\u0275conditional(ctx.hasFooterChips() ? 19 : -1);
    }
  }, dependencies: [
    CommonModule,
    NgClass,
    NgTemplateOutlet,
    MatIconModule,
    MatIcon,
    LazyBgImageDirective,
    IndicatorComponent,
    AppMenuTriggerComponent,
    CounterBadgePipe,
    I18nPipe
  ], styles: ['\n[_nghost-%COMP%] {\n  display: flex;\n  flex: 1 1 auto;\n  width: 100%;\n  max-width: 100%;\n  min-width: 0;\n  box-sizing: border-box;\n}\n@media (min-width: 761px) {\n  [_nghost-%COMP%] {\n    align-self: stretch;\n    height: 100%;\n  }\n  .ui-info-card[_ngcontent-%COMP%] {\n    min-height: 100%;\n  }\n}\n.form-flow__step-info-card[_nghost-%COMP%]   .ui-info-card[_ngcontent-%COMP%] {\n  height: 100%;\n  min-height: 100%;\n  touch-action: pan-x pan-y;\n}\n.ui-info-card[_ngcontent-%COMP%] {\n  --ui-info-card-accent-hue: 210;\n  position: relative;\n  display: grid;\n  grid-auto-rows: max-content;\n  align-content: start;\n  flex: 1 1 auto;\n  gap: 0.32rem;\n  width: 100%;\n  max-width: 100%;\n  box-sizing: border-box;\n  overflow: visible;\n  cursor: default;\n  border: 1px solid var(--deployment-card-border, rgba(58, 81, 114, 0.24));\n  border-radius: 12px;\n  padding: 0.58rem 0.62rem;\n  background: var(--deployment-card-background, linear-gradient(180deg, #ffffff 0%, #f7faff 100%));\n  box-shadow: 0 10px 24px color-mix(in srgb, var(--deployment-brand-shadow, rgba(18, 35, 58, 0.2)) 35%, transparent);\n  transition:\n    box-shadow 0.16s ease,\n    filter 0.16s ease,\n    opacity 0.18s ease;\n  isolation: isolate;\n  touch-action: pan-y;\n}\n.ui-info-card--menu-open[_ngcontent-%COMP%] {\n  z-index: 24;\n}\n.ui-info-card--clickable[_ngcontent-%COMP%] {\n  cursor: pointer;\n  -webkit-tap-highlight-color: transparent;\n}\n.ui-info-card--clickable[_ngcontent-%COMP%]:hover {\n  box-shadow: 0 12px 28px color-mix(in srgb, var(--deployment-brand-shadow, rgba(18, 35, 58, 0.2)) 56%, transparent);\n}\n.ui-info-card--clickable[_ngcontent-%COMP%]:active {\n  box-shadow: 0 11px 24px color-mix(in srgb, var(--deployment-brand-shadow, rgba(18, 35, 58, 0.2)) 48%, transparent);\n}\n.ui-info-card--clickable[_ngcontent-%COMP%]::after, \n.asset-occupancy-badge[_ngcontent-%COMP%]::after, \n.experience-action-btn[_ngcontent-%COMP%]::after, \n.ui-info-card__menu-action[_ngcontent-%COMP%]::after {\n  content: "";\n  position: absolute;\n  inset: 0;\n  border-radius: inherit;\n  pointer-events: none;\n  background:\n    radial-gradient(\n      circle at center,\n      rgba(255, 255, 255, 0.34) 0%,\n      rgba(255, 255, 255, 0.18) 24%,\n      rgba(255, 255, 255, 0) 62%);\n  opacity: 0;\n  transform: scale(0.24);\n}\n@keyframes _ngcontent-%COMP%_ui-info-card-press-wave {\n  0% {\n    opacity: 0.34;\n    transform: scale(0.24);\n  }\n  100% {\n    opacity: 0;\n    transform: scale(1.08);\n  }\n}\n.ui-info-card--clickable[_ngcontent-%COMP%]:active::after, \nbutton.asset-occupancy-badge[_ngcontent-%COMP%]:active::after, \n.experience-action-btn[_ngcontent-%COMP%]:active::after, \n.ui-info-card__menu-action[_ngcontent-%COMP%]:active::after {\n  animation: _ngcontent-%COMP%_ui-info-card-press-wave 0.42s ease-out;\n}\n.ui-info-card--tone-full[_ngcontent-%COMP%] {\n  border-color: rgba(201, 83, 83, 0.42);\n  background:\n    linear-gradient(\n      180deg,\n      #fff8f8 0%,\n      #fff1f1 100%);\n}\n.ui-info-card--tone-draft[_ngcontent-%COMP%] {\n  border-color: rgba(96, 108, 136, 0.34);\n  background:\n    linear-gradient(\n      180deg,\n      #fafbff 0%,\n      #f0f3fb 100%);\n  box-shadow: 0 8px 18px rgba(74, 88, 118, 0.08);\n}\n.ui-info-card--tone-stage[_ngcontent-%COMP%] {\n  border-color: hsl(var(--ui-info-card-accent-hue), 54%, 58%, 0.52);\n  background:\n    radial-gradient(\n      circle at 10% 4%,\n      hsl(var(--ui-info-card-accent-hue), 90%, 98%, 0.86),\n      transparent 36%),\n    linear-gradient(\n      180deg,\n      hsl(var(--ui-info-card-accent-hue), 82%, 97%) 0%,\n      hsl(var(--ui-info-card-accent-hue), 64%, 92%) 100%);\n  box-shadow: 0 8px 18px hsl(var(--ui-info-card-accent-hue), 42%, 36%, 0.12);\n}\n.ui-info-card--tone-subevent-light[_ngcontent-%COMP%] {\n  border-color: hsl(var(--ui-info-card-accent-hue), 44%, 66%, 0.38);\n  background:\n    radial-gradient(\n      circle at 10% 4%,\n      hsl(var(--ui-info-card-accent-hue), 92%, 99%, 0.9),\n      transparent 38%),\n    linear-gradient(\n      180deg,\n      hsl(var(--ui-info-card-accent-hue), 78%, 98%) 0%,\n      hsl(var(--ui-info-card-accent-hue), 54%, 94%) 100%);\n  box-shadow: 0 7px 16px hsl(var(--ui-info-card-accent-hue), 34%, 40%, 0.08);\n}\n.ui-info-card--tone-subevent-strong[_ngcontent-%COMP%] {\n  border-color: hsl(var(--ui-info-card-accent-hue), 56%, 54%, 0.52);\n  background:\n    radial-gradient(\n      circle at 10% 4%,\n      hsl(var(--ui-info-card-accent-hue), 88%, 97%, 0.82),\n      transparent 36%),\n    linear-gradient(\n      180deg,\n      hsl(var(--ui-info-card-accent-hue), 72%, 95%) 0%,\n      hsl(var(--ui-info-card-accent-hue), 54%, 87%) 100%);\n  box-shadow: 0 8px 18px hsl(var(--ui-info-card-accent-hue), 42%, 34%, 0.15);\n}\n.ui-info-card--tone-stage-runtime[_ngcontent-%COMP%] {\n  border-color: hsl(var(--ui-info-card-accent-hue), 48%, 58%, 0.5);\n  background:\n    linear-gradient(\n      180deg,\n      #fbfcff 0%,\n      #f3f6fb 100%);\n  box-shadow: 0 8px 18px hsl(var(--ui-info-card-accent-hue), 34%, 34%, 0.075);\n}\n.ui-info-card--tone-published[_ngcontent-%COMP%] {\n  border-color: rgba(50, 132, 90, 0.44);\n  background:\n    linear-gradient(\n      180deg,\n      #eef8f2 0%,\n      #d9ecdf 100%);\n  box-shadow: 0 8px 18px rgba(39, 111, 75, 0.15);\n}\n.ui-info-card--tone-pending[_ngcontent-%COMP%] {\n  border-color: rgba(202, 145, 52, 0.34);\n  background:\n    linear-gradient(\n      180deg,\n      #fffaf0 0%,\n      #fff2d9 100%);\n  box-shadow: 0 8px 18px rgba(171, 122, 40, 0.12);\n}\n.ui-info-card--tone-waitlist[_ngcontent-%COMP%] {\n  border-color: rgba(73, 119, 154, 0.36);\n  background:\n    linear-gradient(\n      180deg,\n      #f3fbff 0%,\n      #e7f2f7 100%);\n  box-shadow: 0 8px 18px rgba(50, 98, 135, 0.12);\n}\n.ui-info-card--tone-series[_ngcontent-%COMP%] {\n  border-color: rgba(42, 126, 134, 0.34);\n  background:\n    linear-gradient(\n      180deg,\n      #f2fbfb 0%,\n      #e4f4f5 100%);\n  box-shadow: 0 8px 18px rgba(31, 111, 118, 0.12);\n}\n.ui-info-card--tone-system[_ngcontent-%COMP%] {\n  border-color: rgba(94, 62, 205, 0.66);\n  background:\n    radial-gradient(\n      circle at 12% 2%,\n      rgba(64, 223, 255, 0.42),\n      transparent 40%),\n    radial-gradient(\n      circle at 94% 96%,\n      rgba(255, 83, 177, 0.3),\n      transparent 42%),\n    linear-gradient(\n      145deg,\n      #dddfff 0%,\n      #cddcff 45%,\n      #ecd6f4 100%);\n  box-shadow: 0 10px 24px rgba(62, 43, 153, 0.25), 0 0 0 1px rgba(85, 193, 255, 0.16) inset;\n}\n.ui-info-card--tone-review[_ngcontent-%COMP%] {\n  border-color: rgba(126, 82, 35, 0.5);\n  background:\n    linear-gradient(\n      180deg,\n      #f6ead8 0%,\n      #ecd5b5 100%);\n  box-shadow: 0 8px 18px rgba(105, 68, 29, 0.16);\n}\n.ui-info-card--tone-blocked[_ngcontent-%COMP%] {\n  border-color: rgba(180, 52, 64, 0.28);\n  background:\n    linear-gradient(\n      180deg,\n      #fff2f2 0%,\n      #f8dede 100%);\n  box-shadow: 0 8px 18px rgba(150, 48, 61, 0.12);\n}\n.ui-info-card--tone-deleted[_ngcontent-%COMP%] {\n  border-color: rgba(97, 105, 118, 0.34);\n  background:\n    linear-gradient(\n      180deg,\n      #f7f8fa 0%,\n      #e9edf2 100%);\n  box-shadow: 0 8px 18px rgba(60, 70, 88, 0.1);\n}\n.ui-info-card--tone-inactive[_ngcontent-%COMP%] {\n  border-color: rgba(102, 112, 128, 0.28);\n  background:\n    linear-gradient(\n      180deg,\n      #f2f3f5 0%,\n      #e8ebef 100%);\n  box-shadow: 0 8px 18px rgba(60, 70, 88, 0.1);\n}\n.ui-info-card--tone-deleted[_ngcontent-%COMP%], \n.ui-info-card--tone-inactive[_ngcontent-%COMP%], \n.ui-info-card--tone-review[_ngcontent-%COMP%], \n.ui-info-card--tone-blocked[_ngcontent-%COMP%] {\n  gap: 0.24rem;\n  padding: 0.48rem 0.54rem;\n}\n.ui-info-card--tone-deleted[_ngcontent-%COMP%]   .ui-info-card__media[_ngcontent-%COMP%], \n.ui-info-card--tone-inactive[_ngcontent-%COMP%]   .ui-info-card__media[_ngcontent-%COMP%], \n.ui-info-card--tone-review[_ngcontent-%COMP%]   .ui-info-card__media[_ngcontent-%COMP%], \n.ui-info-card--tone-blocked[_ngcontent-%COMP%]   .ui-info-card__media[_ngcontent-%COMP%] {\n  height: 112px;\n}\n.ui-info-card--state-leaving[_ngcontent-%COMP%] {\n  opacity: 0;\n  transform: translateY(10px) scale(0.97);\n  filter: saturate(0.76);\n  pointer-events: none;\n}\n.ui-info-card__media[_ngcontent-%COMP%] {\n  position: relative;\n  width: 100%;\n  height: 130px;\n  border-radius: 10px;\n  border: 1px solid rgba(36, 64, 98, 0.2);\n  background-size: cover;\n  background-position: center;\n  background-repeat: no-repeat;\n  background-color: #dfe8f7;\n  overflow: visible;\n  transition: opacity 100ms ease-in;\n}\n.ui-info-card__media--placeholder[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.ui-info-card__media--title[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: stretch;\n  justify-content: stretch;\n  height: 96px;\n  background:\n    radial-gradient(\n      circle at 12% 10%,\n      rgba(255, 255, 255, 0.72),\n      transparent 34%),\n    linear-gradient(\n      135deg,\n      rgba(235, 243, 255, 0.98) 0%,\n      rgba(246, 250, 255, 0.96) 48%,\n      rgba(237, 246, 242, 0.98) 100%);\n}\n.ui-info-card__media--title.ui-info-card__media--tone-neutral[_ngcontent-%COMP%] {\n  height: 116px;\n  background:\n    radial-gradient(\n      circle at 14% 16%,\n      rgba(255, 255, 255, 0.78),\n      transparent 32%),\n    linear-gradient(\n      135deg,\n      #f4f6fb 0%,\n      #e3e8f2 58%,\n      #eef2f8 100%);\n}\n.ui-info-card--tone-stage[_ngcontent-%COMP%]   .ui-info-card__media--title.ui-info-card__media--tone-neutral[_ngcontent-%COMP%], \n.ui-info-card--tone-stage-runtime[_ngcontent-%COMP%]   .ui-info-card__media--title.ui-info-card__media--tone-neutral[_ngcontent-%COMP%] {\n  border-color: hsl(var(--ui-info-card-accent-hue), 48%, 58%, 0.36);\n  background:\n    radial-gradient(\n      circle at 14% 16%,\n      rgba(255, 255, 255, 0.78),\n      transparent 32%),\n    linear-gradient(\n      135deg,\n      color-mix(in srgb, hsl(var(--ui-info-card-accent-hue), 76%, 54%) 14%, #ffffff 86%) 0%,\n      color-mix(in srgb, hsl(var(--ui-info-card-accent-hue), 76%, 54%) 10%, #f5f9ff 90%) 100%);\n}\n.ui-info-card--tone-subevent-light[_ngcontent-%COMP%]   .ui-info-card__media--title.ui-info-card__media--tone-neutral[_ngcontent-%COMP%], \n.ui-info-card--tone-subevent-strong[_ngcontent-%COMP%]   .ui-info-card__media--title.ui-info-card__media--tone-neutral[_ngcontent-%COMP%] {\n  border-color: hsl(var(--ui-info-card-accent-hue), 48%, 58%, 0.34);\n  background:\n    radial-gradient(\n      circle at 14% 16%,\n      rgba(255, 255, 255, 0.78),\n      transparent 32%),\n    linear-gradient(\n      135deg,\n      color-mix(in srgb, hsl(var(--ui-info-card-accent-hue), 76%, 54%) 16%, #ffffff 84%) 0%,\n      color-mix(in srgb, hsl(var(--ui-info-card-accent-hue), 76%, 54%) 12%, #f5f9ff 88%) 100%);\n}\n.ui-info-card--tone-subevent-strong[_ngcontent-%COMP%]   .ui-info-card__media--title.ui-info-card__media--tone-neutral[_ngcontent-%COMP%] {\n  border-color: hsl(var(--ui-info-card-accent-hue), 54%, 52%, 0.5);\n  background:\n    radial-gradient(\n      circle at 14% 16%,\n      rgba(255, 255, 255, 0.66),\n      transparent 32%),\n    linear-gradient(\n      135deg,\n      color-mix(in srgb, hsl(var(--ui-info-card-accent-hue), 76%, 50%) 24%, #ffffff 76%) 0%,\n      color-mix(in srgb, hsl(var(--ui-info-card-accent-hue), 72%, 48%) 20%, #f5f9ff 80%) 100%);\n}\n.ui-info-card__media-title-content[_ngcontent-%COMP%] {\n  position: relative;\n  z-index: 1;\n  min-width: 0;\n  width: 100%;\n  display: grid;\n  align-content: center;\n  justify-items: start;\n  gap: 0.12rem;\n  padding: 0.62rem 0.68rem;\n  color: #203a5e;\n}\n.ui-info-card__media-title-content[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 18px;\n  height: 18px;\n  font-size: 18px;\n  line-height: 18px;\n  color: #356ba5;\n}\n.ui-info-card__media-title-content[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%], \n.ui-info-card__media-title-content[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n  min-width: 0;\n  max-width: 100%;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.ui-info-card__media-title-content[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  font-size: 0.92rem;\n  font-weight: 900;\n  line-height: 1.12;\n}\n.ui-info-card__media-title-content[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n  font-size: 0.7rem;\n  font-weight: 800;\n  color: rgba(30, 57, 90, 0.68);\n}\n.ui-info-card__media--tone-neutral[_ngcontent-%COMP%]   .ui-info-card__media-title-content[_ngcontent-%COMP%] {\n  align-content: center;\n  justify-items: center;\n  text-align: center;\n  color: #263a58;\n}\n.ui-info-card__media--tone-neutral[_ngcontent-%COMP%]   .ui-info-card__media-title-content[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #5d6d86;\n}\n.ui-info-card__media--tone-neutral[_ngcontent-%COMP%]   .ui-info-card__media-title-content[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  font-size: 1.02rem;\n}\n.ui-info-card__image-loader[_ngcontent-%COMP%] {\n  position: absolute;\n  inset: 0;\n  z-index: 1;\n  display: grid;\n  place-items: center;\n  pointer-events: none;\n  opacity: 0;\n  transition: opacity 120ms ease;\n}\n.ui-info-card__image-loader[_ngcontent-%COMP%]   app-indicator[_ngcontent-%COMP%] {\n  position: relative;\n  z-index: 1;\n}\n.ui-info-card__media.lazy-bg-loading[_ngcontent-%COMP%]   .ui-info-card__image-loader[_ngcontent-%COMP%] {\n  opacity: 1;\n}\n.ui-info-card__media.lazy-bg-loaded[_ngcontent-%COMP%]   .ui-info-card__image-loader[_ngcontent-%COMP%], \n.ui-info-card__media.lazy-bg-error[_ngcontent-%COMP%]   .ui-info-card__image-loader[_ngcontent-%COMP%] {\n  opacity: 0;\n}\n.ui-info-card__placeholder-icon[_ngcontent-%COMP%] {\n  font-size: 48px;\n  width: 48px;\n  height: 48px;\n  color: rgba(36, 64, 98, 0.35);\n}\n.ui-info-card__head[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: auto minmax(0, 1fr);\n  gap: 0.46rem;\n  align-items: flex-start;\n}\n.ui-info-card__head--with-actions[_ngcontent-%COMP%] {\n  grid-template-columns: auto minmax(0, 1fr) auto;\n}\n.ui-info-card__head--without-leading[_ngcontent-%COMP%] {\n  grid-template-columns: minmax(0, 1fr);\n}\n.ui-info-card__head--without-leading.ui-info-card__head--with-actions[_ngcontent-%COMP%] {\n  grid-template-columns: minmax(0, 1fr) auto;\n}\n.ui-info-card__leading[_ngcontent-%COMP%] {\n  width: 28px;\n  height: 28px;\n  margin-top: 1px;\n  border-radius: 50%;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  background: rgba(255, 255, 255, 0.76);\n  border: 1px solid rgba(58, 81, 114, 0.18);\n}\n.ui-info-card__leading[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n  line-height: 16px;\n}\n.ui-info-card__leading--public[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #eef7ff 0%,\n      #e5f2ff 100%);\n  border-color: rgba(46, 111, 178, 0.34);\n}\n.ui-info-card__leading--stage[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      hsl(var(--ui-info-card-accent-hue), 92%, 94%) 0%,\n      hsl(var(--ui-info-card-accent-hue), 84%, 88%) 100%);\n  border-color: hsl(var(--ui-info-card-accent-hue), 54%, 58%, 0.42);\n  box-shadow: 0 5px 12px hsl(var(--ui-info-card-accent-hue), 42%, 34%, 0.16);\n}\n.ui-info-card__leading--friends[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f1f8ef 0%,\n      #e9f3e6 100%);\n  border-color: rgba(54, 129, 72, 0.34);\n}\n.ui-info-card__leading--invitation[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #fff5ea 0%,\n      #ffe9d9 100%);\n  border-color: rgba(185, 113, 45, 0.36);\n}\n.ui-info-card__leading--pending[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #fff8e6 0%,\n      #ffefc8 100%);\n  border-color: rgba(207, 148, 34, 0.34);\n}\n.ui-info-card__leading--public[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #2f6cae;\n}\n.ui-info-card__leading--stage[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: hsl(var(--ui-info-card-accent-hue), 66%, 42%);\n}\n.ui-info-card__leading--friends[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #368148;\n}\n.ui-info-card__leading--invitation[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #b9712d;\n}\n.ui-info-card__leading--pending[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #b77b19;\n}\n.ui-info-card__meta[_ngcontent-%COMP%] {\n  min-width: 0;\n  display: grid;\n  gap: 0.03rem;\n}\n.ui-info-card__title[_ngcontent-%COMP%], \n.ui-info-card__meta-row[_ngcontent-%COMP%], \n.ui-info-card__description[_ngcontent-%COMP%], \n.ui-info-card__detail-row[_ngcontent-%COMP%] {\n  margin: 0;\n}\n.ui-info-card__title[_ngcontent-%COMP%] {\n  color: #223d62;\n  font-size: 0.84rem;\n  font-weight: 800;\n}\n.ui-info-card__meta-row[_ngcontent-%COMP%] {\n  color: rgba(23, 41, 66, 0.72);\n  font-size: 0.74rem;\n  font-weight: 700;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.ui-info-card__description[_ngcontent-%COMP%] {\n  font-size: 0.76rem;\n  line-height: 1.4;\n  color: rgba(20, 37, 61, 0.84);\n  display: -webkit-box;\n  min-height: calc(var(--ui-info-card-description-lines, 2) * 1.4em);\n  max-height: var(--ui-info-card-description-max-height, 2.8em);\n  overflow: hidden;\n  -webkit-line-clamp: var(--ui-info-card-description-lines, 2);\n  line-clamp: var(--ui-info-card-description-lines, 2);\n  -webkit-box-orient: vertical;\n}\n.ui-info-card__detail-row[_ngcontent-%COMP%] {\n  font-size: 0.74rem;\n  font-weight: 700;\n  color: rgba(23, 41, 66, 0.68);\n}\n.ui-info-card__detail-row--mono[_ngcontent-%COMP%] {\n  margin-top: -0.12rem;\n  font-size: 0.73rem;\n  color: rgba(23, 39, 61, 0.7);\n  font-family:\n    "IBM Plex Mono",\n    "SFMono-Regular",\n    ui-monospace,\n    monospace;\n}\n.ui-info-card--tone-draft[_ngcontent-%COMP%]   .ui-info-card__title[_ngcontent-%COMP%], \n.ui-info-card--tone-draft[_ngcontent-%COMP%]   .ui-info-card__meta-row[_ngcontent-%COMP%] {\n  color: #52617d;\n}\n.ui-info-card--tone-published[_ngcontent-%COMP%]   .ui-info-card__title[_ngcontent-%COMP%] {\n  color: #245d42;\n}\n.ui-info-card--tone-published[_ngcontent-%COMP%]   .ui-info-card__meta-row[_ngcontent-%COMP%] {\n  color: rgba(32, 82, 59, 0.76);\n}\n.ui-info-card__overlay-action[_ngcontent-%COMP%] {\n  position: absolute;\n  z-index: 2;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  box-sizing: border-box;\n  gap: 0.24rem;\n  text-decoration: none;\n  border: 1px solid rgba(17, 33, 56, 0.2);\n  padding: 0;\n  background: rgba(244, 248, 255, 0.9);\n  color: #2d5ea8;\n  box-shadow: 0 6px 14px rgba(8, 18, 34, 0.24);\n  transition:\n    transform 0.14s ease,\n    box-shadow 0.14s ease,\n    filter 0.14s ease,\n    border-color 0.2s ease;\n}\nbutton.ui-info-card__overlay-action[_ngcontent-%COMP%] {\n  appearance: none;\n  -webkit-appearance: none;\n  cursor: pointer;\n}\n.ui-info-card__overlay-action--start[_ngcontent-%COMP%] {\n  top: 0.44rem;\n  left: 0.44rem;\n}\n.ui-info-card__overlay-action--end[_ngcontent-%COMP%] {\n  top: 0.44rem;\n  right: 0.2rem;\n}\n.ui-info-card__overlay-action--bottom-end[_ngcontent-%COMP%] {\n  right: 0.38rem;\n  bottom: 0.38rem;\n}\n.ui-info-card__overlay-action--avatar[_ngcontent-%COMP%] {\n  width: 26px;\n  min-width: 26px;\n  height: 26px;\n  border-radius: 50%;\n  font-size: 0.58rem;\n  font-weight: 800;\n  line-height: 1;\n  color: #ffffff;\n  text-transform: uppercase;\n  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.22);\n}\n.ui-info-card__overlay-action--avatar[_ngcontent-%COMP%]    > span[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  min-height: 100%;\n  transform: translateY(-0.02em);\n}\n.ui-info-card__overlay-avatar-image[_ngcontent-%COMP%] {\n  width: 100%;\n  height: 100%;\n  border-radius: inherit;\n  object-fit: cover;\n  display: block;\n}\n.ui-info-card--owned-asset[_ngcontent-%COMP%]   .ui-info-card__overlay-action--avatar.asset-occupancy-badge[_ngcontent-%COMP%] {\n  width: auto;\n  min-width: 34px;\n  height: 28px;\n  padding: 0 0.48rem;\n  border-radius: 999px;\n  font-size: 0.76rem;\n  letter-spacing: 0.01em;\n}\n.ui-info-card--owned-asset[_ngcontent-%COMP%]   .ui-info-card__overlay-action--end.ui-info-card__overlay-action--avatar.ui-info-card__overlay-action--tone-default.asset-occupancy-badge[_ngcontent-%COMP%] {\n  border: 2px solid rgba(255, 255, 255, 0.9);\n  background:\n    linear-gradient(\n      180deg,\n      #334f72 0%,\n      #264061 100%);\n  color: #fff;\n  box-shadow: 0 7px 16px rgba(9, 22, 40, 0.34), inset 0 0 0 1px rgba(18, 38, 64, 0.58);\n}\n.ui-info-card--owned-asset[_ngcontent-%COMP%]   .ui-info-card__overlay-action--start.ui-info-card__overlay-action--avatar.ui-info-card__overlay-action--tone-default[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #ffe8cc 0%,\n      #ffd7af 100%);\n  border-color: rgba(179, 108, 42, 0.54);\n  color: #8c4f18;\n}\n.ui-info-card__overlay-action--badge[_ngcontent-%COMP%] {\n  min-width: 0;\n  height: 25px;\n  border-radius: 999px;\n  padding: 0 0.32rem;\n  background: rgba(26, 45, 71, 0.82);\n  color: #fff;\n  font-size: 0.7rem;\n  letter-spacing: 0.01em;\n  font-weight: 800;\n  box-shadow: 0 5px 10px rgba(8, 18, 34, 0.24);\n  overflow: visible;\n}\n.ui-info-card__overlay-action--badge.ui-info-card__overlay-action--shape-circle[_ngcontent-%COMP%] {\n  width: 28px;\n  min-width: 28px;\n  height: 28px;\n  padding: 0;\n  border-radius: 50%;\n  aspect-ratio: 1;\n}\n.ui-info-card__overlay-action--ring-active[_ngcontent-%COMP%] {\n  overflow: visible;\n  box-shadow: 0 0 0 2px rgba(235, 147, 33, 0.18), 0 8px 18px rgba(132, 82, 8, 0.22);\n}\n.ui-info-card__overlay-action-ring[_ngcontent-%COMP%] {\n  position: absolute;\n  inset: -3px;\n  z-index: 20;\n  border-radius: 999px;\n  pointer-events: none;\n}\n.ui-info-card__overlay-action--badge[_ngcontent-%COMP%]    > span[_ngcontent-%COMP%]:not(.ui-info-card__pending-badge):not(.ui-info-card__overlay-action-ring), \n.ui-info-card__overlay-action--badge[_ngcontent-%COMP%]    > .mat-icon[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  position: relative;\n  z-index: 6;\n}\n.ui-info-card__overlay-action--toggle[_ngcontent-%COMP%] {\n  min-width: 32px;\n  width: 32px;\n  height: 32px;\n  border-radius: 999px;\n  background:\n    linear-gradient(\n      180deg,\n      #eef7ff 0%,\n      #dcecff 100%);\n  color: #2c5d9e;\n}\n.ui-info-card__overlay-action--layout-avatar-metric[_ngcontent-%COMP%] {\n  appearance: none;\n  width: auto;\n  min-width: 54px;\n  height: 30px;\n  padding: 0 0.36rem 0 0.08rem;\n  border-radius: 999px;\n  align-items: center;\n  justify-content: center;\n  gap: 0.16rem;\n  border-color: rgba(255, 255, 255, 0.92);\n  box-shadow: 0 7px 16px rgba(11, 25, 44, 0.3);\n}\n.ui-info-card__overlay-action--layout-avatar-metric.ui-info-card__overlay-action--start[_ngcontent-%COMP%] {\n  left: 0.34rem;\n  top: 0.34rem;\n}\n.ui-info-card__overlay-action--layout-badge-with-leading-accessory[_ngcontent-%COMP%] {\n  height: 28px;\n  padding: 0 0.58rem;\n  border: 2px solid rgba(255, 255, 255, 0.9);\n  border-radius: 999px;\n  background:\n    linear-gradient(\n      180deg,\n      #334f72 0%,\n      #264061 100%);\n  color: #fff;\n  font-weight: 800;\n  box-shadow: 0 7px 16px rgba(9, 22, 40, 0.34), inset 0 0 0 1px rgba(18, 38, 64, 0.58);\n}\n.ui-info-card__overlay-action--layout-badge-with-leading-accessory.ui-info-card__overlay-action--end[_ngcontent-%COMP%] {\n  top: 0.38rem;\n  right: 0.38rem;\n}\n.ui-info-card__overlay-action--layout-badge-with-leading-accessory.ui-info-card__overlay-action--tone-full[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #b84f4f 0%,\n      #963636 100%);\n  box-shadow: 0 7px 16px rgba(72, 24, 24, 0.36), inset 0 0 0 1px rgba(111, 38, 38, 0.6);\n}\n.ui-info-card__overlay-action--layout-badge-with-leading-accessory.ui-info-card__overlay-action--tone-inactive[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #dfe4ec 0%,\n      #cfd7e4 100%);\n  color: #4f5f78;\n  border-color: rgba(255, 255, 255, 0.92);\n  box-shadow: 0 6px 12px rgba(21, 38, 64, 0.16), inset 0 0 0 1px rgba(78, 99, 130, 0.2);\n}\n.ui-info-card__overlay-action--tone-cool.ui-info-card__overlay-action--layout-avatar-metric[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #dff1ff 0%,\n      #cce8ff 100%);\n  color: #27547a;\n}\n.ui-info-card__overlay-action--tone-cool-mid.ui-info-card__overlay-action--layout-avatar-metric[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #d7ebff 0%,\n      #c9e4ff 100%);\n  color: #2a557a;\n}\n.ui-info-card__overlay-action--tone-neutral.ui-info-card__overlay-action--layout-avatar-metric[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #ffe9d7 0%,\n      #ffdcbf 100%);\n  color: #87502f;\n}\n.ui-info-card__overlay-action--tone-warm-mid.ui-info-card__overlay-action--layout-avatar-metric[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #ffe2cf 0%,\n      #ffd2b5 100%);\n  color: #8f4b29;\n}\n.ui-info-card__overlay-action--tone-warm.ui-info-card__overlay-action--layout-avatar-metric[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #ffd8d8 0%,\n      #ffc2c2 100%);\n  color: #8f3a3a;\n}\n.ui-info-card__overlay-leading-accessory[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  line-height: 1;\n}\n.ui-info-card__overlay-leading-accessory--avatar-metric[_ngcontent-%COMP%] {\n  width: 24px;\n  min-width: 24px;\n  height: 24px;\n  border-radius: 50%;\n  font-size: 0.63rem;\n  font-weight: 800;\n  color: #fff;\n  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.32);\n  text-transform: uppercase;\n}\n.ui-info-card__overlay-leading-accessory--badge[_ngcontent-%COMP%] {\n  width: 16px;\n  height: 16px;\n  min-width: 16px;\n  position: absolute;\n  left: -0.4rem;\n  top: 50%;\n  transform: translateY(-50%);\n  border-radius: 50%;\n}\n.ui-info-card__overlay-leading-accessory--tone-default[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      145deg,\n      #3572a4,\n      #194364);\n  color: #fff;\n}\n.ui-info-card__overlay-leading-accessory--tone-positive[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #edf8ee 0%,\n      #e2f1e4 100%);\n  box-shadow: inset 0 0 0 1px rgba(44, 126, 72, 0.32);\n  color: #2d7d47;\n}\n.ui-info-card__overlay-leading-accessory--tone-negative[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #fff0f2 0%,\n      #fde5e9 100%);\n  box-shadow: inset 0 0 0 1px rgba(184, 76, 98, 0.36);\n  color: #b84c62;\n}\n.ui-info-card__overlay-leading-accessory--tone-woman[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      145deg,\n      #d3754c,\n      #ac4a24);\n  color: #fff;\n}\n.ui-info-card__overlay-leading-accessory--tone-man[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      145deg,\n      #3572a4,\n      #194364);\n  color: #fff;\n}\n.ui-info-card__overlay-leading-accessory--tone-1[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      145deg,\n      #3572a4,\n      #194364);\n  color: #fff;\n}\n.ui-info-card__overlay-leading-accessory--tone-2[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      145deg,\n      #c56841,\n      #8f381d);\n  color: #fff;\n}\n.ui-info-card__overlay-leading-accessory--tone-3[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      145deg,\n      #3c9d78,\n      #1f6450);\n  color: #fff;\n}\n.ui-info-card__overlay-leading-accessory--tone-4[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      145deg,\n      #7b63c7,\n      #4d3a8f);\n  color: #fff;\n}\n.ui-info-card__overlay-leading-accessory--tone-5[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      145deg,\n      #bf5f8f,\n      #883b65);\n  color: #fff;\n}\n.ui-info-card__overlay-leading-accessory--tone-6[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      145deg,\n      #4895ad,\n      #285c79);\n  color: #fff;\n}\n.ui-info-card__overlay-leading-accessory--tone-7[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      145deg,\n      #b47c3b,\n      #7e5325);\n  color: #fff;\n}\n.ui-info-card__overlay-leading-accessory--tone-8[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      145deg,\n      #5673bf,\n      #324a8a);\n  color: #fff;\n}\n.ui-info-card__overlay-detail[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.1rem;\n  font-size: 0.62rem;\n  font-weight: 800;\n  line-height: 1;\n  color: currentColor;\n}\n.ui-info-card__overlay-detail[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 11px;\n  height: 11px;\n  font-size: 11px;\n  line-height: 11px;\n  color: color-mix(in srgb, currentColor 88%, #111 12%);\n  transform: translateY(-0.5px);\n}\n.ui-info-card__overlay-badge-body[_ngcontent-%COMP%] {\n  position: relative;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  min-height: 16px;\n  padding-left: 0.9rem;\n}\n.ui-info-card__overlay-action--toggle[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%], \n.ui-info-card__overlay-action--badge[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%], \n.ui-info-card__overlay-action--avatar[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n}\n.ui-info-card__overlay-action--tone-default.ui-info-card__overlay-action--avatar[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      145deg,\n      #3572a4,\n      #194364);\n}\n.ui-info-card__overlay-action--tone-full.ui-info-card__overlay-action--badge[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #b84f4f 0%,\n      #963636 100%);\n  border-color: rgba(126, 41, 41, 0.56);\n  box-shadow: 0 5px 10px rgba(72, 24, 24, 0.34), inset 0 0 0 1px rgba(111, 38, 38, 0.6);\n}\n.ui-info-card__overlay-action--tone-stage.ui-info-card__overlay-action--badge[_ngcontent-%COMP%] {\n  border-color: rgba(255, 255, 255, 0.9);\n  background:\n    linear-gradient(\n      180deg,\n      hsl(var(--ui-info-card-accent-hue), 76%, 54%) 0%,\n      hsl(var(--ui-info-card-accent-hue), 72%, 42%) 100%);\n  color: #ffffff;\n  text-shadow: 0 1px 1px hsl(var(--ui-info-card-accent-hue), 70%, 22%, 0.3);\n  box-shadow: 0 7px 16px hsl(var(--ui-info-card-accent-hue), 52%, 34%, 0.34), inset 0 0 0 1px hsl(var(--ui-info-card-accent-hue), 70%, 34%, 0.54);\n}\n.ui-info-card__overlay-action--tone-stage-active.ui-info-card__overlay-action--badge[_ngcontent-%COMP%], \n.ui-info-card__overlay-action--tone-stage-scheduled.ui-info-card__overlay-action--badge[_ngcontent-%COMP%], \n.ui-info-card__overlay-action--tone-stage-blocked.ui-info-card__overlay-action--badge[_ngcontent-%COMP%], \n.ui-info-card__overlay-action--tone-stage-start.ui-info-card__overlay-action--badge[_ngcontent-%COMP%], \n.ui-info-card__overlay-action--tone-stage-review.ui-info-card__overlay-action--badge[_ngcontent-%COMP%], \n.ui-info-card__overlay-action--tone-stage-finalized.ui-info-card__overlay-action--badge[_ngcontent-%COMP%], \n.ui-info-card__overlay-action--tone-stage-suspended.ui-info-card__overlay-action--badge[_ngcontent-%COMP%] {\n  padding: 0.2rem 0.48rem;\n  font-size: 0.64rem;\n  font-weight: 900;\n  text-shadow: none;\n  box-shadow: 0 7px 16px rgba(54, 68, 90, 0.16);\n}\n.ui-info-card__overlay-action--tone-stage-active.ui-info-card__overlay-action--badge[_ngcontent-%COMP%] {\n  border-color: rgba(36, 150, 82, 0.34);\n  background:\n    linear-gradient(\n      180deg,\n      #e6f9ed 0%,\n      #cff0dc 100%);\n  color: #17663f;\n}\n.ui-info-card__overlay-action--tone-stage-scheduled.ui-info-card__overlay-action--badge[_ngcontent-%COMP%] {\n  border-color: rgba(53, 107, 178, 0.34);\n  background:\n    linear-gradient(\n      180deg,\n      #edf6ff 0%,\n      #d8eaff 100%);\n  color: #24548f;\n}\n.ui-info-card__overlay-action--tone-stage-blocked.ui-info-card__overlay-action--badge[_ngcontent-%COMP%] {\n  border-color: rgba(191, 57, 67, 0.38);\n  background:\n    linear-gradient(\n      180deg,\n      #fff0f1 0%,\n      #ffdfe3 100%);\n  color: #9d303b;\n}\n.ui-info-card__overlay-action--tone-stage-start.ui-info-card__overlay-action--badge[_ngcontent-%COMP%] {\n  border-color: rgba(53, 107, 178, 0.34);\n  background: rgba(232, 242, 255, 0.94);\n  color: #244f8e;\n}\n.ui-info-card__overlay-action--tone-stage-review.ui-info-card__overlay-action--badge[_ngcontent-%COMP%] {\n  border-color: rgba(192, 125, 28, 0.34);\n  background: rgba(255, 247, 226, 0.94);\n  color: #8a5a12;\n}\n.ui-info-card__overlay-action--bottom-end.ui-info-card__overlay-action--badge[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.18rem;\n  height: 26px;\n  padding: 0 0.48rem;\n  border: 1px solid rgba(192, 125, 28, 0.34);\n  background: rgba(255, 247, 226, 0.94);\n  color: #8a5a12;\n  box-shadow: 0 7px 16px rgba(132, 82, 8, 0.16);\n}\n.ui-info-card__overlay-action--tone-stage-finalized.ui-info-card__overlay-action--badge[_ngcontent-%COMP%] {\n  border-color: rgba(34, 132, 82, 0.34);\n  background: rgba(231, 250, 239, 0.94);\n  color: #17663f;\n}\n.ui-info-card__overlay-action--tone-stage-suspended.ui-info-card__overlay-action--badge[_ngcontent-%COMP%] {\n  border-color: rgba(150, 82, 82, 0.34);\n  background: rgba(255, 238, 238, 0.94);\n  color: #8a3434;\n}\n.ui-info-card__overlay-action--tone-public.ui-info-card__overlay-action--badge[_ngcontent-%COMP%] {\n  border-color: rgba(46, 111, 178, 0.4);\n  background:\n    linear-gradient(\n      180deg,\n      #eef7ff 0%,\n      #dcecff 100%);\n  color: #2f6cae;\n  box-shadow: 0 7px 16px rgba(35, 89, 149, 0.18);\n}\n.ui-info-card__overlay-action--tone-inactive[_ngcontent-%COMP%] {\n  background: rgba(84, 102, 128, 0.74);\n  color: rgba(248, 250, 255, 0.9);\n  border-color: rgba(44, 60, 84, 0.28);\n}\n.ui-info-card__overlay-action--tone-review[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #9d681c 0%,\n      #765018 100%);\n  color: #fff;\n  border-color: rgba(255, 255, 255, 0.82);\n}\n.ui-info-card__overlay-action--tone-blocked[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #b84558 0%,\n      #8f3143 100%);\n  color: #fff;\n  border-color: rgba(255, 255, 255, 0.82);\n}\n.ui-info-card__overlay-action--layout-badge-with-leading-accessory.ui-info-card__overlay-action--tone-blocked[_ngcontent-%COMP%] {\n  border-color: rgba(255, 255, 255, 0.96);\n  background:\n    linear-gradient(\n      180deg,\n      #e45f66 0%,\n      #bd2635 100%);\n  color: #fff;\n  text-shadow: 0 1px 1px rgba(80, 0, 8, 0.28);\n  box-shadow: 0 8px 18px rgba(128, 23, 34, 0.36), inset 0 0 0 1px rgba(137, 17, 29, 0.5);\n}\n.ui-info-card__overlay-action--layout-badge-with-leading-accessory.ui-info-card__overlay-action--tone-blocked[_ngcontent-%COMP%]   .ui-info-card__overlay-leading-accessory--tone-negative[_ngcontent-%COMP%] {\n  background: rgba(255, 255, 255, 0.22);\n  color: #fff;\n}\n.ui-info-card__overlay-action--tone-deleted[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #59677d 0%,\n      #435066 100%);\n  color: #fff;\n  border-color: rgba(255, 255, 255, 0.82);\n}\n.ui-info-card__overlay-action--tone-selected.ui-info-card__overlay-action--toggle[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #e9f7ee 0%,\n      #d6f0de 100%);\n  color: #2c7c52;\n}\n.ui-info-card__overlay-action--tone-selected.ui-info-card__overlay-action--badge[_ngcontent-%COMP%] {\n  border-color: rgba(214, 147, 28, 0.58);\n  background:\n    linear-gradient(\n      180deg,\n      #fff8d8 0%,\n      #ffd76a 100%);\n  color: #9b5f00;\n  box-shadow: 0 7px 16px rgba(132, 82, 8, 0.24);\n}\n.ui-info-card__overlay-action--tone-woman.ui-info-card__overlay-action--avatar[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      145deg,\n      #d3754c,\n      #ac4a24);\n}\n.ui-info-card__overlay-action--tone-man.ui-info-card__overlay-action--avatar[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      145deg,\n      #3572a4,\n      #194364);\n}\n.ui-info-card__overlay-action--tone-1.ui-info-card__overlay-action--avatar[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      145deg,\n      #3572a4,\n      #194364);\n}\n.ui-info-card__overlay-action--tone-2.ui-info-card__overlay-action--avatar[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      145deg,\n      #c56841,\n      #8f381d);\n}\n.ui-info-card__overlay-action--tone-3.ui-info-card__overlay-action--avatar[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      145deg,\n      #3c9d78,\n      #1f6450);\n}\n.ui-info-card__overlay-action--tone-4.ui-info-card__overlay-action--avatar[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      145deg,\n      #7b63c7,\n      #4d3a8f);\n}\n.ui-info-card__overlay-action--tone-5.ui-info-card__overlay-action--avatar[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      145deg,\n      #bf5f8f,\n      #883b65);\n}\n.ui-info-card__overlay-action--tone-6.ui-info-card__overlay-action--avatar[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      145deg,\n      #4895ad,\n      #285c79);\n}\n.ui-info-card__overlay-action--tone-7.ui-info-card__overlay-action--avatar[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      145deg,\n      #b47c3b,\n      #7e5325);\n}\n.ui-info-card__overlay-action--tone-8.ui-info-card__overlay-action--avatar[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      145deg,\n      #5673bf,\n      #324a8a);\n}\n.ui-info-card__pending-badge[_ngcontent-%COMP%] {\n  position: absolute;\n  top: -15px;\n  right: -10px;\n  min-width: 18px;\n  height: 18px;\n  padding: 0;\n  border-radius: 999px;\n  border: 1px solid #fff;\n  background: #d84d4d;\n  color: #fff;\n  font-size: 10px;\n  font-weight: 700;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n}\n.ui-info-card__actions[_ngcontent-%COMP%] {\n  position: relative;\n  display: inline-flex;\n  align-items: center;\n}\n.ui-info-card__actions[_ngcontent-%COMP%]   .app-menu-host--trigger-icon[_ngcontent-%COMP%]   .app-menu__trigger--layout-icon[_ngcontent-%COMP%] {\n  width: 28px;\n  height: 28px;\n  min-width: 28px;\n  min-height: 28px;\n}\n.ui-info-card__actions[_ngcontent-%COMP%]   .app-menu-host--trigger-icon[_ngcontent-%COMP%]   .app-menu__trigger--layout-icon[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 15px;\n  height: 15px;\n  font-size: 15px;\n  line-height: 15px;\n}\n.ui-info-card__menu-trigger[_ngcontent-%COMP%] {\n  position: relative;\n  z-index: 31;\n  display: inline-grid;\n  place-items: center;\n  width: 28px;\n  min-width: 28px;\n  max-width: 28px;\n  height: 28px;\n  min-height: 28px;\n  max-height: 28px;\n  box-sizing: border-box;\n  flex: 0 0 28px;\n  padding: 0;\n  border: 1px solid rgba(42, 67, 101, 0.26);\n  border-radius: 50%;\n  background: rgba(255, 255, 255, 0.88);\n  color: #2d5ea8;\n  cursor: pointer;\n  overflow: visible;\n  transition:\n    transform 0.16s ease,\n    background-color 0.16s ease,\n    border-color 0.16s ease,\n    color 0.16s ease;\n}\n.ui-info-card__menu-trigger[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  grid-area: 1/1;\n  justify-self: center;\n  margin: 0;\n  width: 15px;\n  height: 15px;\n  font-size: 15px;\n  line-height: 15px;\n  transform-origin: center;\n  transition: transform 0.16s ease, opacity 0.16s ease;\n}\n.ui-info-card__menu-trigger.is-open[_ngcontent-%COMP%] {\n  background: rgba(255, 255, 255, 0.94);\n  border-color: rgba(42, 67, 101, 0.32);\n  color: #2d5ea8;\n}\n.ui-info-card__menu-trigger.is-open[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  transform: rotate(90deg);\n}\n.ui-info-card__menu-trigger[_ngcontent-%COMP%]:hover {\n  transform: none;\n}\n.ui-info-card__menu-counter[_ngcontent-%COMP%] {\n  top: -7px;\n  right: -7px;\n  z-index: 40;\n  pointer-events: none;\n}\n.ui-info-card__menu-backdrop[_ngcontent-%COMP%] {\n  position: fixed;\n  inset: 0;\n  z-index: 29;\n  border: 0;\n  margin: 0;\n  padding: 0;\n  background: transparent;\n}\n.ui-info-card__menu[_ngcontent-%COMP%] {\n  position: absolute;\n  right: 0;\n  top: calc(100% + 6px);\n  z-index: 30;\n  min-width: 220px;\n  max-width: min(300px, 70vw);\n  border: 1px solid rgba(42, 67, 101, 0.24);\n  border-radius: 12px;\n  background: #fff;\n  box-shadow: 0 16px 34px rgba(14, 30, 52, 0.22);\n  padding: 0.36rem;\n  display: grid;\n  gap: 0.18rem;\n}\n.ui-info-card__menu--open-up[_ngcontent-%COMP%] {\n  top: auto;\n  bottom: calc(100% + 6px);\n}\n.asset-occupancy-badge.asset-occupancy-badge-full[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #b84f4f 0%,\n      #963636 100%);\n  box-shadow: 0 5px 10px rgba(72, 24, 24, 0.34), inset 0 0 0 1px rgba(111, 38, 38, 0.6);\n}\n.ui-info-card__menu-title[_ngcontent-%COMP%] {\n  margin: 0 0 0.1rem;\n  padding: 0.34rem 0.46rem 0.42rem;\n  border-bottom: 1px solid rgba(37, 64, 101, 0.14);\n  color: #203a5f;\n  font-size: 0.78rem;\n  font-weight: 800;\n  line-height: 1.22;\n  word-break: break-word;\n}\n.ui-info-card__menu-action[_ngcontent-%COMP%] {\n  width: 100%;\n  border: 0;\n  border-radius: 9px;\n  background: transparent;\n  color: #1f3659;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.42rem;\n  padding: 0.42rem 0.5rem;\n  font-size: 0.8rem;\n  font-weight: 700;\n  cursor: pointer;\n  text-align: left;\n}\n.ui-info-card__menu-action[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n  line-height: 16px;\n}\n.ui-info-card__menu-action--accent[_ngcontent-%COMP%] {\n  color: #975316;\n}\n.ui-info-card__menu-action--review[_ngcontent-%COMP%] {\n  background: rgba(255, 241, 215, 0.82);\n  color: #8b5713;\n}\n.ui-info-card__menu-action--warning[_ngcontent-%COMP%] {\n  color: #8c5a19;\n}\n.ui-info-card__menu-action--destructive[_ngcontent-%COMP%] {\n  color: #9c3043;\n}\n.ui-info-card__footer-chips[_ngcontent-%COMP%] {\n  position: relative;\n  z-index: 1;\n  display: flex;\n  flex-wrap: wrap;\n  gap: 0.28rem;\n}\n.ui-info-card__footer-chips--actions[_ngcontent-%COMP%] {\n  justify-content: flex-end;\n  margin-top: 0.42rem;\n}\n.ui-info-card__footer-chip[_ngcontent-%COMP%] {\n  min-height: 26px;\n  padding: 0.14rem 0.46rem;\n  border-radius: 999px;\n  border: 1px solid rgba(62, 89, 128, 0.18);\n  background:\n    linear-gradient(\n      180deg,\n      #f6f8fc 0%,\n      #edf2f8 100%);\n  color: #4f617d;\n  font-size: 0.68rem;\n  font-weight: 800;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.26rem;\n  line-height: 1;\n  font-family: inherit;\n}\nbutton.ui-info-card__footer-chip[_ngcontent-%COMP%] {\n  cursor: pointer;\n}\n.ui-info-card__footer-chip--button[_ngcontent-%COMP%] {\n  box-shadow: 0 8px 18px rgba(132, 82, 8, 0.12);\n}\n.ui-info-card__footer-chip--action-accent[_ngcontent-%COMP%] {\n  min-height: 32px;\n  padding: 0 0.68rem;\n  gap: 0.3rem;\n  background:\n    linear-gradient(\n      180deg,\n      #fff7e9 0%,\n      #ffedc9 100%);\n  border-color: rgba(201, 144, 39, 0.3);\n  color: #9b6714;\n  box-shadow: 0 4px 10px rgba(132, 82, 8, 0.1);\n  font-size: 0.74rem;\n  font-weight: 900;\n}\n.ui-info-card__footer-chip--button[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 14px;\n  height: 14px;\n  font-size: 14px;\n  line-height: 14px;\n}\n.ui-info-card__footer-chip--action-accent[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 15px;\n  height: 15px;\n  font-size: 15px;\n  line-height: 15px;\n}\n.ui-info-card__footer-chip--button[_ngcontent-%COMP%]:focus-visible {\n  outline: 2px solid rgba(79, 124, 255, 0.62);\n  outline-offset: 2px;\n}\n.ui-info-card__footer-chip.section-social[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #ecf4ff 0%,\n      #e1ecfb 100%);\n  border-color: rgba(45, 94, 168, 0.32);\n  color: #2d5ea8;\n}\n.ui-info-card__footer-chip.section-arts[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f2edfb 0%,\n      #e9e2f9 100%);\n  border-color: rgba(103, 76, 164, 0.32);\n  color: #654ca1;\n}\n.ui-info-card__footer-chip.section-food[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #fff4e8 0%,\n      #fee9d6 100%);\n  border-color: rgba(170, 97, 28, 0.32);\n  color: #9d611c;\n}\n.ui-info-card__footer-chip.section-active[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #edf8ee 0%,\n      #e2f1e4 100%);\n  border-color: rgba(44, 126, 72, 0.32);\n  color: #2d7d47;\n}\n.ui-info-card__footer-chip.section-mind[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #eaf8f6 0%,\n      #def1ee 100%);\n  border-color: rgba(37, 124, 118, 0.32);\n  color: #2d7d78;\n}\n.ui-info-card__footer-chip.section-identity[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f4f0ff 0%,\n      #e9e3fb 100%);\n  border-color: rgba(88, 78, 159, 0.32);\n  color: #5a4ea0;\n}\n.ui-info-card__footer-chip.status-pending[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #fff8e8 0%,\n      #ffefc9 100%);\n  border-color: rgba(201, 144, 39, 0.34);\n  color: #9b6714;\n}\n.ui-info-card__footer-chip.status-waitlist[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #eef8ff 0%,\n      #dcecf5 100%);\n  border-color: rgba(55, 115, 158, 0.36);\n  color: #2e668f;\n}\n.ui-info-card__footer-chip.status-review[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f6e6ce 0%,\n      #e9cda6 100%);\n  border-color: rgba(126, 82, 35, 0.42);\n  color: #714817;\n}\n.ui-info-card__footer-chip.status-blocked[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #fff2f2 0%,\n      #f8dede 100%);\n  border-color: rgba(180, 52, 64, 0.3);\n  color: #9d2f3d;\n}\n.ui-info-card__footer-chip.status-deleted[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f7f8fa 0%,\n      #e9edf2 100%);\n  border-color: rgba(97, 105, 118, 0.34);\n  color: #4f5968;\n}\n.ui-info-card__footer-chip.status-inactive[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f2f3f5 0%,\n      #e8ebef 100%);\n  border-color: rgba(102, 112, 128, 0.3);\n  color: #556171;\n}\n@media (hover: hover) and (pointer: fine) {\n  button.asset-occupancy-badge[_ngcontent-%COMP%]:hover {\n    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.82), 0 10px 22px rgba(255, 255, 255, 0.58);\n    filter: brightness(1.06);\n  }\n  .experience-action-btn[_ngcontent-%COMP%]:hover {\n    box-shadow: 0 6px 14px rgba(19, 39, 68, 0.22);\n    filter: saturate(1.05);\n  }\n  .ui-info-card__menu-action[_ngcontent-%COMP%]:hover {\n    background: rgba(230, 238, 248, 0.72);\n  }\n  button.ui-info-card__overlay-action--layout-avatar-metric[_ngcontent-%COMP%]:hover {\n    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.84), 0 12px 24px rgba(12, 25, 42, 0.32);\n    filter: brightness(1.03);\n  }\n  button.ui-info-card__overlay-action--layout-badge-with-leading-accessory[_ngcontent-%COMP%]:hover {\n    box-shadow:\n      0 0 0 2px rgba(255, 255, 255, 0.84),\n      0 12px 24px rgba(19, 40, 67, 0.34),\n      inset 0 0 0 1px rgba(18, 38, 64, 0.58);\n  }\n}\nbutton.asset-occupancy-badge[_ngcontent-%COMP%]:active {\n  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.82), 0 9px 20px rgba(255, 255, 255, 0.54);\n}\nbutton.asset-occupancy-badge[_ngcontent-%COMP%]:focus-visible {\n  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.82), 0 9px 20px rgba(255, 255, 255, 0.54);\n  outline: none;\n}\n.asset-occupancy-badge.asset-occupancy-badge-static[_ngcontent-%COMP%] {\n  cursor: default;\n  box-shadow: 0 5px 10px rgba(8, 18, 34, 0.24);\n}\n.asset-occupancy-badge.asset-occupancy-badge-static.asset-occupancy-badge-full[_ngcontent-%COMP%] {\n  box-shadow: 0 5px 10px rgba(72, 24, 24, 0.34), inset 0 0 0 1px rgba(111, 38, 38, 0.6);\n}\n.experience-action-btn[_ngcontent-%COMP%]:active {\n  box-shadow: 0 3px 8px rgba(19, 39, 68, 0.18);\n}\n@media (max-width: 760px) {\n  .ui-info-card__head[_ngcontent-%COMP%] {\n    grid-template-columns: auto minmax(0, 1fr) auto;\n    row-gap: 0.32rem;\n  }\n  .ui-info-card__menu[_ngcontent-%COMP%] {\n    position: fixed;\n    left: 50%;\n    right: auto;\n    top: auto;\n    bottom: env(safe-area-inset-bottom, 0px);\n    width: min(100vw - 1.6rem, 27rem);\n    min-width: 0;\n    max-width: calc(100vw - 1.6rem);\n    max-height: min(70vh, 32rem);\n    overflow-y: auto;\n    padding: 0.45rem;\n    border-radius: 14px 14px 0 0;\n    box-shadow: 0 22px 48px rgba(11, 24, 43, 0.32);\n    transform: translate(-50%, 0);\n  }\n  .ui-info-card__menu-title[_ngcontent-%COMP%] {\n    padding: 0.52rem 0.56rem 0.56rem;\n    font-size: 0.9rem;\n  }\n  .ui-info-card__menu-action[_ngcontent-%COMP%] {\n    min-height: 42px;\n    padding: 0.55rem 0.58rem;\n    border-radius: 11px;\n    font-size: 0.92rem;\n    gap: 0.5rem;\n  }\n  .ui-info-card__menu-action[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n    width: 18px;\n    height: 18px;\n    font-size: 18px;\n    line-height: 18px;\n  }\n}\n/*# sourceMappingURL=info-card.component.css.map */'], changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(InfoCardComponent, [{
    type: Component,
    args: [{ selector: "app-info-card", standalone: true, imports: [
      CommonModule,
      MatIconModule,
      LazyBgImageDirective,
      IndicatorComponent,
      CounterBadgePipe,
      I18nPipe,
      AppMenuTriggerComponent
    ], changeDetection: ChangeDetectionStrategy.OnPush, template: `<article
  class="experience-item-card asset-item-card"
  [ngClass]="rootClassList()"
  [style.--ui-info-card-accent-hue]="cardAccentHue()"
  [attr.data-group-label]="card?.groupLabel"
  [attr.data-info-card-id]="card?.id"
  (click)="onCardActivated($event)"
  >
  <div
    class="ui-info-card__media"
    [class.ui-info-card__media--placeholder]="!card?.imageUrl && !isTitleMedia()"
    [class.ui-info-card__media--title]="isTitleMedia()"
    [class.ui-info-card__media--tone-neutral]="mediaTone() === 'neutral'"
    [appLazyBgImage]="cardImageUrl()"
    >
      @if (isTitleMedia()) {
        <span class="ui-info-card__media-title-content">
          @if (mediaIcon()) {
            <mat-icon>{{ mediaIcon() }}</mat-icon>
          }
          <strong>{{ mediaTitle() }}</strong>
          @if (mediaSubtitle()) {
            <small>{{ mediaSubtitle() }}</small>
          }
        </span>
      }
      @if (card?.imageUrl && !isTitleMedia()) {
        <span class="ui-info-card__image-loader" aria-hidden="true">
          <app-indicator kind="spinner-ring" size="sm"></app-indicator>
        </span>
      }
      @if (!card?.imageUrl && !isTitleMedia()) {
        <mat-icon class="ui-info-card__placeholder-icon">image_not_supported</mat-icon>
      }
      @if (card?.mediaStart; as mediaStart) {
        @if (isOverlayInteractive(mediaStart)) {
          <button
            type="button"
            class="ui-info-card__overlay-action ui-info-card__overlay-action--start"
            [class.ui-info-card__overlay-action--avatar]="overlayVariant(mediaStart) === 'avatar'"
            [class.ui-info-card__overlay-action--badge]="overlayVariant(mediaStart) === 'badge'"
            [class.ui-info-card__overlay-action--toggle]="overlayVariant(mediaStart) === 'toggle'"
            [class.ui-info-card__overlay-action--shape-circle]="overlayShape(mediaStart) === 'circle'"
            [class.ui-info-card__overlay-action--layout-avatar-metric]="overlayLayout(mediaStart) === 'avatar-metric'"
            [class.ui-info-card__overlay-action--layout-badge-with-leading-accessory]="overlayLayout(mediaStart) === 'badge-with-leading-accessory'"
            [class.ui-info-card__overlay-action--tone-default]="overlayTone(mediaStart) === 'default'"
            [class.ui-info-card__overlay-action--tone-stage]="overlayTone(mediaStart) === 'stage'"
            [class.ui-info-card__overlay-action--tone-cool]="overlayTone(mediaStart) === 'cool'"
            [class.ui-info-card__overlay-action--tone-cool-mid]="overlayTone(mediaStart) === 'cool-mid'"
            [class.ui-info-card__overlay-action--tone-neutral]="overlayTone(mediaStart) === 'neutral'"
            [class.ui-info-card__overlay-action--tone-warm-mid]="overlayTone(mediaStart) === 'warm-mid'"
            [class.ui-info-card__overlay-action--tone-warm]="overlayTone(mediaStart) === 'warm'"
            [class.ui-info-card__overlay-action--tone-public]="overlayTone(mediaStart) === 'public'"
            [class.ui-info-card__overlay-action--tone-friends]="overlayTone(mediaStart) === 'friends'"
            [class.ui-info-card__overlay-action--tone-invitation]="overlayTone(mediaStart) === 'invitation'"
            [class.ui-info-card__overlay-action--tone-full]="overlayTone(mediaStart) === 'full'"
            [class.ui-info-card__overlay-action--tone-inactive]="overlayTone(mediaStart) === 'inactive'"
            [class.ui-info-card__overlay-action--tone-selected]="overlayTone(mediaStart) === 'selected'"
            [class.ui-info-card__overlay-action--tone-review]="overlayTone(mediaStart) === 'review'"
            [class.ui-info-card__overlay-action--tone-blocked]="overlayTone(mediaStart) === 'blocked'"
            [class.ui-info-card__overlay-action--tone-deleted]="overlayTone(mediaStart) === 'deleted'"
            [class.ui-info-card__overlay-action--tone-woman]="overlayTone(mediaStart) === 'woman'"
            [class.ui-info-card__overlay-action--tone-man]="overlayTone(mediaStart) === 'man'"
            [class.ui-info-card__overlay-action--tone-1]="overlayTone(mediaStart) === 'tone-1'"
            [class.ui-info-card__overlay-action--tone-2]="overlayTone(mediaStart) === 'tone-2'"
            [class.ui-info-card__overlay-action--tone-3]="overlayTone(mediaStart) === 'tone-3'"
            [class.ui-info-card__overlay-action--tone-4]="overlayTone(mediaStart) === 'tone-4'"
            [class.ui-info-card__overlay-action--tone-5]="overlayTone(mediaStart) === 'tone-5'"
            [class.ui-info-card__overlay-action--tone-6]="overlayTone(mediaStart) === 'tone-6'"
            [class.ui-info-card__overlay-action--tone-7]="overlayTone(mediaStart) === 'tone-7'"
            [class.ui-info-card__overlay-action--tone-8]="overlayTone(mediaStart) === 'tone-8'"
            [attr.aria-label]="(mediaStart.ariaLabel || overlayLabel(mediaStart)) | i18n"
            [disabled]="mediaStart.disabled"
            (click)="onMediaStartActivated($event)"
            >
            <ng-container *ngTemplateOutlet="overlayContent; context: { $implicit: mediaStart }"></ng-container>
          </button>
        } @else {
          <span
            class="ui-info-card__overlay-action ui-info-card__overlay-action--start"
            [class.ui-info-card__overlay-action--avatar]="overlayVariant(mediaStart) === 'avatar'"
            [class.ui-info-card__overlay-action--badge]="overlayVariant(mediaStart) === 'badge'"
            [class.ui-info-card__overlay-action--toggle]="overlayVariant(mediaStart) === 'toggle'"
            [class.ui-info-card__overlay-action--shape-circle]="overlayShape(mediaStart) === 'circle'"
            [class.ui-info-card__overlay-action--tone-default]="overlayTone(mediaStart) === 'default'"
            [class.ui-info-card__overlay-action--tone-stage]="overlayTone(mediaStart) === 'stage'"
            [class.ui-info-card__overlay-action--layout-avatar-metric]="overlayLayout(mediaStart) === 'avatar-metric'"
            [class.ui-info-card__overlay-action--layout-badge-with-leading-accessory]="overlayLayout(mediaStart) === 'badge-with-leading-accessory'"
            [class.ui-info-card__overlay-action--tone-cool]="overlayTone(mediaStart) === 'cool'"
            [class.ui-info-card__overlay-action--tone-cool-mid]="overlayTone(mediaStart) === 'cool-mid'"
            [class.ui-info-card__overlay-action--tone-neutral]="overlayTone(mediaStart) === 'neutral'"
            [class.ui-info-card__overlay-action--tone-warm-mid]="overlayTone(mediaStart) === 'warm-mid'"
            [class.ui-info-card__overlay-action--tone-warm]="overlayTone(mediaStart) === 'warm'"
            [class.ui-info-card__overlay-action--tone-public]="overlayTone(mediaStart) === 'public'"
            [class.ui-info-card__overlay-action--tone-friends]="overlayTone(mediaStart) === 'friends'"
            [class.ui-info-card__overlay-action--tone-invitation]="overlayTone(mediaStart) === 'invitation'"
            [class.ui-info-card__overlay-action--tone-full]="overlayTone(mediaStart) === 'full'"
            [class.ui-info-card__overlay-action--tone-inactive]="overlayTone(mediaStart) === 'inactive'"
            [class.ui-info-card__overlay-action--tone-selected]="overlayTone(mediaStart) === 'selected'"
            [class.ui-info-card__overlay-action--tone-review]="overlayTone(mediaStart) === 'review'"
            [class.ui-info-card__overlay-action--tone-blocked]="overlayTone(mediaStart) === 'blocked'"
            [class.ui-info-card__overlay-action--tone-deleted]="overlayTone(mediaStart) === 'deleted'"
            [class.ui-info-card__overlay-action--tone-woman]="overlayTone(mediaStart) === 'woman'"
            [class.ui-info-card__overlay-action--tone-man]="overlayTone(mediaStart) === 'man'"
            [class.ui-info-card__overlay-action--tone-1]="overlayTone(mediaStart) === 'tone-1'"
            [class.ui-info-card__overlay-action--tone-2]="overlayTone(mediaStart) === 'tone-2'"
            [class.ui-info-card__overlay-action--tone-3]="overlayTone(mediaStart) === 'tone-3'"
            [class.ui-info-card__overlay-action--tone-4]="overlayTone(mediaStart) === 'tone-4'"
            [class.ui-info-card__overlay-action--tone-5]="overlayTone(mediaStart) === 'tone-5'"
            [class.ui-info-card__overlay-action--tone-6]="overlayTone(mediaStart) === 'tone-6'"
            [class.ui-info-card__overlay-action--tone-7]="overlayTone(mediaStart) === 'tone-7'"
            [class.ui-info-card__overlay-action--tone-8]="overlayTone(mediaStart) === 'tone-8'"
            [attr.aria-hidden]="true"
            >
            <ng-container *ngTemplateOutlet="overlayContent; context: { $implicit: mediaStart }"></ng-container>
          </span>
        }
      }
      @if (card?.mediaEnd; as mediaEnd) {
        @if (isOverlayInteractive(mediaEnd)) {
          <button
            type="button"
            class="ui-info-card__overlay-action ui-info-card__overlay-action--end asset-occupancy-badge"
            [class.ui-info-card__overlay-action--avatar]="overlayVariant(mediaEnd) === 'avatar'"
            [class.ui-info-card__overlay-action--badge]="overlayVariant(mediaEnd) === 'badge'"
            [class.ui-info-card__overlay-action--toggle]="overlayVariant(mediaEnd) === 'toggle'"
            [class.ui-info-card__overlay-action--shape-circle]="overlayShape(mediaEnd) === 'circle'"
            [class.ui-info-card__overlay-action--layout-avatar-metric]="overlayLayout(mediaEnd) === 'avatar-metric'"
            [class.ui-info-card__overlay-action--layout-badge-with-leading-accessory]="overlayLayout(mediaEnd) === 'badge-with-leading-accessory'"
            [class.asset-occupancy-badge-full]="overlayTone(mediaEnd) === 'full'"
            [class.ui-info-card__overlay-action--tone-default]="overlayTone(mediaEnd) === 'default'"
            [class.ui-info-card__overlay-action--tone-stage]="overlayTone(mediaEnd) === 'stage'"
            [class.ui-info-card__overlay-action--tone-stage-active]="overlayTone(mediaEnd) === 'stage-active'"
            [class.ui-info-card__overlay-action--tone-stage-scheduled]="overlayTone(mediaEnd) === 'stage-scheduled'"
            [class.ui-info-card__overlay-action--tone-stage-blocked]="overlayTone(mediaEnd) === 'stage-blocked'"
            [class.ui-info-card__overlay-action--tone-stage-start]="overlayTone(mediaEnd) === 'stage-start'"
            [class.ui-info-card__overlay-action--tone-stage-review]="overlayTone(mediaEnd) === 'stage-review'"
            [class.ui-info-card__overlay-action--tone-stage-finalized]="overlayTone(mediaEnd) === 'stage-finalized'"
            [class.ui-info-card__overlay-action--tone-stage-suspended]="overlayTone(mediaEnd) === 'stage-suspended'"
            [class.ui-info-card__overlay-action--tone-cool]="overlayTone(mediaEnd) === 'cool'"
            [class.ui-info-card__overlay-action--tone-cool-mid]="overlayTone(mediaEnd) === 'cool-mid'"
            [class.ui-info-card__overlay-action--tone-neutral]="overlayTone(mediaEnd) === 'neutral'"
            [class.ui-info-card__overlay-action--tone-warm-mid]="overlayTone(mediaEnd) === 'warm-mid'"
            [class.ui-info-card__overlay-action--tone-warm]="overlayTone(mediaEnd) === 'warm'"
            [class.ui-info-card__overlay-action--tone-public]="overlayTone(mediaEnd) === 'public'"
            [class.ui-info-card__overlay-action--tone-friends]="overlayTone(mediaEnd) === 'friends'"
            [class.ui-info-card__overlay-action--tone-invitation]="overlayTone(mediaEnd) === 'invitation'"
            [class.ui-info-card__overlay-action--tone-full]="overlayTone(mediaEnd) === 'full'"
            [class.ui-info-card__overlay-action--tone-inactive]="overlayTone(mediaEnd) === 'inactive'"
            [class.ui-info-card__overlay-action--tone-selected]="overlayTone(mediaEnd) === 'selected'"
            [class.ui-info-card__overlay-action--tone-review]="overlayTone(mediaEnd) === 'review'"
            [class.ui-info-card__overlay-action--tone-blocked]="overlayTone(mediaEnd) === 'blocked'"
            [class.ui-info-card__overlay-action--tone-deleted]="overlayTone(mediaEnd) === 'deleted'"
            [class.ui-info-card__overlay-action--tone-woman]="overlayTone(mediaEnd) === 'woman'"
            [class.ui-info-card__overlay-action--tone-man]="overlayTone(mediaEnd) === 'man'"
            [class.ui-info-card__overlay-action--tone-1]="overlayTone(mediaEnd) === 'tone-1'"
            [class.ui-info-card__overlay-action--tone-2]="overlayTone(mediaEnd) === 'tone-2'"
            [class.ui-info-card__overlay-action--tone-3]="overlayTone(mediaEnd) === 'tone-3'"
            [class.ui-info-card__overlay-action--tone-4]="overlayTone(mediaEnd) === 'tone-4'"
            [class.ui-info-card__overlay-action--tone-5]="overlayTone(mediaEnd) === 'tone-5'"
            [class.ui-info-card__overlay-action--tone-6]="overlayTone(mediaEnd) === 'tone-6'"
            [class.ui-info-card__overlay-action--tone-7]="overlayTone(mediaEnd) === 'tone-7'"
            [class.ui-info-card__overlay-action--tone-8]="overlayTone(mediaEnd) === 'tone-8'"
            [class.ui-info-card__overlay-action--ring-active]="overlayProgressRing(mediaEnd)"
            [attr.aria-label]="(mediaEnd.ariaLabel || overlayLabel(mediaEnd)) | i18n"
            [disabled]="mediaEnd.disabled"
            (click)="onMediaEndActivated($event)"
            >
            <ng-container *ngTemplateOutlet="overlayContent; context: { $implicit: mediaEnd }"></ng-container>
            @if ((mediaEnd.pendingCount ?? 0) > 0) {
              <span class="ui-info-card__pending-badge card-badge asset-request-badge">{{ mediaEnd.pendingCount | counterBadge }}</span>
            }
            @if (overlayProgressRing(mediaEnd)) {
              <span class="ui-info-card__overlay-action-ring" aria-hidden="true">
                <app-indicator kind="action-ring" shape="button" state="loading" [durationMs]="1500"></app-indicator>
              </span>
            }
          </button>
        } @else {
          <span
            class="ui-info-card__overlay-action ui-info-card__overlay-action--end asset-occupancy-badge asset-occupancy-badge-static"
            [class.ui-info-card__overlay-action--avatar]="overlayVariant(mediaEnd) === 'avatar'"
            [class.ui-info-card__overlay-action--badge]="overlayVariant(mediaEnd) === 'badge'"
            [class.ui-info-card__overlay-action--toggle]="overlayVariant(mediaEnd) === 'toggle'"
            [class.ui-info-card__overlay-action--shape-circle]="overlayShape(mediaEnd) === 'circle'"
            [class.ui-info-card__overlay-action--layout-avatar-metric]="overlayLayout(mediaEnd) === 'avatar-metric'"
            [class.ui-info-card__overlay-action--layout-badge-with-leading-accessory]="overlayLayout(mediaEnd) === 'badge-with-leading-accessory'"
            [class.asset-occupancy-badge-full]="overlayTone(mediaEnd) === 'full'"
            [class.ui-info-card__overlay-action--tone-default]="overlayTone(mediaEnd) === 'default'"
            [class.ui-info-card__overlay-action--tone-stage]="overlayTone(mediaEnd) === 'stage'"
            [class.ui-info-card__overlay-action--tone-stage-active]="overlayTone(mediaEnd) === 'stage-active'"
            [class.ui-info-card__overlay-action--tone-stage-scheduled]="overlayTone(mediaEnd) === 'stage-scheduled'"
            [class.ui-info-card__overlay-action--tone-stage-blocked]="overlayTone(mediaEnd) === 'stage-blocked'"
            [class.ui-info-card__overlay-action--tone-stage-start]="overlayTone(mediaEnd) === 'stage-start'"
            [class.ui-info-card__overlay-action--tone-stage-review]="overlayTone(mediaEnd) === 'stage-review'"
            [class.ui-info-card__overlay-action--tone-stage-finalized]="overlayTone(mediaEnd) === 'stage-finalized'"
            [class.ui-info-card__overlay-action--tone-stage-suspended]="overlayTone(mediaEnd) === 'stage-suspended'"
            [class.ui-info-card__overlay-action--tone-cool]="overlayTone(mediaEnd) === 'cool'"
            [class.ui-info-card__overlay-action--tone-cool-mid]="overlayTone(mediaEnd) === 'cool-mid'"
            [class.ui-info-card__overlay-action--tone-neutral]="overlayTone(mediaEnd) === 'neutral'"
            [class.ui-info-card__overlay-action--tone-warm-mid]="overlayTone(mediaEnd) === 'warm-mid'"
            [class.ui-info-card__overlay-action--tone-warm]="overlayTone(mediaEnd) === 'warm'"
            [class.ui-info-card__overlay-action--tone-public]="overlayTone(mediaEnd) === 'public'"
            [class.ui-info-card__overlay-action--tone-friends]="overlayTone(mediaEnd) === 'friends'"
            [class.ui-info-card__overlay-action--tone-invitation]="overlayTone(mediaEnd) === 'invitation'"
            [class.ui-info-card__overlay-action--tone-full]="overlayTone(mediaEnd) === 'full'"
            [class.ui-info-card__overlay-action--tone-inactive]="overlayTone(mediaEnd) === 'inactive'"
            [class.ui-info-card__overlay-action--tone-selected]="overlayTone(mediaEnd) === 'selected'"
            [class.ui-info-card__overlay-action--tone-review]="overlayTone(mediaEnd) === 'review'"
            [class.ui-info-card__overlay-action--tone-blocked]="overlayTone(mediaEnd) === 'blocked'"
            [class.ui-info-card__overlay-action--tone-deleted]="overlayTone(mediaEnd) === 'deleted'"
            [class.ui-info-card__overlay-action--tone-woman]="overlayTone(mediaEnd) === 'woman'"
            [class.ui-info-card__overlay-action--tone-man]="overlayTone(mediaEnd) === 'man'"
            [class.ui-info-card__overlay-action--tone-1]="overlayTone(mediaEnd) === 'tone-1'"
            [class.ui-info-card__overlay-action--tone-2]="overlayTone(mediaEnd) === 'tone-2'"
            [class.ui-info-card__overlay-action--tone-3]="overlayTone(mediaEnd) === 'tone-3'"
            [class.ui-info-card__overlay-action--tone-4]="overlayTone(mediaEnd) === 'tone-4'"
            [class.ui-info-card__overlay-action--tone-5]="overlayTone(mediaEnd) === 'tone-5'"
            [class.ui-info-card__overlay-action--tone-6]="overlayTone(mediaEnd) === 'tone-6'"
            [class.ui-info-card__overlay-action--tone-7]="overlayTone(mediaEnd) === 'tone-7'"
            [class.ui-info-card__overlay-action--tone-8]="overlayTone(mediaEnd) === 'tone-8'"
            [attr.aria-hidden]="true"
            >
            <ng-container *ngTemplateOutlet="overlayContent; context: { $implicit: mediaEnd }"></ng-container>
            @if ((mediaEnd.pendingCount ?? 0) > 0) {
              <span class="ui-info-card__pending-badge card-badge asset-request-badge">{{ mediaEnd.pendingCount | counterBadge }}</span>
            }
          </span>
        }
      }
      @if (card?.mediaBottomEnd; as mediaBottomEnd) {
        <span
          class="ui-info-card__overlay-action ui-info-card__overlay-action--bottom-end asset-occupancy-badge asset-occupancy-badge-static"
          [class.ui-info-card__overlay-action--avatar]="overlayVariant(mediaBottomEnd) === 'avatar'"
          [class.ui-info-card__overlay-action--badge]="overlayVariant(mediaBottomEnd) === 'badge'"
          [class.ui-info-card__overlay-action--toggle]="overlayVariant(mediaBottomEnd) === 'toggle'"
          [class.ui-info-card__overlay-action--shape-circle]="overlayShape(mediaBottomEnd) === 'circle'"
          [class.ui-info-card__overlay-action--layout-avatar-metric]="overlayLayout(mediaBottomEnd) === 'avatar-metric'"
          [class.ui-info-card__overlay-action--layout-badge-with-leading-accessory]="overlayLayout(mediaBottomEnd) === 'badge-with-leading-accessory'"
          [class.ui-info-card__overlay-action--tone-stage-scheduled]="overlayTone(mediaBottomEnd) === 'stage-scheduled'"
          [class.ui-info-card__overlay-action--tone-stage-review]="overlayTone(mediaBottomEnd) === 'stage-review'"
          [class.ui-info-card__overlay-action--tone-neutral]="overlayTone(mediaBottomEnd) === 'neutral'"
          [attr.aria-hidden]="mediaBottomEnd.ariaLabel ? null : true"
          [attr.aria-label]="mediaBottomEnd.ariaLabel ? (mediaBottomEnd.ariaLabel | i18n) : null"
          >
          <ng-container *ngTemplateOutlet="overlayContent; context: { $implicit: mediaBottomEnd }"></ng-container>
        </span>
      }
  </div>

  <div
    class="ui-info-card__head"
    [class.ui-info-card__head--with-actions]="hasMenuActions()"
    [class.ui-info-card__head--without-leading]="!card?.leadingIcon"
    >
    @if (card?.leadingIcon; as leadingIcon) {
      <span
        class="ui-info-card__leading"
        [class.ui-info-card__leading--public]="leadingIcon.tone === 'public'"
        [class.ui-info-card__leading--stage]="leadingIcon.tone === 'stage'"
        [class.ui-info-card__leading--friends]="leadingIcon.tone === 'friends'"
        [class.ui-info-card__leading--invitation]="leadingIcon.tone === 'invitation'"
        [class.ui-info-card__leading--pending]="leadingIcon.tone === 'pending'"
        >
        <mat-icon>{{ leadingIcon.icon }}</mat-icon>
      </span>
    }

    <div class="ui-info-card__meta">
      <h4
        class="ui-info-card__title"
        [attr.data-i18n-ignore]="card?.i18nIgnoreContent ? '' : null"
        >{{ card?.title }}</h4>
      @for (row of visibleMetaRows(); track row) {
        <p
          class="ui-info-card__meta-row"
          [attr.data-i18n-ignore]="card?.i18nIgnoreContent ? '' : null"
          >{{ row }}</p>
      }
    </div>

    @if (hasMenuActions()) {
      <div class="ui-info-card__actions">
        @if (useSharedMenuTrigger) {
          <app-menu-trigger
            kind="select"
            [menuId]="sharedMenuId()"
            [title]="sharedMenuTitle()"
            [trigger]="sharedMenuTrigger()"
            [items]="sharedMenuItems()"
            [context]="sharedMenuContext"
          ></app-menu-trigger>
        } @else {
          <button
            type="button"
            class="ui-info-card__menu-trigger experience-action-btn experience-action-menu-trigger motion-static"
            [class.is-open]="menuTriggerOpen"
            [attr.aria-label]="'open.card.actions' | i18n"
            [attr.aria-expanded]="menuTriggerOpen"
            aria-haspopup="menu"
            (pointerdown)="onMenuTriggerPointerDown($event)"
            (click)="toggleMenu($event)"
            >
            <mat-icon>{{ menuTriggerOpen ? 'close' : 'more_vert' }}</mat-icon>
          </button>
          @if ((card?.menuBadgeCount ?? 0) > 0) {
            <span class="ui-info-card__menu-counter ui-info-card__pending-badge card-badge asset-request-badge">
              {{ card?.menuBadgeCount | counterBadge }}
            </span>
          }
        }
        @if (menuOpen && !useSharedMenu && !useSharedMenuTrigger) {
          <div
            class="ui-info-card__menu item-action-menu"
            [class.is-open]="menuOpen"
            [class.ui-info-card__menu--mobile]="isMobileView"
            [class.ui-info-card__menu--desktop]="!isMobileView"
            [class.item-action-menu-mobile]="isMobileView"
            [class.item-action-menu-desktop]="!isMobileView"
            [class.ui-info-card__menu--open-up]="menuOpenUp"
            [class.is-open-up]="menuOpenUp"
            (click)="$event.stopPropagation()"
            >
            @if (resolvedMenuTitle(); as menuTitle) {
              <div class="ui-info-card__menu-title item-action-menu-title">{{ menuTitle }}</div>
            }
            @for (action of card?.menuActions; track trackByActionId($index, action)) {
              @if (availableActions[action]; as menuAction) {
                <button
                  type="button"
                  class="ui-info-card__menu-action item-action-menu-btn"
                  [ngClass]="'ui-info-card__menu-action--' + (menuAction.tone ?? 'default')"
                  [class.item-action-menu-btn-publish]="menuAction.tone === 'accent'"
                  [class.item-action-menu-btn-review]="menuAction.tone === 'review'"
                  [class.item-action-menu-btn-warning]="menuAction.tone === 'warning'"
                  [class.item-action-menu-btn-destructive]="menuAction.tone === 'destructive'"
                  (click)="onMenuActionSelected(action, menuAction, $event)"
                  >
                  <mat-icon>{{ menuAction.icon }}</mat-icon>
                  <span>{{ menuAction.label | i18n }}</span>
                </button>
              }
            }
          </div>
        }
      </div>
    }
  </div>

  @if (card?.description) {
    <p
      class="ui-info-card__description"
      [attr.data-i18n-ignore]="card?.i18nIgnoreContent ? '' : null"
      [style.--ui-info-card-description-lines]="descriptionLines()"
      [style.--ui-info-card-description-max-height]="descriptionMaxHeight()"
      >
      {{ card?.description }}
    </p>
  }

  @for (row of card?.detailRows ?? []; track row) {
    <p
      class="ui-info-card__detail-row"
      [class.ui-info-card__detail-row--mono]="detailStyle() === 'mono'"
      [attr.data-i18n-ignore]="card?.i18nIgnoreContent ? '' : null"
      >
      {{ row }}
    </p>
  }

  @if (hasFooterChips()) {
    <div
      class="ui-info-card__footer-chips"
      [class.ui-info-card__footer-chips--actions]="hasFooterActions()"
      >
      @for (chip of card?.footerChips ?? []; track trackByFooterChip($index, chip)) {
        @if (isFooterChipInteractive(chip)) {
          <button
            type="button"
            class="ui-info-card__footer-chip"
            [ngClass]="footerChipClassList(chip)"
            [attr.aria-label]="(chip.ariaLabel || chip.label) | i18n"
            (click)="onFooterChipActivated(chip, $event)"
            >
            @if (footerChipIcon(chip); as icon) {
              <mat-icon>{{ icon }}</mat-icon>
            }
            <span>{{ chip.label | i18n }}</span>
          </button>
        } @else {
          <span
            class="ui-info-card__footer-chip"
            [ngClass]="footerChipClassList(chip)"
            >
            {{ chip.label | i18n }}
          </span>
        }
      }
    </div>
  }
</article>

<ng-template #overlayContent let-action>
  @switch (overlayLayout(action)) {
    @case ('avatar-metric') {
      @if (overlayLeadingAccessory(action); as accessory) {
        <span
          class="ui-info-card__overlay-leading-accessory ui-info-card__overlay-leading-accessory--avatar-metric"
          [class.ui-info-card__overlay-leading-accessory--tone-default]="accessory.tone === 'default'"
          [class.ui-info-card__overlay-leading-accessory--tone-woman]="accessory.tone === 'woman'"
          [class.ui-info-card__overlay-leading-accessory--tone-man]="accessory.tone === 'man'"
          [class.ui-info-card__overlay-leading-accessory--tone-1]="accessory.tone === 'tone-1'"
          [class.ui-info-card__overlay-leading-accessory--tone-2]="accessory.tone === 'tone-2'"
          [class.ui-info-card__overlay-leading-accessory--tone-3]="accessory.tone === 'tone-3'"
          [class.ui-info-card__overlay-leading-accessory--tone-4]="accessory.tone === 'tone-4'"
          [class.ui-info-card__overlay-leading-accessory--tone-5]="accessory.tone === 'tone-5'"
          [class.ui-info-card__overlay-leading-accessory--tone-6]="accessory.tone === 'tone-6'"
          [class.ui-info-card__overlay-leading-accessory--tone-7]="accessory.tone === 'tone-7'"
          [class.ui-info-card__overlay-leading-accessory--tone-8]="accessory.tone === 'tone-8'"
          >
          @if (accessory.icon) {
            <mat-icon>{{ accessory.icon }}</mat-icon>
          }
          @if (accessory.label) {
            <span>{{ accessory.label }}</span>
          }
        </span>
      }
      @if (overlayDetailLabel(action) || overlayDetailIcon(action)) {
        <span class="ui-info-card__overlay-detail">
          @if (overlayDetailLabel(action)) {
            <span>{{ overlayDetailLabel(action) }}</span>
          }
          @if (overlayDetailIcon(action); as detailIcon) {
            <mat-icon>{{ detailIcon }}</mat-icon>
          }
        </span>
      }
    }
    @case ('badge-with-leading-accessory') {
      <span class="ui-info-card__overlay-badge-body">
        @if (overlayLeadingAccessory(action); as accessory) {
          <span
            class="ui-info-card__overlay-leading-accessory ui-info-card__overlay-leading-accessory--badge"
            [class.ui-info-card__overlay-leading-accessory--tone-default]="accessory.tone === 'default'"
            [class.ui-info-card__overlay-leading-accessory--tone-positive]="accessory.tone === 'positive'"
            [class.ui-info-card__overlay-leading-accessory--tone-negative]="accessory.tone === 'negative'"
            [class.ui-info-card__overlay-leading-accessory--tone-woman]="accessory.tone === 'woman'"
            [class.ui-info-card__overlay-leading-accessory--tone-man]="accessory.tone === 'man'"
            [class.ui-info-card__overlay-leading-accessory--tone-1]="accessory.tone === 'tone-1'"
            [class.ui-info-card__overlay-leading-accessory--tone-2]="accessory.tone === 'tone-2'"
            [class.ui-info-card__overlay-leading-accessory--tone-3]="accessory.tone === 'tone-3'"
            [class.ui-info-card__overlay-leading-accessory--tone-4]="accessory.tone === 'tone-4'"
            [class.ui-info-card__overlay-leading-accessory--tone-5]="accessory.tone === 'tone-5'"
            [class.ui-info-card__overlay-leading-accessory--tone-6]="accessory.tone === 'tone-6'"
            [class.ui-info-card__overlay-leading-accessory--tone-7]="accessory.tone === 'tone-7'"
            [class.ui-info-card__overlay-leading-accessory--tone-8]="accessory.tone === 'tone-8'"
            >
            @if (accessory.icon) {
              <mat-icon>{{ accessory.icon }}</mat-icon>
            }
            @if (accessory.label) {
              <span>{{ accessory.label | i18n }}</span>
            }
          </span>
        }
        @if (overlayLabel(action)) {
          <span>{{ overlayLabel(action) | i18n }}</span>
        }
      </span>
    }
    @default {
      @if (overlayImageUrl(action); as overlayActionImageUrl) {
        <img class="ui-info-card__overlay-avatar-image" [src]="overlayActionImageUrl" alt="" />
      } @else {
        @if (overlayIcon(action); as overlayActionIcon) {
          <mat-icon>{{ overlayActionIcon }}</mat-icon>
        }
        @if (overlayLabel(action)) {
          <span>{{ overlayLabel(action) | i18n }}</span>
        }
      }
    }
  }
</ng-template>
`, styles: ['/* src/app/shared/ui/components/core/smart-list/card/info-card/info-card.component.scss */\n:host {\n  display: flex;\n  flex: 1 1 auto;\n  width: 100%;\n  max-width: 100%;\n  min-width: 0;\n  box-sizing: border-box;\n}\n@media (min-width: 761px) {\n  :host {\n    align-self: stretch;\n    height: 100%;\n  }\n  .ui-info-card {\n    min-height: 100%;\n  }\n}\n:host(.form-flow__step-info-card) .ui-info-card {\n  height: 100%;\n  min-height: 100%;\n  touch-action: pan-x pan-y;\n}\n.ui-info-card {\n  --ui-info-card-accent-hue: 210;\n  position: relative;\n  display: grid;\n  grid-auto-rows: max-content;\n  align-content: start;\n  flex: 1 1 auto;\n  gap: 0.32rem;\n  width: 100%;\n  max-width: 100%;\n  box-sizing: border-box;\n  overflow: visible;\n  cursor: default;\n  border: 1px solid var(--deployment-card-border, rgba(58, 81, 114, 0.24));\n  border-radius: 12px;\n  padding: 0.58rem 0.62rem;\n  background: var(--deployment-card-background, linear-gradient(180deg, #ffffff 0%, #f7faff 100%));\n  box-shadow: 0 10px 24px color-mix(in srgb, var(--deployment-brand-shadow, rgba(18, 35, 58, 0.2)) 35%, transparent);\n  transition:\n    box-shadow 0.16s ease,\n    filter 0.16s ease,\n    opacity 0.18s ease;\n  isolation: isolate;\n  touch-action: pan-y;\n}\n.ui-info-card--menu-open {\n  z-index: 24;\n}\n.ui-info-card--clickable {\n  cursor: pointer;\n  -webkit-tap-highlight-color: transparent;\n}\n.ui-info-card--clickable:hover {\n  box-shadow: 0 12px 28px color-mix(in srgb, var(--deployment-brand-shadow, rgba(18, 35, 58, 0.2)) 56%, transparent);\n}\n.ui-info-card--clickable:active {\n  box-shadow: 0 11px 24px color-mix(in srgb, var(--deployment-brand-shadow, rgba(18, 35, 58, 0.2)) 48%, transparent);\n}\n.ui-info-card--clickable::after,\n.asset-occupancy-badge::after,\n.experience-action-btn::after,\n.ui-info-card__menu-action::after {\n  content: "";\n  position: absolute;\n  inset: 0;\n  border-radius: inherit;\n  pointer-events: none;\n  background:\n    radial-gradient(\n      circle at center,\n      rgba(255, 255, 255, 0.34) 0%,\n      rgba(255, 255, 255, 0.18) 24%,\n      rgba(255, 255, 255, 0) 62%);\n  opacity: 0;\n  transform: scale(0.24);\n}\n@keyframes ui-info-card-press-wave {\n  0% {\n    opacity: 0.34;\n    transform: scale(0.24);\n  }\n  100% {\n    opacity: 0;\n    transform: scale(1.08);\n  }\n}\n.ui-info-card--clickable:active::after,\nbutton.asset-occupancy-badge:active::after,\n.experience-action-btn:active::after,\n.ui-info-card__menu-action:active::after {\n  animation: ui-info-card-press-wave 0.42s ease-out;\n}\n.ui-info-card--tone-full {\n  border-color: rgba(201, 83, 83, 0.42);\n  background:\n    linear-gradient(\n      180deg,\n      #fff8f8 0%,\n      #fff1f1 100%);\n}\n.ui-info-card--tone-draft {\n  border-color: rgba(96, 108, 136, 0.34);\n  background:\n    linear-gradient(\n      180deg,\n      #fafbff 0%,\n      #f0f3fb 100%);\n  box-shadow: 0 8px 18px rgba(74, 88, 118, 0.08);\n}\n.ui-info-card--tone-stage {\n  border-color: hsl(var(--ui-info-card-accent-hue), 54%, 58%, 0.52);\n  background:\n    radial-gradient(\n      circle at 10% 4%,\n      hsl(var(--ui-info-card-accent-hue), 90%, 98%, 0.86),\n      transparent 36%),\n    linear-gradient(\n      180deg,\n      hsl(var(--ui-info-card-accent-hue), 82%, 97%) 0%,\n      hsl(var(--ui-info-card-accent-hue), 64%, 92%) 100%);\n  box-shadow: 0 8px 18px hsl(var(--ui-info-card-accent-hue), 42%, 36%, 0.12);\n}\n.ui-info-card--tone-subevent-light {\n  border-color: hsl(var(--ui-info-card-accent-hue), 44%, 66%, 0.38);\n  background:\n    radial-gradient(\n      circle at 10% 4%,\n      hsl(var(--ui-info-card-accent-hue), 92%, 99%, 0.9),\n      transparent 38%),\n    linear-gradient(\n      180deg,\n      hsl(var(--ui-info-card-accent-hue), 78%, 98%) 0%,\n      hsl(var(--ui-info-card-accent-hue), 54%, 94%) 100%);\n  box-shadow: 0 7px 16px hsl(var(--ui-info-card-accent-hue), 34%, 40%, 0.08);\n}\n.ui-info-card--tone-subevent-strong {\n  border-color: hsl(var(--ui-info-card-accent-hue), 56%, 54%, 0.52);\n  background:\n    radial-gradient(\n      circle at 10% 4%,\n      hsl(var(--ui-info-card-accent-hue), 88%, 97%, 0.82),\n      transparent 36%),\n    linear-gradient(\n      180deg,\n      hsl(var(--ui-info-card-accent-hue), 72%, 95%) 0%,\n      hsl(var(--ui-info-card-accent-hue), 54%, 87%) 100%);\n  box-shadow: 0 8px 18px hsl(var(--ui-info-card-accent-hue), 42%, 34%, 0.15);\n}\n.ui-info-card--tone-stage-runtime {\n  border-color: hsl(var(--ui-info-card-accent-hue), 48%, 58%, 0.5);\n  background:\n    linear-gradient(\n      180deg,\n      #fbfcff 0%,\n      #f3f6fb 100%);\n  box-shadow: 0 8px 18px hsl(var(--ui-info-card-accent-hue), 34%, 34%, 0.075);\n}\n.ui-info-card--tone-published {\n  border-color: rgba(50, 132, 90, 0.44);\n  background:\n    linear-gradient(\n      180deg,\n      #eef8f2 0%,\n      #d9ecdf 100%);\n  box-shadow: 0 8px 18px rgba(39, 111, 75, 0.15);\n}\n.ui-info-card--tone-pending {\n  border-color: rgba(202, 145, 52, 0.34);\n  background:\n    linear-gradient(\n      180deg,\n      #fffaf0 0%,\n      #fff2d9 100%);\n  box-shadow: 0 8px 18px rgba(171, 122, 40, 0.12);\n}\n.ui-info-card--tone-waitlist {\n  border-color: rgba(73, 119, 154, 0.36);\n  background:\n    linear-gradient(\n      180deg,\n      #f3fbff 0%,\n      #e7f2f7 100%);\n  box-shadow: 0 8px 18px rgba(50, 98, 135, 0.12);\n}\n.ui-info-card--tone-series {\n  border-color: rgba(42, 126, 134, 0.34);\n  background:\n    linear-gradient(\n      180deg,\n      #f2fbfb 0%,\n      #e4f4f5 100%);\n  box-shadow: 0 8px 18px rgba(31, 111, 118, 0.12);\n}\n.ui-info-card--tone-system {\n  border-color: rgba(94, 62, 205, 0.66);\n  background:\n    radial-gradient(\n      circle at 12% 2%,\n      rgba(64, 223, 255, 0.42),\n      transparent 40%),\n    radial-gradient(\n      circle at 94% 96%,\n      rgba(255, 83, 177, 0.3),\n      transparent 42%),\n    linear-gradient(\n      145deg,\n      #dddfff 0%,\n      #cddcff 45%,\n      #ecd6f4 100%);\n  box-shadow: 0 10px 24px rgba(62, 43, 153, 0.25), 0 0 0 1px rgba(85, 193, 255, 0.16) inset;\n}\n.ui-info-card--tone-review {\n  border-color: rgba(126, 82, 35, 0.5);\n  background:\n    linear-gradient(\n      180deg,\n      #f6ead8 0%,\n      #ecd5b5 100%);\n  box-shadow: 0 8px 18px rgba(105, 68, 29, 0.16);\n}\n.ui-info-card--tone-blocked {\n  border-color: rgba(180, 52, 64, 0.28);\n  background:\n    linear-gradient(\n      180deg,\n      #fff2f2 0%,\n      #f8dede 100%);\n  box-shadow: 0 8px 18px rgba(150, 48, 61, 0.12);\n}\n.ui-info-card--tone-deleted {\n  border-color: rgba(97, 105, 118, 0.34);\n  background:\n    linear-gradient(\n      180deg,\n      #f7f8fa 0%,\n      #e9edf2 100%);\n  box-shadow: 0 8px 18px rgba(60, 70, 88, 0.1);\n}\n.ui-info-card--tone-inactive {\n  border-color: rgba(102, 112, 128, 0.28);\n  background:\n    linear-gradient(\n      180deg,\n      #f2f3f5 0%,\n      #e8ebef 100%);\n  box-shadow: 0 8px 18px rgba(60, 70, 88, 0.1);\n}\n.ui-info-card--tone-deleted,\n.ui-info-card--tone-inactive,\n.ui-info-card--tone-review,\n.ui-info-card--tone-blocked {\n  gap: 0.24rem;\n  padding: 0.48rem 0.54rem;\n}\n.ui-info-card--tone-deleted .ui-info-card__media,\n.ui-info-card--tone-inactive .ui-info-card__media,\n.ui-info-card--tone-review .ui-info-card__media,\n.ui-info-card--tone-blocked .ui-info-card__media {\n  height: 112px;\n}\n.ui-info-card--state-leaving {\n  opacity: 0;\n  transform: translateY(10px) scale(0.97);\n  filter: saturate(0.76);\n  pointer-events: none;\n}\n.ui-info-card__media {\n  position: relative;\n  width: 100%;\n  height: 130px;\n  border-radius: 10px;\n  border: 1px solid rgba(36, 64, 98, 0.2);\n  background-size: cover;\n  background-position: center;\n  background-repeat: no-repeat;\n  background-color: #dfe8f7;\n  overflow: visible;\n  transition: opacity 100ms ease-in;\n}\n.ui-info-card__media--placeholder {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.ui-info-card__media--title {\n  display: flex;\n  align-items: stretch;\n  justify-content: stretch;\n  height: 96px;\n  background:\n    radial-gradient(\n      circle at 12% 10%,\n      rgba(255, 255, 255, 0.72),\n      transparent 34%),\n    linear-gradient(\n      135deg,\n      rgba(235, 243, 255, 0.98) 0%,\n      rgba(246, 250, 255, 0.96) 48%,\n      rgba(237, 246, 242, 0.98) 100%);\n}\n.ui-info-card__media--title.ui-info-card__media--tone-neutral {\n  height: 116px;\n  background:\n    radial-gradient(\n      circle at 14% 16%,\n      rgba(255, 255, 255, 0.78),\n      transparent 32%),\n    linear-gradient(\n      135deg,\n      #f4f6fb 0%,\n      #e3e8f2 58%,\n      #eef2f8 100%);\n}\n.ui-info-card--tone-stage .ui-info-card__media--title.ui-info-card__media--tone-neutral,\n.ui-info-card--tone-stage-runtime .ui-info-card__media--title.ui-info-card__media--tone-neutral {\n  border-color: hsl(var(--ui-info-card-accent-hue), 48%, 58%, 0.36);\n  background:\n    radial-gradient(\n      circle at 14% 16%,\n      rgba(255, 255, 255, 0.78),\n      transparent 32%),\n    linear-gradient(\n      135deg,\n      color-mix(in srgb, hsl(var(--ui-info-card-accent-hue), 76%, 54%) 14%, #ffffff 86%) 0%,\n      color-mix(in srgb, hsl(var(--ui-info-card-accent-hue), 76%, 54%) 10%, #f5f9ff 90%) 100%);\n}\n.ui-info-card--tone-subevent-light .ui-info-card__media--title.ui-info-card__media--tone-neutral,\n.ui-info-card--tone-subevent-strong .ui-info-card__media--title.ui-info-card__media--tone-neutral {\n  border-color: hsl(var(--ui-info-card-accent-hue), 48%, 58%, 0.34);\n  background:\n    radial-gradient(\n      circle at 14% 16%,\n      rgba(255, 255, 255, 0.78),\n      transparent 32%),\n    linear-gradient(\n      135deg,\n      color-mix(in srgb, hsl(var(--ui-info-card-accent-hue), 76%, 54%) 16%, #ffffff 84%) 0%,\n      color-mix(in srgb, hsl(var(--ui-info-card-accent-hue), 76%, 54%) 12%, #f5f9ff 88%) 100%);\n}\n.ui-info-card--tone-subevent-strong .ui-info-card__media--title.ui-info-card__media--tone-neutral {\n  border-color: hsl(var(--ui-info-card-accent-hue), 54%, 52%, 0.5);\n  background:\n    radial-gradient(\n      circle at 14% 16%,\n      rgba(255, 255, 255, 0.66),\n      transparent 32%),\n    linear-gradient(\n      135deg,\n      color-mix(in srgb, hsl(var(--ui-info-card-accent-hue), 76%, 50%) 24%, #ffffff 76%) 0%,\n      color-mix(in srgb, hsl(var(--ui-info-card-accent-hue), 72%, 48%) 20%, #f5f9ff 80%) 100%);\n}\n.ui-info-card__media-title-content {\n  position: relative;\n  z-index: 1;\n  min-width: 0;\n  width: 100%;\n  display: grid;\n  align-content: center;\n  justify-items: start;\n  gap: 0.12rem;\n  padding: 0.62rem 0.68rem;\n  color: #203a5e;\n}\n.ui-info-card__media-title-content .mat-icon {\n  width: 18px;\n  height: 18px;\n  font-size: 18px;\n  line-height: 18px;\n  color: #356ba5;\n}\n.ui-info-card__media-title-content strong,\n.ui-info-card__media-title-content small {\n  min-width: 0;\n  max-width: 100%;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.ui-info-card__media-title-content strong {\n  font-size: 0.92rem;\n  font-weight: 900;\n  line-height: 1.12;\n}\n.ui-info-card__media-title-content small {\n  font-size: 0.7rem;\n  font-weight: 800;\n  color: rgba(30, 57, 90, 0.68);\n}\n.ui-info-card__media--tone-neutral .ui-info-card__media-title-content {\n  align-content: center;\n  justify-items: center;\n  text-align: center;\n  color: #263a58;\n}\n.ui-info-card__media--tone-neutral .ui-info-card__media-title-content .mat-icon {\n  color: #5d6d86;\n}\n.ui-info-card__media--tone-neutral .ui-info-card__media-title-content strong {\n  font-size: 1.02rem;\n}\n.ui-info-card__image-loader {\n  position: absolute;\n  inset: 0;\n  z-index: 1;\n  display: grid;\n  place-items: center;\n  pointer-events: none;\n  opacity: 0;\n  transition: opacity 120ms ease;\n}\n.ui-info-card__image-loader app-indicator {\n  position: relative;\n  z-index: 1;\n}\n.ui-info-card__media.lazy-bg-loading .ui-info-card__image-loader {\n  opacity: 1;\n}\n.ui-info-card__media.lazy-bg-loaded .ui-info-card__image-loader,\n.ui-info-card__media.lazy-bg-error .ui-info-card__image-loader {\n  opacity: 0;\n}\n.ui-info-card__placeholder-icon {\n  font-size: 48px;\n  width: 48px;\n  height: 48px;\n  color: rgba(36, 64, 98, 0.35);\n}\n.ui-info-card__head {\n  display: grid;\n  grid-template-columns: auto minmax(0, 1fr);\n  gap: 0.46rem;\n  align-items: flex-start;\n}\n.ui-info-card__head--with-actions {\n  grid-template-columns: auto minmax(0, 1fr) auto;\n}\n.ui-info-card__head--without-leading {\n  grid-template-columns: minmax(0, 1fr);\n}\n.ui-info-card__head--without-leading.ui-info-card__head--with-actions {\n  grid-template-columns: minmax(0, 1fr) auto;\n}\n.ui-info-card__leading {\n  width: 28px;\n  height: 28px;\n  margin-top: 1px;\n  border-radius: 50%;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  background: rgba(255, 255, 255, 0.76);\n  border: 1px solid rgba(58, 81, 114, 0.18);\n}\n.ui-info-card__leading .mat-icon {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n  line-height: 16px;\n}\n.ui-info-card__leading--public {\n  background:\n    linear-gradient(\n      180deg,\n      #eef7ff 0%,\n      #e5f2ff 100%);\n  border-color: rgba(46, 111, 178, 0.34);\n}\n.ui-info-card__leading--stage {\n  background:\n    linear-gradient(\n      180deg,\n      hsl(var(--ui-info-card-accent-hue), 92%, 94%) 0%,\n      hsl(var(--ui-info-card-accent-hue), 84%, 88%) 100%);\n  border-color: hsl(var(--ui-info-card-accent-hue), 54%, 58%, 0.42);\n  box-shadow: 0 5px 12px hsl(var(--ui-info-card-accent-hue), 42%, 34%, 0.16);\n}\n.ui-info-card__leading--friends {\n  background:\n    linear-gradient(\n      180deg,\n      #f1f8ef 0%,\n      #e9f3e6 100%);\n  border-color: rgba(54, 129, 72, 0.34);\n}\n.ui-info-card__leading--invitation {\n  background:\n    linear-gradient(\n      180deg,\n      #fff5ea 0%,\n      #ffe9d9 100%);\n  border-color: rgba(185, 113, 45, 0.36);\n}\n.ui-info-card__leading--pending {\n  background:\n    linear-gradient(\n      180deg,\n      #fff8e6 0%,\n      #ffefc8 100%);\n  border-color: rgba(207, 148, 34, 0.34);\n}\n.ui-info-card__leading--public .mat-icon {\n  color: #2f6cae;\n}\n.ui-info-card__leading--stage .mat-icon {\n  color: hsl(var(--ui-info-card-accent-hue), 66%, 42%);\n}\n.ui-info-card__leading--friends .mat-icon {\n  color: #368148;\n}\n.ui-info-card__leading--invitation .mat-icon {\n  color: #b9712d;\n}\n.ui-info-card__leading--pending .mat-icon {\n  color: #b77b19;\n}\n.ui-info-card__meta {\n  min-width: 0;\n  display: grid;\n  gap: 0.03rem;\n}\n.ui-info-card__title,\n.ui-info-card__meta-row,\n.ui-info-card__description,\n.ui-info-card__detail-row {\n  margin: 0;\n}\n.ui-info-card__title {\n  color: #223d62;\n  font-size: 0.84rem;\n  font-weight: 800;\n}\n.ui-info-card__meta-row {\n  color: rgba(23, 41, 66, 0.72);\n  font-size: 0.74rem;\n  font-weight: 700;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.ui-info-card__description {\n  font-size: 0.76rem;\n  line-height: 1.4;\n  color: rgba(20, 37, 61, 0.84);\n  display: -webkit-box;\n  min-height: calc(var(--ui-info-card-description-lines, 2) * 1.4em);\n  max-height: var(--ui-info-card-description-max-height, 2.8em);\n  overflow: hidden;\n  -webkit-line-clamp: var(--ui-info-card-description-lines, 2);\n  line-clamp: var(--ui-info-card-description-lines, 2);\n  -webkit-box-orient: vertical;\n}\n.ui-info-card__detail-row {\n  font-size: 0.74rem;\n  font-weight: 700;\n  color: rgba(23, 41, 66, 0.68);\n}\n.ui-info-card__detail-row--mono {\n  margin-top: -0.12rem;\n  font-size: 0.73rem;\n  color: rgba(23, 39, 61, 0.7);\n  font-family:\n    "IBM Plex Mono",\n    "SFMono-Regular",\n    ui-monospace,\n    monospace;\n}\n.ui-info-card--tone-draft .ui-info-card__title,\n.ui-info-card--tone-draft .ui-info-card__meta-row {\n  color: #52617d;\n}\n.ui-info-card--tone-published .ui-info-card__title {\n  color: #245d42;\n}\n.ui-info-card--tone-published .ui-info-card__meta-row {\n  color: rgba(32, 82, 59, 0.76);\n}\n.ui-info-card__overlay-action {\n  position: absolute;\n  z-index: 2;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  box-sizing: border-box;\n  gap: 0.24rem;\n  text-decoration: none;\n  border: 1px solid rgba(17, 33, 56, 0.2);\n  padding: 0;\n  background: rgba(244, 248, 255, 0.9);\n  color: #2d5ea8;\n  box-shadow: 0 6px 14px rgba(8, 18, 34, 0.24);\n  transition:\n    transform 0.14s ease,\n    box-shadow 0.14s ease,\n    filter 0.14s ease,\n    border-color 0.2s ease;\n}\nbutton.ui-info-card__overlay-action {\n  appearance: none;\n  -webkit-appearance: none;\n  cursor: pointer;\n}\n.ui-info-card__overlay-action--start {\n  top: 0.44rem;\n  left: 0.44rem;\n}\n.ui-info-card__overlay-action--end {\n  top: 0.44rem;\n  right: 0.2rem;\n}\n.ui-info-card__overlay-action--bottom-end {\n  right: 0.38rem;\n  bottom: 0.38rem;\n}\n.ui-info-card__overlay-action--avatar {\n  width: 26px;\n  min-width: 26px;\n  height: 26px;\n  border-radius: 50%;\n  font-size: 0.58rem;\n  font-weight: 800;\n  line-height: 1;\n  color: #ffffff;\n  text-transform: uppercase;\n  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.22);\n}\n.ui-info-card__overlay-action--avatar > span {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  min-height: 100%;\n  transform: translateY(-0.02em);\n}\n.ui-info-card__overlay-avatar-image {\n  width: 100%;\n  height: 100%;\n  border-radius: inherit;\n  object-fit: cover;\n  display: block;\n}\n.ui-info-card--owned-asset .ui-info-card__overlay-action--avatar.asset-occupancy-badge {\n  width: auto;\n  min-width: 34px;\n  height: 28px;\n  padding: 0 0.48rem;\n  border-radius: 999px;\n  font-size: 0.76rem;\n  letter-spacing: 0.01em;\n}\n.ui-info-card--owned-asset .ui-info-card__overlay-action--end.ui-info-card__overlay-action--avatar.ui-info-card__overlay-action--tone-default.asset-occupancy-badge {\n  border: 2px solid rgba(255, 255, 255, 0.9);\n  background:\n    linear-gradient(\n      180deg,\n      #334f72 0%,\n      #264061 100%);\n  color: #fff;\n  box-shadow: 0 7px 16px rgba(9, 22, 40, 0.34), inset 0 0 0 1px rgba(18, 38, 64, 0.58);\n}\n.ui-info-card--owned-asset .ui-info-card__overlay-action--start.ui-info-card__overlay-action--avatar.ui-info-card__overlay-action--tone-default {\n  background:\n    linear-gradient(\n      180deg,\n      #ffe8cc 0%,\n      #ffd7af 100%);\n  border-color: rgba(179, 108, 42, 0.54);\n  color: #8c4f18;\n}\n.ui-info-card__overlay-action--badge {\n  min-width: 0;\n  height: 25px;\n  border-radius: 999px;\n  padding: 0 0.32rem;\n  background: rgba(26, 45, 71, 0.82);\n  color: #fff;\n  font-size: 0.7rem;\n  letter-spacing: 0.01em;\n  font-weight: 800;\n  box-shadow: 0 5px 10px rgba(8, 18, 34, 0.24);\n  overflow: visible;\n}\n.ui-info-card__overlay-action--badge.ui-info-card__overlay-action--shape-circle {\n  width: 28px;\n  min-width: 28px;\n  height: 28px;\n  padding: 0;\n  border-radius: 50%;\n  aspect-ratio: 1;\n}\n.ui-info-card__overlay-action--ring-active {\n  overflow: visible;\n  box-shadow: 0 0 0 2px rgba(235, 147, 33, 0.18), 0 8px 18px rgba(132, 82, 8, 0.22);\n}\n.ui-info-card__overlay-action-ring {\n  position: absolute;\n  inset: -3px;\n  z-index: 20;\n  border-radius: 999px;\n  pointer-events: none;\n}\n.ui-info-card__overlay-action--badge > span:not(.ui-info-card__pending-badge):not(.ui-info-card__overlay-action-ring),\n.ui-info-card__overlay-action--badge > .mat-icon {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  position: relative;\n  z-index: 6;\n}\n.ui-info-card__overlay-action--toggle {\n  min-width: 32px;\n  width: 32px;\n  height: 32px;\n  border-radius: 999px;\n  background:\n    linear-gradient(\n      180deg,\n      #eef7ff 0%,\n      #dcecff 100%);\n  color: #2c5d9e;\n}\n.ui-info-card__overlay-action--layout-avatar-metric {\n  appearance: none;\n  width: auto;\n  min-width: 54px;\n  height: 30px;\n  padding: 0 0.36rem 0 0.08rem;\n  border-radius: 999px;\n  align-items: center;\n  justify-content: center;\n  gap: 0.16rem;\n  border-color: rgba(255, 255, 255, 0.92);\n  box-shadow: 0 7px 16px rgba(11, 25, 44, 0.3);\n}\n.ui-info-card__overlay-action--layout-avatar-metric.ui-info-card__overlay-action--start {\n  left: 0.34rem;\n  top: 0.34rem;\n}\n.ui-info-card__overlay-action--layout-badge-with-leading-accessory {\n  height: 28px;\n  padding: 0 0.58rem;\n  border: 2px solid rgba(255, 255, 255, 0.9);\n  border-radius: 999px;\n  background:\n    linear-gradient(\n      180deg,\n      #334f72 0%,\n      #264061 100%);\n  color: #fff;\n  font-weight: 800;\n  box-shadow: 0 7px 16px rgba(9, 22, 40, 0.34), inset 0 0 0 1px rgba(18, 38, 64, 0.58);\n}\n.ui-info-card__overlay-action--layout-badge-with-leading-accessory.ui-info-card__overlay-action--end {\n  top: 0.38rem;\n  right: 0.38rem;\n}\n.ui-info-card__overlay-action--layout-badge-with-leading-accessory.ui-info-card__overlay-action--tone-full {\n  background:\n    linear-gradient(\n      180deg,\n      #b84f4f 0%,\n      #963636 100%);\n  box-shadow: 0 7px 16px rgba(72, 24, 24, 0.36), inset 0 0 0 1px rgba(111, 38, 38, 0.6);\n}\n.ui-info-card__overlay-action--layout-badge-with-leading-accessory.ui-info-card__overlay-action--tone-inactive {\n  background:\n    linear-gradient(\n      180deg,\n      #dfe4ec 0%,\n      #cfd7e4 100%);\n  color: #4f5f78;\n  border-color: rgba(255, 255, 255, 0.92);\n  box-shadow: 0 6px 12px rgba(21, 38, 64, 0.16), inset 0 0 0 1px rgba(78, 99, 130, 0.2);\n}\n.ui-info-card__overlay-action--tone-cool.ui-info-card__overlay-action--layout-avatar-metric {\n  background:\n    linear-gradient(\n      180deg,\n      #dff1ff 0%,\n      #cce8ff 100%);\n  color: #27547a;\n}\n.ui-info-card__overlay-action--tone-cool-mid.ui-info-card__overlay-action--layout-avatar-metric {\n  background:\n    linear-gradient(\n      180deg,\n      #d7ebff 0%,\n      #c9e4ff 100%);\n  color: #2a557a;\n}\n.ui-info-card__overlay-action--tone-neutral.ui-info-card__overlay-action--layout-avatar-metric {\n  background:\n    linear-gradient(\n      180deg,\n      #ffe9d7 0%,\n      #ffdcbf 100%);\n  color: #87502f;\n}\n.ui-info-card__overlay-action--tone-warm-mid.ui-info-card__overlay-action--layout-avatar-metric {\n  background:\n    linear-gradient(\n      180deg,\n      #ffe2cf 0%,\n      #ffd2b5 100%);\n  color: #8f4b29;\n}\n.ui-info-card__overlay-action--tone-warm.ui-info-card__overlay-action--layout-avatar-metric {\n  background:\n    linear-gradient(\n      180deg,\n      #ffd8d8 0%,\n      #ffc2c2 100%);\n  color: #8f3a3a;\n}\n.ui-info-card__overlay-leading-accessory {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  line-height: 1;\n}\n.ui-info-card__overlay-leading-accessory--avatar-metric {\n  width: 24px;\n  min-width: 24px;\n  height: 24px;\n  border-radius: 50%;\n  font-size: 0.63rem;\n  font-weight: 800;\n  color: #fff;\n  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.32);\n  text-transform: uppercase;\n}\n.ui-info-card__overlay-leading-accessory--badge {\n  width: 16px;\n  height: 16px;\n  min-width: 16px;\n  position: absolute;\n  left: -0.4rem;\n  top: 50%;\n  transform: translateY(-50%);\n  border-radius: 50%;\n}\n.ui-info-card__overlay-leading-accessory--tone-default {\n  background:\n    linear-gradient(\n      145deg,\n      #3572a4,\n      #194364);\n  color: #fff;\n}\n.ui-info-card__overlay-leading-accessory--tone-positive {\n  background:\n    linear-gradient(\n      180deg,\n      #edf8ee 0%,\n      #e2f1e4 100%);\n  box-shadow: inset 0 0 0 1px rgba(44, 126, 72, 0.32);\n  color: #2d7d47;\n}\n.ui-info-card__overlay-leading-accessory--tone-negative {\n  background:\n    linear-gradient(\n      180deg,\n      #fff0f2 0%,\n      #fde5e9 100%);\n  box-shadow: inset 0 0 0 1px rgba(184, 76, 98, 0.36);\n  color: #b84c62;\n}\n.ui-info-card__overlay-leading-accessory--tone-woman {\n  background:\n    linear-gradient(\n      145deg,\n      #d3754c,\n      #ac4a24);\n  color: #fff;\n}\n.ui-info-card__overlay-leading-accessory--tone-man {\n  background:\n    linear-gradient(\n      145deg,\n      #3572a4,\n      #194364);\n  color: #fff;\n}\n.ui-info-card__overlay-leading-accessory--tone-1 {\n  background:\n    linear-gradient(\n      145deg,\n      #3572a4,\n      #194364);\n  color: #fff;\n}\n.ui-info-card__overlay-leading-accessory--tone-2 {\n  background:\n    linear-gradient(\n      145deg,\n      #c56841,\n      #8f381d);\n  color: #fff;\n}\n.ui-info-card__overlay-leading-accessory--tone-3 {\n  background:\n    linear-gradient(\n      145deg,\n      #3c9d78,\n      #1f6450);\n  color: #fff;\n}\n.ui-info-card__overlay-leading-accessory--tone-4 {\n  background:\n    linear-gradient(\n      145deg,\n      #7b63c7,\n      #4d3a8f);\n  color: #fff;\n}\n.ui-info-card__overlay-leading-accessory--tone-5 {\n  background:\n    linear-gradient(\n      145deg,\n      #bf5f8f,\n      #883b65);\n  color: #fff;\n}\n.ui-info-card__overlay-leading-accessory--tone-6 {\n  background:\n    linear-gradient(\n      145deg,\n      #4895ad,\n      #285c79);\n  color: #fff;\n}\n.ui-info-card__overlay-leading-accessory--tone-7 {\n  background:\n    linear-gradient(\n      145deg,\n      #b47c3b,\n      #7e5325);\n  color: #fff;\n}\n.ui-info-card__overlay-leading-accessory--tone-8 {\n  background:\n    linear-gradient(\n      145deg,\n      #5673bf,\n      #324a8a);\n  color: #fff;\n}\n.ui-info-card__overlay-detail {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.1rem;\n  font-size: 0.62rem;\n  font-weight: 800;\n  line-height: 1;\n  color: currentColor;\n}\n.ui-info-card__overlay-detail .mat-icon {\n  width: 11px;\n  height: 11px;\n  font-size: 11px;\n  line-height: 11px;\n  color: color-mix(in srgb, currentColor 88%, #111 12%);\n  transform: translateY(-0.5px);\n}\n.ui-info-card__overlay-badge-body {\n  position: relative;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  min-height: 16px;\n  padding-left: 0.9rem;\n}\n.ui-info-card__overlay-action--toggle .mat-icon,\n.ui-info-card__overlay-action--badge .mat-icon,\n.ui-info-card__overlay-action--avatar .mat-icon {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n}\n.ui-info-card__overlay-action--tone-default.ui-info-card__overlay-action--avatar {\n  background:\n    linear-gradient(\n      145deg,\n      #3572a4,\n      #194364);\n}\n.ui-info-card__overlay-action--tone-full.ui-info-card__overlay-action--badge {\n  background:\n    linear-gradient(\n      180deg,\n      #b84f4f 0%,\n      #963636 100%);\n  border-color: rgba(126, 41, 41, 0.56);\n  box-shadow: 0 5px 10px rgba(72, 24, 24, 0.34), inset 0 0 0 1px rgba(111, 38, 38, 0.6);\n}\n.ui-info-card__overlay-action--tone-stage.ui-info-card__overlay-action--badge {\n  border-color: rgba(255, 255, 255, 0.9);\n  background:\n    linear-gradient(\n      180deg,\n      hsl(var(--ui-info-card-accent-hue), 76%, 54%) 0%,\n      hsl(var(--ui-info-card-accent-hue), 72%, 42%) 100%);\n  color: #ffffff;\n  text-shadow: 0 1px 1px hsl(var(--ui-info-card-accent-hue), 70%, 22%, 0.3);\n  box-shadow: 0 7px 16px hsl(var(--ui-info-card-accent-hue), 52%, 34%, 0.34), inset 0 0 0 1px hsl(var(--ui-info-card-accent-hue), 70%, 34%, 0.54);\n}\n.ui-info-card__overlay-action--tone-stage-active.ui-info-card__overlay-action--badge,\n.ui-info-card__overlay-action--tone-stage-scheduled.ui-info-card__overlay-action--badge,\n.ui-info-card__overlay-action--tone-stage-blocked.ui-info-card__overlay-action--badge,\n.ui-info-card__overlay-action--tone-stage-start.ui-info-card__overlay-action--badge,\n.ui-info-card__overlay-action--tone-stage-review.ui-info-card__overlay-action--badge,\n.ui-info-card__overlay-action--tone-stage-finalized.ui-info-card__overlay-action--badge,\n.ui-info-card__overlay-action--tone-stage-suspended.ui-info-card__overlay-action--badge {\n  padding: 0.2rem 0.48rem;\n  font-size: 0.64rem;\n  font-weight: 900;\n  text-shadow: none;\n  box-shadow: 0 7px 16px rgba(54, 68, 90, 0.16);\n}\n.ui-info-card__overlay-action--tone-stage-active.ui-info-card__overlay-action--badge {\n  border-color: rgba(36, 150, 82, 0.34);\n  background:\n    linear-gradient(\n      180deg,\n      #e6f9ed 0%,\n      #cff0dc 100%);\n  color: #17663f;\n}\n.ui-info-card__overlay-action--tone-stage-scheduled.ui-info-card__overlay-action--badge {\n  border-color: rgba(53, 107, 178, 0.34);\n  background:\n    linear-gradient(\n      180deg,\n      #edf6ff 0%,\n      #d8eaff 100%);\n  color: #24548f;\n}\n.ui-info-card__overlay-action--tone-stage-blocked.ui-info-card__overlay-action--badge {\n  border-color: rgba(191, 57, 67, 0.38);\n  background:\n    linear-gradient(\n      180deg,\n      #fff0f1 0%,\n      #ffdfe3 100%);\n  color: #9d303b;\n}\n.ui-info-card__overlay-action--tone-stage-start.ui-info-card__overlay-action--badge {\n  border-color: rgba(53, 107, 178, 0.34);\n  background: rgba(232, 242, 255, 0.94);\n  color: #244f8e;\n}\n.ui-info-card__overlay-action--tone-stage-review.ui-info-card__overlay-action--badge {\n  border-color: rgba(192, 125, 28, 0.34);\n  background: rgba(255, 247, 226, 0.94);\n  color: #8a5a12;\n}\n.ui-info-card__overlay-action--bottom-end.ui-info-card__overlay-action--badge {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.18rem;\n  height: 26px;\n  padding: 0 0.48rem;\n  border: 1px solid rgba(192, 125, 28, 0.34);\n  background: rgba(255, 247, 226, 0.94);\n  color: #8a5a12;\n  box-shadow: 0 7px 16px rgba(132, 82, 8, 0.16);\n}\n.ui-info-card__overlay-action--tone-stage-finalized.ui-info-card__overlay-action--badge {\n  border-color: rgba(34, 132, 82, 0.34);\n  background: rgba(231, 250, 239, 0.94);\n  color: #17663f;\n}\n.ui-info-card__overlay-action--tone-stage-suspended.ui-info-card__overlay-action--badge {\n  border-color: rgba(150, 82, 82, 0.34);\n  background: rgba(255, 238, 238, 0.94);\n  color: #8a3434;\n}\n.ui-info-card__overlay-action--tone-public.ui-info-card__overlay-action--badge {\n  border-color: rgba(46, 111, 178, 0.4);\n  background:\n    linear-gradient(\n      180deg,\n      #eef7ff 0%,\n      #dcecff 100%);\n  color: #2f6cae;\n  box-shadow: 0 7px 16px rgba(35, 89, 149, 0.18);\n}\n.ui-info-card__overlay-action--tone-inactive {\n  background: rgba(84, 102, 128, 0.74);\n  color: rgba(248, 250, 255, 0.9);\n  border-color: rgba(44, 60, 84, 0.28);\n}\n.ui-info-card__overlay-action--tone-review {\n  background:\n    linear-gradient(\n      180deg,\n      #9d681c 0%,\n      #765018 100%);\n  color: #fff;\n  border-color: rgba(255, 255, 255, 0.82);\n}\n.ui-info-card__overlay-action--tone-blocked {\n  background:\n    linear-gradient(\n      180deg,\n      #b84558 0%,\n      #8f3143 100%);\n  color: #fff;\n  border-color: rgba(255, 255, 255, 0.82);\n}\n.ui-info-card__overlay-action--layout-badge-with-leading-accessory.ui-info-card__overlay-action--tone-blocked {\n  border-color: rgba(255, 255, 255, 0.96);\n  background:\n    linear-gradient(\n      180deg,\n      #e45f66 0%,\n      #bd2635 100%);\n  color: #fff;\n  text-shadow: 0 1px 1px rgba(80, 0, 8, 0.28);\n  box-shadow: 0 8px 18px rgba(128, 23, 34, 0.36), inset 0 0 0 1px rgba(137, 17, 29, 0.5);\n}\n.ui-info-card__overlay-action--layout-badge-with-leading-accessory.ui-info-card__overlay-action--tone-blocked .ui-info-card__overlay-leading-accessory--tone-negative {\n  background: rgba(255, 255, 255, 0.22);\n  color: #fff;\n}\n.ui-info-card__overlay-action--tone-deleted {\n  background:\n    linear-gradient(\n      180deg,\n      #59677d 0%,\n      #435066 100%);\n  color: #fff;\n  border-color: rgba(255, 255, 255, 0.82);\n}\n.ui-info-card__overlay-action--tone-selected.ui-info-card__overlay-action--toggle {\n  background:\n    linear-gradient(\n      180deg,\n      #e9f7ee 0%,\n      #d6f0de 100%);\n  color: #2c7c52;\n}\n.ui-info-card__overlay-action--tone-selected.ui-info-card__overlay-action--badge {\n  border-color: rgba(214, 147, 28, 0.58);\n  background:\n    linear-gradient(\n      180deg,\n      #fff8d8 0%,\n      #ffd76a 100%);\n  color: #9b5f00;\n  box-shadow: 0 7px 16px rgba(132, 82, 8, 0.24);\n}\n.ui-info-card__overlay-action--tone-woman.ui-info-card__overlay-action--avatar {\n  background:\n    linear-gradient(\n      145deg,\n      #d3754c,\n      #ac4a24);\n}\n.ui-info-card__overlay-action--tone-man.ui-info-card__overlay-action--avatar {\n  background:\n    linear-gradient(\n      145deg,\n      #3572a4,\n      #194364);\n}\n.ui-info-card__overlay-action--tone-1.ui-info-card__overlay-action--avatar {\n  background:\n    linear-gradient(\n      145deg,\n      #3572a4,\n      #194364);\n}\n.ui-info-card__overlay-action--tone-2.ui-info-card__overlay-action--avatar {\n  background:\n    linear-gradient(\n      145deg,\n      #c56841,\n      #8f381d);\n}\n.ui-info-card__overlay-action--tone-3.ui-info-card__overlay-action--avatar {\n  background:\n    linear-gradient(\n      145deg,\n      #3c9d78,\n      #1f6450);\n}\n.ui-info-card__overlay-action--tone-4.ui-info-card__overlay-action--avatar {\n  background:\n    linear-gradient(\n      145deg,\n      #7b63c7,\n      #4d3a8f);\n}\n.ui-info-card__overlay-action--tone-5.ui-info-card__overlay-action--avatar {\n  background:\n    linear-gradient(\n      145deg,\n      #bf5f8f,\n      #883b65);\n}\n.ui-info-card__overlay-action--tone-6.ui-info-card__overlay-action--avatar {\n  background:\n    linear-gradient(\n      145deg,\n      #4895ad,\n      #285c79);\n}\n.ui-info-card__overlay-action--tone-7.ui-info-card__overlay-action--avatar {\n  background:\n    linear-gradient(\n      145deg,\n      #b47c3b,\n      #7e5325);\n}\n.ui-info-card__overlay-action--tone-8.ui-info-card__overlay-action--avatar {\n  background:\n    linear-gradient(\n      145deg,\n      #5673bf,\n      #324a8a);\n}\n.ui-info-card__pending-badge {\n  position: absolute;\n  top: -15px;\n  right: -10px;\n  min-width: 18px;\n  height: 18px;\n  padding: 0;\n  border-radius: 999px;\n  border: 1px solid #fff;\n  background: #d84d4d;\n  color: #fff;\n  font-size: 10px;\n  font-weight: 700;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n}\n.ui-info-card__actions {\n  position: relative;\n  display: inline-flex;\n  align-items: center;\n}\n.ui-info-card__actions .app-menu-host--trigger-icon .app-menu__trigger--layout-icon {\n  width: 28px;\n  height: 28px;\n  min-width: 28px;\n  min-height: 28px;\n}\n.ui-info-card__actions .app-menu-host--trigger-icon .app-menu__trigger--layout-icon .mat-icon {\n  width: 15px;\n  height: 15px;\n  font-size: 15px;\n  line-height: 15px;\n}\n.ui-info-card__menu-trigger {\n  position: relative;\n  z-index: 31;\n  display: inline-grid;\n  place-items: center;\n  width: 28px;\n  min-width: 28px;\n  max-width: 28px;\n  height: 28px;\n  min-height: 28px;\n  max-height: 28px;\n  box-sizing: border-box;\n  flex: 0 0 28px;\n  padding: 0;\n  border: 1px solid rgba(42, 67, 101, 0.26);\n  border-radius: 50%;\n  background: rgba(255, 255, 255, 0.88);\n  color: #2d5ea8;\n  cursor: pointer;\n  overflow: visible;\n  transition:\n    transform 0.16s ease,\n    background-color 0.16s ease,\n    border-color 0.16s ease,\n    color 0.16s ease;\n}\n.ui-info-card__menu-trigger .mat-icon {\n  grid-area: 1/1;\n  justify-self: center;\n  margin: 0;\n  width: 15px;\n  height: 15px;\n  font-size: 15px;\n  line-height: 15px;\n  transform-origin: center;\n  transition: transform 0.16s ease, opacity 0.16s ease;\n}\n.ui-info-card__menu-trigger.is-open {\n  background: rgba(255, 255, 255, 0.94);\n  border-color: rgba(42, 67, 101, 0.32);\n  color: #2d5ea8;\n}\n.ui-info-card__menu-trigger.is-open .mat-icon {\n  transform: rotate(90deg);\n}\n.ui-info-card__menu-trigger:hover {\n  transform: none;\n}\n.ui-info-card__menu-counter {\n  top: -7px;\n  right: -7px;\n  z-index: 40;\n  pointer-events: none;\n}\n.ui-info-card__menu-backdrop {\n  position: fixed;\n  inset: 0;\n  z-index: 29;\n  border: 0;\n  margin: 0;\n  padding: 0;\n  background: transparent;\n}\n.ui-info-card__menu {\n  position: absolute;\n  right: 0;\n  top: calc(100% + 6px);\n  z-index: 30;\n  min-width: 220px;\n  max-width: min(300px, 70vw);\n  border: 1px solid rgba(42, 67, 101, 0.24);\n  border-radius: 12px;\n  background: #fff;\n  box-shadow: 0 16px 34px rgba(14, 30, 52, 0.22);\n  padding: 0.36rem;\n  display: grid;\n  gap: 0.18rem;\n}\n.ui-info-card__menu--open-up {\n  top: auto;\n  bottom: calc(100% + 6px);\n}\n.asset-occupancy-badge.asset-occupancy-badge-full {\n  background:\n    linear-gradient(\n      180deg,\n      #b84f4f 0%,\n      #963636 100%);\n  box-shadow: 0 5px 10px rgba(72, 24, 24, 0.34), inset 0 0 0 1px rgba(111, 38, 38, 0.6);\n}\n.ui-info-card__menu-title {\n  margin: 0 0 0.1rem;\n  padding: 0.34rem 0.46rem 0.42rem;\n  border-bottom: 1px solid rgba(37, 64, 101, 0.14);\n  color: #203a5f;\n  font-size: 0.78rem;\n  font-weight: 800;\n  line-height: 1.22;\n  word-break: break-word;\n}\n.ui-info-card__menu-action {\n  width: 100%;\n  border: 0;\n  border-radius: 9px;\n  background: transparent;\n  color: #1f3659;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.42rem;\n  padding: 0.42rem 0.5rem;\n  font-size: 0.8rem;\n  font-weight: 700;\n  cursor: pointer;\n  text-align: left;\n}\n.ui-info-card__menu-action .mat-icon {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n  line-height: 16px;\n}\n.ui-info-card__menu-action--accent {\n  color: #975316;\n}\n.ui-info-card__menu-action--review {\n  background: rgba(255, 241, 215, 0.82);\n  color: #8b5713;\n}\n.ui-info-card__menu-action--warning {\n  color: #8c5a19;\n}\n.ui-info-card__menu-action--destructive {\n  color: #9c3043;\n}\n.ui-info-card__footer-chips {\n  position: relative;\n  z-index: 1;\n  display: flex;\n  flex-wrap: wrap;\n  gap: 0.28rem;\n}\n.ui-info-card__footer-chips--actions {\n  justify-content: flex-end;\n  margin-top: 0.42rem;\n}\n.ui-info-card__footer-chip {\n  min-height: 26px;\n  padding: 0.14rem 0.46rem;\n  border-radius: 999px;\n  border: 1px solid rgba(62, 89, 128, 0.18);\n  background:\n    linear-gradient(\n      180deg,\n      #f6f8fc 0%,\n      #edf2f8 100%);\n  color: #4f617d;\n  font-size: 0.68rem;\n  font-weight: 800;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.26rem;\n  line-height: 1;\n  font-family: inherit;\n}\nbutton.ui-info-card__footer-chip {\n  cursor: pointer;\n}\n.ui-info-card__footer-chip--button {\n  box-shadow: 0 8px 18px rgba(132, 82, 8, 0.12);\n}\n.ui-info-card__footer-chip--action-accent {\n  min-height: 32px;\n  padding: 0 0.68rem;\n  gap: 0.3rem;\n  background:\n    linear-gradient(\n      180deg,\n      #fff7e9 0%,\n      #ffedc9 100%);\n  border-color: rgba(201, 144, 39, 0.3);\n  color: #9b6714;\n  box-shadow: 0 4px 10px rgba(132, 82, 8, 0.1);\n  font-size: 0.74rem;\n  font-weight: 900;\n}\n.ui-info-card__footer-chip--button .mat-icon {\n  width: 14px;\n  height: 14px;\n  font-size: 14px;\n  line-height: 14px;\n}\n.ui-info-card__footer-chip--action-accent .mat-icon {\n  width: 15px;\n  height: 15px;\n  font-size: 15px;\n  line-height: 15px;\n}\n.ui-info-card__footer-chip--button:focus-visible {\n  outline: 2px solid rgba(79, 124, 255, 0.62);\n  outline-offset: 2px;\n}\n.ui-info-card__footer-chip.section-social {\n  background:\n    linear-gradient(\n      180deg,\n      #ecf4ff 0%,\n      #e1ecfb 100%);\n  border-color: rgba(45, 94, 168, 0.32);\n  color: #2d5ea8;\n}\n.ui-info-card__footer-chip.section-arts {\n  background:\n    linear-gradient(\n      180deg,\n      #f2edfb 0%,\n      #e9e2f9 100%);\n  border-color: rgba(103, 76, 164, 0.32);\n  color: #654ca1;\n}\n.ui-info-card__footer-chip.section-food {\n  background:\n    linear-gradient(\n      180deg,\n      #fff4e8 0%,\n      #fee9d6 100%);\n  border-color: rgba(170, 97, 28, 0.32);\n  color: #9d611c;\n}\n.ui-info-card__footer-chip.section-active {\n  background:\n    linear-gradient(\n      180deg,\n      #edf8ee 0%,\n      #e2f1e4 100%);\n  border-color: rgba(44, 126, 72, 0.32);\n  color: #2d7d47;\n}\n.ui-info-card__footer-chip.section-mind {\n  background:\n    linear-gradient(\n      180deg,\n      #eaf8f6 0%,\n      #def1ee 100%);\n  border-color: rgba(37, 124, 118, 0.32);\n  color: #2d7d78;\n}\n.ui-info-card__footer-chip.section-identity {\n  background:\n    linear-gradient(\n      180deg,\n      #f4f0ff 0%,\n      #e9e3fb 100%);\n  border-color: rgba(88, 78, 159, 0.32);\n  color: #5a4ea0;\n}\n.ui-info-card__footer-chip.status-pending {\n  background:\n    linear-gradient(\n      180deg,\n      #fff8e8 0%,\n      #ffefc9 100%);\n  border-color: rgba(201, 144, 39, 0.34);\n  color: #9b6714;\n}\n.ui-info-card__footer-chip.status-waitlist {\n  background:\n    linear-gradient(\n      180deg,\n      #eef8ff 0%,\n      #dcecf5 100%);\n  border-color: rgba(55, 115, 158, 0.36);\n  color: #2e668f;\n}\n.ui-info-card__footer-chip.status-review {\n  background:\n    linear-gradient(\n      180deg,\n      #f6e6ce 0%,\n      #e9cda6 100%);\n  border-color: rgba(126, 82, 35, 0.42);\n  color: #714817;\n}\n.ui-info-card__footer-chip.status-blocked {\n  background:\n    linear-gradient(\n      180deg,\n      #fff2f2 0%,\n      #f8dede 100%);\n  border-color: rgba(180, 52, 64, 0.3);\n  color: #9d2f3d;\n}\n.ui-info-card__footer-chip.status-deleted {\n  background:\n    linear-gradient(\n      180deg,\n      #f7f8fa 0%,\n      #e9edf2 100%);\n  border-color: rgba(97, 105, 118, 0.34);\n  color: #4f5968;\n}\n.ui-info-card__footer-chip.status-inactive {\n  background:\n    linear-gradient(\n      180deg,\n      #f2f3f5 0%,\n      #e8ebef 100%);\n  border-color: rgba(102, 112, 128, 0.3);\n  color: #556171;\n}\n@media (hover: hover) and (pointer: fine) {\n  button.asset-occupancy-badge:hover {\n    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.82), 0 10px 22px rgba(255, 255, 255, 0.58);\n    filter: brightness(1.06);\n  }\n  .experience-action-btn:hover {\n    box-shadow: 0 6px 14px rgba(19, 39, 68, 0.22);\n    filter: saturate(1.05);\n  }\n  .ui-info-card__menu-action:hover {\n    background: rgba(230, 238, 248, 0.72);\n  }\n  button.ui-info-card__overlay-action--layout-avatar-metric:hover {\n    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.84), 0 12px 24px rgba(12, 25, 42, 0.32);\n    filter: brightness(1.03);\n  }\n  button.ui-info-card__overlay-action--layout-badge-with-leading-accessory:hover {\n    box-shadow:\n      0 0 0 2px rgba(255, 255, 255, 0.84),\n      0 12px 24px rgba(19, 40, 67, 0.34),\n      inset 0 0 0 1px rgba(18, 38, 64, 0.58);\n  }\n}\nbutton.asset-occupancy-badge:active {\n  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.82), 0 9px 20px rgba(255, 255, 255, 0.54);\n}\nbutton.asset-occupancy-badge:focus-visible {\n  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.82), 0 9px 20px rgba(255, 255, 255, 0.54);\n  outline: none;\n}\n.asset-occupancy-badge.asset-occupancy-badge-static {\n  cursor: default;\n  box-shadow: 0 5px 10px rgba(8, 18, 34, 0.24);\n}\n.asset-occupancy-badge.asset-occupancy-badge-static.asset-occupancy-badge-full {\n  box-shadow: 0 5px 10px rgba(72, 24, 24, 0.34), inset 0 0 0 1px rgba(111, 38, 38, 0.6);\n}\n.experience-action-btn:active {\n  box-shadow: 0 3px 8px rgba(19, 39, 68, 0.18);\n}\n@media (max-width: 760px) {\n  .ui-info-card__head {\n    grid-template-columns: auto minmax(0, 1fr) auto;\n    row-gap: 0.32rem;\n  }\n  .ui-info-card__menu {\n    position: fixed;\n    left: 50%;\n    right: auto;\n    top: auto;\n    bottom: env(safe-area-inset-bottom, 0px);\n    width: min(100vw - 1.6rem, 27rem);\n    min-width: 0;\n    max-width: calc(100vw - 1.6rem);\n    max-height: min(70vh, 32rem);\n    overflow-y: auto;\n    padding: 0.45rem;\n    border-radius: 14px 14px 0 0;\n    box-shadow: 0 22px 48px rgba(11, 24, 43, 0.32);\n    transform: translate(-50%, 0);\n  }\n  .ui-info-card__menu-title {\n    padding: 0.52rem 0.56rem 0.56rem;\n    font-size: 0.9rem;\n  }\n  .ui-info-card__menu-action {\n    min-height: 42px;\n    padding: 0.55rem 0.58rem;\n    border-radius: 11px;\n    font-size: 0.92rem;\n    gap: 0.5rem;\n  }\n  .ui-info-card__menu-action .mat-icon {\n    width: 18px;\n    height: 18px;\n    font-size: 18px;\n    line-height: 18px;\n  }\n}\n/*# sourceMappingURL=info-card.component.css.map */\n'] }]
  }], () => [], { card: [{
    type: Input
  }], useSharedMenu: [{
    type: Input
  }], useSharedMenuTrigger: [{
    type: Input
  }], sharedMenuContext: [{
    type: Input
  }], cardClick: [{
    type: Output
  }], mediaStartClick: [{
    type: Output
  }], mediaEndClick: [{
    type: Output
  }], menuAction: [{
    type: Output
  }], menuRequest: [{
    type: Output
  }], onViewportResize: [{
    type: HostListener,
    args: ["window:resize"]
  }], onEscapePressed: [{
    type: HostListener,
    args: ["window:keydown.escape", ["$event"]]
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(InfoCardComponent, { className: "InfoCardComponent", filePath: "app/shared/ui/components/core/smart-list/card/info-card/info-card.component.ts", lineNumber: 64 });
})();

// src/app/shared/ui/scheduler/ui-task-scheduler.ts
var UiTaskScheduler = class {
  config;
  timer = null;
  abortController = null;
  inFlight = false;
  destroyed = false;
  lastPositiveIntervalMs = 0;
  constructor(config) {
    this.config = config;
  }
  restart() {
    if (this.destroyed) {
      return;
    }
    this.clearTimer();
    this.scheduleNext();
  }
  stop(options = {}) {
    this.clearTimer();
    if (options.abort === true) {
      this.abortController?.abort();
      this.abortController = null;
    }
  }
  destroy() {
    this.destroyed = true;
    this.stop({ abort: true });
  }
  async run() {
    this.timer = null;
    if (this.destroyed) {
      return;
    }
    const intervalMs = this.normalizedIntervalMs();
    if (intervalMs > 0 && !this.inFlight) {
      const abortController = typeof AbortController === "undefined" ? null : new AbortController();
      this.abortController = abortController;
      this.inFlight = true;
      try {
        const state = this.config.state();
        if (this.config.pollCoordinator) {
          await this.config.pollCoordinator.run(this.config.pollPriority ?? "background", ({ signal }) => this.config.task({ state, signal }), abortController?.signal);
        } else {
          await this.config.task({
            state,
            signal: abortController?.signal
          });
        }
      } catch {
      } finally {
        if (this.abortController === abortController) {
          this.abortController = null;
        }
        this.inFlight = false;
      }
    }
    this.scheduleNext();
  }
  scheduleNext() {
    if (this.destroyed || this.timer) {
      return;
    }
    const intervalMs = this.normalizedIntervalMs();
    if (intervalMs > 0) {
      this.lastPositiveIntervalMs = intervalMs;
    }
    const delayMs = intervalMs > 0 ? intervalMs : this.lastPositiveIntervalMs;
    if (delayMs <= 0) {
      return;
    }
    this.timer = setTimeout(() => {
      void this.run();
    }, delayMs);
  }
  clearTimer() {
    if (!this.timer) {
      return;
    }
    clearTimeout(this.timer);
    this.timer = null;
  }
  normalizedIntervalMs() {
    return Math.max(0, Math.trunc(Number(this.config.intervalMs()) || 0));
  }
};

// src/app/shared/ui/scheduler/ui-poll-coordinator.ts
var UiPollCoordinator = class _UiPollCoordinator {
  popupPresenceStore = inject(PopupPresenceStore);
  queue = [];
  activeTasks = /* @__PURE__ */ new Map();
  nextTaskId = 0;
  constructor() {
    effect(() => {
      if (!this.popupPresenceStore.visible()) {
        return;
      }
      this.cancelQueuedBackgroundTasks();
      const activeUiTask = this.activeTasks.get("ui");
      if (activeUiTask?.priority === "background") {
        activeUiTask.controller?.abort();
      }
    });
  }
  run(priority, task, externalSignal) {
    if (externalSignal?.aborted || priority === "background" && this.popupPresenceStore.visible()) {
      return Promise.resolve();
    }
    return new Promise((resolve) => {
      const controller = typeof AbortController === "undefined" ? null : new AbortController();
      const queuedTask = {
        id: ++this.nextTaskId,
        priority,
        controller,
        task,
        resolve,
        unbindExternalAbort: () => void 0
      };
      queuedTask.unbindExternalAbort = this.bindExternalAbort(queuedTask, externalSignal);
      this.queue.push(queuedTask);
      this.sortQueue();
      this.drain();
    });
  }
  drain() {
    this.drainLane("notification");
    this.drainLane("ui");
  }
  drainLane(lane) {
    if (this.activeTasks.has(lane)) {
      return;
    }
    const nextTask = this.nextRunnableTask(lane);
    if (!nextTask) {
      return;
    }
    this.activeTasks.set(lane, nextTask);
    void this.execute(nextTask);
  }
  async execute(task) {
    try {
      if (!task.controller?.signal.aborted) {
        await task.task({ signal: task.controller?.signal });
      }
    } catch {
    } finally {
      task.unbindExternalAbort();
      const lane = this.lane(task.priority);
      if (this.activeTasks.get(lane)?.id === task.id) {
        this.activeTasks.delete(lane);
      }
      task.resolve();
      this.drain();
    }
  }
  nextRunnableTask(lane) {
    while (true) {
      const candidateIndex = this.queue.findIndex((candidate2) => this.lane(candidate2.priority) === lane);
      if (candidateIndex < 0) {
        return null;
      }
      const [candidate] = this.queue.splice(candidateIndex, 1);
      if (candidate.controller?.signal.aborted) {
        candidate.unbindExternalAbort();
        candidate.resolve();
        continue;
      }
      if (candidate.priority === "background" && this.popupPresenceStore.visible()) {
        candidate.controller?.abort();
        candidate.unbindExternalAbort();
        candidate.resolve();
        continue;
      }
      return candidate;
    }
    return null;
  }
  cancelQueuedBackgroundTasks() {
    for (let index = this.queue.length - 1; index >= 0; index -= 1) {
      const task = this.queue[index];
      if (task.priority !== "background") {
        continue;
      }
      this.queue.splice(index, 1);
      task.controller?.abort();
      task.unbindExternalAbort();
      task.resolve();
    }
  }
  bindExternalAbort(task, externalSignal) {
    if (!externalSignal) {
      return () => void 0;
    }
    const abort = () => {
      task.controller?.abort();
      if (this.activeTasks.get(this.lane(task.priority))?.id === task.id) {
        return;
      }
      const index = this.queue.findIndex((candidate) => candidate.id === task.id);
      if (index >= 0) {
        this.queue.splice(index, 1);
      }
      task.unbindExternalAbort();
      task.resolve();
    };
    externalSignal.addEventListener("abort", abort, { once: true });
    return () => externalSignal.removeEventListener("abort", abort);
  }
  sortQueue() {
    this.queue.sort((left, right) => {
      if (left.priority === right.priority) {
        return left.id - right.id;
      }
      if (left.priority === "notification") {
        return -1;
      }
      if (right.priority === "notification") {
        return 1;
      }
      return left.priority === "foreground" ? -1 : 1;
    });
  }
  lane(priority) {
    return priority === "notification" ? "notification" : "ui";
  }
  static \u0275fac = function UiPollCoordinator_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _UiPollCoordinator)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _UiPollCoordinator, factory: _UiPollCoordinator.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(UiPollCoordinator, [{
    type: Injectable,
    args: [{ providedIn: "root" }]
  }], () => [], null);
})();

// src/app/shared/ui/components/core/smart-list/smart-list-calendar.adapter.ts
var smartListMonthCalendarAdapter = createMonthCalendarAdapter();
var smartListWeekCalendarAdapter = createWeekCalendarAdapter();
var SmartListCalendarAdapter = {
  getInstance(mode) {
    if (mode === "month") {
      return smartListMonthCalendarAdapter;
    }
    if (mode === "week") {
      return smartListWeekCalendarAdapter;
    }
    return null;
  }
};
function countSmartListCalendarOverlaps(items, start, end, resolveDateRange) {
  let count = 0;
  for (const item of items) {
    const range = resolveDateRange(item);
    if (!range) {
      continue;
    }
    if (range.start.getTime() < end.getTime() && range.end.getTime() > start.getTime()) {
      count += 1;
    }
  }
  return count;
}
function createMonthCalendarAdapter() {
  return {
    mode: "month",
    config: calendarConfig,
    variant: calendarVariant,
    anchorRadius,
    initialAnchor,
    initialAnchorKey,
    normalizeAnchor: (anchor) => AppUtils.startOfMonth(anchor),
    keyForAnchor: (anchor) => AppUtils.monthKey(AppUtils.startOfMonth(anchor)),
    shiftAnchor: (anchor, direction) => AppUtils.addMonths(AppUtils.startOfMonth(anchor), direction),
    queryForAnchor: (query, anchor) => queryForAnchor(query, AppUtils.startOfMonth(anchor), monthRangeForAnchor),
    anchorForPage: (page) => page.anchor,
    labelForPage: (page) => page.label,
    buildPage: (context) => {
      const anchor = AppUtils.startOfMonth(context.anchor);
      const resolveDateRange = (item) => context.viewConfig.resolveDateRange(item, context.query);
      const items = [...context.items];
      const itemsByDate = buildCalendarItemsByDate(items, resolveDateRange, (value) => AppUtils.dateKey(value));
      return buildCalendarMonthPage(anchor, itemsByDate, items, resolveDateRange, {
        trackByKey: context.trackByKey,
        dateKey: (value) => AppUtils.dateKey(value),
        monthKey: (value) => AppUtils.monthKey(value)
      });
    }
  };
}
function createWeekCalendarAdapter() {
  return {
    mode: "week",
    config: calendarConfig,
    variant: calendarVariant,
    anchorRadius,
    initialAnchor,
    initialAnchorKey,
    normalizeAnchor: (anchor) => AppUtils.startOfWeekMonday(anchor),
    keyForAnchor: (anchor) => AppUtils.dateKey(AppUtils.startOfWeekMonday(anchor)),
    shiftAnchor: (anchor, direction) => AppUtils.addDays(AppUtils.startOfWeekMonday(anchor), direction * 7),
    queryForAnchor: (query, anchor) => queryForAnchor(query, AppUtils.startOfWeekMonday(anchor), weekRangeForAnchor),
    anchorForPage: (page) => page.anchor,
    labelForPage: (page) => page.label,
    buildPage: (context) => {
      const anchor = AppUtils.startOfWeekMonday(context.anchor);
      const resolveDateRange = (item) => context.viewConfig.resolveDateRange(item, context.query);
      const itemsByDate = buildCalendarItemsByDate([...context.items], resolveDateRange, (value) => AppUtils.dateKey(value));
      return buildCalendarWeekPage(anchor, itemsByDate, (value) => AppUtils.dateKey(value));
    }
  };
}
function calendarConfig(config) {
  return config.calendar ?? null;
}
function calendarVariant(config, query) {
  const value = config.calendarVariant;
  if (typeof value === "function") {
    return value(query);
  }
  return value ?? "default";
}
function anchorRadius(calendar) {
  return Math.max(0, Math.trunc(calendar?.anchorRadius ?? 1));
}
function initialAnchor(calendar, query) {
  const parsed = AppUtils.parseDate(resolveInitialAnchorValue(calendar, query));
  return parsed ? AppUtils.dateOnly(parsed) : null;
}
function initialAnchorKey(calendar, query) {
  const parsed = AppUtils.parseDate(resolveInitialAnchorValue(calendar, query));
  return parsed ? AppUtils.dateKey(parsed) : "";
}
function resolveInitialAnchorValue(calendar, query) {
  const value = calendar?.initialAnchor;
  if (typeof value === "function") {
    return value(query);
  }
  return value ?? null;
}
function queryForAnchor(query, normalizedAnchor, rangeForAnchor) {
  const range = rangeForAnchor(normalizedAnchor);
  return __spreadProps(__spreadValues({}, query), {
    page: 0,
    anchorDate: AppUtils.dateKey(normalizedAnchor),
    rangeStart: AppUtils.dateKey(range.start),
    rangeEnd: AppUtils.dateKey(range.end)
  });
}
function monthRangeForAnchor(anchor) {
  const monthStart = AppUtils.startOfMonth(anchor);
  return {
    start: AppUtils.startOfWeekMonday(monthStart),
    end: AppUtils.endOfWeekSunday(AppUtils.endOfMonth(monthStart))
  };
}
function weekRangeForAnchor(anchor) {
  const weekStart = AppUtils.startOfWeekMonday(anchor);
  return {
    start: weekStart,
    end: AppUtils.endOfWeekSunday(weekStart)
  };
}
function buildCalendarItemsByDate(items, resolveDateRange, dateKey) {
  const byDate = /* @__PURE__ */ new Map();
  for (const item of items) {
    const range = resolveDateRange(item);
    if (!range) {
      continue;
    }
    let cursor = AppUtils.dateOnly(range.start);
    const endDate = AppUtils.dateOnly(range.end);
    while (cursor.getTime() <= endDate.getTime()) {
      const key = dateKey(cursor);
      const current = byDate.get(key) ?? [];
      current.push(item);
      byDate.set(key, current);
      cursor = AppUtils.addDays(cursor, 1);
    }
  }
  return byDate;
}
function buildCalendarMonthPage(anchor, itemsByDate, items, resolveDateRange, keys) {
  const firstDay = AppUtils.startOfMonth(anchor);
  const firstWeekStart = AppUtils.startOfWeekMonday(firstDay);
  const monthEnd = AppUtils.endOfMonth(anchor);
  const lastWeekEnd = AppUtils.endOfWeekSunday(monthEnd);
  const weeks = [];
  let cursor = AppUtils.dateOnly(firstWeekStart);
  while (cursor.getTime() <= lastWeekEnd.getTime()) {
    const weekStart = AppUtils.dateOnly(cursor);
    const weekEnd = AppUtils.addDays(weekStart, 6);
    const days = [];
    for (let day = 0; day < 7; day += 1) {
      const date = AppUtils.addDays(cursor, day);
      days.push(buildCalendarDay(date, itemsByDate, firstDay.getMonth(), keys.dateKey));
    }
    weeks.push({
      start: weekStart,
      end: weekEnd,
      days,
      spans: buildMonthWeekSpans(weekStart, weekEnd, items, resolveDateRange, keys)
    });
    cursor = AppUtils.addDays(cursor, 7);
  }
  return {
    key: keys.monthKey(anchor),
    label: anchor.toLocaleDateString("en-US", { month: "long", year: "numeric" }),
    anchor: AppUtils.startOfMonth(anchor),
    weeks
  };
}
function buildCalendarWeekPage(anchor, itemsByDate, dateKey) {
  const start = AppUtils.startOfWeekMonday(anchor);
  const days = [];
  for (let day = 0; day < 7; day += 1) {
    const date = AppUtils.addDays(start, day);
    days.push(buildCalendarDay(date, itemsByDate, date.getMonth(), dateKey));
  }
  const end = AppUtils.addDays(start, 6);
  return {
    key: dateKey(start),
    label: weekRangeLabel(start, end),
    anchor: start,
    days
  };
}
function buildMonthWeekSpans(weekStart, weekEnd, items, resolveDateRange, keys) {
  const spansBase = [];
  for (const item of items) {
    const range = resolveDateRange(item);
    if (!range) {
      continue;
    }
    const startDate = AppUtils.dateOnly(range.start);
    const endDate = AppUtils.dateOnly(range.end);
    if (!AppUtils.dateRangeOverlaps(startDate, endDate, weekStart, weekEnd)) {
      continue;
    }
    const visibleStart = startDate.getTime() < weekStart.getTime() ? weekStart : startDate;
    const visibleEnd = endDate.getTime() > weekEnd.getTime() ? weekEnd : endDate;
    spansBase.push({
      item,
      startCol: Math.max(0, dayDiff(weekStart, visibleStart)),
      endCol: Math.min(6, dayDiff(weekStart, visibleEnd))
    });
  }
  spansBase.sort((first, second) => first.startCol - second.startCol || second.endCol - first.endCol);
  const lanes = [];
  const spans = [];
  for (const span of spansBase) {
    let laneIndex = 0;
    while (laneIndex < lanes.length) {
      const conflict = lanes[laneIndex].some((item) => !(span.endCol < item.startCol || span.startCol > item.endCol));
      if (!conflict) {
        break;
      }
      laneIndex += 1;
    }
    if (!lanes[laneIndex]) {
      lanes[laneIndex] = [];
    }
    lanes[laneIndex].push({ startCol: span.startCol, endCol: span.endCol });
    spans.push({
      key: `${keys.trackByKey(span.item)}-${keys.dateKey(weekStart)}-${span.startCol}-${span.endCol}-${laneIndex}`,
      item: span.item,
      startCol: span.startCol,
      endCol: span.endCol,
      lane: laneIndex
    });
  }
  return spans;
}
function buildCalendarDay(date, itemsByDate, currentMonthIndex, dateKey) {
  const safeDate = AppUtils.dateOnly(date);
  const key = dateKey(safeDate);
  const todayKey = dateKey(AppUtils.dateOnly(/* @__PURE__ */ new Date()));
  return {
    key,
    date: safeDate,
    dayNumber: safeDate.getDate(),
    inCurrentMonth: safeDate.getMonth() === currentMonthIndex,
    isToday: key === todayKey,
    items: itemsByDate.get(key) ?? []
  };
}
function weekRangeLabel(start, end) {
  const startLabel = start.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const endLabel = end.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  return `${startLabel} - ${endLabel}`;
}
function dayDiff(from, to) {
  const ms = AppUtils.dateOnly(to).getTime() - AppUtils.dateOnly(from).getTime();
  return Math.floor(ms / 864e5);
}

// src/app/shared/ui/components/core/smart-list/card/calendar-card/calendar-card.component.ts
var _c02 = [[["", "smart-list-page-card-header", ""]], [["", "calendar-card-header", ""]]];
var _c12 = ["[smart-list-page-card-header]", "[calendar-card-header]"];
function CalendarCardComponent_Conditional_3_For_1_For_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const dayLabel_r1 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(dayLabel_r1);
  }
}
function CalendarCardComponent_Conditional_3_For_1_For_6_For_2_Conditional_3_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "strong");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const counter_r5 = \u0275\u0275nextContext();
    \u0275\u0275attribute("aria-label", counter_r5.alertAriaLabel || null);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(counter_r5.alertLabel);
  }
}
function CalendarCardComponent_Conditional_3_For_1_For_6_For_2_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 12);
    \u0275\u0275listener("click", function CalendarCardComponent_Conditional_3_For_1_For_6_For_2_Conditional_3_Template_button_click_0_listener($event) {
      \u0275\u0275restoreView(_r2);
      const day_r3 = \u0275\u0275nextContext().$implicit;
      const ctx_r3 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r3.selectCalendarDay(day_r3, $event));
    });
    \u0275\u0275elementStart(1, "span");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(3, CalendarCardComponent_Conditional_3_For_1_For_6_For_2_Conditional_3_Conditional_3_Template, 2, 2, "strong");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const counter_r5 = ctx;
    const ctx_r3 = \u0275\u0275nextContext(5);
    \u0275\u0275property("ngClass", ctx_r3.calendarCounterClass(counter_r5));
    \u0275\u0275attribute("aria-label", counter_r5.ariaLabel || counter_r5.label);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(counter_r5.label);
    \u0275\u0275advance();
    \u0275\u0275conditional(counter_r5.alertLabel ? 3 : -1);
  }
}
function CalendarCardComponent_Conditional_3_For_1_For_6_For_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 9)(1, "div", 10);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(3, CalendarCardComponent_Conditional_3_For_1_For_6_For_2_Conditional_3_Template, 4, 4, "button", 11);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_35_0;
    const day_r3 = ctx.$implicit;
    const ctx_r3 = \u0275\u0275nextContext(4);
    \u0275\u0275classProp("smart-list__month-cell--outside", !day_r3.inCurrentMonth)("smart-list__month-cell--today", day_r3.isToday)("smart-list__month-cell--counter", ctx_r3.isCounterCalendarVariant());
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(day_r3.dayNumber);
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_35_0 = ctx_r3.isCounterCalendarVariant() && ctx_r3.calendarDayCounter(day_r3)) ? 3 : -1, tmp_35_0);
  }
}
function CalendarCardComponent_Conditional_3_For_1_For_6_Conditional_3_For_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 14);
    \u0275\u0275listener("click", function CalendarCardComponent_Conditional_3_For_1_For_6_Conditional_3_For_2_Template_button_click_0_listener($event) {
      const span_r7 = \u0275\u0275restoreView(_r6).$implicit;
      const ctx_r3 = \u0275\u0275nextContext(5);
      return \u0275\u0275resetView(ctx_r3.selectItem(span_r7.item, $event));
    });
    \u0275\u0275elementStart(1, "span");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const span_r7 = ctx.$implicit;
    const ctx_r3 = \u0275\u0275nextContext(5);
    \u0275\u0275styleProp("left", span_r7.startCol * 100 / 7, "%")("width", (span_r7.endCol - span_r7.startCol + 1) * 100 / 7, "%")("top", 18 + span_r7.lane * 20, "px");
    \u0275\u0275property("ngClass", ctx_r3.calendarBadgeToneClass(span_r7.item));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r3.calendarBadgeLabel(span_r7.item));
  }
}
function CalendarCardComponent_Conditional_3_For_1_For_6_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 8);
    \u0275\u0275repeaterCreate(1, CalendarCardComponent_Conditional_3_For_1_For_6_Conditional_3_For_2_Template, 3, 8, "button", 13, \u0275\u0275componentInstance().trackByCalendarSpanKey, true);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const week_r8 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275repeater(week_r8.spans);
  }
}
function CalendarCardComponent_Conditional_3_For_1_For_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 6);
    \u0275\u0275repeaterCreate(1, CalendarCardComponent_Conditional_3_For_1_For_6_For_2_Template, 4, 8, "div", 7, \u0275\u0275componentInstance().trackByCalendarDayKey, true);
    \u0275\u0275conditionalCreate(3, CalendarCardComponent_Conditional_3_For_1_For_6_Conditional_3_Template, 3, 0, "div", 8);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const week_r8 = ctx.$implicit;
    const ctx_r3 = \u0275\u0275nextContext(3);
    \u0275\u0275classProp("smart-list__month-week--counter", ctx_r3.isCounterCalendarVariant());
    \u0275\u0275advance();
    \u0275\u0275repeater(week_r8.days);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(!ctx_r3.isCounterCalendarVariant() && week_r8.spans.length > 0 ? 3 : -1);
  }
}
function CalendarCardComponent_Conditional_3_For_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "section", 2)(1, "div", 3);
    \u0275\u0275repeaterCreate(2, CalendarCardComponent_Conditional_3_For_1_For_3_Template, 2, 1, "span", null, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "div", 4);
    \u0275\u0275repeaterCreate(5, CalendarCardComponent_Conditional_3_For_1_For_6_Template, 4, 3, "div", 5, \u0275\u0275componentInstance().trackByCalendarMonthWeekKey, true);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const page_r9 = ctx.$implicit;
    const ctx_r3 = \u0275\u0275nextContext(2);
    \u0275\u0275styleProp("--month-week-count", page_r9.weeks.length);
    \u0275\u0275classProp("smart-list__calendar-page--month-six-weeks", page_r9.weeks.length === 6)("smart-list__calendar-page--month-counter", ctx_r3.isCounterCalendarVariant());
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r3.calendarWeekdayLabels());
    \u0275\u0275advance(2);
    \u0275\u0275classProp("smart-list__month-grid--counter", ctx_r3.isCounterCalendarVariant());
    \u0275\u0275advance();
    \u0275\u0275repeater(page_r9.weeks);
  }
}
function CalendarCardComponent_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275repeaterCreate(0, CalendarCardComponent_Conditional_3_For_1_Template, 7, 8, "section", 1, \u0275\u0275componentInstance().trackByCalendarPageKey, true);
  }
  if (rf & 2) {
    const ctx_r3 = \u0275\u0275nextContext();
    \u0275\u0275repeater(ctx_r3.monthPages());
  }
}
function CalendarCardComponent_Conditional_4_For_1_For_4_Conditional_5_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "strong");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const counter_r12 = \u0275\u0275nextContext();
    \u0275\u0275attribute("aria-label", counter_r12.alertAriaLabel || null);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(counter_r12.alertLabel);
  }
}
function CalendarCardComponent_Conditional_4_For_1_For_4_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r10 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 24);
    \u0275\u0275listener("click", function CalendarCardComponent_Conditional_4_For_1_For_4_Conditional_5_Template_button_click_0_listener($event) {
      \u0275\u0275restoreView(_r10);
      const day_r11 = \u0275\u0275nextContext().$implicit;
      const ctx_r3 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r3.selectCalendarDay(day_r11, $event));
    });
    \u0275\u0275elementStart(1, "span");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(3, CalendarCardComponent_Conditional_4_For_1_For_4_Conditional_5_Conditional_3_Template, 2, 2, "strong");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const counter_r12 = ctx;
    const ctx_r3 = \u0275\u0275nextContext(4);
    \u0275\u0275property("ngClass", ctx_r3.calendarCounterClass(counter_r12));
    \u0275\u0275attribute("aria-label", counter_r12.ariaLabel || counter_r12.label);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(counter_r12.label);
    \u0275\u0275advance();
    \u0275\u0275conditional(counter_r12.alertLabel ? 3 : -1);
  }
}
function CalendarCardComponent_Conditional_4_For_1_For_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 22)(1, "span");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "strong");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(5, CalendarCardComponent_Conditional_4_For_1_For_4_Conditional_5_Template, 4, 4, "button", 23);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_25_0;
    const day_r11 = ctx.$implicit;
    const \u0275$index_53_r13 = ctx.$index;
    const ctx_r3 = \u0275\u0275nextContext(3);
    \u0275\u0275classProp("smart-list__week-board-day-head--today", day_r11.isToday);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r3.calendarWeekdayLabels()[\u0275$index_53_r13]);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(day_r11.dayNumber);
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_25_0 = ctx_r3.isCounterCalendarVariant() && ctx_r3.calendarDayCounter(day_r11)) ? 5 : -1, tmp_25_0);
  }
}
function CalendarCardComponent_Conditional_4_For_1_For_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 20);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const hour_r14 = ctx.$implicit;
    const ctx_r3 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r3.weekHourLabel(hour_r14), " ");
  }
}
function CalendarCardComponent_Conditional_4_For_1_For_9_Conditional_1_For_1_Conditional_1_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "strong");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const counter_r17 = \u0275\u0275nextContext();
    \u0275\u0275attribute("aria-label", counter_r17.alertAriaLabel || null);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(counter_r17.alertLabel);
  }
}
function CalendarCardComponent_Conditional_4_For_1_For_9_Conditional_1_For_1_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r15 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 28);
    \u0275\u0275listener("click", function CalendarCardComponent_Conditional_4_For_1_For_9_Conditional_1_For_1_Conditional_1_Template_button_click_0_listener($event) {
      \u0275\u0275restoreView(_r15);
      const day_r16 = \u0275\u0275nextContext(3).$implicit;
      const ctx_r3 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r3.selectCalendarDay(day_r16, $event));
    });
    \u0275\u0275elementStart(1, "span");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(3, CalendarCardComponent_Conditional_4_For_1_For_9_Conditional_1_For_1_Conditional_1_Conditional_3_Template, 2, 2, "strong");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const counter_r17 = ctx;
    const ctx_r3 = \u0275\u0275nextContext(6);
    \u0275\u0275property("ngClass", ctx_r3.calendarCounterClass(counter_r17));
    \u0275\u0275attribute("aria-label", counter_r17.ariaLabel || counter_r17.label);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(counter_r17.label);
    \u0275\u0275advance();
    \u0275\u0275conditional(counter_r17.alertLabel ? 3 : -1);
  }
}
function CalendarCardComponent_Conditional_4_For_1_For_9_Conditional_1_For_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 26);
    \u0275\u0275conditionalCreate(1, CalendarCardComponent_Conditional_4_For_1_For_9_Conditional_1_For_1_Conditional_1_Template, 4, 4, "button", 27);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_32_0;
    const hour_r18 = ctx.$implicit;
    const day_r16 = \u0275\u0275nextContext(2).$implicit;
    const ctx_r3 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_32_0 = ctx_r3.calendarHourCounter(day_r16, hour_r18)) ? 1 : -1, tmp_32_0);
  }
}
function CalendarCardComponent_Conditional_4_For_1_For_9_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275repeaterCreate(0, CalendarCardComponent_Conditional_4_For_1_For_9_Conditional_1_For_1_Template, 2, 1, "div", 26, \u0275\u0275repeaterTrackByIdentity);
  }
  if (rf & 2) {
    const ctx_r3 = \u0275\u0275nextContext(4);
    \u0275\u0275repeater(ctx_r3.calendarWeekHours());
  }
}
function CalendarCardComponent_Conditional_4_For_1_For_9_Conditional_2_For_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "div", 29);
  }
}
function CalendarCardComponent_Conditional_4_For_1_For_9_Conditional_2_Conditional_2_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "strong");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const counter_r20 = \u0275\u0275nextContext();
    \u0275\u0275attribute("aria-label", counter_r20.alertAriaLabel || null);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(counter_r20.alertLabel);
  }
}
function CalendarCardComponent_Conditional_4_For_1_For_9_Conditional_2_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r19 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 31);
    \u0275\u0275listener("click", function CalendarCardComponent_Conditional_4_For_1_For_9_Conditional_2_Conditional_2_Template_button_click_0_listener($event) {
      \u0275\u0275restoreView(_r19);
      const day_r16 = \u0275\u0275nextContext(2).$implicit;
      const ctx_r3 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r3.selectCalendarDay(day_r16, $event));
    });
    \u0275\u0275elementStart(1, "span");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(3, CalendarCardComponent_Conditional_4_For_1_For_9_Conditional_2_Conditional_2_Conditional_3_Template, 2, 2, "strong");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const counter_r20 = ctx;
    const ctx_r3 = \u0275\u0275nextContext(5);
    \u0275\u0275property("ngClass", ctx_r3.calendarCounterClass(counter_r20));
    \u0275\u0275attribute("aria-label", counter_r20.ariaLabel || counter_r20.label);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(counter_r20.label);
    \u0275\u0275advance();
    \u0275\u0275conditional(counter_r20.alertLabel ? 3 : -1);
  }
}
function CalendarCardComponent_Conditional_4_For_1_For_9_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275repeaterCreate(0, CalendarCardComponent_Conditional_4_For_1_For_9_Conditional_2_For_1_Template, 1, 0, "div", 29, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275conditionalCreate(2, CalendarCardComponent_Conditional_4_For_1_For_9_Conditional_2_Conditional_2_Template, 4, 4, "button", 30);
  }
  if (rf & 2) {
    let tmp_23_0;
    const day_r16 = \u0275\u0275nextContext().$implicit;
    const ctx_r3 = \u0275\u0275nextContext(3);
    \u0275\u0275repeater(ctx_r3.calendarWeekHours());
    \u0275\u0275advance(2);
    \u0275\u0275conditional((tmp_23_0 = ctx_r3.calendarDayCounter(day_r16)) ? 2 : -1, tmp_23_0);
  }
}
function CalendarCardComponent_Conditional_4_For_1_For_9_Conditional_3_For_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "div", 29);
  }
}
function CalendarCardComponent_Conditional_4_For_1_For_9_Conditional_3_For_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r21 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 33);
    \u0275\u0275listener("click", function CalendarCardComponent_Conditional_4_For_1_For_9_Conditional_3_For_3_Template_button_click_0_listener($event) {
      const badge_r22 = \u0275\u0275restoreView(_r21).$implicit;
      const ctx_r3 = \u0275\u0275nextContext(5);
      return \u0275\u0275resetView(ctx_r3.selectItem(badge_r22.item, $event));
    });
    \u0275\u0275elementStart(1, "span");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const badge_r22 = ctx.$implicit;
    const ctx_r3 = \u0275\u0275nextContext(5);
    \u0275\u0275styleProp("top", badge_r22.topPct, "%")("height", badge_r22.heightPct, "%");
    \u0275\u0275property("ngClass", ctx_r3.calendarBadgeToneClass(badge_r22.item));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r3.calendarBadgeLabel(badge_r22.item));
  }
}
function CalendarCardComponent_Conditional_4_For_1_For_9_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275repeaterCreate(0, CalendarCardComponent_Conditional_4_For_1_For_9_Conditional_3_For_1_Template, 1, 0, "div", 29, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275repeaterCreate(2, CalendarCardComponent_Conditional_4_For_1_For_9_Conditional_3_For_3_Template, 3, 6, "button", 32, \u0275\u0275componentInstance().trackByCalendarTimedBadge, true);
  }
  if (rf & 2) {
    const day_r16 = \u0275\u0275nextContext().$implicit;
    const ctx_r3 = \u0275\u0275nextContext(3);
    \u0275\u0275repeater(ctx_r3.calendarWeekHours());
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r3.weekDayTimedBadges(day_r16));
  }
}
function CalendarCardComponent_Conditional_4_For_1_For_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 25);
    \u0275\u0275conditionalCreate(1, CalendarCardComponent_Conditional_4_For_1_For_9_Conditional_1_Template, 2, 0)(2, CalendarCardComponent_Conditional_4_For_1_For_9_Conditional_2_Template, 3, 1)(3, CalendarCardComponent_Conditional_4_For_1_For_9_Conditional_3_Template, 4, 0);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const day_r16 = ctx.$implicit;
    const ctx_r3 = \u0275\u0275nextContext(3);
    \u0275\u0275classProp("smart-list__week-day-col--today", day_r16.isToday)("smart-list__week-day-col--counter", ctx_r3.isCounterCalendarVariant());
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r3.isCounterCalendarVariant() && ctx_r3.calendarCounterGranularity() === "hour" ? 1 : ctx_r3.isCounterCalendarVariant() ? 2 : 3);
  }
}
function CalendarCardComponent_Conditional_4_For_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "section", 15)(1, "div", 16);
    \u0275\u0275element(2, "div", 17);
    \u0275\u0275repeaterCreate(3, CalendarCardComponent_Conditional_4_For_1_For_4_Template, 6, 5, "div", 18, \u0275\u0275componentInstance().trackByCalendarDayKey, true);
    \u0275\u0275elementStart(5, "div", 19);
    \u0275\u0275repeaterCreate(6, CalendarCardComponent_Conditional_4_For_1_For_7_Template, 2, 1, "div", 20, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(8, CalendarCardComponent_Conditional_4_For_1_For_9_Template, 4, 5, "div", 21, \u0275\u0275componentInstance().trackByCalendarDayKey, true);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const page_r23 = ctx.$implicit;
    const ctx_r3 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275styleProp("--week-slot-count", ctx_r3.calendarWeekHours().length);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(page_r23.days);
    \u0275\u0275advance(3);
    \u0275\u0275repeater(ctx_r3.calendarWeekHours());
    \u0275\u0275advance(2);
    \u0275\u0275repeater(page_r23.days);
  }
}
function CalendarCardComponent_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275repeaterCreate(0, CalendarCardComponent_Conditional_4_For_1_Template, 10, 2, "section", 15, \u0275\u0275componentInstance().trackByCalendarPageKey, true);
  }
  if (rf & 2) {
    const ctx_r3 = \u0275\u0275nextContext();
    \u0275\u0275repeater(ctx_r3.weekPages());
  }
}
function CalendarCardComponent_Conditional_5_For_1_For_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 38)(1, "span");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const tick_r24 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(tick_r24.label);
  }
}
function CalendarCardComponent_Conditional_5_For_1_For_7_For_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "div", 42);
  }
}
function CalendarCardComponent_Conditional_5_For_1_For_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 40);
    \u0275\u0275repeaterCreate(1, CalendarCardComponent_Conditional_5_For_1_For_7_For_2_Template, 1, 0, "div", 42, \u0275\u0275componentInstance().trackByTimelineTickKey, true);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const page_r25 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275repeater(page_r25.ticks);
  }
}
function CalendarCardComponent_Conditional_5_For_1_For_9_Conditional_1_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainer(0, 44);
  }
  if (rf & 2) {
    const templateRef_r28 = \u0275\u0275nextContext();
    const ctx_r3 = \u0275\u0275nextContext(4);
    \u0275\u0275property("ngTemplateOutlet", templateRef_r28)("ngTemplateOutletContext", ctx)("ngTemplateOutletInjector", (ctx_r3.model == null ? null : ctx_r3.model.itemTemplateInjector) || null);
  }
}
function CalendarCardComponent_Conditional_5_For_1_For_9_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, CalendarCardComponent_Conditional_5_For_1_For_9_Conditional_1_Conditional_0_Template, 1, 3, "ng-container", 44);
  }
  if (rf & 2) {
    let tmp_23_0;
    const ctx_r28 = \u0275\u0275nextContext();
    const span_r27 = ctx_r28.$implicit;
    const $index_r30 = ctx_r28.$index;
    const ctx_r3 = \u0275\u0275nextContext(3);
    \u0275\u0275conditional((tmp_23_0 = ctx_r3.timelineItemContext(span_r27, $index_r30)) ? 0 : -1, tmp_23_0);
  }
}
function CalendarCardComponent_Conditional_5_For_1_For_9_Conditional_2_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "small");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const span_r27 = \u0275\u0275nextContext(2).$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(span_r27.meta);
  }
}
function CalendarCardComponent_Conditional_5_For_1_For_9_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(2, CalendarCardComponent_Conditional_5_For_1_For_9_Conditional_2_Conditional_2_Template, 2, 1, "small");
  }
  if (rf & 2) {
    const span_r27 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(span_r27.label);
    \u0275\u0275advance();
    \u0275\u0275conditional(span_r27.meta ? 2 : -1);
  }
}
function CalendarCardComponent_Conditional_5_For_1_For_9_Template(rf, ctx) {
  if (rf & 1) {
    const _r26 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 43);
    \u0275\u0275listener("click", function CalendarCardComponent_Conditional_5_For_1_For_9_Template_div_click_0_listener($event) {
      const span_r27 = \u0275\u0275restoreView(_r26).$implicit;
      const ctx_r3 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r3.selectTimelineSpan(span_r27, $event));
    })("keydown", function CalendarCardComponent_Conditional_5_For_1_For_9_Template_div_keydown_0_listener($event) {
      const span_r27 = \u0275\u0275restoreView(_r26).$implicit;
      const ctx_r3 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r3.onTimelineSpanKeydown(span_r27, $event));
    });
    \u0275\u0275conditionalCreate(1, CalendarCardComponent_Conditional_5_For_1_For_9_Conditional_1_Template, 1, 1)(2, CalendarCardComponent_Conditional_5_For_1_For_9_Conditional_2_Template, 3, 2);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_34_0;
    const span_r27 = ctx.$implicit;
    const ctx_r3 = \u0275\u0275nextContext(3);
    \u0275\u0275styleProp("left", span_r27.leftPct, "%")("width", span_r27.widthPct, "%")("top", span_r27.topPx, "px")("height", span_r27.heightPx, "px");
    \u0275\u0275classProp("motion-static", !ctx_r3.timelineItemInteractive())("smart-list__timeline-span--static", !ctx_r3.timelineItemInteractive())("smart-list__timeline-span--template", ctx_r3.timelineItemTemplate() !== null)("smart-list__timeline-span--continues-before", span_r27.continuesBefore)("smart-list__timeline-span--continues-after", span_r27.continuesAfter);
    \u0275\u0275property("ngClass", span_r27.toneClass);
    \u0275\u0275attribute("role", ctx_r3.timelineItemInteractive() ? "button" : null)("tabindex", ctx_r3.timelineItemInteractive() ? 0 : null)("aria-label", ctx_r3.timelineItemInteractive() ? span_r27.ariaLabel : null);
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_34_0 = ctx_r3.timelineItemTemplate()) ? 1 : 2, tmp_34_0);
  }
}
function CalendarCardComponent_Conditional_5_For_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "section", 35)(1, "div", 36)(2, "div", 37);
    \u0275\u0275repeaterCreate(3, CalendarCardComponent_Conditional_5_For_1_For_4_Template, 3, 1, "div", 38, \u0275\u0275componentInstance().trackByTimelineTickKey, true);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "div", 39);
    \u0275\u0275repeaterCreate(6, CalendarCardComponent_Conditional_5_For_1_For_7_Template, 3, 0, "div", 40, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275repeaterCreate(8, CalendarCardComponent_Conditional_5_For_1_For_9_Template, 3, 23, "div", 41, \u0275\u0275componentInstance().trackByTimelineSpanKey, true);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const page_r25 = ctx.$implicit;
    const ctx_r3 = \u0275\u0275nextContext(2);
    \u0275\u0275styleProp("--timeline-step-count", page_r25.ticks.length);
    \u0275\u0275advance();
    \u0275\u0275styleProp("--timeline-step-count", page_r25.ticks.length)("--timeline-row-count", page_r25.rowCount)("--timeline-row-h", page_r25.rowHeightPx + "px");
    \u0275\u0275advance(2);
    \u0275\u0275repeater(page_r25.ticks);
    \u0275\u0275advance(3);
    \u0275\u0275repeater(ctx_r3.timelineRows(page_r25));
    \u0275\u0275advance(2);
    \u0275\u0275repeater(page_r25.spans);
  }
}
function CalendarCardComponent_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275repeaterCreate(0, CalendarCardComponent_Conditional_5_For_1_Template, 10, 8, "section", 34, \u0275\u0275componentInstance().trackByCalendarPageKey, true);
  }
  if (rf & 2) {
    const ctx_r3 = \u0275\u0275nextContext();
    \u0275\u0275repeater(ctx_r3.timelinePages());
  }
}
var CalendarCardComponent = class _CalendarCardComponent {
  model = null;
  get isTouching() {
    return this.model?.touching === true;
  }
  trackByCalendarPageKey = (_index, page) => page.key;
  trackByCalendarMonthWeekKey = (_index, week) => `${week.start.toISOString()}-${week.end.toISOString()}`;
  trackByCalendarDayKey = (_index, day) => day.key;
  trackByCalendarSpanKey = (_index, span) => span.key;
  trackByCalendarTimedBadge = (index, badge) => this.calendarTrackKey(index, badge.item);
  trackByTimelineTickKey = (_index, tick) => tick.key;
  trackByTimelineSpanKey = (_index, span) => span.key;
  monthPages() {
    if (this.model?.mode !== "month") {
      return [];
    }
    return this.model?.pages ?? [];
  }
  weekPages() {
    if (this.model?.mode !== "week") {
      return [];
    }
    return this.model?.pages ?? [];
  }
  timelinePages() {
    if (this.model?.mode !== "timeline") {
      return [];
    }
    return this.model?.pages ?? [];
  }
  isMonthMode() {
    return this.model?.mode === "month";
  }
  isWeekMode() {
    return this.model?.mode === "week";
  }
  isCounterCalendarVariant() {
    return this.model?.variant === "counter";
  }
  calendarWeekdayLabels() {
    return this.calendar()?.weekdayLabels ?? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  }
  calendarWeekHours() {
    const startHour = this.calendarWeekStartHour();
    const endHour = this.calendarWeekEndHour();
    return Array.from({ length: Math.max(0, endHour - startHour + 1) }, (_value, index) => startHour + index);
  }
  weekHourLabel(hour) {
    return `${`${hour}`.padStart(2, "0")}:00`;
  }
  calendarCounterGranularity() {
    return this.calendar()?.counterGranularity ?? "hour";
  }
  calendarDayCounter(day) {
    const calendar = this.calendar();
    const query = this.query();
    if (!query) {
      return null;
    }
    const customCounter = calendar?.dayCounter?.(day, query) ?? null;
    if (customCounter) {
      return customCounter;
    }
    const count = day.items.length;
    return count > 0 ? this.counterFromCount(count) : null;
  }
  calendarHourCounter(day, hour) {
    const calendar = this.calendar();
    const query = this.query();
    if (!calendar || !query) {
      return null;
    }
    const customCounter = calendar.hourCounter?.(day, hour, query) ?? null;
    if (customCounter) {
      return customCounter;
    }
    const slotStart = new Date(day.date);
    slotStart.setHours(hour, 0, 0, 0);
    const slotEnd = new Date(slotStart);
    slotEnd.setHours(hour + 1, 0, 0, 0);
    const count = countSmartListCalendarOverlaps(day.items, slotStart, slotEnd, (item) => calendar.resolveDateRange(item, query));
    return count > 0 ? this.counterFromCount(count) : null;
  }
  weekDayTimedBadges(day) {
    const calendar = this.calendar();
    const query = this.query();
    if (!calendar || !query) {
      return [];
    }
    const dayStart = new Date(day.date);
    dayStart.setHours(this.calendarWeekStartHour(), 0, 0, 0);
    const dayEnd = new Date(day.date);
    dayEnd.setHours(this.calendarWeekEndHour() + 1, 0, 0, 0);
    const totalMinutes = Math.max(1, (dayEnd.getTime() - dayStart.getTime()) / 6e4);
    const badges = [];
    for (const item of day.items) {
      const range = calendar.resolveDateRange(item, query);
      if (!range) {
        continue;
      }
      const segmentStart = new Date(Math.max(range.start.getTime(), dayStart.getTime()));
      const segmentEnd = new Date(Math.min(range.end.getTime(), dayEnd.getTime()));
      if (segmentEnd.getTime() <= segmentStart.getTime()) {
        continue;
      }
      const minutesFromTop = (segmentStart.getTime() - dayStart.getTime()) / 6e4;
      const durationMinutes = (segmentEnd.getTime() - segmentStart.getTime()) / 6e4;
      badges.push({
        item,
        topPct: minutesFromTop / totalMinutes * 100,
        heightPct: Math.max(2.2, durationMinutes / totalMinutes * 100)
      });
    }
    return badges;
  }
  counterHeatClassByCount(count) {
    if (count <= 0) {
      return "calendar-counter-heat-0";
    }
    const clamped = Math.min(100, count);
    const normalized = (clamped - 1) / 99;
    if (normalized <= 0.16) {
      return "calendar-counter-heat-1";
    }
    if (normalized <= 0.32) {
      return "calendar-counter-heat-2";
    }
    if (normalized <= 0.5) {
      return "calendar-counter-heat-3";
    }
    if (normalized <= 0.68) {
      return "calendar-counter-heat-4";
    }
    if (normalized <= 0.84) {
      return "calendar-counter-heat-5";
    }
    return "calendar-counter-heat-6";
  }
  counterLabel(value) {
    if (!Number.isFinite(value) || value <= 0) {
      return "0";
    }
    return value > 99 ? "99+" : `${value}`;
  }
  calendarBadgeLabel(item) {
    const query = this.query();
    const label = query ? this.calendar()?.badgeLabel?.(item, query) : null;
    if (typeof label === "string" && label.trim()) {
      return label;
    }
    if (typeof item === "string" || typeof item === "number") {
      return String(item);
    }
    if (item && typeof item === "object") {
      const candidate = item.title ?? item.name ?? item.label;
      if (typeof candidate === "string" && candidate.trim()) {
        return candidate;
      }
    }
    return "Item";
  }
  calendarBadgeToneClass(item) {
    const query = this.query();
    return query ? this.calendar()?.badgeToneClass?.(item, query) ?? null : null;
  }
  calendarCounterClass(counter) {
    return counter?.toneClass ?? null;
  }
  selectCalendarDay(day, sourceEvent) {
    sourceEvent?.preventDefault();
    sourceEvent?.stopPropagation();
    const item = day.items[0] ?? null;
    if (!item) {
      return;
    }
    this.selectItem(item, sourceEvent, {
      calendarDate: new Date(day.date),
      calendarDateIso: day.key
    });
  }
  selectItem(item, sourceEvent, context) {
    this.model?.onItemSelect?.(item, sourceEvent, context);
  }
  selectTimelineSpan(span, sourceEvent) {
    if (!this.timelineItemInteractive()) {
      return;
    }
    sourceEvent?.preventDefault();
    sourceEvent?.stopPropagation();
    this.selectItem(span.item, sourceEvent, {
      timelineStartOffsetMinutes: span.startOffsetMinutes,
      timelineEndOffsetMinutes: span.endOffsetMinutes
    });
  }
  onTimelineSpanKeydown(span, event) {
    if (!this.timelineItemInteractive()) {
      return;
    }
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }
    this.selectTimelineSpan(span, event);
  }
  timelineRows(page) {
    return Array.from({ length: Math.max(1, page.rowCount) }, (_item, index) => index);
  }
  timelineItemContext(span, index) {
    return this.model?.itemContext?.(span.item, index) ?? null;
  }
  timelineItemTemplate() {
    if (!this.shouldUseTimelineItemTemplate()) {
      return null;
    }
    return this.model?.itemTemplate ?? null;
  }
  timelineItemInteractive() {
    const config = this.timeline();
    const query = this.query();
    const value = config?.itemInteractive;
    if (typeof value === "function" && query) {
      return value(query) === true;
    }
    if (typeof value === "boolean") {
      return value;
    }
    return !this.shouldUseTimelineItemTemplate();
  }
  shouldUseTimelineItemTemplate() {
    const config = this.timeline();
    const query = this.query();
    const value = config?.useItemTemplate;
    if (typeof value === "function" && query) {
      return value(query) === true;
    }
    return value === true;
  }
  calendarWeekStartHour() {
    return Math.max(0, Math.min(23, Math.trunc(this.calendar()?.weekStartHour ?? 0)));
  }
  calendarWeekEndHour() {
    return Math.max(this.calendarWeekStartHour(), Math.min(23, Math.trunc(this.calendar()?.weekEndHour ?? 23)));
  }
  calendarTrackKey(index, item) {
    return this.model?.trackByItem?.(index, item) ?? index;
  }
  calendar() {
    return this.model?.config ?? null;
  }
  timeline() {
    return this.model?.config ?? null;
  }
  query() {
    return this.model?.query ?? null;
  }
  counterFromCount(count) {
    return {
      label: this.counterLabel(count),
      toneClass: this.counterHeatClassByCount(count)
    };
  }
  static \u0275fac = function CalendarCardComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _CalendarCardComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _CalendarCardComponent, selectors: [["app-calendar-card"], ["app-smart-list-page-card"]], hostVars: 2, hostBindings: function CalendarCardComponent_HostBindings(rf, ctx) {
    if (rf & 2) {
      \u0275\u0275classProp("is-touching", ctx.isTouching);
    }
  }, inputs: { model: "model" }, ngContentSelectors: _c12, decls: 6, vars: 1, consts: [[1, "calendar-card__pages"], [1, "smart-list__page", "smart-list__page--month", "smart-list__calendar-page", "smart-list__calendar-page--month", 3, "--month-week-count", "smart-list__calendar-page--month-six-weeks", "smart-list__calendar-page--month-counter"], [1, "smart-list__page", "smart-list__page--month", "smart-list__calendar-page", "smart-list__calendar-page--month"], [1, "smart-list__calendar-weekdays"], [1, "smart-list__month-grid"], [1, "smart-list__month-week", 3, "smart-list__month-week--counter"], [1, "smart-list__month-week"], [1, "smart-list__month-cell", 3, "smart-list__month-cell--outside", "smart-list__month-cell--today", "smart-list__month-cell--counter"], [1, "smart-list__month-week-spans"], [1, "smart-list__month-cell"], [1, "smart-list__month-day-num"], ["type", "button", 1, "smart-list__month-counter", 3, "ngClass"], ["type", "button", 1, "smart-list__month-counter", 3, "click", "ngClass"], ["type", "button", 1, "smart-list__calendar-badge", "smart-list__month-span-badge", 3, "ngClass", "left", "width", "top"], ["type", "button", 1, "smart-list__calendar-badge", "smart-list__month-span-badge", 3, "click", "ngClass"], [1, "smart-list__page", "smart-list__page--week", "smart-list__calendar-page", "smart-list__calendar-page--week"], [1, "smart-list__week-board"], [1, "smart-list__week-board-corner"], [1, "smart-list__week-board-day-head", 3, "smart-list__week-board-day-head--today"], [1, "smart-list__week-hours-col"], [1, "smart-list__week-hour-label"], [1, "smart-list__week-day-col", 3, "smart-list__week-day-col--today", "smart-list__week-day-col--counter"], [1, "smart-list__week-board-day-head"], ["type", "button", 1, "smart-list__week-counter-head", 3, "ngClass"], ["type", "button", 1, "smart-list__week-counter-head", 3, "click", "ngClass"], [1, "smart-list__week-day-col"], [1, "smart-list__week-hour-slot", "smart-list__week-counter-slot"], ["type", "button", 1, "smart-list__week-hour-counter", 3, "ngClass"], ["type", "button", 1, "smart-list__week-hour-counter", 3, "click", "ngClass"], [1, "smart-list__week-hour-slot"], ["type", "button", 1, "smart-list__week-counter", 3, "ngClass"], ["type", "button", 1, "smart-list__week-counter", 3, "click", "ngClass"], ["type", "button", 1, "smart-list__calendar-badge", "smart-list__week-timed-badge", 3, "ngClass", "top", "height"], ["type", "button", 1, "smart-list__calendar-badge", "smart-list__week-timed-badge", 3, "click", "ngClass"], [1, "smart-list__page", "smart-list__page--timeline", "smart-list__timeline-page", 3, "--timeline-step-count"], [1, "smart-list__page", "smart-list__page--timeline", "smart-list__timeline-page"], [1, "smart-list__timeline-board"], [1, "smart-list__timeline-header"], [1, "smart-list__timeline-header-cell"], [1, "smart-list__timeline-grid"], [1, "smart-list__timeline-row"], [1, "smart-list__timeline-span", 3, "motion-static", "smart-list__timeline-span--static", "ngClass", "smart-list__timeline-span--template", "smart-list__timeline-span--continues-before", "smart-list__timeline-span--continues-after", "left", "width", "top", "height"], [1, "smart-list__timeline-cell"], [1, "smart-list__timeline-span", 3, "click", "keydown", "ngClass"], [3, "ngTemplateOutlet", "ngTemplateOutletContext", "ngTemplateOutletInjector"]], template: function CalendarCardComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275projectionDef(_c02);
      \u0275\u0275projection(0);
      \u0275\u0275projection(1, 1);
      \u0275\u0275elementStart(2, "div", 0);
      \u0275\u0275conditionalCreate(3, CalendarCardComponent_Conditional_3_Template, 2, 0)(4, CalendarCardComponent_Conditional_4_Template, 2, 0)(5, CalendarCardComponent_Conditional_5_Template, 2, 0);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275advance(3);
      \u0275\u0275conditional(ctx.isMonthMode() ? 3 : ctx.isWeekMode() ? 4 : 5);
    }
  }, dependencies: [CommonModule, NgClass, NgTemplateOutlet], styles: ["\n[_nghost-%COMP%] {\n  position: relative;\n  display: flex;\n  flex: 1 1 auto;\n  flex-direction: column;\n  align-items: stretch;\n  width: 100%;\n  min-height: 0;\n}\n.smart-list--presentation-fullscreen[_nghost-%COMP%], \n.smart-list--month[_nghost-%COMP%], \n.smart-list--week[_nghost-%COMP%], \n.smart-list--timeline[_nghost-%COMP%] {\n  height: 100%;\n}\n.smart-list--week[_nghost-%COMP%], \n.smart-list--timeline[_nghost-%COMP%] {\n  overflow-x: auto;\n  overflow-y: auto;\n}\n@media (max-width: 760px) {\n  .smart-list--timeline.smart-list--mobile-stepper[_nghost-%COMP%] {\n    scroll-snap-type: x mandatory;\n    scrollbar-width: none;\n    -ms-overflow-style: none;\n  }\n  .smart-list--timeline.smart-list--mobile-stepper[_nghost-%COMP%]::-webkit-scrollbar {\n    display: none;\n  }\n  .smart-list--timeline.smart-list--mobile-stepper[_nghost-%COMP%]   .smart-list__page--timeline[_ngcontent-%COMP%] {\n    scroll-snap-align: none;\n    scroll-snap-stop: normal;\n  }\n  .smart-list--timeline.smart-list--mobile-stepper[_nghost-%COMP%]   .smart-list__timeline-header-cell[_ngcontent-%COMP%] {\n    scroll-snap-align: start;\n    scroll-snap-stop: normal;\n  }\n}\n.smart-list--month[_nghost-%COMP%] {\n  overflow-x: auto;\n  overflow-y: clip;\n}\n.calendar-card__pages[_ngcontent-%COMP%] {\n  display: flex;\n  flex: 1 1 auto;\n  flex-direction: row;\n  align-items: stretch;\n  width: 100%;\n  min-width: 100%;\n  height: 100%;\n  min-height: 0;\n}\n.smart-list__calendar-page[_ngcontent-%COMP%] {\n  flex: 0 0 100%;\n  min-width: 100%;\n  max-width: 100%;\n  width: 100%;\n  height: 100%;\n  scroll-snap-align: start;\n  scroll-snap-stop: always;\n  touch-action: pan-x pan-y;\n  padding-right: 0;\n  padding-bottom: 0.48rem;\n  box-sizing: border-box;\n}\n.is-touching[_nghost-%COMP%]   .smart-list__calendar-page[_ngcontent-%COMP%] {\n  scroll-snap-align: none;\n  scroll-snap-stop: normal;\n}\n.smart-list__calendar-page--month[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-rows: auto minmax(0, 1fr);\n  min-width: 0;\n  min-height: 100%;\n  --month-week-count: 5;\n  overflow: hidden;\n}\n.smart-list__calendar-page--week[_ngcontent-%COMP%] {\n  min-height: 100%;\n  height: max-content;\n  padding-bottom: 0;\n  overflow: hidden;\n  contain: paint;\n  background: #fff;\n}\n.smart-list__page--timeline[_ngcontent-%COMP%] {\n  min-height: 100%;\n  height: max-content;\n  padding-bottom: 0;\n  overflow: hidden;\n  contain: paint;\n  background: #fff;\n}\n.smart-list__calendar-weekdays[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(7, minmax(0, 1fr));\n  gap: 0.24rem;\n  margin-bottom: 0.3rem;\n}\n.smart-list__calendar-weekdays[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  text-align: left;\n  color: rgba(31, 58, 92, 0.76);\n  font-size: 0.68rem;\n  font-weight: 800;\n  letter-spacing: 0.02em;\n  text-transform: uppercase;\n  padding-left: 0.28rem;\n}\n.smart-list__month-grid[_ngcontent-%COMP%] {\n  display: grid;\n  row-gap: 0.34rem;\n  column-gap: 0;\n  min-height: 0;\n  height: 100%;\n  width: 100%;\n  min-width: 0;\n  grid-template-rows: repeat(var(--month-week-count), minmax(0, 1fr));\n}\n.smart-list__month-week[_ngcontent-%COMP%] {\n  position: relative;\n  display: grid;\n  grid-template-columns: repeat(7, minmax(0, 1fr));\n  gap: 0.16rem;\n  min-height: 0;\n  width: 100%;\n  min-width: 0;\n}\n.smart-list__month-cell[_ngcontent-%COMP%] {\n  min-width: 0;\n  min-height: 6.2rem;\n  height: auto;\n  border: 1px solid rgba(37, 63, 96, 0.18);\n  border-radius: 10px;\n  background: #fff;\n  padding: 0.2rem;\n  box-sizing: border-box;\n  display: grid;\n  align-content: start;\n  gap: 0.12rem;\n}\n.smart-list__month-cell--outside[_ngcontent-%COMP%] {\n  background: #f6f8fc;\n}\n.smart-list__month-day-num[_ngcontent-%COMP%] {\n  justify-self: center;\n  color: #244267;\n  font-size: 0.7rem;\n  font-weight: 800;\n}\n.smart-list__month-cell--today[_ngcontent-%COMP%] {\n  box-shadow: inset 0 0 0 1px rgba(57, 108, 182, 0.42);\n}\n.smart-list__month-counter[_ngcontent-%COMP%] {\n  justify-self: start;\n  align-self: end;\n  min-width: 1.24rem;\n  min-height: 1.24rem;\n  border-radius: 999px;\n  border: 1px solid rgba(41, 69, 101, 0.25);\n  color: #13345a;\n  font-size: 0.62rem;\n  font-weight: 800;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  gap: 0.22rem;\n  padding: 0 0.22rem;\n  font: inherit;\n  cursor: pointer;\n  touch-action: pan-x pan-y;\n}\n.smart-list__month-cell--counter[_ngcontent-%COMP%] {\n  grid-template-rows: auto 1fr;\n  align-content: stretch;\n  align-items: stretch;\n  justify-items: center;\n  gap: 0;\n}\n.smart-list__month-cell--counter[_ngcontent-%COMP%]   .smart-list__month-day-num[_ngcontent-%COMP%] {\n  justify-self: center;\n  align-self: start;\n}\n.smart-list__month-cell--counter[_ngcontent-%COMP%]   .smart-list__month-counter[_ngcontent-%COMP%] {\n  justify-self: center;\n  align-self: center;\n}\n.smart-list__month-counter[_ngcontent-%COMP%], \n.smart-list__week-counter[_ngcontent-%COMP%], \n.smart-list__week-counter-head[_ngcontent-%COMP%], \n.smart-list__week-hour-counter[_ngcontent-%COMP%] {\n  border: 1px solid rgba(37, 63, 96, 0.18);\n  background: #eef7f0;\n  color: #1f5135;\n  font: inherit;\n  font-size: 0.68rem;\n  font-weight: 900;\n  line-height: 1.05;\n  cursor: pointer;\n  touch-action: pan-x pan-y;\n  box-sizing: border-box;\n  max-width: 100%;\n  white-space: normal;\n}\n.smart-list__month-counter[_ngcontent-%COMP%], \n.smart-list__week-counter[_ngcontent-%COMP%] {\n  display: inline-flex;\n  flex-wrap: wrap;\n  align-items: center;\n  justify-content: center;\n  gap: 0.22rem;\n  min-width: 0;\n  min-height: 1.48rem;\n  border-radius: 999px;\n  padding: 0.16rem 0.36rem;\n}\n.smart-list__month-counter[_ngcontent-%COMP%] {\n  justify-self: center;\n  align-self: center;\n  margin-top: 0.12rem;\n}\n.smart-list__month-counter[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%], \n.smart-list__week-counter[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%], \n.smart-list__week-counter-head[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%], \n.smart-list__week-hour-counter[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  display: inline-flex;\n  flex: 0 0 auto;\n  align-items: center;\n  justify-content: center;\n  min-width: 1rem;\n  min-height: 1rem;\n  border-radius: 999px;\n  background: #c93838;\n  color: #fff;\n  font-size: 0.56rem;\n  font-weight: 900;\n  line-height: 1;\n  padding: 0 0.2rem;\n  box-sizing: border-box;\n}\n.smart-list__month-counter[_ngcontent-%COMP%]   span[_ngcontent-%COMP%], \n.smart-list__week-counter[_ngcontent-%COMP%]   span[_ngcontent-%COMP%], \n.smart-list__week-counter-head[_ngcontent-%COMP%]   span[_ngcontent-%COMP%], \n.smart-list__week-hour-counter[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  min-width: 0;\n  white-space: nowrap;\n}\n.smart-list__month-counter.calendar-counter-empty[_ngcontent-%COMP%], \n.smart-list__week-counter.calendar-counter-empty[_ngcontent-%COMP%], \n.smart-list__week-counter-head.calendar-counter-empty[_ngcontent-%COMP%], \n.smart-list__week-hour-counter.calendar-counter-empty[_ngcontent-%COMP%] {\n  background: #f4f7fb;\n  color: #5a6f88;\n}\n.smart-list__month-counter.calendar-counter-full[_ngcontent-%COMP%], \n.smart-list__week-counter.calendar-counter-full[_ngcontent-%COMP%], \n.smart-list__week-counter-head.calendar-counter-full[_ngcontent-%COMP%], \n.smart-list__week-hour-counter.calendar-counter-full[_ngcontent-%COMP%] {\n  background: #f4f7fb;\n  border-color: rgba(105, 119, 140, 0.28);\n  color: #5a4658;\n}\n.smart-list__month-counter.calendar-counter-booked-full[_ngcontent-%COMP%], \n.smart-list__week-counter.calendar-counter-booked-full[_ngcontent-%COMP%], \n.smart-list__week-counter-head.calendar-counter-booked-full[_ngcontent-%COMP%], \n.smart-list__week-hour-counter.calendar-counter-booked-full[_ngcontent-%COMP%] {\n  background: #fff3e4;\n  border-color: rgba(183, 113, 37, 0.3);\n  color: #7a4515;\n}\n.smart-list__month-counter.calendar-counter-over[_ngcontent-%COMP%], \n.smart-list__week-counter.calendar-counter-over[_ngcontent-%COMP%], \n.smart-list__week-counter-head.calendar-counter-over[_ngcontent-%COMP%], \n.smart-list__week-hour-counter.calendar-counter-over[_ngcontent-%COMP%] {\n  background: #fff0f0;\n  border-color: rgba(196, 60, 60, 0.34);\n  color: #8a2828;\n}\n.smart-list__month-week-spans[_ngcontent-%COMP%] {\n  position: absolute;\n  inset: 0;\n  pointer-events: none;\n}\n.smart-list__calendar-badge[_ngcontent-%COMP%] {\n  width: 100%;\n  border: 1px solid rgba(39, 70, 108, 0.2);\n  border-radius: 999px;\n  background:\n    linear-gradient(\n      180deg,\n      #eef4ff 0%,\n      #e8f0ff 100%);\n  color: #214268;\n  font: inherit;\n  font-size: 0.68rem;\n  font-weight: 700;\n  line-height: 1.2;\n  text-align: left;\n  padding: 0.16rem 0.42rem;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: clip;\n  cursor: pointer;\n  touch-action: pan-x pan-y;\n}\n.smart-list__calendar-badge.calendar-badge-tone-1[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #e8f2ff 0%,\n      #dce9ff 100%);\n  border-color: rgba(50, 102, 178, 0.3);\n  color: #214a82;\n}\n.smart-list__calendar-badge.calendar-badge-tone-2[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #e8f8f0 0%,\n      #dbf0e5 100%);\n  border-color: rgba(41, 128, 90, 0.28);\n  color: #1f5a41;\n}\n.smart-list__calendar-badge.calendar-badge-tone-3[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #fff2e6 0%,\n      #ffe8d5 100%);\n  border-color: rgba(178, 105, 38, 0.3);\n  color: #7f4b1e;\n}\n.smart-list__calendar-badge.calendar-badge-tone-4[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f2ecff 0%,\n      #e8deff 100%);\n  border-color: rgba(104, 74, 173, 0.28);\n  color: #4f3b84;\n}\n.smart-list__calendar-badge.calendar-badge-tone-5[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #e9fbff 0%,\n      #dcf4fa 100%);\n  border-color: rgba(43, 125, 154, 0.28);\n  color: #23586f;\n}\n.smart-list__calendar-badge.calendar-badge-tone-6[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #fff4f7 0%,\n      #ffe8ef 100%);\n  border-color: rgba(180, 74, 112, 0.28);\n  color: #7e2f4f;\n}\n.smart-list__calendar-badge.calendar-badge-tone-7[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f7f9e9 0%,\n      #edf3d9 100%);\n  border-color: rgba(106, 135, 43, 0.28);\n  color: #4f6520;\n}\n.smart-list__calendar-badge.calendar-badge-tone-8[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f1f3f7 0%,\n      #e6ebf2 100%);\n  border-color: rgba(78, 98, 128, 0.28);\n  color: #2f435e;\n}\n.smart-list__month-span-badge[_ngcontent-%COMP%] {\n  position: absolute;\n  pointer-events: auto;\n  z-index: 3;\n  width: auto;\n  display: flex;\n  align-items: center;\n  justify-content: flex-start;\n  min-height: 18px;\n  padding: 0.1rem 0.34rem;\n}\n.smart-list__week-board[_ngcontent-%COMP%] {\n  --week-slot-h: 34px;\n  --week-slot-count: 24;\n  display: grid;\n  grid-template-columns: 34px repeat(7, minmax(0, 1fr));\n  grid-template-rows: auto auto;\n  gap: 0;\n  min-height: max(100%, var(--week-slot-count) * var(--week-slot-h) + 34px);\n  touch-action: pan-x pan-y;\n}\n.smart-list__week-board-corner[_ngcontent-%COMP%] {\n  border: 1px solid rgba(37, 63, 96, 0.18);\n  border-bottom: 0;\n  border-right: 0;\n  border-radius: 10px 0 0 0;\n  background: #f6f9ff;\n}\n.smart-list__week-board-day-head[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  border: 1px solid rgba(37, 63, 96, 0.18);\n  border-left: 0;\n  border-bottom: 0;\n  background: #fff;\n  gap: 0.06rem;\n  padding: 0.18rem 0.14rem;\n  color: #244267;\n  font-size: 0.62rem;\n  font-weight: 700;\n  line-height: 1;\n}\n.smart-list__week-board-day-head[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  font-size: 0.78rem;\n  font-weight: 900;\n}\n.smart-list__week-counter-head[_ngcontent-%COMP%] {\n  margin-top: 0.1rem;\n  min-width: 1.24rem;\n  min-height: 1.24rem;\n  border-radius: 999px;\n  border: 1px solid rgba(41, 69, 101, 0.25);\n  color: #13345a;\n  font-size: 0.62rem;\n  font-weight: 800;\n  display: inline-flex;\n  flex-wrap: wrap;\n  align-items: center;\n  justify-content: center;\n  gap: 0.14rem;\n  padding: 0 0.22rem;\n  font: inherit;\n  cursor: pointer;\n  touch-action: pan-x pan-y;\n}\n.smart-list__week-counter-head[_ngcontent-%COMP%] {\n  margin-top: 0.08rem;\n  min-height: 1.16rem;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  gap: 0.14rem;\n  border-radius: 999px;\n  padding: 0.1rem 0.24rem;\n  font-size: 0.58rem;\n}\n.smart-list__week-board-day-head--today[_ngcontent-%COMP%] {\n  box-shadow: inset 0 0 0 1px rgba(57, 108, 182, 0.42);\n}\n.smart-list__week-hours-col[_ngcontent-%COMP%] {\n  border: 1px solid rgba(37, 63, 96, 0.18);\n  border-top: 0;\n  border-right: 0;\n  border-radius: 0 0 0 10px;\n  overflow: hidden;\n  display: grid;\n  grid-auto-rows: var(--week-slot-h);\n  align-content: start;\n  background: #fff;\n  background-image:\n    repeating-linear-gradient(\n      to bottom,\n      transparent 0,\n      transparent calc(var(--week-slot-h) - 1px),\n      rgba(33, 54, 82, 0.12) calc(var(--week-slot-h) - 1px),\n      rgba(33, 54, 82, 0.12) var(--week-slot-h));\n  height: calc(var(--week-slot-count) * var(--week-slot-h));\n}\n.smart-list__week-hour-label[_ngcontent-%COMP%] {\n  padding: 0.28rem 0.12rem 0 0.18rem;\n  color: rgba(37, 63, 96, 0.72);\n  font-size: 0.62rem;\n  font-weight: 700;\n  line-height: 1;\n}\n.smart-list__week-day-col[_ngcontent-%COMP%] {\n  position: relative;\n  border: 1px solid rgba(37, 63, 96, 0.18);\n  border-left: 0;\n  border-top: 0;\n  background: #fff;\n  overflow: hidden;\n  display: grid;\n  grid-auto-rows: var(--week-slot-h);\n  align-content: start;\n  background-image:\n    repeating-linear-gradient(\n      to bottom,\n      transparent 0,\n      transparent calc(var(--week-slot-h) - 1px),\n      rgba(33, 54, 82, 0.12) calc(var(--week-slot-h) - 1px),\n      rgba(33, 54, 82, 0.12) var(--week-slot-h));\n  height: calc(var(--week-slot-count) * var(--week-slot-h));\n}\n.smart-list__week-day-col[_ngcontent-%COMP%]:last-child {\n  border-radius: 0 0 10px 0;\n}\n.smart-list__week-day-col--today[_ngcontent-%COMP%] {\n  box-shadow: inset 0 0 0 1px rgba(57, 108, 182, 0.42);\n}\n.smart-list__week-hour-slot[_ngcontent-%COMP%] {\n  height: var(--week-slot-h);\n  border: 0;\n}\n.smart-list__week-counter-slot[_ngcontent-%COMP%] {\n  border-top: 1px solid rgba(33, 54, 82, 0.12);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.smart-list__week-counter-slot[_ngcontent-%COMP%]:first-child {\n  border-top: 0;\n}\n.smart-list__week-hour-counter[_ngcontent-%COMP%] {\n  min-width: 1.18rem;\n  min-height: 1.18rem;\n  border-radius: 999px;\n  border: 1px solid rgba(41, 69, 101, 0.25);\n  color: #13345a;\n  font-size: 0.62rem;\n  font-weight: 800;\n  display: inline-flex;\n  flex-wrap: wrap;\n  align-items: center;\n  justify-content: center;\n  gap: 0.14rem;\n  padding: 0 0.18rem;\n  font: inherit;\n  cursor: pointer;\n  touch-action: pan-x pan-y;\n}\n.smart-list__week-counter[_ngcontent-%COMP%] {\n  position: absolute;\n  z-index: 2;\n  left: 4px;\n  right: 4px;\n  top: 8px;\n  min-height: 1.7rem;\n}\n.smart-list__week-timed-badge[_ngcontent-%COMP%] {\n  position: absolute;\n  left: 2px;\n  right: 2px;\n  width: auto;\n  z-index: 2;\n  border-radius: 8px;\n  padding: 0.12rem 0.26rem;\n  white-space: normal;\n  text-wrap: pretty;\n  overflow: clip;\n  text-overflow: clip;\n  word-break: break-word;\n  overflow-wrap: anywhere;\n  line-break: auto;\n  -webkit-hyphens: auto;\n  hyphens: auto;\n  display: flex;\n  align-items: flex-start;\n}\n.smart-list__week-timed-badge[_ngcontent-%COMP%]    > span[_ngcontent-%COMP%] {\n  display: block;\n  width: 100%;\n  white-space: normal;\n  word-break: break-word;\n  overflow-wrap: anywhere;\n  line-height: 1.15;\n}\n.smart-list__timeline-board[_ngcontent-%COMP%] {\n  --timeline-step-count: 8;\n  --timeline-row-count: 1;\n  --timeline-row-h: 64px;\n  display: grid;\n  grid-template-rows: auto auto;\n  width: 100%;\n  min-width: 0;\n  min-height: max(100%, var(--timeline-row-count) * var(--timeline-row-h) + 34px);\n  border: 1px solid rgba(37, 63, 96, 0.18);\n  border-radius: 10px;\n  background: #fff;\n  overflow: hidden;\n  touch-action: pan-x pan-y;\n}\n.smart-list__timeline-header[_ngcontent-%COMP%] {\n  position: sticky;\n  top: 0;\n  z-index: 4;\n  display: grid;\n  grid-template-columns: repeat(var(--timeline-step-count), minmax(0, 1fr));\n  min-height: 34px;\n  background: #f6f9ff;\n  border-bottom: 1px solid rgba(37, 63, 96, 0.18);\n}\n.smart-list__timeline-header-cell[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  min-width: 0;\n  padding: 0.28rem 0.4rem;\n  border-left: 1px solid rgba(37, 63, 96, 0.14);\n  color: rgba(37, 63, 96, 0.78);\n  font-size: 0.64rem;\n  font-weight: 850;\n  line-height: 1;\n  box-sizing: border-box;\n}\n.smart-list__timeline-header-cell[_ngcontent-%COMP%]:first-child {\n  border-left: 0;\n}\n.smart-list__timeline-header-cell[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  display: block;\n  min-width: 0;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.smart-list__timeline-grid[_ngcontent-%COMP%] {\n  position: relative;\n  display: grid;\n  grid-template-rows: repeat(var(--timeline-row-count), var(--timeline-row-h));\n  min-height: calc(var(--timeline-row-count) * var(--timeline-row-h));\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 255, 255, 0.96) 0%,\n      rgba(249, 251, 255, 0.98) 100%);\n}\n.smart-list__timeline-row[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(var(--timeline-step-count), minmax(0, 1fr));\n  min-width: 0;\n  min-height: 0;\n}\n.smart-list__timeline-row[_ngcontent-%COMP%]    + .smart-list__timeline-row[_ngcontent-%COMP%] {\n  border-top: 1px solid rgba(37, 63, 96, 0.12);\n}\n.smart-list__timeline-cell[_ngcontent-%COMP%] {\n  min-width: 0;\n  min-height: 0;\n  border-left: 1px solid rgba(37, 63, 96, 0.1);\n  background: rgba(255, 255, 255, 0.42);\n}\n.smart-list__timeline-cell[_ngcontent-%COMP%]:first-child {\n  border-left: 0;\n}\n.smart-list__timeline-span[_ngcontent-%COMP%] {\n  position: absolute;\n  z-index: 3;\n  display: flex;\n  flex-direction: column;\n  align-items: flex-start;\n  justify-content: center;\n  gap: 0.1rem;\n  min-width: 2.8rem;\n  border: 1px solid rgba(39, 70, 108, 0.22);\n  border-radius: 8px;\n  background:\n    linear-gradient(\n      180deg,\n      #eef4ff 0%,\n      #e7efff 100%);\n  color: #214268;\n  box-shadow: 0 5px 14px rgba(36, 65, 104, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.72);\n  font: inherit;\n  font-size: 0.7rem;\n  font-weight: 800;\n  line-height: 1.15;\n  text-align: left;\n  padding: 0.24rem 0.42rem;\n  overflow: hidden;\n  cursor: pointer;\n  touch-action: pan-x pan-y;\n  box-sizing: border-box;\n}\n.smart-list__timeline-span--template[_ngcontent-%COMP%] {\n  min-width: 6.5rem;\n  border: 0;\n  border-radius: 8px;\n  background: transparent;\n  box-shadow: none;\n  padding: 0;\n  overflow: visible;\n}\n.smart-list__timeline-span--static[_ngcontent-%COMP%] {\n  cursor: default;\n  -webkit-tap-highlight-color: transparent;\n  transition: none;\n  animation: none;\n  transform: none;\n  filter: none;\n}\n.smart-list__timeline-span[_ngcontent-%COMP%]:focus-visible {\n  outline: 2px solid rgba(57, 108, 182, 0.62);\n  outline-offset: 2px;\n}\n.smart-list__timeline-span--continues-before[_ngcontent-%COMP%] {\n  border-top-left-radius: 2px;\n  border-bottom-left-radius: 2px;\n}\n.smart-list__timeline-span--continues-after[_ngcontent-%COMP%] {\n  border-top-right-radius: 2px;\n  border-bottom-right-radius: 2px;\n}\n.smart-list__timeline-span[_ngcontent-%COMP%]    > span[_ngcontent-%COMP%], \n.smart-list__timeline-span[_ngcontent-%COMP%]    > small[_ngcontent-%COMP%] {\n  display: block;\n  width: 100%;\n  min-width: 0;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.smart-list__timeline-span[_ngcontent-%COMP%]    > span[_ngcontent-%COMP%] {\n  white-space: nowrap;\n}\n.smart-list__timeline-span[_ngcontent-%COMP%]    > small[_ngcontent-%COMP%] {\n  color: rgba(35, 61, 95, 0.72);\n  font-size: 0.58rem;\n  font-weight: 750;\n  line-height: 1.12;\n  white-space: normal;\n  word-break: break-word;\n  overflow-wrap: anywhere;\n}\n[_nghost-%COMP%]     .smart-list__timeline-span > * {\n  width: 100%;\n  max-width: 100%;\n  min-width: 0;\n}\n.smart-list__timeline-span.calendar-badge-tone-1[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #e8f2ff 0%,\n      #dce9ff 100%);\n  border-color: rgba(50, 102, 178, 0.3);\n  color: #214a82;\n}\n.smart-list__timeline-span.calendar-badge-tone-2[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #e8f8f0 0%,\n      #dbf0e5 100%);\n  border-color: rgba(41, 128, 90, 0.28);\n  color: #1f5a41;\n}\n.smart-list__timeline-span.calendar-badge-tone-3[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #fff2e6 0%,\n      #ffe8d5 100%);\n  border-color: rgba(178, 105, 38, 0.3);\n  color: #7f4b1e;\n}\n.smart-list__timeline-span.calendar-badge-tone-4[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f2ecff 0%,\n      #e8deff 100%);\n  border-color: rgba(104, 74, 173, 0.28);\n  color: #4f3b84;\n}\n.smart-list__timeline-span.calendar-badge-tone-5[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #e9fbff 0%,\n      #dcf4fa 100%);\n  border-color: rgba(43, 125, 154, 0.28);\n  color: #23586f;\n}\n.smart-list__timeline-span.calendar-badge-tone-6[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #fff4f7 0%,\n      #ffe8ef 100%);\n  border-color: rgba(180, 74, 112, 0.28);\n  color: #7e2f4f;\n}\n.smart-list__month-counter.calendar-counter-heat-0[_ngcontent-%COMP%], \n.smart-list__week-counter-head.calendar-counter-heat-0[_ngcontent-%COMP%], \n.smart-list__week-hour-counter.calendar-counter-heat-0[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f4f7fb 0%,\n      #e8eef7 100%);\n  border-color: rgba(97, 120, 154, 0.18);\n  color: #6a7890;\n}\n.smart-list__month-counter.calendar-counter-heat-1[_ngcontent-%COMP%], \n.smart-list__week-counter-head.calendar-counter-heat-1[_ngcontent-%COMP%], \n.smart-list__week-hour-counter.calendar-counter-heat-1[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #eef5ff 0%,\n      #dfeafb 100%);\n  border-color: rgba(70, 118, 183, 0.22);\n  color: #2d5c99;\n}\n.smart-list__month-counter.calendar-counter-heat-2[_ngcontent-%COMP%], \n.smart-list__week-counter-head.calendar-counter-heat-2[_ngcontent-%COMP%], \n.smart-list__week-hour-counter.calendar-counter-heat-2[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #e8f8f3 0%,\n      #d8f1e7 100%);\n  border-color: rgba(55, 146, 104, 0.24);\n  color: #256d4d;\n}\n.smart-list__month-counter.calendar-counter-heat-3[_ngcontent-%COMP%], \n.smart-list__week-counter-head.calendar-counter-heat-3[_ngcontent-%COMP%], \n.smart-list__week-hour-counter.calendar-counter-heat-3[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #fff6e7 0%,\n      #ffecce 100%);\n  border-color: rgba(198, 145, 45, 0.24);\n  color: #8f6115;\n}\n.smart-list__month-counter.calendar-counter-heat-4[_ngcontent-%COMP%], \n.smart-list__week-counter-head.calendar-counter-heat-4[_ngcontent-%COMP%], \n.smart-list__week-hour-counter.calendar-counter-heat-4[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #fff0e7 0%,\n      #ffe2d2 100%);\n  border-color: rgba(200, 116, 61, 0.26);\n  color: #9b4f23;\n}\n.smart-list__month-counter.calendar-counter-heat-5[_ngcontent-%COMP%], \n.smart-list__week-counter-head.calendar-counter-heat-5[_ngcontent-%COMP%], \n.smart-list__week-hour-counter.calendar-counter-heat-5[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #ffeaf0 0%,\n      #ffd7e2 100%);\n  border-color: rgba(196, 77, 121, 0.28);\n  color: #9d2d57;\n}\n.smart-list__month-counter.calendar-counter-heat-6[_ngcontent-%COMP%], \n.smart-list__week-counter-head.calendar-counter-heat-6[_ngcontent-%COMP%], \n.smart-list__week-hour-counter.calendar-counter-heat-6[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f0e6ff 0%,\n      #e2d3ff 100%);\n  border-color: rgba(113, 82, 193, 0.28);\n  color: #5a3d9d;\n}\n@media (max-width: 760px) {\n  .smart-list__calendar-page--month[_ngcontent-%COMP%] {\n    width: 100%;\n    min-width: 100%;\n    max-width: 100%;\n    min-height: auto;\n    height: auto;\n    padding-bottom: 0.08rem;\n    overflow: hidden;\n    background: #fff;\n    contain: paint;\n    box-shadow: -1px 0 0 #fff, 1px 0 0 #fff;\n  }\n  .smart-list__calendar-page--month-counter[_ngcontent-%COMP%] {\n    grid-template-rows: auto auto;\n  }\n  .smart-list__month-grid[_ngcontent-%COMP%], \n   .smart-list__month-grid--counter[_ngcontent-%COMP%] {\n    display: flex;\n    flex-direction: column;\n    gap: 0.44rem;\n    height: auto;\n    min-height: 0;\n    width: 100%;\n    min-width: 0;\n  }\n  .smart-list__month-week[_ngcontent-%COMP%], \n   .smart-list__month-week--counter[_ngcontent-%COMP%] {\n    flex: 0 0 5.6rem;\n    height: 5.6rem;\n    min-height: 5.6rem;\n    gap: 0.8rem;\n    width: 100%;\n    min-width: 0;\n    box-sizing: border-box;\n  }\n  .smart-list__month-week[_ngcontent-%COMP%]   .smart-list__month-cell[_ngcontent-%COMP%], \n   .smart-list__month-week--counter[_ngcontent-%COMP%]   .smart-list__month-cell[_ngcontent-%COMP%] {\n    min-height: 0;\n    height: 100%;\n    padding: 0.14rem;\n    border-radius: 9px;\n  }\n  .smart-list__calendar-page--month-six-weeks[_ngcontent-%COMP%]   .smart-list__month-week[_ngcontent-%COMP%], \n   .smart-list__calendar-page--month-six-weeks[_ngcontent-%COMP%]   .smart-list__month-week--counter[_ngcontent-%COMP%] {\n    flex: 0 0 4.72rem;\n    height: 4.72rem;\n    min-height: 4.72rem;\n  }\n  .smart-list__month-week--counter[_ngcontent-%COMP%]   .smart-list__month-cell--counter[_ngcontent-%COMP%] {\n    grid-template-rows: auto 1fr;\n    align-content: stretch;\n    align-items: stretch;\n    justify-items: center;\n    gap: 0;\n  }\n  .smart-list__month-week--counter[_ngcontent-%COMP%]   .smart-list__month-day-num[_ngcontent-%COMP%] {\n    justify-self: center;\n    align-self: start;\n    font-size: 0.62rem;\n  }\n  .smart-list__month-week--counter[_ngcontent-%COMP%]   .smart-list__month-counter[_ngcontent-%COMP%] {\n    min-width: 0.94rem;\n    min-height: 0.94rem;\n    font-size: 0.56rem;\n    line-height: 1.05;\n    padding: 0.08rem 0.16rem;\n    gap: 0.12rem;\n    justify-self: center;\n    align-self: center;\n  }\n  .smart-list__week-counter[_ngcontent-%COMP%], \n   .smart-list__week-counter-head[_ngcontent-%COMP%], \n   .smart-list__week-hour-counter[_ngcontent-%COMP%] {\n    min-height: 1.16rem;\n    font-size: 0.56rem;\n    line-height: 1.05;\n    padding: 0.08rem 0.16rem;\n    gap: 0.12rem;\n  }\n  .smart-list__week-counter[_ngcontent-%COMP%] {\n    left: 2px;\n    right: 2px;\n    min-height: 1.18rem;\n  }\n  .smart-list__month-counter[_ngcontent-%COMP%]:has(strong), \n   .smart-list__week-counter[_ngcontent-%COMP%]:has(strong), \n   .smart-list__week-counter-head[_ngcontent-%COMP%]:has(strong), \n   .smart-list__week-hour-counter[_ngcontent-%COMP%]:has(strong) {\n    flex-direction: column;\n    flex-wrap: nowrap;\n    min-width: 1.38rem;\n    min-height: 1.86rem;\n    padding: 0.14rem 0.16rem;\n    gap: 0.08rem;\n  }\n  .smart-list__month-counter[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%], \n   .smart-list__week-counter[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%], \n   .smart-list__week-counter-head[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%], \n   .smart-list__week-hour-counter[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n    min-width: 0.9rem;\n    min-height: 0.9rem;\n    font-size: 0.52rem;\n    padding: 0 0.16rem;\n  }\n}\n/*# sourceMappingURL=calendar-card.component.css.map */"], changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CalendarCardComponent, [{
    type: Component,
    args: [{ selector: "app-calendar-card, app-smart-list-page-card", standalone: true, imports: [CommonModule], changeDetection: ChangeDetectionStrategy.OnPush, template: `<ng-content select="[smart-list-page-card-header]"></ng-content>
<ng-content select="[calendar-card-header]"></ng-content>

<div class="calendar-card__pages">
  @if (isMonthMode()) {
    @for (page of monthPages(); track trackByCalendarPageKey($index, page)) {
      <section
        class="smart-list__page smart-list__page--month smart-list__calendar-page smart-list__calendar-page--month"
        [style.--month-week-count]="page.weeks.length"
        [class.smart-list__calendar-page--month-six-weeks]="page.weeks.length === 6"
        [class.smart-list__calendar-page--month-counter]="isCounterCalendarVariant()"
      >
        <div class="smart-list__calendar-weekdays">
          @for (dayLabel of calendarWeekdayLabels(); track dayLabel) {
            <span>{{ dayLabel }}</span>
          }
        </div>
        <div class="smart-list__month-grid" [class.smart-list__month-grid--counter]="isCounterCalendarVariant()">
          @for (week of page.weeks; track trackByCalendarMonthWeekKey($index, week)) {
            <div
              class="smart-list__month-week"
              [class.smart-list__month-week--counter]="isCounterCalendarVariant()"
            >
              @for (day of week.days; track trackByCalendarDayKey($index, day)) {
                <div
                  class="smart-list__month-cell"
                  [class.smart-list__month-cell--outside]="!day.inCurrentMonth"
                  [class.smart-list__month-cell--today]="day.isToday"
                  [class.smart-list__month-cell--counter]="isCounterCalendarVariant()"
                >
                  <div class="smart-list__month-day-num">{{ day.dayNumber }}</div>
                  @if (isCounterCalendarVariant() && calendarDayCounter(day); as counter) {
                    <button
                      type="button"
                      class="smart-list__month-counter"
                      [ngClass]="calendarCounterClass(counter)"
                      [attr.aria-label]="counter.ariaLabel || counter.label"
                      (click)="selectCalendarDay(day, $event)"
                    >
                      <span>{{ counter.label }}</span>
                      @if (counter.alertLabel) {
                        <strong [attr.aria-label]="counter.alertAriaLabel || null">{{ counter.alertLabel }}</strong>
                      }
                    </button>
                  }
                </div>
              }
              @if (!isCounterCalendarVariant() && week.spans.length > 0) {
                <div class="smart-list__month-week-spans">
                  @for (span of week.spans; track trackByCalendarSpanKey($index, span)) {
                    <button
                      type="button"
                      class="smart-list__calendar-badge smart-list__month-span-badge"
                      [ngClass]="calendarBadgeToneClass(span.item)"
                      [style.left.%]="(span.startCol * 100) / 7"
                      [style.width.%]="((span.endCol - span.startCol + 1) * 100) / 7"
                      [style.top.px]="18 + (span.lane * 20)"
                      (click)="selectItem(span.item, $event)"
                    >
                      <span>{{ calendarBadgeLabel(span.item) }}</span>
                    </button>
                  }
                </div>
              }
            </div>
          }
        </div>
      </section>
    }
  } @else if (isWeekMode()) {
    @for (page of weekPages(); track trackByCalendarPageKey($index, page)) {
      <section class="smart-list__page smart-list__page--week smart-list__calendar-page smart-list__calendar-page--week">
        <div class="smart-list__week-board" [style.--week-slot-count]="calendarWeekHours().length">
          <div class="smart-list__week-board-corner"></div>
          @for (day of page.days; track trackByCalendarDayKey($index, day); let dayIndex = $index) {
            <div
              class="smart-list__week-board-day-head"
              [class.smart-list__week-board-day-head--today]="day.isToday"
            >
              <span>{{ calendarWeekdayLabels()[dayIndex] }}</span>
              <strong>{{ day.dayNumber }}</strong>
              @if (isCounterCalendarVariant() && calendarDayCounter(day); as counter) {
                <button
                  type="button"
                  class="smart-list__week-counter-head"
                  [ngClass]="calendarCounterClass(counter)"
                  [attr.aria-label]="counter.ariaLabel || counter.label"
                  (click)="selectCalendarDay(day, $event)"
                >
                  <span>{{ counter.label }}</span>
                  @if (counter.alertLabel) {
                    <strong [attr.aria-label]="counter.alertAriaLabel || null">{{ counter.alertLabel }}</strong>
                  }
                </button>
              }
            </div>
          }
          <div class="smart-list__week-hours-col">
            @for (hour of calendarWeekHours(); track hour) {
              <div class="smart-list__week-hour-label">
                {{ weekHourLabel(hour) }}
              </div>
            }
          </div>
          @for (day of page.days; track trackByCalendarDayKey($index, day)) {
            <div
              class="smart-list__week-day-col"
              [class.smart-list__week-day-col--today]="day.isToday"
              [class.smart-list__week-day-col--counter]="isCounterCalendarVariant()"
            >
              @if (isCounterCalendarVariant() && calendarCounterGranularity() === 'hour') {
                @for (hour of calendarWeekHours(); track hour) {
                  <div class="smart-list__week-hour-slot smart-list__week-counter-slot">
                    @if (calendarHourCounter(day, hour); as counter) {
                      <button
                        type="button"
                        class="smart-list__week-hour-counter"
                        [ngClass]="calendarCounterClass(counter)"
                        [attr.aria-label]="counter.ariaLabel || counter.label"
                        (click)="selectCalendarDay(day, $event)"
                      >
                        <span>{{ counter.label }}</span>
                        @if (counter.alertLabel) {
                          <strong [attr.aria-label]="counter.alertAriaLabel || null">{{ counter.alertLabel }}</strong>
                        }
                      </button>
                    }
                  </div>
                }
              } @else if (isCounterCalendarVariant()) {
                @for (hour of calendarWeekHours(); track hour) {
                  <div class="smart-list__week-hour-slot"></div>
                }
                @if (calendarDayCounter(day); as counter) {
                  <button
                    type="button"
                    class="smart-list__week-counter"
                    [ngClass]="calendarCounterClass(counter)"
                    [attr.aria-label]="counter.ariaLabel || counter.label"
                    (click)="selectCalendarDay(day, $event)"
                  >
                    <span>{{ counter.label }}</span>
                    @if (counter.alertLabel) {
                      <strong [attr.aria-label]="counter.alertAriaLabel || null">{{ counter.alertLabel }}</strong>
                    }
                  </button>
                }
              } @else {
                @for (hour of calendarWeekHours(); track hour) {
                  <div class="smart-list__week-hour-slot"></div>
                }
                @for (badge of weekDayTimedBadges(day); track trackByCalendarTimedBadge($index, badge)) {
                  <button
                    type="button"
                    class="smart-list__calendar-badge smart-list__week-timed-badge"
                    [ngClass]="calendarBadgeToneClass(badge.item)"
                    [style.top.%]="badge.topPct"
                    [style.height.%]="badge.heightPct"
                    (click)="selectItem(badge.item, $event)"
                  >
                    <span>{{ calendarBadgeLabel(badge.item) }}</span>
                  </button>
                }
              }
            </div>
          }
        </div>
      </section>
    }
  } @else {
    @for (page of timelinePages(); track trackByCalendarPageKey($index, page)) {
      <section
        class="smart-list__page smart-list__page--timeline smart-list__timeline-page"
        [style.--timeline-step-count]="page.ticks.length"
      >
        <div
          class="smart-list__timeline-board"
          [style.--timeline-step-count]="page.ticks.length"
          [style.--timeline-row-count]="page.rowCount"
          [style.--timeline-row-h]="page.rowHeightPx + 'px'"
        >
          <div class="smart-list__timeline-header">
            @for (tick of page.ticks; track trackByTimelineTickKey($index, tick)) {
              <div class="smart-list__timeline-header-cell">
                <span>{{ tick.label }}</span>
              </div>
            }
          </div>
          <div class="smart-list__timeline-grid">
            @for (row of timelineRows(page); track row) {
              <div class="smart-list__timeline-row">
                @for (tick of page.ticks; track trackByTimelineTickKey($index, tick)) {
                  <div class="smart-list__timeline-cell"></div>
                }
              </div>
            }
            @for (span of page.spans; track trackByTimelineSpanKey($index, span)) {
              <div
                class="smart-list__timeline-span"
                [class.motion-static]="!timelineItemInteractive()"
                [class.smart-list__timeline-span--static]="!timelineItemInteractive()"
                [attr.role]="timelineItemInteractive() ? 'button' : null"
                [attr.tabindex]="timelineItemInteractive() ? 0 : null"
                [ngClass]="span.toneClass"
                [class.smart-list__timeline-span--template]="timelineItemTemplate() !== null"
                [class.smart-list__timeline-span--continues-before]="span.continuesBefore"
                [class.smart-list__timeline-span--continues-after]="span.continuesAfter"
                [style.left.%]="span.leftPct"
                [style.width.%]="span.widthPct"
                [style.top.px]="span.topPx"
                [style.height.px]="span.heightPx"
                [attr.aria-label]="timelineItemInteractive() ? span.ariaLabel : null"
                (click)="selectTimelineSpan(span, $event)"
                (keydown)="onTimelineSpanKeydown(span, $event)"
              >
                @if (timelineItemTemplate(); as templateRef) {
                  @if (timelineItemContext(span, $index); as timelineContext) {
                    <ng-container
                      [ngTemplateOutlet]="templateRef"
                      [ngTemplateOutletContext]="timelineContext"
                      [ngTemplateOutletInjector]="model?.itemTemplateInjector || null"
                    ></ng-container>
                  }
                } @else {
                  <span>{{ span.label }}</span>
                  @if (span.meta) {
                    <small>{{ span.meta }}</small>
                  }
                }
              </div>
            }
          </div>
        </div>
      </section>
    }
  }
</div>
`, styles: ["/* src/app/shared/ui/components/core/smart-list/card/calendar-card/calendar-card.component.scss */\n:host {\n  position: relative;\n  display: flex;\n  flex: 1 1 auto;\n  flex-direction: column;\n  align-items: stretch;\n  width: 100%;\n  min-height: 0;\n}\n:host(.smart-list--presentation-fullscreen),\n:host(.smart-list--month),\n:host(.smart-list--week),\n:host(.smart-list--timeline) {\n  height: 100%;\n}\n:host(.smart-list--week),\n:host(.smart-list--timeline) {\n  overflow-x: auto;\n  overflow-y: auto;\n}\n@media (max-width: 760px) {\n  :host(.smart-list--timeline.smart-list--mobile-stepper) {\n    scroll-snap-type: x mandatory;\n    scrollbar-width: none;\n    -ms-overflow-style: none;\n  }\n  :host(.smart-list--timeline.smart-list--mobile-stepper)::-webkit-scrollbar {\n    display: none;\n  }\n  :host(.smart-list--timeline.smart-list--mobile-stepper) .smart-list__page--timeline {\n    scroll-snap-align: none;\n    scroll-snap-stop: normal;\n  }\n  :host(.smart-list--timeline.smart-list--mobile-stepper) .smart-list__timeline-header-cell {\n    scroll-snap-align: start;\n    scroll-snap-stop: normal;\n  }\n}\n:host(.smart-list--month) {\n  overflow-x: auto;\n  overflow-y: clip;\n}\n.calendar-card__pages {\n  display: flex;\n  flex: 1 1 auto;\n  flex-direction: row;\n  align-items: stretch;\n  width: 100%;\n  min-width: 100%;\n  height: 100%;\n  min-height: 0;\n}\n.smart-list__calendar-page {\n  flex: 0 0 100%;\n  min-width: 100%;\n  max-width: 100%;\n  width: 100%;\n  height: 100%;\n  scroll-snap-align: start;\n  scroll-snap-stop: always;\n  touch-action: pan-x pan-y;\n  padding-right: 0;\n  padding-bottom: 0.48rem;\n  box-sizing: border-box;\n}\n:host(.is-touching) .smart-list__calendar-page {\n  scroll-snap-align: none;\n  scroll-snap-stop: normal;\n}\n.smart-list__calendar-page--month {\n  display: grid;\n  grid-template-rows: auto minmax(0, 1fr);\n  min-width: 0;\n  min-height: 100%;\n  --month-week-count: 5;\n  overflow: hidden;\n}\n.smart-list__calendar-page--week {\n  min-height: 100%;\n  height: max-content;\n  padding-bottom: 0;\n  overflow: hidden;\n  contain: paint;\n  background: #fff;\n}\n.smart-list__page--timeline {\n  min-height: 100%;\n  height: max-content;\n  padding-bottom: 0;\n  overflow: hidden;\n  contain: paint;\n  background: #fff;\n}\n.smart-list__calendar-weekdays {\n  display: grid;\n  grid-template-columns: repeat(7, minmax(0, 1fr));\n  gap: 0.24rem;\n  margin-bottom: 0.3rem;\n}\n.smart-list__calendar-weekdays span {\n  text-align: left;\n  color: rgba(31, 58, 92, 0.76);\n  font-size: 0.68rem;\n  font-weight: 800;\n  letter-spacing: 0.02em;\n  text-transform: uppercase;\n  padding-left: 0.28rem;\n}\n.smart-list__month-grid {\n  display: grid;\n  row-gap: 0.34rem;\n  column-gap: 0;\n  min-height: 0;\n  height: 100%;\n  width: 100%;\n  min-width: 0;\n  grid-template-rows: repeat(var(--month-week-count), minmax(0, 1fr));\n}\n.smart-list__month-week {\n  position: relative;\n  display: grid;\n  grid-template-columns: repeat(7, minmax(0, 1fr));\n  gap: 0.16rem;\n  min-height: 0;\n  width: 100%;\n  min-width: 0;\n}\n.smart-list__month-cell {\n  min-width: 0;\n  min-height: 6.2rem;\n  height: auto;\n  border: 1px solid rgba(37, 63, 96, 0.18);\n  border-radius: 10px;\n  background: #fff;\n  padding: 0.2rem;\n  box-sizing: border-box;\n  display: grid;\n  align-content: start;\n  gap: 0.12rem;\n}\n.smart-list__month-cell--outside {\n  background: #f6f8fc;\n}\n.smart-list__month-day-num {\n  justify-self: center;\n  color: #244267;\n  font-size: 0.7rem;\n  font-weight: 800;\n}\n.smart-list__month-cell--today {\n  box-shadow: inset 0 0 0 1px rgba(57, 108, 182, 0.42);\n}\n.smart-list__month-counter {\n  justify-self: start;\n  align-self: end;\n  min-width: 1.24rem;\n  min-height: 1.24rem;\n  border-radius: 999px;\n  border: 1px solid rgba(41, 69, 101, 0.25);\n  color: #13345a;\n  font-size: 0.62rem;\n  font-weight: 800;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  gap: 0.22rem;\n  padding: 0 0.22rem;\n  font: inherit;\n  cursor: pointer;\n  touch-action: pan-x pan-y;\n}\n.smart-list__month-cell--counter {\n  grid-template-rows: auto 1fr;\n  align-content: stretch;\n  align-items: stretch;\n  justify-items: center;\n  gap: 0;\n}\n.smart-list__month-cell--counter .smart-list__month-day-num {\n  justify-self: center;\n  align-self: start;\n}\n.smart-list__month-cell--counter .smart-list__month-counter {\n  justify-self: center;\n  align-self: center;\n}\n.smart-list__month-counter,\n.smart-list__week-counter,\n.smart-list__week-counter-head,\n.smart-list__week-hour-counter {\n  border: 1px solid rgba(37, 63, 96, 0.18);\n  background: #eef7f0;\n  color: #1f5135;\n  font: inherit;\n  font-size: 0.68rem;\n  font-weight: 900;\n  line-height: 1.05;\n  cursor: pointer;\n  touch-action: pan-x pan-y;\n  box-sizing: border-box;\n  max-width: 100%;\n  white-space: normal;\n}\n.smart-list__month-counter,\n.smart-list__week-counter {\n  display: inline-flex;\n  flex-wrap: wrap;\n  align-items: center;\n  justify-content: center;\n  gap: 0.22rem;\n  min-width: 0;\n  min-height: 1.48rem;\n  border-radius: 999px;\n  padding: 0.16rem 0.36rem;\n}\n.smart-list__month-counter {\n  justify-self: center;\n  align-self: center;\n  margin-top: 0.12rem;\n}\n.smart-list__month-counter strong,\n.smart-list__week-counter strong,\n.smart-list__week-counter-head strong,\n.smart-list__week-hour-counter strong {\n  display: inline-flex;\n  flex: 0 0 auto;\n  align-items: center;\n  justify-content: center;\n  min-width: 1rem;\n  min-height: 1rem;\n  border-radius: 999px;\n  background: #c93838;\n  color: #fff;\n  font-size: 0.56rem;\n  font-weight: 900;\n  line-height: 1;\n  padding: 0 0.2rem;\n  box-sizing: border-box;\n}\n.smart-list__month-counter span,\n.smart-list__week-counter span,\n.smart-list__week-counter-head span,\n.smart-list__week-hour-counter span {\n  min-width: 0;\n  white-space: nowrap;\n}\n.smart-list__month-counter.calendar-counter-empty,\n.smart-list__week-counter.calendar-counter-empty,\n.smart-list__week-counter-head.calendar-counter-empty,\n.smart-list__week-hour-counter.calendar-counter-empty {\n  background: #f4f7fb;\n  color: #5a6f88;\n}\n.smart-list__month-counter.calendar-counter-full,\n.smart-list__week-counter.calendar-counter-full,\n.smart-list__week-counter-head.calendar-counter-full,\n.smart-list__week-hour-counter.calendar-counter-full {\n  background: #f4f7fb;\n  border-color: rgba(105, 119, 140, 0.28);\n  color: #5a4658;\n}\n.smart-list__month-counter.calendar-counter-booked-full,\n.smart-list__week-counter.calendar-counter-booked-full,\n.smart-list__week-counter-head.calendar-counter-booked-full,\n.smart-list__week-hour-counter.calendar-counter-booked-full {\n  background: #fff3e4;\n  border-color: rgba(183, 113, 37, 0.3);\n  color: #7a4515;\n}\n.smart-list__month-counter.calendar-counter-over,\n.smart-list__week-counter.calendar-counter-over,\n.smart-list__week-counter-head.calendar-counter-over,\n.smart-list__week-hour-counter.calendar-counter-over {\n  background: #fff0f0;\n  border-color: rgba(196, 60, 60, 0.34);\n  color: #8a2828;\n}\n.smart-list__month-week-spans {\n  position: absolute;\n  inset: 0;\n  pointer-events: none;\n}\n.smart-list__calendar-badge {\n  width: 100%;\n  border: 1px solid rgba(39, 70, 108, 0.2);\n  border-radius: 999px;\n  background:\n    linear-gradient(\n      180deg,\n      #eef4ff 0%,\n      #e8f0ff 100%);\n  color: #214268;\n  font: inherit;\n  font-size: 0.68rem;\n  font-weight: 700;\n  line-height: 1.2;\n  text-align: left;\n  padding: 0.16rem 0.42rem;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: clip;\n  cursor: pointer;\n  touch-action: pan-x pan-y;\n}\n.smart-list__calendar-badge.calendar-badge-tone-1 {\n  background:\n    linear-gradient(\n      180deg,\n      #e8f2ff 0%,\n      #dce9ff 100%);\n  border-color: rgba(50, 102, 178, 0.3);\n  color: #214a82;\n}\n.smart-list__calendar-badge.calendar-badge-tone-2 {\n  background:\n    linear-gradient(\n      180deg,\n      #e8f8f0 0%,\n      #dbf0e5 100%);\n  border-color: rgba(41, 128, 90, 0.28);\n  color: #1f5a41;\n}\n.smart-list__calendar-badge.calendar-badge-tone-3 {\n  background:\n    linear-gradient(\n      180deg,\n      #fff2e6 0%,\n      #ffe8d5 100%);\n  border-color: rgba(178, 105, 38, 0.3);\n  color: #7f4b1e;\n}\n.smart-list__calendar-badge.calendar-badge-tone-4 {\n  background:\n    linear-gradient(\n      180deg,\n      #f2ecff 0%,\n      #e8deff 100%);\n  border-color: rgba(104, 74, 173, 0.28);\n  color: #4f3b84;\n}\n.smart-list__calendar-badge.calendar-badge-tone-5 {\n  background:\n    linear-gradient(\n      180deg,\n      #e9fbff 0%,\n      #dcf4fa 100%);\n  border-color: rgba(43, 125, 154, 0.28);\n  color: #23586f;\n}\n.smart-list__calendar-badge.calendar-badge-tone-6 {\n  background:\n    linear-gradient(\n      180deg,\n      #fff4f7 0%,\n      #ffe8ef 100%);\n  border-color: rgba(180, 74, 112, 0.28);\n  color: #7e2f4f;\n}\n.smart-list__calendar-badge.calendar-badge-tone-7 {\n  background:\n    linear-gradient(\n      180deg,\n      #f7f9e9 0%,\n      #edf3d9 100%);\n  border-color: rgba(106, 135, 43, 0.28);\n  color: #4f6520;\n}\n.smart-list__calendar-badge.calendar-badge-tone-8 {\n  background:\n    linear-gradient(\n      180deg,\n      #f1f3f7 0%,\n      #e6ebf2 100%);\n  border-color: rgba(78, 98, 128, 0.28);\n  color: #2f435e;\n}\n.smart-list__month-span-badge {\n  position: absolute;\n  pointer-events: auto;\n  z-index: 3;\n  width: auto;\n  display: flex;\n  align-items: center;\n  justify-content: flex-start;\n  min-height: 18px;\n  padding: 0.1rem 0.34rem;\n}\n.smart-list__week-board {\n  --week-slot-h: 34px;\n  --week-slot-count: 24;\n  display: grid;\n  grid-template-columns: 34px repeat(7, minmax(0, 1fr));\n  grid-template-rows: auto auto;\n  gap: 0;\n  min-height: max(100%, var(--week-slot-count) * var(--week-slot-h) + 34px);\n  touch-action: pan-x pan-y;\n}\n.smart-list__week-board-corner {\n  border: 1px solid rgba(37, 63, 96, 0.18);\n  border-bottom: 0;\n  border-right: 0;\n  border-radius: 10px 0 0 0;\n  background: #f6f9ff;\n}\n.smart-list__week-board-day-head {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  border: 1px solid rgba(37, 63, 96, 0.18);\n  border-left: 0;\n  border-bottom: 0;\n  background: #fff;\n  gap: 0.06rem;\n  padding: 0.18rem 0.14rem;\n  color: #244267;\n  font-size: 0.62rem;\n  font-weight: 700;\n  line-height: 1;\n}\n.smart-list__week-board-day-head strong {\n  font-size: 0.78rem;\n  font-weight: 900;\n}\n.smart-list__week-counter-head {\n  margin-top: 0.1rem;\n  min-width: 1.24rem;\n  min-height: 1.24rem;\n  border-radius: 999px;\n  border: 1px solid rgba(41, 69, 101, 0.25);\n  color: #13345a;\n  font-size: 0.62rem;\n  font-weight: 800;\n  display: inline-flex;\n  flex-wrap: wrap;\n  align-items: center;\n  justify-content: center;\n  gap: 0.14rem;\n  padding: 0 0.22rem;\n  font: inherit;\n  cursor: pointer;\n  touch-action: pan-x pan-y;\n}\n.smart-list__week-counter-head {\n  margin-top: 0.08rem;\n  min-height: 1.16rem;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  gap: 0.14rem;\n  border-radius: 999px;\n  padding: 0.1rem 0.24rem;\n  font-size: 0.58rem;\n}\n.smart-list__week-board-day-head--today {\n  box-shadow: inset 0 0 0 1px rgba(57, 108, 182, 0.42);\n}\n.smart-list__week-hours-col {\n  border: 1px solid rgba(37, 63, 96, 0.18);\n  border-top: 0;\n  border-right: 0;\n  border-radius: 0 0 0 10px;\n  overflow: hidden;\n  display: grid;\n  grid-auto-rows: var(--week-slot-h);\n  align-content: start;\n  background: #fff;\n  background-image:\n    repeating-linear-gradient(\n      to bottom,\n      transparent 0,\n      transparent calc(var(--week-slot-h) - 1px),\n      rgba(33, 54, 82, 0.12) calc(var(--week-slot-h) - 1px),\n      rgba(33, 54, 82, 0.12) var(--week-slot-h));\n  height: calc(var(--week-slot-count) * var(--week-slot-h));\n}\n.smart-list__week-hour-label {\n  padding: 0.28rem 0.12rem 0 0.18rem;\n  color: rgba(37, 63, 96, 0.72);\n  font-size: 0.62rem;\n  font-weight: 700;\n  line-height: 1;\n}\n.smart-list__week-day-col {\n  position: relative;\n  border: 1px solid rgba(37, 63, 96, 0.18);\n  border-left: 0;\n  border-top: 0;\n  background: #fff;\n  overflow: hidden;\n  display: grid;\n  grid-auto-rows: var(--week-slot-h);\n  align-content: start;\n  background-image:\n    repeating-linear-gradient(\n      to bottom,\n      transparent 0,\n      transparent calc(var(--week-slot-h) - 1px),\n      rgba(33, 54, 82, 0.12) calc(var(--week-slot-h) - 1px),\n      rgba(33, 54, 82, 0.12) var(--week-slot-h));\n  height: calc(var(--week-slot-count) * var(--week-slot-h));\n}\n.smart-list__week-day-col:last-child {\n  border-radius: 0 0 10px 0;\n}\n.smart-list__week-day-col--today {\n  box-shadow: inset 0 0 0 1px rgba(57, 108, 182, 0.42);\n}\n.smart-list__week-hour-slot {\n  height: var(--week-slot-h);\n  border: 0;\n}\n.smart-list__week-counter-slot {\n  border-top: 1px solid rgba(33, 54, 82, 0.12);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.smart-list__week-counter-slot:first-child {\n  border-top: 0;\n}\n.smart-list__week-hour-counter {\n  min-width: 1.18rem;\n  min-height: 1.18rem;\n  border-radius: 999px;\n  border: 1px solid rgba(41, 69, 101, 0.25);\n  color: #13345a;\n  font-size: 0.62rem;\n  font-weight: 800;\n  display: inline-flex;\n  flex-wrap: wrap;\n  align-items: center;\n  justify-content: center;\n  gap: 0.14rem;\n  padding: 0 0.18rem;\n  font: inherit;\n  cursor: pointer;\n  touch-action: pan-x pan-y;\n}\n.smart-list__week-counter {\n  position: absolute;\n  z-index: 2;\n  left: 4px;\n  right: 4px;\n  top: 8px;\n  min-height: 1.7rem;\n}\n.smart-list__week-timed-badge {\n  position: absolute;\n  left: 2px;\n  right: 2px;\n  width: auto;\n  z-index: 2;\n  border-radius: 8px;\n  padding: 0.12rem 0.26rem;\n  white-space: normal;\n  text-wrap: pretty;\n  overflow: clip;\n  text-overflow: clip;\n  word-break: break-word;\n  overflow-wrap: anywhere;\n  line-break: auto;\n  -webkit-hyphens: auto;\n  hyphens: auto;\n  display: flex;\n  align-items: flex-start;\n}\n.smart-list__week-timed-badge > span {\n  display: block;\n  width: 100%;\n  white-space: normal;\n  word-break: break-word;\n  overflow-wrap: anywhere;\n  line-height: 1.15;\n}\n.smart-list__timeline-board {\n  --timeline-step-count: 8;\n  --timeline-row-count: 1;\n  --timeline-row-h: 64px;\n  display: grid;\n  grid-template-rows: auto auto;\n  width: 100%;\n  min-width: 0;\n  min-height: max(100%, var(--timeline-row-count) * var(--timeline-row-h) + 34px);\n  border: 1px solid rgba(37, 63, 96, 0.18);\n  border-radius: 10px;\n  background: #fff;\n  overflow: hidden;\n  touch-action: pan-x pan-y;\n}\n.smart-list__timeline-header {\n  position: sticky;\n  top: 0;\n  z-index: 4;\n  display: grid;\n  grid-template-columns: repeat(var(--timeline-step-count), minmax(0, 1fr));\n  min-height: 34px;\n  background: #f6f9ff;\n  border-bottom: 1px solid rgba(37, 63, 96, 0.18);\n}\n.smart-list__timeline-header-cell {\n  display: flex;\n  align-items: center;\n  min-width: 0;\n  padding: 0.28rem 0.4rem;\n  border-left: 1px solid rgba(37, 63, 96, 0.14);\n  color: rgba(37, 63, 96, 0.78);\n  font-size: 0.64rem;\n  font-weight: 850;\n  line-height: 1;\n  box-sizing: border-box;\n}\n.smart-list__timeline-header-cell:first-child {\n  border-left: 0;\n}\n.smart-list__timeline-header-cell span {\n  display: block;\n  min-width: 0;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.smart-list__timeline-grid {\n  position: relative;\n  display: grid;\n  grid-template-rows: repeat(var(--timeline-row-count), var(--timeline-row-h));\n  min-height: calc(var(--timeline-row-count) * var(--timeline-row-h));\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 255, 255, 0.96) 0%,\n      rgba(249, 251, 255, 0.98) 100%);\n}\n.smart-list__timeline-row {\n  display: grid;\n  grid-template-columns: repeat(var(--timeline-step-count), minmax(0, 1fr));\n  min-width: 0;\n  min-height: 0;\n}\n.smart-list__timeline-row + .smart-list__timeline-row {\n  border-top: 1px solid rgba(37, 63, 96, 0.12);\n}\n.smart-list__timeline-cell {\n  min-width: 0;\n  min-height: 0;\n  border-left: 1px solid rgba(37, 63, 96, 0.1);\n  background: rgba(255, 255, 255, 0.42);\n}\n.smart-list__timeline-cell:first-child {\n  border-left: 0;\n}\n.smart-list__timeline-span {\n  position: absolute;\n  z-index: 3;\n  display: flex;\n  flex-direction: column;\n  align-items: flex-start;\n  justify-content: center;\n  gap: 0.1rem;\n  min-width: 2.8rem;\n  border: 1px solid rgba(39, 70, 108, 0.22);\n  border-radius: 8px;\n  background:\n    linear-gradient(\n      180deg,\n      #eef4ff 0%,\n      #e7efff 100%);\n  color: #214268;\n  box-shadow: 0 5px 14px rgba(36, 65, 104, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.72);\n  font: inherit;\n  font-size: 0.7rem;\n  font-weight: 800;\n  line-height: 1.15;\n  text-align: left;\n  padding: 0.24rem 0.42rem;\n  overflow: hidden;\n  cursor: pointer;\n  touch-action: pan-x pan-y;\n  box-sizing: border-box;\n}\n.smart-list__timeline-span--template {\n  min-width: 6.5rem;\n  border: 0;\n  border-radius: 8px;\n  background: transparent;\n  box-shadow: none;\n  padding: 0;\n  overflow: visible;\n}\n.smart-list__timeline-span--static {\n  cursor: default;\n  -webkit-tap-highlight-color: transparent;\n  transition: none;\n  animation: none;\n  transform: none;\n  filter: none;\n}\n.smart-list__timeline-span:focus-visible {\n  outline: 2px solid rgba(57, 108, 182, 0.62);\n  outline-offset: 2px;\n}\n.smart-list__timeline-span--continues-before {\n  border-top-left-radius: 2px;\n  border-bottom-left-radius: 2px;\n}\n.smart-list__timeline-span--continues-after {\n  border-top-right-radius: 2px;\n  border-bottom-right-radius: 2px;\n}\n.smart-list__timeline-span > span,\n.smart-list__timeline-span > small {\n  display: block;\n  width: 100%;\n  min-width: 0;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.smart-list__timeline-span > span {\n  white-space: nowrap;\n}\n.smart-list__timeline-span > small {\n  color: rgba(35, 61, 95, 0.72);\n  font-size: 0.58rem;\n  font-weight: 750;\n  line-height: 1.12;\n  white-space: normal;\n  word-break: break-word;\n  overflow-wrap: anywhere;\n}\n:host ::ng-deep .smart-list__timeline-span > * {\n  width: 100%;\n  max-width: 100%;\n  min-width: 0;\n}\n.smart-list__timeline-span.calendar-badge-tone-1 {\n  background:\n    linear-gradient(\n      180deg,\n      #e8f2ff 0%,\n      #dce9ff 100%);\n  border-color: rgba(50, 102, 178, 0.3);\n  color: #214a82;\n}\n.smart-list__timeline-span.calendar-badge-tone-2 {\n  background:\n    linear-gradient(\n      180deg,\n      #e8f8f0 0%,\n      #dbf0e5 100%);\n  border-color: rgba(41, 128, 90, 0.28);\n  color: #1f5a41;\n}\n.smart-list__timeline-span.calendar-badge-tone-3 {\n  background:\n    linear-gradient(\n      180deg,\n      #fff2e6 0%,\n      #ffe8d5 100%);\n  border-color: rgba(178, 105, 38, 0.3);\n  color: #7f4b1e;\n}\n.smart-list__timeline-span.calendar-badge-tone-4 {\n  background:\n    linear-gradient(\n      180deg,\n      #f2ecff 0%,\n      #e8deff 100%);\n  border-color: rgba(104, 74, 173, 0.28);\n  color: #4f3b84;\n}\n.smart-list__timeline-span.calendar-badge-tone-5 {\n  background:\n    linear-gradient(\n      180deg,\n      #e9fbff 0%,\n      #dcf4fa 100%);\n  border-color: rgba(43, 125, 154, 0.28);\n  color: #23586f;\n}\n.smart-list__timeline-span.calendar-badge-tone-6 {\n  background:\n    linear-gradient(\n      180deg,\n      #fff4f7 0%,\n      #ffe8ef 100%);\n  border-color: rgba(180, 74, 112, 0.28);\n  color: #7e2f4f;\n}\n.smart-list__month-counter.calendar-counter-heat-0,\n.smart-list__week-counter-head.calendar-counter-heat-0,\n.smart-list__week-hour-counter.calendar-counter-heat-0 {\n  background:\n    linear-gradient(\n      180deg,\n      #f4f7fb 0%,\n      #e8eef7 100%);\n  border-color: rgba(97, 120, 154, 0.18);\n  color: #6a7890;\n}\n.smart-list__month-counter.calendar-counter-heat-1,\n.smart-list__week-counter-head.calendar-counter-heat-1,\n.smart-list__week-hour-counter.calendar-counter-heat-1 {\n  background:\n    linear-gradient(\n      180deg,\n      #eef5ff 0%,\n      #dfeafb 100%);\n  border-color: rgba(70, 118, 183, 0.22);\n  color: #2d5c99;\n}\n.smart-list__month-counter.calendar-counter-heat-2,\n.smart-list__week-counter-head.calendar-counter-heat-2,\n.smart-list__week-hour-counter.calendar-counter-heat-2 {\n  background:\n    linear-gradient(\n      180deg,\n      #e8f8f3 0%,\n      #d8f1e7 100%);\n  border-color: rgba(55, 146, 104, 0.24);\n  color: #256d4d;\n}\n.smart-list__month-counter.calendar-counter-heat-3,\n.smart-list__week-counter-head.calendar-counter-heat-3,\n.smart-list__week-hour-counter.calendar-counter-heat-3 {\n  background:\n    linear-gradient(\n      180deg,\n      #fff6e7 0%,\n      #ffecce 100%);\n  border-color: rgba(198, 145, 45, 0.24);\n  color: #8f6115;\n}\n.smart-list__month-counter.calendar-counter-heat-4,\n.smart-list__week-counter-head.calendar-counter-heat-4,\n.smart-list__week-hour-counter.calendar-counter-heat-4 {\n  background:\n    linear-gradient(\n      180deg,\n      #fff0e7 0%,\n      #ffe2d2 100%);\n  border-color: rgba(200, 116, 61, 0.26);\n  color: #9b4f23;\n}\n.smart-list__month-counter.calendar-counter-heat-5,\n.smart-list__week-counter-head.calendar-counter-heat-5,\n.smart-list__week-hour-counter.calendar-counter-heat-5 {\n  background:\n    linear-gradient(\n      180deg,\n      #ffeaf0 0%,\n      #ffd7e2 100%);\n  border-color: rgba(196, 77, 121, 0.28);\n  color: #9d2d57;\n}\n.smart-list__month-counter.calendar-counter-heat-6,\n.smart-list__week-counter-head.calendar-counter-heat-6,\n.smart-list__week-hour-counter.calendar-counter-heat-6 {\n  background:\n    linear-gradient(\n      180deg,\n      #f0e6ff 0%,\n      #e2d3ff 100%);\n  border-color: rgba(113, 82, 193, 0.28);\n  color: #5a3d9d;\n}\n@media (max-width: 760px) {\n  .smart-list__calendar-page--month {\n    width: 100%;\n    min-width: 100%;\n    max-width: 100%;\n    min-height: auto;\n    height: auto;\n    padding-bottom: 0.08rem;\n    overflow: hidden;\n    background: #fff;\n    contain: paint;\n    box-shadow: -1px 0 0 #fff, 1px 0 0 #fff;\n  }\n  .smart-list__calendar-page--month-counter {\n    grid-template-rows: auto auto;\n  }\n  .smart-list__month-grid,\n  .smart-list__month-grid--counter {\n    display: flex;\n    flex-direction: column;\n    gap: 0.44rem;\n    height: auto;\n    min-height: 0;\n    width: 100%;\n    min-width: 0;\n  }\n  .smart-list__month-week,\n  .smart-list__month-week--counter {\n    flex: 0 0 5.6rem;\n    height: 5.6rem;\n    min-height: 5.6rem;\n    gap: 0.8rem;\n    width: 100%;\n    min-width: 0;\n    box-sizing: border-box;\n  }\n  .smart-list__month-week .smart-list__month-cell,\n  .smart-list__month-week--counter .smart-list__month-cell {\n    min-height: 0;\n    height: 100%;\n    padding: 0.14rem;\n    border-radius: 9px;\n  }\n  .smart-list__calendar-page--month-six-weeks .smart-list__month-week,\n  .smart-list__calendar-page--month-six-weeks .smart-list__month-week--counter {\n    flex: 0 0 4.72rem;\n    height: 4.72rem;\n    min-height: 4.72rem;\n  }\n  .smart-list__month-week--counter .smart-list__month-cell--counter {\n    grid-template-rows: auto 1fr;\n    align-content: stretch;\n    align-items: stretch;\n    justify-items: center;\n    gap: 0;\n  }\n  .smart-list__month-week--counter .smart-list__month-day-num {\n    justify-self: center;\n    align-self: start;\n    font-size: 0.62rem;\n  }\n  .smart-list__month-week--counter .smart-list__month-counter {\n    min-width: 0.94rem;\n    min-height: 0.94rem;\n    font-size: 0.56rem;\n    line-height: 1.05;\n    padding: 0.08rem 0.16rem;\n    gap: 0.12rem;\n    justify-self: center;\n    align-self: center;\n  }\n  .smart-list__week-counter,\n  .smart-list__week-counter-head,\n  .smart-list__week-hour-counter {\n    min-height: 1.16rem;\n    font-size: 0.56rem;\n    line-height: 1.05;\n    padding: 0.08rem 0.16rem;\n    gap: 0.12rem;\n  }\n  .smart-list__week-counter {\n    left: 2px;\n    right: 2px;\n    min-height: 1.18rem;\n  }\n  .smart-list__month-counter:has(strong),\n  .smart-list__week-counter:has(strong),\n  .smart-list__week-counter-head:has(strong),\n  .smart-list__week-hour-counter:has(strong) {\n    flex-direction: column;\n    flex-wrap: nowrap;\n    min-width: 1.38rem;\n    min-height: 1.86rem;\n    padding: 0.14rem 0.16rem;\n    gap: 0.08rem;\n  }\n  .smart-list__month-counter strong,\n  .smart-list__week-counter strong,\n  .smart-list__week-counter-head strong,\n  .smart-list__week-hour-counter strong {\n    min-width: 0.9rem;\n    min-height: 0.9rem;\n    font-size: 0.52rem;\n    padding: 0 0.16rem;\n  }\n}\n/*# sourceMappingURL=calendar-card.component.css.map */\n"] }]
  }], null, { model: [{
    type: Input
  }], isTouching: [{
    type: HostBinding,
    args: ["class.is-touching"]
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(CalendarCardComponent, { className: "CalendarCardComponent", filePath: "app/shared/ui/components/core/smart-list/card/calendar-card/calendar-card.component.ts", lineNumber: 35 });
})();

export {
  CARD_MENU_ACTIONS,
  InfoCardComponent,
  SmartListCalendarAdapter,
  CalendarCardComponent,
  UiTaskScheduler,
  UiPollCoordinator
};
//# sourceMappingURL=chunk-TKEWFTMJ.js.map
