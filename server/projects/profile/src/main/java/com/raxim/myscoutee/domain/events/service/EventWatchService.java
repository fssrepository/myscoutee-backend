package com.raxim.myscoutee.domain.events.service;

import com.raxim.myscoutee.domain.accounts.service.HomeUserProfileService;
import com.raxim.myscoutee.domain.accounts.service.UserActivityCountersService;
import com.raxim.myscoutee.domain.platform.service.JobGroupScopeService;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;

import org.bson.types.ObjectId;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import com.raxim.myscoutee.domain.access.security.FriendshipFacts;
import org.springframework.util.StringUtils;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import com.raxim.myscoutee.domain.events.document.ActivityEvent;
import com.raxim.myscoutee.domain.events.document.EventWatchSubscription;
import com.raxim.myscoutee.domain.events.dto.EventsDtos.EventWatchActionResultDto;
import com.raxim.myscoutee.common.dto.SharedDtos.EventSlotOccurrenceDto;
import com.raxim.myscoutee.domain.events.repository.ActivityEventsRepository;
import com.raxim.myscoutee.domain.events.repository.EventWatchSubscriptionsRepository;
import com.raxim.myscoutee.domain.notifications.api.NotificationDelivery;
import com.raxim.myscoutee.domain.notifications.api.NotificationDelivery.NotificationIntent;

@Service
public class EventWatchService {
    @org.springframework.beans.factory.annotation.Autowired
    private com.raxim.myscoutee.domain.notifications.api.NotificationJobs groupRules;
    @org.springframework.beans.factory.annotation.Autowired
    private com.raxim.myscoutee.domain.platform.service.JobGroupScopeService jobGroupScope;
    @org.springframework.beans.factory.annotation.Autowired
    private com.raxim.myscoutee.common.config.mongo.ScheduledMongoSessionRunner groupDatabases;

    private static final String SYSTEM_USER_ID = "event-watchlist";
    private static final String DEFAULT_CLICK_URL = "/game";
    private static final String APP_BADGE_URL = "/assets/logo/heart.webp";

    private final EventWatchSubscriptionsRepository eventWatchSubscriptionsRepository;
    private final ActivityEventsRepository activityEventsRepository;
    private final HomeUserProfileService homeUserProfileService;
    private final FriendshipFacts friendshipFacts;
    private final UserActivityCountersService userActivityCountersService;
    private final NotificationDelivery notificationOutboxService;

    public EventWatchService(
            EventWatchSubscriptionsRepository eventWatchSubscriptionsRepository,
            ActivityEventsRepository activityEventsRepository,
            HomeUserProfileService homeUserProfileService,
            FriendshipFacts friendshipFacts,
            UserActivityCountersService userActivityCountersService,
            NotificationDelivery notificationOutboxService) {
        this.eventWatchSubscriptionsRepository = eventWatchSubscriptionsRepository;
        this.activityEventsRepository = activityEventsRepository;
        this.homeUserProfileService = homeUserProfileService;
        this.friendshipFacts = friendshipFacts;
        this.userActivityCountersService = userActivityCountersService;
        this.notificationOutboxService = notificationOutboxService;
    }

