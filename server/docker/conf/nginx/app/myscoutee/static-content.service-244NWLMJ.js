import {
  SeedHelpCenterRepository,
  SeedIdeaPostsRepository
} from "./chunk-6QVVCBLK.js";
import "./chunk-F4WY6ECV.js";
import "./chunk-XQ4NDAVX.js";
import "./chunk-XQACYBVS.js";
import "./chunk-6POEHVT7.js";
import "./chunk-LERGHE7K.js";
import {
  Injectable,
  inject,
  setClassMetadata,
  ɵɵdefineInjectable
} from "./chunk-XJL7SWH7.js";

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
//# sourceMappingURL=static-content.service-244NWLMJ.js.map
