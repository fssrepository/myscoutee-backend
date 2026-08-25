import {
  NotificationCenterStore
} from "./chunk-LDEYTBOX.js";
import "./chunk-SYKOEE4K.js";
import {
  SmartListComponent
} from "./chunk-IJVUZ62I.js";
import {
  NotificationSingleRowConverter
} from "./chunk-RJSPRCFL.js";
import {
  SingleRowComponent
} from "./chunk-BEAS7CFC.js";
import "./chunk-YTMD6HU4.js";
import "./chunk-QEZI4ZBE.js";
import {
  PopupComponent
} from "./chunk-3VXLUVWM.js";
import "./chunk-VEYRCVMX.js";
import "./chunk-MVR37RGJ.js";
import "./chunk-FOAFZS65.js";
import {
  DialogStore
} from "./chunk-6TR3Z2F3.js";
import "./chunk-EDHGCWPF.js";
import "./chunk-CUDLB52K.js";
import "./chunk-FJQMGJUW.js";
import "./chunk-HUL5TV72.js";
import "./chunk-PK4DOAMC.js";
import "./chunk-GEAUBJJD.js";
import "./chunk-5PHTFUHA.js";
import "./chunk-F4WY6ECV.js";
import {
  I18nService
} from "./chunk-Q3344WPR.js";
import {
  AppUtils
} from "./chunk-XQ4NDAVX.js";
import "./chunk-4FWVIYNI.js";
import "./chunk-7MTG4XZU.js";
import "./chunk-J7IJFFQ2.js";
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
  ChangeDetectionStrategy,
  Component,
  ViewChild,
  computed,
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
  ɵɵreference,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtemplate,
  ɵɵtemplateRefExtractor,
  ɵɵviewQuery
} from "./chunk-XJL7SWH7.js";