    public EventWatchActionResultDto watch(String requestedUserId, String requestedEventId) {
        String userId = resolveUserId(requestedUserId);
        ActivityEvent event = requireEvent(requestedEventId);
        String eventId = normalizeId(event.getSourceId());
        EventWatchSubscription existing = eventWatchSubscriptionsRepository
                .findByUserIdAndEventId(userId, eventId)
                .orElse(null);
        if (isAcceptedEventMember(event, userId)) {
            if (existing != null) {
                eventWatchSubscriptionsRepository.delete(existing);
                userActivityCountersService.refreshEventCountersForUsers(List.of(userId));
            }
            return result(userId, eventId, false, existing != null);
        }
        if (!isVisibleToOutsideWatcher(event, userId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Event was not found.");
        }
        if (existing != null) {
            return result(userId, eventId, true, false);
        }

        String nowIso = Instant.now().toString();
        EventWatchSubscription subscription = new EventWatchSubscription();
        subscription.setId(new ObjectId().toHexString());
        subscription.setSyncKey(UUID.randomUUID().toString());
        subscription.setUserId(userId);
        subscription.setEventId(eventId);
        subscription.setLastObservedFull(isFull(event));
        subscription.setLastObservedAvailableCapacity(availableCapacity(event));
        subscription.setCreatedDate(nowIso);
        subscription.setCreatedUser(userId);
        subscription.setUpdatedDate(nowIso);
        subscription.setUpdatedUser(userId);
        eventWatchSubscriptionsRepository.save(subscription);
        userActivityCountersService.refreshEventCountersForUsers(List.of(userId));
        return result(userId, eventId, true, true);
    }

    public EventWatchActionResultDto unwatch(String requestedUserId, String requestedEventId) {
        String userId = resolveUserId(requestedUserId);
        String eventId = normalizeId(requestedEventId);
        if (!StringUtils.hasText(eventId)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Event id is required.");
        }
        EventWatchSubscription existing = eventWatchSubscriptionsRepository
                .findByUserIdAndEventId(userId, eventId)
                .orElse(null);
        if (existing == null) {
            return result(userId, eventId, false, false);
        }
        eventWatchSubscriptionsRepository.delete(existing);
        userActivityCountersService.refreshEventCountersForUsers(List.of(userId));
        return result(userId, eventId, false, true);
    }

    public Set<String> watchedEventIds(String userId) {
        String normalizedUserId = normalizeId(userId);
        if (!StringUtils.hasText(normalizedUserId)) {
            return Set.of();
        }
        LinkedHashSet<String> eventIds = new LinkedHashSet<>();
        for (EventWatchSubscription subscription : eventWatchSubscriptionsRepository
                .findByUserIdOrderByUpdatedDateDesc(normalizedUserId)) {
            String eventId = normalizeId(subscription == null ? null : subscription.getEventId());
            if (StringUtils.hasText(eventId)) {
                eventIds.add(eventId);
            }
        }
        return eventIds;
    }

    @Scheduled(fixedDelayString = "${events.watchlist.check-delay-ms:60000}")
    public void notifyWhenEventBecomesAvailable() {
        groupDatabases.runAcrossConfiguredDatabases(() -> groupRules.runScheduledGroups("event-watchlist", this::notifyWhenEventBecomesAvailableInGroup));
    }

    private void notifyWhenEventBecomesAvailableInGroup() {
        List<EventWatchSubscription> subscriptions = jobGroupScope.findEventOwned(new org.springframework.data.mongodb.core.query.Query(), EventWatchSubscription.class, "eventId");
        if (subscriptions.isEmpty()) {
            return;
        }
        Set<String> eventIds = new LinkedHashSet<>();
        for (EventWatchSubscription subscription : subscriptions) {
            String eventId = normalizeId(subscription == null ? null : subscription.getEventId());
            if (StringUtils.hasText(eventId)) {
                eventIds.add(eventId);
            }
        }
        Map<String, ActivityEvent> eventsById = preferredEventsById(activityEventsRepository.findBySourceIdIn(eventIds));
        List<EventWatchSubscription> changed = new ArrayList<>();
        List<EventWatchSubscription> redundant = new ArrayList<>();
        Set<String> counterRefreshUserIds = new LinkedHashSet<>();
        String nowIso = Instant.now().toString();
        for (EventWatchSubscription subscription : subscriptions) {
            String eventId = normalizeId(subscription == null ? null : subscription.getEventId());
            ActivityEvent event = eventsById.get(eventId);
            if (subscription == null || event == null) {
                continue;
            }
            String userId = normalizeId(subscription.getUserId());
            if (isAcceptedEventMember(event, userId)) {
                redundant.add(subscription);
                counterRefreshUserIds.add(userId);
                continue;
            }
            boolean currentFull = isFull(event);
            boolean previousFull = Boolean.TRUE.equals(subscription.getLastObservedFull());
            int currentAvailableCapacity = availableCapacity(event);
            Integer previousAvailableCapacity = subscription.getLastObservedAvailableCapacity();
            boolean availabilityIncreased = previousAvailableCapacity == null
                    ? previousFull && !currentFull
                    : currentAvailableCapacity > Math.max(0, previousAvailableCapacity);
            if (availabilityIncreased && isVisibleToOutsideWatcher(event, userId)) {
                enqueueAvailabilityNotification(subscription, event);
            }
            if (!Objects.equals(subscription.getLastObservedFull(), currentFull)
                    || !Objects.equals(previousAvailableCapacity, currentAvailableCapacity)) {
                subscription.setLastObservedFull(currentFull);
                subscription.setLastObservedAvailableCapacity(currentAvailableCapacity);
                subscription.setUpdatedDate(nowIso);
                subscription.setUpdatedUser(SYSTEM_USER_ID);
                changed.add(subscription);
            }
        }
        if (!changed.isEmpty()) {
            eventWatchSubscriptionsRepository.saveAll(changed);
        }
        if (!redundant.isEmpty()) {
            eventWatchSubscriptionsRepository.deleteAll(redundant);
            userActivityCountersService.refreshEventCountersForUsers(counterRefreshUserIds);
        }
    }

    private EventWatchActionResultDto result(String userId, String eventId, boolean watched, boolean changed) {
        return new EventWatchActionResultDto(
                eventId,
                watched,
                changed,
                userActivityCountersService.readStoredEventCounters(userId));
    }

    private String resolveUserId(String requestedUserId) {
        var user = homeUserProfileService.resolveCurrentUser(requestedUserId);
        String userId = normalizeId(user == null ? null : user.getId());
        if (!StringUtils.hasText(userId)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Active user is required.");
        }
        return userId;
    }

    private ActivityEvent requireEvent(String requestedEventId) {
        String eventId = normalizeId(requestedEventId);
        if (!StringUtils.hasText(eventId)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Event id is required.");
        }
        ActivityEvent event = preferredEventsById(activityEventsRepository.findBySourceId(eventId)).get(eventId);
        if (event == null || !"A".equals(safeText(event.getStatus())) || Boolean.TRUE.equals(event.getIsTrashed())) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Event was not found.");
        }
        return event;
    }

