package com.raxim.myscoutee.profile.service;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.time.format.DateTimeParseException;
import java.time.temporal.ChronoUnit;
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
import java.util.function.Consumer;

import org.bson.Document;
import org.bson.types.ObjectId;
import org.springframework.beans.BeanUtils;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.raxim.myscoutee.profile.data.document.mongo.ActivityEvent;
import com.raxim.myscoutee.profile.data.document.mongo.Users;
import com.raxim.myscoutee.profile.dto.events.EventsDtos.ActivitiesEventSyncPayloadDto;
import com.raxim.myscoutee.profile.dto.events.EventsDtos.EventActionRequestDto;
import com.raxim.myscoutee.profile.dto.events.EventsDtos.EventRecordDto;
import com.raxim.myscoutee.profile.dto.events.EventsDtos.EventsExplorePageDto;
import com.raxim.myscoutee.profile.dto.events.EventsDtos.EventsExploreQueryDto;
import com.raxim.myscoutee.profile.dto.events.EventsDtos.EventsFilterRequestDto;
import com.raxim.myscoutee.profile.dto.shared.SharedDtos.EventSlotOccurrenceDto;
import com.raxim.myscoutee.profile.dto.shared.SharedDtos.EventSlotTemplateDto;
import com.raxim.myscoutee.profile.dto.shared.SharedDtos.LocationCoordinatesDto;
import com.raxim.myscoutee.profile.dto.shared.SharedDtos.SubEventFormItemDto;
import com.raxim.myscoutee.profile.repository.mongo.ActivityEventsRepository;
import com.raxim.myscoutee.profile.repository.mongo.UsersRepository;

@Service
public class ActivitiesEventsService {
    private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper();
    private static final String OWNER_TYPE_EVENT = "event";
    private static final String TYPE_EVENTS = "events";
    private static final String TYPE_HOSTING = "hosting";
    private static final String TYPE_INVITATIONS = "invitations";

    private final ActivityEventsRepository activityEventsRepository;
    private final UsersRepository usersRepository;
    private final HomeUserProfileService homeUserProfileService;
    private final ActivitiesMembersService activitiesMembersService;
    private final EventParticipationTicketService eventParticipationTicketService;
    private final MongoTemplate mongoTemplate;

    public ActivitiesEventsService(
            ActivityEventsRepository activityEventsRepository,
            UsersRepository usersRepository,
            HomeUserProfileService homeUserProfileService,
            ActivitiesMembersService activitiesMembersService,
            EventParticipationTicketService eventParticipationTicketService,
            MongoTemplate mongoTemplate) {
        this.activityEventsRepository = activityEventsRepository;
        this.usersRepository = usersRepository;
        this.homeUserProfileService = homeUserProfileService;
        this.activitiesMembersService = activitiesMembersService;
        this.eventParticipationTicketService = eventParticipationTicketService;
        this.mongoTemplate = mongoTemplate;
    }

    public boolean isPagedFilterRequest(EventsFilterRequestDto request) {
        return request != null
                && (request.limit() != null
                        || StringUtils.hasText(request.cursor())
                        || StringUtils.hasText(request.secondaryFilter())
                        || StringUtils.hasText(request.sort())
                        || StringUtils.hasText(request.view()));
    }

    public boolean isPagedExploreRequest(EventsExploreQueryDto request) {
        return request != null
                && (request.limit() != null
                        || StringUtils.hasText(request.cursor())
                        || StringUtils.hasText(request.order())
                        || StringUtils.hasText(request.view())
                        || request.friendsOnly() != null
                        || request.openSpotsOnly() != null
                        || StringUtils.hasText(request.topic()));
    }

    public List<EventRecordDto> queryItemsByUser(String requestedUserId) {
        materializeSlotOccurrences();
        ViewerContext viewer = resolveViewer(requestedUserId);
        if (viewer == null) {
            return List.of();
        }
        return queryUserRecords(viewer).stream()
                .map(record -> toEventRecordDto(record, viewer))
                .filter(Objects::nonNull)
                .sorted(listItemComparator())
                .toList();
    }

    public List<EventRecordDto> queryInvitations(String requestedUserId) {
        return queryItemsByFilter(new EventsFilterRequestDto(requestedUserId, "invitations", "all", null, null, null, null, null));
    }

    public List<EventRecordDto> queryAttending(String requestedUserId) {
        ViewerContext viewer = resolveViewer(requestedUserId);
        if (viewer == null) {
            return List.of();
        }
        return queryUserRecords(viewer).stream()
                .filter(record -> TYPE_EVENTS.equals(normalizeType(record.getType())))
                .map(record -> toEventRecordDto(record, viewer))
                .filter(Objects::nonNull)
                .sorted(listItemComparator())
                .toList();
    }

    public List<EventRecordDto> queryHosting(String requestedUserId) {
        ViewerContext viewer = resolveViewer(requestedUserId);
        if (viewer == null) {
            return List.of();
        }
        return queryUserRecords(viewer).stream()
                .filter(record -> TYPE_HOSTING.equals(normalizeType(record.getType())))
                .map(record -> toEventRecordDto(record, viewer))
                .filter(Objects::nonNull)
                .sorted(listItemComparator())
                .toList();
    }

    public List<EventRecordDto> queryTrash(String requestedUserId) {
        return queryItemsByFilter(new EventsFilterRequestDto(requestedUserId, "trash", "all", null, null, null, null, null));
    }

    public List<EventRecordDto> queryItemsByFilter(EventsFilterRequestDto request) {
        materializeSlotOccurrences();
        ViewerContext viewer = resolveViewer(request == null ? null : request.userId());
        if (viewer == null) {
            return List.of();
        }
        return queryFilteredRecords(viewer, request).stream()
                .map(record -> toEventRecordDto(record, viewer))
                .filter(Objects::nonNull)
                .sorted(listItemComparator())
                .toList();
    }

    public EventsExplorePageDto queryActivitiesEventPage(EventsFilterRequestDto request) {
        materializeSlotOccurrences();
        ViewerContext viewer = resolveViewer(request == null ? null : request.userId());
        if (viewer == null) {
            return new EventsExplorePageDto(List.of(), 0, null);
        }

        String secondaryFilter = normalizeActivitiesSecondaryFilter(request.secondaryFilter());
        String view = normalizeActivitiesView(request.view());
        String sort = normalizeActivitiesSort(request.sort(), view, secondaryFilter);
        int limit = normalizeLimit(request.limit(), 10);

        List<EventProjection> sorted = queryFilteredRecords(viewer, request).stream()
                .map(record -> toProjection(record, viewer))
                .filter(Objects::nonNull)
                .sorted((left, right) -> compareActivitiesProjection(left, right, sort, view, secondaryFilter))
                .toList();

        if ("week".equals(view) || "month".equals(view)) {
            return new EventsExplorePageDto(sorted.stream().map(EventProjection::item).toList(), sorted.size(), null);
        }

        int startIndex = resolveCursorStartIndex(sorted, request.cursor());
        int endIndex = Math.min(sorted.size(), startIndex + limit);
        List<EventRecordDto> records = sorted.subList(startIndex, endIndex).stream()
                .map(EventProjection::item)
                .toList();
        String nextCursor = endIndex < sorted.size() && !records.isEmpty()
                ? serializeCursor(records.get(records.size() - 1))
                : null;
        return new EventsExplorePageDto(records, sorted.size(), nextCursor);
    }

    public List<EventRecordDto> queryExploreItems(String requestedUserId) {
        materializeSlotOccurrences();
        ViewerContext viewer = resolveViewer(requestedUserId);
        if (viewer == null) {
            return List.of();
        }
        return computeExploreRecords(viewer).stream()
                .map(record -> toEventRecordDto(record, viewer))
                .filter(Objects::nonNull)
                .sorted(Comparator
                        .comparing((EventRecordDto item) -> toSortableDate(item.startAtIso()))
                        .thenComparing(item -> safeText(item.id())))
                .toList();
    }

    public EventsExplorePageDto queryEventExplorePage(EventsExploreQueryDto request) {
        materializeSlotOccurrences();
        ViewerContext viewer = resolveViewer(request == null ? null : request.userId());
        if (viewer == null) {
            return new EventsExplorePageDto(List.of(), 0, null);
        }

        String order = normalizeExploreOrder(request.order());
        String view = normalizeExploreView(request.view());
        String topic = normalizeTopic(request.topic());
        boolean friendsOnly = request.friendsOnly() != null && request.friendsOnly();
        boolean openSpotsOnly = request.openSpotsOnly() != null && request.openSpotsOnly();
        int limit = normalizeLimit(request.limit(), 10);

        List<EventProjection> sorted = computeExploreRecords(viewer).stream()
                .map(record -> toProjection(record, viewer))
                .filter(Objects::nonNull)
                .filter(projection -> !friendsOnly || exploreHasFriendGoing(projection.record(), viewer.userId()))
                .filter(projection -> !openSpotsOnly || exploreHasOpenSpots(projection.record()))
                .filter(projection -> !StringUtils.hasText(topic) || hasTopic(projection.record(), topic))
                .sorted((left, right) -> compareExploreProjection(left, right, order, view))
                .toList();

        int startIndex = resolveCursorStartIndex(sorted, request.cursor());
        int endIndex = Math.min(sorted.size(), startIndex + limit);
        List<EventRecordDto> records = sorted.subList(startIndex, endIndex).stream()
                .map(EventProjection::item)
                .toList();
        String nextCursor = endIndex < sorted.size() && !records.isEmpty()
                ? serializeCursor(records.get(records.size() - 1))
                : null;
        return new EventsExplorePageDto(records, sorted.size(), nextCursor);
    }

