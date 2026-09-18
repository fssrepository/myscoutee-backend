import {
  DialogStore
} from "./chunk-LWXWCSPP.js";
import {
  AppMenuComponent,
  I18nPipe,
  MatIcon,
  MatIconModule
} from "./chunk-J4QS2YUJ.js";
import {
  Component,
  HostListener,
  Input,
  inject,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵclassProp,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
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
  ɵɵstyleProp,
  ɵɵtext,
  ɵɵtextInterpolate
} from "./chunk-FMXFYYCS.js";

// src/app/shared/ui/components/core/dialog/dialog.component.ts
function DialogComponent_Conditional_0_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 9);
    \u0275\u0275pipe(1, "i18n");
    \u0275\u0275listener("click", function DialogComponent_Conditional_0_Conditional_7_Template_button_click_0_listener($event) {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.cancel($event));
    });
    \u0275\u0275elementStart(2, "mat-icon");
    \u0275\u0275text(3, "close");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const state_r4 = \u0275\u0275nextContext();
    \u0275\u0275property("disabled", state_r4.busy);
    \u0275\u0275attribute("aria-label", \u0275\u0275pipeBind1(1, 2, "close"));
  }
}
function DialogComponent_Conditional_0_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p");
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "i18n");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const state_r4 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(2, 1, state_r4.message));
  }
}
function DialogComponent_Conditional_0_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 6);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "i18n");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const state_r4 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(2, 1, state_r4.warningMessage));
  }
}
function DialogComponent_Conditional_0_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 7);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "i18n");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const state_r4 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(2, 1, state_r4.errorMessage));
  }
}
function DialogComponent_Conditional_0_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 10)(1, "app-menu", 11);
    \u0275\u0275listener("itemSelect", function DialogComponent_Conditional_0_Conditional_11_Template_app_menu_itemSelect_1_listener($event) {
      \u0275\u0275restoreView(_r5);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.onDialogActionSelect($event));
    });
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const state_r4 = \u0275\u0275nextContext();
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275classProp("dialog-actions-single", !state_r4.cancelLabel);
    \u0275\u0275advance();
    \u0275\u0275property("items", ctx_r1.dialogActionItems(state_r4));
  }
}
function DialogComponent_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "section", 1)(1, "div", 2);
    \u0275\u0275listener("click", function DialogComponent_Conditional_0_Template_div_click_1_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.closeFromBackdrop($event));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "div", 3);
    \u0275\u0275listener("click", function DialogComponent_Conditional_0_Template_div_click_2_listener($event) {
      return $event.stopPropagation();
    });
    \u0275\u0275elementStart(3, "div", 4)(4, "h3");
    \u0275\u0275text(5);
    \u0275\u0275pipe(6, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(7, DialogComponent_Conditional_0_Conditional_7_Template, 4, 4, "button", 5);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(8, DialogComponent_Conditional_0_Conditional_8_Template, 3, 3, "p");
    \u0275\u0275conditionalCreate(9, DialogComponent_Conditional_0_Conditional_9_Template, 3, 3, "p", 6);
    \u0275\u0275conditionalCreate(10, DialogComponent_Conditional_0_Conditional_10_Template, 3, 3, "p", 7);
    \u0275\u0275conditionalCreate(11, DialogComponent_Conditional_0_Conditional_11_Template, 2, 3, "div", 8);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const state_r4 = ctx;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275styleProp("z-index", ctx_r1.zIndex ?? null);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(6, 8, state_r4.title));
    \u0275\u0275advance(2);
    \u0275\u0275conditional(state_r4.showClose ? 7 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(state_r4.message ? 8 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(state_r4.warningMessage ? 9 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(state_r4.errorMessage ? 10 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(state_r4.showActions ? 11 : -1);
  }
}
var DialogComponent = class _DialogComponent {
  useStore = true;
  dialog = null;
  zIndex = null;
  dialogStore = inject(DialogStore);
  onEscapePressed(event) {
    const keyboardEvent = event;
    const dialog = this.dialogState();
    if (!dialog || keyboardEvent.defaultPrevented || !dialog.allowEscapeClose) {
      return;
    }
    keyboardEvent.preventDefault();
    keyboardEvent.stopPropagation();
    this.cancel();
  }
  dialogState() {
    if (!this.useStore) {
      const dialog = this.dialog;
      if (!dialog?.visible) {
        return null;
      }
      const confirmLabel = dialog.confirmLabel?.trim() || "OK";
      return {
        title: dialog.title?.trim() || "Confirmation",
        message: dialog.message?.trim() ?? "",
        warningMessage: dialog.warningMessage?.trim() ?? "",
        cancelLabel: dialog.cancelLabel === void 0 ? "Cancel" : dialog.cancelLabel,
        confirmLabel,
        busyConfirmLabel: dialog.busyConfirmLabel?.trim() || confirmLabel,
        confirmTone: dialog.confirmTone ?? "accent",
        confirmPalette: dialog.confirmPalette ?? null,
        allowBackdropClose: dialog.allowBackdropClose !== false,
        allowEscapeClose: dialog.allowEscapeClose !== false,
        showActions: dialog.showActions !== false,
        showClose: dialog.showClose === true,
        busy: dialog.busy === true,
        errorMessage: dialog.errorMessage?.trim() ?? "",
        ringPerimeter: Number.isFinite(Number(dialog.ringPerimeter)) ? Math.max(0, Number(dialog.ringPerimeter)) : 100
      };
    }
    const state = this.dialogStore.dialog();
    return state ? this.mapStoreState(state) : null;
  }
  confirmText(state) {
    return state.busy ? state.busyConfirmLabel : state.confirmLabel;
  }
  confirmRingState(state) {
    return state.busy ? "loading" : "error";
  }
  dialogActionItems(state) {
    const items = [];
    if (state.cancelLabel) {
      items.push({
        id: "cancel",
        label: state.cancelLabel,
        layout: "action",
        palette: "slate",
        disabled: state.busy,
        ariaLabel: state.cancelLabel
      });
    }
    items.push({
      id: "confirm",
      label: this.confirmText(state),
      icon: state.busy ? "hourglass_empty" : void 0,
      layout: "action",
      palette: this.confirmPalette(state),
      disabled: state.busy,
      ariaLabel: this.confirmText(state),
      progress: state.busy || state.errorMessage ? {
        state: state.busy ? "loading" : "error",
        shape: "button",
        perimeter: state.ringPerimeter
      } : null
    });
    return items;
  }
  onDialogActionSelect(event) {
    if (event.id === "cancel") {
      this.cancel(event.sourceEvent);
    } else if (event.id === "confirm") {
      this.confirm(event.sourceEvent);
    }
  }
  closeFromBackdrop(event) {
    event.stopPropagation();
    const dialog = this.dialogState();
    if (!dialog || dialog.busy || !dialog.allowBackdropClose) {
      return;
    }
    this.cancel();
  }
  cancel(event) {
    event?.stopPropagation();
    const dialog = this.dialogState();
    if (!dialog || dialog.busy) {
      return;
    }
    if (!this.useStore) {
      void this.dialog?.cancelAction?.();
      return;
    }
    this.dialogStore.cancel();
  }
  confirm(event) {
    event?.stopPropagation();
    const dialog = this.dialogState();
    if (!dialog || dialog.busy) {
      return;
    }
    if (!this.useStore) {
      void this.dialog?.confirmAction?.();
      return;
    }
    void this.dialogStore.confirm();
  }
  confirmPalette(state) {
    if (state.errorMessage) {
      return "danger";
    }
    if (state.confirmPalette) {
      return state.confirmPalette;
    }
    if (state.confirmTone === "danger") {
      return "danger";
    }
    if (state.confirmTone === "neutral") {
      return "slate";
    }
    if (state.confirmTone === "warning") {
      return "warning";
    }
    return "blue";
  }
  mapStoreState(state) {
    return {
      title: state.title,
      message: state.message,
      warningMessage: state.warningMessage,
      cancelLabel: state.cancelLabel,
      confirmLabel: state.confirmLabel,
      busyConfirmLabel: state.busyConfirmLabel,
      confirmTone: state.confirmTone,
      confirmPalette: state.confirmPalette,
      allowBackdropClose: state.allowBackdropClose,
      allowEscapeClose: state.allowEscapeClose,
      showActions: state.showActions,
      showClose: state.showClose,
      busy: state.busy,
      errorMessage: state.errorMessage,
      ringPerimeter: state.ringPerimeter
    };
  }
  static \u0275fac = function DialogComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _DialogComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _DialogComponent, selectors: [["app-dialog"]], hostBindings: function DialogComponent_HostBindings(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275listener("keydown.escape", function DialogComponent_keydown_escape_HostBindingHandler($event) {
        return ctx.onEscapePressed($event);
      }, \u0275\u0275resolveWindow);
    }
  }, inputs: { useStore: "useStore", dialog: "dialog", zIndex: "zIndex" }, decls: 1, vars: 1, consts: [[1, "dialog", 3, "z-index"], [1, "dialog"], [1, "dialog-backdrop", 3, "click"], [1, "dialog-panel", 3, "click"], [1, "dialog-header"], ["type", "button", 1, "popup-close", 3, "disabled"], [1, "dialog-warning"], [1, "dialog-error"], [1, "dialog-actions", 3, "dialog-actions-single"], ["type", "button", 1, "popup-close", 3, "click", "disabled"], [1, "dialog-actions"], ["kind", "inline", 1, "dialog-actions-menu", 3, "itemSelect", "items"]], template: function DialogComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275conditionalCreate(0, DialogComponent_Conditional_0_Template, 12, 10, "section", 0);
    }
    if (rf & 2) {
      let tmp_0_0;
      \u0275\u0275conditional((tmp_0_0 = ctx.dialogState()) ? 0 : -1, tmp_0_0);
    }
  }, dependencies: [MatIconModule, MatIcon, AppMenuComponent, I18nPipe], styles: ["\n.popup-close[_ngcontent-%COMP%] {\n  flex: 0 0 auto;\n  width: 34px;\n  height: 34px;\n  min-width: 34px;\n  min-height: 34px;\n  border: 1px solid rgba(47, 86, 139, 0.2);\n  border-radius: 50%;\n  background: rgba(255, 255, 255, 0.92);\n  color: rgba(38, 67, 105, 0.92);\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  cursor: pointer;\n  padding: 0;\n  line-height: 0;\n  box-sizing: border-box;\n  box-shadow: 0 8px 18px rgba(37, 62, 95, 0.12);\n  --mdc-icon-button-state-layer-size: 34px;\n}\n.popup-close[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  width: 21px;\n  height: 21px;\n  font-size: 21px;\n  line-height: 21px;\n  margin: 0;\n}\n.popup-close[_ngcontent-%COMP%]:not(:disabled):not([aria-disabled=true]):hover {\n  border-color: rgba(47, 86, 139, 0.32);\n  background: #fff;\n  color: rgba(24, 50, 84, 0.98);\n}\n.popup-close[_ngcontent-%COMP%]:not(:disabled):not([aria-disabled=true]):active {\n  background: rgba(239, 245, 252, 0.96);\n}\n.popup-close[_ngcontent-%COMP%]:focus-visible {\n  outline: 2px solid rgba(61, 108, 186, 0.35);\n  outline-offset: 1px;\n}\n.popup-close[_ngcontent-%COMP%]:disabled, \n.popup-close[aria-disabled=true][_ngcontent-%COMP%] {\n  opacity: 0.56;\n  cursor: default;\n}\n[_nghost-%COMP%] {\n  display: contents;\n}\n.dialog[_ngcontent-%COMP%] {\n  position: fixed;\n  inset: 0;\n  z-index: 20000;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  padding: 1.25rem;\n}\n.dialog-backdrop[_ngcontent-%COMP%] {\n  position: absolute;\n  inset: 0;\n  background: rgba(17, 24, 39, 0.42);\n  -webkit-backdrop-filter: blur(6px);\n  backdrop-filter: blur(6px);\n}\n.dialog-panel[_ngcontent-%COMP%] {\n  position: relative;\n  z-index: 1;\n  width: min(100%, 440px);\n  border-radius: 26px;\n  border: 1px solid rgba(255, 255, 255, 0.72);\n  background: rgba(255, 255, 255, 0.97);\n  box-shadow: 0 28px 80px rgba(17, 24, 39, 0.18);\n  color: #22324a;\n  padding: 1.35rem;\n}\n.dialog-header[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: flex-start;\n  justify-content: space-between;\n  gap: 0.75rem;\n}\n.dialog-panel[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 1.1rem;\n  font-weight: 800;\n}\n.dialog-panel[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0.45rem 0 0;\n  color: rgba(34, 50, 74, 0.72);\n  font-size: 0.95rem;\n  line-height: 1.5;\n  white-space: pre-line;\n}\n.dialog-error[_ngcontent-%COMP%] {\n  color: #9b2c37 !important;\n  font-weight: 700;\n}\n.dialog-warning[_ngcontent-%COMP%] {\n  color: #b42335 !important;\n  font-weight: 800;\n}\n.dialog-actions[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: flex-end;\n  gap: 0.65rem;\n  margin-top: 1.15rem;\n}\n.dialog-actions.dialog-actions-single[_ngcontent-%COMP%] {\n  justify-content: flex-end;\n}\n.dialog-actions-menu[_ngcontent-%COMP%] {\n  position: relative;\n  display: inline-flex;\n  align-items: stretch;\n  justify-content: flex-end;\n  min-width: 260px;\n}\n.dialog-actions-menu[_ngcontent-%COMP%]     .app-menu {\n  width: 100%;\n}\n.dialog-actions-menu[_ngcontent-%COMP%]     .app-menu__button-row {\n  justify-content: flex-end;\n  gap: 0.65rem;\n}\n.dialog-actions-menu[_ngcontent-%COMP%]     .app-menu__button-row-item--action.app-menu__button-row-item--labelled, \n.dialog-actions-menu[_ngcontent-%COMP%]     .app-menu__button-row-item--action {\n  flex: 0 1 auto;\n  min-width: 108px;\n  min-height: 42px;\n  height: 42px;\n  justify-content: center;\n  padding-inline: 1rem;\n}\n.dialog-actions-menu[_ngcontent-%COMP%]     .app-menu__button-row-item--action .app-menu__button-row-label {\n  text-align: center;\n}\n@media (max-width: 760px) {\n  .dialog[_ngcontent-%COMP%] {\n    padding: 0.9rem;\n  }\n  .dialog-panel[_ngcontent-%COMP%] {\n    width: 100%;\n    border-radius: 22px;\n  }\n  .dialog-actions-menu[_ngcontent-%COMP%] {\n    min-width: min(100%, 260px);\n  }\n}\n/*# sourceMappingURL=dialog.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(DialogComponent, [{
    type: Component,
    args: [{ selector: "app-dialog", standalone: true, imports: [MatIconModule, AppMenuComponent, I18nPipe], template: `@if (dialogState(); as state) {
  <section class="dialog" [style.z-index]="zIndex ?? null">
    <div class="dialog-backdrop" (click)="closeFromBackdrop($event)"></div>
    <div class="dialog-panel" (click)="$event.stopPropagation()">
      <div class="dialog-header">
        <h3>{{ state.title | i18n }}</h3>
        @if (state.showClose) {
          <button
            type="button"
            class="popup-close"
            [disabled]="state.busy"
            [attr.aria-label]="'close' | i18n"
            (click)="cancel($event)"
          >
            <mat-icon>close</mat-icon>
          </button>
        }
      </div>
      @if (state.message) {
        <p>{{ state.message | i18n }}</p>
      }
      @if (state.warningMessage) {
        <p class="dialog-warning">{{ state.warningMessage | i18n }}</p>
      }
      @if (state.errorMessage) {
        <p class="dialog-error">{{ state.errorMessage | i18n }}</p>
      }
      @if (state.showActions) {
        <div class="dialog-actions" [class.dialog-actions-single]="!state.cancelLabel">
          <app-menu
            class="dialog-actions-menu"
            kind="inline"
            [items]="dialogActionItems(state)"
            (itemSelect)="onDialogActionSelect($event)"
          ></app-menu>
        </div>
      }
    </div>
  </section>
}
`, styles: ["/* src/app/shared/ui/components/core/dialog/dialog.component.scss */\n.popup-close {\n  flex: 0 0 auto;\n  width: 34px;\n  height: 34px;\n  min-width: 34px;\n  min-height: 34px;\n  border: 1px solid rgba(47, 86, 139, 0.2);\n  border-radius: 50%;\n  background: rgba(255, 255, 255, 0.92);\n  color: rgba(38, 67, 105, 0.92);\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  cursor: pointer;\n  padding: 0;\n  line-height: 0;\n  box-sizing: border-box;\n  box-shadow: 0 8px 18px rgba(37, 62, 95, 0.12);\n  --mdc-icon-button-state-layer-size: 34px;\n}\n.popup-close .mat-icon {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  width: 21px;\n  height: 21px;\n  font-size: 21px;\n  line-height: 21px;\n  margin: 0;\n}\n.popup-close:not(:disabled):not([aria-disabled=true]):hover {\n  border-color: rgba(47, 86, 139, 0.32);\n  background: #fff;\n  color: rgba(24, 50, 84, 0.98);\n}\n.popup-close:not(:disabled):not([aria-disabled=true]):active {\n  background: rgba(239, 245, 252, 0.96);\n}\n.popup-close:focus-visible {\n  outline: 2px solid rgba(61, 108, 186, 0.35);\n  outline-offset: 1px;\n}\n.popup-close:disabled,\n.popup-close[aria-disabled=true] {\n  opacity: 0.56;\n  cursor: default;\n}\n:host {\n  display: contents;\n}\n.dialog {\n  position: fixed;\n  inset: 0;\n  z-index: 20000;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  padding: 1.25rem;\n}\n.dialog-backdrop {\n  position: absolute;\n  inset: 0;\n  background: rgba(17, 24, 39, 0.42);\n  -webkit-backdrop-filter: blur(6px);\n  backdrop-filter: blur(6px);\n}\n.dialog-panel {\n  position: relative;\n  z-index: 1;\n  width: min(100%, 440px);\n  border-radius: 26px;\n  border: 1px solid rgba(255, 255, 255, 0.72);\n  background: rgba(255, 255, 255, 0.97);\n  box-shadow: 0 28px 80px rgba(17, 24, 39, 0.18);\n  color: #22324a;\n  padding: 1.35rem;\n}\n.dialog-header {\n  display: flex;\n  align-items: flex-start;\n  justify-content: space-between;\n  gap: 0.75rem;\n}\n.dialog-panel h3 {\n  margin: 0;\n  font-size: 1.1rem;\n  font-weight: 800;\n}\n.dialog-panel p {\n  margin: 0.45rem 0 0;\n  color: rgba(34, 50, 74, 0.72);\n  font-size: 0.95rem;\n  line-height: 1.5;\n  white-space: pre-line;\n}\n.dialog-error {\n  color: #9b2c37 !important;\n  font-weight: 700;\n}\n.dialog-warning {\n  color: #b42335 !important;\n  font-weight: 800;\n}\n.dialog-actions {\n  display: flex;\n  justify-content: flex-end;\n  gap: 0.65rem;\n  margin-top: 1.15rem;\n}\n.dialog-actions.dialog-actions-single {\n  justify-content: flex-end;\n}\n.dialog-actions-menu {\n  position: relative;\n  display: inline-flex;\n  align-items: stretch;\n  justify-content: flex-end;\n  min-width: 260px;\n}\n.dialog-actions-menu ::ng-deep .app-menu {\n  width: 100%;\n}\n.dialog-actions-menu ::ng-deep .app-menu__button-row {\n  justify-content: flex-end;\n  gap: 0.65rem;\n}\n.dialog-actions-menu ::ng-deep .app-menu__button-row-item--action.app-menu__button-row-item--labelled,\n.dialog-actions-menu ::ng-deep .app-menu__button-row-item--action {\n  flex: 0 1 auto;\n  min-width: 108px;\n  min-height: 42px;\n  height: 42px;\n  justify-content: center;\n  padding-inline: 1rem;\n}\n.dialog-actions-menu ::ng-deep .app-menu__button-row-item--action .app-menu__button-row-label {\n  text-align: center;\n}\n@media (max-width: 760px) {\n  .dialog {\n    padding: 0.9rem;\n  }\n  .dialog-panel {\n    width: 100%;\n    border-radius: 22px;\n  }\n  .dialog-actions-menu {\n    min-width: min(100%, 260px);\n  }\n}\n/*# sourceMappingURL=dialog.component.css.map */\n"] }]
  }], null, { useStore: [{
    type: Input
  }], dialog: [{
    type: Input
  }], zIndex: [{
    type: Input
  }], onEscapePressed: [{
    type: HostListener,
    args: ["window:keydown.escape", ["$event"]]
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(DialogComponent, { className: "DialogComponent", filePath: "app/shared/ui/components/core/dialog/dialog.component.ts", lineNumber: 60 });
})();

export {
  DialogComponent
};
//# sourceMappingURL=chunk-VBRGMXSL.js.map
