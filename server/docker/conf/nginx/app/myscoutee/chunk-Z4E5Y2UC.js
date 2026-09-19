import {
  IndicatorComponent
} from "./chunk-53UGBDSO.js";
import {
  MatIcon,
  MatIconModule
} from "./chunk-L6HJFJOR.js";
import {
  CommonModule,
  NgClass,
  NgStyle
} from "./chunk-SCHUURLR.js";
import {
  Component,
  EventEmitter,
  Input,
  Output,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵclassProp,
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
  ɵɵproperty,
  ɵɵreadContextLet,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵstoreLet,
  ɵɵstyleProp,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1
} from "./chunk-EV3I3YNV.js";

// src/app/shared/ui/components/core/smart-list/card/header-card/header-card.component.ts
function HeaderCardComponent_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 3);
    \u0275\u0275element(1, "app-indicator", 9);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275nextContext();
    const card_r1 = \u0275\u0275readContextLet(0);
    \u0275\u0275advance();
    \u0275\u0275property("state", (card_r1 == null ? null : card_r1.ringState) || "loading");
  }
}
function HeaderCardComponent_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0);
  }
  if (rf & 2) {
    \u0275\u0275nextContext();
    const card_r1 = \u0275\u0275readContextLet(0);
    \u0275\u0275textInterpolate1(" ", (card_r1 == null ? null : card_r1.initials) || "", " ");
  }
}
function HeaderCardComponent_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 10);
    \u0275\u0275listener("click", function HeaderCardComponent_Conditional_7_Template_button_click_0_listener($event) {
      \u0275\u0275restoreView(_r2);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.onEdit($event));
    });
    \u0275\u0275elementStart(1, "mat-icon");
    \u0275\u0275text(2, "edit");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    \u0275\u0275nextContext();
    const card_r1 = \u0275\u0275readContextLet(0);
    \u0275\u0275property("disabled", (card_r1 == null ? null : card_r1.editDisabled) === true);
    \u0275\u0275attribute("aria-label", (card_r1 == null ? null : card_r1.editAriaLabel) || "Edit");
  }
}
function HeaderCardComponent_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 6)(1, "span");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    \u0275\u0275nextContext();
    const card_r1 = \u0275\u0275readContextLet(0);
    \u0275\u0275property("ngStyle", (card_r1 == null ? null : card_r1.badgeStyle) ?? null);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(card_r1 == null ? null : card_r1.badgeLabel);
  }
}
function HeaderCardComponent_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 8)(1, "mat-icon");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    \u0275\u0275nextContext();
    const card_r1 = \u0275\u0275readContextLet(0);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate((card_r1 == null ? null : card_r1.metaIcon) || "location_on");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(card_r1 == null ? null : card_r1.meta);
  }
}
var HeaderCardComponent = class _HeaderCardComponent {
  model = null;
  edit = new EventEmitter();
  onEdit(event) {
    event.stopPropagation();
    if (this.model?.editDisabled === true) {
      return;
    }
    this.edit.emit(event);
  }
  static \u0275fac = function HeaderCardComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _HeaderCardComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _HeaderCardComponent, selectors: [["app-header-card"]], inputs: { model: "model" }, outputs: { edit: "edit" }, decls: 13, vars: 16, consts: [[1, "header-card", 3, "ngClass"], [1, "header-card__main"], [1, "header-card__avatar-stack"], ["aria-hidden", "true", 1, "header-card__ring"], [1, "header-card__avatar", 3, "ngClass"], ["type", "button", 1, "header-card__edit", 3, "disabled"], [1, "header-card__badge", 3, "ngStyle"], [1, "header-card__text"], [1, "header-card__meta"], ["kind", "action-ring", "shape", "circle", 3, "state"], ["type", "button", 1, "header-card__edit", 3, "click", "disabled"]], template: function HeaderCardComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275declareLet(0);
      \u0275\u0275elementStart(1, "section", 0)(2, "div", 1)(3, "div", 2);
      \u0275\u0275conditionalCreate(4, HeaderCardComponent_Conditional_4_Template, 2, 1, "span", 3);
      \u0275\u0275elementStart(5, "span", 4);
      \u0275\u0275conditionalCreate(6, HeaderCardComponent_Conditional_6_Template, 1, 1);
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(7, HeaderCardComponent_Conditional_7_Template, 3, 2, "button", 5);
      \u0275\u0275conditionalCreate(8, HeaderCardComponent_Conditional_8_Template, 3, 2, "span", 6);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(9, "div", 7)(10, "h3");
      \u0275\u0275text(11);
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(12, HeaderCardComponent_Conditional_12_Template, 5, 2, "span", 8);
      \u0275\u0275elementEnd()()();
    }
    if (rf & 2) {
      const card_r4 = \u0275\u0275storeLet(ctx.model);
      const imageUrl_r5 = (card_r4 == null ? null : card_r4.imageUrl) || null;
      const gender_r6 = (card_r4 == null ? null : card_r4.gender) || null;
      \u0275\u0275advance();
      \u0275\u0275classProp("header-card--admin", (card_r4 == null ? null : card_r4.admin) === true);
      \u0275\u0275property("ngClass", (card_r4 == null ? null : card_r4.statusClass) || "status-inactive");
      \u0275\u0275advance(2);
      \u0275\u0275attribute("title", (card_r4 == null ? null : card_r4.ringTitle) || null);
      \u0275\u0275advance();
      \u0275\u0275conditional((card_r4 == null ? null : card_r4.showRing) === true ? 4 : -1);
      \u0275\u0275advance();
      \u0275\u0275styleProp("background-image", imageUrl_r5 ? "url(" + imageUrl_r5 + ")" : null);
      \u0275\u0275classProp("has-photo", !!imageUrl_r5);
      \u0275\u0275property("ngClass", gender_r6 ? "user-color-" + gender_r6 : null);
      \u0275\u0275advance();
      \u0275\u0275conditional(!imageUrl_r5 ? 6 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional((card_r4 == null ? null : card_r4.showEdit) === true ? 7 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional((card_r4 == null ? null : card_r4.badgeLabel) ? 8 : -1);
      \u0275\u0275advance(3);
      \u0275\u0275textInterpolate((card_r4 == null ? null : card_r4.title) || "");
      \u0275\u0275advance();
      \u0275\u0275conditional((card_r4 == null ? null : card_r4.meta) ? 12 : -1);
    }
  }, dependencies: [CommonModule, NgClass, NgStyle, MatIconModule, MatIcon, IndicatorComponent], styles: ["\n[_nghost-%COMP%] {\n  display: block;\n}\n.header-card[_ngcontent-%COMP%] {\n  position: relative;\n  border: 1px solid rgba(23, 33, 54, 0.12);\n  border-radius: var(--app-header-card-radius, 12px);\n  background: #f9fcff;\n  padding: var(--app-header-card-padding, 0.66rem);\n  padding-top: var(--app-header-card-padding-top, var(--app-header-card-padding, 0.66rem));\n  min-width: 0;\n}\n.navigator-menu-header-card[_nghost-%COMP%]   .header-card[_ngcontent-%COMP%] {\n  border-radius: 0;\n}\n.header-card.status-public[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f5fbf7 0%,\n      #eef8f2 100%);\n  border-color: rgba(47, 143, 102, 0.24);\n}\n.header-card.status-friends[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f4f8ff 0%,\n      #edf4ff 100%);\n  border-color: rgba(44, 98, 170, 0.22);\n}\n.header-card.status-host[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #fff8f0 0%,\n      #fdf3e5 100%);\n  border-color: rgba(145, 96, 27, 0.24);\n}\n.header-card.status-inactive[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f7f9fc 0%,\n      #f1f4f8 100%);\n  border-color: rgba(88, 101, 121, 0.2);\n}\n.header-card.status-blocked[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #fff1f1 0%,\n      #f6d9d9 100%);\n  border-color: rgba(179, 52, 66, 0.38);\n}\n.header-card__main[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0.82rem;\n  min-width: 0;\n}\n.header-card--admin[_ngcontent-%COMP%]   .header-card__main[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: 96px minmax(0, 1fr);\n  column-gap: 0.95rem;\n}\n.header-card__avatar-stack[_ngcontent-%COMP%] {\n  --header-card-badge-overhang: var(--app-header-card-badge-overhang, 6px);\n  position: relative;\n  padding-bottom: var(--header-card-badge-overhang);\n  width: max-content;\n  max-width: 100%;\n}\n.header-card__ring[_ngcontent-%COMP%] {\n  position: absolute;\n  inset: -8px;\n  pointer-events: none;\n}\n.header-card__avatar[_ngcontent-%COMP%] {\n  width: 96px;\n  height: 96px;\n  border-radius: 50%;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  color: #fff;\n  font-size: 30px;\n  font-weight: 700;\n  letter-spacing: 0.02em;\n  overflow: hidden;\n  box-shadow: 0 6px 16px rgba(16, 30, 56, 0.24);\n}\n.header-card__avatar.has-photo[_ngcontent-%COMP%] {\n  background-size: cover;\n  background-position: center;\n  background-repeat: no-repeat;\n  color: transparent;\n  font-size: 0;\n}\n.user-color-woman[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      145deg,\n      #d3754c,\n      #ac4a24);\n}\n.user-color-man[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      145deg,\n      #3572a4,\n      #194364);\n}\n.header-card__edit[_ngcontent-%COMP%] {\n  position: absolute;\n  top: -6px;\n  right: -6px;\n  width: 30px;\n  height: 30px;\n  border: 0;\n  border-radius: 50%;\n  background: #2f7cc3;\n  color: #fff;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  box-shadow: 0 0 0 2px #fff;\n  cursor: pointer;\n  transition:\n    transform 0.16s ease,\n    box-shadow 0.16s ease,\n    background-color 0.16s ease;\n}\n.header-card__edit[_ngcontent-%COMP%]:disabled {\n  cursor: default;\n  opacity: 0.52;\n}\n.header-card__edit[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n  line-height: 16px;\n}\n.header-card__badge[_ngcontent-%COMP%] {\n  position: absolute;\n  left: 50%;\n  bottom: 0;\n  transform: translateX(-50%);\n  min-width: 0;\n  width: fit-content;\n  height: 24px;\n  border-radius: 999px;\n  background: #d8effa;\n  border: 1px solid #8ac9e2;\n  color: #1f6780;\n  font-size: 13px;\n  font-weight: 700;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  padding: 0 8px;\n}\n.header-card__text[_ngcontent-%COMP%] {\n  min-width: 0;\n  align-self: center;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  gap: 0.45rem;\n  text-align: center;\n  padding-top: var(--app-header-card-text-padding-top, 0);\n}\n.header-card--admin[_ngcontent-%COMP%]   .header-card__text[_ngcontent-%COMP%] {\n  align-items: flex-start;\n  align-self: stretch;\n  justify-content: center;\n  text-align: left;\n  gap: 0.24rem;\n  min-height: 96px;\n  padding: 2.05rem 0 0 0;\n}\n.header-card__text[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n  margin: 0;\n  color: #102541;\n  font-size: clamp(1.3rem, 2.4vw, 2rem);\n  line-height: 1.12;\n  font-weight: 800;\n}\n.header-card--admin[_ngcontent-%COMP%]   .header-card__text[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n  max-width: 100%;\n  font-size: 1.28rem;\n  overflow-wrap: anywhere;\n}\n.header-card__meta[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.24rem;\n  font-size: 1.02rem;\n  color: rgba(26, 45, 71, 0.78);\n  font-weight: 700;\n}\n.header-card--admin[_ngcontent-%COMP%]   .header-card__meta[_ngcontent-%COMP%] {\n  justify-content: flex-start;\n  max-width: 100%;\n  line-height: 1.18;\n  padding-right: 2.45rem;\n}\n.header-card__meta[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n  line-height: 16px;\n}\n@media (hover: hover) and (pointer: fine) {\n  .header-card__edit[_ngcontent-%COMP%]:not(:disabled):hover {\n    transform: translateY(-1px) scale(1.03);\n    background: #256aa9;\n    box-shadow: 0 0 0 2px #fff, 0 4px 10px rgba(31, 73, 120, 0.22);\n  }\n}\n.header-card__edit[_ngcontent-%COMP%]:not(:disabled):active {\n  transform: scale(0.92);\n  animation: none;\n}\n@media (prefers-reduced-motion: reduce) {\n  .header-card__edit[_ngcontent-%COMP%] {\n    transition: none;\n  }\n}\n@media (max-width: 640px) {\n  .header-card__avatar[_ngcontent-%COMP%] {\n    width: 74px;\n    height: 74px;\n    font-size: 24px;\n  }\n  .header-card--admin[_ngcontent-%COMP%]   .header-card__main[_ngcontent-%COMP%] {\n    grid-template-columns: 74px minmax(0, 1fr);\n  }\n  .header-card__text[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n    font-size: 1.4rem;\n  }\n  .header-card__meta[_ngcontent-%COMP%] {\n    font-size: 0.92rem;\n  }\n}\n/*# sourceMappingURL=header-card.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(HeaderCardComponent, [{
    type: Component,
    args: [{ selector: "app-header-card", standalone: true, imports: [CommonModule, MatIconModule, IndicatorComponent], template: `@let card = model;
@let imageUrl = card?.imageUrl || null;
@let gender = card?.gender || null;

<section
  class="header-card"
  [class.header-card--admin]="card?.admin === true"
  [ngClass]="card?.statusClass || 'status-inactive'"
>
  <div class="header-card__main">
    <div class="header-card__avatar-stack" [attr.title]="card?.ringTitle || null">
      @if (card?.showRing === true) {
        <span class="header-card__ring" aria-hidden="true">
          <app-indicator
            kind="action-ring"
            shape="circle"
            [state]="card?.ringState || 'loading'"
          ></app-indicator>
        </span>
      }
      <span
        class="header-card__avatar"
        [class.has-photo]="!!imageUrl"
        [ngClass]="gender ? 'user-color-' + gender : null"
        [style.backgroundImage]="imageUrl ? 'url(' + imageUrl + ')' : null"
      >
        @if (!imageUrl) {
          {{ card?.initials || '' }}
        }
      </span>
      @if (card?.showEdit === true) {
        <button
          type="button"
          class="header-card__edit"
          [disabled]="card?.editDisabled === true"
          [attr.aria-label]="card?.editAriaLabel || 'Edit'"
          (click)="onEdit($event)"
        >
          <mat-icon>edit</mat-icon>
        </button>
      }
      @if (card?.badgeLabel) {
        <span class="header-card__badge" [ngStyle]="card?.badgeStyle ?? null">
          <span>{{ card?.badgeLabel }}</span>
        </span>
      }
    </div>
    <div class="header-card__text">
      <h3>{{ card?.title || '' }}</h3>
      @if (card?.meta) {
        <span class="header-card__meta">
          <mat-icon>{{ card?.metaIcon || 'location_on' }}</mat-icon>
          <span>{{ card?.meta }}</span>
        </span>
      }
    </div>
  </div>
</section>
`, styles: ["/* src/app/shared/ui/components/core/smart-list/card/header-card/header-card.component.scss */\n:host {\n  display: block;\n}\n.header-card {\n  position: relative;\n  border: 1px solid rgba(23, 33, 54, 0.12);\n  border-radius: var(--app-header-card-radius, 12px);\n  background: #f9fcff;\n  padding: var(--app-header-card-padding, 0.66rem);\n  padding-top: var(--app-header-card-padding-top, var(--app-header-card-padding, 0.66rem));\n  min-width: 0;\n}\n:host(.navigator-menu-header-card) .header-card {\n  border-radius: 0;\n}\n.header-card.status-public {\n  background:\n    linear-gradient(\n      180deg,\n      #f5fbf7 0%,\n      #eef8f2 100%);\n  border-color: rgba(47, 143, 102, 0.24);\n}\n.header-card.status-friends {\n  background:\n    linear-gradient(\n      180deg,\n      #f4f8ff 0%,\n      #edf4ff 100%);\n  border-color: rgba(44, 98, 170, 0.22);\n}\n.header-card.status-host {\n  background:\n    linear-gradient(\n      180deg,\n      #fff8f0 0%,\n      #fdf3e5 100%);\n  border-color: rgba(145, 96, 27, 0.24);\n}\n.header-card.status-inactive {\n  background:\n    linear-gradient(\n      180deg,\n      #f7f9fc 0%,\n      #f1f4f8 100%);\n  border-color: rgba(88, 101, 121, 0.2);\n}\n.header-card.status-blocked {\n  background:\n    linear-gradient(\n      180deg,\n      #fff1f1 0%,\n      #f6d9d9 100%);\n  border-color: rgba(179, 52, 66, 0.38);\n}\n.header-card__main {\n  display: flex;\n  align-items: center;\n  gap: 0.82rem;\n  min-width: 0;\n}\n.header-card--admin .header-card__main {\n  display: grid;\n  grid-template-columns: 96px minmax(0, 1fr);\n  column-gap: 0.95rem;\n}\n.header-card__avatar-stack {\n  --header-card-badge-overhang: var(--app-header-card-badge-overhang, 6px);\n  position: relative;\n  padding-bottom: var(--header-card-badge-overhang);\n  width: max-content;\n  max-width: 100%;\n}\n.header-card__ring {\n  position: absolute;\n  inset: -8px;\n  pointer-events: none;\n}\n.header-card__avatar {\n  width: 96px;\n  height: 96px;\n  border-radius: 50%;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  color: #fff;\n  font-size: 30px;\n  font-weight: 700;\n  letter-spacing: 0.02em;\n  overflow: hidden;\n  box-shadow: 0 6px 16px rgba(16, 30, 56, 0.24);\n}\n.header-card__avatar.has-photo {\n  background-size: cover;\n  background-position: center;\n  background-repeat: no-repeat;\n  color: transparent;\n  font-size: 0;\n}\n.user-color-woman {\n  background:\n    linear-gradient(\n      145deg,\n      #d3754c,\n      #ac4a24);\n}\n.user-color-man {\n  background:\n    linear-gradient(\n      145deg,\n      #3572a4,\n      #194364);\n}\n.header-card__edit {\n  position: absolute;\n  top: -6px;\n  right: -6px;\n  width: 30px;\n  height: 30px;\n  border: 0;\n  border-radius: 50%;\n  background: #2f7cc3;\n  color: #fff;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  box-shadow: 0 0 0 2px #fff;\n  cursor: pointer;\n  transition:\n    transform 0.16s ease,\n    box-shadow 0.16s ease,\n    background-color 0.16s ease;\n}\n.header-card__edit:disabled {\n  cursor: default;\n  opacity: 0.52;\n}\n.header-card__edit .mat-icon {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n  line-height: 16px;\n}\n.header-card__badge {\n  position: absolute;\n  left: 50%;\n  bottom: 0;\n  transform: translateX(-50%);\n  min-width: 0;\n  width: fit-content;\n  height: 24px;\n  border-radius: 999px;\n  background: #d8effa;\n  border: 1px solid #8ac9e2;\n  color: #1f6780;\n  font-size: 13px;\n  font-weight: 700;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  padding: 0 8px;\n}\n.header-card__text {\n  min-width: 0;\n  align-self: center;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  gap: 0.45rem;\n  text-align: center;\n  padding-top: var(--app-header-card-text-padding-top, 0);\n}\n.header-card--admin .header-card__text {\n  align-items: flex-start;\n  align-self: stretch;\n  justify-content: center;\n  text-align: left;\n  gap: 0.24rem;\n  min-height: 96px;\n  padding: 2.05rem 0 0 0;\n}\n.header-card__text h3 {\n  margin: 0;\n  color: #102541;\n  font-size: clamp(1.3rem, 2.4vw, 2rem);\n  line-height: 1.12;\n  font-weight: 800;\n}\n.header-card--admin .header-card__text h3 {\n  max-width: 100%;\n  font-size: 1.28rem;\n  overflow-wrap: anywhere;\n}\n.header-card__meta {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.24rem;\n  font-size: 1.02rem;\n  color: rgba(26, 45, 71, 0.78);\n  font-weight: 700;\n}\n.header-card--admin .header-card__meta {\n  justify-content: flex-start;\n  max-width: 100%;\n  line-height: 1.18;\n  padding-right: 2.45rem;\n}\n.header-card__meta .mat-icon {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n  line-height: 16px;\n}\n@media (hover: hover) and (pointer: fine) {\n  .header-card__edit:not(:disabled):hover {\n    transform: translateY(-1px) scale(1.03);\n    background: #256aa9;\n    box-shadow: 0 0 0 2px #fff, 0 4px 10px rgba(31, 73, 120, 0.22);\n  }\n}\n.header-card__edit:not(:disabled):active {\n  transform: scale(0.92);\n  animation: none;\n}\n@media (prefers-reduced-motion: reduce) {\n  .header-card__edit {\n    transition: none;\n  }\n}\n@media (max-width: 640px) {\n  .header-card__avatar {\n    width: 74px;\n    height: 74px;\n    font-size: 24px;\n  }\n  .header-card--admin .header-card__main {\n    grid-template-columns: 74px minmax(0, 1fr);\n  }\n  .header-card__text h3 {\n    font-size: 1.4rem;\n  }\n  .header-card__meta {\n    font-size: 0.92rem;\n  }\n}\n/*# sourceMappingURL=header-card.component.css.map */\n"] }]
  }], null, { model: [{
    type: Input
  }], edit: [{
    type: Output
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(HeaderCardComponent, { className: "HeaderCardComponent", filePath: "app/shared/ui/components/core/smart-list/card/header-card/header-card.component.ts", lineNumber: 32 });
})();

export {
  HeaderCardComponent
};
//# sourceMappingURL=chunk-Z4E5Y2UC.js.map
