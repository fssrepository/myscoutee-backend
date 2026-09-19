import {
  DeploymentBrandComponent
} from "./chunk-22I4RYEC.js";
import {
  AppMenuComponent
} from "./chunk-53UGBDSO.js";
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
  ɵɵrestoreView
} from "./chunk-EV3I3YNV.js";

// src/app/home/components/home-header/home-header.component.ts
function HomeHeaderComponent_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 3)(1, "app-menu", 4);
    \u0275\u0275listener("itemSelect", function HomeHeaderComponent_Conditional_3_Template_app_menu_itemSelect_1_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.itemSelect.emit($event));
    });
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("items", ctx_r1.items);
  }
}
var HOME_HEADER_LOADING_ITEMS = [
  {
    id: "home-mode",
    label: "Preferences",
    icon: "person",
    kind: "select-trigger",
    layout: "pill",
    palette: "blue",
    disabled: true,
    ariaLabel: "Select game mode"
  },
  {
    id: "home-filter",
    icon: "filter_alt",
    kind: "action",
    palette: "filter",
    disabled: true,
    ariaLabel: "Open profile filters"
  },
  {
    id: "home-history",
    icon: "history",
    kind: "action",
    palette: "gold",
    disabled: true,
    ariaLabel: "Open game history"
  }
];
var HomeHeaderComponent = class _HomeHeaderComponent {
  branding;
  items = HOME_HEADER_LOADING_ITEMS;
  showControls = true;
  itemSelect = new EventEmitter();
  static \u0275fac = function HomeHeaderComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _HomeHeaderComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _HomeHeaderComponent, selectors: [["app-home-header"]], inputs: { branding: "branding", items: "items", showControls: "showControls" }, outputs: { itemSelect: "itemSelect" }, decls: 4, vars: 3, consts: [[1, "game-header"], [1, "game-brand"], [3, "branding"], [1, "game-actions"], ["kind", "inline", "layout", "row", 1, "game-header-menu", 3, "itemSelect", "items"]], template: function HomeHeaderComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "header", 0)(1, "a", 1);
      \u0275\u0275element(2, "app-deployment-brand", 2);
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(3, HomeHeaderComponent_Conditional_3_Template, 2, 1, "div", 3);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275advance();
      \u0275\u0275attribute("aria-label", ctx.branding.productName + " home");
      \u0275\u0275advance();
      \u0275\u0275property("branding", ctx.branding);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.showControls ? 3 : -1);
    }
  }, dependencies: [DeploymentBrandComponent, AppMenuComponent], styles: ["\n[_nghost-%COMP%] {\n  display: block;\n}\n.game-header[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: flex-start;\n  gap: 0.72rem;\n}\n.game-brand[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: flex-end;\n  text-decoration: none;\n  font-weight: 700;\n  color: var(--deployment-brand-text);\n  background-image:\n    linear-gradient(\n      90deg,\n      var(--deployment-brand-primary),\n      var(--deployment-brand-secondary),\n      var(--deployment-brand-accent));\n  background-repeat: no-repeat;\n  background-size: 100% 3px;\n  background-position: 0 100%;\n  --deployment-brand-logo-size: 30px;\n  font-size: 1.32rem;\n  font-weight: 800;\n  letter-spacing: -0.01em;\n  line-height: 0.8;\n}\n.game-header[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0.22rem 0 0;\n  color: rgba(20, 33, 53, 0.72);\n  font-size: 0.84rem;\n}\n.game-actions[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.38rem;\n}\n.game-header-menu[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n}\n@media (max-width: 760px) {\n  .game-header[_ngcontent-%COMP%] {\n    flex-direction: column;\n  }\n  .game-actions[_ngcontent-%COMP%] {\n    justify-content: flex-end;\n  }\n}\n/*# sourceMappingURL=home-header.component.css.map */"], changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(HomeHeaderComponent, [{
    type: Component,
    args: [{ selector: "app-home-header", imports: [DeploymentBrandComponent, AppMenuComponent], template: `
    <header class="game-header">
      <a class="game-brand" [attr.aria-label]="branding.productName + ' home'">
        <app-deployment-brand [branding]="branding"></app-deployment-brand>
      </a>
      @if (showControls) {
        <div class="game-actions">
          <app-menu class="game-header-menu" kind="inline" layout="row"
            [items]="items" (itemSelect)="itemSelect.emit($event)"></app-menu>
        </div>
      }
    </header>
  `, changeDetection: ChangeDetectionStrategy.OnPush, styles: ["/* src/app/home/components/home-header/home-header.component.scss */\n:host {\n  display: block;\n}\n.game-header {\n  display: flex;\n  justify-content: space-between;\n  align-items: flex-start;\n  gap: 0.72rem;\n}\n.game-brand {\n  display: inline-flex;\n  align-items: flex-end;\n  text-decoration: none;\n  font-weight: 700;\n  color: var(--deployment-brand-text);\n  background-image:\n    linear-gradient(\n      90deg,\n      var(--deployment-brand-primary),\n      var(--deployment-brand-secondary),\n      var(--deployment-brand-accent));\n  background-repeat: no-repeat;\n  background-size: 100% 3px;\n  background-position: 0 100%;\n  --deployment-brand-logo-size: 30px;\n  font-size: 1.32rem;\n  font-weight: 800;\n  letter-spacing: -0.01em;\n  line-height: 0.8;\n}\n.game-header p {\n  margin: 0.22rem 0 0;\n  color: rgba(20, 33, 53, 0.72);\n  font-size: 0.84rem;\n}\n.game-actions {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.38rem;\n}\n.game-header-menu {\n  display: inline-flex;\n  align-items: center;\n}\n@media (max-width: 760px) {\n  .game-header {\n    flex-direction: column;\n  }\n  .game-actions {\n    justify-content: flex-end;\n  }\n}\n/*# sourceMappingURL=home-header.component.css.map */\n"] }]
  }], null, { branding: [{
    type: Input,
    args: [{ required: true }]
  }], items: [{
    type: Input
  }], showControls: [{
    type: Input
  }], itemSelect: [{
    type: Output
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(HomeHeaderComponent, { className: "HomeHeaderComponent", filePath: "app/home/components/home-header/home-header.component.ts", lineNumber: 37 });
})();

export {
  HomeHeaderComponent
};
//# sourceMappingURL=chunk-6EWA7OZ4.js.map
