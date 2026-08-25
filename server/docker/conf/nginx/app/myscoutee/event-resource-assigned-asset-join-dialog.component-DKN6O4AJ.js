import {
  SubEventResourcePopupStore
} from "./chunk-VLAAR4TK.js";
import {
  PopupComponent
} from "./chunk-GBRBIJ5J.js";
import "./chunk-VEYRCVMX.js";
import "./chunk-MVR37RGJ.js";
import {
  AppMenuComponent
} from "./chunk-QD6QQNQX.js";
import "./chunk-EDHGCWPF.js";
import "./chunk-CUDLB52K.js";
import "./chunk-C2QYRRDX.js";
import "./chunk-Y3NEBFNQ.js";
import "./chunk-PB4YNHSN.js";
import "./chunk-VUN7WUNQ.js";
import "./chunk-5PHTFUHA.js";
import "./chunk-Y2Y4ZDHH.js";
import "./chunk-B7YPVC5F.js";
import "./chunk-XQ4NDAVX.js";
import "./chunk-4FWVIYNI.js";
import "./chunk-MS7VTGLY.js";
import {
  CommonModule
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
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewEncapsulation,
  inject,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵclassProp,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate2
} from "./chunk-XJL7SWH7.js";

// src/app/activity/components/event-resource-popup/assigned-asset-join-dialog/event-resource-assigned-asset-join-dialog.component.ts
var _forTrack0 = ($index, $item) => $item.id;
function EventResourceAssignedAssetJoinDialogComponent_Conditional_0_For_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "article", 7)(1, "div")(2, "strong");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "span");
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "strong");
    \u0275\u0275text(7);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const item_r2 = ctx.$implicit;
    const dialog_r3 = \u0275\u0275nextContext();
    const ctx_r3 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(item_r2.label);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate2("", dialog_r3.pathLabel, " \xB7 ", dialog_r3.memberSummary);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(item_r2.amount > 0 ? ctx_r3.formatMoney(item_r2.amount, item_r2.currency) : "Included");
  }
}
function EventResourceAssignedAssetJoinDialogComponent_Conditional_0_Conditional_41_For_9_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const policy_r6 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(policy_r6.description);
  }
}
function EventResourceAssignedAssetJoinDialogComponent_Conditional_0_Conditional_41_For_9_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "em");
    \u0275\u0275text(1, "Required");
    \u0275\u0275elementEnd();
  }
}
function EventResourceAssignedAssetJoinDialogComponent_Conditional_0_Conditional_41_For_9_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "label", 15)(1, "input", 16);
    \u0275\u0275listener("change", function EventResourceAssignedAssetJoinDialogComponent_Conditional_0_Conditional_41_For_9_Template_input_change_1_listener() {
      const policy_r6 = \u0275\u0275restoreView(_r5).$implicit;
      const ctx_r3 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r3.togglePolicy(policy_r6.id));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "div")(3, "strong");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(5, EventResourceAssignedAssetJoinDialogComponent_Conditional_0_Conditional_41_For_9_Conditional_5_Template, 2, 1, "span");
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(6, EventResourceAssignedAssetJoinDialogComponent_Conditional_0_Conditional_41_For_9_Conditional_6_Template, 2, 0, "em");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const policy_r6 = ctx.$implicit;
    const dialog_r3 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("is-required", policy_r6.required !== false);
    \u0275\u0275advance();
    \u0275\u0275property("checked", dialog_r3.acceptedPolicyIds.includes(policy_r6.id));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(policy_r6.title);
    \u0275\u0275advance();
    \u0275\u0275conditional(policy_r6.description ? 5 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(policy_r6.required !== false ? 6 : -1);
  }
}
function EventResourceAssignedAssetJoinDialogComponent_Conditional_0_Conditional_41_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "section", 4)(1, "div", 5)(2, "div")(3, "h4");
    \u0275\u0275text(4, "Policies");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "span");
    \u0275\u0275text(6, "Review and approve before joining");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(7, "div", 13);
    \u0275\u0275repeaterCreate(8, EventResourceAssignedAssetJoinDialogComponent_Conditional_0_Conditional_41_For_9_Template, 7, 6, "label", 14, _forTrack0);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const dialog_r3 = \u0275\u0275nextContext();
    \u0275\u0275advance(8);
    \u0275\u0275repeater(dialog_r3.policies);
  }
}
function EventResourceAssignedAssetJoinDialogComponent_Conditional_0_Conditional_42_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 10);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const dialog_r3 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(dialog_r3.error);
  }
}
function EventResourceAssignedAssetJoinDialogComponent_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "app-popup", 0)(1, "div", 1)(2, "section", 2)(3, "div", 3)(4, "section", 4)(5, "div", 5)(6, "div")(7, "h4");
    \u0275\u0275text(8, "Join Summary");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "span");
    \u0275\u0275text(10);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(11, "strong");
    \u0275\u0275text(12);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(13, "div", 6);
    \u0275\u0275repeaterCreate(14, EventResourceAssignedAssetJoinDialogComponent_Conditional_0_For_15_Template, 8, 4, "article", 7, _forTrack0);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(16, "section", 8)(17, "div", 5)(18, "div")(19, "h4");
    \u0275\u0275text(20, "Shared Price");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(21, "span");
    \u0275\u0275text(22);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(23, "strong");
    \u0275\u0275text(24);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(25, "div", 9)(26, "article")(27, "span");
    \u0275\u0275text(28, "Asset total");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(29, "strong");
    \u0275\u0275text(30);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(31, "article")(32, "span");
    \u0275\u0275text(33);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(34, "strong");
    \u0275\u0275text(35);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(36, "article")(37, "span");
    \u0275\u0275text(38, "Members after join");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(39, "strong");
    \u0275\u0275text(40);
    \u0275\u0275elementEnd()()()();
    \u0275\u0275conditionalCreate(41, EventResourceAssignedAssetJoinDialogComponent_Conditional_0_Conditional_41_Template, 10, 0, "section", 4);
    \u0275\u0275conditionalCreate(42, EventResourceAssignedAssetJoinDialogComponent_Conditional_0_Conditional_42_Template, 2, 1, "p", 10);
    \u0275\u0275elementStart(43, "div", 11)(44, "app-menu", 12);
    \u0275\u0275listener("itemSelect", function EventResourceAssignedAssetJoinDialogComponent_Conditional_0_Template_app_menu_itemSelect_44_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r3 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r3.onJoinActionMenuSelect($event));
    });
    \u0275\u0275elementEnd()()()()()();
  }
  if (rf & 2) {
    const dialog_r3 = ctx;
    const ctx_r3 = \u0275\u0275nextContext();
    \u0275\u0275property("model", ctx_r3.joinPopupModel(dialog_r3))("zIndex", ctx_r3.joinPopupZIndex());
    \u0275\u0275advance(10);
    \u0275\u0275textInterpolate(dialog_r3.timeframe);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(dialog_r3.shareAmount > 0 ? ctx_r3.formatMoney(dialog_r3.shareAmount, dialog_r3.currency) : "Included");
    \u0275\u0275advance(2);
    \u0275\u0275repeater(dialog_r3.lineItems);
    \u0275\u0275advance(8);
    \u0275\u0275textInterpolate(dialog_r3.shareHint);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(dialog_r3.shareAmount > 0 ? ctx_r3.formatMoney(dialog_r3.shareAmount, dialog_r3.currency) : "Included");
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(dialog_r3.totalAmount > 0 ? ctx_r3.formatMoney(dialog_r3.totalAmount, dialog_r3.currency) : "Included");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(dialog_r3.shareLabel);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(dialog_r3.shareAmount > 0 ? ctx_r3.formatMoney(dialog_r3.shareAmount, dialog_r3.currency) : "Included");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(dialog_r3.shareMemberCount);
    \u0275\u0275advance();
    \u0275\u0275conditional(dialog_r3.policies.length > 0 ? 41 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(dialog_r3.error ? 42 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275property("items", ctx_r3.joinFooterMenuItems(dialog_r3));
  }
}
var EventResourceAssignedAssetJoinDialogComponent = class _EventResourceAssignedAssetJoinDialogComponent {
  dialog = null;
  parentZIndex = 2600;
  resourcePopupStore = inject(SubEventResourcePopupStore);
  joinPopupModel(dialog) {
    return {
      title: dialog.title,
      subtitle: dialog.subtitle,
      ariaLabel: dialog.title,
      closeAriaLabel: "Close join request",
      closeOnBackdrop: !dialog.busy,
      size: "wide",
      height: "full",
      headerTone: "accent",
      bodyLayout: "fill",
      backdropTone: "dim",
      onClose: (event) => this.close(event)
    };
  }
  joinPopupZIndex() {
    return this.parentZIndex + 100;
  }
  joinFooterMenuItems(dialog) {
    const hasError = !dialog.busy && !!dialog.error;
    const submitLabel = dialog.busy ? dialog.busyLabel : dialog.submitLabel;
    return [
      {
        id: "join-cancel",
        label: "Cancel",
        layout: "action",
        palette: "neutral",
        disabled: dialog.busy,
        ariaLabel: "Cancel"
      },
      {
        id: "join-confirm",
        label: submitLabel,
        layout: "action",
        palette: hasError ? "danger" : "blue",
        disabled: !this.canSubmit(dialog),
        ariaLabel: submitLabel,
        progress: dialog.busy || hasError ? {
          state: dialog.busy ? "loading" : "error",
          shape: "button"
        } : null
      }
    ];
  }
  onJoinActionMenuSelect(event) {
    if (event.id === "join-cancel") {
      this.close(event.sourceEvent);
      return;
    }
    this.confirm(event.sourceEvent);
  }
  formatMoney(amount, currency = "USD") {
    switch ((currency || "").trim().toUpperCase()) {
      case "EUR":
        return `EUR ${(Number(amount) || 0).toFixed(2)}`;
      case "GBP":
        return `GBP ${(Number(amount) || 0).toFixed(2)}`;
      default:
        return `$${(Number(amount) || 0).toFixed(2)}`;
    }
  }
  canSubmit(dialog) {
    if (dialog.busy) {
      return false;
    }
    const acceptedPolicyIds = new Set(dialog.acceptedPolicyIds.map((item) => item.trim()).filter(Boolean));
    return !dialog.policies.some((policy) => policy.required !== false && !acceptedPolicyIds.has(policy.id));
  }
  close(event) {
    event?.stopPropagation();
    this.resourcePopupStore.requestAssignedAssetJoinClose(event);
  }
  confirm(event) {
    event?.stopPropagation();
    this.resourcePopupStore.requestAssignedAssetJoinConfirm(event);
  }
  togglePolicy(policyId) {
    this.resourcePopupStore.requestAssignedAssetJoinPolicyToggle(policyId);
  }
  static \u0275fac = function EventResourceAssignedAssetJoinDialogComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _EventResourceAssignedAssetJoinDialogComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _EventResourceAssignedAssetJoinDialogComponent, selectors: [["app-event-resource-assigned-asset-join-dialog"]], inputs: { dialog: "dialog", parentZIndex: "parentZIndex" }, decls: 1, vars: 1, consts: [[3, "model", "zIndex"], [1, "assigned-asset-join-content"], [1, "experience-form-panel", "subevent-form-panel", "subevent-group-form-panel", "asset-explore-borrow-panel"], [1, "asset-explore-borrow-form"], [1, "asset-explore-borrow-review-card"], [1, "asset-explore-borrow-review-card__head"], [1, "asset-explore-borrow-review-card__list"], [1, "asset-explore-borrow-review-card__item"], [1, "asset-explore-borrow-review-card", "asset-explore-borrow-review-card--payment"], [1, "asset-explore-borrow-payment-summary"], [1, "subevent-resource-editor-error"], [1, "asset-explore-borrow-actions"], ["kind", "inline", "layout", "row", 1, "assigned-asset-join-action-menu", 3, "itemSelect", "items"], [1, "asset-explore-borrow-policy-list"], [1, "asset-explore-borrow-policy-card", 3, "is-required"], [1, "asset-explore-borrow-policy-card"], ["type", "checkbox", 3, "change", "checked"]], template: function EventResourceAssignedAssetJoinDialogComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275conditionalCreate(0, EventResourceAssignedAssetJoinDialogComponent_Conditional_0_Template, 45, 13, "app-popup", 0);
    }
    if (rf & 2) {
      let tmp_0_0;
      \u0275\u0275conditional((tmp_0_0 = ctx.dialog) ? 0 : -1, tmp_0_0);
    }
  }, dependencies: [CommonModule, PopupComponent, AppMenuComponent], styles: ["/* src/app/activity/components/event-resource-popup/assigned-asset-join-dialog/event-resource-assigned-asset-join-dialog.component.scss */\n.assigned-asset-join-content {\n  display: flex;\n  flex-direction: column;\n  flex: 1 1 auto;\n  min-height: 0;\n}\n.assigned-asset-join-content .asset-explore-borrow-panel {\n  border: 1px solid rgba(43, 71, 107, 0.2);\n  border-radius: 14px;\n  background:\n    linear-gradient(\n      180deg,\n      #f8fbff 0%,\n      #f4f8ff 100%);\n  padding: 0.74rem;\n  display: grid;\n  gap: 0.78rem;\n  margin: 0;\n  box-sizing: border-box;\n  flex: 1 1 auto;\n  min-height: 0;\n  overflow-y: auto;\n  overflow-x: hidden;\n  -webkit-overflow-scrolling: touch;\n}\n.assigned-asset-join-content .asset-explore-borrow-form {\n  display: grid;\n  gap: 0.95rem;\n}\n.assigned-asset-join-content .asset-explore-borrow-review-card {\n  display: grid;\n  gap: 0.7rem;\n  padding: 0.85rem 0.95rem;\n  border: 1px solid rgba(202, 219, 237, 0.9);\n  border-radius: 16px;\n  background:\n    linear-gradient(\n      180deg,\n      rgba(250, 253, 255, 0.98) 0%,\n      rgba(240, 247, 255, 0.96) 100%);\n  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.75);\n}\n.assigned-asset-join-content .asset-explore-borrow-review-card--payment {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(251, 247, 239, 0.98) 0%,\n      rgba(247, 239, 224, 0.98) 100%);\n  border-color: rgba(224, 191, 142, 0.78);\n}\n.assigned-asset-join-content .asset-explore-borrow-review-card__head {\n  display: flex;\n  align-items: flex-start;\n  justify-content: space-between;\n  gap: 0.75rem;\n}\n.assigned-asset-join-content .asset-explore-borrow-review-card__head > div {\n  display: grid;\n  gap: 0.22rem;\n}\n.assigned-asset-join-content .asset-explore-borrow-review-card__head h4 {\n  margin: 0;\n  font-size: 0.94rem;\n  font-weight: 800;\n  color: #214168;\n}\n.assigned-asset-join-content .asset-explore-borrow-review-card__head span {\n  color: rgba(35, 57, 88, 0.74);\n  font-size: 0.8rem;\n  font-weight: 600;\n  line-height: 1.28;\n}\n.assigned-asset-join-content .asset-explore-borrow-review-card__head strong {\n  color: #214168;\n  font-size: 0.94rem;\n  font-weight: 800;\n  white-space: nowrap;\n}\n.assigned-asset-join-content .asset-explore-borrow-review-card__list,\n.assigned-asset-join-content .asset-explore-borrow-policy-list {\n  display: grid;\n  gap: 0.55rem;\n}\n.assigned-asset-join-content .asset-explore-borrow-review-card__item,\n.assigned-asset-join-content .asset-explore-borrow-policy-card {\n  display: flex;\n  align-items: flex-start;\n  justify-content: space-between;\n  gap: 0.75rem;\n  padding: 0.78rem 0.85rem;\n  border-radius: 14px;\n  border: 1px solid rgba(203, 219, 238, 0.92);\n  background: rgba(255, 255, 255, 0.95);\n}\n.assigned-asset-join-content .asset-explore-borrow-review-card__item > div,\n.assigned-asset-join-content .asset-explore-borrow-policy-card > div {\n  display: grid;\n  gap: 0.24rem;\n  min-width: 0;\n}\n.assigned-asset-join-content .asset-explore-borrow-review-card__item strong,\n.assigned-asset-join-content .asset-explore-borrow-policy-card strong {\n  color: #24456d;\n  font-size: 0.9rem;\n  font-weight: 800;\n}\n.assigned-asset-join-content .asset-explore-borrow-review-card__item span,\n.assigned-asset-join-content .asset-explore-borrow-policy-card span {\n  color: rgba(35, 57, 88, 0.74);\n  font-size: 0.8rem;\n  line-height: 1.3;\n}\n.assigned-asset-join-content .asset-explore-borrow-policy-card {\n  align-items: center;\n}\n.assigned-asset-join-content .asset-explore-borrow-policy-card input {\n  width: 18px;\n  height: 18px;\n  margin: 0.1rem 0 0;\n  accent-color: #3467b6;\n  flex: 0 0 auto;\n}\n.assigned-asset-join-content .asset-explore-borrow-policy-card.is-required {\n  border-color: rgba(228, 189, 122, 0.78);\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 251, 244, 0.98) 0%,\n      rgba(255, 247, 233, 0.96) 100%);\n}\n.assigned-asset-join-content .asset-explore-borrow-policy-card em {\n  color: #9e6422;\n  font-size: 0.74rem;\n  font-style: normal;\n  font-weight: 800;\n  white-space: nowrap;\n}\n.assigned-asset-join-content .asset-explore-borrow-payment-summary {\n  display: grid;\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n  gap: 0.65rem;\n}\n.assigned-asset-join-content .asset-explore-borrow-payment-summary article {\n  display: grid;\n  gap: 0.24rem;\n  padding: 0.75rem 0.8rem;\n  border-radius: 14px;\n  border: 1px solid rgba(228, 194, 145, 0.82);\n  background: rgba(255, 255, 255, 0.9);\n}\n.assigned-asset-join-content .asset-explore-borrow-payment-summary span {\n  color: rgba(86, 60, 31, 0.76);\n  font-size: 0.78rem;\n  font-weight: 700;\n}\n.assigned-asset-join-content .asset-explore-borrow-payment-summary strong {\n  color: #6a4a1c;\n  font-size: 0.94rem;\n  font-weight: 800;\n}\n.assigned-asset-join-content .subevent-resource-editor-error {\n  margin: 0;\n  color: #b42331;\n  font-size: 0.82rem;\n  font-weight: 700;\n}\n.assigned-asset-join-content .asset-explore-borrow-actions {\n  display: flex;\n  justify-content: flex-end;\n  padding-top: 0.1rem;\n}\n.assigned-asset-join-content .assigned-asset-join-action-menu {\n  display: inline-flex;\n  --app-menu-action-min-width: 138px;\n  --app-menu-action-height: 46px;\n  --app-menu-action-padding: 0 1rem;\n}\n@media (max-width: 640px) {\n  .assigned-asset-join-content .asset-explore-borrow-actions,\n  .assigned-asset-join-content .assigned-asset-join-action-menu {\n    width: 100%;\n  }\n  .assigned-asset-join-content .asset-explore-borrow-payment-summary {\n    grid-template-columns: minmax(0, 1fr);\n  }\n}\n/*# sourceMappingURL=event-resource-assigned-asset-join-dialog.component.css.map */\n"], encapsulation: 2, changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(EventResourceAssignedAssetJoinDialogComponent, [{
    type: Component,
    args: [{ selector: "app-event-resource-assigned-asset-join-dialog", standalone: true, imports: [CommonModule, PopupComponent, AppMenuComponent], encapsulation: ViewEncapsulation.None, changeDetection: ChangeDetectionStrategy.OnPush, template: `@if (dialog; as dialog) {
  <app-popup [model]="joinPopupModel(dialog)" [zIndex]="joinPopupZIndex()">
    <div class="assigned-asset-join-content">
      <section class="experience-form-panel subevent-form-panel subevent-group-form-panel asset-explore-borrow-panel">
        <div class="asset-explore-borrow-form">
          <section class="asset-explore-borrow-review-card">
            <div class="asset-explore-borrow-review-card__head">
              <div>
                <h4>Join Summary</h4>
                <span>{{ dialog.timeframe }}</span>
              </div>
              <strong>{{ dialog.shareAmount > 0 ? formatMoney(dialog.shareAmount, dialog.currency) : 'Included' }}</strong>
            </div>
            <div class="asset-explore-borrow-review-card__list">
              @for (item of dialog.lineItems; track item.id) {
                <article class="asset-explore-borrow-review-card__item">
                  <div>
                    <strong>{{ item.label }}</strong>
                    <span>{{ dialog.pathLabel }} \xB7 {{ dialog.memberSummary }}</span>
                  </div>
                  <strong>{{ item.amount > 0 ? formatMoney(item.amount, item.currency) : 'Included' }}</strong>
                </article>
              }
            </div>
          </section>

          <section class="asset-explore-borrow-review-card asset-explore-borrow-review-card--payment">
            <div class="asset-explore-borrow-review-card__head">
              <div>
                <h4>Shared Price</h4>
                <span>{{ dialog.shareHint }}</span>
              </div>
              <strong>{{ dialog.shareAmount > 0 ? formatMoney(dialog.shareAmount, dialog.currency) : 'Included' }}</strong>
            </div>
            <div class="asset-explore-borrow-payment-summary">
              <article>
                <span>Asset total</span>
                <strong>{{ dialog.totalAmount > 0 ? formatMoney(dialog.totalAmount, dialog.currency) : 'Included' }}</strong>
              </article>
              <article>
                <span>{{ dialog.shareLabel }}</span>
                <strong>{{ dialog.shareAmount > 0 ? formatMoney(dialog.shareAmount, dialog.currency) : 'Included' }}</strong>
              </article>
              <article>
                <span>Members after join</span>
                <strong>{{ dialog.shareMemberCount }}</strong>
              </article>
            </div>
          </section>

          @if (dialog.policies.length > 0) {
            <section class="asset-explore-borrow-review-card">
              <div class="asset-explore-borrow-review-card__head">
                <div>
                  <h4>Policies</h4>
                  <span>Review and approve before joining</span>
                </div>
              </div>
              <div class="asset-explore-borrow-policy-list">
                @for (policy of dialog.policies; track policy.id) {
                  <label class="asset-explore-borrow-policy-card" [class.is-required]="policy.required !== false">
                    <input
                      type="checkbox"
                      [checked]="dialog.acceptedPolicyIds.includes(policy.id)"
                      (change)="togglePolicy(policy.id)"
                    />
                    <div>
                      <strong>{{ policy.title }}</strong>
                      @if (policy.description) {
                        <span>{{ policy.description }}</span>
                      }
                    </div>
                    @if (policy.required !== false) {
                      <em>Required</em>
                    }
                  </label>
                }
              </div>
            </section>
          }

          @if (dialog.error) {
            <p class="subevent-resource-editor-error">{{ dialog.error }}</p>
          }

          <div class="asset-explore-borrow-actions">
            <app-menu
              class="assigned-asset-join-action-menu"
              kind="inline"
              layout="row"
              [items]="joinFooterMenuItems(dialog)"
              (itemSelect)="onJoinActionMenuSelect($event)"
            ></app-menu>
          </div>
        </div>
      </section>
    </div>
  </app-popup>
}
`, styles: ["/* src/app/activity/components/event-resource-popup/assigned-asset-join-dialog/event-resource-assigned-asset-join-dialog.component.scss */\n.assigned-asset-join-content {\n  display: flex;\n  flex-direction: column;\n  flex: 1 1 auto;\n  min-height: 0;\n}\n.assigned-asset-join-content .asset-explore-borrow-panel {\n  border: 1px solid rgba(43, 71, 107, 0.2);\n  border-radius: 14px;\n  background:\n    linear-gradient(\n      180deg,\n      #f8fbff 0%,\n      #f4f8ff 100%);\n  padding: 0.74rem;\n  display: grid;\n  gap: 0.78rem;\n  margin: 0;\n  box-sizing: border-box;\n  flex: 1 1 auto;\n  min-height: 0;\n  overflow-y: auto;\n  overflow-x: hidden;\n  -webkit-overflow-scrolling: touch;\n}\n.assigned-asset-join-content .asset-explore-borrow-form {\n  display: grid;\n  gap: 0.95rem;\n}\n.assigned-asset-join-content .asset-explore-borrow-review-card {\n  display: grid;\n  gap: 0.7rem;\n  padding: 0.85rem 0.95rem;\n  border: 1px solid rgba(202, 219, 237, 0.9);\n  border-radius: 16px;\n  background:\n    linear-gradient(\n      180deg,\n      rgba(250, 253, 255, 0.98) 0%,\n      rgba(240, 247, 255, 0.96) 100%);\n  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.75);\n}\n.assigned-asset-join-content .asset-explore-borrow-review-card--payment {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(251, 247, 239, 0.98) 0%,\n      rgba(247, 239, 224, 0.98) 100%);\n  border-color: rgba(224, 191, 142, 0.78);\n}\n.assigned-asset-join-content .asset-explore-borrow-review-card__head {\n  display: flex;\n  align-items: flex-start;\n  justify-content: space-between;\n  gap: 0.75rem;\n}\n.assigned-asset-join-content .asset-explore-borrow-review-card__head > div {\n  display: grid;\n  gap: 0.22rem;\n}\n.assigned-asset-join-content .asset-explore-borrow-review-card__head h4 {\n  margin: 0;\n  font-size: 0.94rem;\n  font-weight: 800;\n  color: #214168;\n}\n.assigned-asset-join-content .asset-explore-borrow-review-card__head span {\n  color: rgba(35, 57, 88, 0.74);\n  font-size: 0.8rem;\n  font-weight: 600;\n  line-height: 1.28;\n}\n.assigned-asset-join-content .asset-explore-borrow-review-card__head strong {\n  color: #214168;\n  font-size: 0.94rem;\n  font-weight: 800;\n  white-space: nowrap;\n}\n.assigned-asset-join-content .asset-explore-borrow-review-card__list,\n.assigned-asset-join-content .asset-explore-borrow-policy-list {\n  display: grid;\n  gap: 0.55rem;\n}\n.assigned-asset-join-content .asset-explore-borrow-review-card__item,\n.assigned-asset-join-content .asset-explore-borrow-policy-card {\n  display: flex;\n  align-items: flex-start;\n  justify-content: space-between;\n  gap: 0.75rem;\n  padding: 0.78rem 0.85rem;\n  border-radius: 14px;\n  border: 1px solid rgba(203, 219, 238, 0.92);\n  background: rgba(255, 255, 255, 0.95);\n}\n.assigned-asset-join-content .asset-explore-borrow-review-card__item > div,\n.assigned-asset-join-content .asset-explore-borrow-policy-card > div {\n  display: grid;\n  gap: 0.24rem;\n  min-width: 0;\n}\n.assigned-asset-join-content .asset-explore-borrow-review-card__item strong,\n.assigned-asset-join-content .asset-explore-borrow-policy-card strong {\n  color: #24456d;\n  font-size: 0.9rem;\n  font-weight: 800;\n}\n.assigned-asset-join-content .asset-explore-borrow-review-card__item span,\n.assigned-asset-join-content .asset-explore-borrow-policy-card span {\n  color: rgba(35, 57, 88, 0.74);\n  font-size: 0.8rem;\n  line-height: 1.3;\n}\n.assigned-asset-join-content .asset-explore-borrow-policy-card {\n  align-items: center;\n}\n.assigned-asset-join-content .asset-explore-borrow-policy-card input {\n  width: 18px;\n  height: 18px;\n  margin: 0.1rem 0 0;\n  accent-color: #3467b6;\n  flex: 0 0 auto;\n}\n.assigned-asset-join-content .asset-explore-borrow-policy-card.is-required {\n  border-color: rgba(228, 189, 122, 0.78);\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 251, 244, 0.98) 0%,\n      rgba(255, 247, 233, 0.96) 100%);\n}\n.assigned-asset-join-content .asset-explore-borrow-policy-card em {\n  color: #9e6422;\n  font-size: 0.74rem;\n  font-style: normal;\n  font-weight: 800;\n  white-space: nowrap;\n}\n.assigned-asset-join-content .asset-explore-borrow-payment-summary {\n  display: grid;\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n  gap: 0.65rem;\n}\n.assigned-asset-join-content .asset-explore-borrow-payment-summary article {\n  display: grid;\n  gap: 0.24rem;\n  padding: 0.75rem 0.8rem;\n  border-radius: 14px;\n  border: 1px solid rgba(228, 194, 145, 0.82);\n  background: rgba(255, 255, 255, 0.9);\n}\n.assigned-asset-join-content .asset-explore-borrow-payment-summary span {\n  color: rgba(86, 60, 31, 0.76);\n  font-size: 0.78rem;\n  font-weight: 700;\n}\n.assigned-asset-join-content .asset-explore-borrow-payment-summary strong {\n  color: #6a4a1c;\n  font-size: 0.94rem;\n  font-weight: 800;\n}\n.assigned-asset-join-content .subevent-resource-editor-error {\n  margin: 0;\n  color: #b42331;\n  font-size: 0.82rem;\n  font-weight: 700;\n}\n.assigned-asset-join-content .asset-explore-borrow-actions {\n  display: flex;\n  justify-content: flex-end;\n  padding-top: 0.1rem;\n}\n.assigned-asset-join-content .assigned-asset-join-action-menu {\n  display: inline-flex;\n  --app-menu-action-min-width: 138px;\n  --app-menu-action-height: 46px;\n  --app-menu-action-padding: 0 1rem;\n}\n@media (max-width: 640px) {\n  .assigned-asset-join-content .asset-explore-borrow-actions,\n  .assigned-asset-join-content .assigned-asset-join-action-menu {\n    width: 100%;\n  }\n  .assigned-asset-join-content .asset-explore-borrow-payment-summary {\n    grid-template-columns: minmax(0, 1fr);\n  }\n}\n/*# sourceMappingURL=event-resource-assigned-asset-join-dialog.component.css.map */\n"] }]
  }], null, { dialog: [{
    type: Input
  }], parentZIndex: [{
    type: Input
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(EventResourceAssignedAssetJoinDialogComponent, { className: "EventResourceAssignedAssetJoinDialogComponent", filePath: "app/activity/components/event-resource-popup/assigned-asset-join-dialog/event-resource-assigned-asset-join-dialog.component.ts", lineNumber: 49 });
})();
export {
  EventResourceAssignedAssetJoinDialogComponent
};
//# sourceMappingURL=event-resource-assigned-asset-join-dialog.component-DKN6O4AJ.js.map