    public void trash(EventActionRequestDto request) {
        updateItemState(request, current -> {
            current.setIsTrashed(true);
            current.setTrashedAtIso(Instant.now().toString());
        });
    }

    public void publish(EventActionRequestDto request) {
        updateItemState(request, current -> current.setPublished(true));
    }

    public void restore(EventActionRequestDto request) {
        updateItemState(request, current -> {
            current.setIsTrashed(false);
            current.setTrashedAtIso(null);
        });
    }

    public EventRecordDto requestJoin(EventActionRequestDto request) {
        materializeSlotOccurrences();
        ViewerContext viewer = resolveViewer(request == null ? null : request.userId());
        String sourceId = request == null ? null : normalizeId(request.sourceId());
        String slotSourceId = request == null ? null : normalizeId(request.slotSourceId());
        if (viewer == null || !StringUtils.hasText(sourceId)) {
            return null;
        }

        ActivityEvent preferred = computePreferredEventRecords(allEventDocuments()).stream()
                .filter(record -> sourceId.equals(normalizeId(record.getSourceId())))
                .findFirst()
                .orElse(null);
        if (preferred == null) {
            return null;
        }
        if (viewer.userId().equals(normalizeId(preferred.getCreatorUserId()))) {
            return toEventRecordDto(preferred, viewer);
        }

        if (StringUtils.hasText(slotSourceId)) {
            ActivityEvent slotRecord = computePreferredEventRecords(allEventDocuments()).stream()
                    .filter(this::isGeneratedSlotRecord)
                    .filter(record -> slotSourceId.equals(normalizeId(record.getSourceId())))
                    .findFirst()
                    .orElse(null);
            if (slotRecord != null) {
                activitiesMembersService.requestJoin(sourceId, viewer.user(), preferred);
                activitiesMembersService.requestJoin(slotSourceId, viewer.user(), slotRecord);
                return toEventRecordDto(buildMembershipProjection(viewer.userId(), slotRecord), viewer);
            }
        }

        activitiesMembersService.requestJoin(sourceId, viewer.user(), preferred);
        return toEventRecordDto(buildMembershipProjection(viewer.userId(), preferred), viewer);
    }

    public void sync(ActivitiesEventSyncPayloadDto request) {
        if (request == null) {
            return;
        }
        String sourceId = normalizeId(request.id());
        if (!StringUtils.hasText(sourceId)) {
            return;
        }

        ViewerContext actor = resolveViewer(request.creatorUserId());
        String actorUserId = actor == null ? normalizeId(request.creatorUserId()) : actor.userId();
        if (!StringUtils.hasText(actorUserId)) {
            return;
        }

        activitiesMembersService.sync(request);

        String targetType = normalizeTargetType(request.target());
        if (!StringUtils.hasText(targetType)) {
            return;
        }

        Users creator = actor != null ? actor.user() : usersRepository.findByUserId(actorUserId).orElse(null);
        ActivityEvent baseRecord = buildSyncedRecord(request, creator, actorUserId, sourceId, targetType);
        List<ActivityEvent> documentsToSave = new ArrayList<>();
        documentsToSave.add(baseRecord);
        if (TYPE_HOSTING.equals(targetType)) {
            ActivityEvent eventsOverlay = cloneDocument(baseRecord);
            eventsOverlay.setType(TYPE_EVENTS);
            eventsOverlay.setIsHosting(false);
            eventsOverlay.setIsInvitation(false);
            eventsOverlay.setId(resolveExistingId(baseRecord.getOwnerUserId(), TYPE_EVENTS, sourceId, null));
            eventsOverlay.setSyncKey(resolveExistingSyncKey(baseRecord.getOwnerUserId(), TYPE_EVENTS, sourceId, null));
            eventsOverlay.setAdmins(resolveAdminUserIds(sourceId, baseRecord.getCreatorUserId()));
            eventsOverlay.normalizeLifecycleState();
            documentsToSave.add(eventsOverlay);
        }
        activityEventsRepository.saveAll(documentsToSave);
        materializeSlotOccurrences();
        eventParticipationTicketService.syncParticipationTicketsForEvent(sourceId);
    }

    private ViewerContext resolveViewer(String requestedUserId) {
        Users user = homeUserProfileService.resolveCurrentUser(requestedUserId);
        String userId = user == null ? null : normalizeId(user.getId());
        if (!StringUtils.hasText(userId) || user == null) {
            return null;
        }
        int affinity = user.getAffinity() == null ? 0 : Math.max(0, (int) Math.round(user.getAffinity()));
        return new ViewerContext(userId, user, toLocationCoordinatesDto(user.getLocationCoordinates()), affinity);
    }

    private List<ActivityEvent> queryFilteredRecords(ViewerContext viewer, EventsFilterRequestDto request) {
        String filter = request == null ? "active-events" : normalizeEventScopeFilter(request.filter());
        String hostingPublicationFilter = request == null ? "all" : normalizeHostingPublicationFilter(request.hostingPublicationFilter());

        List<ActivityEvent> userItems = queryUserRecords(viewer);
        List<ActivityEvent> activeEventItems = userItems.stream()
                .filter(record -> TYPE_EVENTS.equals(normalizeType(record.getType())))
                .filter(record -> !Boolean.TRUE.equals(record.getIsTrashed()))
                .toList();
        List<ActivityEvent> invitationItems = userItems.stream()
                .filter(record -> Boolean.TRUE.equals(record.getIsInvitation()))
                .filter(record -> !Boolean.TRUE.equals(record.getIsTrashed()))
                .toList();
        List<ActivityEvent> myEventItems = userItems.stream()
                .filter(record -> TYPE_HOSTING.equals(normalizeType(record.getType())))
                .filter(record -> isViewerAdmin(record, viewer.userId()))
                .filter(record -> !Boolean.TRUE.equals(record.getIsTrashed()))
                .toList();
        List<ActivityEvent> draftItems = myEventItems.stream()
                .filter(record -> Boolean.FALSE.equals(record.getPublished()))
                .toList();

        return switch (filter) {
            case "all" -> concat(activeEventItems, invitationItems);
            case "invitations" -> invitationItems;
            case "my-events" -> "drafts".equals(hostingPublicationFilter) ? draftItems : myEventItems;
            case "drafts" -> draftItems;
            case "trash" -> userItems.stream().filter(record -> Boolean.TRUE.equals(record.getIsTrashed())).toList();
            default -> activeEventItems;
        };
    }

    private List<ActivityEvent> queryUserRecords(ViewerContext viewer) {
        List<ActivityEvent> allRecords = allEventDocuments(viewer);
        Map<String, ActivityEvent> preferredBySourceId = new LinkedHashMap<>();
        for (ActivityEvent record : computePreferredEventRecords(allRecords)) {
            preferredBySourceId.put(normalizeId(record.getSourceId()), record);
        }

        List<ActivityEvent> directRecords = allRecords.stream()
                .filter(record -> viewer.userId().equals(normalizeId(record.getOwnerUserId())))
                .filter(record -> shouldIncludeUserDirectRecord(record, viewer.userId(), preferredBySourceId.get(normalizeId(record.getSourceId()))))
                .map(this::cloneDocument)
                .toList();
        Set<String> directSourceIds = directRecords.stream()
                .map(ActivityEvent::getSourceId)
                .map(this::normalizeId)
                .filter(StringUtils::hasText)
                .collect(LinkedHashSet::new, Set::add, Set::addAll);

        List<ActivityEvent> membershipRecords = computePreferredEventRecords(allRecords).stream()
                .filter(record -> !viewer.userId().equals(normalizeId(record.getCreatorUserId())))
                .filter(record -> !Boolean.TRUE.equals(record.getIsTrashed()))
                .filter(record -> !directSourceIds.contains(normalizeId(record.getSourceId())))
                .filter(record -> hasTrackedUserParticipation(record, viewer.userId()))
                .map(record -> buildMembershipProjection(viewer.userId(), record))
                .toList();

        return concat(directRecords, membershipRecords);
    }

    private List<ActivityEvent> computePreferredEventRecords(List<ActivityEvent> records) {
        Map<String, ActivityEvent> preferred = new LinkedHashMap<>();
        for (ActivityEvent record : records) {
            if (record == null || Boolean.TRUE.equals(record.getIsInvitation())) {
                continue;
            }
            String sourceId = normalizeId(record.getSourceId());
            if (!StringUtils.hasText(sourceId)) {
                continue;
            }
            ActivityEvent current = preferred.get(sourceId);
            if (current == null || shouldPreferRecord(record, current)) {
                preferred.put(sourceId, record);
            }
        }
        return new ArrayList<>(preferred.values());
    }

    private boolean shouldPreferRecord(ActivityEvent next, ActivityEvent current) {
        if (Boolean.TRUE.equals(next.getIsHosting()) && !Boolean.TRUE.equals(current.getIsHosting())) {
            return true;
        }
        if (!Boolean.TRUE.equals(next.getIsHosting()) && Boolean.TRUE.equals(current.getIsHosting())) {
            return false;
        }
        if (Boolean.TRUE.equals(next.getIsHosting()) != Boolean.TRUE.equals(current.getIsHosting())) {
            return Boolean.TRUE.equals(next.getIsHosting());
        }
        return normalizeCount(next.getAcceptedMembers()) >= normalizeCount(current.getAcceptedMembers());
    }

