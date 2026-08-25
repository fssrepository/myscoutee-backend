import "./chunk-ODDEQXQS.js";
import "./chunk-JDMFSJZK.js";
import "./chunk-GNEKNDCW.js";
import "./chunk-WYVDSPFZ.js";
import "./chunk-64GWAN6R.js";
import "./chunk-ZIP4R74W.js";
import "./chunk-I6EOSNBR.js";
import "./chunk-3HTTRAEW.js";
import "./chunk-SYKOEE4K.js";
import "./chunk-KQF6FQ63.js";
import {
  ActivitiesPopupStore
} from "./chunk-YOGAOTLT.js";
import "./chunk-IJVUZ62I.js";
import "./chunk-VGRWBYOR.js";
import "./chunk-XIFXW5X2.js";
import "./chunk-2K5TOPNO.js";
import "./chunk-654Z7UJY.js";
import "./chunk-H3IGIWEC.js";
import "./chunk-RRRWUAB3.js";
import {
  EventFeedbackDetailConverter
} from "./chunk-EWJPTHFE.js";
import "./chunk-RJSPRCFL.js";
import "./chunk-BEAS7CFC.js";
import "./chunk-EGWJQCT5.js";
import "./chunk-YTMD6HU4.js";
import "./chunk-4VYYFWRA.js";
import "./chunk-QEZI4ZBE.js";
import "./chunk-MEY2M2U3.js";
import "./chunk-ZBJCMF52.js";
import {
  PopupComponent
} from "./chunk-3VXLUVWM.js";
import "./chunk-VEYRCVMX.js";
import "./chunk-MVR37RGJ.js";
import {
  IndicatorComponent
} from "./chunk-FOAFZS65.js";
import "./chunk-OAYWPJGG.js";
import "./chunk-6TR3Z2F3.js";
import "./chunk-U46O4F4Y.js";
import {
  MatIcon,
  MatIconModule
} from "./chunk-EDHGCWPF.js";
import "./chunk-CUDLB52K.js";
import "./chunk-4WZBG7IG.js";
import "./chunk-ZJ74HL3J.js";
import "./chunk-QE3AUXWT.js";
import {
  EventsService
} from "./chunk-2LVO4Z3J.js";
import "./chunk-PK4DOAMC.js";
import "./chunk-4M7S3PHB.js";
import "./chunk-5PHTFUHA.js";
import "./chunk-F4WY6ECV.js";
import "./chunk-Q3344WPR.js";
import "./chunk-XQ4NDAVX.js";
import "./chunk-4FWVIYNI.js";
import "./chunk-7MTG4XZU.js";
import {
  CommonModule,
  NgClass
} from "./chunk-J7IJFFQ2.js";
import "./chunk-XQACYBVS.js";
import "./chunk-YKC4KBEC.js";
import "./chunk-B2DKYQGD.js";
import "./chunk-KLUOB5SD.js";
import "./chunk-6POEHVT7.js";
import "./chunk-2ENBQWLU.js";
import "./chunk-LERGHE7K.js";
import "./chunk-D6ZHKNYF.js";
import "./chunk-SKAK727J.js";
import {
  Component,
  computed,
  effect,
  inject,
  setClassMetadata,
  signal,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIdentity,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1
} from "./chunk-XJL7SWH7.js";

