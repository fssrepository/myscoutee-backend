import {
  ProfileStore
} from "./chunk-O6ZAHHD6.js";
import {
  DocumentViewerComponent
} from "./chunk-RUMYM7HH.js";
import "./chunk-AP4X7E7Y.js";
import "./chunk-22I4RYEC.js";
import "./chunk-666FMAP4.js";
import {
  FormFlowComponent
} from "./chunk-YRACL52Y.js";
import "./chunk-D4F2JAG2.js";
import "./chunk-4YEKZ276.js";
import {
  HelpCenterRevisionDocumentViewerConfigConverter
} from "./chunk-57OMTMC7.js";
import "./chunk-ATZPOBBV.js";
import "./chunk-QTZRA7AZ.js";
import "./chunk-2QZ4HDFE.js";
import "./chunk-2XAMZBDM.js";
import "./chunk-4VYYFWRA.js";
import "./chunk-PSPTYTHW.js";
import "./chunk-RCCI52V4.js";
import "./chunk-7FJOOQKP.js";
import "./chunk-KO4GQHHA.js";
import "./chunk-Z4E5Y2UC.js";
import "./chunk-RFTK2A34.js";
import "./chunk-7FYNT6CO.js";
import "./chunk-IPHHDSOR.js";
import "./chunk-EA3MO7BB.js";
import "./chunk-5VDIJXBA.js";
import "./chunk-Z7T4C7EV.js";
import {
  HelpCenterService,
  PrivacyPolicyService
} from "./chunk-JNYVIKB6.js";
import "./chunk-522CXB3E.js";
import "./chunk-HWWKH4YJ.js";
import "./chunk-LFVP4M73.js";
import "./chunk-2DMDD7ZZ.js";
import {
  PopupComponent
} from "./chunk-ERGA5DCY.js";
import "./chunk-ADBOYRJ7.js";
import "./chunk-EAXEH725.js";
import {
  AppMenuComponent
} from "./chunk-53UGBDSO.js";
import "./chunk-MOUXN75Y.js";
import "./chunk-XWLWXSMR.js";
import "./chunk-DYRCSW2W.js";
import "./chunk-LFSBDD6U.js";
import "./chunk-WKZNFPJU.js";
import "./chunk-QPFHBVSW.js";
import "./chunk-A3L6CHD4.js";
import {
  FormsModule,
  I18nPipe,
  NgControlStatus,
  NgModel
} from "./chunk-L6HJFJOR.js";
import "./chunk-LFBAVSTX.js";
import {
  AppRuntimeStore,
  USER_FEEDBACK_SUBMIT_CONTEXT_KEY,
  USER_REPORT_USER_SUBMIT_CONTEXT_KEY,
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
  UserProfileStore
} from "./chunk-IEWB22H3.js";
import "./chunk-UKS3QROH.js";
import "./chunk-C6JV7CA3.js";
import "./chunk-N7OBXPJA.js";
import {
  I18nService
} from "./chunk-AOUY6FNC.js";
import "./chunk-SCHUURLR.js";
import {
  AppUtils
} from "./chunk-CYVMX3LD.js";
import "./chunk-HDBJPOT3.js";
import "./chunk-LDZENZ35.js";
import "./chunk-DZ6OOOZN.js";
import "./chunk-ODJSNRFC.js";
import {
  ChangeDetectorRef,
  Component,
  HostListener,
  computed,
  effect,
  inject,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵadvance,
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
  ɵɵresetView,
  ɵɵresolveWindow,
  ɵɵrestoreView,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1
} from "./chunk-EV3I3YNV.js";