    private boolean shouldIncludeUserDirectRecord(ActivityEvent record, String userId, ActivityEvent preferredRecord) {
        if (record == null) {
            return false;
        }
        if (!TYPE_EVENTS.equals(normalizeType(record.getType())) || Boolean.TRUE.equals(record.getIsInvitation())) {
            return true;
        }
        if (userId.equals(normalizeId(record.getCreatorUserId())) || isViewerAdmin(record, userId)) {
            return true;
        }
        return hasTrackedUserParticipation(preferredRecord == null ? record : preferredRecord, userId);
    }

    private ActivityEvent buildMembershipProjection(String ownerUserId, ActivityEvent record) {
        ActivityEvent projection = cloneDocument(record);
        projection.setOwnerUserId(ownerUserId);
        projection.setType(TYPE_EVENTS);
        projection.setIsAdmin(false);
        projection.setIsInvitation(false);
        projection.setIsHosting(false);
        projection.setAdmins(resolveAdminUserIds(projection.getSourceId(), projection.getCreatorUserId()));
        projection.normalizeLifecycleState();
        return projection;
    }

    private List<ActivityEvent> computeExploreRecords(ViewerContext viewer) {
        Map<String, ActivityEvent> preferredByEventId = new LinkedHashMap<>();
        for (ActivityEvent record : allEventDocuments(viewer)) {
            if (!shouldIncludeExploreRecord(record, viewer.userId())) {
                continue;
            }
            String sourceId = normalizeId(record.getSourceId());
            ActivityEvent current = preferredByEventId.get(sourceId);
            if (current == null || shouldPreferExploreRecord(record, current)) {
                preferredByEventId.put(sourceId, record);
            }
        }
        return preferredByEventId.values().stream()
                .map(this::cloneDocument)
                .toList();
    }

    private boolean shouldIncludeExploreRecord(ActivityEvent record, String activeUserId) {
        if (record == null || isGeneratedSlotRecord(record) || Boolean.TRUE.equals(record.getIsTrashed()) || Boolean.TRUE.equals(record.getIsInvitation())) {
            return false;
        }
        if (Boolean.FALSE.equals(record.getPublished())) {
            return false;
        }
        if (activeUserId.equals(normalizeId(record.getCreatorUserId()))) {
            return false;
        }
        if (hasTrackedUserParticipation(record, activeUserId)) {
            return false;
        }
        String visibility = safeText(record.getVisibility());
        if ("Invitation only".equals(visibility)) {
            return false;
        }
        return !"Friends only".equals(visibility) || isFriendOfActiveUser(normalizeId(record.getCreatorUserId()), activeUserId);
    }

    private boolean shouldPreferExploreRecord(ActivityEvent next, ActivityEvent current) {
        if (Boolean.TRUE.equals(next.getIsHosting()) && !Boolean.TRUE.equals(current.getIsHosting())) {
            return true;
        }
        if (!Boolean.TRUE.equals(next.getIsHosting()) && Boolean.TRUE.equals(current.getIsHosting())) {
            return false;
        }
        if (!Objects.equals(next.getPublished(), current.getPublished())) {
            return Boolean.TRUE.equals(next.getPublished());
        }
        return normalizeCount(next.getActivity()) >= normalizeCount(current.getActivity());
    }

    private EventProjection toProjection(ActivityEvent record, ViewerContext viewer) {
        EventRecordDto item = toEventRecordDto(record, viewer);
        if (item == null) {
            return null;
        }
        long startAtMs = toSortableDate(item.startAtIso());
        Integer distanceMetersExact = resolveDistanceMetersExact(viewer.locationCoordinates(), record);
        return new EventProjection(
                record,
                item,
                distanceMetersExact == null ? Integer.MAX_VALUE : distanceMetersExact,
                Math.max(0d, safeDouble(item.relevance())),
                startAtMs,
                dateOnly(startAtMs),
                Math.abs(Math.max(0, normalizeCount(record.getAffinity())) - viewer.affinity()),
                -Math.max(0, (int) Math.round(safeDouble(item.rating()) * 100d)),
                startAtMs < System.currentTimeMillis());
    }

    private EventRecordDto toEventRecordDto(ActivityEvent record, ViewerContext viewer) {
        if (record == null) {
            return null;
        }
        Integer distanceMetersExact = resolveDistanceMetersExact(viewer == null ? null : viewer.locationCoordinates(), record);
        List<String> acceptedMemberUserIds = resolveAcceptedMemberUserIds(record);
        List<String> pendingMemberUserIds = resolvePendingMemberUserIds(record);
        List<EventSlotOccurrenceDto> upcomingSlots = resolveUpcomingSlotOccurrences(record);
        return new EventRecordDto(
                normalizeId(record.getSourceId()),
                normalizeId(record.getOwnerUserId()),
                normalizeType(record.getType()),
                safeText(record.getAvatar()),
                safeText(record.getTitle()),
                safeText(record.getSubtitle()),
                safeText(record.getTimeframe()),
                StringUtils.hasText(record.getInviter()) ? record.getInviter().trim() : null,
                normalizeCount(record.getUnread()),
                normalizeCount(record.getActivity()),
                isViewerAdmin(record, viewer == null ? null : viewer.userId()),
                Boolean.TRUE.equals(record.getIsInvitation()),
                Boolean.TRUE.equals(record.getIsHosting()),
                Boolean.TRUE.equals(record.getIsTrashed()),
                Boolean.FALSE.equals(record.getPublished()) ? Boolean.FALSE : Boolean.TRUE,
                StringUtils.hasText(record.getTrashedAtIso()) ? record.getTrashedAtIso().trim() : null,
                normalizeId(record.getCreatorUserId()),
                safeText(record.getCreatorName()),
                safeText(record.getCreatorInitials()),
                safeText(record.getCreatorGender()),
                safeText(record.getCreatorCity()),
                safeText(record.getVisibility()),
                safeText(record.getBlindMode()),
                StringUtils.hasText(record.getStartAtIso()) ? record.getStartAtIso().trim() : null,
                StringUtils.hasText(record.getEndAtIso()) ? record.getEndAtIso().trim() : null,
                distanceMetersExact == null
                        ? Math.max(0d, safeDouble(record.getDistanceKm()))
                        : distanceMetersExact.doubleValue() / 1000d,
                safeText(record.getImageUrl()),
                safeText(record.getSourceLink()),
                safeText(record.getLocation()),
                cloneLocation(record.getLocationCoordinates()),
                nullableCount(record.getCapacityMin()),
                nullableCount(record.getCapacityMax()),
                normalizeCount(record.getCapacityTotal()),
                Boolean.TRUE.equals(record.getAutoInviter()),
                safeText(record.getFrequency()),
                Boolean.TRUE.equals(record.getTicketing()),
                Boolean.TRUE.equals(record.getSlotsEnabled()),
                cloneSlotTemplates(record.getSlotTemplates()),
                safeText(record.getParentEventId()),
                safeText(record.getSlotTemplateId()),
                Boolean.TRUE.equals(record.getGenerated()),
                isGeneratedSlotRecord(record) ? "slot" : "main",
                upcomingSlots.isEmpty() ? null : upcomingSlots.get(0),
                upcomingSlots,
                acceptedMemberUserIds.size(),
                pendingMemberUserIds.size(),
                acceptedMemberUserIds,
                pendingMemberUserIds,
                normalizeStrings(record.getTopics()),
                cloneSubEvents(record.getSubEvents()),
                safeText(record.getSubEventsDisplayMode()),
                safeDouble(record.getRating()),
                safeDouble(record.getRelevance()),
                safeDouble(record.getAffinity()));
    }

    private int compareActivitiesProjection(
            EventProjection left,
            EventProjection right,
            String sort,
            String view,
            String secondaryFilter) {
        if ("distance".equals(view) || "distance".equals(sort)) {
            if ("relevant".equals(secondaryFilter)) {
                int delta = Integer.compare(left.distanceMeters(), right.distanceMeters());
                if (delta != 0) {
                    return delta;
                }
                delta = Double.compare(left.relevanceValue(), right.relevanceValue());
                if (delta != 0) {
                    return delta;
                }
                delta = Long.compare(right.startAtMs(), left.startAtMs());
                if (delta != 0) {
                    return delta;
                }
                return left.item().id().compareTo(right.item().id());
            }
            int delta = Integer.compare(left.distanceMeters(), right.distanceMeters());
            if (delta != 0) {
                return delta;
            }
            delta = Long.compare(right.startAtMs(), left.startAtMs());
            if (delta != 0) {
                return delta;
            }
            return left.item().id().compareTo(right.item().id());
        }

        if ("relevant".equals(secondaryFilter)) {
            int delta = Long.compare(left.dayMs(), right.dayMs());
            if (delta != 0) {
                return delta;
            }
            delta = Double.compare(left.relevanceValue(), right.relevanceValue());
            if (delta != 0) {
                return delta;
            }
            delta = Long.compare(right.startAtMs(), left.startAtMs());
            if (delta != 0) {
                return delta;
            }
            return left.item().id().compareTo(right.item().id());
        }

        if ("past".equals(secondaryFilter)) {
            int delta = Long.compare(right.dayMs(), left.dayMs());
            if (delta != 0) {
                return delta;
            }
            delta = Long.compare(right.startAtMs(), left.startAtMs());
            if (delta != 0) {
                return delta;
            }
            return left.item().id().compareTo(right.item().id());
        }

        int delta = Long.compare(left.dayMs(), right.dayMs());
        if (delta != 0) {
            return delta;
        }
        delta = Long.compare(left.startAtMs(), right.startAtMs());
        if (delta != 0) {
            return delta;
        }
        return left.item().id().compareTo(right.item().id());
    }

