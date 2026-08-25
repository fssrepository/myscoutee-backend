import "./chunk-3UFDLV5Y.js";
import "./chunk-GNEKNDCW.js";
import "./chunk-WYVDSPFZ.js";
import "./chunk-64GWAN6R.js";
import "./chunk-ZIP4R74W.js";
import "./chunk-I6EOSNBR.js";
import "./chunk-3HTTRAEW.js";
import "./chunk-SYKOEE4K.js";
import "./chunk-KQF6FQ63.js";
import "./chunk-AELPOWOL.js";
import {
  SmartListComponent
} from "./chunk-IJVUZ62I.js";
import "./chunk-2RBWDI2Q.js";
import "./chunk-XIFXW5X2.js";
import "./chunk-2K5TOPNO.js";
import "./chunk-654Z7UJY.js";
import "./chunk-H3IGIWEC.js";
import {
  ImageCarouselComponent
} from "./chunk-RRRWUAB3.js";
import "./chunk-EWJPTHFE.js";
import "./chunk-RJSPRCFL.js";
import "./chunk-BEAS7CFC.js";
import "./chunk-EGWJQCT5.js";
import {
  CARD_MENU_ACTIONS,
  InfoCardComponent
} from "./chunk-YTMD6HU4.js";
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
  AppMenuDispatcher,
  AppMenuOutletComponent,
  DefaultValueAccessor,
  FormsModule,
  I18nPipe,
  IndicatorComponent,
  NgControlStatus,
  NgControlStatusGroup,
  NgForm,
  NgModel,
  RequiredValidator,
  ɵNgNoValidate
} from "./chunk-FOAFZS65.js";
import "./chunk-OAYWPJGG.js";
import {
  DialogStore
} from "./chunk-6TR3Z2F3.js";
import "./chunk-U46O4F4Y.js";
import {
  MatIcon,
  MatIconModule
} from "./chunk-EDHGCWPF.js";
import "./chunk-CUDLB52K.js";
import "./chunk-4WZBG7IG.js";
import {
  AdminMenuStore
} from "./chunk-ZJ74HL3J.js";
import {
  IdeaPostsService
} from "./chunk-QE3AUXWT.js";
import "./chunk-2LVO4Z3J.js";
import "./chunk-PK4DOAMC.js";
import {
  AppRuntimeStore
} from "./chunk-4M7S3PHB.js";
import "./chunk-5PHTFUHA.js";
import {
  APP_STATIC_DATA
} from "./chunk-F4WY6ECV.js";
import "./chunk-Q3344WPR.js";
import {
  AppUtils
} from "./chunk-XQ4NDAVX.js";
import "./chunk-4FWVIYNI.js";
import "./chunk-7MTG4XZU.js";
import {
  CommonModule
} from "./chunk-J7IJFFQ2.js";
import "./chunk-XQACYBVS.js";
import "./chunk-YKC4KBEC.js";
import "./chunk-B2DKYQGD.js";
import {
  UserProfileStore
} from "./chunk-KLUOB5SD.js";
import "./chunk-6POEHVT7.js";
import "./chunk-2ENBQWLU.js";
import "./chunk-LERGHE7K.js";
import "./chunk-D6ZHKNYF.js";
import "./chunk-SKAK727J.js";
import {
  ChangeDetectorRef,
  Component,
  HostListener,
  ViewChild,
  __spreadProps,
  __spreadValues,
  effect,
  from,
  inject,
  setClassMetadata,
  untracked,
  ɵsetClassDebugInfo,
  ɵɵProvidersFeature,
  ɵɵadvance,
  ɵɵclassProp,
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
  ɵɵreference,
  ɵɵresetView,
  ɵɵresolveWindow,
  ɵɵrestoreView,
  ɵɵsanitizeHtml,
  ɵɵtemplate,
  ɵɵtemplateRefExtractor,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty,
  ɵɵviewQuery
} from "./chunk-XJL7SWH7.js";

