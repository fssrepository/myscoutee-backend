import {
  EventSubeventsPopupStore
} from "./chunk-JDMFSJZK.js";
import "./chunk-GNEKNDCW.js";
import "./chunk-WYVDSPFZ.js";
import "./chunk-64GWAN6R.js";
import "./chunk-ZIP4R74W.js";
import "./chunk-I6EOSNBR.js";
import "./chunk-3HTTRAEW.js";
import "./chunk-SYKOEE4K.js";
import {
  MemberMenuStore
} from "./chunk-KQF6FQ63.js";
import {
  ActivitiesPopupStore
} from "./chunk-YOGAOTLT.js";
import "./chunk-IJVUZ62I.js";
import {
  SubEventResourcePopupStore
} from "./chunk-VGRWBYOR.js";
import {
  AccordionComponent
} from "./chunk-XIFXW5X2.js";
import "./chunk-2K5TOPNO.js";
import {
  FormFlowComponent
} from "./chunk-654Z7UJY.js";
import "./chunk-H3IGIWEC.js";
import "./chunk-RRRWUAB3.js";
import {
  ActivityChatSingleRowConverter,
  EventTournamentGroupsPopupConverter
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
  FormsModule,
  IndicatorComponent,
  NgControlStatus,
  NgModel
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
import "./chunk-4WZBG7IG.js";
import "./chunk-ZJ74HL3J.js";
import {
  ActivityResourcesService
} from "./chunk-QE3AUXWT.js";
import {
  EventsService
} from "./chunk-2LVO4Z3J.js";
import "./chunk-PK4DOAMC.js";
import "./chunk-4M7S3PHB.js";
import "./chunk-5PHTFUHA.js";
import {
  ActivityResourceBuilder
} from "./chunk-F4WY6ECV.js";
import "./chunk-Q3344WPR.js";
import {
  ASSET_TYPES,
  ASSET_TYPE_ACCOMMODATION,
  ASSET_TYPE_SUPPLIES,
  ASSET_TYPE_TRANSPORT
} from "./chunk-XQ4NDAVX.js";
import "./chunk-4FWVIYNI.js";
import "./chunk-7MTG4XZU.js";
import {
  CommonModule,
  DatePipe
} from "./chunk-J7IJFFQ2.js";
import "./chunk-XQACYBVS.js";
import "./chunk-YKC4KBEC.js";
import "./chunk-B2DKYQGD.js";
import {
  ActivityStore,
  UserProfileStore
} from "./chunk-KLUOB5SD.js";
import "./chunk-6POEHVT7.js";
import "./chunk-2ENBQWLU.js";
import "./chunk-LERGHE7K.js";
import "./chunk-D6ZHKNYF.js";
import "./chunk-SKAK727J.js";
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostListener,
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
  ɵɵdeclareLet,
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
  ɵɵreadContextLet,
  ɵɵreference,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵresetView,
  ɵɵresolveWindow,
  ɵɵrestoreView,
  ɵɵstoreLet,
  ɵɵtemplate,
  ɵɵtemplateRefExtractor,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate2,
  ɵɵtextInterpolate3
} from "./chunk-XJL7SWH7.js";