// src/app/shared/ui/components/notification-center-popup/notification-center-popup.component.ts
var _c0 = ["notificationsSmartList"];
function NotificationCenterPopupComponent_Conditional_0_ng_template_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "single-row", 5);
    \u0275\u0275listener("menuRequest", function NotificationCenterPopupComponent_Conditional_0_ng_template_4_Template_single_row_menuRequest_0_listener($event) {
      const openMenu_r4 = \u0275\u0275restoreView(_r3).openMenu;
      return \u0275\u0275resetView(openMenu_r4($event));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const notification_r5 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("row", ctx_r1.notificationRow(notification_r5))("useSharedMenu", true)("sharedMenuContext", ctx_r1.rowMenuContext(notification_r5));
  }
}
function NotificationCenterPopupComponent_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "app-popup", 2)(1, "section", 3)(2, "app-smart-list", 4, 0);
    \u0275\u0275listener("menuItemSelect", function NotificationCenterPopupComponent_Conditional_0_Template_app_smart_list_menuItemSelect_2_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onRowMenuSelect($event));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275template(4, NotificationCenterPopupComponent_Conditional_0_ng_template_4_Template, 1, 3, "ng-template", null, 1, \u0275\u0275templateRefExtractor);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const notificationRowTemplate_r6 = \u0275\u0275reference(5);
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("model", ctx_r1.popupModel())("zIndex", 22e3);
    \u0275\u0275advance(2);
    \u0275\u0275property("config", ctx_r1.smartListConfig)("loadPage", ctx_r1.loadPage)("query", ctx_r1.query())("itemTemplate", notificationRowTemplate_r6);
  }
}
var NotificationCenterPopupComponent = class _NotificationCenterPopupComponent {
  notificationsSmartList;
  store = inject(NotificationCenterStore);
  dialogStore = inject(DialogStore);
  i18n = inject(I18nService);
  converter = new NotificationSingleRowConverter();
  query = computed(() => ({
    page: 0,
    pageSize: 20,
    sort: "createdAt",
    direction: "desc",
    filters: { bucket: this.store.bucket() }
  }), ...ngDevMode ? [{ debugName: "query" }] : (
    /* istanbul ignore next */
    []
  ));
  bucketMenuItems = computed(() => {
    const bucket = this.store.bucket();
    const unreadCount = this.store.unreadCount();
    return ["new", "all"].map((value) => ({
      id: `notification-bucket:${value}`,
      kind: "radio",
      label: value === "new" ? "New" : "All",
      icon: value === "new" ? "fiber_new" : "notifications",
      palette: value === "new" ? "rose" : "violet",
      surface: "tinted",
      active: bucket === value,
      counter: value === "new" && unreadCount > 0 ? { value: unreadCount, max: 99 } : null,
      counterTone: value === "new" ? "alert" : "default",
      ariaLabel: value === "new" ? `${unreadCount} new notifications` : "All notifications",
      context: { action: "set-bucket", bucket: value }
    }));
  }, ...ngDevMode ? [{ debugName: "bucketMenuItems" }] : (
    /* istanbul ignore next */
    []
  ));
  smartListConfig = {
    pageSize: 20,
    defaultView: "list",
    defaultSort: "createdAt",
    defaultDirection: "desc",
    defaultFilters: { bucket: "new" },
    emptyLabel: "No notifications",
    emptyDescription: "New messages and updates will appear here.",
    showStickyHeader: false,
    listLayout: "stack",
    snapMode: "none",
    scrollPaddingTop: "0.5rem",
    pollIntervalMs: () => this.store.pollIntervalMs(),
    pollDelta: {
      revision: (item) => item.revision,
      position: (item) => item.createdAtIso,
      load: (query, snapshot, context) => from(this.store.sync(this.notificationSyncRequest(query.filters?.bucket, query.pageSize, snapshot), context?.signal))
    },
    headerProgress: {
      enabled: true,
      placement: "inline",
      tone: "accent"
    },
    cacheable: {
      identity: (item) => item.id
    },
    sortable: {
      sortKey: (item) => [
        -this.notificationDateMs(item.createdAtIso),
        item.id
      ]
    },
    groupBy: (item) => this.notificationDateGroupLabel(item.createdAtIso),
    showFirstGroupMarker: true,
    containerClass: {
      "notification-center-smart-list": true
    },
    trackBy: (_index, item) => item.id
  };
  notificationSyncRequest(bucket, pageSize, snapshot) {
    return {
      bucket: bucket === "new" ? "new" : "all",
      limit: Math.max(1, Math.trunc(Number(pageSize) || 20)),
      knownItems: snapshot.knownItems.map((item) => ({
        id: item.id,
        revision: Math.max(1, Math.trunc(Number(item.revision) || 1))
      })),
      loadedTail: snapshot.loadedTail ? {
        id: snapshot.loadedTail.id,
        createdAtIso: `${snapshot.loadedTail.position}`
      } : null
    };
  }
  loadPage = (query, context) => from(this.store.queryPage(query, context?.signal));
  popupModel() {
    const muted = this.store.muted();
    const unreadCount = this.store.unreadCount();
    return {
      title: "Notifications",
      subtitle: unreadCount === 1 ? "1 new notification" : `${unreadCount} new notifications`,
      ariaLabel: "Notifications",
      closeAriaLabel: "Close notifications",
      size: "wide",
      height: "full",
      bodyLayout: "fill",
      headerTone: "accent",
      headerPalette: "violet",
      headerControls: [
        {
          kind: "menu",
          id: "notification-bucket",
          trigger: this.bucketMenuTrigger(),
          items: this.bucketMenuItems(),
          panelAlign: "end"
        },
        {
          kind: "menu",
          id: "notification-attention-preference",
          menuKind: "inline",
          closeOnSelect: false,
          items: [
            {
              id: "notification-attention-toggle",
              kind: "toggle",
              icon: muted ? "notifications_off" : "notifications_active",
              layout: "icon",
              palette: muted ? "slate" : "violet",
              active: muted,
              checked: muted,
              closeOnSelect: false,
              ariaLabel: muted ? "Unmute notification alerts" : "Mute notification alerts",
              context: { action: "toggle-muted" }
            }
          ]
        }
      ],
      onClose: () => this.store.close(),
      onMenuSelect: (event) => this.onHeaderMenuSelect(event)
    };
  }
  notificationRow(notification) {
    return this.converter.convert(notification, {
      progressRing: this.store.isMarkReadPending(notification.id),
      translate: (key, fallback) => this.i18n.translate(key, fallback)
    });
  }
  notificationDateGroupLabel(value) {
    const groupDate = new Date(value);
    return Number.isNaN(groupDate.getTime()) ? "Date unavailable" : AppUtils.smartListDayLabel(groupDate);
  }
  notificationDateMs(value) {
    const timestamp = Date.parse(value);
    return Number.isFinite(timestamp) ? timestamp : Number.NEGATIVE_INFINITY;
  }
  rowMenuContext(notification) {
    return { notification };
  }
  onRowMenuSelect(event) {
    const context = event.context;
    const notification = context?.notification;
    const actionId = `${context?.action?.id ?? event.id ?? ""}`.trim();
    if (!notification || actionId !== "markNotificationRead" || notification.readAtIso || this.store.isMarkReadPending(notification.id)) {
      return;
    }
    event.sourceEvent.preventDefault();
    event.sourceEvent.stopPropagation();
    void this.markRead(notification);
  }
  onHeaderMenuSelect(event) {
    if (event.itemSelect.context?.action === "set-bucket") {
      const bucket = event.itemSelect.context.bucket;
      if (bucket !== this.store.bucket()) {
        this.store.setBucket(bucket);
      }
      return;
    }
    if (event.itemSelect.id !== "notification-attention-toggle" || event.itemSelect.context?.action !== "toggle-muted") {
      return;
    }
    event.itemSelect.sourceEvent.preventDefault();
    event.itemSelect.sourceEvent.stopPropagation();
    this.confirmMutedChange(!this.store.muted());
  }
  bucketMenuTrigger() {
    const bucket = this.store.bucket();
    const unreadCount = this.store.unreadCount();
    return {
      label: bucket === "new" ? "New" : "All",
      icon: bucket === "new" ? "fiber_new" : "notifications",
      palette: bucket === "new" ? "rose" : "violet",
      layout: "pill",
      counter: bucket === "new" && unreadCount > 0 ? { value: unreadCount, max: 99 } : null,
      ariaLabel: bucket === "new" ? `${unreadCount} new notifications` : "All notifications"
    };
  }
  confirmMutedChange(muted) {
    this.dialogStore.open({
      title: muted ? "Mute notification alerts?" : "Unmute notification alerts?",
      message: muted ? "New notifications will still be counted and saved, but the floating alert button will stay hidden until you unmute it." : "The floating alert button can appear again when a new notification arrives.",
      confirmLabel: muted ? "Mute alerts" : "Unmute alerts",
      busyConfirmLabel: muted ? "Muting..." : "Unmuting...",
      confirmTone: muted ? "warning" : "accent",
      confirmPalette: muted ? "warning" : "violet",
      ringPerimeter: 112,
      onConfirm: async () => {
        await this.store.setMuted(muted);
      }
    });
  }
  async markRead(notification) {
    try {
      const updated = await this.store.markRead(notification.id);
      if (this.store.bucket() === "new") {
        this.notificationsSmartList?.removeVisibleItemByIdentity(notification.id, {
          totalDelta: -1
        });
        return;
      }
      this.notificationsSmartList?.patchVisibleItem((item) => item.id === notification.id, () => updated);
    } catch (error) {
      this.dialogStore.openInfo(error instanceof Error && error.message.trim() ? error.message : "Unable to mark this notification as read.", {
        title: "Notification update failed",
        confirmTone: "danger"
      });
    }
  }
  static \u0275fac = function NotificationCenterPopupComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NotificationCenterPopupComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _NotificationCenterPopupComponent, selectors: [["app-notification-center-popup"]], viewQuery: function NotificationCenterPopupComponent_Query(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275viewQuery(_c0, 5);
    }
    if (rf & 2) {
      let _t;
      \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.notificationsSmartList = _t.first);
    }
  }, decls: 1, vars: 1, consts: [["notificationsSmartList", ""], ["notificationRowTemplate", ""], [3, "model", "zIndex"], [1, "notification-center-popup__body"], [1, "notification-center-popup__list", 3, "menuItemSelect", "config", "loadPage", "query", "itemTemplate"], [3, "menuRequest", "row", "useSharedMenu", "sharedMenuContext"]], template: function NotificationCenterPopupComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275conditionalCreate(0, NotificationCenterPopupComponent_Conditional_0_Template, 6, 6, "app-popup", 2);
    }
    if (rf & 2) {
      \u0275\u0275conditional(ctx.store.isOpen() ? 0 : -1);
    }
  }, dependencies: [
    PopupComponent,
    SmartListComponent,
    SingleRowComponent
  ], styles: ["\n[_nghost-%COMP%] {\n  display: contents;\n}\n.notification-center-popup__body[_ngcontent-%COMP%] {\n  display: flex;\n  min-height: 0;\n  height: 100%;\n  flex-direction: column;\n  background:\n    linear-gradient(\n      180deg,\n      rgba(237, 233, 254, 0.56),\n      rgba(248, 250, 252, 0) 7rem),\n    #f8fafc;\n}\n.notification-center-popup__list[_ngcontent-%COMP%] {\n  display: flex;\n  min-height: 0;\n  flex: 1 1 auto;\n}\n/*# sourceMappingURL=notification-center-popup.component.css.map */"], changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NotificationCenterPopupComponent, [{
    type: Component,
    args: [{ selector: "app-notification-center-popup", standalone: true, imports: [
      PopupComponent,
      SmartListComponent,
      SingleRowComponent
    ], changeDetection: ChangeDetectionStrategy.OnPush, template: '@if (store.isOpen()) {\n  <app-popup [model]="popupModel()" [zIndex]="22000">\n    <section class="notification-center-popup__body">\n      <app-smart-list\n        #notificationsSmartList\n        class="notification-center-popup__list"\n        [config]="smartListConfig"\n        [loadPage]="loadPage"\n        [query]="query()"\n        [itemTemplate]="notificationRowTemplate"\n        (menuItemSelect)="onRowMenuSelect($event)"\n      ></app-smart-list>\n\n      <ng-template\n        #notificationRowTemplate\n        let-notification\n        let-openMenu="openMenu"\n      >\n        <single-row\n          [row]="notificationRow(notification)"\n          [useSharedMenu]="true"\n          [sharedMenuContext]="rowMenuContext(notification)"\n          (menuRequest)="openMenu($event)"\n        ></single-row>\n      </ng-template>\n    </section>\n  </app-popup>\n}\n', styles: ["/* src/app/shared/ui/components/notification-center-popup/notification-center-popup.component.scss */\n:host {\n  display: contents;\n}\n.notification-center-popup__body {\n  display: flex;\n  min-height: 0;\n  height: 100%;\n  flex-direction: column;\n  background:\n    linear-gradient(\n      180deg,\n      rgba(237, 233, 254, 0.56),\n      rgba(248, 250, 252, 0) 7rem),\n    #f8fafc;\n}\n.notification-center-popup__list {\n  display: flex;\n  min-height: 0;\n  flex: 1 1 auto;\n}\n/*# sourceMappingURL=notification-center-popup.component.css.map */\n"] }]
  }], null, { notificationsSmartList: [{
    type: ViewChild,
    args: ["notificationsSmartList"]
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(NotificationCenterPopupComponent, { className: "NotificationCenterPopupComponent", filePath: "app/shared/ui/components/notification-center-popup/notification-center-popup.component.ts", lineNumber: 68 });
})();
export {
  NotificationCenterPopupComponent
};
//# sourceMappingURL=notification-center-popup.component-2PRMMUGR.js.map