// src/app/profile/components/feedback-popup/feedback-popup.component.ts
function ProfileFeedbackPopupComponent_Conditional_1_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 2);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx);
  }
}
function ProfileFeedbackPopupComponent_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275conditionalCreate(0, ProfileFeedbackPopupComponent_Conditional_1_Conditional_0_Template, 2, 1, "div", 2);
    \u0275\u0275elementStart(1, "app-form-flow", 3);
    \u0275\u0275listener("ngModelChange", function ProfileFeedbackPopupComponent_Conditional_1_Template_app_form_flow_ngModelChange_1_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onFeedbackFlowValueChange($event));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "div", 4)(3, "app-menu", 5);
    \u0275\u0275listener("itemSelect", function ProfileFeedbackPopupComponent_Conditional_1_Template_app_menu_itemSelect_3_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onFeedbackActionMenuSelect($event));
    });
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    let tmp_1_0;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275conditional((tmp_1_0 = ctx_r1.submitErrorMessage()) ? 0 : -1, tmp_1_0);
    \u0275\u0275advance();
    \u0275\u0275property("model", ctx_r1.feedbackFlowModel())("ngModel", ctx_r1.feedbackForm)("saving", ctx_r1.isSubmitting())("disabled", ctx_r1.isSubmitBusy());
    \u0275\u0275advance(2);
    \u0275\u0275property("items", ctx_r1.feedbackActionMenuItems());
  }
}
function ProfileFeedbackPopupComponent_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "article", 1)(1, "div", 6);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.feedbackSubmitMessage);
  }
}
var ProfileFeedbackPopupComponent = class _ProfileFeedbackPopupComponent {
  profileStore = inject(ProfileStore);
  usersService = inject(UsersService);
  i18n = inject(I18nService);
  userProfileStore = inject(UserProfileStore);
  runtimeStore = inject(AppRuntimeStore);
  submitLoadState = this.runtimeStore.selectLoadingState(USER_FEEDBACK_SUBMIT_CONTEXT_KEY);
  submitAbortController = null;
  submitRequestVersion = 0;
  feedbackCategories = APP_STATIC_DATA.feedbackCategories;
  feedbackDetailsMinLength = 8;
  isSubmitting = computed(() => this.submitLoadState().status === "loading", ...ngDevMode ? [{ debugName: "isSubmitting" }] : (
    /* istanbul ignore next */
    []
  ));
  hasSubmitError = computed(() => {
    const status = this.submitLoadState().status;
    return status === "error" || status === "timeout";
  }, ...ngDevMode ? [{ debugName: "hasSubmitError" }] : (
    /* istanbul ignore next */
    []
  ));
  isSubmitSuccess = computed(() => this.submitLoadState().status === "success", ...ngDevMode ? [{ debugName: "isSubmitSuccess" }] : (
    /* istanbul ignore next */
    []
  ));
  isSubmitBusy = computed(() => this.isSubmitting() || this.isSubmitSuccess(), ...ngDevMode ? [{ debugName: "isSubmitBusy" }] : (
    /* istanbul ignore next */
    []
  ));
  showSubmitRing = computed(() => this.isSubmitting() || this.hasSubmitError() || this.isSubmitSuccess(), ...ngDevMode ? [{ debugName: "showSubmitRing" }] : (
    /* istanbul ignore next */
    []
  ));
  submitErrorMessage = computed(() => this.hasSubmitError() ? this.submitLoadState().error ?? "Unable to send feedback." : "", ...ngDevMode ? [{ debugName: "submitErrorMessage" }] : (
    /* istanbul ignore next */
    []
  ));
  feedbackForm = this.createInitialForm();
  feedbackSubmitMessage = "";
  feedbackSubmitted = false;
  constructor() {
    this.runtimeStore.resetLoadingState(USER_FEEDBACK_SUBMIT_CONTEXT_KEY);
  }
  ngOnDestroy() {
    this.abortActiveSubmit();
    this.runtimeStore.resetLoadingState(USER_FEEDBACK_SUBMIT_CONTEXT_KEY);
  }
  closePopup() {
    this.abortActiveSubmit();
    this.profileStore.closeSettingsPopup();
  }
  get feedbackDetailsLength() {
    return this.feedbackForm.details.trim().length;
  }
  get feedbackDetailsRemaining() {
    return Math.max(0, this.feedbackDetailsMinLength - this.feedbackDetailsLength);
  }
  canSubmitFeedback() {
    return !this.isSubmitBusy() && !!this.feedbackForm.subject.trim() && this.feedbackDetailsRemaining === 0;
  }
  feedbackFlowModel() {
    const disabled = this.isSubmitBusy();
    return {
      title: "Send Feedback",
      layout: "grouped",
      tone: "blue",
      header: false,
      allowMenuOverflow: true,
      summary: { enabled: false },
      completion: { controls: "none" },
      save: null,
      steps: [{
        id: "feedback",
        title: "Feedback",
        chrome: "none",
        controls: [
          {
            id: "feedback-category",
            bind: "category",
            kind: "menu",
            layout: "wide",
            label: "Category",
            disabled,
            config: {
              kind: "select",
              layout: "list",
              title: "Category",
              trigger: {
                label: this.feedbackForm.category,
                icon: "category",
                palette: this.feedbackCategoryPalette(this.feedbackForm.category),
                layout: "field",
                disabled,
                ariaLabel: "Select feedback category"
              },
              items: this.feedbackCategories.map((category, index) => ({
                id: `feedback-category-${index}`,
                label: category,
                icon: this.feedbackCategoryIcon(category),
                kind: "radio",
                value: category,
                active: category === this.feedbackForm.category,
                checked: category === this.feedbackForm.category,
                palette: this.feedbackCategoryPalette(category),
                surface: "tinted",
                disabled
              }))
            }
          },
          {
            id: "feedback-subject",
            bind: "subject",
            kind: "text",
            layout: "wide",
            label: "Subject",
            placeholder: "Short summary",
            disabled
          },
          {
            id: "feedback-details",
            bind: "details",
            kind: "textarea",
            layout: "wide",
            label: "Details",
            placeholder: "Describe your feedback. Include steps if this is a bug.",
            rows: 4,
            required: true,
            minLength: this.feedbackDetailsMinLength,
            disabled
          }
        ]
      }]
    };
  }
  feedbackActionMenuItems() {
    return [
      {
        id: "feedback-cancel",
        label: "Cancel",
        layout: "action",
        palette: "slate",
        ariaLabel: "Cancel feedback"
      },
      {
        id: "feedback-submit",
        label: "Send feedback",
        layout: "action",
        palette: this.hasSubmitError() ? "danger" : this.isSubmitSuccess() ? "success" : "blue",
        disabled: !this.canSubmitFeedback(),
        ariaLabel: "Send feedback",
        progress: this.showSubmitRing() ? {
          state: this.hasSubmitError() ? "error" : this.isSubmitSuccess() ? "success" : "loading",
          shape: "button"
        } : null
      }
    ];
  }
  onFeedbackFlowValueChange(value) {
    const record = this.isRecord(value) ? value : {};
    const category = `${record["category"] ?? ""}`;
    this.feedbackForm = {
      category: this.feedbackCategories.includes(category) ? category : this.feedbackCategories[0] ?? "General",
      subject: `${record["subject"] ?? ""}`,
      details: `${record["details"] ?? ""}`
    };
    this.clearSubmitStatus();
  }
  onFeedbackActionMenuSelect(event) {
    if (event.id === "feedback-cancel") {
      this.closePopup();
    } else if (event.id === "feedback-submit") {
      void this.submitFeedback();
    }
  }
  clearSubmitStatus() {
    if (this.isSubmitBusy() || this.feedbackSubmitted) {
      return;
    }
    this.runtimeStore.resetLoadingState(USER_FEEDBACK_SUBMIT_CONTEXT_KEY);
  }
  async submitFeedback() {
    const activeUserId = this.userProfileStore.activeUserId().trim();
    const subject = this.feedbackForm.subject.trim();
    const details = this.feedbackForm.details.trim();
    if (!activeUserId || !subject || details.length < this.feedbackDetailsMinLength || this.isSubmitting()) {
      return;
    }
    this.runtimeStore.resetLoadingState(USER_FEEDBACK_SUBMIT_CONTEXT_KEY);
    const requestVersion = ++this.submitRequestVersion;
    const abortController = new AbortController();
    this.submitAbortController = abortController;
    const response = await this.usersService.submitUserFeedback({
      userId: activeUserId,
      category: this.feedbackForm.category,
      subject,
      details
    }, void 0, abortController.signal);
    if (this.submitAbortController === abortController) {
      this.submitAbortController = null;
    }
    if (requestVersion !== this.submitRequestVersion || abortController.signal.aborted || !response.submitted) {
      return;
    }
    const responseMessage = response.message?.trim() ?? "";
    this.feedbackSubmitMessage = responseMessage ? this.i18n.translate(responseMessage) : this.i18n.translateParams("feedback.submitted.category.success", { category: this.feedbackForm.category });
    this.feedbackSubmitted = true;
  }
  feedbackCategoryIcon(category) {
    switch (category) {
      case "Bug report":
        return "bug_report";
      case "Feature request":
        return "lightbulb";
      case "UX improvement":
        return "touch_app";
      case "Performance":
        return "speed";
      default:
        return "category";
    }
  }
  feedbackCategoryPalette(category) {
    switch (category) {
      case "Bug report":
        return "danger";
      case "Feature request":
        return "amber";
      case "UX improvement":
        return "violet";
      case "Performance":
        return "green";
      default:
        return "blue";
    }
  }
  createInitialForm() {
    return {
      category: this.feedbackCategories[0] ?? "General",
      subject: "",
      details: ""
    };
  }
  isRecord(value) {
    return typeof value === "object" && value !== null && !Array.isArray(value);
  }
  abortActiveSubmit() {
    this.submitRequestVersion += 1;
    if (!this.submitAbortController) {
      return;
    }
    const controller = this.submitAbortController;
    this.submitAbortController = null;
    controller.abort();
    this.runtimeStore.resetLoadingState(USER_FEEDBACK_SUBMIT_CONTEXT_KEY);
  }
  static \u0275fac = function ProfileFeedbackPopupComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ProfileFeedbackPopupComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ProfileFeedbackPopupComponent, selectors: [["app-profile-feedback-popup"]], decls: 3, vars: 1, consts: [[1, "support-popup"], [1, "support-success-card"], ["role", "alert", 1, "support-submit-error"], [1, "support-form-flow", 3, "ngModelChange", "model", "ngModel", "saving", "disabled"], [1, "support-actions"], ["kind", "inline", 1, "support-action-menu", 3, "itemSelect", "items"], [1, "support-submit-success"]], template: function ProfileFeedbackPopupComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0);
      \u0275\u0275conditionalCreate(1, ProfileFeedbackPopupComponent_Conditional_1_Template, 4, 6)(2, ProfileFeedbackPopupComponent_Conditional_2_Template, 3, 1, "article", 1);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275advance();
      \u0275\u0275conditional(!ctx.feedbackSubmitted ? 1 : 2);
    }
  }, dependencies: [FormsModule, NgControlStatus, NgModel, AppMenuComponent, FormFlowComponent], styles: ['\n[_nghost-%COMP%] {\n  display: block;\n  font-family:\n    "Nunito Sans",\n    "Segoe UI",\n    sans-serif;\n}\n.support-popup[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 0.6rem;\n  min-width: 0;\n}\n.support-form-flow[_ngcontent-%COMP%] {\n  display: block;\n  width: 100%;\n  min-width: 0;\n}\n.support-submit-error[_ngcontent-%COMP%] {\n  border: 1px solid rgba(186, 56, 68, 0.22);\n  border-radius: 10px;\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 242, 243, 0.96) 0%,\n      rgba(255, 233, 236, 0.96) 100%);\n  color: #9b2c37;\n  font-size: 0.74rem;\n  font-weight: 700;\n  line-height: 1.3;\n  padding: 0.48rem 0.56rem;\n}\n.support-submit-success[_ngcontent-%COMP%] {\n  border: 1px solid rgba(41, 131, 84, 0.35);\n  border-radius: 10px;\n  background:\n    linear-gradient(\n      180deg,\n      rgba(220, 249, 231, 0.95) 0%,\n      rgba(208, 245, 223, 0.95) 100%);\n  color: #1f6f48;\n  font-size: 0.78rem;\n  font-weight: 700;\n  line-height: 1.35;\n  padding: 0.52rem 0.58rem;\n}\n.support-success-card[_ngcontent-%COMP%] {\n  margin: 0;\n}\n.support-actions[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: flex-end;\n  align-items: center;\n  gap: 0.45rem;\n  flex-wrap: wrap;\n}\n.support-action-menu[_ngcontent-%COMP%] {\n  position: relative;\n  display: inline-flex;\n  align-items: stretch;\n  justify-content: flex-end;\n  min-width: 260px;\n}\n.support-action-menu[_ngcontent-%COMP%]     .app-menu {\n  width: 100%;\n}\n.support-action-menu[_ngcontent-%COMP%]     .app-menu__button-row {\n  justify-content: flex-end;\n  gap: 0.65rem;\n}\n.support-action-menu[_ngcontent-%COMP%]     .app-menu__button-row-item--action.app-menu__button-row-item--labelled, \n.support-action-menu[_ngcontent-%COMP%]     .app-menu__button-row-item--action {\n  flex: 0 1 auto;\n  min-width: 108px;\n  min-height: 42px;\n  height: 42px;\n  justify-content: center;\n  padding-inline: 1rem;\n}\n.support-action-menu[_ngcontent-%COMP%]     .app-menu__button-row-item--action .app-menu__button-row-label {\n  text-align: center;\n}\n@media (max-width: 520px) {\n  .support-actions[_ngcontent-%COMP%], \n   .support-action-menu[_ngcontent-%COMP%] {\n    width: 100%;\n  }\n}\n/*# sourceMappingURL=feedback-popup.component.css.map */'] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ProfileFeedbackPopupComponent, [{
    type: Component,
    args: [{ selector: "app-profile-feedback-popup", standalone: true, imports: [FormsModule, AppMenuComponent, FormFlowComponent], template: '<div class="support-popup">\n  @if (!feedbackSubmitted) {\n    @if (submitErrorMessage(); as errorMessage) {\n      <div class="support-submit-error" role="alert">{{ errorMessage }}</div>\n    }\n    <app-form-flow\n      class="support-form-flow"\n      [model]="feedbackFlowModel()"\n      [ngModel]="feedbackForm"\n      [saving]="isSubmitting()"\n      [disabled]="isSubmitBusy()"\n      (ngModelChange)="onFeedbackFlowValueChange($event)"\n    ></app-form-flow>\n    <div class="support-actions">\n      <app-menu\n        class="support-action-menu"\n        kind="inline"\n        [items]="feedbackActionMenuItems()"\n        (itemSelect)="onFeedbackActionMenuSelect($event)"\n      ></app-menu>\n    </div>\n  } @else {\n    <article class="support-success-card">\n      <div class="support-submit-success">{{ feedbackSubmitMessage }}</div>\n    </article>\n  }\n</div>\n', styles: ['/* src/app/profile/components/feedback-popup/feedback-popup.component.scss */\n:host {\n  display: block;\n  font-family:\n    "Nunito Sans",\n    "Segoe UI",\n    sans-serif;\n}\n.support-popup {\n  display: flex;\n  flex-direction: column;\n  gap: 0.6rem;\n  min-width: 0;\n}\n.support-form-flow {\n  display: block;\n  width: 100%;\n  min-width: 0;\n}\n.support-submit-error {\n  border: 1px solid rgba(186, 56, 68, 0.22);\n  border-radius: 10px;\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 242, 243, 0.96) 0%,\n      rgba(255, 233, 236, 0.96) 100%);\n  color: #9b2c37;\n  font-size: 0.74rem;\n  font-weight: 700;\n  line-height: 1.3;\n  padding: 0.48rem 0.56rem;\n}\n.support-submit-success {\n  border: 1px solid rgba(41, 131, 84, 0.35);\n  border-radius: 10px;\n  background:\n    linear-gradient(\n      180deg,\n      rgba(220, 249, 231, 0.95) 0%,\n      rgba(208, 245, 223, 0.95) 100%);\n  color: #1f6f48;\n  font-size: 0.78rem;\n  font-weight: 700;\n  line-height: 1.35;\n  padding: 0.52rem 0.58rem;\n}\n.support-success-card {\n  margin: 0;\n}\n.support-actions {\n  display: flex;\n  justify-content: flex-end;\n  align-items: center;\n  gap: 0.45rem;\n  flex-wrap: wrap;\n}\n.support-action-menu {\n  position: relative;\n  display: inline-flex;\n  align-items: stretch;\n  justify-content: flex-end;\n  min-width: 260px;\n}\n.support-action-menu ::ng-deep .app-menu {\n  width: 100%;\n}\n.support-action-menu ::ng-deep .app-menu__button-row {\n  justify-content: flex-end;\n  gap: 0.65rem;\n}\n.support-action-menu ::ng-deep .app-menu__button-row-item--action.app-menu__button-row-item--labelled,\n.support-action-menu ::ng-deep .app-menu__button-row-item--action {\n  flex: 0 1 auto;\n  min-width: 108px;\n  min-height: 42px;\n  height: 42px;\n  justify-content: center;\n  padding-inline: 1rem;\n}\n.support-action-menu ::ng-deep .app-menu__button-row-item--action .app-menu__button-row-label {\n  text-align: center;\n}\n@media (max-width: 520px) {\n  .support-actions,\n  .support-action-menu {\n    width: 100%;\n  }\n}\n/*# sourceMappingURL=feedback-popup.component.css.map */\n'] }]
  }], () => [], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ProfileFeedbackPopupComponent, { className: "ProfileFeedbackPopupComponent", filePath: "app/profile/components/feedback-popup/feedback-popup.component.ts", lineNumber: 40 });
})();