// src/app/activity/components/event-feedback-rated-detail-popup/event-feedback-rated-detail-popup.component.ts
var _forTrack0 = ($index, $item) => $item.id;
function EventFeedbackRatedDetailPopupComponent_Conditional_0_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 2);
    \u0275\u0275element(1, "app-indicator", 4);
    \u0275\u0275elementStart(2, "span");
    \u0275\u0275text(3, "Loading your saved feedback");
    \u0275\u0275elementEnd()();
  }
}
function EventFeedbackRatedDetailPopupComponent_Conditional_0_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 3)(1, "mat-icon");
    \u0275\u0275text(2, "error_outline");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r0.loadError());
  }
}
function EventFeedbackRatedDetailPopupComponent_Conditional_0_Conditional_4_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 5)(1, "mat-icon");
    \u0275\u0275text(2, "verified");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1("Submitted ", ctx_r0.submittedAtLabel());
  }
}
function EventFeedbackRatedDetailPopupComponent_Conditional_0_Conditional_4_For_3_For_26_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 15)(1, "mat-icon");
    \u0275\u0275text(2, "psychology");
    \u0275\u0275elementEnd();
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const trait_r2 = ctx.$implicit;
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", trait_r2, " ");
  }
}
function EventFeedbackRatedDetailPopupComponent_Conditional_0_Conditional_4_For_3_ForEmpty_27_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 16);
    \u0275\u0275text(1, "No traits selected");
    \u0275\u0275elementEnd();
  }
}
function EventFeedbackRatedDetailPopupComponent_Conditional_0_Conditional_4_For_3_Conditional_28_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 17)(1, "span");
    \u0275\u0275text(2, "Your opinion about the event");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "p");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const card_r3 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(card_r3.eventComment);
  }
}
function EventFeedbackRatedDetailPopupComponent_Conditional_0_Conditional_4_For_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "article", 7)(1, "header", 9)(2, "div", 10)(3, "mat-icon");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(5, "div")(6, "h3");
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "p");
    \u0275\u0275text(9);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(10, "div", 11)(11, "div", 12)(12, "span");
    \u0275\u0275text(13);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "strong");
    \u0275\u0275text(15);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(16, "div", 12)(17, "span");
    \u0275\u0275text(18);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "strong");
    \u0275\u0275text(20);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(21, "div", 13)(22, "span");
    \u0275\u0275text(23);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(24, "div", 14);
    \u0275\u0275repeaterCreate(25, EventFeedbackRatedDetailPopupComponent_Conditional_0_Conditional_4_For_3_For_26_Template, 4, 1, "span", 15, \u0275\u0275repeaterTrackByIdentity, false, EventFeedbackRatedDetailPopupComponent_Conditional_0_Conditional_4_For_3_ForEmpty_27_Template, 2, 0, "span", 16);
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(28, EventFeedbackRatedDetailPopupComponent_Conditional_0_Conditional_4_For_3_Conditional_28_Template, 5, 1, "div", 17);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const card_r3 = ctx.$implicit;
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275property("ngClass", card_r3.toneClass);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(card_r3.icon);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(card_r3.heading);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(card_r3.subheading);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(card_r3.questionPrimary);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.primaryAnswerLabel(card_r3));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(card_r3.questionSecondary);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.secondaryAnswerLabel(card_r3));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(card_r3.traitQuestion);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r0.traitLabels(card_r3));
    \u0275\u0275advance(3);
    \u0275\u0275conditional(card_r3.kind === "event" && card_r3.eventComment ? 28 : -1);
  }
}
function EventFeedbackRatedDetailPopupComponent_Conditional_0_Conditional_4_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "aside", 8)(1, "span");
    \u0275\u0275text(2, "Note to organizer");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "p");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    let tmp_4_0;
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate((tmp_4_0 = ctx_r0.detail()) == null ? null : tmp_4_0.organizerNote);
  }
}
function EventFeedbackRatedDetailPopupComponent_Conditional_0_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, EventFeedbackRatedDetailPopupComponent_Conditional_0_Conditional_4_Conditional_0_Template, 5, 1, "div", 5);
    \u0275\u0275elementStart(1, "div", 6);
    \u0275\u0275repeaterCreate(2, EventFeedbackRatedDetailPopupComponent_Conditional_0_Conditional_4_For_3_Template, 29, 11, "article", 7, _forTrack0);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(4, EventFeedbackRatedDetailPopupComponent_Conditional_0_Conditional_4_Conditional_4_Template, 5, 1, "aside", 8);
  }
  if (rf & 2) {
    let tmp_5_0;
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275conditional(ctx_r0.submittedAtLabel() ? 0 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r0.cards());
    \u0275\u0275advance(2);
    \u0275\u0275conditional(((tmp_5_0 = ctx_r0.detail()) == null ? null : tmp_5_0.organizerNote) ? 4 : -1);
  }
}
function EventFeedbackRatedDetailPopupComponent_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "app-popup", 0)(1, "section", 1);
    \u0275\u0275conditionalCreate(2, EventFeedbackRatedDetailPopupComponent_Conditional_0_Conditional_2_Template, 4, 0, "div", 2)(3, EventFeedbackRatedDetailPopupComponent_Conditional_0_Conditional_3_Template, 5, 1, "div", 3)(4, EventFeedbackRatedDetailPopupComponent_Conditional_0_Conditional_4_Template, 5, 2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275property("model", ctx_r0.popupModel(ctx))("zIndex", ctx_r0.popupZIndex());
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r0.loading() ? 2 : ctx_r0.loadError() ? 3 : 4);
  }
}
var EventFeedbackRatedDetailPopupComponent = class _EventFeedbackRatedDetailPopupComponent {
  eventsService = inject(EventsService);
  activitiesPopupStore = inject(ActivitiesPopupStore);
  loadRevision = 0;
  session = this.activitiesPopupStore.eventFeedbackRatedDetailSession;
  detail = signal(null, ...ngDevMode ? [{ debugName: "detail" }] : (
    /* istanbul ignore next */
    []
  ));
  loading = signal(false, ...ngDevMode ? [{ debugName: "loading" }] : (
    /* istanbul ignore next */
    []
  ));
  loadError = signal("", ...ngDevMode ? [{ debugName: "loadError" }] : (
    /* istanbul ignore next */
    []
  ));
  cards = computed(() => {
    const detail = this.detail();
    return detail ? EventFeedbackDetailConverter.convert(detail) : [];
  }, ...ngDevMode ? [{ debugName: "cards" }] : (
    /* istanbul ignore next */
    []
  ));
  constructor() {
    effect(() => {
      const session = this.session();
      const revision = ++this.loadRevision;
      this.detail.set(null);
      this.loadError.set("");
      if (!session) {
        this.loading.set(false);
        return;
      }
      void this.loadPersistedDetail(session, revision);
    });
  }
  popupModel(session) {
    return {
      title: "My Event Feedback",
      subtitle: session.eventTitle,
      ariaLabel: `My feedback for ${session.eventTitle}`,
      closeAriaLabel: "Close",
      size: "wide",
      height: "full",
      headerTone: "accent",
      bodyLayout: "fill",
      backdropTone: "dim",
      onClose: (event) => this.close(event)
    };
  }
  popupZIndex() {
    return 12700;
  }
  submittedAtLabel() {
    const submittedAtIso = this.detail()?.submittedAtIso ?? "";
    if (!submittedAtIso) {
      return "";
    }
    const submittedAt = new Date(submittedAtIso);
    if (Number.isNaN(submittedAt.getTime())) {
      return submittedAtIso;
    }
    return new Intl.DateTimeFormat(void 0, {
      dateStyle: "medium",
      timeStyle: "short"
    }).format(submittedAt);
  }
  primaryAnswerLabel(card) {
    return this.optionLabel(card.answerPrimary, card.primaryOptions);
  }
  secondaryAnswerLabel(card) {
    return this.optionLabel(card.answerSecondary, card.secondaryOptions);
  }
  traitLabels(card) {
    const labelsById = new Map(card.traitOptions.map((option) => [option.id, option.label]));
    return card.selectedTraitIds.map((traitId) => labelsById.get(traitId) ?? traitId).filter(Boolean);
  }
  close(event) {
    event?.stopPropagation();
    this.loadRevision += 1;
    this.activitiesPopupStore.closeEventFeedbackRatedDetail();
  }
  async loadPersistedDetail(session, revision) {
    this.loading.set(true);
    try {
      const detail = await this.eventsService.loadEventFeedback({
        userId: session.userId,
        eventId: session.eventId
      });
      if (revision !== this.loadRevision || this.session()?.openedAtIso !== session.openedAtIso) {
        return;
      }
      if (detail.eventId !== session.eventId || !detail.submittedAtIso || detail.cards.length === 0) {
        this.loadError.set("The saved feedback could not be loaded.");
        return;
      }
      this.detail.set(detail);
    } catch {
      if (revision === this.loadRevision) {
        this.loadError.set("The saved feedback could not be loaded.");
      }
    } finally {
      if (revision === this.loadRevision) {
        this.loading.set(false);
      }
    }
  }
  optionLabel(value, options) {
    const normalizedValue = value.trim();
    if (!normalizedValue) {
      return "No answer saved";
    }
    return options.find((option) => option.value === normalizedValue)?.label ?? normalizedValue;
  }
  static \u0275fac = function EventFeedbackRatedDetailPopupComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _EventFeedbackRatedDetailPopupComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _EventFeedbackRatedDetailPopupComponent, selectors: [["app-event-feedback-rated-detail-popup"]], decls: 1, vars: 1, consts: [[3, "model", "zIndex"], [1, "rated-feedback-popup"], [1, "rated-feedback-state"], [1, "rated-feedback-state", "rated-feedback-state--error"], ["kind", "load-ring", "state", "loading"], [1, "rated-feedback-submitted"], [1, "rated-feedback-card-list"], [1, "rated-feedback-card", 3, "ngClass"], [1, "rated-feedback-text", "rated-feedback-text--organizer-note"], [1, "rated-feedback-card__header"], [1, "rated-feedback-card__icon"], [1, "rated-feedback-answer-grid"], [1, "rated-feedback-answer"], [1, "rated-feedback-traits"], [1, "rated-feedback-trait-list"], [1, "rated-feedback-trait"], [1, "rated-feedback-trait", "rated-feedback-trait--empty"], [1, "rated-feedback-text", "rated-feedback-text--opinion"]], template: function EventFeedbackRatedDetailPopupComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275conditionalCreate(0, EventFeedbackRatedDetailPopupComponent_Conditional_0_Template, 5, 3, "app-popup", 0);
    }
    if (rf & 2) {
      let tmp_0_0;
      \u0275\u0275conditional((tmp_0_0 = ctx.session()) ? 0 : -1, tmp_0_0);
    }
  }, dependencies: [
    CommonModule,
    NgClass,
    MatIconModule,
    MatIcon,
    IndicatorComponent,
    PopupComponent
  ], styles: ["\n[_nghost-%COMP%] {\n  display: contents;\n}\n.rated-feedback-popup[_ngcontent-%COMP%] {\n  min-height: 100%;\n  padding: 0.75rem;\n  background:\n    radial-gradient(\n      circle at top right,\n      rgba(139, 92, 246, 0.1),\n      transparent 34rem),\n    #f7faff;\n}\n.rated-feedback-state[_ngcontent-%COMP%] {\n  min-height: 12rem;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 0.75rem;\n  color: #315277;\n  font-weight: 700;\n}\n.rated-feedback-state--error[_ngcontent-%COMP%] {\n  color: #b4232e;\n}\n.rated-feedback-submitted[_ngcontent-%COMP%] {\n  width: fit-content;\n  display: flex;\n  align-items: center;\n  gap: 0.4rem;\n  margin: 0 0 0.75rem auto;\n  padding: 0.45rem 0.75rem;\n  border: 1px solid #9ed9b4;\n  border-radius: 999px;\n  background: #edf9f1;\n  color: #247146;\n  font-size: 0.78rem;\n  font-weight: 800;\n}\n.rated-feedback-submitted[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  width: 1rem;\n  height: 1rem;\n  font-size: 1rem;\n}\n.rated-feedback-card-list[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.85rem;\n}\n.rated-feedback-card[_ngcontent-%COMP%] {\n  padding: 0.9rem;\n  border: 1px solid #bed1ea;\n  border-radius: 0.85rem;\n  background: rgba(255, 255, 255, 0.92);\n  box-shadow: 0 0.55rem 1.6rem rgba(29, 59, 104, 0.08);\n}\n.rated-feedback-card__header[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0.65rem;\n  padding-bottom: 0.7rem;\n  border-bottom: 1px solid #dce7f4;\n}\n.rated-feedback-card__header[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%], \n.rated-feedback-card__header[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0;\n}\n.rated-feedback-card__header[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n  color: #193b69;\n  font-size: 0.95rem;\n}\n.rated-feedback-card__header[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin-top: 0.15rem;\n  color: #607896;\n  font-size: 0.76rem;\n}\n.rated-feedback-card__icon[_ngcontent-%COMP%] {\n  width: 2rem;\n  height: 2rem;\n  display: grid;\n  place-items: center;\n  flex: 0 0 auto;\n  border-radius: 50%;\n  background: #e3f1ff;\n  color: #2171a8;\n}\n.rated-feedback-card__icon[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  width: 1.1rem;\n  height: 1.1rem;\n  font-size: 1.1rem;\n}\n.rated-feedback-answer-grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n  gap: 0.65rem;\n  margin-top: 0.75rem;\n}\n.rated-feedback-answer[_ngcontent-%COMP%], \n.rated-feedback-traits[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.4rem;\n  padding: 0.7rem;\n  border: 1px solid #d4e1f1;\n  border-radius: 0.65rem;\n  background: #f2f7fd;\n}\n.rated-feedback-answer[_ngcontent-%COMP%]    > span[_ngcontent-%COMP%], \n.rated-feedback-traits[_ngcontent-%COMP%]    > span[_ngcontent-%COMP%] {\n  color: #536c8c;\n  font-size: 0.72rem;\n  font-weight: 700;\n}\n.rated-feedback-answer[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  color: #173e6d;\n  font-size: 0.86rem;\n}\n.rated-feedback-traits[_ngcontent-%COMP%] {\n  margin-top: 0.65rem;\n}\n.rated-feedback-text[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.35rem;\n  margin-top: 0.65rem;\n  padding: 0.7rem;\n  border: 1px solid #c9daed;\n  border-radius: 0.65rem;\n  background: #f4f8fd;\n}\n.rated-feedback-text[_ngcontent-%COMP%]    > span[_ngcontent-%COMP%] {\n  color: #536c8c;\n  font-size: 0.72rem;\n  font-weight: 700;\n}\n.rated-feedback-text[_ngcontent-%COMP%]    > p[_ngcontent-%COMP%] {\n  margin: 0;\n  color: #173e6d;\n  font-size: 0.84rem;\n  line-height: 1.45;\n}\n.rated-feedback-text--opinion[_ngcontent-%COMP%] {\n  border-color: #b9d5ef;\n  background: #eef7ff;\n}\n.rated-feedback-text--organizer-note[_ngcontent-%COMP%] {\n  border-color: #e7ca99;\n  background: #fff8eb;\n}\n.rated-feedback-trait-list[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 0.4rem;\n}\n.rated-feedback-trait[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.25rem;\n  padding: 0.32rem 0.5rem;\n  border: 1px solid #cbb9f3;\n  border-radius: 999px;\n  background: #f4efff;\n  color: #6346a6;\n  font-size: 0.74rem;\n  font-weight: 750;\n}\n.rated-feedback-trait[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  width: 0.9rem;\n  height: 0.9rem;\n  font-size: 0.9rem;\n}\n.rated-feedback-trait--empty[_ngcontent-%COMP%] {\n  border-color: #d5deea;\n  background: #f5f7fa;\n  color: #718096;\n}\n@media (max-width: 700px) {\n  .rated-feedback-answer-grid[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n}\n/*# sourceMappingURL=event-feedback-rated-detail-popup.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(EventFeedbackRatedDetailPopupComponent, [{
    type: Component,
    args: [{ selector: "app-event-feedback-rated-detail-popup", standalone: true, imports: [
      CommonModule,
      MatIconModule,
      IndicatorComponent,
      PopupComponent
    ], template: `@if (session(); as activeSession) {
  <app-popup [model]="popupModel(activeSession)" [zIndex]="popupZIndex()">
    <section class="rated-feedback-popup">
      @if (loading()) {
        <div class="rated-feedback-state">
          <app-indicator kind="load-ring" state="loading"></app-indicator>
          <span>Loading your saved feedback</span>
        </div>
      } @else if (loadError()) {
        <div class="rated-feedback-state rated-feedback-state--error">
          <mat-icon>error_outline</mat-icon>
          <span>{{ loadError() }}</span>
        </div>
      } @else {
        @if (submittedAtLabel()) {
          <div class="rated-feedback-submitted">
            <mat-icon>verified</mat-icon>
            <span>Submitted {{ submittedAtLabel() }}</span>
          </div>
        }

        <div class="rated-feedback-card-list">
          @for (card of cards(); track card.id) {
            <article class="rated-feedback-card" [ngClass]="card.toneClass">
              <header class="rated-feedback-card__header">
                <div class="rated-feedback-card__icon">
                  <mat-icon>{{ card.icon }}</mat-icon>
                </div>
                <div>
                  <h3>{{ card.heading }}</h3>
                  <p>{{ card.subheading }}</p>
                </div>
              </header>

              <div class="rated-feedback-answer-grid">
                <div class="rated-feedback-answer">
                  <span>{{ card.questionPrimary }}</span>
                  <strong>{{ primaryAnswerLabel(card) }}</strong>
                </div>
                <div class="rated-feedback-answer">
                  <span>{{ card.questionSecondary }}</span>
                  <strong>{{ secondaryAnswerLabel(card) }}</strong>
                </div>
              </div>

              <div class="rated-feedback-traits">
                <span>{{ card.traitQuestion }}</span>
                <div class="rated-feedback-trait-list">
                  @for (trait of traitLabels(card); track trait) {
                    <span class="rated-feedback-trait">
                      <mat-icon>psychology</mat-icon>
                      {{ trait }}
                    </span>
                  } @empty {
                    <span class="rated-feedback-trait rated-feedback-trait--empty">No traits selected</span>
                  }
                </div>
              </div>

              @if (card.kind === 'event' && card.eventComment) {
                <div class="rated-feedback-text rated-feedback-text--opinion">
                  <span>Your opinion about the event</span>
                  <p>{{ card.eventComment }}</p>
                </div>
              }
            </article>
          }
        </div>

        @if (detail()?.organizerNote) {
          <aside class="rated-feedback-text rated-feedback-text--organizer-note">
            <span>Note to organizer</span>
            <p>{{ detail()?.organizerNote }}</p>
          </aside>
        }
      }
    </section>
  </app-popup>
}
`, styles: ["/* src/app/activity/components/event-feedback-rated-detail-popup/event-feedback-rated-detail-popup.component.scss */\n:host {\n  display: contents;\n}\n.rated-feedback-popup {\n  min-height: 100%;\n  padding: 0.75rem;\n  background:\n    radial-gradient(\n      circle at top right,\n      rgba(139, 92, 246, 0.1),\n      transparent 34rem),\n    #f7faff;\n}\n.rated-feedback-state {\n  min-height: 12rem;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 0.75rem;\n  color: #315277;\n  font-weight: 700;\n}\n.rated-feedback-state--error {\n  color: #b4232e;\n}\n.rated-feedback-submitted {\n  width: fit-content;\n  display: flex;\n  align-items: center;\n  gap: 0.4rem;\n  margin: 0 0 0.75rem auto;\n  padding: 0.45rem 0.75rem;\n  border: 1px solid #9ed9b4;\n  border-radius: 999px;\n  background: #edf9f1;\n  color: #247146;\n  font-size: 0.78rem;\n  font-weight: 800;\n}\n.rated-feedback-submitted mat-icon {\n  width: 1rem;\n  height: 1rem;\n  font-size: 1rem;\n}\n.rated-feedback-card-list {\n  display: grid;\n  gap: 0.85rem;\n}\n.rated-feedback-card {\n  padding: 0.9rem;\n  border: 1px solid #bed1ea;\n  border-radius: 0.85rem;\n  background: rgba(255, 255, 255, 0.92);\n  box-shadow: 0 0.55rem 1.6rem rgba(29, 59, 104, 0.08);\n}\n.rated-feedback-card__header {\n  display: flex;\n  align-items: center;\n  gap: 0.65rem;\n  padding-bottom: 0.7rem;\n  border-bottom: 1px solid #dce7f4;\n}\n.rated-feedback-card__header h3,\n.rated-feedback-card__header p {\n  margin: 0;\n}\n.rated-feedback-card__header h3 {\n  color: #193b69;\n  font-size: 0.95rem;\n}\n.rated-feedback-card__header p {\n  margin-top: 0.15rem;\n  color: #607896;\n  font-size: 0.76rem;\n}\n.rated-feedback-card__icon {\n  width: 2rem;\n  height: 2rem;\n  display: grid;\n  place-items: center;\n  flex: 0 0 auto;\n  border-radius: 50%;\n  background: #e3f1ff;\n  color: #2171a8;\n}\n.rated-feedback-card__icon mat-icon {\n  width: 1.1rem;\n  height: 1.1rem;\n  font-size: 1.1rem;\n}\n.rated-feedback-answer-grid {\n  display: grid;\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n  gap: 0.65rem;\n  margin-top: 0.75rem;\n}\n.rated-feedback-answer,\n.rated-feedback-traits {\n  display: grid;\n  gap: 0.4rem;\n  padding: 0.7rem;\n  border: 1px solid #d4e1f1;\n  border-radius: 0.65rem;\n  background: #f2f7fd;\n}\n.rated-feedback-answer > span,\n.rated-feedback-traits > span {\n  color: #536c8c;\n  font-size: 0.72rem;\n  font-weight: 700;\n}\n.rated-feedback-answer strong {\n  color: #173e6d;\n  font-size: 0.86rem;\n}\n.rated-feedback-traits {\n  margin-top: 0.65rem;\n}\n.rated-feedback-text {\n  display: grid;\n  gap: 0.35rem;\n  margin-top: 0.65rem;\n  padding: 0.7rem;\n  border: 1px solid #c9daed;\n  border-radius: 0.65rem;\n  background: #f4f8fd;\n}\n.rated-feedback-text > span {\n  color: #536c8c;\n  font-size: 0.72rem;\n  font-weight: 700;\n}\n.rated-feedback-text > p {\n  margin: 0;\n  color: #173e6d;\n  font-size: 0.84rem;\n  line-height: 1.45;\n}\n.rated-feedback-text--opinion {\n  border-color: #b9d5ef;\n  background: #eef7ff;\n}\n.rated-feedback-text--organizer-note {\n  border-color: #e7ca99;\n  background: #fff8eb;\n}\n.rated-feedback-trait-list {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 0.4rem;\n}\n.rated-feedback-trait {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.25rem;\n  padding: 0.32rem 0.5rem;\n  border: 1px solid #cbb9f3;\n  border-radius: 999px;\n  background: #f4efff;\n  color: #6346a6;\n  font-size: 0.74rem;\n  font-weight: 750;\n}\n.rated-feedback-trait mat-icon {\n  width: 0.9rem;\n  height: 0.9rem;\n  font-size: 0.9rem;\n}\n.rated-feedback-trait--empty {\n  border-color: #d5deea;\n  background: #f5f7fa;\n  color: #718096;\n}\n@media (max-width: 700px) {\n  .rated-feedback-answer-grid {\n    grid-template-columns: 1fr;\n  }\n}\n/*# sourceMappingURL=event-feedback-rated-detail-popup.component.css.map */\n"] }]
  }], () => [], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(EventFeedbackRatedDetailPopupComponent, { className: "EventFeedbackRatedDetailPopupComponent", filePath: "app/activity/components/event-feedback-rated-detail-popup/event-feedback-rated-detail-popup.component.ts", lineNumber: 31 });
})();
export {
  EventFeedbackRatedDetailPopupComponent
};
//# sourceMappingURL=event-feedback-rated-detail-popup.component-JJ765M6R.js.map
