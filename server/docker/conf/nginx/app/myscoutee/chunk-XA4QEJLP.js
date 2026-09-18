import {
  MatIcon,
  MatIconModule
} from "./chunk-J4QS2YUJ.js";
import {
  ChangeDetectionStrategy,
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
  ɵɵdefineComponent,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵsanitizeUrl,
  ɵɵtext,
  ɵɵtextInterpolate
} from "./chunk-FMXFYYCS.js";

// src/app/shared/ui/components/core/prompt/prompt.component.ts
function PromptComponent_Conditional_0_Conditional_2_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "img", 8);
  }
  if (rf & 2) {
    const icon_r1 = \u0275\u0275nextContext();
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("src", ctx, \u0275\u0275sanitizeUrl)("alt", ctx_r1.iconAlt(icon_r1));
  }
}
function PromptComponent_Conditional_0_Conditional_2_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-icon", 9);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const icon_r1 = \u0275\u0275nextContext();
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275attribute("aria-label", ctx_r1.iconAriaLabel(icon_r1))("aria-hidden", ctx_r1.iconAriaLabel(icon_r1) ? null : "true");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx);
  }
}
function PromptComponent_Conditional_0_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 3);
    \u0275\u0275conditionalCreate(1, PromptComponent_Conditional_0_Conditional_2_Conditional_1_Template, 1, 2, "img", 8)(2, PromptComponent_Conditional_0_Conditional_2_Conditional_2_Template, 2, 3, "mat-icon", 9);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_3_0;
    const icon_r1 = ctx;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_3_0 = ctx_r1.iconSource(icon_r1)) ? 1 : (tmp_3_0 = ctx_r1.iconName(icon_r1)) ? 2 : -1, tmp_3_0);
  }
}
function PromptComponent_Conditional_0_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "h2");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.promptModel.title);
  }
}
function PromptComponent_Conditional_0_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.promptModel.description);
  }
}
function PromptComponent_Conditional_0_Conditional_7_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-icon");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const actionModel_r4 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(actionModel_r4.icon);
  }
}
function PromptComponent_Conditional_0_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 10);
    \u0275\u0275listener("click", function PromptComponent_Conditional_0_Conditional_7_Template_button_click_0_listener($event) {
      const actionModel_r4 = \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.emitAction(actionModel_r4, $event));
    });
    \u0275\u0275conditionalCreate(1, PromptComponent_Conditional_0_Conditional_7_Conditional_1_Template, 2, 1, "mat-icon");
    \u0275\u0275elementStart(2, "span", 11);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const actionModel_r4 = ctx;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("ui-prompt__primary--compact-mobile", actionModel_r4.icon);
    \u0275\u0275property("disabled", ctx_r1.actionDisabled(actionModel_r4));
    \u0275\u0275attribute("aria-label", ctx_r1.actionAriaLabel(actionModel_r4));
    \u0275\u0275advance();
    \u0275\u0275conditional(actionModel_r4.icon ? 1 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.actionLabel(actionModel_r4));
  }
}
function PromptComponent_Conditional_0_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 12);
    \u0275\u0275listener("click", function PromptComponent_Conditional_0_Conditional_8_Template_button_click_0_listener($event) {
      \u0275\u0275restoreView(_r5);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.emitDismiss($event));
    });
    \u0275\u0275elementStart(1, "mat-icon");
    \u0275\u0275text(2, "close");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("disabled", ctx_r1.busy);
    \u0275\u0275attribute("aria-label", ctx_r1.closeAriaLabel);
  }
}
function PromptComponent_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "section", 1)(1, "div", 2);
    \u0275\u0275conditionalCreate(2, PromptComponent_Conditional_0_Conditional_2_Template, 3, 1, "span", 3);
    \u0275\u0275elementStart(3, "div", 4);
    \u0275\u0275conditionalCreate(4, PromptComponent_Conditional_0_Conditional_4_Template, 2, 1, "h2");
    \u0275\u0275conditionalCreate(5, PromptComponent_Conditional_0_Conditional_5_Template, 2, 1, "p");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "div", 5);
    \u0275\u0275conditionalCreate(7, PromptComponent_Conditional_0_Conditional_7_Template, 4, 6, "button", 6);
    \u0275\u0275conditionalCreate(8, PromptComponent_Conditional_0_Conditional_8_Template, 3, 2, "button", 7);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    let tmp_8_0;
    let tmp_11_0;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275classProp("ui-prompt--top", ctx_r1.promptModel.position !== "bottom")("ui-prompt--bottom", ctx_r1.promptModel.position === "bottom")("ui-prompt--info", ctx_r1.promptModel.tone === "info")("ui-prompt--success", ctx_r1.promptModel.tone === "success")("ui-prompt--warning", ctx_r1.promptModel.tone === "warning")("ui-prompt--danger", ctx_r1.promptModel.tone === "danger");
    \u0275\u0275attribute("aria-label", ctx_r1.ariaLabel);
    \u0275\u0275advance(2);
    \u0275\u0275conditional((tmp_8_0 = ctx_r1.promptModel.icon) ? 2 : -1, tmp_8_0);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r1.promptModel.title ? 4 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.promptModel.description ? 5 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275conditional((tmp_11_0 = ctx_r1.promptModel.action) ? 7 : -1, tmp_11_0);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.dismissible ? 8 : -1);
  }
}
var PromptComponent = class _PromptComponent {
  model = null;
  action = new EventEmitter();
  dismiss = new EventEmitter();
  get promptModel() {
    return this.model ?? {};
  }
  get visible() {
    return Boolean(this.model) && this.promptModel.visible !== false && (this.hasText(this.promptModel.title) || this.hasText(this.promptModel.description) || Boolean(this.promptModel.icon) || Boolean(this.promptModel.action));
  }
  get busy() {
    return this.promptModel.busy === true;
  }
  get dismissible() {
    return this.promptModel.dismissible !== false;
  }
  get ariaLabel() {
    return this.promptModel.ariaLabel?.trim() || this.promptModel.title?.trim() || this.promptModel.action?.ariaLabel?.trim() || this.promptModel.action?.label.trim() || "Prompt";
  }
  get closeAriaLabel() {
    return this.promptModel.closeAriaLabel?.trim() || "Dismiss";
  }
  isImageIcon(icon) {
    return typeof icon === "object" && icon !== null && "src" in icon;
  }
  iconSource(icon) {
    return this.isImageIcon(icon) ? icon.src : null;
  }
  iconAlt(icon) {
    return this.isImageIcon(icon) ? `${icon.alt ?? ""}` : "";
  }
  iconName(icon) {
    if (!icon || this.isImageIcon(icon)) {
      return "";
    }
    return typeof icon === "string" ? icon : icon.name;
  }
  iconAriaLabel(icon) {
    if (!icon || typeof icon === "string" || this.isImageIcon(icon)) {
      return null;
    }
    return icon.ariaLabel?.trim() || null;
  }
  actionLabel(action) {
    return this.busy && this.hasText(action.busyLabel) ? `${action.busyLabel}` : action.label;
  }
  actionAriaLabel(action) {
    return action.ariaLabel?.trim() || action.label;
  }
  actionDisabled(action) {
    return this.busy || action.disabled === true;
  }
  emitAction(action, event) {
    if (this.actionDisabled(action)) {
      return;
    }
    this.action.emit({ action, sourceEvent: event });
  }
  emitDismiss(event) {
    if (this.busy) {
      return;
    }
    this.dismiss.emit(event);
  }
  hasText(value) {
    return Boolean(value?.trim());
  }
  static \u0275fac = function PromptComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _PromptComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _PromptComponent, selectors: [["app-prompt"]], inputs: { model: "model" }, outputs: { action: "action", dismiss: "dismiss" }, decls: 1, vars: 1, consts: [["aria-live", "polite", 1, "ui-prompt", 3, "ui-prompt--top", "ui-prompt--bottom", "ui-prompt--info", "ui-prompt--success", "ui-prompt--warning", "ui-prompt--danger"], ["aria-live", "polite", 1, "ui-prompt"], [1, "ui-prompt__panel"], [1, "ui-prompt__icon"], [1, "ui-prompt__copy"], [1, "ui-prompt__actions"], ["type", "button", 1, "ui-prompt__primary", 3, "ui-prompt__primary--compact-mobile", "disabled"], ["type", "button", 1, "ui-prompt__close", 3, "disabled"], ["width", "40", "height", "40", 1, "ui-prompt__image", 3, "src", "alt"], [1, "ui-prompt__material-icon"], ["type", "button", 1, "ui-prompt__primary", 3, "click", "disabled"], [1, "ui-prompt__primary-label"], ["type", "button", 1, "ui-prompt__close", 3, "click", "disabled"]], template: function PromptComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275conditionalCreate(0, PromptComponent_Conditional_0_Template, 9, 18, "section", 0);
    }
    if (rf & 2) {
      \u0275\u0275conditional(ctx.visible ? 0 : -1);
    }
  }, dependencies: [MatIconModule, MatIcon], styles: ["\n[_nghost-%COMP%] {\n  display: block;\n}\n.ui-prompt[_ngcontent-%COMP%] {\n  position: fixed;\n  left: 0;\n  right: 0;\n  z-index: 1800;\n  display: flex;\n  justify-content: center;\n  padding: 0 0.5rem;\n  pointer-events: none;\n}\n.ui-prompt--top[_ngcontent-%COMP%] {\n  top: calc(env(safe-area-inset-top, 0px) + 0.55rem);\n}\n.ui-prompt--bottom[_ngcontent-%COMP%] {\n  bottom: calc(env(safe-area-inset-bottom, 0px) + 0.55rem);\n}\n.ui-prompt__panel[_ngcontent-%COMP%] {\n  width: min(560px, 100vw - 1rem);\n  min-height: 58px;\n  display: grid;\n  grid-template-columns: 40px minmax(0, 1fr) auto;\n  align-items: center;\n  gap: 0.68rem;\n  box-sizing: border-box;\n  padding: 0.48rem 0.54rem 0.48rem 0.62rem;\n  border: 1px solid rgba(41, 78, 121, 0.2);\n  border-radius: 14px;\n  background:\n    linear-gradient(\n      135deg,\n      rgba(255, 255, 255, 0.98),\n      rgba(246, 250, 255, 0.98)),\n    #ffffff;\n  box-shadow: 0 12px 26px rgba(18, 36, 62, 0.16);\n  pointer-events: auto;\n  -webkit-backdrop-filter: blur(12px);\n  backdrop-filter: blur(12px);\n}\n.ui-prompt--info[_ngcontent-%COMP%]   .ui-prompt__panel[_ngcontent-%COMP%] {\n  border-color: rgba(37, 99, 235, 0.22);\n}\n.ui-prompt--success[_ngcontent-%COMP%]   .ui-prompt__panel[_ngcontent-%COMP%] {\n  border-color: rgba(20, 132, 92, 0.24);\n}\n.ui-prompt--warning[_ngcontent-%COMP%]   .ui-prompt__panel[_ngcontent-%COMP%] {\n  border-color: rgba(190, 107, 20, 0.28);\n}\n.ui-prompt--danger[_ngcontent-%COMP%]   .ui-prompt__panel[_ngcontent-%COMP%] {\n  border-color: rgba(196, 59, 59, 0.28);\n}\n.ui-prompt__icon[_ngcontent-%COMP%] {\n  width: 40px;\n  height: 40px;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n}\n.ui-prompt__image[_ngcontent-%COMP%] {\n  width: 40px;\n  height: 40px;\n  display: block;\n  object-fit: contain;\n  border-radius: 10px;\n  box-shadow: 0 4px 10px rgba(48, 78, 128, 0.14);\n}\n.ui-prompt__material-icon[_ngcontent-%COMP%] {\n  width: 34px;\n  height: 34px;\n  font-size: 34px;\n  line-height: 34px;\n  color: #285074;\n}\n.ui-prompt--info[_ngcontent-%COMP%]   .ui-prompt__material-icon[_ngcontent-%COMP%] {\n  color: #2563eb;\n}\n.ui-prompt--success[_ngcontent-%COMP%]   .ui-prompt__material-icon[_ngcontent-%COMP%] {\n  color: #14845c;\n}\n.ui-prompt--warning[_ngcontent-%COMP%]   .ui-prompt__material-icon[_ngcontent-%COMP%] {\n  color: #b76514;\n}\n.ui-prompt--danger[_ngcontent-%COMP%]   .ui-prompt__material-icon[_ngcontent-%COMP%] {\n  color: #c43b3b;\n}\n.ui-prompt__copy[_ngcontent-%COMP%] {\n  display: grid;\n  min-width: 0;\n  gap: 0.12rem;\n}\n.ui-prompt__copy[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%], \n.ui-prompt__copy[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0;\n}\n.ui-prompt__copy[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n  color: #1f3859;\n  font-size: 0.86rem;\n  font-weight: 800;\n  line-height: 1.16;\n  overflow-wrap: anywhere;\n}\n.ui-prompt__copy[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]:last-child {\n  color: rgba(24, 43, 69, 0.76);\n  font-size: 0.72rem;\n  line-height: 1.24;\n  overflow-wrap: anywhere;\n}\n.ui-prompt__actions[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 0.36rem;\n}\n.ui-prompt__actions[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] {\n  border: 0;\n  border-radius: 10px;\n  min-height: 36px;\n  font: inherit;\n  font-size: 0.78rem;\n  font-weight: 800;\n  cursor: pointer;\n  transition:\n    transform 0.16s ease,\n    box-shadow 0.16s ease,\n    filter 0.16s ease;\n  -webkit-tap-highlight-color: transparent;\n}\n.ui-prompt__actions[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]:not(:disabled):active {\n  transform: scale(0.98);\n}\n.ui-prompt__actions[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]:disabled {\n  cursor: progress;\n  opacity: 0.78;\n}\n.ui-prompt__primary[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  gap: 0.34rem;\n  padding: 0 0.68rem;\n  background:\n    linear-gradient(\n      135deg,\n      #2d5f94,\n      #3f7fb4);\n  color: #fff;\n}\n.ui-prompt__close[_ngcontent-%COMP%] {\n  width: 36px;\n  height: 36px;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  padding: 0;\n  background: rgba(229, 237, 249, 0.95);\n  color: #264468;\n}\n.ui-prompt__actions[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  width: 18px;\n  height: 18px;\n  font-size: 18px;\n  line-height: 18px;\n}\n@media (hover: hover) {\n  .ui-prompt__actions[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]:not(:disabled):hover {\n    transform: translateY(-1px);\n    box-shadow: 0 8px 16px rgba(18, 36, 62, 0.14);\n  }\n}\n@media (max-width: 760px) {\n  .ui-prompt[_ngcontent-%COMP%] {\n    padding: 0 0.35rem;\n  }\n  .ui-prompt--top[_ngcontent-%COMP%] {\n    top: calc(env(safe-area-inset-top, 0px) + 0.38rem);\n  }\n  .ui-prompt--bottom[_ngcontent-%COMP%] {\n    bottom: calc(env(safe-area-inset-bottom, 0px) + 0.38rem);\n  }\n  .ui-prompt__panel[_ngcontent-%COMP%] {\n    width: calc(100vw - 0.7rem);\n    min-height: 54px;\n    grid-template-columns: 34px minmax(0, 1fr) auto;\n    gap: 0.48rem;\n    padding: 0.42rem 0.42rem 0.42rem 0.5rem;\n    border-radius: 12px;\n  }\n  .ui-prompt__icon[_ngcontent-%COMP%], \n   .ui-prompt__image[_ngcontent-%COMP%] {\n    width: 34px;\n    height: 34px;\n  }\n  .ui-prompt__image[_ngcontent-%COMP%] {\n    border-radius: 9px;\n  }\n  .ui-prompt__material-icon[_ngcontent-%COMP%] {\n    width: 28px;\n    height: 28px;\n    font-size: 28px;\n    line-height: 28px;\n  }\n  .ui-prompt__copy[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n    font-size: 0.75rem;\n    line-height: 1.12;\n  }\n  .ui-prompt__copy[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]:last-child {\n    font-size: 0.66rem;\n    line-height: 1.18;\n  }\n  .ui-prompt__primary[_ngcontent-%COMP%], \n   .ui-prompt__close[_ngcontent-%COMP%] {\n    width: 34px;\n    min-width: 34px;\n    height: 34px;\n    min-height: 34px;\n    padding: 0;\n  }\n  .ui-prompt__primary--compact-mobile[_ngcontent-%COMP%]   .ui-prompt__primary-label[_ngcontent-%COMP%] {\n    display: none;\n  }\n}\n/*# sourceMappingURL=prompt.component.css.map */"], changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(PromptComponent, [{
    type: Component,
    args: [{ selector: "app-prompt", standalone: true, imports: [MatIconModule], changeDetection: ChangeDetectionStrategy.OnPush, template: `@if (visible) {
  <section
    class="ui-prompt"
    [class.ui-prompt--top]="promptModel.position !== 'bottom'"
    [class.ui-prompt--bottom]="promptModel.position === 'bottom'"
    [class.ui-prompt--info]="promptModel.tone === 'info'"
    [class.ui-prompt--success]="promptModel.tone === 'success'"
    [class.ui-prompt--warning]="promptModel.tone === 'warning'"
    [class.ui-prompt--danger]="promptModel.tone === 'danger'"
    aria-live="polite"
    [attr.aria-label]="ariaLabel"
  >
    <div class="ui-prompt__panel">
      @if (promptModel.icon; as icon) {
        <span class="ui-prompt__icon">
          @if (iconSource(icon); as src) {
            <img
              class="ui-prompt__image"
              [src]="src"
              [alt]="iconAlt(icon)"
              width="40"
              height="40"
            />
          } @else if (iconName(icon); as name) {
            <mat-icon
              class="ui-prompt__material-icon"
              [attr.aria-label]="iconAriaLabel(icon)"
              [attr.aria-hidden]="iconAriaLabel(icon) ? null : 'true'"
            >{{ name }}</mat-icon>
          }
        </span>
      }

      <div class="ui-prompt__copy">
        @if (promptModel.title) {
          <h2>{{ promptModel.title }}</h2>
        }
        @if (promptModel.description) {
          <p>{{ promptModel.description }}</p>
        }
      </div>

      <div class="ui-prompt__actions">
        @if (promptModel.action; as actionModel) {
          <button
            type="button"
            class="ui-prompt__primary"
            [class.ui-prompt__primary--compact-mobile]="actionModel.icon"
            [disabled]="actionDisabled(actionModel)"
            [attr.aria-label]="actionAriaLabel(actionModel)"
            (click)="emitAction(actionModel, $event)"
          >
            @if (actionModel.icon) {
              <mat-icon>{{ actionModel.icon }}</mat-icon>
            }
            <span class="ui-prompt__primary-label">{{ actionLabel(actionModel) }}</span>
          </button>
        }

        @if (dismissible) {
          <button
            type="button"
            class="ui-prompt__close"
            [disabled]="busy"
            [attr.aria-label]="closeAriaLabel"
            (click)="emitDismiss($event)"
          >
            <mat-icon>close</mat-icon>
          </button>
        }
      </div>
    </div>
  </section>
}
`, styles: ["/* src/app/shared/ui/components/core/prompt/prompt.component.scss */\n:host {\n  display: block;\n}\n.ui-prompt {\n  position: fixed;\n  left: 0;\n  right: 0;\n  z-index: 1800;\n  display: flex;\n  justify-content: center;\n  padding: 0 0.5rem;\n  pointer-events: none;\n}\n.ui-prompt--top {\n  top: calc(env(safe-area-inset-top, 0px) + 0.55rem);\n}\n.ui-prompt--bottom {\n  bottom: calc(env(safe-area-inset-bottom, 0px) + 0.55rem);\n}\n.ui-prompt__panel {\n  width: min(560px, 100vw - 1rem);\n  min-height: 58px;\n  display: grid;\n  grid-template-columns: 40px minmax(0, 1fr) auto;\n  align-items: center;\n  gap: 0.68rem;\n  box-sizing: border-box;\n  padding: 0.48rem 0.54rem 0.48rem 0.62rem;\n  border: 1px solid rgba(41, 78, 121, 0.2);\n  border-radius: 14px;\n  background:\n    linear-gradient(\n      135deg,\n      rgba(255, 255, 255, 0.98),\n      rgba(246, 250, 255, 0.98)),\n    #ffffff;\n  box-shadow: 0 12px 26px rgba(18, 36, 62, 0.16);\n  pointer-events: auto;\n  -webkit-backdrop-filter: blur(12px);\n  backdrop-filter: blur(12px);\n}\n.ui-prompt--info .ui-prompt__panel {\n  border-color: rgba(37, 99, 235, 0.22);\n}\n.ui-prompt--success .ui-prompt__panel {\n  border-color: rgba(20, 132, 92, 0.24);\n}\n.ui-prompt--warning .ui-prompt__panel {\n  border-color: rgba(190, 107, 20, 0.28);\n}\n.ui-prompt--danger .ui-prompt__panel {\n  border-color: rgba(196, 59, 59, 0.28);\n}\n.ui-prompt__icon {\n  width: 40px;\n  height: 40px;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n}\n.ui-prompt__image {\n  width: 40px;\n  height: 40px;\n  display: block;\n  object-fit: contain;\n  border-radius: 10px;\n  box-shadow: 0 4px 10px rgba(48, 78, 128, 0.14);\n}\n.ui-prompt__material-icon {\n  width: 34px;\n  height: 34px;\n  font-size: 34px;\n  line-height: 34px;\n  color: #285074;\n}\n.ui-prompt--info .ui-prompt__material-icon {\n  color: #2563eb;\n}\n.ui-prompt--success .ui-prompt__material-icon {\n  color: #14845c;\n}\n.ui-prompt--warning .ui-prompt__material-icon {\n  color: #b76514;\n}\n.ui-prompt--danger .ui-prompt__material-icon {\n  color: #c43b3b;\n}\n.ui-prompt__copy {\n  display: grid;\n  min-width: 0;\n  gap: 0.12rem;\n}\n.ui-prompt__copy h2,\n.ui-prompt__copy p {\n  margin: 0;\n}\n.ui-prompt__copy h2 {\n  color: #1f3859;\n  font-size: 0.86rem;\n  font-weight: 800;\n  line-height: 1.16;\n  overflow-wrap: anywhere;\n}\n.ui-prompt__copy p:last-child {\n  color: rgba(24, 43, 69, 0.76);\n  font-size: 0.72rem;\n  line-height: 1.24;\n  overflow-wrap: anywhere;\n}\n.ui-prompt__actions {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 0.36rem;\n}\n.ui-prompt__actions button {\n  border: 0;\n  border-radius: 10px;\n  min-height: 36px;\n  font: inherit;\n  font-size: 0.78rem;\n  font-weight: 800;\n  cursor: pointer;\n  transition:\n    transform 0.16s ease,\n    box-shadow 0.16s ease,\n    filter 0.16s ease;\n  -webkit-tap-highlight-color: transparent;\n}\n.ui-prompt__actions button:not(:disabled):active {\n  transform: scale(0.98);\n}\n.ui-prompt__actions button:disabled {\n  cursor: progress;\n  opacity: 0.78;\n}\n.ui-prompt__primary {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  gap: 0.34rem;\n  padding: 0 0.68rem;\n  background:\n    linear-gradient(\n      135deg,\n      #2d5f94,\n      #3f7fb4);\n  color: #fff;\n}\n.ui-prompt__close {\n  width: 36px;\n  height: 36px;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  padding: 0;\n  background: rgba(229, 237, 249, 0.95);\n  color: #264468;\n}\n.ui-prompt__actions mat-icon {\n  width: 18px;\n  height: 18px;\n  font-size: 18px;\n  line-height: 18px;\n}\n@media (hover: hover) {\n  .ui-prompt__actions button:not(:disabled):hover {\n    transform: translateY(-1px);\n    box-shadow: 0 8px 16px rgba(18, 36, 62, 0.14);\n  }\n}\n@media (max-width: 760px) {\n  .ui-prompt {\n    padding: 0 0.35rem;\n  }\n  .ui-prompt--top {\n    top: calc(env(safe-area-inset-top, 0px) + 0.38rem);\n  }\n  .ui-prompt--bottom {\n    bottom: calc(env(safe-area-inset-bottom, 0px) + 0.38rem);\n  }\n  .ui-prompt__panel {\n    width: calc(100vw - 0.7rem);\n    min-height: 54px;\n    grid-template-columns: 34px minmax(0, 1fr) auto;\n    gap: 0.48rem;\n    padding: 0.42rem 0.42rem 0.42rem 0.5rem;\n    border-radius: 12px;\n  }\n  .ui-prompt__icon,\n  .ui-prompt__image {\n    width: 34px;\n    height: 34px;\n  }\n  .ui-prompt__image {\n    border-radius: 9px;\n  }\n  .ui-prompt__material-icon {\n    width: 28px;\n    height: 28px;\n    font-size: 28px;\n    line-height: 28px;\n  }\n  .ui-prompt__copy h2 {\n    font-size: 0.75rem;\n    line-height: 1.12;\n  }\n  .ui-prompt__copy p:last-child {\n    font-size: 0.66rem;\n    line-height: 1.18;\n  }\n  .ui-prompt__primary,\n  .ui-prompt__close {\n    width: 34px;\n    min-width: 34px;\n    height: 34px;\n    min-height: 34px;\n    padding: 0;\n  }\n  .ui-prompt__primary--compact-mobile .ui-prompt__primary-label {\n    display: none;\n  }\n}\n/*# sourceMappingURL=prompt.component.css.map */\n"] }]
  }], null, { model: [{
    type: Input
  }], action: [{
    type: Output
  }], dismiss: [{
    type: Output
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(PromptComponent, { className: "PromptComponent", filePath: "app/shared/ui/components/core/prompt/prompt.component.ts", lineNumber: 14 });
})();
//# sourceMappingURL=chunk-XA4QEJLP.js.map