    private int compareExploreProjection(EventProjection left, EventProjection right, String order, String view) {
        List<Integer> leftTuple = buildExploreSortTuple(left, order, view);
        List<Integer> rightTuple = buildExploreSortTuple(right, order, view);
        for (int index = 0; index < leftTuple.size(); index += 1) {
            int delta = Integer.compare(leftTuple.get(index), rightTuple.get(index));
            if (delta != 0) {
                return delta;
            }
        }
        return left.item().id().compareTo(right.item().id());
    }

    private List<Integer> buildExploreSortTuple(EventProjection projection, String order, String view) {
        int startAtMs = safeSortableInt(projection.startAtMs());
        int dayMs = safeSortableInt(projection.dayMs());
        int distanceMeters = projection.distanceMeters();
        int ratingValue = projection.ratingValue();
        int affinityGap = projection.affinityGap();
        int isPast = projection.past() ? 1 : 0;
        int pastPriority = projection.past() ? 0 : 1;

        if ("distance".equals(view)) {
            return switch (order) {
                case "past-events" -> List.of(distanceMeters, pastPriority, -startAtMs, affinityGap);
                case "nearby" -> List.of(distanceMeters, isPast, startAtMs, affinityGap);
                case "top-rated" -> List.of(distanceMeters, isPast, ratingValue, startAtMs);
                case "most-relevant" -> List.of(distanceMeters, isPast, affinityGap, startAtMs);
                default -> List.of(distanceMeters, isPast, startAtMs, affinityGap);
            };
        }

        return switch (order) {
            case "past-events" -> List.of(pastPriority, -dayMs, -startAtMs, distanceMeters);
            case "nearby" -> List.of(isPast, dayMs, distanceMeters, startAtMs);
            case "top-rated" -> List.of(isPast, dayMs, ratingValue, startAtMs);
            case "most-relevant" -> List.of(isPast, dayMs, affinityGap, startAtMs);
            default -> List.of(isPast, dayMs, startAtMs, distanceMeters);
        };
    }

    private void updateItemState(EventActionRequestDto request, Consumer<ActivityEvent> updater) {
        ViewerContext viewer = resolveViewer(request == null ? null : request.userId());
        String sourceId = request == null ? null : normalizeId(request.sourceId());
        if (viewer == null || !StringUtils.hasText(sourceId)) {
            return;
        }

        List<ActivityEvent> documents = resolveActionDocuments(viewer.userId(), request.type(), sourceId);
        if (documents.isEmpty()) {
            ActivityEvent overlay = buildUserStateOverlayRecord(viewer.userId(), request.type(), sourceId);
            if (overlay == null) {
                return;
            }
            documents = List.of(overlay);
        }

        List<ActivityEvent> updated = new ArrayList<>();
        for (ActivityEvent document : documents) {
            ActivityEvent next = cloneDocument(document);
            updater.accept(next);
            next.setUpdatedDate(Instant.now().toString());
            next.setUpdatedUser(viewer.userId());
            next.setAdmins(resolveAdminUserIds(next.getSourceId(), next.getCreatorUserId()));
            next.normalizeLifecycleState();
            updated.add(next);
        }
        activityEventsRepository.saveAll(updated);
    }

    private List<ActivityEvent> resolveActionDocuments(String ownerUserId, String type, String sourceId) {
        List<String> candidateTypes = TYPE_INVITATIONS.equals(normalizeType(type))
                ? List.of(TYPE_INVITATIONS)
                : List.of(TYPE_EVENTS, TYPE_HOSTING);
        List<ActivityEvent> documents = new ArrayList<>();
        for (String candidateType : candidateTypes) {
            activityEventsRepository.findByOwnerUserIdAndTypeAndSourceId(ownerUserId, candidateType, sourceId)
                    .ifPresent(documents::add);
        }
        return documents;
    }

    private ActivityEvent buildUserStateOverlayRecord(String ownerUserId, String type, String sourceId) {
        if (TYPE_INVITATIONS.equals(normalizeType(type))) {
            return null;
        }
        ActivityEvent preferred = computePreferredEventRecords(allEventDocuments()).stream()
                .filter(record -> sourceId.equals(normalizeId(record.getSourceId())))
                .findFirst()
                .orElse(null);
        if (preferred == null) {
            return null;
        }
        String overlayType = TYPE_HOSTING.equals(normalizeType(type)) ? TYPE_HOSTING : TYPE_EVENTS;
        ActivityEvent overlay = cloneDocument(preferred);
        overlay.setId(new ObjectId().toHexString());
        overlay.setSyncKey(UUID.randomUUID().toString());
        overlay.setOwnerUserId(ownerUserId);
        overlay.setType(overlayType);
        overlay.setIsAdmin(TYPE_HOSTING.equals(overlayType));
        overlay.setIsHosting(TYPE_HOSTING.equals(overlayType));
        overlay.setIsInvitation(false);
        overlay.setAdmins(resolveAdminUserIds(sourceId, overlay.getCreatorUserId()));
        overlay.setCreatedDate(Instant.now().toString());
        overlay.setCreatedUser(ownerUserId);
        overlay.setUpdatedDate(Instant.now().toString());
        overlay.setUpdatedUser(ownerUserId);
        overlay.normalizeLifecycleState();
        return overlay;
    }

    private ActivityEvent buildSyncedRecord(
            ActivitiesEventSyncPayloadDto request,
            Users creator,
            String actorUserId,
            String sourceId,
            String targetType) {
        String ownerUserId = normalizeId(request.creatorUserId());
        if (!StringUtils.hasText(ownerUserId)) {
            ownerUserId = actorUserId;
        }

        ActivityEvent existing = activityEventsRepository.findByOwnerUserIdAndTypeAndSourceId(ownerUserId, targetType, sourceId)
                .orElse(null);
        ActivityEvent document = existing == null ? new ActivityEvent() : cloneDocument(existing);
        String nowIso = Instant.now().toString();
        String parentEventId = safeText(request.parentEventId());
        if (!StringUtils.hasText(parentEventId) && existing != null) {
            parentEventId = safeText(existing.getParentEventId());
        }
        String slotTemplateId = safeText(request.slotTemplateId());
        if (!StringUtils.hasText(slotTemplateId) && existing != null) {
            slotTemplateId = safeText(existing.getSlotTemplateId());
        }
        boolean generated = request.generated() != null
                ? Boolean.TRUE.equals(request.generated())
                : existing != null && Boolean.TRUE.equals(existing.getGenerated());
        String requestedEventType = safeText(request.eventType());
        if (!StringUtils.hasText(requestedEventType) && existing != null) {
            requestedEventType = safeText(existing.getEventType());
        }
        boolean slotEvent = generated
                || "slot".equalsIgnoreCase(requestedEventType)
                || StringUtils.hasText(parentEventId);

        document.setId(resolveExistingId(ownerUserId, targetType, sourceId, existing));
        document.setSyncKey(resolveExistingSyncKey(ownerUserId, targetType, sourceId, existing == null ? request.syncKey() : existing.getSyncKey()));
        document.setSourceId(sourceId);
        document.setOwnerUserId(ownerUserId);
        document.setType(targetType);
        document.setAvatar(resolveCreatorInitials(request.creatorInitials(), creator, request.creatorName()));
        document.setTitle(safeText(request.title()));
        document.setSubtitle(safeText(request.shortDescription()));
        document.setTimeframe(safeText(request.timeframe()));
        document.setInviter(existing == null ? null : existing.getInviter());
        document.setUnread(existing == null ? 0 : normalizeCount(existing.getUnread()));
        document.setActivity(normalizeCount(request.activity()));
        document.setIsAdmin(TYPE_HOSTING.equals(targetType));
        document.setIsInvitation(false);
        document.setIsHosting(TYPE_HOSTING.equals(targetType));
        document.setIsTrashed(existing != null && Boolean.TRUE.equals(existing.getIsTrashed()));
        document.setPublished(TYPE_HOSTING.equals(targetType) ? !Boolean.FALSE.equals(request.published()) : Boolean.TRUE);
        document.setTrashedAtIso(existing == null ? null : existing.getTrashedAtIso());
        document.setCreatorUserId(ownerUserId);
        document.setCreatorName(resolveCreatorName(request.creatorName(), creator));
        document.setCreatorInitials(resolveCreatorInitials(request.creatorInitials(), creator, request.creatorName()));
        document.setCreatorGender(resolveCreatorGender(request.creatorGender(), creator));
        document.setCreatorCity(resolveCreatorCity(request.creatorCity(), creator));
        document.setVisibility(resolveVisibility(request.visibility(), existing, targetType));
        document.setBlindMode(resolveBlindMode(request.blindMode(), existing));
        document.setStartAtIso(normalizeDateTime(request.startAt(), existing == null ? nowIso : existing.getStartAtIso()));
        document.setEndAtIso(normalizeDateTime(request.endAt(), document.getStartAtIso()));
        document.setDistanceKm(null);
        document.setImageUrl(StringUtils.hasText(request.imageUrl()) ? request.imageUrl().trim() : safeText(existing == null ? null : existing.getImageUrl()));
        document.setSourceLink(StringUtils.hasText(request.sourceLink()) ? request.sourceLink().trim() : safeText(existing == null ? null : existing.getSourceLink()));
        document.setLocation(StringUtils.hasText(request.location()) ? request.location().trim() : safeText(existing == null ? null : existing.getLocation()));
        document.setLocationCoordinates(request.locationCoordinates() != null
                ? cloneLocation(request.locationCoordinates())
                : (existing != null && existing.getLocationCoordinates() != null
                        ? cloneLocation(existing.getLocationCoordinates())
                        : toLocationCoordinatesDto(creator == null ? null : creator.getLocationCoordinates())));
        document.setLocationGeo(toGeoPoint(document.getLocationCoordinates()));
        document.setCapacityMin(nullableCount(request.capacityMin()));
        document.setCapacityMax(nullableCount(request.capacityMax()));
        document.setCapacityTotal(resolveCapacityTotal(request, existing));
        document.setAutoInviter(request.autoInviter() != null ? request.autoInviter() : existing != null && Boolean.TRUE.equals(existing.getAutoInviter()));
        document.setFrequency(StringUtils.hasText(request.frequency()) ? request.frequency().trim() : safeText(existing == null ? null : existing.getFrequency()));
        document.setTicketing(request.ticketing() != null ? request.ticketing() : existing != null && Boolean.TRUE.equals(existing.getTicketing()));
        document.setSlotsEnabled(slotEvent
                ? false
                : (request.slotsEnabled() != null ? request.slotsEnabled() : existing != null && Boolean.TRUE.equals(existing.getSlotsEnabled())));
        document.setSlotTemplates(slotEvent ? List.of() : cloneSlotTemplates(request.slotTemplates()));
        document.setParentEventId(slotEvent ? parentEventId : null);
        document.setSlotTemplateId(slotEvent ? slotTemplateId : null);
        document.setGenerated(slotEvent && generated);
        document.setEventType(slotEvent ? "slot" : "main");
        document.setAcceptedMembers(resolveAcceptedMembers(request));
        document.setPendingMembers(resolvePendingMembers(request));
        document.setTopics(normalizeStrings(request.topics()));
        document.setSubEvents(cloneSubEvents(request.subEvents()));
        document.setSubEventsDisplayMode(safeText(request.subEventsDisplayMode()));
        document.setRating(existing == null ? 0d : safeDouble(existing.getRating()));
        document.setRelevance(existing == null ? 0d : safeDouble(existing.getRelevance()));
        document.setAffinity(resolveAffinity(existing, creator, request.acceptedMemberUserIds()));
        document.setCreatedDate(existing == null ? nowIso : safeText(existing.getCreatedDate()));
        document.setCreatedUser(existing == null ? actorUserId : safeText(existing.getCreatedUser()));
        document.setUpdatedDate(nowIso);
        document.setUpdatedUser(actorUserId);
        document.setAdmins(existing != null && existing.getAdmins() != null
                ? new ArrayList<>(existing.getAdmins())
                : resolveAdminUserIds(StringUtils.hasText(parentEventId) ? parentEventId : sourceId, document.getCreatorUserId()));
        document.normalizeLifecycleState();
        return document;
    }

