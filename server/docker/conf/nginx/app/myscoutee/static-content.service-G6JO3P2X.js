import {
  SeedHelpCenterRepository,
  SeedIdeaPostsRepository
} from "./chunk-OATZQ5DM.js";
import "./chunk-FAW3YKWN.js";
import "./chunk-QZPIQIRC.js";
import "./chunk-U4O3FETT.js";
import "./chunk-27OFLLFL.js";
import "./chunk-YO3STUCM.js";
import {
  Injectable,
  inject,
  setClassMetadata,
  ɵɵdefineInjectable
} from "./chunk-FMXFYYCS.js";

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
//# sourceMappingURL=static-content.service-G6JO3P2X.js.map
