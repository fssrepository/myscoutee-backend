import {
  AssetPopupStore
} from "./chunk-V6LEX33L.js";
import {
  ActivityInvitePopupStore
} from "./chunk-F5B73CZX.js";
import "./chunk-BRGZDNX3.js";
import "./chunk-XA4QEJLP.js";
import "./chunk-7UZYVY3Z.js";
import "./chunk-VBRGMXSL.js";
import "./chunk-2VFJ327H.js";
import "./chunk-4TXXTGDV.js";
import "./chunk-FS6LNZZ4.js";
import "./chunk-NX6X6SL6.js";
import "./chunk-SYKOEE4K.js";
import "./chunk-IMU76WCC.js";
import "./chunk-IRJFXW7R.js";
import {
  ProfileStore
} from "./chunk-EFQHKYZD.js";
import {
  AssetStore
} from "./chunk-HDRPEKFL.js";
import {
  SmartListComponent
} from "./chunk-JWRKXGRX.js";
import {
  DialogStore
} from "./chunk-LWXWCSPP.js";
import "./chunk-T6NM4FOV.js";
import "./chunk-2FA72P6F.js";
import "./chunk-A6AM4Z6L.js";
import "./chunk-DR3RAUWL.js";
import "./chunk-DDIPOAA4.js";
import {
  ImageCardComponent
} from "./chunk-MDKC4NXB.js";
import "./chunk-JJACTKXS.js";
import "./chunk-AQO6U4VN.js";
import "./chunk-V477GJDH.js";
import "./chunk-3KSYFEWX.js";
import "./chunk-QM6YAR3P.js";
import "./chunk-4DIW3NKM.js";
import "./chunk-GQZWVH6M.js";
import "./chunk-TGJIGH66.js";
import "./chunk-4VYYFWRA.js";
import "./chunk-FNZUUWCJ.js";
import {
  PopupComponent
} from "./chunk-LN2XQVUC.js";
import "./chunk-E63MLHVM.js";
import "./chunk-T5TB7V7K.js";
import "./chunk-J4QS2YUJ.js";
import {
  ActivityInviteCandidatesService,
  ActivityMembersService
} from "./chunk-XCPZRRU5.js";
import "./chunk-LGGVU5AE.js";
import "./chunk-6RAUJLMB.js";
import "./chunk-JQCFZPHN.js";
import {
  AppRuntimeStore
} from "./chunk-J5KOSTYM.js";
import "./chunk-MC3W6CB7.js";
import "./chunk-FAW3YKWN.js";
import {
  AppUtils
} from "./chunk-QZPIQIRC.js";
import "./chunk-LCSKRGZO.js";
import "./chunk-I52TUHFM.js";
import "./chunk-WWXJW2FL.js";
import "./chunk-NB6L6NLP.js";
import "./chunk-U4O3FETT.js";
import "./chunk-JMCIB2VE.js";
import "./chunk-DP7O5TZ4.js";
import "./chunk-OJADXSXP.js";
import {
  UserProfileStore
} from "./chunk-52XNNRXY.js";
import "./chunk-27OFLLFL.js";
import "./chunk-SXVGSFEZ.js";
import "./chunk-YO3STUCM.js";
import "./chunk-ZBAABSP3.js";
import "./chunk-ON23DQAQ.js";
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostListener,
  TemplateRef,
  ViewChild,
  __spreadValues,
  effect,
  from,
  inject,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵloadQuery,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵqueryRefresh,
  ɵɵresetView,
  ɵɵresolveWindow,
  ɵɵrestoreView,
  ɵɵtemplate,
  ɵɵtemplateRefExtractor,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵviewQuery
} from "./chunk-FMXFYYCS.js";