    private double resolveAffinity(ActivityEvent existing, Users creator, List<String> acceptedMemberUserIds) {
        if (existing != null && existing.getAffinity() != null) {
            return existing.getAffinity();
        }
        List<Double> values = new ArrayList<>();
        if (creator != null && creator.getAffinity() != null) {
            values.add(creator.getAffinity());
        }
        for (String userId : normalizeIds(acceptedMemberUserIds)) {
            usersRepository.findByUserId(userId).map(Users::getAffinity).filter(Objects::nonNull).ifPresent(values::add);
        }
        return values.stream().mapToDouble(Double::doubleValue).average().orElse(0d);
    }

    private int resolveAcceptedMembers(ActivitiesEventSyncPayloadDto request) {
        return Math.max(normalizeCount(request.acceptedMembers()), normalizeIds(request.acceptedMemberUserIds()).size());
    }

    private int resolvePendingMembers(ActivitiesEventSyncPayloadDto request) {
        return Math.max(normalizeCount(request.pendingMembers()), normalizeIds(request.pendingMemberUserIds()).size());
    }

    private int resolveCapacityTotal(ActivitiesEventSyncPayloadDto request, ActivityEvent existing) {
        int acceptedMembers = resolveAcceptedMembers(request);
        int requestedCapacity = Math.max(normalizeCount(request.capacityTotal()), Math.max(nullableCount(request.capacityMax()) == null ? 0 : nullableCount(request.capacityMax()), acceptedMembers));
        if (requestedCapacity > 0) {
            return requestedCapacity;
        }
        return Math.max(acceptedMembers, existing == null ? 0 : normalizeCount(existing.getCapacityTotal()));
    }

    private String resolveExistingId(String ownerUserId, String type, String sourceId, ActivityEvent existing) {
        if (existing != null && StringUtils.hasText(existing.getId())) {
            return existing.getId();
        }
        return activityEventsRepository.findByOwnerUserIdAndTypeAndSourceId(ownerUserId, type, sourceId)
                .map(ActivityEvent::getId)
                .filter(StringUtils::hasText)
                .orElseGet(() -> new ObjectId().toHexString());
    }

    private String resolveExistingSyncKey(String ownerUserId, String type, String sourceId, String preferred) {
        if (StringUtils.hasText(preferred)) {
            return preferred.trim();
        }
        return activityEventsRepository.findByOwnerUserIdAndTypeAndSourceId(ownerUserId, type, sourceId)
                .map(ActivityEvent::getSyncKey)
                .filter(StringUtils::hasText)
                .orElseGet(() -> UUID.randomUUID().toString());
    }

    private List<ActivityEvent> allEventDocuments() {
        return activityEventsRepository.findAll().stream()
                .filter(Objects::nonNull)
                .filter(record -> StringUtils.hasText(normalizeId(record.getSourceId())))
                .toList();
    }

    private List<ActivityEvent> allEventDocuments(ViewerContext viewer) {
        if (viewer == null || viewer.locationCoordinates() == null) {
            return allEventDocuments();
        }

        List<ActivityEvent> fallback = allEventDocuments();
        List<ActivityEvent> geoOrdered = geoOrderedEventDocuments(viewer.locationCoordinates());
        if (geoOrdered.isEmpty()) {
            return fallback;
        }

        LinkedHashMap<String, ActivityEvent> merged = new LinkedHashMap<>();
        for (ActivityEvent record : geoOrdered) {
            String documentId = normalizeId(record == null ? null : record.getId());
            if (StringUtils.hasText(documentId)) {
                merged.put(documentId, record);
            }
        }
        for (ActivityEvent record : fallback) {
            String documentId = normalizeId(record == null ? null : record.getId());
            if (StringUtils.hasText(documentId) && !merged.containsKey(documentId)) {
                merged.put(documentId, record);
            }
        }
        return new ArrayList<>(merged.values());
    }

    private List<ActivityEvent> geoOrderedEventDocuments(LocationCoordinatesDto viewerCoordinates) {
        GeoJsonPoint viewerPoint = toGeoPoint(viewerCoordinates);
        if (viewerPoint == null) {
            return List.of();
        }

        Document geoNearStage = new Document("$geoNear", new Document("near", toGeoJsonDocument(viewerPoint))
                .append("distanceField", "distanceSortValue")
                .append("spherical", true)
                .append("key", "locationGeo"));

        List<Document> rawDocuments = mongoTemplate.getCollection(mongoTemplate.getCollectionName(ActivityEvent.class))
                .aggregate(List.of(geoNearStage))
                .into(new ArrayList<>());

        List<ActivityEvent> ordered = new ArrayList<>();
        for (Document rawDocument : rawDocuments) {
            ActivityEvent record = readGeoOrderedDocument(rawDocument);
            if (record != null && StringUtils.hasText(normalizeId(record.getSourceId()))) {
                ordered.add(record);
            }
        }
        return ordered;
    }

    private boolean hasTrackedUserParticipation(ActivityEvent record, String userId) {
        if (record == null || !StringUtils.hasText(userId)) {
            return false;
        }
        ActivitiesMembersService.OwnerMembersSnapshot snapshot = resolveMembersSnapshot(record);
        if (snapshot != null) {
            return snapshot.hasParticipation(userId);
        }
        return resolveAcceptedMemberUserIds(record).contains(userId)
                || resolvePendingMemberUserIds(record).contains(userId);
    }

    private boolean hasTopic(ActivityEvent record, String topic) {
        return normalizeStrings(record.getTopics()).stream()
                .map(this::normalizeTopic)
                .anyMatch(topic::equals);
    }

    private boolean exploreHasFriendGoing(ActivityEvent record, String activeUserId) {
        List<String> candidateUserIds = new ArrayList<>();
        candidateUserIds.add(normalizeId(record.getCreatorUserId()));
        candidateUserIds.addAll(resolveAcceptedMemberUserIds(record));
        return candidateUserIds.stream()
                .filter(StringUtils::hasText)
                .filter(userId -> !userId.equals(activeUserId))
                .anyMatch(userId -> isFriendOfActiveUser(userId, activeUserId));
    }

    private boolean exploreHasOpenSpots(ActivityEvent record) {
        return normalizeCount(record.getCapacityTotal()) > resolveAcceptedMemberUserIds(record).size();
    }

    private boolean isViewerAdmin(ActivityEvent record, String viewerUserId) {
        if (record == null || !StringUtils.hasText(viewerUserId)) {
            return false;
        }
        if (normalizeIds(record.getAdmins()).contains(viewerUserId)) {
            return true;
        }
        ActivitiesMembersService.OwnerMembersSnapshot snapshot = resolveMembersSnapshot(record);
        if (snapshot != null && snapshot.hasAcceptedAdminRole(viewerUserId)) {
            return true;
        }
        return viewerUserId.equals(normalizeId(record.getCreatorUserId()));
    }