// src/app/profile/components/report-user-popup/report-user-popup.component.ts
function ProfileReportUserPopupComponent_Conditional_1_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 2);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "i18n");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(2, 1, "Reports can only be started from an event organizer or a member card tied to an event."), " ");
  }
}
function ProfileReportUserPopupComponent_Conditional_1_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 2);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "i18n");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(2, 1, ctx));
  }
}
function ProfileReportUserPopupComponent_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275conditionalCreate(0, ProfileReportUserPopupComponent_Conditional_1_Conditional_0_Template, 3, 3, "div", 2);
    \u0275\u0275conditionalCreate(1, ProfileReportUserPopupComponent_Conditional_1_Conditional_1_Template, 3, 3, "div", 2);
    \u0275\u0275elementStart(2, "app-form-flow", 3);
    \u0275\u0275listener("ngModelChange", function ProfileReportUserPopupComponent_Conditional_1_Template_app_form_flow_ngModelChange_2_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onReportUserFlowValueChange($event));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 4)(4, "app-menu", 5);
    \u0275\u0275listener("itemSelect", function ProfileReportUserPopupComponent_Conditional_1_Template_app_menu_itemSelect_4_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onReportUserActionMenuSelect($event));
    });
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    let tmp_2_0;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275conditional(!ctx_r1.isContextualReport() ? 0 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_2_0 = ctx_r1.submitErrorMessage()) ? 1 : -1, tmp_2_0);
    \u0275\u0275advance();
    \u0275\u0275property("model", ctx_r1.reportUserFlowModel())("ngModel", ctx_r1.reportUserForm)("saving", ctx_r1.isSubmitting())("disabled", ctx_r1.isSubmitBusy());
    \u0275\u0275advance(2);
    \u0275\u0275property("items", ctx_r1.reportUserActionMenuItems());
  }
}
function ProfileReportUserPopupComponent_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "article", 1)(1, "div", 6);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.reportUserSubmitMessage);
  }
}
var ProfileReportUserPopupComponent = class _ProfileReportUserPopupComponent {
  profileStore = inject(ProfileStore);
  usersService = inject(UsersService);
  userProfileStore = inject(UserProfileStore);
  runtimeStore = inject(AppRuntimeStore);
  submitLoadState = this.runtimeStore.selectLoadingState(USER_REPORT_USER_SUBMIT_CONTEXT_KEY);
  lastContextKey = "";
  submitAbortController = null;
  submitRequestVersion = 0;
  reportUserReasons = APP_STATIC_DATA.reportUserReasons;
  reportUserHandleMinLength = 3;
  reportUserDetailsMinLength = 12;
  reportUserContext = this.profileStore.reportUserContext;
  isContextualReport = computed(() => {
    const context = this.reportUserContext();
    return !!context?.targetUserId?.trim() && !!context?.eventId?.trim();
  }, ...ngDevMode ? [{ debugName: "isContextualReport" }] : (
    /* istanbul ignore next */
    []
  ));
  isSubmitting = computed(() => this.submitLoadState().status === "loading", ...ngDevMode ? [{ debugName: "isSubmitting" }] : (
    /* istanbul ignore next */
    []
  ));
  hasSubmitError = computed(() => {
    const status = this.submitLoadState().status;
    return status === "error" || status === "timeout";
  }, ...ngDevMode ? [{ debugName: "hasSubmitError" }] : (
    /* istanbul ignore next */
    []
  ));
  isSubmitSuccess = computed(() => this.submitLoadState().status === "success", ...ngDevMode ? [{ debugName: "isSubmitSuccess" }] : (
    /* istanbul ignore next */
    []
  ));
  isSubmitBusy = computed(() => this.isSubmitting() || this.isSubmitSuccess(), ...ngDevMode ? [{ debugName: "isSubmitBusy" }] : (
    /* istanbul ignore next */
    []
  ));
  showSubmitRing = computed(() => this.isSubmitting() || this.hasSubmitError() || this.isSubmitSuccess(), ...ngDevMode ? [{ debugName: "showSubmitRing" }] : (
    /* istanbul ignore next */
    []
  ));
  submitErrorMessage = computed(() => this.hasSubmitError() ? this.submitLoadState().error ?? "Unable to submit report." : "", ...ngDevMode ? [{ debugName: "submitErrorMessage" }] : (
    /* istanbul ignore next */
    []
  ));
  reportUserForm = this.createInitialForm();
  reportUserSubmitMessage = "";
  reportUserSubmitted = false;
  constructor() {
    this.runtimeStore.resetLoadingState(USER_REPORT_USER_SUBMIT_CONTEXT_KEY);
    effect(() => {
      const context = this.reportUserContext();
      const contextKey = [
        context?.targetUserId?.trim() ?? "",
        context?.memberEntryId?.trim() ?? "",
        context?.eventId?.trim() ?? "",
        context?.eventTitle?.trim() ?? "",
        context?.eventStartAtIso?.trim() ?? "",
        context?.eventTimeframe?.trim() ?? "",
        context?.sourceType?.trim() ?? "",
        context?.sourceId?.trim() ?? "",
        context?.chatId?.trim() ?? "",
        context?.messageId?.trim() ?? ""
      ].join("|");
      if (contextKey === this.lastContextKey) {
        return;
      }
      this.lastContextKey = contextKey;
      this.abortActiveSubmit();
      this.reportUserForm = this.createInitialForm();
      this.reportUserSubmitMessage = "";
      this.reportUserSubmitted = false;
      this.runtimeStore.resetLoadingState(USER_REPORT_USER_SUBMIT_CONTEXT_KEY);
    });
  }
  ngOnDestroy() {
    this.abortActiveSubmit();
    this.runtimeStore.resetLoadingState(USER_REPORT_USER_SUBMIT_CONTEXT_KEY);
  }
  closePopup() {
    this.abortActiveSubmit();
    this.profileStore.closeSettingsPopup();
  }
  get reportUserHandleLength() {
    return this.reportUserForm.handle.trim().length;
  }
  get reportUserDetailsLength() {
    return this.reportUserForm.details.trim().length;
  }
  get reportUserHandleValid() {
    return this.reportUserHandleLength >= this.reportUserHandleMinLength;
  }
  get reportUserDetailsValid() {
    return this.reportUserDetailsLength >= this.reportUserDetailsMinLength;
  }
  canSubmitReportUser() {
    return this.isContextualReport() && !this.isSubmitBusy() && this.reportUserHandleValid && this.reportUserDetailsValid;
  }
  reportUserFlowModel() {
    const disabled = this.isSubmitBusy();
    const controls = [
      {
        id: "report-user-handle",
        bind: "handle",
        kind: "text",
        layout: "wide",
        label: "User",
        placeholder: "Selected member",
        required: true,
        minLength: this.reportUserHandleMinLength,
        readOnly: this.isContextualReport(),
        disabled
      }
    ];
    if (this.isContextualReport()) {
      controls.push({
        id: "report-user-context",
        bind: "contextSummary",
        kind: "textarea",
        layout: "wide",
        label: "Event context",
        rows: 3,
        readOnly: true,
        disabled
      });
    }
    controls.push({
      id: "report-user-reason",
      bind: "reason",
      kind: "menu",
      layout: "wide",
      label: "Reason",
      disabled,
      config: {
        kind: "select",
        layout: "list",
        title: "Reason",
        trigger: {
          label: this.reportUserForm.reason,
          icon: this.reportUserReasonIcon(this.reportUserForm.reason),
          palette: this.reportUserReasonPalette(this.reportUserForm.reason),
          layout: "field",
          disabled,
          ariaLabel: "Select report reason"
        },
        items: this.reportUserReasons.map((reason, index) => ({
          id: `report-user-reason-${index}`,
          label: reason,
          icon: this.reportUserReasonIcon(reason),
          kind: "radio",
          value: reason,
          active: reason === this.reportUserForm.reason,
          checked: reason === this.reportUserForm.reason,
          palette: this.reportUserReasonPalette(reason),
          surface: "tinted",
          disabled
        }))
      }
    }, {
      id: "report-user-details",
      bind: "details",
      kind: "textarea",
      layout: "wide",
      label: "Details",
      placeholder: "Add short details about what happened and why you are reporting this member.",
      rows: 4,
      required: true,
      minLength: this.reportUserDetailsMinLength,
      disabled
    });
    return {
      title: "Report User",
      layout: "grouped",
      tone: "orange",
      header: false,
      allowMenuOverflow: true,
      summary: { enabled: false },
      completion: { controls: "none" },
      save: null,
      steps: [{
        id: "report-user",
        title: "Report User",
        chrome: "none",
        controls
      }]
    };
  }
  reportUserActionMenuItems() {
    return [
      {
        id: "report-user-cancel",
        label: "Cancel",
        layout: "action",
        palette: "slate",
        ariaLabel: "Cancel report"
      },
      {
        id: "report-user-submit",
        label: "Submit report",
        layout: "action",
        palette: this.hasSubmitError() ? "danger" : this.isSubmitSuccess() ? "success" : "blue",
        disabled: !this.canSubmitReportUser(),
        ariaLabel: "Submit report",
        progress: this.showSubmitRing() ? {
          state: this.hasSubmitError() ? "error" : this.isSubmitSuccess() ? "success" : "loading",
          shape: "button"
        } : null
      }
    ];
  }
  onReportUserFlowValueChange(value) {
    const record = this.isRecord(value) ? value : {};
    const reason = `${record["reason"] ?? ""}`;
    this.reportUserForm = {
      handle: this.isContextualReport() ? this.reportUserContext()?.targetName?.trim() || "" : `${record["handle"] ?? ""}`,
      contextSummary: this.reportContextSummary(),
      reason: this.reportUserReasons.includes(reason) ? reason : this.reportUserReasons[0] ?? "Harassment",
      details: `${record["details"] ?? ""}`
    };
    this.clearSubmitStatus();
  }
  onReportUserActionMenuSelect(event) {
    if (event.id === "report-user-cancel") {
      this.closePopup();
    } else if (event.id === "report-user-submit") {
      void this.submitReportUser();
    }
  }
  reportContextSummary() {
    const context = this.reportUserContext();
    if (!context) {
      return "";
    }
    const contextLabel = this.reportContextLabel(context.ownerType);
    const lines = [
      `User: ${context.targetName.trim() || "Unknown user"}`,
      `${contextLabel}: ${context.eventTitle?.trim() || `Unknown ${contextLabel.toLowerCase()}`}`
    ];
    const dateLabel = this.reportEventDateLabel();
    if (dateLabel) {
      lines.push(`Date: ${dateLabel}`);
    }
    return lines.join("\n");
  }
  reportContextLabel(ownerType) {
    switch (ownerType) {
      case "asset":
        return "Asset";
      case "subEvent":
        return "Sub-event";
      case "group":
        return "Group";
      default:
        return "Event";
    }
  }
  reportEventDateLabel() {
    const context = this.reportUserContext();
    const startAtIso = `${context?.eventStartAtIso ?? ""}`.trim();
    if (startAtIso) {
      const parsed = new Date(startAtIso);
      if (Number.isFinite(parsed.getTime())) {
        return parsed.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
          year: "numeric"
        });
      }
    }
    return `${context?.eventTimeframe ?? ""}`.trim();
  }
  clearSubmitStatus() {
    if (this.isSubmitBusy() || this.reportUserSubmitted) {
      return;
    }
    this.runtimeStore.resetLoadingState(USER_REPORT_USER_SUBMIT_CONTEXT_KEY);
  }
  async submitReportUser() {
    const context = this.reportUserContext();
    const activeUserId = this.userProfileStore.activeUserId().trim();
    const target = this.reportUserForm.handle.trim();
    const details = this.reportUserForm.details.trim();
    if (!context || !activeUserId || !this.canSubmitReportUser() || this.isSubmitting()) {
      return;
    }
    this.runtimeStore.resetLoadingState(USER_REPORT_USER_SUBMIT_CONTEXT_KEY);
    const requestVersion = ++this.submitRequestVersion;
    const abortController = new AbortController();
    this.submitAbortController = abortController;
    const response = await this.usersService.submitReportUser({
      userId: activeUserId,
      handle: target,
      reason: this.reportUserForm.reason,
      details,
      targetUserId: context.targetUserId.trim(),
      memberEntryId: `${context.memberEntryId ?? ""}`.trim() || null,
      eventId: context.eventId.trim(),
      eventTitle: `${context.eventTitle ?? ""}`.trim() || null,
      eventStartAtIso: `${context.eventStartAtIso ?? ""}`.trim() || null,
      sourceType: `${context.sourceType ?? ""}`.trim() || null,
      sourceId: `${context.sourceId ?? ""}`.trim() || null,
      sourceText: `${context.sourceText ?? ""}`.trim() || null,
      chatId: `${context.chatId ?? ""}`.trim() || null,
      messageId: `${context.messageId ?? ""}`.trim() || null,
      assetId: `${context.assetId ?? ""}`.trim() || null,
      assetType: `${context.assetType ?? ""}`.trim() || null
    }, void 0, abortController.signal);
    if (this.submitAbortController === abortController) {
      this.submitAbortController = null;
    }
    if (requestVersion !== this.submitRequestVersion || abortController.signal.aborted || !response.submitted) {
      return;
    }
    this.reportUserSubmitMessage = response.message?.trim() ? response.message : `Report submitted successfully for ${target}. Our moderation team will review it.`;
    this.reportUserSubmitted = true;
  }
  reportUserReasonIcon(reason) {
    switch (reason) {
      case "Harassment":
        return "report";
      case "Spam":
        return "mark_email_unread";
      case "Impersonation":
        return "person_search";
      case "Hate speech":
        return "gpp_bad";
      case "Scam / Fraud":
        return "warning_amber";
      default:
        return "flag";
    }
  }
  reportUserReasonPalette(reason) {
    switch (reason) {
      case "Harassment":
      case "Hate speech":
        return "danger";
      case "Spam":
        return "orange";
      case "Impersonation":
        return "violet";
      case "Scam / Fraud":
        return "amber";
      default:
        return "blue";
    }
  }
  createInitialForm() {
    const context = this.reportUserContext();
    return {
      handle: context?.targetName?.trim() || "",
      contextSummary: this.reportContextSummary(),
      reason: this.reportUserReasons[0] ?? "Harassment",
      details: ""
    };
  }
  isRecord(value) {
    return typeof value === "object" && value !== null && !Array.isArray(value);
  }
  abortActiveSubmit() {
    this.submitRequestVersion += 1;
    if (!this.submitAbortController) {
      return;
    }
    const controller = this.submitAbortController;
    this.submitAbortController = null;
    controller.abort();
    this.runtimeStore.resetLoadingState(USER_REPORT_USER_SUBMIT_CONTEXT_KEY);
  }
  static \u0275fac = function ProfileReportUserPopupComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ProfileReportUserPopupComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ProfileReportUserPopupComponent, selectors: [["app-profile-report-user-popup"]], decls: 3, vars: 1, consts: [[1, "support-popup"], [1, "support-success-card"], ["role", "alert", 1, "support-submit-error"], [1, "support-form-flow", 3, "ngModelChange", "model", "ngModel", "saving", "disabled"], [1, "support-actions"], ["kind", "inline", 1, "support-action-menu", 3, "itemSelect", "items"], [1, "support-submit-success"]], template: function ProfileReportUserPopupComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0);
      \u0275\u0275conditionalCreate(1, ProfileReportUserPopupComponent_Conditional_1_Template, 5, 7)(2, ProfileReportUserPopupComponent_Conditional_2_Template, 3, 1, "article", 1);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275advance();
      \u0275\u0275conditional(!ctx.reportUserSubmitted ? 1 : 2);
    }
  }, dependencies: [FormsModule, NgControlStatus, NgModel, AppMenuComponent, FormFlowComponent, I18nPipe], styles: ['\n[_nghost-%COMP%] {\n  display: block;\n  font-family:\n    "Nunito Sans",\n    "Segoe UI",\n    sans-serif;\n}\n.support-popup[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 0.6rem;\n  min-width: 0;\n}\n.support-form-flow[_ngcontent-%COMP%] {\n  display: block;\n  width: 100%;\n  min-width: 0;\n}\n.support-submit-error[_ngcontent-%COMP%] {\n  border: 1px solid rgba(186, 56, 68, 0.22);\n  border-radius: 10px;\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 242, 243, 0.96) 0%,\n      rgba(255, 233, 236, 0.96) 100%);\n  color: #9b2c37;\n  font-size: 0.74rem;\n  font-weight: 700;\n  line-height: 1.3;\n  padding: 0.48rem 0.56rem;\n}\n.support-submit-success[_ngcontent-%COMP%] {\n  border: 1px solid rgba(41, 131, 84, 0.35);\n  border-radius: 10px;\n  background:\n    linear-gradient(\n      180deg,\n      rgba(220, 249, 231, 0.95) 0%,\n      rgba(208, 245, 223, 0.95) 100%);\n  color: #1f6f48;\n  font-size: 0.78rem;\n  font-weight: 700;\n  line-height: 1.35;\n  padding: 0.52rem 0.58rem;\n}\n.support-success-card[_ngcontent-%COMP%] {\n  margin: 0;\n}\n.support-actions[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: flex-end;\n  align-items: center;\n  gap: 0.45rem;\n  flex-wrap: wrap;\n}\n.support-action-menu[_ngcontent-%COMP%] {\n  position: relative;\n  display: inline-flex;\n  align-items: stretch;\n  justify-content: flex-end;\n  min-width: 260px;\n}\n.support-action-menu[_ngcontent-%COMP%]     .app-menu {\n  width: 100%;\n}\n.support-action-menu[_ngcontent-%COMP%]     .app-menu__button-row {\n  justify-content: flex-end;\n  gap: 0.65rem;\n}\n.support-action-menu[_ngcontent-%COMP%]     .app-menu__button-row-item--action.app-menu__button-row-item--labelled, \n.support-action-menu[_ngcontent-%COMP%]     .app-menu__button-row-item--action {\n  flex: 0 1 auto;\n  min-width: 108px;\n  min-height: 42px;\n  height: 42px;\n  justify-content: center;\n  padding-inline: 1rem;\n}\n.support-action-menu[_ngcontent-%COMP%]     .app-menu__button-row-item--action .app-menu__button-row-label {\n  text-align: center;\n}\n@media (max-width: 520px) {\n  .support-actions[_ngcontent-%COMP%], \n   .support-action-menu[_ngcontent-%COMP%] {\n    width: 100%;\n  }\n}\n/*# sourceMappingURL=report-user-popup.component.css.map */'] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ProfileReportUserPopupComponent, [{
    type: Component,
    args: [{ selector: "app-profile-report-user-popup", standalone: true, imports: [FormsModule, AppMenuComponent, FormFlowComponent, I18nPipe], template: `<div class="support-popup">
  @if (!reportUserSubmitted) {
    @if (!isContextualReport()) {
      <div class="support-submit-error" role="alert">
        {{ 'Reports can only be started from an event organizer or a member card tied to an event.' | i18n }}
      </div>
    }
    @if (submitErrorMessage(); as errorMessage) {
      <div class="support-submit-error" role="alert">{{ errorMessage | i18n }}</div>
    }
    <app-form-flow
      class="support-form-flow"
      [model]="reportUserFlowModel()"
      [ngModel]="reportUserForm"
      [saving]="isSubmitting()"
      [disabled]="isSubmitBusy()"
      (ngModelChange)="onReportUserFlowValueChange($event)"
    ></app-form-flow>
    <div class="support-actions">
      <app-menu
        class="support-action-menu"
        kind="inline"
        [items]="reportUserActionMenuItems()"
        (itemSelect)="onReportUserActionMenuSelect($event)"
      ></app-menu>
    </div>
  } @else {
    <article class="support-success-card">
      <div class="support-submit-success">{{ reportUserSubmitMessage }}</div>
    </article>
  }
</div>
`, styles: ['/* src/app/profile/components/report-user-popup/report-user-popup.component.scss */\n:host {\n  display: block;\n  font-family:\n    "Nunito Sans",\n    "Segoe UI",\n    sans-serif;\n}\n.support-popup {\n  display: flex;\n  flex-direction: column;\n  gap: 0.6rem;\n  min-width: 0;\n}\n.support-form-flow {\n  display: block;\n  width: 100%;\n  min-width: 0;\n}\n.support-submit-error {\n  border: 1px solid rgba(186, 56, 68, 0.22);\n  border-radius: 10px;\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 242, 243, 0.96) 0%,\n      rgba(255, 233, 236, 0.96) 100%);\n  color: #9b2c37;\n  font-size: 0.74rem;\n  font-weight: 700;\n  line-height: 1.3;\n  padding: 0.48rem 0.56rem;\n}\n.support-submit-success {\n  border: 1px solid rgba(41, 131, 84, 0.35);\n  border-radius: 10px;\n  background:\n    linear-gradient(\n      180deg,\n      rgba(220, 249, 231, 0.95) 0%,\n      rgba(208, 245, 223, 0.95) 100%);\n  color: #1f6f48;\n  font-size: 0.78rem;\n  font-weight: 700;\n  line-height: 1.35;\n  padding: 0.52rem 0.58rem;\n}\n.support-success-card {\n  margin: 0;\n}\n.support-actions {\n  display: flex;\n  justify-content: flex-end;\n  align-items: center;\n  gap: 0.45rem;\n  flex-wrap: wrap;\n}\n.support-action-menu {\n  position: relative;\n  display: inline-flex;\n  align-items: stretch;\n  justify-content: flex-end;\n  min-width: 260px;\n}\n.support-action-menu ::ng-deep .app-menu {\n  width: 100%;\n}\n.support-action-menu ::ng-deep .app-menu__button-row {\n  justify-content: flex-end;\n  gap: 0.65rem;\n}\n.support-action-menu ::ng-deep .app-menu__button-row-item--action.app-menu__button-row-item--labelled,\n.support-action-menu ::ng-deep .app-menu__button-row-item--action {\n  flex: 0 1 auto;\n  min-width: 108px;\n  min-height: 42px;\n  height: 42px;\n  justify-content: center;\n  padding-inline: 1rem;\n}\n.support-action-menu ::ng-deep .app-menu__button-row-item--action .app-menu__button-row-label {\n  text-align: center;\n}\n@media (max-width: 520px) {\n  .support-actions,\n  .support-action-menu {\n    width: 100%;\n  }\n}\n/*# sourceMappingURL=report-user-popup.component.css.map */\n'] }]
  }], () => [], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ProfileReportUserPopupComponent, { className: "ProfileReportUserPopupComponent", filePath: "app/profile/components/report-user-popup/report-user-popup.component.ts", lineNumber: 42 });
})();

