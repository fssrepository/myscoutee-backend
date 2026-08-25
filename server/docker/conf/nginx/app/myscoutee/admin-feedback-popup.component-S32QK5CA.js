import "./chunk-JDMFSJZK.js";
import "./chunk-GNEKNDCW.js";
import "./chunk-WYVDSPFZ.js";
import "./chunk-64GWAN6R.js";
import "./chunk-ZIP4R74W.js";
import "./chunk-I6EOSNBR.js";
import "./chunk-3HTTRAEW.js";
import "./chunk-SYKOEE4K.js";
import "./chunk-KQF6FQ63.js";
import "./chunk-YOGAOTLT.js";
import {
  SmartListComponent
} from "./chunk-IJVUZ62I.js";
import "./chunk-VGRWBYOR.js";
import "./chunk-XIFXW5X2.js";
import "./chunk-2K5TOPNO.js";
import "./chunk-654Z7UJY.js";
import "./chunk-H3IGIWEC.js";
import "./chunk-RRRWUAB3.js";
import {
  ActivityChatSingleRowConverter
} from "./chunk-EWJPTHFE.js";
import "./chunk-RJSPRCFL.js";
import {
  SingleRowComponent
} from "./chunk-BEAS7CFC.js";
import "./chunk-EGWJQCT5.js";
import "./chunk-YTMD6HU4.js";
import "./chunk-4VYYFWRA.js";
import "./chunk-QEZI4ZBE.js";
import "./chunk-MEY2M2U3.js";
import "./chunk-ZBJCMF52.js";
import {
  PopupComponent
} from "./chunk-3VXLUVWM.js";
import "./chunk-VEYRCVMX.js";
import "./chunk-MVR37RGJ.js";
import {
  I18nPipe
} from "./chunk-FOAFZS65.js";
import "./chunk-OAYWPJGG.js";
import {
  DialogStore
} from "./chunk-6TR3Z2F3.js";
import "./chunk-U46O4F4Y.js";
import {
  MatIconModule
} from "./chunk-EDHGCWPF.js";
import "./chunk-CUDLB52K.js";
import {
  AdminWorkspaceStore
} from "./chunk-4WZBG7IG.js";
import {
  AdminMenuStore
} from "./chunk-ZJ74HL3J.js";
import "./chunk-QE3AUXWT.js";
import {
  AdminWorkspaceDataService
} from "./chunk-2LVO4Z3J.js";
import "./chunk-PK4DOAMC.js";
import "./chunk-4M7S3PHB.js";
import "./chunk-5PHTFUHA.js";
import {
  APP_STATIC_DATA
} from "./chunk-F4WY6ECV.js";
import {
  I18nService
} from "./chunk-Q3344WPR.js";
import {
  AppUtils
} from "./chunk-XQ4NDAVX.js";
import "./chunk-4FWVIYNI.js";
import "./chunk-7MTG4XZU.js";
import {
  CommonModule,
  NgClass
} from "./chunk-J7IJFFQ2.js";
import "./chunk-XQACYBVS.js";
import "./chunk-YKC4KBEC.js";
import "./chunk-B2DKYQGD.js";
import "./chunk-KLUOB5SD.js";
import "./chunk-6POEHVT7.js";
import "./chunk-2ENBQWLU.js";
import "./chunk-LERGHE7K.js";
import "./chunk-D6ZHKNYF.js";
import "./chunk-SKAK727J.js";
import {
  Component,
  TemplateRef,
  ViewChild,
  from,
  inject,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵloadQuery,
  ɵɵnextContext,
  ɵɵpipe,
  ɵɵpipeBind1,
  ɵɵproperty,
  ɵɵqueryRefresh,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵstyleProp,
  ɵɵtemplate,
  ɵɵtemplateRefExtractor,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵviewQuery
} from "./chunk-XJL7SWH7.js";