// src/app/admin/components/idea-editor-popup/admin-idea-editor-popup.component.ts
var _c0 = ["ideaSmartList"];
function AdminIdeaEditorPopupComponent_Conditional_0_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 4)(1, "mat-icon");
    \u0275\u0275text(2, "warning");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r1.error);
  }
}
function AdminIdeaEditorPopupComponent_Conditional_0_ng_template_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "app-info-card", 9);
    \u0275\u0275listener("menuAction", function AdminIdeaEditorPopupComponent_Conditional_0_ng_template_5_Template_app_info_card_menuAction_0_listener($event) {
      const card_r4 = \u0275\u0275restoreView(_r3).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.onIdeaCardMenuAction(card_r4, $event));
    })("menuRequest", function AdminIdeaEditorPopupComponent_Conditional_0_ng_template_5_Template_app_info_card_menuRequest_0_listener($event) {
      const card_r4 = \u0275\u0275restoreView(_r3).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.openIdeaInfoCardMenu(card_r4, $event));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const card_r4 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("is-feature-toggle-pending", ctx_r1.isFeatureTogglePending(ctx_r1.ideaCardPostId(card_r4)));
    \u0275\u0275property("card", card_r4)("useSharedMenu", true);
  }
}
function AdminIdeaEditorPopupComponent_Conditional_0_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "app-popup", 7)(1, "div", 10)(2, "div", 11);
    \u0275\u0275element(3, "app-indicator", 12);
    \u0275\u0275elementStart(4, "span");
    \u0275\u0275text(5);
    \u0275\u0275pipe(6, "i18n");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("model", ctx_r1.articleViewerLoadingPopupModel())("zIndex", 2500);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(6, 3, ctx_r1.articlePanelLoadingLabel()));
  }
}
function AdminIdeaEditorPopupComponent_Conditional_0_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "app-popup", 7)(1, "article", 13)(2, "div", 14)(3, "div", 15);
    \u0275\u0275element(4, "div", 16);
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const post_r5 = ctx;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("model", ctx_r1.articleViewerPopupModel(post_r5))("zIndex", 2500);
    \u0275\u0275advance(4);
    \u0275\u0275property("innerHTML", ctx_r1.articlePreviewHtml(post_r5), \u0275\u0275sanitizeHtml);
  }
}
function AdminIdeaEditorPopupComponent_Conditional_0_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "app-popup", 8)(1, "div", 17)(2, "div", 11);
    \u0275\u0275element(3, "app-indicator", 12);
    \u0275\u0275elementStart(4, "span");
    \u0275\u0275text(5);
    \u0275\u0275pipe(6, "i18n");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("model", ctx_r1.articleEditorLoadingPopupModel())("zIndex", 2400);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(6, 3, ctx_r1.articlePanelLoadingLabel()));
  }
}
function AdminIdeaEditorPopupComponent_Conditional_0_Conditional_11_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 19)(1, "div", 11);
    \u0275\u0275element(2, "app-indicator", 12);
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4);
    \u0275\u0275pipe(5, "i18n");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(5, 1, ctx_r1.articlePanelLoadingLabel()));
  }
}
function AdminIdeaEditorPopupComponent_Conditional_0_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "app-popup", 8)(1, "form", 18);
    \u0275\u0275listener("ngSubmit", function AdminIdeaEditorPopupComponent_Conditional_0_Conditional_11_Template_form_ngSubmit_1_listener($event) {
      \u0275\u0275restoreView(_r6);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.saveDraft($event));
    });
    \u0275\u0275conditionalCreate(2, AdminIdeaEditorPopupComponent_Conditional_0_Conditional_11_Conditional_2_Template, 6, 3, "div", 19);
    \u0275\u0275elementStart(3, "div", 20)(4, "div", 21)(5, "label", 22)(6, "span");
    \u0275\u0275text(7, "Title");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "input", 23);
    \u0275\u0275twoWayListener("ngModelChange", function AdminIdeaEditorPopupComponent_Conditional_0_Conditional_11_Template_input_ngModelChange_8_listener($event) {
      const editDraft_r7 = \u0275\u0275restoreView(_r6);
      \u0275\u0275twoWayBindingSet(editDraft_r7.title, $event) || (editDraft_r7.title = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(9, "label", 24)(10, "span");
    \u0275\u0275text(11, "Description");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "textarea", 25);
    \u0275\u0275twoWayListener("ngModelChange", function AdminIdeaEditorPopupComponent_Conditional_0_Conditional_11_Template_textarea_ngModelChange_12_listener($event) {
      const editDraft_r7 = \u0275\u0275restoreView(_r6);
      \u0275\u0275twoWayBindingSet(editDraft_r7.excerpt, $event) || (editDraft_r7.excerpt = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(13, "app-image-carousel", 26);
    \u0275\u0275twoWayListener("ngModelChange", function AdminIdeaEditorPopupComponent_Conditional_0_Conditional_11_Template_app_image_carousel_ngModelChange_13_listener($event) {
      const editDraft_r7 = \u0275\u0275restoreView(_r6);
      \u0275\u0275twoWayBindingSet(editDraft_r7.imageUrls, $event) || (editDraft_r7.imageUrls = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("imageRemoved", function AdminIdeaEditorPopupComponent_Conditional_0_Conditional_11_Template_app_image_carousel_imageRemoved_13_listener($event) {
      \u0275\u0275restoreView(_r6);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.removeDraftImage($event));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "section", 27)(15, "div", 28)(16, "span");
    \u0275\u0275text(17, "Article HTML");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(18, "textarea", 29);
    \u0275\u0275twoWayListener("ngModelChange", function AdminIdeaEditorPopupComponent_Conditional_0_Conditional_11_Template_textarea_ngModelChange_18_listener($event) {
      const editDraft_r7 = \u0275\u0275restoreView(_r6);
      \u0275\u0275twoWayBindingSet(editDraft_r7.contentHtml, $event) || (editDraft_r7.contentHtml = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("paste", function AdminIdeaEditorPopupComponent_Conditional_0_Conditional_11_Template_textarea_paste_18_listener($event) {
      \u0275\u0275restoreView(_r6);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.formatPastedHtml($event));
    });
    \u0275\u0275elementEnd()()()()();
  }
  if (rf & 2) {
    const editDraft_r7 = ctx;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("model", ctx_r1.articleEditorPopupModel(editDraft_r7))("zIndex", 2400);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r1.articlePanelLoading && ctx_r1.articlePanelLoadingMode === "editor" ? 2 : -1);
    \u0275\u0275advance(6);
    \u0275\u0275twoWayProperty("ngModel", editDraft_r7.title);
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", editDraft_r7.excerpt);
    \u0275\u0275advance();
    \u0275\u0275twoWayProperty("ngModel", editDraft_r7.imageUrls);
    \u0275\u0275property("disabled", ctx_r1.saving)("uploadOwnerId", ctx_r1.actorUserId());
    \u0275\u0275advance(5);
    \u0275\u0275twoWayProperty("ngModel", editDraft_r7.contentHtml);
  }
}
function AdminIdeaEditorPopupComponent_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "app-popup", 2)(1, "div", 3);
    \u0275\u0275conditionalCreate(2, AdminIdeaEditorPopupComponent_Conditional_0_Conditional_2_Template, 5, 1, "div", 4);
    \u0275\u0275element(3, "app-smart-list", 5, 0);
    \u0275\u0275template(5, AdminIdeaEditorPopupComponent_Conditional_0_ng_template_5_Template, 1, 4, "ng-template", null, 1, \u0275\u0275templateRefExtractor);
    \u0275\u0275elementStart(7, "app-menu-outlet", 6);
    \u0275\u0275listener("itemSelect", function AdminIdeaEditorPopupComponent_Conditional_0_Template_app_menu_outlet_itemSelect_7_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onIdeaDispatchedMenuSelect($event));
    });
    \u0275\u0275elementEnd()()();
    \u0275\u0275conditionalCreate(8, AdminIdeaEditorPopupComponent_Conditional_0_Conditional_8_Template, 7, 5, "app-popup", 7)(9, AdminIdeaEditorPopupComponent_Conditional_0_Conditional_9_Template, 5, 3, "app-popup", 7);
    \u0275\u0275conditionalCreate(10, AdminIdeaEditorPopupComponent_Conditional_0_Conditional_10_Template, 7, 5, "app-popup", 8);
    \u0275\u0275conditionalCreate(11, AdminIdeaEditorPopupComponent_Conditional_0_Conditional_11_Template, 19, 9, "app-popup", 8);
  }
  if (rf & 2) {
    let tmp_9_0;
    let tmp_11_0;
    const ideaCardTemplate_r8 = \u0275\u0275reference(6);
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("model", ctx_r1.ideaEditorPopupModel());
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r1.error ? 2 : -1);
    \u0275\u0275advance();
    \u0275\u0275property("config", ctx_r1.ideaSmartListConfig)("loadPage", ctx_r1.ideaSmartListLoadPage)("filters", ctx_r1.ideaListFilters)("itemTemplate", ideaCardTemplate_r8);
    \u0275\u0275advance(5);
    \u0275\u0275conditional(ctx_r1.articlePanelLoading && ctx_r1.articlePanelLoadingMode === "viewer" ? 8 : (tmp_9_0 = ctx_r1.selectedViewerPost()) ? 9 : -1, tmp_9_0);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r1.articlePanelLoading && ctx_r1.articlePanelLoadingMode === "editor" && !ctx_r1.draft ? 10 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_11_0 = ctx_r1.editing && ctx_r1.draft) ? 11 : -1, tmp_11_0);
  }
}
var AdminIdeaEditorPopupComponent = class _AdminIdeaEditorPopupComponent {
  static IMAGE_LIMIT = 8;
  ideaSmartList;
  admin = inject(AdminMenuStore);
  userProfileStore = inject(UserProfileStore);
  runtimeStore = inject(AppRuntimeStore);
  ideaPosts = inject(IdeaPostsService);
  dialogStore = inject(DialogStore);
  changeDetectorRef = inject(ChangeDetectorRef);
  appMenuDispatcher = inject(AppMenuDispatcher);
  loading = false;
  saving = false;
  error = "";
  editing = false;
  draft = null;
  viewerPostId = "";
  viewerPost = null;
  articlePanelLoading = false;
  articlePanelLoadingMode = null;
  ideaFilter = "all";
  selectedContentLang = "en";
  draftContentLang = "en";
  ideaListFilters = { status: "all", revision: 0 };
  ideaFilterCounts = {};
  articlePanelLoadGeneration = 0;
  listRevision = 0;
  postsByLang = /* @__PURE__ */ new Map();
  adminPostList = [];
  adminPostIndex = /* @__PURE__ */ new Map();
  adminIdeaCardIndex = /* @__PURE__ */ new Map();
  featuredPendingIds = /* @__PURE__ */ new Set();
  articlePreviewHtmlSource = "";
  articlePreviewHtmlRendered = "";
  filterOptions = [
    { id: "all", label: "All", icon: "view_day" },
    { id: "featured", label: "Featured", icon: "star" },
    { id: "published", label: "Published", icon: "visibility" },
    { id: "drafts", label: "Drafts", icon: "drafts" },
    { id: "trashed", label: "Trashed", icon: "delete_outline" }
  ];
  ideaSmartListItemConverter = {
    convert: (post) => this.ideaPosts.adminIdeaInfoCard(post),
    convertList: (posts) => this.ideaPosts.adminIdeaInfoCards(posts)
  };
  ideaSmartListConfig = {
    pageSize: 10,
    initialPageSize: 10,
    initialPageCount: 1,
    defaultView: "day",
    defaultDirection: "desc",
    defaultGroupBy: "submittedDay",
    emptyLabel: (query) => this.ideaEmptyLabel(query.filters?.status ?? "all"),
    emptyDescription: (query) => this.ideaEmptyDescription(query.filters?.status ?? "all"),
    emptyStickyLabel: "Articles",
    showStickyHeader: true,
    showFirstGroupMarker: true,
    showGroupMarker: ({ groupIndex, scrollable }) => groupIndex > 0 || scrollable,
    groupBy: (card) => this.ideaCardDayGroupLabel(card),
    trackBy: (_index, card) => card.id,
    listLayout: "card-grid",
    desktopColumns: 3,
    snapMode: "mandatory",
    scrollPaddingTop: "2.6rem",
    cacheable: true,
    sortable: true,
    converter: this.ideaSmartListItemConverter,
    headerProgress: {
      enabled: true,
      state: () => this.runtimeStore.isOnline() ? "active" : "inactive"
    },
    pagination: {
      mode: "scroll"
    },
    containerClass: {
      "experience-card-list": true,
      "assets-card-list": true
    }
  };
  ideaSmartListLoadPage = (query) => from(this.loadIdeaPostsPage(query));
  async loadIdeaPostsPage(query) {
    const filter = query.filters?.status ?? this.ideaFilter;
    const pageSize = Math.max(1, Math.trunc(Number(query.pageSize) || Number(this.ideaSmartListConfig.pageSize) || 24));
    const page = Math.max(0, Math.trunc(Number(query.page) || 0));
    this.loading = true;
    this.error = "";
    this.refreshView();
    try {
      const result = await this.ideaPosts.loadAdminPostsPage(this.actorUserId(), this.selectedContentLang, {
        status: filter,
        page,
        pageSize,
        cursor: query.cursor ?? null
      });
      this.applyIdeaFilterCounts(result.counts);
      this.reindexAdminPosts();
      const items = result.records.map((post) => this.adminIdeaCardForPostId(post.id)).filter((card) => Boolean(card));
      return {
        items,
        total: result.total,
        nextCursor: result.nextCursor,
        context: { counts: result.counts }
      };
    } catch (error) {
      this.error = "Unable to load articles.";
      throw error;
    } finally {
      this.loading = false;
      this.refreshView();
    }
  }
  constructor() {
    effect(() => {
      if (this.admin.activePopup() !== "idea-editor") {
        this.editing = false;
        this.draft = null;
        this.viewerPostId = "";
        this.viewerPost = null;
        this.articlePanelLoading = false;
        this.articlePanelLoadingMode = null;
        this.articlePanelLoadGeneration += 1;
        this.error = "";
        this.ideaFilterCounts = {};
        this.clearAdminIndexes();
        return;
      }
    });
    effect(() => {
      const sync = this.ideaPosts.adminPostSync();
      if (!sync) {
        return;
      }
      if (this.admin.activePopup() === "idea-editor") {
        untracked(() => this.applyIdeaPostSync(sync));
      }
      this.ideaPosts.clearAdminPostSync();
    });
  }
  onEscape(event) {
    if (this.admin.activePopup() !== "idea-editor") {
      return;
    }
    event.preventDefault();
    if (this.hasOpenSharedMenu()) {
      return;
    }
    if (this.viewerPostId) {
      this.closeViewer();
      return;
    }
    if (this.editing) {
      this.closeEditor();
      return;
    }
    this.close();
  }
  posts() {
    return this.adminPostList;
  }
  selectedViewerPost() {
    return this.viewerPost ?? this.adminPostById(this.viewerPostId) ?? null;
  }
  async load() {
    this.refreshIdeaList();
  }
  ideaEditorPopupModel() {
    return {
      title: "Article editor",
      ariaLabel: "Article editor",
      closeAriaLabel: "Close article editor",
      size: "wide",
      height: "full",
      headerTone: "accent",
      bodyLayout: "fill",
      headerControls: [
        {
          kind: "menu",
          id: "idea-filter",
          menuKind: "inline",
          model: this.ideaFilterMenuModel(),
          panelAlign: "end"
        }
      ],
      headerActions: [
        {
          id: "idea-new",
          icon: "add",
          ariaLabel: "New article",
          palette: "green",
          disabled: this.saving,
          compactOnMobile: true
        }
      ],
      toolbarControls: [
        {
          kind: "menu",
          id: "idea-language",
          align: "end",
          menuKind: "inline",
          model: this.listLanguageMenuModel(),
          panelAlign: "end"
        }
      ],
      onClose: () => this.close(),
      onAction: (event) => this.onIdeaEditorPopupAction(event),
      onMenuSelect: (event) => this.onIdeaEditorPopupMenuSelect(event)
    };
  }
  onIdeaEditorPopupAction(event) {
    if (event.action.id === "idea-new") {
      void this.startNew(event.sourceEvent);
    }
  }
  onIdeaEditorPopupMenuSelect(event) {
    const context = event.itemSelect.context;
    if (!context) {
      return;
    }
    if ("filter" in context) {
      this.setIdeaFilter(context.filter, event.itemSelect.sourceEvent);
      return;
    }
    if ("action" in context) {
      void this.saveDraft(event.itemSelect.sourceEvent);
      return;
    }
    if (context.scope === "form") {
      void this.selectDraftContentLanguage(context.language, event.itemSelect.sourceEvent);
      return;
    }
    this.selectListContentLanguage(context.language, event.itemSelect.sourceEvent);
  }
  articleViewerLoadingPopupModel() {
    return {
      ariaLabel: "Article",
      closeAriaLabel: "Close article",
      size: "wide",
      height: "full",
      headerLayout: "article",
      bodyLayout: "flush",
      onClose: (event) => this.closeViewer(event)
    };
  }
  articleViewerPopupModel(post) {
    return {
      headerLabel: this.postDateLabel(post),
      headerLabelIcon: "calendar_today",
      title: post.title,
      subtitle: post.excerpt,
      ariaLabel: "Article",
      closeAriaLabel: "Close article",
      translateHeaderLabel: false,
      translateTitle: false,
      translateSubtitle: false,
      size: "wide",
      height: "full",
      headerLayout: "article",
      bodyLayout: "flush",
      onClose: (event) => this.closeViewer(event)
    };
  }
  articleEditorLoadingPopupModel() {
    return {
      title: "edit.article",
      ariaLabel: "Edit article",
      closeAriaLabel: "Close editor",
      size: "wide",
      height: "full",
      headerTone: "accent",
      bodyLayout: "fill",
      backdropTone: "dim",
      onClose: (event) => this.closeEditor(event)
    };
  }
  articleEditorPopupModel(draft) {
    return {
      title: draft.id ? "edit.article" : "new.article",
      subtitle: draft.published ? "published" : "draft",
      ariaLabel: draft.id ? "Edit article" : "New article",
      closeAriaLabel: "Close editor",
      size: "wide",
      height: "full",
      headerTone: "accent",
      bodyLayout: "fill",
      backdropTone: "dim",
      showClose: false,
      headerControls: [
        {
          kind: "menu",
          id: "article-save",
          menuKind: "inline",
          items: this.articleSaveMenuItems(),
          closeOnSelect: false
        }
      ],
      headerActions: [
        {
          id: "article-preview",
          icon: "visibility",
          ariaLabel: "Preview article",
          palette: "amber",
          disabled: this.saving
        },
        {
          id: "article-close",
          icon: "close",
          ariaLabel: "Close editor",
          palette: "neutral",
          disabled: this.saving
        }
      ],
      toolbarControls: [
        {
          kind: "menu",
          id: "article-language",
          align: "end",
          menuKind: "inline",
          model: this.formLanguageMenuModel(),
          panelAlign: "end"
        }
      ],
      onClose: (event) => this.closeEditor(event),
      onAction: (event) => void this.onArticleEditorPopupAction(event),
      onMenuSelect: (event) => this.onIdeaEditorPopupMenuSelect(event)
    };
  }
  async onArticleEditorPopupAction(event) {
    switch (event.action.id) {
      case "article-preview":
        await this.openDraftPreview(event.sourceEvent);
        return;
      case "article-close":
        this.closeEditor(event.sourceEvent);
        return;
      default:
        return;
    }
  }
  articleSaveMenuItems() {
    return [{
      id: "article-save",
      icon: "done",
      kind: "action",
      palette: "success",
      disabled: this.saving,
      ariaLabel: "Save article",
      progress: this.saving ? {
        state: "loading",
        shape: "circle"
      } : null,
      context: { action: "save" }
    }];
  }
  close() {
    this.editing = false;
    this.draft = null;
    this.viewerPostId = "";
    this.viewerPost = null;
    this.cancelArticlePanelLoad();
    this.admin.closePopup();
  }
  async startNew(event) {
    event?.stopPropagation();
    const targetLang = this.selectedContentLang;
    this.draftContentLang = targetLang;
    this.editing = false;
    this.draft = null;
    this.viewerPostId = "";
    this.viewerPost = null;
    this.beginEditing({
      id: null,
      contentKey: "",
      title: "",
      excerpt: "",
      contentHtml: this.defaultDraftHtml(targetLang),
      imageUrls: [],
      removedImageUrls: [],
      featured: false,
      published: false,
      submittedAtLocal: this.toDateTimeLocal((/* @__PURE__ */ new Date()).toISOString()),
      mode: "html"
    });
  }
  async openViewer(post, event) {
    event?.stopPropagation();
    const targetPost = this.clonePost(post);
    this.viewerPostId = "";
    this.viewerPost = null;
    this.viewerPostId = targetPost.id;
    this.viewerPost = targetPost;
  }
  closeViewer(event) {
    event?.stopPropagation();
    if (this.articlePanelLoadingMode === "viewer") {
      this.cancelArticlePanelLoad();
    }
    this.viewerPostId = "";
    this.viewerPost = null;
    this.refreshView();
  }
  async startEditing(post, event) {
    event?.stopPropagation();
    const targetPost = this.clonePost(post);
    this.viewerPostId = "";
    this.viewerPost = null;
    this.editing = false;
    this.draft = null;
    this.draftContentLang = this.normalizeContentLang(targetPost.lang);
    this.beginEditing(this.draftFromPost(targetPost));
  }
  closeEditor(event) {
    event?.stopPropagation();
    if (this.articlePanelLoadingMode === "editor") {
      this.cancelArticlePanelLoad();
    }
    this.editing = false;
    this.draft = null;
  }
  async openDraftPreview(event) {
    event?.stopPropagation();
    if (!this.draft) {
      return;
    }
    const activeDraft = this.draft;
    const activeDraftLang = this.draftContentLang;
    const submittedAtIso = this.fromDateTimeLocal(activeDraft.submittedAtLocal);
    const contentHtml = activeDraft.contentHtml.trim() || "<p></p>";
    const imageUrls = this.draftImageUrls(activeDraft);
    this.viewerPostId = activeDraft.id || "draft-preview";
    this.viewerPost = {
      id: activeDraft.id || "draft-preview",
      contentKey: activeDraft.contentKey || "draft-preview",
      lang: activeDraftLang,
      languageLabel: this.contentLanguageLabel(activeDraftLang),
      title: activeDraft.title.trim() || "Untitled article",
      excerpt: activeDraft.excerpt.trim() || this.excerptFromHtml(contentHtml),
      contentHtml,
      imageUrl: imageUrls[0] || "",
      imageUrls,
      featured: false,
      published: false,
      trashed: false,
      trashedAtIso: "",
      trashedByUserId: "",
      submittedAtIso,
      createdAtIso: submittedAtIso,
      createdByUserId: this.actorUserId(),
      updatedAtIso: submittedAtIso,
      updatedByUserId: this.actorUserId()
    };
  }
  async saveDraft(event) {
    event?.preventDefault();
    event?.stopPropagation();
    const activeDraft = this.draft;
    if (!activeDraft || this.saving) {
      return null;
    }
    const request = this.requestFromDraft(activeDraft);
    this.saving = true;
    this.error = "";
    this.refreshView();
    try {
      const saved = await this.ideaPosts.savePost(request);
      this.editing = false;
      this.draft = null;
      return saved;
    } catch {
      this.error = "Unable to save article.";
      return null;
    } finally {
      this.saving = false;
      this.refreshView();
    }
  }
  deletePost(post, event) {
    event?.stopPropagation();
    this.dialogStore.open({
      title: "Move article to trash?",
      message: post.title,
      confirmLabel: "Move to trash",
      busyConfirmLabel: "Moving...",
      confirmTone: "danger",
      onConfirm: async () => {
        this.saving = true;
        this.error = "";
        this.refreshView();
        try {
          await this.ideaPosts.deletePost(post.id, this.actorUserId());
          if (this.viewerPostId === post.id) {
            this.viewerPostId = "";
            this.viewerPost = null;
          }
          if (this.draft?.id === post.id) {
            this.editing = false;
            this.draft = null;
          }
        } catch {
          this.error = "Unable to move article to trash.";
        } finally {
          this.saving = false;
          this.refreshView();
        }
      }
    });
  }
  togglePublishedFromCard(post, event) {
    event?.stopPropagation();
    if (post.trashed) {
      return;
    }
    const nextPublished = !post.published;
    this.dialogStore.open({
      title: nextPublished ? "Publish article?" : "Unpublish article?",
      message: post.title,
      cancelLabel: "Cancel",
      confirmLabel: nextPublished ? "Publish" : "Unpublish",
      busyConfirmLabel: nextPublished ? "Publishing..." : "Unpublishing...",
      confirmTone: nextPublished ? "accent" : "danger",
      failureMessage: nextPublished ? "Unable to publish article." : "Unable to unpublish article.",
      onConfirm: () => this.confirmPublishedToggle(post, nextPublished)
    });
  }
  async restorePost(post, event) {
    event?.stopPropagation();
    if (!post.trashed || this.saving) {
      return;
    }
    this.dialogStore.open({
      title: "Restore article?",
      message: post.title,
      cancelLabel: "Cancel",
      confirmLabel: "Restore",
      busyConfirmLabel: "Restoring...",
      confirmTone: "accent",
      failureMessage: "Unable to restore article.",
      onConfirm: () => this.confirmRestorePost(post)
    });
  }
  async confirmRestorePost(post) {
    this.saving = true;
    this.error = "";
    this.refreshView();
    try {
      const restored = await this.ideaPosts.restorePost(post.id, this.actorUserId());
      if (this.viewerPostId === post.id) {
        this.viewerPost = this.clonePost(restored);
      }
    } catch {
      this.error = "Unable to restore article.";
      throw new Error(this.error);
    } finally {
      this.saving = false;
      this.refreshView();
    }
  }
  async confirmPublishedToggle(post, nextPublished) {
    this.saving = true;
    this.error = "";
    this.refreshView();
    try {
      const saved = await this.ideaPosts.savePost({
        actorUserId: this.actorUserId(),
        id: post.id,
        lang: post.lang,
        title: post.title,
        excerpt: post.excerpt,
        contentHtml: post.contentHtml,
        imageUrl: post.imageUrl,
        imageUrls: post.imageUrls,
        featured: nextPublished ? post.featured : false,
        published: nextPublished,
        submittedAtIso: post.submittedAtIso
      });
      if (this.viewerPostId === post.id) {
        this.viewerPost = this.clonePost(saved);
      }
      if (this.draft?.id === post.id) {
        this.draft.published = saved.published;
        this.draft.featured = saved.featured;
      }
    } catch {
      this.error = nextPublished ? "Unable to publish article." : "Unable to unpublish article.";
      throw new Error(this.error);
    } finally {
      this.saving = false;
      this.refreshView();
    }
  }
  toggleFeaturedFromCard(post, event) {
    event?.stopPropagation();
    if (post.trashed || !post.published || this.featuredPendingIds.has(post.id)) {
      return;
    }
    const nextFeatured = !post.featured;
    this.dialogStore.open({
      title: nextFeatured ? "Feature article?" : "Remove featured article?",
      message: post.title,
      cancelLabel: "Cancel",
      confirmLabel: nextFeatured ? "Feature" : "Unfeature",
      busyConfirmLabel: nextFeatured ? "Featuring..." : "Unfeaturing...",
      confirmTone: nextFeatured ? "accent" : "danger",
      failureMessage: nextFeatured ? "Unable to feature article." : "Unable to unfeature article.",
      onConfirm: () => this.confirmFeaturedToggle(post, nextFeatured)
    });
  }
  async confirmFeaturedToggle(post, nextFeatured) {
    this.featuredPendingIds.add(post.id);
    this.saving = true;
    this.error = "";
    this.refreshView();
    try {
      const saved = await this.ideaPosts.savePost({
        actorUserId: this.actorUserId(),
        id: post.id,
        lang: post.lang,
        title: post.title,
        excerpt: post.excerpt,
        contentHtml: post.contentHtml,
        imageUrl: post.imageUrl,
        imageUrls: post.imageUrls,
        featured: nextFeatured,
        published: post.published,
        submittedAtIso: post.submittedAtIso
      });
      if (this.viewerPostId === post.id) {
        this.viewerPost = this.clonePost(saved);
      }
      if (this.draft?.id === post.id) {
        this.draft.featured = saved.featured;
      }
    } catch {
      this.error = nextFeatured ? "Unable to feature article." : "Unable to unfeature article.";
      throw new Error(this.error);
    } finally {
      this.featuredPendingIds.delete(post.id);
      this.saving = false;
      this.refreshView();
    }
  }
  clonePost(post) {
    return __spreadProps(__spreadValues({}, post), { imageUrls: [...post.imageUrls] });
  }
  reindexAdminPosts() {
    const posts = this.ideaPosts.adminPosts();
    const postIndex = /* @__PURE__ */ new Map();
    for (const post of posts) {
      postIndex.set(post.id, post);
    }
    const cards = this.ideaPosts.adminIdeaInfoCards();
    const cardIndex = /* @__PURE__ */ new Map();
    for (const card of cards) {
      const postId = this.ideaCardPostId(card);
      if (postId) {
        cardIndex.set(postId, card);
      }
    }
    this.adminPostList = posts;
    this.adminPostIndex = postIndex;
    this.adminIdeaCardIndex = cardIndex;
  }
  applyIdeaPostSync(post) {
    const previous = this.adminPostIndex.get(post.id) ?? null;
    this.cachePost(post);
    if (this.normalizeContentLang(post.lang) !== this.selectedContentLang) {
      return;
    }
    this.patchIdeaFilterCounts(previous, post);
    this.reindexAdminPosts();
    this.syncIdeaPostInSmartList(post.id, post);
    if (this.viewerPostId === post.id) {
      this.viewerPost = this.clonePost(post);
    }
    this.refreshView();
  }
  patchIdeaFilterCounts(previous, current) {
    const nextCounts = __spreadValues({}, this.ideaFilterCounts);
    for (const option of this.filterOptions) {
      const previousMatches = previous ? this.ideaPosts.adminPostMatchesFilter(previous, option.id) : false;
      const currentMatches = this.ideaPosts.adminPostMatchesFilter(current, option.id);
      const delta = Number(currentMatches) - Number(previousMatches);
      if (delta !== 0 && nextCounts[option.id] !== void 0) {
        nextCounts[option.id] = Math.max(0, this.countValue(nextCounts[option.id]) + delta);
      }
    }
    this.ideaFilterCounts = nextCounts;
  }
  syncIdeaPostInSmartList(postId, post) {
    const smartList = this.ideaSmartList;
    if (!smartList) {
      return;
    }
    const shouldShow = post !== null && this.ideaPosts.adminPostMatchesFilter(post, this.ideaFilter);
    const removedExisting = smartList.removeVisibleItems((card) => this.ideaCardPostId(card) === postId, { totalDelta: shouldShow ? 0 : -1 });
    if (post && shouldShow) {
      smartList.upsertConvertedVisibleItem(post, {
        predicate: (card) => this.ideaCardPostId(card) === postId,
        totalDelta: removedExisting ? 0 : 1,
        loadedRange: "before-or-within"
      });
    }
  }
  clearAdminIndexes() {
    this.adminPostList = [];
    this.adminPostIndex.clear();
    this.adminIdeaCardIndex.clear();
  }
  cachePosts(lang, posts) {
    this.setPostsCache(this.normalizeContentLang(lang), posts);
  }
  cachePost(post) {
    const lang = this.normalizeContentLang(post.lang);
    const cache = this.postsByLang.get(lang);
    if (!cache) {
      this.setPostsCache(lang, [post]);
      return;
    }
    const clonedPost = this.clonePost(post);
    const oldContentKeyPost = cache.byContentKey.get(clonedPost.contentKey);
    if (oldContentKeyPost && oldContentKeyPost.id !== clonedPost.id) {
      this.removeCachedPost(cache, oldContentKeyPost.id);
    }
    const oldPost = cache.byId.get(clonedPost.id);
    if (oldPost) {
      cache.byContentKey.delete(oldPost.contentKey);
    }
    const existingIndex = cache.indexById.get(clonedPost.id);
    if (existingIndex === void 0) {
      cache.indexById.set(clonedPost.id, cache.posts.length);
      cache.posts.push(clonedPost);
    } else {
      cache.posts[existingIndex] = clonedPost;
    }
    cache.byId.set(clonedPost.id, clonedPost);
    cache.byContentKey.set(clonedPost.contentKey, clonedPost);
  }
  async findArticleTranslation(contentKey, lang) {
    const normalizedLang = this.normalizeContentLang(lang);
    const normalizedContentKey = `${contentKey ?? ""}`.trim();
    if (!normalizedContentKey) {
      return null;
    }
    const cached = this.postsByLang.get(normalizedLang)?.byContentKey.get(normalizedContentKey);
    if (cached) {
      return this.clonePost(cached);
    }
    try {
      const posts = await this.ideaPosts.loadAdminPostsSnapshot(this.actorUserId(), normalizedLang);
      this.cachePosts(normalizedLang, posts);
      const loaded = this.postsByLang.get(normalizedLang)?.byContentKey.get(normalizedContentKey);
      return loaded ? this.clonePost(loaded) : null;
    } catch {
      this.error = "Unable to load article language version.";
      return null;
    }
  }
  setPostsCache(lang, posts) {
    const clonedPosts = posts.map((post) => this.clonePost(post));
    const byId = /* @__PURE__ */ new Map();
    const byContentKey = /* @__PURE__ */ new Map();
    for (const post of clonedPosts) {
      byId.set(post.id, post);
      byContentKey.set(post.contentKey, post);
    }
    this.postsByLang.set(lang, {
      posts: clonedPosts,
      byId,
      byContentKey,
      indexById: this.indexPostsById(clonedPosts)
    });
  }
  indexPostsById(posts) {
    const indexById = /* @__PURE__ */ new Map();
    posts.forEach((post, index) => indexById.set(post.id, index));
    return indexById;
  }
  removeCachedPost(cache, postId) {
    const index = cache.indexById.get(postId);
    const post = cache.byId.get(postId);
    if (index === void 0 || !post) {
      return;
    }
    const lastIndex = cache.posts.length - 1;
    const lastPost = cache.posts[lastIndex];
    if (index !== lastIndex && lastPost) {
      cache.posts[index] = lastPost;
      cache.indexById.set(lastPost.id, index);
    }
    cache.posts.pop();
    cache.byId.delete(post.id);
    cache.byContentKey.delete(post.contentKey);
    cache.indexById.delete(post.id);
  }
  isFeatureTogglePending(postId) {
    return this.featuredPendingIds.has(postId);
  }
  onIdeaCardMenuAction(card, event) {
    const post = this.ideaPostFromCard(card);
    if (!post) {
      return;
    }
    switch (event.actionId) {
      case "viewArticle":
        void this.openViewer(post);
        break;
      case "edit":
        void this.startEditing(post);
        break;
      case "publish":
      case "unpublish":
        this.togglePublishedFromCard(post);
        break;
      case "feature":
      case "unfeature":
        this.toggleFeaturedFromCard(post);
        break;
      case "restore":
        void this.restorePost(post);
        break;
      case "delete":
        this.deletePost(post);
        break;
    }
  }
  openIdeaInfoCardMenu(card, request) {
    const menuId = `admin-idea-card:${request.id}`;
    if (this.appMenuDispatcher.isOpen(menuId)) {
      this.appMenuDispatcher.close(menuId);
      return;
    }
    this.appMenuDispatcher.open({
      id: menuId,
      kind: "select",
      title: this.infoCardMenuTitle(request.card),
      items: this.infoCardMenuItems(card, request),
      triggerRect: request.triggerRect,
      openUp: request.openUp,
      panelAlign: "auto",
      closeOnSelect: true,
      onClose: request.closeTrigger
    }, null);
  }
  onIdeaDispatchedMenuSelect(event) {
    const context = event.context;
    if (!context) {
      return;
    }
    this.onIdeaCardMenuAction(context.card, {
      id: context.card.id,
      actionId: context.action.id,
      action: context.action,
      card: context.card
    });
  }
  infoCardMenuTitle(card) {
    if (card.menuTitle === null) {
      return null;
    }
    return `${card.menuTitle ?? card.title ?? ""}`.trim();
  }
  infoCardMenuItems(card, request) {
    return (request.actions ?? []).flatMap((actionId) => {
      const config = CARD_MENU_ACTIONS[actionId];
      if (!config) {
        return [];
      }
      const action = __spreadValues({
        id: actionId
      }, config);
      return [{
        id: actionId,
        label: config.label,
        icon: config.icon,
        palette: this.infoCardActionPalette(config.tone),
        surface: "tinted",
        context: {
          card,
          action
        }
      }];
    });
  }
  infoCardActionPalette(tone) {
    switch (tone) {
      case "accent":
        return "green";
      case "review":
        return "violet";
      case "warning":
        return "warning";
      case "destructive":
        return "danger";
      default:
        return "neutral";
    }
  }
  contentLanguages() {
    return APP_STATIC_DATA.contentLanguages;
  }
  selectedContentLanguageLabel() {
    return this.contentLanguageLabel(this.selectedContentLang);
  }
  draftContentLanguageLabel() {
    return this.contentLanguageLabel(this.draftContentLang);
  }
  contentLanguageFlag(lang) {
    const flags = { en: "\u{1F1EC}\u{1F1E7}", hu: "\u{1F1ED}\u{1F1FA}" };
    return flags[this.normalizeContentLang(lang)] ?? "\u{1F310}";
  }
  selectListContentLanguage(lang, event) {
    event?.preventDefault();
    event?.stopPropagation();
    const normalized = this.normalizeContentLang(lang);
    if (normalized === this.selectedContentLang || this.loading || this.saving) {
      return;
    }
    this.selectedContentLang = normalized;
    this.editing = false;
    this.draft = null;
    this.viewerPostId = "";
    this.viewerPost = null;
    this.cancelArticlePanelLoad();
    this.ideaFilterCounts = {};
    this.clearAdminIndexes();
    this.refreshIdeaList();
  }
  async selectDraftContentLanguage(lang, event) {
    event?.preventDefault();
    event?.stopPropagation();
    const normalized = this.normalizeContentLang(lang);
    if (!this.draft || normalized === this.draftContentLang || this.saving) {
      return;
    }
    const currentDraft = this.draft;
    const generation = this.beginArticlePanelLoad("editor");
    const translation = await this.findArticleTranslation(currentDraft.contentKey, normalized);
    if (!this.isCurrentArticlePanelLoad(generation, "editor")) {
      return;
    }
    this.draftContentLang = normalized;
    this.beginEditing(translation ? this.draftFromPost(translation) : this.emptyTranslationDraftFrom(currentDraft));
    this.finishArticlePanelLoad(generation, "editor");
  }
  setIdeaFilter(filter, event) {
    event?.preventDefault();
    event?.stopPropagation();
    if (this.ideaFilter === filter) {
      return;
    }
    this.ideaFilter = filter;
    this.refreshIdeaList();
  }
  articlePanelLoadingLabel() {
    return this.articlePanelLoadingMode === "viewer" ? "loading.article" : "loading.article.editor";
  }
  filterLabel() {
    return this.filterOptions.find((option) => option.id === this.ideaFilter)?.label ?? "All";
  }
  filterIcon() {
    return this.filterOptions.find((option) => option.id === this.ideaFilter)?.icon ?? "view_day";
  }
  filterCount(filter = this.ideaFilter) {
    return this.countValue(this.ideaFilterCounts[filter]);
  }
  ideaFilterMenuModel() {
    return {
      nodes: [
        {
          id: "idea-filter-root",
          items: [
            {
              id: "idea-filter-menu",
              kind: "select-trigger",
              label: this.filterLabel(),
              icon: this.filterIcon(),
              palette: this.filterPalette(this.ideaFilter),
              counter: this.filterCount(),
              ariaLabel: "Filter articles",
              items: this.filterOptions.map((option) => ({
                id: `idea-filter:${option.id}`,
                kind: "radio",
                label: option.label,
                icon: option.icon,
                palette: this.filterPalette(option.id),
                surface: "tinted",
                checked: this.ideaFilter === option.id,
                counter: this.filterCount(option.id),
                context: { filter: option.id }
              }))
            }
          ]
        }
      ]
    };
  }
  listLanguageMenuModel() {
    return this.contentLanguageMenuModel("list", this.selectedContentLang, this.loading || this.saving);
  }
  formLanguageMenuModel() {
    return this.contentLanguageMenuModel("form", this.draftContentLang, this.saving);
  }
  onContentLanguageMenuSelect(event) {
    const context = event.context;
    if (!context) {
      return;
    }
    if (context.scope === "form") {
      void this.selectDraftContentLanguage(context.language, event.sourceEvent);
      return;
    }
    this.selectListContentLanguage(context.language, event.sourceEvent);
  }
  filterDescription() {
    const total = this.posts().length;
    const visible = this.filterCount();
    return this.ideaFilter === "all" ? `${total} article${total === 1 ? "" : "s"}` : `${visible} of ${total}`;
  }
  formatPastedHtml(event) {
    if (!this.draft) {
      return;
    }
    const textarea = event.target instanceof HTMLTextAreaElement ? event.target : null;
    const current = this.draft.contentHtml ?? "";
    const start = textarea?.selectionStart ?? current.length;
    const end = textarea?.selectionEnd ?? start;
    const clipboardHtml = event.clipboardData?.getData("text/html") ?? "";
    const clipboardText = event.clipboardData?.getData("text/plain") ?? "";
    const pasted = AppUtils.isHtmlTagPosition(current, start) ? clipboardText : this.htmlFromClipboardPayload(clipboardHtml, clipboardText);
    if (!pasted.trim()) {
      return;
    }
    event.preventDefault();
    this.draft.contentHtml = this.formatHtmlFragment(`${current.slice(0, start)}${pasted}${current.slice(end)}`);
  }
  removeDraftImage(imageUrl) {
    if (!this.draft) {
      return;
    }
    this.draft.removedImageUrls = this.uniqueImageUrls([
      ...this.draft.removedImageUrls,
      imageUrl
    ]);
    this.draft.contentHtml = AppUtils.removeManagedImageReferencesHtml(this.draft.contentHtml, [imageUrl]);
  }
  articlePreviewHtml(post) {
    const source = `${post?.contentHtml ?? ""}`;
    if (source !== this.articlePreviewHtmlSource) {
      this.articlePreviewHtmlSource = source;
      this.articlePreviewHtmlRendered = AppUtils.mediaImageVariantHtml(this.expandPlainImageLinksInHtml(source), "large");
    }
    return this.articlePreviewHtmlRendered;
  }
  postStatusLabel(post) {
    if (post.trashed) {
      return "Trashed";
    }
    if (!post.published) {
      return "Draft";
    }
    return "Published";
  }
  postDateLabel(post) {
    const parsed = Date.parse(post?.submittedAtIso || post?.updatedAtIso || post?.createdAtIso || "");
    if (!Number.isFinite(parsed)) {
      return "No date";
    }
    return new Intl.DateTimeFormat(void 0, {
      year: "numeric",
      month: "short",
      day: "numeric"
    }).format(new Date(parsed));
  }
  ideaImageUrl(post) {
    return `${post?.imageUrl ?? post?.imageUrls?.[0] ?? ""}`.trim();
  }
  actorUserId() {
    return this.userProfileStore.activeUserId().trim();
  }
  beginArticlePanelLoad(mode) {
    const generation = ++this.articlePanelLoadGeneration;
    this.articlePanelLoadingMode = mode;
    this.articlePanelLoading = true;
    this.error = "";
    this.refreshView();
    return generation;
  }
  finishArticlePanelLoad(generation, mode) {
    if (!this.isCurrentArticlePanelLoad(generation, mode)) {
      return;
    }
    this.articlePanelLoading = false;
    this.articlePanelLoadingMode = null;
    this.refreshView();
  }
  cancelArticlePanelLoad() {
    this.articlePanelLoadGeneration += 1;
    this.articlePanelLoading = false;
    this.articlePanelLoadingMode = null;
  }
  isCurrentArticlePanelLoad(generation, mode) {
    return this.admin.activePopup() === "idea-editor" && this.articlePanelLoadGeneration === generation && this.articlePanelLoading && this.articlePanelLoadingMode === mode;
  }
  contentLanguageMenuModel(scope, currentLanguage, disabled) {
    const normalizedCurrentLanguage = this.normalizeContentLang(currentLanguage);
    const rootId = `${scope}-language-menu`;
    return {
      nodes: [
        {
          id: `${scope}-language-root`,
          items: [
            {
              id: rootId,
              kind: "select-trigger",
              label: this.contentLanguageMenuLabel(normalizedCurrentLanguage),
              palette: "blue",
              disabled,
              ariaLabel: "Content language",
              items: this.contentLanguages().map((language) => {
                const normalizedLanguage = this.normalizeContentLang(language.lang);
                return {
                  id: `${scope}-language:${normalizedLanguage}`,
                  kind: "radio",
                  label: this.contentLanguageMenuLabel(normalizedLanguage),
                  palette: normalizedLanguage === "hu" ? "green" : "blue",
                  surface: "tinted",
                  checked: normalizedCurrentLanguage === normalizedLanguage,
                  context: { scope, language: normalizedLanguage }
                };
              })
            }
          ]
        }
      ]
    };
  }
  contentLanguageMenuLabel(lang) {
    return `${this.contentLanguageFlag(lang)} ${this.contentLanguageLabel(lang)}`;
  }
  filterPalette(filter) {
    switch (filter) {
      case "featured":
        return "gold";
      case "published":
        return "blue";
      case "drafts":
        return "slate";
      case "trashed":
        return "danger";
      default:
        return "blue";
    }
  }
  hasOpenSharedMenu() {
    if (typeof document === "undefined") {
      return false;
    }
    return !!document.querySelector("app-admin-idea-editor-popup .app-menu-host--open");
  }
  beginEditing(draft) {
    this.draft = draft;
    this.editing = true;
  }
  draftFromPost(post) {
    return {
      id: post.id,
      contentKey: post.contentKey || this.contentKeyFromId(post.id),
      title: post.title,
      excerpt: post.excerpt,
      contentHtml: this.formatHtmlFragment(post.contentHtml),
      imageUrls: this.uniqueImageUrls([post.imageUrl, ...post.imageUrls]).slice(0, _AdminIdeaEditorPopupComponent.IMAGE_LIMIT),
      removedImageUrls: [],
      featured: false,
      published: false,
      submittedAtLocal: this.toDateTimeLocal(post.submittedAtIso || post.updatedAtIso || post.createdAtIso),
      mode: "html"
    };
  }
  emptyTranslationDraftFrom(source) {
    return {
      id: null,
      contentKey: source.contentKey || this.contentKeyFromId(source.id ?? ""),
      title: "",
      excerpt: "",
      contentHtml: this.defaultDraftHtml(this.draftContentLang),
      imageUrls: [...source.imageUrls],
      removedImageUrls: [],
      featured: false,
      published: false,
      submittedAtLocal: source.submittedAtLocal,
      mode: "html"
    };
  }
  defaultDraftHtml(lang) {
    return this.normalizeContentLang(lang) === "hu" ? "<p>\xCDrd le, mi\xE9rt fontos ez a MyScoutee cikk.</p>" : "<p>Describe why this MyScoutee article matters.</p>";
  }
  requestFromDraft(draft) {
    const imageUrls = this.draftImageUrls(draft);
    return {
      actorUserId: this.actorUserId(),
      id: draft.id,
      contentKey: draft.contentKey,
      lang: this.draftContentLang,
      title: draft.title,
      excerpt: draft.excerpt,
      contentHtml: draft.contentHtml,
      imageUrl: imageUrls[0] ?? "",
      imageUrls,
      removedImageUrls: [...draft.removedImageUrls],
      featured: false,
      published: false,
      submittedAtIso: this.fromDateTimeLocal(draft.submittedAtLocal)
    };
  }
  draftImageUrls(draft) {
    return this.uniqueImageUrls(draft.imageUrls).slice(0, _AdminIdeaEditorPopupComponent.IMAGE_LIMIT);
  }
  normalizeContentLang(lang) {
    const normalized = `${lang ?? ""}`.trim().toLowerCase().split("-")[0];
    return normalized === "hu" ? "hu" : "en";
  }
  contentLanguageLabel(lang) {
    const normalized = this.normalizeContentLang(lang);
    return APP_STATIC_DATA.contentLanguages.find((language) => language.lang === normalized)?.label ?? "English";
  }
  contentKeyFromId(id) {
    const normalized = `${id ?? ""}`.trim();
    return normalized.endsWith("-hu") ? normalized.slice(0, -3) : normalized;
  }
  refreshIdeaList() {
    this.listRevision += 1;
    this.ideaListFilters = {
      status: this.ideaFilter,
      revision: this.listRevision
    };
    this.ideaSmartList?.reload();
    this.refreshView();
  }
  applyIdeaFilterCounts(counts) {
    this.ideaFilterCounts = {
      all: this.countValue(counts.all),
      featured: this.countValue(counts.featured),
      published: this.countValue(counts.published),
      drafts: this.countValue(counts.drafts),
      trashed: this.countValue(counts.trashed)
    };
  }
  countValue(value) {
    const parsed = Math.trunc(Number(value));
    return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
  }
  adminIdeaCardForPostId(postId) {
    return this.adminIdeaCardIndex.get(postId) ?? null;
  }
  ideaPostFromCard(card) {
    return this.adminPostById(this.ideaCardPostId(card));
  }
  adminPostById(postId) {
    const normalizedPostId = `${postId ?? ""}`.trim();
    if (!normalizedPostId) {
      return null;
    }
    return this.adminPostIndex.get(normalizedPostId) ?? null;
  }
  ideaCardPostId(card) {
    return `${card?.eagerDetail?.id ?? ""}`.trim();
  }
  ideaCardDayGroupLabel(card) {
    const parsed = Date.parse(card.eagerDetail?.sortAtIso ?? "");
    if (!Number.isFinite(parsed)) {
      return "No date";
    }
    return new Intl.DateTimeFormat(void 0, {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric"
    }).format(new Date(parsed));
  }
  ideaEmptyLabel(filter) {
    if (filter === "featured") {
      return "No featured articles";
    }
    if (filter === "published") {
      return "No published articles";
    }
    if (filter === "drafts") {
      return "No draft articles";
    }
    if (filter === "trashed") {
      return "No trashed articles";
    }
    return "No articles";
  }
  ideaEmptyDescription(filter) {
    if (filter === "featured") {
      return "Feature an article card with the star action.";
    }
    if (filter === "published") {
      return "Publish an article from the card menu.";
    }
    if (filter === "drafts") {
      return "Save an edited article to keep it as a draft until it is republished.";
    }
    if (filter === "trashed") {
      return "Deleted articles appear here until they are restored.";
    }
    return "Create the first landing article card.";
  }
  htmlFromClipboardPayload(html, text) {
    const normalizedHtml = `${html ?? ""}`.trim();
    const normalizedText = `${text ?? ""}`.trim();
    if (AppUtils.looksLikeHtmlFragment(normalizedText)) {
      return normalizedText;
    }
    if (normalizedHtml) {
      return normalizedHtml;
    }
    if (this.isEmbeddableImageUrl(normalizedText)) {
      return `<img src="${this.escapeHtmlAttribute(normalizedText)}" alt="">`;
    }
    return text;
  }
  expandPlainImageLinksInHtml(value) {
    const html = `${value ?? ""}`.trim();
    if (!html || typeof document === "undefined") {
      return html;
    }
    const template = document.createElement("template");
    template.innerHTML = html;
    const textNodes = [];
    const walker = document.createTreeWalker(template.content, NodeFilter.SHOW_TEXT);
    let current = walker.nextNode();
    while (current) {
      if (current instanceof Text && !this.isImageLinkExcludedTextNode(current)) {
        textNodes.push(current);
      }
      current = walker.nextNode();
    }
    textNodes.forEach((node) => this.replaceImageLinksInTextNode(node));
    return template.innerHTML;
  }
  isImageLinkExcludedTextNode(node) {
    return Boolean(node.parentElement?.closest("a, code, pre, script, style, textarea"));
  }
  replaceImageLinksInTextNode(node) {
    const text = node.textContent ?? "";
    const imageLinkPattern = /(data:image\/[^\s<>"']+|blob:https?:\/\/[^\s<>"']+|\/media\/public\?[^\s<>"']+|https?:\/\/[^\s<>"']+\/media\/public\?[^\s<>"']+|https?:\/\/[^\s<>"']+\.(?:png|jpe?g|gif|webp|avif|svg)(?:\?[^\s<>"']*)?)/gi;
    if (!imageLinkPattern.test(text)) {
      return;
    }
    imageLinkPattern.lastIndex = 0;
    const fragment = document.createDocumentFragment();
    let cursor = 0;
    for (const match of text.matchAll(imageLinkPattern)) {
      const matchIndex = match.index ?? 0;
      const rawImageUrl = match[0] ?? "";
      if (matchIndex > cursor) {
        fragment.append(document.createTextNode(text.slice(cursor, matchIndex)));
      }
      const { imageUrl, trailing } = this.stripTrailingImageUrlPunctuation(rawImageUrl);
      const img = document.createElement("img");
      img.src = imageUrl;
      img.alt = "";
      fragment.append(img);
      if (trailing) {
        fragment.append(document.createTextNode(trailing));
      }
      cursor = matchIndex + rawImageUrl.length;
    }
    if (cursor < text.length) {
      fragment.append(document.createTextNode(text.slice(cursor)));
    }
    node.parentNode?.replaceChild(fragment, node);
  }
  stripTrailingImageUrlPunctuation(value) {
    if (/^data:image\//i.test(value)) {
      return { imageUrl: value, trailing: "" };
    }
    let imageUrl = value;
    let trailing = "";
    while (/[),.;:!?]$/.test(imageUrl)) {
      trailing = `${imageUrl.slice(-1)}${trailing}`;
      imageUrl = imageUrl.slice(0, -1);
    }
    return { imageUrl, trailing };
  }
  isEmbeddableImageUrl(value) {
    const normalized = `${value ?? ""}`.trim();
    return /^data:image\//i.test(normalized) || /^blob:https?:\/\//i.test(normalized) || /^\/(?:api\/)?media\/public\?[^\s<>"']+$/i.test(normalized) || /^https?:\/\/[^\s<>"']+\/(?:api\/)?media\/public\?[^\s<>"']+$/i.test(normalized) || /^https?:\/\/[^\s<>"']+\.(?:png|jpe?g|gif|webp|avif|svg)(?:\?[^\s<>"']*)?$/i.test(normalized);
  }
  htmlToText(value) {
    if (typeof document === "undefined") {
      return `${value ?? ""}`.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
    }
    const template = document.createElement("template");
    template.innerHTML = value;
    return `${template.content.textContent ?? ""}`.replace(/\s+/g, " ").trim();
  }
  excerptFromHtml(value) {
    const text = this.htmlToText(value);
    return text.length <= 180 ? text : `${text.slice(0, 179).trim()}...`;
  }
  uniqueImageUrls(urls) {
    return Array.from(new Set(urls.map((url) => `${url ?? ""}`.trim()).filter(Boolean)));
  }
  toDateTimeLocal(value) {
    const parsed = Date.parse(value);
    const date = Number.isFinite(parsed) ? new Date(parsed) : /* @__PURE__ */ new Date();
    const pad = (next) => `${next}`.padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }
  fromDateTimeLocal(value) {
    const parsed = Date.parse(value);
    return Number.isFinite(parsed) ? new Date(parsed).toISOString() : (/* @__PURE__ */ new Date()).toISOString();
  }
  refreshView() {
    queueMicrotask(() => {
      try {
        this.changeDetectorRef.detectChanges();
      } catch {
      }
    });
  }
  formatHtmlFragment(value) {
    const html = `${value ?? ""}`.trim();
    if (!html || typeof document === "undefined") {
      return html;
    }
    const template = document.createElement("template");
    template.innerHTML = html;
    return Array.from(template.content.childNodes).map((node) => this.formatHtmlNode(node, 0)).flat().filter((line) => line.trim()).join("\n").trim();
  }
  formatHtmlNode(node, depth) {
    const indent = "  ".repeat(depth);
    if (node.nodeType === 3) {
      const text = `${node.textContent ?? ""}`.replace(/\s+/g, " ").trim();
      return text ? [`${indent}${this.escapeHtml(text)}`] : [];
    }
    if (!(node instanceof HTMLElement)) {
      return [];
    }
    const tag = node.tagName.toLowerCase();
    const attributes = Array.from(node.attributes).map((attribute) => ` ${attribute.name}="${this.escapeHtmlAttribute(attribute.value)}"`).join("");
    const children = Array.from(node.childNodes).filter((child) => child.nodeType !== 3 || `${child.textContent ?? ""}`.trim());
    if (["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"].includes(tag)) {
      return [`${indent}<${tag}${attributes}>`];
    }
    if (children.length === 0) {
      return [`${indent}<${tag}${attributes}></${tag}>`];
    }
    if (children.length === 1 && children[0].nodeType === 3) {
      const text = `${children[0].textContent ?? ""}`.replace(/\s+/g, " ").trim();
      return [`${indent}<${tag}${attributes}>${this.escapeHtml(text)}</${tag}>`];
    }
    return [
      `${indent}<${tag}${attributes}>`,
      ...children.flatMap((child) => this.formatHtmlNode(child, depth + 1)),
      `${indent}</${tag}>`
    ];
  }
  escapeHtml(value) {
    return `${value ?? ""}`.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  escapeHtmlAttribute(value) {
    return this.escapeHtml(value).replace(/"/g, "&quot;");
  }
  static \u0275fac = function AdminIdeaEditorPopupComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AdminIdeaEditorPopupComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AdminIdeaEditorPopupComponent, selectors: [["app-admin-idea-editor-popup"]], viewQuery: function AdminIdeaEditorPopupComponent_Query(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275viewQuery(_c0, 5);
    }
    if (rf & 2) {
      let _t;
      \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.ideaSmartList = _t.first);
    }
  }, hostBindings: function AdminIdeaEditorPopupComponent_HostBindings(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275listener("keydown.escape", function AdminIdeaEditorPopupComponent_keydown_escape_HostBindingHandler($event) {
        return ctx.onEscape($event);
      }, \u0275\u0275resolveWindow);
    }
  }, features: [\u0275\u0275ProvidersFeature([AppMenuDispatcher])], decls: 1, vars: 1, consts: [["ideaSmartList", ""], ["ideaCardTemplate", ""], [3, "model"], [1, "idea-editor-body"], [1, "idea-editor-error"], [1, "idea-editor-smart-list", 3, "config", "loadPage", "filters", "itemTemplate"], [3, "itemSelect"], [1, "idea-editor-article-viewer-popup", 3, "model", "zIndex"], [1, "idea-editor-article-editor-popup", 3, "model", "zIndex"], [1, "idea-info-card", 3, "menuAction", "menuRequest", "card", "useSharedMenu"], ["aria-busy", "true", 1, "idea-editor-viewer-panel", "idea-editor-panel-loading"], [1, "idea-editor-panel-loading-card"], ["kind", "load-ring", "state", "loading"], [1, "idea-editor-viewer-panel"], [1, "idea-editor-viewer-body"], [1, "idea-editor-html-preview", "idea-editor-viewer-html"], ["data-i18n-ignore", "", 1, "idea-editor-html-preview-body", 3, "innerHTML"], ["aria-busy", "true", 1, "idea-editor-form-panel", "idea-editor-panel-loading"], [1, "idea-editor-form-panel", 3, "ngSubmit"], ["aria-busy", "true", 1, "idea-editor-form-loading-overlay"], [1, "idea-editor-form-content"], [1, "idea-editor-fields"], [1, "idea-editor-field", "idea-editor-field-title"], ["type", "text", "name", "ideaTitle", "required", "", 3, "ngModelChange", "ngModel"], [1, "idea-editor-field", "idea-editor-field-wide"], ["name", "ideaExcerpt", "rows", "3", "placeholder", "Short card description", 3, "ngModelChange", "ngModel"], ["name", "ideaImages", "slotImageVariant", "medium", "mediaFit", "cover", "ariaLabel", "Article image slots", 3, "ngModelChange", "imageRemoved", "ngModel", "disabled", "uploadOwnerId"], [1, "idea-editor-html-panel"], [1, "idea-editor-html-head"], ["name", "ideaContentHtml", "spellcheck", "false", 1, "idea-editor-html-textarea", 3, "ngModelChange", "paste", "ngModel"]], template: function AdminIdeaEditorPopupComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275conditionalCreate(0, AdminIdeaEditorPopupComponent_Conditional_0_Template, 12, 9);
    }
    if (rf & 2) {
      \u0275\u0275conditional(ctx.admin.activePopup() === "idea-editor" ? 0 : -1);
    }
  }, dependencies: [
    CommonModule,
    FormsModule,
    \u0275NgNoValidate,
    DefaultValueAccessor,
    NgControlStatus,
    NgControlStatusGroup,
    RequiredValidator,
    NgModel,
    NgForm,
    MatIconModule,
    MatIcon,
    AppMenuOutletComponent,
    SmartListComponent,
    InfoCardComponent,
    ImageCarouselComponent,
    IndicatorComponent,
    PopupComponent,
    I18nPipe
  ], styles: ['\n[_nghost-%COMP%] {\n  --interactive-motion-duration: 160ms;\n  --interactive-motion-ease: cubic-bezier(0.22, 1, 0.36, 1);\n  --interactive-hover-lift: -1px;\n  --interactive-hover-scale: 1.01;\n  --interactive-hover-brightness: 1.01;\n  --interactive-press-scale: 0.97;\n  --interactive-press-brightness: 0.97;\n}\n[_ngcontent-%COMP%]:where(button, a[href], [role=button], .link-btn, .popup-view-fab, .popup-header-add-btn, .activities-view-option, .profile-status-select-wrap, .profile-details-values-btn, .profile-details-privacy-btn, .profile-privacy-menu-option, .popup-close, .date-picker-btn, .avatar-edit-btn, .experience-form-close-btn, .image-editor-grid button, .image-stack-line, .image-stack-hit-segment, .mobile-profile-selector-close-btn, .mobile-profile-selector-option, .popup-panel-profile-selector .profile-filter-selector-clear, .popup-panel-profile-selector .profile-filter-selector-chip, .popup-panel-profile-selector .profile-selector-chip, .item-action-menu-btn, .experience-action-btn, .header-icon-btn, .chat-header-members, .activities-row-item-clickable, .activities-card-btn, .asset-source-icon, .event-editor-members-trigger, .motion-card, [data-motion=card]):not(.motion-static):not([data-motion=none]) {\n  -webkit-tap-highlight-color: transparent;\n  transition:\n    transform var(--interactive-motion-duration) var(--interactive-motion-ease),\n    filter var(--interactive-motion-duration) var(--interactive-motion-ease),\n    box-shadow var(--interactive-motion-duration) var(--interactive-motion-ease),\n    background-color var(--interactive-motion-duration) var(--interactive-motion-ease),\n    border-color var(--interactive-motion-duration) var(--interactive-motion-ease),\n    color var(--interactive-motion-duration) var(--interactive-motion-ease);\n  transform-origin: center;\n}\n[_ngcontent-%COMP%]:where(button, a[href], [role=button], .link-btn, .popup-view-fab, .popup-header-add-btn, .activities-view-option, .profile-status-select-wrap, .profile-details-values-btn, .profile-details-privacy-btn, .profile-privacy-menu-option, .popup-close, .date-picker-btn, .avatar-edit-btn, .experience-form-close-btn, .image-editor-grid button, .image-stack-line, .image-stack-hit-segment, .mobile-profile-selector-close-btn, .mobile-profile-selector-option, .popup-panel-profile-selector .profile-filter-selector-clear, .popup-panel-profile-selector .profile-filter-selector-chip, .popup-panel-profile-selector .profile-selector-chip, .item-action-menu-btn, .experience-action-btn, .header-icon-btn, .chat-header-members, .activities-row-item-clickable, .activities-card-btn, .asset-source-icon, .event-editor-members-trigger, .motion-card, [data-motion=card]):not(.motion-static):not([data-motion=none]):focus-visible {\n  outline: 2px solid rgba(66, 110, 182, 0.44);\n  outline-offset: 2px;\n}\n@media (hover: hover) and (pointer: fine) {\n  [_ngcontent-%COMP%]:where(button, a[href], [role=button], .link-btn, .popup-view-fab, .popup-header-add-btn, .activities-view-option, .profile-status-select-wrap, .profile-details-values-btn, .profile-details-privacy-btn, .profile-privacy-menu-option, .popup-close, .date-picker-btn, .avatar-edit-btn, .experience-form-close-btn, .image-editor-grid button, .image-stack-line, .image-stack-hit-segment, .mobile-profile-selector-close-btn, .mobile-profile-selector-option, .popup-panel-profile-selector .profile-filter-selector-clear, .popup-panel-profile-selector .profile-filter-selector-chip, .popup-panel-profile-selector .profile-selector-chip, .item-action-menu-btn, .experience-action-btn, .header-icon-btn, .chat-header-members, .activities-row-item-clickable, .activities-card-btn, .asset-source-icon, .event-editor-members-trigger, .motion-card, [data-motion=card]):not(.motion-static):not([data-motion=none]):not(:disabled):not([aria-disabled=true]):hover {\n    transform: translateY(var(--interactive-hover-lift)) scale(var(--interactive-hover-scale));\n    filter: brightness(var(--interactive-hover-brightness));\n  }\n  [_ngcontent-%COMP%]:where(button, a[href], [role=button], .link-btn, .popup-view-fab, .popup-header-add-btn, .activities-view-option, .profile-status-select-wrap, .profile-details-values-btn, .profile-details-privacy-btn, .profile-privacy-menu-option, .popup-close, .date-picker-btn, .avatar-edit-btn, .experience-form-close-btn, .image-editor-grid button, .image-stack-line, .image-stack-hit-segment, .mobile-profile-selector-close-btn, .mobile-profile-selector-option, .popup-panel-profile-selector .profile-filter-selector-clear, .popup-panel-profile-selector .profile-filter-selector-chip, .popup-panel-profile-selector .profile-selector-chip, .item-action-menu-btn, .experience-action-btn, .header-icon-btn, .chat-header-members, .activities-row-item-clickable, .activities-card-btn, .asset-source-icon, .event-editor-members-trigger, .motion-card, [data-motion=card]):not(.motion-static):not([data-motion=none]):not(:disabled):not([aria-disabled=true]):active {\n    transform: scale(var(--interactive-press-scale));\n    filter: brightness(var(--interactive-press-brightness));\n  }\n  [_ngcontent-%COMP%]:where(.motion-card, [data-motion=card]):not(.motion-static):not([data-motion=none]):hover {\n    box-shadow: 0 3px 10px rgba(16, 29, 48, 0.14);\n  }\n}\n@keyframes _ngcontent-%COMP%_shared-mobile-touch-feedback {\n  0% {\n    transform: scale(1);\n    filter: brightness(1);\n  }\n  45% {\n    transform: scale(var(--interactive-press-scale));\n    filter: brightness(var(--interactive-press-brightness));\n  }\n  100% {\n    transform: scale(1);\n    filter: brightness(1);\n  }\n}\n@media (hover: none), (pointer: coarse) {\n  [_ngcontent-%COMP%]:where(button, a[href], [role=button], .link-btn, .popup-view-fab, .popup-header-add-btn, .activities-view-option, .profile-status-select-wrap, .profile-details-values-btn, .profile-details-privacy-btn, .profile-privacy-menu-option, .popup-close, .date-picker-btn, .avatar-edit-btn, .experience-form-close-btn, .image-editor-grid button, .image-stack-line, .image-stack-hit-segment, .mobile-profile-selector-close-btn, .mobile-profile-selector-option, .popup-panel-profile-selector .profile-filter-selector-clear, .popup-panel-profile-selector .profile-filter-selector-chip, .popup-panel-profile-selector .profile-selector-chip, .item-action-menu-btn, .experience-action-btn, .header-icon-btn, .chat-header-members, .activities-row-item-clickable, .activities-card-btn, .asset-source-icon, .event-editor-members-trigger, .motion-card, [data-motion=card]):not(.motion-static):not([data-motion=none]):not(:disabled):not([aria-disabled=true]):active {\n    animation: _ngcontent-%COMP%_shared-mobile-touch-feedback 0.2s ease;\n  }\n}\n.app-popup[_ngcontent-%COMP%], \n.mobile-profile-selector-sheet-wrap[_ngcontent-%COMP%], \n.popup-surface[_ngcontent-%COMP%], \n.experience-form-popup[_ngcontent-%COMP%] {\n  font-family:\n    "Nunito Sans",\n    "Segoe UI",\n    sans-serif;\n}\n.app-popup[_ngcontent-%COMP%]   button[_ngcontent-%COMP%], \n.app-popup[_ngcontent-%COMP%]   input[_ngcontent-%COMP%], \n.app-popup[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%], \n.app-popup[_ngcontent-%COMP%]   select[_ngcontent-%COMP%], \n.app-popup[_ngcontent-%COMP%]   .mat-mdc-select[_ngcontent-%COMP%], \n.app-popup[_ngcontent-%COMP%]   .mat-mdc-select-value-text[_ngcontent-%COMP%], \n.app-popup[_ngcontent-%COMP%]   .mat-mdc-option[_ngcontent-%COMP%], \n.popup-surface[_ngcontent-%COMP%]   button[_ngcontent-%COMP%], \n.popup-surface[_ngcontent-%COMP%]   input[_ngcontent-%COMP%], \n.popup-surface[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%], \n.popup-surface[_ngcontent-%COMP%]   select[_ngcontent-%COMP%], \n.popup-surface[_ngcontent-%COMP%]   .mat-mdc-select[_ngcontent-%COMP%], \n.popup-surface[_ngcontent-%COMP%]   .mat-mdc-select-value-text[_ngcontent-%COMP%], \n.popup-surface[_ngcontent-%COMP%]   .mat-mdc-option[_ngcontent-%COMP%], \n.experience-form-popup[_ngcontent-%COMP%]   button[_ngcontent-%COMP%], \n.experience-form-popup[_ngcontent-%COMP%]   input[_ngcontent-%COMP%], \n.experience-form-popup[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%], \n.experience-form-popup[_ngcontent-%COMP%]   select[_ngcontent-%COMP%], \n.experience-form-popup[_ngcontent-%COMP%]   .mat-mdc-select[_ngcontent-%COMP%], \n.experience-form-popup[_ngcontent-%COMP%]   .mat-mdc-select-value-text[_ngcontent-%COMP%], \n.experience-form-popup[_ngcontent-%COMP%]   .mat-mdc-option[_ngcontent-%COMP%], \n.mobile-profile-selector-sheet-wrap[_ngcontent-%COMP%]   button[_ngcontent-%COMP%], \n.mobile-profile-selector-sheet-wrap[_ngcontent-%COMP%]   input[_ngcontent-%COMP%], \n.mobile-profile-selector-sheet-wrap[_ngcontent-%COMP%]   .mat-mdc-option[_ngcontent-%COMP%] {\n  font-family: inherit;\n}\n.popup-filter-picker[_ngcontent-%COMP%], \n.activities-view-picker[_ngcontent-%COMP%] {\n  position: relative;\n  z-index: 60;\n  margin-left: auto;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.34rem;\n}\n.popup-filter-picker-secondary[_ngcontent-%COMP%], \n.activities-secondary-picker[_ngcontent-%COMP%] {\n  position: relative;\n  z-index: 61;\n}\n.selector-like[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.35rem;\n}\n.profile-status-select-wrap.popup-compact-select[_ngcontent-%COMP%], \n.profile-status-select-wrap.activities-compact-select[_ngcontent-%COMP%], \n.profile-status-select-wrap.assets-compact-select[_ngcontent-%COMP%] {\n  width: fit-content !important;\n  min-width: 0 !important;\n  max-width: 100%;\n}\n.profile-status-select-wrap.popup-compact-select[_ngcontent-%COMP%]   .mat-mdc-select[_ngcontent-%COMP%], \n.profile-status-select-wrap.activities-compact-select[_ngcontent-%COMP%]   .mat-mdc-select[_ngcontent-%COMP%], \n.profile-status-select-wrap.assets-compact-select[_ngcontent-%COMP%]   .mat-mdc-select[_ngcontent-%COMP%] {\n  width: auto;\n  min-width: 0;\n}\n.profile-status-select-wrap.popup-compact-select[_ngcontent-%COMP%]   .mat-mdc-select-trigger[_ngcontent-%COMP%], \n.profile-status-select-wrap.activities-compact-select[_ngcontent-%COMP%]   .mat-mdc-select-trigger[_ngcontent-%COMP%], \n.profile-status-select-wrap.assets-compact-select[_ngcontent-%COMP%]   .mat-mdc-select-trigger[_ngcontent-%COMP%] {\n  width: auto !important;\n  min-width: 0;\n}\n.profile-status-select-wrap.popup-compact-select[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%], \n.profile-status-select-wrap.activities-compact-select[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%], \n.profile-status-select-wrap.assets-compact-select[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%] {\n  width: auto;\n  min-width: 0;\n}\n.profile-status-select-wrap.popup-filter-no-badge[_ngcontent-%COMP%], \n.profile-status-select-wrap.activities-filter-no-badge[_ngcontent-%COMP%] {\n  min-width: 0;\n}\n.profile-status-select-wrap.popup-filter-no-badge[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%], \n.profile-status-select-wrap.activities-filter-no-badge[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%] {\n  width: auto !important;\n  flex: 0 1 auto;\n}\n.profile-status-select-wrap.popup-filter-no-badge[_ngcontent-%COMP%]   .mat-mdc-select[_ngcontent-%COMP%], \n.profile-status-select-wrap.activities-filter-no-badge[_ngcontent-%COMP%]   .mat-mdc-select[_ngcontent-%COMP%] {\n  width: auto;\n  min-width: 0;\n}\n.profile-status-select-wrap.popup-filter-no-badge[_ngcontent-%COMP%]   .mat-mdc-select-trigger[_ngcontent-%COMP%], \n.profile-status-select-wrap.activities-filter-no-badge[_ngcontent-%COMP%]   .mat-mdc-select-trigger[_ngcontent-%COMP%] {\n  width: auto !important;\n}\n.profile-status-select-wrap.popup-filter-no-badge[_ngcontent-%COMP%]   .mat-mdc-select-arrow-wrapper[_ngcontent-%COMP%], \n.profile-status-select-wrap.activities-filter-no-badge[_ngcontent-%COMP%]   .mat-mdc-select-arrow-wrapper[_ngcontent-%COMP%] {\n  margin-left: 0.28rem;\n}\n.profile-status-select-wrap[_ngcontent-%COMP%] {\n  min-width: 174px;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.38rem;\n  border: 1px solid #c8d3e2;\n  border-radius: 999px;\n  box-shadow: 0 2px 6px rgba(38, 60, 92, 0.08);\n  padding: 0.12rem 0.5rem 0.12rem 0.84rem;\n  background: #f8f9fb;\n}\n.profile-status-select-wrap.selector-like[_ngcontent-%COMP%] {\n  min-height: 36px;\n}\n.status-option-content[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: flex-start;\n  gap: 0.2rem;\n  text-transform: lowercase;\n  width: 100%;\n  min-width: 0;\n}\n.status-option-content[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]:last-child {\n  white-space: nowrap;\n}\n.status-option-content[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n  line-height: 16px;\n  flex: 0 0 16px;\n}\n.rate-filter-count-badge[_ngcontent-%COMP%] {\n  margin-left: auto;\n  width: 20px;\n  height: 20px;\n  border-radius: 50%;\n  border: 1px solid #fff;\n  background: #d84d4d;\n  color: #fff;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  padding: 0;\n  font-size: 0.68rem;\n  font-weight: 800;\n  line-height: 1;\n  box-shadow: 0 2px 8px rgba(120, 24, 24, 0.22);\n}\n.rate-filter-trigger-badge[_ngcontent-%COMP%] {\n  position: absolute;\n  top: -8px;\n  right: -8px;\n  margin-left: 0;\n  z-index: 2;\n}\n.popup-filter-control[_ngcontent-%COMP%], \n.activities-rate-filter-select[_ngcontent-%COMP%], \n.activities-primary-filter-select[_ngcontent-%COMP%], \n.activities-event-scope-filter-select[_ngcontent-%COMP%], \n.activities-chat-context-filter-select[_ngcontent-%COMP%] {\n  position: relative;\n  overflow: visible;\n}\n.popup-filter-panel[_ngcontent-%COMP%], \n.activities-view-picker-panel[_ngcontent-%COMP%] {\n  position: absolute;\n  top: calc(100% + 0.32rem);\n  right: 0;\n  border: 1px solid rgba(39, 62, 94, 0.22);\n  border-radius: 10px;\n  background: #fff;\n  box-shadow: 0 10px 24px rgba(17, 29, 48, 0.22);\n  padding: 0.24rem;\n  min-width: 128px;\n  z-index: 40;\n  display: grid;\n  gap: 0.16rem;\n}\n.popup-filter-option[_ngcontent-%COMP%], \n.activities-view-option[_ngcontent-%COMP%] {\n  border: 0;\n  background: #fff;\n  border-radius: 8px;\n  min-height: 32px;\n  padding: 0.34rem 0.44rem;\n  display: inline-flex;\n  align-items: center;\n  justify-content: flex-start;\n  gap: 0.34rem;\n  color: #1e3658;\n  cursor: pointer;\n  text-align: left;\n}\n.popup-filter-option[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%], \n.activities-view-option[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n}\n.popup-filter-option[_ngcontent-%COMP%]   span[_ngcontent-%COMP%], \n.activities-view-option[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  font-size: 0.78rem;\n  font-weight: 700;\n}\n.popup-filter-option[_ngcontent-%COMP%]    > span[_ngcontent-%COMP%]:not(.rate-filter-count-badge), \n.activities-view-option[_ngcontent-%COMP%]    > span[_ngcontent-%COMP%]:not(.rate-filter-count-badge) {\n  flex: 1 1 auto;\n  min-width: 0;\n  text-align: left;\n}\n.popup-mobile-filter-picker[_ngcontent-%COMP%], \n.activities-mobile-primary-filter-picker[_ngcontent-%COMP%], \n.activities-mobile-event-scope-filter-picker[_ngcontent-%COMP%], \n.activities-mobile-chat-context-filter-picker[_ngcontent-%COMP%], \n.activities-mobile-rate-filter-picker[_ngcontent-%COMP%] {\n  position: relative;\n}\n.popup-mobile-filter-panel[_ngcontent-%COMP%], \n.activities-mobile-filter-panel[_ngcontent-%COMP%], \n.activities-mobile-rate-filter-panel[_ngcontent-%COMP%] {\n  top: calc(100% + 0.24rem);\n  right: 0;\n  min-width: 210px;\n  z-index: 65;\n}\n.popup-mobile-sheet-title[_ngcontent-%COMP%], \n.activities-mobile-sheet-title[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.28rem;\n  padding: 0 0.14rem;\n  color: #1c3354;\n  font-size: 0.94rem;\n  font-weight: 800;\n}\n.popup-mobile-sheet-title[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%], \n.activities-mobile-sheet-title[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 17px;\n  height: 17px;\n  font-size: 17px;\n  line-height: 17px;\n}\n:is(.popup-filter-bar[_ngcontent-%COMP%], .experience-toolbar[_ngcontent-%COMP%], .assets-toolbar[_ngcontent-%COMP%])   .popup-view-fab[_ngcontent-%COMP%]   span[_ngcontent-%COMP%], \n[_ngcontent-%COMP%]:is(.popup-filter-bar, .experience-toolbar, .assets-toolbar)   .profile-status-select-wrap[_ngcontent-%COMP%]   .mat-mdc-select[_ngcontent-%COMP%], \n[_ngcontent-%COMP%]:is(.popup-filter-bar, .experience-toolbar, .assets-toolbar)   .profile-status-select-wrap[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]:last-child, \n[_ngcontent-%COMP%]:is(.popup-filter-bar, .experience-toolbar, .assets-toolbar)   .profile-status-select-wrap[_ngcontent-%COMP%]   .mat-mdc-select-value-text[_ngcontent-%COMP%] {\n  font-weight: 400 !important;\n}\n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.status-option .status-option-content {\n  display: grid;\n  grid-template-columns: auto minmax(0, 1fr) auto;\n  align-items: center;\n  width: 100%;\n  min-width: 0;\n  column-gap: 0.34rem;\n}\n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.status-option .rate-filter-count-badge {\n  margin-left: 0;\n  justify-self: end;\n}\n[_nghost-%COMP%]     .cdk-overlay-pane:has(.mat-mdc-select-panel.selector-options-panel), \n[_nghost-%COMP%]     .cdk-overlay-pane:has(.mat-mdc-select-panel.status-options-panel) {\n  min-width: var(--app-selector-panel-min-width, 184px) !important;\n}\n[_nghost-%COMP%]     .mat-mdc-select-panel.selector-options-panel, \n[_nghost-%COMP%]     .mat-mdc-select-panel.status-options-panel {\n  min-width: var(--app-selector-panel-min-width, 184px) !important;\n}\n@media (max-width: 760px) {\n  .popup-mobile-filter-panel[_ngcontent-%COMP%]   .popup-filter-option[_ngcontent-%COMP%], \n   .popup-mobile-filter-panel[_ngcontent-%COMP%]   .activities-view-option[_ngcontent-%COMP%], \n   .activities-mobile-filter-panel[_ngcontent-%COMP%]   .popup-filter-option[_ngcontent-%COMP%], \n   .activities-mobile-filter-panel[_ngcontent-%COMP%]   .activities-view-option[_ngcontent-%COMP%], \n   .activities-mobile-rate-filter-panel[_ngcontent-%COMP%]   .popup-filter-option[_ngcontent-%COMP%], \n   .activities-mobile-rate-filter-panel[_ngcontent-%COMP%]   .activities-view-option[_ngcontent-%COMP%] {\n    width: 100%;\n    min-width: 0;\n    box-sizing: border-box;\n    border: 1px solid rgba(58, 81, 114, 0.24);\n    border-radius: 12px;\n    background: #f7f9fd;\n    min-height: 42px;\n    padding: 0.46rem 0.62rem;\n    justify-content: flex-start;\n    gap: 0.36rem;\n  }\n  .popup-mobile-filter-panel[_ngcontent-%COMP%]   .popup-filter-option.active[_ngcontent-%COMP%], \n   .popup-mobile-filter-panel[_ngcontent-%COMP%]   .activities-view-option.active[_ngcontent-%COMP%], \n   .activities-mobile-filter-panel[_ngcontent-%COMP%]   .popup-filter-option.active[_ngcontent-%COMP%], \n   .activities-mobile-filter-panel[_ngcontent-%COMP%]   .activities-view-option.active[_ngcontent-%COMP%], \n   .activities-mobile-rate-filter-panel[_ngcontent-%COMP%]   .popup-filter-option.active[_ngcontent-%COMP%], \n   .activities-mobile-rate-filter-panel[_ngcontent-%COMP%]   .activities-view-option.active[_ngcontent-%COMP%] {\n    box-shadow: inset 0 0 0 1px rgba(24, 46, 76, 0.24);\n    filter: brightness(0.95);\n  }\n  .popup-mobile-filter-panel[_ngcontent-%COMP%]   .popup-filter-option[_ngcontent-%COMP%]   .rate-filter-count-badge[_ngcontent-%COMP%], \n   .popup-mobile-filter-panel[_ngcontent-%COMP%]   .activities-view-option[_ngcontent-%COMP%]   .rate-filter-count-badge[_ngcontent-%COMP%], \n   .activities-mobile-filter-panel[_ngcontent-%COMP%]   .popup-filter-option[_ngcontent-%COMP%]   .rate-filter-count-badge[_ngcontent-%COMP%], \n   .activities-mobile-filter-panel[_ngcontent-%COMP%]   .activities-view-option[_ngcontent-%COMP%]   .rate-filter-count-badge[_ngcontent-%COMP%], \n   .activities-mobile-rate-filter-panel[_ngcontent-%COMP%]   .popup-filter-option[_ngcontent-%COMP%]   .rate-filter-count-badge[_ngcontent-%COMP%], \n   .activities-mobile-rate-filter-panel[_ngcontent-%COMP%]   .activities-view-option[_ngcontent-%COMP%]   .rate-filter-count-badge[_ngcontent-%COMP%] {\n    margin-left: auto;\n    flex: 0 0 auto;\n  }\n  [_nghost-%COMP%]     .cdk-overlay-pane:has(.mat-mdc-select-panel.profile-bottom-sheet-panel) {\n    position: fixed !important;\n    left: 0 !important;\n    right: 0 !important;\n    bottom: 0 !important;\n    top: auto !important;\n    width: 100vw !important;\n    max-width: 100vw !important;\n    transform: none !important;\n  }\n  [_nghost-%COMP%]     .mat-mdc-select-panel.profile-bottom-sheet-panel {\n    width: 100vw !important;\n    max-width: 100vw !important;\n    max-height: min(54vh, 420px) !important;\n    margin: 0 !important;\n    border-radius: 16px 16px 0 0 !important;\n    border: 1px solid #d6deea;\n    border-bottom: 0;\n    box-shadow: 0 -14px 28px rgba(15, 29, 52, 0.24);\n    padding-top: 0.38rem;\n    padding-bottom: max(0.55rem, env(safe-area-inset-bottom));\n  }\n}\n.popup-view-fab[_ngcontent-%COMP%] {\n  height: 34px;\n  border: 1px solid rgba(39, 62, 94, 0.22);\n  border-radius: 999px;\n  background: #f3f7ff;\n  color: #2c4c74;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.25rem;\n  padding: 0 0.62rem;\n  cursor: pointer;\n}\n.popup-view-fab[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n}\n.popup-view-fab[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  font-size: 0.74rem;\n  font-weight: 700;\n  white-space: nowrap;\n}\n.event-visibility-picker[_ngcontent-%COMP%] {\n  position: relative;\n  z-index: 22;\n  margin-left: auto;\n  flex: 0 0 auto;\n}\n.event-visibility-trigger[_ngcontent-%COMP%] {\n  flex-wrap: nowrap;\n}\n.profile-status-header-picker[_ngcontent-%COMP%]   .event-visibility-trigger.status-public[_ngcontent-%COMP%], \n.profile-status-header-picker[_ngcontent-%COMP%]   .activities-view-option.status-public[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #e6f6ef);\n}\n.profile-status-header-picker[_ngcontent-%COMP%]   .event-visibility-trigger.status-friends[_ngcontent-%COMP%], \n.profile-status-header-picker[_ngcontent-%COMP%]   .activities-view-option.status-friends[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #e8f1fd);\n}\n.profile-status-header-picker[_ngcontent-%COMP%]   .event-visibility-trigger.status-host[_ngcontent-%COMP%], \n.profile-status-header-picker[_ngcontent-%COMP%]   .activities-view-option.status-host[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #f6efe2);\n}\n.profile-status-header-picker[_ngcontent-%COMP%]   .event-visibility-trigger.status-inactive[_ngcontent-%COMP%], \n.profile-status-header-picker[_ngcontent-%COMP%]   .activities-view-option.status-inactive[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #f2f3f5);\n}\n.profile-status-header-picker[_ngcontent-%COMP%]   .event-visibility-trigger[_ngcontent-%COMP%]   .mat-icon.status-public[_ngcontent-%COMP%], \n.profile-status-header-picker[_ngcontent-%COMP%]   .activities-view-option.status-public[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #2f8f66;\n}\n.profile-status-header-picker[_ngcontent-%COMP%]   .event-visibility-trigger[_ngcontent-%COMP%]   .mat-icon.status-friends[_ngcontent-%COMP%], \n.profile-status-header-picker[_ngcontent-%COMP%]   .activities-view-option.status-friends[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #1b57a1;\n}\n.profile-status-header-picker[_ngcontent-%COMP%]   .event-visibility-trigger[_ngcontent-%COMP%]   .mat-icon.status-host[_ngcontent-%COMP%], \n.profile-status-header-picker[_ngcontent-%COMP%]   .activities-view-option.status-host[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #87580f;\n}\n.profile-status-header-picker[_ngcontent-%COMP%]   .event-visibility-trigger[_ngcontent-%COMP%]   .mat-icon.status-inactive[_ngcontent-%COMP%], \n.profile-status-header-picker[_ngcontent-%COMP%]   .activities-view-option.status-inactive[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #5b6573;\n}\n.app-popup[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%], \n.app-popup[_ngcontent-%COMP%]   input[_ngcontent-%COMP%], \n.app-popup[_ngcontent-%COMP%]   select[_ngcontent-%COMP%], \n.popup-surface[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%], \n.popup-surface[_ngcontent-%COMP%]   input[_ngcontent-%COMP%], \n.popup-surface[_ngcontent-%COMP%]   select[_ngcontent-%COMP%], \n.experience-form-popup[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%], \n.experience-form-popup[_ngcontent-%COMP%]   input[_ngcontent-%COMP%], \n.experience-form-popup[_ngcontent-%COMP%]   select[_ngcontent-%COMP%], \n.mobile-profile-selector-sheet-wrap[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  width: 100%;\n  border: 1px solid rgba(15, 27, 47, 0.16);\n  border-radius: 10px;\n  padding: 0.48rem 0.56rem;\n  font: inherit;\n  color: var(--text-main);\n  background: #fff;\n}\n.app-popup[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%], \n.popup-surface[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%], \n.experience-form-popup[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%] {\n  resize: vertical;\n}\n.app-popup[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%]:focus, \n.app-popup[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]:focus, \n.app-popup[_ngcontent-%COMP%]   select[_ngcontent-%COMP%]:focus, \n.popup-surface[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%]:focus, \n.popup-surface[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]:focus, \n.popup-surface[_ngcontent-%COMP%]   select[_ngcontent-%COMP%]:focus, \n.experience-form-popup[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%]:focus, \n.experience-form-popup[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]:focus, \n.experience-form-popup[_ngcontent-%COMP%]   select[_ngcontent-%COMP%]:focus, \n.mobile-profile-selector-sheet-wrap[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]:focus {\n  outline: 0;\n  border-color: rgba(52, 103, 182, 0.72);\n  box-shadow: 0 0 0 3px rgba(55, 116, 212, 0.14);\n}\n.popup-surface-form-grid[_ngcontent-%COMP%], \n.experience-form-grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n  max-width: none;\n  width: 100%;\n  margin: 0;\n  justify-content: stretch;\n  align-content: start;\n  align-items: start;\n  column-gap: 1rem;\n  row-gap: 0.9rem;\n}\n.popup-surface-form-grid[_ngcontent-%COMP%]   label[_ngcontent-%COMP%], \n.experience-form-grid[_ngcontent-%COMP%]   label[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-rows: min-content;\n  gap: 0;\n  font-weight: 600;\n  color: rgba(26, 44, 69, 0.88);\n}\n.popup-surface-form-grid[_ngcontent-%COMP%]   input[_ngcontent-%COMP%], \n.experience-form-grid[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  min-height: 40px;\n  padding: 0.56rem 0.72rem;\n  font-size: 0.88rem;\n  line-height: 1.25;\n  box-sizing: border-box;\n}\n.popup-surface-form-grid[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%], \n.experience-form-grid[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%] {\n  min-height: 96px;\n  padding: 0.56rem 0.72rem;\n  font-size: 0.88rem;\n  line-height: 1.25;\n  box-sizing: border-box;\n}\n.popup-surface-form-grid[_ngcontent-%COMP%]   .profile-status-select-wrap.selector-like[_ngcontent-%COMP%], \n.experience-form-grid[_ngcontent-%COMP%]   .profile-status-select-wrap.selector-like[_ngcontent-%COMP%] {\n  min-height: 40px;\n  height: 40px;\n  box-sizing: border-box;\n}\n.popup-surface-form-grid[_ngcontent-%COMP%]   .mat-mdc-select-trigger[_ngcontent-%COMP%], \n.experience-form-grid[_ngcontent-%COMP%]   .mat-mdc-select-trigger[_ngcontent-%COMP%] {\n  min-height: 32px;\n}\n.popup-surface-description-field[_ngcontent-%COMP%], \n.experience-description-field[_ngcontent-%COMP%] {\n  grid-column: 1/-1;\n}\n.popup-surface-actions[_ngcontent-%COMP%], \n.experience-form-actions[_ngcontent-%COMP%] {\n  justify-content: center;\n  padding-top: 0.2rem;\n}\n.popup-actions[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 0.45rem;\n  flex-wrap: wrap;\n}\n.link-btn[_ngcontent-%COMP%] {\n  border: 1px solid var(--line-strong);\n  border-radius: 999px;\n  background: #fff;\n  color: #1f3350;\n  font: inherit;\n  font-size: 0.83rem;\n  padding: 0.38rem 0.76rem;\n  cursor: pointer;\n}\n.neutral-btn[_ngcontent-%COMP%] {\n  background: #f2f4fa;\n  border-color: rgba(23, 33, 54, 0.12);\n}\n.primary-btn[_ngcontent-%COMP%] {\n  background: #4776b7;\n  border-color: #4776b7;\n  color: #fff;\n}\n.profile-status-select-wrap[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%], \n.date-picker-btn[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n  line-height: 16px;\n  color: #566b86;\n}\n.profile-status-select-wrap[_ngcontent-%COMP%]   .mat-mdc-select[_ngcontent-%COMP%] {\n  min-width: 80px;\n  width: 100%;\n  font-size: 0.8rem;\n  font-weight: 700;\n  text-transform: lowercase;\n}\n.profile-status-select-wrap[_ngcontent-%COMP%]   .mat-mdc-select-trigger[_ngcontent-%COMP%] {\n  width: 100%;\n  justify-content: flex-start;\n}\n.profile-status-select-wrap[_ngcontent-%COMP%]   .mat-mdc-select-arrow-wrapper[_ngcontent-%COMP%] {\n  margin-left: auto;\n}\n.status-public[_ngcontent-%COMP%] {\n  color: #2f8f66;\n}\n.status-friends[_ngcontent-%COMP%] {\n  color: #1b57a1;\n}\n.status-host[_ngcontent-%COMP%] {\n  color: #87580f;\n}\n.status-inactive[_ngcontent-%COMP%] {\n  color: #5b6573;\n}\n.status-option-content[_ngcontent-%COMP%]   .status-public[_ngcontent-%COMP%] {\n  color: #2f8f66;\n}\n.status-option-content[_ngcontent-%COMP%]   .status-friends[_ngcontent-%COMP%] {\n  color: #1b57a1;\n}\n.status-option-content[_ngcontent-%COMP%]   .status-host[_ngcontent-%COMP%] {\n  color: #87580f;\n}\n.status-option-content[_ngcontent-%COMP%]   .status-inactive[_ngcontent-%COMP%] {\n  color: #5b6573;\n}\n.profile-status-select-wrap.status-public[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #2f8f66;\n}\n.profile-status-select-wrap.status-friends[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #1b57a1;\n}\n.profile-status-select-wrap.status-host[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #87580f;\n}\n.profile-status-select-wrap.status-inactive[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #5b6573;\n}\n.profile-details-values-btn[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n  line-height: 16px;\n  color: rgba(44, 67, 100, 0.72);\n}\n.profile-details-values-btn[_ngcontent-%COMP%] {\n  min-height: 36px;\n  height: 36px;\n  box-sizing: border-box;\n  padding-top: 0;\n  padding-bottom: 0;\n}\n.profile-details-values-btn[_ngcontent-%COMP%]   .status-option-content.profile-details-selected-badges[_ngcontent-%COMP%] {\n  display: inline-grid;\n  grid-template-columns: minmax(0, 1fr) auto;\n  align-items: center;\n  column-gap: 0.26rem;\n  min-width: 0;\n  width: 100%;\n}\n.profile-details-values-btn.profile-details-values-tone-values[_ngcontent-%COMP%]   .profile-details-inline-chip[_ngcontent-%COMP%] {\n  max-width: calc(100% - 2.6rem);\n}\n.profile-details-values-btn.profile-details-values-tone-interest[_ngcontent-%COMP%]   .profile-details-inline-chip[_ngcontent-%COMP%] {\n  max-width: calc((100% - 3.2rem) / 2);\n}\n.profile-details-values-btn.profile-details-values-tone-values[_ngcontent-%COMP%]   .profile-details-inline-overflow[_ngcontent-%COMP%] {\n  color: #1e6b5a;\n}\n.profile-details-values-btn.profile-details-values-tone-interest[_ngcontent-%COMP%]   .profile-details-inline-overflow[_ngcontent-%COMP%] {\n  color: #2e5a90;\n}\n.values-header-chips[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  flex-wrap: wrap;\n  gap: 0.28rem;\n  flex: 0 0 100%;\n  margin-left: 0;\n  margin-top: 0.34rem;\n  max-width: 100%;\n  overflow: visible;\n  white-space: normal;\n  padding-bottom: 0;\n}\n.popup-title-values[_ngcontent-%COMP%] {\n  margin-right: 0.38rem;\n}\n.values-selected-chip[_ngcontent-%COMP%] {\n  border: 1px solid rgba(76, 99, 136, 0.3);\n  background:\n    linear-gradient(\n      180deg,\n      #f7f9ff 0%,\n      #eef3ff 100%);\n  color: #24416a;\n  border-radius: 999px;\n  min-height: 26px;\n  padding: 0.18rem 0.46rem;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.26rem;\n  font-size: 0.7rem;\n  font-weight: 700;\n  cursor: pointer;\n  flex: 0 0 auto;\n}\n.values-selected-chip[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 12px;\n  height: 12px;\n  font-size: 12px;\n  line-height: 12px;\n}\n.values-selected-chip.section-family[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #fff1ea 0%,\n      #ffe6dd 100%);\n  border-color: rgba(160, 90, 51, 0.32);\n  color: #8b4d2b;\n}\n.values-selected-chip.section-ambition[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #fff7e8 0%,\n      #ffefd7 100%);\n  border-color: rgba(160, 106, 20, 0.32);\n  color: #9a6614;\n}\n.values-selected-chip.section-lifestyle[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #eaf8f5 0%,\n      #e0f2ee 100%);\n  border-color: rgba(45, 125, 120, 0.32);\n  color: #2a6e6a;\n}\n.values-selected-chip.section-beliefs[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f0ecff 0%,\n      #e8e1fa 100%);\n  border-color: rgba(95, 78, 160, 0.32);\n  color: #564793;\n}\n.values-selected-chip.section-social[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #ecf4ff 0%,\n      #e1ecfb 100%);\n  border-color: rgba(45, 94, 168, 0.32);\n  color: #2d5ea8;\n}\n.values-selected-chip.section-arts[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f2edfb 0%,\n      #e9e2f9 100%);\n  border-color: rgba(103, 76, 164, 0.32);\n  color: #654ca1;\n}\n.values-selected-chip.section-food[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #fff4e8 0%,\n      #fee9d6 100%);\n  border-color: rgba(170, 97, 28, 0.32);\n  color: #9d611c;\n}\n.values-selected-chip.section-active[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #edf8ee 0%,\n      #e2f1e4 100%);\n  border-color: rgba(44, 126, 72, 0.32);\n  color: #2d7d47;\n}\n.values-selected-chip.section-mind[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #eaf8f6 0%,\n      #def1ee 100%);\n  border-color: rgba(37, 124, 118, 0.32);\n  color: #2d7d78;\n}\n.values-selected-chip.section-identity[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f4f0ff 0%,\n      #e9e3fb 100%);\n  border-color: rgba(88, 78, 159, 0.32);\n  color: #5a4ea0;\n}\n.readonly-select[_ngcontent-%COMP%] {\n  width: fit-content;\n  min-width: 0;\n  max-width: 130px;\n  justify-content: center;\n  margin-top: 2px;\n  padding-left: 0.44rem;\n  padding-right: 0.44rem;\n}\n.readonly-field[_ngcontent-%COMP%] {\n  min-height: 34px;\n  border: 1px solid rgba(15, 27, 47, 0.16);\n  border-radius: 10px;\n  padding: 0.4rem 0.56rem;\n  background: #f7fafe;\n  color: #23476f;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.26rem;\n  font-weight: 700;\n}\n.readonly-field[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n  line-height: 16px;\n}\n.zodiac-symbol[_ngcontent-%COMP%] {\n  font-size: 1.1rem;\n  font-weight: 800;\n  line-height: 1;\n}\n.zodiac-label[_ngcontent-%COMP%] {\n  font-size: 0.9rem;\n  font-weight: 700;\n  min-width: 0;\n  text-align: center;\n}\n.readonly-select.zodiac-aries[_ngcontent-%COMP%] {\n  background: #fdf1f1;\n  color: #9f2f2f;\n}\n.readonly-select.zodiac-taurus[_ngcontent-%COMP%] {\n  background: #f7f3eb;\n  color: #6e4b2b;\n}\n.readonly-select.zodiac-gemini[_ngcontent-%COMP%] {\n  background: #fdf8e9;\n  color: #7d5a12;\n}\n.readonly-select.zodiac-cancer[_ngcontent-%COMP%] {\n  background: #eef4ff;\n  color: #2d5b8e;\n}\n.readonly-select.zodiac-leo[_ngcontent-%COMP%] {\n  background: #fff3e8;\n  color: #8f4b0d;\n}\n.readonly-select.zodiac-virgo[_ngcontent-%COMP%] {\n  background: #edf8ef;\n  color: #2b6b3d;\n}\n.readonly-select.zodiac-libra[_ngcontent-%COMP%] {\n  background: #f2eefc;\n  color: #60439d;\n}\n.readonly-select.zodiac-scorpio[_ngcontent-%COMP%] {\n  background: #f9edf2;\n  color: #7b3150;\n}\n.readonly-select.zodiac-sagittarius[_ngcontent-%COMP%] {\n  background: #eef1ff;\n  color: #2f4a9a;\n}\n.readonly-select.zodiac-capricorn[_ngcontent-%COMP%] {\n  background: #eff2f5;\n  color: #364653;\n}\n.readonly-select.zodiac-aquarius[_ngcontent-%COMP%] {\n  background: #ebf7fb;\n  color: #1d5f7a;\n}\n.readonly-select.zodiac-pisces[_ngcontent-%COMP%] {\n  background: #eef2ff;\n  color: #294b8f;\n}\n.physique-slim[_ngcontent-%COMP%] {\n  color: #3f7ab3;\n}\n.physique-lean[_ngcontent-%COMP%] {\n  color: #3f8f5f;\n}\n.physique-athletic[_ngcontent-%COMP%] {\n  color: #2f7e4d;\n}\n.physique-fit[_ngcontent-%COMP%] {\n  color: #465fbb;\n}\n.physique-curvy[_ngcontent-%COMP%] {\n  color: #a14875;\n}\n.physique-muscular[_ngcontent-%COMP%] {\n  color: #7d4f24;\n}\n.physique-average[_ngcontent-%COMP%] {\n  color: #4d667f;\n}\n.physique-select-wrap.physique-slim[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #eaf3fb 0%,\n      #dfebf8 100%);\n  border-color: rgba(63, 122, 179, 0.34);\n}\n.physique-select-wrap.physique-lean[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #eaf6ee 0%,\n      #def0e5 100%);\n  border-color: rgba(63, 143, 95, 0.34);\n}\n.physique-select-wrap.physique-athletic[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #e8f5ec 0%,\n      #dff0e6 100%);\n  border-color: rgba(47, 126, 77, 0.34);\n}\n.physique-select-wrap.physique-fit[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #ebf0ff 0%,\n      #e1e8fc 100%);\n  border-color: rgba(70, 95, 187, 0.34);\n}\n.physique-select-wrap.physique-curvy[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f7edf3 0%,\n      #f0e3ec 100%);\n  border-color: rgba(161, 72, 117, 0.36);\n}\n.physique-select-wrap.physique-muscular[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f6efe9 0%,\n      #ede3d8 100%);\n  border-color: rgba(125, 79, 36, 0.36);\n}\n.physique-select-wrap.physique-average[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #eef2f6 0%,\n      #e5ebf1 100%);\n  border-color: rgba(77, 102, 127, 0.34);\n}\n.physique-select-wrap.physique-slim[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #3f7ab3;\n}\n.physique-select-wrap.physique-lean[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #3f8f5f;\n}\n.physique-select-wrap.physique-athletic[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #2f7e4d;\n}\n.physique-select-wrap.physique-fit[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #465fbb;\n}\n.physique-select-wrap.physique-curvy[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #a14875;\n}\n.physique-select-wrap.physique-muscular[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #7d4f24;\n}\n.physique-select-wrap.physique-average[_ngcontent-%COMP%]   .status-option-content[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  color: #4d667f;\n}\n.experience-filter-all[_ngcontent-%COMP%] {\n  color: #694ea6;\n}\n.experience-filter-workspace[_ngcontent-%COMP%] {\n  color: #a1485a;\n}\n.experience-filter-school[_ngcontent-%COMP%] {\n  color: #2d5ea8;\n}\n.experience-filter-online[_ngcontent-%COMP%] {\n  color: #2d7d47;\n}\n.experience-filter-project[_ngcontent-%COMP%] {\n  color: #6550a0;\n}\n.experience-filter-select.experience-filter-all[_ngcontent-%COMP%], \n.experience-type-select.experience-filter-project[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #efe8ff 0%,\n      #e8defc 100%);\n  border-color: rgba(103, 76, 164, 0.32);\n}\n.experience-filter-select.experience-filter-workspace[_ngcontent-%COMP%], \n.experience-type-select.experience-filter-workspace[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #fff1f3 0%,\n      #ffe6ea 100%);\n  border-color: rgba(169, 72, 90, 0.32);\n}\n.experience-filter-select.experience-filter-school[_ngcontent-%COMP%], \n.experience-type-select.experience-filter-school[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #eaf4ff 0%,\n      #e1ecfb 100%);\n  border-color: rgba(45, 94, 168, 0.32);\n}\n.experience-type-select.experience-filter-online[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #edf8ee 0%,\n      #e2f1e4 100%);\n  border-color: rgba(44, 126, 72, 0.32);\n}\n.experience-type-select.experience-filter-project[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f4f0ff 0%,\n      #e9e3fb 100%);\n}\n.experience-type-select[_ngcontent-%COMP%] {\n  min-width: 0;\n  max-width: 100%;\n  min-height: 40px;\n}\n.experience-type-field[_ngcontent-%COMP%], \n.experience-title-field[_ngcontent-%COMP%], \n.experience-city-field[_ngcontent-%COMP%] {\n  width: 100%;\n  justify-self: stretch;\n}\n.experience-org-field[_ngcontent-%COMP%] {\n  width: 100%;\n  justify-self: stretch;\n}\n.experience-type-select[_ngcontent-%COMP%] {\n  width: 100%;\n}\n.experience-date-range-field[_ngcontent-%COMP%] {\n  width: 100%;\n  max-width: none;\n  margin: 0;\n  background: transparent;\n}\n.experience-date-range-label[_ngcontent-%COMP%] {\n  grid-column: 1/2;\n  width: 100%;\n  justify-self: stretch;\n}\n.experience-date-range-field[_ngcontent-%COMP%]   .mat-mdc-text-field-wrapper[_ngcontent-%COMP%] {\n  min-height: 42px;\n  border-radius: 10px;\n  background: #fff;\n  border: 1px solid rgba(136, 156, 186, 0.5);\n  box-shadow: none;\n}\n.experience-date-range-field[_ngcontent-%COMP%]   .mat-mdc-form-field-subscript-wrapper[_ngcontent-%COMP%] {\n  margin-top: 0.24rem;\n}\n.experience-date-range-field[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  border: 0 !important;\n  box-shadow: none !important;\n  border-radius: 0 !important;\n  background: transparent !important;\n  min-width: 0;\n  width: 100%;\n  padding: 0 !important;\n  min-height: 0 !important;\n  height: auto !important;\n  line-height: 1.25;\n}\n.experience-date-range-field[_ngcontent-%COMP%]   .mat-datepicker-toggle[_ngcontent-%COMP%] {\n  margin-right: 0.2rem;\n}\n.experience-date-range-field[_ngcontent-%COMP%]   .mat-mdc-form-field-hint-wrapper[_ngcontent-%COMP%], \n.experience-date-range-field[_ngcontent-%COMP%]   .mat-mdc-form-field-hint[_ngcontent-%COMP%] {\n  color: rgba(30, 49, 74, 0.65);\n  font-size: 0.72rem;\n}\n.experience-date-range-field[_ngcontent-%COMP%]   .mat-date-range-input-container[_ngcontent-%COMP%] {\n  width: 100%;\n  display: grid;\n  grid-template-columns: minmax(96px, 1fr) auto minmax(96px, 1fr);\n  align-items: center;\n  column-gap: 0.34rem;\n  min-width: 0;\n}\n.experience-date-range-field[_ngcontent-%COMP%]   .mat-date-range-input-separator[_ngcontent-%COMP%] {\n  margin: 0 0.28rem;\n  flex: 0 0 auto;\n  white-space: nowrap;\n}\n.experience-date-range-field[_ngcontent-%COMP%]   .mat-date-range-input-start-wrapper[_ngcontent-%COMP%], \n.experience-date-range-field[_ngcontent-%COMP%]   .mat-date-range-input-end-wrapper[_ngcontent-%COMP%] {\n  width: 100%;\n  max-width: 100%;\n  overflow: visible;\n  min-width: 0;\n}\n.experience-date-range-field[_ngcontent-%COMP%]   .mat-date-range-input-inner[_ngcontent-%COMP%] {\n  font-size: 0.96rem;\n  min-width: 0 !important;\n  width: 100% !important;\n  text-overflow: clip;\n  white-space: nowrap;\n  line-height: 1.25;\n}\n.experience-date-range-field[_ngcontent-%COMP%]   .mat-mdc-form-field-flex[_ngcontent-%COMP%] {\n  min-width: 0;\n  border-bottom: 0 !important;\n  box-shadow: none !important;\n  align-items: center !important;\n}\n.experience-date-range-field[_ngcontent-%COMP%]   .mat-mdc-form-field-infix[_ngcontent-%COMP%] {\n  padding-top: 0 !important;\n  padding-bottom: 0 !important;\n  min-height: 34px !important;\n  height: 34px;\n  display: flex;\n  align-items: center;\n}\n.experience-date-range-field[_ngcontent-%COMP%]   .mdc-line-ripple[_ngcontent-%COMP%], \n.experience-date-range-field[_ngcontent-%COMP%]   .mat-mdc-form-field-line-ripple[_ngcontent-%COMP%], \n.experience-date-range-field[_ngcontent-%COMP%]   .mdc-line-ripple--deactivating[_ngcontent-%COMP%], \n.experience-date-range-field[_ngcontent-%COMP%]   .mdc-line-ripple--active[_ngcontent-%COMP%] {\n  display: none !important;\n  opacity: 0 !important;\n  transform: scaleX(0) !important;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.experience-filter-all {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #efe8ff);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.experience-filter-workspace {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #fff1f3);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.experience-filter-school {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #eaf4ff);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.experience-filter-online {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #edf8ee);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.experience-filter-project {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #f4f0ff);\n}\n.mobile-profile-language-chip.language-tone-1[_ngcontent-%COMP%], \n.mobile-profile-selector-option.language-tone-1[_ngcontent-%COMP%], \n[_nghost-%COMP%]     .mat-mdc-option.language-tone-1 {\n  background: #eaf4ff;\n  border-color: rgba(63, 122, 179, 0.34);\n  color: #2f6090;\n}\n.mobile-profile-language-chip.language-tone-2[_ngcontent-%COMP%], \n.mobile-profile-selector-option.language-tone-2[_ngcontent-%COMP%], \n[_nghost-%COMP%]     .mat-mdc-option.language-tone-2 {\n  background: #edf8f4;\n  border-color: rgba(75, 127, 113, 0.34);\n  color: #2f695b;\n}\n.mobile-profile-language-chip.language-tone-3[_ngcontent-%COMP%], \n.mobile-profile-selector-option.language-tone-3[_ngcontent-%COMP%], \n[_nghost-%COMP%]     .mat-mdc-option.language-tone-3 {\n  background: #f1f2ff;\n  border-color: rgba(70, 95, 187, 0.34);\n  color: #394f9c;\n}\n.mobile-profile-language-chip.language-tone-4[_ngcontent-%COMP%], \n.mobile-profile-selector-option.language-tone-4[_ngcontent-%COMP%], \n[_nghost-%COMP%]     .mat-mdc-option.language-tone-4 {\n  background: #fff2f8;\n  border-color: rgba(161, 72, 117, 0.34);\n  color: #8d3f66;\n}\n.mobile-profile-language-chip.language-tone-5[_ngcontent-%COMP%], \n.mobile-profile-selector-option.language-tone-5[_ngcontent-%COMP%], \n[_nghost-%COMP%]     .mat-mdc-option.language-tone-5 {\n  background: #fbf4ea;\n  border-color: rgba(125, 79, 36, 0.34);\n  color: #704822;\n}\n.mobile-profile-language-chip.language-tone-6[_ngcontent-%COMP%], \n.mobile-profile-selector-option.language-tone-6[_ngcontent-%COMP%], \n[_nghost-%COMP%]     .mat-mdc-option.language-tone-6 {\n  background: #eff4f9;\n  border-color: rgba(77, 102, 127, 0.34);\n  color: #415872;\n}\n.mobile-profile-language-chip.language-tone-7[_ngcontent-%COMP%], \n.mobile-profile-selector-option.language-tone-7[_ngcontent-%COMP%], \n[_nghost-%COMP%]     .mat-mdc-option.language-tone-7 {\n  background: #f7f5ea;\n  border-color: rgba(128, 109, 66, 0.34);\n  color: #746237;\n}\n.mobile-profile-language-chip.language-tone-8[_ngcontent-%COMP%], \n.mobile-profile-selector-option.language-tone-8[_ngcontent-%COMP%], \n[_nghost-%COMP%]     .mat-mdc-option.language-tone-8 {\n  background: #edf5ff;\n  border-color: rgba(45, 122, 160, 0.34);\n  color: #2f6782;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-1 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #eaf2ff);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-2 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #ebf7ef);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-3 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #fff1e3);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-4 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #efecfc);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-5 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #f3f8e9);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-6 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #fceef3);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-7 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #edf7ff);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-8 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #f6f2e9);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-1 .status-option-content {\n  color: #2d63a9;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-2 .status-option-content {\n  color: #2a7a49;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-3 .status-option-content {\n  color: #9b6018;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-4 .status-option-content {\n  color: #6153a2;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-5 .status-option-content {\n  color: #61812a;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-6 .status-option-content {\n  color: #9f446d;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-7 .status-option-content {\n  color: #2e7898;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.detail-tone-8 .status-option-content {\n  color: #806c3f;\n}\n.mobile-profile-selector-option.detail-tone-1[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #eef5ff 0%,\n      #e3eefc 100%);\n  border-color: rgba(46, 102, 181, 0.32);\n}\n.mobile-profile-selector-option.detail-tone-2[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #eef9f3 0%,\n      #e3f4ea 100%);\n  border-color: rgba(40, 125, 72, 0.32);\n}\n.mobile-profile-selector-option.detail-tone-3[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #fff4ea 0%,\n      #ffecdd 100%);\n  border-color: rgba(165, 94, 24, 0.32);\n}\n.mobile-profile-selector-option.detail-tone-4[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f2f1ff 0%,\n      #e8e5fb 100%);\n  border-color: rgba(97, 82, 164, 0.32);\n}\n.mobile-profile-selector-option.detail-tone-5[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f6f9ef 0%,\n      #edf3e1 100%);\n  border-color: rgba(95, 128, 36, 0.32);\n}\n.mobile-profile-selector-option.detail-tone-6[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #fff1f4 0%,\n      #f9e6ed 100%);\n  border-color: rgba(160, 70, 111, 0.32);\n}\n.mobile-profile-selector-option.detail-tone-7[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #edf8ff 0%,\n      #e2f0fb 100%);\n  border-color: rgba(45, 122, 160, 0.32);\n}\n.mobile-profile-selector-option.detail-tone-8[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f6f3ea 0%,\n      #eee9dc 100%);\n  border-color: rgba(128, 109, 66, 0.32);\n}\n.mobile-profile-selector-option.status-public[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #e6f6ef 0%,\n      #d9f0e6 100%);\n  border-color: rgba(47, 143, 102, 0.34);\n}\n.mobile-profile-selector-option.status-friends[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #e8f1fd 0%,\n      #dfeaf9 100%);\n  border-color: rgba(27, 87, 161, 0.34);\n}\n.mobile-profile-selector-option.status-host[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f6efe2 0%,\n      #eee4d2 100%);\n  border-color: rgba(135, 88, 15, 0.36);\n}\n.mobile-profile-selector-option.status-inactive[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #f2f3f5 0%,\n      #e8ebef 100%);\n  border-color: rgba(91, 101, 115, 0.32);\n}\n.mobile-profile-selector-option.physique-slim[_ngcontent-%COMP%] {\n  background: #eaf4ff;\n  border-color: rgba(63, 122, 179, 0.34);\n}\n.mobile-profile-selector-option.physique-lean[_ngcontent-%COMP%] {\n  background: #edf8f4;\n  border-color: rgba(75, 127, 113, 0.34);\n}\n.mobile-profile-selector-option.physique-athletic[_ngcontent-%COMP%] {\n  background: #e8f5ec;\n  border-color: rgba(47, 126, 77, 0.34);\n}\n.mobile-profile-selector-option.physique-fit[_ngcontent-%COMP%] {\n  background: #f1f2ff;\n  border-color: rgba(70, 95, 187, 0.34);\n}\n.mobile-profile-selector-option.physique-curvy[_ngcontent-%COMP%] {\n  background: #fff2f8;\n  border-color: rgba(161, 72, 117, 0.34);\n}\n.mobile-profile-selector-option.physique-muscular[_ngcontent-%COMP%] {\n  background: #fbf4ea;\n  border-color: rgba(125, 79, 36, 0.34);\n}\n.mobile-profile-selector-option.physique-average[_ngcontent-%COMP%] {\n  background: #eff4f9;\n  border-color: rgba(77, 102, 127, 0.34);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .values-selector-popup.profile-selector-popup[_ngcontent-%COMP%] {\n  gap: 0.56rem;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-filter-selector-head[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.44rem;\n  padding-bottom: 0.22rem;\n  border-bottom: 1px solid rgba(74, 102, 139, 0.22);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-filter-selector-head-label[_ngcontent-%COMP%] {\n  color: #203c64;\n  font-size: 0.82rem;\n  font-weight: 800;\n  line-height: 1.2;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-filter-selector-clear[_ngcontent-%COMP%] {\n  border: 1px solid rgba(41, 73, 110, 0.24);\n  border-radius: 999px;\n  background: rgba(255, 255, 255, 0.82);\n  color: #284970;\n  font: inherit;\n  font-size: 0.72rem;\n  font-weight: 700;\n  line-height: 1;\n  padding: 0.3rem 0.52rem;\n  cursor: pointer;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-filter-selector-clear.is-hidden[_ngcontent-%COMP%] {\n  visibility: hidden;\n  pointer-events: none;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-filter-selector-selected[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 0.34rem;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-filter-selector-chip[_ngcontent-%COMP%] {\n  border: 1px solid rgba(35, 68, 107, 0.24);\n  border-radius: 999px;\n  background: rgba(255, 255, 255, 0.92);\n  color: #234368;\n  font: inherit;\n  font-size: 0.72rem;\n  font-weight: 700;\n  line-height: 1;\n  padding: 0.26rem 0.48rem;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.16rem;\n  cursor: pointer;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-filter-selector-chip[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 13px;\n  height: 13px;\n  font-size: 13px;\n  line-height: 13px;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-filter-selector-empty[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 0.74rem;\n  color: rgba(31, 54, 86, 0.62);\n  font-style: italic;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.34rem;\n  border: 1px solid transparent;\n  border-radius: 12px;\n  padding: 0.4rem 0.42rem;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-head[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.34rem;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-tag[_ngcontent-%COMP%] {\n  border-radius: 999px;\n  border: 1px solid rgba(52, 86, 128, 0.28);\n  background: rgba(255, 255, 255, 0.74);\n  color: #2f527d;\n  font-size: 0.67rem;\n  font-weight: 800;\n  letter-spacing: 0.02em;\n  line-height: 1;\n  padding: 0.2rem 0.52rem;\n  text-transform: uppercase;\n  white-space: nowrap;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.24rem;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-tag-icon[_ngcontent-%COMP%] {\n  width: 12px;\n  height: 12px;\n  font-size: 12px;\n  line-height: 12px;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-line[_ngcontent-%COMP%] {\n  display: block;\n  width: 100%;\n  height: 1px;\n  background: rgba(84, 111, 147, 0.34);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-chip-grid[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 0.36rem;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-chip[_ngcontent-%COMP%] {\n  border: 1px solid rgba(41, 70, 106, 0.22);\n  border-radius: 999px;\n  background: #f4f8ff;\n  color: #234066;\n  font: inherit;\n  font-size: 0.78rem;\n  font-weight: 700;\n  padding: 0.3rem 0.58rem;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.26rem;\n  cursor: pointer;\n  transition:\n    background-color 0.14s ease,\n    border-color 0.14s ease,\n    color 0.14s ease,\n    box-shadow 0.14s ease;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-chip.active[_ngcontent-%COMP%] {\n  border-color: rgba(27, 85, 158, 0.5);\n  background:\n    linear-gradient(\n      180deg,\n      #dcebff 0%,\n      #cfe3ff 100%);\n  color: #123e70;\n  box-shadow: inset 0 0 0 1px rgba(30, 73, 127, 0.24), 0 1px 2px rgba(24, 53, 86, 0.16);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group.section-family[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 232, 219, 0.52) 0%,\n      rgba(255, 232, 219, 0.3) 100%);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group.section-ambition[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 242, 216, 0.52) 0%,\n      rgba(255, 242, 216, 0.3) 100%);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group.section-lifestyle[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(221, 241, 239, 0.56) 0%,\n      rgba(221, 241, 239, 0.32) 100%);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group.section-beliefs[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(230, 226, 250, 0.56) 0%,\n      rgba(230, 226, 250, 0.32) 100%);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group.section-social[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(223, 236, 255, 0.5) 0%,\n      rgba(223, 236, 255, 0.28) 100%);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group.section-arts[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(235, 227, 255, 0.5) 0%,\n      rgba(235, 227, 255, 0.28) 100%);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group.section-food[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 236, 221, 0.52) 0%,\n      rgba(255, 236, 221, 0.3) 100%);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group.section-active[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(222, 243, 231, 0.56) 0%,\n      rgba(222, 243, 231, 0.32) 100%);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group.section-mind[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(219, 242, 238, 0.56) 0%,\n      rgba(219, 242, 238, 0.32) 100%);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group.section-identity[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(230, 226, 250, 0.56) 0%,\n      rgba(230, 226, 250, 0.32) 100%);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-tag.section-family[_ngcontent-%COMP%] {\n  border-color: rgba(156, 94, 51, 0.34);\n  color: #9c5e33;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-tag.section-ambition[_ngcontent-%COMP%] {\n  border-color: rgba(160, 106, 20, 0.34);\n  color: #9b6717;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-tag.section-lifestyle[_ngcontent-%COMP%] {\n  border-color: rgba(47, 123, 119, 0.34);\n  color: #2f7b77;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-tag.section-beliefs[_ngcontent-%COMP%] {\n  border-color: rgba(95, 78, 160, 0.34);\n  color: #5f4ea0;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-tag.section-social[_ngcontent-%COMP%] {\n  border-color: rgba(47, 106, 175, 0.36);\n  color: #2f6aaf;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-tag.section-arts[_ngcontent-%COMP%] {\n  border-color: rgba(106, 87, 168, 0.36);\n  color: #6a57a8;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-tag.section-food[_ngcontent-%COMP%] {\n  border-color: rgba(170, 97, 28, 0.34);\n  color: #a55e18;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-tag.section-active[_ngcontent-%COMP%] {\n  border-color: rgba(49, 124, 82, 0.36);\n  color: #317c52;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-tag.section-mind[_ngcontent-%COMP%] {\n  border-color: rgba(37, 124, 118, 0.34);\n  color: #2b7c76;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-tag.section-identity[_ngcontent-%COMP%] {\n  border-color: rgba(98, 84, 163, 0.34);\n  color: #6254a3;\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-line.section-family[_ngcontent-%COMP%] {\n  background: rgba(156, 94, 51, 0.3);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-line.section-ambition[_ngcontent-%COMP%] {\n  background: rgba(160, 106, 20, 0.32);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-line.section-lifestyle[_ngcontent-%COMP%] {\n  background: rgba(47, 123, 119, 0.3);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-line.section-beliefs[_ngcontent-%COMP%] {\n  background: rgba(95, 78, 160, 0.3);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-line.section-social[_ngcontent-%COMP%] {\n  background: rgba(47, 106, 175, 0.34);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-line.section-arts[_ngcontent-%COMP%] {\n  background: rgba(106, 87, 168, 0.34);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-line.section-food[_ngcontent-%COMP%] {\n  background: rgba(170, 97, 28, 0.32);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-line.section-active[_ngcontent-%COMP%] {\n  background: rgba(49, 124, 82, 0.34);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-line.section-mind[_ngcontent-%COMP%] {\n  background: rgba(37, 124, 118, 0.34);\n}\n.popup-panel-profile-selector[_ngcontent-%COMP%]   .profile-selector-option-group-line.section-identity[_ngcontent-%COMP%] {\n  background: rgba(98, 84, 163, 0.3);\n}\n[_nghost-%COMP%]     .mat-mdc-option.mdc-list-item--selected:not(.mdc-list-item--disabled):not(.status-option) {\n  background: #f0f5fc;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.mdc-list-item--selected:not(.mdc-list-item--disabled) {\n  filter: brightness(0.95);\n  box-shadow: inset 0 0 0 1px rgba(24, 46, 76, 0.2);\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option {\n  background: #fff;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option:not(:last-child) {\n  border-bottom: 1px solid #e6edf7;\n}\n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.hide-selected-option, \n[_nghost-%COMP%]     .status-options-panel .mat-mdc-option.hide-selected-option {\n  min-height: 0 !important;\n  height: 0 !important;\n  padding-top: 0 !important;\n  padding-bottom: 0 !important;\n  border: 0 !important;\n  margin: 0 !important;\n  opacity: 0 !important;\n  pointer-events: none !important;\n  overflow: hidden !important;\n}\n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option {\n  background: #fff;\n}\n[_nghost-%COMP%]     .mat-mdc-select-panel.selector-options-panel, \n[_nghost-%COMP%]     .mat-mdc-select-panel.status-options-panel {\n  margin-top: 8px !important;\n  margin-bottom: 8px !important;\n}\n[_nghost-%COMP%]     .mat-mdc-select-panel.selector-options-panel.mat-mdc-select-panel-above, \n[_nghost-%COMP%]     .mat-mdc-select-panel.status-options-panel.mat-mdc-select-panel-above, \n[_nghost-%COMP%]     .cdk-overlay-pane .mat-mdc-select-panel.selector-options-panel.mat-mdc-select-panel-above, \n[_nghost-%COMP%]     .cdk-overlay-pane .mat-mdc-select-panel.status-options-panel.mat-mdc-select-panel-above {\n  margin-top: 0 !important;\n  margin-bottom: 18px !important;\n  transform: translateY(-10px) !important;\n}\n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.status-option.status-public, \n[_nghost-%COMP%]     .status-options-panel .mat-mdc-option.status-option.status-public {\n  --mdc-list-list-item-container-color: #def3e9;\n  --mat-mdc-option-selected-container-color: #def3e9;\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #def3e9) !important;\n}\n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.status-option.status-friends, \n[_nghost-%COMP%]     .status-options-panel .mat-mdc-option.status-option.status-friends {\n  --mdc-list-list-item-container-color: #e3eefb;\n  --mat-mdc-option-selected-container-color: #e3eefb;\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #e3eefb) !important;\n}\n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.status-option.status-host, \n[_nghost-%COMP%]     .status-options-panel .mat-mdc-option.status-option.status-host {\n  --mdc-list-list-item-container-color: #f3ead8;\n  --mat-mdc-option-selected-container-color: #f3ead8;\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #f3ead8) !important;\n}\n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.status-option.status-inactive, \n[_nghost-%COMP%]     .status-options-panel .mat-mdc-option.status-option.status-inactive {\n  --mdc-list-list-item-container-color: #eceff3;\n  --mat-mdc-option-selected-container-color: #eceff3;\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #eceff3) !important;\n}\n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.status-option.status-public .status-option-content, \n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.status-option.status-public .status-option-content .mat-icon, \n[_nghost-%COMP%]     .status-options-panel .mat-mdc-option.status-option.status-public .status-option-content, \n[_nghost-%COMP%]     .status-options-panel .mat-mdc-option.status-option.status-public .status-option-content .mat-icon {\n  color: #2f8f66 !important;\n}\n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.status-option.status-friends .status-option-content, \n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.status-option.status-friends .status-option-content .mat-icon, \n[_nghost-%COMP%]     .status-options-panel .mat-mdc-option.status-option.status-friends .status-option-content, \n[_nghost-%COMP%]     .status-options-panel .mat-mdc-option.status-option.status-friends .status-option-content .mat-icon {\n  color: #1b57a1 !important;\n}\n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.status-option.status-host .status-option-content, \n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.status-option.status-host .status-option-content .mat-icon, \n[_nghost-%COMP%]     .status-options-panel .mat-mdc-option.status-option.status-host .status-option-content, \n[_nghost-%COMP%]     .status-options-panel .mat-mdc-option.status-option.status-host .status-option-content .mat-icon {\n  color: #87580f !important;\n}\n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.status-option.status-inactive .status-option-content, \n[_nghost-%COMP%]     .selector-options-panel .mat-mdc-option.status-option.status-inactive .status-option-content .mat-icon, \n[_nghost-%COMP%]     .status-options-panel .mat-mdc-option.status-option.status-inactive .status-option-content, \n[_nghost-%COMP%]     .status-options-panel .mat-mdc-option.status-option.status-inactive .status-option-content .mat-icon {\n  color: #5b6573 !important;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.physique-slim {\n  background: #eaf4ff;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.physique-lean {\n  background: #edf8f4;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.physique-athletic {\n  background: #e8f5ec;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.physique-fit {\n  background: #f1f2ff;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.physique-curvy {\n  background: #fff2f8;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.physique-muscular {\n  background: #fbf4ea;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.physique-average {\n  background: #eff4f9;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.physique-slim .status-option-content {\n  color: #3f7ab3;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.physique-lean .status-option-content {\n  color: #3f8f5f;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.physique-athletic .status-option-content {\n  color: #2f7e4d;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.physique-fit .status-option-content {\n  color: #465fbb;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.physique-curvy .status-option-content {\n  color: #a14875;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.physique-muscular .status-option-content {\n  color: #7d4f24;\n}\n[_nghost-%COMP%]     .mat-mdc-option.status-option.physique-average .status-option-content {\n  color: #4d667f;\n}\n[_nghost-%COMP%]     .mat-mdc-select-panel.physique-options-panel {\n  width: auto !important;\n  max-width: 220px !important;\n  min-width: 0 !important;\n}\n[_nghost-%COMP%]     .physique-options-panel .mat-mdc-option {\n  padding-right: 8px;\n}\n[_nghost-%COMP%]     .physique-options-panel .mat-mdc-option .mat-pseudo-checkbox {\n  margin-left: 4px;\n}\n@media (max-width: 760px) {\n  .experience-form-grid[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n    max-width: none;\n    justify-content: stretch;\n    row-gap: 0.72rem;\n  }\n  .experience-date-range-label[_ngcontent-%COMP%] {\n    grid-column: 1/-1;\n  }\n  .experience-date-range-field[_ngcontent-%COMP%]   .mat-date-range-input-container[_ngcontent-%COMP%] {\n    grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);\n  }\n  .profile-details-privacy-fab[_ngcontent-%COMP%]   .privacy-fab-actions[_ngcontent-%COMP%] {\n    position: fixed;\n    left: 0.5rem;\n    right: 0.5rem;\n    bottom: max(0.5rem, env(safe-area-inset-bottom));\n    top: auto;\n    transform: translateY(12px) scale(0.98);\n    transform-origin: bottom center;\n    justify-content: center;\n    gap: 0.46rem;\n    padding: 0.46rem 0.56rem;\n    border: 1px solid rgba(42, 68, 102, 0.2);\n    border-radius: 14px;\n    background: #fff;\n    box-shadow: 0 -12px 24px rgba(18, 31, 51, 0.22);\n  }\n  .profile-details-privacy-fab.open[_ngcontent-%COMP%]   .privacy-fab-actions[_ngcontent-%COMP%] {\n    transform: translateY(0) scale(1);\n  }\n}\n[_nghost-%COMP%] {\n  display: contents;\n}\n.idea-editor-body[_ngcontent-%COMP%] {\n  height: 100%;\n  min-height: 0;\n  flex: 1 1 auto;\n  display: flex;\n  flex-direction: column;\n  gap: 0.56rem;\n}\n.idea-editor-error[_ngcontent-%COMP%] {\n  border: 1px solid rgba(47, 86, 139, 0.14);\n  border-radius: 12px;\n  background: #fff;\n  color: #2b4567;\n}\n.idea-editor-error[_ngcontent-%COMP%] {\n  min-height: 42px;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.46rem;\n  padding: 0 0.66rem;\n  border-color: rgba(180, 64, 82, 0.22);\n  background: #fff6f7;\n  color: #a63d50;\n  font-size: 0.8rem;\n  font-weight: 900;\n}\n.idea-editor-smart-list[_ngcontent-%COMP%] {\n  flex: 1 1 auto;\n  min-height: 0;\n  display: flex;\n}\n[_nghost-%COMP%]     .idea-editor-smart-list .smart-list__surface, \n[_nghost-%COMP%]     .idea-editor-smart-list .smart-list__stage, \n[_nghost-%COMP%]     .idea-editor-smart-list .smart-list__stage-list-shell {\n  height: 100%;\n  min-height: 0;\n}\n[_nghost-%COMP%]     .idea-editor-smart-list .smart-list {\n  height: 100%;\n  box-sizing: border-box;\n}\n[_nghost-%COMP%]     .idea-editor-smart-list .smart-list__item-shell {\n  min-width: 0;\n}\n[_nghost-%COMP%]     app-info-card.idea-info-card {\n  display: block;\n  height: 100%;\n}\n[_nghost-%COMP%]     app-info-card.idea-info-card .ui-info-card {\n  height: 100%;\n}\n[_nghost-%COMP%]     app-info-card.idea-info-card .ui-info-card__overlay-action--start.ui-info-card__overlay-action--badge, \n[_nghost-%COMP%]     app-info-card.idea-info-card .ui-info-card__overlay-action--end.ui-info-card__overlay-action--badge {\n  height: 28px;\n  padding: 0 0.46rem;\n  gap: 0.18rem;\n  white-space: nowrap;\n  cursor: default;\n  pointer-events: none;\n}\n[_nghost-%COMP%]     app-info-card.idea-info-card .ui-info-card__overlay-action--start.ui-info-card__overlay-action--badge {\n  left: 0.42rem;\n}\n[_nghost-%COMP%]     app-info-card.idea-info-card .ui-info-card__overlay-action--start.ui-info-card__overlay-action--badge:hover, \n[_nghost-%COMP%]     app-info-card.idea-info-card .ui-info-card__overlay-action--start.ui-info-card__overlay-action--badge:active, \n[_nghost-%COMP%]     app-info-card.idea-info-card .ui-info-card__overlay-action--end.ui-info-card__overlay-action--badge:hover, \n[_nghost-%COMP%]     app-info-card.idea-info-card .ui-info-card__overlay-action--end.ui-info-card__overlay-action--badge:active {\n  transform: none;\n  filter: none;\n}\n[_nghost-%COMP%]     app-info-card.idea-info-card .ui-info-card__overlay-action--end.ui-info-card__overlay-action--badge {\n  right: 0.42rem;\n}\n[_nghost-%COMP%]     app-info-card.idea-info-card .ui-info-card__overlay-action--start.ui-info-card__overlay-action--badge .mat-icon, \n[_nghost-%COMP%]     app-info-card.idea-info-card .ui-info-card__overlay-action--end.ui-info-card__overlay-action--badge .mat-icon {\n  width: 15px;\n  height: 15px;\n  font-size: 15px;\n  line-height: 15px;\n}\n.idea-editor-form-panel[_ngcontent-%COMP%] {\n  position: relative;\n  display: flex;\n  flex-direction: column;\n  width: 100%;\n  height: 100%;\n  min-height: 0;\n  box-sizing: border-box;\n  overflow: hidden;\n  color: #173253;\n}\n.idea-editor-viewer-panel[_ngcontent-%COMP%] {\n  width: 100%;\n  height: 100%;\n  min-height: 0;\n  background: transparent;\n  color: #173253;\n  display: flex;\n  flex-direction: column;\n  overflow: hidden;\n  box-sizing: border-box;\n}\n.idea-editor-panel-loading[_ngcontent-%COMP%] {\n  flex: 1 1 auto;\n  min-height: 0;\n  display: grid;\n  place-items: center;\n}\n.idea-editor-panel-loading-card[_ngcontent-%COMP%] {\n  display: grid;\n  justify-items: center;\n  gap: 0.58rem;\n  color: #173a62;\n  font-size: 0.82rem;\n  font-weight: 900;\n}\n.idea-editor-form-loading-overlay[_ngcontent-%COMP%] {\n  position: absolute;\n  inset: 0;\n  z-index: 20;\n  border-radius: 10px;\n  background: rgba(251, 253, 255, 0.9);\n  -webkit-backdrop-filter: blur(2px);\n  backdrop-filter: blur(2px);\n  display: grid;\n  place-items: center;\n}\n.idea-editor-form-content[_ngcontent-%COMP%] {\n  flex: 1 1 auto;\n  min-height: 0;\n  display: grid;\n  align-content: start;\n  grid-auto-rows: max-content;\n  gap: 0.66rem;\n  overflow-y: auto;\n  overflow-x: hidden;\n  padding: 0.66rem;\n}\n.idea-editor-viewer-image[_ngcontent-%COMP%], \n.idea-editor-image-preview[_ngcontent-%COMP%] {\n  border: 1px solid rgba(47, 86, 139, 0.12);\n  border-radius: 12px;\n  background-color: #edf4fb;\n  background-position: center;\n  background-size: cover;\n  background-repeat: no-repeat;\n}\n.idea-editor-viewer-image[_ngcontent-%COMP%] {\n  width: 100%;\n  max-width: 100%;\n  aspect-ratio: 16/7;\n  min-height: 220px;\n  margin: 1rem 0;\n  background-color: #edf3fb;\n  box-sizing: border-box;\n}\n.idea-editor-empty-image[_ngcontent-%COMP%], \n.idea-editor-image-preview.is-empty[_ngcontent-%COMP%] {\n  color: #7b91aa;\n  background:\n    linear-gradient(\n      135deg,\n      rgba(255, 255, 255, 0.72),\n      rgba(228, 238, 247, 0.88)),\n    repeating-linear-gradient(\n      45deg,\n      rgba(47, 86, 139, 0.08) 0 9px,\n      transparent 9px 18px);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.idea-editor-viewer-body[_ngcontent-%COMP%] {\n  flex: 1 1 auto;\n  min-height: 0;\n  min-width: 0;\n  width: 100%;\n  box-sizing: border-box;\n  overflow-y: auto;\n  overflow-x: hidden;\n  padding: 0 clamp(0.84rem, 2vw, 1.35rem) clamp(0.84rem, 2vw, 1.35rem);\n}\n.idea-editor-empty-image[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%], \n.idea-editor-image-preview.is-empty[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  width: 44px;\n  height: 44px;\n  font-size: 44px;\n  line-height: 44px;\n}\n.idea-editor-viewer-excerpt[_ngcontent-%COMP%] {\n  margin: 0;\n  color: #314d70;\n  font-size: 0.92rem;\n  font-weight: 800;\n  line-height: 1.48;\n}\n.idea-editor-fields[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: minmax(0, 1fr);\n  gap: 0.52rem;\n}\n.idea-editor-field[_ngcontent-%COMP%], \n.idea-editor-html-panel[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.34rem;\n}\n.idea-editor-field-wide[_ngcontent-%COMP%] {\n  grid-column: 1/-1;\n}\n.idea-editor-field[_ngcontent-%COMP%]   span[_ngcontent-%COMP%], \n.idea-editor-html-head[_ngcontent-%COMP%] {\n  color: #45617f;\n  font-size: 0.74rem;\n  font-weight: 900;\n}\n.idea-editor-field[_ngcontent-%COMP%]   input[_ngcontent-%COMP%], \n.idea-editor-field[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%], \n.idea-editor-html-textarea[_ngcontent-%COMP%] {\n  width: 100%;\n  min-width: 0;\n  border: 1px solid rgba(47, 86, 139, 0.18);\n  border-radius: 8px;\n  background: #fff;\n  color: #1f385d;\n  font: inherit;\n  font-size: 0.84rem;\n  font-weight: 700;\n  outline: none;\n  box-sizing: border-box;\n}\n.idea-editor-field[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  height: 38px;\n  padding: 0 0.62rem;\n}\n.idea-editor-field[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%], \n.idea-editor-html-textarea[_ngcontent-%COMP%] {\n  resize: vertical;\n  padding: 0.54rem 0.62rem;\n  line-height: 1.45;\n}\n.idea-editor-field[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]:focus, \n.idea-editor-field[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%]:focus, \n.idea-editor-html-textarea[_ngcontent-%COMP%]:focus {\n  border-color: rgba(35, 96, 160, 0.45);\n  box-shadow: 0 0 0 3px rgba(35, 96, 160, 0.1);\n}\n.idea-editor-html-panel[_ngcontent-%COMP%] {\n  border: 1px solid rgba(23, 33, 54, 0.12);\n  border-radius: 12px;\n  background: #fff;\n  padding: 0.6rem;\n}\n.idea-editor-html-head[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.5rem;\n}\n.idea-editor-html-textarea[_ngcontent-%COMP%] {\n  min-height: 300px;\n  font-family:\n    ui-monospace,\n    SFMono-Regular,\n    Menlo,\n    Monaco,\n    Consolas,\n    "Liberation Mono",\n    monospace;\n  font-size: 0.78rem;\n}\n.idea-editor-html-preview[_ngcontent-%COMP%] {\n  border: 1px solid rgba(47, 86, 139, 0.12);\n  border-radius: 10px;\n  background: #fff;\n  color: #243e62;\n  padding: 0.72rem;\n  font-size: 0.88rem;\n  line-height: 1.58;\n  overflow-wrap: anywhere;\n}\n.idea-editor-viewer-html[_ngcontent-%COMP%] {\n  width: 100%;\n  max-width: 100%;\n  min-width: 0;\n  box-sizing: border-box;\n  border: 0;\n  padding: 0;\n  background: transparent;\n  color: rgba(25, 48, 77, 0.92);\n  font-size: 0.96rem;\n  line-height: 1.62;\n  overflow-wrap: anywhere;\n  overflow-x: hidden;\n}\n.idea-editor-html-preview-body[_ngcontent-%COMP%] {\n  width: 100%;\n  max-width: 100%;\n  min-width: 0;\n  box-sizing: border-box;\n  overflow-x: hidden;\n}\n[_nghost-%COMP%]     .idea-editor-html-preview-body :is(img, video, iframe, table) {\n  max-width: 100%;\n  box-sizing: border-box;\n}\n[_nghost-%COMP%]     .idea-editor-html-preview-body :where(p, ul, ol, figure) {\n  margin: 0 0 0.72rem;\n}\n[_nghost-%COMP%]     .idea-editor-html-preview-body :where(h2, h3, h4) {\n  margin: 0.7rem 0 0.38rem;\n  color: #183456;\n  line-height: 1.2;\n}\n[_nghost-%COMP%]     .idea-editor-html-preview-body :where(img) {\n  display: block;\n  width: auto;\n  max-width: 100%;\n  height: auto;\n  border: 1px solid rgba(47, 86, 139, 0.12);\n  border-radius: 10px;\n  background: #edf4fb;\n  margin: 0.38rem 0 0.72rem;\n}\n[_nghost-%COMP%]     .idea-editor-viewer-html .idea-editor-html-preview-body :where(img) {\n  border: 0;\n  border-radius: 0;\n  background: transparent;\n  display: block;\n  width: auto;\n  max-width: 100%;\n  height: auto;\n  margin: 0 auto 0.72rem;\n}\n[_nghost-%COMP%]     .idea-editor-html-preview-body :where(figcaption) {\n  color: #667b95;\n  font-size: 0.78rem;\n  font-weight: 700;\n}\n@media (max-width: 760px) {\n  .idea-editor-fields[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n  .idea-editor-form-content[_ngcontent-%COMP%] {\n    padding: 0.66rem 0.72rem calc(0.72rem + env(safe-area-inset-bottom));\n    scrollbar-gutter: stable;\n  }\n  .idea-editor-viewer-body[_ngcontent-%COMP%] {\n    padding: 0.82rem 0.78rem 0.78rem;\n  }\n  .idea-editor-viewer-image[_ngcontent-%COMP%] {\n    min-height: 220px;\n  }\n}\n/*# sourceMappingURL=admin-idea-editor-popup.component.css.map */'] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AdminIdeaEditorPopupComponent, [{
    type: Component,
    args: [{ selector: "app-admin-idea-editor-popup", standalone: true, imports: [
      CommonModule,
      FormsModule,
      MatIconModule,
      AppMenuOutletComponent,
      SmartListComponent,
      InfoCardComponent,
      ImageCarouselComponent,
      IndicatorComponent,
      I18nPipe,
      PopupComponent
    ], providers: [AppMenuDispatcher], template: `@if (admin.activePopup() === 'idea-editor') {
  <app-popup [model]="ideaEditorPopupModel()">
      <div class="idea-editor-body">
        @if (error) {
          <div class="idea-editor-error">
            <mat-icon>warning</mat-icon>
            <span>{{ error }}</span>
          </div>
        }
        <app-smart-list
          #ideaSmartList
          class="idea-editor-smart-list"
          [config]="ideaSmartListConfig"
          [loadPage]="ideaSmartListLoadPage"
          [filters]="ideaListFilters"
          [itemTemplate]="ideaCardTemplate"
        ></app-smart-list>

        <ng-template #ideaCardTemplate let-card>
          <app-info-card
            class="idea-info-card"
            [class.is-feature-toggle-pending]="isFeatureTogglePending(ideaCardPostId(card))"
            [card]="card"
            [useSharedMenu]="true"
            (menuAction)="onIdeaCardMenuAction(card, $event)"
            (menuRequest)="openIdeaInfoCardMenu(card, $event)"
          ></app-info-card>
        </ng-template>
        <app-menu-outlet
          (itemSelect)="onIdeaDispatchedMenuSelect($event)"
        ></app-menu-outlet>
      </div>
  </app-popup>

  @if (articlePanelLoading && articlePanelLoadingMode === 'viewer') {
    <app-popup class="idea-editor-article-viewer-popup" [model]="articleViewerLoadingPopupModel()" [zIndex]="2500">
      <div class="idea-editor-viewer-panel idea-editor-panel-loading" aria-busy="true">
        <div class="idea-editor-panel-loading-card">
          <app-indicator
            kind="load-ring"
            state="loading"
          ></app-indicator>
          <span>{{ articlePanelLoadingLabel() | i18n }}</span>
        </div>
      </div>
    </app-popup>
  } @else if (selectedViewerPost(); as post) {
    <app-popup class="idea-editor-article-viewer-popup" [model]="articleViewerPopupModel(post)" [zIndex]="2500">
      <article class="idea-editor-viewer-panel">
        <div class="idea-editor-viewer-body">
          <div class="idea-editor-html-preview idea-editor-viewer-html">
            <div class="idea-editor-html-preview-body" data-i18n-ignore [innerHTML]="articlePreviewHtml(post)"></div>
          </div>
        </div>
      </article>
    </app-popup>
  }

  @if (articlePanelLoading && articlePanelLoadingMode === 'editor' && !draft) {
    <app-popup class="idea-editor-article-editor-popup" [model]="articleEditorLoadingPopupModel()" [zIndex]="2400">
      <div class="idea-editor-form-panel idea-editor-panel-loading" aria-busy="true">
        <div class="idea-editor-panel-loading-card">
          <app-indicator
            kind="load-ring"
            state="loading"
          ></app-indicator>
          <span>{{ articlePanelLoadingLabel() | i18n }}</span>
        </div>
      </div>
    </app-popup>
  }

  @if (editing && draft; as editDraft) {
    <app-popup class="idea-editor-article-editor-popup" [model]="articleEditorPopupModel(editDraft)" [zIndex]="2400">
      <form class="idea-editor-form-panel" (ngSubmit)="saveDraft($event)">
        @if (articlePanelLoading && articlePanelLoadingMode === 'editor') {
          <div class="idea-editor-form-loading-overlay" aria-busy="true">
            <div class="idea-editor-panel-loading-card">
              <app-indicator
                kind="load-ring"
                state="loading"
              ></app-indicator>
              <span>{{ articlePanelLoadingLabel() | i18n }}</span>
            </div>
          </div>
        }

        <div class="idea-editor-form-content">
          <div class="idea-editor-fields">
            <label class="idea-editor-field idea-editor-field-title">
              <span>Title</span>
              <input type="text" name="ideaTitle" [(ngModel)]="editDraft.title" required />
            </label>
            <label class="idea-editor-field idea-editor-field-wide">
              <span>Description</span>
              <textarea name="ideaExcerpt" [(ngModel)]="editDraft.excerpt" rows="3" placeholder="Short card description"></textarea>
            </label>
          </div>

          <app-image-carousel
            name="ideaImages"
            [(ngModel)]="editDraft.imageUrls"
            [disabled]="saving"
            slotImageVariant="medium"
            mediaFit="cover"
            [uploadOwnerId]="actorUserId()"
            (imageRemoved)="removeDraftImage($event)"
            ariaLabel="Article image slots"
          ></app-image-carousel>

          <section class="idea-editor-html-panel">
            <div class="idea-editor-html-head">
              <span>Article HTML</span>
            </div>
            <textarea
              class="idea-editor-html-textarea"
              name="ideaContentHtml"
              [(ngModel)]="editDraft.contentHtml"
              spellcheck="false"
              (paste)="formatPastedHtml($event)"
            ></textarea>
          </section>
        </div>
      </form>
    </app-popup>
  }
}
`, styles: ['/* src/app/admin/components/idea-editor-popup/admin-idea-editor-popup.component.scss */\n:host {\n  --interactive-motion-duration: 160ms;\n  --interactive-motion-ease: cubic-bezier(0.22, 1, 0.36, 1);\n  --interactive-hover-lift: -1px;\n  --interactive-hover-scale: 1.01;\n  --interactive-hover-brightness: 1.01;\n  --interactive-press-scale: 0.97;\n  --interactive-press-brightness: 0.97;\n}\n:where(button, a[href], [role=button], .link-btn, .popup-view-fab, .popup-header-add-btn, .activities-view-option, .profile-status-select-wrap, .profile-details-values-btn, .profile-details-privacy-btn, .profile-privacy-menu-option, .popup-close, .date-picker-btn, .avatar-edit-btn, .experience-form-close-btn, .image-editor-grid button, .image-stack-line, .image-stack-hit-segment, .mobile-profile-selector-close-btn, .mobile-profile-selector-option, .popup-panel-profile-selector .profile-filter-selector-clear, .popup-panel-profile-selector .profile-filter-selector-chip, .popup-panel-profile-selector .profile-selector-chip, .item-action-menu-btn, .experience-action-btn, .header-icon-btn, .chat-header-members, .activities-row-item-clickable, .activities-card-btn, .asset-source-icon, .event-editor-members-trigger, .motion-card, [data-motion=card]):not(.motion-static):not([data-motion=none]) {\n  -webkit-tap-highlight-color: transparent;\n  transition:\n    transform var(--interactive-motion-duration) var(--interactive-motion-ease),\n    filter var(--interactive-motion-duration) var(--interactive-motion-ease),\n    box-shadow var(--interactive-motion-duration) var(--interactive-motion-ease),\n    background-color var(--interactive-motion-duration) var(--interactive-motion-ease),\n    border-color var(--interactive-motion-duration) var(--interactive-motion-ease),\n    color var(--interactive-motion-duration) var(--interactive-motion-ease);\n  transform-origin: center;\n}\n:where(button, a[href], [role=button], .link-btn, .popup-view-fab, .popup-header-add-btn, .activities-view-option, .profile-status-select-wrap, .profile-details-values-btn, .profile-details-privacy-btn, .profile-privacy-menu-option, .popup-close, .date-picker-btn, .avatar-edit-btn, .experience-form-close-btn, .image-editor-grid button, .image-stack-line, .image-stack-hit-segment, .mobile-profile-selector-close-btn, .mobile-profile-selector-option, .popup-panel-profile-selector .profile-filter-selector-clear, .popup-panel-profile-selector .profile-filter-selector-chip, .popup-panel-profile-selector .profile-selector-chip, .item-action-menu-btn, .experience-action-btn, .header-icon-btn, .chat-header-members, .activities-row-item-clickable, .activities-card-btn, .asset-source-icon, .event-editor-members-trigger, .motion-card, [data-motion=card]):not(.motion-static):not([data-motion=none]):focus-visible {\n  outline: 2px solid rgba(66, 110, 182, 0.44);\n  outline-offset: 2px;\n}\n@media (hover: hover) and (pointer: fine) {\n  :where(button, a[href], [role=button], .link-btn, .popup-view-fab, .popup-header-add-btn, .activities-view-option, .profile-status-select-wrap, .profile-details-values-btn, .profile-details-privacy-btn, .profile-privacy-menu-option, .popup-close, .date-picker-btn, .avatar-edit-btn, .experience-form-close-btn, .image-editor-grid button, .image-stack-line, .image-stack-hit-segment, .mobile-profile-selector-close-btn, .mobile-profile-selector-option, .popup-panel-profile-selector .profile-filter-selector-clear, .popup-panel-profile-selector .profile-filter-selector-chip, .popup-panel-profile-selector .profile-selector-chip, .item-action-menu-btn, .experience-action-btn, .header-icon-btn, .chat-header-members, .activities-row-item-clickable, .activities-card-btn, .asset-source-icon, .event-editor-members-trigger, .motion-card, [data-motion=card]):not(.motion-static):not([data-motion=none]):not(:disabled):not([aria-disabled=true]):hover {\n    transform: translateY(var(--interactive-hover-lift)) scale(var(--interactive-hover-scale));\n    filter: brightness(var(--interactive-hover-brightness));\n  }\n  :where(button, a[href], [role=button], .link-btn, .popup-view-fab, .popup-header-add-btn, .activities-view-option, .profile-status-select-wrap, .profile-details-values-btn, .profile-details-privacy-btn, .profile-privacy-menu-option, .popup-close, .date-picker-btn, .avatar-edit-btn, .experience-form-close-btn, .image-editor-grid button, .image-stack-line, .image-stack-hit-segment, .mobile-profile-selector-close-btn, .mobile-profile-selector-option, .popup-panel-profile-selector .profile-filter-selector-clear, .popup-panel-profile-selector .profile-filter-selector-chip, .popup-panel-profile-selector .profile-selector-chip, .item-action-menu-btn, .experience-action-btn, .header-icon-btn, .chat-header-members, .activities-row-item-clickable, .activities-card-btn, .asset-source-icon, .event-editor-members-trigger, .motion-card, [data-motion=card]):not(.motion-static):not([data-motion=none]):not(:disabled):not([aria-disabled=true]):active {\n    transform: scale(var(--interactive-press-scale));\n    filter: brightness(var(--interactive-press-brightness));\n  }\n  :where(.motion-card, [data-motion=card]):not(.motion-static):not([data-motion=none]):hover {\n    box-shadow: 0 3px 10px rgba(16, 29, 48, 0.14);\n  }\n}\n@keyframes shared-mobile-touch-feedback {\n  0% {\n    transform: scale(1);\n    filter: brightness(1);\n  }\n  45% {\n    transform: scale(var(--interactive-press-scale));\n    filter: brightness(var(--interactive-press-brightness));\n  }\n  100% {\n    transform: scale(1);\n    filter: brightness(1);\n  }\n}\n@media (hover: none), (pointer: coarse) {\n  :where(button, a[href], [role=button], .link-btn, .popup-view-fab, .popup-header-add-btn, .activities-view-option, .profile-status-select-wrap, .profile-details-values-btn, .profile-details-privacy-btn, .profile-privacy-menu-option, .popup-close, .date-picker-btn, .avatar-edit-btn, .experience-form-close-btn, .image-editor-grid button, .image-stack-line, .image-stack-hit-segment, .mobile-profile-selector-close-btn, .mobile-profile-selector-option, .popup-panel-profile-selector .profile-filter-selector-clear, .popup-panel-profile-selector .profile-filter-selector-chip, .popup-panel-profile-selector .profile-selector-chip, .item-action-menu-btn, .experience-action-btn, .header-icon-btn, .chat-header-members, .activities-row-item-clickable, .activities-card-btn, .asset-source-icon, .event-editor-members-trigger, .motion-card, [data-motion=card]):not(.motion-static):not([data-motion=none]):not(:disabled):not([aria-disabled=true]):active {\n    animation: shared-mobile-touch-feedback 0.2s ease;\n  }\n}\n.app-popup,\n.mobile-profile-selector-sheet-wrap,\n.popup-surface,\n.experience-form-popup {\n  font-family:\n    "Nunito Sans",\n    "Segoe UI",\n    sans-serif;\n}\n.app-popup button,\n.app-popup input,\n.app-popup textarea,\n.app-popup select,\n.app-popup .mat-mdc-select,\n.app-popup .mat-mdc-select-value-text,\n.app-popup .mat-mdc-option,\n.popup-surface button,\n.popup-surface input,\n.popup-surface textarea,\n.popup-surface select,\n.popup-surface .mat-mdc-select,\n.popup-surface .mat-mdc-select-value-text,\n.popup-surface .mat-mdc-option,\n.experience-form-popup button,\n.experience-form-popup input,\n.experience-form-popup textarea,\n.experience-form-popup select,\n.experience-form-popup .mat-mdc-select,\n.experience-form-popup .mat-mdc-select-value-text,\n.experience-form-popup .mat-mdc-option,\n.mobile-profile-selector-sheet-wrap button,\n.mobile-profile-selector-sheet-wrap input,\n.mobile-profile-selector-sheet-wrap .mat-mdc-option {\n  font-family: inherit;\n}\n.popup-filter-picker,\n.activities-view-picker {\n  position: relative;\n  z-index: 60;\n  margin-left: auto;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.34rem;\n}\n.popup-filter-picker-secondary,\n.activities-secondary-picker {\n  position: relative;\n  z-index: 61;\n}\n.selector-like {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.35rem;\n}\n.profile-status-select-wrap.popup-compact-select,\n.profile-status-select-wrap.activities-compact-select,\n.profile-status-select-wrap.assets-compact-select {\n  width: fit-content !important;\n  min-width: 0 !important;\n  max-width: 100%;\n}\n.profile-status-select-wrap.popup-compact-select .mat-mdc-select,\n.profile-status-select-wrap.activities-compact-select .mat-mdc-select,\n.profile-status-select-wrap.assets-compact-select .mat-mdc-select {\n  width: auto;\n  min-width: 0;\n}\n.profile-status-select-wrap.popup-compact-select .mat-mdc-select-trigger,\n.profile-status-select-wrap.activities-compact-select .mat-mdc-select-trigger,\n.profile-status-select-wrap.assets-compact-select .mat-mdc-select-trigger {\n  width: auto !important;\n  min-width: 0;\n}\n.profile-status-select-wrap.popup-compact-select .status-option-content,\n.profile-status-select-wrap.activities-compact-select .status-option-content,\n.profile-status-select-wrap.assets-compact-select .status-option-content {\n  width: auto;\n  min-width: 0;\n}\n.profile-status-select-wrap.popup-filter-no-badge,\n.profile-status-select-wrap.activities-filter-no-badge {\n  min-width: 0;\n}\n.profile-status-select-wrap.popup-filter-no-badge .status-option-content,\n.profile-status-select-wrap.activities-filter-no-badge .status-option-content {\n  width: auto !important;\n  flex: 0 1 auto;\n}\n.profile-status-select-wrap.popup-filter-no-badge .mat-mdc-select,\n.profile-status-select-wrap.activities-filter-no-badge .mat-mdc-select {\n  width: auto;\n  min-width: 0;\n}\n.profile-status-select-wrap.popup-filter-no-badge .mat-mdc-select-trigger,\n.profile-status-select-wrap.activities-filter-no-badge .mat-mdc-select-trigger {\n  width: auto !important;\n}\n.profile-status-select-wrap.popup-filter-no-badge .mat-mdc-select-arrow-wrapper,\n.profile-status-select-wrap.activities-filter-no-badge .mat-mdc-select-arrow-wrapper {\n  margin-left: 0.28rem;\n}\n.profile-status-select-wrap {\n  min-width: 174px;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.38rem;\n  border: 1px solid #c8d3e2;\n  border-radius: 999px;\n  box-shadow: 0 2px 6px rgba(38, 60, 92, 0.08);\n  padding: 0.12rem 0.5rem 0.12rem 0.84rem;\n  background: #f8f9fb;\n}\n.profile-status-select-wrap.selector-like {\n  min-height: 36px;\n}\n.status-option-content {\n  display: flex;\n  align-items: center;\n  justify-content: flex-start;\n  gap: 0.2rem;\n  text-transform: lowercase;\n  width: 100%;\n  min-width: 0;\n}\n.status-option-content span:last-child {\n  white-space: nowrap;\n}\n.status-option-content .mat-icon {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n  line-height: 16px;\n  flex: 0 0 16px;\n}\n.rate-filter-count-badge {\n  margin-left: auto;\n  width: 20px;\n  height: 20px;\n  border-radius: 50%;\n  border: 1px solid #fff;\n  background: #d84d4d;\n  color: #fff;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  padding: 0;\n  font-size: 0.68rem;\n  font-weight: 800;\n  line-height: 1;\n  box-shadow: 0 2px 8px rgba(120, 24, 24, 0.22);\n}\n.rate-filter-trigger-badge {\n  position: absolute;\n  top: -8px;\n  right: -8px;\n  margin-left: 0;\n  z-index: 2;\n}\n.popup-filter-control,\n.activities-rate-filter-select,\n.activities-primary-filter-select,\n.activities-event-scope-filter-select,\n.activities-chat-context-filter-select {\n  position: relative;\n  overflow: visible;\n}\n.popup-filter-panel,\n.activities-view-picker-panel {\n  position: absolute;\n  top: calc(100% + 0.32rem);\n  right: 0;\n  border: 1px solid rgba(39, 62, 94, 0.22);\n  border-radius: 10px;\n  background: #fff;\n  box-shadow: 0 10px 24px rgba(17, 29, 48, 0.22);\n  padding: 0.24rem;\n  min-width: 128px;\n  z-index: 40;\n  display: grid;\n  gap: 0.16rem;\n}\n.popup-filter-option,\n.activities-view-option {\n  border: 0;\n  background: #fff;\n  border-radius: 8px;\n  min-height: 32px;\n  padding: 0.34rem 0.44rem;\n  display: inline-flex;\n  align-items: center;\n  justify-content: flex-start;\n  gap: 0.34rem;\n  color: #1e3658;\n  cursor: pointer;\n  text-align: left;\n}\n.popup-filter-option .mat-icon,\n.activities-view-option .mat-icon {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n}\n.popup-filter-option span,\n.activities-view-option span {\n  font-size: 0.78rem;\n  font-weight: 700;\n}\n.popup-filter-option > span:not(.rate-filter-count-badge),\n.activities-view-option > span:not(.rate-filter-count-badge) {\n  flex: 1 1 auto;\n  min-width: 0;\n  text-align: left;\n}\n.popup-mobile-filter-picker,\n.activities-mobile-primary-filter-picker,\n.activities-mobile-event-scope-filter-picker,\n.activities-mobile-chat-context-filter-picker,\n.activities-mobile-rate-filter-picker {\n  position: relative;\n}\n.popup-mobile-filter-panel,\n.activities-mobile-filter-panel,\n.activities-mobile-rate-filter-panel {\n  top: calc(100% + 0.24rem);\n  right: 0;\n  min-width: 210px;\n  z-index: 65;\n}\n.popup-mobile-sheet-title,\n.activities-mobile-sheet-title {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.28rem;\n  padding: 0 0.14rem;\n  color: #1c3354;\n  font-size: 0.94rem;\n  font-weight: 800;\n}\n.popup-mobile-sheet-title .mat-icon,\n.activities-mobile-sheet-title .mat-icon {\n  width: 17px;\n  height: 17px;\n  font-size: 17px;\n  line-height: 17px;\n}\n:is(.popup-filter-bar, .experience-toolbar, .assets-toolbar) .popup-view-fab span,\n:is(.popup-filter-bar, .experience-toolbar, .assets-toolbar) .profile-status-select-wrap .mat-mdc-select,\n:is(.popup-filter-bar, .experience-toolbar, .assets-toolbar) .profile-status-select-wrap .status-option-content span:last-child,\n:is(.popup-filter-bar, .experience-toolbar, .assets-toolbar) .profile-status-select-wrap .mat-mdc-select-value-text {\n  font-weight: 400 !important;\n}\n:host ::ng-deep .selector-options-panel .mat-mdc-option.status-option .status-option-content {\n  display: grid;\n  grid-template-columns: auto minmax(0, 1fr) auto;\n  align-items: center;\n  width: 100%;\n  min-width: 0;\n  column-gap: 0.34rem;\n}\n:host ::ng-deep .selector-options-panel .mat-mdc-option.status-option .rate-filter-count-badge {\n  margin-left: 0;\n  justify-self: end;\n}\n:host ::ng-deep .cdk-overlay-pane:has(.mat-mdc-select-panel.selector-options-panel),\n:host ::ng-deep .cdk-overlay-pane:has(.mat-mdc-select-panel.status-options-panel) {\n  min-width: var(--app-selector-panel-min-width, 184px) !important;\n}\n:host ::ng-deep .mat-mdc-select-panel.selector-options-panel,\n:host ::ng-deep .mat-mdc-select-panel.status-options-panel {\n  min-width: var(--app-selector-panel-min-width, 184px) !important;\n}\n@media (max-width: 760px) {\n  .popup-mobile-filter-panel .popup-filter-option,\n  .popup-mobile-filter-panel .activities-view-option,\n  .activities-mobile-filter-panel .popup-filter-option,\n  .activities-mobile-filter-panel .activities-view-option,\n  .activities-mobile-rate-filter-panel .popup-filter-option,\n  .activities-mobile-rate-filter-panel .activities-view-option {\n    width: 100%;\n    min-width: 0;\n    box-sizing: border-box;\n    border: 1px solid rgba(58, 81, 114, 0.24);\n    border-radius: 12px;\n    background: #f7f9fd;\n    min-height: 42px;\n    padding: 0.46rem 0.62rem;\n    justify-content: flex-start;\n    gap: 0.36rem;\n  }\n  .popup-mobile-filter-panel .popup-filter-option.active,\n  .popup-mobile-filter-panel .activities-view-option.active,\n  .activities-mobile-filter-panel .popup-filter-option.active,\n  .activities-mobile-filter-panel .activities-view-option.active,\n  .activities-mobile-rate-filter-panel .popup-filter-option.active,\n  .activities-mobile-rate-filter-panel .activities-view-option.active {\n    box-shadow: inset 0 0 0 1px rgba(24, 46, 76, 0.24);\n    filter: brightness(0.95);\n  }\n  .popup-mobile-filter-panel .popup-filter-option .rate-filter-count-badge,\n  .popup-mobile-filter-panel .activities-view-option .rate-filter-count-badge,\n  .activities-mobile-filter-panel .popup-filter-option .rate-filter-count-badge,\n  .activities-mobile-filter-panel .activities-view-option .rate-filter-count-badge,\n  .activities-mobile-rate-filter-panel .popup-filter-option .rate-filter-count-badge,\n  .activities-mobile-rate-filter-panel .activities-view-option .rate-filter-count-badge {\n    margin-left: auto;\n    flex: 0 0 auto;\n  }\n  :host ::ng-deep .cdk-overlay-pane:has(.mat-mdc-select-panel.profile-bottom-sheet-panel) {\n    position: fixed !important;\n    left: 0 !important;\n    right: 0 !important;\n    bottom: 0 !important;\n    top: auto !important;\n    width: 100vw !important;\n    max-width: 100vw !important;\n    transform: none !important;\n  }\n  :host ::ng-deep .mat-mdc-select-panel.profile-bottom-sheet-panel {\n    width: 100vw !important;\n    max-width: 100vw !important;\n    max-height: min(54vh, 420px) !important;\n    margin: 0 !important;\n    border-radius: 16px 16px 0 0 !important;\n    border: 1px solid #d6deea;\n    border-bottom: 0;\n    box-shadow: 0 -14px 28px rgba(15, 29, 52, 0.24);\n    padding-top: 0.38rem;\n    padding-bottom: max(0.55rem, env(safe-area-inset-bottom));\n  }\n}\n.popup-view-fab {\n  height: 34px;\n  border: 1px solid rgba(39, 62, 94, 0.22);\n  border-radius: 999px;\n  background: #f3f7ff;\n  color: #2c4c74;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.25rem;\n  padding: 0 0.62rem;\n  cursor: pointer;\n}\n.popup-view-fab .mat-icon {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n}\n.popup-view-fab span {\n  font-size: 0.74rem;\n  font-weight: 700;\n  white-space: nowrap;\n}\n.event-visibility-picker {\n  position: relative;\n  z-index: 22;\n  margin-left: auto;\n  flex: 0 0 auto;\n}\n.event-visibility-trigger {\n  flex-wrap: nowrap;\n}\n.profile-status-header-picker .event-visibility-trigger.status-public,\n.profile-status-header-picker .activities-view-option.status-public {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #e6f6ef);\n}\n.profile-status-header-picker .event-visibility-trigger.status-friends,\n.profile-status-header-picker .activities-view-option.status-friends {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #e8f1fd);\n}\n.profile-status-header-picker .event-visibility-trigger.status-host,\n.profile-status-header-picker .activities-view-option.status-host {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #f6efe2);\n}\n.profile-status-header-picker .event-visibility-trigger.status-inactive,\n.profile-status-header-picker .activities-view-option.status-inactive {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #f2f3f5);\n}\n.profile-status-header-picker .event-visibility-trigger .mat-icon.status-public,\n.profile-status-header-picker .activities-view-option.status-public .mat-icon {\n  color: #2f8f66;\n}\n.profile-status-header-picker .event-visibility-trigger .mat-icon.status-friends,\n.profile-status-header-picker .activities-view-option.status-friends .mat-icon {\n  color: #1b57a1;\n}\n.profile-status-header-picker .event-visibility-trigger .mat-icon.status-host,\n.profile-status-header-picker .activities-view-option.status-host .mat-icon {\n  color: #87580f;\n}\n.profile-status-header-picker .event-visibility-trigger .mat-icon.status-inactive,\n.profile-status-header-picker .activities-view-option.status-inactive .mat-icon {\n  color: #5b6573;\n}\n.app-popup textarea,\n.app-popup input,\n.app-popup select,\n.popup-surface textarea,\n.popup-surface input,\n.popup-surface select,\n.experience-form-popup textarea,\n.experience-form-popup input,\n.experience-form-popup select,\n.mobile-profile-selector-sheet-wrap input {\n  width: 100%;\n  border: 1px solid rgba(15, 27, 47, 0.16);\n  border-radius: 10px;\n  padding: 0.48rem 0.56rem;\n  font: inherit;\n  color: var(--text-main);\n  background: #fff;\n}\n.app-popup textarea,\n.popup-surface textarea,\n.experience-form-popup textarea {\n  resize: vertical;\n}\n.app-popup textarea:focus,\n.app-popup input:focus,\n.app-popup select:focus,\n.popup-surface textarea:focus,\n.popup-surface input:focus,\n.popup-surface select:focus,\n.experience-form-popup textarea:focus,\n.experience-form-popup input:focus,\n.experience-form-popup select:focus,\n.mobile-profile-selector-sheet-wrap input:focus {\n  outline: 0;\n  border-color: rgba(52, 103, 182, 0.72);\n  box-shadow: 0 0 0 3px rgba(55, 116, 212, 0.14);\n}\n.popup-surface-form-grid,\n.experience-form-grid {\n  display: grid;\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n  max-width: none;\n  width: 100%;\n  margin: 0;\n  justify-content: stretch;\n  align-content: start;\n  align-items: start;\n  column-gap: 1rem;\n  row-gap: 0.9rem;\n}\n.popup-surface-form-grid label,\n.experience-form-grid label {\n  display: grid;\n  grid-template-rows: min-content;\n  gap: 0;\n  font-weight: 600;\n  color: rgba(26, 44, 69, 0.88);\n}\n.popup-surface-form-grid input,\n.experience-form-grid input {\n  min-height: 40px;\n  padding: 0.56rem 0.72rem;\n  font-size: 0.88rem;\n  line-height: 1.25;\n  box-sizing: border-box;\n}\n.popup-surface-form-grid textarea,\n.experience-form-grid textarea {\n  min-height: 96px;\n  padding: 0.56rem 0.72rem;\n  font-size: 0.88rem;\n  line-height: 1.25;\n  box-sizing: border-box;\n}\n.popup-surface-form-grid .profile-status-select-wrap.selector-like,\n.experience-form-grid .profile-status-select-wrap.selector-like {\n  min-height: 40px;\n  height: 40px;\n  box-sizing: border-box;\n}\n.popup-surface-form-grid .mat-mdc-select-trigger,\n.experience-form-grid .mat-mdc-select-trigger {\n  min-height: 32px;\n}\n.popup-surface-description-field,\n.experience-description-field {\n  grid-column: 1/-1;\n}\n.popup-surface-actions,\n.experience-form-actions {\n  justify-content: center;\n  padding-top: 0.2rem;\n}\n.popup-actions {\n  display: flex;\n  gap: 0.45rem;\n  flex-wrap: wrap;\n}\n.link-btn {\n  border: 1px solid var(--line-strong);\n  border-radius: 999px;\n  background: #fff;\n  color: #1f3350;\n  font: inherit;\n  font-size: 0.83rem;\n  padding: 0.38rem 0.76rem;\n  cursor: pointer;\n}\n.neutral-btn {\n  background: #f2f4fa;\n  border-color: rgba(23, 33, 54, 0.12);\n}\n.primary-btn {\n  background: #4776b7;\n  border-color: #4776b7;\n  color: #fff;\n}\n.profile-status-select-wrap .mat-icon,\n.date-picker-btn .mat-icon {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n  line-height: 16px;\n  color: #566b86;\n}\n.profile-status-select-wrap .mat-mdc-select {\n  min-width: 80px;\n  width: 100%;\n  font-size: 0.8rem;\n  font-weight: 700;\n  text-transform: lowercase;\n}\n.profile-status-select-wrap .mat-mdc-select-trigger {\n  width: 100%;\n  justify-content: flex-start;\n}\n.profile-status-select-wrap .mat-mdc-select-arrow-wrapper {\n  margin-left: auto;\n}\n.status-public {\n  color: #2f8f66;\n}\n.status-friends {\n  color: #1b57a1;\n}\n.status-host {\n  color: #87580f;\n}\n.status-inactive {\n  color: #5b6573;\n}\n.status-option-content .status-public {\n  color: #2f8f66;\n}\n.status-option-content .status-friends {\n  color: #1b57a1;\n}\n.status-option-content .status-host {\n  color: #87580f;\n}\n.status-option-content .status-inactive {\n  color: #5b6573;\n}\n.profile-status-select-wrap.status-public .status-option-content .mat-icon {\n  color: #2f8f66;\n}\n.profile-status-select-wrap.status-friends .status-option-content .mat-icon {\n  color: #1b57a1;\n}\n.profile-status-select-wrap.status-host .status-option-content .mat-icon {\n  color: #87580f;\n}\n.profile-status-select-wrap.status-inactive .status-option-content .mat-icon {\n  color: #5b6573;\n}\n.profile-details-values-btn .mat-icon {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n  line-height: 16px;\n  color: rgba(44, 67, 100, 0.72);\n}\n.profile-details-values-btn {\n  min-height: 36px;\n  height: 36px;\n  box-sizing: border-box;\n  padding-top: 0;\n  padding-bottom: 0;\n}\n.profile-details-values-btn .status-option-content.profile-details-selected-badges {\n  display: inline-grid;\n  grid-template-columns: minmax(0, 1fr) auto;\n  align-items: center;\n  column-gap: 0.26rem;\n  min-width: 0;\n  width: 100%;\n}\n.profile-details-values-btn.profile-details-values-tone-values .profile-details-inline-chip {\n  max-width: calc(100% - 2.6rem);\n}\n.profile-details-values-btn.profile-details-values-tone-interest .profile-details-inline-chip {\n  max-width: calc((100% - 3.2rem) / 2);\n}\n.profile-details-values-btn.profile-details-values-tone-values .profile-details-inline-overflow {\n  color: #1e6b5a;\n}\n.profile-details-values-btn.profile-details-values-tone-interest .profile-details-inline-overflow {\n  color: #2e5a90;\n}\n.values-header-chips {\n  display: flex;\n  align-items: center;\n  flex-wrap: wrap;\n  gap: 0.28rem;\n  flex: 0 0 100%;\n  margin-left: 0;\n  margin-top: 0.34rem;\n  max-width: 100%;\n  overflow: visible;\n  white-space: normal;\n  padding-bottom: 0;\n}\n.popup-title-values {\n  margin-right: 0.38rem;\n}\n.values-selected-chip {\n  border: 1px solid rgba(76, 99, 136, 0.3);\n  background:\n    linear-gradient(\n      180deg,\n      #f7f9ff 0%,\n      #eef3ff 100%);\n  color: #24416a;\n  border-radius: 999px;\n  min-height: 26px;\n  padding: 0.18rem 0.46rem;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.26rem;\n  font-size: 0.7rem;\n  font-weight: 700;\n  cursor: pointer;\n  flex: 0 0 auto;\n}\n.values-selected-chip .mat-icon {\n  width: 12px;\n  height: 12px;\n  font-size: 12px;\n  line-height: 12px;\n}\n.values-selected-chip.section-family {\n  background:\n    linear-gradient(\n      180deg,\n      #fff1ea 0%,\n      #ffe6dd 100%);\n  border-color: rgba(160, 90, 51, 0.32);\n  color: #8b4d2b;\n}\n.values-selected-chip.section-ambition {\n  background:\n    linear-gradient(\n      180deg,\n      #fff7e8 0%,\n      #ffefd7 100%);\n  border-color: rgba(160, 106, 20, 0.32);\n  color: #9a6614;\n}\n.values-selected-chip.section-lifestyle {\n  background:\n    linear-gradient(\n      180deg,\n      #eaf8f5 0%,\n      #e0f2ee 100%);\n  border-color: rgba(45, 125, 120, 0.32);\n  color: #2a6e6a;\n}\n.values-selected-chip.section-beliefs {\n  background:\n    linear-gradient(\n      180deg,\n      #f0ecff 0%,\n      #e8e1fa 100%);\n  border-color: rgba(95, 78, 160, 0.32);\n  color: #564793;\n}\n.values-selected-chip.section-social {\n  background:\n    linear-gradient(\n      180deg,\n      #ecf4ff 0%,\n      #e1ecfb 100%);\n  border-color: rgba(45, 94, 168, 0.32);\n  color: #2d5ea8;\n}\n.values-selected-chip.section-arts {\n  background:\n    linear-gradient(\n      180deg,\n      #f2edfb 0%,\n      #e9e2f9 100%);\n  border-color: rgba(103, 76, 164, 0.32);\n  color: #654ca1;\n}\n.values-selected-chip.section-food {\n  background:\n    linear-gradient(\n      180deg,\n      #fff4e8 0%,\n      #fee9d6 100%);\n  border-color: rgba(170, 97, 28, 0.32);\n  color: #9d611c;\n}\n.values-selected-chip.section-active {\n  background:\n    linear-gradient(\n      180deg,\n      #edf8ee 0%,\n      #e2f1e4 100%);\n  border-color: rgba(44, 126, 72, 0.32);\n  color: #2d7d47;\n}\n.values-selected-chip.section-mind {\n  background:\n    linear-gradient(\n      180deg,\n      #eaf8f6 0%,\n      #def1ee 100%);\n  border-color: rgba(37, 124, 118, 0.32);\n  color: #2d7d78;\n}\n.values-selected-chip.section-identity {\n  background:\n    linear-gradient(\n      180deg,\n      #f4f0ff 0%,\n      #e9e3fb 100%);\n  border-color: rgba(88, 78, 159, 0.32);\n  color: #5a4ea0;\n}\n.readonly-select {\n  width: fit-content;\n  min-width: 0;\n  max-width: 130px;\n  justify-content: center;\n  margin-top: 2px;\n  padding-left: 0.44rem;\n  padding-right: 0.44rem;\n}\n.readonly-field {\n  min-height: 34px;\n  border: 1px solid rgba(15, 27, 47, 0.16);\n  border-radius: 10px;\n  padding: 0.4rem 0.56rem;\n  background: #f7fafe;\n  color: #23476f;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.26rem;\n  font-weight: 700;\n}\n.readonly-field .mat-icon {\n  width: 16px;\n  height: 16px;\n  font-size: 16px;\n  line-height: 16px;\n}\n.zodiac-symbol {\n  font-size: 1.1rem;\n  font-weight: 800;\n  line-height: 1;\n}\n.zodiac-label {\n  font-size: 0.9rem;\n  font-weight: 700;\n  min-width: 0;\n  text-align: center;\n}\n.readonly-select.zodiac-aries {\n  background: #fdf1f1;\n  color: #9f2f2f;\n}\n.readonly-select.zodiac-taurus {\n  background: #f7f3eb;\n  color: #6e4b2b;\n}\n.readonly-select.zodiac-gemini {\n  background: #fdf8e9;\n  color: #7d5a12;\n}\n.readonly-select.zodiac-cancer {\n  background: #eef4ff;\n  color: #2d5b8e;\n}\n.readonly-select.zodiac-leo {\n  background: #fff3e8;\n  color: #8f4b0d;\n}\n.readonly-select.zodiac-virgo {\n  background: #edf8ef;\n  color: #2b6b3d;\n}\n.readonly-select.zodiac-libra {\n  background: #f2eefc;\n  color: #60439d;\n}\n.readonly-select.zodiac-scorpio {\n  background: #f9edf2;\n  color: #7b3150;\n}\n.readonly-select.zodiac-sagittarius {\n  background: #eef1ff;\n  color: #2f4a9a;\n}\n.readonly-select.zodiac-capricorn {\n  background: #eff2f5;\n  color: #364653;\n}\n.readonly-select.zodiac-aquarius {\n  background: #ebf7fb;\n  color: #1d5f7a;\n}\n.readonly-select.zodiac-pisces {\n  background: #eef2ff;\n  color: #294b8f;\n}\n.physique-slim {\n  color: #3f7ab3;\n}\n.physique-lean {\n  color: #3f8f5f;\n}\n.physique-athletic {\n  color: #2f7e4d;\n}\n.physique-fit {\n  color: #465fbb;\n}\n.physique-curvy {\n  color: #a14875;\n}\n.physique-muscular {\n  color: #7d4f24;\n}\n.physique-average {\n  color: #4d667f;\n}\n.physique-select-wrap.physique-slim {\n  background:\n    linear-gradient(\n      180deg,\n      #eaf3fb 0%,\n      #dfebf8 100%);\n  border-color: rgba(63, 122, 179, 0.34);\n}\n.physique-select-wrap.physique-lean {\n  background:\n    linear-gradient(\n      180deg,\n      #eaf6ee 0%,\n      #def0e5 100%);\n  border-color: rgba(63, 143, 95, 0.34);\n}\n.physique-select-wrap.physique-athletic {\n  background:\n    linear-gradient(\n      180deg,\n      #e8f5ec 0%,\n      #dff0e6 100%);\n  border-color: rgba(47, 126, 77, 0.34);\n}\n.physique-select-wrap.physique-fit {\n  background:\n    linear-gradient(\n      180deg,\n      #ebf0ff 0%,\n      #e1e8fc 100%);\n  border-color: rgba(70, 95, 187, 0.34);\n}\n.physique-select-wrap.physique-curvy {\n  background:\n    linear-gradient(\n      180deg,\n      #f7edf3 0%,\n      #f0e3ec 100%);\n  border-color: rgba(161, 72, 117, 0.36);\n}\n.physique-select-wrap.physique-muscular {\n  background:\n    linear-gradient(\n      180deg,\n      #f6efe9 0%,\n      #ede3d8 100%);\n  border-color: rgba(125, 79, 36, 0.36);\n}\n.physique-select-wrap.physique-average {\n  background:\n    linear-gradient(\n      180deg,\n      #eef2f6 0%,\n      #e5ebf1 100%);\n  border-color: rgba(77, 102, 127, 0.34);\n}\n.physique-select-wrap.physique-slim .status-option-content .mat-icon {\n  color: #3f7ab3;\n}\n.physique-select-wrap.physique-lean .status-option-content .mat-icon {\n  color: #3f8f5f;\n}\n.physique-select-wrap.physique-athletic .status-option-content .mat-icon {\n  color: #2f7e4d;\n}\n.physique-select-wrap.physique-fit .status-option-content .mat-icon {\n  color: #465fbb;\n}\n.physique-select-wrap.physique-curvy .status-option-content .mat-icon {\n  color: #a14875;\n}\n.physique-select-wrap.physique-muscular .status-option-content .mat-icon {\n  color: #7d4f24;\n}\n.physique-select-wrap.physique-average .status-option-content .mat-icon {\n  color: #4d667f;\n}\n.experience-filter-all {\n  color: #694ea6;\n}\n.experience-filter-workspace {\n  color: #a1485a;\n}\n.experience-filter-school {\n  color: #2d5ea8;\n}\n.experience-filter-online {\n  color: #2d7d47;\n}\n.experience-filter-project {\n  color: #6550a0;\n}\n.experience-filter-select.experience-filter-all,\n.experience-type-select.experience-filter-project {\n  background:\n    linear-gradient(\n      180deg,\n      #efe8ff 0%,\n      #e8defc 100%);\n  border-color: rgba(103, 76, 164, 0.32);\n}\n.experience-filter-select.experience-filter-workspace,\n.experience-type-select.experience-filter-workspace {\n  background:\n    linear-gradient(\n      180deg,\n      #fff1f3 0%,\n      #ffe6ea 100%);\n  border-color: rgba(169, 72, 90, 0.32);\n}\n.experience-filter-select.experience-filter-school,\n.experience-type-select.experience-filter-school {\n  background:\n    linear-gradient(\n      180deg,\n      #eaf4ff 0%,\n      #e1ecfb 100%);\n  border-color: rgba(45, 94, 168, 0.32);\n}\n.experience-type-select.experience-filter-online {\n  background:\n    linear-gradient(\n      180deg,\n      #edf8ee 0%,\n      #e2f1e4 100%);\n  border-color: rgba(44, 126, 72, 0.32);\n}\n.experience-type-select.experience-filter-project {\n  background:\n    linear-gradient(\n      180deg,\n      #f4f0ff 0%,\n      #e9e3fb 100%);\n}\n.experience-type-select {\n  min-width: 0;\n  max-width: 100%;\n  min-height: 40px;\n}\n.experience-type-field,\n.experience-title-field,\n.experience-city-field {\n  width: 100%;\n  justify-self: stretch;\n}\n.experience-org-field {\n  width: 100%;\n  justify-self: stretch;\n}\n.experience-type-select {\n  width: 100%;\n}\n.experience-date-range-field {\n  width: 100%;\n  max-width: none;\n  margin: 0;\n  background: transparent;\n}\n.experience-date-range-label {\n  grid-column: 1/2;\n  width: 100%;\n  justify-self: stretch;\n}\n.experience-date-range-field .mat-mdc-text-field-wrapper {\n  min-height: 42px;\n  border-radius: 10px;\n  background: #fff;\n  border: 1px solid rgba(136, 156, 186, 0.5);\n  box-shadow: none;\n}\n.experience-date-range-field .mat-mdc-form-field-subscript-wrapper {\n  margin-top: 0.24rem;\n}\n.experience-date-range-field input {\n  border: 0 !important;\n  box-shadow: none !important;\n  border-radius: 0 !important;\n  background: transparent !important;\n  min-width: 0;\n  width: 100%;\n  padding: 0 !important;\n  min-height: 0 !important;\n  height: auto !important;\n  line-height: 1.25;\n}\n.experience-date-range-field .mat-datepicker-toggle {\n  margin-right: 0.2rem;\n}\n.experience-date-range-field .mat-mdc-form-field-hint-wrapper,\n.experience-date-range-field .mat-mdc-form-field-hint {\n  color: rgba(30, 49, 74, 0.65);\n  font-size: 0.72rem;\n}\n.experience-date-range-field .mat-date-range-input-container {\n  width: 100%;\n  display: grid;\n  grid-template-columns: minmax(96px, 1fr) auto minmax(96px, 1fr);\n  align-items: center;\n  column-gap: 0.34rem;\n  min-width: 0;\n}\n.experience-date-range-field .mat-date-range-input-separator {\n  margin: 0 0.28rem;\n  flex: 0 0 auto;\n  white-space: nowrap;\n}\n.experience-date-range-field .mat-date-range-input-start-wrapper,\n.experience-date-range-field .mat-date-range-input-end-wrapper {\n  width: 100%;\n  max-width: 100%;\n  overflow: visible;\n  min-width: 0;\n}\n.experience-date-range-field .mat-date-range-input-inner {\n  font-size: 0.96rem;\n  min-width: 0 !important;\n  width: 100% !important;\n  text-overflow: clip;\n  white-space: nowrap;\n  line-height: 1.25;\n}\n.experience-date-range-field .mat-mdc-form-field-flex {\n  min-width: 0;\n  border-bottom: 0 !important;\n  box-shadow: none !important;\n  align-items: center !important;\n}\n.experience-date-range-field .mat-mdc-form-field-infix {\n  padding-top: 0 !important;\n  padding-bottom: 0 !important;\n  min-height: 34px !important;\n  height: 34px;\n  display: flex;\n  align-items: center;\n}\n.experience-date-range-field .mdc-line-ripple,\n.experience-date-range-field .mat-mdc-form-field-line-ripple,\n.experience-date-range-field .mdc-line-ripple--deactivating,\n.experience-date-range-field .mdc-line-ripple--active {\n  display: none !important;\n  opacity: 0 !important;\n  transform: scaleX(0) !important;\n}\n:host ::ng-deep .mat-mdc-option.status-option.experience-filter-all {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #efe8ff);\n}\n:host ::ng-deep .mat-mdc-option.status-option.experience-filter-workspace {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #fff1f3);\n}\n:host ::ng-deep .mat-mdc-option.status-option.experience-filter-school {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #eaf4ff);\n}\n:host ::ng-deep .mat-mdc-option.status-option.experience-filter-online {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #edf8ee);\n}\n:host ::ng-deep .mat-mdc-option.status-option.experience-filter-project {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #f4f0ff);\n}\n.mobile-profile-language-chip.language-tone-1,\n.mobile-profile-selector-option.language-tone-1,\n:host ::ng-deep .mat-mdc-option.language-tone-1 {\n  background: #eaf4ff;\n  border-color: rgba(63, 122, 179, 0.34);\n  color: #2f6090;\n}\n.mobile-profile-language-chip.language-tone-2,\n.mobile-profile-selector-option.language-tone-2,\n:host ::ng-deep .mat-mdc-option.language-tone-2 {\n  background: #edf8f4;\n  border-color: rgba(75, 127, 113, 0.34);\n  color: #2f695b;\n}\n.mobile-profile-language-chip.language-tone-3,\n.mobile-profile-selector-option.language-tone-3,\n:host ::ng-deep .mat-mdc-option.language-tone-3 {\n  background: #f1f2ff;\n  border-color: rgba(70, 95, 187, 0.34);\n  color: #394f9c;\n}\n.mobile-profile-language-chip.language-tone-4,\n.mobile-profile-selector-option.language-tone-4,\n:host ::ng-deep .mat-mdc-option.language-tone-4 {\n  background: #fff2f8;\n  border-color: rgba(161, 72, 117, 0.34);\n  color: #8d3f66;\n}\n.mobile-profile-language-chip.language-tone-5,\n.mobile-profile-selector-option.language-tone-5,\n:host ::ng-deep .mat-mdc-option.language-tone-5 {\n  background: #fbf4ea;\n  border-color: rgba(125, 79, 36, 0.34);\n  color: #704822;\n}\n.mobile-profile-language-chip.language-tone-6,\n.mobile-profile-selector-option.language-tone-6,\n:host ::ng-deep .mat-mdc-option.language-tone-6 {\n  background: #eff4f9;\n  border-color: rgba(77, 102, 127, 0.34);\n  color: #415872;\n}\n.mobile-profile-language-chip.language-tone-7,\n.mobile-profile-selector-option.language-tone-7,\n:host ::ng-deep .mat-mdc-option.language-tone-7 {\n  background: #f7f5ea;\n  border-color: rgba(128, 109, 66, 0.34);\n  color: #746237;\n}\n.mobile-profile-language-chip.language-tone-8,\n.mobile-profile-selector-option.language-tone-8,\n:host ::ng-deep .mat-mdc-option.language-tone-8 {\n  background: #edf5ff;\n  border-color: rgba(45, 122, 160, 0.34);\n  color: #2f6782;\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-1 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #eaf2ff);\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-2 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #ebf7ef);\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-3 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #fff1e3);\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-4 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #efecfc);\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-5 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #f3f8e9);\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-6 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #fceef3);\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-7 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #edf7ff);\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-8 {\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #f6f2e9);\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-1 .status-option-content {\n  color: #2d63a9;\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-2 .status-option-content {\n  color: #2a7a49;\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-3 .status-option-content {\n  color: #9b6018;\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-4 .status-option-content {\n  color: #6153a2;\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-5 .status-option-content {\n  color: #61812a;\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-6 .status-option-content {\n  color: #9f446d;\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-7 .status-option-content {\n  color: #2e7898;\n}\n:host ::ng-deep .mat-mdc-option.status-option.detail-tone-8 .status-option-content {\n  color: #806c3f;\n}\n.mobile-profile-selector-option.detail-tone-1 {\n  background:\n    linear-gradient(\n      180deg,\n      #eef5ff 0%,\n      #e3eefc 100%);\n  border-color: rgba(46, 102, 181, 0.32);\n}\n.mobile-profile-selector-option.detail-tone-2 {\n  background:\n    linear-gradient(\n      180deg,\n      #eef9f3 0%,\n      #e3f4ea 100%);\n  border-color: rgba(40, 125, 72, 0.32);\n}\n.mobile-profile-selector-option.detail-tone-3 {\n  background:\n    linear-gradient(\n      180deg,\n      #fff4ea 0%,\n      #ffecdd 100%);\n  border-color: rgba(165, 94, 24, 0.32);\n}\n.mobile-profile-selector-option.detail-tone-4 {\n  background:\n    linear-gradient(\n      180deg,\n      #f2f1ff 0%,\n      #e8e5fb 100%);\n  border-color: rgba(97, 82, 164, 0.32);\n}\n.mobile-profile-selector-option.detail-tone-5 {\n  background:\n    linear-gradient(\n      180deg,\n      #f6f9ef 0%,\n      #edf3e1 100%);\n  border-color: rgba(95, 128, 36, 0.32);\n}\n.mobile-profile-selector-option.detail-tone-6 {\n  background:\n    linear-gradient(\n      180deg,\n      #fff1f4 0%,\n      #f9e6ed 100%);\n  border-color: rgba(160, 70, 111, 0.32);\n}\n.mobile-profile-selector-option.detail-tone-7 {\n  background:\n    linear-gradient(\n      180deg,\n      #edf8ff 0%,\n      #e2f0fb 100%);\n  border-color: rgba(45, 122, 160, 0.32);\n}\n.mobile-profile-selector-option.detail-tone-8 {\n  background:\n    linear-gradient(\n      180deg,\n      #f6f3ea 0%,\n      #eee9dc 100%);\n  border-color: rgba(128, 109, 66, 0.32);\n}\n.mobile-profile-selector-option.status-public {\n  background:\n    linear-gradient(\n      180deg,\n      #e6f6ef 0%,\n      #d9f0e6 100%);\n  border-color: rgba(47, 143, 102, 0.34);\n}\n.mobile-profile-selector-option.status-friends {\n  background:\n    linear-gradient(\n      180deg,\n      #e8f1fd 0%,\n      #dfeaf9 100%);\n  border-color: rgba(27, 87, 161, 0.34);\n}\n.mobile-profile-selector-option.status-host {\n  background:\n    linear-gradient(\n      180deg,\n      #f6efe2 0%,\n      #eee4d2 100%);\n  border-color: rgba(135, 88, 15, 0.36);\n}\n.mobile-profile-selector-option.status-inactive {\n  background:\n    linear-gradient(\n      180deg,\n      #f2f3f5 0%,\n      #e8ebef 100%);\n  border-color: rgba(91, 101, 115, 0.32);\n}\n.mobile-profile-selector-option.physique-slim {\n  background: #eaf4ff;\n  border-color: rgba(63, 122, 179, 0.34);\n}\n.mobile-profile-selector-option.physique-lean {\n  background: #edf8f4;\n  border-color: rgba(75, 127, 113, 0.34);\n}\n.mobile-profile-selector-option.physique-athletic {\n  background: #e8f5ec;\n  border-color: rgba(47, 126, 77, 0.34);\n}\n.mobile-profile-selector-option.physique-fit {\n  background: #f1f2ff;\n  border-color: rgba(70, 95, 187, 0.34);\n}\n.mobile-profile-selector-option.physique-curvy {\n  background: #fff2f8;\n  border-color: rgba(161, 72, 117, 0.34);\n}\n.mobile-profile-selector-option.physique-muscular {\n  background: #fbf4ea;\n  border-color: rgba(125, 79, 36, 0.34);\n}\n.mobile-profile-selector-option.physique-average {\n  background: #eff4f9;\n  border-color: rgba(77, 102, 127, 0.34);\n}\n.popup-panel-profile-selector .values-selector-popup.profile-selector-popup {\n  gap: 0.56rem;\n}\n.popup-panel-profile-selector .profile-filter-selector-head {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.44rem;\n  padding-bottom: 0.22rem;\n  border-bottom: 1px solid rgba(74, 102, 139, 0.22);\n}\n.popup-panel-profile-selector .profile-filter-selector-head-label {\n  color: #203c64;\n  font-size: 0.82rem;\n  font-weight: 800;\n  line-height: 1.2;\n}\n.popup-panel-profile-selector .profile-filter-selector-clear {\n  border: 1px solid rgba(41, 73, 110, 0.24);\n  border-radius: 999px;\n  background: rgba(255, 255, 255, 0.82);\n  color: #284970;\n  font: inherit;\n  font-size: 0.72rem;\n  font-weight: 700;\n  line-height: 1;\n  padding: 0.3rem 0.52rem;\n  cursor: pointer;\n}\n.popup-panel-profile-selector .profile-filter-selector-clear.is-hidden {\n  visibility: hidden;\n  pointer-events: none;\n}\n.popup-panel-profile-selector .profile-filter-selector-selected {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 0.34rem;\n}\n.popup-panel-profile-selector .profile-filter-selector-chip {\n  border: 1px solid rgba(35, 68, 107, 0.24);\n  border-radius: 999px;\n  background: rgba(255, 255, 255, 0.92);\n  color: #234368;\n  font: inherit;\n  font-size: 0.72rem;\n  font-weight: 700;\n  line-height: 1;\n  padding: 0.26rem 0.48rem;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.16rem;\n  cursor: pointer;\n}\n.popup-panel-profile-selector .profile-filter-selector-chip .mat-icon {\n  width: 13px;\n  height: 13px;\n  font-size: 13px;\n  line-height: 13px;\n}\n.popup-panel-profile-selector .profile-filter-selector-empty {\n  margin: 0;\n  font-size: 0.74rem;\n  color: rgba(31, 54, 86, 0.62);\n  font-style: italic;\n}\n.popup-panel-profile-selector .profile-selector-option-group {\n  display: grid;\n  gap: 0.34rem;\n  border: 1px solid transparent;\n  border-radius: 12px;\n  padding: 0.4rem 0.42rem;\n}\n.popup-panel-profile-selector .profile-selector-option-group-head {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.34rem;\n}\n.popup-panel-profile-selector .profile-selector-option-group-tag {\n  border-radius: 999px;\n  border: 1px solid rgba(52, 86, 128, 0.28);\n  background: rgba(255, 255, 255, 0.74);\n  color: #2f527d;\n  font-size: 0.67rem;\n  font-weight: 800;\n  letter-spacing: 0.02em;\n  line-height: 1;\n  padding: 0.2rem 0.52rem;\n  text-transform: uppercase;\n  white-space: nowrap;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.24rem;\n}\n.popup-panel-profile-selector .profile-selector-option-group-tag-icon {\n  width: 12px;\n  height: 12px;\n  font-size: 12px;\n  line-height: 12px;\n}\n.popup-panel-profile-selector .profile-selector-option-group-line {\n  display: block;\n  width: 100%;\n  height: 1px;\n  background: rgba(84, 111, 147, 0.34);\n}\n.popup-panel-profile-selector .profile-selector-chip-grid {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 0.36rem;\n}\n.popup-panel-profile-selector .profile-selector-chip {\n  border: 1px solid rgba(41, 70, 106, 0.22);\n  border-radius: 999px;\n  background: #f4f8ff;\n  color: #234066;\n  font: inherit;\n  font-size: 0.78rem;\n  font-weight: 700;\n  padding: 0.3rem 0.58rem;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.26rem;\n  cursor: pointer;\n  transition:\n    background-color 0.14s ease,\n    border-color 0.14s ease,\n    color 0.14s ease,\n    box-shadow 0.14s ease;\n}\n.popup-panel-profile-selector .profile-selector-chip.active {\n  border-color: rgba(27, 85, 158, 0.5);\n  background:\n    linear-gradient(\n      180deg,\n      #dcebff 0%,\n      #cfe3ff 100%);\n  color: #123e70;\n  box-shadow: inset 0 0 0 1px rgba(30, 73, 127, 0.24), 0 1px 2px rgba(24, 53, 86, 0.16);\n}\n.popup-panel-profile-selector .profile-selector-option-group.section-family {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 232, 219, 0.52) 0%,\n      rgba(255, 232, 219, 0.3) 100%);\n}\n.popup-panel-profile-selector .profile-selector-option-group.section-ambition {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 242, 216, 0.52) 0%,\n      rgba(255, 242, 216, 0.3) 100%);\n}\n.popup-panel-profile-selector .profile-selector-option-group.section-lifestyle {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(221, 241, 239, 0.56) 0%,\n      rgba(221, 241, 239, 0.32) 100%);\n}\n.popup-panel-profile-selector .profile-selector-option-group.section-beliefs {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(230, 226, 250, 0.56) 0%,\n      rgba(230, 226, 250, 0.32) 100%);\n}\n.popup-panel-profile-selector .profile-selector-option-group.section-social {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(223, 236, 255, 0.5) 0%,\n      rgba(223, 236, 255, 0.28) 100%);\n}\n.popup-panel-profile-selector .profile-selector-option-group.section-arts {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(235, 227, 255, 0.5) 0%,\n      rgba(235, 227, 255, 0.28) 100%);\n}\n.popup-panel-profile-selector .profile-selector-option-group.section-food {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 236, 221, 0.52) 0%,\n      rgba(255, 236, 221, 0.3) 100%);\n}\n.popup-panel-profile-selector .profile-selector-option-group.section-active {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(222, 243, 231, 0.56) 0%,\n      rgba(222, 243, 231, 0.32) 100%);\n}\n.popup-panel-profile-selector .profile-selector-option-group.section-mind {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(219, 242, 238, 0.56) 0%,\n      rgba(219, 242, 238, 0.32) 100%);\n}\n.popup-panel-profile-selector .profile-selector-option-group.section-identity {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(230, 226, 250, 0.56) 0%,\n      rgba(230, 226, 250, 0.32) 100%);\n}\n.popup-panel-profile-selector .profile-selector-option-group-tag.section-family {\n  border-color: rgba(156, 94, 51, 0.34);\n  color: #9c5e33;\n}\n.popup-panel-profile-selector .profile-selector-option-group-tag.section-ambition {\n  border-color: rgba(160, 106, 20, 0.34);\n  color: #9b6717;\n}\n.popup-panel-profile-selector .profile-selector-option-group-tag.section-lifestyle {\n  border-color: rgba(47, 123, 119, 0.34);\n  color: #2f7b77;\n}\n.popup-panel-profile-selector .profile-selector-option-group-tag.section-beliefs {\n  border-color: rgba(95, 78, 160, 0.34);\n  color: #5f4ea0;\n}\n.popup-panel-profile-selector .profile-selector-option-group-tag.section-social {\n  border-color: rgba(47, 106, 175, 0.36);\n  color: #2f6aaf;\n}\n.popup-panel-profile-selector .profile-selector-option-group-tag.section-arts {\n  border-color: rgba(106, 87, 168, 0.36);\n  color: #6a57a8;\n}\n.popup-panel-profile-selector .profile-selector-option-group-tag.section-food {\n  border-color: rgba(170, 97, 28, 0.34);\n  color: #a55e18;\n}\n.popup-panel-profile-selector .profile-selector-option-group-tag.section-active {\n  border-color: rgba(49, 124, 82, 0.36);\n  color: #317c52;\n}\n.popup-panel-profile-selector .profile-selector-option-group-tag.section-mind {\n  border-color: rgba(37, 124, 118, 0.34);\n  color: #2b7c76;\n}\n.popup-panel-profile-selector .profile-selector-option-group-tag.section-identity {\n  border-color: rgba(98, 84, 163, 0.34);\n  color: #6254a3;\n}\n.popup-panel-profile-selector .profile-selector-option-group-line.section-family {\n  background: rgba(156, 94, 51, 0.3);\n}\n.popup-panel-profile-selector .profile-selector-option-group-line.section-ambition {\n  background: rgba(160, 106, 20, 0.32);\n}\n.popup-panel-profile-selector .profile-selector-option-group-line.section-lifestyle {\n  background: rgba(47, 123, 119, 0.3);\n}\n.popup-panel-profile-selector .profile-selector-option-group-line.section-beliefs {\n  background: rgba(95, 78, 160, 0.3);\n}\n.popup-panel-profile-selector .profile-selector-option-group-line.section-social {\n  background: rgba(47, 106, 175, 0.34);\n}\n.popup-panel-profile-selector .profile-selector-option-group-line.section-arts {\n  background: rgba(106, 87, 168, 0.34);\n}\n.popup-panel-profile-selector .profile-selector-option-group-line.section-food {\n  background: rgba(170, 97, 28, 0.32);\n}\n.popup-panel-profile-selector .profile-selector-option-group-line.section-active {\n  background: rgba(49, 124, 82, 0.34);\n}\n.popup-panel-profile-selector .profile-selector-option-group-line.section-mind {\n  background: rgba(37, 124, 118, 0.34);\n}\n.popup-panel-profile-selector .profile-selector-option-group-line.section-identity {\n  background: rgba(98, 84, 163, 0.3);\n}\n:host ::ng-deep .mat-mdc-option.mdc-list-item--selected:not(.mdc-list-item--disabled):not(.status-option) {\n  background: #f0f5fc;\n}\n:host ::ng-deep .mat-mdc-option.status-option.mdc-list-item--selected:not(.mdc-list-item--disabled) {\n  filter: brightness(0.95);\n  box-shadow: inset 0 0 0 1px rgba(24, 46, 76, 0.2);\n}\n:host ::ng-deep .mat-mdc-option.status-option {\n  background: #fff;\n}\n:host ::ng-deep .mat-mdc-option.status-option:not(:last-child) {\n  border-bottom: 1px solid #e6edf7;\n}\n:host ::ng-deep .selector-options-panel .mat-mdc-option.hide-selected-option,\n:host ::ng-deep .status-options-panel .mat-mdc-option.hide-selected-option {\n  min-height: 0 !important;\n  height: 0 !important;\n  padding-top: 0 !important;\n  padding-bottom: 0 !important;\n  border: 0 !important;\n  margin: 0 !important;\n  opacity: 0 !important;\n  pointer-events: none !important;\n  overflow: hidden !important;\n}\n:host ::ng-deep .selector-options-panel .mat-mdc-option {\n  background: #fff;\n}\n:host ::ng-deep .mat-mdc-select-panel.selector-options-panel,\n:host ::ng-deep .mat-mdc-select-panel.status-options-panel {\n  margin-top: 8px !important;\n  margin-bottom: 8px !important;\n}\n:host ::ng-deep .mat-mdc-select-panel.selector-options-panel.mat-mdc-select-panel-above,\n:host ::ng-deep .mat-mdc-select-panel.status-options-panel.mat-mdc-select-panel-above,\n:host ::ng-deep .cdk-overlay-pane .mat-mdc-select-panel.selector-options-panel.mat-mdc-select-panel-above,\n:host ::ng-deep .cdk-overlay-pane .mat-mdc-select-panel.status-options-panel.mat-mdc-select-panel-above {\n  margin-top: 0 !important;\n  margin-bottom: 18px !important;\n  transform: translateY(-10px) !important;\n}\n:host ::ng-deep .selector-options-panel .mat-mdc-option.status-option.status-public,\n:host ::ng-deep .status-options-panel .mat-mdc-option.status-option.status-public {\n  --mdc-list-list-item-container-color: #def3e9;\n  --mat-mdc-option-selected-container-color: #def3e9;\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #def3e9) !important;\n}\n:host ::ng-deep .selector-options-panel .mat-mdc-option.status-option.status-friends,\n:host ::ng-deep .status-options-panel .mat-mdc-option.status-option.status-friends {\n  --mdc-list-list-item-container-color: #e3eefb;\n  --mat-mdc-option-selected-container-color: #e3eefb;\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #e3eefb) !important;\n}\n:host ::ng-deep .selector-options-panel .mat-mdc-option.status-option.status-host,\n:host ::ng-deep .status-options-panel .mat-mdc-option.status-option.status-host {\n  --mdc-list-list-item-container-color: #f3ead8;\n  --mat-mdc-option-selected-container-color: #f3ead8;\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #f3ead8) !important;\n}\n:host ::ng-deep .selector-options-panel .mat-mdc-option.status-option.status-inactive,\n:host ::ng-deep .status-options-panel .mat-mdc-option.status-option.status-inactive {\n  --mdc-list-list-item-container-color: #eceff3;\n  --mat-mdc-option-selected-container-color: #eceff3;\n  background:\n    linear-gradient(\n      0deg,\n      #ffffff,\n      #eceff3) !important;\n}\n:host ::ng-deep .selector-options-panel .mat-mdc-option.status-option.status-public .status-option-content,\n:host ::ng-deep .selector-options-panel .mat-mdc-option.status-option.status-public .status-option-content .mat-icon,\n:host ::ng-deep .status-options-panel .mat-mdc-option.status-option.status-public .status-option-content,\n:host ::ng-deep .status-options-panel .mat-mdc-option.status-option.status-public .status-option-content .mat-icon {\n  color: #2f8f66 !important;\n}\n:host ::ng-deep .selector-options-panel .mat-mdc-option.status-option.status-friends .status-option-content,\n:host ::ng-deep .selector-options-panel .mat-mdc-option.status-option.status-friends .status-option-content .mat-icon,\n:host ::ng-deep .status-options-panel .mat-mdc-option.status-option.status-friends .status-option-content,\n:host ::ng-deep .status-options-panel .mat-mdc-option.status-option.status-friends .status-option-content .mat-icon {\n  color: #1b57a1 !important;\n}\n:host ::ng-deep .selector-options-panel .mat-mdc-option.status-option.status-host .status-option-content,\n:host ::ng-deep .selector-options-panel .mat-mdc-option.status-option.status-host .status-option-content .mat-icon,\n:host ::ng-deep .status-options-panel .mat-mdc-option.status-option.status-host .status-option-content,\n:host ::ng-deep .status-options-panel .mat-mdc-option.status-option.status-host .status-option-content .mat-icon {\n  color: #87580f !important;\n}\n:host ::ng-deep .selector-options-panel .mat-mdc-option.status-option.status-inactive .status-option-content,\n:host ::ng-deep .selector-options-panel .mat-mdc-option.status-option.status-inactive .status-option-content .mat-icon,\n:host ::ng-deep .status-options-panel .mat-mdc-option.status-option.status-inactive .status-option-content,\n:host ::ng-deep .status-options-panel .mat-mdc-option.status-option.status-inactive .status-option-content .mat-icon {\n  color: #5b6573 !important;\n}\n:host ::ng-deep .mat-mdc-option.status-option.physique-slim {\n  background: #eaf4ff;\n}\n:host ::ng-deep .mat-mdc-option.status-option.physique-lean {\n  background: #edf8f4;\n}\n:host ::ng-deep .mat-mdc-option.status-option.physique-athletic {\n  background: #e8f5ec;\n}\n:host ::ng-deep .mat-mdc-option.status-option.physique-fit {\n  background: #f1f2ff;\n}\n:host ::ng-deep .mat-mdc-option.status-option.physique-curvy {\n  background: #fff2f8;\n}\n:host ::ng-deep .mat-mdc-option.status-option.physique-muscular {\n  background: #fbf4ea;\n}\n:host ::ng-deep .mat-mdc-option.status-option.physique-average {\n  background: #eff4f9;\n}\n:host ::ng-deep .mat-mdc-option.status-option.physique-slim .status-option-content {\n  color: #3f7ab3;\n}\n:host ::ng-deep .mat-mdc-option.status-option.physique-lean .status-option-content {\n  color: #3f8f5f;\n}\n:host ::ng-deep .mat-mdc-option.status-option.physique-athletic .status-option-content {\n  color: #2f7e4d;\n}\n:host ::ng-deep .mat-mdc-option.status-option.physique-fit .status-option-content {\n  color: #465fbb;\n}\n:host ::ng-deep .mat-mdc-option.status-option.physique-curvy .status-option-content {\n  color: #a14875;\n}\n:host ::ng-deep .mat-mdc-option.status-option.physique-muscular .status-option-content {\n  color: #7d4f24;\n}\n:host ::ng-deep .mat-mdc-option.status-option.physique-average .status-option-content {\n  color: #4d667f;\n}\n:host ::ng-deep .mat-mdc-select-panel.physique-options-panel {\n  width: auto !important;\n  max-width: 220px !important;\n  min-width: 0 !important;\n}\n:host ::ng-deep .physique-options-panel .mat-mdc-option {\n  padding-right: 8px;\n}\n:host ::ng-deep .physique-options-panel .mat-mdc-option .mat-pseudo-checkbox {\n  margin-left: 4px;\n}\n@media (max-width: 760px) {\n  .experience-form-grid {\n    grid-template-columns: 1fr;\n    max-width: none;\n    justify-content: stretch;\n    row-gap: 0.72rem;\n  }\n  .experience-date-range-label {\n    grid-column: 1/-1;\n  }\n  .experience-date-range-field .mat-date-range-input-container {\n    grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);\n  }\n  .profile-details-privacy-fab .privacy-fab-actions {\n    position: fixed;\n    left: 0.5rem;\n    right: 0.5rem;\n    bottom: max(0.5rem, env(safe-area-inset-bottom));\n    top: auto;\n    transform: translateY(12px) scale(0.98);\n    transform-origin: bottom center;\n    justify-content: center;\n    gap: 0.46rem;\n    padding: 0.46rem 0.56rem;\n    border: 1px solid rgba(42, 68, 102, 0.2);\n    border-radius: 14px;\n    background: #fff;\n    box-shadow: 0 -12px 24px rgba(18, 31, 51, 0.22);\n  }\n  .profile-details-privacy-fab.open .privacy-fab-actions {\n    transform: translateY(0) scale(1);\n  }\n}\n:host {\n  display: contents;\n}\n.idea-editor-body {\n  height: 100%;\n  min-height: 0;\n  flex: 1 1 auto;\n  display: flex;\n  flex-direction: column;\n  gap: 0.56rem;\n}\n.idea-editor-error {\n  border: 1px solid rgba(47, 86, 139, 0.14);\n  border-radius: 12px;\n  background: #fff;\n  color: #2b4567;\n}\n.idea-editor-error {\n  min-height: 42px;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.46rem;\n  padding: 0 0.66rem;\n  border-color: rgba(180, 64, 82, 0.22);\n  background: #fff6f7;\n  color: #a63d50;\n  font-size: 0.8rem;\n  font-weight: 900;\n}\n.idea-editor-smart-list {\n  flex: 1 1 auto;\n  min-height: 0;\n  display: flex;\n}\n:host ::ng-deep .idea-editor-smart-list .smart-list__surface,\n:host ::ng-deep .idea-editor-smart-list .smart-list__stage,\n:host ::ng-deep .idea-editor-smart-list .smart-list__stage-list-shell {\n  height: 100%;\n  min-height: 0;\n}\n:host ::ng-deep .idea-editor-smart-list .smart-list {\n  height: 100%;\n  box-sizing: border-box;\n}\n:host ::ng-deep .idea-editor-smart-list .smart-list__item-shell {\n  min-width: 0;\n}\n:host ::ng-deep app-info-card.idea-info-card {\n  display: block;\n  height: 100%;\n}\n:host ::ng-deep app-info-card.idea-info-card .ui-info-card {\n  height: 100%;\n}\n:host ::ng-deep app-info-card.idea-info-card .ui-info-card__overlay-action--start.ui-info-card__overlay-action--badge,\n:host ::ng-deep app-info-card.idea-info-card .ui-info-card__overlay-action--end.ui-info-card__overlay-action--badge {\n  height: 28px;\n  padding: 0 0.46rem;\n  gap: 0.18rem;\n  white-space: nowrap;\n  cursor: default;\n  pointer-events: none;\n}\n:host ::ng-deep app-info-card.idea-info-card .ui-info-card__overlay-action--start.ui-info-card__overlay-action--badge {\n  left: 0.42rem;\n}\n:host ::ng-deep app-info-card.idea-info-card .ui-info-card__overlay-action--start.ui-info-card__overlay-action--badge:hover,\n:host ::ng-deep app-info-card.idea-info-card .ui-info-card__overlay-action--start.ui-info-card__overlay-action--badge:active,\n:host ::ng-deep app-info-card.idea-info-card .ui-info-card__overlay-action--end.ui-info-card__overlay-action--badge:hover,\n:host ::ng-deep app-info-card.idea-info-card .ui-info-card__overlay-action--end.ui-info-card__overlay-action--badge:active {\n  transform: none;\n  filter: none;\n}\n:host ::ng-deep app-info-card.idea-info-card .ui-info-card__overlay-action--end.ui-info-card__overlay-action--badge {\n  right: 0.42rem;\n}\n:host ::ng-deep app-info-card.idea-info-card .ui-info-card__overlay-action--start.ui-info-card__overlay-action--badge .mat-icon,\n:host ::ng-deep app-info-card.idea-info-card .ui-info-card__overlay-action--end.ui-info-card__overlay-action--badge .mat-icon {\n  width: 15px;\n  height: 15px;\n  font-size: 15px;\n  line-height: 15px;\n}\n.idea-editor-form-panel {\n  position: relative;\n  display: flex;\n  flex-direction: column;\n  width: 100%;\n  height: 100%;\n  min-height: 0;\n  box-sizing: border-box;\n  overflow: hidden;\n  color: #173253;\n}\n.idea-editor-viewer-panel {\n  width: 100%;\n  height: 100%;\n  min-height: 0;\n  background: transparent;\n  color: #173253;\n  display: flex;\n  flex-direction: column;\n  overflow: hidden;\n  box-sizing: border-box;\n}\n.idea-editor-panel-loading {\n  flex: 1 1 auto;\n  min-height: 0;\n  display: grid;\n  place-items: center;\n}\n.idea-editor-panel-loading-card {\n  display: grid;\n  justify-items: center;\n  gap: 0.58rem;\n  color: #173a62;\n  font-size: 0.82rem;\n  font-weight: 900;\n}\n.idea-editor-form-loading-overlay {\n  position: absolute;\n  inset: 0;\n  z-index: 20;\n  border-radius: 10px;\n  background: rgba(251, 253, 255, 0.9);\n  -webkit-backdrop-filter: blur(2px);\n  backdrop-filter: blur(2px);\n  display: grid;\n  place-items: center;\n}\n.idea-editor-form-content {\n  flex: 1 1 auto;\n  min-height: 0;\n  display: grid;\n  align-content: start;\n  grid-auto-rows: max-content;\n  gap: 0.66rem;\n  overflow-y: auto;\n  overflow-x: hidden;\n  padding: 0.66rem;\n}\n.idea-editor-viewer-image,\n.idea-editor-image-preview {\n  border: 1px solid rgba(47, 86, 139, 0.12);\n  border-radius: 12px;\n  background-color: #edf4fb;\n  background-position: center;\n  background-size: cover;\n  background-repeat: no-repeat;\n}\n.idea-editor-viewer-image {\n  width: 100%;\n  max-width: 100%;\n  aspect-ratio: 16/7;\n  min-height: 220px;\n  margin: 1rem 0;\n  background-color: #edf3fb;\n  box-sizing: border-box;\n}\n.idea-editor-empty-image,\n.idea-editor-image-preview.is-empty {\n  color: #7b91aa;\n  background:\n    linear-gradient(\n      135deg,\n      rgba(255, 255, 255, 0.72),\n      rgba(228, 238, 247, 0.88)),\n    repeating-linear-gradient(\n      45deg,\n      rgba(47, 86, 139, 0.08) 0 9px,\n      transparent 9px 18px);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.idea-editor-viewer-body {\n  flex: 1 1 auto;\n  min-height: 0;\n  min-width: 0;\n  width: 100%;\n  box-sizing: border-box;\n  overflow-y: auto;\n  overflow-x: hidden;\n  padding: 0 clamp(0.84rem, 2vw, 1.35rem) clamp(0.84rem, 2vw, 1.35rem);\n}\n.idea-editor-empty-image .mat-icon,\n.idea-editor-image-preview.is-empty .mat-icon {\n  width: 44px;\n  height: 44px;\n  font-size: 44px;\n  line-height: 44px;\n}\n.idea-editor-viewer-excerpt {\n  margin: 0;\n  color: #314d70;\n  font-size: 0.92rem;\n  font-weight: 800;\n  line-height: 1.48;\n}\n.idea-editor-fields {\n  display: grid;\n  grid-template-columns: minmax(0, 1fr);\n  gap: 0.52rem;\n}\n.idea-editor-field,\n.idea-editor-html-panel {\n  display: grid;\n  gap: 0.34rem;\n}\n.idea-editor-field-wide {\n  grid-column: 1/-1;\n}\n.idea-editor-field span,\n.idea-editor-html-head {\n  color: #45617f;\n  font-size: 0.74rem;\n  font-weight: 900;\n}\n.idea-editor-field input,\n.idea-editor-field textarea,\n.idea-editor-html-textarea {\n  width: 100%;\n  min-width: 0;\n  border: 1px solid rgba(47, 86, 139, 0.18);\n  border-radius: 8px;\n  background: #fff;\n  color: #1f385d;\n  font: inherit;\n  font-size: 0.84rem;\n  font-weight: 700;\n  outline: none;\n  box-sizing: border-box;\n}\n.idea-editor-field input {\n  height: 38px;\n  padding: 0 0.62rem;\n}\n.idea-editor-field textarea,\n.idea-editor-html-textarea {\n  resize: vertical;\n  padding: 0.54rem 0.62rem;\n  line-height: 1.45;\n}\n.idea-editor-field input:focus,\n.idea-editor-field textarea:focus,\n.idea-editor-html-textarea:focus {\n  border-color: rgba(35, 96, 160, 0.45);\n  box-shadow: 0 0 0 3px rgba(35, 96, 160, 0.1);\n}\n.idea-editor-html-panel {\n  border: 1px solid rgba(23, 33, 54, 0.12);\n  border-radius: 12px;\n  background: #fff;\n  padding: 0.6rem;\n}\n.idea-editor-html-head {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.5rem;\n}\n.idea-editor-html-textarea {\n  min-height: 300px;\n  font-family:\n    ui-monospace,\n    SFMono-Regular,\n    Menlo,\n    Monaco,\n    Consolas,\n    "Liberation Mono",\n    monospace;\n  font-size: 0.78rem;\n}\n.idea-editor-html-preview {\n  border: 1px solid rgba(47, 86, 139, 0.12);\n  border-radius: 10px;\n  background: #fff;\n  color: #243e62;\n  padding: 0.72rem;\n  font-size: 0.88rem;\n  line-height: 1.58;\n  overflow-wrap: anywhere;\n}\n.idea-editor-viewer-html {\n  width: 100%;\n  max-width: 100%;\n  min-width: 0;\n  box-sizing: border-box;\n  border: 0;\n  padding: 0;\n  background: transparent;\n  color: rgba(25, 48, 77, 0.92);\n  font-size: 0.96rem;\n  line-height: 1.62;\n  overflow-wrap: anywhere;\n  overflow-x: hidden;\n}\n.idea-editor-html-preview-body {\n  width: 100%;\n  max-width: 100%;\n  min-width: 0;\n  box-sizing: border-box;\n  overflow-x: hidden;\n}\n:host ::ng-deep .idea-editor-html-preview-body :is(img, video, iframe, table) {\n  max-width: 100%;\n  box-sizing: border-box;\n}\n:host ::ng-deep .idea-editor-html-preview-body :where(p, ul, ol, figure) {\n  margin: 0 0 0.72rem;\n}\n:host ::ng-deep .idea-editor-html-preview-body :where(h2, h3, h4) {\n  margin: 0.7rem 0 0.38rem;\n  color: #183456;\n  line-height: 1.2;\n}\n:host ::ng-deep .idea-editor-html-preview-body :where(img) {\n  display: block;\n  width: auto;\n  max-width: 100%;\n  height: auto;\n  border: 1px solid rgba(47, 86, 139, 0.12);\n  border-radius: 10px;\n  background: #edf4fb;\n  margin: 0.38rem 0 0.72rem;\n}\n:host ::ng-deep .idea-editor-viewer-html .idea-editor-html-preview-body :where(img) {\n  border: 0;\n  border-radius: 0;\n  background: transparent;\n  display: block;\n  width: auto;\n  max-width: 100%;\n  height: auto;\n  margin: 0 auto 0.72rem;\n}\n:host ::ng-deep .idea-editor-html-preview-body :where(figcaption) {\n  color: #667b95;\n  font-size: 0.78rem;\n  font-weight: 700;\n}\n@media (max-width: 760px) {\n  .idea-editor-fields {\n    grid-template-columns: 1fr;\n  }\n  .idea-editor-form-content {\n    padding: 0.66rem 0.72rem calc(0.72rem + env(safe-area-inset-bottom));\n    scrollbar-gutter: stable;\n  }\n  .idea-editor-viewer-body {\n    padding: 0.82rem 0.78rem 0.78rem;\n  }\n  .idea-editor-viewer-image {\n    min-height: 220px;\n  }\n}\n/*# sourceMappingURL=admin-idea-editor-popup.component.css.map */\n'] }]
  }], () => [], { ideaSmartList: [{
    type: ViewChild,
    args: ["ideaSmartList"]
  }], onEscape: [{
    type: HostListener,
    args: ["window:keydown.escape", ["$event"]]
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AdminIdeaEditorPopupComponent, { className: "AdminIdeaEditorPopupComponent", filePath: "app/admin/components/idea-editor-popup/admin-idea-editor-popup.component.ts", lineNumber: 156 });
})();
export {
  AdminIdeaEditorPopupComponent
};
//# sourceMappingURL=admin-idea-editor-popup.component-Y6ZQVWMR.js.map
