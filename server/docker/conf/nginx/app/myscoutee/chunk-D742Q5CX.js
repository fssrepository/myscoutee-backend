import {
  DeploymentBrandComponent
} from "./chunk-2K5TOPNO.js";
import {
  LazyBgImageDirective
} from "./chunk-QEZI4ZBE.js";
import {
  PopupComponent
} from "./chunk-3VXLUVWM.js";
import {
  AppMenuComponent,
  IndicatorComponent
} from "./chunk-FOAFZS65.js";
import {
  ActivatedRoute
} from "./chunk-U46O4F4Y.js";
import {
  MatIcon,
  MatIconModule
} from "./chunk-EDHGCWPF.js";
import {
  HelpCenterService
} from "./chunk-FJQMGJUW.js";
import {
  DeploymentConfigurationService
} from "./chunk-PK4DOAMC.js";
import {
  APP_STATIC_DATA
} from "./chunk-F4WY6ECV.js";
import {
  I18nService
} from "./chunk-Q3344WPR.js";
import {
  AppUtils
} from "./chunk-XQ4NDAVX.js";
import {
  CommonModule,
  NgClass,
  NgTemplateOutlet
} from "./chunk-J7IJFFQ2.js";
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  __spreadProps,
  __spreadValues,
  inject,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵNgOnChangesFeature,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵclassProp,
  ɵɵcomponentInstance,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵelement,
  ɵɵelementContainer,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵpureFunction0,
  ɵɵpureFunction2,
  ɵɵreference,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIdentity,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵsanitizeHtml,
  ɵɵtemplate,
  ɵɵtemplateRefExtractor,
  ɵɵtext,
  ɵɵtextInterpolate
} from "./chunk-XJL7SWH7.js";

// src/app/shared/core/common/deployment-privacy-token.resolver.ts
var DEPLOYMENT_PRIVACY_TOKEN_PATTERN = /{{\s*([^{}]+?)\s*}}/g;
var PRIVACY_EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
function resolveDeploymentPrivacyTokens(source, contact, text) {
  const normalizedContact = configuredPrivacyContact(contact);
  return `${source ?? ""}`.replace(DEPLOYMENT_PRIVACY_TOKEN_PATTERN, (_match, token) => {
    switch (token.trim()) {
      case "deployment.privacy.contactDetails":
        return normalizedContact ? contactDetailsHtml(normalizedContact, text) : `<p>${escapeHtml(text.contactNotPublished)}</p>`;
      case "deployment.privacy.deletionEmailRoute":
        return normalizedContact ? deletionEmailRouteHtml(normalizedContact, text) : "";
      default:
        return "";
    }
  });
}
function configuredPrivacyContact(contact) {
  const dataControllerName = `${contact?.dataControllerName ?? ""}`.trim();
  const privacyContactEmail = `${contact?.privacyContactEmail ?? ""}`.trim().toLowerCase();
  if (contact?.configured !== true || !dataControllerName || !PRIVACY_EMAIL_PATTERN.test(privacyContactEmail)) {
    return null;
  }
  return {
    configured: true,
    dataControllerName,
    privacyContactEmail
  };
}
function contactDetailsHtml(contact, text) {
  const email = escapeHtml(contact.privacyContactEmail);
  return [
    "<ul>",
    "<li>",
    `<strong>${escapeHtml(text.dataControllerLabel)}:</strong> `,
    escapeHtml(contact.dataControllerName),
    "</li>",
    "<li>",
    `<strong>${escapeHtml(text.privacyContactEmailLabel)}:</strong> `,
    `<a href="mailto:${email}">${email}</a>`,
    "</li>",
    "</ul>"
  ].join("");
}
function deletionEmailRouteHtml(contact, text) {
  const email = escapeHtml(contact.privacyContactEmail);
  return [
    "<p>",
    escapeHtml(text.deletionEmailPrefix),
    " ",
    `<a href="mailto:${email}">${email}</a>`,
    escapeHtml(text.deletionEmailSuffix),
    "</p>"
  ].join("");
}
function escapeHtml(value) {
  return `${value ?? ""}`.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[character] ?? "");
}