// src/app/admin/components/feedback-popup/admin-feedback-popup.component.ts
var _c0 = ["feedbackItemTemplate"];
var _c1 = ["feedbackSmartList"];
function AdminFeedbackPopupComponent_Conditional_0_ng_template_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "single-row", 6);
    \u0275\u0275listener("rowClick", function AdminFeedbackPopupComponent_Conditional_0_ng_template_4_Template_single_row_rowClick_0_listener() {
      const item_r4 = \u0275\u0275restoreView(_r3).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.selectFeedback(item_r4));
    })("menuRequest", function AdminFeedbackPopupComponent_Conditional_0_ng_template_4_Template_single_row_menuRequest_0_listener($event) {
      const openMenu_r5 = \u0275\u0275restoreView(_r3).openMenu;
      return \u0275\u0275resetView(openMenu_r5($event));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const item_r4 = ctx.$implicit;
    const groupLabel_r6 = ctx.groupLabel;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("row", ctx_r1.feedbackSingleRow(item_r4, groupLabel_r6))("clickable", true)("useSharedMenu", true)("sharedMenuContext", ctx_r1.feedbackRowMenuContext(item_r4));
  }
}
function AdminFeedbackPopupComponent_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "app-popup", 2)(1, "div", 4)(2, "app-smart-list", 5, 0);
    \u0275\u0275listener("menuItemSelect", function AdminFeedbackPopupComponent_Conditional_0_Template_app_smart_list_menuItemSelect_2_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onFeedbackRowMenuSelect($event));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275template(4, AdminFeedbackPopupComponent_Conditional_0_ng_template_4_Template, 1, 4, "ng-template", null, 1, \u0275\u0275templateRefExtractor);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("model", ctx_r1.feedbackPopupModel());
    \u0275\u0275advance(2);
    \u0275\u0275property("config", ctx_r1.feedbackSmartListConfig)("loadPage", ctx_r1.feedbackSmartListLoadPage)("query", ctx_r1.feedbackSmartListQuery)("itemTemplate", ctx_r1.feedbackItemTemplateRef ?? null);
  }
}
function AdminFeedbackPopupComponent_Conditional_1_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "span", 18);
  }
  if (rf & 2) {
    \u0275\u0275styleProp("background-image", "url(" + ctx + ")");
  }
}
function AdminFeedbackPopupComponent_Conditional_1_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 13);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const item_r7 = \u0275\u0275nextContext();
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.feedbackInitial(item_r7));
  }
}
function AdminFeedbackPopupComponent_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "app-popup", 3)(1, "div", 7)(2, "article", 8)(3, "div", 9)(4, "div", 10)(5, "span", 11);
    \u0275\u0275conditionalCreate(6, AdminFeedbackPopupComponent_Conditional_1_Conditional_6_Template, 1, 2, "span", 12)(7, AdminFeedbackPopupComponent_Conditional_1_Conditional_7_Template, 2, 1, "span", 13);
    \u0275\u0275elementStart(8, "strong");
    \u0275\u0275text(9);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(10, "span", 14);
    \u0275\u0275text(11);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(12, "span", 15);
    \u0275\u0275text(13);
    \u0275\u0275pipe(14, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "div", 16)(16, "div", 17)(17, "strong");
    \u0275\u0275text(18);
    \u0275\u0275pipe(19, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(20, "p");
    \u0275\u0275text(21);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(22, "div", 17)(23, "strong");
    \u0275\u0275text(24);
    \u0275\u0275pipe(25, "i18n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(26, "p");
    \u0275\u0275text(27);
    \u0275\u0275elementEnd()()()()()()();
  }
  if (rf & 2) {
    let tmp_5_0;
    const item_r7 = ctx;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("model", ctx_r1.feedbackDetailPopupModel(item_r7))("zIndex", 2400);
    \u0275\u0275advance(3);
    \u0275\u0275property("ngClass", ctx_r1.feedbackCategoryToneClass(item_r7));
    \u0275\u0275advance(3);
    \u0275\u0275conditional((tmp_5_0 = ctx_r1.feedbackAvatarUrl(item_r7)) ? 6 : 7, tmp_5_0);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(item_r7.userName);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.shortDate(item_r7.createdDate));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(14, 11, ctx_r1.feedbackCategoryLabel(item_r7)), " ");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(19, 13, "subject"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(item_r7.subject);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(25, 15, "details"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(item_r7.details);
  }
}
var AdminFeedbackPopupComponent = class _AdminFeedbackPopupComponent {
  admin = inject(AdminMenuStore);
  workspace = inject(AdminWorkspaceStore);
  workspaceData = inject(AdminWorkspaceDataService);
  dialogStore = inject(DialogStore);
  i18n = inject(I18nService);
  feedbackCategories = new Set(APP_STATIC_DATA.feedbackCategories);
  feedbackDetail = null;
  feedbackStatusFilter = "unresolved";
  feedbackSmartListQuery = {
    filters: { status: "unresolved" }
  };
  feedbackStatusCounts = {
    unresolved: 0,
    resolved: 0
  };
  feedbackItemTemplateRef;
  set feedbackItemTemplate(value) {
    this.feedbackItemTemplateRef = value;
  }
  feedbackSmartList;
  feedbackSmartListConfig = {
    pageSize: 10,
    initialPageSize: 20,
    defaultView: "day",
    emptyLabel: "admin.feedback.empty.title",
    emptyDescription: "admin.feedback.empty.description",
    showStickyHeader: true,
    showFirstGroupMarker: false,
    showGroupMarker: ({ groupIndex }) => groupIndex > 0,
    groupBy: (item) => AppUtils.activityGroupLabel(item.row, "day", APP_STATIC_DATA.activityGroupLabels),
    listLayout: "stack",
    snapMode: "none",
    scrollPaddingTop: "2.6rem",
    headerProgress: {
      enabled: true
    },
    containerClass: {
      "experience-card-list": true,
      "assets-card-list": true,
      "admin-simple-smart-list": true
    },
    trackBy: (_index, item) => item.id
  };
  feedbackSmartListLoadPage = (query) => from(this.loadFeedbackPage(query));
  feedbackPopupModel() {
    return {
      title: "application.feedback",
      subtitle: "feedback.submitted.from.the.app",
      ariaLabel: "application.feedback",
      closeAriaLabel: "close",
      size: "wide",
      height: "full",
      headerTone: "accent",
      bodyLayout: "fill",
      toolbarControls: [
        this.feedbackStatusToolbarControl()
      ],
      onClose: () => this.admin.closePopup(),
      onMenuSelect: (event) => this.onFeedbackPopupMenuSelect(event)
    };
  }
  feedbackDetailPopupModel(item) {
    return {
      title: "feedback.details",
      subtitle: `${item.userName} \xB7 ${this.feedbackListMeta(item)}`,
      ariaLabel: "feedback.details",
      closeAriaLabel: "close",
      size: "wide",
      height: "auto",
      headerTone: "accent",
      bodyLayout: "fill",
      backdropTone: "dim",
      onClose: () => this.closeFeedbackDetails()
    };
  }
  onFeedbackPopupMenuSelect(event) {
    const status = event.itemSelect.context?.status;
    if (!status) {
      return;
    }
    this.selectFeedbackStatus(status, event.itemSelect.sourceEvent);
  }
  selectFeedbackStatus(status, event) {
    event?.stopPropagation();
    if (this.feedbackStatusFilter === status) {
      return;
    }
    this.feedbackStatusFilter = status;
    this.closeFeedbackDetails();
    this.feedbackSmartListQuery = {
      filters: { status }
    };
  }
  feedbackStatusToolbarControl() {
    return {
      kind: "menu",
      id: "feedback-review-status-filter",
      align: "end",
      menuKind: "inline",
      model: this.feedbackStatusMenuModel(),
      panelAlign: "end"
    };
  }
  feedbackStatusMenuModel() {
    return {
      nodes: [
        {
          id: "feedback-review-status-root",
          items: [
            {
              id: "review-status-filter",
              kind: "select-trigger",
              label: this.reviewStatusLabel(this.feedbackStatusFilter),
              icon: this.reviewStatusIcon(this.feedbackStatusFilter),
              palette: this.reviewStatusPalette(this.feedbackStatusFilter),
              counter: this.feedbackStatusCount(this.feedbackStatusFilter),
              ariaLabel: "admin.feedback.review.status.filter",
              items: ["unresolved", "resolved"].map((status) => ({
                id: `review-status:${status}`,
                kind: "radio",
                label: this.reviewStatusLabel(status),
                icon: this.reviewStatusIcon(status),
                palette: this.reviewStatusPalette(status),
                surface: "tinted",
                checked: this.feedbackStatusFilter === status,
                counter: this.feedbackStatusCount(status),
                context: { status }
              }))
            }
          ]
        }
      ]
    };
  }
  reviewStatusLabel(status) {
    return status === "resolved" ? "admin.review.status.resolved" : "admin.review.status.unresolved";
  }
  reviewStatusIcon(status) {
    return status === "resolved" ? "task_alt" : "pending_actions";
  }
  reviewStatusPalette(status) {
    return status === "resolved" ? "success" : "warning";
  }
  feedbackStatusCount(status) {
    return Math.max(0, Math.trunc(Number(this.feedbackStatusCounts[status]) || 0));
  }
  selectFeedback(item) {
    this.feedbackDetail = item.feedback;
  }
  feedbackSingleRow(item, groupLabel) {
    const feedback = item.feedback;
    return {
      id: item.id,
      groupLabel,
      title: feedback.userName || "Feedback",
      subtitle: feedback.subject || this.feedbackCategoryLabel(feedback),
      detail: feedback.details || this.feedbackListMeta(feedback),
      avatarInitials: this.feedbackInitial(feedback),
      avatarUrl: this.feedbackAvatarUrl(feedback) || null,
      avatarAriaLabel: feedback.userName || "Feedback author",
      surfaceTone: this.feedbackSingleRowTone(feedback),
      badges: [
        {
          label: this.feedbackCategoryLabel(feedback),
          title: this.feedbackCategoryLabel(feedback),
          ariaLabel: this.feedbackCategoryLabel(feedback),
          tone: this.feedbackCategoryBadgeTone(feedback),
          position: "top-right"
        }
      ],
      menuActions: [
        this.isFeedbackResolved(feedback) ? "markUnresolved" : "markSolved"
      ],
      clickable: true,
      eagerDetail: feedback
    };
  }
  feedbackRowMenuContext(item) {
    return { feedbackItem: item };
  }
  onFeedbackRowMenuSelect(event) {
    const context = event.context;
    const actionId = `${context?.action?.id ?? ""}`.trim();
    const item = context?.feedbackItem ?? null;
    if (!item || actionId !== "markSolved" && actionId !== "markUnresolved") {
      return;
    }
    event.sourceEvent.preventDefault();
    event.sourceEvent.stopPropagation();
    this.confirmFeedbackResolved(item, actionId === "markSolved");
  }
  closeFeedbackDetails() {
    this.feedbackDetail = null;
  }
  confirmFeedbackResolved(item, resolved) {
    this.dialogStore.open({
      title: resolved ? "admin.feedback.confirm.mark.solved.title" : "admin.feedback.confirm.mark.unresolved.title",
      message: resolved ? this.i18nText("admin.feedback.confirm.mark.solved.message", {
        user: item.feedback.userName || this.i18nText("admin.feedback.fallback.user")
      }) : "admin.feedback.confirm.mark.unresolved.message",
      confirmLabel: resolved ? "admin.review.action.mark.solved" : "admin.review.action.mark.unresolved",
      busyConfirmLabel: resolved ? "admin.review.action.mark.solved.busy" : "admin.review.action.mark.unresolved.busy",
      confirmTone: resolved ? "accent" : "warning",
      ringPerimeter: 112,
      onConfirm: () => this.setFeedbackResolved(item, resolved)
    });
  }
  i18nText(key, values = {}) {
    let text = this.i18n.translate(key);
    Object.entries(values).forEach(([name, value]) => {
      text = text.split(`{${name}}`).join(value);
    });
    return text;
  }
  async setFeedbackResolved(item, resolved) {
    const dashboard = await this.workspaceData.setFeedbackResolved(item.feedback.id, resolved, this.workspace.currentAdminUserId());
    this.applyFeedbackDashboard(dashboard);
    this.closeFeedbackDetails();
    this.feedbackSmartList?.removeVisibleItemByIdentity(item.id, { totalDelta: -1 });
  }
  isSelectedFeedback(item) {
    return this.feedbackDetail?.id === item.id;
  }
  feedbackListMeta(item) {
    return [item.category, this.shortDate(item.createdDate)].filter(Boolean).join(" \xB7 ");
  }
  feedbackInitial(item) {
    return (item.userName || "F").trim().charAt(0).toUpperCase() || "F";
  }
  feedbackAvatarUrl(item) {
    return `${item.userImageUrl ?? ""}`.trim();
  }
  feedbackCategoryLabel(item) {
    const category = `${item.category ?? ""}`.trim();
    if (this.feedbackCategories.has(category)) {
      return category;
    }
    if (category === "Safety") {
      return "UX improvement";
    }
    if (category === "Events") {
      return "Feature request";
    }
    return "General";
  }
  feedbackCategoryToneClass(item) {
    return `admin-feedback-tone-${this.feedbackCategoryLabel(item).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "general"}`;
  }
  feedbackSingleRowTone(item) {
    switch (this.feedbackCategoryLabel(item)) {
      case "Bug report":
        return "danger";
      case "Feature request":
        return "success";
      case "UX improvement":
        return "accent";
      case "Performance":
        return "warning";
      default:
        return "info";
    }
  }
  feedbackCategoryBadgeTone(item) {
    return this.feedbackSingleRowTone(item);
  }
  isFeedbackResolved(item) {
    return `${item.resolvedAtIso ?? ""}`.trim().length > 0;
  }
  feedbackReviewStatus(item) {
    return this.isFeedbackResolved(item) ? "resolved" : "unresolved";
  }
  shortDate(value) {
    const date = /* @__PURE__ */ new Date(`${value ?? ""}`);
    if (Number.isNaN(date.getTime())) {
      return value ?? "";
    }
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit"
    });
  }
  feedbackTime(value) {
    const date = /* @__PURE__ */ new Date(`${value ?? ""}`);
    if (Number.isNaN(date.getTime())) {
      return `${value ?? ""}`.trim();
    }
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit"
    });
  }
  async loadFeedbackPage(query) {
    const rows = [...await this.loadFeedback(query.filters?.status ?? this.feedbackStatusFilter)].sort((first, second) => Date.parse(second.createdDate) - Date.parse(first.createdDate)).map((feedback) => ({
      id: feedback.id,
      feedback,
      row: this.buildFeedbackActivityRow(feedback)
    }));
    const pageSize = Math.max(1, Math.trunc(Number(query.pageSize) || 24));
    const page = Math.max(0, Math.trunc(Number(query.page) || 0));
    const start = page * pageSize;
    return {
      items: rows.slice(start, start + pageSize),
      total: rows.length,
      nextCursor: start + pageSize < rows.length ? String(page + 1) : null
    };
  }
  async loadFeedback(status) {
    return this.applyFeedbackDashboard(await this.workspaceData.loadFeedbackDashboard(this.workspace.currentAdminUserId(), status)).feedback;
  }
  applyFeedbackDashboard(dashboard) {
    const normalized = this.workspace.applyDashboard(dashboard);
    this.applyFeedbackStatusCounts(normalized);
    return normalized;
  }
  applyFeedbackStatusCounts(dashboard) {
    this.feedbackStatusCounts = {
      unresolved: Math.max(0, Math.trunc(Number(dashboard.reviewCounts?.feedbackUnresolved) || 0)),
      resolved: Math.max(0, Math.trunc(Number(dashboard.reviewCounts?.feedbackResolved) || 0))
    };
  }
  buildFeedbackActivityRow(feedback) {
    const source = {
      id: feedback.id,
      avatar: this.feedbackInitial(feedback),
      title: feedback.userName,
      lastMessage: feedback.details,
      lastSenderId: feedback.userId,
      memberIds: [feedback.userId, "admin"].filter(Boolean),
      unread: 0,
      dateIso: feedback.createdDate,
      channelType: "serviceEvent",
      serviceContext: "notification"
    };
    const activeUser = this.chatUser("admin", "Admin", "AD", "woman");
    const usersById = /* @__PURE__ */ new Map([
      [activeUser.id, activeUser],
      [feedback.userId, this.chatUser(feedback.userId, feedback.userName, this.feedbackInitial(feedback), "woman")]
    ]);
    return ActivityChatSingleRowConverter.convert(source, {
      activeUser,
      resolveUserById: (userId) => usersById.get(userId) ?? null
    });
  }
  chatUser(id, name, initials, gender) {
    return {
      id: id || "admin",
      name: name || "Admin",
      age: 0,
      birthday: "",
      city: "",
      height: "",
      physique: "",
      languages: [],
      horoscope: "",
      initials: initials || "AD",
      gender: gender === "man" ? "man" : "woman",
      statusText: "",
      hostTier: "",
      traitLabel: "",
      completion: 100,
      headline: "",
      about: "",
      profileStatus: "public",
      activities: {
        game: 0,
        chats: 0,
        invitations: 0,
        events: 0,
        hosting: 0
      }
    };
  }
  static \u0275fac = function AdminFeedbackPopupComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AdminFeedbackPopupComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AdminFeedbackPopupComponent, selectors: [["app-admin-feedback-popup"]], viewQuery: function AdminFeedbackPopupComponent_Query(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275viewQuery(_c0, 5, TemplateRef)(_c1, 5);
    }
    if (rf & 2) {
      let _t;
      \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.feedbackItemTemplate = _t.first);
      \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.feedbackSmartList = _t.first);
    }
  }, decls: 2, vars: 2, consts: [["feedbackSmartList", ""], ["feedbackItemTemplate", ""], [3, "model"], [3, "model", "zIndex"], [1, "admin-list-only-body"], [1, "admin-smart-list", "admin-simple-list", 3, "menuItemSelect", "config", "loadPage", "query", "itemTemplate"], [3, "rowClick", "menuRequest", "row", "clickable", "useSharedMenu", "sharedMenuContext"], [1, "admin-detail-popup-body"], [1, "admin-chat-detail-message"], [1, "admin-message-bubble", "admin-feedback-detail-bubble", 3, "ngClass"], [1, "admin-message-head"], [1, "admin-message-head-title"], ["aria-hidden", "true", 1, "admin-message-avatar", "admin-message-avatar-inline", "has-photo", 3, "backgroundImage"], [1, "admin-message-avatar", "admin-message-avatar-inline"], [1, "admin-feedback-time-badge", "admin-feedback-detail-time"], [1, "admin-feedback-category-badge", "admin-feedback-detail-badge"], [1, "admin-feedback-detail-fields"], [1, "admin-feedback-detail-field"], ["aria-hidden", "true", 1, "admin-message-avatar", "admin-message-avatar-inline", "has-photo"]], template: function AdminFeedbackPopupComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275conditionalCreate(0, AdminFeedbackPopupComponent_Conditional_0_Template, 6, 5, "app-popup", 2);
      \u0275\u0275conditionalCreate(1, AdminFeedbackPopupComponent_Conditional_1_Template, 28, 17, "app-popup", 3);
    }
    if (rf & 2) {
      let tmp_1_0;
      \u0275\u0275conditional(ctx.admin.activePopup() === "feedback" ? 0 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional((tmp_1_0 = ctx.feedbackDetail) ? 1 : -1, tmp_1_0);
    }
  }, dependencies: [CommonModule, NgClass, MatIconModule, SmartListComponent, SingleRowComponent, PopupComponent, I18nPipe], styles: ["\n[_nghost-%COMP%] {\n  display: contents;\n}\n[_nghost-%COMP%] {\n  --interactive-motion-duration: 160ms;\n  --interactive-motion-ease: cubic-bezier(0.22, 1, 0.36, 1);\n  --interactive-hover-lift: -1px;\n  --interactive-hover-scale: 1.01;\n  --interactive-hover-brightness: 1.01;\n  --interactive-press-scale: 0.97;\n  --interactive-press-brightness: 0.97;\n}\n[_ngcontent-%COMP%]:where(button, a[href], [role=button], .link-btn, .popup-view-fab, .popup-header-add-btn, .activities-view-option, .profile-status-select-wrap, .profile-details-values-btn, .profile-details-privacy-btn, .profile-privacy-menu-option, .popup-close, .date-picker-btn, .avatar-edit-btn, .experience-form-close-btn, .image-editor-grid button, .image-stack-line, .image-stack-hit-segment, .mobile-profile-selector-close-btn, .mobile-profile-selector-option, .popup-panel-profile-selector .profile-filter-selector-clear, .popup-panel-profile-selector .profile-filter-selector-chip, .popup-panel-profile-selector .profile-selector-chip, .item-action-menu-btn, .experience-action-btn, .header-icon-btn, .chat-header-members, .activities-row-item-clickable, .activities-card-btn, .asset-source-icon, .event-editor-members-trigger, .motion-card, [data-motion=card]):not(.motion-static):not([data-motion=none]) {\n  -webkit-tap-highlight-color: transparent;\n  transition:\n    transform var(--interactive-motion-duration) var(--interactive-motion-ease),\n    filter var(--interactive-motion-duration) var(--interactive-motion-ease),\n    box-shadow var(--interactive-motion-duration) var(--interactive-motion-ease),\n    background-color var(--interactive-motion-duration) var(--interactive-motion-ease),\n    border-color var(--interactive-motion-duration) var(--interactive-motion-ease),\n    color var(--interactive-motion-duration) var(--interactive-motion-ease);\n  transform-origin: center;\n}\n[_ngcontent-%COMP%]:where(button, a[href], [role=button], .link-btn, .popup-view-fab, .popup-header-add-btn, .activities-view-option, .profile-status-select-wrap, .profile-details-values-btn, .profile-details-privacy-btn, .profile-privacy-menu-option, .popup-close, .date-picker-btn, .avatar-edit-btn, .experience-form-close-btn, .image-editor-grid button, .image-stack-line, .image-stack-hit-segment, .mobile-profile-selector-close-btn, .mobile-profile-selector-option, .popup-panel-profile-selector .profile-filter-selector-clear, .popup-panel-profile-selector .profile-filter-selector-chip, .popup-panel-profile-selector .profile-selector-chip, .item-action-menu-btn, .experience-action-btn, .header-icon-btn, .chat-header-members, .activities-row-item-clickable, .activities-card-btn, .asset-source-icon, .event-editor-members-trigger, .motion-card, [data-motion=card]):not(.motion-static):not([data-motion=none]):focus-visible {\n  outline: 2px solid rgba(66, 110, 182, 0.44);\n  outline-offset: 2px;\n}\n@media (hover: hover) and (pointer: fine) {\n  [_ngcontent-%COMP%]:where(button, a[href], [role=button], .link-btn, .popup-view-fab, .popup-header-add-btn, .activities-view-option, .profile-status-select-wrap, .profile-details-values-btn, .profile-details-privacy-btn, .profile-privacy-menu-option, .popup-close, .date-picker-btn, .avatar-edit-btn, .experience-form-close-btn, .image-editor-grid button, .image-stack-line, .image-stack-hit-segment, .mobile-profile-selector-close-btn, .mobile-profile-selector-option, .popup-panel-profile-selector .profile-filter-selector-clear, .popup-panel-profile-selector .profile-filter-selector-chip, .popup-panel-profile-selector .profile-selector-chip, .item-action-menu-btn, .experience-action-btn, .header-icon-btn, .chat-header-members, .activities-row-item-clickable, .activities-card-btn, .asset-source-icon, .event-editor-members-trigger, .motion-card, [data-motion=card]):not(.motion-static):not([data-motion=none]):not(:disabled):not([aria-disabled=true]):hover {\n    transform: translateY(var(--interactive-hover-lift)) scale(var(--interactive-hover-scale));\n    filter: brightness(var(--interactive-hover-brightness));\n  }\n  [_ngcontent-%COMP%]:where(button, a[href], [role=button], .link-btn, .popup-view-fab, .popup-header-add-btn, .activities-view-option, .profile-status-select-wrap, .profile-details-values-btn, .profile-details-privacy-btn, .profile-privacy-menu-option, .popup-close, .date-picker-btn, .avatar-edit-btn, .experience-form-close-btn, .image-editor-grid button, .image-stack-line, .image-stack-hit-segment, .mobile-profile-selector-close-btn, .mobile-profile-selector-option, .popup-panel-profile-selector .profile-filter-selector-clear, .popup-panel-profile-selector .profile-filter-selector-chip, .popup-panel-profile-selector .profile-selector-chip, .item-action-menu-btn, .experience-action-btn, .header-icon-btn, .chat-header-members, .activities-row-item-clickable, .activities-card-btn, .asset-source-icon, .event-editor-members-trigger, .motion-card, [data-motion=card]):not(.motion-static):not([data-motion=none]):not(:disabled):not([aria-disabled=true]):active {\n    transform: scale(var(--interactive-press-scale));\n    filter: brightness(var(--interactive-press-brightness));\n  }\n  [_ngcontent-%COMP%]:where(.motion-card, [data-motion=card]):not(.motion-static):not([data-motion=none]):hover {\n    box-shadow: 0 3px 10px rgba(16, 29, 48, 0.14);\n  }\n}\n@keyframes _ngcontent-%COMP%_shared-mobile-touch-feedback {\n  0% {\n    transform: scale(1);\n    filter: brightness(1);\n  }\n  45% {\n    transform: scale(var(--interactive-press-scale));\n    filter: brightness(var(--interactive-press-brightness));\n  }\n  100% {\n    transform: scale(1);\n    filter: brightness(1);\n  }\n}\n@media (hover: none), (pointer: coarse) {\n  [_ngcontent-%COMP%]:where(button, a[href], [role=button], .link-btn, .popup-view-fab, .popup-header-add-btn, .activities-view-option, .profile-status-select-wrap, .profile-details-values-btn, .profile-details-privacy-btn, .profile-privacy-menu-option, .popup-close, .date-picker-btn, .avatar-edit-btn, .experience-form-close-btn, .image-editor-grid button, .image-stack-line, .image-stack-hit-segment, .mobile-profile-selector-close-btn, .mobile-profile-selector-option, .popup-panel-profile-selector .profile-filter-selector-clear, .popup-panel-profile-selector .profile-filter-selector-chip, .popup-panel-profile-selector .profile-selector-chip, .item-action-menu-btn, .experience-action-btn, .header-icon-btn, .chat-header-members, .activities-row-item-clickable, .activities-card-btn, .asset-source-icon, .event-editor-members-trigger, .motion-card, [data-motion=card]):not(.motion-static):not([data-motion=none]):not(:disabled):not([aria-disabled=true]):active {\n    animation: _ngcontent-%COMP%_shared-mobile-touch-feedback 0.2s ease;\n  }\n}\n.admin-list-only-body[_ngcontent-%COMP%] {\n  height: 100%;\n  min-height: 0;\n  display: flex;\n}\napp-smart-list.admin-smart-list[_ngcontent-%COMP%] {\n  display: flex;\n  height: 100%;\n  min-height: 0;\n  width: 100%;\n}\n.admin-simple-list[_ngcontent-%COMP%] {\n  flex: 1 1 auto;\n}\n.admin-detail-popup-body[_ngcontent-%COMP%] {\n  min-height: 0;\n  max-height: calc(100vh - 7.2rem);\n  overflow-y: auto;\n  padding: 0.82rem;\n  background:\n    linear-gradient(\n      180deg,\n      #f8fbff 0%,\n      #ffffff 100%);\n}\n.admin-chat-detail-message[_ngcontent-%COMP%] {\n  display: block;\n}\n.admin-message-bubble[_ngcontent-%COMP%] {\n  position: relative;\n  min-width: 0;\n  border: 1px solid rgba(23, 33, 54, 0.12);\n  border-radius: 14px;\n  background: #fff;\n  padding: 0.72rem;\n  box-shadow: 0 8px 20px rgba(23, 33, 54, 0.05);\n}\n.admin-message-head[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  gap: 0.7rem;\n  color: rgba(34, 50, 74, 0.66);\n  font-size: 0.72rem;\n  font-weight: 900;\n}\n.admin-message-head-title[_ngcontent-%COMP%] {\n  min-width: 0;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.42rem;\n}\n.admin-message-avatar[_ngcontent-%COMP%] {\n  width: 34px;\n  height: 34px;\n  border-radius: 50%;\n  background: #dfe9f6;\n  color: #245d9a;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  font-weight: 900;\n}\n.admin-message-avatar-inline[_ngcontent-%COMP%] {\n  flex: 0 0 auto;\n  width: 34px;\n  height: 34px;\n}\n.admin-message-avatar-inline.has-photo[_ngcontent-%COMP%] {\n  background-size: cover;\n  background-position: center;\n  background-repeat: no-repeat;\n  color: transparent;\n}\n.admin-feedback-time-badge[_ngcontent-%COMP%] {\n  min-width: 56px;\n  height: 18px;\n  border-radius: 999px;\n  background: rgba(20, 32, 52, 0.08);\n  color: rgba(20, 32, 52, 0.58);\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  padding: 0 7px;\n  font-size: 0.66rem;\n  font-weight: 700;\n  line-height: 1;\n}\n.admin-feedback-category-badge[_ngcontent-%COMP%] {\n  align-self: baseline;\n  justify-self: end;\n  min-width: 0;\n  max-width: min(260px, 30vw);\n  min-height: 28px;\n  border-radius: 999px;\n  border: 1px solid rgba(255, 255, 255, 0.86);\n  background: rgba(26, 45, 71, 0.82);\n  color: #fff;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  padding: 0 0.78rem;\n  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.68), 0 8px 16px rgba(255, 255, 255, 0.34);\n  font-size: 0.72rem;\n  font-weight: 900;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  box-sizing: border-box;\n}\n.admin-feedback-tone-general[_ngcontent-%COMP%] {\n  border-color: rgba(73, 112, 166, 0.24);\n  background:\n    linear-gradient(\n      180deg,\n      #fbfdff 0%,\n      #f2f7ff 100%);\n}\n.admin-feedback-tone-general[_ngcontent-%COMP%]   .admin-feedback-category-badge[_ngcontent-%COMP%] {\n  background: #3d638f;\n}\n.admin-feedback-tone-bug-report[_ngcontent-%COMP%] {\n  border-color: rgba(173, 55, 66, 0.28);\n  background:\n    linear-gradient(\n      180deg,\n      #fffafa 0%,\n      #fff3f3 100%);\n}\n.admin-feedback-tone-bug-report[_ngcontent-%COMP%]   .admin-feedback-category-badge[_ngcontent-%COMP%] {\n  background: #9d3e49;\n}\n.admin-feedback-tone-feature-request[_ngcontent-%COMP%] {\n  border-color: rgba(51, 131, 92, 0.26);\n  background:\n    linear-gradient(\n      180deg,\n      #fbfffc 0%,\n      #f1faf4 100%);\n}\n.admin-feedback-tone-feature-request[_ngcontent-%COMP%]   .admin-feedback-category-badge[_ngcontent-%COMP%] {\n  background: #2f7655;\n}\n.admin-feedback-tone-ux-improvement[_ngcontent-%COMP%] {\n  border-color: rgba(110, 82, 168, 0.25);\n  background:\n    linear-gradient(\n      180deg,\n      #fdfcff 0%,\n      #f6f2ff 100%);\n}\n.admin-feedback-tone-ux-improvement[_ngcontent-%COMP%]   .admin-feedback-category-badge[_ngcontent-%COMP%] {\n  background: #674f9f;\n}\n.admin-feedback-tone-performance[_ngcontent-%COMP%] {\n  border-color: rgba(161, 105, 33, 0.26);\n  background:\n    linear-gradient(\n      180deg,\n      #fffdfa 0%,\n      #fff7eb 100%);\n}\n.admin-feedback-tone-performance[_ngcontent-%COMP%]   .admin-feedback-category-badge[_ngcontent-%COMP%] {\n  background: #8d6330;\n}\n.admin-feedback-detail-bubble[_ngcontent-%COMP%] {\n  position: relative;\n  display: grid;\n  gap: 0.66rem;\n  padding-right: min(230px, 36%);\n}\n.admin-feedback-detail-badge[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 2.42rem;\n  right: 0.72rem;\n  line-height: 1.5;\n}\n.admin-feedback-detail-time[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 0.72rem;\n  right: 0.72rem;\n}\n.admin-feedback-detail-fields[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.52rem;\n}\n.admin-feedback-detail-field[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.26rem;\n}\n.admin-feedback-detail-field[_ngcontent-%COMP%]    > strong[_ngcontent-%COMP%] {\n  color: rgba(34, 50, 74, 0.72);\n  font-size: 0.74rem;\n  font-weight: 900;\n}\n.admin-feedback-detail-field[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0;\n  color: #132642;\n  font-size: 0.86rem;\n  line-height: 1.5;\n}\n.admin-feedback-detail-field[_ngcontent-%COMP%]   .admin-feedback-category-badge[_ngcontent-%COMP%] {\n  justify-self: start;\n  align-self: auto;\n}\n@media (max-width: 760px) {\n  .admin-feedback-category-badge[_ngcontent-%COMP%] {\n    max-width: min(240px, 64vw);\n  }\n}\n/*# sourceMappingURL=admin-feedback-popup.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AdminFeedbackPopupComponent, [{
    type: Component,
    args: [{ selector: "app-admin-feedback-popup", standalone: true, imports: [CommonModule, MatIconModule, SmartListComponent, SingleRowComponent, PopupComponent, I18nPipe], template: `@if (admin.activePopup() === 'feedback') {
  <app-popup [model]="feedbackPopupModel()">
      <div class="admin-list-only-body">
        <app-smart-list
          #feedbackSmartList
          class="admin-smart-list admin-simple-list"
          [config]="feedbackSmartListConfig"
          [loadPage]="feedbackSmartListLoadPage"
          [query]="feedbackSmartListQuery"
          [itemTemplate]="feedbackItemTemplateRef ?? null"
          (menuItemSelect)="onFeedbackRowMenuSelect($event)"
        ></app-smart-list>

        <ng-template #feedbackItemTemplate let-item let-groupLabel="groupLabel" let-openMenu="openMenu">
          <single-row
            [row]="feedbackSingleRow(item, groupLabel)"
            [clickable]="true"
            [useSharedMenu]="true"
            [sharedMenuContext]="feedbackRowMenuContext(item)"
            (rowClick)="selectFeedback(item)"
            (menuRequest)="openMenu($event)"
          ></single-row>
        </ng-template>
      </div>
  </app-popup>
}

@if (feedbackDetail; as item) {
  <app-popup [model]="feedbackDetailPopupModel(item)" [zIndex]="2400">
      <div class="admin-detail-popup-body">
        <article class="admin-chat-detail-message">
          <div class="admin-message-bubble admin-feedback-detail-bubble" [ngClass]="feedbackCategoryToneClass(item)">
            <div class="admin-message-head">
              <span class="admin-message-head-title">
                @if (feedbackAvatarUrl(item); as avatarUrl) {
                  <span
                    class="admin-message-avatar admin-message-avatar-inline has-photo"
                    [style.backgroundImage]="'url(' + avatarUrl + ')'"
                    aria-hidden="true"
                  ></span>
                } @else {
                  <span class="admin-message-avatar admin-message-avatar-inline">{{ feedbackInitial(item) }}</span>
                }
                <strong>{{ item.userName }}</strong>
              </span>
              <span class="admin-feedback-time-badge admin-feedback-detail-time">{{ shortDate(item.createdDate) }}</span>
            </div>
            <span class="admin-feedback-category-badge admin-feedback-detail-badge">
              {{ feedbackCategoryLabel(item) | i18n }}
            </span>
            <div class="admin-feedback-detail-fields">
              <div class="admin-feedback-detail-field">
                <strong>{{ 'subject' | i18n }}</strong>
                <p>{{ item.subject }}</p>
              </div>
              <div class="admin-feedback-detail-field">
                <strong>{{ 'details' | i18n }}</strong>
                <p>{{ item.details }}</p>
              </div>
            </div>
          </div>
        </article>
      </div>
  </app-popup>
}
`, styles: ["/* src/app/admin/components/feedback-popup/admin-feedback-popup.component.scss */\n:host {\n  display: contents;\n}\n:host {\n  --interactive-motion-duration: 160ms;\n  --interactive-motion-ease: cubic-bezier(0.22, 1, 0.36, 1);\n  --interactive-hover-lift: -1px;\n  --interactive-hover-scale: 1.01;\n  --interactive-hover-brightness: 1.01;\n  --interactive-press-scale: 0.97;\n  --interactive-press-brightness: 0.97;\n}\n:where(button, a[href], [role=button], .link-btn, .popup-view-fab, .popup-header-add-btn, .activities-view-option, .profile-status-select-wrap, .profile-details-values-btn, .profile-details-privacy-btn, .profile-privacy-menu-option, .popup-close, .date-picker-btn, .avatar-edit-btn, .experience-form-close-btn, .image-editor-grid button, .image-stack-line, .image-stack-hit-segment, .mobile-profile-selector-close-btn, .mobile-profile-selector-option, .popup-panel-profile-selector .profile-filter-selector-clear, .popup-panel-profile-selector .profile-filter-selector-chip, .popup-panel-profile-selector .profile-selector-chip, .item-action-menu-btn, .experience-action-btn, .header-icon-btn, .chat-header-members, .activities-row-item-clickable, .activities-card-btn, .asset-source-icon, .event-editor-members-trigger, .motion-card, [data-motion=card]):not(.motion-static):not([data-motion=none]) {\n  -webkit-tap-highlight-color: transparent;\n  transition:\n    transform var(--interactive-motion-duration) var(--interactive-motion-ease),\n    filter var(--interactive-motion-duration) var(--interactive-motion-ease),\n    box-shadow var(--interactive-motion-duration) var(--interactive-motion-ease),\n    background-color var(--interactive-motion-duration) var(--interactive-motion-ease),\n    border-color var(--interactive-motion-duration) var(--interactive-motion-ease),\n    color var(--interactive-motion-duration) var(--interactive-motion-ease);\n  transform-origin: center;\n}\n:where(button, a[href], [role=button], .link-btn, .popup-view-fab, .popup-header-add-btn, .activities-view-option, .profile-status-select-wrap, .profile-details-values-btn, .profile-details-privacy-btn, .profile-privacy-menu-option, .popup-close, .date-picker-btn, .avatar-edit-btn, .experience-form-close-btn, .image-editor-grid button, .image-stack-line, .image-stack-hit-segment, .mobile-profile-selector-close-btn, .mobile-profile-selector-option, .popup-panel-profile-selector .profile-filter-selector-clear, .popup-panel-profile-selector .profile-filter-selector-chip, .popup-panel-profile-selector .profile-selector-chip, .item-action-menu-btn, .experience-action-btn, .header-icon-btn, .chat-header-members, .activities-row-item-clickable, .activities-card-btn, .asset-source-icon, .event-editor-members-trigger, .motion-card, [data-motion=card]):not(.motion-static):not([data-motion=none]):focus-visible {\n  outline: 2px solid rgba(66, 110, 182, 0.44);\n  outline-offset: 2px;\n}\n@media (hover: hover) and (pointer: fine) {\n  :where(button, a[href], [role=button], .link-btn, .popup-view-fab, .popup-header-add-btn, .activities-view-option, .profile-status-select-wrap, .profile-details-values-btn, .profile-details-privacy-btn, .profile-privacy-menu-option, .popup-close, .date-picker-btn, .avatar-edit-btn, .experience-form-close-btn, .image-editor-grid button, .image-stack-line, .image-stack-hit-segment, .mobile-profile-selector-close-btn, .mobile-profile-selector-option, .popup-panel-profile-selector .profile-filter-selector-clear, .popup-panel-profile-selector .profile-filter-selector-chip, .popup-panel-profile-selector .profile-selector-chip, .item-action-menu-btn, .experience-action-btn, .header-icon-btn, .chat-header-members, .activities-row-item-clickable, .activities-card-btn, .asset-source-icon, .event-editor-members-trigger, .motion-card, [data-motion=card]):not(.motion-static):not([data-motion=none]):not(:disabled):not([aria-disabled=true]):hover {\n    transform: translateY(var(--interactive-hover-lift)) scale(var(--interactive-hover-scale));\n    filter: brightness(var(--interactive-hover-brightness));\n  }\n  :where(button, a[href], [role=button], .link-btn, .popup-view-fab, .popup-header-add-btn, .activities-view-option, .profile-status-select-wrap, .profile-details-values-btn, .profile-details-privacy-btn, .profile-privacy-menu-option, .popup-close, .date-picker-btn, .avatar-edit-btn, .experience-form-close-btn, .image-editor-grid button, .image-stack-line, .image-stack-hit-segment, .mobile-profile-selector-close-btn, .mobile-profile-selector-option, .popup-panel-profile-selector .profile-filter-selector-clear, .popup-panel-profile-selector .profile-filter-selector-chip, .popup-panel-profile-selector .profile-selector-chip, .item-action-menu-btn, .experience-action-btn, .header-icon-btn, .chat-header-members, .activities-row-item-clickable, .activities-card-btn, .asset-source-icon, .event-editor-members-trigger, .motion-card, [data-motion=card]):not(.motion-static):not([data-motion=none]):not(:disabled):not([aria-disabled=true]):active {\n    transform: scale(var(--interactive-press-scale));\n    filter: brightness(var(--interactive-press-brightness));\n  }\n  :where(.motion-card, [data-motion=card]):not(.motion-static):not([data-motion=none]):hover {\n    box-shadow: 0 3px 10px rgba(16, 29, 48, 0.14);\n  }\n}\n@keyframes shared-mobile-touch-feedback {\n  0% {\n    transform: scale(1);\n    filter: brightness(1);\n  }\n  45% {\n    transform: scale(var(--interactive-press-scale));\n    filter: brightness(var(--interactive-press-brightness));\n  }\n  100% {\n    transform: scale(1);\n    filter: brightness(1);\n  }\n}\n@media (hover: none), (pointer: coarse) {\n  :where(button, a[href], [role=button], .link-btn, .popup-view-fab, .popup-header-add-btn, .activities-view-option, .profile-status-select-wrap, .profile-details-values-btn, .profile-details-privacy-btn, .profile-privacy-menu-option, .popup-close, .date-picker-btn, .avatar-edit-btn, .experience-form-close-btn, .image-editor-grid button, .image-stack-line, .image-stack-hit-segment, .mobile-profile-selector-close-btn, .mobile-profile-selector-option, .popup-panel-profile-selector .profile-filter-selector-clear, .popup-panel-profile-selector .profile-filter-selector-chip, .popup-panel-profile-selector .profile-selector-chip, .item-action-menu-btn, .experience-action-btn, .header-icon-btn, .chat-header-members, .activities-row-item-clickable, .activities-card-btn, .asset-source-icon, .event-editor-members-trigger, .motion-card, [data-motion=card]):not(.motion-static):not([data-motion=none]):not(:disabled):not([aria-disabled=true]):active {\n    animation: shared-mobile-touch-feedback 0.2s ease;\n  }\n}\n.admin-list-only-body {\n  height: 100%;\n  min-height: 0;\n  display: flex;\n}\napp-smart-list.admin-smart-list {\n  display: flex;\n  height: 100%;\n  min-height: 0;\n  width: 100%;\n}\n.admin-simple-list {\n  flex: 1 1 auto;\n}\n.admin-detail-popup-body {\n  min-height: 0;\n  max-height: calc(100vh - 7.2rem);\n  overflow-y: auto;\n  padding: 0.82rem;\n  background:\n    linear-gradient(\n      180deg,\n      #f8fbff 0%,\n      #ffffff 100%);\n}\n.admin-chat-detail-message {\n  display: block;\n}\n.admin-message-bubble {\n  position: relative;\n  min-width: 0;\n  border: 1px solid rgba(23, 33, 54, 0.12);\n  border-radius: 14px;\n  background: #fff;\n  padding: 0.72rem;\n  box-shadow: 0 8px 20px rgba(23, 33, 54, 0.05);\n}\n.admin-message-head {\n  display: flex;\n  justify-content: space-between;\n  gap: 0.7rem;\n  color: rgba(34, 50, 74, 0.66);\n  font-size: 0.72rem;\n  font-weight: 900;\n}\n.admin-message-head-title {\n  min-width: 0;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.42rem;\n}\n.admin-message-avatar {\n  width: 34px;\n  height: 34px;\n  border-radius: 50%;\n  background: #dfe9f6;\n  color: #245d9a;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  font-weight: 900;\n}\n.admin-message-avatar-inline {\n  flex: 0 0 auto;\n  width: 34px;\n  height: 34px;\n}\n.admin-message-avatar-inline.has-photo {\n  background-size: cover;\n  background-position: center;\n  background-repeat: no-repeat;\n  color: transparent;\n}\n.admin-feedback-time-badge {\n  min-width: 56px;\n  height: 18px;\n  border-radius: 999px;\n  background: rgba(20, 32, 52, 0.08);\n  color: rgba(20, 32, 52, 0.58);\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  padding: 0 7px;\n  font-size: 0.66rem;\n  font-weight: 700;\n  line-height: 1;\n}\n.admin-feedback-category-badge {\n  align-self: baseline;\n  justify-self: end;\n  min-width: 0;\n  max-width: min(260px, 30vw);\n  min-height: 28px;\n  border-radius: 999px;\n  border: 1px solid rgba(255, 255, 255, 0.86);\n  background: rgba(26, 45, 71, 0.82);\n  color: #fff;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  padding: 0 0.78rem;\n  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.68), 0 8px 16px rgba(255, 255, 255, 0.34);\n  font-size: 0.72rem;\n  font-weight: 900;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  box-sizing: border-box;\n}\n.admin-feedback-tone-general {\n  border-color: rgba(73, 112, 166, 0.24);\n  background:\n    linear-gradient(\n      180deg,\n      #fbfdff 0%,\n      #f2f7ff 100%);\n}\n.admin-feedback-tone-general .admin-feedback-category-badge {\n  background: #3d638f;\n}\n.admin-feedback-tone-bug-report {\n  border-color: rgba(173, 55, 66, 0.28);\n  background:\n    linear-gradient(\n      180deg,\n      #fffafa 0%,\n      #fff3f3 100%);\n}\n.admin-feedback-tone-bug-report .admin-feedback-category-badge {\n  background: #9d3e49;\n}\n.admin-feedback-tone-feature-request {\n  border-color: rgba(51, 131, 92, 0.26);\n  background:\n    linear-gradient(\n      180deg,\n      #fbfffc 0%,\n      #f1faf4 100%);\n}\n.admin-feedback-tone-feature-request .admin-feedback-category-badge {\n  background: #2f7655;\n}\n.admin-feedback-tone-ux-improvement {\n  border-color: rgba(110, 82, 168, 0.25);\n  background:\n    linear-gradient(\n      180deg,\n      #fdfcff 0%,\n      #f6f2ff 100%);\n}\n.admin-feedback-tone-ux-improvement .admin-feedback-category-badge {\n  background: #674f9f;\n}\n.admin-feedback-tone-performance {\n  border-color: rgba(161, 105, 33, 0.26);\n  background:\n    linear-gradient(\n      180deg,\n      #fffdfa 0%,\n      #fff7eb 100%);\n}\n.admin-feedback-tone-performance .admin-feedback-category-badge {\n  background: #8d6330;\n}\n.admin-feedback-detail-bubble {\n  position: relative;\n  display: grid;\n  gap: 0.66rem;\n  padding-right: min(230px, 36%);\n}\n.admin-feedback-detail-badge {\n  position: absolute;\n  top: 2.42rem;\n  right: 0.72rem;\n  line-height: 1.5;\n}\n.admin-feedback-detail-time {\n  position: absolute;\n  top: 0.72rem;\n  right: 0.72rem;\n}\n.admin-feedback-detail-fields {\n  display: grid;\n  gap: 0.52rem;\n}\n.admin-feedback-detail-field {\n  display: grid;\n  gap: 0.26rem;\n}\n.admin-feedback-detail-field > strong {\n  color: rgba(34, 50, 74, 0.72);\n  font-size: 0.74rem;\n  font-weight: 900;\n}\n.admin-feedback-detail-field p {\n  margin: 0;\n  color: #132642;\n  font-size: 0.86rem;\n  line-height: 1.5;\n}\n.admin-feedback-detail-field .admin-feedback-category-badge {\n  justify-self: start;\n  align-self: auto;\n}\n@media (max-width: 760px) {\n  .admin-feedback-category-badge {\n    max-width: min(240px, 64vw);\n  }\n}\n/*# sourceMappingURL=admin-feedback-popup.component.css.map */\n"] }]
  }], null, { feedbackItemTemplate: [{
    type: ViewChild,
    args: ["feedbackItemTemplate", { read: TemplateRef }]
  }], feedbackSmartList: [{
    type: ViewChild,
    args: ["feedbackSmartList"]
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AdminFeedbackPopupComponent, { className: "AdminFeedbackPopupComponent", filePath: "app/admin/components/feedback-popup/admin-feedback-popup.component.ts", lineNumber: 68 });
})();
export {
  AdminFeedbackPopupComponent
};
//# sourceMappingURL=admin-feedback-popup.component-S32QK5CA.js.map
