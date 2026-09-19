import {
  __spreadProps,
  __spreadValues
} from "./chunk-EV3I3YNV.js";

// src/app/shared/core/contracts/deployment-configuration.interface.ts
var DEPLOYMENT_THEME_PRESETS = [
  "AURORA",
  "OCEAN",
  "FOREST",
  "SUNSET",
  "VIOLET",
  "ROSE",
  "AMBER",
  "SLATE",
  "AQUARIUS",
  "MONOCHROME"
];
var DEFAULT_DEPLOYMENT_BRANDING = {
  productName: "MyScoutee",
  homeLabel: "Your preferences come first",
  logoUrl: "assets/logo/heart.webp",
  logoCharacterIndex: 0,
  themePreset: "VIOLET",
  revision: 0
};
var DEFAULT_DEPLOYMENT_SOCIAL_LINKS = [];
var DEFAULT_DEPLOYMENT_PRIVACY_CONTACT = {
  configured: false,
  dataControllerName: "",
  privacyContactEmail: ""
};
var DEFAULT_DEPLOYMENT_CONFIGURATION = __spreadProps(__spreadValues({}, DEFAULT_DEPLOYMENT_BRANDING), {
  paymentProviderId: null,
  firebaseMessagingConfigured: false,
  socialLinks: DEFAULT_DEPLOYMENT_SOCIAL_LINKS,
  privacyContact: DEFAULT_DEPLOYMENT_PRIVACY_CONTACT
});

export {
  DEPLOYMENT_THEME_PRESETS,
  DEFAULT_DEPLOYMENT_BRANDING,
  DEFAULT_DEPLOYMENT_SOCIAL_LINKS,
  DEFAULT_DEPLOYMENT_PRIVACY_CONTACT,
  DEFAULT_DEPLOYMENT_CONFIGURATION
};
//# sourceMappingURL=chunk-QXOIA7DH.js.map