    private Map<String, ActivityEvent> preferredEventsById(Collection<ActivityEvent> events) {
        Map<String, ActivityEvent> result = new LinkedHashMap<>();
        (events == null ? List.<ActivityEvent>of() : events).stream()
                .filter(Objects::nonNull)
                .filter(event -> !Boolean.TRUE.equals(event.getGenerated()))
                .filter(event -> !StringUtils.hasText(normalizeId(event.getParentEventId())))
                .sorted(Comparator.comparingInt(this::preferenceScore).reversed())
                .forEach(event -> result.putIfAbsent(normalizeId(event.getSourceId()), event));
        result.remove(null);
        return result;
    }

    private int preferenceScore(ActivityEvent event) {
        int score = normalizeId(event.getOwnerUserId()).equals(normalizeId(event.getCreatorUserId())) ? 100 : 0;
        if ("A".equals(safeText(event.getStatus()))) {
            score += 10;
        }
        return score;
    }

    private boolean isFull(ActivityEvent event) {
        if (event == null) {
            return false;
        }
        if (Boolean.TRUE.equals(event.getSlotsEnabled()) && !Boolean.TRUE.equals(event.getGenerated())) {
            List<EventSlotOccurrenceDto> slots = event.getUpcomingSlots();
            return slots == null || slots.isEmpty() || slots.stream().allMatch(this::isFull);
        }
        if (Boolean.TRUE.equals(event.getFull())) {
            return true;
        }
        int capacity = Math.max(0, event.getCapacityTotal() == null ? 0 : event.getCapacityTotal());
        int accepted = Math.max(0, event.getAcceptedMembers() == null ? 0 : event.getAcceptedMembers());
        return capacity > 0 && accepted >= capacity;
    }

    private boolean isFull(EventSlotOccurrenceDto slot) {
        if (slot == null) {
            return false;
        }
        int capacity = Math.max(0, slot.capacityTotal() == null ? 0 : slot.capacityTotal());
        int accepted = Math.max(0, slot.acceptedMembers() == null ? 0 : slot.acceptedMembers());
        return capacity > 0 && accepted >= capacity;
    }