    private ActivitiesMembersService.OwnerMembersSnapshot resolveMembersSnapshot(ActivityEvent record) {
        if (record == null || !StringUtils.hasText(normalizeId(record.getSourceId()))) {
            return null;
        }
        return activitiesMembersService.queryOwnerSnapshot(OWNER_TYPE_EVENT, normalizeId(record.getSourceId()));
    }

    private List<String> resolveAdminUserIds(String sourceId, String creatorUserId) {
        LinkedHashSet<String> adminUserIds = new LinkedHashSet<>();
        ActivitiesMembersService.OwnerMembersSnapshot snapshot = activitiesMembersService.queryOwnerSnapshot(OWNER_TYPE_EVENT, normalizeId(sourceId));
        if (snapshot != null) {
            adminUserIds.addAll(snapshot.adminUserIds());
        }
        String normalizedCreatorUserId = normalizeId(creatorUserId);
        if (StringUtils.hasText(normalizedCreatorUserId)) {
            adminUserIds.add(normalizedCreatorUserId);
        }
        return new ArrayList<>(adminUserIds);
    }

    private List<String> resolveAcceptedMemberUserIds(ActivityEvent record) {
        ActivitiesMembersService.OwnerMembersSnapshot snapshot = resolveMembersSnapshot(record);
        return snapshot == null ? fallbackAcceptedMemberUserIds(record) : new ArrayList<>(snapshot.acceptedMemberUserIds());
    }

    private List<String> resolvePendingMemberUserIds(ActivityEvent record) {
        ActivitiesMembersService.OwnerMembersSnapshot snapshot = resolveMembersSnapshot(record);
        return snapshot == null ? List.of() : new ArrayList<>(snapshot.pendingMemberUserIds());
    }

    private List<String> fallbackAcceptedMemberUserIds(ActivityEvent record) {
        String creatorUserId = record == null ? null : normalizeId(record.getCreatorUserId());
        return StringUtils.hasText(creatorUserId) ? List.of(creatorUserId) : List.of();
    }

    private boolean isFriendOfActiveUser(String userId, String activeUserId) {
        if (!StringUtils.hasText(userId) || !StringUtils.hasText(activeUserId) || userId.equals(activeUserId)) {
            return false;
        }
        String firstId = userId.compareTo(activeUserId) <= 0 ? userId : activeUserId;
        String secondId = userId.compareTo(activeUserId) <= 0 ? activeUserId : userId;
        int seed = hashText("friend-pair:" + firstId + ":" + secondId);
        return (seed % 100) < 32;
    }

    private int hashText(String value) {
        int hash = 0;
        for (int index = 0; index < value.length(); index += 1) {
            hash = (hash * 31 + value.charAt(index)) % 104729;
        }
        return Math.abs(hash);
    }

    private int resolveCursorStartIndex(List<EventProjection> items, String cursor) {
        String cursorId = parseCursorId(cursor);
        if (!StringUtils.hasText(cursorId)) {
            return 0;
        }
        for (int index = 0; index < items.size(); index += 1) {
            if (cursorId.equals(items.get(index).item().id())) {
                return index + 1;
            }
        }
        return 0;
    }

    private String serializeCursor(EventRecordDto item) {
        if (item == null || !StringUtils.hasText(item.id())) {
            return null;
        }
        try {
            return OBJECT_MAPPER.writeValueAsString(Map.of("id", item.id()));
        } catch (Exception ignored) {
            return item.id();
        }
    }

    private String parseCursorId(String cursor) {
        if (!StringUtils.hasText(cursor)) {
            return null;
        }
        try {
            Map<String, String> parsed = OBJECT_MAPPER.readValue(cursor, new TypeReference<>() { });
            return normalizeId(parsed.get("id"));
        } catch (Exception ignored) {
            return normalizeId(cursor);
        }
    }

    private Comparator<EventRecordDto> listItemComparator() {
        return Comparator.comparing((EventRecordDto item) -> toSortableDate(item.startAtIso()))
                .thenComparing(item -> safeText(item.id()));
    }

    private ActivityEvent cloneDocument(ActivityEvent source) {
        ActivityEvent clone = new ActivityEvent();
        BeanUtils.copyProperties(source, clone);
        clone.setAdmins(new ArrayList<>(normalizeIds(source.getAdmins())));
        clone.setTopics(new ArrayList<>(normalizeStrings(source.getTopics())));
        clone.setSubEvents(cloneSubEvents(source.getSubEvents()));
        clone.setSlotTemplates(cloneSlotTemplates(source.getSlotTemplates()));
        clone.setLocationCoordinates(cloneLocation(source.getLocationCoordinates()));
        clone.setLocationGeo(cloneGeoPoint(source.getLocationGeo()));
        return clone;
    }

    private String normalizeType(String value) {
        String normalized = safeText(value);
        return switch (normalized) {
            case TYPE_EVENTS, TYPE_HOSTING, TYPE_INVITATIONS -> normalized;
            default -> TYPE_EVENTS;
        };
    }

    private String normalizeTargetType(String value) {
        String normalized = safeText(value);
        return TYPE_EVENTS.equals(normalized) || TYPE_HOSTING.equals(normalized) ? normalized : null;
    }

    private String normalizeEventScopeFilter(String value) {
        String normalized = safeText(value);
        return switch (normalized) {
            case "all", "invitations", "my-events", "drafts", "trash" -> normalized;
            default -> "active-events";
        };
    }

    private String normalizeHostingPublicationFilter(String value) {
        return "drafts".equals(safeText(value)) ? "drafts" : "all";
    }

    private String normalizeActivitiesSecondaryFilter(String value) {
        String normalized = safeText(value);
        return switch (normalized) {
            case "past", "relevant" -> normalized;
            default -> "recent";
        };
    }

    private String normalizeActivitiesView(String value) {
        String normalized = safeText(value);
        return switch (normalized) {
            case "week", "month", "distance" -> normalized;
            default -> "day";
        };
    }

    private String normalizeActivitiesSort(String value, String view, String secondaryFilter) {
        String normalized = safeText(value);
        if (StringUtils.hasText(normalized)) {
            return normalized;
        }
        if ("distance".equals(view)) {
            return "distance";
        }
        if ("relevant".equals(secondaryFilter)) {
            return "relevance";
        }
        return "date";
    }

    private String normalizeExploreOrder(String value) {
        String normalized = safeText(value);
        return switch (normalized) {
            case "past-events", "nearby", "most-relevant", "top-rated" -> normalized;
            default -> "upcoming";
        };
    }

    private String normalizeExploreView(String value) {
        return "distance".equals(safeText(value)) ? "distance" : "day";
    }

    private String normalizeTopic(String value) {
        return safeText(value).replaceFirst("^#+", "");
    }

    private int normalizeLimit(Integer value, int fallback) {
        return Math.max(1, value == null ? fallback : value);
    }

    private int normalizeCount(Number value) {
        if (value == null) {
            return 0;
        }
        return Math.max(0, (int) Math.floor(value.doubleValue()));
    }

    private Integer nullableCount(Number value) {
        return value == null ? null : Math.max(0, (int) Math.floor(value.doubleValue()));
    }

    private double safeDouble(Number value) {
        return value == null ? 0d : value.doubleValue();
    }

    private String normalizeId(String value) {
        String normalized = safeText(value);
        return StringUtils.hasText(normalized) ? normalized : null;
    }

    private String safeText(String value) {
        return value == null ? "" : value.trim();
    }

    private List<String> normalizeIds(Collection<String> values) {
        if (values == null) {
            return List.of();
        }
        LinkedHashSet<String> normalized = new LinkedHashSet<>();
        for (String value : values) {
            String id = normalizeId(value);
            if (StringUtils.hasText(id)) {
                normalized.add(id);
            }
        }
        return new ArrayList<>(normalized);
    }

    private List<String> normalizeStrings(Collection<String> values) {
        if (values == null) {
            return List.of();
        }
        List<String> normalized = new ArrayList<>();
        for (String value : values) {
            String text = safeText(value);
            if (StringUtils.hasText(text)) {
                normalized.add(text);
            }
        }
        return normalized;
    }

    private List<SubEventFormItemDto> cloneSubEvents(List<SubEventFormItemDto> items) {
        return items == null ? new ArrayList<>() : new ArrayList<>(items);
    }

    private List<EventSlotTemplateDto> cloneSlotTemplates(List<EventSlotTemplateDto> items) {
        return items == null ? new ArrayList<>() : new ArrayList<>(items);
    }

    private boolean isGeneratedSlotRecord(ActivityEvent record) {
        return record != null
                && (Boolean.TRUE.equals(record.getGenerated())
                        || "slot".equalsIgnoreCase(safeText(record.getEventType()))
                        || StringUtils.hasText(normalizeId(record.getParentEventId())));
    }

    private boolean isSlotParentRecord(ActivityEvent record) {
        return record != null
                && Boolean.TRUE.equals(record.getSlotsEnabled())
                && !isGeneratedSlotRecord(record)
                && record.getSlotTemplates() != null
                && !record.getSlotTemplates().isEmpty();
    }