// src/app/activity/components/event-subevent-group-form-popup/event-subevent-group-form-popup.component.ts
function EventSubeventGroupFormPopupComponent_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "app-popup", 0)(1, "app-form-flow", 1);
    \u0275\u0275listener("ngModelChange", function EventSubeventGroupFormPopupComponent_Conditional_0_Template_app_form_flow_ngModelChange_1_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onFlowValueChange($event));
    });
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("model", ctx_r1.groupPopupModel())("zIndex", 3910);
    \u0275\u0275advance();
    \u0275\u0275property("model", ctx_r1.flowModel())("ngModel", ctx_r1.model);
  }
}
var EventSubeventGroupFormPopupComponent = class _EventSubeventGroupFormPopupComponent {
  open = false;
  title = "Create Group";
  stageTitle = "";
  canSave = false;
  invalidName = false;
  saving = false;
  model = {
    name: "",
    capacityMin: 4,
    capacityMax: 7
  };
  save = new EventEmitter();
  cancel = new EventEmitter();
  modelChange = new EventEmitter();
  groupPopupModel() {
    return {
      title: this.title,
      subtitle: this.stageTitle || null,
      ariaLabel: this.title,
      closeAriaLabel: "Close group form",
      closeOnBackdrop: true,
      size: "default",
      height: "auto",
      headerTone: "accent",
      bodyLayout: "overflow",
      backdropTone: "dim",
      headerControls: [{
        kind: "menu",
        id: "group-save",
        menuKind: "inline",
        items: this.saveMenuItems(),
        closeOnSelect: false
      }],
      onClose: (event) => this.cancel.emit(event),
      onMenuSelect: (event) => this.onSaveMenuSelect(event)
    };
  }
  saveMenuItems() {
    return [{
      id: "save-group",
      icon: "done",
      kind: "action",
      palette: this.saving || this.canSave ? "success" : "danger",
      disabled: !this.canSave || this.saving,
      ariaLabel: "Save group",
      progress: this.saving ? {
        state: "loading",
        shape: "circle"
      } : null
    }];
  }
  onSaveMenuSelect(event) {
    if (event.itemSelect.id === "save-group") {
      this.save.emit(event.itemSelect.sourceEvent);
    }
  }
  flowModel() {
    return {
      title: this.title,
      subtitle: this.stageTitle,
      layout: "grouped",
      header: false,
      summary: { enabled: false },
      completion: { controls: "required" },
      save: null,
      steps: [
        {
          id: "group",
          title: "Group",
          controls: [
            {
              id: "name",
              bind: "name",
              kind: "text",
              layout: "wide",
              label: "name",
              placeholder: "Group name",
              required: true
            },
            {
              id: "capacityMin",
              bind: "capacityMin",
              kind: "number",
              layout: "half",
              label: "event.subevents.group.capacity.min",
              min: 0,
              step: 1,
              required: true
            },
            {
              id: "capacityMax",
              bind: "capacityMax",
              kind: "number",
              layout: "half",
              label: "event.subevents.group.capacity.max",
              min: Math.max(0, Math.trunc(Number(this.model.capacityMin) || 0)),
              step: 1,
              required: true
            }
          ]
        }
      ]
    };
  }
  onFlowValueChange(value) {
    const record = this.isRecord(value) ? value : {};
    const capacityMin = Math.max(0, Math.trunc(Number(record["capacityMin"]) || 0));
    const capacityMax = Math.max(capacityMin, Math.trunc(Number(record["capacityMax"]) || capacityMin));
    const nextModel = {
      name: `${record["name"] ?? ""}`,
      capacityMin,
      capacityMax
    };
    this.model = nextModel;
    this.modelChange.emit(nextModel);
  }
  isRecord(value) {
    return typeof value === "object" && value !== null && !Array.isArray(value);
  }
  static \u0275fac = function EventSubeventGroupFormPopupComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _EventSubeventGroupFormPopupComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _EventSubeventGroupFormPopupComponent, selectors: [["app-event-subevent-group-form-popup"]], inputs: { open: "open", title: "title", stageTitle: "stageTitle", canSave: "canSave", invalidName: "invalidName", saving: "saving", model: "model" }, outputs: { save: "save", cancel: "cancel", modelChange: "modelChange" }, decls: 1, vars: 1, consts: [[3, "model", "zIndex"], [1, "subevent-group-flow", 3, "ngModelChange", "model", "ngModel"]], template: function EventSubeventGroupFormPopupComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275conditionalCreate(0, EventSubeventGroupFormPopupComponent_Conditional_0_Template, 2, 4, "app-popup", 0);
    }
    if (rf & 2) {
      \u0275\u0275conditional(ctx.open ? 0 : -1);
    }
  }, dependencies: [FormsModule, NgControlStatus, NgModel, PopupComponent, FormFlowComponent], styles: ["\n[_nghost-%COMP%] {\n  display: contents;\n}\n.subevent-group-flow[_ngcontent-%COMP%] {\n  display: block;\n  min-height: 11.5rem;\n  overflow: hidden;\n}\n@media (max-width: 760px) {\n  .subevent-group-flow[_ngcontent-%COMP%] {\n    min-height: 11.5rem;\n  }\n}\n/*# sourceMappingURL=event-subevent-group-form-popup.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(EventSubeventGroupFormPopupComponent, [{
    type: Component,
    args: [{ selector: "app-event-subevent-group-form-popup", standalone: true, imports: [FormsModule, PopupComponent, FormFlowComponent], template: '@if (open) {\n  <app-popup [model]="groupPopupModel()" [zIndex]="3910">\n      <app-form-flow\n        class="subevent-group-flow"\n        [model]="flowModel()"\n        [ngModel]="model"\n        (ngModelChange)="onFlowValueChange($event)"\n      ></app-form-flow>\n  </app-popup>\n}\n', styles: ["/* src/app/activity/components/event-subevent-group-form-popup/event-subevent-group-form-popup.component.scss */\n:host {\n  display: contents;\n}\n.subevent-group-flow {\n  display: block;\n  min-height: 11.5rem;\n  overflow: hidden;\n}\n@media (max-width: 760px) {\n  .subevent-group-flow {\n    min-height: 11.5rem;\n  }\n}\n/*# sourceMappingURL=event-subevent-group-form-popup.component.css.map */\n"] }]
  }], null, { open: [{
    type: Input
  }], title: [{
    type: Input
  }], stageTitle: [{
    type: Input
  }], canSave: [{
    type: Input
  }], invalidName: [{
    type: Input
  }], saving: [{
    type: Input
  }], model: [{
    type: Input
  }], save: [{
    type: Output
  }], cancel: [{
    type: Output
  }], modelChange: [{
    type: Output
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(EventSubeventGroupFormPopupComponent, { className: "EventSubeventGroupFormPopupComponent", filePath: "app/activity/components/event-subevent-group-form-popup/event-subevent-group-form-popup.component.ts", lineNumber: 25 });
})();

// src/app/activity/components/event-tournament-groups-popup/event-tournament-groups-popup.component.ts
function EventTournamentGroupsPopupComponent_Conditional_0_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 3);
    \u0275\u0275element(1, "app-indicator", 7);
    \u0275\u0275elementEnd();
  }
}
function EventTournamentGroupsPopupComponent_Conditional_0_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 4)(1, "strong");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.loadError);
  }
}
function EventTournamentGroupsPopupComponent_Conditional_0_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "app-accordion", 8);
    \u0275\u0275listener("itemToggle", function EventTournamentGroupsPopupComponent_Conditional_0_Conditional_5_Template_app_accordion_itemToggle_0_listener($event) {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.onAccordionToggle($event));
    })("itemActionSelect", function EventTournamentGroupsPopupComponent_Conditional_0_Conditional_5_Template_app_accordion_itemActionSelect_0_listener($event) {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.onAccordionActionSelect($event));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275nextContext();
    const groupBodyTemplate_r4 = \u0275\u0275reference(7);
    const vm_r5 = \u0275\u0275readContextLet(0);
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("model", ctx_r1.accordionModel(vm_r5))("itemTemplate", groupBodyTemplate_r4);
  }
}
function EventTournamentGroupsPopupComponent_Conditional_0_ng_template_6_Conditional_0_Conditional_12_Conditional_0_For_15_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "tr", 17);
    \u0275\u0275listener("click", function EventTournamentGroupsPopupComponent_Conditional_0_ng_template_6_Conditional_0_Conditional_12_Conditional_0_For_15_Template_tr_click_0_listener($event) {
      const row_r9 = \u0275\u0275restoreView(_r8).$implicit;
      const group_r7 = \u0275\u0275nextContext(3);
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.openMemberHistory(group_r7.id, row_r9.memberId, $event));
    })("keydown.enter", function EventTournamentGroupsPopupComponent_Conditional_0_ng_template_6_Conditional_0_Conditional_12_Conditional_0_For_15_Template_tr_keydown_enter_0_listener($event) {
      const row_r9 = \u0275\u0275restoreView(_r8).$implicit;
      const group_r7 = \u0275\u0275nextContext(3);
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.openMemberHistory(group_r7.id, row_r9.memberId, $event));
    })("keydown.space", function EventTournamentGroupsPopupComponent_Conditional_0_ng_template_6_Conditional_0_Conditional_12_Conditional_0_For_15_Template_tr_keydown_space_0_listener($event) {
      const row_r9 = \u0275\u0275restoreView(_r8).$implicit;
      const group_r7 = \u0275\u0275nextContext(3);
      const ctx_r1 = \u0275\u0275nextContext(3);
      ctx_r1.openMemberHistory(group_r7.id, row_r9.memberId, $event);
      return \u0275\u0275resetView($event.preventDefault());
    });
    \u0275\u0275elementStart(1, "td");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "td");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "td");
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "td");
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "td")(10, "mat-icon");
    \u0275\u0275text(11, "chevron_right");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const row_r9 = ctx.$implicit;
    const group_r7 = \u0275\u0275nextContext(3);
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275classProp("is-advance", ctx_r1.isAdvanceRow(group_r7, row_r9));
    \u0275\u0275attribute("data-member-palette", ctx_r1.leaderboardMemberPalette(group_r7, row_r9.memberId))("data-participant-state", row_r9.participantState);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(row_r9.positionLabel);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(row_r9.memberName);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(row_r9.total);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(row_r9.updates);
  }
}
function EventTournamentGroupsPopupComponent_Conditional_0_ng_template_6_Conditional_0_Conditional_12_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 13)(1, "table", 14)(2, "thead")(3, "tr")(4, "th");
    \u0275\u0275text(5, "#");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "th");
    \u0275\u0275text(7, "Member");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "th");
    \u0275\u0275text(9, "Score");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "th");
    \u0275\u0275text(11, "Updates");
    \u0275\u0275elementEnd();
    \u0275\u0275element(12, "th", 15);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(13, "tbody");
    \u0275\u0275repeaterCreate(14, EventTournamentGroupsPopupComponent_Conditional_0_ng_template_6_Conditional_0_Conditional_12_Conditional_0_For_15_Template, 12, 8, "tr", 16, \u0275\u0275componentInstance().trackByMemberId, true);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const group_r7 = \u0275\u0275nextContext(2);
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(14);
    \u0275\u0275repeater(ctx_r1.scoreRows(group_r7));
  }
}
function EventTournamentGroupsPopupComponent_Conditional_0_ng_template_6_Conditional_0_Conditional_12_Conditional_1_For_19_Template(rf, ctx) {
  if (rf & 1) {
    const _r10 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "tr", 17);
    \u0275\u0275listener("click", function EventTournamentGroupsPopupComponent_Conditional_0_ng_template_6_Conditional_0_Conditional_12_Conditional_1_For_19_Template_tr_click_0_listener($event) {
      const row_r11 = \u0275\u0275restoreView(_r10).$implicit;
      const group_r7 = \u0275\u0275nextContext(3);
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.openMemberHistory(group_r7.id, row_r11.memberId, $event));
    })("keydown.enter", function EventTournamentGroupsPopupComponent_Conditional_0_ng_template_6_Conditional_0_Conditional_12_Conditional_1_For_19_Template_tr_keydown_enter_0_listener($event) {
      const row_r11 = \u0275\u0275restoreView(_r10).$implicit;
      const group_r7 = \u0275\u0275nextContext(3);
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.openMemberHistory(group_r7.id, row_r11.memberId, $event));
    })("keydown.space", function EventTournamentGroupsPopupComponent_Conditional_0_ng_template_6_Conditional_0_Conditional_12_Conditional_1_For_19_Template_tr_keydown_space_0_listener($event) {
      const row_r11 = \u0275\u0275restoreView(_r10).$implicit;
      const group_r7 = \u0275\u0275nextContext(3);
      const ctx_r1 = \u0275\u0275nextContext(3);
      ctx_r1.openMemberHistory(group_r7.id, row_r11.memberId, $event);
      return \u0275\u0275resetView($event.preventDefault());
    });
    \u0275\u0275elementStart(1, "td");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "td");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "td");
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "td");
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "td");
    \u0275\u0275text(10);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "td");
    \u0275\u0275text(12);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "td")(14, "mat-icon");
    \u0275\u0275text(15, "chevron_right");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const row_r11 = ctx.$implicit;
    const group_r7 = \u0275\u0275nextContext(3);
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275classProp("is-advance", ctx_r1.isAdvanceRow(group_r7, row_r11));
    \u0275\u0275attribute("data-member-palette", ctx_r1.leaderboardMemberPalette(group_r7, row_r11.memberId))("data-participant-state", row_r11.participantState);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(row_r11.positionLabel);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(row_r11.memberName);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(row_r11.points);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate3("", row_r11.wins, "-", row_r11.draws, "-", row_r11.losses);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate2("", row_r11.goalsFor, ":", row_r11.goalsAgainst);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(row_r11.goalDiff);
  }
}
function EventTournamentGroupsPopupComponent_Conditional_0_ng_template_6_Conditional_0_Conditional_12_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 13)(1, "table", 18)(2, "thead")(3, "tr")(4, "th");
    \u0275\u0275text(5, "#");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "th");
    \u0275\u0275text(7, "Member");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "th");
    \u0275\u0275text(9, "Pts");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "th");
    \u0275\u0275text(11, "W-D-L");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "th");
    \u0275\u0275text(13, "GF:GA");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "th");
    \u0275\u0275text(15, "GD");
    \u0275\u0275elementEnd();
    \u0275\u0275element(16, "th", 15);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(17, "tbody");
    \u0275\u0275repeaterCreate(18, EventTournamentGroupsPopupComponent_Conditional_0_ng_template_6_Conditional_0_Conditional_12_Conditional_1_For_19_Template, 16, 13, "tr", 16, \u0275\u0275componentInstance().trackByMemberId, true);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const group_r7 = \u0275\u0275nextContext(2);
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(18);
    \u0275\u0275repeater(ctx_r1.fifaRows(group_r7));
  }
}
function EventTournamentGroupsPopupComponent_Conditional_0_ng_template_6_Conditional_0_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, EventTournamentGroupsPopupComponent_Conditional_0_ng_template_6_Conditional_0_Conditional_12_Conditional_0_Template, 16, 0, "div", 13)(1, EventTournamentGroupsPopupComponent_Conditional_0_ng_template_6_Conditional_0_Conditional_12_Conditional_1_Template, 20, 0, "div", 13);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(4);
    \u0275\u0275conditional(ctx_r1.selectedStageMode() === "Score" ? 0 : 1);
  }
}
function EventTournamentGroupsPopupComponent_Conditional_0_ng_template_6_Conditional_0_Conditional_13_Conditional_4_Conditional_0_For_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "td");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "td");
    \u0275\u0275text(6);
    \u0275\u0275pipe(7, "date");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const entry_r12 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(7);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.scoreValueLabel(entry_r12.value));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(entry_r12.note || "No note");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(7, 3, entry_r12.createdAtMs, "MM/dd HH:mm"));
  }
}
function EventTournamentGroupsPopupComponent_Conditional_0_ng_template_6_Conditional_0_Conditional_13_Conditional_4_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 13)(1, "table", 20)(2, "thead")(3, "tr")(4, "th");
    \u0275\u0275text(5, "Score");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "th");
    \u0275\u0275text(7, "Note");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "th");
    \u0275\u0275text(9, "Date");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(10, "tbody");
    \u0275\u0275repeaterCreate(11, EventTournamentGroupsPopupComponent_Conditional_0_ng_template_6_Conditional_0_Conditional_13_Conditional_4_Conditional_0_For_12_Template, 8, 6, "tr", null, \u0275\u0275componentInstance().trackById, true);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const group_r7 = \u0275\u0275nextContext(3);
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(11);
    \u0275\u0275repeater(ctx_r1.scoreHistory(group_r7));
  }
}
function EventTournamentGroupsPopupComponent_Conditional_0_ng_template_6_Conditional_0_Conditional_13_Conditional_4_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 19);
    \u0275\u0275text(1, "No score updates yet.");
    \u0275\u0275elementEnd();
  }
}
function EventTournamentGroupsPopupComponent_Conditional_0_ng_template_6_Conditional_0_Conditional_13_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, EventTournamentGroupsPopupComponent_Conditional_0_ng_template_6_Conditional_0_Conditional_13_Conditional_4_Conditional_0_Template, 13, 0, "div", 13)(1, EventTournamentGroupsPopupComponent_Conditional_0_ng_template_6_Conditional_0_Conditional_13_Conditional_4_Conditional_1_Template, 2, 0, "p", 19);
  }
  if (rf & 2) {
    const group_r7 = \u0275\u0275nextContext(2);
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275conditional(ctx_r1.scoreHistory(group_r7).length > 0 ? 0 : 1);
  }
}
function EventTournamentGroupsPopupComponent_Conditional_0_ng_template_6_Conditional_0_Conditional_13_Conditional_5_Conditional_0_For_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "td");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "td");
    \u0275\u0275text(6);
    \u0275\u0275pipe(7, "date");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const match_r13 = ctx.$implicit;
    const group_r7 = \u0275\u0275nextContext(4);
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate2("", ctx_r1.memberName(group_r7, match_r13.homeMemberId), " - ", ctx_r1.memberName(group_r7, match_r13.awayMemberId));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate2("", match_r13.homeScore, " : ", match_r13.awayScore);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(7, 5, match_r13.createdAtMs, "MM/dd HH:mm"));
  }
}
function EventTournamentGroupsPopupComponent_Conditional_0_ng_template_6_Conditional_0_Conditional_13_Conditional_5_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 13)(1, "table", 21)(2, "thead")(3, "tr")(4, "th");
    \u0275\u0275text(5, "Match");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "th");
    \u0275\u0275text(7, "Result");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "th");
    \u0275\u0275text(9, "Date");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(10, "tbody");
    \u0275\u0275repeaterCreate(11, EventTournamentGroupsPopupComponent_Conditional_0_ng_template_6_Conditional_0_Conditional_13_Conditional_5_Conditional_0_For_12_Template, 8, 8, "tr", null, \u0275\u0275componentInstance().trackById, true);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const group_r7 = \u0275\u0275nextContext(3);
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(11);
    \u0275\u0275repeater(ctx_r1.fifaHistory(group_r7));
  }
}
function EventTournamentGroupsPopupComponent_Conditional_0_ng_template_6_Conditional_0_Conditional_13_Conditional_5_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 19);
    \u0275\u0275text(1, "No matches yet.");
    \u0275\u0275elementEnd();
  }
}
function EventTournamentGroupsPopupComponent_Conditional_0_ng_template_6_Conditional_0_Conditional_13_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, EventTournamentGroupsPopupComponent_Conditional_0_ng_template_6_Conditional_0_Conditional_13_Conditional_5_Conditional_0_Template, 13, 0, "div", 13)(1, EventTournamentGroupsPopupComponent_Conditional_0_ng_template_6_Conditional_0_Conditional_13_Conditional_5_Conditional_1_Template, 2, 0, "p", 19);
  }
  if (rf & 2) {
    const group_r7 = \u0275\u0275nextContext(2);
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275conditional(ctx_r1.fifaHistory(group_r7).length > 0 ? 0 : 1);
  }
}
function EventTournamentGroupsPopupComponent_Conditional_0_ng_template_6_Conditional_0_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "section", 12)(1, "header")(2, "strong");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(4, EventTournamentGroupsPopupComponent_Conditional_0_ng_template_6_Conditional_0_Conditional_13_Conditional_4_Template, 2, 1)(5, EventTournamentGroupsPopupComponent_Conditional_0_ng_template_6_Conditional_0_Conditional_13_Conditional_5_Template, 2, 1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const group_r7 = \u0275\u0275nextContext();
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r1.detailMemberName(group_r7));
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.selectedStageMode() === "Score" ? 4 : 5);
  }
}
function EventTournamentGroupsPopupComponent_Conditional_0_ng_template_6_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "section", 9)(1, "nav", 10)(2, "button", 11);
    \u0275\u0275listener("click", function EventTournamentGroupsPopupComponent_Conditional_0_ng_template_6_Conditional_0_Template_button_click_2_listener($event) {
      const group_r7 = \u0275\u0275restoreView(_r6);
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.selectTab(group_r7.id, "standings", $event));
    });
    \u0275\u0275elementStart(3, "mat-icon");
    \u0275\u0275text(4, "leaderboard");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "span");
    \u0275\u0275text(6, "Standings");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "button", 11);
    \u0275\u0275listener("click", function EventTournamentGroupsPopupComponent_Conditional_0_ng_template_6_Conditional_0_Template_button_click_7_listener($event) {
      const group_r7 = \u0275\u0275restoreView(_r6);
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.selectTab(group_r7.id, "history", $event));
    });
    \u0275\u0275elementStart(8, "mat-icon");
    \u0275\u0275text(9, "history");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "span");
    \u0275\u0275text(11, "History");
    \u0275\u0275elementEnd()()();
    \u0275\u0275conditionalCreate(12, EventTournamentGroupsPopupComponent_Conditional_0_ng_template_6_Conditional_0_Conditional_12_Template, 2, 1)(13, EventTournamentGroupsPopupComponent_Conditional_0_ng_template_6_Conditional_0_Conditional_13_Template, 6, 2, "section", 12);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const group_r7 = ctx;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(2);
    \u0275\u0275classProp("is-active", ctx_r1.tabFor(group_r7.id) === "standings");
    \u0275\u0275advance(5);
    \u0275\u0275classProp("is-active", ctx_r1.tabFor(group_r7.id) === "history");
    \u0275\u0275advance(5);
    \u0275\u0275conditional(ctx_r1.tabFor(group_r7.id) === "standings" ? 12 : 13);
  }
}
function EventTournamentGroupsPopupComponent_Conditional_0_ng_template_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, EventTournamentGroupsPopupComponent_Conditional_0_ng_template_6_Conditional_0_Template, 14, 5, "section", 9);
  }
  if (rf & 2) {
    let tmp_5_0;
    const item_r14 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275conditional((tmp_5_0 = ctx_r1.selectedGroupFromItem(item_r14)) ? 0 : -1, tmp_5_0);
  }
}
function EventTournamentGroupsPopupComponent_Conditional_0_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    const _r15 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "app-popup", 1)(1, "app-form-flow", 22);
    \u0275\u0275listener("ngModelChange", function EventTournamentGroupsPopupComponent_Conditional_0_Conditional_9_Template_app_form_flow_ngModelChange_1_listener($event) {
      \u0275\u0275restoreView(_r15);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.onEntryFormFlowChange($event));
    });
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("model", ctx_r1.tournamentEntryPopupModel())("zIndex", 3920);
    \u0275\u0275advance();
    \u0275\u0275property("model", ctx_r1.entryFormFlowModel())("ngModel", ctx_r1.entryForm)("disabled", !ctx_r1.canManageGroups());
  }
}
function EventTournamentGroupsPopupComponent_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275declareLet(0);
    \u0275\u0275elementStart(1, "app-popup", 1)(2, "div", 2);
    \u0275\u0275conditionalCreate(3, EventTournamentGroupsPopupComponent_Conditional_0_Conditional_3_Template, 2, 0, "div", 3)(4, EventTournamentGroupsPopupComponent_Conditional_0_Conditional_4_Template, 3, 1, "div", 4)(5, EventTournamentGroupsPopupComponent_Conditional_0_Conditional_5_Template, 1, 2, "app-accordion", 5);
    \u0275\u0275template(6, EventTournamentGroupsPopupComponent_Conditional_0_ng_template_6_Template, 1, 1, "ng-template", null, 0, \u0275\u0275templateRefExtractor);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(8, "app-event-subevent-group-form-popup", 6);
    \u0275\u0275listener("modelChange", function EventTournamentGroupsPopupComponent_Conditional_0_Template_app_event_subevent_group_form_popup_modelChange_8_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onGroupFormModelChange($event));
    })("save", function EventTournamentGroupsPopupComponent_Conditional_0_Template_app_event_subevent_group_form_popup_save_8_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.saveGroupForm($event));
    })("cancel", function EventTournamentGroupsPopupComponent_Conditional_0_Template_app_event_subevent_group_form_popup_cancel_8_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.closeGroupForm($event));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(9, EventTournamentGroupsPopupComponent_Conditional_0_Conditional_9_Template, 2, 5, "app-popup", 1);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    const vm_r16 = \u0275\u0275storeLet(ctx_r1.viewModel());
    \u0275\u0275advance();
    \u0275\u0275property("model", ctx_r1.tournamentGroupsPopupModel(vm_r16))("zIndex", 2440);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r1.isLoading ? 3 : ctx_r1.loadError ? 4 : 5);
    \u0275\u0275advance(5);
    \u0275\u0275property("open", ctx_r1.showGroupForm)("title", ctx_r1.groupFormTitle())("stageTitle", ctx_r1.groupFormStageTitle())("model", ctx_r1.groupForm)("canSave", ctx_r1.canSaveGroupForm())("invalidName", ctx_r1.groupFieldInvalid())("saving", ctx_r1.isMutating);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.showEntryForm ? 9 : -1);
  }
}
var TOURNAMENT_RESOURCE_TYPES = ASSET_TYPES;
var TOURNAMENT_MEMBER_PALETTES = [
  "blue",
  "green",
  "amber",
  "violet",
  "cyan",
  "orange",
  "pink",
  "teal"
];
var EventTournamentGroupsPopupComponent = class _EventTournamentGroupsPopupComponent {
  eventSubeventsStore = inject(EventSubeventsPopupStore);
  userProfileStore = inject(UserProfileStore);
  activityStore = inject(ActivityStore);
  eventsService = inject(EventsService);
  activityResourcesService = inject(ActivityResourcesService);
  resourcePopupStore = inject(SubEventResourcePopupStore);
  activitiesStore = inject(ActivitiesPopupStore);
  memberMenuStore = inject(MemberMenuStore);
  dialogStore = inject(DialogStore);
  cdr = inject(ChangeDetectorRef);
  state = null;
  selectedStageId = null;
  selectedGroupId = null;
  openGroupIds = [];
  isLoading = false;
  isMutating = false;
  loadError = "";
  leaderboardState = null;
  leaderboardLoading = false;
  groupTabs = {};
  detailMemberByGroupId = {};
  showGroupForm = false;
  groupFormStageId = null;
  groupFormGroupId = null;
  groupForm = this.emptyGroupForm();
  showEntryForm = false;
  entryForm = this.emptyEntryForm();
  handledRequestMs = 0;
  handledMembersSyncMs = 0;
  handledResourceSyncMs = 0;
  handledResourceMetricsRevision = 0;
  emittedStagePendingByKey = /* @__PURE__ */ new Map();
  loadSequence = 0;
  leaderboardSequence = 0;
  constructor() {
    effect(() => {
      const request = this.eventSubeventsStore.eventTournamentGroupsPopup();
      if (!request) {
        this.resetState();
        return;
      }
      if (request.updatedMs === this.handledRequestMs) {
        return;
      }
      this.handledRequestMs = request.updatedMs;
      this.selectedStageId = request.selectedStageId ?? null;
      this.selectedGroupId = request.selectedGroupId ?? null;
      this.openGroupIds = request.selectedGroupId ? [request.selectedGroupId] : [];
      this.state = this.contextState(request);
      this.selectedStageId = this.resolveSelectedStageId(this.selectedStageId);
      this.leaderboardState = null;
      void this.loadSelectedStageData();
    });
    effect(() => {
      const sync = this.activityStore.activityMembersSync();
      if (!sync || sync.updatedMs === this.handledMembersSyncMs) {
        return;
      }
      this.handledMembersSyncMs = sync.updatedMs;
      if (!this.isOpen()) {
        return;
      }
      this.syncGroupMemberSummaryFromSignal(sync.id, sync.acceptedMembers, sync.pendingMembers);
    });
    effect(() => {
      const sync = this.activityStore.activityResourceSync();
      if (!sync || sync.updatedMs === this.handledResourceSyncMs) {
        return;
      }
      this.handledResourceSyncMs = sync.updatedMs;
      if (!this.isOpen()) {
        return;
      }
      const match = this.groupResourceScope(sync.ownerId, sync.subEventId);
      if (match) {
        this.syncResourceCountersFromCache(match.stage.subEventId, match.group.id, sync.assetOwnerUserId);
      }
    });
    effect(() => {
      const update = this.resourcePopupStore.subEventResourceMetricsUpdate();
      if (!update || update.revision === this.handledResourceMetricsRevision) {
        return;
      }
      this.handledResourceMetricsRevision = update.revision;
      if (!this.isOpen()) {
        return;
      }
      const match = this.groupResourceScope(update.ownerId, update.subEventId);
      if (!match) {
        return;
      }
      this.state = this.updateGroupResourceMetrics(this.state, match.stage.subEventId, match.group.id, {
        [ASSET_TYPE_TRANSPORT]: {
          accepted: Number(update.subEvent.carsAccepted) || 0,
          pending: Number(update.subEvent.carsPending) || 0,
          capacityMin: Number(update.subEvent.carsCapacityMin) || 0,
          capacityMax: Number(update.subEvent.carsCapacityMax) || 0
        },
        [ASSET_TYPE_ACCOMMODATION]: {
          accepted: Number(update.subEvent.accommodationAccepted) || 0,
          pending: Number(update.subEvent.accommodationPending) || 0,
          capacityMin: Number(update.subEvent.accommodationCapacityMin) || 0,
          capacityMax: Number(update.subEvent.accommodationCapacityMax) || 0
        },
        [ASSET_TYPE_SUPPLIES]: {
          accepted: Number(update.subEvent.suppliesAccepted) || 0,
          pending: Number(update.subEvent.suppliesPending) || 0,
          capacityMin: Number(update.subEvent.suppliesCapacityMin) || 0,
          capacityMax: Number(update.subEvent.suppliesCapacityMax) || 0
        }
      });
      this.emitGroupsUpdate(match.stage.subEventId);
      this.cdr.markForCheck();
    });
  }
  onEscape(event) {
    if (!this.isOpen()) {
      return;
    }
    if (this.showEntryForm) {
      this.closeEntryForm(event);
      return;
    }
    if (this.showGroupForm) {
      this.closeGroupForm(event);
      return;
    }
    this.close();
  }
  isOpen() {
    return Boolean(this.eventSubeventsStore.eventTournamentGroupsPopup());
  }
  close() {
    this.eventSubeventsStore.closeEventTournamentGroupsPopup();
  }
  viewModel() {
    return EventTournamentGroupsPopupConverter.convert({
      state: this.state,
      selectedStageId: this.selectedStageId,
      openGroupIds: this.openGroupIds
    });
  }
  tournamentGroupsPopupModel(vm) {
    const toolbarControls = this.tournamentGroupsToolbarControls();
    return {
      title: vm.title,
      subtitle: vm.subtitle,
      ariaLabel: vm.title,
      closeAriaLabel: "Close tournament groups",
      closeOnBackdrop: true,
      size: "wide",
      height: "full",
      headerTone: "accent",
      bodyLayout: "fill",
      backdropTone: "dim",
      headerControls: [{
        kind: "menu",
        id: "tournament-stage",
        menuKind: "select",
        trigger: vm.stageTrigger,
        items: vm.stageItems,
        panelAlign: "end"
      }],
      toolbarControls,
      onClose: () => this.close(),
      onMenuSelect: (event) => this.onTournamentGroupsPopupMenuSelect(event)
    };
  }
  tournamentGroupsToolbarControls() {
    const items = this.headerActionItems();
    if (items.length === 0) {
      return [];
    }
    return [{
      kind: "menu",
      id: "tournament-actions",
      align: "end",
      menuKind: "inline",
      items,
      closeOnSelect: false
    }];
  }
  onTournamentGroupsPopupMenuSelect(event) {
    if (event.control.id === "tournament-stage") {
      this.onStageSelect(event.itemSelect);
      return;
    }
    if (event.control.id === "tournament-actions") {
      this.onHeaderActionSelect(event.itemSelect);
    }
  }
  accordionModel(vm) {
    return vm.accordion;
  }
  headerActionItems() {
    const canManage = this.viewModel().canManage && Boolean(this.viewModel().selectedStage);
    if (!canManage) {
      return [];
    }
    return [
      {
        id: "add-group",
        label: "Add Group",
        icon: "group_add",
        palette: "green",
        surface: "tinted",
        layout: "action",
        disabled: this.isMutating,
        context: { action: "add-group" }
      }
    ];
  }
  onHeaderActionSelect(event) {
    if (event.context?.action !== "add-group") {
      return;
    }
    const stage = this.viewModel().selectedStage;
    if (!stage || !this.canManageGroups()) {
      return;
    }
    this.openCreateGroupForm(stage, event.sourceEvent);
  }
  onStageSelect(event) {
    const stageId = event.context?.stageId ?? event.id;
    if (!stageId || stageId === this.selectedStageId) {
      return;
    }
    this.selectedStageId = stageId;
    this.selectedGroupId = null;
    this.openGroupIds = [];
    this.leaderboardState = null;
    void this.loadSelectedStageData();
    this.cdr.markForCheck();
  }
  onAccordionToggle(event) {
    const groupId = event.item.context?.groupId ?? event.id;
    this.selectedGroupId = groupId;
    this.openGroupIds = event.open ? [groupId] : [];
    this.cdr.markForCheck();
  }
  onAccordionActionSelect(event) {
    this.onGroupActionSelect(event.itemSelect);
  }
  onGroupActionSelect(event) {
    const context = event.context;
    if (!context) {
      return;
    }
    const stage = this.stageById(context.stageId);
    const group = this.groupById(stage, context.groupId);
    if (!stage || !group) {
      return;
    }
    switch (context.action) {
      case "add-entry":
        this.openEntryForm(stage, group, event.sourceEvent);
        return;
      case "edit-group":
        this.openEditGroupForm(stage, group, event.sourceEvent);
        return;
      case "delete-group":
        this.confirmDeleteGroup(stage, group);
        return;
      case "members":
        this.openResourcePopup("Members", stage, group, event.sourceEvent);
        return;
      case "transport":
        this.openResourcePopup(ASSET_TYPE_TRANSPORT, stage, group, event.sourceEvent);
        return;
      case "accommodation":
        this.openResourcePopup(ASSET_TYPE_ACCOMMODATION, stage, group, event.sourceEvent);
        return;
      case "supplies":
        this.openResourcePopup(ASSET_TYPE_SUPPLIES, stage, group, event.sourceEvent);
        return;
    }
  }
  selectedStageMode() {
    const stage = this.viewModel().selectedStage;
    return stage?.leaderboardType === "Fifa" ? "Fifa" : "Score";
  }
  tabFor(groupId) {
    return this.groupTabs[groupId] ?? "standings";
  }
  selectTab(groupId, tab, event) {
    event?.stopPropagation();
    this.groupTabs = __spreadProps(__spreadValues({}, this.groupTabs), {
      [groupId]: tab
    });
    this.cdr.markForCheck();
  }
  openMemberHistory(groupId, memberId, event) {
    event?.stopPropagation();
    if (!memberId) {
      return;
    }
    this.detailMemberByGroupId = __spreadProps(__spreadValues({}, this.detailMemberByGroupId), {
      [groupId]: memberId
    });
    this.selectTab(groupId, "history");
  }
  scoreRows(group) {
    const leaderboardGroup = this.leaderboardGroup(group.id);
    return leaderboardGroup?.scoreRows?.map((row) => __spreadValues({}, row)) ?? [];
  }
  fifaRows(group) {
    const leaderboardGroup = this.leaderboardGroup(group.id);
    return leaderboardGroup?.fifaRows?.map((row) => __spreadValues({}, row)) ?? [];
  }
  scoreHistory(group) {
    const selectedMemberId = this.detailMemberByGroupId[group.id] ?? "";
    const entries = this.leaderboardGroup(group.id)?.scoreEntries ?? [];
    return entries.filter((entry) => !selectedMemberId || entry.memberId === selectedMemberId).map((entry) => __spreadValues({}, entry)).sort((left, right) => right.createdAtMs - left.createdAtMs);
  }
  fifaHistory(group) {
    const selectedMemberId = this.detailMemberByGroupId[group.id] ?? "";
    const matches = this.leaderboardGroup(group.id)?.fifaMatches ?? [];
    return matches.filter((match) => !selectedMemberId || match.homeMemberId === selectedMemberId || match.awayMemberId === selectedMemberId).map((match) => __spreadValues({}, match)).sort((left, right) => right.createdAtMs - left.createdAtMs);
  }
  detailMemberName(group) {
    const selectedMemberId = this.detailMemberByGroupId[group.id] ?? "";
    if (!selectedMemberId) {
      return "All updates";
    }
    return this.memberName(group, selectedMemberId);
  }
  memberName(group, memberId) {
    return this.membersForGroup(group).find((member) => member.id === memberId)?.name ?? "Member";
  }
  isAdvanceRow(group, row) {
    const leaderboardGroup = this.leaderboardGroup(group.id);
    const advancingIds = (leaderboardGroup?.advancingMemberIds ?? []).map((id) => id.trim()).filter(Boolean);
    return row.participantState === "A" && advancingIds.includes(row.memberId);
  }
  scoreValueLabel(value) {
    return value > 0 ? `+${value}` : `${value}`;
  }
  selectedGroupFromItem(item) {
    return this.groupForItem(item);
  }
  groupFormTitle() {
    return this.groupFormGroupId ? "Edit Group" : "Create Group";
  }
  groupFormStageTitle() {
    return this.stageById(this.groupFormStageId)?.title ?? "";
  }
  canSaveGroupForm() {
    return this.canManageGroups() && this.groupForm.name.trim().length > 0 && !this.isMutating;
  }
  groupFieldInvalid() {
    return !this.groupForm.name.trim();
  }
  onGroupFormModelChange(model) {
    const capacityMin = Math.max(0, Math.trunc(Number(model.capacityMin) || 0));
    const capacityMax = Math.max(capacityMin, Math.trunc(Number(model.capacityMax) || capacityMin));
    this.groupForm = {
      name: `${model.name ?? ""}`,
      capacityMin,
      capacityMax
    };
  }
  async saveGroupForm(event) {
    event.stopPropagation();
    const stageId = this.groupFormStageId ?? this.viewModel().selectedStage?.subEventId ?? "";
    if (!this.canSaveGroupForm() || !stageId) {
      return;
    }
    this.isMutating = true;
    let reloadLeaderboardStageId = null;
    try {
      const nextState = await this.eventsService.saveTournamentGroup({
        actorUserId: this.activeUserId(),
        eventId: this.requestEventId(),
        slotId: this.requestSlotId(),
        subEventId: stageId,
        groupId: this.groupFormGroupId,
        name: this.groupForm.name,
        capacityMin: this.groupForm.capacityMin,
        capacityMax: this.groupForm.capacityMax
      });
      if (nextState) {
        this.state = this.mergeGroupsState(this.state, nextState);
        this.selectedStageId = stageId;
        if (this.groupFormGroupId) {
          this.selectedGroupId = this.groupFormGroupId;
          this.openGroupIds = [this.groupFormGroupId];
        } else {
          const added = nextState.stages.find((stage) => stage.subEventId === stageId)?.groups.find((group) => group.name === this.groupForm.name.trim()) ?? null;
          if (added) {
            this.selectedGroupId = added.id;
            this.openGroupIds = [added.id];
          }
        }
        this.leaderboardState = null;
        reloadLeaderboardStageId = stageId;
        await this.loadGroupsForStage(stageId);
        this.emitGroupsUpdate(stageId);
      }
      this.closeGroupForm();
    } finally {
      this.isMutating = false;
      this.cdr.markForCheck();
    }
    if (reloadLeaderboardStageId) {
      void this.loadLeaderboardForStage(reloadLeaderboardStageId);
    }
  }
  closeGroupForm(event) {
    event?.stopPropagation();
    this.showGroupForm = false;
    this.groupFormStageId = null;
    this.groupFormGroupId = null;
    this.groupForm = this.emptyGroupForm();
  }
  entryGroupLabel() {
    return this.groupById(this.viewModel().selectedStage, this.entryForm.groupId)?.name ?? "Group";
  }
  entryFormSubtitle() {
    return this.selectedStageMode() === "Fifa" ? "Match result" : "Score update";
  }
  tournamentEntryPopupModel() {
    const title = this.entryGroupLabel();
    return {
      title,
      subtitle: this.entryFormSubtitle(),
      ariaLabel: title,
      closeAriaLabel: "Close leaderboard editor",
      closeOnBackdrop: true,
      size: "default",
      height: "auto",
      headerTone: "accent",
      bodyLayout: "overflow",
      backdropTone: "dim",
      headerControls: [{
        kind: "menu",
        id: "tournament-entry-save",
        menuKind: "inline",
        items: this.entrySaveMenuItems(),
        closeOnSelect: false
      }],
      onClose: (event) => this.closeEntryForm(event),
      onMenuSelect: (event) => this.onTournamentEntryPopupMenuSelect(event)
    };
  }
  entryMemberTrigger(menu) {
    return {
      label: this.memberNameForEntry(menu),
      icon: "person",
      palette: this.entryMemberPalette(menu),
      layout: "field",
      ariaLabel: "Select member"
    };
  }
  leaderboardMemberPalette(group, memberId) {
    return this.memberPalette(memberId, this.membersForGroup(group));
  }
  entryFormFlowModel() {
    const isFifa = this.selectedStageMode() === "Fifa";
    return {
      title: this.entryGroupLabel(),
      subtitle: this.entryFormSubtitle(),
      layout: "grouped",
      header: false,
      allowMenuOverflow: true,
      summary: { enabled: false },
      completion: { controls: "required" },
      save: null,
      steps: [
        {
          id: "entry",
          title: "Entry",
          controls: isFifa ? [
            this.entryMemberControl("home", "Member A"),
            this.entryMemberControl("away", "Member B"),
            {
              id: "homeScore",
              bind: "homeScore",
              kind: "number",
              layout: "half",
              label: "Score A",
              min: 0,
              step: 1,
              placeholder: "0",
              required: true
            },
            {
              id: "awayScore",
              bind: "awayScore",
              kind: "number",
              layout: "half",
              label: "Score B",
              min: 0,
              step: 1,
              placeholder: "0",
              required: true
            },
            this.entryNoteControl()
          ] : [
            this.entryMemberControl("score", "Tag"),
            {
              id: "scoreValue",
              bind: "scoreValue",
              kind: "number",
              layout: "half",
              label: "Score",
              step: 1,
              placeholder: "+3",
              required: true
            },
            this.entryNoteControl()
          ]
        }
      ]
    };
  }
  entrySaveMenuItems() {
    return [{
      id: "save-entry",
      icon: "done",
      kind: "action",
      palette: this.isMutating || this.canSubmitEntry() ? "success" : "danger",
      disabled: !this.canSubmitEntry(),
      ariaLabel: "Save leaderboard entry",
      progress: this.isMutating ? {
        state: "loading",
        shape: "circle"
      } : null
    }];
  }
  onTournamentEntryPopupMenuSelect(event) {
    if (event.itemSelect.id === "save-entry") {
      void this.saveEntryForm(event.itemSelect.sourceEvent);
    }
  }
  onEntryFormFlowChange(value) {
    const record = this.recordValue(value);
    const members = this.entryMembers();
    const firstMemberId = members[0]?.id ?? "";
    const secondMemberId = members.find((member) => member.id !== firstMemberId)?.id ?? firstMemberId;
    const homeMemberId = this.entryMemberIdValue(record["homeMemberId"], firstMemberId);
    let awayMemberId = this.entryMemberIdValue(record["awayMemberId"], secondMemberId);
    if (homeMemberId && homeMemberId === awayMemberId) {
      awayMemberId = members.find((member) => member.id !== homeMemberId)?.id ?? "";
    }
    this.entryForm = {
      groupId: this.entryForm.groupId,
      memberId: this.entryMemberIdValue(record["memberId"], firstMemberId),
      scoreValue: this.integerOrNull(record["scoreValue"]),
      homeMemberId,
      awayMemberId,
      homeScore: this.integerOrNull(record["homeScore"], true),
      awayScore: this.integerOrNull(record["awayScore"], true),
      note: `${record["note"] ?? ""}`
    };
  }
  entryMemberControl(menu, label) {
    const bind = menu === "score" ? "memberId" : `${menu}MemberId`;
    return {
      id: bind,
      bind,
      kind: "menu",
      layout: "half",
      label,
      required: true,
      config: {
        kind: "select",
        layout: "row",
        panelMode: "auto",
        closeOnSelect: true,
        trigger: this.entryMemberTrigger(menu),
        items: this.entryMemberFlowItems(menu)
      }
    };
  }
  entryNoteControl() {
    return {
      id: "note",
      bind: "note",
      kind: "text",
      layout: "wide",
      label: "Note",
      placeholder: "Reason / context"
    };
  }
  entryMemberFlowItems(menu) {
    const selectedId = this.entrySelectedMemberId(menu);
    const members = this.entryMembers();
    return members.map((member) => ({
      id: member.id,
      label: member.name,
      icon: "person",
      kind: "radio",
      palette: this.memberPalette(member.id, members),
      surface: "tinted",
      active: member.id === selectedId,
      context: { menu, memberId: member.id }
    }));
  }
  canSubmitEntry() {
    if (!this.canManageGroups() || this.isMutating) {
      return false;
    }
    if (!this.canAddScoreToStage(this.viewModel().selectedStage)) {
      return false;
    }
    const members = this.entryMembers();
    if (this.selectedStageMode() === "Fifa") {
      return members.some((member) => member.id === this.entryForm.homeMemberId) && members.some((member) => member.id === this.entryForm.awayMemberId) && this.entryForm.homeMemberId !== this.entryForm.awayMemberId && this.entryForm.homeScore !== null && this.entryForm.awayScore !== null;
    }
    return members.some((member) => member.id === this.entryForm.memberId) && this.entryForm.scoreValue !== null;
  }
  async saveEntryForm(event) {
    event.stopPropagation();
    const stage = this.viewModel().selectedStage;
    if (!stage || !this.canSubmitEntry()) {
      return;
    }
    this.isMutating = true;
    try {
      const nextLeaderboard = await this.eventsService.upsertSubEventLeaderboardEntry({
        actorUserId: this.activeUserId(),
        eventId: this.eventId(),
        subEventId: stage.subEventId,
        groupId: this.entryForm.groupId,
        mode: this.selectedStageMode(),
        memberId: this.entryForm.memberId,
        scoreValue: this.entryForm.scoreValue,
        note: this.entryForm.note,
        homeMemberId: this.entryForm.homeMemberId,
        awayMemberId: this.entryForm.awayMemberId,
        homeScore: this.entryForm.homeScore,
        awayScore: this.entryForm.awayScore
      });
      if (nextLeaderboard) {
        this.leaderboardState = nextLeaderboard;
      }
      this.closeEntryForm();
    } finally {
      this.isMutating = false;
      this.cdr.markForCheck();
    }
  }
  closeEntryForm(event) {
    event?.stopPropagation();
    this.showEntryForm = false;
    this.entryForm = this.emptyEntryForm();
  }
  trackByGroupId(_, item) {
    return "id" in item ? item.id : item.groupId;
  }
  trackByMemberId(_, item) {
    return item.memberId;
  }
  trackById(_, item) {
    return item.id;
  }
  contextState(request) {
    const eventId = `${request.slotId ?? request.eventId ?? ""}`.trim();
    const stages = request.stages.map((stage, index) => __spreadProps(__spreadValues({}, stage), {
      subEventId: `${stage.subEventId ?? ""}`.trim() || `stage-${index + 1}`,
      title: `${stage.title ?? ""}`.trim() || `Stage ${index + 1}`,
      description: `${stage.description ?? ""}`.trim(),
      location: `${stage.location ?? ""}`.trim(),
      startAt: `${stage.startAt ?? ""}`.trim(),
      endAt: `${stage.endAt ?? ""}`.trim(),
      stageNumber: Math.max(1, Math.trunc(Number(stage.stageNumber) || index + 1)),
      leaderboardType: stage.leaderboardType === "Fifa" ? "Fifa" : "Score",
      advancePerGroup: Math.max(0, Math.trunc(Number(stage.advancePerGroup) || 0)),
      groups: []
    }));
    return {
      eventId,
      title: request.title?.trim() || "Groups",
      subtitle: "",
      canManage: request.canManage === true,
      stages
    };
  }
  resolveSelectedStageId(stageId) {
    const requestedId = `${stageId ?? ""}`.trim();
    if (requestedId && this.state?.stages.some((stage) => stage.subEventId === requestedId)) {
      return requestedId;
    }
    return this.state?.stages[0]?.subEventId ?? null;
  }
  stateWithStageGroups(state, stageId, groups) {
    if (!state) {
      return null;
    }
    return __spreadProps(__spreadValues({}, state), {
      stages: state.stages.map((stage) => stage.subEventId === stageId ? __spreadProps(__spreadValues({}, stage), {
        groups: groups.map((group) => __spreadValues({}, group))
      }) : stage)
    });
  }
  mergeGroupsState(base, loaded) {
    if (!base) {
      return loaded;
    }
    if (!loaded) {
      return base;
    }
    const loadedStagesById = new Map(loaded.stages.map((stage) => [stage.subEventId, stage]));
    return __spreadProps(__spreadValues({}, base), {
      canManage: base.canManage === true || loaded.canManage === true,
      stages: base.stages.map((stage) => __spreadProps(__spreadValues({}, stage), {
        groups: loadedStagesById.get(stage.subEventId)?.groups.map((group) => __spreadValues({}, group)) ?? stage.groups
      }))
    });
  }
  async loadSelectedStageData() {
    const stageId = this.selectedStageId ?? this.viewModel().selectedStage?.subEventId ?? null;
    if (!stageId) {
      return;
    }
    await this.loadGroupsForStage(stageId, true);
  }
  async loadGroupsForStage(stageId, includeLeaderboard = false) {
    const request = this.eventSubeventsStore.eventTournamentGroupsPopup();
    const eventId = `${request?.eventId ?? ""}`.trim();
    const normalizedStageId = `${stageId ?? ""}`.trim();
    if (!eventId || !normalizedStageId) {
      return;
    }
    const sequence = ++this.loadSequence;
    this.isLoading = true;
    this.loadError = "";
    this.leaderboardState = null;
    this.cdr.markForCheck();
    try {
      const groupsRequest = this.eventsService.queryTournamentStageGroups({
        eventId,
        slotId: request?.slotId ?? null,
        stageId: normalizedStageId
      });
      const leaderboardRequest = includeLeaderboard ? this.eventsService.querySubEventLeaderboard(eventId, normalizedStageId).catch(() => null) : Promise.resolve(null);
      const [groups, leaderboard] = await Promise.all([groupsRequest, leaderboardRequest]);
      if (sequence !== this.loadSequence) {
        return;
      }
      this.state = this.stateWithStageGroups(this.state, normalizedStageId, groups);
      this.selectedStageId = normalizedStageId;
      if (includeLeaderboard) {
        this.leaderboardState = leaderboard;
      }
      this.emitGroupsUpdate(normalizedStageId);
      const selectedStage = this.stageById(normalizedStageId);
      if (this.selectedGroupId && selectedStage?.groups.some((group) => group.id === this.selectedGroupId)) {
        this.openGroupIds = [this.selectedGroupId];
      } else {
        this.selectedGroupId = null;
        this.openGroupIds = [];
      }
    } catch {
      this.loadError = "Groups are not available right now.";
    } finally {
      if (sequence === this.loadSequence) {
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    }
  }
  async loadLeaderboardForStage(stageId) {
    const eventId = this.eventId();
    if (!eventId || !stageId) {
      return;
    }
    const sequence = ++this.leaderboardSequence;
    this.leaderboardLoading = true;
    this.cdr.markForCheck();
    try {
      const state = await this.eventsService.querySubEventLeaderboard(eventId, stageId).catch(() => null);
      if (sequence !== this.leaderboardSequence || this.selectedStageId !== stageId) {
        return;
      }
      this.leaderboardState = state;
    } finally {
      if (sequence === this.leaderboardSequence) {
        this.leaderboardLoading = false;
        this.cdr.markForCheck();
      }
    }
  }
  syncResourceCountersFromCache(stageId, groupId, assetOwnerUserId) {
    const normalizedStageId = this.normalizeId(stageId);
    const normalizedGroupId = this.normalizeId(groupId);
    const normalizedAssetOwnerUserId = this.normalizeId(assetOwnerUserId) || this.activityResourcesService.activeAssetOwnerUserId();
    if (!normalizedStageId || !normalizedGroupId || !normalizedAssetOwnerUserId) {
      return;
    }
    const ownerId = this.groupMemberOwnerId(normalizedStageId, normalizedGroupId);
    this.applyResourceCounters(ownerId, normalizedStageId, normalizedGroupId, normalizedAssetOwnerUserId, this.activityResourcesService.peekSubEventResourceState(ownerId, normalizedStageId, normalizedAssetOwnerUserId));
  }
  applyResourceCounters(ownerId, stageId, groupId, assetOwnerUserId, state) {
    if (ownerId !== this.groupMemberOwnerId(stageId, groupId) || assetOwnerUserId !== this.activityResourcesService.activeAssetOwnerUserId()) {
      return;
    }
    if (!state?.resourceMetricsByType) {
      return;
    }
    this.state = this.updateGroupResourceMetrics(this.state, stageId, groupId, state.resourceMetricsByType);
    this.emitGroupsUpdate(stageId);
    this.cdr.markForCheck();
  }
  canManageGroups() {
    return this.viewModel().canManage === true;
  }
  canInviteGroupMembers(group) {
    return this.canManageGroups() && group.memberOwnerType !== "event";
  }
  canAddScoreToStage(stage) {
    return `${stage?.stageStatus ?? ""}`.trim().toUpperCase() === "SR";
  }
  activeUserId() {
    return this.userProfileStore.activeUserProfile()?.id?.trim() || this.userProfileStore.activeUserId().trim() || this.userProfileStore.getActiveUserId().trim();
  }
  eventId() {
    const request = this.eventSubeventsStore.eventTournamentGroupsPopup();
    return `${request?.slotId ?? request?.eventId ?? ""}`.trim();
  }
  requestEventId() {
    return `${this.eventSubeventsStore.eventTournamentGroupsPopup()?.eventId ?? ""}`.trim();
  }
  requestSlotId() {
    const slotId = `${this.eventSubeventsStore.eventTournamentGroupsPopup()?.slotId ?? ""}`.trim();
    return slotId || null;
  }
  stageById(stageId) {
    const id = `${stageId ?? ""}`.trim();
    if (!id) {
      return null;
    }
    return this.state?.stages.find((stage) => stage.subEventId === id) ?? null;
  }
  groupById(stage, groupId) {
    const id = `${groupId ?? ""}`.trim();
    if (!stage || !id) {
      return null;
    }
    return stage.groups.find((group) => group.id === id) ?? null;
  }
  groupForItem(item) {
    const stage = this.stageById(item.context?.stageId ?? this.selectedStageId);
    return this.groupById(stage, item.context?.groupId ?? item.id);
  }
  leaderboardGroup(groupId) {
    return this.leaderboardState?.groups.find((group) => group.groupId === groupId) ?? null;
  }
  membersForGroup(group) {
    const leaderboardGroup = this.leaderboardGroup(group.id);
    if (leaderboardGroup?.members?.length) {
      return leaderboardGroup.members.map((member) => __spreadValues({}, member));
    }
    const memberCount = Math.max(2, Math.trunc(Number(leaderboardGroup?.memberCount ?? group.capacityMax) || 2));
    return Array.from({ length: memberCount }, (_, index) => ({
      id: `${group.id}-member-${index + 1}`,
      name: `Member ${index + 1}`
    }));
  }
  entryMembers() {
    const group = this.groupById(this.viewModel().selectedStage, this.entryForm.groupId);
    return group ? this.membersForGroup(group) : [];
  }
  entrySelectedMemberId(menu) {
    switch (menu) {
      case "home":
        return this.entryForm.homeMemberId;
      case "away":
        return this.entryForm.awayMemberId;
      case "score":
      default:
        return this.entryForm.memberId;
    }
  }
  entryMemberPalette(menu) {
    const members = this.entryMembers();
    return this.memberPalette(this.entrySelectedMemberId(menu), members);
  }
  memberPalette(memberId, members) {
    const memberIndex = members.findIndex((member) => member.id === memberId);
    if (memberIndex >= 0) {
      return TOURNAMENT_MEMBER_PALETTES[memberIndex % TOURNAMENT_MEMBER_PALETTES.length] ?? "blue";
    }
    const stableIndex = Array.from(`${memberId ?? ""}`).reduce((total, character) => total * 31 + (character.codePointAt(0) ?? 0) >>> 0, 0) % TOURNAMENT_MEMBER_PALETTES.length;
    return TOURNAMENT_MEMBER_PALETTES[stableIndex] ?? "blue";
  }
  memberNameForEntry(menu) {
    const selectedId = this.entrySelectedMemberId(menu);
    return this.entryMembers().find((member) => member.id === selectedId)?.name ?? "Select member";
  }
  recordValue(value) {
    return typeof value === "object" && value !== null && !Array.isArray(value) ? value : {};
  }
  entryMemberIdValue(value, fallback) {
    const memberId = `${value ?? ""}`.trim();
    if (memberId && this.entryMembers().some((member) => member.id === memberId)) {
      return memberId;
    }
    return fallback;
  }
  integerOrNull(value, nonNegative = false) {
    if (value === "" || value === null || value === void 0) {
      return null;
    }
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) {
      return null;
    }
    const integer = Math.trunc(parsed);
    return nonNegative ? Math.max(0, integer) : integer;
  }
  normalizeId(value) {
    return `${value ?? ""}`.trim();
  }
  openCreateGroupForm(stage, event) {
    event?.stopPropagation();
    if (!this.canManageGroups()) {
      return;
    }
    this.groupFormStageId = stage.subEventId;
    this.groupFormGroupId = null;
    this.groupForm = {
      name: this.nextGroupName(stage),
      capacityMin: Math.max(0, Math.trunc(Number(stage.groups[0]?.capacityMin) || 4)),
      capacityMax: Math.max(0, Math.trunc(Number(stage.groups[0]?.capacityMax) || 7))
    };
    this.showGroupForm = true;
  }
  openEditGroupForm(stage, group, event) {
    event?.stopPropagation();
    if (!this.canManageGroups()) {
      return;
    }
    this.groupFormStageId = stage.subEventId;
    this.groupFormGroupId = group.id;
    this.groupForm = {
      name: group.name,
      capacityMin: group.capacityMin,
      capacityMax: group.capacityMax
    };
    this.showGroupForm = true;
  }
  confirmDeleteGroup(stage, group) {
    if (!this.canManageGroups()) {
      return;
    }
    this.dialogStore.open({
      title: "Delete Group",
      message: `Delete ${group.name}?`,
      cancelLabel: "Cancel",
      confirmLabel: "Delete",
      busyConfirmLabel: "Deleting...",
      confirmTone: "danger",
      failureMessage: "Group delete failed.",
      onConfirm: async () => {
        this.isMutating = true;
        let reloadLeaderboardStageId = null;
        try {
          const nextState = await this.eventsService.deleteTournamentGroup({
            actorUserId: this.activeUserId(),
            eventId: this.requestEventId(),
            slotId: this.requestSlotId(),
            subEventId: stage.subEventId,
            groupId: group.id
          });
          if (nextState) {
            this.state = this.mergeGroupsState(this.state, nextState);
            this.selectedStageId = stage.subEventId;
            const nextGroup = this.state?.stages.find((item) => item.subEventId === stage.subEventId)?.groups[0] ?? null;
            this.selectedGroupId = nextGroup?.id ?? null;
            this.openGroupIds = nextGroup ? [nextGroup.id] : [];
            this.leaderboardState = null;
            reloadLeaderboardStageId = nextGroup ? stage.subEventId : null;
            await this.loadGroupsForStage(stage.subEventId);
            this.emitGroupsUpdate(stage.subEventId);
          }
        } finally {
          this.isMutating = false;
          this.cdr.markForCheck();
        }
        if (reloadLeaderboardStageId) {
          void this.loadLeaderboardForStage(reloadLeaderboardStageId);
        }
      }
    });
  }
  emitGroupsUpdate(stageId) {
    const stage = this.state?.stages.find((item) => item.subEventId === stageId) ?? null;
    const groupsCount = stage?.groups.length ?? 0;
    const groupsPending = EventTournamentGroupsPopupConverter.stagePendingTotal(stage);
    const stagePendingKey = [
      this.requestEventId(),
      this.requestSlotId() ?? "",
      stageId
    ].join(":");
    const previousGroupsPending = this.emittedStagePendingByKey.get(stagePendingKey);
    this.emittedStagePendingByKey.set(stagePendingKey, groupsPending);
    this.eventSubeventsStore.emitEventTournamentGroupsUpdate({
      eventId: this.requestEventId(),
      slotId: this.requestSlotId(),
      stageId,
      groupsCount,
      groupsPending,
      groupsPendingDelta: previousGroupsPending == null ? 0 : groupsPending - previousGroupsPending
    });
  }
  openResourcePopup(type, stage, group, event) {
    event?.stopPropagation();
    const isMembersPopup = type === "Members";
    const parentTitle = `${this.state?.title ?? ""}`.trim();
    const stageTitle = `${stage.title ?? ""}`.trim();
    const groupLabel = `${group.name ?? ""}`.trim();
    if (isMembersPopup) {
      const memberOwnerType = group.memberOwnerType === "event" ? "event" : "group";
      const memberOwnerId = `${group.memberOwnerId ?? ""}`.trim() || this.groupMemberOwnerId(stage.subEventId, group.id);
      void this.activitiesStore.ensureEventMembersPopupLoaded();
      this.memberMenuStore.requestActivitiesNavigation({
        type: "members",
        ownerId: memberOwnerId,
        ownerType: memberOwnerType,
        parentOwnerId: this.eventId(),
        parentOwnerType: "event",
        eventId: this.eventId(),
        subEventId: stage.subEventId,
        subtitle: groupLabel || stageTitle || parentTitle || "Members",
        canManage: this.canInviteGroupMembers(group),
        viewOnly: !this.canInviteGroupMembers(group),
        acceptedMembers: group.membersAccepted,
        pendingMembers: group.membersPending,
        capacityTotal: group.capacityMax,
        metricIdentity: ActivityChatSingleRowConverter.smartListKeyForIdentity("groupSubEvent", memberOwnerId, memberOwnerId),
        onMembersChanged: (members) => this.syncGroupMembersFromPopup(stage.subEventId, group.id, members)
      });
      return;
    }
    this.resourcePopupStore.requestSubEventResourcePopup({
      type,
      ownerId: this.groupMemberOwnerId(stage.subEventId, group.id),
      parentTitle: this.state?.title ?? "",
      subEventId: stage.subEventId,
      popupHeader: {
        title: this.joinDistinctResourcePopupHeaderLabels([parentTitle, stageTitle, groupLabel]) || parentTitle || stageTitle || groupLabel || "Event",
        subtitle: ActivityResourceBuilder.assetRequestTimeframeLabel(`${stage.startAt ?? ""}`.trim(), `${stage.endAt ?? ""}`.trim()) || null
      },
      subEventHeader: {
        name: stage.title,
        title: stage.title,
        description: stage.description,
        location: stage.location,
        startAt: stage.startAt,
        endAt: stage.endAt
      },
      group: {
        id: group.id,
        groupLabel: group.name,
        source: group.source,
        accepted: group.membersAccepted,
        pending: group.membersPending,
        capacityMin: group.capacityMin,
        capacityMax: group.capacityMax,
        canManage: false
      }
    });
  }
  joinDistinctResourcePopupHeaderLabels(parts) {
    const seen = /* @__PURE__ */ new Set();
    const labels = [];
    for (const part of parts) {
      const value = `${part ?? ""}`.trim();
      const key = value.toLocaleLowerCase();
      if (!value || seen.has(key)) {
        continue;
      }
      seen.add(key);
      labels.push(value);
    }
    return labels.join(" - ");
  }
  syncGroupMembersFromPopup(stageId, groupId, members) {
    const acceptedMembers = members.filter((member) => member.status === "accepted");
    const pendingMembers = members.filter((member) => member.status === "pending");
    this.state = this.updateGroupCounts(this.state, stageId, groupId, acceptedMembers.length, pendingMembers.length);
    this.emitGroupsUpdate(stageId);
    void this.loadLeaderboardForStage(stageId);
    this.cdr.markForCheck();
  }
  syncGroupMemberSummaryFromSignal(memberOwnerId, accepted, pending) {
    const match = this.state?.stages.flatMap((stage) => stage.groups.map((group) => ({ stage, group }))).find(({ stage, group }) => group.id === memberOwnerId || `${group.memberOwnerId ?? ""}`.trim() === memberOwnerId || this.groupMemberOwnerId(stage.subEventId, group.id) === memberOwnerId) ?? null;
    if (!match) {
      return;
    }
    this.state = this.updateGroupCounts(this.state, match.stage.subEventId, match.group.id, Math.max(0, Math.trunc(Number(accepted) || 0)), Math.max(0, Math.trunc(Number(pending) || 0)));
    this.emitGroupsUpdate(match.stage.subEventId);
    this.cdr.markForCheck();
  }
  groupMemberOwnerId(stageId, groupId) {
    const ownerId = this.eventId();
    const normalizedStageId = this.normalizeId(stageId);
    const normalizedGroupId = this.normalizeId(groupId);
    return ownerId && normalizedStageId && normalizedGroupId ? `${ownerId}:${normalizedStageId}:${normalizedGroupId}` : normalizedGroupId;
  }
  groupResourceScope(ownerId, stageId) {
    const normalizedOwnerId = this.normalizeId(ownerId);
    const normalizedStageId = this.normalizeId(stageId);
    if (!normalizedOwnerId || !normalizedStageId) {
      return null;
    }
    const stage = this.stageById(normalizedStageId);
    const group = stage?.groups.find((item) => this.groupMemberOwnerId(normalizedStageId, item.id) === normalizedOwnerId) ?? null;
    return stage && group ? { stage, group } : null;
  }
  updateGroupCounts(state, stageId, groupId, accepted, pending) {
    if (!state) {
      return null;
    }
    return __spreadProps(__spreadValues({}, state), {
      stages: state.stages.map((stage) => stage.subEventId === stageId ? __spreadProps(__spreadValues({}, stage), {
        groups: stage.groups.map((group) => group.id === groupId ? __spreadProps(__spreadValues({}, group), {
          membersAccepted: Math.max(0, accepted),
          membersPending: Math.max(0, pending)
        }) : group)
      }) : stage)
    });
  }
  updateGroupResourceMetrics(state, stageId, groupId, metricsByType) {
    if (!state) {
      return null;
    }
    const resourceMetricsByType = Object.fromEntries(TOURNAMENT_RESOURCE_TYPES.map((type) => {
      const metric = metricsByType[type];
      return [type, {
        accepted: Math.max(0, Math.trunc(Number(metric?.accepted) || 0)),
        pending: Math.max(0, Math.trunc(Number(metric?.pending) || 0)),
        capacityMin: Math.max(0, Math.trunc(Number(metric?.capacityMin) || 0)),
        capacityMax: Math.max(0, Math.trunc(Number(metric?.capacityMax) || 0))
      }];
    }));
    return __spreadProps(__spreadValues({}, state), {
      stages: state.stages.map((stage) => stage.subEventId === stageId ? __spreadProps(__spreadValues({}, stage), {
        groups: stage.groups.map((group) => group.id === groupId ? __spreadProps(__spreadValues({}, group), { resourceMetricsByType }) : group)
      }) : stage)
    });
  }
  openEntryForm(stage, group, event) {
    event?.stopPropagation();
    if (!this.canManageGroups() || !this.canAddScoreToStage(stage)) {
      return;
    }
    const members = this.membersForGroup(group);
    this.entryForm = {
      groupId: group.id,
      memberId: members[0]?.id ?? "",
      scoreValue: null,
      homeMemberId: members[0]?.id ?? "",
      awayMemberId: members[1]?.id ?? members[0]?.id ?? "",
      homeScore: null,
      awayScore: null,
      note: ""
    };
    this.selectedStageId = stage.subEventId;
    this.selectedGroupId = group.id;
    this.openGroupIds = [group.id];
    this.showEntryForm = true;
  }
  nextGroupName(stage) {
    const index = stage.groups.length;
    return `Group ${String.fromCharCode(65 + index % 26)}`;
  }
  emptyGroupForm() {
    return {
      name: "",
      capacityMin: 4,
      capacityMax: 7
    };
  }
  emptyEntryForm() {
    return {
      groupId: "",
      memberId: "",
      scoreValue: null,
      homeMemberId: "",
      awayMemberId: "",
      homeScore: null,
      awayScore: null,
      note: ""
    };
  }
  resetState() {
    this.loadSequence += 1;
    this.leaderboardSequence += 1;
    this.state = null;
    this.selectedStageId = null;
    this.selectedGroupId = null;
    this.openGroupIds = [];
    this.isLoading = false;
    this.isMutating = false;
    this.loadError = "";
    this.leaderboardState = null;
    this.leaderboardLoading = false;
    this.groupTabs = {};
    this.detailMemberByGroupId = {};
    this.emittedStagePendingByKey.clear();
    this.showGroupForm = false;
    this.showEntryForm = false;
  }
  static \u0275fac = function EventTournamentGroupsPopupComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _EventTournamentGroupsPopupComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _EventTournamentGroupsPopupComponent, selectors: [["app-event-tournament-groups-popup"]], hostBindings: function EventTournamentGroupsPopupComponent_HostBindings(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275listener("keydown.escape", function EventTournamentGroupsPopupComponent_keydown_escape_HostBindingHandler($event) {
        return ctx.onEscape($event);
      }, \u0275\u0275resolveWindow);
    }
  }, decls: 1, vars: 1, consts: [["groupBodyTemplate", ""], [3, "model", "zIndex"], [1, "popup-body", "event-tournament-groups-body"], [1, "event-tournament-groups-loading"], [1, "event-tournament-groups-empty"], [1, "event-tournament-groups-accordion", 3, "model", "itemTemplate"], [3, "modelChange", "save", "cancel", "open", "title", "stageTitle", "model", "canSave", "invalidName", "saving"], ["kind", "load-ring", "state", "loading", "tone", "accent"], [1, "event-tournament-groups-accordion", 3, "itemToggle", "itemActionSelect", "model", "itemTemplate"], [1, "event-tournament-group-content"], ["aria-label", "Group view", 1, "event-tournament-group-tabs"], ["type", "button", 3, "click"], [1, "event-tournament-history"], [1, "event-tournament-table-wrap"], [1, "event-tournament-table", "event-tournament-table-score"], ["aria-hidden", "true"], ["data-motion", "none", "tabindex", "0", "role", "button", 3, "is-advance"], ["data-motion", "none", "tabindex", "0", "role", "button", 3, "click", "keydown.enter", "keydown.space"], [1, "event-tournament-table", "event-tournament-table-fifa"], [1, "event-tournament-history-empty"], [1, "event-tournament-table", "event-tournament-table-history", "event-tournament-table-score-history"], [1, "event-tournament-table", "event-tournament-table-history", "event-tournament-table-fifa-history"], [1, "event-tournament-entry-flow", 3, "ngModelChange", "model", "ngModel", "disabled"]], template: function EventTournamentGroupsPopupComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275conditionalCreate(0, EventTournamentGroupsPopupComponent_Conditional_0_Template, 10, 12);
    }
    if (rf & 2) {
      \u0275\u0275conditional(ctx.isOpen() ? 0 : -1);
    }
  }, dependencies: [
    CommonModule,
    FormsModule,
    NgControlStatus,
    NgModel,
    MatIconModule,
    MatIcon,
    AccordionComponent,
    FormFlowComponent,
    IndicatorComponent,
    PopupComponent,
    EventSubeventGroupFormPopupComponent,
    DatePipe
  ], styles: ['\n[_nghost-%COMP%] {\n  --interactive-motion-duration: 160ms;\n  --interactive-motion-ease: cubic-bezier(0.22, 1, 0.36, 1);\n  --interactive-hover-lift: -1px;\n  --interactive-hover-scale: 1.01;\n  --interactive-hover-brightness: 1.01;\n  --interactive-press-scale: 0.97;\n  --interactive-press-brightness: 0.97;\n}\n[_ngcontent-%COMP%]:where(button, a[href], [role=button], .link-btn, .popup-view-fab, .popup-header-add-btn, .activities-view-option, .profile-status-select-wrap, .profile-details-values-btn, .profile-details-privacy-btn, .profile-privacy-menu-option, .popup-close, .date-picker-btn, .avatar-edit-btn, .experience-form-close-btn, .image-editor-grid button, .image-stack-line, .image-stack-hit-segment, .mobile-profile-selector-close-btn, .mobile-profile-selector-option, .popup-panel-profile-selector .profile-filter-selector-clear, .popup-panel-profile-selector .profile-filter-selector-chip, .popup-panel-profile-selector .profile-selector-chip, .item-action-menu-btn, .experience-action-btn, .header-icon-btn, .chat-header-members, .activities-row-item-clickable, .activities-card-btn, .asset-source-icon, .event-editor-members-trigger, .motion-card, [data-motion=card]):not(.motion-static):not([data-motion=none]) {\n  -webkit-tap-highlight-color: transparent;\n  transition:\n    transform var(--interactive-motion-duration) var(--interactive-motion-ease),\n    filter var(--interactive-motion-duration) var(--interactive-motion-ease),\n    box-shadow var(--interactive-motion-duration) var(--interactive-motion-ease),\n    background-color var(--interactive-motion-duration) var(--interactive-motion-ease),\n    border-color var(--interactive-motion-duration) var(--interactive-motion-ease),\n    color var(--interactive-motion-duration) var(--interactive-motion-ease);\n  transform-origin: center;\n}\n[_ngcontent-%COMP%]:where(button, a[href], [role=button], .link-btn, .popup-view-fab, .popup-header-add-btn, .activities-view-option, .profile-status-select-wrap, .profile-details-values-btn, .profile-details-privacy-btn, .profile-privacy-menu-option, .popup-close, .date-picker-btn, .avatar-edit-btn, .experience-form-close-btn, .image-editor-grid button, .image-stack-line, .image-stack-hit-segment, .mobile-profile-selector-close-btn, .mobile-profile-selector-option, .popup-panel-profile-selector .profile-filter-selector-clear, .popup-panel-profile-selector .profile-filter-selector-chip, .popup-panel-profile-selector .profile-selector-chip, .item-action-menu-btn, .experience-action-btn, .header-icon-btn, .chat-header-members, .activities-row-item-clickable, .activities-card-btn, .asset-source-icon, .event-editor-members-trigger, .motion-card, [data-motion=card]):not(.motion-static):not([data-motion=none]):focus-visible {\n  outline: 2px solid rgba(66, 110, 182, 0.44);\n  outline-offset: 2px;\n}\n@media (hover: hover) and (pointer: fine) {\n  [_ngcontent-%COMP%]:where(button, a[href], [role=button], .link-btn, .popup-view-fab, .popup-header-add-btn, .activities-view-option, .profile-status-select-wrap, .profile-details-values-btn, .profile-details-privacy-btn, .profile-privacy-menu-option, .popup-close, .date-picker-btn, .avatar-edit-btn, .experience-form-close-btn, .image-editor-grid button, .image-stack-line, .image-stack-hit-segment, .mobile-profile-selector-close-btn, .mobile-profile-selector-option, .popup-panel-profile-selector .profile-filter-selector-clear, .popup-panel-profile-selector .profile-filter-selector-chip, .popup-panel-profile-selector .profile-selector-chip, .item-action-menu-btn, .experience-action-btn, .header-icon-btn, .chat-header-members, .activities-row-item-clickable, .activities-card-btn, .asset-source-icon, .event-editor-members-trigger, .motion-card, [data-motion=card]):not(.motion-static):not([data-motion=none]):not(:disabled):not([aria-disabled=true]):hover {\n    transform: translateY(var(--interactive-hover-lift)) scale(var(--interactive-hover-scale));\n    filter: brightness(var(--interactive-hover-brightness));\n  }\n  [_ngcontent-%COMP%]:where(button, a[href], [role=button], .link-btn, .popup-view-fab, .popup-header-add-btn, .activities-view-option, .profile-status-select-wrap, .profile-details-values-btn, .profile-details-privacy-btn, .profile-privacy-menu-option, .popup-close, .date-picker-btn, .avatar-edit-btn, .experience-form-close-btn, .image-editor-grid button, .image-stack-line, .image-stack-hit-segment, .mobile-profile-selector-close-btn, .mobile-profile-selector-option, .popup-panel-profile-selector .profile-filter-selector-clear, .popup-panel-profile-selector .profile-filter-selector-chip, .popup-panel-profile-selector .profile-selector-chip, .item-action-menu-btn, .experience-action-btn, .header-icon-btn, .chat-header-members, .activities-row-item-clickable, .activities-card-btn, .asset-source-icon, .event-editor-members-trigger, .motion-card, [data-motion=card]):not(.motion-static):not([data-motion=none]):not(:disabled):not([aria-disabled=true]):active {\n    transform: scale(var(--interactive-press-scale));\n    filter: brightness(var(--interactive-press-brightness));\n  }\n  [_ngcontent-%COMP%]:where(.motion-card, [data-motion=card]):not(.motion-static):not([data-motion=none]):hover {\n    box-shadow: 0 3px 10px rgba(16, 29, 48, 0.14);\n  }\n}\n@keyframes _ngcontent-%COMP%_shared-mobile-touch-feedback {\n  0% {\n    transform: scale(1);\n    filter: brightness(1);\n  }\n  45% {\n    transform: scale(var(--interactive-press-scale));\n    filter: brightness(var(--interactive-press-brightness));\n  }\n  100% {\n    transform: scale(1);\n    filter: brightness(1);\n  }\n}\n@media (hover: none), (pointer: coarse) {\n  [_ngcontent-%COMP%]:where(button, a[href], [role=button], .link-btn, .popup-view-fab, .popup-header-add-btn, .activities-view-option, .profile-status-select-wrap, .profile-details-values-btn, .profile-details-privacy-btn, .profile-privacy-menu-option, .popup-close, .date-picker-btn, .avatar-edit-btn, .experience-form-close-btn, .image-editor-grid button, .image-stack-line, .image-stack-hit-segment, .mobile-profile-selector-close-btn, .mobile-profile-selector-option, .popup-panel-profile-selector .profile-filter-selector-clear, .popup-panel-profile-selector .profile-filter-selector-chip, .popup-panel-profile-selector .profile-selector-chip, .item-action-menu-btn, .experience-action-btn, .header-icon-btn, .chat-header-members, .activities-row-item-clickable, .activities-card-btn, .asset-source-icon, .event-editor-members-trigger, .motion-card, [data-motion=card]):not(.motion-static):not([data-motion=none]):not(:disabled):not([aria-disabled=true]):active {\n    animation: _ngcontent-%COMP%_shared-mobile-touch-feedback 0.2s ease;\n  }\n}\n.app-popup[_ngcontent-%COMP%], \n.mobile-profile-selector-sheet-wrap[_ngcontent-%COMP%], \n.popup-surface[_ngcontent-%COMP%], \n.experience-form-popup[_ngcontent-%COMP%] {\n  font-family:\n    "Nunito Sans",\n    "Segoe UI",\n    sans-serif;\n}\n.app-popup[_ngcontent-%COMP%]   button[_ngcontent-%COMP%], \n.app-popup[_ngcontent-%COMP%]   input[_ngcontent-%COMP%], \n.app-popup[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%], \n.app-popup[_ngcontent-%COMP%]   select[_ngcontent-%COMP%], \n.app-popup[_ngcontent-%COMP%]   .mat-mdc-select[_ngcontent-%COMP%], \n.app-popup[_ngcontent-%COMP%]   .mat-mdc-select-value-text[_ngcontent-%COMP%], \n.app-popup[_ngcontent-%COMP%]   .mat-mdc-option[_ngcontent-%COMP%], \n.popup-surface[_ngcontent-%COMP%]   button[_ngcontent-%COMP%], \n.popup-surface[_ngcontent-%COMP%]   input[_ngcontent-%COMP%], \n.popup-surface[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%], \n.popup-surface[_ngcontent-%COMP%]   select[_ngcontent-%COMP%], \n.popup-surface[_ngcontent-%COMP%]   .mat-mdc-select[_ngcontent-%COMP%], \n.popup-surface[_ngcontent-%COMP%]   .mat-mdc-select-value-text[_ngcontent-%COMP%], \n.popup-surface[_ngcontent-%COMP%]   .mat-mdc-option[_ngcontent-%COMP%], \n.experience-form-popup[_ngcontent-%COMP%]   button[_ngcontent-%COMP%], \n.experience-form-popup[_ngcontent-%COMP%]   input[_ngcontent-%COMP%], \n.experience-form-popup[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%], \n.experience-form-popup[_ngcontent-%COMP%]   select[_ngcontent-%COMP%], \n.experience-form-popup[_ngcontent-%COMP%]   .mat-mdc-select[_ngcontent-%COMP%], \n.experience-form-popup[_ngcontent-%COMP%]   .mat-mdc-select-value-text[_ngcontent-%COMP%], \n.experience-form-popup[_ngcontent-%COMP%]   .mat-mdc-option[_ngcontent-%COMP%], \n.mobile-profile-selector-sheet-wrap[_ngcontent-%COMP%]   button[_ngcontent-%COMP%], \n.mobile-profile-selector-sheet-wrap[_ngcontent-%COMP%]   input[_ngcontent-%COMP%], \n.mobile-profile-selector-sheet-wrap[_ngcontent-%COMP%]   .mat-mdc-option[_ngcontent-%COMP%] {\n  font-family: inherit;\n}\n.popup-filter-picker[_ngcontent-%COMP%], \n.activities-view-picker[_ngcontent-%COMP%] {\n  position: relative;\n  z-index: 60;\n  margin-left: auto;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.34rem;\n}\n.popup-filter-picker-secondary[_ngcontent-%COMP%], \n.activities-secondary-picker[_ngcontent-%COMP%] {\n  position: relative;\n  z-index: 61;\n}\n.selector-like[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.35rem;\n}\n.profile-status-select-wrap.popup-compact-select[_ngcontent-%COMP%], \n.profile-status-select-wrap.activities-compact-select[_ngcontent-%COMP%], \n.profile-status-select-wrap.assets-compact-select[_ngcontent-%COMP%] {\n  width: fit-content !important;\n  min-width: 0 !important;\n  max-width: 100%;\n}\n.profile-status-select-wrap.popup-compact-select[_ngcontent-%COMP%]   .mat-mdc-select[_ngcontent-%COMP%], \n.profile-status-select-wrap.activities-compact-select[_ngcontent-%COMP%]   .mat-mdc-select[_ngcontent-%COMP%], \n.profile-status-select-wrap.assets-compact-select[_ngcontent-%COMP%]   .mat-mdc-select[_ngcontent-%COMP%] {\n  width: auto;\n  min-width: 0;\n}\n.profile-status-select-wrap.popup-compact-select[_ngcontent-%COMP%]   .mat-mdc-select-trigger[_ngcontent-%COMP%], \n.profile-status-select-wrap.activities-compact-select[_ngcontent-%COMP%]   .mat-mdc-select-trigger[_ngcontent-%COMP%], \n.profile-status-select-wrap.assets-compact-select[_ngcontent-%COMP%]   .mat-mdc-select-trigger[_ngcontent-%COMP%] {\n  width: auto !important;\n  min-width: 0;\n}\n.profile-status-select-wrap.popup-compact-select[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%], \n.profile-status-select-wrap.activities-compact-select[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%], \n.profile-status-select-wrap.assets-compact-select[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%] {\n  width: auto;\n  min-width: 0;\n}\n.profile-status-select-wrap.popup-filter-no-badge[_ngcontent-%COMP%], \n.profile-status-select-wrap.activities-filter-no-badge[_ngcontent-%COMP%] {\n  min-width: 0;\n}\n.profile-status-select-wrap.popup-filter-no-badge[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%], \n.profile-status-select-wrap.activities-filter-no-badge[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%] {\n  width: auto !important;\n  flex: 0 1 auto;\n}\n.profile-status-select-wrap.popup-filter-no-badge[_ngcontent-%COMP%]   .mat-mdc-select[_ngcontent-%COMP%], \n.profile-status-select-wrap.activities-filter-no-badge[_ngcontent-%COMP%]   .mat-mdc-select[_ngcontent-%COMP%] {\n  width: auto;\n  min-width: 0;\n}\n.profile-status-select-wrap.popup-filter-no-badge[_ngcontent-%COMP%]   .mat-mdc-select-trigger[_ngcontent-%COMP%], \n.profile-status-select-wrap.activities-filter-no-badge[_ngcontent-%COMP%]   .mat-mdc-select-trigger[_ngcontent-%COMP%] {\n  width: auto !important;\n}\n.profile-status-select-wrap.popup-filter-no-badge[_ngcontent-%COMP%]   .mat-mdc-select-arrow-wrapper[_ngcontent-%COMP%], \n.profile-status-select-wrap.activities-filter-no-badge[_ngcontent-%COMP%]   .mat-mdc-select-arrow-wrapper[_ngcontent-%COMP%] {\n  margin-left: 0.28rem;\n}\n.profile-status-select-wrap[_ngcontent-%COMP%] {\n  min-width: 174px;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.38rem;\n  border: 1px solid #c8d3e2;\n  border-radius: 999px;\n  box-shadow: 0 2px 6px rgba(38, 60, 92, 0.08);\n  padding: 0.12rem 0.5rem 0.12rem 0.84rem;\n  background: #f8f9fb;\n}\n.profile-status-select-wrap.selector-like[_ngcontent-%COMP%] {\n  min-height: 36px;\n}\n.status-option-content[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: flex-start;\n  gap: 0.2rem;\n  text-transform: lowercase;\n  width: 100%;\n  min-width: 0;\n}\n.status-option-content[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]:last-child {\n  white-space: nowrap;\n}\n.status-option-content[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n  line-height: 16px;\n  flex: 0 0 16px;\n}\n.rate-filter-count-badge[_ngcontent-%COMP%] {\n  margin-left: auto;\n  width: 20px;\n  height: 20px;\n  border-radius: 50%;\n  border: 1px solid #fff;\n  background: #d84d4d;\n  color: #fff;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  padding: 0;\n  font-size: 0.68rem;\n  font-weight: 800;\n  line-height: 1;\n  box-shadow: 0 2px 8px rgba(120, 24, 24, 0.22);\n}\n.rate-filter-trigger-badge[_ngcontent-%COMP%] {\n  position: absolute;\n  top: -8px;\n  right: -8px;\n  margin-left: 0;\n  z-index: 2;\n}\n.popup-filter-control[_ngcontent-%COMP%], \n.activities-rate-filter-select[_ngcontent-%COMP%], \n.activities-primary-filter-select[_ngcontent-%COMP%], \n.activities-event-scope-filter-select[_ngcontent-%COMP%], \n.activities-chat-context-filter-select[_ngcontent-%COMP%] {\n  position: relative;\n  overflow: visible;\n}\n.popup-filter-panel[_ngcontent-%COMP%], \n.activities-view-picker-panel[_ngcontent-%COMP%] {\n  position: absolute;\n  top: calc(100% + 0.32rem);\n  right: 0;\n  border: 1px solid rgba(39, 62, 94, 0.22);\n  border-radius: 10px;\n  background: #fff;\n  box-shadow: 0 10px 24px rgba(17, 29, 48, 0.22);\n  padding: 0.24rem;\n  min-width: 128px;\n  z-index: 40;\n  display: grid;\n  gap: 0.16rem;\n}\n.popup-filter-option[_ngcontent-%COMP%], \n.activities-view-option[_ngcontent-%COMP%] {\n  border: 0;\n  background: #fff;\n  border-radius: 8px;\n  min-height: 32px;\n  padding: 0.34rem 0.44rem;\n  display: inline-flex;\n  align-items: center;\n  justify-content: flex-start;\n  gap: 0.34rem;\n  color: #1e3658;\n  cursor: pointer;\n  text-align: left;\n}\n.popup-filter-option[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%], \n.activities-view-option[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n}\n.popup-filter-option[_ngcontent-%COMP%]   span[_ngcontent-%COMP%], \n.activities-view-option[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  font-size: 0.78rem;\n  font-weight: 700;\n}\n.popup-filter-option[_ngcontent-%COMP%]    > span[_ngcontent-%COMP%]:not(.rate-filter-count-badge), \n.activities-view-option[_ngcontent-%COMP%]    > span[_ngcontent-%COMP%]:not(.rate-filter-count-badge) {\n  flex: 1 1 auto;\n  min-width: 0;\n  text-align: left;\n}\n.popup-mobile-filter-picker[_ngcontent-%COMP%], \n.activities-mobile-primary-filter-picker[_ngcontent-%COMP%], \n.activities-mobile-event-scope-filter-picker[_ngcontent-%COMP%], \n.activities-mobile-chat-context-filter-picker[_ngcontent-%COMP%], \n.activities-mobile-rate-filter-picker[_ngcontent-%COMP%] {\n  position: relative;\n}\n.popup-mobile-filter-panel[_ngcontent-%COMP%], \n.activities-mobile-filter-panel[_ngcontent-%COMP%], \n.activities-mobile-rate-filter-panel[_ngcontent-%COMP%] {\n  top: calc(100% + 0.24rem);\n  right: 0;\n  min-width: 210px;\n  z-index: 65;\n}\n.popup-mobile-sheet-title[_ngcontent-%COMP%], \n.activities-mobile-sheet-title[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.28rem;\n  padding: 0 0.14rem;\n  color: #1c3354;\n  font-size: 0.94rem;\n  font-weight: 800;\n}\n.popup-mobile-sheet-title[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%], \n.activities-mobile-sheet-title[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 17px;\n  height: 17px;\n  font-size: 17px;\n  line-height: 17px;\n}\n:is(.popup-filter-bar[_ngcontent-%COMP%], .experience-toolbar[_ngcontent-%COMP%], .assets-toolbar[_ngcontent-%COMP%])   .popup-view-fab[_ngcontent-%COMP%]   span[_ngcontent-%COMP%], \n[_ngcontent-%COMP%]:is(.popup-filter-bar, .experience-toolbar, .assets-toolbar)   .profile-status-select-wrap[_ngcontent-%COMP%]   .mat-mdc-select[_ngcontent-%COMP%], \n[_ngcontent-%COMP%]:is(.popup-filter-bar, .experience-toolbar, .assets-toolbar)   .profile-status-select-wrap[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]:last-child, \n[_ngcontent-%COMP%]:is(.popup-filter-bar, .experience-toolbar, .assets-toolbar)   .profile-status-select-wrap[_ngcontent-%COMP%]   .mat-mdc-select-value-text[_ngcontent-%COMP%] {\n  font-weight: 400 !important;\n}\n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.status-option .status-option-content {\n  display: grid;\n  grid-template-columns: auto minmax(0, 1fr) auto;\n  align-items: center;\n  width: 100%;\n  min-width: 0;\n  column-gap: 0.34rem;\n}\n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.status-option .rate-filter-count-badge {\n  margin-left: 0;\n  justify-self: end;\n}\n[_nghost-%COMP%]     .cdk-overlay-pane:has(.mat-mdc-select-panel.selector-options-panel), \n[_nghost-%COMP%]     .cdk-overlay-pane:has(.mat-mdc-select-panel.status-options-panel) {\n  min-width: var(--app-selector-panel-min-width, 184px) !important;\n}\n[_nghost-%COMP%]     .mat-mdc-select-panel.selector-options-panel, \n[_nghost-%COMP%]     .mat-mdc-select-panel.status-options-panel {\n  min-width: var(--app-selector-panel-min-width, 184px) !important;\n}\n@media (max-width: 760px) {\n  .popup-mobile-filter-panel[_ngcontent-%COMP%]   .popup-filter-option[_ngcontent-%COMP%], \n   .popup-mobile-filter-panel[_ngcontent-%COMP%]   .activities-view-option[_ngcontent-%COMP%], \n   .activities-mobile-filter-panel[_ngcontent-%COMP%]   .popup-filter-option[_ngcontent-%COMP%], \n   .activities-mobile-filter-panel[_ngcontent-%COMP%]   .activities-view-option[_ngcontent-%COMP%], \n   .activities-mobile-rate-filter-panel[_ngcontent-%COMP%]   .popup-filter-option[_ngcontent-%COMP%], \n   .activities-mobile-rate-filter-panel[_ngcontent-%COMP%]   .activities-view-option[_ngcontent-%COMP%] {\n    width: 100%;\n    min-width: 0;\n    box-sizing: border-box;\n    border: 1px solid rgba(58, 81, 114, 0.24);\n    border-radius: 12px;\n    background: #f7f9fd;\n    min-height: 42px;\n    padding: 0.46rem 0.62rem;\n    justify-content: flex-start;\n    gap: 0.36rem;\n  }\n  .popup-mobile-filter-panel[_ngcontent-%COMP%]   .popup-filter-option.active[_ngcontent-%COMP%], \n   .popup-mobile-filter-panel[_ngcontent-%COMP%]   .activities-view-option.active[_ngcontent-%COMP%], \n   .activities-mobile-filter-panel[_ngcontent-%COMP%]   .popup-filter-option.active[_ngcontent-%COMP%], \n   .activities-mobile-filter-panel[_ngcontent-%COMP%]   .activities-view-option.active[_ngcontent-%COMP%], \n   .activities-mobile-rate-filter-panel[_ngcontent-%COMP%]   .popup-filter-option.active[_ngcontent-%COMP%], \n   .activities-mobile-rate-filter-panel[_ngcontent-%COMP%]   .activities-view-option.active[_ngcontent-%COMP%] {\n    box-shadow: inset 0 0 0 1px rgba(24, 46, 76, 0.24);\n    filter: brightness(0.95);\n  }\n  .popup-mobile-filter-panel[_ngcontent-%COMP%]   .popup-filter-option[_ngcontent-%COMP%]   .rate-filter-count-badge[_ngcontent-%COMP%], \n   .popup-mobile-filter-panel[_ngcontent-%COMP%]   .activities-view-option[_ngcontent-%COMP%]   .rate-filter-count-badge[_ngcontent-%COMP%], \n   .activities-mobile-filter-panel[_ngcontent-%COMP%]   .popup-filter-option[_ngcontent-%COMP%]   .rate-filter-count-badge[_ngcontent-%COMP%], \n   .activities-mobile-filter-panel[_ngcontent-%COMP%]   .activities-view-option[_ngcontent-%COMP%]   .rate-filter-count-badge[_ngcontent-%COMP%], \n   .activities-mobile-rate-filter-panel[_ngcontent-%COMP%]   .popup-filter-option[_ngcontent-%COMP%]   .rate-filter-count-badge[_ngcontent-%COMP%], \n   .activities-mobile-rate-filter-panel[_ngcontent-%COMP%]   .activities-view-option[_ngcontent-%COMP%]   .rate-filter-count-badge[_ngcontent-%COMP%] {\n    margin-left: auto;\n    flex: 0 0 auto;\n  }\n  [_nghost-%COMP%]     .cdk-overlay-pane:has(.mat-mdc-select-panel.profile-bottom-sheet-panel) {\n    position: fixed !important;\n    left: 0 !important;\n    right: 0 !important;\n    bottom: 0 !important;\n    top: auto !important;\n    width: 100vw !important;\n    max-width: 100vw !important;\n    transform: none !important;\n  }\n  [_nghost-%COMP%]     .mat-mdc-select-panel.profile-bottom-sheet-panel {\n    width: 100vw !important;\n    max-width: 100vw !important;\n    max-height: min(54vh, 420px) !important;\n    margin: 0 !important;\n    border-radius: 16px 16px 0 0 !important;\n    border: 1px solid #d6deea;\n    border-bottom: 0;\n    box-shadow: 0 -14px 28px rgba(15, 29, 52, 0.24);\n    padding-top: 0.38rem;\n    padding-bottom: max(0.55rem, env(safe-area-inset-bottom));\n  }\n}\n.popup-view-fab[_ngcontent-%COMP%] {\n  height: 34px;\n  border: 1px solid rgba(39, 62, 94, 0.22);\n  border-radius: 999px;\n  background: #f3f7ff;\n  color: #2c4c74;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.25rem;\n  padding: 0 0.62rem;\n  cursor: pointer;\n}\n.popup-view-fab[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n}\n.popup-view-fab[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  font-size: 0.74rem;\n  font-weight: 700;\n  white-space: nowrap;\n}\n.event-visibility-picker[_ngcontent-%COMP%] {\n  position: relative;\n  z-index: 22;\n  margin-left: auto;\n  flex: 0 0 auto;\n}\n.event-visibility-trigger[_ngcontent-%COMP%] {\n  flex-wrap: nowrap;\n}\n.profile-status-header-picker[_ngcontent-%COMP%]   .event-visibility-trigger.status-public[_ngcontent-%COMP%], \n.profile-status-header-picker[_ngcontent-%COMP%]   .activities-view-option.status-public[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #e6f6ef);\n}\n.profile-status-header-picker[_ngcontent-%COMP%]   .event-visibility-trigger.status-friends[_ngcontent-%COMP%], \n.profile-status-header-picker[_ngcontent-%COMP%]   .activities-view-option.status-friends[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #e8f1fd);\n}\n.profile-status-header-picker[_ngcontent-%COMP%]   .event-visibility-trigger.status-host[_ngcontent-%COMP%], \n.profile-status-header-picker[_ngcontent-%COMP%]   .activities-view-option.status-host[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #f6efe2);\n}\n.profile-status-header-picker[_ngcontent-%COMP%]   .event-visibility-trigger.status-inactive[_ngcontent-%COMP%], \n.profile-status-header-picker[_ngcontent-%COMP%]   .activities-view-option.status-inactive[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #f2f3f5);\n}\n.profile-status-header-picker[_ngcontent-%COMP%]   .event-visibility-trigger[_ngcontent-%COMP%]   .mat-icon.status-public[_ngcontent-%COMP%], \n.profile-status-header-picker[_ngcontent-%COMP%]   .activities-view-option.status-public[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #2f8f66;\n}\n.profile-status-header-picker[_ngcontent-%COMP%]   .event-visibility-trigger[_ngcontent-%COMP%]   .mat-icon.status-friends[_ngcontent-%COMP%], \n.profile-status-header-picker[_ngcontent-%COMP%]   .activities-view-option.status-friends[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #1b57a1;\n}\n.profile-status-header-picker[_ngcontent-%COMP%]   .event-visibility-trigger[_ngcontent-%COMP%]   .mat-icon.status-host[_ngcontent-%COMP%], \n.profile-status-header-picker[_ngcontent-%COMP%]   .activities-view-option.status-host[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #87580f;\n}\n.profile-status-header-picker[_ngcontent-%COMP%]   .event-visibility-trigger[_ngcontent-%COMP%]   .mat-icon.status-inactive[_ngcontent-%COMP%], \n.profile-status-header-picker[_ngcontent-%COMP%]   .activities-view-option.status-inactive[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #5b6573;\n}\n.app-popup[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%], \n.app-popup[_ngcontent-%COMP%]   input[_ngcontent-%COMP%], \n.app-popup[_ngcontent-%COMP%]   select[_ngcontent-%COMP%], \n.popup-surface[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%], \n.popup-surface[_ngcontent-%COMP%]   input[_ngcontent-%COMP%], \n.popup-surface[_ngcontent-%COMP%]   select[_ngcontent-%COMP%], \n.experience-form-popup[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%], \n.experience-form-popup[_ngcontent-%COMP%]   input[_ngcontent-%COMP%], \n.experience-form-popup[_ngcontent-%COMP%]   select[_ngcontent-%COMP%], \n.mobile-profile-selector-sheet-wrap[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  width: 100%;\n  border: 1px solid rgba(15, 27, 47, 0.16);\n  border-radius: 10px;\n  padding: 0.48rem 0.56rem;\n  font: inherit;\n  color: var(--text-main);\n  background: #fff;\n}\n.app-popup[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%], \n.popup-surface[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%], \n.experience-form-popup[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%] {\n  resize: vertical;\n}\n.app-popup[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%]:focus, \n.app-popup[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]:focus, \n.app-popup[_ngcontent-%COMP%]   select[_ngcontent-%COMP%]:focus, \n.popup-surface[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%]:focus, \n.popup-surface[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]:focus, \n.popup-surface[_ngcontent-%COMP%]   select[_ngcontent-%COMP%]:focus, \n.experience-form-popup[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%]:focus, \n.experience-form-popup[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]:focus, \n.experience-form-popup[_ngcontent-%COMP%]   select[_ngcontent-%COMP%]:focus, \n.mobile-profile-selector-sheet-wrap[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]:focus {\n  outline: 0;\n  border-color: rgba(52, 103, 182, 0.72);\n  box-shadow: 0 0 0 3px rgba(55, 116, 212, 0.14);\n}\n.popup-surface-form-grid[_ngcontent-%COMP%], \n.experience-form-grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n  max-width: none;\n  width: 100%;\n  margin: 0;\n  justify-content: stretch;\n  align-content: start;\n  align-items: start;\n  column-gap: 1rem;\n  row-gap: 0.9rem;\n}\n.popup-surface-form-grid[_ngcontent-%COMP%]   label[_ngcontent-%COMP%], \n.experience-form-grid[_ngcontent-%COMP%]   label[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-rows: min-content;\n  gap: 0;\n  font-weight: 600;\n  color: rgba(26, 44, 69, 0.88);\n}\n.popup-surface-form-grid[_ngcontent-%COMP%]   input[_ngcontent-%COMP%], \n.experience-form-grid[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  min-height: 40px;\n  padding: 0.56rem 0.72rem;\n  font-size: 0.88rem;\n  line-height: 1.25;\n  box-sizing: border-box;\n}\n.popup-surface-form-grid[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%], \n.experience-form-grid[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%] {\n  min-height: 96px;\n  padding: 0.56rem 0.72rem;\n  font-size: 0.88rem;\n  line-height: 1.25;\n  box-sizing: border-box;\n}\n.popup-surface-form-grid[_ngcontent-%COMP%]   .profile-status-select-wrap.selector-like[_ngcontent-%COMP%], \n.experience-form-grid[_ngcontent-%COMP%]   .profile-status-select-wrap.selector-like[_ngcontent-%COMP%] {\n  min-height: 40px;\n  height: 40px;\n  box-sizing: border-box;\n}\n.popup-surface-form-grid[_ngcontent-%COMP%]   .mat-mdc-select-trigger[_ngcontent-%COMP%], \n.experience-form-grid[_ngcontent-%COMP%]   .mat-mdc-select-trigger[_ngcontent-%COMP%] {\n  min-height: 32px;\n}\n.popup-surface-description-field[_ngcontent-%COMP%], \n.experience-description-field[_ngcontent-%COMP%] {\n  grid-column: 1/-1;\n}\n.popup-surface-actions[_ngcontent-%COMP%], \n.experience-form-actions[_ngcontent-%COMP%] {\n  justify-content: center;\n  padding-top: 0.2rem;\n}\n.popup-actions[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 0.45rem;\n  flex-wrap: wrap;\n}\n.link-btn[_ngcontent-%COMP%] {\n  border: 1px solid var(--line-strong);\n  border-radius: 999px;\n  background: #fff;\n  color: #1f3350;\n  font: inherit;\n  font-size: 0.83rem;\n  padding: 0.38rem 0.76rem;\n  cursor: pointer;\n}\n.neutral-btn[_ngcontent-%COMP%] {\n  background: #f2f4fa;\n  border-color: rgba(23, 33, 54, 0.12);\n}\n.primary-btn[_ngcontent-%COMP%] {\n  background: #4776b7;\n  border-color: #4776b7;\n  color: #fff;\n}\n.profile-status-select-wrap[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%], \n.date-picker-btn[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n  line-height: 16px;\n  color: #566b86;\n}\n.profile-status-select-wrap[_ngcontent-%COMP%]   .mat-mdc-select[_ngcontent-%COMP%] {\n  min-width: 80px;\n  width: 100%;\n  font-size: 0.8rem;\n  font-weight: 700;\n  text-transform: lowercase;\n}\n.profile-status-select-wrap[_ngcontent-%COMP%]   .mat-mdc-select-trigger[_ngcontent-%COMP%] {\n  width: 100%;\n  justify-content: flex-start;\n}\n.profile-status-select-wrap[_ngcontent-%COMP%]   .mat-mdc-select-arrow-wrapper[_ngcontent-%COMP%] {\n  margin-left: auto;\n}\n.status-public[_ngcontent-%COMP%] {\n  color: #2f8f66;\n}\n.status-friends[_ngcontent-%COMP%] {\n  color: #1b57a1;\n}\n.status-host[_ngcontent-%COMP%] {\n  color: #87580f;\n}\n.status-inactive[_ngcontent-%COMP%] {\n  color: #5b6573;\n}\n.status-option-content[_ngcontent-%COMP%]   .status-public[_ngcontent-%COMP%] {\n  color: #2f8f66;\n}\n.status-option-content[_ngcontent-%COMP%]   .status-friends[_ngcontent-%COMP%] {\n  color: #1b57a1;\n}\n.status-option-content[_ngcontent-%COMP%]   .status-host[_ngcontent-%COMP%] {\n  color: #87580f;\n}\n.status-option-content[_ngcontent-%COMP%]   .status-inactive[_ngcontent-%COMP%] {\n  color: #5b6573;\n}\n.profile-status-select-wrap.status-public[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #2f8f66;\n}\n.profile-status-select-wrap.status-friends[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #1b57a1;\n}\n.profile-status-select-wrap.status-host[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #87580f;\n}\n.profile-status-select-wrap.status-inactive[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #5b6573;\n}\n.profile-details-values-btn[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n  line-height: 16px;\n  color: rgba(44, 67, 100, 0.72);\n}\n.profile-details-values-btn[_ngcontent-%COMP%] {\n  min-height: 36px;\n  height: 36px;\n  box-sizing: border-box;\n  padding-top: 0;\n  padding-bottom: 0;\n}\n.profile-details-values-btn[_ngcontent-%COMP%]   .status-option-content.profile-details-selected-badges[_ngcontent-%COMP%] {\n  display: inline-grid;\n  grid-template-columns: minmax(0, 1fr) auto;\n  align-items: center;\n  column-gap: 0.26rem;\n  min-width: 0;\n  width: 100%;\n}\n.profile-details-values-btn.profile-details-values-tone-values[_ngcontent-%COMP%]   .profile-details-inline-chip[_ngcontent-%COMP%] {\n  max-width: calc(100% - 2.6rem);\n}\n.profile-details-values-btn.profile-details-values-tone-interest[_ngcontent-%COMP%]   .profile-details-inline-chip[_ngcontent-%COMP%] {\n  max-width: calc((100% - 3.2rem) / 2);\n}\n.profile-details-values-btn.profile-details-values-tone-values[_ngcontent-%COMP%]   .profile-details-inline-overflow[_ngcontent-%COMP%] {\n  color: #1e6b5a;\n}\n.profile-details-values-btn.profile-details-values-tone-interest[_ngcontent-%COMP%]   .profile-details-inline-overflow[_ngcontent-%COMP%] {\n  color: #2e5a90;\n}\n.values-header-chips[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  flex-wrap: wrap;\n  gap: 0.28rem;\n  flex: 0 0 100%;\n  margin-left: 0;\n  margin-top: 0.34rem;\n  max-width: 100%;\n  overflow: visible;\n  white-space: normal;\n  padding-bottom: 0;\n}\n.popup-title-values[_ngcontent-%COMP%] {\n  margin-right: 0.38rem;\n}\n.values-selected-chip[_ngcontent-%COMP%] {\n  border: 1px solid rgba(76, 99, 136, 0.3);\n  background:\n    linear-gradient(\n      180deg,\n      #f7f9ff 0%,\n      #eef3ff 100%);\n  color: #24416a;\n  border-radius: 999px;\n  min-height: 26px;\n  padding: 0.18rem 0.46rem;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.26rem;\n  font-size: 0.7rem;\n  font-weight: 700;\n  cursor: pointer;\n  flex: 0 0 auto;\n}\n.values-selected-chip[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 12px;\n  height: 12px;\n  font-size: 12px;\n  line-height: 12px;\n}\n.values-selected-chip.section-family[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #fff1ea 0%,\n      #ffe6dd 100%);\n  border-color: rgba(160, 90, 51, 0.32);\n  color: #8b4d2b;\n}\n.values-selected-chip.section-ambition[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #fff7e8 0%,\n      #ffefd7 100%);\n  border-color: rgba(160, 106, 20, 0.32);\n  color: #9a6614;\n}\n.values-selected-chip.section-lifestyle[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #eaf8f5 0%,\n      #e0f2ee 100%);\n  border-color: rgba(45, 125, 120, 0.32);\n  color: #2a6e6a;\n}\n.values-selected-chip.section-beliefs[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f0ecff 0%,\n      #e8e1fa 100%);\n  border-color: rgba(95, 78, 160, 0.32);\n  color: #564793;\n}\n.values-selected-chip.section-social[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #ecf4ff 0%,\n      #e1ecfb 100%);\n  border-color: rgba(45, 94, 168, 0.32);\n  color: #2d5ea8;\n}\n.values-selected-chip.section-arts[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f2edfb 0%,\n      #e9e2f9 100%);\n  border-color: rgba(103, 76, 164, 0.32);\n  color: #654ca1;\n}\n.values-selected-chip.section-food[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #fff4e8 0%,\n      #fee9d6 100%);\n  border-color: rgba(170, 97, 28, 0.32);\n  color: #9d611c;\n}\n.values-selected-chip.section-active[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #edf8ee 0%,\n      #e2f1e4 100%);\n  border-color: rgba(44, 126, 72, 0.32);\n  color: #2d7d47;\n}\n.values-selected-chip.section-mind[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #eaf8f6 0%,\n      #def1ee 100%);\n  border-color: rgba(37, 124, 118, 0.32);\n  color: #2d7d78;\n}\n.values-selected-chip.section-identity[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f4f0ff 0%,\n      #e9e3fb 100%);\n  border-color: rgba(88, 78, 159, 0.32);\n  color: #5a4ea0;\n}\n.readonly-select[_ngcontent-%COMP%] {\n  width: fit-content;\n  min-width: 0;\n  max-width: 130px;\n  justify-content: center;\n  margin-top: 2px;\n  padding-left: 0.44rem;\n  padding-right: 0.44rem;\n}\n.readonly-field[_ngcontent-%COMP%] {\n  min-height: 34px;\n  border: 1px solid rgba(15, 27, 47, 0.16);\n  border-radius: 10px;\n  padding: 0.4rem 0.56rem;\n  background: #f7fafe;\n  color: #23476f;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.26rem;\n  font-weight: 700;\n}\n.readonly-field[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n  line-height: 16px;\n}\n.zodiac-symbol[_ngcontent-%COMP%] {\n  font-size: 1.1rem;\n  font-weight: 800;\n  line-height: 1;\n}\n.zodiac-label[_ngcontent-%COMP%] {\n  font-size: 0.9rem;\n  font-weight: 700;\n  min-width: 0;\n  text-align: center;\n}\n.readonly-select.zodiac-aries[_ngcontent-%COMP%] {\n  background: #fdf1f1;\n  color: #9f2f2f;\n}\n.readonly-select.zodiac-taurus[_ngcontent-%COMP%] {\n  background: #f7f3eb;\n  color: #6e4b2b;\n}\n.readonly-select.zodiac-gemini[_ngcontent-%COMP%] {\n  background: #fdf8e9;\n  color: #7d5a12;\n}\n.readonly-select.zodiac-cancer[_ngcontent-%COMP%] {\n  background: #eef4ff;\n  color: #2d5b8e;\n}\n.readonly-select.zodiac-leo[_ngcontent-%COMP%] {\n  background: #fff3e8;\n  color: #8f4b0d;\n}\n.readonly-select.zodiac-virgo[_ngcontent-%COMP%] {\n  background: #edf8ef;\n  color: #2b6b3d;\n}\n.readonly-select.zodiac-libra[_ngcontent-%COMP%] {\n  background: #f2eefc;\n  color: #60439d;\n}\n.readonly-select.zodiac-scorpio[_ngcontent-%COMP%] {\n  background: #f9edf2;\n  color: #7b3150;\n}\n.readonly-select.zodiac-sagittarius[_ngcontent-%COMP%] {\n  background: #eef1ff;\n  color: #2f4a9a;\n}\n.readonly-select.zodiac-capricorn[_ngcontent-%COMP%] {\n  background: #eff2f5;\n  color: #364653;\n}\n.readonly-select.zodiac-aquarius[_ngcontent-%COMP%] {\n  background: #ebf7fb;\n  color: #1d5f7a;\n}\n.readonly-select.zodiac-pisces[_ngcontent-%COMP%] {\n  background: #eef2ff;\n  color: #294b8f;\n}\n.physique-slim[_ngcontent-%COMP%] {\n  color: #3f7ab3;\n}\n.physique-lean[_ngcontent-%COMP%] {\n  color: #3f8f5f;\n}\n.physique-athletic[_ngcontent-%COMP%] {\n  color: #2f7e4d;\n}\n.physique-fit[_ngcontent-%COMP%] {\n  color: #465fbb;\n}\n.physique-curvy[_ngcontent-%COMP%] {\n  color: #a14875;\n}\n.physique-muscular[_ngcontent-%COMP%] {\n  color: #7d4f24;\n}\n.physique-average[_ngcontent-%COMP%] {\n  color: #4d667f;\n}\n.physique-select-wrap.physique-slim[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #eaf3fb 0%,\n      #dfebf8 100%);\n  border-color: rgba(63, 122, 179, 0.34);\n}\n.physique-select-wrap.physique-lean[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #eaf6ee 0%,\n      #def0e5 100%);\n  border-color: rgba(63, 143, 95, 0.34);\n}\n.physique-select-wrap.physique-athletic[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #e8f5ec 0%,\n      #dff0e6 100%);\n  border-color: rgba(47, 126, 77, 0.34);\n}\n.physique-select-wrap.physique-fit[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #ebf0ff 0%,\n      #e1e8fc 100%);\n  border-color: rgba(70, 95, 187, 0.34);\n}\n.physique-select-wrap.physique-curvy[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f7edf3 0%,\n      #f0e3ec 100%);\n  border-color: rgba(161, 72, 117, 0.36);\n}\n.physique-select-wrap.physique-muscular[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f6efe9 0%,\n      #ede3d8 100%);\n  border-color: rgba(125, 79, 36, 0.36);\n}\n.physique-select-wrap.physique-average[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #eef2f6 0%,\n      #e5ebf1 100%);\n  border-color: rgba(77, 102, 127, 0.34);\n}\n.physique-select-wrap.physique-slim[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #3f7ab3;\n}\n.physique-select-wrap.physique-lean[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #3f8f5f;\n}\n.physique-select-wrap.physique-athletic[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #2f7e4d;\n}\n.physique-select-wrap.physique-fit[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #465fbb;\n}\n.physique-select-wrap.physique-curvy[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #a14875;\n}\n.physique-select-wrap.physique-muscular[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #7d4f24;\n}\n.physique-select-wrap.physique-average[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #4d667f;\n}\n.experience-filter-all[_ngcontent-%COMP%] {\n  color: #694ea6;\n}\n.experience-filter-workspace[_ngcontent-%COMP%] {\n  color: #a1485a;\n}\n.experience-filter-school[_ngcontent-%COMP%] {\n  color: #2d5ea8;\n}\n.experience-filter-online[_ngcontent-%COMP%] {\n  color: #2d7d47;\n}\n.experience-filter-project[_ngcontent-%COMP%] {\n  color: #6550a0;\n}\n.experience-filter-select.experience-filter-all[_ngcontent-%COMP%], \n.experience-type-select.experience-filter-project[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #efe8ff 0%,\n      #e8defc 100%);\n  border-color: rgba(103, 76, 164, 0.32);\n}\n.experience-filter-select.experience-filter-workspace[_ngcontent-%COMP%], \n.experience-type-select.experience-filter-workspace[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #fff1f3 0%,\n      #ffe6ea 100%);\n  border-color: rgba(169, 72, 90, 0.32);\n}\n.experience-filter-select.experience-filter-school[_ngcontent-%COMP%], \n.experience-type-select.experience-filter-school[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #eaf4ff 0%,\n      #e1ecfb 100%);\n  border-color: rgba(45, 94, 168, 0.32);\n}\n.experience-type-select.experience-filter-online[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #edf8ee 0%,\n      #e2f1e4 100%);\n  border-color: rgba(44, 126, 72, 0.32);\n}\n.experience-type-select.experience-filter-project[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f4f0ff 0%,\n      #e9e3fb 100%);\n}\n.experience-type-select[_ngcontent-%COMP%] {\n  min-width: 0;\n  max-width: 100%;\n  min-height: 40px;\n}\n.experience-type-field[_ngcontent-%COMP%], \n.experience-title-field[_ngcontent-%COMP%], \n.experience-city-field[_ngcontent-%COMP%] {\n  width: 100%;\n  justify-self: stretch;\n}\n.experience-org-field[_ngcontent-%COMP%] {\n  width: 100%;\n  justify-self: stretch;\n}\n.experience-type-select[_ngcontent-%COMP%] {\n  width: 100%;\n}\n.experience-date-range-field[_ngcontent-%COMP%] {\n  width: 100%;\n  max-width: none;\n  margin: 0;\n  background: transparent;\n}\n.experience-date-range-label[_ngcontent-%COMP%] {\n  grid-column: 1/2;\n  width: 100%;\n  justify-self: stretch;\n}\n.experience-date-range-field[_ngcontent-%COMP%]   .mat-mdc-text-field-wrapper[_ngcontent-%COMP%] {\n  min-height: 42px;\n  border-radius: 10px;\n  background: #fff;\n  border: 1px solid rgba(136, 156, 186, 0.5);\n  box-shadow: none;\n}\n.experience-date-range-field[_ngcontent-%COMP%]   .mat-mdc-form-field-subscript-wrapper[_ngcontent-%COMP%] {\n  margin-top: 0.24rem;\n}\n.experience-date-range-field[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  border: 0 !important;\n  box-shadow: none !important;\n  border-radius: 0 !important;\n  background: transparent !important;\n  min-width: 0;\n  width: 100%;\n  padding: 0 !important;\n  min-height: 0 !important;\n  height: auto !important;\n  line-height: 1.25;\n}\n.experience-date-range-field[_ngcontent-%COMP%]   .mat-datepicker-toggle[_ngcontent-%COMP%] {\n  margin-right: 0.2rem;\n}\n.experience-date-range-field[_ngcontent-%COMP%]   .mat-mdc-form-field-hint-wrapper[_ngcontent-%COMP%], \n.experience-date-range-field[_ngcontent-%COMP%]   .mat-mdc-form-field-hint[_ngcontent-%COMP%] {\n  color: rgba(30, 49, 74, 0.65);\n  font-size: 0.72rem;\n}\n.experience-date-range-field[_ngcontent-%COMP%]   .mat-date-range-input-container[_ngcontent-%COMP%] {\n  width: 100%;\n  display: grid;\n  grid-template-columns: minmax(96px, 1fr) auto minmax(96px, 1fr);\n  align-items: center;\n  column-gap: 0.34rem;\n  min-width: 0;\n}\n.experience-date-range-field[_ngcontent-%COMP%]   .mat-date-range-input-separator[_ngcontent-%COMP%] {\n  margin: 0 0.28rem;\n  flex: 0 0 auto;\n  white-space: nowrap;\n}\n.experience-date-range-field[_ngcontent-%COMP%]   .mat-date-range-input-start-wrapper[_ngcontent-%COMP%], \n.experience-date-range-field[_ngcontent-%COMP%]   .mat-date-range-input-end-wrapper[_ngcontent-%COMP%] {\n  width: 100%;\n  max-width: 100%;\n  overflow: visible;\n  min-width: 0;\n}\n.experience-date-range-field[_ngcontent-%COMP%]   .mat-date-range-input-inner[_ngcontent-%COMP%] {\n  font-size: 0.96rem;\n  min-width: 0 !important;\n  width: 100% !important;\n  text-overflow: clip;\n  white-space: nowrap;\n  line-height: 1.25;\n}\n.experience-date-range-field[_ngcontent-%COMP%]   .mat-mdc-form-field-flex[_ngcontent-%COMP%] {\n  min-width: 0;\n  border-bottom: 0 !important;\n  box-shadow: none !important;\n  align-items: center !important;\n}\n.experience-date-range-field[_ngcontent-%COMP%]   .mat-mdc-form-field-infix[_ngcontent-%COMP%] {\n  padding-top: 0 !important;\n  padding-bottom: 0 !important;\n  min-height: 34px !important;\n  height: 34px;\n  display: flex;\n  align-items: center;\n}\n.experience-date-range-field[_ngcontent-%COMP%]   .mdc-line-ripple[_ngcontent-%COMP%], \n.experience-date-range-field[_ngcontent-%COMP%]   .mat-mdc-form-field-line-ripple[_ngcontent-%COMP%], \n.experience-date-range-field[_ngcontent-%COMP%]   .mdc-line-ripple--deactivating[_ngcontent-%COMP%], \n.experience-date-range-field[_ngcontent-%COMP%]   .mdc-line-ripple--active[_ngcontent-%COMP%] {\n  display: none !important;\n  opacity: 0 !important;\n  transform: scaleX(0) !important;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.experience-filter-all {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #efe8ff);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.experience-filter-workspace {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #fff1f3);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.experience-filter-school {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #eaf4ff);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.experience-filter-online {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #edf8ee);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.experience-filter-project {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #f4f0ff);\n}\n.mobile-profile-language-chip.language-tone-1[_ngcontent-%COMP%], \n.mobile-profile-selector-option.language-tone-1[_ngcontent-%COMP%], \n[_nghost-%COMP%]     .mat-mdc-option.language-tone-1 {\n  background: #eaf4ff;\n  border-color: rgba(63, 122, 179, 0.34);\n  color: #2f6090;\n}\n.mobile-profile-language-chip.language-tone-2[_ngcontent-%COMP%], \n.mobile-profile-selector-option.language-tone-2[_ngcontent-%COMP%], \n[_nghost-%COMP%]     .mat-mdc-option.language-tone-2 {\n  background: #edf8f4;\n  border-color: rgba(75, 127, 113, 0.34);\n  color: #2f695b;\n}\n.mobile-profile-language-chip.language-tone-3[_ngcontent-%COMP%], \n.mobile-profile-selector-option.language-tone-3[_ngcontent-%COMP%], \n[_nghost-%COMP%]     .mat-mdc-option.language-tone-3 {\n  background: #f1f2ff;\n  border-color: rgba(70, 95, 187, 0.34);\n  color: #394f9c;\n}\n.mobile-profile-language-chip.language-tone-4[_ngcontent-%COMP%], \n.mobile-profile-selector-option.language-tone-4[_ngcontent-%COMP%], \n[_nghost-%COMP%]     .mat-mdc-option.language-tone-4 {\n  background: #fff2f8;\n  border-color: rgba(161, 72, 117, 0.34);\n  color: #8d3f66;\n}\n.mobile-profile-language-chip.language-tone-5[_ngcontent-%COMP%], \n.mobile-profile-selector-option.language-tone-5[_ngcontent-%COMP%], \n[_nghost-%COMP%]     .mat-mdc-option.language-tone-5 {\n  background: #fbf4ea;\n  border-color: rgba(125, 79, 36, 0.34);\n  color: #704822;\n}\n.mobile-profile-language-chip.language-tone-6[_ngcontent-%COMP%], \n.mobile-profile-selector-option.language-tone-6[_ngcontent-%COMP%], \n[_nghost-%COMP%]     .mat-mdc-option.language-tone-6 {\n  background: #eff4f9;\n  border-color: rgba(77, 102, 127, 0.34);\n  color: #415872;\n}\n.mobile-profile-language-chip.language-tone-7[_ngcontent-%COMP%], \n.mobile-profile-selector-option.language-tone-7[_ngcontent-%COMP%], \n[_nghost-%COMP%]     .mat-mdc-option.language-tone-7 {\n  background: #f7f5ea;\n  border-color: rgba(128, 109, 66, 0.34);\n  color: #746237;\n}\n.mobile-profile-language-chip.language-tone-8[_ngcontent-%COMP%], \n.mobile-profile-selector-option.language-tone-8[_ngcontent-%COMP%], \n[_nghost-%COMP%]     .mat-mdc-option.language-tone-8 {\n  background: #edf5ff;\n  border-color: rgba(45, 122, 160, 0.34);\n  color: #2f6782;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-1 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #eaf2ff);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-2 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #ebf7ef);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-3 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #fff1e3);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-4 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #efecfc);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-5 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #f3f8e9);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-6 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #fceef3);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-7 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #edf7ff);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-8 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #f6f2e9);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-1 .status-option-content {\n  color: #2d63a9;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-2 .status-option-content {\n  color: #2a7a49;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-3 .status-option-content {\n  color: #9b6018;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-4 .status-option-content {\n  color: #6153a2;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-5 .status-option-content {\n  color: #61812a;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-6 .status-option-content {\n  color: #9f446d;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-7 .status-option-content {\n  color: #2e7898;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-8 .status-option-content {\n  color: #806c3f;\n}\n.mobile-profile-selector-option.detail-tone-1[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #eef5ff 0%,\n      #e3eefc 100%);\n  border-color: rgba(46, 102, 181, 0.32);\n}\n.mobile-profile-selector-option.detail-tone-2[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #eef9f3 0%,\n      #e3f4ea 100%);\n  border-color: rgba(40, 125, 72, 0.32);\n}\n.mobile-profile-selector-option.detail-tone-3[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #fff4ea 0%,\n      #ffecdd 100%);\n  border-color: rgba(165, 94, 24, 0.32);\n}\n.mobile-profile-selector-option.detail-tone-4[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f2f1ff 0%,\n      #e8e5fb 100%);\n  border-color: rgba(97, 82, 164, 0.32);\n}\n.mobile-profile-selector-option.detail-tone-5[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f6f9ef 0%,\n      #edf3e1 100%);\n  border-color: rgba(95, 128, 36, 0.32);\n}\n.mobile-profile-selector-option.detail-tone-6[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #fff1f4 0%,\n      #f9e6ed 100%);\n  border-color: rgba(160, 70, 111, 0.32);\n}\n.mobile-profile-selector-option.detail-tone-7[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #edf8ff 0%,\n      #e2f0fb 100%);\n  border-color: rgba(45, 122, 160, 0.32);\n}\n.mobile-profile-selector-option.detail-tone-8[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f6f3ea 0%,\n      #eee9dc 100%);\n  border-color: rgba(128, 109, 66, 0.32);\n}\n.mobile-profile-selector-option.status-public[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #e6f6ef 0%,\n      #d9f0e6 100%);\n  border-color: rgba(47, 143, 102, 0.34);\n}\n.mobile-profile-selector-option.status-friends[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #e8f1fd 0%,\n      #dfeaf9 100%);\n  border-color: rgba(27, 87, 161, 0.34);\n}\n.mobile-profile-selector-option.status-host[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f6efe2 0%,\n      #eee4d2 100%);\n  border-color: rgba(135, 88, 15, 0.36);\n}\n.mobile-profile-selector-option.status-inactive[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f2f3f5 0%,\n      #e8ebef 100%);\n  border-color: rgba(91, 101, 115, 0.32);\n}\n.mobile-profile-selector-option.physique-slim[_ngcontent-%COMP%] {\n  background: #eaf4ff;\n  border-color: rgba(63, 122, 179, 0.34);\n}\n.mobile-profile-selector-option.physique-lean[_ngcontent-%COMP%] {\n  background: #edf8f4;\n  border-color: rgba(75, 127, 113, 0.34);\n}\n.mobile-profile-selector-option.physique-athletic[_ngcontent-%COMP%] {\n  background: #e8f5ec;\n  border-color: rgba(47, 126, 77, 0.34);\n}\n.mobile-profile-selector-option.physique-fit[_ngcontent-%COMP%] {\n  background: #f1f2ff;\n  border-color: rgba(70, 95, 187, 0.34);\n}\n.mobile-profile-selector-option.physique-curvy[_ngcontent-%COMP%] {\n  background: #fff2f8;\n  border-color: rgba(161, 72, 117, 0.34);\n}\n.mobile-profile-selector-option.physique-muscular[_ngcontent-%COMP%] {\n  background: #fbf4ea;\n  border-color: rgba(125, 79, 36, 0.34);\n}\n.mobile-profile-selector-option.physique-average[_ngcontent-%COMP%] {\n  background: #eff4f9;\n  border-color: rgba(77, 102, 127, 0.34);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .values-selector-popup.profile-selector-popup[_ngcontent-%COMP%] {\n  gap: 0.56rem;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-filter-selector-head[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.44rem;\n  padding-bottom: 0.22rem;\n  border-bottom: 1px solid rgba(74, 102, 139, 0.22);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-filter-selector-head-label[_ngcontent-%COMP%] {\n  color: #203c64;\n  font-size: 0.82rem;\n  font-weight: 800;\n  line-height: 1.2;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-filter-selector-clear[_ngcontent-%COMP%] {\n  border: 1px solid rgba(41, 73, 110, 0.24);\n  border-radius: 999px;\n  background: rgba(255, 255, 255, 0.82);\n  color: #284970;\n  font: inherit;\n  font-size: 0.72rem;\n  font-weight: 700;\n  line-height: 1;\n  padding: 0.3rem 0.52rem;\n  cursor: pointer;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-filter-selector-clear.is-hidden[_ngcontent-%COMP%] {\n  visibility: hidden;\n  pointer-events: none;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-filter-selector-selected[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 0.34rem;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-filter-selector-chip[_ngcontent-%COMP%] {\n  border: 1px solid rgba(35, 68, 107, 0.24);\n  border-radius: 999px;\n  background: rgba(255, 255, 255, 0.92);\n  color: #234368;\n  font: inherit;\n  font-size: 0.72rem;\n  font-weight: 700;\n  line-height: 1;\n  padding: 0.26rem 0.48rem;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.16rem;\n  cursor: pointer;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-filter-selector-chip[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 13px;\n  height: 13px;\n  font-size: 13px;\n  line-height: 13px;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-filter-selector-empty[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 0.74rem;\n  color: rgba(31, 54, 86, 0.62);\n  font-style: italic;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.34rem;\n  border: 1px solid transparent;\n  border-radius: 12px;\n  padding: 0.4rem 0.42rem;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-head[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.34rem;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-tag[_ngcontent-%COMP%] {\n  border-radius: 999px;\n  border: 1px solid rgba(52, 86, 128, 0.28);\n  background: rgba(255, 255, 255, 0.74);\n  color: #2f527d;\n  font-size: 0.67rem;\n  font-weight: 800;\n  letter-spacing: 0.02em;\n  line-height: 1;\n  padding: 0.2rem 0.52rem;\n  text-transform: uppercase;\n  white-space: nowrap;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.24rem;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-tag-icon[_ngcontent-%COMP%] {\n  width: 12px;\n  height: 12px;\n  font-size: 12px;\n  line-height: 12px;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-line[_ngcontent-%COMP%] {\n  display: block;\n  width: 100%;\n  height: 1px;\n  background: rgba(84, 111, 147, 0.34);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-chip-grid[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 0.36rem;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-chip[_ngcontent-%COMP%] {\n  border: 1px solid rgba(41, 70, 106, 0.22);\n  border-radius: 999px;\n  background: #f4f8ff;\n  color: #234066;\n  font: inherit;\n  font-size: 0.78rem;\n  font-weight: 700;\n  padding: 0.3rem 0.58rem;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.26rem;\n  cursor: pointer;\n  transition:\n    background-color 0.14s ease,\n    border-color 0.14s ease,\n    color 0.14s ease,\n    box-shadow 0.14s ease;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-chip.active[_ngcontent-%COMP%] {\n  border-color: rgba(27, 85, 158, 0.5);\n  background:\n    linear-gradient(\n      180deg,\n      #dcebff 0%,\n      #cfe3ff 100%);\n  color: #123e70;\n  box-shadow: inset 0 0 0 1px rgba(30, 73, 127, 0.24), 0 1px 2px rgba(24, 53, 86, 0.16);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group.section-family[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 232, 219, 0.52) 0%,\n      rgba(255, 232, 219, 0.3) 100%);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group.section-ambition[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 242, 216, 0.52) 0%,\n      rgba(255, 242, 216, 0.3) 100%);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group.section-lifestyle[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(221, 241, 239, 0.56) 0%,\n      rgba(221, 241, 239, 0.32) 100%);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group.section-beliefs[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(230, 226, 250, 0.56) 0%,\n      rgba(230, 226, 250, 0.32) 100%);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group.section-social[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(223, 236, 255, 0.5) 0%,\n      rgba(223, 236, 255, 0.28) 100%);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group.section-arts[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(235, 227, 255, 0.5) 0%,\n      rgba(235, 227, 255, 0.28) 100%);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group.section-food[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 236, 221, 0.52) 0%,\n      rgba(255, 236, 221, 0.3) 100%);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group.section-active[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(222, 243, 231, 0.56) 0%,\n      rgba(222, 243, 231, 0.32) 100%);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group.section-mind[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(219, 242, 238, 0.56) 0%,\n      rgba(219, 242, 238, 0.32) 100%);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group.section-identity[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(230, 226, 250, 0.56) 0%,\n      rgba(230, 226, 250, 0.32) 100%);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-tag.section-family[_ngcontent-%COMP%] {\n  border-color: rgba(156, 94, 51, 0.34);\n  color: #9c5e33;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-tag.section-ambition[_ngcontent-%COMP%] {\n  border-color: rgba(160, 106, 20, 0.34);\n  color: #9b6717;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-tag.section-lifestyle[_ngcontent-%COMP%] {\n  border-color: rgba(47, 123, 119, 0.34);\n  color: #2f7b77;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-tag.section-beliefs[_ngcontent-%COMP%] {\n  border-color: rgba(95, 78, 160, 0.34);\n  color: #5f4ea0;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-tag.section-social[_ngcontent-%COMP%] {\n  border-color: rgba(47, 106, 175, 0.36);\n  color: #2f6aaf;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-tag.section-arts[_ngcontent-%COMP%] {\n  border-color: rgba(106, 87, 168, 0.36);\n  color: #6a57a8;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-tag.section-food[_ngcontent-%COMP%] {\n  border-color: rgba(170, 97, 28, 0.34);\n  color: #a55e18;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-tag.section-active[_ngcontent-%COMP%] {\n  border-color: rgba(49, 124, 82, 0.36);\n  color: #317c52;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-tag.section-mind[_ngcontent-%COMP%] {\n  border-color: rgba(37, 124, 118, 0.34);\n  color: #2b7c76;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-tag.section-identity[_ngcontent-%COMP%] {\n  border-color: rgba(98, 84, 163, 0.34);\n  color: #6254a3;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-line.section-family[_ngcontent-%COMP%] {\n  background: rgba(156, 94, 51, 0.3);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-line.section-ambition[_ngcontent-%COMP%] {\n  background: rgba(160, 106, 20, 0.32);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-line.section-lifestyle[_ngcontent-%COMP%] {\n  background: rgba(47, 123, 119, 0.3);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-line.section-beliefs[_ngcontent-%COMP%] {\n  background: rgba(95, 78, 160, 0.3);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-line.section-social[_ngcontent-%COMP%] {\n  background: rgba(47, 106, 175, 0.34);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-line.section-arts[_ngcontent-%COMP%] {\n  background: rgba(106, 87, 168, 0.34);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-line.section-food[_ngcontent-%COMP%] {\n  background: rgba(170, 97, 28, 0.32);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-line.section-active[_ngcontent-%COMP%] {\n  background: rgba(49, 124, 82, 0.34);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-line.section-mind[_ngcontent-%COMP%] {\n  background: rgba(37, 124, 118, 0.34);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-line.section-identity[_ngcontent-%COMP%] {\n  background: rgba(98, 84, 163, 0.3);\n}\n[_nghost-%COMP%]     .mat-mdc-option.mdc-list-item--selected:not(.mdc-list-item--disabled):not(.status-option) {\n  background: #f0f5fc;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.mdc-list-item--selected:not(.mdc-list-item--disabled) {\n  filter: brightness(0.95);\n  box-shadow: inset 0 0 0 1px rgba(24, 46, 76, 0.2);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option {\n  background: #fff;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option:not(:last-child) {\n  border-bottom: 1px solid #e6edf7;\n}\n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.hide-selected-option, \n[_nghost-%COMP%]     .status-options-panel .mat-mdc-option.hide-selected-option {\n  min-height: 0 !important;\n  height: 0 !important;\n  padding-top: 0 !important;\n  padding-bottom: 0 !important;\n  border: 0 !important;\n  margin: 0 !important;\n  opacity: 0 !important;\n  pointer-events: none !important;\n  overflow: hidden !important;\n}\n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option {\n  background: #fff;\n}\n[_nghost-%COMP%]     .mat-mdc-select-panel.selector-options-panel, \n[_nghost-%COMP%]     .mat-mdc-select-panel.status-options-panel {\n  margin-top: 8px !important;\n  margin-bottom: 8px !important;\n}\n[_nghost-%COMP%]     .mat-mdc-select-panel.selector-options-panel.mat-mdc-select-panel-above, \n[_nghost-%COMP%]     .mat-mdc-select-panel.status-options-panel.mat-mdc-select-panel-above, \n[_nghost-%COMP%]     .cdk-overlay-pane .mat-mdc-select-panel.selector-options-panel.mat-mdc-select-panel-above, \n[_nghost-%COMP%]     .cdk-overlay-pane .mat-mdc-select-panel.status-options-panel.mat-mdc-select-panel-above {\n  margin-top: 0 !important;\n  margin-bottom: 18px !important;\n  transform: translateY(-10px) !important;\n}\n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.status-option.status-public, \n[_nghost-%COMP%]     .status-options-panel .mat-mdc-option.status-option.status-public {\n  --mdc-list-list-item-container-color: #def3e9;\n  --mat-mdc-option-selected-container-color: #def3e9;\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #def3e9) !important;\n}\n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.status-option.status-friends, \n[_nghost-%COMP%]     .status-options-panel .mat-mdc-option.status-option.status-friends {\n  --mdc-list-list-item-container-color: #e3eefb;\n  --mat-mdc-option-selected-container-color: #e3eefb;\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #e3eefb) !important;\n}\n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.status-option.status-host, \n[_nghost-%COMP%]     .status-options-panel .mat-mdc-option.status-option.status-host {\n  --mdc-list-list-item-container-color: #f3ead8;\n  --mat-mdc-option-selected-container-color: #f3ead8;\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #f3ead8) !important;\n}\n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.status-option.status-inactive, \n[_nghost-%COMP%]     .status-options-panel .mat-mdc-option.status-option.status-inactive {\n  --mdc-list-list-item-container-color: #eceff3;\n  --mat-mdc-option-selected-container-color: #eceff3;\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #eceff3) !important;\n}\n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.status-option.status-public .status-option-content, \n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.status-option.status-public .status-option-content .mat-icon, \n[_nghost-%COMP%]     .status-options-panel .mat-mdc-option.status-option.status-public .status-option-content, \n[_nghost-%COMP%]     .status-options-panel .mat-mdc-option.status-option.status-public .status-option-content .mat-icon {\n  color: #2f8f66 !important;\n}\n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.status-option.status-friends .status-option-content, \n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.status-option.status-friends .status-option-content .mat-icon, \n[_nghost-%COMP%]     .status-options-panel .mat-mdc-option.status-option.status-friends .status-option-content, \n[_nghost-%COMP%]     .status-options-panel .mat-mdc-option.status-option.status-friends .status-option-content .mat-icon {\n  color: #1b57a1 !important;\n}\n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.status-option.status-host .status-option-content, \n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.status-option.status-host .status-option-content .mat-icon, \n[_nghost-%COMP%]     .status-options-panel .mat-mdc-option.status-option.status-host .status-option-content, \n[_nghost-%COMP%]     .status-options-panel .mat-mdc-option.status-option.status-host .status-option-content .mat-icon {\n  color: #87580f !important;\n}\n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.status-option.status-inactive .status-option-content, \n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.status-option.status-inactive .status-option-content .mat-icon, \n[_nghost-%COMP%]     .status-options-panel .mat-mdc-option.status-option.status-inactive .status-option-content, \n[_nghost-%COMP%]     .status-options-panel .mat-mdc-option.status-option.status-inactive .status-option-content .mat-icon {\n  color: #5b6573 !important;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.physique-slim {\n  background: #eaf4ff;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.physique-lean {\n  background: #edf8f4;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.physique-athletic {\n  background: #e8f5ec;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.physique-fit {\n  background: #f1f2ff;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.physique-curvy {\n  background: #fff2f8;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.physique-muscular {\n  background: #fbf4ea;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.physique-average {\n  background: #eff4f9;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.physique-slim .status-option-content {\n  color: #3f7ab3;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.physique-lean .status-option-content {\n  color: #3f8f5f;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.physique-athletic .status-option-content {\n  color: #2f7e4d;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.physique-fit .status-option-content {\n  color: #465fbb;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.physique-curvy .status-option-content {\n  color: #a14875;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.physique-muscular .status-option-content {\n  color: #7d4f24;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.physique-average .status-option-content {\n  color: #4d667f;\n}\n[_nghost-%COMP%]     .mat-mdc-select-panel.physique-options-panel {\n  width: auto !important;\n  max-width: 220px !important;\n  min-width: 0 !important;\n}\n[_nghost-%COMP%]     .physique-options-panel .mat-mdc-option {\n  padding-right: 8px;\n}\n[_nghost-%COMP%]     .physique-options-panel .mat-mdc-option .mat-pseudo-checkbox {\n  margin-left: 4px;\n}\n@media (max-width: 760px) {\n  .experience-form-grid[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n    max-width: none;\n    justify-content: stretch;\n    row-gap: 0.72rem;\n  }\n  .experience-date-range-label[_ngcontent-%COMP%] {\n    grid-column: 1/-1;\n  }\n  .experience-date-range-field[_ngcontent-%COMP%]   .mat-date-range-input-container[_ngcontent-%COMP%] {\n    grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);\n  }\n  .profile-details-privacy-fab[_ngcontent-%COMP%]   .privacy-fab-actions[_ngcontent-%COMP%] {\n    position: fixed;\n    left: 0.5rem;\n    right: 0.5rem;\n    bottom: max(0.5rem, env(safe-area-inset-bottom));\n    top: auto;\n    transform: translateY(12px) scale(0.98);\n    transform-origin: bottom center;\n    justify-content: center;\n    gap: 0.46rem;\n    padding: 0.46rem 0.56rem;\n    border: 1px solid rgba(42, 68, 102, 0.2);\n    border-radius: 14px;\n    background: #fff;\n    box-shadow: 0 -12px 24px rgba(18, 31, 51, 0.22);\n  }\n  .profile-details-privacy-fab.open[_ngcontent-%COMP%]   .privacy-fab-actions[_ngcontent-%COMP%] {\n    transform: translateY(0) scale(1);\n  }\n}\n[_nghost-%COMP%] {\n  display: contents;\n}\n.event-tournament-groups-body[_ngcontent-%COMP%] {\n  flex: 1 1 auto;\n  height: 100%;\n  min-height: 0;\n  padding: 0.76rem 1rem 1rem;\n  overflow-y: auto;\n  overflow-x: hidden;\n  background:\n    linear-gradient(\n      180deg,\n      #eef7ff 0%,\n      #e7f2ff 100%);\n}\n.event-tournament-groups-accordion[_ngcontent-%COMP%] {\n  display: block;\n  max-width: 100%;\n}\n.event-tournament-groups-loading[_ngcontent-%COMP%], \n.event-tournament-groups-empty[_ngcontent-%COMP%] {\n  min-height: 22rem;\n  display: grid;\n  place-items: center;\n  color: #25476c;\n}\n.event-tournament-group-content[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.62rem;\n  min-width: 0;\n}\n.event-tournament-group-tabs[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.36rem;\n  justify-self: start;\n  padding: 0.18rem;\n  border: 1px solid rgba(67, 103, 146, 0.22);\n  border-radius: 999px;\n  background: rgba(255, 255, 255, 0.72);\n}\n.event-tournament-group-tabs[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] {\n  min-width: 0;\n  height: 2rem;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  gap: 0.3rem;\n  padding: 0 0.7rem;\n  border: 0;\n  border-radius: 999px;\n  background: transparent;\n  color: #31567b;\n  font-weight: 800;\n  font-size: 0.74rem;\n  cursor: pointer;\n}\n.event-tournament-group-tabs[_ngcontent-%COMP%]   button.is-active[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #ffffff 0%,\n      #eaf3ff 100%);\n  color: #204f84;\n  box-shadow: 0 4px 12px rgba(34, 79, 132, 0.12);\n}\n.event-tournament-group-tabs[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 1rem;\n  height: 1rem;\n  font-size: 1rem;\n  line-height: 1rem;\n}\n.event-tournament-table-wrap[_ngcontent-%COMP%] {\n  width: 100%;\n  min-width: 0;\n  overflow-x: auto;\n  border: 1px solid rgba(67, 103, 146, 0.18);\n  border-radius: 8px;\n  background: rgba(255, 255, 255, 0.66);\n}\n.event-tournament-table[_ngcontent-%COMP%] {\n  width: 100%;\n  min-width: 560px;\n  border-collapse: collapse;\n  table-layout: fixed;\n}\n.event-tournament-table[_ngcontent-%COMP%]   th[_ngcontent-%COMP%], \n.event-tournament-table[_ngcontent-%COMP%]   td[_ngcontent-%COMP%] {\n  padding: 0.5rem 0.48rem;\n  border-bottom: 1px solid rgba(67, 103, 146, 0.14);\n  color: #254568;\n  font-size: 0.78rem;\n  text-align: left;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.event-tournament-table[_ngcontent-%COMP%]   th[_ngcontent-%COMP%] {\n  background: rgba(232, 242, 255, 0.86);\n  color: rgba(28, 56, 91, 0.88);\n  font-weight: 900;\n}\n.event-tournament-table[_ngcontent-%COMP%]   th[_ngcontent-%COMP%]:first-child, \n.event-tournament-table[_ngcontent-%COMP%]   td[_ngcontent-%COMP%]:first-child {\n  width: 2.4rem;\n  text-align: center;\n}\n.event-tournament-table[_ngcontent-%COMP%]   th[_ngcontent-%COMP%]:last-child, \n.event-tournament-table[_ngcontent-%COMP%]   td[_ngcontent-%COMP%]:last-child {\n  width: 2rem;\n  text-align: center;\n}\n.event-tournament-table[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%] {\n  cursor: pointer;\n}\n.event-tournament-table[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%]:active, \n.event-tournament-table[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%]:hover {\n  transform: none;\n}\n.event-tournament-table[_ngcontent-%COMP%]   tr[data-member-palette=blue][_ngcontent-%COMP%] {\n  --event-tournament-member-rgb:\n    63,\n    123,\n    200;\n}\n.event-tournament-table[_ngcontent-%COMP%]   tr[data-member-palette=green][_ngcontent-%COMP%] {\n  --event-tournament-member-rgb:\n    47,\n    143,\n    102;\n}\n.event-tournament-table[_ngcontent-%COMP%]   tr[data-member-palette=amber][_ngcontent-%COMP%] {\n  --event-tournament-member-rgb:\n    202,\n    132,\n    31;\n}\n.event-tournament-table[_ngcontent-%COMP%]   tr[data-member-palette=violet][_ngcontent-%COMP%] {\n  --event-tournament-member-rgb:\n    122,\n    76,\n    196;\n}\n.event-tournament-table[_ngcontent-%COMP%]   tr[data-member-palette=cyan][_ngcontent-%COMP%] {\n  --event-tournament-member-rgb:\n    45,\n    142,\n    154;\n}\n.event-tournament-table[_ngcontent-%COMP%]   tr[data-member-palette=orange][_ngcontent-%COMP%] {\n  --event-tournament-member-rgb:\n    205,\n    105,\n    35;\n}\n.event-tournament-table[_ngcontent-%COMP%]   tr[data-member-palette=pink][_ngcontent-%COMP%] {\n  --event-tournament-member-rgb:\n    190,\n    75,\n    137;\n}\n.event-tournament-table[_ngcontent-%COMP%]   tr[data-member-palette=teal][_ngcontent-%COMP%] {\n  --event-tournament-member-rgb:\n    45,\n    120,\n    130;\n}\n.event-tournament-table[_ngcontent-%COMP%]   tbody[_ngcontent-%COMP%]   tr[data-member-palette][_ngcontent-%COMP%]   td[_ngcontent-%COMP%] {\n  background: rgba(var(--event-tournament-member-rgb), 0.075);\n}\n.event-tournament-table[_ngcontent-%COMP%]   tbody[_ngcontent-%COMP%]   tr[data-member-palette][_ngcontent-%COMP%]   td[_ngcontent-%COMP%]:first-child {\n  box-shadow: inset 3px 0 0 rgba(var(--event-tournament-member-rgb), 0.68);\n  color: rgb(var(--event-tournament-member-rgb));\n  font-weight: 900;\n}\n.event-tournament-table[_ngcontent-%COMP%]   tbody[_ngcontent-%COMP%]   tr[data-participant-state=DQ][_ngcontent-%COMP%]   td[_ngcontent-%COMP%]:first-child {\n  color: #9b2538;\n  box-shadow: inset 3px 0 0 rgba(155, 37, 56, 0.72);\n}\n.event-tournament-table[_ngcontent-%COMP%]   tbody[_ngcontent-%COMP%]   tr[data-participant-state=R][_ngcontent-%COMP%]   td[_ngcontent-%COMP%]:first-child {\n  color: #8a5b11;\n  box-shadow: inset 3px 0 0 rgba(138, 91, 17, 0.72);\n}\n.event-tournament-table[_ngcontent-%COMP%]   tbody[_ngcontent-%COMP%]   tr[data-participant-state=V][_ngcontent-%COMP%]   td[_ngcontent-%COMP%]:first-child {\n  color: #687687;\n  box-shadow: inset 3px 0 0 rgba(104, 118, 135, 0.58);\n}\n.event-tournament-table[_ngcontent-%COMP%]   tr.is-advance[_ngcontent-%COMP%]   td[_ngcontent-%COMP%] {\n  background: rgba(61, 173, 99, 0.12);\n  font-weight: 800;\n}\n.event-tournament-table[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%]:focus-visible {\n  outline: 2px solid rgba(47, 111, 177, 0.42);\n  outline-offset: -2px;\n}\n@media (hover: hover) and (pointer: fine) {\n  .event-tournament-table[_ngcontent-%COMP%]   tbody[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%]:hover   td[_ngcontent-%COMP%] {\n    background: rgba(235, 244, 255, 0.88);\n  }\n  .event-tournament-table[_ngcontent-%COMP%]   tbody[_ngcontent-%COMP%]   tr[data-member-palette][_ngcontent-%COMP%]:hover   td[_ngcontent-%COMP%] {\n    background: rgba(var(--event-tournament-member-rgb), 0.18);\n  }\n}\n.event-tournament-table[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 1rem;\n  height: 1rem;\n  font-size: 1rem;\n  line-height: 1rem;\n  color: #356391;\n}\n.event-tournament-history[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.5rem;\n  min-width: 0;\n}\n.event-tournament-history[_ngcontent-%COMP%]   header[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  min-width: 0;\n}\n.event-tournament-history[_ngcontent-%COMP%]   header[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  color: #1f3f62;\n  font-size: 0.86rem;\n}\n.event-tournament-table-history[_ngcontent-%COMP%] {\n  min-width: 0;\n}\n.event-tournament-table-history[_ngcontent-%COMP%]   th[_ngcontent-%COMP%]:first-child, \n.event-tournament-table-history[_ngcontent-%COMP%]   td[_ngcontent-%COMP%]:first-child {\n  width: 4.5rem;\n  text-align: left;\n}\n.event-tournament-table-history[_ngcontent-%COMP%]   th[_ngcontent-%COMP%]:last-child, \n.event-tournament-table-history[_ngcontent-%COMP%]   td[_ngcontent-%COMP%]:last-child {\n  width: 7rem;\n  text-align: left;\n}\n.event-tournament-table-score-history[_ngcontent-%COMP%]   td[_ngcontent-%COMP%]:first-child {\n  font-weight: 900;\n}\n.event-tournament-table-fifa-history[_ngcontent-%COMP%]   th[_ngcontent-%COMP%]:nth-child(2), \n.event-tournament-table-fifa-history[_ngcontent-%COMP%]   td[_ngcontent-%COMP%]:nth-child(2) {\n  width: 5.5rem;\n  text-align: center;\n}\n.event-tournament-history-empty[_ngcontent-%COMP%] {\n  margin: 0;\n  padding: 1rem;\n  border: 1px dashed rgba(67, 103, 146, 0.24);\n  border-radius: 8px;\n  color: rgba(37, 69, 104, 0.72);\n  text-align: center;\n  font-weight: 800;\n}\n.event-tournament-entry-flow[_ngcontent-%COMP%] {\n  display: block;\n  flex: 1 1 auto;\n  min-height: 13.4rem;\n  overflow: visible;\n}\n@media (max-width: 760px) {\n  .event-tournament-groups-body[_ngcontent-%COMP%] {\n    padding: 0.62rem;\n  }\n  .event-tournament-group-tabs[_ngcontent-%COMP%] {\n    width: 100%;\n    justify-content: stretch;\n  }\n  .event-tournament-group-tabs[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] {\n    flex: 1 1 0;\n  }\n  .event-tournament-table[_ngcontent-%COMP%] {\n    min-width: 520px;\n  }\n  .event-tournament-table.event-tournament-table-history[_ngcontent-%COMP%] {\n    min-width: 0;\n  }\n  .event-tournament-table-history[_ngcontent-%COMP%]   th[_ngcontent-%COMP%], \n   .event-tournament-table-history[_ngcontent-%COMP%]   td[_ngcontent-%COMP%] {\n    padding: 0.42rem 0.3rem;\n    font-size: 0.69rem;\n  }\n  .event-tournament-table-history[_ngcontent-%COMP%]   th[_ngcontent-%COMP%]:first-child, \n   .event-tournament-table-history[_ngcontent-%COMP%]   td[_ngcontent-%COMP%]:first-child {\n    width: 3.6rem;\n  }\n  .event-tournament-table-history[_ngcontent-%COMP%]   th[_ngcontent-%COMP%]:last-child, \n   .event-tournament-table-history[_ngcontent-%COMP%]   td[_ngcontent-%COMP%]:last-child {\n    width: 6.1rem;\n  }\n  .event-tournament-table-fifa-history[_ngcontent-%COMP%]   th[_ngcontent-%COMP%]:nth-child(2), \n   .event-tournament-table-fifa-history[_ngcontent-%COMP%]   td[_ngcontent-%COMP%]:nth-child(2) {\n    width: 4.2rem;\n  }\n}\n/*# sourceMappingURL=event-tournament-groups-popup.component.css.map */'], changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(EventTournamentGroupsPopupComponent, [{
    type: Component,
    args: [{ selector: "app-event-tournament-groups-popup", standalone: true, imports: [
      CommonModule,
      FormsModule,
      MatIconModule,
      AccordionComponent,
      FormFlowComponent,
      IndicatorComponent,
      PopupComponent,
      EventSubeventGroupFormPopupComponent
    ], changeDetection: ChangeDetectionStrategy.OnPush, template: `@if (isOpen()) {
  @let vm = viewModel();
  <app-popup [model]="tournamentGroupsPopupModel(vm)" [zIndex]="2440">
      <div class="popup-body event-tournament-groups-body">
        @if (isLoading) {
          <div class="event-tournament-groups-loading">
            <app-indicator kind="load-ring" state="loading" tone="accent"></app-indicator>
          </div>
        } @else if (loadError) {
          <div class="event-tournament-groups-empty">
            <strong>{{ loadError }}</strong>
          </div>
        } @else {
          <app-accordion
            class="event-tournament-groups-accordion"
            [model]="accordionModel(vm)"
            [itemTemplate]="groupBodyTemplate"
            (itemToggle)="onAccordionToggle($event)"
            (itemActionSelect)="onAccordionActionSelect($event)"
          ></app-accordion>
        }

        <ng-template #groupBodyTemplate let-item>
          @if (selectedGroupFromItem(item); as group) {
            <section class="event-tournament-group-content">
              <nav class="event-tournament-group-tabs" aria-label="Group view">
                <button
                  type="button"
                  [class.is-active]="tabFor(group.id) === 'standings'"
                  (click)="selectTab(group.id, 'standings', $event)"
                >
                  <mat-icon>leaderboard</mat-icon>
                  <span>Standings</span>
                </button>
                <button
                  type="button"
                  [class.is-active]="tabFor(group.id) === 'history'"
                  (click)="selectTab(group.id, 'history', $event)"
                >
                  <mat-icon>history</mat-icon>
                  <span>History</span>
                </button>
              </nav>

              @if (tabFor(group.id) === 'standings') {
                @if (selectedStageMode() === 'Score') {
                  <div class="event-tournament-table-wrap">
                    <table class="event-tournament-table event-tournament-table-score">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Member</th>
                          <th>Score</th>
                          <th>Updates</th>
                          <th aria-hidden="true"></th>
                        </tr>
                      </thead>
                      <tbody>
                        @for (row of scoreRows(group); track trackByMemberId($index, row)) {
                          <tr
                            [class.is-advance]="isAdvanceRow(group, row)"
                            [attr.data-member-palette]="leaderboardMemberPalette(group, row.memberId)"
                            [attr.data-participant-state]="row.participantState"
                            data-motion="none"
                            tabindex="0"
                            role="button"
                            (click)="openMemberHistory(group.id, row.memberId, $event)"
                            (keydown.enter)="openMemberHistory(group.id, row.memberId, $event)"
                            (keydown.space)="openMemberHistory(group.id, row.memberId, $event); $event.preventDefault()"
                          >
                            <td>{{ row.positionLabel }}</td>
                            <td>{{ row.memberName }}</td>
                            <td>{{ row.total }}</td>
                            <td>{{ row.updates }}</td>
                            <td><mat-icon>chevron_right</mat-icon></td>
                          </tr>
                        }
                      </tbody>
                    </table>
                  </div>
                } @else {
                  <div class="event-tournament-table-wrap">
                    <table class="event-tournament-table event-tournament-table-fifa">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Member</th>
                          <th>Pts</th>
                          <th>W-D-L</th>
                          <th>GF:GA</th>
                          <th>GD</th>
                          <th aria-hidden="true"></th>
                        </tr>
                      </thead>
                      <tbody>
                        @for (row of fifaRows(group); track trackByMemberId($index, row)) {
                          <tr
                            [class.is-advance]="isAdvanceRow(group, row)"
                            [attr.data-member-palette]="leaderboardMemberPalette(group, row.memberId)"
                            [attr.data-participant-state]="row.participantState"
                            data-motion="none"
                            tabindex="0"
                            role="button"
                            (click)="openMemberHistory(group.id, row.memberId, $event)"
                            (keydown.enter)="openMemberHistory(group.id, row.memberId, $event)"
                            (keydown.space)="openMemberHistory(group.id, row.memberId, $event); $event.preventDefault()"
                          >
                            <td>{{ row.positionLabel }}</td>
                            <td>{{ row.memberName }}</td>
                            <td>{{ row.points }}</td>
                            <td>{{ row.wins }}-{{ row.draws }}-{{ row.losses }}</td>
                            <td>{{ row.goalsFor }}:{{ row.goalsAgainst }}</td>
                            <td>{{ row.goalDiff }}</td>
                            <td><mat-icon>chevron_right</mat-icon></td>
                          </tr>
                        }
                      </tbody>
                    </table>
                  </div>
                }
              } @else {
                <section class="event-tournament-history">
                  <header>
                    <strong>{{ detailMemberName(group) }}</strong>
                  </header>
                  @if (selectedStageMode() === 'Score') {
                    @if (scoreHistory(group).length > 0) {
                      <div class="event-tournament-table-wrap">
                        <table class="event-tournament-table event-tournament-table-history event-tournament-table-score-history">
                          <thead>
                            <tr>
                              <th>Score</th>
                              <th>Note</th>
                              <th>Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            @for (entry of scoreHistory(group); track trackById($index, entry)) {
                              <tr>
                                <td>{{ scoreValueLabel(entry.value) }}</td>
                                <td>{{ entry.note || 'No note' }}</td>
                                <td>{{ entry.createdAtMs | date:'MM/dd HH:mm' }}</td>
                              </tr>
                            }
                          </tbody>
                        </table>
                      </div>
                    } @else {
                      <p class="event-tournament-history-empty">No score updates yet.</p>
                    }
                  } @else {
                    @if (fifaHistory(group).length > 0) {
                      <div class="event-tournament-table-wrap">
                        <table class="event-tournament-table event-tournament-table-history event-tournament-table-fifa-history">
                          <thead>
                            <tr>
                              <th>Match</th>
                              <th>Result</th>
                              <th>Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            @for (match of fifaHistory(group); track trackById($index, match)) {
                              <tr>
                                <td>{{ memberName(group, match.homeMemberId) }} - {{ memberName(group, match.awayMemberId) }}</td>
                                <td>{{ match.homeScore }} : {{ match.awayScore }}</td>
                                <td>{{ match.createdAtMs | date:'MM/dd HH:mm' }}</td>
                              </tr>
                            }
                          </tbody>
                        </table>
                      </div>
                    } @else {
                      <p class="event-tournament-history-empty">No matches yet.</p>
                    }
                  }
                </section>
              }
            </section>
          }
        </ng-template>
      </div>
  </app-popup>

    <app-event-subevent-group-form-popup
      [open]="showGroupForm"
      [title]="groupFormTitle()"
      [stageTitle]="groupFormStageTitle()"
      [model]="groupForm"
      [canSave]="canSaveGroupForm()"
      [invalidName]="groupFieldInvalid()"
      [saving]="isMutating"
      (modelChange)="onGroupFormModelChange($event)"
      (save)="saveGroupForm($event)"
      (cancel)="closeGroupForm($event)"
    ></app-event-subevent-group-form-popup>

    @if (showEntryForm) {
      <app-popup [model]="tournamentEntryPopupModel()" [zIndex]="3920">
          <app-form-flow
            class="event-tournament-entry-flow"
            [model]="entryFormFlowModel()"
            [ngModel]="entryForm"
            (ngModelChange)="onEntryFormFlowChange($event)"
            [disabled]="!canManageGroups()"
          ></app-form-flow>
      </app-popup>
    }
}
`, styles: ['/* src/app/activity/components/event-tournament-groups-popup/event-tournament-groups-popup.component.scss */\n:host {\n  --interactive-motion-duration: 160ms;\n  --interactive-motion-ease: cubic-bezier(0.22, 1, 0.36, 1);\n  --interactive-hover-lift: -1px;\n  --interactive-hover-scale: 1.01;\n  --interactive-hover-brightness: 1.01;\n  --interactive-press-scale: 0.97;\n  --interactive-press-brightness: 0.97;\n}\n:where(button, a[href], [role=button], .link-btn, .popup-view-fab, .popup-header-add-btn, .activities-view-option, .profile-status-select-wrap, .profile-details-values-btn, .profile-details-privacy-btn, .profile-privacy-menu-option, .popup-close, .date-picker-btn, .avatar-edit-btn, .experience-form-close-btn, .image-editor-grid button, .image-stack-line, .image-stack-hit-segment, .mobile-profile-selector-close-btn, .mobile-profile-selector-option, .popup-panel-profile-selector .profile-filter-selector-clear, .popup-panel-profile-selector .profile-filter-selector-chip, .popup-panel-profile-selector .profile-selector-chip, .item-action-menu-btn, .experience-action-btn, .header-icon-btn, .chat-header-members, .activities-row-item-clickable, .activities-card-btn, .asset-source-icon, .event-editor-members-trigger, .motion-card, [data-motion=card]):not(.motion-static):not([data-motion=none]) {\n  -webkit-tap-highlight-color: transparent;\n  transition:\n    transform var(--interactive-motion-duration) var(--interactive-motion-ease),\n    filter var(--interactive-motion-duration) var(--interactive-motion-ease),\n    box-shadow var(--interactive-motion-duration) var(--interactive-motion-ease),\n    background-color var(--interactive-motion-duration) var(--interactive-motion-ease),\n    border-color var(--interactive-motion-duration) var(--interactive-motion-ease),\n    color var(--interactive-motion-duration) var(--interactive-motion-ease);\n  transform-origin: center;\n}\n:where(button, a[href], [role=button], .link-btn, .popup-view-fab, .popup-header-add-btn, .activities-view-option, .profile-status-select-wrap, .profile-details-values-btn, .profile-details-privacy-btn, .profile-privacy-menu-option, .popup-close, .date-picker-btn, .avatar-edit-btn, .experience-form-close-btn, .image-editor-grid button, .image-stack-line, .image-stack-hit-segment, .mobile-profile-selector-close-btn, .mobile-profile-selector-option, .popup-panel-profile-selector .profile-filter-selector-clear, .popup-panel-profile-selector .profile-filter-selector-chip, .popup-panel-profile-selector .profile-selector-chip, .item-action-menu-btn, .experience-action-btn, .header-icon-btn, .chat-header-members, .activities-row-item-clickable, .activities-card-btn, .asset-source-icon, .event-editor-members-trigger, .motion-card, [data-motion=card]):not(.motion-static):not([data-motion=none]):focus-visible {\n  outline: 2px solid rgba(66, 110, 182, 0.44);\n  outline-offset: 2px;\n}\n@media (hover: hover) and (pointer: fine) {\n  :where(button, a[href], [role=button], .link-btn, .popup-view-fab, .popup-header-add-btn, .activities-view-option, .profile-status-select-wrap, .profile-details-values-btn, .profile-details-privacy-btn, .profile-privacy-menu-option, .popup-close, .date-picker-btn, .avatar-edit-btn, .experience-form-close-btn, .image-editor-grid button, .image-stack-line, .image-stack-hit-segment, .mobile-profile-selector-close-btn, .mobile-profile-selector-option, .popup-panel-profile-selector .profile-filter-selector-clear, .popup-panel-profile-selector .profile-filter-selector-chip, .popup-panel-profile-selector .profile-selector-chip, .item-action-menu-btn, .experience-action-btn, .header-icon-btn, .chat-header-members, .activities-row-item-clickable, .activities-card-btn, .asset-source-icon, .event-editor-members-trigger, .motion-card, [data-motion=card]):not(.motion-static):not([data-motion=none]):not(:disabled):not([aria-disabled=true]):hover {\n    transform: translateY(var(--interactive-hover-lift)) scale(var(--interactive-hover-scale));\n    filter: brightness(var(--interactive-hover-brightness));\n  }\n  :where(button, a[href], [role=button], .link-btn, .popup-view-fab, .popup-header-add-btn, .activities-view-option, .profile-status-select-wrap, .profile-details-values-btn, .profile-details-privacy-btn, .profile-privacy-menu-option, .popup-close, .date-picker-btn, .avatar-edit-btn, .experience-form-close-btn, .image-editor-grid button, .image-stack-line, .image-stack-hit-segment, .mobile-profile-selector-close-btn, .mobile-profile-selector-option, .popup-panel-profile-selector .profile-filter-selector-clear, .popup-panel-profile-selector .profile-filter-selector-chip, .popup-panel-profile-selector .profile-selector-chip, .item-action-menu-btn, .experience-action-btn, .header-icon-btn, .chat-header-members, .activities-row-item-clickable, .activities-card-btn, .asset-source-icon, .event-editor-members-trigger, .motion-card, [data-motion=card]):not(.motion-static):not([data-motion=none]):not(:disabled):not([aria-disabled=true]):active {\n    transform: scale(var(--interactive-press-scale));\n    filter: brightness(var(--interactive-press-brightness));\n  }\n  :where(.motion-card, [data-motion=card]):not(.motion-static):not([data-motion=none]):hover {\n    box-shadow: 0 3px 10px rgba(16, 29, 48, 0.14);\n  }\n}\n@keyframes shared-mobile-touch-feedback {\n  0% {\n    transform: scale(1);\n    filter: brightness(1);\n  }\n  45% {\n    transform: scale(var(--interactive-press-scale));\n    filter: brightness(var(--interactive-press-brightness));\n  }\n  100% {\n    transform: scale(1);\n    filter: brightness(1);\n  }\n}\n@media (hover: none), (pointer: coarse) {\n  :where(button, a[href], [role=button], .link-btn, .popup-view-fab, .popup-header-add-btn, .activities-view-option, .profile-status-select-wrap, .profile-details-values-btn, .profile-details-privacy-btn, .profile-privacy-menu-option, .popup-close, .date-picker-btn, .avatar-edit-btn, .experience-form-close-btn, .image-editor-grid button, .image-stack-line, .image-stack-hit-segment, .mobile-profile-selector-close-btn, .mobile-profile-selector-option, .popup-panel-profile-selector .profile-filter-selector-clear, .popup-panel-profile-selector .profile-filter-selector-chip, .popup-panel-profile-selector .profile-selector-chip, .item-action-menu-btn, .experience-action-btn, .header-icon-btn, .chat-header-members, .activities-row-item-clickable, .activities-card-btn, .asset-source-icon, .event-editor-members-trigger, .motion-card, [data-motion=card]):not(.motion-static):not([data-motion=none]):not(:disabled):not([aria-disabled=true]):active {\n    animation: shared-mobile-touch-feedback 0.2s ease;\n  }\n}\n.app-popup,\n.mobile-profile-selector-sheet-wrap,\n.popup-surface,\n.experience-form-popup {\n  font-family:\n    "Nunito Sans",\n    "Segoe UI",\n    sans-serif;\n}\n.app-popup button,\n.app-popup input,\n.app-popup textarea,\n.app-popup select,\n.app-popup .mat-mdc-select,\n.app-popup .mat-mdc-select-value-text,\n.app-popup .mat-mdc-option,\n.popup-surface button,\n.popup-surface input,\n.popup-surface textarea,\n.popup-surface select,\n.popup-surface .mat-mdc-select,\n.popup-surface .mat-mdc-select-value-text,\n.popup-surface .mat-mdc-option,\n.experience-form-popup button,\n.experience-form-popup input,\n.experience-form-popup textarea,\n.experience-form-popup select,\n.experience-form-popup .mat-mdc-select,\n.experience-form-popup .mat-mdc-select-value-text,\n.experience-form-popup .mat-mdc-option,\n.mobile-profile-selector-sheet-wrap button,\n.mobile-profile-selector-sheet-wrap input,\n.mobile-profile-selector-sheet-wrap .mat-mdc-option {\n  font-family: inherit;\n}\n.popup-filter-picker,\n.activities-view-picker {\n  position: relative;\n  z-index: 60;\n  margin-left: auto;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.34rem;\n}\n.popup-filter-picker-secondary,\n.activities-secondary-picker {\n  position: relative;\n  z-index: 61;\n}\n.selector-like {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.35rem;\n}\n.profile-status-select-wrap.popup-compact-select,\n.profile-status-select-wrap.activities-compact-select,\n.profile-status-select-wrap.assets-compact-select {\n  width: fit-content !important;\n  min-width: 0 !important;\n  max-width: 100%;\n}\n.profile-status-select-wrap.popup-compact-select .mat-mdc-select,\n.profile-status-select-wrap.activities-compact-select .mat-mdc-select,\n.profile-status-select-wrap.assets-compact-select .mat-mdc-select {\n  width: auto;\n  min-width: 0;\n}\n.profile-status-select-wrap.popup-compact-select .mat-mdc-select-trigger,\n.profile-status-select-wrap.activities-compact-select .mat-mdc-select-trigger,\n.profile-status-select-wrap.assets-compact-select .mat-mdc-select-trigger {\n  width: auto !important;\n  min-width: 0;\n}\n.profile-status-select-wrap.popup-compact-select .status-option-content,\n.profile-status-select-wrap.activities-compact-select .status-option-content,\n.profile-status-select-wrap.assets-compact-select .status-option-content {\n  width: auto;\n  min-width: 0;\n}\n.profile-status-select-wrap.popup-filter-no-badge,\n.profile-status-select-wrap.activities-filter-no-badge {\n  min-width: 0;\n}\n.profile-status-select-wrap.popup-filter-no-badge .status-option-content,\n.profile-status-select-wrap.activities-filter-no-badge .status-option-content {\n  width: auto !important;\n  flex: 0 1 auto;\n}\n.profile-status-select-wrap.popup-filter-no-badge .mat-mdc-select,\n.profile-status-select-wrap.activities-filter-no-badge .mat-mdc-select {\n  width: auto;\n  min-width: 0;\n}\n.profile-status-select-wrap.popup-filter-no-badge .mat-mdc-select-trigger,\n.profile-status-select-wrap.activities-filter-no-badge .mat-mdc-select-trigger {\n  width: auto !important;\n}\n.profile-status-select-wrap.popup-filter-no-badge .mat-mdc-select-arrow-wrapper,\n.profile-status-select-wrap.activities-filter-no-badge .mat-mdc-select-arrow-wrapper {\n  margin-left: 0.28rem;\n}\n.profile-status-select-wrap {\n  min-width: 174px;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.38rem;\n  border: 1px solid #c8d3e2;\n  border-radius: 999px;\n  box-shadow: 0 2px 6px rgba(38, 60, 92, 0.08);\n  padding: 0.12rem 0.5rem 0.12rem 0.84rem;\n  background: #f8f9fb;\n}\n.profile-status-select-wrap.selector-like {\n  min-height: 36px;\n}\n.status-option-content {\n  display: flex;\n  align-items: center;\n  justify-content: flex-start;\n  gap: 0.2rem;\n  text-transform: lowercase;\n  width: 100%;\n  min-width: 0;\n}\n.status-option-content span:last-child {\n  white-space: nowrap;\n}\n.status-option-content .mat-icon {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n  line-height: 16px;\n  flex: 0 0 16px;\n}\n.rate-filter-count-badge {\n  margin-left: auto;\n  width: 20px;\n  height: 20px;\n  border-radius: 50%;\n  border: 1px solid #fff;\n  background: #d84d4d;\n  color: #fff;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  padding: 0;\n  font-size: 0.68rem;\n  font-weight: 800;\n  line-height: 1;\n  box-shadow: 0 2px 8px rgba(120, 24, 24, 0.22);\n}\n.rate-filter-trigger-badge {\n  position: absolute;\n  top: -8px;\n  right: -8px;\n  margin-left: 0;\n  z-index: 2;\n}\n.popup-filter-control,\n.activities-rate-filter-select,\n.activities-primary-filter-select,\n.activities-event-scope-filter-select,\n.activities-chat-context-filter-select {\n  position: relative;\n  overflow: visible;\n}\n.popup-filter-panel,\n.activities-view-picker-panel {\n  position: absolute;\n  top: calc(100% + 0.32rem);\n  right: 0;\n  border: 1px solid rgba(39, 62, 94, 0.22);\n  border-radius: 10px;\n  background: #fff;\n  box-shadow: 0 10px 24px rgba(17, 29, 48, 0.22);\n  padding: 0.24rem;\n  min-width: 128px;\n  z-index: 40;\n  display: grid;\n  gap: 0.16rem;\n}\n.popup-filter-option,\n.activities-view-option {\n  border: 0;\n  background: #fff;\n  border-radius: 8px;\n  min-height: 32px;\n  padding: 0.34rem 0.44rem;\n  display: inline-flex;\n  align-items: center;\n  justify-content: flex-start;\n  gap: 0.34rem;\n  color: #1e3658;\n  cursor: pointer;\n  text-align: left;\n}\n.popup-filter-option .mat-icon,\n.activities-view-option .mat-icon {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n}\n.popup-filter-option span,\n.activities-view-option span {\n  font-size: 0.78rem;\n  font-weight: 700;\n}\n.popup-filter-option > span:not(.rate-filter-count-badge),\n.activities-view-option > span:not(.rate-filter-count-badge) {\n  flex: 1 1 auto;\n  min-width: 0;\n  text-align: left;\n}\n.popup-mobile-filter-picker,\n.activities-mobile-primary-filter-picker,\n.activities-mobile-event-scope-filter-picker,\n.activities-mobile-chat-context-filter-picker,\n.activities-mobile-rate-filter-picker {\n  position: relative;\n}\n.popup-mobile-filter-panel,\n.activities-mobile-filter-panel,\n.activities-mobile-rate-filter-panel {\n  top: calc(100% + 0.24rem);\n  right: 0;\n  min-width: 210px;\n  z-index: 65;\n}\n.popup-mobile-sheet-title,\n.activities-mobile-sheet-title {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.28rem;\n  padding: 0 0.14rem;\n  color: #1c3354;\n  font-size: 0.94rem;\n  font-weight: 800;\n}\n.popup-mobile-sheet-title .mat-icon,\n.activities-mobile-sheet-title .mat-icon {\n  width: 17px;\n  height: 17px;\n  font-size: 17px;\n  line-height: 17px;\n}\n:is(.popup-filter-bar, .experience-toolbar, .assets-toolbar) .popup-view-fab span,\n:is(.popup-filter-bar, .experience-toolbar, .assets-toolbar) .profile-status-select-wrap .mat-mdc-select,\n:is(.popup-filter-bar, .experience-toolbar, .assets-toolbar) .profile-status-select-wrap .status-option-content span:last-child,\n:is(.popup-filter-bar, .experience-toolbar, .assets-toolbar) .profile-status-select-wrap .mat-mdc-select-value-text {\n  font-weight: 400 !important;\n}\n:host ::ng-deep .selector-options-panel .mat-mdc-option.status-option .status-option-content {\n  display: grid;\n  grid-template-columns: auto minmax(0, 1fr) auto;\n  align-items: center;\n  width: 100%;\n  min-width: 0;\n  column-gap: 0.34rem;\n}\n:host ::ng-deep .selector-options-panel .mat-mdc-option.status-option .rate-filter-count-badge {\n  margin-left: 0;\n  justify-self: end;\n}\n:host ::ng-deep .cdk-overlay-pane:has(.mat-mdc-select-panel.selector-options-panel),\n:host ::ng-deep .cdk-overlay-pane:has(.mat-mdc-select-panel.status-options-panel) {\n  min-width: var(--app-selector-panel-min-width, 184px) !important;\n}\n:host ::ng-deep .mat-mdc-select-panel.selector-options-panel,\n:host ::ng-deep .mat-mdc-select-panel.status-options-panel {\n  min-width: var(--app-selector-panel-min-width, 184px) !important;\n}\n@media (max-width: 760px) {\n  .popup-mobile-filter-panel .popup-filter-option,\n  .popup-mobile-filter-panel .activities-view-option,\n  .activities-mobile-filter-panel .popup-filter-option,\n  .activities-mobile-filter-panel .activities-view-option,\n  .activities-mobile-rate-filter-panel .popup-filter-option,\n  .activities-mobile-rate-filter-panel .activities-view-option {\n    width: 100%;\n    min-width: 0;\n    box-sizing: border-box;\n    border: 1px solid rgba(58, 81, 114, 0.24);\n    border-radius: 12px;\n    background: #f7f9fd;\n    min-height: 42px;\n    padding: 0.46rem 0.62rem;\n    justify-content: flex-start;\n    gap: 0.36rem;\n  }\n  .popup-mobile-filter-panel .popup-filter-option.active,\n  .popup-mobile-filter-panel .activities-view-option.active,\n  .activities-mobile-filter-panel .popup-filter-option.active,\n  .activities-mobile-filter-panel .activities-view-option.active,\n  .activities-mobile-rate-filter-panel .popup-filter-option.active,\n  .activities-mobile-rate-filter-panel .activities-view-option.active {\n    box-shadow: inset 0 0 0 1px rgba(24, 46, 76, 0.24);\n    filter: brightness(0.95);\n  }\n  .popup-mobile-filter-panel .popup-filter-option .rate-filter-count-badge,\n  .popup-mobile-filter-panel .activities-view-option .rate-filter-count-badge,\n  .activities-mobile-filter-panel .popup-filter-option .rate-filter-count-badge,\n  .activities-mobile-filter-panel .activities-view-option .rate-filter-count-badge,\n  .activities-mobile-rate-filter-panel .popup-filter-option .rate-filter-count-badge,\n  .activities-mobile-rate-filter-panel .activities-view-option .rate-filter-count-badge {\n    margin-left: auto;\n    flex: 0 0 auto;\n  }\n  :host ::ng-deep .cdk-overlay-pane:has(.mat-mdc-select-panel.profile-bottom-sheet-panel) {\n    position: fixed !important;\n    left: 0 !important;\n    right: 0 !important;\n    bottom: 0 !important;\n    top: auto !important;\n    width: 100vw !important;\n    max-width: 100vw !important;\n    transform: none !important;\n  }\n  :host ::ng-deep .mat-mdc-select-panel.profile-bottom-sheet-panel {\n    width: 100vw !important;\n    max-width: 100vw !important;\n    max-height: min(54vh, 420px) !important;\n    margin: 0 !important;\n    border-radius: 16px 16px 0 0 !important;\n    border: 1px solid #d6deea;\n    border-bottom: 0;\n    box-shadow: 0 -14px 28px rgba(15, 29, 52, 0.24);\n    padding-top: 0.38rem;\n    padding-bottom: max(0.55rem, env(safe-area-inset-bottom));\n  }\n}\n.popup-view-fab {\n  height: 34px;\n  border: 1px solid rgba(39, 62, 94, 0.22);\n  border-radius: 999px;\n  background: #f3f7ff;\n  color: #2c4c74;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.25rem;\n  padding: 0 0.62rem;\n  cursor: pointer;\n}\n.popup-view-fab .mat-icon {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n}\n.popup-view-fab span {\n  font-size: 0.74rem;\n  font-weight: 700;\n  white-space: nowrap;\n}\n.event-visibility-picker {\n  position: relative;\n  z-index: 22;\n  margin-left: auto;\n  flex: 0 0 auto;\n}\n.event-visibility-trigger {\n  flex-wrap: nowrap;\n}\n.profile-status-header-picker .event-visibility-trigger.status-public,\n.profile-status-header-picker .activities-view-option.status-public {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #e6f6ef);\n}\n.profile-status-header-picker .event-visibility-trigger.status-friends,\n.profile-status-header-picker .activities-view-option.status-friends {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #e8f1fd);\n}\n.profile-status-header-picker .event-visibility-trigger.status-host,\n.profile-status-header-picker .activities-view-option.status-host {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #f6efe2);\n}\n.profile-status-header-picker .event-visibility-trigger.status-inactive,\n.profile-status-header-picker .activities-view-option.status-inactive {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #f2f3f5);\n}\n.profile-status-header-picker .event-visibility-trigger .mat-icon.status-public,\n.profile-status-header-picker .activities-view-option.status-public .mat-icon {\n  color: #2f8f66;\n}\n.profile-status-header-picker .event-visibility-trigger .mat-icon.status-friends,\n.profile-status-header-picker .activities-view-option.status-friends .mat-icon {\n  color: #1b57a1;\n}\n.profile-status-header-picker .event-visibility-trigger .mat-icon.status-host,\n.profile-status-header-picker .activities-view-option.status-host .mat-icon {\n  color: #87580f;\n}\n.profile-status-header-picker .event-visibility-trigger .mat-icon.status-inactive,\n.profile-status-header-picker .activities-view-option.status-inactive .mat-icon {\n  color: #5b6573;\n}\n.app-popup textarea,\n.app-popup input,\n.app-popup select,\n.popup-surface textarea,\n.popup-surface input,\n.popup-surface select,\n.experience-form-popup textarea,\n.experience-form-popup input,\n.experience-form-popup select,\n.mobile-profile-selector-sheet-wrap input {\n  width: 100%;\n  border: 1px solid rgba(15, 27, 47, 0.16);\n  border-radius: 10px;\n  padding: 0.48rem 0.56rem;\n  font: inherit;\n  color: var(--text-main);\n  background: #fff;\n}\n.app-popup textarea,\n.popup-surface textarea,\n.experience-form-popup textarea {\n  resize: vertical;\n}\n.app-popup textarea:focus,\n.app-popup input:focus,\n.app-popup select:focus,\n.popup-surface textarea:focus,\n.popup-surface input:focus,\n.popup-surface select:focus,\n.experience-form-popup textarea:focus,\n.experience-form-popup input:focus,\n.experience-form-popup select:focus,\n.mobile-profile-selector-sheet-wrap input:focus {\n  outline: 0;\n  border-color: rgba(52, 103, 182, 0.72);\n  box-shadow: 0 0 0 3px rgba(55, 116, 212, 0.14);\n}\n.popup-surface-form-grid,\n.experience-form-grid {\n  display: grid;\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n  max-width: none;\n  width: 100%;\n  margin: 0;\n  justify-content: stretch;\n  align-content: start;\n  align-items: start;\n  column-gap: 1rem;\n  row-gap: 0.9rem;\n}\n.popup-surface-form-grid label,\n.experience-form-grid label {\n  display: grid;\n  grid-template-rows: min-content;\n  gap: 0;\n  font-weight: 600;\n  color: rgba(26, 44, 69, 0.88);\n}\n.popup-surface-form-grid input,\n.experience-form-grid input {\n  min-height: 40px;\n  padding: 0.56rem 0.72rem;\n  font-size: 0.88rem;\n  line-height: 1.25;\n  box-sizing: border-box;\n}\n.popup-surface-form-grid textarea,\n.experience-form-grid textarea {\n  min-height: 96px;\n  padding: 0.56rem 0.72rem;\n  font-size: 0.88rem;\n  line-height: 1.25;\n  box-sizing: border-box;\n}\n.popup-surface-form-grid .profile-status-select-wrap.selector-like,\n.experience-form-grid .profile-status-select-wrap.selector-like {\n  min-height: 40px;\n  height: 40px;\n  box-sizing: border-box;\n}\n.popup-surface-form-grid .mat-mdc-select-trigger,\n.experience-form-grid .mat-mdc-select-trigger {\n  min-height: 32px;\n}\n.popup-surface-description-field,\n.experience-description-field {\n  grid-column: 1/-1;\n}\n.popup-surface-actions,\n.experience-form-actions {\n  justify-content: center;\n  padding-top: 0.2rem;\n}\n.popup-actions {\n  display: flex;\n  gap: 0.45rem;\n  flex-wrap: wrap;\n}\n.link-btn {\n  border: 1px solid var(--line-strong);\n  border-radius: 999px;\n  background: #fff;\n  color: #1f3350;\n  font: inherit;\n  font-size: 0.83rem;\n  padding: 0.38rem 0.76rem;\n  cursor: pointer;\n}\n.neutral-btn {\n  background: #f2f4fa;\n  border-color: rgba(23, 33, 54, 0.12);\n}\n.primary-btn {\n  background: #4776b7;\n  border-color: #4776b7;\n  color: #fff;\n}\n.profile-status-select-wrap .mat-icon,\n.date-picker-btn .mat-icon {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n  line-height: 16px;\n  color: #566b86;\n}\n.profile-status-select-wrap .mat-mdc-select {\n  min-width: 80px;\n  width: 100%;\n  font-size: 0.8rem;\n  font-weight: 700;\n  text-transform: lowercase;\n}\n.profile-status-select-wrap .mat-mdc-select-trigger {\n  width: 100%;\n  justify-content: flex-start;\n}\n.profile-status-select-wrap .mat-mdc-select-arrow-wrapper {\n  margin-left: auto;\n}\n.status-public {\n  color: #2f8f66;\n}\n.status-friends {\n  color: #1b57a1;\n}\n.status-host {\n  color: #87580f;\n}\n.status-inactive {\n  color: #5b6573;\n}\n.status-option-content .status-public {\n  color: #2f8f66;\n}\n.status-option-content .status-friends {\n  color: #1b57a1;\n}\n.status-option-content .status-host {\n  color: #87580f;\n}\n.status-option-content .status-inactive {\n  color: #5b6573;\n}\n.profile-status-select-wrap.status-public .status-option-content .mat-icon {\n  color: #2f8f66;\n}\n.profile-status-select-wrap.status-friends .status-option-content .mat-icon {\n  color: #1b57a1;\n}\n.profile-status-select-wrap.status-host .status-option-content .mat-icon {\n  color: #87580f;\n}\n.profile-status-select-wrap.status-inactive .status-option-content .mat-icon {\n  color: #5b6573;\n}\n.profile-details-values-btn .mat-icon {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n  line-height: 16px;\n  color: rgba(44, 67, 100, 0.72);\n}\n.profile-details-values-btn {\n  min-height: 36px;\n  height: 36px;\n  box-sizing: border-box;\n  padding-top: 0;\n  padding-bottom: 0;\n}\n.profile-details-values-btn .status-option-content.profile-details-selected-badges {\n  display: inline-grid;\n  grid-template-columns: minmax(0, 1fr) auto;\n  align-items: center;\n  column-gap: 0.26rem;\n  min-width: 0;\n  width: 100%;\n}\n.profile-details-values-btn.profile-details-values-tone-values .profile-details-inline-chip {\n  max-width: calc(100% - 2.6rem);\n}\n.profile-details-values-btn.profile-details-values-tone-interest .profile-details-inline-chip {\n  max-width: calc((100% - 3.2rem) / 2);\n}\n.profile-details-values-btn.profile-details-values-tone-values .profile-details-inline-overflow {\n  color: #1e6b5a;\n}\n.profile-details-values-btn.profile-details-values-tone-interest .profile-details-inline-overflow {\n  color: #2e5a90;\n}\n.values-header-chips {\n  display: flex;\n  align-items: center;\n  flex-wrap: wrap;\n  gap: 0.28rem;\n  flex: 0 0 100%;\n  margin-left: 0;\n  margin-top: 0.34rem;\n  max-width: 100%;\n  overflow: visible;\n  white-space: normal;\n  padding-bottom: 0;\n}\n.popup-title-values {\n  margin-right: 0.38rem;\n}\n.values-selected-chip {\n  border: 1px solid rgba(76, 99, 136, 0.3);\n  background:\n    linear-gradient(\n      180deg,\n      #f7f9ff 0%,\n      #eef3ff 100%);\n  color: #24416a;\n  border-radius: 999px;\n  min-height: 26px;\n  padding: 0.18rem 0.46rem;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.26rem;\n  font-size: 0.7rem;\n  font-weight: 700;\n  cursor: pointer;\n  flex: 0 0 auto;\n}\n.values-selected-chip .mat-icon {\n  width: 12px;\n  height: 12px;\n  font-size: 12px;\n  line-height: 12px;\n}\n.values-selected-chip.section-family {\n  background:\n    linear-gradient(\n      180deg,\n      #fff1ea 0%,\n      #ffe6dd 100%);\n  border-color: rgba(160, 90, 51, 0.32);\n  color: #8b4d2b;\n}\n.values-selected-chip.section-ambition {\n  background:\n    linear-gradient(\n      180deg,\n      #fff7e8 0%,\n      #ffefd7 100%);\n  border-color: rgba(160, 106, 20, 0.32);\n  color: #9a6614;\n}\n.values-selected-chip.section-lifestyle {\n  background:\n    linear-gradient(\n      180deg,\n      #eaf8f5 0%,\n      #e0f2ee 100%);\n  border-color: rgba(45, 125, 120, 0.32);\n  color: #2a6e6a;\n}\n.values-selected-chip.section-beliefs {\n  background:\n    linear-gradient(\n      180deg,\n      #f0ecff 0%,\n      #e8e1fa 100%);\n  border-color: rgba(95, 78, 160, 0.32);\n  color: #564793;\n}\n.values-selected-chip.section-social {\n  background:\n    linear-gradient(\n      180deg,\n      #ecf4ff 0%,\n      #e1ecfb 100%);\n  border-color: rgba(45, 94, 168, 0.32);\n  color: #2d5ea8;\n}\n.values-selected-chip.section-arts {\n  background:\n    linear-gradient(\n      180deg,\n      #f2edfb 0%,\n      #e9e2f9 100%);\n  border-color: rgba(103, 76, 164, 0.32);\n  color: #654ca1;\n}\n.values-selected-chip.section-food {\n  background:\n    linear-gradient(\n      180deg,\n      #fff4e8 0%,\n      #fee9d6 100%);\n  border-color: rgba(170, 97, 28, 0.32);\n  color: #9d611c;\n}\n.values-selected-chip.section-active {\n  background:\n    linear-gradient(\n      180deg,\n      #edf8ee 0%,\n      #e2f1e4 100%);\n  border-color: rgba(44, 126, 72, 0.32);\n  color: #2d7d47;\n}\n.values-selected-chip.section-mind {\n  background:\n    linear-gradient(\n      180deg,\n      #eaf8f6 0%,\n      #def1ee 100%);\n  border-color: rgba(37, 124, 118, 0.32);\n  color: #2d7d78;\n}\n.values-selected-chip.section-identity {\n  background:\n    linear-gradient(\n      180deg,\n      #f4f0ff 0%,\n      #e9e3fb 100%);\n  border-color: rgba(88, 78, 159, 0.32);\n  color: #5a4ea0;\n}\n.readonly-select {\n  width: fit-content;\n  min-width: 0;\n  max-width: 130px;\n  justify-content: center;\n  margin-top: 2px;\n  padding-left: 0.44rem;\n  padding-right: 0.44rem;\n}\n.readonly-field {\n  min-height: 34px;\n  border: 1px solid rgba(15, 27, 47, 0.16);\n  border-radius: 10px;\n  padding: 0.4rem 0.56rem;\n  background: #f7fafe;\n  color: #23476f;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.26rem;\n  font-weight: 700;\n}\n.readonly-field .mat-icon {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n  line-height: 16px;\n}\n.zodiac-symbol {\n  font-size: 1.1rem;\n  font-weight: 800;\n  line-height: 1;\n}\n.zodiac-label {\n  font-size: 0.9rem;\n  font-weight: 700;\n  min-width: 0;\n  text-align: center;\n}\n.readonly-select.zodiac-aries {\n  background: #fdf1f1;\n  color: #9f2f2f;\n}\n.readonly-select.zodiac-taurus {\n  background: #f7f3eb;\n  color: #6e4b2b;\n}\n.readonly-select.zodiac-gemini {\n  background: #fdf8e9;\n  color: #7d5a12;\n}\n.readonly-select.zodiac-cancer {\n  background: #eef4ff;\n  color: #2d5b8e;\n}\n.readonly-select.zodiac-leo {\n  background: #fff3e8;\n  color: #8f4b0d;\n}\n.readonly-select.zodiac-virgo {\n  background: #edf8ef;\n  color: #2b6b3d;\n}\n.readonly-select.zodiac-libra {\n  background: #f2eefc;\n  color: #60439d;\n}\n.readonly-select.zodiac-scorpio {\n  background: #f9edf2;\n  color: #7b3150;\n}\n.readonly-select.zodiac-sagittarius {\n  background: #eef1ff;\n  color: #2f4a9a;\n}\n.readonly-select.zodiac-capricorn {\n  background: #eff2f5;\n  color: #364653;\n}\n.readonly-select.zodiac-aquarius {\n  background: #ebf7fb;\n  color: #1d5f7a;\n}\n.readonly-select.zodiac-pisces {\n  background: #eef2ff;\n  color: #294b8f;\n}\n.physique-slim {\n  color: #3f7ab3;\n}\n.physique-lean {\n  color: #3f8f5f;\n}\n.physique-athletic {\n  color: #2f7e4d;\n}\n.physique-fit {\n  color: #465fbb;\n}\n.physique-curvy {\n  color: #a14875;\n}\n.physique-muscular {\n  color: #7d4f24;\n}\n.physique-average {\n  color: #4d667f;\n}\n.physique-select-wrap.physique-slim {\n  background:\n    linear-gradient(\n      180deg,\n      #eaf3fb 0%,\n      #dfebf8 100%);\n  border-color: rgba(63, 122, 179, 0.34);\n}\n.physique-select-wrap.physique-lean {\n  background:\n    linear-gradient(\n      180deg,\n      #eaf6ee 0%,\n      #def0e5 100%);\n  border-color: rgba(63, 143, 95, 0.34);\n}\n.physique-select-wrap.physique-athletic {\n  background:\n    linear-gradient(\n      180deg,\n      #e8f5ec 0%,\n      #dff0e6 100%);\n  border-color: rgba(47, 126, 77, 0.34);\n}\n.physique-select-wrap.physique-fit {\n  background:\n    linear-gradient(\n      180deg,\n      #ebf0ff 0%,\n      #e1e8fc 100%);\n  border-color: rgba(70, 95, 187, 0.34);\n}\n.physique-select-wrap.physique-curvy {\n  background:\n    linear-gradient(\n      180deg,\n      #f7edf3 0%,\n      #f0e3ec 100%);\n  border-color: rgba(161, 72, 117, 0.36);\n}\n.physique-select-wrap.physique-muscular {\n  background:\n    linear-gradient(\n      180deg,\n      #f6efe9 0%,\n      #ede3d8 100%);\n  border-color: rgba(125, 79, 36, 0.36);\n}\n.physique-select-wrap.physique-average {\n  background:\n    linear-gradient(\n      180deg,\n      #eef2f6 0%,\n      #e5ebf1 100%);\n  border-color: rgba(77, 102, 127, 0.34);\n}\n.physique-select-wrap.physique-slim .status-option-content .mat-icon {\n  color: #3f7ab3;\n}\n.physique-select-wrap.physique-lean .status-option-content .mat-icon {\n  color: #3f8f5f;\n}\n.physique-select-wrap.physique-athletic .status-option-content .mat-icon {\n  color: #2f7e4d;\n}\n.physique-select-wrap.physique-fit .status-option-content .mat-icon {\n  color: #465fbb;\n}\n.physique-select-wrap.physique-curvy .status-option-content .mat-icon {\n  color: #a14875;\n}\n.physique-select-wrap.physique-muscular .status-option-content .mat-icon {\n  color: #7d4f24;\n}\n.physique-select-wrap.physique-average .status-option-content .mat-icon {\n  color: #4d667f;\n}\n.experience-filter-all {\n  color: #694ea6;\n}\n.experience-filter-workspace {\n  color: #a1485a;\n}\n.experience-filter-school {\n  color: #2d5ea8;\n}\n.experience-filter-online {\n  color: #2d7d47;\n}\n.experience-filter-project {\n  color: #6550a0;\n}\n.experience-filter-select.experience-filter-all,\n.experience-type-select.experience-filter-project {\n  background:\n    linear-gradient(\n      180deg,\n      #efe8ff 0%,\n      #e8defc 100%);\n  border-color: rgba(103, 76, 164, 0.32);\n}\n.experience-filter-select.experience-filter-workspace,\n.experience-type-select.experience-filter-workspace {\n  background:\n    linear-gradient(\n      180deg,\n      #fff1f3 0%,\n      #ffe6ea 100%);\n  border-color: rgba(169, 72, 90, 0.32);\n}\n.experience-filter-select.experience-filter-school,\n.experience-type-select.experience-filter-school {\n  background:\n    linear-gradient(\n      180deg,\n      #eaf4ff 0%,\n      #e1ecfb 100%);\n  border-color: rgba(45, 94, 168, 0.32);\n}\n.experience-type-select.experience-filter-online {\n  background:\n    linear-gradient(\n      180deg,\n      #edf8ee 0%,\n      #e2f1e4 100%);\n  border-color: rgba(44, 126, 72, 0.32);\n}\n.experience-type-select.experience-filter-project {\n  background:\n    linear-gradient(\n      180deg,\n      #f4f0ff 0%,\n      #e9e3fb 100%);\n}\n.experience-type-select {\n  min-width: 0;\n  max-width: 100%;\n  min-height: 40px;\n}\n.experience-type-field,\n.experience-title-field,\n.experience-city-field {\n  width: 100%;\n  justify-self: stretch;\n}\n.experience-org-field {\n  width: 100%;\n  justify-self: stretch;\n}\n.experience-type-select {\n  width: 100%;\n}\n.experience-date-range-field {\n  width: 100%;\n  max-width: none;\n  margin: 0;\n  background: transparent;\n}\n.experience-date-range-label {\n  grid-column: 1/2;\n  width: 100%;\n  justify-self: stretch;\n}\n.experience-date-range-field .mat-mdc-text-field-wrapper {\n  min-height: 42px;\n  border-radius: 10px;\n  background: #fff;\n  border: 1px solid rgba(136, 156, 186, 0.5);\n  box-shadow: none;\n}\n.experience-date-range-field .mat-mdc-form-field-subscript-wrapper {\n  margin-top: 0.24rem;\n}\n.experience-date-range-field input {\n  border: 0 !important;\n  box-shadow: none !important;\n  border-radius: 0 !important;\n  background: transparent !important;\n  min-width: 0;\n  width: 100%;\n  padding: 0 !important;\n  min-height: 0 !important;\n  height: auto !important;\n  line-height: 1.25;\n}\n.experience-date-range-field .mat-datepicker-toggle {\n  margin-right: 0.2rem;\n}\n.experience-date-range-field .mat-mdc-form-field-hint-wrapper,\n.experience-date-range-field .mat-mdc-form-field-hint {\n  color: rgba(30, 49, 74, 0.65);\n  font-size: 0.72rem;\n}\n.experience-date-range-field .mat-date-range-input-container {\n  width: 100%;\n  display: grid;\n  grid-template-columns: minmax(96px, 1fr) auto minmax(96px, 1fr);\n  align-items: center;\n  column-gap: 0.34rem;\n  min-width: 0;\n}\n.experience-date-range-field .mat-date-range-input-separator {\n  margin: 0 0.28rem;\n  flex: 0 0 auto;\n  white-space: nowrap;\n}\n.experience-date-range-field .mat-date-range-input-start-wrapper,\n.experience-date-range-field .mat-date-range-input-end-wrapper {\n  width: 100%;\n  max-width: 100%;\n  overflow: visible;\n  min-width: 0;\n}\n.experience-date-range-field .mat-date-range-input-inner {\n  font-size: 0.96rem;\n  min-width: 0 !important;\n  width: 100% !important;\n  text-overflow: clip;\n  white-space: nowrap;\n  line-height: 1.25;\n}\n.experience-date-range-field .mat-mdc-form-field-flex {\n  min-width: 0;\n  border-bottom: 0 !important;\n  box-shadow: none !important;\n  align-items: center !important;\n}\n.experience-date-range-field .mat-mdc-form-field-infix {\n  padding-top: 0 !important;\n  padding-bottom: 0 !important;\n  min-height: 34px !important;\n  height: 34px;\n  display: flex;\n  align-items: center;\n}\n.experience-date-range-field .mdc-line-ripple,\n.experience-date-range-field .mat-mdc-form-field-line-ripple,\n.experience-date-range-field .mdc-line-ripple--deactivating,\n.experience-date-range-field .mdc-line-ripple--active {\n  display: none !important;\n  opacity: 0 !important;\n  transform: scaleX(0) !important;\n}\n:host ::ng-deep .mat-mdc-option.status-option.experience-filter-all {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #efe8ff);\n}\n:host ::ng-deep .mat-mdc-option.status-option.experience-filter-workspace {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #fff1f3);\n}\n:host ::ng-deep .mat-mdc-option.status-option.experience-filter-school {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #eaf4ff);\n}\n:host ::ng-deep .mat-mdc-option.status-option.experience-filter-online {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #edf8ee);\n}\n:host ::ng-deep .mat-mdc-option.status-option.experience-filter-project {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #f4f0ff);\n}\n.mobile-profile-language-chip.language-tone-1,\n.mobile-profile-selector-option.language-tone-1,\n:host ::ng-deep .mat-mdc-option.language-tone-1 {\n  background: #eaf4ff;\n  border-color: rgba(63, 122, 179, 0.34);\n  color: #2f6090;\n}\n.mobile-profile-language-chip.language-tone-2,\n.mobile-profile-selector-option.language-tone-2,\n:host ::ng-deep .mat-mdc-option.language-tone-2 {\n  background: #edf8f4;\n  border-color: rgba(75, 127, 113, 0.34);\n  color: #2f695b;\n}\n.mobile-profile-language-chip.language-tone-3,\n.mobile-profile-selector-option.language-tone-3,\n:host ::ng-deep .mat-mdc-option.language-tone-3 {\n  background: #f1f2ff;\n  border-color: rgba(70, 95, 187, 0.34);\n  color: #394f9c;\n}\n.mobile-profile-language-chip.language-tone-4,\n.mobile-profile-selector-option.language-tone-4,\n:host ::ng-deep .mat-mdc-option.language-tone-4 {\n  background: #fff2f8;\n  border-color: rgba(161, 72, 117, 0.34);\n  color: #8d3f66;\n}\n.mobile-profile-language-chip.language-tone-5,\n.mobile-profile-selector-option.language-tone-5,\n:host ::ng-deep .mat-mdc-option.language-tone-5 {\n  background: #fbf4ea;\n  border-color: rgba(125, 79, 36, 0.34);\n  color: #704822;\n}\n.mobile-profile-language-chip.language-tone-6,\n.mobile-profile-selector-option.language-tone-6,\n:host ::ng-deep .mat-mdc-option.language-tone-6 {\n  background: #eff4f9;\n  border-color: rgba(77, 102, 127, 0.34);\n  color: #415872;\n}\n.mobile-profile-language-chip.language-tone-7,\n.mobile-profile-selector-option.language-tone-7,\n:host ::ng-deep .mat-mdc-option.language-tone-7 {\n  background: #f7f5ea;\n  border-color: rgba(128, 109, 66, 0.34);\n  color: #746237;\n}\n.mobile-profile-language-chip.language-tone-8,\n.mobile-profile-selector-option.language-tone-8,\n:host ::ng-deep .mat-mdc-option.language-tone-8 {\n  background: #edf5ff;\n  border-color: rgba(45, 122, 160, 0.34);\n  color: #2f6782;\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-1 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #eaf2ff);\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-2 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #ebf7ef);\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-3 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #fff1e3);\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-4 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #efecfc);\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-5 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #f3f8e9);\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-6 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #fceef3);\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-7 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #edf7ff);\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-8 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #f6f2e9);\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-1 .status-option-content {\n  color: #2d63a9;\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-2 .status-option-content {\n  color: #2a7a49;\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-3 .status-option-content {\n  color: #9b6018;\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-4 .status-option-content {\n  color: #6153a2;\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-5 .status-option-content {\n  color: #61812a;\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-6 .status-option-content {\n  color: #9f446d;\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-7 .status-option-content {\n  color: #2e7898;\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-8 .status-option-content {\n  color: #806c3f;\n}\n.mobile-profile-selector-option.detail-tone-1 {\n  background:\n    linear-gradient(\n      180deg,\n      #eef5ff 0%,\n      #e3eefc 100%);\n  border-color: rgba(46, 102, 181, 0.32);\n}\n.mobile-profile-selector-option.detail-tone-2 {\n  background:\n    linear-gradient(\n      180deg,\n      #eef9f3 0%,\n      #e3f4ea 100%);\n  border-color: rgba(40, 125, 72, 0.32);\n}\n.mobile-profile-selector-option.detail-tone-3 {\n  background:\n    linear-gradient(\n      180deg,\n      #fff4ea 0%,\n      #ffecdd 100%);\n  border-color: rgba(165, 94, 24, 0.32);\n}\n.mobile-profile-selector-option.detail-tone-4 {\n  background:\n    linear-gradient(\n      180deg,\n      #f2f1ff 0%,\n      #e8e5fb 100%);\n  border-color: rgba(97, 82, 164, 0.32);\n}\n.mobile-profile-selector-option.detail-tone-5 {\n  background:\n    linear-gradient(\n      180deg,\n      #f6f9ef 0%,\n      #edf3e1 100%);\n  border-color: rgba(95, 128, 36, 0.32);\n}\n.mobile-profile-selector-option.detail-tone-6 {\n  background:\n    linear-gradient(\n      180deg,\n      #fff1f4 0%,\n      #f9e6ed 100%);\n  border-color: rgba(160, 70, 111, 0.32);\n}\n.mobile-profile-selector-option.detail-tone-7 {\n  background:\n    linear-gradient(\n      180deg,\n      #edf8ff 0%,\n      #e2f0fb 100%);\n  border-color: rgba(45, 122, 160, 0.32);\n}\n.mobile-profile-selector-option.detail-tone-8 {\n  background:\n    linear-gradient(\n      180deg,\n      #f6f3ea 0%,\n      #eee9dc 100%);\n  border-color: rgba(128, 109, 66, 0.32);\n}\n.mobile-profile-selector-option.status-public {\n  background:\n    linear-gradient(\n      180deg,\n      #e6f6ef 0%,\n      #d9f0e6 100%);\n  border-color: rgba(47, 143, 102, 0.34);\n}\n.mobile-profile-selector-option.status-friends {\n  background:\n    linear-gradient(\n      180deg,\n      #e8f1fd 0%,\n      #dfeaf9 100%);\n  border-color: rgba(27, 87, 161, 0.34);\n}\n.mobile-profile-selector-option.status-host {\n  background:\n    linear-gradient(\n      180deg,\n      #f6efe2 0%,\n      #eee4d2 100%);\n  border-color: rgba(135, 88, 15, 0.36);\n}\n.mobile-profile-selector-option.status-inactive {\n  background:\n    linear-gradient(\n      180deg,\n      #f2f3f5 0%,\n      #e8ebef 100%);\n  border-color: rgba(91, 101, 115, 0.32);\n}\n.mobile-profile-selector-option.physique-slim {\n  background: #eaf4ff;\n  border-color: rgba(63, 122, 179, 0.34);\n}\n.mobile-profile-selector-option.physique-lean {\n  background: #edf8f4;\n  border-color: rgba(75, 127, 113, 0.34);\n}\n.mobile-profile-selector-option.physique-athletic {\n  background: #e8f5ec;\n  border-color: rgba(47, 126, 77, 0.34);\n}\n.mobile-profile-selector-option.physique-fit {\n  background: #f1f2ff;\n  border-color: rgba(70, 95, 187, 0.34);\n}\n.mobile-profile-selector-option.physique-curvy {\n  background: #fff2f8;\n  border-color: rgba(161, 72, 117, 0.34);\n}\n.mobile-profile-selector-option.physique-muscular {\n  background: #fbf4ea;\n  border-color: rgba(125, 79, 36, 0.34);\n}\n.mobile-profile-selector-option.physique-average {\n  background: #eff4f9;\n  border-color: rgba(77, 102, 127, 0.34);\n}\n.popup-panel-profile-selector .values-selector-popup.profile-selector-popup {\n  gap: 0.56rem;\n}\n.popup-panel-profile-selector .profile-filter-selector-head {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.44rem;\n  padding-bottom: 0.22rem;\n  border-bottom: 1px solid rgba(74, 102, 139, 0.22);\n}\n.popup-panel-profile-selector .profile-filter-selector-head-label {\n  color: #203c64;\n  font-size: 0.82rem;\n  font-weight: 800;\n  line-height: 1.2;\n}\n.popup-panel-profile-selector .profile-filter-selector-clear {\n  border: 1px solid rgba(41, 73, 110, 0.24);\n  border-radius: 999px;\n  background: rgba(255, 255, 255, 0.82);\n  color: #284970;\n  font: inherit;\n  font-size: 0.72rem;\n  font-weight: 700;\n  line-height: 1;\n  padding: 0.3rem 0.52rem;\n  cursor: pointer;\n}\n.popup-panel-profile-selector .profile-filter-selector-clear.is-hidden {\n  visibility: hidden;\n  pointer-events: none;\n}\n.popup-panel-profile-selector .profile-filter-selector-selected {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 0.34rem;\n}\n.popup-panel-profile-selector .profile-filter-selector-chip {\n  border: 1px solid rgba(35, 68, 107, 0.24);\n  border-radius: 999px;\n  background: rgba(255, 255, 255, 0.92);\n  color: #234368;\n  font: inherit;\n  font-size: 0.72rem;\n  font-weight: 700;\n  line-height: 1;\n  padding: 0.26rem 0.48rem;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.16rem;\n  cursor: pointer;\n}\n.popup-panel-profile-selector .profile-filter-selector-chip .mat-icon {\n  width: 13px;\n  height: 13px;\n  font-size: 13px;\n  line-height: 13px;\n}\n.popup-panel-profile-selector .profile-filter-selector-empty {\n  margin: 0;\n  font-size: 0.74rem;\n  color: rgba(31, 54, 86, 0.62);\n  font-style: italic;\n}\n.popup-panel-profile-selector .profile-selector-option-group {\n  display: grid;\n  gap: 0.34rem;\n  border: 1px solid transparent;\n  border-radius: 12px;\n  padding: 0.4rem 0.42rem;\n}\n.popup-panel-profile-selector .profile-selector-option-group-head {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.34rem;\n}\n.popup-panel-profile-selector .profile-selector-option-group-tag {\n  border-radius: 999px;\n  border: 1px solid rgba(52, 86, 128, 0.28);\n  background: rgba(255, 255, 255, 0.74);\n  color: #2f527d;\n  font-size: 0.67rem;\n  font-weight: 800;\n  letter-spacing: 0.02em;\n  line-height: 1;\n  padding: 0.2rem 0.52rem;\n  text-transform: uppercase;\n  white-space: nowrap;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.24rem;\n}\n.popup-panel-profile-selector .profile-selector-option-group-tag-icon {\n  width: 12px;\n  height: 12px;\n  font-size: 12px;\n  line-height: 12px;\n}\n.popup-panel-profile-selector .profile-selector-option-group-line {\n  display: block;\n  width: 100%;\n  height: 1px;\n  background: rgba(84, 111, 147, 0.34);\n}\n.popup-panel-profile-selector .profile-selector-chip-grid {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 0.36rem;\n}\n.popup-panel-profile-selector .profile-selector-chip {\n  border: 1px solid rgba(41, 70, 106, 0.22);\n  border-radius: 999px;\n  background: #f4f8ff;\n  color: #234066;\n  font: inherit;\n  font-size: 0.78rem;\n  font-weight: 700;\n  padding: 0.3rem 0.58rem;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.26rem;\n  cursor: pointer;\n  transition:\n    background-color 0.14s ease,\n    border-color 0.14s ease,\n    color 0.14s ease,\n    box-shadow 0.14s ease;\n}\n.popup-panel-profile-selector .profile-selector-chip.active {\n  border-color: rgba(27, 85, 158, 0.5);\n  background:\n    linear-gradient(\n      180deg,\n      #dcebff 0%,\n      #cfe3ff 100%);\n  color: #123e70;\n  box-shadow: inset 0 0 0 1px rgba(30, 73, 127, 0.24), 0 1px 2px rgba(24, 53, 86, 0.16);\n}\n.popup-panel-profile-selector .profile-selector-option-group.section-family {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 232, 219, 0.52) 0%,\n      rgba(255, 232, 219, 0.3) 100%);\n}\n.popup-panel-profile-selector .profile-selector-option-group.section-ambition {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 242, 216, 0.52) 0%,\n      rgba(255, 242, 216, 0.3) 100%);\n}\n.popup-panel-profile-selector .profile-selector-option-group.section-lifestyle {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(221, 241, 239, 0.56) 0%,\n      rgba(221, 241, 239, 0.32) 100%);\n}\n.popup-panel-profile-selector .profile-selector-option-group.section-beliefs {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(230, 226, 250, 0.56) 0%,\n      rgba(230, 226, 250, 0.32) 100%);\n}\n.popup-panel-profile-selector .profile-selector-option-group.section-social {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(223, 236, 255, 0.5) 0%,\n      rgba(223, 236, 255, 0.28) 100%);\n}\n.popup-panel-profile-selector .profile-selector-option-group.section-arts {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(235, 227, 255, 0.5) 0%,\n      rgba(235, 227, 255, 0.28) 100%);\n}\n.popup-panel-profile-selector .profile-selector-option-group.section-food {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 236, 221, 0.52) 0%,\n      rgba(255, 236, 221, 0.3) 100%);\n}\n.popup-panel-profile-selector .profile-selector-option-group.section-active {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(222, 243, 231, 0.56) 0%,\n      rgba(222, 243, 231, 0.32) 100%);\n}\n.popup-panel-profile-selector .profile-selector-option-group.section-mind {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(219, 242, 238, 0.56) 0%,\n      rgba(219, 242, 238, 0.32) 100%);\n}\n.popup-panel-profile-selector .profile-selector-option-group.section-identity {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(230, 226, 250, 0.56) 0%,\n      rgba(230, 226, 250, 0.32) 100%);\n}\n.popup-panel-profile-selector .profile-selector-option-group-tag.section-family {\n  border-color: rgba(156, 94, 51, 0.34);\n  color: #9c5e33;\n}\n.popup-panel-profile-selector .profile-selector-option-group-tag.section-ambition {\n  border-color: rgba(160, 106, 20, 0.34);\n  color: #9b6717;\n}\n.popup-panel-profile-selector .profile-selector-option-group-tag.section-lifestyle {\n  border-color: rgba(47, 123, 119, 0.34);\n  color: #2f7b77;\n}\n.popup-panel-profile-selector .profile-selector-option-group-tag.section-beliefs {\n  border-color: rgba(95, 78, 160, 0.34);\n  color: #5f4ea0;\n}\n.popup-panel-profile-selector .profile-selector-option-group-tag.section-social {\n  border-color: rgba(47, 106, 175, 0.36);\n  color: #2f6aaf;\n}\n.popup-panel-profile-selector .profile-selector-option-group-tag.section-arts {\n  border-color: rgba(106, 87, 168, 0.36);\n  color: #6a57a8;\n}\n.popup-panel-profile-selector .profile-selector-option-group-tag.section-food {\n  border-color: rgba(170, 97, 28, 0.34);\n  color: #a55e18;\n}\n.popup-panel-profile-selector .profile-selector-option-group-tag.section-active {\n  border-color: rgba(49, 124, 82, 0.36);\n  color: #317c52;\n}\n.popup-panel-profile-selector .profile-selector-option-group-tag.section-mind {\n  border-color: rgba(37, 124, 118, 0.34);\n  color: #2b7c76;\n}\n.popup-panel-profile-selector .profile-selector-option-group-tag.section-identity {\n  border-color: rgba(98, 84, 163, 0.34);\n  color: #6254a3;\n}\n.popup-panel-profile-selector .profile-selector-option-group-line.section-family {\n  background: rgba(156, 94, 51, 0.3);\n}\n.popup-panel-profile-selector .profile-selector-option-group-line.section-ambition {\n  background: rgba(160, 106, 20, 0.32);\n}\n.popup-panel-profile-selector .profile-selector-option-group-line.section-lifestyle {\n  background: rgba(47, 123, 119, 0.3);\n}\n.popup-panel-profile-selector .profile-selector-option-group-line.section-beliefs {\n  background: rgba(95, 78, 160, 0.3);\n}\n.popup-panel-profile-selector .profile-selector-option-group-line.section-social {\n  background: rgba(47, 106, 175, 0.34);\n}\n.popup-panel-profile-selector .profile-selector-option-group-line.section-arts {\n  background: rgba(106, 87, 168, 0.34);\n}\n.popup-panel-profile-selector .profile-selector-option-group-line.section-food {\n  background: rgba(170, 97, 28, 0.32);\n}\n.popup-panel-profile-selector .profile-selector-option-group-line.section-active {\n  background: rgba(49, 124, 82, 0.34);\n}\n.popup-panel-profile-selector .profile-selector-option-group-line.section-mind {\n  background: rgba(37, 124, 118, 0.34);\n}\n.popup-panel-profile-selector .profile-selector-option-group-line.section-identity {\n  background: rgba(98, 84, 163, 0.3);\n}\n:host ::ng-deep .mat-mdc-option.mdc-list-item--selected:not(.mdc-list-item--disabled):not(.status-option) {\n  background: #f0f5fc;\n}\n:host ::ng-deep .mat-mdc-option.status-option.mdc-list-item--selected:not(.mdc-list-item--disabled) {\n  filter: brightness(0.95);\n  box-shadow: inset 0 0 0 1px rgba(24, 46, 76, 0.2);\n}\n:host ::ng-deep .mat-mdc-option.status-option {\n  background: #fff;\n}\n:host ::ng-deep .mat-mdc-option.status-option:not(:last-child) {\n  border-bottom: 1px solid #e6edf7;\n}\n:host ::ng-deep .selector-options-panel .mat-mdc-option.hide-selected-option,\n:host ::ng-deep .status-options-panel .mat-mdc-option.hide-selected-option {\n  min-height: 0 !important;\n  height: 0 !important;\n  padding-top: 0 !important;\n  padding-bottom: 0 !important;\n  border: 0 !important;\n  margin: 0 !important;\n  opacity: 0 !important;\n  pointer-events: none !important;\n  overflow: hidden !important;\n}\n:host ::ng-deep .selector-options-panel .mat-mdc-option {\n  background: #fff;\n}\n:host ::ng-deep .mat-mdc-select-panel.selector-options-panel,\n:host ::ng-deep .mat-mdc-select-panel.status-options-panel {\n  margin-top: 8px !important;\n  margin-bottom: 8px !important;\n}\n:host ::ng-deep .mat-mdc-select-panel.selector-options-panel.mat-mdc-select-panel-above,\n:host ::ng-deep .mat-mdc-select-panel.status-options-panel.mat-mdc-select-panel-above,\n:host ::ng-deep .cdk-overlay-pane .mat-mdc-select-panel.selector-options-panel.mat-mdc-select-panel-above,\n:host ::ng-deep .cdk-overlay-pane .mat-mdc-select-panel.status-options-panel.mat-mdc-select-panel-above {\n  margin-top: 0 !important;\n  margin-bottom: 18px !important;\n  transform: translateY(-10px) !important;\n}\n:host ::ng-deep .selector-options-panel .mat-mdc-option.status-option.status-public,\n:host ::ng-deep .status-options-panel .mat-mdc-option.status-option.status-public {\n  --mdc-list-list-item-container-color: #def3e9;\n  --mat-mdc-option-selected-container-color: #def3e9;\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #def3e9) !important;\n}\n:host ::ng-deep .selector-options-panel .mat-mdc-option.status-option.status-friends,\n:host ::ng-deep .status-options-panel .mat-mdc-option.status-option.status-friends {\n  --mdc-list-list-item-container-color: #e3eefb;\n  --mat-mdc-option-selected-container-color: #e3eefb;\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #e3eefb) !important;\n}\n:host ::ng-deep .selector-options-panel .mat-mdc-option.status-option.status-host,\n:host ::ng-deep .status-options-panel .mat-mdc-option.status-option.status-host {\n  --mdc-list-list-item-container-color: #f3ead8;\n  --mat-mdc-option-selected-container-color: #f3ead8;\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #f3ead8) !important;\n}\n:host ::ng-deep .selector-options-panel .mat-mdc-option.status-option.status-inactive,\n:host ::ng-deep .status-options-panel .mat-mdc-option.status-option.status-inactive {\n  --mdc-list-list-item-container-color: #eceff3;\n  --mat-mdc-option-selected-container-color: #eceff3;\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #eceff3) !important;\n}\n:host ::ng-deep .selector-options-panel .mat-mdc-option.status-option.status-public .status-option-content,\n:host ::ng-deep .selector-options-panel .mat-mdc-option.status-option.status-public .status-option-content .mat-icon,\n:host ::ng-deep .status-options-panel .mat-mdc-option.status-option.status-public .status-option-content,\n:host ::ng-deep .status-options-panel .mat-mdc-option.status-option.status-public .status-option-content .mat-icon {\n  color: #2f8f66 !important;\n}\n:host ::ng-deep .selector-options-panel .mat-mdc-option.status-option.status-friends .status-option-content,\n:host ::ng-deep .selector-options-panel .mat-mdc-option.status-option.status-friends .status-option-content .mat-icon,\n:host ::ng-deep .status-options-panel .mat-mdc-option.status-option.status-friends .status-option-content,\n:host ::ng-deep .status-options-panel .mat-mdc-option.status-option.status-friends .status-option-content .mat-icon {\n  color: #1b57a1 !important;\n}\n:host ::ng-deep .selector-options-panel .mat-mdc-option.status-option.status-host .status-option-content,\n:host ::ng-deep .selector-options-panel .mat-mdc-option.status-option.status-host .status-option-content .mat-icon,\n:host ::ng-deep .status-options-panel .mat-mdc-option.status-option.status-host .status-option-content,\n:host ::ng-deep .status-options-panel .mat-mdc-option.status-option.status-host .status-option-content .mat-icon {\n  color: #87580f !important;\n}\n:host ::ng-deep .selector-options-panel .mat-mdc-option.status-option.status-inactive .status-option-content,\n:host ::ng-deep .selector-options-panel .mat-mdc-option.status-option.status-inactive .status-option-content .mat-icon,\n:host ::ng-deep .status-options-panel .mat-mdc-option.status-option.status-inactive .status-option-content,\n:host ::ng-deep .status-options-panel .mat-mdc-option.status-option.status-inactive .status-option-content .mat-icon {\n  color: #5b6573 !important;\n}\n:host ::ng-deep .mat-mdc-option.status-option.physique-slim {\n  background: #eaf4ff;\n}\n:host ::ng-deep .mat-mdc-option.status-option.physique-lean {\n  background: #edf8f4;\n}\n:host ::ng-deep .mat-mdc-option.status-option.physique-athletic {\n  background: #e8f5ec;\n}\n:host ::ng-deep .mat-mdc-option.status-option.physique-fit {\n  background: #f1f2ff;\n}\n:host ::ng-deep .mat-mdc-option.status-option.physique-curvy {\n  background: #fff2f8;\n}\n:host ::ng-deep .mat-mdc-option.status-option.physique-muscular {\n  background: #fbf4ea;\n}\n:host ::ng-deep .mat-mdc-option.status-option.physique-average {\n  background: #eff4f9;\n}\n:host ::ng-deep .mat-mdc-option.status-option.physique-slim .status-option-content {\n  color: #3f7ab3;\n}\n:host ::ng-deep .mat-mdc-option.status-option.physique-lean .status-option-content {\n  color: #3f8f5f;\n}\n:host ::ng-deep .mat-mdc-option.status-option.physique-athletic .status-option-content {\n  color: #2f7e4d;\n}\n:host ::ng-deep .mat-mdc-option.status-option.physique-fit .status-option-content {\n  color: #465fbb;\n}\n:host ::ng-deep .mat-mdc-option.status-option.physique-curvy .status-option-content {\n  color: #a14875;\n}\n:host ::ng-deep .mat-mdc-option.status-option.physique-muscular .status-option-content {\n  color: #7d4f24;\n}\n:host ::ng-deep .mat-mdc-option.status-option.physique-average .status-option-content {\n  color: #4d667f;\n}\n:host ::ng-deep .mat-mdc-select-panel.physique-options-panel {\n  width: auto !important;\n  max-width: 220px !important;\n  min-width: 0 !important;\n}\n:host ::ng-deep .physique-options-panel .mat-mdc-option {\n  padding-right: 8px;\n}\n:host ::ng-deep .physique-options-panel .mat-mdc-option .mat-pseudo-checkbox {\n  margin-left: 4px;\n}\n@media (max-width: 760px) {\n  .experience-form-grid {\n    grid-template-columns: 1fr;\n    max-width: none;\n    justify-content: stretch;\n    row-gap: 0.72rem;\n  }\n  .experience-date-range-label {\n    grid-column: 1/-1;\n  }\n  .experience-date-range-field .mat-date-range-input-container {\n    grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);\n  }\n  .profile-details-privacy-fab .privacy-fab-actions {\n    position: fixed;\n    left: 0.5rem;\n    right: 0.5rem;\n    bottom: max(0.5rem, env(safe-area-inset-bottom));\n    top: auto;\n    transform: translateY(12px) scale(0.98);\n    transform-origin: bottom center;\n    justify-content: center;\n    gap: 0.46rem;\n    padding: 0.46rem 0.56rem;\n    border: 1px solid rgba(42, 68, 102, 0.2);\n    border-radius: 14px;\n    background: #fff;\n    box-shadow: 0 -12px 24px rgba(18, 31, 51, 0.22);\n  }\n  .profile-details-privacy-fab.open .privacy-fab-actions {\n    transform: translateY(0) scale(1);\n  }\n}\n:host {\n  display: contents;\n}\n.event-tournament-groups-body {\n  flex: 1 1 auto;\n  height: 100%;\n  min-height: 0;\n  padding: 0.76rem 1rem 1rem;\n  overflow-y: auto;\n  overflow-x: hidden;\n  background:\n    linear-gradient(\n      180deg,\n      #eef7ff 0%,\n      #e7f2ff 100%);\n}\n.event-tournament-groups-accordion {\n  display: block;\n  max-width: 100%;\n}\n.event-tournament-groups-loading,\n.event-tournament-groups-empty {\n  min-height: 22rem;\n  display: grid;\n  place-items: center;\n  color: #25476c;\n}\n.event-tournament-group-content {\n  display: grid;\n  gap: 0.62rem;\n  min-width: 0;\n}\n.event-tournament-group-tabs {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.36rem;\n  justify-self: start;\n  padding: 0.18rem;\n  border: 1px solid rgba(67, 103, 146, 0.22);\n  border-radius: 999px;\n  background: rgba(255, 255, 255, 0.72);\n}\n.event-tournament-group-tabs button {\n  min-width: 0;\n  height: 2rem;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  gap: 0.3rem;\n  padding: 0 0.7rem;\n  border: 0;\n  border-radius: 999px;\n  background: transparent;\n  color: #31567b;\n  font-weight: 800;\n  font-size: 0.74rem;\n  cursor: pointer;\n}\n.event-tournament-group-tabs button.is-active {\n  background:\n    linear-gradient(\n      180deg,\n      #ffffff 0%,\n      #eaf3ff 100%);\n  color: #204f84;\n  box-shadow: 0 4px 12px rgba(34, 79, 132, 0.12);\n}\n.event-tournament-group-tabs .mat-icon {\n  width: 1rem;\n  height: 1rem;\n  font-size: 1rem;\n  line-height: 1rem;\n}\n.event-tournament-table-wrap {\n  width: 100%;\n  min-width: 0;\n  overflow-x: auto;\n  border: 1px solid rgba(67, 103, 146, 0.18);\n  border-radius: 8px;\n  background: rgba(255, 255, 255, 0.66);\n}\n.event-tournament-table {\n  width: 100%;\n  min-width: 560px;\n  border-collapse: collapse;\n  table-layout: fixed;\n}\n.event-tournament-table th,\n.event-tournament-table td {\n  padding: 0.5rem 0.48rem;\n  border-bottom: 1px solid rgba(67, 103, 146, 0.14);\n  color: #254568;\n  font-size: 0.78rem;\n  text-align: left;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.event-tournament-table th {\n  background: rgba(232, 242, 255, 0.86);\n  color: rgba(28, 56, 91, 0.88);\n  font-weight: 900;\n}\n.event-tournament-table th:first-child,\n.event-tournament-table td:first-child {\n  width: 2.4rem;\n  text-align: center;\n}\n.event-tournament-table th:last-child,\n.event-tournament-table td:last-child {\n  width: 2rem;\n  text-align: center;\n}\n.event-tournament-table tr {\n  cursor: pointer;\n}\n.event-tournament-table tr:active,\n.event-tournament-table tr:hover {\n  transform: none;\n}\n.event-tournament-table tr[data-member-palette=blue] {\n  --event-tournament-member-rgb:\n    63,\n    123,\n    200;\n}\n.event-tournament-table tr[data-member-palette=green] {\n  --event-tournament-member-rgb:\n    47,\n    143,\n    102;\n}\n.event-tournament-table tr[data-member-palette=amber] {\n  --event-tournament-member-rgb:\n    202,\n    132,\n    31;\n}\n.event-tournament-table tr[data-member-palette=violet] {\n  --event-tournament-member-rgb:\n    122,\n    76,\n    196;\n}\n.event-tournament-table tr[data-member-palette=cyan] {\n  --event-tournament-member-rgb:\n    45,\n    142,\n    154;\n}\n.event-tournament-table tr[data-member-palette=orange] {\n  --event-tournament-member-rgb:\n    205,\n    105,\n    35;\n}\n.event-tournament-table tr[data-member-palette=pink] {\n  --event-tournament-member-rgb:\n    190,\n    75,\n    137;\n}\n.event-tournament-table tr[data-member-palette=teal] {\n  --event-tournament-member-rgb:\n    45,\n    120,\n    130;\n}\n.event-tournament-table tbody tr[data-member-palette] td {\n  background: rgba(var(--event-tournament-member-rgb), 0.075);\n}\n.event-tournament-table tbody tr[data-member-palette] td:first-child {\n  box-shadow: inset 3px 0 0 rgba(var(--event-tournament-member-rgb), 0.68);\n  color: rgb(var(--event-tournament-member-rgb));\n  font-weight: 900;\n}\n.event-tournament-table tbody tr[data-participant-state=DQ] td:first-child {\n  color: #9b2538;\n  box-shadow: inset 3px 0 0 rgba(155, 37, 56, 0.72);\n}\n.event-tournament-table tbody tr[data-participant-state=R] td:first-child {\n  color: #8a5b11;\n  box-shadow: inset 3px 0 0 rgba(138, 91, 17, 0.72);\n}\n.event-tournament-table tbody tr[data-participant-state=V] td:first-child {\n  color: #687687;\n  box-shadow: inset 3px 0 0 rgba(104, 118, 135, 0.58);\n}\n.event-tournament-table tr.is-advance td {\n  background: rgba(61, 173, 99, 0.12);\n  font-weight: 800;\n}\n.event-tournament-table tr:focus-visible {\n  outline: 2px solid rgba(47, 111, 177, 0.42);\n  outline-offset: -2px;\n}\n@media (hover: hover) and (pointer: fine) {\n  .event-tournament-table tbody tr:hover td {\n    background: rgba(235, 244, 255, 0.88);\n  }\n  .event-tournament-table tbody tr[data-member-palette]:hover td {\n    background: rgba(var(--event-tournament-member-rgb), 0.18);\n  }\n}\n.event-tournament-table .mat-icon {\n  width: 1rem;\n  height: 1rem;\n  font-size: 1rem;\n  line-height: 1rem;\n  color: #356391;\n}\n.event-tournament-history {\n  display: grid;\n  gap: 0.5rem;\n  min-width: 0;\n}\n.event-tournament-history header {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  min-width: 0;\n}\n.event-tournament-history header strong {\n  color: #1f3f62;\n  font-size: 0.86rem;\n}\n.event-tournament-table-history {\n  min-width: 0;\n}\n.event-tournament-table-history th:first-child,\n.event-tournament-table-history td:first-child {\n  width: 4.5rem;\n  text-align: left;\n}\n.event-tournament-table-history th:last-child,\n.event-tournament-table-history td:last-child {\n  width: 7rem;\n  text-align: left;\n}\n.event-tournament-table-score-history td:first-child {\n  font-weight: 900;\n}\n.event-tournament-table-fifa-history th:nth-child(2),\n.event-tournament-table-fifa-history td:nth-child(2) {\n  width: 5.5rem;\n  text-align: center;\n}\n.event-tournament-history-empty {\n  margin: 0;\n  padding: 1rem;\n  border: 1px dashed rgba(67, 103, 146, 0.24);\n  border-radius: 8px;\n  color: rgba(37, 69, 104, 0.72);\n  text-align: center;\n  font-weight: 800;\n}\n.event-tournament-entry-flow {\n  display: block;\n  flex: 1 1 auto;\n  min-height: 13.4rem;\n  overflow: visible;\n}\n@media (max-width: 760px) {\n  .event-tournament-groups-body {\n    padding: 0.62rem;\n  }\n  .event-tournament-group-tabs {\n    width: 100%;\n    justify-content: stretch;\n  }\n  .event-tournament-group-tabs button {\n    flex: 1 1 0;\n  }\n  .event-tournament-table {\n    min-width: 520px;\n  }\n  .event-tournament-table.event-tournament-table-history {\n    min-width: 0;\n  }\n  .event-tournament-table-history th,\n  .event-tournament-table-history td {\n    padding: 0.42rem 0.3rem;\n    font-size: 0.69rem;\n  }\n  .event-tournament-table-history th:first-child,\n  .event-tournament-table-history td:first-child {\n    width: 3.6rem;\n  }\n  .event-tournament-table-history th:last-child,\n  .event-tournament-table-history td:last-child {\n    width: 6.1rem;\n  }\n  .event-tournament-table-fifa-history th:nth-child(2),\n  .event-tournament-table-fifa-history td:nth-child(2) {\n    width: 4.2rem;\n  }\n}\n/*# sourceMappingURL=event-tournament-groups-popup.component.css.map */\n'] }]
  }], () => [], { onEscape: [{
    type: HostListener,
    args: ["window:keydown.escape", ["$event"]]
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(EventTournamentGroupsPopupComponent, { className: "EventTournamentGroupsPopupComponent", filePath: "app/activity/components/event-tournament-groups-popup/event-tournament-groups-popup.component.ts", lineNumber: 148 });
})();
export {
  EventTournamentGroupsPopupComponent
};
//# sourceMappingURL=event-tournament-groups-popup.component-P3O47EDY.js.map