// src/app/profile/components/settings-popups/settings-popups.component.ts
function ProfileSettingsPopupsComponent_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "app-document-viewer", 2);
    \u0275\u0275listener("action", function ProfileSettingsPopupsComponent_Conditional_0_Template_app_document_viewer_action_0_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onPrivacyDocumentAction($event));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("config", ctx_r1.privacyDocumentConfig());
  }
}
function ProfileSettingsPopupsComponent_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "app-document-viewer", 0);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("config", ctx_r1.termsDocumentConfig());
  }
}
function ProfileSettingsPopupsComponent_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "app-document-viewer", 0);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("config", ctx_r1.helpDocumentConfig());
  }
}
function ProfileSettingsPopupsComponent_Conditional_3_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "app-profile-feedback-popup");
  }
}
function ProfileSettingsPopupsComponent_Conditional_3_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "app-profile-report-user-popup");
  }
}
function ProfileSettingsPopupsComponent_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "app-popup", 1);
    \u0275\u0275conditionalCreate(1, ProfileSettingsPopupsComponent_Conditional_3_Conditional_1_Template, 1, 0, "app-profile-feedback-popup");
    \u0275\u0275conditionalCreate(2, ProfileSettingsPopupsComponent_Conditional_3_Conditional_2_Template, 1, 0, "app-profile-report-user-popup");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const popup_r3 = ctx;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("model", ctx_r1.settingsPopupModel(popup_r3))("zIndex", ctx_r1.settingsPopupZIndex(popup_r3));
    \u0275\u0275advance();
    \u0275\u0275conditional(popup_r3 === "feedback" ? 1 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(popup_r3 === "report-user" ? 2 : -1);
  }
}
var ProfileSettingsPopupsComponent = class _ProfileSettingsPopupsComponent {
  profileStore = inject(ProfileStore);
  helpCenter = inject(HelpCenterService);
  privacyPolicy = inject(PrivacyPolicyService);
  userProfileStore = inject(UserProfileStore);
  changeDetectorRef = inject(ChangeDetectorRef);
  activePopup = this.profileStore.settingsPopup;
  activeUserId = this.userProfileStore.activeUserId;
  privacyConsentRequired = this.profileStore.privacyConsentRequired;
  settingsPrivacySaving = false;
  settingsPrivacySaveMessage = "";
  settingsPrivacySaveError = "";
  settingsPrivacyConsentLoadPending = false;
  settingsPrivacyActiveRevisionConsentSaved = false;
  settingsPrivacyConsentLoadedForKey = "";
  settingsPrivacyConsentLoadToken = 0;
  settingsApprovedPrivacySectionIds = /* @__PURE__ */ new Set();
  constructor() {
    effect(() => {
      if (this.activePopup() !== "privacy") {
        return;
      }
      this.syncSettingsPrivacyConsentForRevision();
    });
  }
  onWindowEscape(event) {
    if (!this.activePopup()) {
      return;
    }
    event.stopPropagation();
    this.closePopup();
  }
  popupTitle(popup) {
    switch (popup) {
      case "feedback":
        return "Send Feedback";
      case "report-user":
        return "Report User";
      default:
        return "";
    }
  }
  settingsPopupModel(popup) {
    const title = this.popupTitle(popup);
    const subtitle = popup === "feedback" ? "Tell us what works well or what should be improved. Product feedback is triaged by category." : popup === "report-user" ? "Share what happened. Reports are reviewed by moderation, and we use them to improve trust and safety." : null;
    return {
      title,
      subtitle,
      ariaLabel: title,
      closeAriaLabel: "Close",
      size: "wide",
      height: "auto",
      headerTone: "accent",
      bodyLayout: popup === "feedback" || popup === "report-user" ? "overflow" : "default",
      onClose: () => this.closePopup()
    };
  }
  settingsPopupZIndex(popup) {
    return popup === "report-user" ? 3900 : 2400;
  }
  closePopup() {
    this.profileStore.closeSettingsPopup({
      keepPrivacyOpen: this.privacyConsentRequired()
    });
  }
  completePrivacyPopup() {
    this.profileStore.clearPrivacyConsentRequirement();
    this.profileStore.closeSettingsPopup();
  }
  privacyDocumentConfig() {
    const revision = this.helpCenter.activePrivacyRevision();
    return HelpCenterRevisionDocumentViewerConfigConverter.convert({
      revision,
      open: this.activePopup() === "privacy",
      shell: "popup",
      onClose: () => this.closePopup(),
      ariaLabel: "GDPR consent",
      closeAriaLabel: "Close privacy popup",
      closeOnBackdrop: !this.privacyConsentRequired(),
      titleFallback: "Privacy first",
      versionLabel: this.helpCenter.activePrivacyVersionLabel(),
      loading: !revision,
      loadingLabel: "Loading privacy content",
      emptyState: {
        icon: "policy",
        title: "Privacy is not available",
        description: "Privacy content is not available right now."
      },
      sectionMode: "privacy",
      selectedSectionIds: this.settingsApprovedPrivacySectionIds,
      actions: this.privacyDocumentActions(),
      statusMessage: this.settingsPrivacySaveError || this.settingsPrivacySaveMessage,
      statusTone: this.settingsPrivacySaveError ? "error" : "default"
    });
  }
  termsDocumentConfig() {
    const revision = this.helpCenter.activeTermsRevision();
    return HelpCenterRevisionDocumentViewerConfigConverter.convert({
      revision,
      open: this.activePopup() === "terms",
      shell: "popup",
      onClose: () => this.closePopup(),
      ariaLabel: "Terms of service",
      closeAriaLabel: "Close terms popup",
      titleFallback: "Usage terms",
      descriptionFallback: "document.terms.description",
      versionLabel: this.helpCenter.activeTermsVersionLabel(),
      loading: !revision,
      loadingLabel: "Loading terms content",
      emptyState: {
        icon: "rule",
        title: "Terms are not available",
        description: "Terms content is not available right now."
      }
    });
  }
  helpDocumentConfig() {
    const revision = this.helpCenter.activeRevision();
    const headerPalette = AppUtils.enumValue(revision?.headerColor, APP_STATIC_DATA.documentViewerHeaderPalettes, "teal");
    return HelpCenterRevisionDocumentViewerConfigConverter.convert({
      revision,
      open: this.activePopup() === "help",
      shell: "popup",
      onClose: () => this.closePopup(),
      ariaLabel: "Help",
      closeAriaLabel: "Close help popup",
      titleFallback: "Help",
      versionLabel: this.helpCenter.activeVersionLabel(),
      headerPalette: headerPalette === "amber" ? "teal" : headerPalette,
      loading: !revision,
      loadingLabel: "Loading help content",
      emptyState: {
        icon: "help_outline",
        title: "Help is not available",
        description: "Help content is not available right now."
      }
    });
  }
  onPrivacyDocumentAction(event) {
    if (event.id === "settings-privacy-save") {
      void this.saveSettingsPrivacyChoices(event.selectedSectionIds);
    }
  }
  privacyDocumentActions() {
    return [{
      id: "settings-privacy-save",
      label: this.settingsPrivacySaveButtonLabel(),
      icon: "check_circle",
      palette: "blue",
      disabled: !this.canRunSettingsPrivacySaveAction(),
      visible: this.settingsPrivacySaveActionVisibility(),
      progress: this.settingsPrivacySaving ? {
        state: "loading",
        shape: "button"
      } : null
    }];
  }
  settingsPrivacySaveActionVisibility() {
    const revision = this.helpCenter.activePrivacyRevision();
    if (!revision) {
      return false;
    }
    if (this.privacyConsentRequired()) {
      return true;
    }
    if (!this.settingsPrivacyConsentLoadPending && !this.settingsPrivacyActiveRevisionConsentSaved) {
      return true;
    }
    return this.hasOptionalPrivacySections(revision) ? "dirty" : false;
  }
  canRunSettingsPrivacySaveAction() {
    return !this.settingsPrivacySaving && !this.settingsPrivacyConsentLoadPending;
  }
  settingsPrivacySaveButtonLabel() {
    if (this.settingsPrivacySaving) {
      return "Saving...";
    }
    return this.privacyConsentRequired() || !this.settingsPrivacyActiveRevisionConsentSaved ? "Approve privacy" : "Save choices";
  }
  async saveSettingsPrivacyChoices(selectedSectionIds) {
    const revision = this.helpCenter.activePrivacyRevision();
    const userId = this.activeUserId().trim();
    if (!revision || !userId || !this.canRunSettingsPrivacySaveAction()) {
      return;
    }
    this.settingsPrivacySaving = true;
    this.settingsPrivacySaveMessage = "";
    this.settingsPrivacySaveError = "";
    try {
      const optionalSectionIds = this.optionalPrivacySectionIds(revision.sections);
      const approvedOptionalSectionIds = Array.from(new Set(selectedSectionIds)).filter((sectionId) => optionalSectionIds.has(sectionId)).sort();
      const consent = await this.privacyPolicy.saveConsent({
        userId,
        revisionId: revision.id,
        revisionVersion: revision.version,
        approvedOptionalSectionIds,
        source: "settings"
      });
      this.settingsPrivacyActiveRevisionConsentSaved = this.isPrivacyConsentCurrent(consent, revision);
      this.settingsApprovedPrivacySectionIds = new Set(consent.approvedOptionalSectionIds);
      this.settingsPrivacySaveMessage = "Privacy choices saved.";
      this.completePrivacyPopup();
    } catch {
      this.settingsPrivacySaveError = "Privacy choices could not be saved.";
    } finally {
      this.settingsPrivacySaving = false;
      this.changeDetectorRef.markForCheck();
    }
  }
  syncSettingsPrivacyConsentForRevision() {
    const revision = this.helpCenter.activePrivacyRevision();
    const userId = this.activeUserId().trim();
    const optionalSectionIds = this.optionalPrivacySectionIds(revision?.sections ?? []);
    const revisionKey = revision && userId ? `${userId}::${this.privacyPolicy.revisionKey(revision)}` : "";
    if (!revision || !revisionKey) {
      this.settingsPrivacyConsentLoadedForKey = "";
      this.settingsPrivacyConsentLoadPending = false;
      this.settingsPrivacyActiveRevisionConsentSaved = false;
      this.settingsApprovedPrivacySectionIds = this.filteredSectionIds(this.settingsApprovedPrivacySectionIds, optionalSectionIds);
      return;
    }
    if (this.settingsPrivacyConsentLoadedForKey === revisionKey) {
      return;
    }
    this.settingsPrivacyConsentLoadedForKey = revisionKey;
    const loadToken = ++this.settingsPrivacyConsentLoadToken;
    this.settingsPrivacyConsentLoadPending = true;
    this.settingsPrivacyActiveRevisionConsentSaved = false;
    this.settingsPrivacySaveError = "";
    void this.privacyPolicy.loadConsent(userId, revision.id, revision.version).then((consent) => {
      if (loadToken !== this.settingsPrivacyConsentLoadToken || this.settingsPrivacyConsentLoadedForKey !== revisionKey) {
        return;
      }
      this.settingsPrivacyConsentLoadPending = false;
      this.settingsPrivacyActiveRevisionConsentSaved = this.isPrivacyConsentCurrent(consent, revision);
      this.settingsApprovedPrivacySectionIds = new Set((consent?.approvedOptionalSectionIds ?? []).filter((sectionId) => optionalSectionIds.has(sectionId)));
      this.changeDetectorRef.markForCheck();
    }).catch(() => {
      if (loadToken !== this.settingsPrivacyConsentLoadToken || this.settingsPrivacyConsentLoadedForKey !== revisionKey) {
        return;
      }
      this.settingsPrivacyConsentLoadPending = false;
      this.settingsPrivacyActiveRevisionConsentSaved = false;
      this.settingsApprovedPrivacySectionIds = /* @__PURE__ */ new Set();
      this.settingsPrivacySaveError = "Privacy choices could not be loaded.";
      this.changeDetectorRef.markForCheck();
    });
  }
  hasOptionalPrivacySections(revision) {
    return revision.sections.some((section) => section.optional === true);
  }
  optionalPrivacySectionIds(sections) {
    return new Set(sections.filter((section) => section.optional === true).map((section) => section.id));
  }
  filteredSectionIds(source, allowedIds) {
    return new Set(Array.from(source).filter((sectionId) => allowedIds.has(sectionId)));
  }
  isPrivacyConsentCurrent(consent, revision) {
    if (!consent) {
      return false;
    }
    const consentRevisionId = `${consent.revisionId ?? ""}`.trim();
    const consentVersion = Math.trunc(Number(consent.revisionVersion) || 0);
    const currentVersion = Math.trunc(Number(revision.version) || 0);
    return consentRevisionId === revision.id && consentVersion >= currentVersion && currentVersion > 0;
  }
  static \u0275fac = function ProfileSettingsPopupsComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ProfileSettingsPopupsComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ProfileSettingsPopupsComponent, selectors: [["app-profile-settings-popups"]], hostBindings: function ProfileSettingsPopupsComponent_HostBindings(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275listener("keydown.escape", function ProfileSettingsPopupsComponent_keydown_escape_HostBindingHandler($event) {
        return ctx.onWindowEscape($event);
      }, \u0275\u0275resolveWindow);
    }
  }, decls: 4, vars: 1, consts: [[3, "config"], [3, "model", "zIndex"], [3, "action", "config"]], template: function ProfileSettingsPopupsComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275conditionalCreate(0, ProfileSettingsPopupsComponent_Conditional_0_Template, 1, 1, "app-document-viewer", 0)(1, ProfileSettingsPopupsComponent_Conditional_1_Template, 1, 1, "app-document-viewer", 0)(2, ProfileSettingsPopupsComponent_Conditional_2_Template, 1, 1, "app-document-viewer", 0)(3, ProfileSettingsPopupsComponent_Conditional_3_Template, 3, 4, "app-popup", 1);
    }
    if (rf & 2) {
      let tmp_0_0;
      \u0275\u0275conditional(ctx.activePopup() === "privacy" ? 0 : ctx.activePopup() === "terms" ? 1 : ctx.activePopup() === "help" ? 2 : (tmp_0_0 = ctx.activePopup()) ? 3 : -1, tmp_0_0);
    }
  }, dependencies: [
    DocumentViewerComponent,
    PopupComponent,
    ProfileFeedbackPopupComponent,
    ProfileReportUserPopupComponent
  ], styles: ["\n[_nghost-%COMP%] {\n  display: contents;\n}\n/*# sourceMappingURL=settings-popups.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ProfileSettingsPopupsComponent, [{
    type: Component,
    args: [{ selector: "app-profile-settings-popups", standalone: true, imports: [
      DocumentViewerComponent,
      PopupComponent,
      ProfileFeedbackPopupComponent,
      ProfileReportUserPopupComponent
    ], template: `@if (activePopup() === 'privacy') {
  <app-document-viewer
    [config]="privacyDocumentConfig()"
    (action)="onPrivacyDocumentAction($event)"
  ></app-document-viewer>
} @else if (activePopup() === 'terms') {
  <app-document-viewer
    [config]="termsDocumentConfig()"
  ></app-document-viewer>
} @else if (activePopup() === 'help') {
  <app-document-viewer
    [config]="helpDocumentConfig()"
  ></app-document-viewer>
} @else if (activePopup(); as popup) {
  <app-popup
    [model]="settingsPopupModel(popup)"
    [zIndex]="settingsPopupZIndex(popup)"
  >
    @if (popup === 'feedback') {
      <app-profile-feedback-popup></app-profile-feedback-popup>
    }
    @if (popup === 'report-user') {
      <app-profile-report-user-popup></app-profile-report-user-popup>
    }
  </app-popup>
}
`, styles: ["/* src/app/profile/components/settings-popups/settings-popups.component.scss */\n:host {\n  display: contents;\n}\n/*# sourceMappingURL=settings-popups.component.css.map */\n"] }]
  }], () => [], { onWindowEscape: [{
    type: HostListener,
    args: ["window:keydown.escape", ["$event"]]
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ProfileSettingsPopupsComponent, { className: "ProfileSettingsPopupsComponent", filePath: "app/profile/components/settings-popups/settings-popups.component.ts", lineNumber: 47 });
})();
export {
  ProfileSettingsPopupsComponent
};
//# sourceMappingURL=settings-popups.component-YBZMLK6H.js.map