    private void materializeSlotOccurrences() {
        List<ActivityEvent> documents = allEventDocuments();
        List<ActivityEvent> parents = computePreferredEventRecords(documents).stream()
                .filter(this::isSlotParentRecord)
                .toList();
        if (parents.isEmpty()) {
            return;
        }

        List<ActivityEvent> toSave = new ArrayList<>();
        for (ActivityEvent parent : parents) {
            Map<String, ActivityEvent> existingBySourceId = new LinkedHashMap<>();
            for (ActivityEvent record : documents) {
                if (isGeneratedSlotRecord(record)
                        && normalizeId(parent.getSourceId()).equals(normalizeId(record.getParentEventId()))) {
                    existingBySourceId.put(normalizeId(record.getSourceId()), record);
                }
            }
            for (ActivityEvent generated : buildGeneratedSlotRecordsForParent(parent, existingBySourceId)) {
                ActivityEvent existing = existingBySourceId.get(normalizeId(generated.getSourceId()));
                if (existing == null) {
                    toSave.add(generated);
                }
            }
        }
        if (!toSave.isEmpty()) {
            activityEventsRepository.saveAll(toSave);
        }
    }

    private List<ActivityEvent> buildGeneratedSlotRecordsForParent(
            ActivityEvent parent,
            Map<String, ActivityEvent> existingBySourceId) {
        LocalDateTime parentStart = toLocalDateTime(parent.getStartAtIso());
        LocalDateTime parentEnd = toLocalDateTime(parent.getEndAtIso());
        if (parentStart == null || parentEnd == null || !parentEnd.isAfter(parentStart)) {
            return List.of();
        }

        LocalDateTime now = LocalDateTime.now(ZoneOffset.UTC);
        LocalDateTime horizonStart = parentStart.isAfter(now.minusDays(1)) ? parentStart : now.minusDays(1);
        LocalDateTime horizonEnd = parentEnd.isBefore(now.plusDays(45)) ? parentEnd : now.plusDays(45);
        if (horizonEnd.isBefore(horizonStart)) {
            return List.of();
        }

        List<ActivityEvent> records = new ArrayList<>();
        String parentSourceId = normalizeId(parent.getSourceId());
        String creatorUserId = normalizeId(parent.getCreatorUserId());
        for (EventSlotTemplateDto template : cloneSlotTemplates(parent.getSlotTemplates())) {
            if (template == null || !StringUtils.hasText(template.id())) {
                continue;
            }
            LocalDateTime templateStart = toLocalDateTime(template.startAt());
            LocalDateTime templateEnd = toLocalDateTime(template.endAt());
            if (templateStart == null || templateEnd == null) {
                continue;
            }
            long durationMinutes = Math.max(60L, ChronoUnit.MINUTES.between(templateStart, templateEnd));
            for (LocalDateTime occurrenceStart : generateSlotOccurrenceStarts(parent.getFrequency(), templateStart, horizonStart, horizonEnd)) {
                LocalDateTime occurrenceEnd = occurrenceStart.plusMinutes(durationMinutes);
                if (occurrenceStart.isBefore(parentStart) || occurrenceEnd.isAfter(parentEnd)) {
                    continue;
                }
                String sourceId = buildGeneratedSlotSourceId(parentSourceId, template.id(), occurrenceStart);
                ActivityEvent existing = existingBySourceId.get(normalizeId(sourceId));
                if (existing != null) {
                    continue;
                }
                ActivityEvent next = new ActivityEvent();
                String nowIso = Instant.now().toString();
                next.setId(resolveExistingId(creatorUserId, TYPE_EVENTS, sourceId, existing));
                next.setSyncKey(resolveExistingSyncKey(creatorUserId, TYPE_EVENTS, sourceId, existing == null ? null : existing.getSyncKey()));
                next.setSourceId(sourceId);
                next.setOwnerUserId(creatorUserId);
                next.setType(TYPE_EVENTS);
                next.setAvatar(parent.getAvatar());
                next.setTitle(parent.getTitle());
                next.setSubtitle(parent.getSubtitle());
                next.setTimeframe(buildGeneratedSlotTimeframe(occurrenceStart, occurrenceEnd));
                next.setInviter(null);
                next.setUnread(existing == null ? 0 : normalizeCount(existing.getUnread()));
                next.setActivity(existing == null ? 0 : normalizeCount(existing.getActivity()));
                next.setIsAdmin(true);
                next.setIsInvitation(false);
                next.setIsHosting(false);
                next.setIsTrashed(existing != null && Boolean.TRUE.equals(existing.getIsTrashed()));
                next.setPublished(Boolean.FALSE.equals(parent.getPublished()) ? Boolean.FALSE : Boolean.TRUE);
                next.setTrashedAtIso(existing == null ? null : existing.getTrashedAtIso());
                next.setCreatorUserId(creatorUserId);
                next.setCreatorName(parent.getCreatorName());
                next.setCreatorInitials(parent.getCreatorInitials());
                next.setCreatorGender(parent.getCreatorGender());
                next.setCreatorCity(parent.getCreatorCity());
                next.setVisibility(parent.getVisibility());
                next.setBlindMode(parent.getBlindMode());
                next.setStartAtIso(occurrenceStart.toInstant(ZoneOffset.UTC).toString());
                next.setEndAtIso(occurrenceEnd.toInstant(ZoneOffset.UTC).toString());
                next.setDistanceKm(null);
                next.setImageUrl(StringUtils.hasText(safeText(existing == null ? null : existing.getImageUrl()))
                        ? existing.getImageUrl()
                        : parent.getImageUrl());
                next.setSourceLink(StringUtils.hasText(safeText(existing == null ? null : existing.getSourceLink()))
                        ? existing.getSourceLink()
                        : parent.getSourceLink());
                next.setLocation(StringUtils.hasText(safeText(existing == null ? null : existing.getLocation()))
                        ? existing.getLocation()
                        : parent.getLocation());
                next.setLocationCoordinates(cloneLocation(parent.getLocationCoordinates()));
                next.setLocationGeo(toGeoPoint(next.getLocationCoordinates()));
                next.setCapacityMin(parent.getCapacityMin());
                next.setCapacityMax(parent.getCapacityMax());
                next.setCapacityTotal(normalizeCount(parent.getCapacityTotal()));
                next.setAutoInviter(parent.getAutoInviter());
                next.setFrequency(parent.getFrequency());
                next.setTicketing(parent.getTicketing());
                next.setSlotsEnabled(false);
                next.setSlotTemplates(List.of());
                next.setParentEventId(parentSourceId);
                next.setSlotTemplateId(template.id());
                next.setGenerated(true);
                next.setEventType("slot");
                next.setAcceptedMembers(existing == null ? 0 : normalizeCount(existing.getAcceptedMembers()));
                next.setPendingMembers(existing == null ? 0 : normalizeCount(existing.getPendingMembers()));
                next.setTopics(normalizeStrings(parent.getTopics()));
                next.setSubEvents(cloneSubEvents(parent.getSubEvents()));
                next.setSubEventsDisplayMode(parent.getSubEventsDisplayMode());
                next.setRating(existing == null ? safeDouble(parent.getRating()) : safeDouble(existing.getRating()));
                next.setRelevance(existing == null ? safeDouble(parent.getRelevance()) : safeDouble(existing.getRelevance()));
                next.setAffinity(existing == null ? safeDouble(parent.getAffinity()) : safeDouble(existing.getAffinity()));
                next.setCreatedDate(existing == null ? nowIso : safeText(existing.getCreatedDate()));
                next.setCreatedUser(existing == null ? creatorUserId : safeText(existing.getCreatedUser()));
                next.setUpdatedDate(nowIso);
                next.setUpdatedUser(creatorUserId);
                next.setAdmins(resolveAdminUserIds(parentSourceId, creatorUserId));
                next.normalizeLifecycleState();
                records.add(next);
            }
        }
        return records;
    }

    private List<EventSlotOccurrenceDto> resolveUpcomingSlotOccurrences(ActivityEvent record) {
        if (!isSlotParentRecord(record)) {
            return List.of();
        }
        String parentSourceId = normalizeId(record.getSourceId());
        long nowMs = System.currentTimeMillis() - (60L * 60L * 1000L);
        return computePreferredEventRecords(allEventDocuments()).stream()
                .filter(this::isGeneratedSlotRecord)
                .filter(item -> parentSourceId.equals(normalizeId(item.getParentEventId())))
                .filter(item -> !Boolean.TRUE.equals(item.getIsTrashed()))
                .filter(item -> toSortableDate(item.getEndAtIso()) >= nowMs)
                .sorted(Comparator.comparing(item -> toSortableDate(item.getStartAtIso())))
                .map(item -> new EventSlotOccurrenceDto(
                        normalizeId(item.getSourceId()),
                        parentSourceId,
                        safeText(item.getSlotTemplateId()),
                        safeText(item.getTitle()),
                        safeText(item.getTimeframe()),
                        safeText(item.getStartAtIso()),
                        safeText(item.getEndAtIso()),
                        normalizeCount(item.getCapacityTotal()),
                        resolveAcceptedMemberUserIds(item).size(),
                        resolvePendingMemberUserIds(item).size()))
                .toList();
    }

    private String buildGeneratedSlotSourceId(String parentEventId, String slotTemplateId, LocalDateTime occurrenceStart) {
        return parentEventId + ":slot:" + slotTemplateId + ":" + occurrenceStart.toInstant(ZoneOffset.UTC);
    }

    private String buildGeneratedSlotTimeframe(LocalDateTime startAt, LocalDateTime endAt) {
        return startAt.toLocalDate() + " · "
                + String.format("%02d:%02d", startAt.getHour(), startAt.getMinute())
                + " - "
                + String.format("%02d:%02d", endAt.getHour(), endAt.getMinute());
    }

