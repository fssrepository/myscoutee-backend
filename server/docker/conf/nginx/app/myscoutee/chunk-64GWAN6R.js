import {
  SmartListComponent
} from "./chunk-IJVUZ62I.js";
import {
  FormFlowComponent
} from "./chunk-654Z7UJY.js";
import {
  SingleRowComponent,
  TextCardComponent
} from "./chunk-BEAS7CFC.js";
import {
  PopupComponent
} from "./chunk-3VXLUVWM.js";
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  NativeDateAdapter
} from "./chunk-VEYRCVMX.js";
import {
  AppMenuComponent,
  FormsModule,
  I18nPipe,
  NG_VALUE_ACCESSOR,
  NgControlStatus,
  NgModel
} from "./chunk-FOAFZS65.js";
import {
  DialogStore
} from "./chunk-6TR3Z2F3.js";
import {
  MatIcon,
  MatIconModule
} from "./chunk-EDHGCWPF.js";
import {
  UserExperiencesService
} from "./chunk-QE3AUXWT.js";
import {
  APP_STATIC_DATA
} from "./chunk-F4WY6ECV.js";
import {
  AppUtils
} from "./chunk-XQ4NDAVX.js";
import {
  CommonModule,
  NgClass
} from "./chunk-J7IJFFQ2.js";
import {
  ActivityEventDetailDTO
} from "./chunk-6POEHVT7.js";
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostListener,
  Injectable,
  Input,
  Output,
  ViewChild,
  __spreadProps,
  __spreadValues,
  forwardRef,
  from,
  inject,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵNgOnChangesFeature,
  ɵɵProvidersFeature,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵclassProp,
  ɵɵcomponentInstance,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵdefineInjectable,
  ɵɵdirectiveInject,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵgetInheritedFactory,
  ɵɵlistener,
  ɵɵloadQuery,
  ɵɵnextContext,
  ɵɵpipe,
  ɵɵpipeBind1,
  ɵɵproperty,
  ɵɵqueryRefresh,
  ɵɵreference,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIdentity,
  ɵɵresetView,
  ɵɵresolveDocument,
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
} from "./chunk-XJL7SWH7.js";

// src/app/shared/ui/components/core/form/inputs/slots-input/slots-input.component.ts
function SlotsInputComponent_Conditional_0_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 6);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.slotsPanelSubtitle());
  }
}
function SlotsInputComponent_Conditional_0_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 7)(1, "button", 10);
    \u0275\u0275pipe(2, "i18n");
    \u0275\u0275listener("click", function SlotsInputComponent_Conditional_0_Conditional_10_Template_button_click_1_listener($event) {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.toggleSlotsEnabled($event));
    });
    \u0275\u0275elementStart(3, "mat-icon");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "span");
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275classProp("event-slots-enable-btn-on", ctx_r0.slotsEnabled())("event-slots-enable-btn-off", !ctx_r0.slotsEnabled());
    \u0275\u0275property("disabled", !ctx_r0.canUpdateSlotsConfig());
    \u0275\u0275attribute("aria-label", \u0275\u0275pipeBind1(2, 8, "event.editor.slots.toggle.aria"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r0.slotsEnabled() ? "toggle_on" : "toggle_off");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.slotsEnabled() ? "On" : "Off");
  }
}
function SlotsInputComponent_Conditional_0_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 8)(1, "app-menu", 11);
    \u0275\u0275listener("itemSelect", function SlotsInputComponent_Conditional_0_Conditional_11_Template_app_menu_itemSelect_1_listener($event) {
      \u0275\u0275restoreView(_r3);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.onSlotSummaryAddSelect($event));
    });
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275property("items", ctx_r0.slotSummaryAddMenuItems());
  }
}
function SlotsInputComponent_Conditional_0_Conditional_12_Conditional_2_For_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "app-text-card", 16);
    \u0275\u0275listener("menuSelect", function SlotsInputComponent_Conditional_0_Conditional_12_Conditional_2_For_2_Template_app_text_card_menuSelect_0_listener($event) {
      const \u0275$index_47_r5 = \u0275\u0275restoreView(_r4).$index;
      const ctx_r0 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r0.onBaseSlotSummaryMenuSelect(\u0275$index_47_r5, $event));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const slot_r6 = ctx.$implicit;
    const \u0275$index_47_r5 = ctx.$index;
    const ctx_r0 = \u0275\u0275nextContext(4);
    \u0275\u0275property("tone", ctx_r0.slotSummaryCardTone(slot_r6))("title", ctx_r0.slotTemplateLabel(\u0275$index_47_r5))("meta", ctx_r0.slotSummaryWindowLabel(slot_r6))("menuTitle", ctx_r0.slotTemplateLabel(\u0275$index_47_r5))("menuPalette", ctx_r0.slotSummaryMenuPalette(slot_r6))("menuCounter", ctx_r0.slotOverrideCount(slot_r6) || null)("menuItems", ctx_r0.slotSummaryMenuItems(slot_r6));
  }
}
function SlotsInputComponent_Conditional_0_Conditional_12_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 13);
    \u0275\u0275repeaterCreate(1, SlotsInputComponent_Conditional_0_Conditional_12_Conditional_2_For_2_Template, 1, 7, "app-text-card", 15, \u0275\u0275componentInstance().slotTrackId, true);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r0.slotSummaryBaseItems());
  }
}
function SlotsInputComponent_Conditional_0_Conditional_12_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 14);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "i18n");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(2, 1, "event.editor.slots.empty"));
  }
}
function SlotsInputComponent_Conditional_0_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 9)(1, "div", 12);
    \u0275\u0275conditionalCreate(2, SlotsInputComponent_Conditional_0_Conditional_12_Conditional_2_Template, 3, 0, "div", 13)(3, SlotsInputComponent_Conditional_0_Conditional_12_Conditional_3_Template, 3, 3, "div", 14);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r0.slotSummaryBaseItems().length > 0 ? 2 : 3);
  }
}
function SlotsInputComponent_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "section", 0)(1, "div", 2)(2, "div", 3)(3, "span", 4)(4, "span", 5)(5, "mat-icon");
    \u0275\u0275text(6, "schedule");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "span");
    \u0275\u0275text(8);
    \u0275\u0275elementEnd()()();
    \u0275\u0275conditionalCreate(9, SlotsInputComponent_Conditional_0_Conditional_9_Template, 2, 1, "p", 6);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(10, SlotsInputComponent_Conditional_0_Conditional_10_Template, 7, 10, "div", 7);
    \u0275\u0275conditionalCreate(11, SlotsInputComponent_Conditional_0_Conditional_11_Template, 2, 1, "div", 8);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(12, SlotsInputComponent_Conditional_0_Conditional_12_Template, 4, 1, "div", 9);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(8);
    \u0275\u0275textInterpolate(ctx_r0.resolvedConfig.title);
    \u0275\u0275advance();
    \u0275\u0275conditional(!ctx_r0.readOnly ? 9 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.canUpdateSlotsConfig() ? 10 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.canConfigureSlotsSeries() ? 11 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.slotsEnabled() ? 12 : -1);
  }
}
function SlotsInputComponent_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "app-popup", 1)(1, "app-form-flow", 17);
    \u0275\u0275listener("ngModelChange", function SlotsInputComponent_Conditional_1_Template_app_form_flow_ngModelChange_1_listener($event) {
      \u0275\u0275restoreView(_r7);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.onScheduleFlowValueChange($event));
    });
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275property("model", ctx_r0.schedulePopupModel())("zIndex", ctx_r0.popupZIndex);
    \u0275\u0275advance();
    \u0275\u0275property("model", ctx_r0.scheduleFlowModel())("ngModel", ctx_r0.scheduleFlowValue);
  }
}
var SlotsInputComponent = class _SlotsInputComponent {
  cdr;
  config = {};
  popupZIndex = 2600;
  readOnly = false;
  disabled = false;
  overrideSelect = new EventEmitter();
  slotTemplates = [];
  showSchedulePopup = false;
  schedulePopupMode = "create";
  resolvedConfig = this.resolveConfig();
  scheduleFlowValue = this.createScheduleFlowValue();
  resolvedConfigSignature = this.buildResolvedConfigSignature(this.resolvedConfig);
  scheduleFlowModelCache = null;
  scheduleEditIndex = null;
  onModelChange = () => {
  };
  onModelTouched = () => {
  };
  constructor(cdr) {
    this.cdr = cdr;
  }
  ngOnChanges(changes) {
    if (changes["config"]) {
      this.syncResolvedConfig();
      this.cdr.markForCheck();
    }
  }
  ngDoCheck() {
    this.syncResolvedConfig();
  }
  writeValue(value) {
    this.slotTemplates = ActivityEventDetailDTO.normalizeSlotTemplates(value ?? []);
    this.normalizeSlotTemplatesForConfig(false);
    this.cdr.markForCheck();
  }
  registerOnChange(fn) {
    this.onModelChange = fn;
  }
  registerOnTouched(fn) {
    this.onModelTouched = fn;
  }
  setDisabledState(isDisabled) {
    this.readOnly = isDisabled;
    this.cdr.markForCheck();
  }
  handleEscape(event) {
    if (this.showSchedulePopup) {
      event.preventDefault();
      this.closeSchedulePopup();
    }
  }
  shouldShowPanel() {
    return this.canUpdateSlotsConfig() || this.slotsEnabled();
  }
  canUpdateSlotsConfig() {
    return !this.readOnly && !this.disabled && !this.resolvedConfig.generated;
  }
  canConfigureSlotsSeries() {
    return this.canUpdateSlotsConfig() && this.resolvedConfig.enabled;
  }
  slotsEnabled() {
    return this.resolvedConfig.enabled;
  }
  slotsPanelSubtitle() {
    return this.slotsEnabled() ? this.resolvedConfig.subtitle : "event.editor.slots.disabled.description";
  }
  toggleSlotsEnabled(event) {
    event?.preventDefault();
    event?.stopPropagation();
    if (!this.canUpdateSlotsConfig()) {
      return;
    }
    this.setSlotsEnabled(!this.resolvedConfig.enabled);
  }
  slotSummaryBaseItems() {
    return this.baseSlotTemplates();
  }
  slotSummaryWindowLabel(slot) {
    const start = this.parseDateValue(slot.startAt);
    if (!start) {
      return "event.editor.slots.time.pending";
    }
    const overrideCount = this.slotOverrideCount(slot);
    const overrideSuffix = overrideCount > 0 ? ` \xB7 ${overrideCount} ${overrideCount === 1 ? "override" : "overrides"}` : "";
    if (ActivityEventDetailDTO.normalizeSlotOverrideDate(slot.overrideDate)) {
      return `Starts ${this.formatSlotDateTimeLabel(start)}${overrideSuffix}`;
    }
    return `${this.formatRecurringSlotLabel(start)}${overrideSuffix}`;
  }
  slotSummaryCardTone(_slot) {
    const frequency = ActivityEventDetailDTO.normalizeFrequency(this.resolvedConfig.frequency);
    if (frequency === "Daily") {
      return "green";
    }
    if (frequency === "Weekly" || frequency === "Bi-weekly") {
      return frequency === "Bi-weekly" ? "violet" : "cyan";
    }
    if (frequency === "Monthly") {
      return "amber";
    }
    if (frequency === "Yearly") {
      return "gold";
    }
    return "blue";
  }
  slotSummaryMenuPalette(_slot) {
    const frequency = ActivityEventDetailDTO.normalizeFrequency(this.resolvedConfig.frequency);
    return this.scheduleFrequencyPalette(frequency);
  }
  slotOverrideCount(slot) {
    const slotId = `${slot.id ?? ""}`.trim();
    if (!slotId) {
      return 0;
    }
    const overridePrefix = `${slotId}-override-`;
    return this.slotTemplates.filter((item) => {
      if (!ActivityEventDetailDTO.normalizeSlotOverrideDate(item.overrideDate)) {
        return false;
      }
      const itemId = `${item.id ?? ""}`.trim();
      return itemId === slotId || itemId.startsWith(overridePrefix);
    }).length;
  }
  slotSummaryAddMenuItems() {
    if (!this.canConfigureSlotsSeries()) {
      return [];
    }
    return [{
      id: "add",
      icon: "add",
      ariaLabel: "event.editor.slots.add.base.aria",
      palette: "amber"
    }];
  }
  onSlotSummaryAddSelect(event) {
    if (event.id !== "add") {
      return;
    }
    this.addBaseSlotFromPanel(event.sourceEvent);
  }
  slotSummaryMenuItems(slot) {
    if (!this.canConfigureSlotsSeries()) {
      return [];
    }
    const overrideCount = slot ? this.slotOverrideCount(slot) : 0;
    return [
      {
        id: "edit",
        label: "edit",
        icon: "edit",
        palette: "blue",
        surface: "tinted"
      },
      {
        id: "override",
        label: "override",
        icon: "published_with_changes",
        palette: "violet",
        surface: "tinted",
        counter: overrideCount > 0 ? { value: overrideCount, max: 9 } : null
      },
      {
        id: "delete",
        label: "delete",
        icon: "delete",
        palette: "danger",
        surface: "tinted"
      }
    ];
  }
  onBaseSlotSummaryMenuSelect(index, event) {
    event.sourceEvent.preventDefault();
    event.sourceEvent.stopPropagation();
    switch (event.id) {
      case "edit":
        this.openBaseSlotEditor(index, event.sourceEvent);
        break;
      case "override":
        this.openBaseSlotOverride(index, event.sourceEvent);
        break;
      case "delete":
        this.removeBaseSlotFromPanel(index, event.sourceEvent);
        break;
      default:
        break;
    }
  }
  addBaseSlotFromPanel(event) {
    event?.preventDefault();
    event?.stopPropagation();
    if (!this.canConfigureSlotsSeries()) {
      return;
    }
    this.openSchedulePopup();
    this.cdr.markForCheck();
  }
  openBaseSlotEditor(index, event) {
    event?.preventDefault();
    event?.stopPropagation();
    this.openSchedulePopup(index);
  }
  openBaseSlotOverride(index, event) {
    event?.preventDefault();
    event?.stopPropagation();
    if (!this.canConfigureSlotsSeries()) {
      return;
    }
    const slot = this.baseSlotTemplates()[index];
    if (!slot) {
      return;
    }
    this.overrideSelect.emit({ slot: __spreadValues({}, slot), slotIndex: index });
  }
  schedulePopupTitle() {
    return this.schedulePopupMode === "edit" ? "event.editor.schedule.edit" : "event.editor.schedule.add";
  }
  schedulePopupSubtitle() {
    return this.schedulePopupMode === "edit" ? "event.editor.schedule.edit.description" : "event.editor.schedule.add.description";
  }
  schedulePopupModel() {
    return {
      title: this.schedulePopupTitle(),
      subtitle: this.schedulePopupSubtitle(),
      ariaLabel: this.schedulePopupTitle(),
      closeAriaLabel: "event.editor.schedule.close.aria",
      closeOnBackdrop: true,
      size: "default",
      height: "auto",
      headerTone: "accent",
      bodyLayout: "overflow",
      backdropTone: "dim",
      headerActions: [
        {
          id: this.schedulePopupMode === "edit" ? "save-schedule" : "add-schedule",
          icon: "check",
          ariaLabel: this.schedulePopupMode === "edit" ? "event.editor.schedule.save.aria" : "event.editor.schedule.add.aria",
          palette: "green",
          disabled: !this.canConfigureSlotsSeries()
        }
      ],
      onClose: () => this.closeSchedulePopup(),
      onAction: (event) => this.confirmSchedulePopup(event.sourceEvent)
    };
  }
  closeSchedulePopup() {
    this.showSchedulePopup = false;
    this.schedulePopupMode = "create";
    this.scheduleEditIndex = null;
    this.cdr.markForCheck();
  }
  scheduleFrequencyLocked() {
    return this.baseSlotTemplates().length > 0;
  }
  scheduleFlowModel() {
    const signature = this.scheduleFlowModelSignature();
    if (this.scheduleFlowModelCache?.signature === signature) {
      return this.scheduleFlowModelCache.model;
    }
    const model = {
      title: "event.editor.schedule.add",
      header: false,
      layout: "grouped",
      allowMenuOverflow: true,
      summary: { enabled: false },
      save: null,
      completion: { controls: "none" },
      steps: [
        {
          id: "schedule",
          title: "",
          controls: [
            {
              id: "frequency",
              bind: "frequency",
              kind: "menu",
              layout: "wide",
              label: "frequency",
              disabled: this.scheduleFrequencyLocked(),
              config: {
                kind: "select",
                layout: "row",
                panelMode: "auto",
                closeOnSelect: true,
                trigger: this.scheduleFrequencyMenuTrigger(),
                items: this.scheduleFrequencyMenuItems()
              }
            },
            ...this.scheduleTimeControls()
          ]
        }
      ]
    };
    this.scheduleFlowModelCache = { signature, model };
    return model;
  }
  scheduleFlowModelSignature() {
    return JSON.stringify({
      frequency: ActivityEventDetailDTO.normalizeFrequency(this.scheduleFlowValue.frequency),
      month: this.scheduleFlowValue.month,
      locked: this.scheduleFrequencyLocked(),
      startAtIso: this.resolvedConfig.startAtIso,
      endAtIso: this.resolvedConfig.endAtIso,
      options: this.scheduleFrequencyOptions()
    });
  }
  onScheduleFlowValueChange(value) {
    const previousFrequency = ActivityEventDetailDTO.normalizeFrequency(this.scheduleFlowValue.frequency);
    const nextValue = this.normalizeScheduleFlowValue(value);
    if (this.scheduleFrequencyLocked()) {
      nextValue.frequency = this.scheduleFlowValue.frequency;
    }
    const nextFrequency = ActivityEventDetailDTO.normalizeFrequency(nextValue.frequency);
    if (nextFrequency !== previousFrequency) {
      const nextStartAt = this.buildScheduleDraftStartAt(nextFrequency, nextValue);
      this.scheduleFlowValue = this.scheduleFlowValueFromDate(nextFrequency, this.parseDateValue(nextStartAt) ?? /* @__PURE__ */ new Date());
      this.cdr.markForCheck();
      return;
    }
    this.scheduleFlowValue = nextValue;
    this.cdr.markForCheck();
  }
  confirmSchedulePopup(event) {
    const sourceEvent = event && "sourceEvent" in event ? event.sourceEvent : event;
    sourceEvent?.preventDefault();
    sourceEvent?.stopPropagation();
    this.createScheduleFromPopup();
  }
  scheduleFrequencyOptions() {
    return this.resolvedConfig.frequencyOptions.filter((item) => ActivityEventDetailDTO.normalizeFrequency(item) !== "One-time");
  }
  createScheduleFromPopup(event) {
    event?.preventDefault();
    event?.stopPropagation();
    if (!this.canConfigureSlotsSeries()) {
      return;
    }
    const draft = this.normalizeScheduleFlowValue(this.scheduleFlowValue);
    const frequency = ActivityEventDetailDTO.normalizeFrequency(draft.frequency);
    if (!this.scheduleFrequencyLocked()) {
      this.setFrequency(frequency);
    }
    const startAt = this.buildScheduleDraftStartAt(frequency, draft);
    const currentTemplates = this.baseSlotTemplates();
    const editIndex = this.scheduleEditIndex;
    if (editIndex !== null && editIndex >= 0 && editIndex < currentTemplates.length) {
      this.setActiveSlotTemplates(currentTemplates.map((item, index) => index === editIndex ? __spreadProps(__spreadValues({}, item), {
        startAt,
        overrideDate: null,
        closed: false
      }) : item));
    } else {
      const nextIndex = currentTemplates.length + 1;
      this.setActiveSlotTemplates([
        ...currentTemplates,
        {
          id: this.buildSlotTemplateId(nextIndex),
          startAt,
          overrideDate: null,
          closed: false
        }
      ]);
    }
    this.closeSchedulePopup();
  }
  removeBaseSlotFromPanel(index, event) {
    event?.preventDefault();
    event?.stopPropagation();
    if (!this.canConfigureSlotsSeries() || index < 0) {
      return;
    }
    this.setActiveSlotTemplates(this.baseSlotTemplates().filter((_, currentIndex) => currentIndex !== index).map((item, currentIndex) => __spreadProps(__spreadValues({}, item), {
      id: item.id?.trim() || this.buildSlotTemplateId(currentIndex + 1),
      overrideDate: null,
      closed: false
    })));
    this.cdr.markForCheck();
  }
  formatRecurringSlotLabel(start) {
    const time = this.formatSlotTimeLabel(start);
    switch (this.resolvedConfig.frequency) {
      case "Daily":
        return `Every day at ${time}`;
      case "Weekly":
        return `Every ${this.formatSlotWeekday(start)} at ${time}`;
      case "Bi-weekly":
        return `Every second ${this.formatSlotWeekday(start)} at ${time}`;
      case "Monthly":
        return `Every month on day ${start.getDate()} at ${time}`;
      case "Yearly":
        return `Every year on ${this.formatSlotMonthDay(start)} at ${time}`;
      default:
        return `Starts ${this.formatSlotDateTimeLabel(start)}`;
    }
  }
  formatSlotTimeLabel(value) {
    return value.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit"
    });
  }
  formatSlotWeekday(value) {
    return value.toLocaleDateString("en-US", {
      weekday: "long"
    });
  }
  formatSlotMonthDay(value) {
    return value.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric"
    });
  }
  slotTrackId(index, slot) {
    return `${slot.overrideDate ?? "base"}:${slot.id || `slot-${index + 1}`}:${slot.startAt}`;
  }
  slotTemplateLabel(index) {
    return `Slot ${index + 1}`;
  }
  syncResolvedConfig() {
    const nextConfig = this.resolveConfig();
    const nextSignature = this.buildResolvedConfigSignature(nextConfig);
    if (nextSignature === this.resolvedConfigSignature) {
      return;
    }
    this.resolvedConfig = nextConfig;
    this.resolvedConfigSignature = nextSignature;
    this.normalizeSlotTemplatesForConfig(true);
    this.cdr.markForCheck();
  }
  resolveConfig() {
    const frequency = ActivityEventDetailDTO.normalizeFrequency(this.resolveConfigValue(this.config.frequency, "One-time"));
    const frequencyOptions = this.resolveFrequencyOptions(this.resolveConfigValue(this.config.frequencyOptions, null));
    const configuredEnabled = this.resolveConfigValue(this.config.enabled, null);
    return {
      startAtIso: `${this.resolveConfigValue(this.config.startAtIso, "") ?? ""}`.trim(),
      endAtIso: `${this.resolveConfigValue(this.config.endAtIso, "") ?? ""}`.trim(),
      frequency,
      frequencyOptions,
      enabled: configuredEnabled === null || configuredEnabled === void 0 ? frequency !== "One-time" : configuredEnabled === true,
      generated: this.resolveConfigValue(this.config.generated, false) === true,
      title: this.resolveConfigValue(this.config.title, "event.editor.slots.title"),
      subtitle: this.resolveConfigValue(this.config.subtitle, "event.editor.slots.subtitle")
    };
  }
  resolveConfigValue(value, fallback) {
    if (typeof value === "function") {
      return value() ?? fallback;
    }
    return value ?? fallback;
  }
  resolveFrequencyOptions(value) {
    const options = (value?.length ? value : ["Custom", "Daily", "Weekly", "Bi-weekly", "Monthly", "Yearly"]).map((item) => ActivityEventDetailDTO.normalizeFrequency(item));
    return Array.from(new Set(options));
  }
  buildResolvedConfigSignature(config) {
    return JSON.stringify(config);
  }
  setFrequency(value) {
    if (!this.canUpdateSlotsConfig()) {
      return;
    }
    const normalized = ActivityEventDetailDTO.normalizeFrequency(value);
    this.config.frequencyChange?.(normalized);
    this.onModelTouched();
    this.syncResolvedConfig();
  }
  setSlotsEnabled(value) {
    if (!this.canUpdateSlotsConfig()) {
      return;
    }
    this.config.enabledChange?.(value);
    if (!value) {
      this.showSchedulePopup = false;
    }
    this.onModelTouched();
    this.syncResolvedConfig();
  }
  defaultEnabledFrequency() {
    return this.scheduleFrequencyOptions()[0] ?? "Custom";
  }
  openSchedulePopup(index = null) {
    const currentTemplates = this.baseSlotTemplates();
    const editSlot = index !== null ? currentTemplates[index] : null;
    const seedDate = this.parseDateValue(editSlot?.startAt) ?? this.defaultScheduleDraftDate();
    const currentFrequency = ActivityEventDetailDTO.normalizeFrequency(this.resolvedConfig.frequency);
    this.scheduleEditIndex = editSlot ? index : null;
    this.schedulePopupMode = editSlot ? "edit" : "create";
    this.scheduleFlowValue = this.scheduleFlowValueFromDate(currentFrequency === "One-time" ? this.defaultEnabledFrequency() : currentFrequency, seedDate);
    this.showSchedulePopup = true;
    this.onModelTouched();
  }
  createScheduleFlowValue() {
    return this.scheduleFlowValueFromDate(this.defaultEnabledFrequency(), this.parseDateValue(this.resolvedConfig.startAtIso) ?? /* @__PURE__ */ new Date());
  }
  normalizeScheduleFlowValue(value) {
    const record = value && typeof value === "object" ? value : {};
    const frequency = ActivityEventDetailDTO.normalizeFrequency(record["frequency"]);
    const startAt = `${record["startAt"] ?? ""}`.trim() || AppUtils.toIsoDateTimeLocal(this.defaultScheduleDraftDate());
    const baseDate = this.parseDateValue(startAt) ?? this.defaultScheduleDraftDate();
    const normalizedFrequency = frequency === "One-time" ? this.defaultEnabledFrequency() : frequency;
    const month = this.normalizeScheduleMonth(record["month"], baseDate);
    const day = this.normalizeScheduleDay(record["day"], normalizedFrequency, month, baseDate);
    return {
      frequency: normalizedFrequency,
      startAt,
      time: this.normalizeScheduleTime(record["time"], baseDate),
      weekday: this.normalizeScheduleWeekday(record["weekday"], baseDate),
      day,
      month
    };
  }
  scheduleFlowValueFromDate(frequency, date) {
    const normalizedFrequency = ActivityEventDetailDTO.normalizeFrequency(frequency);
    const month = `${date.getMonth() + 1}`;
    return {
      frequency: normalizedFrequency === "One-time" ? this.defaultEnabledFrequency() : normalizedFrequency,
      startAt: AppUtils.toIsoDateTimeLocal(date),
      time: this.formatScheduleTimeInput(date),
      weekday: `${date.getDay()}`,
      day: date.getDate(),
      month
    };
  }
  scheduleFrequencyMenuTrigger() {
    return {
      id: "schedule-frequency",
      label: "frequency",
      icon: "event",
      trailingIcon: "expand_more",
      layout: "field",
      disabled: this.scheduleFrequencyLocked()
    };
  }
  scheduleTimeControls() {
    switch (ActivityEventDetailDTO.normalizeFrequency(this.scheduleFlowValue.frequency)) {
      case "Custom":
        return [{
          id: "startAt",
          bind: "startAt",
          kind: "date",
          layout: "wide",
          label: "start",
          required: true,
          config: {
            model: {
              mode: "single",
              precision: "minute",
              valueFormat: "iso-date-time",
              field: {
                label: "start",
                required: true,
                min: this.resolvedConfig.startAtIso || null,
                max: this.resolvedConfig.endAtIso || null
              }
            }
          }
        }];
      case "Daily":
        return [this.scheduleTimeControl("time", "event.editor.schedule.start.time", "wide")];
      case "Weekly":
      case "Bi-weekly":
        return [
          this.scheduleWeekdayControl(),
          this.scheduleTimeControl("time", "event.editor.schedule.start.time")
        ];
      case "Monthly":
        return [
          this.scheduleDayControl(),
          this.scheduleTimeControl("time", "event.editor.schedule.start.time")
        ];
      case "Yearly":
        return [
          this.scheduleMonthControl(),
          this.scheduleDayControl(),
          this.scheduleTimeControl("time", "event.editor.schedule.start.time", "wide")
        ];
      default:
        return [this.scheduleTimeControl("time", "event.editor.schedule.start.time", "wide")];
    }
  }
  scheduleTimeControl(id, label, layout = "half") {
    return {
      id,
      bind: id,
      kind: "date",
      layout,
      label,
      required: true,
      config: {
        model: {
          mode: "time",
          precision: "minute",
          field: {
            label,
            required: true
          }
        }
      }
    };
  }
  scheduleWeekdayControl() {
    return {
      id: "weekday",
      bind: "weekday",
      kind: "menu",
      layout: "half",
      label: "day",
      required: true,
      config: {
        kind: "select",
        layout: "row",
        panelMode: "auto",
        closeOnSelect: true,
        trigger: {
          id: "schedule-weekday",
          label: "day",
          icon: "calendar_view_week",
          trailingIcon: "expand_more",
          layout: "field"
        },
        items: this.scheduleWeekdayMenuItems()
      }
    };
  }
  scheduleDayControl() {
    return {
      id: "day",
      bind: "day",
      kind: "number",
      layout: "half",
      label: "day",
      required: true,
      min: 1,
      max: this.scheduleDayMax(),
      step: 1
    };
  }
  scheduleMonthControl() {
    return {
      id: "month",
      bind: "month",
      kind: "menu",
      layout: "half",
      label: "month",
      required: true,
      config: {
        kind: "select",
        layout: "row",
        panelMode: "auto",
        closeOnSelect: true,
        trigger: {
          id: "schedule-month",
          label: "month",
          icon: "calendar_month",
          trailingIcon: "expand_more",
          layout: "field"
        },
        items: this.scheduleMonthMenuItems()
      }
    };
  }
  scheduleWeekdayMenuItems() {
    return [
      ["0", "Sunday"],
      ["1", "Monday"],
      ["2", "Tuesday"],
      ["3", "Wednesday"],
      ["4", "Thursday"],
      ["5", "Friday"],
      ["6", "Saturday"]
    ].map(([value, label]) => ({
      id: value,
      value,
      kind: "radio",
      label,
      icon: this.scheduleWeekdayIcon(Number(value)),
      palette: this.scheduleWeekdayPalette(Number(value)),
      surface: "tinted"
    }));
  }
  scheduleWeekdayIcon(weekday) {
    switch (weekday) {
      case 0:
        return "wb_sunny";
      case 1:
        return "work_history";
      case 2:
        return "bolt";
      case 3:
        return "calendar_view_week";
      case 4:
        return "explore";
      case 5:
        return "celebration";
      case 6:
        return "weekend";
      default:
        return "calendar_view_week";
    }
  }
  scheduleWeekdayPalette(weekday) {
    switch (weekday) {
      case 0:
        return "gold";
      case 1:
        return "blue";
      case 2:
        return "orange";
      case 3:
        return "cyan";
      case 4:
        return "violet";
      case 5:
        return "pink";
      case 6:
        return "teal";
      default:
        return "cyan";
    }
  }
  scheduleMonthMenuItems() {
    return [
      ["1", "January"],
      ["2", "February"],
      ["3", "March"],
      ["4", "April"],
      ["5", "May"],
      ["6", "June"],
      ["7", "July"],
      ["8", "August"],
      ["9", "September"],
      ["10", "October"],
      ["11", "November"],
      ["12", "December"]
    ].map(([value, label]) => {
      const zodiac = this.scheduleMonthZodiac(value);
      return {
        id: value,
        value,
        kind: "radio",
        label,
        icon: zodiac.icon,
        palette: zodiac.palette,
        surface: "tinted"
      };
    });
  }
  scheduleMonthZodiac(value) {
    switch (value) {
      case "1":
        return { icon: "\u2651", palette: "capricorn" };
      case "2":
        return { icon: "\u2652", palette: "aquarius" };
      case "3":
        return { icon: "\u2653", palette: "pisces" };
      case "4":
        return { icon: "\u2648", palette: "aries" };
      case "5":
        return { icon: "\u2649", palette: "taurus" };
      case "6":
        return { icon: "\u264A", palette: "gemini" };
      case "7":
        return { icon: "\u264B", palette: "cancer" };
      case "8":
        return { icon: "\u264C", palette: "leo" };
      case "9":
        return { icon: "\u264D", palette: "virgo" };
      case "10":
        return { icon: "\u264E", palette: "libra" };
      case "11":
        return { icon: "\u264F", palette: "scorpio" };
      case "12":
        return { icon: "\u2650", palette: "sagittarius" };
      default:
        return { icon: "calendar_month", palette: "amber" };
    }
  }
  scheduleFrequencyMenuItems() {
    return this.scheduleFrequencyOptions().map((frequency) => {
      const normalized = ActivityEventDetailDTO.normalizeFrequency(frequency);
      return {
        id: normalized,
        value: normalized,
        kind: "radio",
        label: this.scheduleFrequencyLabel(normalized),
        icon: this.scheduleFrequencyIcon(normalized),
        palette: this.scheduleFrequencyPalette(normalized),
        surface: "tinted"
      };
    });
  }
  scheduleFrequencyLabel(frequency) {
    switch (ActivityEventDetailDTO.normalizeFrequency(frequency)) {
      case "Custom":
        return "schedule.frequency.custom";
      case "Daily":
        return "schedule.frequency.daily";
      case "Weekly":
        return "schedule.frequency.weekly";
      case "Bi-weekly":
        return "schedule.frequency.bi.weekly";
      case "Monthly":
        return "schedule.frequency.monthly";
      case "Yearly":
        return "schedule.frequency.yearly";
      default:
        return "schedule.frequency.custom";
    }
  }
  scheduleFrequencyIcon(frequency) {
    switch (ActivityEventDetailDTO.normalizeFrequency(frequency)) {
      case "Custom":
        return "event";
      case "Daily":
        return "today";
      case "Weekly":
        return "calendar_view_week";
      case "Bi-weekly":
        return "date_range";
      case "Monthly":
        return "calendar_month";
      case "Yearly":
        return "event_available";
      default:
        return "event";
    }
  }
  scheduleFrequencyPalette(frequency) {
    switch (ActivityEventDetailDTO.normalizeFrequency(frequency)) {
      case "Custom":
        return "blue";
      case "Daily":
        return "green";
      case "Weekly":
        return "cyan";
      case "Bi-weekly":
        return "violet";
      case "Monthly":
        return "amber";
      case "Yearly":
        return "gold";
      default:
        return "blue";
    }
  }
  defaultScheduleDraftDate() {
    const baseSlots = this.baseSlotTemplates();
    const previousStart = this.parseDateValue(baseSlots[baseSlots.length - 1]?.startAt);
    if (previousStart) {
      return new Date(previousStart.getTime() + 60 * 60 * 1e3);
    }
    return this.parseDateValue(this.resolvedConfig.startAtIso) ?? /* @__PURE__ */ new Date();
  }
  buildScheduleDraftStartAt(frequency, draft) {
    const eventStart = this.parseDateValue(this.resolvedConfig.startAtIso) ?? /* @__PURE__ */ new Date();
    const draftStart = this.parseDateValue(draft.startAt) ?? eventStart;
    const timeSource = this.parseScheduleTimeInput(draft.time, draftStart);
    let start = new Date(eventStart);
    switch (ActivityEventDetailDTO.normalizeFrequency(frequency)) {
      case "Custom":
        start = new Date(draftStart);
        break;
      case "Weekly":
      case "Bi-weekly":
        start = this.nextWeekdayDate(eventStart, this.scheduleInteger(draft.weekday, draftStart.getDay(), 0, 6));
        break;
      case "Monthly":
        start = this.nextMonthlyDate(eventStart, this.scheduleInteger(draft.day, draftStart.getDate(), 1, 31));
        break;
      case "Yearly":
        start = this.nextYearlyDate(eventStart, this.scheduleInteger(draft.month, draftStart.getMonth() + 1, 1, 12), this.scheduleInteger(draft.day, draftStart.getDate(), 1, 31));
        break;
      default:
        start = new Date(eventStart);
        break;
    }
    return AppUtils.toIsoDateTimeLocal(this.applyDraftTime(start, timeSource));
  }
  normalizeScheduleTime(value, fallbackDate) {
    const normalized = `${value ?? ""}`.trim();
    return /^\d{2}:\d{2}$/.test(normalized) ? normalized : this.formatScheduleTimeInput(fallbackDate);
  }
  normalizeScheduleWeekday(value, fallbackDate) {
    return `${this.scheduleInteger(value, fallbackDate.getDay(), 0, 6)}`;
  }
  normalizeScheduleMonth(value, fallbackDate) {
    return `${this.scheduleInteger(value, fallbackDate.getMonth() + 1, 1, 12)}`;
  }
  normalizeScheduleDay(value, frequency, month, fallbackDate) {
    const max = this.scheduleDayMaxFor(frequency, month);
    return this.scheduleInteger(value, Math.min(fallbackDate.getDate(), max), 1, max);
  }
  scheduleDayMax() {
    return this.scheduleDayMaxFor(this.scheduleFlowValue.frequency, this.scheduleFlowValue.month);
  }
  scheduleDayMaxFor(frequency, month) {
    if (ActivityEventDetailDTO.normalizeFrequency(frequency) !== "Yearly") {
      return 31;
    }
    const monthIndex = this.scheduleInteger(month, 1, 1, 12) - 1;
    return new Date(2026, monthIndex + 1, 0).getDate();
  }
  scheduleInteger(value, fallback, min, max) {
    const parsed = Math.trunc(Number(value));
    const normalized = Number.isFinite(parsed) ? parsed : fallback;
    return Math.min(max, Math.max(min, normalized));
  }
  formatScheduleTimeInput(value) {
    return `${value.getHours()}`.padStart(2, "0") + ":" + `${value.getMinutes()}`.padStart(2, "0");
  }
  parseScheduleTimeInput(value, fallbackDate) {
    const normalized = this.normalizeScheduleTime(value, fallbackDate);
    const [hours, minutes] = normalized.split(":").map((item) => Number(item));
    const next = new Date(fallbackDate);
    next.setHours(hours, minutes, 0, 0);
    return next;
  }
  applyDraftTime(date, timeSource) {
    const next = new Date(date);
    next.setHours(timeSource.getHours(), timeSource.getMinutes(), 0, 0);
    return next;
  }
  nextWeekdayDate(start, weekday) {
    const next = new Date(start.getFullYear(), start.getMonth(), start.getDate());
    const delta = (weekday - next.getDay() + 7) % 7;
    next.setDate(next.getDate() + delta);
    return next;
  }
  nextMonthlyDate(start, day) {
    const next = this.monthlyDate(start.getFullYear(), start.getMonth(), day);
    if (next.getTime() >= new Date(start.getFullYear(), start.getMonth(), start.getDate()).getTime()) {
      return next;
    }
    return this.monthlyDate(start.getFullYear(), start.getMonth() + 1, day);
  }
  monthlyDate(year, monthIndex, day) {
    const lastDay = new Date(year, monthIndex + 1, 0).getDate();
    return new Date(year, monthIndex, Math.min(Math.max(1, day), lastDay));
  }
  nextYearlyDate(start, month, day) {
    const monthIndex = Math.min(11, Math.max(0, month - 1));
    const next = this.monthlyDate(start.getFullYear(), monthIndex, day);
    if (next.getTime() >= new Date(start.getFullYear(), start.getMonth(), start.getDate()).getTime()) {
      return next;
    }
    return this.monthlyDate(start.getFullYear() + 1, monthIndex, day);
  }
  normalizeSlotTemplatesForConfig(emitChanges) {
    const before = this.slotTemplatesSignature(this.slotTemplates);
    if (!this.resolvedConfig.enabled) {
      this.slotTemplates = [];
    } else {
      this.slotTemplates = ActivityEventDetailDTO.normalizeSlotTemplates(this.slotTemplates.map((item) => item.closed === true ? __spreadValues({}, item) : this.normalizeSlotTemplateBounds(__spreadValues({}, item))));
    }
    if (emitChanges && before !== this.slotTemplatesSignature(this.slotTemplates)) {
      this.emitSlots();
    }
  }
  emitSlots() {
    const nextSlots = ActivityEventDetailDTO.normalizeSlotTemplates(this.slotTemplates);
    this.slotTemplates = nextSlots;
    this.onModelChange(nextSlots.map((item) => __spreadValues({}, item)));
    this.onModelTouched();
    this.cdr.markForCheck();
  }
  slotTemplatesSignature(items) {
    return JSON.stringify(items.map((item) => ({
      id: item.id,
      startAt: item.startAt,
      overrideDate: ActivityEventDetailDTO.normalizeSlotOverrideDate(item.overrideDate),
      closed: item.closed === true
    })));
  }
  baseSlotTemplates() {
    return this.slotTemplates.filter((item) => !ActivityEventDetailDTO.normalizeSlotOverrideDate(item.overrideDate)).filter((item) => item.closed !== true).map((item) => __spreadProps(__spreadValues({}, item), {
      overrideDate: null,
      closed: false
    }));
  }
  buildSlotTemplateId(index) {
    return `slot-${index}`;
  }
  setActiveSlotTemplates(nextTemplates) {
    const normalizedTemplates = ActivityEventDetailDTO.normalizeSlotTemplates(this.normalizeEditableSlotTemplates(nextTemplates));
    const overrides = this.slotTemplates.filter((item) => {
      const overrideDate = ActivityEventDetailDTO.normalizeSlotOverrideDate(item.overrideDate);
      return Boolean(overrideDate);
    }).map((item) => __spreadValues({}, item));
    this.slotTemplates = [
      ...normalizedTemplates.map((item) => __spreadProps(__spreadValues({}, item), { overrideDate: null, closed: false })),
      ...overrides
    ];
    this.emitSlots();
  }
  normalizeSlotTemplateBounds(slot) {
    const window = this.slotWindowForEditing(slot.overrideDate);
    const fallbackStart = window?.start ?? this.parseDateValue(this.resolvedConfig.startAtIso) ?? /* @__PURE__ */ new Date();
    const fallbackEnd = window?.end ?? this.parseDateValue(this.resolvedConfig.endAtIso) ?? new Date(fallbackStart.getTime() + 60 * 60 * 1e3);
    const windowStartMs = fallbackStart.getTime();
    const windowEndMs = Math.max(windowStartMs + 60 * 1e3, fallbackEnd.getTime());
    let startDate = this.parseDateValue(slot.startAt) ?? new Date(fallbackStart);
    let startMs = startDate.getTime();
    const maxStartMs = Math.max(windowStartMs, windowEndMs - 60 * 1e3);
    startMs = Math.min(maxStartMs, Math.max(windowStartMs, startMs));
    startDate = new Date(startMs);
    return __spreadProps(__spreadValues({}, slot), {
      startAt: AppUtils.toIsoDateTimeLocal(startDate)
    });
  }
  normalizeEditableSlotTemplates(nextTemplates) {
    return ActivityEventDetailDTO.normalizeSlotTemplates(nextTemplates).map((item) => item.closed === true ? __spreadValues({}, item) : this.normalizeSlotTemplateBounds(__spreadValues({}, item)));
  }
  slotWindowForEditing(overrideDate = null) {
    return this.slotWindowForOverrideDate(overrideDate);
  }
  slotWindowForOverrideDate(overrideDate) {
    const baseStart = this.parseDateValue(this.resolvedConfig.startAtIso);
    const baseEnd = this.parseDateValue(this.resolvedConfig.endAtIso);
    if (!baseStart || !baseEnd) {
      return null;
    }
    if (!overrideDate) {
      return {
        start: new Date(baseStart),
        end: new Date(baseEnd),
        startAt: AppUtils.toIsoDateTimeLocal(baseStart),
        endAt: AppUtils.toIsoDateTimeLocal(baseEnd)
      };
    }
    const overrideDateValue = this.parseOverrideDate(overrideDate);
    const shiftedStartAt = overrideDateValue ? AppUtils.applyDatePartToIsoLocal(this.resolvedConfig.startAtIso, overrideDateValue) : this.resolvedConfig.startAtIso;
    const shiftedStart = this.parseDateValue(shiftedStartAt) ?? new Date(baseStart);
    const boundaryEnd = this.eventFrequencyBoundaryEnd(shiftedStart) ?? new Date(baseEnd);
    const shiftedEnd = boundaryEnd.getTime() > baseEnd.getTime() ? new Date(baseEnd) : boundaryEnd;
    if (shiftedEnd.getTime() <= shiftedStart.getTime()) {
      const fallbackEnd = new Date(Math.min(baseEnd.getTime(), shiftedStart.getTime() + 60 * 60 * 1e3));
      return {
        start: shiftedStart,
        end: fallbackEnd,
        startAt: AppUtils.toIsoDateTimeLocal(shiftedStart),
        endAt: AppUtils.toIsoDateTimeLocal(fallbackEnd)
      };
    }
    return {
      start: shiftedStart,
      end: shiftedEnd,
      startAt: AppUtils.toIsoDateTimeLocal(shiftedStart),
      endAt: AppUtils.toIsoDateTimeLocal(shiftedEnd)
    };
  }
  eventFrequencyBoundaryEnd(start) {
    if (!start) {
      return null;
    }
    let boundaryDate = null;
    switch (this.resolvedConfig.frequency) {
      case "Daily":
        boundaryDate = new Date(start.getFullYear(), start.getMonth(), start.getDate());
        break;
      case "Weekly":
        boundaryDate = AppUtils.endOfWeekSunday(start);
        break;
      case "Bi-weekly":
        boundaryDate = AppUtils.addDays(AppUtils.endOfWeekSunday(start), 7);
        break;
      case "Monthly":
        boundaryDate = AppUtils.endOfMonth(start);
        break;
      case "Yearly":
        boundaryDate = new Date(start.getFullYear(), 11, 31);
        break;
      default:
        boundaryDate = null;
        break;
    }
    if (!boundaryDate) {
      return null;
    }
    return new Date(boundaryDate.getFullYear(), boundaryDate.getMonth(), boundaryDate.getDate(), 23, 59, 0, 0);
  }
  formatSlotDateTimeLabel(value) {
    if (!value) {
      return "";
    }
    return value.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit"
    });
  }
  parseDateValue(value) {
    return AppUtils.parseDate(value);
  }
  parseOverrideDate(value) {
    return AppUtils.parseDateOnly(value);
  }
  static \u0275fac = function SlotsInputComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _SlotsInputComponent)(\u0275\u0275directiveInject(ChangeDetectorRef));
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _SlotsInputComponent, selectors: [["app-slots-input"]], hostBindings: function SlotsInputComponent_HostBindings(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275listener("keydown.escape", function SlotsInputComponent_keydown_escape_HostBindingHandler($event) {
        return ctx.handleEscape($event);
      }, \u0275\u0275resolveDocument);
    }
  }, inputs: { config: "config", popupZIndex: "popupZIndex", readOnly: "readOnly", disabled: "disabled" }, outputs: { overrideSelect: "overrideSelect" }, features: [\u0275\u0275ProvidersFeature([
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => _SlotsInputComponent),
      multi: true
    }
  ]), \u0275\u0275NgOnChangesFeature], decls: 2, vars: 2, consts: [[1, "event-slots-panel"], [3, "model", "zIndex"], [1, "event-slots-panel-head"], [1, "event-slots-panel-title-wrap"], [1, "event-slots-panel-title"], [1, "event-schedule-panel-title"], [1, "event-slots-panel-subtitle"], [1, "event-slots-panel-actions"], [1, "event-slots-panel-secondary-actions"], [1, "event-slots-panel-body"], ["type", "button", 1, "event-slots-enable-btn", 3, "click", "disabled"], ["kind", "inline", 1, "event-slots-summary-add-menu", 3, "itemSelect", "items"], [1, "event-slots-summary"], [1, "event-slots-summary-list"], [1, "event-slots-summary-empty"], ["icon", "schedule", 1, "event-slots-summary-card", 3, "tone", "title", "meta", "menuTitle", "menuPalette", "menuCounter", "menuItems"], ["icon", "schedule", 1, "event-slots-summary-card", 3, "menuSelect", "tone", "title", "meta", "menuTitle", "menuPalette", "menuCounter", "menuItems"], [1, "event-slots-schedule-flow", 3, "ngModelChange", "model", "ngModel"]], template: function SlotsInputComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275conditionalCreate(0, SlotsInputComponent_Conditional_0_Template, 13, 5, "section", 0);
      \u0275\u0275conditionalCreate(1, SlotsInputComponent_Conditional_1_Template, 2, 4, "app-popup", 1);
    }
    if (rf & 2) {
      \u0275\u0275conditional(ctx.shouldShowPanel() ? 0 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.showSchedulePopup ? 1 : -1);
    }
  }, dependencies: [
    CommonModule,
    FormsModule,
    NgControlStatus,
    NgModel,
    MatIconModule,
    MatIcon,
    AppMenuComponent,
    PopupComponent,
    TextCardComponent,
    FormFlowComponent,
    I18nPipe
  ], styles: ['\n[_nghost-%COMP%] {\n  display: block;\n  grid-column: 1/-1;\n}\n.event-slots-panel[_ngcontent-%COMP%] {\n  grid-column: 1/-1;\n  border: 1px solid rgba(93, 108, 128, 0.3);\n  border-radius: 16px;\n  background:\n    radial-gradient(\n      circle at 7% 8%,\n      rgba(255, 255, 255, 0.76),\n      transparent 34%),\n    linear-gradient(\n      180deg,\n      #f8fafc 0%,\n      #eef2f6 100%);\n  box-shadow: 0 4px 12px rgba(39, 53, 72, 0.08);\n  padding: 0.62rem 0.72rem;\n  display: grid;\n  gap: 0.62rem;\n}\n.event-slots-panel-head[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: minmax(0, 1fr) auto;\n  grid-template-areas: "title actions" "title secondary";\n  align-items: start;\n  gap: 0.75rem;\n}\n.event-slots-panel-title-wrap[_ngcontent-%COMP%] {\n  grid-area: title;\n  display: grid;\n  gap: 0.26rem;\n}\n.event-slots-panel-title[_ngcontent-%COMP%], \n.event-schedule-panel-title[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.5rem;\n  min-width: 0;\n}\n.event-schedule-panel-title[_ngcontent-%COMP%] {\n  color: #526174;\n  font-weight: 900;\n}\n.event-schedule-panel-title[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 18px;\n  height: 18px;\n  font-size: 18px;\n  line-height: 18px;\n}\n.event-slots-panel-subtitle[_ngcontent-%COMP%] {\n  margin: 0;\n  color: rgba(37, 58, 88, 0.74);\n  font-size: 0.8rem;\n  line-height: 1.4;\n}\n.event-slots-panel-actions[_ngcontent-%COMP%] {\n  grid-area: actions;\n  display: inline-flex;\n  align-items: center;\n  justify-content: flex-end;\n  flex-wrap: wrap;\n  gap: 0.4rem;\n  min-width: 0;\n}\n.event-slots-panel-secondary-actions[_ngcontent-%COMP%] {\n  grid-area: secondary;\n  display: inline-flex;\n  justify-content: flex-end;\n  flex-wrap: wrap;\n  gap: 0.4rem;\n  min-width: 0;\n}\n.event-slots-enable-btn[_ngcontent-%COMP%] {\n  min-width: 82px;\n  min-height: 38px;\n  padding: 0.3rem 0.62rem;\n  border-radius: 999px;\n  border: 1px solid rgba(128, 149, 176, 0.24);\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  gap: 0.4rem;\n  color: #5b6e8e;\n  background:\n    linear-gradient(\n      180deg,\n      #f4f7fb 0%,\n      #e9eff7 100%);\n  font-size: 0.76rem;\n  font-weight: 800;\n  text-transform: uppercase;\n  letter-spacing: 0.04em;\n  box-shadow: 0 2px 7px rgba(29, 53, 86, 0.08);\n  cursor: pointer;\n}\n.event-slots-enable-btn-on[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #ecf8ee 0%,\n      #ddf1e2 100%);\n  border-color: rgba(44, 126, 72, 0.32);\n  color: #2d7d47;\n}\n.event-slots-enable-btn[_ngcontent-%COMP%]:disabled {\n  cursor: default;\n  opacity: 0.58;\n  pointer-events: none;\n  filter: grayscale(0.35);\n  box-shadow: none;\n}\n.event-slots-enable-btn[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 18px;\n  height: 18px;\n  font-size: 18px;\n  line-height: 18px;\n}\n.event-slots-panel-body[_ngcontent-%COMP%], \n.event-slots-summary[_ngcontent-%COMP%], \n.event-slots-summary-list[_ngcontent-%COMP%] {\n  display: grid;\n}\n.event-slots-panel-body[_ngcontent-%COMP%] {\n  gap: 0.62rem;\n}\n.event-slots-summary[_ngcontent-%COMP%] {\n  gap: 0.72rem;\n}\n.event-slots-summary-add-menu[_ngcontent-%COMP%] {\n  justify-self: end;\n}\n.event-slots-summary-list[_ngcontent-%COMP%] {\n  grid-template-columns: repeat(3, minmax(0, 1fr));\n  align-items: stretch;\n  gap: 0.56rem;\n  min-width: 0;\n}\n.event-slots-summary-card[_ngcontent-%COMP%] {\n  display: block;\n  height: 100%;\n  min-width: 0;\n}\n.event-slots-summary-empty[_ngcontent-%COMP%] {\n  justify-self: start;\n  min-width: min(100%, 252px);\n  padding: 1rem 1.2rem;\n  border: 1px dashed rgba(128, 149, 176, 0.36);\n  border-radius: 14px;\n  color: #102a4a;\n  background: rgba(255, 255, 255, 0.58);\n  font-size: 0.9rem;\n  line-height: 1.35;\n  font-weight: 800;\n  box-sizing: border-box;\n}\n.event-slots-schedule-flow[_ngcontent-%COMP%] {\n  --form-flow-control-min-height: 38px;\n  --form-flow-control-padding: 7px 12px;\n  display: block;\n  min-width: 0;\n  min-height: 0;\n}\n@media (max-width: 760px) {\n  .event-slots-panel-head[_ngcontent-%COMP%] {\n    grid-template-columns: minmax(0, 1fr) auto;\n    grid-template-areas: "title actions" "title secondary";\n    align-items: start;\n  }\n  .event-slots-summary-list[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n  .event-slots-panel-actions[_ngcontent-%COMP%] {\n    justify-self: end;\n    justify-content: flex-end;\n  }\n  .event-slots-panel-secondary-actions[_ngcontent-%COMP%] {\n    justify-self: end;\n    justify-content: flex-end;\n  }\n}\n/*# sourceMappingURL=slots-input.component.css.map */'], changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SlotsInputComponent, [{
    type: Component,
    args: [{ selector: "app-slots-input", standalone: true, imports: [
      CommonModule,
      FormsModule,
      MatIconModule,
      AppMenuComponent,
      PopupComponent,
      TextCardComponent,
      FormFlowComponent,
      I18nPipe
    ], changeDetection: ChangeDetectionStrategy.OnPush, providers: [
      {
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => SlotsInputComponent),
        multi: true
      }
    ], template: `@if (shouldShowPanel()) {
<section class="event-slots-panel">
  <div class="event-slots-panel-head">
    <div class="event-slots-panel-title-wrap">
      <span class="event-slots-panel-title">
        <span class="event-schedule-panel-title">
          <mat-icon>schedule</mat-icon>
          <span>{{ resolvedConfig.title }}</span>
        </span>
      </span>
      @if (!readOnly) {
      <p class="event-slots-panel-subtitle">{{ slotsPanelSubtitle() }}</p>
      }
    </div>
    @if (canUpdateSlotsConfig()) {
    <div class="event-slots-panel-actions">
      <button type="button" class="event-slots-enable-btn" [class.event-slots-enable-btn-on]="slotsEnabled()"
        [class.event-slots-enable-btn-off]="!slotsEnabled()" [disabled]="!canUpdateSlotsConfig()"
        (click)="toggleSlotsEnabled($event)" [attr.aria-label]="'event.editor.slots.toggle.aria' | i18n">
        <mat-icon>{{ slotsEnabled() ? 'toggle_on' : 'toggle_off' }}</mat-icon>
        <span>{{ slotsEnabled() ? 'On' : 'Off' }}</span>
      </button>
    </div>
    }
    @if (canConfigureSlotsSeries()) {
    <div class="event-slots-panel-secondary-actions">
      <app-menu
        class="event-slots-summary-add-menu"
        kind="inline"
        [items]="slotSummaryAddMenuItems()"
        (itemSelect)="onSlotSummaryAddSelect($event)"
      ></app-menu>
    </div>
    }
  </div>
  @if (slotsEnabled()) {
  <div class="event-slots-panel-body">
    <div class="event-slots-summary">
      @if (slotSummaryBaseItems().length > 0) {
        <div class="event-slots-summary-list">
          @for (slot of slotSummaryBaseItems(); track slotTrackId($index, slot); let i = $index) {
          <app-text-card
            class="event-slots-summary-card"
            [tone]="slotSummaryCardTone(slot)"
            icon="schedule"
            [title]="slotTemplateLabel(i)"
            [meta]="slotSummaryWindowLabel(slot)"
            [menuTitle]="slotTemplateLabel(i)"
            [menuPalette]="slotSummaryMenuPalette(slot)"
            [menuCounter]="slotOverrideCount(slot) || null"
            [menuItems]="slotSummaryMenuItems(slot)"
            (menuSelect)="onBaseSlotSummaryMenuSelect(i, $event)"
          ></app-text-card>
          }
        </div>
        } @else {
        <div class="event-slots-summary-empty">{{ 'event.editor.slots.empty' | i18n }}</div>
        }
    </div>
  </div>
  }
</section>
}

@if (showSchedulePopup) {
<app-popup [model]="schedulePopupModel()" [zIndex]="popupZIndex">
  <app-form-flow
    class="event-slots-schedule-flow"
    [model]="scheduleFlowModel()"
    [ngModel]="scheduleFlowValue"
    (ngModelChange)="onScheduleFlowValueChange($event)"
  ></app-form-flow>
</app-popup>
}
`, styles: ['/* src/app/shared/ui/components/core/form/inputs/slots-input/slots-input.component.scss */\n:host {\n  display: block;\n  grid-column: 1/-1;\n}\n.event-slots-panel {\n  grid-column: 1/-1;\n  border: 1px solid rgba(93, 108, 128, 0.3);\n  border-radius: 16px;\n  background:\n    radial-gradient(\n      circle at 7% 8%,\n      rgba(255, 255, 255, 0.76),\n      transparent 34%),\n    linear-gradient(\n      180deg,\n      #f8fafc 0%,\n      #eef2f6 100%);\n  box-shadow: 0 4px 12px rgba(39, 53, 72, 0.08);\n  padding: 0.62rem 0.72rem;\n  display: grid;\n  gap: 0.62rem;\n}\n.event-slots-panel-head {\n  display: grid;\n  grid-template-columns: minmax(0, 1fr) auto;\n  grid-template-areas: "title actions" "title secondary";\n  align-items: start;\n  gap: 0.75rem;\n}\n.event-slots-panel-title-wrap {\n  grid-area: title;\n  display: grid;\n  gap: 0.26rem;\n}\n.event-slots-panel-title,\n.event-schedule-panel-title {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.5rem;\n  min-width: 0;\n}\n.event-schedule-panel-title {\n  color: #526174;\n  font-weight: 900;\n}\n.event-schedule-panel-title .mat-icon {\n  width: 18px;\n  height: 18px;\n  font-size: 18px;\n  line-height: 18px;\n}\n.event-slots-panel-subtitle {\n  margin: 0;\n  color: rgba(37, 58, 88, 0.74);\n  font-size: 0.8rem;\n  line-height: 1.4;\n}\n.event-slots-panel-actions {\n  grid-area: actions;\n  display: inline-flex;\n  align-items: center;\n  justify-content: flex-end;\n  flex-wrap: wrap;\n  gap: 0.4rem;\n  min-width: 0;\n}\n.event-slots-panel-secondary-actions {\n  grid-area: secondary;\n  display: inline-flex;\n  justify-content: flex-end;\n  flex-wrap: wrap;\n  gap: 0.4rem;\n  min-width: 0;\n}\n.event-slots-enable-btn {\n  min-width: 82px;\n  min-height: 38px;\n  padding: 0.3rem 0.62rem;\n  border-radius: 999px;\n  border: 1px solid rgba(128, 149, 176, 0.24);\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  gap: 0.4rem;\n  color: #5b6e8e;\n  background:\n    linear-gradient(\n      180deg,\n      #f4f7fb 0%,\n      #e9eff7 100%);\n  font-size: 0.76rem;\n  font-weight: 800;\n  text-transform: uppercase;\n  letter-spacing: 0.04em;\n  box-shadow: 0 2px 7px rgba(29, 53, 86, 0.08);\n  cursor: pointer;\n}\n.event-slots-enable-btn-on {\n  background:\n    linear-gradient(\n      180deg,\n      #ecf8ee 0%,\n      #ddf1e2 100%);\n  border-color: rgba(44, 126, 72, 0.32);\n  color: #2d7d47;\n}\n.event-slots-enable-btn:disabled {\n  cursor: default;\n  opacity: 0.58;\n  pointer-events: none;\n  filter: grayscale(0.35);\n  box-shadow: none;\n}\n.event-slots-enable-btn .mat-icon {\n  width: 18px;\n  height: 18px;\n  font-size: 18px;\n  line-height: 18px;\n}\n.event-slots-panel-body,\n.event-slots-summary,\n.event-slots-summary-list {\n  display: grid;\n}\n.event-slots-panel-body {\n  gap: 0.62rem;\n}\n.event-slots-summary {\n  gap: 0.72rem;\n}\n.event-slots-summary-add-menu {\n  justify-self: end;\n}\n.event-slots-summary-list {\n  grid-template-columns: repeat(3, minmax(0, 1fr));\n  align-items: stretch;\n  gap: 0.56rem;\n  min-width: 0;\n}\n.event-slots-summary-card {\n  display: block;\n  height: 100%;\n  min-width: 0;\n}\n.event-slots-summary-empty {\n  justify-self: start;\n  min-width: min(100%, 252px);\n  padding: 1rem 1.2rem;\n  border: 1px dashed rgba(128, 149, 176, 0.36);\n  border-radius: 14px;\n  color: #102a4a;\n  background: rgba(255, 255, 255, 0.58);\n  font-size: 0.9rem;\n  line-height: 1.35;\n  font-weight: 800;\n  box-sizing: border-box;\n}\n.event-slots-schedule-flow {\n  --form-flow-control-min-height: 38px;\n  --form-flow-control-padding: 7px 12px;\n  display: block;\n  min-width: 0;\n  min-height: 0;\n}\n@media (max-width: 760px) {\n  .event-slots-panel-head {\n    grid-template-columns: minmax(0, 1fr) auto;\n    grid-template-areas: "title actions" "title secondary";\n    align-items: start;\n  }\n  .event-slots-summary-list {\n    grid-template-columns: 1fr;\n  }\n  .event-slots-panel-actions {\n    justify-self: end;\n    justify-content: flex-end;\n  }\n  .event-slots-panel-secondary-actions {\n    justify-self: end;\n    justify-content: flex-end;\n  }\n}\n/*# sourceMappingURL=slots-input.component.css.map */\n'] }]
  }], () => [{ type: ChangeDetectorRef }], { config: [{
    type: Input
  }], popupZIndex: [{
    type: Input
  }], readOnly: [{
    type: Input
  }], disabled: [{
    type: Input
  }], overrideSelect: [{
    type: Output
  }], handleEscape: [{
    type: HostListener,
    args: ["document:keydown.escape", ["$event"]]
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(SlotsInputComponent, { className: "SlotsInputComponent", filePath: "app/shared/ui/components/core/form/inputs/slots-input/slots-input.component.ts", lineNumber: 80 });
})();

// src/app/shared/app-calendar-date-adapter.ts
var AppCalendarDateAdapter = class _AppCalendarDateAdapter extends NativeDateAdapter {
  parse(value) {
    if (typeof value === "string") {
      const normalized = value.trim();
      if (!normalized) {
        return null;
      }
      const match = normalized.match(/^(\d{4})[/-](\d{1,2})[/-](\d{1,2})$/);
      if (match) {
        const year = Number.parseInt(match[1], 10);
        const month = Number.parseInt(match[2], 10);
        const day = Number.parseInt(match[3], 10);
        if (Number.isFinite(year) && Number.isFinite(month) && Number.isFinite(day) && month >= 1 && month <= 12 && day >= 1 && day <= 31) {
          return new Date(year, month - 1, day);
        }
      }
    }
    return super.parse(value);
  }
  format(date, displayFormat) {
    if (`${displayFormat}` === "ymdInput") {
      const month = `${date.getMonth() + 1}`.padStart(2, "0");
      const day = `${date.getDate()}`.padStart(2, "0");
      return `${date.getFullYear()}/${month}/${day}`;
    }
    if (`${displayFormat}` === "hmInput") {
      return date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false });
    }
    return super.format(date, displayFormat);
  }
  static \u0275fac = /* @__PURE__ */ (() => {
    let \u0275AppCalendarDateAdapter_BaseFactory;
    return function AppCalendarDateAdapter_Factory(__ngFactoryType__) {
      return (\u0275AppCalendarDateAdapter_BaseFactory || (\u0275AppCalendarDateAdapter_BaseFactory = \u0275\u0275getInheritedFactory(_AppCalendarDateAdapter)))(__ngFactoryType__ || _AppCalendarDateAdapter);
    };
  })();
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _AppCalendarDateAdapter, factory: _AppCalendarDateAdapter.\u0275fac });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AppCalendarDateAdapter, [{
    type: Injectable
  }], null, null);
})();
var AppCalendarDateFormats = class {
  static dateTime = {
    parse: {
      dateInput: "ymdInput",
      timeInput: "hmInput"
    },
    display: {
      dateInput: "ymdInput",
      timeInput: "hmInput",
      timeOptionLabel: "hmInput",
      monthYearLabel: "MMM yyyy",
      dateA11yLabel: "LL",
      monthYearA11yLabel: "MMMM yyyy"
    }
  };
  static dateOnly = {
    parse: {
      dateInput: "ymdInput"
    },
    display: {
      dateInput: "ymdInput",
      monthYearLabel: "MMM yyyy",
      dateA11yLabel: "LL",
      monthYearA11yLabel: "MMMM yyyy"
    }
  };
};