    private int availableCapacity(ActivityEvent event) {
        if (event == null) {
            return 0;
        }
        if (Boolean.TRUE.equals(event.getSlotsEnabled()) && !Boolean.TRUE.equals(event.getGenerated())) {
            return (event.getUpcomingSlots() == null ? List.<EventSlotOccurrenceDto>of() : event.getUpcomingSlots())
                    .stream()
                    .filter(Objects::nonNull)
                    .mapToInt(this::availableCapacity)
                    .sum();
        }
        if (Boolean.TRUE.equals(event.getFull())) {
            return 0;
        }
        int capacity = Math.max(0, event.getCapacityTotal() == null ? 0 : event.getCapacityTotal());
        int accepted = Math.max(0, event.getAcceptedMembers() == null ? 0 : event.getAcceptedMembers());
        return capacity > 0 ? Math.max(0, capacity - accepted) : 0;
    }

    private int availableCapacity(EventSlotOccurrenceDto slot) {
        int capacity = Math.max(0, slot.capacityTotal() == null ? 0 : slot.capacityTotal());
        int accepted = Math.max(0, slot.acceptedMembers() == null ? 0 : slot.acceptedMembers());
        return capacity > 0 ? Math.max(0, capacity - accepted) : 0;
    }

    private boolean isAcceptedEventMember(ActivityEvent event, String userId) {
        String normalizedUserId = normalizeId(userId);
        if (event == null || !StringUtils.hasText(normalizedUserId)) {
            return false;
        }
        if (normalizedUserId.equals(normalizeId(event.getCreatorUserId()))
                || normalizedUserId.equals(normalizeId(event.getOwnerUserId()))) {
            return true;
        }
        return (event.getAcceptedMemberUserIds() == null ? List.<String>of() : event.getAcceptedMemberUserIds())
                .stream()
                .map(this::normalizeId)
                .anyMatch(normalizedUserId::equals);
    }

    private boolean isVisibleToOutsideWatcher(ActivityEvent event, String userId) {
        String normalizedUserId = normalizeId(userId);
        if (event == null
                || !StringUtils.hasText(normalizedUserId)
                || !"A".equals(safeText(event.getStatus()))
                || !Boolean.TRUE.equals(event.getPublished())
                || Boolean.TRUE.equals(event.getIsTrashed())) {
            return false;
        }
        String visibility = safeText(event.getVisibility());
        if ("Invitation only".equals(visibility)) {
            return false;
        }
        return !"Friends only".equals(visibility)
                || isFriendOfActiveUser(normalizeId(event.getCreatorUserId()), normalizedUserId);
    }

    private boolean isFriendOfActiveUser(String userId, String activeUserId) {
        return friendshipFacts.areFriends(userId, activeUserId);
    }

    private int hashText(String value) {
        int hash = 0;
        for (int index = 0; index < value.length(); index += 1) {
            hash = (hash * 31 + value.charAt(index)) % 104729;
        }
        return Math.abs(hash);
    }

    private void enqueueAvailabilityNotification(EventWatchSubscription subscription, ActivityEvent event) {
        String eventId = normalizeId(event.getSourceId());
        String userId = normalizeId(subscription.getUserId());
        if (!StringUtils.hasText(eventId) || !StringUtils.hasText(userId)) {
            return;
        }
        String title = firstNonBlank(event.getTitle(), "Event available");
        Map<String, String> payload = new LinkedHashMap<>();
        payload.put("eventId", eventId);
        payload.put("eventTitle", title);
        payload.put("eventScope", "watchlist");
        payload.put("notification_title_key", "notification.event.watchlist.available.title");
        payload.put("notification_message_key", "notification.event.watchlist.available.message");
        payload.put("notification_tone", "success");
        payload.put("notification_avatar_icon", "visibility");
        notificationOutboxService.enqueue(new NotificationIntent(
                "event-watchlist-available",
                "event",
                eventId,
                "event-watchers",
                List.of(userId),
                title,
                "A new spot is available. Open the event to book it.",
                DEFAULT_CLICK_URL,
                firstNonBlank(event.getImageUrl(), APP_BADGE_URL),
                APP_BADGE_URL,
                "event-watchlist-available-" + eventId + "-" + userId,
                payload,
                SYSTEM_USER_ID));
    }

    private String firstNonBlank(String first, String fallback) {
        return StringUtils.hasText(safeText(first)) ? safeText(first) : fallback;
    }

    private String normalizeId(String value) {
        return safeText(value);
    }

    private String safeText(String value) {
        return value == null ? "" : value.trim();
    }
}