    private List<LocalDateTime> generateSlotOccurrenceStarts(
            String frequency,
            LocalDateTime templateStart,
            LocalDateTime horizonStart,
            LocalDateTime horizonEnd) {
        String normalizedFrequency = safeText(frequency).toLowerCase();
        if (!StringUtils.hasText(normalizedFrequency) || "one-time".equals(normalizedFrequency)) {
            return !templateStart.isBefore(horizonStart) && !templateStart.isAfter(horizonEnd)
                    ? List.of(templateStart)
                    : List.of();
        }

        List<LocalDateTime> starts = new ArrayList<>();
        LocalDate cursor = horizonStart.toLocalDate();
        LocalDate endDate = horizonEnd.toLocalDate();
        while (!cursor.isAfter(endDate)) {
            if (matchesSlotFrequency(cursor, templateStart, normalizedFrequency)) {
                LocalDateTime candidate = cursor.atTime(templateStart.toLocalTime());
                if (!candidate.isBefore(horizonStart) && !candidate.isAfter(horizonEnd)) {
                    starts.add(candidate);
                }
            }
            cursor = cursor.plusDays(1);
        }
        return starts;
    }

    private boolean matchesSlotFrequency(LocalDate date, LocalDateTime templateStart, String frequency) {
        if ("daily".equals(frequency)) {
            return true;
        }
        if ("weekly".equals(frequency)) {
            return date.getDayOfWeek() == templateStart.getDayOfWeek();
        }
        if ("bi-weekly".equals(frequency) || "biweekly".equals(frequency)) {
            if (date.getDayOfWeek() != templateStart.getDayOfWeek()) {
                return false;
            }
            long weeksBetween = ChronoUnit.WEEKS.between(templateStart.toLocalDate(), date);
            return weeksBetween >= 0L && weeksBetween % 2L == 0L;
        }
        if ("monthly".equals(frequency)) {
            int day = Math.min(templateStart.getDayOfMonth(), date.lengthOfMonth());
            return date.getDayOfMonth() == day;
        }
        return false;
    }

    private LocalDateTime toLocalDateTime(String value) {
        if (!StringUtils.hasText(value)) {
            return null;
        }
        try {
            return Instant.parse(value.trim()).atOffset(ZoneOffset.UTC).toLocalDateTime();
        } catch (DateTimeParseException ignored) {
            try {
                return LocalDateTime.parse(value.trim());
            } catch (DateTimeParseException secondIgnored) {
                return null;
            }
        }
    }

    private LocationCoordinatesDto cloneLocation(LocationCoordinatesDto value) {
        if (value == null || value.latitude() == null || value.longitude() == null) {
            return null;
        }
        return new LocationCoordinatesDto(value.latitude(), value.longitude());
    }

    private GeoJsonPoint cloneGeoPoint(GeoJsonPoint value) {
        if (value == null) {
            return null;
        }
        return new GeoJsonPoint(value.getX(), value.getY());
    }

    private LocationCoordinatesDto toLocationCoordinatesDto(Users.LocationCoordinatesRecord value) {
        if (value == null || value.latitude() == null || value.longitude() == null) {
            return null;
        }
        return new LocationCoordinatesDto(value.latitude(), value.longitude());
    }

    private GeoJsonPoint toGeoPoint(LocationCoordinatesDto value) {
        if (value == null || value.latitude() == null || value.longitude() == null) {
            return null;
        }
        return new GeoJsonPoint(value.longitude(), value.latitude());
    }

    private Document toGeoJsonDocument(GeoJsonPoint value) {
        if (value == null) {
            return null;
        }
        return new Document("type", "Point")
                .append("coordinates", List.of(value.getX(), value.getY()));
    }

    private ActivityEvent readGeoOrderedDocument(Document rawDocument) {
        if (rawDocument == null) {
            return null;
        }
        Document copy = new Document(rawDocument);
        copy.remove("distanceSortValue");
        return mongoTemplate.getConverter().read(ActivityEvent.class, copy);
    }

    private Integer resolveDistanceMetersExact(LocationCoordinatesDto viewerCoordinates, ActivityEvent record) {
        LocationCoordinatesDto eventCoordinates = record == null ? null : cloneLocation(record.getLocationCoordinates());
        if (viewerCoordinates == null || eventCoordinates == null) {
            Double fallbackDistanceKm = record == null ? null : record.getDistanceKm();
            if (fallbackDistanceKm == null || !Double.isFinite(fallbackDistanceKm)) {
                return null;
            }
            return Math.max(0, (int) Math.round(fallbackDistanceKm * 1000d));
        }
        return haversineDistanceMeters(viewerCoordinates, eventCoordinates);
    }

    private int haversineDistanceMeters(LocationCoordinatesDto from, LocationCoordinatesDto to) {
        double earthRadiusMeters = 6_371_000d;
        double latitudeDelta = Math.toRadians(to.latitude() - from.latitude());
        double longitudeDelta = Math.toRadians(to.longitude() - from.longitude());
        double fromLatitude = Math.toRadians(from.latitude());
        double toLatitude = Math.toRadians(to.latitude());
        double sinLatitude = Math.sin(latitudeDelta / 2d);
        double sinLongitude = Math.sin(longitudeDelta / 2d);
        double a = (sinLatitude * sinLatitude)
                + (Math.cos(fromLatitude) * Math.cos(toLatitude) * sinLongitude * sinLongitude);
        double c = 2d * Math.atan2(Math.sqrt(a), Math.sqrt(1d - a));
        return Math.max(0, (int) Math.round(earthRadiusMeters * c));
    }

    private long toSortableDate(String value) {
        if (!StringUtils.hasText(value)) {
            return 0L;
        }
        try {
            return Instant.parse(value.trim()).toEpochMilli();
        } catch (DateTimeParseException ignored) {
            try {
                return LocalDateTime.parse(value.trim()).toInstant(ZoneOffset.UTC).toEpochMilli();
            } catch (DateTimeParseException secondIgnored) {
                return 0L;
            }
        }
    }

    private long dateOnly(long timestamp) {
        if (timestamp <= 0L) {
            return 0L;
        }
        return Instant.ofEpochMilli(timestamp).atZone(ZoneOffset.UTC).toLocalDate().atStartOfDay(ZoneOffset.UTC).toInstant().toEpochMilli();
    }

    private String normalizeDateTime(String value, String fallback) {
        if (!StringUtils.hasText(value)) {
            return StringUtils.hasText(fallback) ? fallback : Instant.now().toString();
        }
        String normalized = value.trim();
        try {
            return Instant.parse(normalized).toString();
        } catch (DateTimeParseException ignored) {
            try {
                return LocalDateTime.parse(normalized).toInstant(ZoneOffset.UTC).toString();
            } catch (DateTimeParseException secondIgnored) {
                return normalized;
            }
        }
    }

    private int safeSortableInt(long value) {
        if (value > Integer.MAX_VALUE) {
            return Integer.MAX_VALUE;
        }
        if (value < Integer.MIN_VALUE) {
            return Integer.MIN_VALUE;
        }
        return (int) value;
    }

    private String resolveCreatorName(String requestedName, Users creator) {
        if (StringUtils.hasText(requestedName)) {
            return requestedName.trim();
        }
        return creator == null ? "" : safeText(creator.getName());
    }

    private String resolveCreatorInitials(String requestedInitials, Users creator, String requestedName) {
        if (StringUtils.hasText(requestedInitials)) {
            return requestedInitials.trim();
        }
        String name = resolveCreatorName(requestedName, creator);
        if (!StringUtils.hasText(name)) {
            return "U";
        }
        String[] words = name.trim().split("\\s+");
        if (words.length == 1) {
            return words[0].substring(0, Math.min(2, words[0].length())).toUpperCase();
        }
        return ("" + words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
    }

    private String resolveCreatorGender(String requestedGender, Users creator) {
        if (StringUtils.hasText(requestedGender)) {
            return requestedGender.trim();
        }
        return creator == null ? "man" : safeText(creator.getGender());
    }

    private String resolveCreatorCity(String requestedCity, Users creator) {
        if (StringUtils.hasText(requestedCity)) {
            return requestedCity.trim();
        }
        return creator == null ? "" : safeText(creator.getCity());
    }

    private String resolveVisibility(String requestedVisibility, ActivityEvent existing, String targetType) {
        if (StringUtils.hasText(requestedVisibility)) {
            return requestedVisibility.trim();
        }
        if (existing != null && StringUtils.hasText(existing.getVisibility())) {
            return existing.getVisibility();
        }
        return TYPE_HOSTING.equals(targetType) ? "Invitation only" : "Public";
    }

    private String resolveBlindMode(String requestedBlindMode, ActivityEvent existing) {
        if (StringUtils.hasText(requestedBlindMode)) {
            return requestedBlindMode.trim();
        }
        if (existing != null && StringUtils.hasText(existing.getBlindMode())) {
            return existing.getBlindMode();
        }
        return "Open Event";
    }

    private static <T> List<T> concat(List<T> first, List<T> second) {
        List<T> merged = new ArrayList<>(first.size() + second.size());
        merged.addAll(first);
        merged.addAll(second);
        return merged;
    }

    private record ViewerContext(
            String userId,
            Users user,
            LocationCoordinatesDto locationCoordinates,
            int affinity) {
    }

    private record EventProjection(
            ActivityEvent record,
            EventRecordDto item,
            int distanceMeters,
            double relevanceValue,
            long startAtMs,
            long dayMs,
            int affinityGap,
            int ratingValue,
            boolean past) {
    }
}