// src/app/shared/ui/components/core/accordion/accordion.component.ts
var _c0 = () => [];
var _c1 = (a0, a1) => ({ $implicit: a0, item: a1 });
function AccordionComponent_Conditional_0_For_2_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 5)(1, "mat-icon");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const item_r2 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(item_r2.icon);
  }
}
function AccordionComponent_Conditional_0_For_2_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "small");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const item_r2 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(item_r2.subtitle);
  }
}
function AccordionComponent_Conditional_0_For_2_Conditional_7_Conditional_0_For_2_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-icon");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const badge_r4 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(badge_r4.icon);
  }
}
function AccordionComponent_Conditional_0_For_2_Conditional_7_Conditional_0_For_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 13);
    \u0275\u0275conditionalCreate(1, AccordionComponent_Conditional_0_For_2_Conditional_7_Conditional_0_For_2_Conditional_1_Template, 2, 1, "mat-icon");
    \u0275\u0275elementStart(2, "span");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const badge_r4 = ctx.$implicit;
    \u0275\u0275attribute("data-palette", badge_r4.palette ?? null)("aria-label", badge_r4.ariaLabel ?? null)("title", badge_r4.title ?? null);
    \u0275\u0275advance();
    \u0275\u0275conditional(badge_r4.icon ? 1 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(badge_r4.label);
  }
}
function AccordionComponent_Conditional_0_For_2_Conditional_7_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 12);
    \u0275\u0275repeaterCreate(1, AccordionComponent_Conditional_0_For_2_Conditional_7_Conditional_0_For_2_Template, 4, 5, "span", 13, \u0275\u0275componentInstance().trackByBadge, true);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const itemBadges_r5 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275repeater(itemBadges_r5);
  }
}
function AccordionComponent_Conditional_0_For_2_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, AccordionComponent_Conditional_0_For_2_Conditional_7_Conditional_0_Template, 3, 0, "span", 12);
  }
  if (rf & 2) {
    \u0275\u0275conditional(ctx.length > 0 ? 0 : -1);
  }
}
function AccordionComponent_Conditional_0_For_2_Conditional_8_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-icon");
    \u0275\u0275text(1, "check");
    \u0275\u0275elementEnd();
  }
}
function AccordionComponent_Conditional_0_For_2_Conditional_8_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "span", 15);
  }
}
function AccordionComponent_Conditional_0_For_2_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 14);
    \u0275\u0275listener("keydown", function AccordionComponent_Conditional_0_For_2_Conditional_8_Template_button_keydown_0_listener($event) {
      return $event.stopPropagation();
    })("click", function AccordionComponent_Conditional_0_For_2_Conditional_8_Template_button_click_0_listener($event) {
      \u0275\u0275restoreView(_r6);
      const item_r2 = \u0275\u0275nextContext().$implicit;
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.toggleSelection(item_r2, $event));
    });
    \u0275\u0275conditionalCreate(1, AccordionComponent_Conditional_0_For_2_Conditional_8_Conditional_1_Template, 2, 0, "mat-icon")(2, AccordionComponent_Conditional_0_For_2_Conditional_8_Conditional_2_Template, 1, 0, "span", 15);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const item_r2 = \u0275\u0275nextContext().$implicit;
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("is-selected", ctx_r2.isSelected(item_r2));
    \u0275\u0275attribute("aria-pressed", ctx_r2.isSelected(item_r2))("aria-label", ctx_r2.selectionAriaLabel(item_r2));
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.isSelected(item_r2) ? 1 : 2);
  }
}
function AccordionComponent_Conditional_0_For_2_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "span", 16);
    \u0275\u0275listener("click", function AccordionComponent_Conditional_0_For_2_Conditional_9_Template_span_click_0_listener($event) {
      return $event.stopPropagation();
    })("keydown", function AccordionComponent_Conditional_0_For_2_Conditional_9_Template_span_keydown_0_listener($event) {
      return $event.stopPropagation();
    });
    \u0275\u0275elementStart(1, "app-menu", 17);
    \u0275\u0275listener("itemSelect", function AccordionComponent_Conditional_0_For_2_Conditional_9_Template_app_menu_itemSelect_1_listener($event) {
      \u0275\u0275restoreView(_r7);
      const item_r2 = \u0275\u0275nextContext().$implicit;
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.onActionMenuSelect(item_r2, $event));
    });
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const menu_r8 = ctx;
    \u0275\u0275advance();
    \u0275\u0275property("kind", menu_r8.kind ?? "select")("trigger", menu_r8.trigger ?? null)("items", menu_r8.items ?? \u0275\u0275pureFunction0(8, _c0))("model", menu_r8.model ?? null)("panelAlign", menu_r8.panelAlign ?? "auto")("panelMode", menu_r8.panelMode ?? "auto")("mobileBreakpointPx", menu_r8.mobileBreakpointPx ?? 760)("closeOnSelect", menu_r8.closeOnSelect ?? true);
  }
}
function AccordionComponent_Conditional_0_For_2_Conditional_13_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainer(0, 18);
  }
  if (rf & 2) {
    const item_r2 = \u0275\u0275nextContext(2).$implicit;
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275property("ngTemplateOutlet", ctx_r2.itemTemplate)("ngTemplateOutletContext", \u0275\u0275pureFunction2(2, _c1, item_r2, item_r2));
  }
}
function AccordionComponent_Conditional_0_For_2_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "section", 11);
    \u0275\u0275conditionalCreate(1, AccordionComponent_Conditional_0_For_2_Conditional_13_Conditional_1_Template, 1, 5, "ng-container", 18);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.itemTemplate ? 1 : -1);
  }
}
function AccordionComponent_Conditional_0_For_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "article", 3)(1, "header", 4);
    \u0275\u0275listener("click", function AccordionComponent_Conditional_0_For_2_Template_header_click_1_listener($event) {
      const item_r2 = \u0275\u0275restoreView(_r1).$implicit;
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.toggle(item_r2, $event));
    })("keydown.enter", function AccordionComponent_Conditional_0_For_2_Template_header_keydown_enter_1_listener($event) {
      const item_r2 = \u0275\u0275restoreView(_r1).$implicit;
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.toggle(item_r2, $event));
    })("keydown.space", function AccordionComponent_Conditional_0_For_2_Template_header_keydown_space_1_listener($event) {
      const item_r2 = \u0275\u0275restoreView(_r1).$implicit;
      const ctx_r2 = \u0275\u0275nextContext(2);
      ctx_r2.toggle(item_r2, $event);
      return \u0275\u0275resetView($event.preventDefault());
    });
    \u0275\u0275conditionalCreate(2, AccordionComponent_Conditional_0_For_2_Conditional_2_Template, 3, 1, "span", 5);
    \u0275\u0275elementStart(3, "span", 6)(4, "strong");
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(6, AccordionComponent_Conditional_0_For_2_Conditional_6_Template, 2, 1, "small");
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(7, AccordionComponent_Conditional_0_For_2_Conditional_7_Template, 1, 1);
    \u0275\u0275conditionalCreate(8, AccordionComponent_Conditional_0_For_2_Conditional_8_Template, 3, 5, "button", 7);
    \u0275\u0275conditionalCreate(9, AccordionComponent_Conditional_0_For_2_Conditional_9_Template, 2, 9, "span", 8);
    \u0275\u0275elementStart(10, "span", 9)(11, "mat-icon", 10);
    \u0275\u0275text(12, "expand_more");
    \u0275\u0275elementEnd()()();
    \u0275\u0275conditionalCreate(13, AccordionComponent_Conditional_0_For_2_Conditional_13_Template, 2, 1, "section", 11);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_21_0;
    let tmp_23_0;
    const item_r2 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("is-open", ctx_r2.isOpen(item_r2))("is-selected", ctx_r2.isSelected(item_r2))("is-disabled", item_r2.disabled);
    \u0275\u0275attribute("data-palette", ctx_r2.itemPalette(item_r2))("data-label-size", ctx_r2.itemLabelSize(item_r2));
    \u0275\u0275advance();
    \u0275\u0275attribute("aria-expanded", ctx_r2.isOpen(item_r2))("aria-label", (ctx_r2.isOpen(item_r2) ? "Collapse " : "Expand ") + item_r2.title);
    \u0275\u0275advance();
    \u0275\u0275conditional(item_r2.icon ? 2 : -1);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(item_r2.title);
    \u0275\u0275advance();
    \u0275\u0275conditional(item_r2.subtitle ? 6 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_21_0 = ctx_r2.badges(item_r2)) ? 7 : -1, tmp_21_0);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.isSelectable(item_r2) ? 8 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_23_0 = ctx_r2.actionMenu(item_r2)) ? 9 : -1, tmp_23_0);
    \u0275\u0275advance(4);
    \u0275\u0275conditional(ctx_r2.isOpen(item_r2) ? 13 : -1);
  }
}
function AccordionComponent_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 0);
    \u0275\u0275repeaterCreate(1, AccordionComponent_Conditional_0_For_2_Template, 14, 17, "article", 2, \u0275\u0275componentInstance().trackById, true);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r2.items());
  }
}
function AccordionComponent_Conditional_1_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r2.model == null ? null : ctx_r2.model.emptyDescription);
  }
}
function AccordionComponent_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 1)(1, "strong");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(3, AccordionComponent_Conditional_1_Conditional_3_Template, 2, 1, "span");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate((ctx_r2.model == null ? null : ctx_r2.model.emptyTitle) || "Nothing here yet");
    \u0275\u0275advance();
    \u0275\u0275conditional((ctx_r2.model == null ? null : ctx_r2.model.emptyDescription) ? 3 : -1);
  }
}
var AccordionComponent = class _AccordionComponent {
  model = null;
  itemTemplate = null;
  itemToggle = new EventEmitter();
  itemSelectionToggle = new EventEmitter();
  itemActionSelect = new EventEmitter();
  items() {
    return this.model?.items ?? [];
  }
  trackById(_, item) {
    return item.id;
  }
  trackByBadge(index, badge) {
    return badge.id ?? `${badge.icon ?? ""}:${badge.label}:${badge.palette ?? ""}:${index}`;
  }
  isOpen(item) {
    return item.open === true;
  }
  isSelectable(item) {
    return item.selectable === true;
  }
  isSelected(item) {
    return item.selected === true;
  }
  selectionAriaLabel(item) {
    return item.selectionAriaLabel?.trim() || `${this.isSelected(item) ? "Deselect" : "Select"} ${item.title}`;
  }
  actionMenu(item) {
    return item.actionMenu ?? null;
  }
  badges(item) {
    const explicitBadges = item.badges?.filter((badge) => this.hasBadgeValue(badge.label)) ?? [];
    if (explicitBadges.length > 0) {
      return explicitBadges;
    }
    if (!this.hasBadgeValue(item.badge)) {
      return [];
    }
    return [{ label: item.badge }];
  }
  toggle(item, event) {
    event.stopPropagation();
    if (item.disabled) {
      return;
    }
    this.itemToggle.emit({
      id: item.id,
      item,
      open: !this.isOpen(item),
      sourceEvent: event
    });
  }
  toggleSelection(item, event) {
    event.preventDefault();
    event.stopPropagation();
    if (item.disabled || !this.isSelectable(item)) {
      return;
    }
    this.itemSelectionToggle.emit({
      id: item.id,
      item,
      selected: !this.isSelected(item),
      sourceEvent: event
    });
  }
  onActionMenuSelect(item, itemSelect) {
    this.itemActionSelect.emit({
      id: item.id,
      item,
      itemSelect,
      sourceEvent: itemSelect.sourceEvent
    });
  }
  itemPalette(item) {
    return item.palette ?? "default";
  }
  itemLabelSize(item) {
    return item.labelSize ?? this.model?.labelSize ?? "default";
  }
  hasBadgeValue(value) {
    return value !== null && value !== void 0 && `${value}`.trim() !== "";
  }
  static \u0275fac = function AccordionComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AccordionComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AccordionComponent, selectors: [["app-accordion"]], inputs: { model: "model", itemTemplate: "itemTemplate" }, outputs: { itemToggle: "itemToggle", itemSelectionToggle: "itemSelectionToggle", itemActionSelect: "itemActionSelect" }, decls: 2, vars: 1, consts: [[1, "ui-accordion"], [1, "ui-accordion__empty"], [1, "ui-accordion__item", 3, "is-open", "is-selected", "is-disabled"], [1, "ui-accordion__item"], ["data-motion", "none", "role", "button", "tabindex", "0", 1, "ui-accordion__header", 3, "click", "keydown.enter", "keydown.space"], [1, "ui-accordion__icon"], [1, "ui-accordion__copy"], ["type", "button", 1, "ui-accordion__select", 3, "is-selected"], [1, "ui-accordion__model-actions"], ["aria-hidden", "true", 1, "ui-accordion__caret-btn"], [1, "ui-accordion__arrow"], [1, "ui-accordion__body"], [1, "ui-accordion__badges"], [1, "ui-accordion__badge"], ["type", "button", 1, "ui-accordion__select", 3, "keydown", "click"], ["aria-hidden", "true", 1, "ui-accordion__select-glyph"], [1, "ui-accordion__model-actions", 3, "click", "keydown"], [1, "ui-accordion__action-menu", 3, "itemSelect", "kind", "trigger", "items", "model", "panelAlign", "panelMode", "mobileBreakpointPx", "closeOnSelect"], [3, "ngTemplateOutlet", "ngTemplateOutletContext"]], template: function AccordionComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275conditionalCreate(0, AccordionComponent_Conditional_0_Template, 3, 0, "div", 0)(1, AccordionComponent_Conditional_1_Template, 4, 2, "div", 1);
    }
    if (rf & 2) {
      \u0275\u0275conditional(ctx.items().length > 0 ? 0 : 1);
    }
  }, dependencies: [CommonModule, NgTemplateOutlet, MatIconModule, MatIcon, AppMenuComponent], styles: ["\n[_nghost-%COMP%] {\n  display: block;\n  min-width: 0;\n}\n.ui-accordion[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.58rem;\n  min-width: 0;\n  isolation: isolate;\n}\n.ui-accordion__item[_ngcontent-%COMP%] {\n  --ui-accordion-accent: #2f6fb1;\n  --ui-accordion-border: rgba(62, 96, 139, 0.22);\n  --ui-accordion-head-start: rgba(239, 246, 255, 0.94);\n  --ui-accordion-head-end: rgba(246, 250, 255, 0.92);\n  --ui-accordion-head-open-start: rgba(232, 243, 255, 0.98);\n  --ui-accordion-head-open-end: rgba(242, 248, 255, 0.96);\n  overflow: hidden;\n  position: relative;\n  border: 1px solid var(--ui-accordion-border);\n  border-radius: 8px;\n  background: #fff;\n  box-shadow: 0 10px 28px rgba(38, 52, 82, 0.08);\n}\n.ui-accordion__item[_ngcontent-%COMP%]:focus-within {\n  overflow: visible;\n  z-index: 20;\n}\n.ui-accordion__item[_ngcontent-%COMP%]:focus-within   .ui-accordion__header[_ngcontent-%COMP%] {\n  border-radius: 8px;\n}\n.ui-accordion__item.is-open[_ngcontent-%COMP%]:focus-within   .ui-accordion__header[_ngcontent-%COMP%] {\n  border-radius: 8px 8px 0 0;\n}\n.ui-accordion__item.is-open[_ngcontent-%COMP%] {\n  border-color: color-mix(in srgb, var(--ui-accordion-accent), transparent 66%);\n}\n.ui-accordion__item.is-selected[_ngcontent-%COMP%] {\n  border-color: rgba(67, 155, 106, 0.36);\n  background:\n    linear-gradient(\n      180deg,\n      #f8fffb 0%,\n      #fff 100%);\n}\n.ui-accordion__item[data-palette=green][_ngcontent-%COMP%], \n.ui-accordion__item[data-palette=success][_ngcontent-%COMP%] {\n  --ui-accordion-accent: #257c52;\n  --ui-accordion-border: rgba(54, 156, 106, 0.3);\n  --ui-accordion-head-start: rgba(238, 252, 245, 0.96);\n  --ui-accordion-head-end: rgba(247, 253, 250, 0.94);\n  --ui-accordion-head-open-start: rgba(224, 248, 235, 0.98);\n  --ui-accordion-head-open-end: rgba(239, 251, 245, 0.96);\n}\n.ui-accordion__item[data-palette=mint][_ngcontent-%COMP%] {\n  --ui-accordion-accent: #2f8448;\n  --ui-accordion-border: rgba(72, 155, 92, 0.32);\n  --ui-accordion-head-start: rgba(233, 248, 236, 0.96);\n  --ui-accordion-head-end: rgba(246, 253, 248, 0.94);\n  --ui-accordion-head-open-start: rgba(218, 241, 225, 0.98);\n  --ui-accordion-head-open-end: rgba(236, 249, 240, 0.96);\n}\n.ui-accordion__item[data-palette=amber][_ngcontent-%COMP%], \n.ui-accordion__item[data-palette=gold][_ngcontent-%COMP%], \n.ui-accordion__item[data-palette=warning][_ngcontent-%COMP%] {\n  --ui-accordion-accent: #8a5c13;\n  --ui-accordion-border: rgba(196, 151, 35, 0.34);\n  --ui-accordion-head-start: rgba(255, 248, 236, 0.96);\n  --ui-accordion-head-end: rgba(255, 252, 246, 0.94);\n  --ui-accordion-head-open-start: rgba(255, 240, 214, 0.98);\n  --ui-accordion-head-open-end: rgba(255, 247, 232, 0.96);\n}\n.ui-accordion__item[data-palette=red][_ngcontent-%COMP%], \n.ui-accordion__item[data-palette=danger][_ngcontent-%COMP%] {\n  --ui-accordion-accent: #a23636;\n  --ui-accordion-border: rgba(178, 69, 69, 0.3);\n  --ui-accordion-head-start: rgba(255, 242, 242, 0.96);\n  --ui-accordion-head-end: rgba(255, 249, 249, 0.94);\n  --ui-accordion-head-open-start: rgba(255, 230, 230, 0.98);\n  --ui-accordion-head-open-end: rgba(255, 242, 242, 0.96);\n}\n.ui-accordion__item[data-palette=teal][_ngcontent-%COMP%], \n.ui-accordion__item[data-palette=cyan][_ngcontent-%COMP%] {\n  --ui-accordion-accent: #14717d;\n  --ui-accordion-border: rgba(40, 148, 164, 0.3);\n  --ui-accordion-head-start: rgba(237, 251, 253, 0.96);\n  --ui-accordion-head-end: rgba(247, 253, 254, 0.94);\n  --ui-accordion-head-open-start: rgba(218, 246, 249, 0.98);\n  --ui-accordion-head-open-end: rgba(238, 251, 252, 0.96);\n}\n.ui-accordion__item[data-palette=violet][_ngcontent-%COMP%], \n.ui-accordion__item[data-palette=purple][_ngcontent-%COMP%] {\n  --ui-accordion-accent: #6743a4;\n  --ui-accordion-border: rgba(128, 83, 209, 0.3);\n  --ui-accordion-head-start: rgba(249, 246, 255, 0.96);\n  --ui-accordion-head-end: rgba(252, 250, 255, 0.94);\n  --ui-accordion-head-open-start: rgba(239, 232, 255, 0.98);\n  --ui-accordion-head-open-end: rgba(247, 243, 255, 0.96);\n}\n.ui-accordion__header[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: auto minmax(0, 1fr) auto auto auto auto auto;\n  align-items: center;\n  gap: 0.46rem;\n  min-width: 0;\n  min-height: 3.625rem;\n  padding: 0.5rem 0.62rem 0.5rem 0.72rem;\n  background:\n    linear-gradient(\n      180deg,\n      var(--ui-accordion-head-start) 0%,\n      var(--ui-accordion-head-end) 100%);\n  cursor: pointer;\n  outline: none;\n}\n.ui-accordion__item.is-open[_ngcontent-%COMP%]   .ui-accordion__header[_ngcontent-%COMP%] {\n  border-bottom: 1px solid rgba(77, 98, 133, 0.14);\n  background:\n    linear-gradient(\n      180deg,\n      var(--ui-accordion-head-open-start) 0%,\n      var(--ui-accordion-head-open-end) 100%);\n}\n.ui-accordion__header[_ngcontent-%COMP%]:focus-visible {\n  outline: 2px solid color-mix(in srgb, var(--ui-accordion-accent), transparent 54%);\n  outline-offset: -2px;\n}\n.ui-accordion__header[_ngcontent-%COMP%]:active {\n  transform: none;\n  filter: none;\n  box-shadow: none;\n}\n.ui-accordion__icon[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  width: 1.55rem;\n  height: 1.55rem;\n  color: var(--ui-accordion-accent);\n}\n.ui-accordion__icon[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 1rem;\n  height: 1rem;\n  font-size: 1rem;\n  line-height: 1rem;\n}\n.ui-accordion__copy[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.08rem;\n  min-width: 0;\n}\n.ui-accordion__copy[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%], \n.ui-accordion__copy[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n  min-width: 0;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.ui-accordion__copy[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  color: #1f3f62;\n  font-size: 0.82rem;\n  font-weight: 800;\n}\n.ui-accordion__item[data-label-size=large][_ngcontent-%COMP%]   .ui-accordion__header[_ngcontent-%COMP%] {\n  min-height: 4.1rem;\n}\n.ui-accordion__item[data-label-size=large][_ngcontent-%COMP%]   .ui-accordion__copy[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  font-size: 0.98rem;\n  font-weight: 850;\n}\n.ui-accordion__copy[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n  color: rgba(37, 64, 96, 0.72);\n  font-size: 0.7rem;\n  font-weight: 700;\n}\n.ui-accordion__badges[_ngcontent-%COMP%] {\n  display: inline-flex;\n  flex-wrap: wrap;\n  justify-content: flex-end;\n  gap: 0.28rem;\n  min-width: 0;\n}\n.ui-accordion__badge[_ngcontent-%COMP%] {\n  --ui-accordion-badge-accent: var(--ui-accordion-accent);\n  --ui-accordion-badge-bg: rgba(255, 255, 255, 0.72);\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  gap: 0.24rem;\n  justify-self: end;\n  max-width: 8rem;\n  padding: 0.22rem 0.46rem;\n  border-radius: 999px;\n  border: 1px solid color-mix(in srgb, var(--ui-accordion-badge-accent), transparent 68%);\n  background: var(--ui-accordion-badge-bg);\n  color: var(--ui-accordion-badge-accent);\n  font-size: 0.68rem;\n  font-weight: 900;\n  overflow: hidden;\n  line-height: 1.1;\n  min-height: 1.72rem;\n  white-space: nowrap;\n}\n.ui-accordion__badge[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  min-width: 0;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.ui-accordion__badge[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  flex: 0 0 auto;\n  width: 0.9rem;\n  height: 0.9rem;\n  font-size: 0.9rem;\n  line-height: 0.9rem;\n}\n.ui-accordion__badge[data-palette=neutral][_ngcontent-%COMP%], \n.ui-accordion__badge[data-palette=slate][_ngcontent-%COMP%], \n.ui-accordion__badge[data-palette=muted][_ngcontent-%COMP%], \n.ui-accordion__badge[data-palette=default][_ngcontent-%COMP%] {\n  --ui-accordion-badge-accent: #476078;\n}\n.ui-accordion__badge[data-palette=blue][_ngcontent-%COMP%], \n.ui-accordion__badge[data-palette=sky][_ngcontent-%COMP%] {\n  --ui-accordion-badge-accent: #2f6fb1;\n  --ui-accordion-badge-bg: rgba(239, 246, 255, 0.86);\n}\n.ui-accordion__badge[data-palette=green][_ngcontent-%COMP%], \n.ui-accordion__badge[data-palette=mint][_ngcontent-%COMP%], \n.ui-accordion__badge[data-palette=success][_ngcontent-%COMP%] {\n  --ui-accordion-badge-accent: #257c52;\n  --ui-accordion-badge-bg: rgba(238, 252, 245, 0.86);\n}\n.ui-accordion__badge[data-palette=amber][_ngcontent-%COMP%], \n.ui-accordion__badge[data-palette=gold][_ngcontent-%COMP%], \n.ui-accordion__badge[data-palette=orange][_ngcontent-%COMP%], \n.ui-accordion__badge[data-palette=warning][_ngcontent-%COMP%] {\n  --ui-accordion-badge-accent: #8a5c13;\n  --ui-accordion-badge-bg: rgba(255, 248, 236, 0.88);\n}\n.ui-accordion__badge[data-palette=red][_ngcontent-%COMP%], \n.ui-accordion__badge[data-palette=pink][_ngcontent-%COMP%], \n.ui-accordion__badge[data-palette=danger][_ngcontent-%COMP%] {\n  --ui-accordion-badge-accent: #a23636;\n  --ui-accordion-badge-bg: rgba(255, 242, 242, 0.86);\n}\n.ui-accordion__badge[data-palette=teal][_ngcontent-%COMP%], \n.ui-accordion__badge[data-palette=cyan][_ngcontent-%COMP%], \n.ui-accordion__badge[data-palette=aquarius][_ngcontent-%COMP%] {\n  --ui-accordion-badge-accent: #14717d;\n  --ui-accordion-badge-bg: rgba(237, 251, 253, 0.86);\n}\n.ui-accordion__badge[data-palette=violet][_ngcontent-%COMP%], \n.ui-accordion__badge[data-palette=purple][_ngcontent-%COMP%] {\n  --ui-accordion-badge-accent: #6743a4;\n  --ui-accordion-badge-bg: rgba(249, 246, 255, 0.88);\n}\n.ui-accordion__badge[data-palette=brown][_ngcontent-%COMP%] {\n  --ui-accordion-badge-accent: #775238;\n  --ui-accordion-badge-bg: rgba(250, 244, 238, 0.88);\n}\n.ui-accordion__model-actions[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  min-width: 0;\n}\n.ui-accordion__select[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  width: 2.25rem;\n  height: 2.25rem;\n  border-radius: 999px;\n  border: 1px solid rgba(71, 95, 130, 0.16);\n  background: #fff;\n  color: #476078;\n  cursor: pointer;\n  padding: 0;\n}\n.ui-accordion__select.is-selected[_ngcontent-%COMP%] {\n  border-color: rgba(55, 145, 92, 0.34);\n  background: #e7f8ed;\n  color: #237346;\n}\n.ui-accordion__select[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 1.25rem;\n  height: 1.25rem;\n  font-size: 1.25rem;\n  line-height: 1.25rem;\n}\n.ui-accordion__select-glyph[_ngcontent-%COMP%] {\n  width: 0.75rem;\n  height: 0.75rem;\n  border-radius: 999px;\n  border: 2px solid currentColor;\n  opacity: 0.72;\n}\n.ui-accordion__caret-btn[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  width: 2.25rem;\n  height: 2.25rem;\n  border: 1px solid rgba(71, 95, 130, 0.16);\n  border-radius: 999px;\n  background: #fff;\n  color: #476078;\n}\n.ui-accordion__arrow[_ngcontent-%COMP%] {\n  width: 1.25rem;\n  height: 1.25rem;\n  font-size: 1.25rem;\n  line-height: 1.25rem;\n  color: inherit;\n  transition: transform 160ms ease;\n}\n.ui-accordion__item.is-open[_ngcontent-%COMP%]   .ui-accordion__arrow[_ngcontent-%COMP%] {\n  transform: rotate(180deg);\n}\n.ui-accordion__body[_ngcontent-%COMP%] {\n  padding: 0.82rem;\n  background: #fff;\n}\n.ui-accordion__empty[_ngcontent-%COMP%] {\n  display: grid;\n  place-items: center;\n  gap: 0.24rem;\n  min-height: 14rem;\n  padding: 1rem;\n  border: 1px dashed rgba(74, 103, 140, 0.32);\n  border-radius: 8px;\n  color: #315271;\n  text-align: center;\n}\n.ui-accordion__empty[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  font-size: 0.95rem;\n}\n.ui-accordion__empty[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  color: rgba(49, 82, 113, 0.72);\n  font-size: 0.78rem;\n  font-weight: 700;\n}\n@media (max-width: 620px) {\n  .ui-accordion__header[_ngcontent-%COMP%] {\n    grid-template-columns: auto minmax(0, 1fr) auto auto auto auto;\n  }\n  .ui-accordion__badges[_ngcontent-%COMP%] {\n    display: none;\n  }\n}\n/*# sourceMappingURL=accordion.component.css.map */"], changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AccordionComponent, [{
    type: Component,
    args: [{ selector: "app-accordion", standalone: true, imports: [CommonModule, MatIconModule, AppMenuComponent], changeDetection: ChangeDetectionStrategy.OnPush, template: `@if (items().length > 0) {
  <div class="ui-accordion">
    @for (item of items(); track trackById($index, item)) {
      <article
        class="ui-accordion__item"
        [class.is-open]="isOpen(item)"
        [class.is-selected]="isSelected(item)"
        [class.is-disabled]="item.disabled"
        [attr.data-palette]="itemPalette(item)"
        [attr.data-label-size]="itemLabelSize(item)"
      >
        <header
          class="ui-accordion__header"
          data-motion="none"
          role="button"
          tabindex="0"
          [attr.aria-expanded]="isOpen(item)"
          [attr.aria-label]="(isOpen(item) ? 'Collapse ' : 'Expand ') + item.title"
          (click)="toggle(item, $event)"
          (keydown.enter)="toggle(item, $event)"
          (keydown.space)="toggle(item, $event); $event.preventDefault()"
        >
          @if (item.icon) {
            <span class="ui-accordion__icon">
              <mat-icon>{{ item.icon }}</mat-icon>
            </span>
          }
          <span class="ui-accordion__copy">
            <strong>{{ item.title }}</strong>
            @if (item.subtitle) {
              <small>{{ item.subtitle }}</small>
            }
          </span>
          @if (badges(item); as itemBadges) {
            @if (itemBadges.length > 0) {
              <span class="ui-accordion__badges">
                @for (badge of itemBadges; track trackByBadge($index, badge)) {
                  <span
                    class="ui-accordion__badge"
                    [attr.data-palette]="badge.palette ?? null"
                    [attr.aria-label]="badge.ariaLabel ?? null"
                    [attr.title]="badge.title ?? null"
                  >
                    @if (badge.icon) {
                      <mat-icon>{{ badge.icon }}</mat-icon>
                    }
                    <span>{{ badge.label }}</span>
                  </span>
                }
              </span>
            }
          }
          @if (isSelectable(item)) {
            <button
              type="button"
              class="ui-accordion__select"
              [class.is-selected]="isSelected(item)"
              [attr.aria-pressed]="isSelected(item)"
              [attr.aria-label]="selectionAriaLabel(item)"
              (keydown)="$event.stopPropagation()"
              (click)="toggleSelection(item, $event)"
            >
              @if (isSelected(item)) {
                <mat-icon>check</mat-icon>
              } @else {
                <span class="ui-accordion__select-glyph" aria-hidden="true"></span>
              }
            </button>
          }
          @if (actionMenu(item); as menu) {
            <span
              class="ui-accordion__model-actions"
              (click)="$event.stopPropagation()"
              (keydown)="$event.stopPropagation()"
            >
              <app-menu
                class="ui-accordion__action-menu"
                [kind]="menu.kind ?? 'select'"
                [trigger]="menu.trigger ?? null"
                [items]="menu.items ?? []"
                [model]="menu.model ?? null"
                [panelAlign]="menu.panelAlign ?? 'auto'"
                [panelMode]="menu.panelMode ?? 'auto'"
                [mobileBreakpointPx]="menu.mobileBreakpointPx ?? 760"
                [closeOnSelect]="menu.closeOnSelect ?? true"
                (itemSelect)="onActionMenuSelect(item, $event)"
              ></app-menu>
            </span>
          }
          <span class="ui-accordion__caret-btn" aria-hidden="true">
            <mat-icon class="ui-accordion__arrow">expand_more</mat-icon>
          </span>
        </header>
        @if (isOpen(item)) {
          <section class="ui-accordion__body">
            @if (itemTemplate) {
              <ng-container
                [ngTemplateOutlet]="itemTemplate"
                [ngTemplateOutletContext]="{ $implicit: item, item: item }"
              ></ng-container>
            }
          </section>
        }
      </article>
    }
  </div>
} @else {
  <div class="ui-accordion__empty">
    <strong>{{ model?.emptyTitle || 'Nothing here yet' }}</strong>
    @if (model?.emptyDescription) {
      <span>{{ model?.emptyDescription }}</span>
    }
  </div>
}
`, styles: ["/* src/app/shared/ui/components/core/accordion/accordion.component.scss */\n:host {\n  display: block;\n  min-width: 0;\n}\n.ui-accordion {\n  display: grid;\n  gap: 0.58rem;\n  min-width: 0;\n  isolation: isolate;\n}\n.ui-accordion__item {\n  --ui-accordion-accent: #2f6fb1;\n  --ui-accordion-border: rgba(62, 96, 139, 0.22);\n  --ui-accordion-head-start: rgba(239, 246, 255, 0.94);\n  --ui-accordion-head-end: rgba(246, 250, 255, 0.92);\n  --ui-accordion-head-open-start: rgba(232, 243, 255, 0.98);\n  --ui-accordion-head-open-end: rgba(242, 248, 255, 0.96);\n  overflow: hidden;\n  position: relative;\n  border: 1px solid var(--ui-accordion-border);\n  border-radius: 8px;\n  background: #fff;\n  box-shadow: 0 10px 28px rgba(38, 52, 82, 0.08);\n}\n.ui-accordion__item:focus-within {\n  overflow: visible;\n  z-index: 20;\n}\n.ui-accordion__item:focus-within .ui-accordion__header {\n  border-radius: 8px;\n}\n.ui-accordion__item.is-open:focus-within .ui-accordion__header {\n  border-radius: 8px 8px 0 0;\n}\n.ui-accordion__item.is-open {\n  border-color: color-mix(in srgb, var(--ui-accordion-accent), transparent 66%);\n}\n.ui-accordion__item.is-selected {\n  border-color: rgba(67, 155, 106, 0.36);\n  background:\n    linear-gradient(\n      180deg,\n      #f8fffb 0%,\n      #fff 100%);\n}\n.ui-accordion__item[data-palette=green],\n.ui-accordion__item[data-palette=success] {\n  --ui-accordion-accent: #257c52;\n  --ui-accordion-border: rgba(54, 156, 106, 0.3);\n  --ui-accordion-head-start: rgba(238, 252, 245, 0.96);\n  --ui-accordion-head-end: rgba(247, 253, 250, 0.94);\n  --ui-accordion-head-open-start: rgba(224, 248, 235, 0.98);\n  --ui-accordion-head-open-end: rgba(239, 251, 245, 0.96);\n}\n.ui-accordion__item[data-palette=mint] {\n  --ui-accordion-accent: #2f8448;\n  --ui-accordion-border: rgba(72, 155, 92, 0.32);\n  --ui-accordion-head-start: rgba(233, 248, 236, 0.96);\n  --ui-accordion-head-end: rgba(246, 253, 248, 0.94);\n  --ui-accordion-head-open-start: rgba(218, 241, 225, 0.98);\n  --ui-accordion-head-open-end: rgba(236, 249, 240, 0.96);\n}\n.ui-accordion__item[data-palette=amber],\n.ui-accordion__item[data-palette=gold],\n.ui-accordion__item[data-palette=warning] {\n  --ui-accordion-accent: #8a5c13;\n  --ui-accordion-border: rgba(196, 151, 35, 0.34);\n  --ui-accordion-head-start: rgba(255, 248, 236, 0.96);\n  --ui-accordion-head-end: rgba(255, 252, 246, 0.94);\n  --ui-accordion-head-open-start: rgba(255, 240, 214, 0.98);\n  --ui-accordion-head-open-end: rgba(255, 247, 232, 0.96);\n}\n.ui-accordion__item[data-palette=red],\n.ui-accordion__item[data-palette=danger] {\n  --ui-accordion-accent: #a23636;\n  --ui-accordion-border: rgba(178, 69, 69, 0.3);\n  --ui-accordion-head-start: rgba(255, 242, 242, 0.96);\n  --ui-accordion-head-end: rgba(255, 249, 249, 0.94);\n  --ui-accordion-head-open-start: rgba(255, 230, 230, 0.98);\n  --ui-accordion-head-open-end: rgba(255, 242, 242, 0.96);\n}\n.ui-accordion__item[data-palette=teal],\n.ui-accordion__item[data-palette=cyan] {\n  --ui-accordion-accent: #14717d;\n  --ui-accordion-border: rgba(40, 148, 164, 0.3);\n  --ui-accordion-head-start: rgba(237, 251, 253, 0.96);\n  --ui-accordion-head-end: rgba(247, 253, 254, 0.94);\n  --ui-accordion-head-open-start: rgba(218, 246, 249, 0.98);\n  --ui-accordion-head-open-end: rgba(238, 251, 252, 0.96);\n}\n.ui-accordion__item[data-palette=violet],\n.ui-accordion__item[data-palette=purple] {\n  --ui-accordion-accent: #6743a4;\n  --ui-accordion-border: rgba(128, 83, 209, 0.3);\n  --ui-accordion-head-start: rgba(249, 246, 255, 0.96);\n  --ui-accordion-head-end: rgba(252, 250, 255, 0.94);\n  --ui-accordion-head-open-start: rgba(239, 232, 255, 0.98);\n  --ui-accordion-head-open-end: rgba(247, 243, 255, 0.96);\n}\n.ui-accordion__header {\n  display: grid;\n  grid-template-columns: auto minmax(0, 1fr) auto auto auto auto auto;\n  align-items: center;\n  gap: 0.46rem;\n  min-width: 0;\n  min-height: 3.625rem;\n  padding: 0.5rem 0.62rem 0.5rem 0.72rem;\n  background:\n    linear-gradient(\n      180deg,\n      var(--ui-accordion-head-start) 0%,\n      var(--ui-accordion-head-end) 100%);\n  cursor: pointer;\n  outline: none;\n}\n.ui-accordion__item.is-open .ui-accordion__header {\n  border-bottom: 1px solid rgba(77, 98, 133, 0.14);\n  background:\n    linear-gradient(\n      180deg,\n      var(--ui-accordion-head-open-start) 0%,\n      var(--ui-accordion-head-open-end) 100%);\n}\n.ui-accordion__header:focus-visible {\n  outline: 2px solid color-mix(in srgb, var(--ui-accordion-accent), transparent 54%);\n  outline-offset: -2px;\n}\n.ui-accordion__header:active {\n  transform: none;\n  filter: none;\n  box-shadow: none;\n}\n.ui-accordion__icon {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  width: 1.55rem;\n  height: 1.55rem;\n  color: var(--ui-accordion-accent);\n}\n.ui-accordion__icon .mat-icon {\n  width: 1rem;\n  height: 1rem;\n  font-size: 1rem;\n  line-height: 1rem;\n}\n.ui-accordion__copy {\n  display: grid;\n  gap: 0.08rem;\n  min-width: 0;\n}\n.ui-accordion__copy strong,\n.ui-accordion__copy small {\n  min-width: 0;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.ui-accordion__copy strong {\n  color: #1f3f62;\n  font-size: 0.82rem;\n  font-weight: 800;\n}\n.ui-accordion__item[data-label-size=large] .ui-accordion__header {\n  min-height: 4.1rem;\n}\n.ui-accordion__item[data-label-size=large] .ui-accordion__copy strong {\n  font-size: 0.98rem;\n  font-weight: 850;\n}\n.ui-accordion__copy small {\n  color: rgba(37, 64, 96, 0.72);\n  font-size: 0.7rem;\n  font-weight: 700;\n}\n.ui-accordion__badges {\n  display: inline-flex;\n  flex-wrap: wrap;\n  justify-content: flex-end;\n  gap: 0.28rem;\n  min-width: 0;\n}\n.ui-accordion__badge {\n  --ui-accordion-badge-accent: var(--ui-accordion-accent);\n  --ui-accordion-badge-bg: rgba(255, 255, 255, 0.72);\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  gap: 0.24rem;\n  justify-self: end;\n  max-width: 8rem;\n  padding: 0.22rem 0.46rem;\n  border-radius: 999px;\n  border: 1px solid color-mix(in srgb, var(--ui-accordion-badge-accent), transparent 68%);\n  background: var(--ui-accordion-badge-bg);\n  color: var(--ui-accordion-badge-accent);\n  font-size: 0.68rem;\n  font-weight: 900;\n  overflow: hidden;\n  line-height: 1.1;\n  min-height: 1.72rem;\n  white-space: nowrap;\n}\n.ui-accordion__badge span {\n  min-width: 0;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.ui-accordion__badge .mat-icon {\n  flex: 0 0 auto;\n  width: 0.9rem;\n  height: 0.9rem;\n  font-size: 0.9rem;\n  line-height: 0.9rem;\n}\n.ui-accordion__badge[data-palette=neutral],\n.ui-accordion__badge[data-palette=slate],\n.ui-accordion__badge[data-palette=muted],\n.ui-accordion__badge[data-palette=default] {\n  --ui-accordion-badge-accent: #476078;\n}\n.ui-accordion__badge[data-palette=blue],\n.ui-accordion__badge[data-palette=sky] {\n  --ui-accordion-badge-accent: #2f6fb1;\n  --ui-accordion-badge-bg: rgba(239, 246, 255, 0.86);\n}\n.ui-accordion__badge[data-palette=green],\n.ui-accordion__badge[data-palette=mint],\n.ui-accordion__badge[data-palette=success] {\n  --ui-accordion-badge-accent: #257c52;\n  --ui-accordion-badge-bg: rgba(238, 252, 245, 0.86);\n}\n.ui-accordion__badge[data-palette=amber],\n.ui-accordion__badge[data-palette=gold],\n.ui-accordion__badge[data-palette=orange],\n.ui-accordion__badge[data-palette=warning] {\n  --ui-accordion-badge-accent: #8a5c13;\n  --ui-accordion-badge-bg: rgba(255, 248, 236, 0.88);\n}\n.ui-accordion__badge[data-palette=red],\n.ui-accordion__badge[data-palette=pink],\n.ui-accordion__badge[data-palette=danger] {\n  --ui-accordion-badge-accent: #a23636;\n  --ui-accordion-badge-bg: rgba(255, 242, 242, 0.86);\n}\n.ui-accordion__badge[data-palette=teal],\n.ui-accordion__badge[data-palette=cyan],\n.ui-accordion__badge[data-palette=aquarius] {\n  --ui-accordion-badge-accent: #14717d;\n  --ui-accordion-badge-bg: rgba(237, 251, 253, 0.86);\n}\n.ui-accordion__badge[data-palette=violet],\n.ui-accordion__badge[data-palette=purple] {\n  --ui-accordion-badge-accent: #6743a4;\n  --ui-accordion-badge-bg: rgba(249, 246, 255, 0.88);\n}\n.ui-accordion__badge[data-palette=brown] {\n  --ui-accordion-badge-accent: #775238;\n  --ui-accordion-badge-bg: rgba(250, 244, 238, 0.88);\n}\n.ui-accordion__model-actions {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  min-width: 0;\n}\n.ui-accordion__select {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  width: 2.25rem;\n  height: 2.25rem;\n  border-radius: 999px;\n  border: 1px solid rgba(71, 95, 130, 0.16);\n  background: #fff;\n  color: #476078;\n  cursor: pointer;\n  padding: 0;\n}\n.ui-accordion__select.is-selected {\n  border-color: rgba(55, 145, 92, 0.34);\n  background: #e7f8ed;\n  color: #237346;\n}\n.ui-accordion__select .mat-icon {\n  width: 1.25rem;\n  height: 1.25rem;\n  font-size: 1.25rem;\n  line-height: 1.25rem;\n}\n.ui-accordion__select-glyph {\n  width: 0.75rem;\n  height: 0.75rem;\n  border-radius: 999px;\n  border: 2px solid currentColor;\n  opacity: 0.72;\n}\n.ui-accordion__caret-btn {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  width: 2.25rem;\n  height: 2.25rem;\n  border: 1px solid rgba(71, 95, 130, 0.16);\n  border-radius: 999px;\n  background: #fff;\n  color: #476078;\n}\n.ui-accordion__arrow {\n  width: 1.25rem;\n  height: 1.25rem;\n  font-size: 1.25rem;\n  line-height: 1.25rem;\n  color: inherit;\n  transition: transform 160ms ease;\n}\n.ui-accordion__item.is-open .ui-accordion__arrow {\n  transform: rotate(180deg);\n}\n.ui-accordion__body {\n  padding: 0.82rem;\n  background: #fff;\n}\n.ui-accordion__empty {\n  display: grid;\n  place-items: center;\n  gap: 0.24rem;\n  min-height: 14rem;\n  padding: 1rem;\n  border: 1px dashed rgba(74, 103, 140, 0.32);\n  border-radius: 8px;\n  color: #315271;\n  text-align: center;\n}\n.ui-accordion__empty strong {\n  font-size: 0.95rem;\n}\n.ui-accordion__empty span {\n  color: rgba(49, 82, 113, 0.72);\n  font-size: 0.78rem;\n  font-weight: 700;\n}\n@media (max-width: 620px) {\n  .ui-accordion__header {\n    grid-template-columns: auto minmax(0, 1fr) auto auto auto auto;\n  }\n  .ui-accordion__badges {\n    display: none;\n  }\n}\n/*# sourceMappingURL=accordion.component.css.map */\n"] }]
  }], null, { model: [{
    type: Input
  }], itemTemplate: [{
    type: Input
  }], itemToggle: [{
    type: Output
  }], itemSelectionToggle: [{
    type: Output
  }], itemActionSelect: [{
    type: Output
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AccordionComponent, { className: "AccordionComponent", filePath: "app/shared/ui/components/core/accordion/accordion.component.ts", lineNumber: 25 });
})();