// src/app/shared/ui/components/core/form/popups/profile-experience-manager/profile-experience-manager.component.ts
var _c0 = ["experienceImportInput"];
function ProfileExperienceManagerComponent_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 6)(1, "app-menu", 9);
    \u0275\u0275listener("itemSelect", function ProfileExperienceManagerComponent_Conditional_5_Template_app_menu_itemSelect_1_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onProfileExperienceMenuSelect($event));
    });
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("items", ctx_r1.experienceQuickActionMenuItems());
  }
}
function ProfileExperienceManagerComponent_ng_template_7_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "single-row", 10);
    \u0275\u0275listener("menuRequest", function ProfileExperienceManagerComponent_ng_template_7_Template_single_row_menuRequest_0_listener($event) {
      const openMenu_r4 = \u0275\u0275restoreView(_r3).openMenu;
      return \u0275\u0275resetView(openMenu_r4($event));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const row_r5 = ctx.$implicit;
    \u0275\u0275property("row", row_r5)("useSharedMenu", true);
  }
}
function ProfileExperienceManagerComponent_Conditional_9_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 15)(1, "mat-icon");
    \u0275\u0275text(2, "error");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div")(4, "strong");
    \u0275\u0275text(5, "Invalid document");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "p");
    \u0275\u0275text(7);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate(ctx_r1.experienceImportDialog.error);
  }
}
function ProfileExperienceManagerComponent_Conditional_9_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 16)(1, "div", 23)(2, "span");
    \u0275\u0275text(3, "Detected");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "strong");
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "div", 23)(7, "span");
    \u0275\u0275text(8, "Ready to add");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "strong");
    \u0275\u0275text(10);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(11, "div", 23)(12, "span");
    \u0275\u0275text(13, "Duplicates skipped");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "strong");
    \u0275\u0275text(15);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r1.experienceImportDialog.statistics.detectedCount);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r1.experienceImportDialog.statistics.importedCount);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r1.experienceImportDialog.statistics.duplicateCount);
  }
}
function ProfileExperienceManagerComponent_Conditional_9_Conditional_12_For_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 24)(1, "mat-icon");
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
    const option_r7 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275property("ngClass", ctx_r1.experienceTypeToneClass(option_r7));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.experienceTypeIcon(option_r7));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(option_r7);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.experienceImportTypeCount(option_r7));
  }
}
function ProfileExperienceManagerComponent_Conditional_9_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 17);
    \u0275\u0275repeaterCreate(1, ProfileExperienceManagerComponent_Conditional_9_Conditional_12_For_2_Template, 7, 4, "div", 24, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r1.experienceTypeOptions);
  }
}
function ProfileExperienceManagerComponent_Conditional_9_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 18)(1, "h4");
    \u0275\u0275text(2, "No categorized items found");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "p");
    \u0275\u0275text(4, "The document was parsed, but no experience cards were recognized in any category.");
    \u0275\u0275elementEnd()();
  }
}
function ProfileExperienceManagerComponent_Conditional_9_Conditional_14_For_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "li");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const warning_r8 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(warning_r8);
  }
}
function ProfileExperienceManagerComponent_Conditional_9_Conditional_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 19)(1, "h4");
    \u0275\u0275text(2, "Import notes");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "ul");
    \u0275\u0275repeaterCreate(4, ProfileExperienceManagerComponent_Conditional_9_Conditional_14_For_5_Template, 2, 1, "li", null, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(4);
    \u0275\u0275repeater(ctx_r1.experienceImportDialog.warnings);
  }
}
function ProfileExperienceManagerComponent_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "app-popup", 8)(1, "section", 11)(2, "div", 12)(3, "div", 13)(4, "span");
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "strong");
    \u0275\u0275text(7);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(8, "div", 14);
    \u0275\u0275element(9, "span");
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(10, ProfileExperienceManagerComponent_Conditional_9_Conditional_10_Template, 8, 1, "div", 15);
    \u0275\u0275conditionalCreate(11, ProfileExperienceManagerComponent_Conditional_9_Conditional_11_Template, 16, 3, "div", 16);
    \u0275\u0275conditionalCreate(12, ProfileExperienceManagerComponent_Conditional_9_Conditional_12_Template, 3, 0, "div", 17);
    \u0275\u0275conditionalCreate(13, ProfileExperienceManagerComponent_Conditional_9_Conditional_13_Template, 5, 0, "div", 18);
    \u0275\u0275conditionalCreate(14, ProfileExperienceManagerComponent_Conditional_9_Conditional_14_Template, 6, 0, "div", 19);
    \u0275\u0275elementStart(15, "div", 20)(16, "button", 21);
    \u0275\u0275listener("click", function ProfileExperienceManagerComponent_Conditional_9_Template_button_click_16_listener() {
      \u0275\u0275restoreView(_r6);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.cancelExperienceImportDialog());
    });
    \u0275\u0275text(17, " Cancel ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "button", 22);
    \u0275\u0275listener("click", function ProfileExperienceManagerComponent_Conditional_9_Template_button_click_18_listener() {
      \u0275\u0275restoreView(_r6);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.submitExperienceImport());
    });
    \u0275\u0275text(19, " Submit ");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("model", ctx_r1.experienceImportPopupModel())("zIndex", ctx_r1.experienceImportPopupZIndex());
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r1.experienceImportDialog.progress.label || "Preparing upload");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("", ctx_r1.experienceImportDialog.progress.percent, "%");
    \u0275\u0275advance(2);
    \u0275\u0275styleProp("width", ctx_r1.experienceImportDialog.progress.percent, "%");
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.experienceImportDialog.error ? 10 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(!ctx_r1.experienceImportDialog.error ? 11 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(!ctx_r1.experienceImportDialog.error ? 12 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(!ctx_r1.experienceImportDialog.error && ctx_r1.experienceImportDialog.statistics.detectedCount === 0 ? 13 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.experienceImportDialog.warnings.length > 0 ? 14 : -1);
    \u0275\u0275advance(4);
    \u0275\u0275property("disabled", !ctx_r1.canSubmitExperienceImport);
  }
}
function ProfileExperienceManagerComponent_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    const _r9 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "app-popup", 8)(1, "app-form-flow", 25);
    \u0275\u0275twoWayListener("ngModelChange", function ProfileExperienceManagerComponent_Conditional_10_Template_app_form_flow_ngModelChange_1_listener($event) {
      \u0275\u0275restoreView(_r9);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.experienceForm, $event) || (ctx_r1.experienceForm = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("model", ctx_r1.experienceFormPopupModel())("zIndex", ctx_r1.experienceFormPopupZIndex());
    \u0275\u0275advance();
    \u0275\u0275property("model", ctx_r1.experienceFormFlowModel());
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.experienceForm);
    \u0275\u0275property("disabled", ctx_r1.controlDisabled);
  }
}
var ProfileExperienceManagerComponent = class _ProfileExperienceManagerComponent {
  entries = [];
  initialFilter = "All";
  userId = "";
  experienceRouteConfig = null;
  emptyHint = "Try switching the type dropdown to All or use Upload.";
  allowImport = true;
  showInlineActions = false;
  entriesChange = new EventEmitter();
  overlayStateChange = new EventEmitter();
  experienceImportInput;
  cdr = inject(ChangeDetectorRef);
  dialogStore = inject(DialogStore);
  userExperiencesService = inject(UserExperiencesService);
  experienceImportToken = 0;
  overlayOpen = false;
  experienceEntriesRevision = 0;
  controlDisabled = false;
  onValueChange = () => void 0;
  onTouched = () => void 0;
  experienceFilterOptions = APP_STATIC_DATA.experienceFilterOptions;
  experienceTypeOptions = APP_STATIC_DATA.experienceTypeOptions;
  experienceEntries = [];
  experienceFilter = "All";
  showExperienceForm = false;
  editingExperienceId = null;
  pendingExperienceDeleteId = null;
  highlightedImportedExperienceIds = /* @__PURE__ */ new Set();
  experienceImportDialog = this.createEmptyExperienceImportDialogState();
  experienceForm = this.createEmptyExperienceForm();
  experienceSmartListQuery = this.createExperienceSmartListQuery();
  experienceSmartListConfig = {
    pageSize: 50,
    initialPageSize: 50,
    initialPageCount: 1,
    loadingDelayMs: 0,
    loadingWindowMs: 600,
    defaultView: "list",
    showBackgroundLoadingProgress: false,
    showStickyHeader: false,
    showFirstGroupMarker: false,
    listLayout: "stack",
    snapMode: "none",
    desktopColumns: 1,
    containerClass: "experience-card-list",
    emptyLabel: "No entries in this filter",
    emptyDescription: () => this.emptyHint,
    trackBy: (_index, row) => row.id
  };
  experienceSmartListLoadPage = (query) => from(this.loadExperienceRowsPage(query));
  writeValue(value) {
    this.setLocalEntries(Array.isArray(value) ? value : []);
    this.cdr.markForCheck();
  }
  registerOnChange(fn) {
    this.onValueChange = fn;
  }
  registerOnTouched(fn) {
    this.onTouched = fn;
  }
  setDisabledState(isDisabled) {
    this.controlDisabled = isDisabled;
    this.cdr.markForCheck();
  }
  ngOnChanges(changes) {
    if (changes["entries"]) {
      this.setLocalEntries(this.entries);
    }
    if (changes["initialFilter"]) {
      this.setFilter(this.initialFilter);
    }
    if ((changes["userId"] || changes["experienceRouteConfig"]) && !changes["entries"]) {
      this.bumpExperienceRows();
    }
  }
  async loadExperienceRowsPage(query) {
    const entries = await this.loadExperienceEntriesForList();
    const rows = this.experienceRowsForFilter(query.filters?.type ?? this.experienceFilter, entries);
    const pageSize = Math.max(1, Math.trunc(Number(query.pageSize) || rows.length || 50));
    const page = Math.max(0, Math.trunc(Number(query.page) || 0));
    const start = page * pageSize;
    return {
      items: rows.slice(start, start + pageSize),
      total: rows.length
    };
  }
  get canSaveExperienceEntry() {
    return Boolean(this.experienceForm.title.trim() && this.experienceForm.org.trim() && this.isoDateToYearMonth(this.experienceForm.dateFrom));
  }
  get canSubmitExperienceImport() {
    return !this.experienceImportDialog.busy && !this.experienceImportDialog.error && (this.experienceImportDialog.draft?.importedIds.length ?? 0) > 0;
  }
  openCreate(defaultType = "Workspace") {
    if (this.controlDisabled) {
      return;
    }
    this.openExperienceForm(void 0, defaultType);
  }
  openImport() {
    if (this.controlDisabled || !this.allowImport) {
      return;
    }
    const input = this.experienceImportInput?.nativeElement;
    if (!input) {
      return;
    }
    input.value = "";
    input.click();
  }
  setFilter(filter) {
    this.experienceFilter = this.isExperienceFilter(filter) ? filter : "All";
    this.syncExperienceSmartListQuery();
    this.cdr.markForCheck();
  }
  closeActiveOverlay() {
    if (this.experienceImportDialog.visible) {
      this.cancelExperienceImportDialog();
      return true;
    }
    if (this.showExperienceForm) {
      this.closeExperienceForm();
      return true;
    }
    if (this.pendingExperienceDeleteId) {
      this.cancelExperienceDelete();
      return true;
    }
    return false;
  }
  onProfileExperienceMenuSelect(event) {
    const context = event.context;
    if (!context) {
      return;
    }
    switch (context.kind) {
      case "experienceFilter":
        this.setFilter(context.value);
        return;
      case "experienceType":
        this.experienceForm = __spreadProps(__spreadValues({}, this.experienceForm), {
          type: context.value
        });
        return;
      case "experienceQuickAction":
        if (context.action === "create") {
          this.openCreate(this.experienceFilter === "All" ? "Workspace" : this.experienceFilter);
          return;
        }
        this.openImport();
        return;
    }
  }
  onExperienceImportFileChange(event) {
    const target = event.target;
    const file = target.files?.[0];
    target.value = "";
    if (!file) {
      return;
    }
    void this.prepareExperienceImport(file);
  }
  cancelExperienceImportDialog() {
    this.experienceImportToken += 1;
    this.experienceImportDialog = this.createEmptyExperienceImportDialogState();
    this.syncOverlayState();
    this.cdr.markForCheck();
  }
  async submitExperienceImport() {
    if (this.controlDisabled || !this.canSubmitExperienceImport || !this.experienceImportDialog.draft) {
      return;
    }
    const draft = this.experienceImportDialog.draft;
    await this.commitExperienceEntries(draft.nextEntries, draft.importedIds);
    this.experienceFilter = "All";
    this.experienceImportDialog = this.createEmptyExperienceImportDialogState();
    this.syncOverlayState();
    this.cdr.markForCheck();
  }
  isExperienceEntryHighlighted(entryId) {
    return this.highlightedImportedExperienceIds.has(entryId);
  }
  experienceImportTypeCount(type) {
    return this.experienceImportDialog.statistics.countsByType[type] ?? 0;
  }
  experienceQuickActionMenuItems() {
    return [
      {
        id: "experience-actions",
        icon: "add",
        closeIcon: "close",
        ariaLabel: "Open experience actions",
        palette: "blue",
        items: [
          {
            id: "experience-action-create",
            label: "Create",
            icon: "add_circle",
            palette: "teal",
            surface: "tinted",
            context: { kind: "experienceQuickAction", action: "create" }
          },
          {
            id: "experience-action-upload",
            label: "Upload",
            icon: "upload_file",
            palette: "orange",
            surface: "tinted",
            disabled: !this.allowImport,
            context: { kind: "experienceQuickAction", action: "upload" }
          }
        ]
      }
    ];
  }
  experienceFilterMenuTrigger() {
    return {
      label: this.experienceFilter,
      icon: this.experienceFilterIcon(this.experienceFilter),
      palette: this.paletteFromProfileTone(this.experienceFilterClass(this.experienceFilter)),
      layout: "field",
      ariaLabel: "Open experience filter"
    };
  }
  experienceFilterMenuItems() {
    return this.experienceFilterOptions.map((option) => ({
      id: this.menuItemId("experience-filter", option),
      label: option,
      icon: this.experienceFilterIcon(option),
      kind: "radio",
      active: option === this.experienceFilter,
      palette: this.paletteFromProfileTone(this.experienceFilterClass(option)),
      surface: "tinted",
      context: { kind: "experienceFilter", value: option }
    }));
  }
  experienceTypeMenuTrigger() {
    return {
      label: this.experienceForm.type,
      icon: this.experienceTypeIcon(this.experienceForm.type),
      palette: this.paletteFromProfileTone(this.experienceTypeToneClass(this.experienceForm.type)),
      layout: "field",
      ariaLabel: "Open experience type selector"
    };
  }
  experienceTypeMenuItems() {
    return this.experienceTypeOptions.map((option) => ({
      id: this.menuItemId("experience-type", option),
      label: option,
      icon: this.experienceTypeIcon(option),
      kind: "radio",
      value: option,
      active: option === this.experienceForm.type,
      palette: this.paletteFromProfileTone(this.experienceTypeToneClass(option)),
      surface: "tinted",
      context: { kind: "experienceType", value: option }
    }));
  }
  experienceFormPopupModel() {
    return {
      title: this.editingExperienceId ? "Edit Experience" : "Add Experience",
      ariaLabel: this.editingExperienceId ? "Edit experience" : "Add experience",
      closeAriaLabel: "Close experience form",
      size: "wide",
      headerTone: "accent",
      backdropTone: "dim",
      closeOnBackdrop: true,
      headerActions: [
        {
          id: "experience-form-save",
          icon: "done",
          ariaLabel: "Save experience",
          palette: "green",
          disabled: !this.canSaveExperienceEntry
        }
      ],
      onClose: () => this.closeExperienceForm(),
      onAction: (event) => this.onExperienceFormPopupAction(event)
    };
  }
  experienceFormPopupZIndex() {
    return 4300;
  }
  experienceImportPopupModel() {
    return {
      title: "Import Experience",
      subtitle: this.experienceImportDialog.fileName,
      ariaLabel: "Import Experience",
      closeAriaLabel: "Close import dialog",
      size: "default",
      headerTone: "accent",
      backdropTone: "dim",
      closeOnBackdrop: true,
      onClose: () => this.cancelExperienceImportDialog()
    };
  }
  experienceImportPopupZIndex() {
    return 4300;
  }
  experienceFormFlowModel() {
    return {
      title: "Experience",
      layout: "grouped",
      tone: this.experienceFormFlowTone(),
      header: false,
      completion: {
        controls: "required"
      },
      steps: [
        {
          id: "experience-details",
          title: "Experience",
          icon: this.experienceTypeIcon(this.experienceForm.type),
          controls: [
            {
              id: "type",
              bind: "type",
              kind: "menu",
              label: "Type",
              layout: "half",
              required: true,
              config: {
                kind: "select",
                title: "Experience Type",
                trigger: this.experienceTypeMenuTrigger(),
                items: this.experienceTypeMenuItems(),
                closeOnSelect: true
              }
            },
            {
              id: "city",
              bind: "city",
              kind: "text",
              label: "City",
              layout: "half"
            },
            {
              id: "title",
              bind: "title",
              kind: "text",
              label: "Title",
              layout: "half",
              required: true
            },
            {
              id: "org",
              bind: "org",
              kind: "text",
              label: "Organization",
              layout: "half",
              required: true
            },
            {
              id: "dateFrom",
              bind: "dateFrom",
              kind: "date",
              label: "From",
              layout: "half",
              required: true,
              config: {
                model: {
                  mode: "single",
                  precision: "date",
                  valueFormat: "iso-date",
                  field: {
                    label: "From",
                    placeholder: "YYYY/MM/DD",
                    required: true
                  }
                }
              }
            },
            {
              id: "dateTo",
              bind: "dateTo",
              kind: "date",
              label: "To",
              layout: "half",
              config: {
                model: {
                  mode: "single",
                  precision: "date",
                  valueFormat: "iso-date",
                  field: {
                    label: "To",
                    placeholder: "Present"
                  }
                }
              }
            },
            {
              id: "description",
              bind: "description",
              kind: "textarea",
              label: "Description",
              rows: 4,
              layout: "wide"
            }
          ]
        }
      ]
    };
  }
  experienceFormFlowTone() {
    switch (this.experienceForm.type) {
      case "Workspace":
        return "orange";
      case "School":
        return "blue";
      case "Online Session":
        return "green";
      default:
        return "default";
    }
  }
  onExperienceFormPopupAction(event) {
    if (event.action.id !== "experience-form-save") {
      return;
    }
    void this.saveExperienceEntry();
  }
  experienceTypeIcon(type) {
    switch (type) {
      case "Workspace":
        return "apartment";
      case "School":
        return "school";
      case "Online Session":
        return "videocam";
      default:
        return "rocket_launch";
    }
  }
  experienceFilterIcon(option) {
    switch (option) {
      case "Workspace":
        return "apartment";
      case "School":
        return "school";
      case "Online Session":
        return "videocam";
      case "Additional Project":
        return "rocket_launch";
      default:
        return "filter_alt";
    }
  }
  experienceFilterClass(option) {
    switch (option) {
      case "Workspace":
        return "experience-filter-workspace";
      case "School":
        return "experience-filter-school";
      case "Online Session":
        return "experience-filter-online";
      case "Additional Project":
        return "experience-filter-project";
      default:
        return "experience-filter-all";
    }
  }
  experienceTypeToneClass(type) {
    switch (type) {
      case "Workspace":
        return "experience-filter-workspace";
      case "School":
        return "experience-filter-school";
      case "Online Session":
        return "experience-filter-online";
      default:
        return "experience-filter-project";
    }
  }
  openExperienceForm(entry, defaultType = "Workspace") {
    if (this.controlDisabled) {
      return;
    }
    this.pendingExperienceDeleteId = null;
    this.showExperienceForm = true;
    if (entry) {
      this.editingExperienceId = entry.id;
      this.experienceForm = {
        type: entry.type,
        title: entry.title,
        org: entry.org,
        city: entry.city,
        dateFrom: this.yearMonthToIsoDate(entry.dateFrom),
        dateTo: entry.dateTo === "Present" ? "" : this.yearMonthToIsoDate(entry.dateTo),
        description: entry.description
      };
      this.syncOverlayState();
      this.cdr.markForCheck();
      return;
    }
    this.editingExperienceId = null;
    this.resetExperienceForm(defaultType);
    this.syncOverlayState();
    this.cdr.markForCheck();
  }
  closeExperienceForm() {
    this.showExperienceForm = false;
    this.editingExperienceId = null;
    this.resetExperienceForm();
    this.syncOverlayState();
    this.cdr.markForCheck();
  }
  async saveExperienceEntry() {
    if (this.controlDisabled || !this.canSaveExperienceEntry) {
      return;
    }
    const dateFrom = this.isoDateToYearMonth(this.experienceForm.dateFrom);
    if (!dateFrom) {
      return;
    }
    const dateTo = this.isoDateToYearMonth(this.experienceForm.dateTo) || "Present";
    const payload = __spreadProps(__spreadValues({}, this.experienceForm), {
      dateFrom,
      title: this.experienceForm.title.trim(),
      org: this.experienceForm.org.trim(),
      city: this.experienceForm.city.trim(),
      dateTo: dateTo || "Present",
      description: this.experienceForm.description.trim()
    });
    const nextEntries = this.editingExperienceId ? this.experienceEntries.map((item) => item.id === this.editingExperienceId ? __spreadValues(__spreadValues({}, item), payload) : item) : [
      ...this.experienceEntries,
      __spreadValues({ id: this.createExperienceId() }, payload)
    ];
    await this.commitExperienceEntries(nextEntries);
    this.showExperienceForm = false;
    this.editingExperienceId = null;
    this.resetExperienceForm();
    this.syncOverlayState();
    this.cdr.markForCheck();
  }
  requestExperienceDelete(entryId) {
    if (this.controlDisabled) {
      return;
    }
    this.pendingExperienceDeleteId = entryId;
    this.syncOverlayState();
    this.dialogStore.open({
      title: "Delete experience?",
      message: "This entry will be removed from your profile.",
      cancelLabel: "Cancel",
      confirmLabel: "Delete",
      busyConfirmLabel: "Deleting...",
      confirmTone: "danger",
      failureMessage: "Unable to delete this experience.",
      onCancel: () => this.cancelExperienceDelete(),
      onConfirm: () => this.confirmExperienceDelete()
    });
    this.cdr.markForCheck();
  }
  onExperienceRowSharedMenuSelect(event) {
    const context = event.context;
    const row = context?.row ?? context?.card;
    if (!row || !context?.action?.id) {
      return;
    }
    const entry = row.entry ?? row.eagerDetail;
    if (!entry) {
      return;
    }
    if (context.action.id === "edit") {
      this.openExperienceForm(entry);
      return;
    }
    if (context.action.id === "delete") {
      this.requestExperienceDelete(entry.id);
    }
  }
  cancelExperienceDelete() {
    this.pendingExperienceDeleteId = null;
    this.dialogStore.close();
    this.syncOverlayState();
    this.cdr.markForCheck();
  }
  async confirmExperienceDelete() {
    if (this.controlDisabled || !this.pendingExperienceDeleteId) {
      return;
    }
    const nextEntries = this.experienceEntries.filter((item) => item.id !== this.pendingExperienceDeleteId);
    await this.commitExperienceEntries(nextEntries);
    this.pendingExperienceDeleteId = null;
    this.syncOverlayState();
    this.cdr.markForCheck();
  }
  async prepareExperienceImport(file) {
    const importToken = ++this.experienceImportToken;
    this.experienceImportDialog = __spreadProps(__spreadValues({}, this.createEmptyExperienceImportDialogState()), {
      visible: true,
      fileName: file.name,
      busy: true,
      progress: {
        stage: "reading",
        percent: 0,
        label: "Preparing import preview"
      }
    });
    this.syncOverlayState();
    this.cdr.markForCheck();
    try {
      const draft = await this.userExperiencesService.prepareUserExperienceImport(file, this.experienceEntries, (progress) => {
        if (importToken !== this.experienceImportToken) {
          return;
        }
        this.experienceImportDialog = __spreadProps(__spreadValues({}, this.experienceImportDialog), {
          visible: true,
          fileName: file.name,
          busy: true,
          progress,
          error: null
        });
        this.cdr.markForCheck();
      });
      if (importToken !== this.experienceImportToken) {
        return;
      }
      this.experienceImportDialog = {
        visible: true,
        fileName: file.name,
        busy: false,
        progress: {
          stage: "ready",
          percent: 100,
          label: draft.statistics.detectedCount > 0 ? "Import preview ready" : "No experience items recognized"
        },
        statistics: draft.statistics,
        warnings: [...draft.warnings],
        error: null,
        draft
      };
      this.syncOverlayState();
      this.cdr.markForCheck();
    } catch (error) {
      if (importToken !== this.experienceImportToken) {
        return;
      }
      this.experienceImportDialog = __spreadProps(__spreadValues({}, this.createEmptyExperienceImportDialogState()), {
        visible: true,
        fileName: file.name,
        error: this.resolveExperienceImportError(error),
        progress: {
          stage: "ready",
          percent: 100,
          label: "Import preview unavailable"
        }
      });
      this.syncOverlayState();
      this.cdr.markForCheck();
    }
  }
  createEmptyExperienceForm(defaultType = "Workspace") {
    return {
      type: defaultType,
      title: "",
      org: "",
      city: "",
      dateFrom: "",
      dateTo: "",
      description: ""
    };
  }
  resetExperienceForm(defaultType = "Workspace") {
    this.experienceForm = this.createEmptyExperienceForm(defaultType);
  }
  yearMonthToIsoDate(value) {
    const parsed = AppUtils.fromYearMonth(value);
    return parsed ? AppUtils.toIsoDate(parsed) : "";
  }
  isoDateToYearMonth(value) {
    const normalized = `${value ?? ""}`.trim();
    if (/^\d{4}-\d{2}$/.test(normalized)) {
      return normalized;
    }
    const parsed = AppUtils.fromIsoDate(normalized);
    return parsed ? AppUtils.toYearMonth(parsed) : "";
  }
  createEmptyExperienceImportDialogState() {
    return {
      visible: false,
      fileName: "",
      busy: false,
      progress: {
        stage: "ready",
        percent: 0,
        label: ""
      },
      statistics: this.createEmptyExperienceImportStatistics(),
      warnings: [],
      error: null,
      draft: null
    };
  }
  createEmptyExperienceImportStatistics() {
    return {
      detectedCount: 0,
      importedCount: 0,
      duplicateCount: 0,
      countsByType: {
        Workspace: 0,
        School: 0,
        "Online Session": 0,
        "Additional Project": 0
      }
    };
  }
  async loadExperienceEntriesForList() {
    if (!this.hasExperienceRoute()) {
      return this.experienceEntries;
    }
    const userId = this.normalizedUserId();
    const routedEntries = await this.userExperiencesService.loadUserExperiences(userId, this.experienceRouteConfig);
    if (this.experienceEntries.length > 0 && this.experienceEntriesSignature(routedEntries) !== this.experienceEntriesSignature(this.experienceEntries)) {
      const seededEntries = await this.userExperiencesService.saveUserExperiences(userId, this.experienceEntries, this.experienceRouteConfig);
      this.replaceLocalEntriesWithoutListRefresh(seededEntries);
      return seededEntries;
    }
    this.replaceLocalEntriesWithoutListRefresh(routedEntries);
    return routedEntries;
  }
  async commitExperienceEntries(entries, highlightedIds = null) {
    const savedEntries = await this.saveExperienceEntries(entries);
    this.setLocalEntries(savedEntries, highlightedIds);
    this.emitEntriesChange(savedEntries, highlightedIds ?? void 0);
  }
  async saveExperienceEntries(entries) {
    if (!this.hasExperienceRoute()) {
      return this.cloneExperienceEntries(entries);
    }
    return this.userExperiencesService.saveUserExperiences(this.normalizedUserId(), entries, this.experienceRouteConfig);
  }
  hasExperienceRoute() {
    return Boolean(this.normalizedUserId() && this.experienceRouteConfig?.mode);
  }
  normalizedUserId() {
    return this.userId.trim();
  }
  replaceLocalEntriesWithoutListRefresh(entries) {
    const nextEntries = this.cloneExperienceEntries(entries);
    this.experienceEntries = nextEntries;
    this.pruneHighlightedExperienceIds(nextEntries);
  }
  experienceEntriesSignature(entries) {
    return entries.map((entry) => [
      entry.id,
      entry.type,
      entry.title,
      entry.org,
      entry.city,
      entry.dateFrom,
      entry.dateTo,
      entry.description
    ].join("")).join("");
  }
  setLocalEntries(entries, highlightedIds = null) {
    const nextEntries = this.cloneExperienceEntries(entries);
    this.experienceEntries = nextEntries;
    if (highlightedIds) {
      const validIds = new Set(nextEntries.map((entry) => entry.id));
      this.highlightedImportedExperienceIds = new Set(highlightedIds.filter((id) => validIds.has(id)));
      this.bumpExperienceRows();
      return;
    }
    this.pruneHighlightedExperienceIds(nextEntries);
    this.bumpExperienceRows();
  }
  bumpExperienceRows() {
    this.experienceEntriesRevision += 1;
    this.syncExperienceSmartListQuery();
  }
  syncExperienceSmartListQuery() {
    this.experienceSmartListQuery = this.createExperienceSmartListQuery();
  }
  createExperienceSmartListQuery() {
    return {
      page: 0,
      pageSize: 50,
      filters: {
        type: this.experienceFilter,
        revision: this.experienceEntriesRevision
      }
    };
  }
  experienceRowsForFilter(filter, entries = this.experienceEntries) {
    const filtered = entries.filter((item) => filter === "All" || item.type === filter);
    return [...filtered].sort((a, b) => AppUtils.toSortableDate(b.dateFrom) - AppUtils.toSortableDate(a.dateFrom)).map((entry) => this.toExperienceRow(entry));
  }
  toExperienceRow(entry) {
    return {
      id: entry.id,
      status: entry.type,
      dateIso: entry.dateFrom,
      title: entry.title,
      subtitle: [entry.org, entry.city].filter(Boolean).join(" \xB7 "),
      detail: entry.description,
      icon: this.experienceTypeIcon(entry.type),
      surfaceTone: this.experienceRowSurfaceTone(entry.type),
      badges: [
        {
          label: `${entry.dateFrom} - ${entry.dateTo}`,
          tone: "inverse",
          position: "top-right"
        }
      ],
      menuActions: ["edit", "delete"],
      entry,
      eagerDetail: entry
    };
  }
  experienceRowSurfaceTone(type) {
    switch (type) {
      case "Workspace":
        return "danger";
      case "School":
        return "info";
      case "Online Session":
        return "success";
      default:
        return "accent";
    }
  }
  emitEntriesChange(entries, highlightedIds) {
    const nextEntries = this.cloneExperienceEntries(entries);
    this.onValueChange(nextEntries);
    this.onTouched();
    this.entriesChange.emit({
      entries: nextEntries,
      highlightedIds: highlightedIds ? [...highlightedIds] : void 0
    });
  }
  pruneHighlightedExperienceIds(entries) {
    if (this.highlightedImportedExperienceIds.size === 0) {
      return;
    }
    const validIds = new Set(entries.map((entry) => entry.id));
    this.highlightedImportedExperienceIds = new Set([...this.highlightedImportedExperienceIds].filter((id) => validIds.has(id)));
  }
  cloneExperienceEntries(entries) {
    return entries.map((entry) => __spreadValues({}, entry));
  }
  createExperienceId() {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
      return `exp-${crypto.randomUUID()}`;
    }
    return `exp-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  }
  menuItemId(prefix, value) {
    return `${prefix}-${AppUtils.normalizeText(value).replace(/[^a-z0-9]+/g, "-")}`;
  }
  isExperienceFilter(value) {
    return value === "All" || this.experienceTypeOptions.includes(value);
  }
  paletteFromProfileTone(toneClass) {
    switch (toneClass) {
      case "experience-filter-school":
        return "blue";
      case "experience-filter-workspace":
        return "red";
      case "experience-filter-online":
        return "green";
      case "experience-filter-project":
      case "experience-filter-all":
        return "purple";
      default:
        return "blue";
    }
  }
  resolveExperienceImportError(error) {
    if (error instanceof Error) {
      const normalizedMessage = error.message.trim();
      if (normalizedMessage) {
        return normalizedMessage;
      }
    }
    return "Invalid document. Please upload a PDF, DOC, DOCX, ODT, RTF, or TXT file.";
  }
  syncOverlayState() {
    const nextOverlayOpen = Boolean(this.showExperienceForm || this.pendingExperienceDeleteId || this.experienceImportDialog.visible);
    if (nextOverlayOpen === this.overlayOpen) {
      return;
    }
    this.overlayOpen = nextOverlayOpen;
    this.overlayStateChange.emit(nextOverlayOpen);
  }
  static \u0275fac = function ProfileExperienceManagerComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ProfileExperienceManagerComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ProfileExperienceManagerComponent, selectors: [["app-profile-experience-manager"]], viewQuery: function ProfileExperienceManagerComponent_Query(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275viewQuery(_c0, 5);
    }
    if (rf & 2) {
      let _t;
      \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.experienceImportInput = _t.first);
    }
  }, inputs: { entries: "entries", initialFilter: "initialFilter", userId: "userId", experienceRouteConfig: "experienceRouteConfig", emptyHint: "emptyHint", allowImport: "allowImport", showInlineActions: "showInlineActions" }, outputs: { entriesChange: "entriesChange", overlayStateChange: "overlayStateChange" }, features: [\u0275\u0275ProvidersFeature([
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => _ProfileExperienceManagerComponent),
      multi: true
    },
    { provide: DateAdapter, useClass: AppCalendarDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: AppCalendarDateFormats.dateOnly }
  ]), \u0275\u0275NgOnChangesFeature], decls: 11, vars: 10, consts: [["experienceImportInput", ""], ["experienceRowTemplate", ""], [1, "experience-popup"], ["type", "file", "accept", ".pdf,.doc,.docx,.odt,.rtf,.txt", 1, "image-file-input-hidden", 3, "change"], [1, "experience-toolbar"], ["kind", "select", 1, "experience-filter-select", 3, "itemSelect", "title", "trigger", "items"], [1, "experience-inline-actions"], [3, "menuItemSelect", "config", "loadPage", "itemTemplate", "query"], [3, "model", "zIndex"], ["kind", "inline", 3, "itemSelect", "items"], [3, "menuRequest", "row", "useSharedMenu"], [1, "experience-import-panel"], [1, "experience-import-progress-card"], [1, "experience-import-progress-meta"], [1, "experience-import-progress-bar"], [1, "experience-import-error"], [1, "experience-import-stats"], [1, "experience-import-type-stats"], [1, "editor-list-card"], [1, "experience-import-warnings"], [1, "popup-actions", "experience-import-actions"], ["type", "button", 1, "link-btn", "neutral-btn", 3, "click"], ["type", "button", 1, "link-btn", "primary-btn", 3, "click", "disabled"], [1, "experience-import-stat"], [1, "experience-import-type-chip", 3, "ngClass"], [1, "experience-form-flow", 3, "ngModelChange", "model", "ngModel", "disabled"]], template: function ProfileExperienceManagerComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 2)(1, "input", 3, 0);
      \u0275\u0275listener("change", function ProfileExperienceManagerComponent_Template_input_change_1_listener($event) {
        return ctx.onExperienceImportFileChange($event);
      });
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(3, "div", 4)(4, "app-menu", 5);
      \u0275\u0275listener("itemSelect", function ProfileExperienceManagerComponent_Template_app_menu_itemSelect_4_listener($event) {
        return ctx.onProfileExperienceMenuSelect($event);
      });
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(5, ProfileExperienceManagerComponent_Conditional_5_Template, 2, 1, "div", 6);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(6, "app-smart-list", 7);
      \u0275\u0275listener("menuItemSelect", function ProfileExperienceManagerComponent_Template_app_smart_list_menuItemSelect_6_listener($event) {
        return ctx.onExperienceRowSharedMenuSelect($event);
      });
      \u0275\u0275elementEnd();
      \u0275\u0275template(7, ProfileExperienceManagerComponent_ng_template_7_Template, 1, 2, "ng-template", null, 1, \u0275\u0275templateRefExtractor);
      \u0275\u0275conditionalCreate(9, ProfileExperienceManagerComponent_Conditional_9_Template, 20, 12, "app-popup", 8);
      \u0275\u0275conditionalCreate(10, ProfileExperienceManagerComponent_Conditional_10_Template, 2, 5, "app-popup", 8);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      const experienceRowTemplate_r10 = \u0275\u0275reference(8);
      \u0275\u0275advance(4);
      \u0275\u0275property("title", "Experience")("trigger", ctx.experienceFilterMenuTrigger())("items", ctx.experienceFilterMenuItems());
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.showInlineActions ? 5 : -1);
      \u0275\u0275advance();
      \u0275\u0275property("config", ctx.experienceSmartListConfig)("loadPage", ctx.experienceSmartListLoadPage)("itemTemplate", experienceRowTemplate_r10)("query", ctx.experienceSmartListQuery);
      \u0275\u0275advance(3);
      \u0275\u0275conditional(ctx.experienceImportDialog.visible ? 9 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.showExperienceForm ? 10 : -1);
    }
  }, dependencies: [
    CommonModule,
    NgClass,
    FormsModule,
    NgControlStatus,
    NgModel,
    MatIconModule,
    MatIcon,
    AppMenuComponent,
    FormFlowComponent,
    PopupComponent,
    SmartListComponent,
    SingleRowComponent
  ], styles: ['\n[_nghost-%COMP%] {\n  display: contents;\n  --line: rgba(23, 33, 54, 0.12);\n  --line-strong: rgba(23, 33, 54, 0.2);\n  --text-main: #22324a;\n  --text-muted: rgba(23, 41, 66, 0.72);\n}\n.app-popup[_ngcontent-%COMP%] {\n  position: fixed;\n  inset: 0;\n  z-index: 2300;\n  display: flex;\n  align-items: flex-start;\n  justify-content: center;\n  padding: 1rem;\n}\n.app-popup-backdrop[_ngcontent-%COMP%] {\n  position: absolute;\n  inset: 0;\n  background: #e9edf5;\n}\n.app-popup-panel[_ngcontent-%COMP%] {\n  position: relative;\n  z-index: 1;\n  width: min(1080px, 100vw - 1.2rem);\n  max-height: calc(100vh - 1.2rem);\n  max-height: calc(100dvh - 1.2rem);\n  border-radius: 14px;\n  background: #fff;\n  box-shadow: 0 18px 42px rgba(0, 0, 0, 0.26);\n  overflow: hidden;\n  display: flex;\n  flex-direction: column;\n}\n.app-popup-panel.popup-panel-wide[_ngcontent-%COMP%] {\n  width: min(1080px, 100vw - 1.2rem);\n}\n.app-popup-panel.popup-panel-full-height[_ngcontent-%COMP%] {\n  height: calc(100vh - 1.2rem);\n  height: calc(100dvh - 1.2rem);\n  max-height: calc(100vh - 1.2rem);\n  max-height: calc(100dvh - 1.2rem);\n}\n.app-popup-panel.popup-panel-image-editor[_ngcontent-%COMP%] {\n  height: calc(100vh - 1.2rem);\n  height: calc(100dvh - 1.2rem);\n}\n.app-popup-panel.popup-panel-profile-editor[_ngcontent-%COMP%] {\n  width: min(1080px, 100vw - 1.2rem);\n  height: calc(100vh - 1.2rem);\n  height: calc(100dvh - 1.2rem);\n}\n.app-popup-panel.popup-panel-profile-selector[_ngcontent-%COMP%] {\n  width: min(1080px, 100vw - 1.2rem);\n  height: calc(100vh - 1.2rem);\n  height: calc(100dvh - 1.2rem);\n}\n.popup-header[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  gap: 0.4rem;\n  padding: 0.58rem 0.4rem;\n  border-bottom: 1px solid var(--line);\n  position: relative;\n}\n.popup-header[_ngcontent-%COMP%]    > .popup-title[_ngcontent-%COMP%] {\n  min-width: 0;\n  flex: 1 1 auto;\n}\n.popup-header.popup-header-with-back[_ngcontent-%COMP%] {\n  justify-content: flex-start;\n}\n.popup-title[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 1.05rem;\n  color: var(--text-main);\n  font-weight: 700;\n}\n.popup-subtitle[_ngcontent-%COMP%], \n.popup-subtitle-activities[_ngcontent-%COMP%] {\n  margin: 0.14rem 0 0;\n  font-size: 0.74rem;\n  font-weight: 700;\n  color: rgba(21, 39, 62, 0.72);\n}\n.popup-subtitle-secondary[_ngcontent-%COMP%], \n.popup-subtitle-activities-secondary[_ngcontent-%COMP%] {\n  margin-top: 0.04rem;\n  font-size: 0.68rem;\n  font-weight: 800;\n  letter-spacing: 0.01em;\n  color: rgba(21, 39, 62, 0.58);\n}\n.popup-body[_ngcontent-%COMP%] {\n  padding: 0.4rem;\n  overflow-y: auto;\n  overflow-x: hidden;\n  display: flex;\n  flex-direction: column;\n  gap: 0.72rem;\n  flex: 1 1 auto;\n  min-height: 0;\n}\n.popup-body.popup-body-experience[_ngcontent-%COMP%] {\n  position: relative;\n  padding-bottom: 0.74rem;\n}\n.popup-close[_ngcontent-%COMP%] {\n  flex: 0 0 auto;\n  width: 34px;\n  height: 34px;\n  min-width: 34px;\n  min-height: 34px;\n  border: 1px solid rgba(47, 86, 139, 0.2);\n  border-radius: 50%;\n  background: rgba(255, 255, 255, 0.92);\n  color: rgba(38, 67, 105, 0.92);\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  cursor: pointer;\n  padding: 0;\n  line-height: 0;\n  box-sizing: border-box;\n  box-shadow: 0 8px 18px rgba(37, 62, 95, 0.12);\n  --mdc-icon-button-state-layer-size: 34px;\n}\n.popup-close[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  width: 21px;\n  height: 21px;\n  font-size: 21px;\n  line-height: 21px;\n  margin: 0;\n}\n.popup-close[_ngcontent-%COMP%]:not(:disabled):not([aria-disabled=true]):hover {\n  border-color: rgba(47, 86, 139, 0.32);\n  background: #fff;\n  color: rgba(24, 50, 84, 0.98);\n}\n.popup-close[_ngcontent-%COMP%]:not(:disabled):not([aria-disabled=true]):active {\n  background: rgba(239, 245, 252, 0.96);\n}\n.popup-close[_ngcontent-%COMP%]:focus-visible {\n  outline: 2px solid rgba(61, 108, 186, 0.35);\n  outline-offset: 1px;\n}\n.popup-close[_ngcontent-%COMP%]:disabled, \n.popup-close[aria-disabled=true][_ngcontent-%COMP%] {\n  opacity: 0.56;\n  cursor: default;\n}\n.popup-header-with-progress[_ngcontent-%COMP%], \n.popup-header-with-activities-progress[_ngcontent-%COMP%] {\n  border-bottom-color: rgba(46, 114, 184, 0.2);\n}\n.popup-surface-overlay[_ngcontent-%COMP%], \n.experience-form-overlay[_ngcontent-%COMP%] {\n  position: fixed;\n  inset: 0;\n  z-index: 15;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  padding: 0.9rem;\n}\n.popup-surface-overlay-backdrop[_ngcontent-%COMP%], \n.experience-form-overlay-backdrop[_ngcontent-%COMP%] {\n  position: absolute;\n  inset: 0;\n  background: rgba(8, 16, 30, 0.76);\n}\n.popup-surface[_ngcontent-%COMP%], \n.experience-form-popup[_ngcontent-%COMP%] {\n  position: relative;\n  z-index: 1;\n  width: min(860px, 100vw - 2rem);\n  max-height: calc(100vh - 1.8rem);\n  overflow: hidden;\n  border-radius: 16px;\n  background: #fff;\n  box-sizing: border-box;\n  border: 1px solid rgba(42, 66, 102, 0.28);\n  box-shadow: 0 24px 60px rgba(14, 32, 58, 0.26);\n  display: flex;\n  flex-direction: column;\n  contain: layout paint;\n}\n.popup-surface-header[_ngcontent-%COMP%], \n.experience-form-header[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.6rem;\n  padding: 0.82rem 1rem;\n  border-bottom: 1px solid var(--line);\n  background:\n    linear-gradient(\n      180deg,\n      #ffffff 0%,\n      #f4f8ff 100%);\n}\n.popup-surface-header-title[_ngcontent-%COMP%] {\n  min-width: 0;\n  display: inline-flex;\n  flex-direction: column;\n  gap: 0.08rem;\n}\n.popup-surface-header[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%], \n.experience-form-header[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 1.12rem;\n  color: var(--text-main);\n  font-weight: 700;\n}\n.popup-surface-header-title[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 0.78rem;\n  color: rgba(53, 79, 114, 0.86);\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.popup-surface-header-controls[_ngcontent-%COMP%], \n.experience-form-header-controls[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.44rem;\n}\n.popup-header-add-btn[_ngcontent-%COMP%] {\n  width: 30px;\n  height: 30px;\n  border: 1px solid rgba(30, 88, 152, 0.46);\n  border-radius: 50%;\n  background:\n    linear-gradient(\n      180deg,\n      #e2f0ff 0%,\n      #c5dbf8 100%);\n  color: #15457c;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  cursor: pointer;\n  box-shadow: 0 2px 8px rgba(31, 79, 132, 0.18);\n}\n.popup-header-add-btn[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n  line-height: 16px;\n  pointer-events: none;\n}\n.popup-header-add-btn[_ngcontent-%COMP%]:hover {\n  background:\n    linear-gradient(\n      180deg,\n      #d4e8ff 0%,\n      #b5d1f3 100%);\n  border-color: rgba(27, 74, 130, 0.6);\n  color: #103966;\n  box-shadow: 0 4px 10px rgba(28, 69, 114, 0.24);\n}\n.popup-header-add-btn[_ngcontent-%COMP%]:active:not(:disabled) {\n  box-shadow: 0 1px 4px rgba(36, 74, 121, 0.2);\n}\n.popup-header-add-btn.subevent-leaderboard-save-btn[_ngcontent-%COMP%] {\n  border-color: rgba(46, 121, 69, 0.46);\n  background:\n    linear-gradient(\n      180deg,\n      #e6faec 0%,\n      #c9f0d5 100%);\n  color: #1f6f39;\n}\n.popup-header-add-btn.subevent-leaderboard-save-btn[_ngcontent-%COMP%]:hover {\n  border-color: rgba(38, 98, 58, 0.64);\n  background:\n    linear-gradient(\n      180deg,\n      #d8f5e2 0%,\n      #b8e8c8 100%);\n  color: #175a2d;\n}\n.popup-header-add-btn[_ngcontent-%COMP%]:disabled {\n  opacity: 0.54;\n  cursor: not-allowed;\n  box-shadow: 0 2px 8px rgba(31, 79, 132, 0.12);\n}\n.popup-header-add-btn.form-save-invalid[_ngcontent-%COMP%], \n.popup-header-add-btn.form-save-invalid[_ngcontent-%COMP%]:disabled {\n  border-color: rgba(147, 31, 31, 0.86);\n  background:\n    linear-gradient(\n      180deg,\n      #ef5c5c 0%,\n      #cb2f2f 100%);\n  color: #fff;\n  opacity: 1;\n  box-shadow: 0 2px 8px rgba(122, 25, 25, 0.22);\n}\n.popup-surface-close-btn[_ngcontent-%COMP%], \n.experience-form-close-btn[_ngcontent-%COMP%] {\n  width: 34px;\n  height: 34px;\n  border: 0;\n  border-radius: 50%;\n  background: transparent;\n  color: rgba(42, 57, 77, 0.88);\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  cursor: pointer;\n  padding: 0;\n}\n.popup-surface-close-btn[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%], \n.experience-form-close-btn[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 18px;\n  height: 18px;\n  font-size: 18px;\n  line-height: 18px;\n  pointer-events: none;\n}\n.popup-surface-close-btn[_ngcontent-%COMP%]:not(:disabled):not([aria-disabled=true]):hover, \n.experience-form-close-btn[_ngcontent-%COMP%]:not(:disabled):not([aria-disabled=true]):hover {\n  background: rgba(110, 124, 145, 0.18);\n  color: rgba(28, 40, 57, 0.94);\n}\n.popup-surface-close-btn[_ngcontent-%COMP%]:not(:disabled):not([aria-disabled=true]):active, \n.experience-form-close-btn[_ngcontent-%COMP%]:not(:disabled):not([aria-disabled=true]):active {\n  background: rgba(96, 111, 134, 0.24);\n}\n.popup-surface-body[_ngcontent-%COMP%], \n.experience-form-panel[_ngcontent-%COMP%] {\n  border: 1px solid rgba(43, 71, 107, 0.2);\n  border-radius: 14px;\n  background: #f8fbff;\n  padding: 0.74rem;\n  display: grid;\n  gap: 0.78rem;\n  margin: 0;\n  box-sizing: border-box;\n  flex: 1 1 auto;\n  min-height: 0;\n  align-items: start;\n  align-content: start;\n  overflow-y: auto;\n  overflow-x: hidden;\n  -webkit-overflow-scrolling: touch;\n  scrollbar-gutter: stable;\n}\n.mobile-profile-selector-sheet-wrap[_ngcontent-%COMP%] {\n  position: fixed;\n  inset: 0;\n  z-index: 2800;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  padding: 1rem;\n}\n.mobile-profile-selector-backdrop[_ngcontent-%COMP%] {\n  position: absolute;\n  inset: 0;\n  background: rgba(8, 16, 30, 0.5);\n}\n.mobile-profile-selector-sheet[_ngcontent-%COMP%] {\n  position: relative;\n  width: fit-content;\n  min-width: 230px;\n  max-width: min(92vw, 420px);\n  max-height: min(78vh, 620px);\n  border-radius: 16px;\n  border: 1px solid #d6deea;\n  background: #fff;\n  box-shadow: 0 16px 32px rgba(15, 29, 52, 0.24);\n  padding: 0.4rem 0.6rem 0.58rem;\n  display: flex;\n  flex-direction: column;\n}\n.mobile-profile-selector-sheet.mobile-profile-selector-sheet-language[_ngcontent-%COMP%] {\n  width: min(94vw, 620px);\n  min-width: 340px;\n  max-width: min(94vw, 620px);\n  height: min(78vh, 620px);\n  max-height: min(78vh, 620px);\n}\n.mobile-profile-selector-sheet.mobile-profile-selector-sheet-language[_ngcontent-%COMP%]   .mobile-profile-selector-title[_ngcontent-%COMP%], \n.mobile-profile-selector-sheet.mobile-profile-selector-sheet-language[_ngcontent-%COMP%]   .mobile-profile-language-entry[_ngcontent-%COMP%] {\n  flex: 0 0 auto;\n  width: 100%;\n}\n.mobile-profile-selector-sheet.mobile-profile-selector-sheet-language[_ngcontent-%COMP%]   .mobile-profile-language-chips[_ngcontent-%COMP%] {\n  width: 100%;\n  align-content: flex-start;\n}\n.mobile-profile-selector-sheet.mobile-profile-selector-sheet-language[_ngcontent-%COMP%]   .mobile-profile-selector-options[_ngcontent-%COMP%] {\n  flex: 1 1 auto;\n  overflow-x: hidden;\n  overflow-y: auto;\n  margin-top: 0.18rem;\n  justify-items: stretch;\n  align-content: start;\n  grid-auto-rows: max-content;\n}\n.mobile-profile-selector-sheet.mobile-profile-selector-sheet-language[_ngcontent-%COMP%]   .mobile-profile-selector-option[_ngcontent-%COMP%] {\n  width: 100%;\n  min-width: 0;\n  min-height: 46px;\n}\n.mobile-profile-selector-handle[_ngcontent-%COMP%] {\n  width: 42px;\n  height: 4px;\n  border-radius: 999px;\n  background: rgba(44, 67, 100, 0.24);\n  margin: 0.08rem auto 0.52rem;\n}\n.mobile-profile-selector-title[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.28rem;\n  padding: 0 0.14rem;\n  color: #1c3354;\n  font-size: 0.94rem;\n  font-weight: 800;\n  position: relative;\n}\n.mobile-profile-selector-close-btn[_ngcontent-%COMP%] {\n  margin-left: auto;\n  width: 34px;\n  height: 34px;\n  border: 0;\n  border-radius: 50%;\n  background: transparent;\n  color: rgba(42, 57, 77, 0.88);\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  padding: 0;\n  cursor: pointer;\n}\n.mobile-profile-selector-close-btn[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 18px;\n  height: 18px;\n  font-size: 18px;\n  line-height: 18px;\n}\n.mobile-profile-selector-close-btn[_ngcontent-%COMP%]:not(:disabled):not([aria-disabled=true]):hover {\n  background: rgba(110, 124, 145, 0.18);\n  color: rgba(28, 40, 57, 0.94);\n}\n.mobile-profile-selector-close-btn[_ngcontent-%COMP%]:not(:disabled):not([aria-disabled=true]):active {\n  background: rgba(96, 111, 134, 0.24);\n}\n.mobile-profile-selector-options[_ngcontent-%COMP%] {\n  margin-top: 0.42rem;\n  display: grid;\n  gap: 0.32rem;\n  justify-items: center;\n  max-height: min(64vh, 520px);\n  overflow: auto;\n  overscroll-behavior: contain;\n}\n.mobile-profile-selector-option[_ngcontent-%COMP%] {\n  width: max-content;\n  min-width: 220px;\n  max-width: 100%;\n  border: 1px solid rgba(58, 81, 114, 0.24);\n  border-radius: 12px;\n  background: #f7f9fd;\n  color: #1f3f67;\n  min-height: 42px;\n  padding: 0.46rem 0.62rem;\n  display: inline-flex;\n  align-items: center;\n  justify-content: space-between;\n}\n.mobile-profile-selector-option-main[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.36rem;\n  min-width: 0;\n  text-align: left;\n}\n.mobile-profile-selector-option.active[_ngcontent-%COMP%] {\n  box-shadow: inset 0 0 0 1px rgba(24, 46, 76, 0.24);\n  filter: brightness(0.95);\n}\n@media (max-width: 760px) {\n  .app-popup[_ngcontent-%COMP%] {\n    padding: 0;\n    align-items: stretch;\n  }\n  .app-popup-panel[_ngcontent-%COMP%], \n   .app-popup-panel.popup-panel-profile-editor[_ngcontent-%COMP%], \n   .app-popup-panel.popup-panel-profile-selector[_ngcontent-%COMP%], \n   .app-popup-panel.popup-panel-image-editor[_ngcontent-%COMP%] {\n    width: 100vw !important;\n    max-width: 100vw !important;\n    height: 100vh !important;\n    height: 100dvh !important;\n    max-height: 100vh !important;\n    max-height: 100dvh !important;\n    min-height: 100dvh;\n    margin: 0 !important;\n    border-radius: 0;\n    box-shadow: none;\n  }\n  .experience-form-overlay[_ngcontent-%COMP%] {\n    padding: 0;\n    align-items: stretch;\n    justify-content: stretch;\n  }\n  .experience-form-popup[_ngcontent-%COMP%] {\n    width: 100vw;\n    max-width: 100vw;\n    height: 100svh;\n    height: 100vh;\n    height: 100dvh;\n    max-height: 100svh;\n    max-height: 100vh;\n    max-height: 100dvh;\n    border-radius: 0;\n  }\n  .experience-form-panel[_ngcontent-%COMP%] {\n    min-height: 0;\n    flex: 1 1 auto;\n    border-radius: 0;\n  }\n  .app-popup-panel.popup-panel-profile-editor[_ngcontent-%COMP%]   .popup-body[_ngcontent-%COMP%] {\n    display: flex !important;\n    flex-direction: column;\n    min-height: 0;\n    height: 100%;\n    overflow: hidden !important;\n    overflow-x: hidden !important;\n    padding-bottom: 0;\n  }\n  .app-popup-panel.popup-panel-profile-editor[_ngcontent-%COMP%]   .profile-editor-wrap[_ngcontent-%COMP%] {\n    display: grid;\n    grid-template-rows: auto minmax(0, 1fr);\n    min-height: 0;\n    height: 100%;\n    overflow: hidden;\n  }\n  .app-popup-panel.popup-panel-profile-editor[_ngcontent-%COMP%]   .profile-editor-scroll-area[_ngcontent-%COMP%] {\n    flex: 1 1 auto;\n    min-height: 0;\n    max-height: none;\n    overflow-y: auto !important;\n    overflow-x: hidden !important;\n    padding-bottom: calc(0.74rem + env(safe-area-inset-bottom));\n    scroll-padding-bottom: calc(0.74rem + env(safe-area-inset-bottom));\n    overscroll-behavior: contain;\n    -webkit-overflow-scrolling: touch;\n  }\n  .popup-surface-overlay[_ngcontent-%COMP%], \n   .experience-form-overlay[_ngcontent-%COMP%] {\n    padding: 0;\n    align-items: stretch;\n    justify-content: stretch;\n  }\n  .popup-surface[_ngcontent-%COMP%], \n   .experience-form-popup[_ngcontent-%COMP%] {\n    width: 100%;\n    max-width: 100%;\n    min-width: 0;\n    height: 100dvh;\n    max-height: 100dvh;\n    border-radius: 0;\n  }\n  .popup-surface-body[_ngcontent-%COMP%], \n   .experience-form-panel[_ngcontent-%COMP%] {\n    min-height: 0;\n    flex: 1 1 auto;\n    border-radius: 0;\n  }\n  .mobile-profile-selector-sheet-wrap[_ngcontent-%COMP%] {\n    display: block;\n    padding: 0;\n  }\n  .mobile-profile-selector-sheet[_ngcontent-%COMP%] {\n    position: absolute;\n    left: 0.65rem;\n    right: 0.65rem;\n    bottom: 0;\n    width: auto;\n    box-sizing: border-box;\n    min-width: 0;\n    max-width: 100vw;\n    max-height: calc(100dvh - 0.4rem);\n    border-radius: 16px 16px 0 0;\n    border-bottom: 0;\n    box-shadow: 0 -16px 32px rgba(15, 29, 52, 0.24);\n    padding: 0.4rem 0.6rem max(0.58rem, env(safe-area-inset-bottom));\n  }\n  .mobile-profile-selector-sheet.mobile-profile-selector-sheet-language[_ngcontent-%COMP%] {\n    top: 0;\n    left: 0;\n    right: 0;\n    bottom: 0;\n    width: 100vw;\n    max-width: 100vw;\n    height: var(--mobile-language-sheet-height, 100svh);\n    max-height: var(--mobile-language-sheet-height, 100svh);\n    border-radius: 0;\n    padding: max(0.4rem, env(safe-area-inset-top)) 0.6rem max(0.58rem, env(safe-area-inset-bottom));\n    display: flex;\n    flex-direction: column;\n  }\n  .mobile-profile-selector-options[_ngcontent-%COMP%] {\n    justify-items: stretch;\n    max-height: none;\n    flex: 1 1 auto;\n  }\n  .mobile-profile-selector-option[_ngcontent-%COMP%] {\n    width: 100%;\n    min-width: 0;\n  }\n  .app-popup-panel.popup-panel-image-editor[_ngcontent-%COMP%] {\n    height: 100vh !important;\n    height: 100dvh !important;\n  }\n  .popup-body.popup-body-image-editor[_ngcontent-%COMP%] {\n    height: calc(100vh - 58px);\n    height: calc(100dvh - 58px);\n    padding: 0.45rem;\n  }\n}\n[_nghost-%COMP%] {\n  --interactive-motion-duration: 160ms;\n  --interactive-motion-ease: cubic-bezier(0.22, 1, 0.36, 1);\n  --interactive-hover-lift: -1px;\n  --interactive-hover-scale: 1.01;\n  --interactive-hover-brightness: 1.01;\n  --interactive-press-scale: 0.97;\n  --interactive-press-brightness: 0.97;\n}\n[_ngcontent-%COMP%]:where(button, a[href], [role=button], .link-btn, .popup-view-fab, .popup-header-add-btn, .activities-view-option, .profile-status-select-wrap, .profile-details-values-btn, .profile-details-privacy-btn, .profile-privacy-menu-option, .popup-close, .date-picker-btn, .avatar-edit-btn, .experience-form-close-btn, .image-editor-grid button, .image-stack-line, .image-stack-hit-segment, .mobile-profile-selector-close-btn, .mobile-profile-selector-option, .popup-panel-profile-selector .profile-filter-selector-clear, .popup-panel-profile-selector .profile-filter-selector-chip, .popup-panel-profile-selector .profile-selector-chip, .item-action-menu-btn, .experience-action-btn, .header-icon-btn, .chat-header-members, .activities-row-item-clickable, .activities-card-btn, .asset-source-icon, .event-editor-members-trigger, .motion-card, [data-motion=card]):not(.motion-static):not([data-motion=none]) {\n  -webkit-tap-highlight-color: transparent;\n  transition:\n    transform var(--interactive-motion-duration) var(--interactive-motion-ease),\n    filter var(--interactive-motion-duration) var(--interactive-motion-ease),\n    box-shadow var(--interactive-motion-duration) var(--interactive-motion-ease),\n    background-color var(--interactive-motion-duration) var(--interactive-motion-ease),\n    border-color var(--interactive-motion-duration) var(--interactive-motion-ease),\n    color var(--interactive-motion-duration) var(--interactive-motion-ease);\n  transform-origin: center;\n}\n[_ngcontent-%COMP%]:where(button, a[href], [role=button], .link-btn, .popup-view-fab, .popup-header-add-btn, .activities-view-option, .profile-status-select-wrap, .profile-details-values-btn, .profile-details-privacy-btn, .profile-privacy-menu-option, .popup-close, .date-picker-btn, .avatar-edit-btn, .experience-form-close-btn, .image-editor-grid button, .image-stack-line, .image-stack-hit-segment, .mobile-profile-selector-close-btn, .mobile-profile-selector-option, .popup-panel-profile-selector .profile-filter-selector-clear, .popup-panel-profile-selector .profile-filter-selector-chip, .popup-panel-profile-selector .profile-selector-chip, .item-action-menu-btn, .experience-action-btn, .header-icon-btn, .chat-header-members, .activities-row-item-clickable, .activities-card-btn, .asset-source-icon, .event-editor-members-trigger, .motion-card, [data-motion=card]):not(.motion-static):not([data-motion=none]):focus-visible {\n  outline: 2px solid rgba(66, 110, 182, 0.44);\n  outline-offset: 2px;\n}\n@media (hover: hover) and (pointer: fine) {\n  [_ngcontent-%COMP%]:where(button, a[href], [role=button], .link-btn, .popup-view-fab, .popup-header-add-btn, .activities-view-option, .profile-status-select-wrap, .profile-details-values-btn, .profile-details-privacy-btn, .profile-privacy-menu-option, .popup-close, .date-picker-btn, .avatar-edit-btn, .experience-form-close-btn, .image-editor-grid button, .image-stack-line, .image-stack-hit-segment, .mobile-profile-selector-close-btn, .mobile-profile-selector-option, .popup-panel-profile-selector .profile-filter-selector-clear, .popup-panel-profile-selector .profile-filter-selector-chip, .popup-panel-profile-selector .profile-selector-chip, .item-action-menu-btn, .experience-action-btn, .header-icon-btn, .chat-header-members, .activities-row-item-clickable, .activities-card-btn, .asset-source-icon, .event-editor-members-trigger, .motion-card, [data-motion=card]):not(.motion-static):not([data-motion=none]):not(:disabled):not([aria-disabled=true]):hover {\n    transform: translateY(var(--interactive-hover-lift)) scale(var(--interactive-hover-scale));\n    filter: brightness(var(--interactive-hover-brightness));\n  }\n  [_ngcontent-%COMP%]:where(button, a[href], [role=button], .link-btn, .popup-view-fab, .popup-header-add-btn, .activities-view-option, .profile-status-select-wrap, .profile-details-values-btn, .profile-details-privacy-btn, .profile-privacy-menu-option, .popup-close, .date-picker-btn, .avatar-edit-btn, .experience-form-close-btn, .image-editor-grid button, .image-stack-line, .image-stack-hit-segment, .mobile-profile-selector-close-btn, .mobile-profile-selector-option, .popup-panel-profile-selector .profile-filter-selector-clear, .popup-panel-profile-selector .profile-filter-selector-chip, .popup-panel-profile-selector .profile-selector-chip, .item-action-menu-btn, .experience-action-btn, .header-icon-btn, .chat-header-members, .activities-row-item-clickable, .activities-card-btn, .asset-source-icon, .event-editor-members-trigger, .motion-card, [data-motion=card]):not(.motion-static):not([data-motion=none]):not(:disabled):not([aria-disabled=true]):active {\n    transform: scale(var(--interactive-press-scale));\n    filter: brightness(var(--interactive-press-brightness));\n  }\n  [_ngcontent-%COMP%]:where(.motion-card, [data-motion=card]):not(.motion-static):not([data-motion=none]):hover {\n    box-shadow: 0 3px 10px rgba(16, 29, 48, 0.14);\n  }\n}\n@keyframes _ngcontent-%COMP%_shared-mobile-touch-feedback {\n  0% {\n    transform: scale(1);\n    filter: brightness(1);\n  }\n  45% {\n    transform: scale(var(--interactive-press-scale));\n    filter: brightness(var(--interactive-press-brightness));\n  }\n  100% {\n    transform: scale(1);\n    filter: brightness(1);\n  }\n}\n@media (hover: none), (pointer: coarse) {\n  [_ngcontent-%COMP%]:where(button, a[href], [role=button], .link-btn, .popup-view-fab, .popup-header-add-btn, .activities-view-option, .profile-status-select-wrap, .profile-details-values-btn, .profile-details-privacy-btn, .profile-privacy-menu-option, .popup-close, .date-picker-btn, .avatar-edit-btn, .experience-form-close-btn, .image-editor-grid button, .image-stack-line, .image-stack-hit-segment, .mobile-profile-selector-close-btn, .mobile-profile-selector-option, .popup-panel-profile-selector .profile-filter-selector-clear, .popup-panel-profile-selector .profile-filter-selector-chip, .popup-panel-profile-selector .profile-selector-chip, .item-action-menu-btn, .experience-action-btn, .header-icon-btn, .chat-header-members, .activities-row-item-clickable, .activities-card-btn, .asset-source-icon, .event-editor-members-trigger, .motion-card, [data-motion=card]):not(.motion-static):not([data-motion=none]):not(:disabled):not([aria-disabled=true]):active {\n    animation: _ngcontent-%COMP%_shared-mobile-touch-feedback 0.2s ease;\n  }\n}\n.app-popup[_ngcontent-%COMP%], \n.mobile-profile-selector-sheet-wrap[_ngcontent-%COMP%], \n.popup-surface[_ngcontent-%COMP%], \n.experience-form-popup[_ngcontent-%COMP%] {\n  font-family:\n    "Nunito Sans",\n    "Segoe UI",\n    sans-serif;\n}\n.app-popup[_ngcontent-%COMP%]   button[_ngcontent-%COMP%], \n.app-popup[_ngcontent-%COMP%]   input[_ngcontent-%COMP%], \n.app-popup[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%], \n.app-popup[_ngcontent-%COMP%]   select[_ngcontent-%COMP%], \n.app-popup[_ngcontent-%COMP%]   .mat-mdc-select[_ngcontent-%COMP%], \n.app-popup[_ngcontent-%COMP%]   .mat-mdc-select-value-text[_ngcontent-%COMP%], \n.app-popup[_ngcontent-%COMP%]   .mat-mdc-option[_ngcontent-%COMP%], \n.popup-surface[_ngcontent-%COMP%]   button[_ngcontent-%COMP%], \n.popup-surface[_ngcontent-%COMP%]   input[_ngcontent-%COMP%], \n.popup-surface[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%], \n.popup-surface[_ngcontent-%COMP%]   select[_ngcontent-%COMP%], \n.popup-surface[_ngcontent-%COMP%]   .mat-mdc-select[_ngcontent-%COMP%], \n.popup-surface[_ngcontent-%COMP%]   .mat-mdc-select-value-text[_ngcontent-%COMP%], \n.popup-surface[_ngcontent-%COMP%]   .mat-mdc-option[_ngcontent-%COMP%], \n.experience-form-popup[_ngcontent-%COMP%]   button[_ngcontent-%COMP%], \n.experience-form-popup[_ngcontent-%COMP%]   input[_ngcontent-%COMP%], \n.experience-form-popup[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%], \n.experience-form-popup[_ngcontent-%COMP%]   select[_ngcontent-%COMP%], \n.experience-form-popup[_ngcontent-%COMP%]   .mat-mdc-select[_ngcontent-%COMP%], \n.experience-form-popup[_ngcontent-%COMP%]   .mat-mdc-select-value-text[_ngcontent-%COMP%], \n.experience-form-popup[_ngcontent-%COMP%]   .mat-mdc-option[_ngcontent-%COMP%], \n.mobile-profile-selector-sheet-wrap[_ngcontent-%COMP%]   button[_ngcontent-%COMP%], \n.mobile-profile-selector-sheet-wrap[_ngcontent-%COMP%]   input[_ngcontent-%COMP%], \n.mobile-profile-selector-sheet-wrap[_ngcontent-%COMP%]   .mat-mdc-option[_ngcontent-%COMP%] {\n  font-family: inherit;\n}\n.popup-filter-picker[_ngcontent-%COMP%], \n.activities-view-picker[_ngcontent-%COMP%] {\n  position: relative;\n  z-index: 60;\n  margin-left: auto;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.34rem;\n}\n.popup-filter-picker-secondary[_ngcontent-%COMP%], \n.activities-secondary-picker[_ngcontent-%COMP%] {\n  position: relative;\n  z-index: 61;\n}\n.selector-like[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.35rem;\n}\n.profile-status-select-wrap.popup-compact-select[_ngcontent-%COMP%], \n.profile-status-select-wrap.activities-compact-select[_ngcontent-%COMP%], \n.profile-status-select-wrap.assets-compact-select[_ngcontent-%COMP%] {\n  width: fit-content !important;\n  min-width: 0 !important;\n  max-width: 100%;\n}\n.profile-status-select-wrap.popup-compact-select[_ngcontent-%COMP%]   .mat-mdc-select[_ngcontent-%COMP%], \n.profile-status-select-wrap.activities-compact-select[_ngcontent-%COMP%]   .mat-mdc-select[_ngcontent-%COMP%], \n.profile-status-select-wrap.assets-compact-select[_ngcontent-%COMP%]   .mat-mdc-select[_ngcontent-%COMP%] {\n  width: auto;\n  min-width: 0;\n}\n.profile-status-select-wrap.popup-compact-select[_ngcontent-%COMP%]   .mat-mdc-select-trigger[_ngcontent-%COMP%], \n.profile-status-select-wrap.activities-compact-select[_ngcontent-%COMP%]   .mat-mdc-select-trigger[_ngcontent-%COMP%], \n.profile-status-select-wrap.assets-compact-select[_ngcontent-%COMP%]   .mat-mdc-select-trigger[_ngcontent-%COMP%] {\n  width: auto !important;\n  min-width: 0;\n}\n.profile-status-select-wrap.popup-compact-select[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%], \n.profile-status-select-wrap.activities-compact-select[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%], \n.profile-status-select-wrap.assets-compact-select[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%] {\n  width: auto;\n  min-width: 0;\n}\n.profile-status-select-wrap.popup-filter-no-badge[_ngcontent-%COMP%], \n.profile-status-select-wrap.activities-filter-no-badge[_ngcontent-%COMP%] {\n  min-width: 0;\n}\n.profile-status-select-wrap.popup-filter-no-badge[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%], \n.profile-status-select-wrap.activities-filter-no-badge[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%] {\n  width: auto !important;\n  flex: 0 1 auto;\n}\n.profile-status-select-wrap.popup-filter-no-badge[_ngcontent-%COMP%]   .mat-mdc-select[_ngcontent-%COMP%], \n.profile-status-select-wrap.activities-filter-no-badge[_ngcontent-%COMP%]   .mat-mdc-select[_ngcontent-%COMP%] {\n  width: auto;\n  min-width: 0;\n}\n.profile-status-select-wrap.popup-filter-no-badge[_ngcontent-%COMP%]   .mat-mdc-select-trigger[_ngcontent-%COMP%], \n.profile-status-select-wrap.activities-filter-no-badge[_ngcontent-%COMP%]   .mat-mdc-select-trigger[_ngcontent-%COMP%] {\n  width: auto !important;\n}\n.profile-status-select-wrap.popup-filter-no-badge[_ngcontent-%COMP%]   .mat-mdc-select-arrow-wrapper[_ngcontent-%COMP%], \n.profile-status-select-wrap.activities-filter-no-badge[_ngcontent-%COMP%]   .mat-mdc-select-arrow-wrapper[_ngcontent-%COMP%] {\n  margin-left: 0.28rem;\n}\n.profile-status-select-wrap[_ngcontent-%COMP%] {\n  min-width: 174px;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.38rem;\n  border: 1px solid #c8d3e2;\n  border-radius: 999px;\n  box-shadow: 0 2px 6px rgba(38, 60, 92, 0.08);\n  padding: 0.12rem 0.5rem 0.12rem 0.84rem;\n  background: #f8f9fb;\n}\n.profile-status-select-wrap.selector-like[_ngcontent-%COMP%] {\n  min-height: 36px;\n}\n.status-option-content[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: flex-start;\n  gap: 0.2rem;\n  text-transform: lowercase;\n  width: 100%;\n  min-width: 0;\n}\n.status-option-content[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]:last-child {\n  white-space: nowrap;\n}\n.status-option-content[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n  line-height: 16px;\n  flex: 0 0 16px;\n}\n.rate-filter-count-badge[_ngcontent-%COMP%] {\n  margin-left: auto;\n  width: 20px;\n  height: 20px;\n  border-radius: 50%;\n  border: 1px solid #fff;\n  background: #d84d4d;\n  color: #fff;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  padding: 0;\n  font-size: 0.68rem;\n  font-weight: 800;\n  line-height: 1;\n  box-shadow: 0 2px 8px rgba(120, 24, 24, 0.22);\n}\n.rate-filter-trigger-badge[_ngcontent-%COMP%] {\n  position: absolute;\n  top: -8px;\n  right: -8px;\n  margin-left: 0;\n  z-index: 2;\n}\n.popup-filter-control[_ngcontent-%COMP%], \n.activities-rate-filter-select[_ngcontent-%COMP%], \n.activities-primary-filter-select[_ngcontent-%COMP%], \n.activities-event-scope-filter-select[_ngcontent-%COMP%], \n.activities-chat-context-filter-select[_ngcontent-%COMP%] {\n  position: relative;\n  overflow: visible;\n}\n.popup-filter-panel[_ngcontent-%COMP%], \n.activities-view-picker-panel[_ngcontent-%COMP%] {\n  position: absolute;\n  top: calc(100% + 0.32rem);\n  right: 0;\n  border: 1px solid rgba(39, 62, 94, 0.22);\n  border-radius: 10px;\n  background: #fff;\n  box-shadow: 0 10px 24px rgba(17, 29, 48, 0.22);\n  padding: 0.24rem;\n  min-width: 128px;\n  z-index: 40;\n  display: grid;\n  gap: 0.16rem;\n}\n.popup-filter-option[_ngcontent-%COMP%], \n.activities-view-option[_ngcontent-%COMP%] {\n  border: 0;\n  background: #fff;\n  border-radius: 8px;\n  min-height: 32px;\n  padding: 0.34rem 0.44rem;\n  display: inline-flex;\n  align-items: center;\n  justify-content: flex-start;\n  gap: 0.34rem;\n  color: #1e3658;\n  cursor: pointer;\n  text-align: left;\n}\n.popup-filter-option[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%], \n.activities-view-option[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n}\n.popup-filter-option[_ngcontent-%COMP%]   span[_ngcontent-%COMP%], \n.activities-view-option[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  font-size: 0.78rem;\n  font-weight: 700;\n}\n.popup-filter-option[_ngcontent-%COMP%]    > span[_ngcontent-%COMP%]:not(.rate-filter-count-badge), \n.activities-view-option[_ngcontent-%COMP%]    > span[_ngcontent-%COMP%]:not(.rate-filter-count-badge) {\n  flex: 1 1 auto;\n  min-width: 0;\n  text-align: left;\n}\n.popup-mobile-filter-picker[_ngcontent-%COMP%], \n.activities-mobile-primary-filter-picker[_ngcontent-%COMP%], \n.activities-mobile-event-scope-filter-picker[_ngcontent-%COMP%], \n.activities-mobile-chat-context-filter-picker[_ngcontent-%COMP%], \n.activities-mobile-rate-filter-picker[_ngcontent-%COMP%] {\n  position: relative;\n}\n.popup-mobile-filter-panel[_ngcontent-%COMP%], \n.activities-mobile-filter-panel[_ngcontent-%COMP%], \n.activities-mobile-rate-filter-panel[_ngcontent-%COMP%] {\n  top: calc(100% + 0.24rem);\n  right: 0;\n  min-width: 210px;\n  z-index: 65;\n}\n.popup-mobile-sheet-title[_ngcontent-%COMP%], \n.activities-mobile-sheet-title[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.28rem;\n  padding: 0 0.14rem;\n  color: #1c3354;\n  font-size: 0.94rem;\n  font-weight: 800;\n}\n.popup-mobile-sheet-title[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%], \n.activities-mobile-sheet-title[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 17px;\n  height: 17px;\n  font-size: 17px;\n  line-height: 17px;\n}\n:is(.popup-filter-bar[_ngcontent-%COMP%], .experience-toolbar[_ngcontent-%COMP%], .assets-toolbar[_ngcontent-%COMP%])   .popup-view-fab[_ngcontent-%COMP%]   span[_ngcontent-%COMP%], \n[_ngcontent-%COMP%]:is(.popup-filter-bar, .experience-toolbar, .assets-toolbar)   .profile-status-select-wrap[_ngcontent-%COMP%]   .mat-mdc-select[_ngcontent-%COMP%], \n[_ngcontent-%COMP%]:is(.popup-filter-bar, .experience-toolbar, .assets-toolbar)   .profile-status-select-wrap[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]:last-child, \n[_ngcontent-%COMP%]:is(.popup-filter-bar, .experience-toolbar, .assets-toolbar)   .profile-status-select-wrap[_ngcontent-%COMP%]   .mat-mdc-select-value-text[_ngcontent-%COMP%] {\n  font-weight: 400 !important;\n}\n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.status-option .status-option-content {\n  display: grid;\n  grid-template-columns: auto minmax(0, 1fr) auto;\n  align-items: center;\n  width: 100%;\n  min-width: 0;\n  column-gap: 0.34rem;\n}\n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.status-option .rate-filter-count-badge {\n  margin-left: 0;\n  justify-self: end;\n}\n[_nghost-%COMP%]     .cdk-overlay-pane:has(.mat-mdc-select-panel.selector-options-panel), \n[_nghost-%COMP%]     .cdk-overlay-pane:has(.mat-mdc-select-panel.status-options-panel) {\n  min-width: var(--app-selector-panel-min-width, 184px) !important;\n}\n[_nghost-%COMP%]     .mat-mdc-select-panel.selector-options-panel, \n[_nghost-%COMP%]     .mat-mdc-select-panel.status-options-panel {\n  min-width: var(--app-selector-panel-min-width, 184px) !important;\n}\n@media (max-width: 760px) {\n  .popup-mobile-filter-panel[_ngcontent-%COMP%]   .popup-filter-option[_ngcontent-%COMP%], \n   .popup-mobile-filter-panel[_ngcontent-%COMP%]   .activities-view-option[_ngcontent-%COMP%], \n   .activities-mobile-filter-panel[_ngcontent-%COMP%]   .popup-filter-option[_ngcontent-%COMP%], \n   .activities-mobile-filter-panel[_ngcontent-%COMP%]   .activities-view-option[_ngcontent-%COMP%], \n   .activities-mobile-rate-filter-panel[_ngcontent-%COMP%]   .popup-filter-option[_ngcontent-%COMP%], \n   .activities-mobile-rate-filter-panel[_ngcontent-%COMP%]   .activities-view-option[_ngcontent-%COMP%] {\n    width: 100%;\n    min-width: 0;\n    box-sizing: border-box;\n    border: 1px solid rgba(58, 81, 114, 0.24);\n    border-radius: 12px;\n    background: #f7f9fd;\n    min-height: 42px;\n    padding: 0.46rem 0.62rem;\n    justify-content: flex-start;\n    gap: 0.36rem;\n  }\n  .popup-mobile-filter-panel[_ngcontent-%COMP%]   .popup-filter-option.active[_ngcontent-%COMP%], \n   .popup-mobile-filter-panel[_ngcontent-%COMP%]   .activities-view-option.active[_ngcontent-%COMP%], \n   .activities-mobile-filter-panel[_ngcontent-%COMP%]   .popup-filter-option.active[_ngcontent-%COMP%], \n   .activities-mobile-filter-panel[_ngcontent-%COMP%]   .activities-view-option.active[_ngcontent-%COMP%], \n   .activities-mobile-rate-filter-panel[_ngcontent-%COMP%]   .popup-filter-option.active[_ngcontent-%COMP%], \n   .activities-mobile-rate-filter-panel[_ngcontent-%COMP%]   .activities-view-option.active[_ngcontent-%COMP%] {\n    box-shadow: inset 0 0 0 1px rgba(24, 46, 76, 0.24);\n    filter: brightness(0.95);\n  }\n  .popup-mobile-filter-panel[_ngcontent-%COMP%]   .popup-filter-option[_ngcontent-%COMP%]   .rate-filter-count-badge[_ngcontent-%COMP%], \n   .popup-mobile-filter-panel[_ngcontent-%COMP%]   .activities-view-option[_ngcontent-%COMP%]   .rate-filter-count-badge[_ngcontent-%COMP%], \n   .activities-mobile-filter-panel[_ngcontent-%COMP%]   .popup-filter-option[_ngcontent-%COMP%]   .rate-filter-count-badge[_ngcontent-%COMP%], \n   .activities-mobile-filter-panel[_ngcontent-%COMP%]   .activities-view-option[_ngcontent-%COMP%]   .rate-filter-count-badge[_ngcontent-%COMP%], \n   .activities-mobile-rate-filter-panel[_ngcontent-%COMP%]   .popup-filter-option[_ngcontent-%COMP%]   .rate-filter-count-badge[_ngcontent-%COMP%], \n   .activities-mobile-rate-filter-panel[_ngcontent-%COMP%]   .activities-view-option[_ngcontent-%COMP%]   .rate-filter-count-badge[_ngcontent-%COMP%] {\n    margin-left: auto;\n    flex: 0 0 auto;\n  }\n  [_nghost-%COMP%]     .cdk-overlay-pane:has(.mat-mdc-select-panel.profile-bottom-sheet-panel) {\n    position: fixed !important;\n    left: 0 !important;\n    right: 0 !important;\n    bottom: 0 !important;\n    top: auto !important;\n    width: 100vw !important;\n    max-width: 100vw !important;\n    transform: none !important;\n  }\n  [_nghost-%COMP%]     .mat-mdc-select-panel.profile-bottom-sheet-panel {\n    width: 100vw !important;\n    max-width: 100vw !important;\n    max-height: min(54vh, 420px) !important;\n    margin: 0 !important;\n    border-radius: 16px 16px 0 0 !important;\n    border: 1px solid #d6deea;\n    border-bottom: 0;\n    box-shadow: 0 -14px 28px rgba(15, 29, 52, 0.24);\n    padding-top: 0.38rem;\n    padding-bottom: max(0.55rem, env(safe-area-inset-bottom));\n  }\n}\n.popup-view-fab[_ngcontent-%COMP%] {\n  height: 34px;\n  border: 1px solid rgba(39, 62, 94, 0.22);\n  border-radius: 999px;\n  background: #f3f7ff;\n  color: #2c4c74;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.25rem;\n  padding: 0 0.62rem;\n  cursor: pointer;\n}\n.popup-view-fab[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n}\n.popup-view-fab[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  font-size: 0.74rem;\n  font-weight: 700;\n  white-space: nowrap;\n}\n.event-visibility-picker[_ngcontent-%COMP%] {\n  position: relative;\n  z-index: 22;\n  margin-left: auto;\n  flex: 0 0 auto;\n}\n.event-visibility-trigger[_ngcontent-%COMP%] {\n  flex-wrap: nowrap;\n}\n.profile-status-header-picker[_ngcontent-%COMP%]   .event-visibility-trigger.status-public[_ngcontent-%COMP%], \n.profile-status-header-picker[_ngcontent-%COMP%]   .activities-view-option.status-public[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #e6f6ef);\n}\n.profile-status-header-picker[_ngcontent-%COMP%]   .event-visibility-trigger.status-friends[_ngcontent-%COMP%], \n.profile-status-header-picker[_ngcontent-%COMP%]   .activities-view-option.status-friends[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #e8f1fd);\n}\n.profile-status-header-picker[_ngcontent-%COMP%]   .event-visibility-trigger.status-host[_ngcontent-%COMP%], \n.profile-status-header-picker[_ngcontent-%COMP%]   .activities-view-option.status-host[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #f6efe2);\n}\n.profile-status-header-picker[_ngcontent-%COMP%]   .event-visibility-trigger.status-inactive[_ngcontent-%COMP%], \n.profile-status-header-picker[_ngcontent-%COMP%]   .activities-view-option.status-inactive[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #f2f3f5);\n}\n.profile-status-header-picker[_ngcontent-%COMP%]   .event-visibility-trigger[_ngcontent-%COMP%]   .mat-icon.status-public[_ngcontent-%COMP%], \n.profile-status-header-picker[_ngcontent-%COMP%]   .activities-view-option.status-public[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #2f8f66;\n}\n.profile-status-header-picker[_ngcontent-%COMP%]   .event-visibility-trigger[_ngcontent-%COMP%]   .mat-icon.status-friends[_ngcontent-%COMP%], \n.profile-status-header-picker[_ngcontent-%COMP%]   .activities-view-option.status-friends[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #1b57a1;\n}\n.profile-status-header-picker[_ngcontent-%COMP%]   .event-visibility-trigger[_ngcontent-%COMP%]   .mat-icon.status-host[_ngcontent-%COMP%], \n.profile-status-header-picker[_ngcontent-%COMP%]   .activities-view-option.status-host[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #87580f;\n}\n.profile-status-header-picker[_ngcontent-%COMP%]   .event-visibility-trigger[_ngcontent-%COMP%]   .mat-icon.status-inactive[_ngcontent-%COMP%], \n.profile-status-header-picker[_ngcontent-%COMP%]   .activities-view-option.status-inactive[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #5b6573;\n}\n.app-popup[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%], \n.app-popup[_ngcontent-%COMP%]   input[_ngcontent-%COMP%], \n.app-popup[_ngcontent-%COMP%]   select[_ngcontent-%COMP%], \n.popup-surface[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%], \n.popup-surface[_ngcontent-%COMP%]   input[_ngcontent-%COMP%], \n.popup-surface[_ngcontent-%COMP%]   select[_ngcontent-%COMP%], \n.experience-form-popup[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%], \n.experience-form-popup[_ngcontent-%COMP%]   input[_ngcontent-%COMP%], \n.experience-form-popup[_ngcontent-%COMP%]   select[_ngcontent-%COMP%], \n.mobile-profile-selector-sheet-wrap[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  width: 100%;\n  border: 1px solid rgba(15, 27, 47, 0.16);\n  border-radius: 10px;\n  padding: 0.48rem 0.56rem;\n  font: inherit;\n  color: var(--text-main);\n  background: #fff;\n}\n.app-popup[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%], \n.popup-surface[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%], \n.experience-form-popup[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%] {\n  resize: vertical;\n}\n.app-popup[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%]:focus, \n.app-popup[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]:focus, \n.app-popup[_ngcontent-%COMP%]   select[_ngcontent-%COMP%]:focus, \n.popup-surface[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%]:focus, \n.popup-surface[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]:focus, \n.popup-surface[_ngcontent-%COMP%]   select[_ngcontent-%COMP%]:focus, \n.experience-form-popup[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%]:focus, \n.experience-form-popup[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]:focus, \n.experience-form-popup[_ngcontent-%COMP%]   select[_ngcontent-%COMP%]:focus, \n.mobile-profile-selector-sheet-wrap[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]:focus {\n  outline: 0;\n  border-color: rgba(52, 103, 182, 0.72);\n  box-shadow: 0 0 0 3px rgba(55, 116, 212, 0.14);\n}\n.popup-surface-form-grid[_ngcontent-%COMP%], \n.experience-form-grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n  max-width: none;\n  width: 100%;\n  margin: 0;\n  justify-content: stretch;\n  align-content: start;\n  align-items: start;\n  column-gap: 1rem;\n  row-gap: 0.9rem;\n}\n.popup-surface-form-grid[_ngcontent-%COMP%]   label[_ngcontent-%COMP%], \n.experience-form-grid[_ngcontent-%COMP%]   label[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-rows: min-content;\n  gap: 0;\n  font-weight: 600;\n  color: rgba(26, 44, 69, 0.88);\n}\n.popup-surface-form-grid[_ngcontent-%COMP%]   input[_ngcontent-%COMP%], \n.experience-form-grid[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  min-height: 40px;\n  padding: 0.56rem 0.72rem;\n  font-size: 0.88rem;\n  line-height: 1.25;\n  box-sizing: border-box;\n}\n.popup-surface-form-grid[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%], \n.experience-form-grid[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%] {\n  min-height: 96px;\n  padding: 0.56rem 0.72rem;\n  font-size: 0.88rem;\n  line-height: 1.25;\n  box-sizing: border-box;\n}\n.popup-surface-form-grid[_ngcontent-%COMP%]   .profile-status-select-wrap.selector-like[_ngcontent-%COMP%], \n.experience-form-grid[_ngcontent-%COMP%]   .profile-status-select-wrap.selector-like[_ngcontent-%COMP%] {\n  min-height: 40px;\n  height: 40px;\n  box-sizing: border-box;\n}\n.popup-surface-form-grid[_ngcontent-%COMP%]   .mat-mdc-select-trigger[_ngcontent-%COMP%], \n.experience-form-grid[_ngcontent-%COMP%]   .mat-mdc-select-trigger[_ngcontent-%COMP%] {\n  min-height: 32px;\n}\n.popup-surface-description-field[_ngcontent-%COMP%], \n.experience-description-field[_ngcontent-%COMP%] {\n  grid-column: 1/-1;\n}\n.popup-surface-actions[_ngcontent-%COMP%], \n.experience-form-actions[_ngcontent-%COMP%] {\n  justify-content: center;\n  padding-top: 0.2rem;\n}\n.popup-actions[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 0.45rem;\n  flex-wrap: wrap;\n}\n.link-btn[_ngcontent-%COMP%] {\n  border: 1px solid var(--line-strong);\n  border-radius: 999px;\n  background: #fff;\n  color: #1f3350;\n  font: inherit;\n  font-size: 0.83rem;\n  padding: 0.38rem 0.76rem;\n  cursor: pointer;\n}\n.neutral-btn[_ngcontent-%COMP%] {\n  background: #f2f4fa;\n  border-color: rgba(23, 33, 54, 0.12);\n}\n.primary-btn[_ngcontent-%COMP%] {\n  background: #4776b7;\n  border-color: #4776b7;\n  color: #fff;\n}\n.profile-status-select-wrap[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%], \n.date-picker-btn[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n  line-height: 16px;\n  color: #566b86;\n}\n.profile-status-select-wrap[_ngcontent-%COMP%]   .mat-mdc-select[_ngcontent-%COMP%] {\n  min-width: 80px;\n  width: 100%;\n  font-size: 0.8rem;\n  font-weight: 700;\n  text-transform: lowercase;\n}\n.profile-status-select-wrap[_ngcontent-%COMP%]   .mat-mdc-select-trigger[_ngcontent-%COMP%] {\n  width: 100%;\n  justify-content: flex-start;\n}\n.profile-status-select-wrap[_ngcontent-%COMP%]   .mat-mdc-select-arrow-wrapper[_ngcontent-%COMP%] {\n  margin-left: auto;\n}\n.status-public[_ngcontent-%COMP%] {\n  color: #2f8f66;\n}\n.status-friends[_ngcontent-%COMP%] {\n  color: #1b57a1;\n}\n.status-host[_ngcontent-%COMP%] {\n  color: #87580f;\n}\n.status-inactive[_ngcontent-%COMP%] {\n  color: #5b6573;\n}\n.status-option-content[_ngcontent-%COMP%]   .status-public[_ngcontent-%COMP%] {\n  color: #2f8f66;\n}\n.status-option-content[_ngcontent-%COMP%]   .status-friends[_ngcontent-%COMP%] {\n  color: #1b57a1;\n}\n.status-option-content[_ngcontent-%COMP%]   .status-host[_ngcontent-%COMP%] {\n  color: #87580f;\n}\n.status-option-content[_ngcontent-%COMP%]   .status-inactive[_ngcontent-%COMP%] {\n  color: #5b6573;\n}\n.profile-status-select-wrap.status-public[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #2f8f66;\n}\n.profile-status-select-wrap.status-friends[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #1b57a1;\n}\n.profile-status-select-wrap.status-host[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #87580f;\n}\n.profile-status-select-wrap.status-inactive[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #5b6573;\n}\n.profile-details-values-btn[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n  line-height: 16px;\n  color: rgba(44, 67, 100, 0.72);\n}\n.profile-details-values-btn[_ngcontent-%COMP%] {\n  min-height: 36px;\n  height: 36px;\n  box-sizing: border-box;\n  padding-top: 0;\n  padding-bottom: 0;\n}\n.profile-details-values-btn[_ngcontent-%COMP%]   .status-option-content.profile-details-selected-badges[_ngcontent-%COMP%] {\n  display: inline-grid;\n  grid-template-columns: minmax(0, 1fr) auto;\n  align-items: center;\n  column-gap: 0.26rem;\n  min-width: 0;\n  width: 100%;\n}\n.profile-details-values-btn.profile-details-values-tone-values[_ngcontent-%COMP%]   .profile-details-inline-chip[_ngcontent-%COMP%] {\n  max-width: calc(100% - 2.6rem);\n}\n.profile-details-values-btn.profile-details-values-tone-interest[_ngcontent-%COMP%]   .profile-details-inline-chip[_ngcontent-%COMP%] {\n  max-width: calc((100% - 3.2rem) / 2);\n}\n.profile-details-values-btn.profile-details-values-tone-values[_ngcontent-%COMP%]   .profile-details-inline-overflow[_ngcontent-%COMP%] {\n  color: #1e6b5a;\n}\n.profile-details-values-btn.profile-details-values-tone-interest[_ngcontent-%COMP%]   .profile-details-inline-overflow[_ngcontent-%COMP%] {\n  color: #2e5a90;\n}\n.values-header-chips[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  flex-wrap: wrap;\n  gap: 0.28rem;\n  flex: 0 0 100%;\n  margin-left: 0;\n  margin-top: 0.34rem;\n  max-width: 100%;\n  overflow: visible;\n  white-space: normal;\n  padding-bottom: 0;\n}\n.popup-title-values[_ngcontent-%COMP%] {\n  margin-right: 0.38rem;\n}\n.values-selected-chip[_ngcontent-%COMP%] {\n  border: 1px solid rgba(76, 99, 136, 0.3);\n  background:\n    linear-gradient(\n      180deg,\n      #f7f9ff 0%,\n      #eef3ff 100%);\n  color: #24416a;\n  border-radius: 999px;\n  min-height: 26px;\n  padding: 0.18rem 0.46rem;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.26rem;\n  font-size: 0.7rem;\n  font-weight: 700;\n  cursor: pointer;\n  flex: 0 0 auto;\n}\n.values-selected-chip[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 12px;\n  height: 12px;\n  font-size: 12px;\n  line-height: 12px;\n}\n.values-selected-chip.section-family[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #fff1ea 0%,\n      #ffe6dd 100%);\n  border-color: rgba(160, 90, 51, 0.32);\n  color: #8b4d2b;\n}\n.values-selected-chip.section-ambition[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #fff7e8 0%,\n      #ffefd7 100%);\n  border-color: rgba(160, 106, 20, 0.32);\n  color: #9a6614;\n}\n.values-selected-chip.section-lifestyle[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #eaf8f5 0%,\n      #e0f2ee 100%);\n  border-color: rgba(45, 125, 120, 0.32);\n  color: #2a6e6a;\n}\n.values-selected-chip.section-beliefs[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f0ecff 0%,\n      #e8e1fa 100%);\n  border-color: rgba(95, 78, 160, 0.32);\n  color: #564793;\n}\n.values-selected-chip.section-social[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #ecf4ff 0%,\n      #e1ecfb 100%);\n  border-color: rgba(45, 94, 168, 0.32);\n  color: #2d5ea8;\n}\n.values-selected-chip.section-arts[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f2edfb 0%,\n      #e9e2f9 100%);\n  border-color: rgba(103, 76, 164, 0.32);\n  color: #654ca1;\n}\n.values-selected-chip.section-food[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #fff4e8 0%,\n      #fee9d6 100%);\n  border-color: rgba(170, 97, 28, 0.32);\n  color: #9d611c;\n}\n.values-selected-chip.section-active[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #edf8ee 0%,\n      #e2f1e4 100%);\n  border-color: rgba(44, 126, 72, 0.32);\n  color: #2d7d47;\n}\n.values-selected-chip.section-mind[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #eaf8f6 0%,\n      #def1ee 100%);\n  border-color: rgba(37, 124, 118, 0.32);\n  color: #2d7d78;\n}\n.values-selected-chip.section-identity[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f4f0ff 0%,\n      #e9e3fb 100%);\n  border-color: rgba(88, 78, 159, 0.32);\n  color: #5a4ea0;\n}\n.readonly-select[_ngcontent-%COMP%] {\n  width: fit-content;\n  min-width: 0;\n  max-width: 130px;\n  justify-content: center;\n  margin-top: 2px;\n  padding-left: 0.44rem;\n  padding-right: 0.44rem;\n}\n.readonly-field[_ngcontent-%COMP%] {\n  min-height: 34px;\n  border: 1px solid rgba(15, 27, 47, 0.16);\n  border-radius: 10px;\n  padding: 0.4rem 0.56rem;\n  background: #f7fafe;\n  color: #23476f;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.26rem;\n  font-weight: 700;\n}\n.readonly-field[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n  line-height: 16px;\n}\n.zodiac-symbol[_ngcontent-%COMP%] {\n  font-size: 1.1rem;\n  font-weight: 800;\n  line-height: 1;\n}\n.zodiac-label[_ngcontent-%COMP%] {\n  font-size: 0.9rem;\n  font-weight: 700;\n  min-width: 0;\n  text-align: center;\n}\n.readonly-select.zodiac-aries[_ngcontent-%COMP%] {\n  background: #fdf1f1;\n  color: #9f2f2f;\n}\n.readonly-select.zodiac-taurus[_ngcontent-%COMP%] {\n  background: #f7f3eb;\n  color: #6e4b2b;\n}\n.readonly-select.zodiac-gemini[_ngcontent-%COMP%] {\n  background: #fdf8e9;\n  color: #7d5a12;\n}\n.readonly-select.zodiac-cancer[_ngcontent-%COMP%] {\n  background: #eef4ff;\n  color: #2d5b8e;\n}\n.readonly-select.zodiac-leo[_ngcontent-%COMP%] {\n  background: #fff3e8;\n  color: #8f4b0d;\n}\n.readonly-select.zodiac-virgo[_ngcontent-%COMP%] {\n  background: #edf8ef;\n  color: #2b6b3d;\n}\n.readonly-select.zodiac-libra[_ngcontent-%COMP%] {\n  background: #f2eefc;\n  color: #60439d;\n}\n.readonly-select.zodiac-scorpio[_ngcontent-%COMP%] {\n  background: #f9edf2;\n  color: #7b3150;\n}\n.readonly-select.zodiac-sagittarius[_ngcontent-%COMP%] {\n  background: #eef1ff;\n  color: #2f4a9a;\n}\n.readonly-select.zodiac-capricorn[_ngcontent-%COMP%] {\n  background: #eff2f5;\n  color: #364653;\n}\n.readonly-select.zodiac-aquarius[_ngcontent-%COMP%] {\n  background: #ebf7fb;\n  color: #1d5f7a;\n}\n.readonly-select.zodiac-pisces[_ngcontent-%COMP%] {\n  background: #eef2ff;\n  color: #294b8f;\n}\n.physique-slim[_ngcontent-%COMP%] {\n  color: #3f7ab3;\n}\n.physique-lean[_ngcontent-%COMP%] {\n  color: #3f8f5f;\n}\n.physique-athletic[_ngcontent-%COMP%] {\n  color: #2f7e4d;\n}\n.physique-fit[_ngcontent-%COMP%] {\n  color: #465fbb;\n}\n.physique-curvy[_ngcontent-%COMP%] {\n  color: #a14875;\n}\n.physique-muscular[_ngcontent-%COMP%] {\n  color: #7d4f24;\n}\n.physique-average[_ngcontent-%COMP%] {\n  color: #4d667f;\n}\n.physique-select-wrap.physique-slim[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #eaf3fb 0%,\n      #dfebf8 100%);\n  border-color: rgba(63, 122, 179, 0.34);\n}\n.physique-select-wrap.physique-lean[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #eaf6ee 0%,\n      #def0e5 100%);\n  border-color: rgba(63, 143, 95, 0.34);\n}\n.physique-select-wrap.physique-athletic[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #e8f5ec 0%,\n      #dff0e6 100%);\n  border-color: rgba(47, 126, 77, 0.34);\n}\n.physique-select-wrap.physique-fit[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #ebf0ff 0%,\n      #e1e8fc 100%);\n  border-color: rgba(70, 95, 187, 0.34);\n}\n.physique-select-wrap.physique-curvy[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f7edf3 0%,\n      #f0e3ec 100%);\n  border-color: rgba(161, 72, 117, 0.36);\n}\n.physique-select-wrap.physique-muscular[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f6efe9 0%,\n      #ede3d8 100%);\n  border-color: rgba(125, 79, 36, 0.36);\n}\n.physique-select-wrap.physique-average[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #eef2f6 0%,\n      #e5ebf1 100%);\n  border-color: rgba(77, 102, 127, 0.34);\n}\n.physique-select-wrap.physique-slim[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #3f7ab3;\n}\n.physique-select-wrap.physique-lean[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #3f8f5f;\n}\n.physique-select-wrap.physique-athletic[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #2f7e4d;\n}\n.physique-select-wrap.physique-fit[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #465fbb;\n}\n.physique-select-wrap.physique-curvy[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #a14875;\n}\n.physique-select-wrap.physique-muscular[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #7d4f24;\n}\n.physique-select-wrap.physique-average[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #4d667f;\n}\n.experience-filter-all[_ngcontent-%COMP%] {\n  color: #694ea6;\n}\n.experience-filter-workspace[_ngcontent-%COMP%] {\n  color: #a1485a;\n}\n.experience-filter-school[_ngcontent-%COMP%] {\n  color: #2d5ea8;\n}\n.experience-filter-online[_ngcontent-%COMP%] {\n  color: #2d7d47;\n}\n.experience-filter-project[_ngcontent-%COMP%] {\n  color: #6550a0;\n}\n.experience-filter-select.experience-filter-all[_ngcontent-%COMP%], \n.experience-type-select.experience-filter-project[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #efe8ff 0%,\n      #e8defc 100%);\n  border-color: rgba(103, 76, 164, 0.32);\n}\n.experience-filter-select.experience-filter-workspace[_ngcontent-%COMP%], \n.experience-type-select.experience-filter-workspace[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #fff1f3 0%,\n      #ffe6ea 100%);\n  border-color: rgba(169, 72, 90, 0.32);\n}\n.experience-filter-select.experience-filter-school[_ngcontent-%COMP%], \n.experience-type-select.experience-filter-school[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #eaf4ff 0%,\n      #e1ecfb 100%);\n  border-color: rgba(45, 94, 168, 0.32);\n}\n.experience-type-select.experience-filter-online[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #edf8ee 0%,\n      #e2f1e4 100%);\n  border-color: rgba(44, 126, 72, 0.32);\n}\n.experience-type-select.experience-filter-project[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f4f0ff 0%,\n      #e9e3fb 100%);\n}\n.experience-type-select[_ngcontent-%COMP%] {\n  min-width: 0;\n  max-width: 100%;\n  min-height: 40px;\n}\n.experience-type-field[_ngcontent-%COMP%], \n.experience-title-field[_ngcontent-%COMP%], \n.experience-city-field[_ngcontent-%COMP%] {\n  width: 100%;\n  justify-self: stretch;\n}\n.experience-org-field[_ngcontent-%COMP%] {\n  width: 100%;\n  justify-self: stretch;\n}\n.experience-type-select[_ngcontent-%COMP%] {\n  width: 100%;\n}\n.experience-date-range-field[_ngcontent-%COMP%] {\n  width: 100%;\n  max-width: none;\n  margin: 0;\n  background: transparent;\n}\n.experience-date-range-label[_ngcontent-%COMP%] {\n  grid-column: 1/2;\n  width: 100%;\n  justify-self: stretch;\n}\n.experience-date-range-field[_ngcontent-%COMP%]   .mat-mdc-text-field-wrapper[_ngcontent-%COMP%] {\n  min-height: 42px;\n  border-radius: 10px;\n  background: #fff;\n  border: 1px solid rgba(136, 156, 186, 0.5);\n  box-shadow: none;\n}\n.experience-date-range-field[_ngcontent-%COMP%]   .mat-mdc-form-field-subscript-wrapper[_ngcontent-%COMP%] {\n  margin-top: 0.24rem;\n}\n.experience-date-range-field[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  border: 0 !important;\n  box-shadow: none !important;\n  border-radius: 0 !important;\n  background: transparent !important;\n  min-width: 0;\n  width: 100%;\n  padding: 0 !important;\n  min-height: 0 !important;\n  height: auto !important;\n  line-height: 1.25;\n}\n.experience-date-range-field[_ngcontent-%COMP%]   .mat-datepicker-toggle[_ngcontent-%COMP%] {\n  margin-right: 0.2rem;\n}\n.experience-date-range-field[_ngcontent-%COMP%]   .mat-mdc-form-field-hint-wrapper[_ngcontent-%COMP%], \n.experience-date-range-field[_ngcontent-%COMP%]   .mat-mdc-form-field-hint[_ngcontent-%COMP%] {\n  color: rgba(30, 49, 74, 0.65);\n  font-size: 0.72rem;\n}\n.experience-date-range-field[_ngcontent-%COMP%]   .mat-date-range-input-container[_ngcontent-%COMP%] {\n  width: 100%;\n  display: grid;\n  grid-template-columns: minmax(96px, 1fr) auto minmax(96px, 1fr);\n  align-items: center;\n  column-gap: 0.34rem;\n  min-width: 0;\n}\n.experience-date-range-field[_ngcontent-%COMP%]   .mat-date-range-input-separator[_ngcontent-%COMP%] {\n  margin: 0 0.28rem;\n  flex: 0 0 auto;\n  white-space: nowrap;\n}\n.experience-date-range-field[_ngcontent-%COMP%]   .mat-date-range-input-start-wrapper[_ngcontent-%COMP%], \n.experience-date-range-field[_ngcontent-%COMP%]   .mat-date-range-input-end-wrapper[_ngcontent-%COMP%] {\n  width: 100%;\n  max-width: 100%;\n  overflow: visible;\n  min-width: 0;\n}\n.experience-date-range-field[_ngcontent-%COMP%]   .mat-date-range-input-inner[_ngcontent-%COMP%] {\n  font-size: 0.96rem;\n  min-width: 0 !important;\n  width: 100% !important;\n  text-overflow: clip;\n  white-space: nowrap;\n  line-height: 1.25;\n}\n.experience-date-range-field[_ngcontent-%COMP%]   .mat-mdc-form-field-flex[_ngcontent-%COMP%] {\n  min-width: 0;\n  border-bottom: 0 !important;\n  box-shadow: none !important;\n  align-items: center !important;\n}\n.experience-date-range-field[_ngcontent-%COMP%]   .mat-mdc-form-field-infix[_ngcontent-%COMP%] {\n  padding-top: 0 !important;\n  padding-bottom: 0 !important;\n  min-height: 34px !important;\n  height: 34px;\n  display: flex;\n  align-items: center;\n}\n.experience-date-range-field[_ngcontent-%COMP%]   .mdc-line-ripple[_ngcontent-%COMP%], \n.experience-date-range-field[_ngcontent-%COMP%]   .mat-mdc-form-field-line-ripple[_ngcontent-%COMP%], \n.experience-date-range-field[_ngcontent-%COMP%]   .mdc-line-ripple--deactivating[_ngcontent-%COMP%], \n.experience-date-range-field[_ngcontent-%COMP%]   .mdc-line-ripple--active[_ngcontent-%COMP%] {\n  display: none !important;\n  opacity: 0 !important;\n  transform: scaleX(0) !important;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.experience-filter-all {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #efe8ff);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.experience-filter-workspace {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #fff1f3);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.experience-filter-school {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #eaf4ff);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.experience-filter-online {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #edf8ee);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.experience-filter-project {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #f4f0ff);\n}\n.mobile-profile-language-chip.language-tone-1[_ngcontent-%COMP%], \n.mobile-profile-selector-option.language-tone-1[_ngcontent-%COMP%], \n[_nghost-%COMP%]     .mat-mdc-option.language-tone-1 {\n  background: #eaf4ff;\n  border-color: rgba(63, 122, 179, 0.34);\n  color: #2f6090;\n}\n.mobile-profile-language-chip.language-tone-2[_ngcontent-%COMP%], \n.mobile-profile-selector-option.language-tone-2[_ngcontent-%COMP%], \n[_nghost-%COMP%]     .mat-mdc-option.language-tone-2 {\n  background: #edf8f4;\n  border-color: rgba(75, 127, 113, 0.34);\n  color: #2f695b;\n}\n.mobile-profile-language-chip.language-tone-3[_ngcontent-%COMP%], \n.mobile-profile-selector-option.language-tone-3[_ngcontent-%COMP%], \n[_nghost-%COMP%]     .mat-mdc-option.language-tone-3 {\n  background: #f1f2ff;\n  border-color: rgba(70, 95, 187, 0.34);\n  color: #394f9c;\n}\n.mobile-profile-language-chip.language-tone-4[_ngcontent-%COMP%], \n.mobile-profile-selector-option.language-tone-4[_ngcontent-%COMP%], \n[_nghost-%COMP%]     .mat-mdc-option.language-tone-4 {\n  background: #fff2f8;\n  border-color: rgba(161, 72, 117, 0.34);\n  color: #8d3f66;\n}\n.mobile-profile-language-chip.language-tone-5[_ngcontent-%COMP%], \n.mobile-profile-selector-option.language-tone-5[_ngcontent-%COMP%], \n[_nghost-%COMP%]     .mat-mdc-option.language-tone-5 {\n  background: #fbf4ea;\n  border-color: rgba(125, 79, 36, 0.34);\n  color: #704822;\n}\n.mobile-profile-language-chip.language-tone-6[_ngcontent-%COMP%], \n.mobile-profile-selector-option.language-tone-6[_ngcontent-%COMP%], \n[_nghost-%COMP%]     .mat-mdc-option.language-tone-6 {\n  background: #eff4f9;\n  border-color: rgba(77, 102, 127, 0.34);\n  color: #415872;\n}\n.mobile-profile-language-chip.language-tone-7[_ngcontent-%COMP%], \n.mobile-profile-selector-option.language-tone-7[_ngcontent-%COMP%], \n[_nghost-%COMP%]     .mat-mdc-option.language-tone-7 {\n  background: #f7f5ea;\n  border-color: rgba(128, 109, 66, 0.34);\n  color: #746237;\n}\n.mobile-profile-language-chip.language-tone-8[_ngcontent-%COMP%], \n.mobile-profile-selector-option.language-tone-8[_ngcontent-%COMP%], \n[_nghost-%COMP%]     .mat-mdc-option.language-tone-8 {\n  background: #edf5ff;\n  border-color: rgba(45, 122, 160, 0.34);\n  color: #2f6782;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-1 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #eaf2ff);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-2 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #ebf7ef);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-3 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #fff1e3);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-4 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #efecfc);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-5 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #f3f8e9);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-6 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #fceef3);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-7 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #edf7ff);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-8 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #f6f2e9);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-1 .status-option-content {\n  color: #2d63a9;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-2 .status-option-content {\n  color: #2a7a49;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-3 .status-option-content {\n  color: #9b6018;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-4 .status-option-content {\n  color: #6153a2;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-5 .status-option-content {\n  color: #61812a;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-6 .status-option-content {\n  color: #9f446d;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-7 .status-option-content {\n  color: #2e7898;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-8 .status-option-content {\n  color: #806c3f;\n}\n.mobile-profile-selector-option.detail-tone-1[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #eef5ff 0%,\n      #e3eefc 100%);\n  border-color: rgba(46, 102, 181, 0.32);\n}\n.mobile-profile-selector-option.detail-tone-2[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #eef9f3 0%,\n      #e3f4ea 100%);\n  border-color: rgba(40, 125, 72, 0.32);\n}\n.mobile-profile-selector-option.detail-tone-3[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #fff4ea 0%,\n      #ffecdd 100%);\n  border-color: rgba(165, 94, 24, 0.32);\n}\n.mobile-profile-selector-option.detail-tone-4[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f2f1ff 0%,\n      #e8e5fb 100%);\n  border-color: rgba(97, 82, 164, 0.32);\n}\n.mobile-profile-selector-option.detail-tone-5[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f6f9ef 0%,\n      #edf3e1 100%);\n  border-color: rgba(95, 128, 36, 0.32);\n}\n.mobile-profile-selector-option.detail-tone-6[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #fff1f4 0%,\n      #f9e6ed 100%);\n  border-color: rgba(160, 70, 111, 0.32);\n}\n.mobile-profile-selector-option.detail-tone-7[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #edf8ff 0%,\n      #e2f0fb 100%);\n  border-color: rgba(45, 122, 160, 0.32);\n}\n.mobile-profile-selector-option.detail-tone-8[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f6f3ea 0%,\n      #eee9dc 100%);\n  border-color: rgba(128, 109, 66, 0.32);\n}\n.mobile-profile-selector-option.status-public[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #e6f6ef 0%,\n      #d9f0e6 100%);\n  border-color: rgba(47, 143, 102, 0.34);\n}\n.mobile-profile-selector-option.status-friends[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #e8f1fd 0%,\n      #dfeaf9 100%);\n  border-color: rgba(27, 87, 161, 0.34);\n}\n.mobile-profile-selector-option.status-host[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f6efe2 0%,\n      #eee4d2 100%);\n  border-color: rgba(135, 88, 15, 0.36);\n}\n.mobile-profile-selector-option.status-inactive[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f2f3f5 0%,\n      #e8ebef 100%);\n  border-color: rgba(91, 101, 115, 0.32);\n}\n.mobile-profile-selector-option.physique-slim[_ngcontent-%COMP%] {\n  background: #eaf4ff;\n  border-color: rgba(63, 122, 179, 0.34);\n}\n.mobile-profile-selector-option.physique-lean[_ngcontent-%COMP%] {\n  background: #edf8f4;\n  border-color: rgba(75, 127, 113, 0.34);\n}\n.mobile-profile-selector-option.physique-athletic[_ngcontent-%COMP%] {\n  background: #e8f5ec;\n  border-color: rgba(47, 126, 77, 0.34);\n}\n.mobile-profile-selector-option.physique-fit[_ngcontent-%COMP%] {\n  background: #f1f2ff;\n  border-color: rgba(70, 95, 187, 0.34);\n}\n.mobile-profile-selector-option.physique-curvy[_ngcontent-%COMP%] {\n  background: #fff2f8;\n  border-color: rgba(161, 72, 117, 0.34);\n}\n.mobile-profile-selector-option.physique-muscular[_ngcontent-%COMP%] {\n  background: #fbf4ea;\n  border-color: rgba(125, 79, 36, 0.34);\n}\n.mobile-profile-selector-option.physique-average[_ngcontent-%COMP%] {\n  background: #eff4f9;\n  border-color: rgba(77, 102, 127, 0.34);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .values-selector-popup.profile-selector-popup[_ngcontent-%COMP%] {\n  gap: 0.56rem;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-filter-selector-head[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.44rem;\n  padding-bottom: 0.22rem;\n  border-bottom: 1px solid rgba(74, 102, 139, 0.22);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-filter-selector-head-label[_ngcontent-%COMP%] {\n  color: #203c64;\n  font-size: 0.82rem;\n  font-weight: 800;\n  line-height: 1.2;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-filter-selector-clear[_ngcontent-%COMP%] {\n  border: 1px solid rgba(41, 73, 110, 0.24);\n  border-radius: 999px;\n  background: rgba(255, 255, 255, 0.82);\n  color: #284970;\n  font: inherit;\n  font-size: 0.72rem;\n  font-weight: 700;\n  line-height: 1;\n  padding: 0.3rem 0.52rem;\n  cursor: pointer;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-filter-selector-clear.is-hidden[_ngcontent-%COMP%] {\n  visibility: hidden;\n  pointer-events: none;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-filter-selector-selected[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 0.34rem;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-filter-selector-chip[_ngcontent-%COMP%] {\n  border: 1px solid rgba(35, 68, 107, 0.24);\n  border-radius: 999px;\n  background: rgba(255, 255, 255, 0.92);\n  color: #234368;\n  font: inherit;\n  font-size: 0.72rem;\n  font-weight: 700;\n  line-height: 1;\n  padding: 0.26rem 0.48rem;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.16rem;\n  cursor: pointer;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-filter-selector-chip[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 13px;\n  height: 13px;\n  font-size: 13px;\n  line-height: 13px;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-filter-selector-empty[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 0.74rem;\n  color: rgba(31, 54, 86, 0.62);\n  font-style: italic;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.34rem;\n  border: 1px solid transparent;\n  border-radius: 12px;\n  padding: 0.4rem 0.42rem;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-head[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.34rem;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-tag[_ngcontent-%COMP%] {\n  border-radius: 999px;\n  border: 1px solid rgba(52, 86, 128, 0.28);\n  background: rgba(255, 255, 255, 0.74);\n  color: #2f527d;\n  font-size: 0.67rem;\n  font-weight: 800;\n  letter-spacing: 0.02em;\n  line-height: 1;\n  padding: 0.2rem 0.52rem;\n  text-transform: uppercase;\n  white-space: nowrap;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.24rem;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-tag-icon[_ngcontent-%COMP%] {\n  width: 12px;\n  height: 12px;\n  font-size: 12px;\n  line-height: 12px;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-line[_ngcontent-%COMP%] {\n  display: block;\n  width: 100%;\n  height: 1px;\n  background: rgba(84, 111, 147, 0.34);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-chip-grid[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 0.36rem;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-chip[_ngcontent-%COMP%] {\n  border: 1px solid rgba(41, 70, 106, 0.22);\n  border-radius: 999px;\n  background: #f4f8ff;\n  color: #234066;\n  font: inherit;\n  font-size: 0.78rem;\n  font-weight: 700;\n  padding: 0.3rem 0.58rem;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.26rem;\n  cursor: pointer;\n  transition:\n    background-color 0.14s ease,\n    border-color 0.14s ease,\n    color 0.14s ease,\n    box-shadow 0.14s ease;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-chip.active[_ngcontent-%COMP%] {\n  border-color: rgba(27, 85, 158, 0.5);\n  background:\n    linear-gradient(\n      180deg,\n      #dcebff 0%,\n      #cfe3ff 100%);\n  color: #123e70;\n  box-shadow: inset 0 0 0 1px rgba(30, 73, 127, 0.24), 0 1px 2px rgba(24, 53, 86, 0.16);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group.section-family[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 232, 219, 0.52) 0%,\n      rgba(255, 232, 219, 0.3) 100%);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group.section-ambition[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 242, 216, 0.52) 0%,\n      rgba(255, 242, 216, 0.3) 100%);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group.section-lifestyle[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(221, 241, 239, 0.56) 0%,\n      rgba(221, 241, 239, 0.32) 100%);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group.section-beliefs[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(230, 226, 250, 0.56) 0%,\n      rgba(230, 226, 250, 0.32) 100%);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group.section-social[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(223, 236, 255, 0.5) 0%,\n      rgba(223, 236, 255, 0.28) 100%);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group.section-arts[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(235, 227, 255, 0.5) 0%,\n      rgba(235, 227, 255, 0.28) 100%);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group.section-food[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 236, 221, 0.52) 0%,\n      rgba(255, 236, 221, 0.3) 100%);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group.section-active[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(222, 243, 231, 0.56) 0%,\n      rgba(222, 243, 231, 0.32) 100%);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group.section-mind[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(219, 242, 238, 0.56) 0%,\n      rgba(219, 242, 238, 0.32) 100%);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group.section-identity[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(230, 226, 250, 0.56) 0%,\n      rgba(230, 226, 250, 0.32) 100%);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-tag.section-family[_ngcontent-%COMP%] {\n  border-color: rgba(156, 94, 51, 0.34);\n  color: #9c5e33;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-tag.section-ambition[_ngcontent-%COMP%] {\n  border-color: rgba(160, 106, 20, 0.34);\n  color: #9b6717;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-tag.section-lifestyle[_ngcontent-%COMP%] {\n  border-color: rgba(47, 123, 119, 0.34);\n  color: #2f7b77;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-tag.section-beliefs[_ngcontent-%COMP%] {\n  border-color: rgba(95, 78, 160, 0.34);\n  color: #5f4ea0;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-tag.section-social[_ngcontent-%COMP%] {\n  border-color: rgba(47, 106, 175, 0.36);\n  color: #2f6aaf;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-tag.section-arts[_ngcontent-%COMP%] {\n  border-color: rgba(106, 87, 168, 0.36);\n  color: #6a57a8;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-tag.section-food[_ngcontent-%COMP%] {\n  border-color: rgba(170, 97, 28, 0.34);\n  color: #a55e18;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-tag.section-active[_ngcontent-%COMP%] {\n  border-color: rgba(49, 124, 82, 0.36);\n  color: #317c52;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-tag.section-mind[_ngcontent-%COMP%] {\n  border-color: rgba(37, 124, 118, 0.34);\n  color: #2b7c76;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-tag.section-identity[_ngcontent-%COMP%] {\n  border-color: rgba(98, 84, 163, 0.34);\n  color: #6254a3;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-line.section-family[_ngcontent-%COMP%] {\n  background: rgba(156, 94, 51, 0.3);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-line.section-ambition[_ngcontent-%COMP%] {\n  background: rgba(160, 106, 20, 0.32);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-line.section-lifestyle[_ngcontent-%COMP%] {\n  background: rgba(47, 123, 119, 0.3);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-line.section-beliefs[_ngcontent-%COMP%] {\n  background: rgba(95, 78, 160, 0.3);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-line.section-social[_ngcontent-%COMP%] {\n  background: rgba(47, 106, 175, 0.34);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-line.section-arts[_ngcontent-%COMP%] {\n  background: rgba(106, 87, 168, 0.34);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-line.section-food[_ngcontent-%COMP%] {\n  background: rgba(170, 97, 28, 0.32);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-line.section-active[_ngcontent-%COMP%] {\n  background: rgba(49, 124, 82, 0.34);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-line.section-mind[_ngcontent-%COMP%] {\n  background: rgba(37, 124, 118, 0.34);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-line.section-identity[_ngcontent-%COMP%] {\n  background: rgba(98, 84, 163, 0.3);\n}\n[_nghost-%COMP%]     .mat-mdc-option.mdc-list-item--selected:not(.mdc-list-item--disabled):not(.status-option) {\n  background: #f0f5fc;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.mdc-list-item--selected:not(.mdc-list-item--disabled) {\n  filter: brightness(0.95);\n  box-shadow: inset 0 0 0 1px rgba(24, 46, 76, 0.2);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option {\n  background: #fff;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option:not(:last-child) {\n  border-bottom: 1px solid #e6edf7;\n}\n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.hide-selected-option, \n[_nghost-%COMP%]     .status-options-panel .mat-mdc-option.hide-selected-option {\n  min-height: 0 !important;\n  height: 0 !important;\n  padding-top: 0 !important;\n  padding-bottom: 0 !important;\n  border: 0 !important;\n  margin: 0 !important;\n  opacity: 0 !important;\n  pointer-events: none !important;\n  overflow: hidden !important;\n}\n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option {\n  background: #fff;\n}\n[_nghost-%COMP%]     .mat-mdc-select-panel.selector-options-panel, \n[_nghost-%COMP%]     .mat-mdc-select-panel.status-options-panel {\n  margin-top: 8px !important;\n  margin-bottom: 8px !important;\n}\n[_nghost-%COMP%]     .mat-mdc-select-panel.selector-options-panel.mat-mdc-select-panel-above, \n[_nghost-%COMP%]     .mat-mdc-select-panel.status-options-panel.mat-mdc-select-panel-above, \n[_nghost-%COMP%]     .cdk-overlay-pane .mat-mdc-select-panel.selector-options-panel.mat-mdc-select-panel-above, \n[_nghost-%COMP%]     .cdk-overlay-pane .mat-mdc-select-panel.status-options-panel.mat-mdc-select-panel-above {\n  margin-top: 0 !important;\n  margin-bottom: 18px !important;\n  transform: translateY(-10px) !important;\n}\n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.status-option.status-public, \n[_nghost-%COMP%]     .status-options-panel .mat-mdc-option.status-option.status-public {\n  --mdc-list-list-item-container-color: #def3e9;\n  --mat-mdc-option-selected-container-color: #def3e9;\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #def3e9) !important;\n}\n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.status-option.status-friends, \n[_nghost-%COMP%]     .status-options-panel .mat-mdc-option.status-option.status-friends {\n  --mdc-list-list-item-container-color: #e3eefb;\n  --mat-mdc-option-selected-container-color: #e3eefb;\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #e3eefb) !important;\n}\n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.status-option.status-host, \n[_nghost-%COMP%]     .status-options-panel .mat-mdc-option.status-option.status-host {\n  --mdc-list-list-item-container-color: #f3ead8;\n  --mat-mdc-option-selected-container-color: #f3ead8;\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #f3ead8) !important;\n}\n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.status-option.status-inactive, \n[_nghost-%COMP%]     .status-options-panel .mat-mdc-option.status-option.status-inactive {\n  --mdc-list-list-item-container-color: #eceff3;\n  --mat-mdc-option-selected-container-color: #eceff3;\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #eceff3) !important;\n}\n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.status-option.status-public .status-option-content, \n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.status-option.status-public .status-option-content .mat-icon, \n[_nghost-%COMP%]     .status-options-panel .mat-mdc-option.status-option.status-public .status-option-content, \n[_nghost-%COMP%]     .status-options-panel .mat-mdc-option.status-option.status-public .status-option-content .mat-icon {\n  color: #2f8f66 !important;\n}\n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.status-option.status-friends .status-option-content, \n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.status-option.status-friends .status-option-content .mat-icon, \n[_nghost-%COMP%]     .status-options-panel .mat-mdc-option.status-option.status-friends .status-option-content, \n[_nghost-%COMP%]     .status-options-panel .mat-mdc-option.status-option.status-friends .status-option-content .mat-icon {\n  color: #1b57a1 !important;\n}\n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.status-option.status-host .status-option-content, \n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.status-option.status-host .status-option-content .mat-icon, \n[_nghost-%COMP%]     .status-options-panel .mat-mdc-option.status-option.status-host .status-option-content, \n[_nghost-%COMP%]     .status-options-panel .mat-mdc-option.status-option.status-host .status-option-content .mat-icon {\n  color: #87580f !important;\n}\n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.status-option.status-inactive .status-option-content, \n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.status-option.status-inactive .status-option-content .mat-icon, \n[_nghost-%COMP%]     .status-options-panel .mat-mdc-option.status-option.status-inactive .status-option-content, \n[_nghost-%COMP%]     .status-options-panel .mat-mdc-option.status-option.status-inactive .status-option-content .mat-icon {\n  color: #5b6573 !important;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.physique-slim {\n  background: #eaf4ff;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.physique-lean {\n  background: #edf8f4;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.physique-athletic {\n  background: #e8f5ec;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.physique-fit {\n  background: #f1f2ff;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.physique-curvy {\n  background: #fff2f8;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.physique-muscular {\n  background: #fbf4ea;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.physique-average {\n  background: #eff4f9;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.physique-slim .status-option-content {\n  color: #3f7ab3;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.physique-lean .status-option-content {\n  color: #3f8f5f;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.physique-athletic .status-option-content {\n  color: #2f7e4d;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.physique-fit .status-option-content {\n  color: #465fbb;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.physique-curvy .status-option-content {\n  color: #a14875;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.physique-muscular .status-option-content {\n  color: #7d4f24;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.physique-average .status-option-content {\n  color: #4d667f;\n}\n[_nghost-%COMP%]     .mat-mdc-select-panel.physique-options-panel {\n  width: auto !important;\n  max-width: 220px !important;\n  min-width: 0 !important;\n}\n[_nghost-%COMP%]     .physique-options-panel .mat-mdc-option {\n  padding-right: 8px;\n}\n[_nghost-%COMP%]     .physique-options-panel .mat-mdc-option .mat-pseudo-checkbox {\n  margin-left: 4px;\n}\n@media (max-width: 760px) {\n  .experience-form-grid[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n    max-width: none;\n    justify-content: stretch;\n    row-gap: 0.72rem;\n  }\n  .experience-date-range-label[_ngcontent-%COMP%] {\n    grid-column: 1/-1;\n  }\n  .experience-date-range-field[_ngcontent-%COMP%]   .mat-date-range-input-container[_ngcontent-%COMP%] {\n    grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);\n  }\n  .profile-details-privacy-fab[_ngcontent-%COMP%]   .privacy-fab-actions[_ngcontent-%COMP%] {\n    position: fixed;\n    left: 0.5rem;\n    right: 0.5rem;\n    bottom: max(0.5rem, env(safe-area-inset-bottom));\n    top: auto;\n    transform: translateY(12px) scale(0.98);\n    transform-origin: bottom center;\n    justify-content: center;\n    gap: 0.46rem;\n    padding: 0.46rem 0.56rem;\n    border: 1px solid rgba(42, 68, 102, 0.2);\n    border-radius: 14px;\n    background: #fff;\n    box-shadow: 0 -12px 24px rgba(18, 31, 51, 0.22);\n  }\n  .profile-details-privacy-fab.open[_ngcontent-%COMP%]   .privacy-fab-actions[_ngcontent-%COMP%] {\n    transform: translateY(0) scale(1);\n  }\n}\n.editor-list-card[_ngcontent-%COMP%] {\n  border: 1px solid rgba(13, 25, 44, 0.12);\n  border-radius: 11px;\n  padding: 0.56rem;\n  background: #fbfdff;\n}\n.editor-list-card[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 0.9rem;\n  color: var(--text-main);\n}\n.editor-list-card[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0;\n  color: var(--text-muted);\n}\n.experience-popup[_ngcontent-%COMP%] {\n  position: relative;\n  display: grid;\n  gap: 0.72rem;\n  padding-bottom: 0.5rem;\n  align-content: start;\n}\n.experience-toolbar[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  gap: 0.6rem;\n  margin-bottom: -0.16rem;\n}\n.experience-inline-actions[_ngcontent-%COMP%] {\n  position: relative;\n  display: inline-flex;\n  align-items: center;\n  margin-left: auto;\n}\n.experience-filter-select[_ngcontent-%COMP%] {\n  min-width: 174px;\n  width: 174px;\n  max-width: 174px;\n  height: 36px;\n}\n.experience-import-panel[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.78rem;\n}\n.experience-import-progress-card[_ngcontent-%COMP%] {\n  border: 1px solid rgba(38, 67, 103, 0.16);\n  border-radius: 14px;\n  background:\n    linear-gradient(\n      180deg,\n      rgba(247, 250, 255, 0.94) 0%,\n      rgba(241, 246, 255, 0.92) 100%);\n  padding: 0.78rem 0.84rem;\n  display: grid;\n  gap: 0.52rem;\n}\n.experience-import-progress-meta[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.6rem;\n  color: #203b60;\n}\n.experience-import-progress-meta[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  font-size: 0.82rem;\n  font-weight: 700;\n}\n.experience-import-progress-meta[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  font-size: 0.8rem;\n  color: #3b5f91;\n}\n.experience-import-progress-bar[_ngcontent-%COMP%] {\n  height: 10px;\n  border-radius: 999px;\n  overflow: hidden;\n  background: rgba(74, 106, 152, 0.12);\n}\n.experience-import-progress-bar[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  display: block;\n  height: 100%;\n  border-radius: inherit;\n  background:\n    linear-gradient(\n      90deg,\n      #f29d2e 0%,\n      #ed7f2e 55%,\n      #da5a39 100%);\n  transition: width 0.18s ease;\n}\n.experience-import-error[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: auto minmax(0, 1fr);\n  align-items: flex-start;\n  gap: 0.72rem;\n  border: 1px solid rgba(191, 68, 55, 0.24);\n  border-radius: 14px;\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 244, 242, 0.96) 0%,\n      rgba(255, 236, 233, 0.92) 100%);\n  color: #8a3228;\n  padding: 0.78rem 0.84rem;\n}\n.experience-import-error[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #cf4a3c;\n}\n.experience-import-error[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%], \n.experience-import-error[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0;\n}\n.experience-import-stats[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(3, minmax(0, 1fr));\n  gap: 0.58rem;\n}\n.experience-import-stat[_ngcontent-%COMP%] {\n  border: 1px solid rgba(38, 67, 103, 0.14);\n  border-radius: 14px;\n  background: #fbfdff;\n  padding: 0.72rem;\n  display: grid;\n  gap: 0.2rem;\n}\n.experience-import-stat[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  font-size: 0.74rem;\n  color: rgba(22, 44, 73, 0.68);\n}\n.experience-import-stat[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  font-size: 1.1rem;\n  color: #203b60;\n}\n.experience-import-type-stats[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 0.48rem;\n}\n.experience-import-type-chip[_ngcontent-%COMP%] {\n  min-width: 0;\n  max-width: 100%;\n  box-sizing: border-box;\n  border-radius: 999px;\n  padding: 0.42rem 0.62rem;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.38rem;\n  border: 1px solid rgba(45, 75, 111, 0.16);\n}\n.experience-import-type-chip[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n  line-height: 16px;\n}\n.experience-import-type-chip[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  font-size: 0.76rem;\n  font-weight: 700;\n}\n.experience-import-type-chip[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  margin-left: 0.08rem;\n  font-size: 0.76rem;\n}\n.experience-import-warnings[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.36rem;\n}\n.experience-import-warnings[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 0.82rem;\n  color: #213b60;\n}\n.experience-import-warnings[_ngcontent-%COMP%]   ul[_ngcontent-%COMP%] {\n  margin: 0;\n  padding-left: 1rem;\n  display: grid;\n  gap: 0.24rem;\n  color: rgba(22, 44, 73, 0.78);\n}\n.experience-import-actions[_ngcontent-%COMP%] {\n  justify-content: flex-end;\n}\n.experience-form-flow[_ngcontent-%COMP%] {\n  display: block;\n  width: 100%;\n  height: min(620px, 100vh - 6.5rem);\n  height: min(620px, 100dvh - 6.5rem);\n  min-height: 420px;\n  --form-flow-control-min-height: 40px;\n  --form-flow-control-padding: 8px 12px;\n}\n.image-file-input-hidden[_ngcontent-%COMP%] {\n  display: none;\n}\n.experience-type-field[_ngcontent-%COMP%]   .experience-type-select[_ngcontent-%COMP%] {\n  width: 100%;\n  min-width: 0;\n  max-width: 100%;\n}\n@media (max-width: 760px) {\n  .experience-toolbar[_ngcontent-%COMP%] {\n    align-items: stretch;\n  }\n  .experience-import-stats[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n  .experience-import-type-stats[_ngcontent-%COMP%] {\n    flex-direction: column;\n  }\n  .experience-import-type-chip[_ngcontent-%COMP%] {\n    width: 100%;\n    justify-content: space-between;\n  }\n}\n/*# sourceMappingURL=profile-experience-manager.component.css.map */'], changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ProfileExperienceManagerComponent, [{
    type: Component,
    args: [{ selector: "app-profile-experience-manager", standalone: true, imports: [
      CommonModule,
      FormsModule,
      MatIconModule,
      AppMenuComponent,
      FormFlowComponent,
      PopupComponent,
      SmartListComponent,
      SingleRowComponent
    ], providers: [
      {
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => ProfileExperienceManagerComponent),
        multi: true
      },
      { provide: DateAdapter, useClass: AppCalendarDateAdapter },
      { provide: MAT_DATE_FORMATS, useValue: AppCalendarDateFormats.dateOnly }
    ], changeDetection: ChangeDetectionStrategy.OnPush, template: `<div class="experience-popup">
  <input
    #experienceImportInput
    type="file"
    class="image-file-input-hidden"
    accept=".pdf,.doc,.docx,.odt,.rtf,.txt"
    (change)="onExperienceImportFileChange($event)"
  />
  <div class="experience-toolbar">
    <app-menu
      class="experience-filter-select"
      kind="select"
      [title]="'Experience'"
      [trigger]="experienceFilterMenuTrigger()"
      [items]="experienceFilterMenuItems()"
      (itemSelect)="onProfileExperienceMenuSelect($event)"
    ></app-menu>
    @if (showInlineActions) {
      <div class="experience-inline-actions">
        <app-menu
          kind="inline"
          [items]="experienceQuickActionMenuItems()"
          (itemSelect)="onProfileExperienceMenuSelect($event)"
        ></app-menu>
      </div>
    }
  </div>
  <app-smart-list
    [config]="experienceSmartListConfig"
    [loadPage]="experienceSmartListLoadPage"
    [itemTemplate]="experienceRowTemplate"
    [query]="experienceSmartListQuery"
    (menuItemSelect)="onExperienceRowSharedMenuSelect($event)"
  ></app-smart-list>
  <ng-template #experienceRowTemplate let-row let-openMenu="openMenu">
    <single-row
      [row]="row"
      [useSharedMenu]="true"
      (menuRequest)="openMenu($event)"
    ></single-row>
  </ng-template>
  @if (experienceImportDialog.visible) {
    <app-popup [model]="experienceImportPopupModel()" [zIndex]="experienceImportPopupZIndex()">
        <section class="experience-import-panel">
          <div class="experience-import-progress-card">
            <div class="experience-import-progress-meta">
              <span>{{ experienceImportDialog.progress.label || 'Preparing upload' }}</span>
              <strong>{{ experienceImportDialog.progress.percent }}%</strong>
            </div>
            <div class="experience-import-progress-bar">
              <span [style.width.%]="experienceImportDialog.progress.percent"></span>
            </div>
          </div>
          @if (experienceImportDialog.error) {
            <div class="experience-import-error">
              <mat-icon>error</mat-icon>
              <div>
                <strong>Invalid document</strong>
                <p>{{ experienceImportDialog.error }}</p>
              </div>
            </div>
          }
          @if (!experienceImportDialog.error) {
            <div class="experience-import-stats">
              <div class="experience-import-stat">
                <span>Detected</span>
                <strong>{{ experienceImportDialog.statistics.detectedCount }}</strong>
              </div>
              <div class="experience-import-stat">
                <span>Ready to add</span>
                <strong>{{ experienceImportDialog.statistics.importedCount }}</strong>
              </div>
              <div class="experience-import-stat">
                <span>Duplicates skipped</span>
                <strong>{{ experienceImportDialog.statistics.duplicateCount }}</strong>
              </div>
            </div>
          }
          @if (!experienceImportDialog.error) {
            <div class="experience-import-type-stats">
              @for (option of experienceTypeOptions; track option) {
                <div class="experience-import-type-chip" [ngClass]="experienceTypeToneClass(option)">
                  <mat-icon>{{ experienceTypeIcon(option) }}</mat-icon>
                  <span>{{ option }}</span>
                  <strong>{{ experienceImportTypeCount(option) }}</strong>
                </div>
              }
            </div>
          }
          @if (!experienceImportDialog.error && experienceImportDialog.statistics.detectedCount === 0) {
            <div class="editor-list-card">
              <h4>No categorized items found</h4>
              <p>The document was parsed, but no experience cards were recognized in any category.</p>
            </div>
          }
          @if (experienceImportDialog.warnings.length > 0) {
            <div class="experience-import-warnings">
              <h4>Import notes</h4>
              <ul>
                @for (warning of experienceImportDialog.warnings; track warning) {
                  <li>{{ warning }}</li>
                }
              </ul>
            </div>
          }
          <div class="popup-actions experience-import-actions">
            <button
              type="button"
              class="link-btn neutral-btn"
              (click)="cancelExperienceImportDialog()"
              >
              Cancel
            </button>
            <button
              type="button"
              class="link-btn primary-btn"
              [disabled]="!canSubmitExperienceImport"
              (click)="submitExperienceImport()"
              >
              Submit
            </button>
          </div>
        </section>
    </app-popup>
  }
  @if (showExperienceForm) {
    <app-popup [model]="experienceFormPopupModel()" [zIndex]="experienceFormPopupZIndex()">
      <app-form-flow
        class="experience-form-flow"
        [model]="experienceFormFlowModel()"
        [(ngModel)]="experienceForm"
        [disabled]="controlDisabled"
      ></app-form-flow>
    </app-popup>
  }
</div>
`, styles: ['/* src/app/shared/ui/components/core/form/popups/profile-experience-manager/profile-experience-manager.component.scss */\n:host {\n  display: contents;\n  --line: rgba(23, 33, 54, 0.12);\n  --line-strong: rgba(23, 33, 54, 0.2);\n  --text-main: #22324a;\n  --text-muted: rgba(23, 41, 66, 0.72);\n}\n.app-popup {\n  position: fixed;\n  inset: 0;\n  z-index: 2300;\n  display: flex;\n  align-items: flex-start;\n  justify-content: center;\n  padding: 1rem;\n}\n.app-popup-backdrop {\n  position: absolute;\n  inset: 0;\n  background: #e9edf5;\n}\n.app-popup-panel {\n  position: relative;\n  z-index: 1;\n  width: min(1080px, 100vw - 1.2rem);\n  max-height: calc(100vh - 1.2rem);\n  max-height: calc(100dvh - 1.2rem);\n  border-radius: 14px;\n  background: #fff;\n  box-shadow: 0 18px 42px rgba(0, 0, 0, 0.26);\n  overflow: hidden;\n  display: flex;\n  flex-direction: column;\n}\n.app-popup-panel.popup-panel-wide {\n  width: min(1080px, 100vw - 1.2rem);\n}\n.app-popup-panel.popup-panel-full-height {\n  height: calc(100vh - 1.2rem);\n  height: calc(100dvh - 1.2rem);\n  max-height: calc(100vh - 1.2rem);\n  max-height: calc(100dvh - 1.2rem);\n}\n.app-popup-panel.popup-panel-image-editor {\n  height: calc(100vh - 1.2rem);\n  height: calc(100dvh - 1.2rem);\n}\n.app-popup-panel.popup-panel-profile-editor {\n  width: min(1080px, 100vw - 1.2rem);\n  height: calc(100vh - 1.2rem);\n  height: calc(100dvh - 1.2rem);\n}\n.app-popup-panel.popup-panel-profile-selector {\n  width: min(1080px, 100vw - 1.2rem);\n  height: calc(100vh - 1.2rem);\n  height: calc(100dvh - 1.2rem);\n}\n.popup-header {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  gap: 0.4rem;\n  padding: 0.58rem 0.4rem;\n  border-bottom: 1px solid var(--line);\n  position: relative;\n}\n.popup-header > .popup-title {\n  min-width: 0;\n  flex: 1 1 auto;\n}\n.popup-header.popup-header-with-back {\n  justify-content: flex-start;\n}\n.popup-title h2 {\n  margin: 0;\n  font-size: 1.05rem;\n  color: var(--text-main);\n  font-weight: 700;\n}\n.popup-subtitle,\n.popup-subtitle-activities {\n  margin: 0.14rem 0 0;\n  font-size: 0.74rem;\n  font-weight: 700;\n  color: rgba(21, 39, 62, 0.72);\n}\n.popup-subtitle-secondary,\n.popup-subtitle-activities-secondary {\n  margin-top: 0.04rem;\n  font-size: 0.68rem;\n  font-weight: 800;\n  letter-spacing: 0.01em;\n  color: rgba(21, 39, 62, 0.58);\n}\n.popup-body {\n  padding: 0.4rem;\n  overflow-y: auto;\n  overflow-x: hidden;\n  display: flex;\n  flex-direction: column;\n  gap: 0.72rem;\n  flex: 1 1 auto;\n  min-height: 0;\n}\n.popup-body.popup-body-experience {\n  position: relative;\n  padding-bottom: 0.74rem;\n}\n.popup-close {\n  flex: 0 0 auto;\n  width: 34px;\n  height: 34px;\n  min-width: 34px;\n  min-height: 34px;\n  border: 1px solid rgba(47, 86, 139, 0.2);\n  border-radius: 50%;\n  background: rgba(255, 255, 255, 0.92);\n  color: rgba(38, 67, 105, 0.92);\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  cursor: pointer;\n  padding: 0;\n  line-height: 0;\n  box-sizing: border-box;\n  box-shadow: 0 8px 18px rgba(37, 62, 95, 0.12);\n  --mdc-icon-button-state-layer-size: 34px;\n}\n.popup-close .mat-icon {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  width: 21px;\n  height: 21px;\n  font-size: 21px;\n  line-height: 21px;\n  margin: 0;\n}\n.popup-close:not(:disabled):not([aria-disabled=true]):hover {\n  border-color: rgba(47, 86, 139, 0.32);\n  background: #fff;\n  color: rgba(24, 50, 84, 0.98);\n}\n.popup-close:not(:disabled):not([aria-disabled=true]):active {\n  background: rgba(239, 245, 252, 0.96);\n}\n.popup-close:focus-visible {\n  outline: 2px solid rgba(61, 108, 186, 0.35);\n  outline-offset: 1px;\n}\n.popup-close:disabled,\n.popup-close[aria-disabled=true] {\n  opacity: 0.56;\n  cursor: default;\n}\n.popup-header-with-progress,\n.popup-header-with-activities-progress {\n  border-bottom-color: rgba(46, 114, 184, 0.2);\n}\n.popup-surface-overlay,\n.experience-form-overlay {\n  position: fixed;\n  inset: 0;\n  z-index: 15;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  padding: 0.9rem;\n}\n.popup-surface-overlay-backdrop,\n.experience-form-overlay-backdrop {\n  position: absolute;\n  inset: 0;\n  background: rgba(8, 16, 30, 0.76);\n}\n.popup-surface,\n.experience-form-popup {\n  position: relative;\n  z-index: 1;\n  width: min(860px, 100vw - 2rem);\n  max-height: calc(100vh - 1.8rem);\n  overflow: hidden;\n  border-radius: 16px;\n  background: #fff;\n  box-sizing: border-box;\n  border: 1px solid rgba(42, 66, 102, 0.28);\n  box-shadow: 0 24px 60px rgba(14, 32, 58, 0.26);\n  display: flex;\n  flex-direction: column;\n  contain: layout paint;\n}\n.popup-surface-header,\n.experience-form-header {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.6rem;\n  padding: 0.82rem 1rem;\n  border-bottom: 1px solid var(--line);\n  background:\n    linear-gradient(\n      180deg,\n      #ffffff 0%,\n      #f4f8ff 100%);\n}\n.popup-surface-header-title {\n  min-width: 0;\n  display: inline-flex;\n  flex-direction: column;\n  gap: 0.08rem;\n}\n.popup-surface-header h3,\n.experience-form-header h3 {\n  margin: 0;\n  font-size: 1.12rem;\n  color: var(--text-main);\n  font-weight: 700;\n}\n.popup-surface-header-title p {\n  margin: 0;\n  font-size: 0.78rem;\n  color: rgba(53, 79, 114, 0.86);\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.popup-surface-header-controls,\n.experience-form-header-controls {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.44rem;\n}\n.popup-header-add-btn {\n  width: 30px;\n  height: 30px;\n  border: 1px solid rgba(30, 88, 152, 0.46);\n  border-radius: 50%;\n  background:\n    linear-gradient(\n      180deg,\n      #e2f0ff 0%,\n      #c5dbf8 100%);\n  color: #15457c;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  cursor: pointer;\n  box-shadow: 0 2px 8px rgba(31, 79, 132, 0.18);\n}\n.popup-header-add-btn .mat-icon {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n  line-height: 16px;\n  pointer-events: none;\n}\n.popup-header-add-btn:hover {\n  background:\n    linear-gradient(\n      180deg,\n      #d4e8ff 0%,\n      #b5d1f3 100%);\n  border-color: rgba(27, 74, 130, 0.6);\n  color: #103966;\n  box-shadow: 0 4px 10px rgba(28, 69, 114, 0.24);\n}\n.popup-header-add-btn:active:not(:disabled) {\n  box-shadow: 0 1px 4px rgba(36, 74, 121, 0.2);\n}\n.popup-header-add-btn.subevent-leaderboard-save-btn {\n  border-color: rgba(46, 121, 69, 0.46);\n  background:\n    linear-gradient(\n      180deg,\n      #e6faec 0%,\n      #c9f0d5 100%);\n  color: #1f6f39;\n}\n.popup-header-add-btn.subevent-leaderboard-save-btn:hover {\n  border-color: rgba(38, 98, 58, 0.64);\n  background:\n    linear-gradient(\n      180deg,\n      #d8f5e2 0%,\n      #b8e8c8 100%);\n  color: #175a2d;\n}\n.popup-header-add-btn:disabled {\n  opacity: 0.54;\n  cursor: not-allowed;\n  box-shadow: 0 2px 8px rgba(31, 79, 132, 0.12);\n}\n.popup-header-add-btn.form-save-invalid,\n.popup-header-add-btn.form-save-invalid:disabled {\n  border-color: rgba(147, 31, 31, 0.86);\n  background:\n    linear-gradient(\n      180deg,\n      #ef5c5c 0%,\n      #cb2f2f 100%);\n  color: #fff;\n  opacity: 1;\n  box-shadow: 0 2px 8px rgba(122, 25, 25, 0.22);\n}\n.popup-surface-close-btn,\n.experience-form-close-btn {\n  width: 34px;\n  height: 34px;\n  border: 0;\n  border-radius: 50%;\n  background: transparent;\n  color: rgba(42, 57, 77, 0.88);\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  cursor: pointer;\n  padding: 0;\n}\n.popup-surface-close-btn .mat-icon,\n.experience-form-close-btn .mat-icon {\n  width: 18px;\n  height: 18px;\n  font-size: 18px;\n  line-height: 18px;\n  pointer-events: none;\n}\n.popup-surface-close-btn:not(:disabled):not([aria-disabled=true]):hover,\n.experience-form-close-btn:not(:disabled):not([aria-disabled=true]):hover {\n  background: rgba(110, 124, 145, 0.18);\n  color: rgba(28, 40, 57, 0.94);\n}\n.popup-surface-close-btn:not(:disabled):not([aria-disabled=true]):active,\n.experience-form-close-btn:not(:disabled):not([aria-disabled=true]):active {\n  background: rgba(96, 111, 134, 0.24);\n}\n.popup-surface-body,\n.experience-form-panel {\n  border: 1px solid rgba(43, 71, 107, 0.2);\n  border-radius: 14px;\n  background: #f8fbff;\n  padding: 0.74rem;\n  display: grid;\n  gap: 0.78rem;\n  margin: 0;\n  box-sizing: border-box;\n  flex: 1 1 auto;\n  min-height: 0;\n  align-items: start;\n  align-content: start;\n  overflow-y: auto;\n  overflow-x: hidden;\n  -webkit-overflow-scrolling: touch;\n  scrollbar-gutter: stable;\n}\n.mobile-profile-selector-sheet-wrap {\n  position: fixed;\n  inset: 0;\n  z-index: 2800;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  padding: 1rem;\n}\n.mobile-profile-selector-backdrop {\n  position: absolute;\n  inset: 0;\n  background: rgba(8, 16, 30, 0.5);\n}\n.mobile-profile-selector-sheet {\n  position: relative;\n  width: fit-content;\n  min-width: 230px;\n  max-width: min(92vw, 420px);\n  max-height: min(78vh, 620px);\n  border-radius: 16px;\n  border: 1px solid #d6deea;\n  background: #fff;\n  box-shadow: 0 16px 32px rgba(15, 29, 52, 0.24);\n  padding: 0.4rem 0.6rem 0.58rem;\n  display: flex;\n  flex-direction: column;\n}\n.mobile-profile-selector-sheet.mobile-profile-selector-sheet-language {\n  width: min(94vw, 620px);\n  min-width: 340px;\n  max-width: min(94vw, 620px);\n  height: min(78vh, 620px);\n  max-height: min(78vh, 620px);\n}\n.mobile-profile-selector-sheet.mobile-profile-selector-sheet-language .mobile-profile-selector-title,\n.mobile-profile-selector-sheet.mobile-profile-selector-sheet-language .mobile-profile-language-entry {\n  flex: 0 0 auto;\n  width: 100%;\n}\n.mobile-profile-selector-sheet.mobile-profile-selector-sheet-language .mobile-profile-language-chips {\n  width: 100%;\n  align-content: flex-start;\n}\n.mobile-profile-selector-sheet.mobile-profile-selector-sheet-language .mobile-profile-selector-options {\n  flex: 1 1 auto;\n  overflow-x: hidden;\n  overflow-y: auto;\n  margin-top: 0.18rem;\n  justify-items: stretch;\n  align-content: start;\n  grid-auto-rows: max-content;\n}\n.mobile-profile-selector-sheet.mobile-profile-selector-sheet-language .mobile-profile-selector-option {\n  width: 100%;\n  min-width: 0;\n  min-height: 46px;\n}\n.mobile-profile-selector-handle {\n  width: 42px;\n  height: 4px;\n  border-radius: 999px;\n  background: rgba(44, 67, 100, 0.24);\n  margin: 0.08rem auto 0.52rem;\n}\n.mobile-profile-selector-title {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.28rem;\n  padding: 0 0.14rem;\n  color: #1c3354;\n  font-size: 0.94rem;\n  font-weight: 800;\n  position: relative;\n}\n.mobile-profile-selector-close-btn {\n  margin-left: auto;\n  width: 34px;\n  height: 34px;\n  border: 0;\n  border-radius: 50%;\n  background: transparent;\n  color: rgba(42, 57, 77, 0.88);\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  padding: 0;\n  cursor: pointer;\n}\n.mobile-profile-selector-close-btn .mat-icon {\n  width: 18px;\n  height: 18px;\n  font-size: 18px;\n  line-height: 18px;\n}\n.mobile-profile-selector-close-btn:not(:disabled):not([aria-disabled=true]):hover {\n  background: rgba(110, 124, 145, 0.18);\n  color: rgba(28, 40, 57, 0.94);\n}\n.mobile-profile-selector-close-btn:not(:disabled):not([aria-disabled=true]):active {\n  background: rgba(96, 111, 134, 0.24);\n}\n.mobile-profile-selector-options {\n  margin-top: 0.42rem;\n  display: grid;\n  gap: 0.32rem;\n  justify-items: center;\n  max-height: min(64vh, 520px);\n  overflow: auto;\n  overscroll-behavior: contain;\n}\n.mobile-profile-selector-option {\n  width: max-content;\n  min-width: 220px;\n  max-width: 100%;\n  border: 1px solid rgba(58, 81, 114, 0.24);\n  border-radius: 12px;\n  background: #f7f9fd;\n  color: #1f3f67;\n  min-height: 42px;\n  padding: 0.46rem 0.62rem;\n  display: inline-flex;\n  align-items: center;\n  justify-content: space-between;\n}\n.mobile-profile-selector-option-main {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.36rem;\n  min-width: 0;\n  text-align: left;\n}\n.mobile-profile-selector-option.active {\n  box-shadow: inset 0 0 0 1px rgba(24, 46, 76, 0.24);\n  filter: brightness(0.95);\n}\n@media (max-width: 760px) {\n  .app-popup {\n    padding: 0;\n    align-items: stretch;\n  }\n  .app-popup-panel,\n  .app-popup-panel.popup-panel-profile-editor,\n  .app-popup-panel.popup-panel-profile-selector,\n  .app-popup-panel.popup-panel-image-editor {\n    width: 100vw !important;\n    max-width: 100vw !important;\n    height: 100vh !important;\n    height: 100dvh !important;\n    max-height: 100vh !important;\n    max-height: 100dvh !important;\n    min-height: 100dvh;\n    margin: 0 !important;\n    border-radius: 0;\n    box-shadow: none;\n  }\n  .experience-form-overlay {\n    padding: 0;\n    align-items: stretch;\n    justify-content: stretch;\n  }\n  .experience-form-popup {\n    width: 100vw;\n    max-width: 100vw;\n    height: 100svh;\n    height: 100vh;\n    height: 100dvh;\n    max-height: 100svh;\n    max-height: 100vh;\n    max-height: 100dvh;\n    border-radius: 0;\n  }\n  .experience-form-panel {\n    min-height: 0;\n    flex: 1 1 auto;\n    border-radius: 0;\n  }\n  .app-popup-panel.popup-panel-profile-editor .popup-body {\n    display: flex !important;\n    flex-direction: column;\n    min-height: 0;\n    height: 100%;\n    overflow: hidden !important;\n    overflow-x: hidden !important;\n    padding-bottom: 0;\n  }\n  .app-popup-panel.popup-panel-profile-editor .profile-editor-wrap {\n    display: grid;\n    grid-template-rows: auto minmax(0, 1fr);\n    min-height: 0;\n    height: 100%;\n    overflow: hidden;\n  }\n  .app-popup-panel.popup-panel-profile-editor .profile-editor-scroll-area {\n    flex: 1 1 auto;\n    min-height: 0;\n    max-height: none;\n    overflow-y: auto !important;\n    overflow-x: hidden !important;\n    padding-bottom: calc(0.74rem + env(safe-area-inset-bottom));\n    scroll-padding-bottom: calc(0.74rem + env(safe-area-inset-bottom));\n    overscroll-behavior: contain;\n    -webkit-overflow-scrolling: touch;\n  }\n  .popup-surface-overlay,\n  .experience-form-overlay {\n    padding: 0;\n    align-items: stretch;\n    justify-content: stretch;\n  }\n  .popup-surface,\n  .experience-form-popup {\n    width: 100%;\n    max-width: 100%;\n    min-width: 0;\n    height: 100dvh;\n    max-height: 100dvh;\n    border-radius: 0;\n  }\n  .popup-surface-body,\n  .experience-form-panel {\n    min-height: 0;\n    flex: 1 1 auto;\n    border-radius: 0;\n  }\n  .mobile-profile-selector-sheet-wrap {\n    display: block;\n    padding: 0;\n  }\n  .mobile-profile-selector-sheet {\n    position: absolute;\n    left: 0.65rem;\n    right: 0.65rem;\n    bottom: 0;\n    width: auto;\n    box-sizing: border-box;\n    min-width: 0;\n    max-width: 100vw;\n    max-height: calc(100dvh - 0.4rem);\n    border-radius: 16px 16px 0 0;\n    border-bottom: 0;\n    box-shadow: 0 -16px 32px rgba(15, 29, 52, 0.24);\n    padding: 0.4rem 0.6rem max(0.58rem, env(safe-area-inset-bottom));\n  }\n  .mobile-profile-selector-sheet.mobile-profile-selector-sheet-language {\n    top: 0;\n    left: 0;\n    right: 0;\n    bottom: 0;\n    width: 100vw;\n    max-width: 100vw;\n    height: var(--mobile-language-sheet-height, 100svh);\n    max-height: var(--mobile-language-sheet-height, 100svh);\n    border-radius: 0;\n    padding: max(0.4rem, env(safe-area-inset-top)) 0.6rem max(0.58rem, env(safe-area-inset-bottom));\n    display: flex;\n    flex-direction: column;\n  }\n  .mobile-profile-selector-options {\n    justify-items: stretch;\n    max-height: none;\n    flex: 1 1 auto;\n  }\n  .mobile-profile-selector-option {\n    width: 100%;\n    min-width: 0;\n  }\n  .app-popup-panel.popup-panel-image-editor {\n    height: 100vh !important;\n    height: 100dvh !important;\n  }\n  .popup-body.popup-body-image-editor {\n    height: calc(100vh - 58px);\n    height: calc(100dvh - 58px);\n    padding: 0.45rem;\n  }\n}\n:host {\n  --interactive-motion-duration: 160ms;\n  --interactive-motion-ease: cubic-bezier(0.22, 1, 0.36, 1);\n  --interactive-hover-lift: -1px;\n  --interactive-hover-scale: 1.01;\n  --interactive-hover-brightness: 1.01;\n  --interactive-press-scale: 0.97;\n  --interactive-press-brightness: 0.97;\n}\n:where(button, a[href], [role=button], .link-btn, .popup-view-fab, .popup-header-add-btn, .activities-view-option, .profile-status-select-wrap, .profile-details-values-btn, .profile-details-privacy-btn, .profile-privacy-menu-option, .popup-close, .date-picker-btn, .avatar-edit-btn, .experience-form-close-btn, .image-editor-grid button, .image-stack-line, .image-stack-hit-segment, .mobile-profile-selector-close-btn, .mobile-profile-selector-option, .popup-panel-profile-selector .profile-filter-selector-clear, .popup-panel-profile-selector .profile-filter-selector-chip, .popup-panel-profile-selector .profile-selector-chip, .item-action-menu-btn, .experience-action-btn, .header-icon-btn, .chat-header-members, .activities-row-item-clickable, .activities-card-btn, .asset-source-icon, .event-editor-members-trigger, .motion-card, [data-motion=card]):not(.motion-static):not([data-motion=none]) {\n  -webkit-tap-highlight-color: transparent;\n  transition:\n    transform var(--interactive-motion-duration) var(--interactive-motion-ease),\n    filter var(--interactive-motion-duration) var(--interactive-motion-ease),\n    box-shadow var(--interactive-motion-duration) var(--interactive-motion-ease),\n    background-color var(--interactive-motion-duration) var(--interactive-motion-ease),\n    border-color var(--interactive-motion-duration) var(--interactive-motion-ease),\n    color var(--interactive-motion-duration) var(--interactive-motion-ease);\n  transform-origin: center;\n}\n:where(button, a[href], [role=button], .link-btn, .popup-view-fab, .popup-header-add-btn, .activities-view-option, .profile-status-select-wrap, .profile-details-values-btn, .profile-details-privacy-btn, .profile-privacy-menu-option, .popup-close, .date-picker-btn, .avatar-edit-btn, .experience-form-close-btn, .image-editor-grid button, .image-stack-line, .image-stack-hit-segment, .mobile-profile-selector-close-btn, .mobile-profile-selector-option, .popup-panel-profile-selector .profile-filter-selector-clear, .popup-panel-profile-selector .profile-filter-selector-chip, .popup-panel-profile-selector .profile-selector-chip, .item-action-menu-btn, .experience-action-btn, .header-icon-btn, .chat-header-members, .activities-row-item-clickable, .activities-card-btn, .asset-source-icon, .event-editor-members-trigger, .motion-card, [data-motion=card]):not(.motion-static):not([data-motion=none]):focus-visible {\n  outline: 2px solid rgba(66, 110, 182, 0.44);\n  outline-offset: 2px;\n}\n@media (hover: hover) and (pointer: fine) {\n  :where(button, a[href], [role=button], .link-btn, .popup-view-fab, .popup-header-add-btn, .activities-view-option, .profile-status-select-wrap, .profile-details-values-btn, .profile-details-privacy-btn, .profile-privacy-menu-option, .popup-close, .date-picker-btn, .avatar-edit-btn, .experience-form-close-btn, .image-editor-grid button, .image-stack-line, .image-stack-hit-segment, .mobile-profile-selector-close-btn, .mobile-profile-selector-option, .popup-panel-profile-selector .profile-filter-selector-clear, .popup-panel-profile-selector .profile-filter-selector-chip, .popup-panel-profile-selector .profile-selector-chip, .item-action-menu-btn, .experience-action-btn, .header-icon-btn, .chat-header-members, .activities-row-item-clickable, .activities-card-btn, .asset-source-icon, .event-editor-members-trigger, .motion-card, [data-motion=card]):not(.motion-static):not([data-motion=none]):not(:disabled):not([aria-disabled=true]):hover {\n    transform: translateY(var(--interactive-hover-lift)) scale(var(--interactive-hover-scale));\n    filter: brightness(var(--interactive-hover-brightness));\n  }\n  :where(button, a[href], [role=button], .link-btn, .popup-view-fab, .popup-header-add-btn, .activities-view-option, .profile-status-select-wrap, .profile-details-values-btn, .profile-details-privacy-btn, .profile-privacy-menu-option, .popup-close, .date-picker-btn, .avatar-edit-btn, .experience-form-close-btn, .image-editor-grid button, .image-stack-line, .image-stack-hit-segment, .mobile-profile-selector-close-btn, .mobile-profile-selector-option, .popup-panel-profile-selector .profile-filter-selector-clear, .popup-panel-profile-selector .profile-filter-selector-chip, .popup-panel-profile-selector .profile-selector-chip, .item-action-menu-btn, .experience-action-btn, .header-icon-btn, .chat-header-members, .activities-row-item-clickable, .activities-card-btn, .asset-source-icon, .event-editor-members-trigger, .motion-card, [data-motion=card]):not(.motion-static):not([data-motion=none]):not(:disabled):not([aria-disabled=true]):active {\n    transform: scale(var(--interactive-press-scale));\n    filter: brightness(var(--interactive-press-brightness));\n  }\n  :where(.motion-card, [data-motion=card]):not(.motion-static):not([data-motion=none]):hover {\n    box-shadow: 0 3px 10px rgba(16, 29, 48, 0.14);\n  }\n}\n@keyframes shared-mobile-touch-feedback {\n  0% {\n    transform: scale(1);\n    filter: brightness(1);\n  }\n  45% {\n    transform: scale(var(--interactive-press-scale));\n    filter: brightness(var(--interactive-press-brightness));\n  }\n  100% {\n    transform: scale(1);\n    filter: brightness(1);\n  }\n}\n@media (hover: none), (pointer: coarse) {\n  :where(button, a[href], [role=button], .link-btn, .popup-view-fab, .popup-header-add-btn, .activities-view-option, .profile-status-select-wrap, .profile-details-values-btn, .profile-details-privacy-btn, .profile-privacy-menu-option, .popup-close, .date-picker-btn, .avatar-edit-btn, .experience-form-close-btn, .image-editor-grid button, .image-stack-line, .image-stack-hit-segment, .mobile-profile-selector-close-btn, .mobile-profile-selector-option, .popup-panel-profile-selector .profile-filter-selector-clear, .popup-panel-profile-selector .profile-filter-selector-chip, .popup-panel-profile-selector .profile-selector-chip, .item-action-menu-btn, .experience-action-btn, .header-icon-btn, .chat-header-members, .activities-row-item-clickable, .activities-card-btn, .asset-source-icon, .event-editor-members-trigger, .motion-card, [data-motion=card]):not(.motion-static):not([data-motion=none]):not(:disabled):not([aria-disabled=true]):active {\n    animation: shared-mobile-touch-feedback 0.2s ease;\n  }\n}\n.app-popup,\n.mobile-profile-selector-sheet-wrap,\n.popup-surface,\n.experience-form-popup {\n  font-family:\n    "Nunito Sans",\n    "Segoe UI",\n    sans-serif;\n}\n.app-popup button,\n.app-popup input,\n.app-popup textarea,\n.app-popup select,\n.app-popup .mat-mdc-select,\n.app-popup .mat-mdc-select-value-text,\n.app-popup .mat-mdc-option,\n.popup-surface button,\n.popup-surface input,\n.popup-surface textarea,\n.popup-surface select,\n.popup-surface .mat-mdc-select,\n.popup-surface .mat-mdc-select-value-text,\n.popup-surface .mat-mdc-option,\n.experience-form-popup button,\n.experience-form-popup input,\n.experience-form-popup textarea,\n.experience-form-popup select,\n.experience-form-popup .mat-mdc-select,\n.experience-form-popup .mat-mdc-select-value-text,\n.experience-form-popup .mat-mdc-option,\n.mobile-profile-selector-sheet-wrap button,\n.mobile-profile-selector-sheet-wrap input,\n.mobile-profile-selector-sheet-wrap .mat-mdc-option {\n  font-family: inherit;\n}\n.popup-filter-picker,\n.activities-view-picker {\n  position: relative;\n  z-index: 60;\n  margin-left: auto;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.34rem;\n}\n.popup-filter-picker-secondary,\n.activities-secondary-picker {\n  position: relative;\n  z-index: 61;\n}\n.selector-like {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.35rem;\n}\n.profile-status-select-wrap.popup-compact-select,\n.profile-status-select-wrap.activities-compact-select,\n.profile-status-select-wrap.assets-compact-select {\n  width: fit-content !important;\n  min-width: 0 !important;\n  max-width: 100%;\n}\n.profile-status-select-wrap.popup-compact-select .mat-mdc-select,\n.profile-status-select-wrap.activities-compact-select .mat-mdc-select,\n.profile-status-select-wrap.assets-compact-select .mat-mdc-select {\n  width: auto;\n  min-width: 0;\n}\n.profile-status-select-wrap.popup-compact-select .mat-mdc-select-trigger,\n.profile-status-select-wrap.activities-compact-select .mat-mdc-select-trigger,\n.profile-status-select-wrap.assets-compact-select .mat-mdc-select-trigger {\n  width: auto !important;\n  min-width: 0;\n}\n.profile-status-select-wrap.popup-compact-select .status-option-content,\n.profile-status-select-wrap.activities-compact-select .status-option-content,\n.profile-status-select-wrap.assets-compact-select .status-option-content {\n  width: auto;\n  min-width: 0;\n}\n.profile-status-select-wrap.popup-filter-no-badge,\n.profile-status-select-wrap.activities-filter-no-badge {\n  min-width: 0;\n}\n.profile-status-select-wrap.popup-filter-no-badge .status-option-content,\n.profile-status-select-wrap.activities-filter-no-badge .status-option-content {\n  width: auto !important;\n  flex: 0 1 auto;\n}\n.profile-status-select-wrap.popup-filter-no-badge .mat-mdc-select,\n.profile-status-select-wrap.activities-filter-no-badge .mat-mdc-select {\n  width: auto;\n  min-width: 0;\n}\n.profile-status-select-wrap.popup-filter-no-badge .mat-mdc-select-trigger,\n.profile-status-select-wrap.activities-filter-no-badge .mat-mdc-select-trigger {\n  width: auto !important;\n}\n.profile-status-select-wrap.popup-filter-no-badge .mat-mdc-select-arrow-wrapper,\n.profile-status-select-wrap.activities-filter-no-badge .mat-mdc-select-arrow-wrapper {\n  margin-left: 0.28rem;\n}\n.profile-status-select-wrap {\n  min-width: 174px;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.38rem;\n  border: 1px solid #c8d3e2;\n  border-radius: 999px;\n  box-shadow: 0 2px 6px rgba(38, 60, 92, 0.08);\n  padding: 0.12rem 0.5rem 0.12rem 0.84rem;\n  background: #f8f9fb;\n}\n.profile-status-select-wrap.selector-like {\n  min-height: 36px;\n}\n.status-option-content {\n  display: flex;\n  align-items: center;\n  justify-content: flex-start;\n  gap: 0.2rem;\n  text-transform: lowercase;\n  width: 100%;\n  min-width: 0;\n}\n.status-option-content span:last-child {\n  white-space: nowrap;\n}\n.status-option-content .mat-icon {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n  line-height: 16px;\n  flex: 0 0 16px;\n}\n.rate-filter-count-badge {\n  margin-left: auto;\n  width: 20px;\n  height: 20px;\n  border-radius: 50%;\n  border: 1px solid #fff;\n  background: #d84d4d;\n  color: #fff;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  padding: 0;\n  font-size: 0.68rem;\n  font-weight: 800;\n  line-height: 1;\n  box-shadow: 0 2px 8px rgba(120, 24, 24, 0.22);\n}\n.rate-filter-trigger-badge {\n  position: absolute;\n  top: -8px;\n  right: -8px;\n  margin-left: 0;\n  z-index: 2;\n}\n.popup-filter-control,\n.activities-rate-filter-select,\n.activities-primary-filter-select,\n.activities-event-scope-filter-select,\n.activities-chat-context-filter-select {\n  position: relative;\n  overflow: visible;\n}\n.popup-filter-panel,\n.activities-view-picker-panel {\n  position: absolute;\n  top: calc(100% + 0.32rem);\n  right: 0;\n  border: 1px solid rgba(39, 62, 94, 0.22);\n  border-radius: 10px;\n  background: #fff;\n  box-shadow: 0 10px 24px rgba(17, 29, 48, 0.22);\n  padding: 0.24rem;\n  min-width: 128px;\n  z-index: 40;\n  display: grid;\n  gap: 0.16rem;\n}\n.popup-filter-option,\n.activities-view-option {\n  border: 0;\n  background: #fff;\n  border-radius: 8px;\n  min-height: 32px;\n  padding: 0.34rem 0.44rem;\n  display: inline-flex;\n  align-items: center;\n  justify-content: flex-start;\n  gap: 0.34rem;\n  color: #1e3658;\n  cursor: pointer;\n  text-align: left;\n}\n.popup-filter-option .mat-icon,\n.activities-view-option .mat-icon {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n}\n.popup-filter-option span,\n.activities-view-option span {\n  font-size: 0.78rem;\n  font-weight: 700;\n}\n.popup-filter-option > span:not(.rate-filter-count-badge),\n.activities-view-option > span:not(.rate-filter-count-badge) {\n  flex: 1 1 auto;\n  min-width: 0;\n  text-align: left;\n}\n.popup-mobile-filter-picker,\n.activities-mobile-primary-filter-picker,\n.activities-mobile-event-scope-filter-picker,\n.activities-mobile-chat-context-filter-picker,\n.activities-mobile-rate-filter-picker {\n  position: relative;\n}\n.popup-mobile-filter-panel,\n.activities-mobile-filter-panel,\n.activities-mobile-rate-filter-panel {\n  top: calc(100% + 0.24rem);\n  right: 0;\n  min-width: 210px;\n  z-index: 65;\n}\n.popup-mobile-sheet-title,\n.activities-mobile-sheet-title {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.28rem;\n  padding: 0 0.14rem;\n  color: #1c3354;\n  font-size: 0.94rem;\n  font-weight: 800;\n}\n.popup-mobile-sheet-title .mat-icon,\n.activities-mobile-sheet-title .mat-icon {\n  width: 17px;\n  height: 17px;\n  font-size: 17px;\n  line-height: 17px;\n}\n:is(.popup-filter-bar, .experience-toolbar, .assets-toolbar) .popup-view-fab span,\n:is(.popup-filter-bar, .experience-toolbar, .assets-toolbar) .profile-status-select-wrap .mat-mdc-select,\n:is(.popup-filter-bar, .experience-toolbar, .assets-toolbar) .profile-status-select-wrap .status-option-content span:last-child,\n:is(.popup-filter-bar, .experience-toolbar, .assets-toolbar) .profile-status-select-wrap .mat-mdc-select-value-text {\n  font-weight: 400 !important;\n}\n:host ::ng-deep .selector-options-panel .mat-mdc-option.status-option .status-option-content {\n  display: grid;\n  grid-template-columns: auto minmax(0, 1fr) auto;\n  align-items: center;\n  width: 100%;\n  min-width: 0;\n  column-gap: 0.34rem;\n}\n:host ::ng-deep .selector-options-panel .mat-mdc-option.status-option .rate-filter-count-badge {\n  margin-left: 0;\n  justify-self: end;\n}\n:host ::ng-deep .cdk-overlay-pane:has(.mat-mdc-select-panel.selector-options-panel),\n:host ::ng-deep .cdk-overlay-pane:has(.mat-mdc-select-panel.status-options-panel) {\n  min-width: var(--app-selector-panel-min-width, 184px) !important;\n}\n:host ::ng-deep .mat-mdc-select-panel.selector-options-panel,\n:host ::ng-deep .mat-mdc-select-panel.status-options-panel {\n  min-width: var(--app-selector-panel-min-width, 184px) !important;\n}\n@media (max-width: 760px) {\n  .popup-mobile-filter-panel .popup-filter-option,\n  .popup-mobile-filter-panel .activities-view-option,\n  .activities-mobile-filter-panel .popup-filter-option,\n  .activities-mobile-filter-panel .activities-view-option,\n  .activities-mobile-rate-filter-panel .popup-filter-option,\n  .activities-mobile-rate-filter-panel .activities-view-option {\n    width: 100%;\n    min-width: 0;\n    box-sizing: border-box;\n    border: 1px solid rgba(58, 81, 114, 0.24);\n    border-radius: 12px;\n    background: #f7f9fd;\n    min-height: 42px;\n    padding: 0.46rem 0.62rem;\n    justify-content: flex-start;\n    gap: 0.36rem;\n  }\n  .popup-mobile-filter-panel .popup-filter-option.active,\n  .popup-mobile-filter-panel .activities-view-option.active,\n  .activities-mobile-filter-panel .popup-filter-option.active,\n  .activities-mobile-filter-panel .activities-view-option.active,\n  .activities-mobile-rate-filter-panel .popup-filter-option.active,\n  .activities-mobile-rate-filter-panel .activities-view-option.active {\n    box-shadow: inset 0 0 0 1px rgba(24, 46, 76, 0.24);\n    filter: brightness(0.95);\n  }\n  .popup-mobile-filter-panel .popup-filter-option .rate-filter-count-badge,\n  .popup-mobile-filter-panel .activities-view-option .rate-filter-count-badge,\n  .activities-mobile-filter-panel .popup-filter-option .rate-filter-count-badge,\n  .activities-mobile-filter-panel .activities-view-option .rate-filter-count-badge,\n  .activities-mobile-rate-filter-panel .popup-filter-option .rate-filter-count-badge,\n  .activities-mobile-rate-filter-panel .activities-view-option .rate-filter-count-badge {\n    margin-left: auto;\n    flex: 0 0 auto;\n  }\n  :host ::ng-deep .cdk-overlay-pane:has(.mat-mdc-select-panel.profile-bottom-sheet-panel) {\n    position: fixed !important;\n    left: 0 !important;\n    right: 0 !important;\n    bottom: 0 !important;\n    top: auto !important;\n    width: 100vw !important;\n    max-width: 100vw !important;\n    transform: none !important;\n  }\n  :host ::ng-deep .mat-mdc-select-panel.profile-bottom-sheet-panel {\n    width: 100vw !important;\n    max-width: 100vw !important;\n    max-height: min(54vh, 420px) !important;\n    margin: 0 !important;\n    border-radius: 16px 16px 0 0 !important;\n    border: 1px solid #d6deea;\n    border-bottom: 0;\n    box-shadow: 0 -14px 28px rgba(15, 29, 52, 0.24);\n    padding-top: 0.38rem;\n    padding-bottom: max(0.55rem, env(safe-area-inset-bottom));\n  }\n}\n.popup-view-fab {\n  height: 34px;\n  border: 1px solid rgba(39, 62, 94, 0.22);\n  border-radius: 999px;\n  background: #f3f7ff;\n  color: #2c4c74;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.25rem;\n  padding: 0 0.62rem;\n  cursor: pointer;\n}\n.popup-view-fab .mat-icon {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n}\n.popup-view-fab span {\n  font-size: 0.74rem;\n  font-weight: 700;\n  white-space: nowrap;\n}\n.event-visibility-picker {\n  position: relative;\n  z-index: 22;\n  margin-left: auto;\n  flex: 0 0 auto;\n}\n.event-visibility-trigger {\n  flex-wrap: nowrap;\n}\n.profile-status-header-picker .event-visibility-trigger.status-public,\n.profile-status-header-picker .activities-view-option.status-public {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #e6f6ef);\n}\n.profile-status-header-picker .event-visibility-trigger.status-friends,\n.profile-status-header-picker .activities-view-option.status-friends {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #e8f1fd);\n}\n.profile-status-header-picker .event-visibility-trigger.status-host,\n.profile-status-header-picker .activities-view-option.status-host {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #f6efe2);\n}\n.profile-status-header-picker .event-visibility-trigger.status-inactive,\n.profile-status-header-picker .activities-view-option.status-inactive {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #f2f3f5);\n}\n.profile-status-header-picker .event-visibility-trigger .mat-icon.status-public,\n.profile-status-header-picker .activities-view-option.status-public .mat-icon {\n  color: #2f8f66;\n}\n.profile-status-header-picker .event-visibility-trigger .mat-icon.status-friends,\n.profile-status-header-picker .activities-view-option.status-friends .mat-icon {\n  color: #1b57a1;\n}\n.profile-status-header-picker .event-visibility-trigger .mat-icon.status-host,\n.profile-status-header-picker .activities-view-option.status-host .mat-icon {\n  color: #87580f;\n}\n.profile-status-header-picker .event-visibility-trigger .mat-icon.status-inactive,\n.profile-status-header-picker .activities-view-option.status-inactive .mat-icon {\n  color: #5b6573;\n}\n.app-popup textarea,\n.app-popup input,\n.app-popup select,\n.popup-surface textarea,\n.popup-surface input,\n.popup-surface select,\n.experience-form-popup textarea,\n.experience-form-popup input,\n.experience-form-popup select,\n.mobile-profile-selector-sheet-wrap input {\n  width: 100%;\n  border: 1px solid rgba(15, 27, 47, 0.16);\n  border-radius: 10px;\n  padding: 0.48rem 0.56rem;\n  font: inherit;\n  color: var(--text-main);\n  background: #fff;\n}\n.app-popup textarea,\n.popup-surface textarea,\n.experience-form-popup textarea {\n  resize: vertical;\n}\n.app-popup textarea:focus,\n.app-popup input:focus,\n.app-popup select:focus,\n.popup-surface textarea:focus,\n.popup-surface input:focus,\n.popup-surface select:focus,\n.experience-form-popup textarea:focus,\n.experience-form-popup input:focus,\n.experience-form-popup select:focus,\n.mobile-profile-selector-sheet-wrap input:focus {\n  outline: 0;\n  border-color: rgba(52, 103, 182, 0.72);\n  box-shadow: 0 0 0 3px rgba(55, 116, 212, 0.14);\n}\n.popup-surface-form-grid,\n.experience-form-grid {\n  display: grid;\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n  max-width: none;\n  width: 100%;\n  margin: 0;\n  justify-content: stretch;\n  align-content: start;\n  align-items: start;\n  column-gap: 1rem;\n  row-gap: 0.9rem;\n}\n.popup-surface-form-grid label,\n.experience-form-grid label {\n  display: grid;\n  grid-template-rows: min-content;\n  gap: 0;\n  font-weight: 600;\n  color: rgba(26, 44, 69, 0.88);\n}\n.popup-surface-form-grid input,\n.experience-form-grid input {\n  min-height: 40px;\n  padding: 0.56rem 0.72rem;\n  font-size: 0.88rem;\n  line-height: 1.25;\n  box-sizing: border-box;\n}\n.popup-surface-form-grid textarea,\n.experience-form-grid textarea {\n  min-height: 96px;\n  padding: 0.56rem 0.72rem;\n  font-size: 0.88rem;\n  line-height: 1.25;\n  box-sizing: border-box;\n}\n.popup-surface-form-grid .profile-status-select-wrap.selector-like,\n.experience-form-grid .profile-status-select-wrap.selector-like {\n  min-height: 40px;\n  height: 40px;\n  box-sizing: border-box;\n}\n.popup-surface-form-grid .mat-mdc-select-trigger,\n.experience-form-grid .mat-mdc-select-trigger {\n  min-height: 32px;\n}\n.popup-surface-description-field,\n.experience-description-field {\n  grid-column: 1/-1;\n}\n.popup-surface-actions,\n.experience-form-actions {\n  justify-content: center;\n  padding-top: 0.2rem;\n}\n.popup-actions {\n  display: flex;\n  gap: 0.45rem;\n  flex-wrap: wrap;\n}\n.link-btn {\n  border: 1px solid var(--line-strong);\n  border-radius: 999px;\n  background: #fff;\n  color: #1f3350;\n  font: inherit;\n  font-size: 0.83rem;\n  padding: 0.38rem 0.76rem;\n  cursor: pointer;\n}\n.neutral-btn {\n  background: #f2f4fa;\n  border-color: rgba(23, 33, 54, 0.12);\n}\n.primary-btn {\n  background: #4776b7;\n  border-color: #4776b7;\n  color: #fff;\n}\n.profile-status-select-wrap .mat-icon,\n.date-picker-btn .mat-icon {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n  line-height: 16px;\n  color: #566b86;\n}\n.profile-status-select-wrap .mat-mdc-select {\n  min-width: 80px;\n  width: 100%;\n  font-size: 0.8rem;\n  font-weight: 700;\n  text-transform: lowercase;\n}\n.profile-status-select-wrap .mat-mdc-select-trigger {\n  width: 100%;\n  justify-content: flex-start;\n}\n.profile-status-select-wrap .mat-mdc-select-arrow-wrapper {\n  margin-left: auto;\n}\n.status-public {\n  color: #2f8f66;\n}\n.status-friends {\n  color: #1b57a1;\n}\n.status-host {\n  color: #87580f;\n}\n.status-inactive {\n  color: #5b6573;\n}\n.status-option-content .status-public {\n  color: #2f8f66;\n}\n.status-option-content .status-friends {\n  color: #1b57a1;\n}\n.status-option-content .status-host {\n  color: #87580f;\n}\n.status-option-content .status-inactive {\n  color: #5b6573;\n}\n.profile-status-select-wrap.status-public .status-option-content .mat-icon {\n  color: #2f8f66;\n}\n.profile-status-select-wrap.status-friends .status-option-content .mat-icon {\n  color: #1b57a1;\n}\n.profile-status-select-wrap.status-host .status-option-content .mat-icon {\n  color: #87580f;\n}\n.profile-status-select-wrap.status-inactive .status-option-content .mat-icon {\n  color: #5b6573;\n}\n.profile-details-values-btn .mat-icon {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n  line-height: 16px;\n  color: rgba(44, 67, 100, 0.72);\n}\n.profile-details-values-btn {\n  min-height: 36px;\n  height: 36px;\n  box-sizing: border-box;\n  padding-top: 0;\n  padding-bottom: 0;\n}\n.profile-details-values-btn .status-option-content.profile-details-selected-badges {\n  display: inline-grid;\n  grid-template-columns: minmax(0, 1fr) auto;\n  align-items: center;\n  column-gap: 0.26rem;\n  min-width: 0;\n  width: 100%;\n}\n.profile-details-values-btn.profile-details-values-tone-values .profile-details-inline-chip {\n  max-width: calc(100% - 2.6rem);\n}\n.profile-details-values-btn.profile-details-values-tone-interest .profile-details-inline-chip {\n  max-width: calc((100% - 3.2rem) / 2);\n}\n.profile-details-values-btn.profile-details-values-tone-values .profile-details-inline-overflow {\n  color: #1e6b5a;\n}\n.profile-details-values-btn.profile-details-values-tone-interest .profile-details-inline-overflow {\n  color: #2e5a90;\n}\n.values-header-chips {\n  display: flex;\n  align-items: center;\n  flex-wrap: wrap;\n  gap: 0.28rem;\n  flex: 0 0 100%;\n  margin-left: 0;\n  margin-top: 0.34rem;\n  max-width: 100%;\n  overflow: visible;\n  white-space: normal;\n  padding-bottom: 0;\n}\n.popup-title-values {\n  margin-right: 0.38rem;\n}\n.values-selected-chip {\n  border: 1px solid rgba(76, 99, 136, 0.3);\n  background:\n    linear-gradient(\n      180deg,\n      #f7f9ff 0%,\n      #eef3ff 100%);\n  color: #24416a;\n  border-radius: 999px;\n  min-height: 26px;\n  padding: 0.18rem 0.46rem;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.26rem;\n  font-size: 0.7rem;\n  font-weight: 700;\n  cursor: pointer;\n  flex: 0 0 auto;\n}\n.values-selected-chip .mat-icon {\n  width: 12px;\n  height: 12px;\n  font-size: 12px;\n  line-height: 12px;\n}\n.values-selected-chip.section-family {\n  background:\n    linear-gradient(\n      180deg,\n      #fff1ea 0%,\n      #ffe6dd 100%);\n  border-color: rgba(160, 90, 51, 0.32);\n  color: #8b4d2b;\n}\n.values-selected-chip.section-ambition {\n  background:\n    linear-gradient(\n      180deg,\n      #fff7e8 0%,\n      #ffefd7 100%);\n  border-color: rgba(160, 106, 20, 0.32);\n  color: #9a6614;\n}\n.values-selected-chip.section-lifestyle {\n  background:\n    linear-gradient(\n      180deg,\n      #eaf8f5 0%,\n      #e0f2ee 100%);\n  border-color: rgba(45, 125, 120, 0.32);\n  color: #2a6e6a;\n}\n.values-selected-chip.section-beliefs {\n  background:\n    linear-gradient(\n      180deg,\n      #f0ecff 0%,\n      #e8e1fa 100%);\n  border-color: rgba(95, 78, 160, 0.32);\n  color: #564793;\n}\n.values-selected-chip.section-social {\n  background:\n    linear-gradient(\n      180deg,\n      #ecf4ff 0%,\n      #e1ecfb 100%);\n  border-color: rgba(45, 94, 168, 0.32);\n  color: #2d5ea8;\n}\n.values-selected-chip.section-arts {\n  background:\n    linear-gradient(\n      180deg,\n      #f2edfb 0%,\n      #e9e2f9 100%);\n  border-color: rgba(103, 76, 164, 0.32);\n  color: #654ca1;\n}\n.values-selected-chip.section-food {\n  background:\n    linear-gradient(\n      180deg,\n      #fff4e8 0%,\n      #fee9d6 100%);\n  border-color: rgba(170, 97, 28, 0.32);\n  color: #9d611c;\n}\n.values-selected-chip.section-active {\n  background:\n    linear-gradient(\n      180deg,\n      #edf8ee 0%,\n      #e2f1e4 100%);\n  border-color: rgba(44, 126, 72, 0.32);\n  color: #2d7d47;\n}\n.values-selected-chip.section-mind {\n  background:\n    linear-gradient(\n      180deg,\n      #eaf8f6 0%,\n      #def1ee 100%);\n  border-color: rgba(37, 124, 118, 0.32);\n  color: #2d7d78;\n}\n.values-selected-chip.section-identity {\n  background:\n    linear-gradient(\n      180deg,\n      #f4f0ff 0%,\n      #e9e3fb 100%);\n  border-color: rgba(88, 78, 159, 0.32);\n  color: #5a4ea0;\n}\n.readonly-select {\n  width: fit-content;\n  min-width: 0;\n  max-width: 130px;\n  justify-content: center;\n  margin-top: 2px;\n  padding-left: 0.44rem;\n  padding-right: 0.44rem;\n}\n.readonly-field {\n  min-height: 34px;\n  border: 1px solid rgba(15, 27, 47, 0.16);\n  border-radius: 10px;\n  padding: 0.4rem 0.56rem;\n  background: #f7fafe;\n  color: #23476f;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.26rem;\n  font-weight: 700;\n}\n.readonly-field .mat-icon {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n  line-height: 16px;\n}\n.zodiac-symbol {\n  font-size: 1.1rem;\n  font-weight: 800;\n  line-height: 1;\n}\n.zodiac-label {\n  font-size: 0.9rem;\n  font-weight: 700;\n  min-width: 0;\n  text-align: center;\n}\n.readonly-select.zodiac-aries {\n  background: #fdf1f1;\n  color: #9f2f2f;\n}\n.readonly-select.zodiac-taurus {\n  background: #f7f3eb;\n  color: #6e4b2b;\n}\n.readonly-select.zodiac-gemini {\n  background: #fdf8e9;\n  color: #7d5a12;\n}\n.readonly-select.zodiac-cancer {\n  background: #eef4ff;\n  color: #2d5b8e;\n}\n.readonly-select.zodiac-leo {\n  background: #fff3e8;\n  color: #8f4b0d;\n}\n.readonly-select.zodiac-virgo {\n  background: #edf8ef;\n  color: #2b6b3d;\n}\n.readonly-select.zodiac-libra {\n  background: #f2eefc;\n  color: #60439d;\n}\n.readonly-select.zodiac-scorpio {\n  background: #f9edf2;\n  color: #7b3150;\n}\n.readonly-select.zodiac-sagittarius {\n  background: #eef1ff;\n  color: #2f4a9a;\n}\n.readonly-select.zodiac-capricorn {\n  background: #eff2f5;\n  color: #364653;\n}\n.readonly-select.zodiac-aquarius {\n  background: #ebf7fb;\n  color: #1d5f7a;\n}\n.readonly-select.zodiac-pisces {\n  background: #eef2ff;\n  color: #294b8f;\n}\n.physique-slim {\n  color: #3f7ab3;\n}\n.physique-lean {\n  color: #3f8f5f;\n}\n.physique-athletic {\n  color: #2f7e4d;\n}\n.physique-fit {\n  color: #465fbb;\n}\n.physique-curvy {\n  color: #a14875;\n}\n.physique-muscular {\n  color: #7d4f24;\n}\n.physique-average {\n  color: #4d667f;\n}\n.physique-select-wrap.physique-slim {\n  background:\n    linear-gradient(\n      180deg,\n      #eaf3fb 0%,\n      #dfebf8 100%);\n  border-color: rgba(63, 122, 179, 0.34);\n}\n.physique-select-wrap.physique-lean {\n  background:\n    linear-gradient(\n      180deg,\n      #eaf6ee 0%,\n      #def0e5 100%);\n  border-color: rgba(63, 143, 95, 0.34);\n}\n.physique-select-wrap.physique-athletic {\n  background:\n    linear-gradient(\n      180deg,\n      #e8f5ec 0%,\n      #dff0e6 100%);\n  border-color: rgba(47, 126, 77, 0.34);\n}\n.physique-select-wrap.physique-fit {\n  background:\n    linear-gradient(\n      180deg,\n      #ebf0ff 0%,\n      #e1e8fc 100%);\n  border-color: rgba(70, 95, 187, 0.34);\n}\n.physique-select-wrap.physique-curvy {\n  background:\n    linear-gradient(\n      180deg,\n      #f7edf3 0%,\n      #f0e3ec 100%);\n  border-color: rgba(161, 72, 117, 0.36);\n}\n.physique-select-wrap.physique-muscular {\n  background:\n    linear-gradient(\n      180deg,\n      #f6efe9 0%,\n      #ede3d8 100%);\n  border-color: rgba(125, 79, 36, 0.36);\n}\n.physique-select-wrap.physique-average {\n  background:\n    linear-gradient(\n      180deg,\n      #eef2f6 0%,\n      #e5ebf1 100%);\n  border-color: rgba(77, 102, 127, 0.34);\n}\n.physique-select-wrap.physique-slim .status-option-content .mat-icon {\n  color: #3f7ab3;\n}\n.physique-select-wrap.physique-lean .status-option-content .mat-icon {\n  color: #3f8f5f;\n}\n.physique-select-wrap.physique-athletic .status-option-content .mat-icon {\n  color: #2f7e4d;\n}\n.physique-select-wrap.physique-fit .status-option-content .mat-icon {\n  color: #465fbb;\n}\n.physique-select-wrap.physique-curvy .status-option-content .mat-icon {\n  color: #a14875;\n}\n.physique-select-wrap.physique-muscular .status-option-content .mat-icon {\n  color: #7d4f24;\n}\n.physique-select-wrap.physique-average .status-option-content .mat-icon {\n  color: #4d667f;\n}\n.experience-filter-all {\n  color: #694ea6;\n}\n.experience-filter-workspace {\n  color: #a1485a;\n}\n.experience-filter-school {\n  color: #2d5ea8;\n}\n.experience-filter-online {\n  color: #2d7d47;\n}\n.experience-filter-project {\n  color: #6550a0;\n}\n.experience-filter-select.experience-filter-all,\n.experience-type-select.experience-filter-project {\n  background:\n    linear-gradient(\n      180deg,\n      #efe8ff 0%,\n      #e8defc 100%);\n  border-color: rgba(103, 76, 164, 0.32);\n}\n.experience-filter-select.experience-filter-workspace,\n.experience-type-select.experience-filter-workspace {\n  background:\n    linear-gradient(\n      180deg,\n      #fff1f3 0%,\n      #ffe6ea 100%);\n  border-color: rgba(169, 72, 90, 0.32);\n}\n.experience-filter-select.experience-filter-school,\n.experience-type-select.experience-filter-school {\n  background:\n    linear-gradient(\n      180deg,\n      #eaf4ff 0%,\n      #e1ecfb 100%);\n  border-color: rgba(45, 94, 168, 0.32);\n}\n.experience-type-select.experience-filter-online {\n  background:\n    linear-gradient(\n      180deg,\n      #edf8ee 0%,\n      #e2f1e4 100%);\n  border-color: rgba(44, 126, 72, 0.32);\n}\n.experience-type-select.experience-filter-project {\n  background:\n    linear-gradient(\n      180deg,\n      #f4f0ff 0%,\n      #e9e3fb 100%);\n}\n.experience-type-select {\n  min-width: 0;\n  max-width: 100%;\n  min-height: 40px;\n}\n.experience-type-field,\n.experience-title-field,\n.experience-city-field {\n  width: 100%;\n  justify-self: stretch;\n}\n.experience-org-field {\n  width: 100%;\n  justify-self: stretch;\n}\n.experience-type-select {\n  width: 100%;\n}\n.experience-date-range-field {\n  width: 100%;\n  max-width: none;\n  margin: 0;\n  background: transparent;\n}\n.experience-date-range-label {\n  grid-column: 1/2;\n  width: 100%;\n  justify-self: stretch;\n}\n.experience-date-range-field .mat-mdc-text-field-wrapper {\n  min-height: 42px;\n  border-radius: 10px;\n  background: #fff;\n  border: 1px solid rgba(136, 156, 186, 0.5);\n  box-shadow: none;\n}\n.experience-date-range-field .mat-mdc-form-field-subscript-wrapper {\n  margin-top: 0.24rem;\n}\n.experience-date-range-field input {\n  border: 0 !important;\n  box-shadow: none !important;\n  border-radius: 0 !important;\n  background: transparent !important;\n  min-width: 0;\n  width: 100%;\n  padding: 0 !important;\n  min-height: 0 !important;\n  height: auto !important;\n  line-height: 1.25;\n}\n.experience-date-range-field .mat-datepicker-toggle {\n  margin-right: 0.2rem;\n}\n.experience-date-range-field .mat-mdc-form-field-hint-wrapper,\n.experience-date-range-field .mat-mdc-form-field-hint {\n  color: rgba(30, 49, 74, 0.65);\n  font-size: 0.72rem;\n}\n.experience-date-range-field .mat-date-range-input-container {\n  width: 100%;\n  display: grid;\n  grid-template-columns: minmax(96px, 1fr) auto minmax(96px, 1fr);\n  align-items: center;\n  column-gap: 0.34rem;\n  min-width: 0;\n}\n.experience-date-range-field .mat-date-range-input-separator {\n  margin: 0 0.28rem;\n  flex: 0 0 auto;\n  white-space: nowrap;\n}\n.experience-date-range-field .mat-date-range-input-start-wrapper,\n.experience-date-range-field .mat-date-range-input-end-wrapper {\n  width: 100%;\n  max-width: 100%;\n  overflow: visible;\n  min-width: 0;\n}\n.experience-date-range-field .mat-date-range-input-inner {\n  font-size: 0.96rem;\n  min-width: 0 !important;\n  width: 100% !important;\n  text-overflow: clip;\n  white-space: nowrap;\n  line-height: 1.25;\n}\n.experience-date-range-field .mat-mdc-form-field-flex {\n  min-width: 0;\n  border-bottom: 0 !important;\n  box-shadow: none !important;\n  align-items: center !important;\n}\n.experience-date-range-field .mat-mdc-form-field-infix {\n  padding-top: 0 !important;\n  padding-bottom: 0 !important;\n  min-height: 34px !important;\n  height: 34px;\n  display: flex;\n  align-items: center;\n}\n.experience-date-range-field .mdc-line-ripple,\n.experience-date-range-field .mat-mdc-form-field-line-ripple,\n.experience-date-range-field .mdc-line-ripple--deactivating,\n.experience-date-range-field .mdc-line-ripple--active {\n  display: none !important;\n  opacity: 0 !important;\n  transform: scaleX(0) !important;\n}\n:host ::ng-deep .mat-mdc-option.status-option.experience-filter-all {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #efe8ff);\n}\n:host ::ng-deep .mat-mdc-option.status-option.experience-filter-workspace {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #fff1f3);\n}\n:host ::ng-deep .mat-mdc-option.status-option.experience-filter-school {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #eaf4ff);\n}\n:host ::ng-deep .mat-mdc-option.status-option.experience-filter-online {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #edf8ee);\n}\n:host ::ng-deep .mat-mdc-option.status-option.experience-filter-project {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #f4f0ff);\n}\n.mobile-profile-language-chip.language-tone-1,\n.mobile-profile-selector-option.language-tone-1,\n:host ::ng-deep .mat-mdc-option.language-tone-1 {\n  background: #eaf4ff;\n  border-color: rgba(63, 122, 179, 0.34);\n  color: #2f6090;\n}\n.mobile-profile-language-chip.language-tone-2,\n.mobile-profile-selector-option.language-tone-2,\n:host ::ng-deep .mat-mdc-option.language-tone-2 {\n  background: #edf8f4;\n  border-color: rgba(75, 127, 113, 0.34);\n  color: #2f695b;\n}\n.mobile-profile-language-chip.language-tone-3,\n.mobile-profile-selector-option.language-tone-3,\n:host ::ng-deep .mat-mdc-option.language-tone-3 {\n  background: #f1f2ff;\n  border-color: rgba(70, 95, 187, 0.34);\n  color: #394f9c;\n}\n.mobile-profile-language-chip.language-tone-4,\n.mobile-profile-selector-option.language-tone-4,\n:host ::ng-deep .mat-mdc-option.language-tone-4 {\n  background: #fff2f8;\n  border-color: rgba(161, 72, 117, 0.34);\n  color: #8d3f66;\n}\n.mobile-profile-language-chip.language-tone-5,\n.mobile-profile-selector-option.language-tone-5,\n:host ::ng-deep .mat-mdc-option.language-tone-5 {\n  background: #fbf4ea;\n  border-color: rgba(125, 79, 36, 0.34);\n  color: #704822;\n}\n.mobile-profile-language-chip.language-tone-6,\n.mobile-profile-selector-option.language-tone-6,\n:host ::ng-deep .mat-mdc-option.language-tone-6 {\n  background: #eff4f9;\n  border-color: rgba(77, 102, 127, 0.34);\n  color: #415872;\n}\n.mobile-profile-language-chip.language-tone-7,\n.mobile-profile-selector-option.language-tone-7,\n:host ::ng-deep .mat-mdc-option.language-tone-7 {\n  background: #f7f5ea;\n  border-color: rgba(128, 109, 66, 0.34);\n  color: #746237;\n}\n.mobile-profile-language-chip.language-tone-8,\n.mobile-profile-selector-option.language-tone-8,\n:host ::ng-deep .mat-mdc-option.language-tone-8 {\n  background: #edf5ff;\n  border-color: rgba(45, 122, 160, 0.34);\n  color: #2f6782;\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-1 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #eaf2ff);\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-2 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #ebf7ef);\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-3 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #fff1e3);\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-4 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #efecfc);\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-5 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #f3f8e9);\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-6 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #fceef3);\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-7 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #edf7ff);\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-8 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #f6f2e9);\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-1 .status-option-content {\n  color: #2d63a9;\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-2 .status-option-content {\n  color: #2a7a49;\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-3 .status-option-content {\n  color: #9b6018;\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-4 .status-option-content {\n  color: #6153a2;\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-5 .status-option-content {\n  color: #61812a;\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-6 .status-option-content {\n  color: #9f446d;\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-7 .status-option-content {\n  color: #2e7898;\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-8 .status-option-content {\n  color: #806c3f;\n}\n.mobile-profile-selector-option.detail-tone-1 {\n  background:\n    linear-gradient(\n      180deg,\n      #eef5ff 0%,\n      #e3eefc 100%);\n  border-color: rgba(46, 102, 181, 0.32);\n}\n.mobile-profile-selector-option.detail-tone-2 {\n  background:\n    linear-gradient(\n      180deg,\n      #eef9f3 0%,\n      #e3f4ea 100%);\n  border-color: rgba(40, 125, 72, 0.32);\n}\n.mobile-profile-selector-option.detail-tone-3 {\n  background:\n    linear-gradient(\n      180deg,\n      #fff4ea 0%,\n      #ffecdd 100%);\n  border-color: rgba(165, 94, 24, 0.32);\n}\n.mobile-profile-selector-option.detail-tone-4 {\n  background:\n    linear-gradient(\n      180deg,\n      #f2f1ff 0%,\n      #e8e5fb 100%);\n  border-color: rgba(97, 82, 164, 0.32);\n}\n.mobile-profile-selector-option.detail-tone-5 {\n  background:\n    linear-gradient(\n      180deg,\n      #f6f9ef 0%,\n      #edf3e1 100%);\n  border-color: rgba(95, 128, 36, 0.32);\n}\n.mobile-profile-selector-option.detail-tone-6 {\n  background:\n    linear-gradient(\n      180deg,\n      #fff1f4 0%,\n      #f9e6ed 100%);\n  border-color: rgba(160, 70, 111, 0.32);\n}\n.mobile-profile-selector-option.detail-tone-7 {\n  background:\n    linear-gradient(\n      180deg,\n      #edf8ff 0%,\n      #e2f0fb 100%);\n  border-color: rgba(45, 122, 160, 0.32);\n}\n.mobile-profile-selector-option.detail-tone-8 {\n  background:\n    linear-gradient(\n      180deg,\n      #f6f3ea 0%,\n      #eee9dc 100%);\n  border-color: rgba(128, 109, 66, 0.32);\n}\n.mobile-profile-selector-option.status-public {\n  background:\n    linear-gradient(\n      180deg,\n      #e6f6ef 0%,\n      #d9f0e6 100%);\n  border-color: rgba(47, 143, 102, 0.34);\n}\n.mobile-profile-selector-option.status-friends {\n  background:\n    linear-gradient(\n      180deg,\n      #e8f1fd 0%,\n      #dfeaf9 100%);\n  border-color: rgba(27, 87, 161, 0.34);\n}\n.mobile-profile-selector-option.status-host {\n  background:\n    linear-gradient(\n      180deg,\n      #f6efe2 0%,\n      #eee4d2 100%);\n  border-color: rgba(135, 88, 15, 0.36);\n}\n.mobile-profile-selector-option.status-inactive {\n  background:\n    linear-gradient(\n      180deg,\n      #f2f3f5 0%,\n      #e8ebef 100%);\n  border-color: rgba(91, 101, 115, 0.32);\n}\n.mobile-profile-selector-option.physique-slim {\n  background: #eaf4ff;\n  border-color: rgba(63, 122, 179, 0.34);\n}\n.mobile-profile-selector-option.physique-lean {\n  background: #edf8f4;\n  border-color: rgba(75, 127, 113, 0.34);\n}\n.mobile-profile-selector-option.physique-athletic {\n  background: #e8f5ec;\n  border-color: rgba(47, 126, 77, 0.34);\n}\n.mobile-profile-selector-option.physique-fit {\n  background: #f1f2ff;\n  border-color: rgba(70, 95, 187, 0.34);\n}\n.mobile-profile-selector-option.physique-curvy {\n  background: #fff2f8;\n  border-color: rgba(161, 72, 117, 0.34);\n}\n.mobile-profile-selector-option.physique-muscular {\n  background: #fbf4ea;\n  border-color: rgba(125, 79, 36, 0.34);\n}\n.mobile-profile-selector-option.physique-average {\n  background: #eff4f9;\n  border-color: rgba(77, 102, 127, 0.34);\n}\n.popup-panel-profile-selector .values-selector-popup.profile-selector-popup {\n  gap: 0.56rem;\n}\n.popup-panel-profile-selector .profile-filter-selector-head {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.44rem;\n  padding-bottom: 0.22rem;\n  border-bottom: 1px solid rgba(74, 102, 139, 0.22);\n}\n.popup-panel-profile-selector .profile-filter-selector-head-label {\n  color: #203c64;\n  font-size: 0.82rem;\n  font-weight: 800;\n  line-height: 1.2;\n}\n.popup-panel-profile-selector .profile-filter-selector-clear {\n  border: 1px solid rgba(41, 73, 110, 0.24);\n  border-radius: 999px;\n  background: rgba(255, 255, 255, 0.82);\n  color: #284970;\n  font: inherit;\n  font-size: 0.72rem;\n  font-weight: 700;\n  line-height: 1;\n  padding: 0.3rem 0.52rem;\n  cursor: pointer;\n}\n.popup-panel-profile-selector .profile-filter-selector-clear.is-hidden {\n  visibility: hidden;\n  pointer-events: none;\n}\n.popup-panel-profile-selector .profile-filter-selector-selected {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 0.34rem;\n}\n.popup-panel-profile-selector .profile-filter-selector-chip {\n  border: 1px solid rgba(35, 68, 107, 0.24);\n  border-radius: 999px;\n  background: rgba(255, 255, 255, 0.92);\n  color: #234368;\n  font: inherit;\n  font-size: 0.72rem;\n  font-weight: 700;\n  line-height: 1;\n  padding: 0.26rem 0.48rem;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.16rem;\n  cursor: pointer;\n}\n.popup-panel-profile-selector .profile-filter-selector-chip .mat-icon {\n  width: 13px;\n  height: 13px;\n  font-size: 13px;\n  line-height: 13px;\n}\n.popup-panel-profile-selector .profile-filter-selector-empty {\n  margin: 0;\n  font-size: 0.74rem;\n  color: rgba(31, 54, 86, 0.62);\n  font-style: italic;\n}\n.popup-panel-profile-selector .profile-selector-option-group {\n  display: grid;\n  gap: 0.34rem;\n  border: 1px solid transparent;\n  border-radius: 12px;\n  padding: 0.4rem 0.42rem;\n}\n.popup-panel-profile-selector .profile-selector-option-group-head {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.34rem;\n}\n.popup-panel-profile-selector .profile-selector-option-group-tag {\n  border-radius: 999px;\n  border: 1px solid rgba(52, 86, 128, 0.28);\n  background: rgba(255, 255, 255, 0.74);\n  color: #2f527d;\n  font-size: 0.67rem;\n  font-weight: 800;\n  letter-spacing: 0.02em;\n  line-height: 1;\n  padding: 0.2rem 0.52rem;\n  text-transform: uppercase;\n  white-space: nowrap;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.24rem;\n}\n.popup-panel-profile-selector .profile-selector-option-group-tag-icon {\n  width: 12px;\n  height: 12px;\n  font-size: 12px;\n  line-height: 12px;\n}\n.popup-panel-profile-selector .profile-selector-option-group-line {\n  display: block;\n  width: 100%;\n  height: 1px;\n  background: rgba(84, 111, 147, 0.34);\n}\n.popup-panel-profile-selector .profile-selector-chip-grid {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 0.36rem;\n}\n.popup-panel-profile-selector .profile-selector-chip {\n  border: 1px solid rgba(41, 70, 106, 0.22);\n  border-radius: 999px;\n  background: #f4f8ff;\n  color: #234066;\n  font: inherit;\n  font-size: 0.78rem;\n  font-weight: 700;\n  padding: 0.3rem 0.58rem;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.26rem;\n  cursor: pointer;\n  transition:\n    background-color 0.14s ease,\n    border-color 0.14s ease,\n    color 0.14s ease,\n    box-shadow 0.14s ease;\n}\n.popup-panel-profile-selector .profile-selector-chip.active {\n  border-color: rgba(27, 85, 158, 0.5);\n  background:\n    linear-gradient(\n      180deg,\n      #dcebff 0%,\n      #cfe3ff 100%);\n  color: #123e70;\n  box-shadow: inset 0 0 0 1px rgba(30, 73, 127, 0.24), 0 1px 2px rgba(24, 53, 86, 0.16);\n}\n.popup-panel-profile-selector .profile-selector-option-group.section-family {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 232, 219, 0.52) 0%,\n      rgba(255, 232, 219, 0.3) 100%);\n}\n.popup-panel-profile-selector .profile-selector-option-group.section-ambition {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 242, 216, 0.52) 0%,\n      rgba(255, 242, 216, 0.3) 100%);\n}\n.popup-panel-profile-selector .profile-selector-option-group.section-lifestyle {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(221, 241, 239, 0.56) 0%,\n      rgba(221, 241, 239, 0.32) 100%);\n}\n.popup-panel-profile-selector .profile-selector-option-group.section-beliefs {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(230, 226, 250, 0.56) 0%,\n      rgba(230, 226, 250, 0.32) 100%);\n}\n.popup-panel-profile-selector .profile-selector-option-group.section-social {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(223, 236, 255, 0.5) 0%,\n      rgba(223, 236, 255, 0.28) 100%);\n}\n.popup-panel-profile-selector .profile-selector-option-group.section-arts {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(235, 227, 255, 0.5) 0%,\n      rgba(235, 227, 255, 0.28) 100%);\n}\n.popup-panel-profile-selector .profile-selector-option-group.section-food {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 236, 221, 0.52) 0%,\n      rgba(255, 236, 221, 0.3) 100%);\n}\n.popup-panel-profile-selector .profile-selector-option-group.section-active {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(222, 243, 231, 0.56) 0%,\n      rgba(222, 243, 231, 0.32) 100%);\n}\n.popup-panel-profile-selector .profile-selector-option-group.section-mind {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(219, 242, 238, 0.56) 0%,\n      rgba(219, 242, 238, 0.32) 100%);\n}\n.popup-panel-profile-selector .profile-selector-option-group.section-identity {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(230, 226, 250, 0.56) 0%,\n      rgba(230, 226, 250, 0.32) 100%);\n}\n.popup-panel-profile-selector .profile-selector-option-group-tag.section-family {\n  border-color: rgba(156, 94, 51, 0.34);\n  color: #9c5e33;\n}\n.popup-panel-profile-selector .profile-selector-option-group-tag.section-ambition {\n  border-color: rgba(160, 106, 20, 0.34);\n  color: #9b6717;\n}\n.popup-panel-profile-selector .profile-selector-option-group-tag.section-lifestyle {\n  border-color: rgba(47, 123, 119, 0.34);\n  color: #2f7b77;\n}\n.popup-panel-profile-selector .profile-selector-option-group-tag.section-beliefs {\n  border-color: rgba(95, 78, 160, 0.34);\n  color: #5f4ea0;\n}\n.popup-panel-profile-selector .profile-selector-option-group-tag.section-social {\n  border-color: rgba(47, 106, 175, 0.36);\n  color: #2f6aaf;\n}\n.popup-panel-profile-selector .profile-selector-option-group-tag.section-arts {\n  border-color: rgba(106, 87, 168, 0.36);\n  color: #6a57a8;\n}\n.popup-panel-profile-selector .profile-selector-option-group-tag.section-food {\n  border-color: rgba(170, 97, 28, 0.34);\n  color: #a55e18;\n}\n.popup-panel-profile-selector .profile-selector-option-group-tag.section-active {\n  border-color: rgba(49, 124, 82, 0.36);\n  color: #317c52;\n}\n.popup-panel-profile-selector .profile-selector-option-group-tag.section-mind {\n  border-color: rgba(37, 124, 118, 0.34);\n  color: #2b7c76;\n}\n.popup-panel-profile-selector .profile-selector-option-group-tag.section-identity {\n  border-color: rgba(98, 84, 163, 0.34);\n  color: #6254a3;\n}\n.popup-panel-profile-selector .profile-selector-option-group-line.section-family {\n  background: rgba(156, 94, 51, 0.3);\n}\n.popup-panel-profile-selector .profile-selector-option-group-line.section-ambition {\n  background: rgba(160, 106, 20, 0.32);\n}\n.popup-panel-profile-selector .profile-selector-option-group-line.section-lifestyle {\n  background: rgba(47, 123, 119, 0.3);\n}\n.popup-panel-profile-selector .profile-selector-option-group-line.section-beliefs {\n  background: rgba(95, 78, 160, 0.3);\n}\n.popup-panel-profile-selector .profile-selector-option-group-line.section-social {\n  background: rgba(47, 106, 175, 0.34);\n}\n.popup-panel-profile-selector .profile-selector-option-group-line.section-arts {\n  background: rgba(106, 87, 168, 0.34);\n}\n.popup-panel-profile-selector .profile-selector-option-group-line.section-food {\n  background: rgba(170, 97, 28, 0.32);\n}\n.popup-panel-profile-selector .profile-selector-option-group-line.section-active {\n  background: rgba(49, 124, 82, 0.34);\n}\n.popup-panel-profile-selector .profile-selector-option-group-line.section-mind {\n  background: rgba(37, 124, 118, 0.34);\n}\n.popup-panel-profile-selector .profile-selector-option-group-line.section-identity {\n  background: rgba(98, 84, 163, 0.3);\n}\n:host ::ng-deep .mat-mdc-option.mdc-list-item--selected:not(.mdc-list-item--disabled):not(.status-option) {\n  background: #f0f5fc;\n}\n:host ::ng-deep .mat-mdc-option.status-option.mdc-list-item--selected:not(.mdc-list-item--disabled) {\n  filter: brightness(0.95);\n  box-shadow: inset 0 0 0 1px rgba(24, 46, 76, 0.2);\n}\n:host ::ng-deep .mat-mdc-option.status-option {\n  background: #fff;\n}\n:host ::ng-deep .mat-mdc-option.status-option:not(:last-child) {\n  border-bottom: 1px solid #e6edf7;\n}\n:host ::ng-deep .selector-options-panel .mat-mdc-option.hide-selected-option,\n:host ::ng-deep .status-options-panel .mat-mdc-option.hide-selected-option {\n  min-height: 0 !important;\n  height: 0 !important;\n  padding-top: 0 !important;\n  padding-bottom: 0 !important;\n  border: 0 !important;\n  margin: 0 !important;\n  opacity: 0 !important;\n  pointer-events: none !important;\n  overflow: hidden !important;\n}\n:host ::ng-deep .selector-options-panel .mat-mdc-option {\n  background: #fff;\n}\n:host ::ng-deep .mat-mdc-select-panel.selector-options-panel,\n:host ::ng-deep .mat-mdc-select-panel.status-options-panel {\n  margin-top: 8px !important;\n  margin-bottom: 8px !important;\n}\n:host ::ng-deep .mat-mdc-select-panel.selector-options-panel.mat-mdc-select-panel-above,\n:host ::ng-deep .mat-mdc-select-panel.status-options-panel.mat-mdc-select-panel-above,\n:host ::ng-deep .cdk-overlay-pane .mat-mdc-select-panel.selector-options-panel.mat-mdc-select-panel-above,\n:host ::ng-deep .cdk-overlay-pane .mat-mdc-select-panel.status-options-panel.mat-mdc-select-panel-above {\n  margin-top: 0 !important;\n  margin-bottom: 18px !important;\n  transform: translateY(-10px) !important;\n}\n:host ::ng-deep .selector-options-panel .mat-mdc-option.status-option.status-public,\n:host ::ng-deep .status-options-panel .mat-mdc-option.status-option.status-public {\n  --mdc-list-list-item-container-color: #def3e9;\n  --mat-mdc-option-selected-container-color: #def3e9;\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #def3e9) !important;\n}\n:host ::ng-deep .selector-options-panel .mat-mdc-option.status-option.status-friends,\n:host ::ng-deep .status-options-panel .mat-mdc-option.status-option.status-friends {\n  --mdc-list-list-item-container-color: #e3eefb;\n  --mat-mdc-option-selected-container-color: #e3eefb;\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #e3eefb) !important;\n}\n:host ::ng-deep .selector-options-panel .mat-mdc-option.status-option.status-host,\n:host ::ng-deep .status-options-panel .mat-mdc-option.status-option.status-host {\n  --mdc-list-list-item-container-color: #f3ead8;\n  --mat-mdc-option-selected-container-color: #f3ead8;\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #f3ead8) !important;\n}\n:host ::ng-deep .selector-options-panel .mat-mdc-option.status-option.status-inactive,\n:host ::ng-deep .status-options-panel .mat-mdc-option.status-option.status-inactive {\n  --mdc-list-list-item-container-color: #eceff3;\n  --mat-mdc-option-selected-container-color: #eceff3;\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #eceff3) !important;\n}\n:host ::ng-deep .selector-options-panel .mat-mdc-option.status-option.status-public .status-option-content,\n:host ::ng-deep .selector-options-panel .mat-mdc-option.status-option.status-public .status-option-content .mat-icon,\n:host ::ng-deep .status-options-panel .mat-mdc-option.status-option.status-public .status-option-content,\n:host ::ng-deep .status-options-panel .mat-mdc-option.status-option.status-public .status-option-content .mat-icon {\n  color: #2f8f66 !important;\n}\n:host ::ng-deep .selector-options-panel .mat-mdc-option.status-option.status-friends .status-option-content,\n:host ::ng-deep .selector-options-panel .mat-mdc-option.status-option.status-friends .status-option-content .mat-icon,\n:host ::ng-deep .status-options-panel .mat-mdc-option.status-option.status-friends .status-option-content,\n:host ::ng-deep .status-options-panel .mat-mdc-option.status-option.status-friends .status-option-content .mat-icon {\n  color: #1b57a1 !important;\n}\n:host ::ng-deep .selector-options-panel .mat-mdc-option.status-option.status-host .status-option-content,\n:host ::ng-deep .selector-options-panel .mat-mdc-option.status-option.status-host .status-option-content .mat-icon,\n:host ::ng-deep .status-options-panel .mat-mdc-option.status-option.status-host .status-option-content,\n:host ::ng-deep .status-options-panel .mat-mdc-option.status-option.status-host .status-option-content .mat-icon {\n  color: #87580f !important;\n}\n:host ::ng-deep .selector-options-panel .mat-mdc-option.status-option.status-inactive .status-option-content,\n:host ::ng-deep .selector-options-panel .mat-mdc-option.status-option.status-inactive .status-option-content .mat-icon,\n:host ::ng-deep .status-options-panel .mat-mdc-option.status-option.status-inactive .status-option-content,\n:host ::ng-deep .status-options-panel .mat-mdc-option.status-option.status-inactive .status-option-content .mat-icon {\n  color: #5b6573 !important;\n}\n:host ::ng-deep .mat-mdc-option.status-option.physique-slim {\n  background: #eaf4ff;\n}\n:host ::ng-deep .mat-mdc-option.status-option.physique-lean {\n  background: #edf8f4;\n}\n:host ::ng-deep .mat-mdc-option.status-option.physique-athletic {\n  background: #e8f5ec;\n}\n:host ::ng-deep .mat-mdc-option.status-option.physique-fit {\n  background: #f1f2ff;\n}\n:host ::ng-deep .mat-mdc-option.status-option.physique-curvy {\n  background: #fff2f8;\n}\n:host ::ng-deep .mat-mdc-option.status-option.physique-muscular {\n  background: #fbf4ea;\n}\n:host ::ng-deep .mat-mdc-option.status-option.physique-average {\n  background: #eff4f9;\n}\n:host ::ng-deep .mat-mdc-option.status-option.physique-slim .status-option-content {\n  color: #3f7ab3;\n}\n:host ::ng-deep .mat-mdc-option.status-option.physique-lean .status-option-content {\n  color: #3f8f5f;\n}\n:host ::ng-deep .mat-mdc-option.status-option.physique-athletic .status-option-content {\n  color: #2f7e4d;\n}\n:host ::ng-deep .mat-mdc-option.status-option.physique-fit .status-option-content {\n  color: #465fbb;\n}\n:host ::ng-deep .mat-mdc-option.status-option.physique-curvy .status-option-content {\n  color: #a14875;\n}\n:host ::ng-deep .mat-mdc-option.status-option.physique-muscular .status-option-content {\n  color: #7d4f24;\n}\n:host ::ng-deep .mat-mdc-option.status-option.physique-average .status-option-content {\n  color: #4d667f;\n}\n:host ::ng-deep .mat-mdc-select-panel.physique-options-panel {\n  width: auto !important;\n  max-width: 220px !important;\n  min-width: 0 !important;\n}\n:host ::ng-deep .physique-options-panel .mat-mdc-option {\n  padding-right: 8px;\n}\n:host ::ng-deep .physique-options-panel .mat-mdc-option .mat-pseudo-checkbox {\n  margin-left: 4px;\n}\n@media (max-width: 760px) {\n  .experience-form-grid {\n    grid-template-columns: 1fr;\n    max-width: none;\n    justify-content: stretch;\n    row-gap: 0.72rem;\n  }\n  .experience-date-range-label {\n    grid-column: 1/-1;\n  }\n  .experience-date-range-field .mat-date-range-input-container {\n    grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);\n  }\n  .profile-details-privacy-fab .privacy-fab-actions {\n    position: fixed;\n    left: 0.5rem;\n    right: 0.5rem;\n    bottom: max(0.5rem, env(safe-area-inset-bottom));\n    top: auto;\n    transform: translateY(12px) scale(0.98);\n    transform-origin: bottom center;\n    justify-content: center;\n    gap: 0.46rem;\n    padding: 0.46rem 0.56rem;\n    border: 1px solid rgba(42, 68, 102, 0.2);\n    border-radius: 14px;\n    background: #fff;\n    box-shadow: 0 -12px 24px rgba(18, 31, 51, 0.22);\n  }\n  .profile-details-privacy-fab.open .privacy-fab-actions {\n    transform: translateY(0) scale(1);\n  }\n}\n.editor-list-card {\n  border: 1px solid rgba(13, 25, 44, 0.12);\n  border-radius: 11px;\n  padding: 0.56rem;\n  background: #fbfdff;\n}\n.editor-list-card h4 {\n  margin: 0;\n  font-size: 0.9rem;\n  color: var(--text-main);\n}\n.editor-list-card p {\n  margin: 0;\n  color: var(--text-muted);\n}\n.experience-popup {\n  position: relative;\n  display: grid;\n  gap: 0.72rem;\n  padding-bottom: 0.5rem;\n  align-content: start;\n}\n.experience-toolbar {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  gap: 0.6rem;\n  margin-bottom: -0.16rem;\n}\n.experience-inline-actions {\n  position: relative;\n  display: inline-flex;\n  align-items: center;\n  margin-left: auto;\n}\n.experience-filter-select {\n  min-width: 174px;\n  width: 174px;\n  max-width: 174px;\n  height: 36px;\n}\n.experience-import-panel {\n  display: grid;\n  gap: 0.78rem;\n}\n.experience-import-progress-card {\n  border: 1px solid rgba(38, 67, 103, 0.16);\n  border-radius: 14px;\n  background:\n    linear-gradient(\n      180deg,\n      rgba(247, 250, 255, 0.94) 0%,\n      rgba(241, 246, 255, 0.92) 100%);\n  padding: 0.78rem 0.84rem;\n  display: grid;\n  gap: 0.52rem;\n}\n.experience-import-progress-meta {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.6rem;\n  color: #203b60;\n}\n.experience-import-progress-meta span {\n  font-size: 0.82rem;\n  font-weight: 700;\n}\n.experience-import-progress-meta strong {\n  font-size: 0.8rem;\n  color: #3b5f91;\n}\n.experience-import-progress-bar {\n  height: 10px;\n  border-radius: 999px;\n  overflow: hidden;\n  background: rgba(74, 106, 152, 0.12);\n}\n.experience-import-progress-bar span {\n  display: block;\n  height: 100%;\n  border-radius: inherit;\n  background:\n    linear-gradient(\n      90deg,\n      #f29d2e 0%,\n      #ed7f2e 55%,\n      #da5a39 100%);\n  transition: width 0.18s ease;\n}\n.experience-import-error {\n  display: grid;\n  grid-template-columns: auto minmax(0, 1fr);\n  align-items: flex-start;\n  gap: 0.72rem;\n  border: 1px solid rgba(191, 68, 55, 0.24);\n  border-radius: 14px;\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 244, 242, 0.96) 0%,\n      rgba(255, 236, 233, 0.92) 100%);\n  color: #8a3228;\n  padding: 0.78rem 0.84rem;\n}\n.experience-import-error .mat-icon {\n  color: #cf4a3c;\n}\n.experience-import-error strong,\n.experience-import-error p {\n  margin: 0;\n}\n.experience-import-stats {\n  display: grid;\n  grid-template-columns: repeat(3, minmax(0, 1fr));\n  gap: 0.58rem;\n}\n.experience-import-stat {\n  border: 1px solid rgba(38, 67, 103, 0.14);\n  border-radius: 14px;\n  background: #fbfdff;\n  padding: 0.72rem;\n  display: grid;\n  gap: 0.2rem;\n}\n.experience-import-stat span {\n  font-size: 0.74rem;\n  color: rgba(22, 44, 73, 0.68);\n}\n.experience-import-stat strong {\n  font-size: 1.1rem;\n  color: #203b60;\n}\n.experience-import-type-stats {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 0.48rem;\n}\n.experience-import-type-chip {\n  min-width: 0;\n  max-width: 100%;\n  box-sizing: border-box;\n  border-radius: 999px;\n  padding: 0.42rem 0.62rem;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.38rem;\n  border: 1px solid rgba(45, 75, 111, 0.16);\n}\n.experience-import-type-chip .mat-icon {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n  line-height: 16px;\n}\n.experience-import-type-chip span {\n  font-size: 0.76rem;\n  font-weight: 700;\n}\n.experience-import-type-chip strong {\n  margin-left: 0.08rem;\n  font-size: 0.76rem;\n}\n.experience-import-warnings {\n  display: grid;\n  gap: 0.36rem;\n}\n.experience-import-warnings h4 {\n  margin: 0;\n  font-size: 0.82rem;\n  color: #213b60;\n}\n.experience-import-warnings ul {\n  margin: 0;\n  padding-left: 1rem;\n  display: grid;\n  gap: 0.24rem;\n  color: rgba(22, 44, 73, 0.78);\n}\n.experience-import-actions {\n  justify-content: flex-end;\n}\n.experience-form-flow {\n  display: block;\n  width: 100%;\n  height: min(620px, 100vh - 6.5rem);\n  height: min(620px, 100dvh - 6.5rem);\n  min-height: 420px;\n  --form-flow-control-min-height: 40px;\n  --form-flow-control-padding: 8px 12px;\n}\n.image-file-input-hidden {\n  display: none;\n}\n.experience-type-field .experience-type-select {\n  width: 100%;\n  min-width: 0;\n  max-width: 100%;\n}\n@media (max-width: 760px) {\n  .experience-toolbar {\n    align-items: stretch;\n  }\n  .experience-import-stats {\n    grid-template-columns: 1fr;\n  }\n  .experience-import-type-stats {\n    flex-direction: column;\n  }\n  .experience-import-type-chip {\n    width: 100%;\n    justify-content: space-between;\n  }\n}\n/*# sourceMappingURL=profile-experience-manager.component.css.map */\n'] }]
  }], null, { entries: [{
    type: Input
  }], initialFilter: [{
    type: Input
  }], userId: [{
    type: Input
  }], experienceRouteConfig: [{
    type: Input
  }], emptyHint: [{
    type: Input
  }], allowImport: [{
    type: Input
  }], showInlineActions: [{
    type: Input
  }], entriesChange: [{
    type: Output
  }], overlayStateChange: [{
    type: Output
  }], experienceImportInput: [{
    type: ViewChild,
    args: ["experienceImportInput"]
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ProfileExperienceManagerComponent, { className: "ProfileExperienceManagerComponent", filePath: "app/shared/ui/components/core/form/popups/profile-experience-manager/profile-experience-manager.component.ts", lineNumber: 120 });
})();

export {
  SlotsInputComponent,
  ProfileExperienceManagerComponent
};
//# sourceMappingURL=chunk-64GWAN6R.js.map
