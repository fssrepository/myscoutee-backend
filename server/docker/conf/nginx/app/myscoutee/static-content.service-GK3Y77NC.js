import {
  SeedHelpCenterRepository,
  SeedIdeaPostsRepository
} from "./chunk-ZQWRDTNC.js";
import "./chunk-OY7NWTMT.js";
import "./chunk-EWHSEKAB.js";
import "./chunk-LM6UNLJK.js";
import "./chunk-YXATI2WQ.js";
import "./chunk-QXOIA7DH.js";
import "./chunk-C6JV7CA3.js";
import "./chunk-N7OBXPJA.js";
import "./chunk-CYVMX3LD.js";
import "./chunk-LDZENZ35.js";
import {
  Injectable,
  inject,
  setClassMetadata,
  ɵɵdefineInjectable
} from "./chunk-EV3I3YNV.js";

// src/app/shared/core/local/seed/services/static-content.service.ts
var SeedStaticContentService = class _SeedStaticContentService {
  helpCenter = inject(SeedHelpCenterRepository);
  ideaPosts = inject(SeedIdeaPostsRepository);
  async ensureReady() {
    await this.helpCenter.seedDefaults();
    await this.ideaPosts.seedDefaults();
  }
  static \u0275fac = function SeedStaticContentService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _SeedStaticContentService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _SeedStaticContentService, factory: _SeedStaticContentService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SeedStaticContentService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();
export {
  SeedStaticContentService
};
//# sourceMappingURL=static-content.service-GK3Y77NC.js.map