// src/app/asset/components/asset-member-picker-popup/asset-member-picker-popup.component.ts
var _c0 = ["inviteSmartList"];
var _c1 = ["inviteItemTemplate"];
function AssetMemberPickerPopupComponent_Conditional_0_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 4);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.confirmErrorMessage);
  }
}
function AssetMemberPickerPopupComponent_Conditional_0_ng_template_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "app-image-card", 6);
    \u0275\u0275listener("mediaAction", function AssetMemberPickerPopupComponent_Conditional_0_ng_template_5_Template_app_image_card_mediaAction_0_listener($event) {
      const candidate_r4 = \u0275\u0275restoreView(_r3).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.onInviteCandidateMediaAction(candidate_r4, $event));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const candidate_r4 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("card", ctx_r1.inviteCandidateCard(candidate_r4))("mediaActions", ctx_r1.inviteCandidateMediaActions(candidate_r4));
  }
}
function AssetMemberPickerPopupComponent_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "app-popup", 2)(1, "div", 3);
    \u0275\u0275conditionalCreate(2, AssetMemberPickerPopupComponent_Conditional_0_Conditional_2_Template, 2, 1, "p", 4);
    \u0275\u0275elementStart(3, "app-smart-list", 5, 0);
    \u0275\u0275listener("stateChange", function AssetMemberPickerPopupComponent_Conditional_0_Template_app_smart_list_stateChange_3_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onInviteSmartListStateChange($event));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275template(5, AssetMemberPickerPopupComponent_Conditional_0_ng_template_5_Template, 1, 2, "ng-template", null, 1, \u0275\u0275templateRefExtractor);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("model", ctx_r1.invitePopupModel())("zIndex", ctx_r1.invitePopupZIndex());
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r1.confirmErrorMessage ? 2 : -1);
    \u0275\u0275advance();
    \u0275\u0275property("config", ctx_r1.inviteSmartListConfig)("loaders", ctx_r1.inviteSmartListLoaders)("itemTemplate", ctx_r1.inviteItemTemplateRef ?? null)("query", ctx_r1.inviteSmartListQuery);
  }
}
var AssetMemberPickerPopupComponent = class _AssetMemberPickerPopupComponent {
  cdr = inject(ChangeDetectorRef);
  userProfileStore = inject(UserProfileStore);
  runtimeStore = inject(AppRuntimeStore);
  activityInviteStore = inject(ActivityInvitePopupStore);
  dialogStore = inject(DialogStore);
  activityInviteCandidatesService = inject(ActivityInviteCandidatesService);
  activityMembersService = inject(ActivityMembersService);
  assetPopupStore = inject(AssetPopupStore);
  assetStore = inject(AssetStore);
  profileStore = inject(ProfileStore);
  isOpen = false;
  title = "Invite members";
  ownerId = "";
  ownerType = "event";
  parentOwner = null;
  inviteSort = "recent";
  selectedUserIds = [];
  inviteSmartListQuery = {};
  confirmErrorMessage = "";
  isConfirmPending = false;
  currentCandidates = [];
  persistedSelectedUserIds = /* @__PURE__ */ new Set();
  candidatesByUserId = /* @__PURE__ */ new Map();
  candidateQueryKey = "";
  existingInviteMemberUserIds = [];
  pendingInviteUserIds = [];
  candidatePagesByKey = /* @__PURE__ */ new Map();
  localCandidates = [];
  isLocalCandidateSource = false;
  inviteSelectionHydrated = false;
  inviteApplyHandler = null;
  closeOwnerPopupOnClose = false;
  inviteSmartList;
  inviteItemTemplateRef;
  set inviteItemTemplate(value) {
    this.inviteItemTemplateRef = value;
    this.cdr.markForCheck();
  }
  inviteSmartListConfig = {
    pageSize: 16,
    defaultView: "list",
    headerProgress: {
      enabled: true,
      state: () => this.runtimeStore.isDataSourceAvailable() ? "active" : "inactive"
    },
    showStickyHeader: false,
    showGroupMarker: () => false,
    emptyLabel: "No invite candidates right now.",
    emptyDescription: "Meet more people first or try again later.",
    listLayout: "card-grid",
    desktopColumns: 4,
    mobileColumns: 2,
    snapMode: "none",
    containerClass: {
      "experience-card-list": true,
      "assets-card-list": true,
      "activity-members-list-shell": true
    },
    trackBy: (_index, entry) => entry.id
  };
  inviteSmartListLoaders = {
    list: (query) => from(this.loadInviteCandidatesPage(query))
  };
  invitePopupModel() {
    return {
      title: "Invite members",
      subtitle: this.title !== "Invite members" ? this.title : null,
      translateSubtitle: false,
      ariaLabel: "Invite members",
      closeAriaLabel: "Close",
      size: "wide",
      height: "full",
      headerTone: "accent",
      bodyLayout: "fill",
      headerControls: this.invitePopupHeaderControls(),
      toolbarControls: this.invitePopupToolbarControls(),
      onClose: (event) => this.closeInvitePopup(event),
      onMenuSelect: (event) => this.onInviteMenuSelect(event.itemSelect)
    };
  }
  invitePopupZIndex() {
    return 12480;
  }
  invitePopupHeaderControls() {
    return [{
      kind: "menu",
      id: "invite-actions",
      menuKind: "inline",
      items: this.inviteConfirmMenuItems(),
      panelAlign: "end",
      mobileBreakpointPx: 900,
      closeOnSelect: false
    }];
  }
  invitePopupToolbarControls() {
    return [{
      kind: "menu",
      id: "invite-sort",
      align: "end",
      trigger: this.inviteSortMenuTrigger(),
      items: this.inviteSortMenuItems(),
      mobileBreakpointPx: 900
    }];
  }
  constructor() {
    effect(() => {
      const context = this.activityInviteStore.activityInvitePopup();
      if (!context?.ownerId?.trim()) {
        this.resetState();
        return;
      }
      this.isOpen = true;
      this.ownerId = context.ownerId.trim();
      this.ownerType = context.ownerType ?? "event";
      this.parentOwner = context.parentOwner?.ownerId?.trim() ? {
        ownerId: context.parentOwner.ownerId.trim(),
        ownerType: context.parentOwner.ownerType
      } : null;
      this.title = context.title?.trim() || "Invite members";
      this.inviteSort = "recent";
      this.selectedUserIds = [];
      this.persistedSelectedUserIds = /* @__PURE__ */ new Set();
      this.confirmErrorMessage = "";
      this.isConfirmPending = false;
      this.currentCandidates = [];
      this.candidatesByUserId.clear();
      this.candidateQueryKey = "";
      this.existingInviteMemberUserIds = [];
      this.pendingInviteUserIds = [];
      this.candidatePagesByKey.clear();
      this.localCandidates = Array.isArray(context.initialCandidates) ? context.initialCandidates.map((candidate) => __spreadValues({}, candidate)) : [];
      this.isLocalCandidateSource = this.localCandidates.length > 0;
      this.inviteSelectionHydrated = false;
      this.inviteApplyHandler = context.onApply ?? null;
      this.closeOwnerPopupOnClose = context.closeOwnerPopupOnClose === true;
      this.syncInviteSmartListQuery();
      this.cdr.markForCheck();
    });
  }
  onEscapePressed(event) {
    const keyboardEvent = event;
    if (!this.isOpen || keyboardEvent.defaultPrevented) {
      return;
    }
    keyboardEvent.preventDefault();
    keyboardEvent.stopPropagation();
    this.closeInvitePopup();
  }
  onInviteSmartListStateChange(change) {
    for (const entry of change.items) {
      this.candidatesByUserId.set(entry.userId, __spreadValues({}, entry));
    }
    this.cdr.markForCheck();
  }
  closeInvitePopup(event) {
    event?.stopPropagation();
    if (this.isConfirmPending) {
      return;
    }
    const shouldCloseOwnerPopup = this.closeOwnerPopupOnClose;
    this.activityInviteStore.closeActivityInvitePopup();
    this.resetState();
    if (shouldCloseOwnerPopup) {
      this.assetStore.closeAssetPopup();
      this.assetPopupStore.resetTicketState();
      this.assetPopupStore.primaryVisibleRef.set(false);
    }
  }
  inviteSortMenuTrigger() {
    return {
      label: this.inviteSort === "recent" ? "Recent" : "Relevant",
      icon: this.inviteSort === "recent" ? "schedule" : "auto_awesome",
      palette: this.inviteSort === "recent" ? "blue" : "violet",
      disabled: () => this.isConfirmPending,
      layout: "pill",
      ariaLabel: "Open invite sort"
    };
  }
  inviteSortMenuItems() {
    return [
      {
        id: "invite-sort-recent",
        label: "Recent",
        icon: "schedule",
        kind: "radio",
        active: this.inviteSort === "recent",
        palette: "blue",
        surface: "tinted",
        context: { menu: "invite-sort", sort: "recent" }
      },
      {
        id: "invite-sort-relevant",
        label: "Relevant",
        icon: "auto_awesome",
        kind: "radio",
        active: this.inviteSort === "relevant",
        palette: "violet",
        surface: "tinted",
        context: { menu: "invite-sort", sort: "relevant" }
      }
    ];
  }
  inviteConfirmMenuItems() {
    const hasError = !this.isConfirmPending && !!this.confirmErrorMessage;
    const items = [];
    const count = this.selectedInviteCount();
    if (count > 0) {
      items.push({
        id: "invite-basket",
        icon: "groups",
        openIcon: "groups",
        palette: "blue",
        kind: "branch",
        counter: count,
        ariaLabel: "Open selected members",
        items: this.selectedInviteBasketMenuItems()
      });
    }
    items.push({
      id: "invite-confirm",
      icon: "done",
      layout: "action",
      palette: hasError || !this.hasSelectionChanges() ? "danger" : "success",
      disabled: !this.canConfirmSelection(),
      ariaLabel: "Invite selected members",
      progress: this.isConfirmPending || hasError ? {
        state: this.isConfirmPending ? "loading" : "error",
        shape: "circle"
      } : null,
      context: { menu: "confirm" }
    });
    return items;
  }
  selectedInviteBasketMenuItems() {
    return this.selectedInviteChips().map((candidate) => ({
      id: `invite-basket-${candidate.userId}`,
      label: candidate.name,
      description: this.inviteMetLabel(candidate),
      icon: "person",
      kind: "action",
      palette: "blue",
      surface: "tinted",
      removable: true,
      removeIcon: "close",
      removeAriaLabel: `Remove ${candidate.name}`,
      closeOnSelect: false,
      context: { menu: "invite-basket", candidate }
    }));
  }
  onInviteMenuSelect(event) {
    const context = event.context;
    if (!context) {
      return;
    }
    if (context.menu === "invite-basket") {
      if (event.action === "remove") {
        this.toggleInviteCandidate(context.candidate.userId, event.sourceEvent);
      }
      return;
    }
    if (context.menu === "confirm") {
      void this.confirmSelection(event.sourceEvent);
      return;
    }
    this.selectInviteSort(context.sort);
  }
  selectInviteSort(sort) {
    if (this.isConfirmPending) {
      return;
    }
    if (this.inviteSort === sort) {
      this.cdr.markForCheck();
      return;
    }
    this.inviteSort = sort;
    this.currentCandidates = [];
    this.candidatesByUserId.clear();
    this.candidateQueryKey = "";
    this.candidatePagesByKey.clear();
    this.syncInviteSmartListQuery();
    this.inviteSmartList?.reload();
    this.cdr.markForCheck();
  }
  canConfirmSelection() {
    return this.hasSelectionChanges() && !this.isConfirmPending;
  }
  async confirmSelection(event) {
    event?.stopPropagation();
    if (!this.canConfirmSelection()) {
      return;
    }
    const selected = this.selectedInviteChips();
    this.isConfirmPending = true;
    this.confirmErrorMessage = "";
    this.cdr.markForCheck();
    try {
      const result = await this.applySelection(selected);
      this.isConfirmPending = false;
      this.cdr.markForCheck();
      this.closeInvitePopup();
      this.openInviteRejectionNotice(result);
    } catch {
      this.isConfirmPending = false;
      this.confirmErrorMessage = "Unable to invite selected members.";
      this.cdr.markForCheck();
    }
  }
  toggleInviteCandidate(userId, event) {
    event?.stopPropagation();
    if (this.isConfirmPending) {
      return;
    }
    const normalizedUserId = userId.trim();
    if (!normalizedUserId) {
      return;
    }
    if (this.selectedUserIds.includes(normalizedUserId)) {
      this.selectedUserIds = this.selectedUserIds.filter((id) => id !== normalizedUserId);
      this.cdr.markForCheck();
      return;
    }
    this.selectedUserIds = [...this.selectedUserIds, normalizedUserId];
    this.cdr.markForCheck();
  }
  isInviteCandidateSelected(userId) {
    return this.selectedUserIds.includes(userId.trim());
  }
  isInviteCandidatePersisted(userId) {
    return this.persistedSelectedUserIds.has(userId);
  }
  selectedInviteCount() {
    return this.selectedUserIds.length;
  }
  selectedInviteChips() {
    return this.selectedUserIds.map((userId) => this.candidatesByUserId.get(userId) ?? this.currentCandidates.find((entry) => entry.userId === userId) ?? null).filter((entry) => Boolean(entry));
  }
  inviteMetLabel(entry) {
    const parsed = new Date(entry.metAtIso);
    const dateLabel = Number.isNaN(parsed.getTime()) ? "" : parsed.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
    return dateLabel ? `${entry.metWhere} \xB7 ${dateLabel}` : entry.metWhere;
  }
  inviteCandidateCard(candidate) {
    return {
      id: candidate.id,
      title: candidate.name,
      subtitle: this.inviteMetLabel(candidate),
      imageUrl: candidate.avatarUrl,
      aspectRatio: "3 / 4",
      mediaFit: "contain",
      placeholderIcon: "highlight_off",
      placeholderLabel: candidate.initials,
      layout: "overlay",
      toneClass: "subevent-member-image-card activity-member-image-card asset-invite-candidate-card"
    };
  }
  inviteCandidateMediaActions(candidate) {
    const selected = this.isInviteCandidateSelected(candidate.userId);
    return [
      {
        id: "toggle",
        icon: "add",
        selectedIcon: "check",
        ariaLabel: selected ? "Unselect friend" : "Select friend",
        position: "top-right",
        tone: selected ? "success" : "default",
        selected,
        disabled: this.isConfirmPending,
        className: this.isInviteCandidatePersisted(candidate.userId) ? "is-persisted" : null
      },
      {
        id: "view",
        icon: "visibility",
        ariaLabel: "View profile",
        position: "bottom-right",
        tone: "info",
        disabled: this.isConfirmPending
      }
    ];
  }
  onInviteCandidateMediaAction(candidate, event) {
    switch (event.action.id) {
      case "toggle":
        this.toggleInviteCandidate(candidate.userId, event.sourceEvent);
        return;
      case "view":
        this.viewCandidateProfile(candidate, event.sourceEvent);
        return;
      default:
        return;
    }
  }
  viewCandidateProfile(candidate, event) {
    event.stopPropagation();
    const userId = `${candidate.userId ?? ""}`.trim();
    if (!userId) {
      return;
    }
    this.profileStore.openProfileView({
      userId,
      label: candidate.name
    });
  }
  resetState() {
    this.isOpen = false;
    this.title = "Invite members";
    this.ownerId = "";
    this.ownerType = "event";
    this.parentOwner = null;
    this.inviteSort = "recent";
    this.selectedUserIds = [];
    this.inviteSmartListQuery = {};
    this.confirmErrorMessage = "";
    this.isConfirmPending = false;
    this.currentCandidates = [];
    this.persistedSelectedUserIds = /* @__PURE__ */ new Set();
    this.candidatesByUserId.clear();
    this.candidateQueryKey = "";
    this.existingInviteMemberUserIds = [];
    this.pendingInviteUserIds = [];
    this.candidatePagesByKey.clear();
    this.localCandidates = [];
    this.isLocalCandidateSource = false;
    this.inviteSelectionHydrated = false;
    this.inviteApplyHandler = null;
    this.closeOwnerPopupOnClose = false;
    this.cdr.markForCheck();
  }
  syncInviteSmartListQuery() {
    this.inviteSmartListQuery = {
      filters: {
        ownerId: this.ownerId,
        sort: this.inviteSort,
        fallbackTitle: this.title
      }
    };
  }
  sortLocalCandidates(sort) {
    const candidates = this.localCandidates.map((candidate) => __spreadValues({}, candidate));
    if (sort === "relevant") {
      return candidates;
    }
    return candidates.sort((left, right) => {
      return AppUtils.toSortableDate(right.actionAtIso) - AppUtils.toSortableDate(left.actionAtIso);
    });
  }
  async loadInviteCandidatesPage(query) {
    const ownerId = query.filters?.ownerId?.trim() ?? "";
    if (!ownerId) {
      return {
        items: [],
        total: 0
      };
    }
    const inviteSort = query.filters?.sort === "relevant" ? "relevant" : "recent";
    const queryKey = `${ownerId}:${this.ownerType}:${inviteSort}:${query.filters?.fallbackTitle ?? ""}:${this.isLocalCandidateSource ? "local" : "shared"}`;
    if (queryKey !== this.candidateQueryKey) {
      this.currentCandidates = [];
      this.candidatesByUserId.clear();
      this.candidatePagesByKey.clear();
      const activeUserId = this.userProfileStore.activeUserId().trim();
      if (this.isLocalCandidateSource) {
        this.persistedSelectedUserIds = /* @__PURE__ */ new Set();
        this.currentCandidates = this.sortLocalCandidates(inviteSort);
      } else {
        const ownerRef = {
          ownerType: this.ownerType,
          ownerId
        };
        const cachedMembers = this.activityMembersService.peekMembersByOwner(ownerRef);
        const hasCachedMemberState = cachedMembers.length > 0 || !!this.activityMembersService.peekSummaryByOwner(ownerRef);
        let currentMembers = hasCachedMemberState ? cachedMembers : await this.activityMembersService.queryMembersByOwner(ownerRef);
        const persistedMembers = currentMembers.filter((member) => member.userId !== activeUserId && member.status === "pending" && member.requestKind === "invite");
        this.persistedSelectedUserIds = new Set(persistedMembers.map((member) => member.userId));
        this.pendingInviteUserIds = [...this.persistedSelectedUserIds];
        this.existingInviteMemberUserIds = [
          .../* @__PURE__ */ new Set([
            ...currentMembers.map((member) => member.userId),
            ...this.persistedSelectedUserIds
          ])
        ];
        if (!this.inviteSelectionHydrated) {
          this.selectedUserIds = [...this.persistedSelectedUserIds];
          this.inviteSelectionHydrated = true;
        } else {
          this.selectedUserIds = this.selectedUserIds.filter((userId) => this.persistedSelectedUserIds.has(userId) || userId.length > 0);
        }
        for (const member of persistedMembers) {
          this.candidatesByUserId.set(member.userId, __spreadValues({}, member));
        }
      }
      this.candidateQueryKey = queryKey;
      this.cdr.markForCheck();
    }
    const pageSize = Math.max(1, Number(query.pageSize) || 16);
    const page = Math.max(0, Number(query.page) || 0);
    if (this.isLocalCandidateSource) {
      const startIndex = page * pageSize;
      return {
        items: this.currentCandidates.slice(startIndex, startIndex + pageSize),
        total: this.currentCandidates.length
      };
    }
    const pageKey = `${queryKey}:${page}:${pageSize}`;
    let candidatePage = this.candidatePagesByKey.get(pageKey);
    if (!candidatePage) {
      candidatePage = await this.activityInviteCandidatesService.queryCandidatesByOwner(ownerId, inviteSort, query.filters?.fallbackTitle, this.ownerType, this.existingInviteMemberUserIds, this.pendingInviteUserIds, this.parentOwner, page, pageSize);
      this.candidatePagesByKey.set(pageKey, candidatePage);
    }
    const knownCandidatesByUserId = new Map(this.currentCandidates.map((candidate) => [candidate.userId, candidate]));
    for (const candidate of candidatePage.items) {
      knownCandidatesByUserId.set(candidate.userId, __spreadValues({}, candidate));
      this.candidatesByUserId.set(candidate.userId, __spreadValues({}, candidate));
    }
    this.currentCandidates = [...knownCandidatesByUserId.values()];
    return {
      items: candidatePage.items.map((candidate) => __spreadValues({}, candidate)),
      total: candidatePage.total
    };
  }
  hasSelectionChanges() {
    if (this.selectedUserIds.length !== this.persistedSelectedUserIds.size) {
      return true;
    }
    return this.selectedUserIds.some((userId) => !this.persistedSelectedUserIds.has(userId));
  }
  async applySelection(selected) {
    if (this.inviteApplyHandler) {
      return Promise.resolve(this.inviteApplyHandler(selected));
    }
    return this.activityInviteCandidatesService.applyInvites(this.ownerId, selected, this.ownerType);
  }
  openInviteRejectionNotice(result) {
    const rejections = result?.rejections ?? [];
    if (rejections.length === 0) {
      return;
    }
    const capacityRejected = rejections.some((rejection) => rejection.reason === "capacity-full");
    this.dialogStore.openNotice(capacityRejected ? "event.members.invite.capacity.full.message" : "event.members.invite.not.sent.message", {
      title: capacityRejected ? "event.members.invite.capacity.full.title" : "event.members.invite.not.sent.title",
      confirmTone: capacityRejected ? "warning" : "danger"
    });
  }
  static \u0275fac = function AssetMemberPickerPopupComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AssetMemberPickerPopupComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AssetMemberPickerPopupComponent, selectors: [["app-asset-member-picker-popup"]], viewQuery: function AssetMemberPickerPopupComponent_Query(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275viewQuery(_c0, 5)(_c1, 5, TemplateRef);
    }
    if (rf & 2) {
      let _t;
      \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.inviteSmartList = _t.first);
      \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.inviteItemTemplate = _t.first);
    }
  }, hostBindings: function AssetMemberPickerPopupComponent_HostBindings(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275listener("keydown.escape", function AssetMemberPickerPopupComponent_keydown_escape_HostBindingHandler($event) {
        return ctx.onEscapePressed($event);
      }, \u0275\u0275resolveWindow);
    }
  }, decls: 1, vars: 1, consts: [["inviteSmartList", ""], ["inviteItemTemplate", ""], [3, "model", "zIndex"], [1, "asset-member-picker-content"], [1, "asset-member-picker-confirm-error"], [1, "asset-member-picker-smart-list", 3, "stateChange", "config", "loaders", "itemTemplate", "query"], [3, "mediaAction", "card", "mediaActions"]], template: function AssetMemberPickerPopupComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275conditionalCreate(0, AssetMemberPickerPopupComponent_Conditional_0_Template, 7, 7, "app-popup", 2);
    }
    if (rf & 2) {
      \u0275\u0275conditional(ctx.isOpen ? 0 : -1);
    }
  }, dependencies: [
    PopupComponent,
    SmartListComponent,
    ImageCardComponent
  ], styles: ["\n[_nghost-%COMP%] {\n  display: contents;\n}\n.asset-member-picker-content[_ngcontent-%COMP%] {\n  height: 100%;\n  min-height: 0;\n  display: flex;\n  flex-direction: column;\n  gap: 0.58rem;\n}\n.asset-member-picker-confirm-error[_ngcontent-%COMP%] {\n  margin: -0.12rem 0 0;\n  color: #a32f3d;\n  font-size: 0.76rem;\n  font-weight: 700;\n}\n.asset-member-picker-smart-list[_ngcontent-%COMP%] {\n  display: flex;\n  flex: 1 1 auto;\n  min-height: 0;\n  height: 100%;\n  touch-action: pan-y;\n}\n/*# sourceMappingURL=asset-member-picker-popup.component.css.map */"], changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AssetMemberPickerPopupComponent, [{
    type: Component,
    args: [{ selector: "app-asset-member-picker-popup", standalone: true, imports: [
      PopupComponent,
      SmartListComponent,
      ImageCardComponent
    ], changeDetection: ChangeDetectionStrategy.OnPush, template: '@if (isOpen) {\n  <app-popup [model]="invitePopupModel()" [zIndex]="invitePopupZIndex()">\n    <div class="asset-member-picker-content">\n      @if (confirmErrorMessage) {\n        <p class="asset-member-picker-confirm-error">{{ confirmErrorMessage }}</p>\n      }\n      <app-smart-list\n        #inviteSmartList\n        class="asset-member-picker-smart-list"\n        [config]="inviteSmartListConfig"\n        [loaders]="inviteSmartListLoaders"\n        [itemTemplate]="inviteItemTemplateRef ?? null"\n        [query]="inviteSmartListQuery"\n        (stateChange)="onInviteSmartListStateChange($event)"\n      ></app-smart-list>\n      <ng-template #inviteItemTemplate let-candidate>\n        <app-image-card\n          [card]="inviteCandidateCard(candidate)"\n          [mediaActions]="inviteCandidateMediaActions(candidate)"\n          (mediaAction)="onInviteCandidateMediaAction(candidate, $event)"\n        ></app-image-card>\n      </ng-template>\n    </div>\n  </app-popup>\n}\n', styles: ["/* src/app/asset/components/asset-member-picker-popup/asset-member-picker-popup.component.scss */\n:host {\n  display: contents;\n}\n.asset-member-picker-content {\n  height: 100%;\n  min-height: 0;\n  display: flex;\n  flex-direction: column;\n  gap: 0.58rem;\n}\n.asset-member-picker-confirm-error {\n  margin: -0.12rem 0 0;\n  color: #a32f3d;\n  font-size: 0.76rem;\n  font-weight: 700;\n}\n.asset-member-picker-smart-list {\n  display: flex;\n  flex: 1 1 auto;\n  min-height: 0;\n  height: 100%;\n  touch-action: pan-y;\n}\n/*# sourceMappingURL=asset-member-picker-popup.component.css.map */\n"] }]
  }], () => [], { inviteSmartList: [{
    type: ViewChild,
    args: ["inviteSmartList"]
  }], inviteItemTemplate: [{
    type: ViewChild,
    args: ["inviteItemTemplate", { read: TemplateRef }]
  }], onEscapePressed: [{
    type: HostListener,
    args: ["window:keydown.escape", ["$event"]]
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AssetMemberPickerPopupComponent, { className: "AssetMemberPickerPopupComponent", filePath: "app/asset/components/asset-member-picker-popup/asset-member-picker-popup.component.ts", lineNumber: 81 });
})();
export {
  AssetMemberPickerPopupComponent
};
//# sourceMappingURL=asset-member-picker-popup.component-W3XJJTKU.js.map
