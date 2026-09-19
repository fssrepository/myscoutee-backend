import {
  HttpEventsService,
  LocalEventsService,
  UsersService
} from "./chunk-RP5GBSNO.js";
import {
  BaseRouteModeService
} from "./chunk-7B4ZHEVS.js";
import {
  UserProfileStore
} from "./chunk-IEWB22H3.js";
import {
  RouteDelayService
} from "./chunk-UKS3QROH.js";
import {
  AppUtils
} from "./chunk-CYVMX3LD.js";
import {
  Injectable,
  __spreadProps,
  __spreadValues,
  inject,
  setClassMetadata,
  ɵɵdefineInjectable,
  ɵɵgetInheritedFactory
} from "./chunk-EV3I3YNV.js";

// src/app/shared/core/base/services/events.service.ts
var EventsService = class _EventsService extends BaseRouteModeService {
  static EVENTS_EXPLORE_ROUTE = "/activities/events/explore";
  localEventsService = inject(LocalEventsService);
  httpEventsService = inject(HttpEventsService);
  userProfileStore = inject(UserProfileStore);
  usersService = inject(UsersService);
  routeDelay = inject(RouteDelayService);
  get localModeEnabled() {
    return this.isLocalRouteEnabled("/activities/events");
  }
  get eventsService() {
    return this.resolveRouteService("/activities/events", this.localEventsService, this.httpEventsService);
  }
  queryItemsByUser(userId) {
    return this.eventsService.queryItemsByUser(userId);
  }
  peekItemsByUser(userId) {
    return this.eventsService.peekItemsByUser(userId);
  }
  queryInvitationItemsByUser(userId) {
    return this.eventsService.queryInvitationItemsByUser(userId);
  }
  queryEventItemsByUser(userId) {
    return this.eventsService.queryEventItemsByUser(userId);
  }
  queryTrashedItemsByUser(userId) {
    return this.eventsService.queryTrashedItemsByUser(userId);
  }
  async queryActivitiesEventDTOPage(userId, query, signal) {
    if (this.isLocalRouteEnabled("/activities/events")) {
      return this.localEventsService.queryActivitiesEventDTOPage(userId, query, signal);
    }
    return this.httpEventsService.queryActivitiesEventDTOPage(userId, query, signal);
  }
  async loadActivityEvents(query, options = {}) {
    const activeUserId = this.resolveActiveUserId();
    const page = await this.queryActivitiesEventDTOPage(activeUserId, query, options.signal);
    if (this.isCalendarActivitiesView(query.view) && query.filters?.eventScopeFilter !== "trash") {
      const items = AppUtils.filterItemsByDateOnlyRange(page.items, query.rangeStart, query.rangeEnd, (item) => item.startAtIso, (item) => item.endAtIso);
      return {
        items,
        total: items.length,
        context: { eventCounters: page.eventCounters }
      };
    }
    return {
      items: page.items,
      total: page.total,
      nextCursor: page.nextCursor,
      context: { eventCounters: page.eventCounters }
    };
  }
  async saveActivityEvent(payload) {
    return this.eventsService.saveActivityEvent(payload);
  }
  queryExploreItems(userId) {
    return this.eventsService.queryExploreItems(userId);
  }
  peekExploreItems(userId) {
    return this.eventsService.peekExploreItems(userId);
  }
  async queryEventExplorePage(query) {
    if (this.isLocalRouteEnabled("/activities/events")) {
      return this.localEventsService.queryEventExplorePage(query);
    }
    return this.httpEventsService.queryEventExplorePage(query);
  }
  explorePollIntervalMs() {
    return this.routeDelay.resolveIntervalMs(_EventsService.EVENTS_EXPLORE_ROUTE);
  }
  peekEventExplorePage(query) {
    if (this.isLocalRouteEnabled("/activities/events")) {
      return this.localEventsService.peekEventExplorePage(query);
    }
    return this.httpEventsService.peekEventExplorePage(query);
  }
  peekKnownItemById(userId, itemId) {
    const normalizedItemId = itemId.trim();
    if (!normalizedItemId) {
      return null;
    }
    return this.eventsService.peekKnownItemById(userId, normalizedItemId);
  }
  peekKnownRecordById(userId, itemId) {
    const normalizedItemId = itemId.trim();
    if (!normalizedItemId) {
      return null;
    }
    const known = [
      ...this.eventsService.peekItemsByUser(userId),
      ...this.eventsService.peekExploreItems(userId)
    ];
    return known.find((record) => record.id === normalizedItemId) ?? null;
  }
  async queryKnownRecordById(userId, itemId) {
    const normalizedItemId = itemId.trim();
    if (!normalizedItemId) {
      return null;
    }
    const cached = this.peekKnownRecordById(userId, normalizedItemId);
    if (cached) {
      return cached;
    }
    const [owned, explore] = await Promise.all([
      this.eventsService.queryItemsByUser(userId),
      this.eventsService.queryExploreItems(userId)
    ]);
    return [...owned, ...explore].find((record) => record.id === normalizedItemId) ?? null;
  }
  async loadEventDetailById(userId, eventId) {
    const normalizedUserId = userId.trim();
    const normalizedEventId = eventId.trim();
    if (!normalizedUserId || !normalizedEventId) {
      return null;
    }
    return this.eventsService.loadEventDetailById(normalizedUserId, normalizedEventId);
  }
  async loadInvitationContext(userId, eventId) {
    const normalizedUserId = userId.trim();
    const normalizedEventId = eventId.trim();
    if (!normalizedUserId || !normalizedEventId) {
      return null;
    }
    return this.eventsService.loadInvitationContext(normalizedUserId, normalizedEventId);
  }
  async loadSubEventsById(userId, eventId, query) {
    const normalizedUserId = userId.trim();
    const normalizedEventId = eventId.trim();
    if (!normalizedUserId || !normalizedEventId) {
      return null;
    }
    return this.eventsService.loadSubEventsById(normalizedUserId, normalizedEventId, query);
  }
  async loadCheckoutSlots(query) {
    const normalizedUserId = query.userId?.trim();
    const normalizedEventId = query.eventId?.trim();
    if (!normalizedUserId || !normalizedEventId) {
      return null;
    }
    return this.eventsService.loadCheckoutSlots(__spreadProps(__spreadValues({}, query), {
      userId: normalizedUserId,
      eventId: normalizedEventId
    }));
  }
  async loadCheckoutBasketByEvent(userId, sourceId) {
    const normalizedUserId = userId.trim();
    const normalizedSourceId = sourceId.trim();
    if (!normalizedUserId || !normalizedSourceId) {
      return null;
    }
    return this.eventsService.loadCheckoutBasketByEvent(normalizedUserId, normalizedSourceId);
  }
  async loadCheckoutPaymentAudit(userId, sourceId, paymentSessionId) {
    const normalizedUserId = userId.trim();
    const normalizedSourceId = sourceId.trim();
    const normalizedPaymentSessionId = paymentSessionId.trim();
    if (!normalizedUserId || !normalizedSourceId || !normalizedPaymentSessionId) {
      return null;
    }
    return this.eventsService.loadCheckoutPaymentAudit(normalizedUserId, normalizedSourceId, normalizedPaymentSessionId);
  }
  async validateCheckoutPromoCode(request) {
    const normalizedSourceId = request.sourceId?.trim();
    if (!normalizedSourceId) {
      return null;
    }
    return this.eventsService.validateCheckoutPromoCode({
      sourceId: normalizedSourceId,
      code: `${request.code ?? ""}`.trim().toUpperCase()
    });
  }
  async saveCheckoutBasket(request) {
    const normalizedUserId = request.userId?.trim();
    const normalizedSourceId = request.sourceId?.trim();
    if (!normalizedUserId || !normalizedSourceId) {
      return null;
    }
    return this.eventsService.saveCheckoutBasket(__spreadProps(__spreadValues({}, request), {
      userId: normalizedUserId,
      sourceId: normalizedSourceId
    }));
  }
  async updateCheckoutBasketState(request) {
    const normalizedUserId = request.userId?.trim();
    const normalizedSourceId = request.sourceId?.trim();
    if (!normalizedUserId || !normalizedSourceId) {
      return null;
    }
    return this.eventsService.updateCheckoutBasketState(__spreadProps(__spreadValues({}, request), {
      userId: normalizedUserId,
      sourceId: normalizedSourceId
    }));
  }
  async payEventCheckout(request, provider) {
    const normalizedUserId = request.userId?.trim();
    const normalizedSourceId = request.sourceId?.trim();
    if (!normalizedUserId || !normalizedSourceId) {
      return null;
    }
    return this.eventsService.payEventCheckout(__spreadProps(__spreadValues({}, request), {
      userId: normalizedUserId,
      sourceId: normalizedSourceId
    }), provider);
  }
  trashItem(userId, sourceId) {
    return this.eventsService.trashItem(userId, sourceId);
  }
  publishItem(userId, sourceId) {
    return this.eventsService.publishItem(userId, sourceId);
  }
  unpublishItem(userId, sourceId) {
    return this.eventsService.unpublishItem(userId, sourceId);
  }
  restoreItem(userId, sourceId) {
    return this.eventsService.restoreItem(userId, sourceId);
  }
  watchEvent(userId, sourceId) {
    return this.eventsService.watchEvent(userId, sourceId);
  }
  unwatchEvent(userId, sourceId) {
    return this.eventsService.unwatchEvent(userId, sourceId);
  }
  takeOverItem(userId, sourceId) {
    return this.eventsService.takeOverItem(userId, sourceId);
  }
  waitForEventMutationDelay() {
    return this.eventsService.waitForEventMutationDelay();
  }
  applyStageAction(request) {
    return this.eventsService.applyStageAction(request);
  }
  querySubEventLeaderboard(eventId, subEventId) {
    return this.eventsService.querySubEventLeaderboard(eventId, subEventId);
  }
  queryTournamentGroups(query) {
    return this.eventsService.queryTournamentGroups(query);
  }
  queryTournamentStageGroups(query) {
    return this.eventsService.queryTournamentStageGroups(query);
  }
  queryTournamentStageSnapshot(query) {
    return this.eventsService.queryTournamentStageSnapshot(query);
  }
  saveTournamentGroup(request) {
    return this.eventsService.saveTournamentGroup(request);
  }
  deleteTournamentGroup(request) {
    return this.eventsService.deleteTournamentGroup(request);
  }
  upsertSubEventLeaderboardEntry(request) {
    return this.eventsService.upsertSubEventLeaderboardEntry(request);
  }
  requestJoin(userId, sourceId, options = {}) {
    return this.eventsService.requestJoin(userId, sourceId, options);
  }
  leaveEvent(userId, sourceId, options = {}) {
    return this.eventsService.leaveEvent(userId, sourceId, options);
  }
  createCheckoutSession(request) {
    return this.eventsService.createCheckoutSession(request);
  }
  authorizeCheckout(request) {
    return this.eventsService.authorizeCheckout(request);
  }
  payCheckoutSession(request, paymentSessionId) {
    return this.eventsService.payCheckoutSession(request, paymentSessionId);
  }
  queryEventFeedbackStates(userId) {
    return this.eventsService.queryEventFeedbackStates(userId);
  }
  queryReceivedEventFeedback(userId) {
    return this.eventsService.queryReceivedEventFeedback(userId);
  }
  loadEventFeedbackPage(query) {
    return this.eventsService.loadEventFeedbackPage(query);
  }
  loadEventFeedbackStatById(query) {
    return this.eventsService.loadEventFeedbackStatById(query);
  }
  loadEventFeedback(query) {
    return this.eventsService.loadEventFeedback(query);
  }
  submitEventFeedback(userId, request) {
    return this.eventsService.submitEventFeedback(userId, request);
  }
  saveEventFeedbackNote(request) {
    return this.eventsService.saveEventFeedbackNote(request);
  }
  removeEventFeedbackEvent(userId, eventId) {
    return this.eventsService.removeEventFeedbackEvent(userId, eventId);
  }
  restoreEventFeedbackEvent(userId, eventId) {
    return this.eventsService.restoreEventFeedbackEvent(userId, eventId);
  }
  async syncEventSnapshot(payload) {
    return this.eventsService.syncEventSnapshot(payload);
  }
  resolveActiveUserId() {
    const activeUserProfileId = this.userProfileStore.activeUserProfile()?.id?.trim();
    if (activeUserProfileId) {
      return activeUserProfileId;
    }
    const activeUserId = this.userProfileStore.getActiveUserId().trim();
    if (activeUserId) {
      return activeUserId;
    }
    const session = this.sessionService.currentSession();
    if (session?.kind === "demo" && session.userId.trim().length > 0) {
      return session.userId.trim();
    }
    if (session?.kind === "firebase" && session.profile.id.trim().length > 0) {
      return session.profile.id.trim();
    }
    return this.usersService.peekCachedUsers()[0]?.id ?? "";
  }
  isCalendarActivitiesView(view) {
    return view === "week" || view === "month";
  }
  static \u0275fac = /* @__PURE__ */ (() => {
    let \u0275EventsService_BaseFactory;
    return function EventsService_Factory(__ngFactoryType__) {
      return (\u0275EventsService_BaseFactory || (\u0275EventsService_BaseFactory = \u0275\u0275getInheritedFactory(_EventsService)))(__ngFactoryType__ || _EventsService);
    };
  })();
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _EventsService, factory: _EventsService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(EventsService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

export {
  EventsService
};
//# sourceMappingURL=chunk-LFVP4M73.js.map