// src/app/shared/ui/components/document-viewer/document-viewer.component.ts
function DocumentViewerComponent_Conditional_0_ng_template_0_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "article", 5);
    \u0275\u0275element(1, "app-indicator", 8);
    \u0275\u0275elementStart(2, "span");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r0.loadingLabel());
  }
}
function DocumentViewerComponent_Conditional_0_ng_template_0_Conditional_2_ng_template_1_Conditional_0_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 11);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const section_r3 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(section_r3.blurb);
  }
}
function DocumentViewerComponent_Conditional_0_ng_template_0_Conditional_2_ng_template_1_Conditional_0_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "div", 12);
  }
  if (rf & 2) {
    const section_r3 = \u0275\u0275nextContext();
    \u0275\u0275property("appLazyHtmlImages", true)("innerHTML", section_r3.contentHtml, \u0275\u0275sanitizeHtml);
  }
}
function DocumentViewerComponent_Conditional_0_ng_template_0_Conditional_2_ng_template_1_Conditional_0_Conditional_3_For_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "li", 14);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const point_r4 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(point_r4);
  }
}
function DocumentViewerComponent_Conditional_0_ng_template_0_Conditional_2_ng_template_1_Conditional_0_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "ul", 13);
    \u0275\u0275repeaterCreate(1, DocumentViewerComponent_Conditional_0_ng_template_0_Conditional_2_ng_template_1_Conditional_0_Conditional_3_For_2_Template, 2, 1, "li", 14, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const section_r3 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275repeater(section_r3.points);
  }
}
function DocumentViewerComponent_Conditional_0_ng_template_0_Conditional_2_ng_template_1_Conditional_0_Conditional_4_For_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "li", 14);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const detail_r5 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(detail_r5);
  }
}
function DocumentViewerComponent_Conditional_0_ng_template_0_Conditional_2_ng_template_1_Conditional_0_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "ul", 13);
    \u0275\u0275repeaterCreate(1, DocumentViewerComponent_Conditional_0_ng_template_0_Conditional_2_ng_template_1_Conditional_0_Conditional_4_For_2_Template, 2, 1, "li", 14, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const section_r3 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275repeater(section_r3.details);
  }
}
function DocumentViewerComponent_Conditional_0_ng_template_0_Conditional_2_ng_template_1_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 10);
    \u0275\u0275conditionalCreate(1, DocumentViewerComponent_Conditional_0_ng_template_0_Conditional_2_ng_template_1_Conditional_0_Conditional_1_Template, 2, 1, "p", 11);
    \u0275\u0275conditionalCreate(2, DocumentViewerComponent_Conditional_0_ng_template_0_Conditional_2_ng_template_1_Conditional_0_Conditional_2_Template, 1, 2, "div", 12);
    \u0275\u0275conditionalCreate(3, DocumentViewerComponent_Conditional_0_ng_template_0_Conditional_2_ng_template_1_Conditional_0_Conditional_3_Template, 3, 0, "ul", 13);
    \u0275\u0275conditionalCreate(4, DocumentViewerComponent_Conditional_0_ng_template_0_Conditional_2_ng_template_1_Conditional_0_Conditional_4_Template, 3, 0, "ul", 13);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const section_r3 = ctx;
    \u0275\u0275advance();
    \u0275\u0275conditional(section_r3.blurb ? 1 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(section_r3.contentHtml ? 2 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional((section_r3.points == null ? null : section_r3.points.length) ? 3 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional((section_r3.details == null ? null : section_r3.details.length) ? 4 : -1);
  }
}
function DocumentViewerComponent_Conditional_0_ng_template_0_Conditional_2_ng_template_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, DocumentViewerComponent_Conditional_0_ng_template_0_Conditional_2_ng_template_1_Conditional_0_Template, 5, 4, "div", 10);
  }
  if (rf & 2) {
    let tmp_7_0;
    const item_r6 = ctx.$implicit;
    const ctx_r0 = \u0275\u0275nextContext(4);
    \u0275\u0275conditional((tmp_7_0 = ctx_r0.documentSectionFromItem(item_r6)) ? 0 : -1, tmp_7_0);
  }
}
function DocumentViewerComponent_Conditional_0_ng_template_0_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "app-accordion", 9);
    \u0275\u0275listener("itemToggle", function DocumentViewerComponent_Conditional_0_ng_template_0_Conditional_2_Template_app_accordion_itemToggle_0_listener($event) {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r0.onDocumentAccordionToggle($event));
    })("itemSelectionToggle", function DocumentViewerComponent_Conditional_0_ng_template_0_Conditional_2_Template_app_accordion_itemSelectionToggle_0_listener($event) {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r0.onDocumentAccordionSelectionToggle($event));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275template(1, DocumentViewerComponent_Conditional_0_ng_template_0_Conditional_2_ng_template_1_Template, 1, 1, "ng-template", null, 1, \u0275\u0275templateRefExtractor);
  }
  if (rf & 2) {
    const documentSectionTemplate_r7 = \u0275\u0275reference(2);
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275property("model", ctx_r0.documentAccordionModel())("itemTemplate", documentSectionTemplate_r7);
  }
}
function DocumentViewerComponent_Conditional_0_ng_template_0_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "article", 6)(1, "mat-icon");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "h4");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "p");
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.emptyIcon());
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.emptyTitle());
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.emptyDescription());
  }
}
function DocumentViewerComponent_Conditional_0_ng_template_0_Conditional_4_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 16);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(4);
    \u0275\u0275property("ngClass", ctx_r0.statusToneClass());
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.statusMessage());
  }
}
function DocumentViewerComponent_Conditional_0_ng_template_0_Conditional_4_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "app-menu", 18);
    \u0275\u0275listener("itemSelect", function DocumentViewerComponent_Conditional_0_ng_template_0_Conditional_4_Conditional_2_Template_app_menu_itemSelect_0_listener($event) {
      \u0275\u0275restoreView(_r8);
      const ctx_r0 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r0.onActionMenuSelect($event));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(4);
    \u0275\u0275property("items", ctx_r0.actionMenuItems());
  }
}
function DocumentViewerComponent_Conditional_0_ng_template_0_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "footer", 15);
    \u0275\u0275conditionalCreate(1, DocumentViewerComponent_Conditional_0_ng_template_0_Conditional_4_Conditional_1_Template, 2, 2, "span", 16);
    \u0275\u0275conditionalCreate(2, DocumentViewerComponent_Conditional_0_ng_template_0_Conditional_4_Conditional_2_Template, 1, 1, "app-menu", 17);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275classProp("document-viewer-actions-single", ctx_r0.visibleActions().length <= 1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.statusMessage() ? 1 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.visibleActions().length > 0 ? 2 : -1);
  }
}
function DocumentViewerComponent_Conditional_0_ng_template_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 4);
    \u0275\u0275conditionalCreate(1, DocumentViewerComponent_Conditional_0_ng_template_0_Conditional_1_Template, 4, 1, "article", 5)(2, DocumentViewerComponent_Conditional_0_ng_template_0_Conditional_2_Template, 3, 2)(3, DocumentViewerComponent_Conditional_0_ng_template_0_Conditional_3_Template, 7, 3, "article", 6);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(4, DocumentViewerComponent_Conditional_0_ng_template_0_Conditional_4_Template, 3, 4, "footer", 7);
  }
  if (rf & 2) {
    let tmp_3_0;
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.loading() ? 1 : ((tmp_3_0 = ctx_r0.activeConfig()) == null ? null : tmp_3_0.sections == null ? null : tmp_3_0.sections.length) ? 2 : 3);
    \u0275\u0275advance(3);
    \u0275\u0275conditional(ctx_r0.statusMessage() || ctx_r0.visibleActions().length > 0 ? 4 : -1);
  }
}
function DocumentViewerComponent_Conditional_0_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "app-popup", 2);
    \u0275\u0275elementContainer(1, 19);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275nextContext();
    const documentViewerBody_r9 = \u0275\u0275reference(1);
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275property("model", ctx_r0.documentPopupModel())("zIndex", 2400);
    \u0275\u0275advance();
    \u0275\u0275property("ngTemplateOutlet", documentViewerBody_r9);
  }
}
function DocumentViewerComponent_Conditional_0_Conditional_3_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "a", 22);
    \u0275\u0275element(1, "app-deployment-brand", 26);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275property("branding", ctx_r0.deploymentBranding());
  }
}
function DocumentViewerComponent_Conditional_0_Conditional_3_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 14);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.description());
  }
}
function DocumentViewerComponent_Conditional_0_Conditional_3_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 25);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.versionLabel());
  }
}
function DocumentViewerComponent_Conditional_0_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "section", 3)(1, "article", 20)(2, "header", 21);
    \u0275\u0275conditionalCreate(3, DocumentViewerComponent_Conditional_0_Conditional_3_Conditional_3_Template, 2, 1, "a", 22);
    \u0275\u0275elementStart(4, "div", 23)(5, "div", 24)(6, "h2")(7, "span", 14);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(9, DocumentViewerComponent_Conditional_0_Conditional_3_Conditional_9_Template, 2, 1, "p", 14);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(10, DocumentViewerComponent_Conditional_0_Conditional_3_Conditional_10_Template, 2, 1, "span", 25);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementContainer(11, 19);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    \u0275\u0275nextContext();
    const documentViewerBody_r9 = \u0275\u0275reference(1);
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275attribute("aria-label", ctx_r0.ariaLabel());
    \u0275\u0275advance(2);
    \u0275\u0275property("ngClass", ctx_r0.headerPaletteClass());
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.showBrand() ? 3 : -1);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r0.title());
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.description() ? 9 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.versionLabel() ? 10 : -1);
    \u0275\u0275advance();
    \u0275\u0275property("ngTemplateOutlet", documentViewerBody_r9);
  }
}
function DocumentViewerComponent_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, DocumentViewerComponent_Conditional_0_ng_template_0_Template, 5, 2, "ng-template", null, 0, \u0275\u0275templateRefExtractor);
    \u0275\u0275conditionalCreate(2, DocumentViewerComponent_Conditional_0_Conditional_2_Template, 2, 3, "app-popup", 2)(3, DocumentViewerComponent_Conditional_0_Conditional_3_Template, 12, 7, "section", 3);
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r0.isPopupShell() ? 2 : 3);
  }
}
var DocumentViewerComponent = class _DocumentViewerComponent {
  deploymentConfiguration = inject(DeploymentConfigurationService);
  deploymentBranding = this.deploymentConfiguration.branding;
  i18n = inject(I18nService);
  route = inject(ActivatedRoute);
  helpCenter = inject(HelpCenterService);
  config = null;
  action = new EventEmitter();
  openSectionId = "";
  selectedSectionIds = /* @__PURE__ */ new Set();
  initialSelectedSectionIds = /* @__PURE__ */ new Set();
  selectionInputSignature = "";
  sectionSignature = "";
  openSectionSignature = "";
  routeConfig = null;
  ngOnInit() {
    if (!this.config) {
      void this.prepareRouteDocument();
    }
  }
  ngOnChanges(changes) {
    if (changes["config"]) {
      this.syncSelectionFromConfig();
      this.syncOpenSection();
    }
  }
  isOpen() {
    return this.activeConfig()?.open !== false;
  }
  shell() {
    return this.activeConfig()?.shell ?? "page";
  }
  isPopupShell() {
    return this.shell() === "popup";
  }
  ariaLabel() {
    const config = this.activeConfig();
    return this.uiText(config?.ariaLabel?.trim() || config?.title || "Document");
  }
  title() {
    return this.uiText(this.activeConfig()?.title?.trim() || "Document");
  }
  description() {
    const description = this.activeConfig()?.description?.trim() ?? "";
    return description ? this.uiText(description) : "";
  }
  versionLabel() {
    return this.activeConfig()?.versionLabel?.trim() ?? "";
  }
  headerPaletteClass() {
    return `document-viewer-header-${this.normalizeHeaderPalette(this.activeConfig()?.headerPalette)}`;
  }
  documentPopupModel() {
    const config = this.activeConfig();
    return {
      title: this.title(),
      subtitle: this.description(),
      headerBadge: this.versionLabel(),
      ariaLabel: this.ariaLabel(),
      closeAriaLabel: this.closeAriaLabel(),
      translateTitle: false,
      translateSubtitle: false,
      translateHeaderBadge: false,
      closeOnBackdrop: config?.closeOnBackdrop !== false,
      size: "wide",
      height: "full",
      headerLayout: "document",
      headerPalette: this.normalizeHeaderPalette(config?.headerPalette),
      bodyLayout: "flush",
      backdropTone: "dim",
      onClose: (event) => this.requestClose(event)
    };
  }
  showBrand() {
    return !this.isPopupShell() && this.activeConfig()?.showBrand !== false;
  }
  loading() {
    return this.activeConfig()?.loading === true;
  }
  loadingLabel() {
    return this.uiText(this.activeConfig()?.loadingLabel?.trim() || "Loading document");
  }
  closeAriaLabel() {
    return this.uiText(this.activeConfig()?.closeAriaLabel?.trim() || "Close document");
  }
  requestClose(sourceEvent) {
    sourceEvent?.stopPropagation();
    this.activeConfig()?.onClose?.();
  }
  toggleSectionSelection(section, event) {
    event?.preventDefault();
    event?.stopPropagation();
    event?.stopImmediatePropagation();
    if (!section.toggleable) {
      return;
    }
    const next = new Set(this.selectedSectionIds);
    if (next.has(section.id)) {
      next.delete(section.id);
    } else {
      next.add(section.id);
    }
    this.selectedSectionIds = next;
  }
  documentAccordionModel() {
    const config = this.activeConfig();
    return {
      items: this.resolvedSections().map((section) => ({
        id: section.id,
        title: section.title,
        icon: section.icon,
        palette: this.sectionAccordionPalette(section),
        open: this.openSectionId === section.id,
        selectable: section.toggleable === true,
        selected: this.isSectionSelected(section),
        selectionAriaLabel: this.selectionAriaLabel(section),
        context: section
      })),
      multi: false,
      labelSize: "large"
    };
  }
  documentSectionFromItem(item) {
    return item.context ?? this.resolvedSections().find((section) => section.id === item.id) ?? null;
  }
  onDocumentAccordionToggle(event) {
    this.openSectionId = event.open ? event.id : "";
  }
  onDocumentAccordionSelectionToggle(event) {
    const section = this.documentSectionFromItem(event.item);
    if (!section) {
      return;
    }
    this.toggleSectionSelection(section, event.sourceEvent);
  }
  isSectionSelected(section) {
    return this.selectedSectionIds.has(section.id);
  }
  sectionAccordionPalette(section) {
    if (section.tone === "mandatory") {
      return "amber";
    }
    if (section.tone === "optional") {
      return "blue";
    }
    return "slate";
  }
  selectionAriaLabel(section) {
    const title = section.title?.trim() || this.uiText("Section");
    return this.isSectionSelected(section) ? this.uiText(`${title} selected`) : this.uiText(`Select ${title}`);
  }
  visibleActions() {
    return (this.activeConfig()?.actions ?? []).filter((action) => this.isActionVisible(action.visible));
  }
  actionMenuItems() {
    return this.visibleActions().map((action) => ({
      id: action.id,
      label: action.label,
      icon: action.icon ?? void 0,
      kind: "action",
      layout: "action",
      palette: action.palette ?? "blue",
      disabled: action.disabled === true,
      progress: action.progress ?? null,
      ariaLabel: action.label
    }));
  }
  onActionMenuSelect(event) {
    const action = this.visibleActions().find((item) => item.id === event.id);
    if (!action || action.disabled) {
      return;
    }
    this.emitDocumentAction(action, event.sourceEvent);
  }
  statusToneClass() {
    return this.activeConfig()?.statusTone === "error" ? "document-viewer-status-message-error" : "document-viewer-status-message-default";
  }
  statusMessage() {
    return this.activeConfig()?.statusMessage?.trim() ?? "";
  }
  emptyIcon() {
    return this.activeConfig()?.emptyState?.icon?.trim() || "description";
  }
  emptyTitle() {
    return this.uiText(this.activeConfig()?.emptyState?.title?.trim() || "Document is not available");
  }
  emptyDescription() {
    return this.uiText(this.activeConfig()?.emptyState?.description?.trim() || "Document content is not available right now.");
  }
  uiText(value) {
    return this.i18n.translateParams(value, { productName: this.deploymentBranding().productName });
  }
  syncSelectionFromConfig() {
    const config = this.activeConfig();
    const sections = config?.sections ?? [];
    const sectionSignature = sections.map((section) => `${section.id}:${section.toggleable === true}:${section.selected === true}`).join("|");
    const selectedIds = config?.selectedSectionIds ? config.selectedSectionIds.map((sectionId) => `${sectionId ?? ""}`.trim()).filter(Boolean) : sections.filter((section) => section.selected === true).map((section) => section.id);
    const selectionInputSignature = selectedIds.join("|");
    if (sectionSignature === this.sectionSignature && selectionInputSignature === this.selectionInputSignature) {
      return;
    }
    this.sectionSignature = sectionSignature;
    this.selectionInputSignature = selectionInputSignature;
    this.selectedSectionIds = new Set(selectedIds);
    this.initialSelectedSectionIds = new Set(selectedIds);
  }
  syncOpenSection() {
    const sections = this.activeConfig()?.sections ?? [];
    const nextSignature = sections.map((section) => section.id).join("|");
    if (sections.length === 0) {
      this.openSectionSignature = "";
      this.openSectionId = "";
      return;
    }
    const signatureChanged = nextSignature !== this.openSectionSignature;
    this.openSectionSignature = nextSignature;
    if (!signatureChanged) {
      if (this.openSectionId && !sections.some((section) => section.id === this.openSectionId)) {
        this.openSectionId = sections[0].id;
      }
      return;
    }
    if (!this.openSectionId || !sections.some((section) => section.id === this.openSectionId)) {
      this.openSectionId = sections[0].id;
    }
  }
  currentSelectedSectionIds() {
    return Array.from(this.selectedSectionIds).sort();
  }
  isSelectionDirty() {
    const current = this.currentSelectedSectionIds();
    const initial = Array.from(this.initialSelectedSectionIds).sort();
    if (current.length !== initial.length) {
      return true;
    }
    return current.some((sectionId, index) => sectionId !== initial[index]);
  }
  isActionVisible(visible) {
    if (visible === "dirty") {
      return this.isSelectionDirty();
    }
    return visible !== false;
  }
  emitDocumentAction(action, sourceEvent) {
    this.action.emit({
      id: action.id,
      action,
      selectedSectionIds: this.currentSelectedSectionIds(),
      sourceEvent: sourceEvent ?? new Event(action.id)
    });
  }
  normalizeHeaderPalette(value) {
    return AppUtils.enumValue(value, APP_STATIC_DATA.documentViewerHeaderPalettes, "amber");
  }
  activeConfig() {
    return this.config ?? this.routeConfig;
  }
  async prepareRouteDocument() {
    const data = this.route.snapshot.data;
    const kind = this.normalizeDocumentKind(data.documentKind);
    this.routeConfig = this.createRouteConfig(data, null, true);
    try {
      await this.helpCenter.preload(kind);
      this.routeConfig = this.createRouteConfig(data, this.activeRevision(kind), false);
      this.syncSelectionFromConfig();
      this.syncOpenSection();
    } catch {
      this.routeConfig = this.createRouteConfig(data, null, false);
    }
  }
  createRouteConfig(data, revision, loading) {
    const kind = this.normalizeDocumentKind(data.documentKind);
    return {
      shell: "page",
      open: true,
      ariaLabel: data.ariaLabel?.trim() || this.defaultAriaLabel(kind),
      title: revision?.summary?.trim() || data.title?.trim() || this.defaultTitle(kind),
      description: revision?.description?.trim() || data.description?.trim() || this.defaultDescription(kind),
      versionLabel: this.routeVersionLabel(revision?.version),
      headerPalette: this.routeHeaderPalette(kind, revision?.headerColor ?? data.headerPalette),
      loading,
      loadingLabel: data.loadingLabel?.trim() || this.defaultLoadingLabel(kind),
      emptyState: {
        icon: data.emptyIcon?.trim() || this.defaultEmptyIcon(kind),
        title: data.emptyTitle?.trim() || this.defaultEmptyTitle(kind),
        description: data.emptyDescription?.trim() || this.defaultEmptyDescription(kind)
      },
      sections: (revision?.sections ?? []).map((section) => ({
        id: section.id,
        icon: section.icon,
        title: section.title,
        blurb: section.blurb,
        contentHtml: section.contentHtml,
        points: section.points,
        details: section.details
      }))
    };
  }
  resolvedSections() {
    this.i18n.revision();
    const privacyContact = this.deploymentConfiguration.privacyContact();
    const text = {
      dataControllerLabel: this.i18n.translate("deployment.privacy.data.controller"),
      privacyContactEmailLabel: this.i18n.translate("deployment.privacy.contact.email"),
      contactNotPublished: this.i18n.translate("deployment.privacy.contact.not.published"),
      deletionEmailPrefix: this.i18n.translate("deployment.privacy.deletion.email.prefix"),
      deletionEmailSuffix: this.i18n.translate("deployment.privacy.deletion.email.suffix")
    };
    return (this.activeConfig()?.sections ?? []).map((section) => __spreadProps(__spreadValues({}, section), {
      contentHtml: resolveDeploymentPrivacyTokens(section.contentHtml, privacyContact, text)
    }));
  }
  activeRevision(kind) {
    if (kind === "privacy") {
      return this.helpCenter.activePrivacyRevision();
    }
    if (kind === "terms") {
      return this.helpCenter.activeTermsRevision();
    }
    return this.helpCenter.activeRevision();
  }
  normalizeDocumentKind(value) {
    return value === "privacy" || value === "terms" ? value : "help";
  }
  routeVersionLabel(version) {
    return Number.isFinite(Number(version)) && Number(version) > 0 ? `v${Math.trunc(Number(version))}` : "";
  }
  routeHeaderPalette(kind, value) {
    const normalized = this.normalizeHeaderPalette(value);
    return kind === "help" && normalized === "amber" ? "teal" : normalized;
  }
  defaultAriaLabel(kind) {
    if (kind === "privacy") {
      return "GDPR consent";
    }
    if (kind === "terms") {
      return "Terms of service";
    }
    return "Help";
  }
  defaultTitle(kind) {
    if (kind === "privacy") {
      return "Privacy first";
    }
    if (kind === "terms") {
      return "Usage terms";
    }
    return "Help";
  }
  defaultDescription(kind) {
    if (kind === "terms") {
      return "document.terms.description";
    }
    return "";
  }
  defaultLoadingLabel(kind) {
    if (kind === "privacy") {
      return "Loading privacy content";
    }
    if (kind === "terms") {
      return "Loading terms content";
    }
    return "Loading help content";
  }
  defaultEmptyIcon(kind) {
    if (kind === "privacy") {
      return "policy";
    }
    if (kind === "terms") {
      return "rule";
    }
    return "help_outline";
  }
  defaultEmptyTitle(kind) {
    if (kind === "privacy") {
      return "Privacy is not available";
    }
    if (kind === "terms") {
      return "Terms are not available";
    }
    return "Help is not available";
  }
  defaultEmptyDescription(kind) {
    if (kind === "privacy") {
      return "Privacy content is not available right now.";
    }
    if (kind === "terms") {
      return "Terms content is not available right now.";
    }
    return "Help content is not available right now.";
  }
  static \u0275fac = function DocumentViewerComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _DocumentViewerComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _DocumentViewerComponent, selectors: [["app-document-viewer"]], inputs: { config: "config" }, outputs: { action: "action" }, features: [\u0275\u0275NgOnChangesFeature], decls: 1, vars: 1, consts: [["documentViewerBody", ""], ["documentSectionTemplate", ""], [3, "model", "zIndex"], [1, "document-viewer-page"], [1, "document-viewer-content"], [1, "document-viewer-status", "document-viewer-status-loading"], [1, "document-viewer-status"], [1, "document-viewer-actions", 3, "document-viewer-actions-single"], ["kind", "load-ring", "state", "loading"], [1, "document-viewer-accordion", 3, "itemToggle", "itemSelectionToggle", "model", "itemTemplate"], [1, "document-viewer-section-body"], ["data-i18n-ignore", "", 1, "document-viewer-lead"], ["appLazyBgImage", "", "data-i18n-ignore", "", 1, "document-viewer-html", 3, "appLazyHtmlImages", "innerHTML"], [1, "document-viewer-list"], ["data-i18n-ignore", ""], [1, "document-viewer-actions"], ["role", "status", 1, "document-viewer-status-message", 3, "ngClass"], ["kind", "inline", "layout", "row", 1, "document-viewer-action-menu", 3, "items"], ["kind", "inline", "layout", "row", 1, "document-viewer-action-menu", 3, "itemSelect", "items"], [3, "ngTemplateOutlet"], [1, "document-viewer-page-panel"], [1, "document-viewer-head", 3, "ngClass"], ["href", "/", 1, "document-viewer-brand"], [1, "document-viewer-head-row"], [1, "document-viewer-title-wrap"], [1, "document-viewer-version"], [3, "branding"]], template: function DocumentViewerComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275conditionalCreate(0, DocumentViewerComponent_Conditional_0_Template, 4, 1);
    }
    if (rf & 2) {
      \u0275\u0275conditional(ctx.isOpen() ? 0 : -1);
    }
  }, dependencies: [
    CommonModule,
    NgClass,
    NgTemplateOutlet,
    MatIconModule,
    MatIcon,
    LazyBgImageDirective,
    AccordionComponent,
    DeploymentBrandComponent,
    IndicatorComponent,
    AppMenuComponent,
    PopupComponent
  ], styles: ["\n[_nghost-%COMP%] {\n  display: contents;\n}\n.document-viewer-page[_ngcontent-%COMP%] {\n  box-sizing: border-box;\n  min-height: 0;\n  height: 100vh;\n  overflow: hidden;\n  display: grid;\n  place-items: stretch;\n  background:\n    radial-gradient(\n      circle at top left,\n      rgba(80, 96, 125, 0.12),\n      transparent 34rem),\n    linear-gradient(\n      180deg,\n      #f8fbff 0%,\n      #ffffff 46%,\n      #f7f8fc 100%);\n  color: #172033;\n  padding: 36px 16px 64px;\n}\n.document-viewer-page-panel[_ngcontent-%COMP%] {\n  position: relative;\n  z-index: 1;\n  overflow: hidden;\n  display: grid;\n  grid-template-rows: auto minmax(0, 1fr) auto;\n  border: 1px solid rgba(198, 210, 226, 0.92);\n  background: #fff;\n  color: #172033;\n}\n.document-viewer-page-panel[_ngcontent-%COMP%] {\n  width: min(920px, 100%);\n  height: 100%;\n  min-height: 0;\n  margin: 0 auto;\n  border: 1px solid rgba(35, 45, 72, 0.1);\n  border-radius: 14px;\n  box-shadow: 0 18px 58px rgba(45, 57, 86, 0.14);\n}\n.document-viewer-head[_ngcontent-%COMP%] {\n  --document-viewer-header-bg:\n    linear-gradient(\n      180deg,\n      #eef3f8 0%,\n      #f8fafc 100%);\n  --document-viewer-header-border: rgba(72, 92, 118, 0.24);\n  --document-viewer-header-title: #304157;\n  --document-viewer-header-text: rgba(48, 65, 87, 0.78);\n  --document-viewer-header-pill-bg: #40566f;\n  border-bottom: 1px solid var(--document-viewer-header-border);\n  background: var(--document-viewer-header-bg);\n}\n.document-viewer-header-amber[_ngcontent-%COMP%] {\n  --document-viewer-header-bg:\n    linear-gradient(\n      180deg,\n      #fbf4e8 0%,\n      #fffaf0 100%);\n  --document-viewer-header-border: rgba(157, 118, 41, 0.24);\n  --document-viewer-header-title: #7c5618;\n  --document-viewer-header-text: rgba(108, 74, 19, 0.84);\n  --document-viewer-header-pill-bg: #b66a15;\n}\n.document-viewer-header-blue[_ngcontent-%COMP%] {\n  --document-viewer-header-bg:\n    linear-gradient(\n      180deg,\n      #eef6ff 0%,\n      #f8fbff 100%);\n  --document-viewer-header-border: rgba(53, 96, 162, 0.24);\n  --document-viewer-header-title: #1f3f6f;\n  --document-viewer-header-text: rgba(46, 78, 119, 0.84);\n  --document-viewer-header-pill-bg: #2f6fae;\n}\n.document-viewer-header-green[_ngcontent-%COMP%] {\n  --document-viewer-header-bg:\n    linear-gradient(\n      180deg,\n      #f0fbf3 0%,\n      #e4f7ea 100%);\n  --document-viewer-header-border: rgba(58, 143, 91, 0.3);\n  --document-viewer-header-title: #246b42;\n  --document-viewer-header-text: rgba(35, 94, 58, 0.84);\n  --document-viewer-header-pill-bg: #1f7a49;\n}\n.document-viewer-header-teal[_ngcontent-%COMP%] {\n  --document-viewer-header-bg:\n    linear-gradient(\n      180deg,\n      #eefafa 0%,\n      #f7fdfd 100%);\n  --document-viewer-header-border: rgba(33, 126, 132, 0.24);\n  --document-viewer-header-title: #17646d;\n  --document-viewer-header-text: rgba(28, 91, 99, 0.84);\n  --document-viewer-header-pill-bg: #197987;\n}\n.document-viewer-header-rose[_ngcontent-%COMP%] {\n  --document-viewer-header-bg:\n    linear-gradient(\n      180deg,\n      #fff1f4 0%,\n      #fff8fa 100%);\n  --document-viewer-header-border: rgba(178, 69, 98, 0.26);\n  --document-viewer-header-title: #8c2e49;\n  --document-viewer-header-text: rgba(122, 45, 70, 0.84);\n  --document-viewer-header-pill-bg: #b94462;\n}\n.document-viewer-header-violet[_ngcontent-%COMP%] {\n  --document-viewer-header-bg:\n    linear-gradient(\n      180deg,\n      #f5f0ff 0%,\n      #fbf8ff 100%);\n  --document-viewer-header-border: rgba(107, 80, 175, 0.26);\n  --document-viewer-header-title: #50398e;\n  --document-viewer-header-text: rgba(75, 52, 128, 0.84);\n  --document-viewer-header-pill-bg: #6b50af;\n}\n.document-viewer-header-slate[_ngcontent-%COMP%] {\n  --document-viewer-header-bg:\n    linear-gradient(\n      180deg,\n      #eef3f8 0%,\n      #f8fafc 100%);\n  --document-viewer-header-border: rgba(72, 92, 118, 0.24);\n  --document-viewer-header-title: #304157;\n  --document-viewer-header-text: rgba(48, 65, 87, 0.78);\n  --document-viewer-header-pill-bg: #40566f;\n}\n.document-viewer-brand[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 10px;\n  width: fit-content;\n  margin: 18px 20px 0;\n  color: inherit;\n  text-decoration: none;\n  font-weight: 800;\n  font-size: 1.2rem;\n  --deployment-brand-logo-size: 40px;\n  --deployment-brand-gap: 10px;\n}\n.document-viewer-brand[_ngcontent-%COMP%]   app-deployment-brand[_ngcontent-%COMP%] {\n  filter: drop-shadow(0 8px 11px rgba(71, 68, 158, 0.18));\n}\n.document-viewer-head-row[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: minmax(0, 1fr) auto;\n  gap: 16px;\n  align-items: start;\n  padding: 18px 20px;\n}\n.document-viewer-title-wrap[_ngcontent-%COMP%] {\n  min-width: 0;\n}\n.document-viewer-title-wrap[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%], \n.document-viewer-title-wrap[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0;\n}\n.document-viewer-title-wrap[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n  color: var(--document-viewer-header-title);\n  font-size: 1.45rem;\n  line-height: 1.12;\n}\n.document-viewer-title-wrap[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin-top: 6px;\n  color: var(--document-viewer-header-text);\n  line-height: 1.45;\n  font-weight: 400;\n}\n.document-viewer-version[_ngcontent-%COMP%] {\n  align-self: start;\n  border-radius: 999px;\n  background: var(--document-viewer-header-pill-bg);\n  color: #fff;\n  padding: 5px 10px;\n  font-size: 0.78rem;\n  font-weight: 800;\n}\n.document-viewer-content[_ngcontent-%COMP%] {\n  flex: 1 1 auto;\n  overflow: auto;\n  min-height: 0;\n  padding: 18px;\n  background: #f8fbff;\n}\n.document-viewer-accordion[_ngcontent-%COMP%] {\n  display: block;\n}\n.document-viewer-section-body[_ngcontent-%COMP%] {\n  padding: 0.1rem 0.25rem 0.2rem;\n  color: #33405a;\n  line-height: 1.62;\n}\n.document-viewer-lead[_ngcontent-%COMP%] {\n  margin: 0 0 12px;\n  color: #4b5872;\n  line-height: 1.58;\n}\n.document-viewer-html[_ngcontent-%COMP%]   :is(p[_ngcontent-%COMP%], ul[_ngcontent-%COMP%], ol[_ngcontent-%COMP%]) {\n  margin: 0 0 12px;\n  color: #26374f;\n  line-height: 1.55;\n}\n.document-viewer-html[_ngcontent-%COMP%]   :is(h3[_ngcontent-%COMP%], h4[_ngcontent-%COMP%]) {\n  margin: 18px 0 10px;\n  color: #172033;\n}\n.document-viewer-html[_ngcontent-%COMP%]   ul[_ngcontent-%COMP%], \n.document-viewer-html[_ngcontent-%COMP%]   ol[_ngcontent-%COMP%], \n.document-viewer-list[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 8px;\n  margin: 0 0 12px;\n  padding-left: 1.2rem;\n  color: #26374f;\n}\n.document-viewer-html[_ngcontent-%COMP%]   :is(figure[_ngcontent-%COMP%]) {\n  margin: 0.85rem 0;\n}\n.document-viewer-html[_ngcontent-%COMP%]   :is(img[_ngcontent-%COMP%]) {\n  max-width: 100%;\n  height: auto;\n  border-radius: 8px;\n}\n.document-viewer-status[_ngcontent-%COMP%] {\n  display: grid;\n  place-items: center;\n  min-height: 220px;\n  border: 1px dashed rgba(83, 105, 139, 0.24);\n  border-radius: 8px;\n  background: rgba(247, 250, 254, 0.82);\n  color: rgba(44, 63, 92, 0.72);\n  text-align: center;\n  padding: 2rem;\n}\n.document-viewer-status[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%], \n.document-viewer-status[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0;\n}\n.document-viewer-status[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  margin-bottom: 0.45rem;\n  color: #6d86a8;\n}\n.document-viewer-status-loading[_ngcontent-%COMP%] {\n  gap: 0.7rem;\n  min-height: 180px;\n  font-weight: 800;\n}\n.document-viewer-actions[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: flex-end;\n  gap: 12px;\n  border-top: 1px solid rgba(35, 45, 72, 0.1);\n  background: #fff;\n  padding: 14px 18px;\n}\n.document-viewer-actions-single[_ngcontent-%COMP%] {\n  justify-content: flex-end;\n}\n.document-viewer-status-message[_ngcontent-%COMP%] {\n  margin-right: auto;\n  font-size: 0.9rem;\n  font-weight: 700;\n}\n.document-viewer-status-message-default[_ngcontent-%COMP%] {\n  color: rgba(36, 65, 104, 0.72);\n}\n.document-viewer-status-message-error[_ngcontent-%COMP%] {\n  color: #9b2c37;\n}\n.document-viewer-action-menu[_ngcontent-%COMP%] {\n  display: inline-flex;\n}\n@media (max-width: 760px) {\n  .document-viewer-page[_ngcontent-%COMP%] {\n    padding: 0;\n  }\n  .document-viewer-page-panel[_ngcontent-%COMP%] {\n    width: 100vw;\n    height: 100vh;\n    max-height: none;\n    min-height: 0;\n    border-radius: 0;\n    border-inline: 0;\n  }\n  .document-viewer-head-row[_ngcontent-%COMP%] {\n    grid-template-columns: minmax(0, 1fr) max-content;\n    gap: 10px;\n  }\n  .document-viewer-version[_ngcontent-%COMP%] {\n    justify-self: start;\n  }\n  .document-viewer-content[_ngcontent-%COMP%] {\n    padding: 0.8rem;\n  }\n  .document-viewer-actions[_ngcontent-%COMP%] {\n    align-items: stretch;\n    flex-direction: column;\n  }\n  .document-viewer-status-message[_ngcontent-%COMP%] {\n    margin-right: 0;\n  }\n}\n/*# sourceMappingURL=document-viewer.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(DocumentViewerComponent, [{
    type: Component,
    args: [{ selector: "app-document-viewer", standalone: true, imports: [
      CommonModule,
      MatIconModule,
      LazyBgImageDirective,
      AccordionComponent,
      DeploymentBrandComponent,
      IndicatorComponent,
      AppMenuComponent,
      PopupComponent
    ], template: '@if (isOpen()) {\n  <ng-template #documentViewerBody>\n    <div class="document-viewer-content">\n      @if (loading()) {\n        <article class="document-viewer-status document-viewer-status-loading">\n          <app-indicator\n            kind="load-ring"\n            state="loading"\n          ></app-indicator>\n          <span>{{ loadingLabel() }}</span>\n        </article>\n      } @else if (activeConfig()?.sections?.length) {\n        <app-accordion\n          class="document-viewer-accordion"\n          [model]="documentAccordionModel()"\n          [itemTemplate]="documentSectionTemplate"\n          (itemToggle)="onDocumentAccordionToggle($event)"\n          (itemSelectionToggle)="onDocumentAccordionSelectionToggle($event)"\n        ></app-accordion>\n        <ng-template #documentSectionTemplate let-item>\n          @if (documentSectionFromItem(item); as section) {\n            <div class="document-viewer-section-body">\n              @if (section.blurb) {\n                <p class="document-viewer-lead" data-i18n-ignore>{{ section.blurb }}</p>\n              }\n              @if (section.contentHtml) {\n                <div\n                  class="document-viewer-html"\n                  appLazyBgImage\n                  [appLazyHtmlImages]="true"\n                  data-i18n-ignore\n                  [innerHTML]="section.contentHtml"\n                ></div>\n              }\n              @if (section.points?.length) {\n                <ul class="document-viewer-list">\n                  @for (point of section.points; track point) {\n                    <li data-i18n-ignore>{{ point }}</li>\n                  }\n                </ul>\n              }\n              @if (section.details?.length) {\n                <ul class="document-viewer-list">\n                  @for (detail of section.details; track detail) {\n                    <li data-i18n-ignore>{{ detail }}</li>\n                  }\n                </ul>\n              }\n            </div>\n          }\n        </ng-template>\n      } @else {\n        <article class="document-viewer-status">\n          <mat-icon>{{ emptyIcon() }}</mat-icon>\n          <h4>{{ emptyTitle() }}</h4>\n          <p>{{ emptyDescription() }}</p>\n        </article>\n      }\n    </div>\n\n    @if (statusMessage() || visibleActions().length > 0) {\n      <footer class="document-viewer-actions" [class.document-viewer-actions-single]="visibleActions().length <= 1">\n        @if (statusMessage()) {\n          <span class="document-viewer-status-message" [ngClass]="statusToneClass()" role="status">{{ statusMessage() }}</span>\n        }\n        @if (visibleActions().length > 0) {\n          <app-menu\n            class="document-viewer-action-menu"\n            kind="inline"\n            layout="row"\n            [items]="actionMenuItems()"\n            (itemSelect)="onActionMenuSelect($event)"\n          ></app-menu>\n        }\n      </footer>\n    }\n  </ng-template>\n\n  @if (isPopupShell()) {\n    <app-popup [model]="documentPopupModel()" [zIndex]="2400">\n      <ng-container [ngTemplateOutlet]="documentViewerBody"></ng-container>\n    </app-popup>\n  } @else {\n    <section class="document-viewer-page" [attr.aria-label]="ariaLabel()">\n      <article class="document-viewer-page-panel">\n        <header class="document-viewer-head" [ngClass]="headerPaletteClass()">\n          @if (showBrand()) {\n            <a class="document-viewer-brand" href="/">\n              <app-deployment-brand\n                [branding]="deploymentBranding()"\n              ></app-deployment-brand>\n            </a>\n          }\n          <div class="document-viewer-head-row">\n            <div class="document-viewer-title-wrap">\n              <h2>\n                <span data-i18n-ignore>{{ title() }}</span>\n              </h2>\n              @if (description()) {\n                <p data-i18n-ignore>{{ description() }}</p>\n              }\n            </div>\n            @if (versionLabel()) {\n              <span class="document-viewer-version">{{ versionLabel() }}</span>\n            }\n          </div>\n        </header>\n\n        <ng-container [ngTemplateOutlet]="documentViewerBody"></ng-container>\n      </article>\n    </section>\n  }\n}\n', styles: ["/* src/app/shared/ui/components/document-viewer/document-viewer.component.scss */\n:host {\n  display: contents;\n}\n.document-viewer-page {\n  box-sizing: border-box;\n  min-height: 0;\n  height: 100vh;\n  overflow: hidden;\n  display: grid;\n  place-items: stretch;\n  background:\n    radial-gradient(\n      circle at top left,\n      rgba(80, 96, 125, 0.12),\n      transparent 34rem),\n    linear-gradient(\n      180deg,\n      #f8fbff 0%,\n      #ffffff 46%,\n      #f7f8fc 100%);\n  color: #172033;\n  padding: 36px 16px 64px;\n}\n.document-viewer-page-panel {\n  position: relative;\n  z-index: 1;\n  overflow: hidden;\n  display: grid;\n  grid-template-rows: auto minmax(0, 1fr) auto;\n  border: 1px solid rgba(198, 210, 226, 0.92);\n  background: #fff;\n  color: #172033;\n}\n.document-viewer-page-panel {\n  width: min(920px, 100%);\n  height: 100%;\n  min-height: 0;\n  margin: 0 auto;\n  border: 1px solid rgba(35, 45, 72, 0.1);\n  border-radius: 14px;\n  box-shadow: 0 18px 58px rgba(45, 57, 86, 0.14);\n}\n.document-viewer-head {\n  --document-viewer-header-bg:\n    linear-gradient(\n      180deg,\n      #eef3f8 0%,\n      #f8fafc 100%);\n  --document-viewer-header-border: rgba(72, 92, 118, 0.24);\n  --document-viewer-header-title: #304157;\n  --document-viewer-header-text: rgba(48, 65, 87, 0.78);\n  --document-viewer-header-pill-bg: #40566f;\n  border-bottom: 1px solid var(--document-viewer-header-border);\n  background: var(--document-viewer-header-bg);\n}\n.document-viewer-header-amber {\n  --document-viewer-header-bg:\n    linear-gradient(\n      180deg,\n      #fbf4e8 0%,\n      #fffaf0 100%);\n  --document-viewer-header-border: rgba(157, 118, 41, 0.24);\n  --document-viewer-header-title: #7c5618;\n  --document-viewer-header-text: rgba(108, 74, 19, 0.84);\n  --document-viewer-header-pill-bg: #b66a15;\n}\n.document-viewer-header-blue {\n  --document-viewer-header-bg:\n    linear-gradient(\n      180deg,\n      #eef6ff 0%,\n      #f8fbff 100%);\n  --document-viewer-header-border: rgba(53, 96, 162, 0.24);\n  --document-viewer-header-title: #1f3f6f;\n  --document-viewer-header-text: rgba(46, 78, 119, 0.84);\n  --document-viewer-header-pill-bg: #2f6fae;\n}\n.document-viewer-header-green {\n  --document-viewer-header-bg:\n    linear-gradient(\n      180deg,\n      #f0fbf3 0%,\n      #e4f7ea 100%);\n  --document-viewer-header-border: rgba(58, 143, 91, 0.3);\n  --document-viewer-header-title: #246b42;\n  --document-viewer-header-text: rgba(35, 94, 58, 0.84);\n  --document-viewer-header-pill-bg: #1f7a49;\n}\n.document-viewer-header-teal {\n  --document-viewer-header-bg:\n    linear-gradient(\n      180deg,\n      #eefafa 0%,\n      #f7fdfd 100%);\n  --document-viewer-header-border: rgba(33, 126, 132, 0.24);\n  --document-viewer-header-title: #17646d;\n  --document-viewer-header-text: rgba(28, 91, 99, 0.84);\n  --document-viewer-header-pill-bg: #197987;\n}\n.document-viewer-header-rose {\n  --document-viewer-header-bg:\n    linear-gradient(\n      180deg,\n      #fff1f4 0%,\n      #fff8fa 100%);\n  --document-viewer-header-border: rgba(178, 69, 98, 0.26);\n  --document-viewer-header-title: #8c2e49;\n  --document-viewer-header-text: rgba(122, 45, 70, 0.84);\n  --document-viewer-header-pill-bg: #b94462;\n}\n.document-viewer-header-violet {\n  --document-viewer-header-bg:\n    linear-gradient(\n      180deg,\n      #f5f0ff 0%,\n      #fbf8ff 100%);\n  --document-viewer-header-border: rgba(107, 80, 175, 0.26);\n  --document-viewer-header-title: #50398e;\n  --document-viewer-header-text: rgba(75, 52, 128, 0.84);\n  --document-viewer-header-pill-bg: #6b50af;\n}\n.document-viewer-header-slate {\n  --document-viewer-header-bg:\n    linear-gradient(\n      180deg,\n      #eef3f8 0%,\n      #f8fafc 100%);\n  --document-viewer-header-border: rgba(72, 92, 118, 0.24);\n  --document-viewer-header-title: #304157;\n  --document-viewer-header-text: rgba(48, 65, 87, 0.78);\n  --document-viewer-header-pill-bg: #40566f;\n}\n.document-viewer-brand {\n  display: inline-flex;\n  align-items: center;\n  gap: 10px;\n  width: fit-content;\n  margin: 18px 20px 0;\n  color: inherit;\n  text-decoration: none;\n  font-weight: 800;\n  font-size: 1.2rem;\n  --deployment-brand-logo-size: 40px;\n  --deployment-brand-gap: 10px;\n}\n.document-viewer-brand app-deployment-brand {\n  filter: drop-shadow(0 8px 11px rgba(71, 68, 158, 0.18));\n}\n.document-viewer-head-row {\n  display: grid;\n  grid-template-columns: minmax(0, 1fr) auto;\n  gap: 16px;\n  align-items: start;\n  padding: 18px 20px;\n}\n.document-viewer-title-wrap {\n  min-width: 0;\n}\n.document-viewer-title-wrap h2,\n.document-viewer-title-wrap p {\n  margin: 0;\n}\n.document-viewer-title-wrap h2 {\n  color: var(--document-viewer-header-title);\n  font-size: 1.45rem;\n  line-height: 1.12;\n}\n.document-viewer-title-wrap p {\n  margin-top: 6px;\n  color: var(--document-viewer-header-text);\n  line-height: 1.45;\n  font-weight: 400;\n}\n.document-viewer-version {\n  align-self: start;\n  border-radius: 999px;\n  background: var(--document-viewer-header-pill-bg);\n  color: #fff;\n  padding: 5px 10px;\n  font-size: 0.78rem;\n  font-weight: 800;\n}\n.document-viewer-content {\n  flex: 1 1 auto;\n  overflow: auto;\n  min-height: 0;\n  padding: 18px;\n  background: #f8fbff;\n}\n.document-viewer-accordion {\n  display: block;\n}\n.document-viewer-section-body {\n  padding: 0.1rem 0.25rem 0.2rem;\n  color: #33405a;\n  line-height: 1.62;\n}\n.document-viewer-lead {\n  margin: 0 0 12px;\n  color: #4b5872;\n  line-height: 1.58;\n}\n.document-viewer-html :is(p, ul, ol) {\n  margin: 0 0 12px;\n  color: #26374f;\n  line-height: 1.55;\n}\n.document-viewer-html :is(h3, h4) {\n  margin: 18px 0 10px;\n  color: #172033;\n}\n.document-viewer-html ul,\n.document-viewer-html ol,\n.document-viewer-list {\n  display: grid;\n  gap: 8px;\n  margin: 0 0 12px;\n  padding-left: 1.2rem;\n  color: #26374f;\n}\n.document-viewer-html :is(figure) {\n  margin: 0.85rem 0;\n}\n.document-viewer-html :is(img) {\n  max-width: 100%;\n  height: auto;\n  border-radius: 8px;\n}\n.document-viewer-status {\n  display: grid;\n  place-items: center;\n  min-height: 220px;\n  border: 1px dashed rgba(83, 105, 139, 0.24);\n  border-radius: 8px;\n  background: rgba(247, 250, 254, 0.82);\n  color: rgba(44, 63, 92, 0.72);\n  text-align: center;\n  padding: 2rem;\n}\n.document-viewer-status h4,\n.document-viewer-status p {\n  margin: 0;\n}\n.document-viewer-status .mat-icon {\n  margin-bottom: 0.45rem;\n  color: #6d86a8;\n}\n.document-viewer-status-loading {\n  gap: 0.7rem;\n  min-height: 180px;\n  font-weight: 800;\n}\n.document-viewer-actions {\n  display: flex;\n  align-items: center;\n  justify-content: flex-end;\n  gap: 12px;\n  border-top: 1px solid rgba(35, 45, 72, 0.1);\n  background: #fff;\n  padding: 14px 18px;\n}\n.document-viewer-actions-single {\n  justify-content: flex-end;\n}\n.document-viewer-status-message {\n  margin-right: auto;\n  font-size: 0.9rem;\n  font-weight: 700;\n}\n.document-viewer-status-message-default {\n  color: rgba(36, 65, 104, 0.72);\n}\n.document-viewer-status-message-error {\n  color: #9b2c37;\n}\n.document-viewer-action-menu {\n  display: inline-flex;\n}\n@media (max-width: 760px) {\n  .document-viewer-page {\n    padding: 0;\n  }\n  .document-viewer-page-panel {\n    width: 100vw;\n    height: 100vh;\n    max-height: none;\n    min-height: 0;\n    border-radius: 0;\n    border-inline: 0;\n  }\n  .document-viewer-head-row {\n    grid-template-columns: minmax(0, 1fr) max-content;\n    gap: 10px;\n  }\n  .document-viewer-version {\n    justify-self: start;\n  }\n  .document-viewer-content {\n    padding: 0.8rem;\n  }\n  .document-viewer-actions {\n    align-items: stretch;\n    flex-direction: column;\n  }\n  .document-viewer-status-message {\n    margin-right: 0;\n  }\n}\n/*# sourceMappingURL=document-viewer.component.css.map */\n"] }]
  }], null, { config: [{
    type: Input
  }], action: [{
    type: Output
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(DocumentViewerComponent, { className: "DocumentViewerComponent", filePath: "app/shared/ui/components/document-viewer/document-viewer.component.ts", lineNumber: 51 });
})();

export {
  AccordionComponent,
  DocumentViewerComponent
};
//# sourceMappingURL=chunk-D742Q5CX.js.map
