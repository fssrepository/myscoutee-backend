import {
  APP_STATIC_DATA
} from "./chunk-FAW3YKWN.js";
import {
  AppUtils
} from "./chunk-QZPIQIRC.js";
import {
  __spreadValues
} from "./chunk-FMXFYYCS.js";

// src/app/shared/ui/components/side-menu/side-menu-presenters.ts
function resolveSideMenuPresentation(kind, value) {
  const catalog = sideMenuPresentationCatalog(kind);
  const presenter = AppUtils.findByAlias(catalog.entries, value);
  const fallback = catalog.fallback;
  return __spreadValues({
    aliases: presenter?.aliases ?? fallback.aliases,
    icon: presenter?.icon ?? fallback.icon,
    colorClass: presenter?.colorClass ?? fallback.colorClass,
    toneClass: presenter?.toneClass ?? fallback.toneClass,
    menuPalette: presenter?.menuPalette ?? fallback.menuPalette
  }, kind === "trait" ? { memberTitle: resolveMemberImpressionTitle(value) } : {});
}
function sideMenuPresentationCatalog(kind) {
  if (kind === "title") {
    return {
      entries: APP_STATIC_DATA.navigatorMemberImpressionTitlePresenters,
      fallback: APP_STATIC_DATA.navigatorTraitPresenterDefault
    };
  }
  if (kind === "trait") {
    return {
      entries: APP_STATIC_DATA.navigatorTraitPresenters,
      fallback: APP_STATIC_DATA.navigatorTraitPresenterDefault
    };
  }
  return {
    entries: APP_STATIC_DATA.navigatorHostTierPresenters,
    fallback: APP_STATIC_DATA.navigatorHostTierPresenterDefault
  };
}
function resolveMemberImpressionTitle(traitLabel) {
  const catalog = sideMenuPresentationCatalog("title");
  const presenter = AppUtils.findByAlias(catalog.entries, traitLabel);
  if (presenter?.memberTitle) {
    return presenter.memberTitle;
  }
  const defaultTitle = catalog.fallback.memberTitle ?? "Attendee";
  const label = `${traitLabel ?? ""}`.trim();
  return label ? `${label} ${defaultTitle}` : defaultTitle;
}

export {
  resolveSideMenuPresentation
};
//# sourceMappingURL=chunk-PS66FV4D.js.map
