package com.raxim.myscoutee.profile.service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.function.BiPredicate;

import jakarta.annotation.PreDestroy;
import org.bson.Document;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.data.mongodb.core.BulkOperations;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationOperation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.server.ResponseStatusException;

import com.raxim.myscoutee.common.config.mongo.MongoSessionMode;
import com.raxim.myscoutee.common.config.mongo.MongoSessionModeContext;
import com.raxim.myscoutee.profile.data.AssetCatalog;
import com.raxim.myscoutee.profile.data.document.Chat;
import com.raxim.myscoutee.profile.data.document.ChatMessage;
import com.raxim.myscoutee.profile.data.document.Asset;
import com.raxim.myscoutee.profile.data.document.Users;
import com.raxim.myscoutee.profile.data.document.ActivityEvent;
import com.raxim.myscoutee.profile.data.document.ActivityMember;
import com.raxim.myscoutee.profile.data.document.ActivitySubEventResource;
import com.raxim.myscoutee.profile.data.document.ActivitySubEventStageRuntime;
import com.raxim.myscoutee.profile.data.document.SubEventItem;
import com.raxim.myscoutee.profile.data.document.ChatMessage.ChatAvatarRecord;
import com.raxim.myscoutee.profile.data.document.ChatMessage.ChatMessageAttachmentRecord;
import com.raxim.myscoutee.profile.data.document.ChatMessage.ChatMessageReactionRecord;
import com.raxim.myscoutee.profile.data.document.ChatMessage.ChatMessageReplyRecord;
import com.raxim.myscoutee.profile.data.document.ChatMessage.ChatReadAvatarRecord;
import com.raxim.myscoutee.profile.data.document.ActivitySubEventResource.SubEventAssignedAssetSettingsRecord;
import com.raxim.myscoutee.profile.data.document.ActivitySubEventResource.SubEventSupplyContributionEntryRecord;
import com.raxim.myscoutee.profile.data.document.Asset.AssetRequestRecord;
import com.raxim.myscoutee.profile.data.document.Chat.SupportCaseAssigneeRecord;
import com.raxim.myscoutee.profile.data.document.Chat.SupportCaseRecord;
import com.raxim.myscoutee.profile.data.dto.activities.ChatDtos.ChatDeviceDeleteRequestDto;
import com.raxim.myscoutee.profile.data.dto.activities.ChatDtos.ChatDeviceUpsertRequestDto;
import com.raxim.myscoutee.profile.data.dto.activities.ChatDtos.ChatDto;
import com.raxim.myscoutee.profile.data.dto.activities.ChatDtos.ChatGroupContextDto;
import com.raxim.myscoutee.profile.data.dto.activities.ChatDtos.ChatHeaderSyncResponseDto;
import com.raxim.myscoutee.profile.data.dto.activities.ChatDtos.ChatMetricBucketDto;
import com.raxim.myscoutee.profile.data.dto.activities.ChatDtos.ChatMetricsDto;
import com.raxim.myscoutee.profile.data.dto.activities.ChatDtos.ChatNavigationContextDto;
import com.raxim.myscoutee.profile.data.dto.activities.ChatDtos.ChatMessageDto;
import com.raxim.myscoutee.profile.data.dto.activities.ChatDtos.ChatMemberDto;
import com.raxim.myscoutee.profile.data.dto.activities.ChatDtos.ChatMembersPageResponseDto;
import com.raxim.myscoutee.profile.data.dto.activities.ChatDtos.ChatMessageAttachmentDto;
import com.raxim.myscoutee.profile.data.dto.activities.ChatDtos.ChatMessageReplyDto;
import com.raxim.myscoutee.profile.data.dto.activities.ChatDtos.ChatMessagesPageResponseDto;
import com.raxim.myscoutee.profile.data.dto.activities.ChatDtos.ChatPageResponseDto;
import com.raxim.myscoutee.profile.data.dto.activities.ChatDtos.ChatReadAvatarDto;
import com.raxim.myscoutee.profile.data.dto.activities.ChatDtos.ChatReadReceiptDto;
import com.raxim.myscoutee.profile.data.dto.activities.ChatDtos.ChatServiceEnsureRequestDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.SubEventGroupItemDto;
import com.raxim.myscoutee.profile.repository.ActivityMembersRepository;
import com.raxim.myscoutee.profile.repository.ActivitySubEventResourcesRepository;
import com.raxim.myscoutee.profile.repository.ActivitySubEventStageRuntimeRepository;
import com.raxim.myscoutee.profile.repository.ChatMessagesRepository;
import com.raxim.myscoutee.profile.repository.ChatsRepository;
import com.raxim.myscoutee.profile.repository.UsersRepository;
import com.raxim.myscoutee.profile.security.AccessControlService;
import com.raxim.myscoutee.profile.security.AccessPolicyKeys;
import com.raxim.myscoutee.profile.service.mapper.ChatMapper;
import com.raxim.myscoutee.profile.service.mapper.ChatMessageMapper;
import com.raxim.myscoutee.profile.service.mapper.SubEventItemMapper;

@Service
public class ChatService {
    public static final String RANDOM_ROOM_WELCOME_MESSAGE_TYPE = "random-room-welcome";
    public static final String RANDOM_ROOM_WELCOME_MESSAGE_ID =
            "system:" + RANDOM_ROOM_WELCOME_MESSAGE_TYPE;
    public static final String RANDOM_ROOM_WELCOME_MESSAGE =
            "Welcome! We matched you here by affinity and past interactions. Leave anytime. "
                    + "Set visibility to non-public in Global Settings to stop future Random Rooms.";
    public static final String TOURNAMENT_ROOM_WELCOME_MESSAGE_TYPE = "tournament-room-welcome";

    private static final Logger LOGGER = LoggerFactory.getLogger(ChatService.class);
    private static final DateTimeFormatter CHAT_TIME_FORMATTER = DateTimeFormatter.ofPattern("h:mm a", Locale.US)
            .withZone(ZoneId.systemDefault());
    private static final String SUPPORT_CASE_STATUS_PENDING = "pending";
    private static final String SUPPORT_CASE_STATUS_WARNED = "warned";
    private static final String SUPPORT_CASE_STATUS_PICKED = "picked";
    private static final String SUPPORT_CASE_STATUS_SOLVED = "solved";
    private static final String SUPPORT_CASE_STATUS_BLOCKED = "blocked";
    private static final String SUPPORT_CASE_FILTER_ALL = "all";
    private static final String CHAT_CHANNEL_MAIN_EVENT = "mainEvent";
    private static final String CHAT_CHANNEL_OPTIONAL_SUB_EVENT = "optionalSubEvent";
    private static final String CHAT_CHANNEL_GROUP_SUB_EVENT = "groupSubEvent";
    private static final String CHAT_CHANNEL_SERVICE_EVENT = "serviceEvent";
    private static final String CHAT_CHANNEL_APP_SUPPORT = "appSupport";
    private static final String CHAT_CHANNEL_SUPPORT_CASE = "supportCase";
    private static final String OWNER_TYPE_EVENT = "event";
    private static final String OWNER_TYPE_SUB_EVENT = "subEvent";
    private static final String OWNER_TYPE_GROUP = "group";
    private static final String MEMBER_STATUS_ACCEPTED = "accepted";
    private static final String MEMBER_STATUS_PENDING = "pending";
    private static final String RUNTIME_STATUS_DELETED = "D";
    private static final String ASSET_TYPE_TRANSPORT = AssetCatalog.TYPE_TRANSPORT;
    private static final String ASSET_TYPE_ACCOMMODATION = AssetCatalog.TYPE_ACCOMMODATION;
    private static final String ASSET_TYPE_SUPPLIES = AssetCatalog.TYPE_SUPPLIES;
    private static final int DEFAULT_CHAT_MESSAGES_PAGE_SIZE = 20;
    private static final int MAX_CHAT_MESSAGES_PAGE_SIZE = 100;

    private final ChatsRepository chatsRepository;
    private final ChatMessagesRepository chatMessagesRepository;
    private final MongoTemplate mongoTemplate;
    private final UsersRepository usersRepository;
    private final ActivityMembersRepository activityMembersRepository;
    private final ActivitySubEventResourcesRepository activitySubEventResourcesRepository;
    private final ActivitySubEventStageRuntimeRepository activitySubEventStageRuntimeRepository;
    private final HomeUserProfileService homeUserProfileService;
    private final ChatStreamPublisher chatStreamPublisher;
    private final ChatPushNotificationService chatPushNotificationService;
    private final AdminTelemetryService adminTelemetryService;
    private final AdminMenuCounterService adminMenuCounterService;
    private final AccessControlService accessControlService;
    private final ChatMapper chatMapper;
    private final ChatMessageMapper chatMessageMapper;
    private final ExecutorService chatWriteExecutor = Executors.newVirtualThreadPerTaskExecutor();

    public ChatService(
            ChatsRepository chatsRepository,
            ChatMessagesRepository chatMessagesRepository,
            MongoTemplate mongoTemplate,
            UsersRepository usersRepository,
            ActivityMembersRepository activityMembersRepository,
            ActivitySubEventResourcesRepository activitySubEventResourcesRepository,
            ActivitySubEventStageRuntimeRepository activitySubEventStageRuntimeRepository,
            HomeUserProfileService homeUserProfileService,
            ChatStreamPublisher chatStreamPublisher,
            ChatPushNotificationService chatPushNotificationService,
            AdminTelemetryService adminTelemetryService,
            AdminMenuCounterService adminMenuCounterService,
            AccessControlService accessControlService,
            ChatMapper chatMapper,
            ChatMessageMapper chatMessageMapper) {
        this.chatsRepository = chatsRepository;
        this.chatMessagesRepository = chatMessagesRepository;
        this.mongoTemplate = mongoTemplate;
        this.usersRepository = usersRepository;
        this.activityMembersRepository = activityMembersRepository;
        this.activitySubEventResourcesRepository = activitySubEventResourcesRepository;
        this.activitySubEventStageRuntimeRepository = activitySubEventStageRuntimeRepository;
        this.homeUserProfileService = homeUserProfileService;
        this.chatStreamPublisher = chatStreamPublisher;
        this.chatPushNotificationService = chatPushNotificationService;
        this.adminTelemetryService = adminTelemetryService;
        this.adminMenuCounterService = adminMenuCounterService;
        this.accessControlService = accessControlService;
        this.chatMapper = chatMapper;
        this.chatMessageMapper = chatMessageMapper;
    }

    @PreDestroy
    void shutdownChatWriteExecutor() {
        chatWriteExecutor.shutdownNow();
    }

    public List<ChatDto> queryChats(String requestedUserId) {
        return queryChatPage(
                requestedUserId,
                "all",
                "date",
                "desc",
                null,
                null,
                MAX_CHAT_MESSAGES_PAGE_SIZE,
                null,
                null,
                false,
                null).items();
    }

    public String ensureMainEventChat(ActivityEvent event, Collection<String> participantUserIds) {
        return ensureMainEventChatDocuments(event, participantUserIds).chatId();
    }

    public PublishedMainEventChatResult ensurePublishedMainEventChat(
            ActivityEvent event,
            Collection<String> participantUserIds) {
        MainEventChatDocumentsResult result = ensureMainEventChatDocuments(event, participantUserIds);
        Set<String> createdOwnerUserIds = result.createdDocuments().stream()
                .map(Chat::getOwnerUserId)
                .map(this::normalizeId)
                .filter(StringUtils::hasText)
                .collect(java.util.stream.Collectors.toCollection(LinkedHashSet::new));
        return new PublishedMainEventChatResult(result.chatId(), createdOwnerUserIds);
    }

    private MainEventChatDocumentsResult ensureMainEventChatDocuments(
            ActivityEvent event,
            Collection<String> participantUserIds) {
        String eventId = normalizeId(event == null ? null : event.getSourceId());
        List<String> memberUserIds = participantUserIds == null
                ? List.of()
                : participantUserIds.stream()
                        .map(this::normalizeId)
                        .filter(StringUtils::hasText)
                        .distinct()
                        .sorted()
                        .toList();
        if (!StringUtils.hasText(eventId) || memberUserIds.isEmpty()) {
            throw new IllegalStateException("A system event chat requires an event id and participants.");
        }

        String chatId = eventId;
        String nowIso = Instant.now().toString();
        List<Chat> existingDocuments = chatsRepository.findByChatId(chatId).stream()
                .filter(Objects::nonNull)
                .toList();
        Map<String, Chat> existingByOwnerUserId = new LinkedHashMap<>();
        for (Chat existing : existingDocuments) {
            String ownerUserId = normalizeId(existing.getOwnerUserId());
            if (StringUtils.hasText(ownerUserId)) {
                existingByOwnerUserId.putIfAbsent(ownerUserId, existing);
            }
        }

        List<Chat> documentsToSave = new ArrayList<>();
        List<Chat> createdDocuments = new ArrayList<>();
        for (String memberUserId : memberUserIds) {
            Chat current = existingByOwnerUserId.get(memberUserId);
            Chat document = current == null ? new Chat() : copyChat(current);
            document.setMongoId(current == null
                    ? buildMongoId(memberUserId, chatId)
                    : current.getMongoId());
            document.setChatId(chatId);
            document.setOwnerUserId(memberUserId);
            document.setAvatar(firstNonBlank(event.getAvatar(), "SY"));
            document.setTitle(firstNonBlank(event.getTitle(), "Random Room"));
            document.setLastMessage(current == null ? "" : safeText(current.getLastMessage()));
            document.setLastSenderId(current == null ? null : current.getLastSenderId());
            document.setMemberIds(new ArrayList<>(memberUserIds));
            document.setUnread(current == null ? 0 : normalizeCount(current.getUnread()));
            document.setDateIso(current == null
                    ? nowIso
                    : firstNonBlank(current.getDateIso(), nowIso));
            document.setChannelType(CHAT_CHANNEL_MAIN_EVENT);
            document.setOwnerId(eventId);
            document.setEventId(eventId);
            document.setOwnerStatus(ActivityEvent.STATUS_ACTIVE);
            document.setRevision(current == null ? 1L : normalizeChatRevision(current.getRevision()));
            document.setSubEventId(null);
            document.setGroupId(null);
            document.setDistanceKm(null);
            document.setDistanceMetersExact(null);
            document.setSupportCase(null);
            documentsToSave.add(document);
            if (current == null) {
                createdDocuments.add(document);
            }
        }
        chatsRepository.saveAll(documentsToSave);

        List<Chat> staleDocuments = existingDocuments.stream()
                .filter(document -> !memberUserIds.contains(normalizeId(document.getOwnerUserId())))
                .toList();
        if (!staleDocuments.isEmpty()) {
            chatsRepository.deleteAll(staleDocuments);
            incrementStoredChatCounters(staleDocuments.stream()
                    .map(document -> new ChatCounterChange(document, -normalizeCount(document.getUnread())))
                    .toList());
        }
        evictChatOwnerReadCaches(documentsToSave);
        evictChatOwnerReadCaches(staleDocuments);

        return new MainEventChatDocumentsResult(chatId, List.copyOf(createdDocuments));
    }

    public long updateEventChatOwnerStatus(String eventId, String ownerStatus) {
        String normalizedEventId = normalizeId(eventId);
        String normalizedOwnerStatus = safeText(ownerStatus);
        if (!StringUtils.hasText(normalizedEventId) || !StringUtils.hasText(normalizedOwnerStatus)) {
            return 0L;
        }
        List<Chat> chatDocuments = chatsRepository.findByEventId(normalizedEventId).stream()
                .filter(Objects::nonNull)
                .toList();
        if (chatDocuments.isEmpty()) {
            return 0L;
        }
        Query query = Query.query(Criteria.where("eventId").is(normalizedEventId)
                .and("ownerStatus").ne(normalizedOwnerStatus));
        long modifiedCount = mongoTemplate.updateMulti(
                query,
                Update.update("ownerStatus", normalizedOwnerStatus)
                        .set("revision", Instant.now().toEpochMilli()),
                Chat.class).getModifiedCount();
        if (modifiedCount > 0L) {
            evictChatOwnerReadCaches(chatDocuments);
        }
        return modifiedCount;
    }

    public ChatHeaderSyncResponseDto syncChatHeader(
            String chatId,
            String requestedUserId,
            Long knownRevision) {
        String userId = requireResolvedUserId(requestedUserId);
        String normalizedChatId = normalizeId(chatId);
        if (!StringUtils.hasText(normalizedChatId)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Chat id is required.");
        }
        Chat chat = chatsRepository.findByOwnerUserIdAndChatId(userId, normalizedChatId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Chat not found."));
        long revision = normalizeChatRevision(chat.getRevision());
        boolean changed = knownRevision == null || knownRevision.longValue() != revision;
        return new ChatHeaderSyncResponseDto(
                revision,
                changed,
                changed && StringUtils.hasText(safeText(chat.getOwnerStatus()))
                        ? safeText(chat.getOwnerStatus())
                        : null);
    }

    public ChatPageResponseDto queryChatPage(
            String requestedUserId,
            String contextFilterValue,
            String sortValue,
            String sortDirectionValue,
            String secondaryFilterValue,
            String cursor,
            Integer limitValue,
            String rangeStartIso,
            String rangeEndIso,
            Boolean adminServiceOnly,
            String supportCaseFilterValue) {
        String userId = resolveUserId(requestedUserId);
        if (!StringUtils.hasText(userId)) {
            return new ChatPageResponseDto(List.of(), 0, null);
        }

        String contextFilter = normalizeChatContextFilter(contextFilterValue);
        String sort = normalizeChatQuerySort(sortValue, secondaryFilterValue);
        boolean sortAscending = resolveChatSortAscending(sort, sortDirectionValue);
        long rangeStartMs = parseIsoMillis(rangeStartIso, Long.MIN_VALUE);
        long rangeEndMs = parseIsoMillis(rangeEndIso, Long.MAX_VALUE);
        if (rangeStartMs > rangeEndMs) {
            return new ChatPageResponseDto(List.of(), 0, null);
        }
        if (Boolean.TRUE.equals(adminServiceOnly) && "service".equals(contextFilter)) {
            return querySupportCasePage(
                    userId,
                    sort,
                    sortAscending,
                    cursor,
                    limitValue,
                    rangeStartMs,
                    rangeEndMs,
                    supportCaseFilterValue);
        }

        int limit = normalizeChatPageLimit(limitValue);
        int offset = parseChatCursorOffset(cursor);
        Criteria criteria = chatPageCriteria(
                userId,
                contextFilter,
                rangeStartIso,
                rangeEndIso,
                false,
                null);
        long total = mongoTemplate.count(new Query(criteria), Chat.class);
        Query pageQuery = new Query(criteria)
                .with(chatPageSort(sort, sortAscending))
                .skip(offset)
                .limit(limit);
        List<ChatDto> items = chatDtosWithMetrics(mongoTemplate.find(pageQuery, Chat.class));
        int endOffset = offset + items.size();
        String nextCursor = endOffset < total && !items.isEmpty()
                ? Integer.toString(endOffset)
                : null;
        return new ChatPageResponseDto(items, safePageTotal(total), nextCursor);
    }

    public ChatDto ensureServiceChat(ChatServiceEnsureRequestDto request, String requestedUserId) {
        String userId = requireResolvedUserId(requestedUserId);
        if (request == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Service chat request is required.");
        }
        String serviceContext = safeText(request.serviceContext()).toLowerCase(Locale.US);
        if (!"event".equals(serviceContext) && !"asset".equals(serviceContext)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unsupported service chat context.");
        }
        String eventId = normalizeId(request.eventId());
        if (!StringUtils.hasText(eventId)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Event id is required.");
        }
        ActivityEvent event = findServiceChatEvent(eventId);
        if (event == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Event not found.");
        }

        String subEventId = normalizeId(request.subEventId());
        String assetId = normalizeId(request.assetId());
        String requestedTargetUserId = normalizeId(request.targetUserId());
        Asset asset = null;
        String targetUserId;
        String chatId;
        if ("asset".equals(serviceContext)) {
            if (!StringUtils.hasText(assetId) || !StringUtils.hasText(subEventId)) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Asset and sub-event ids are required.");
            }
            asset = findServiceChatAsset(assetId, requestedTargetUserId);
            if (asset == null) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Asset not found.");
            }
            targetUserId = normalizeId(asset.getOwnerUserId());
            chatId = "c-service-asset-" + assetId + "-" + subEventId + "-" + userId;
        } else {
            targetUserId = normalizeId(event.getCreatorUserId());
            if (!StringUtils.hasText(targetUserId)) {
                targetUserId = normalizeId(event.getOwnerUserId());
            }
            chatId = "c-service-event-" + eventId + "-" + userId;
        }
        if (!StringUtils.hasText(targetUserId) || findUser(targetUserId) == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Service chat recipient not found.");
        }
        if (StringUtils.hasText(requestedTargetUserId) && !targetUserId.equals(requestedTargetUserId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "The selected service chat recipient is not the resource owner.");
        }
        if (targetUserId.equals(userId)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "The resource owner cannot open a service chat with themselves.");
        }

        List<Chat> chatDocuments = chatsRepository.findByChatId(chatId);
        if (chatDocuments.isEmpty()) {
            Users targetUser = findUser(targetUserId);
            Chat baseChat = new Chat();
            baseChat.setMongoId(buildMongoId(userId, chatId));
            baseChat.setChatId(chatId);
            baseChat.setOwnerUserId(userId);
            baseChat.setAvatar(resolveUserInitials(targetUser, targetUserId));
            baseChat.setTitle(serviceChatTitle(request.title(), serviceContext, asset, event));
            baseChat.setLastMessage(serviceChatLastMessage(request.lastMessage(), serviceContext, asset, event));
            baseChat.setLastSenderId(targetUserId);
            baseChat.setMemberIds(List.of(userId, targetUserId));
            baseChat.setUnread(0);
            baseChat.setDateIso(Instant.now().toString());
            baseChat.setChannelType(CHAT_CHANNEL_SERVICE_EVENT);
            baseChat.setOwnerId(eventId);
            baseChat.setEventId(eventId);
            baseChat.setOwnerStatus(event.getStatus());
            baseChat.setSubEventId(StringUtils.hasText(subEventId) ? subEventId : null);
            chatsRepository.save(baseChat);
            chatDocuments = List.of(baseChat);
        }
        chatDocuments = ensureOwnerCopies(chatDocuments);
        Chat viewerChat = findOwnerChat(chatDocuments, userId);
        Chat responseChat = viewerChat == null ? chatDocuments.get(0) : viewerChat;
        return toChatDto(responseChat, chatMemberUsers(List.of(responseChat)));
    }

    private ActivityEvent findServiceChatEvent(String eventId) {
        Criteria identity = new Criteria().orOperator(
                Criteria.where("_id").is(eventId),
                Criteria.where("sourceId").is(eventId));
        return mongoTemplate.findOne(Query.query(identity), ActivityEvent.class);
    }

    private Asset findServiceChatAsset(String assetId, String ownerUserId) {
        Criteria identity = new Criteria().orOperator(
                Criteria.where("_id").is(assetId),
                Criteria.where("assetId").is(assetId));
        Criteria criteria = StringUtils.hasText(ownerUserId)
                ? new Criteria().andOperator(identity, Criteria.where("ownerUserId").is(ownerUserId))
                : identity;
        return mongoTemplate.findOne(Query.query(criteria), Asset.class);
    }

    private String serviceChatTitle(
            String requestedTitle,
            String serviceContext,
            Asset asset,
            ActivityEvent event) {
        String title = safeText(requestedTitle);
        if (StringUtils.hasText(title)) {
            return title;
        }
        String subject = "asset".equals(serviceContext)
                ? safeText(asset == null ? null : asset.getTitle())
                : safeText(event == null ? null : event.getTitle());
        return ("asset".equals(serviceContext) ? "Asset Service" : "Event Service")
                + (StringUtils.hasText(subject) ? " · " + subject : "");
    }

    private String serviceChatLastMessage(
            String requestedLastMessage,
            String serviceContext,
            Asset asset,
            ActivityEvent event) {
        String lastMessage = safeText(requestedLastMessage);
        if (StringUtils.hasText(lastMessage)) {
            return lastMessage;
        }
        String subject = "asset".equals(serviceContext)
                ? safeText(asset == null ? null : asset.getTitle())
                : safeText(event == null ? null : event.getTitle());
        return "Service chat for " + (StringUtils.hasText(subject) ? subject : serviceContext) + ".";
    }

    private ChatPageResponseDto querySupportCasePage(
            String userId,
            String sort,
            boolean sortAscending,
            String cursor,
            Integer limitValue,
            long rangeStartMs,
            long rangeEndMs,
            String supportCaseFilterValue) {
        Users actor = findUser(userId);
        if (!isAdminUser(actor)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Admin access is required.");
        }
        int limit = normalizeChatPageLimit(limitValue);
        int offset = parseChatCursorOffset(cursor);
        String supportCaseFilter = normalizeSupportCaseFilter(supportCaseFilterValue);
        List<AggregationOperation> operations = new ArrayList<>();
        operations.add(context -> new Document("$match", new Document("$and", List.of(
                new Document("channelType", new Document(
                        "$in",
                        List.of(CHAT_CHANNEL_APP_SUPPORT, CHAT_CHANNEL_SUPPORT_CASE))),
                new Document("supportCase.status", new Document("$exists", true)),
                new Document("id", new Document("$type", "string").append("$ne", ""))))));
        operations.add(context -> new Document("$addFields", new Document(
                "_supportViewerCopy",
                new Document("$cond", List.of(
                        new Document("$eq", List.of("$ownerUserId", userId)),
                        1,
                        0)))));
        operations.add(context -> new Document("$sort", new Document()
                .append("_supportViewerCopy", -1)
                .append("dateIso", -1)
                .append("_id", 1)));
        operations.add(context -> new Document("$group", new Document()
                .append("_id", "$id")
                .append("selected", new Document("$first", "$$ROOT"))));
        operations.add(context -> new Document("$replaceRoot", new Document("newRoot", "$selected")));
        Document selectedCaseMatch = supportCaseSelectionMatchDocument(
                rangeStartMs,
                rangeEndMs,
                supportCaseFilter);
        if (!selectedCaseMatch.isEmpty()) {
            operations.add(context -> new Document("$match", selectedCaseMatch));
        }
        operations.add(context -> new Document("$sort", chatPageSortDocument(sort, sortAscending)));
        operations.add(context -> new Document("$facet", new Document()
                .append("metadata", List.of(new Document("$count", "total")))
                .append("items", List.of(
                        new Document("$skip", offset),
                        new Document("$limit", limit)))));

        AggregationResults<Document> aggregationResults = mongoTemplate.aggregate(
                Aggregation.newAggregation(operations),
                "chats",
                Document.class);
        Document aggregationResult = aggregationResults.getUniqueMappedResult();
        List<Document> metadata = aggregationDocuments(
                aggregationResult == null ? null : aggregationResult.get("metadata"));
        int total = metadata.isEmpty()
                ? 0
                : safePageTotal(aggregationNumber(metadata.get(0).get("total")));
        List<Chat> pageRecords = aggregationDocuments(
                aggregationResult == null ? null : aggregationResult.get("items")).stream()
                .map(document -> mongoTemplate.getConverter().read(Chat.class, document))
                .filter(Objects::nonNull)
                .toList();
        List<ChatDto> items = chatDtosWithMetrics(pageRecords);
        int endOffset = offset + items.size();
        String nextCursor = endOffset < total && !items.isEmpty()
                ? Integer.toString(endOffset)
                : null;
        return new ChatPageResponseDto(items, total, nextCursor);
    }

    public ChatDto updateSupportCase(String chatId, String requestedUserId, String actionValue) {
        String userId = requireResolvedUserId(requestedUserId);
        String normalizedChatId = normalizeId(chatId);
        if (!StringUtils.hasText(normalizedChatId)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Chat id is required.");
        }
        if (!accessControlService.can(AccessPolicyKeys.CHAT_SUPPORT_MANAGE, userId, userId, normalizedChatId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Authenticated user is not allowed to manage this support chat.");
        }
        Users actor = findUser(userId);
        String action = normalizeSupportCaseAction(actionValue);
        if (!StringUtils.hasText(action)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unsupported support case action.");
        }

        List<Chat> chatDocuments = ensureOwnerCopies(chatsRepository.findByChatId(normalizedChatId));
        if (chatDocuments.isEmpty() || chatDocuments.stream().noneMatch(this::isSupportCaseChat)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Support case not found.");
        }

        SupportCaseState state = nextSupportCaseState(action, userId, actor);
        List<Chat> updatedDocuments = new ArrayList<>();
        for (Chat existing : chatDocuments) {
            Chat next = copyChat(existing);
            applySupportCaseState(next, state);
            updatedDocuments.add(next);
        }
        chatsRepository.saveAll(updatedDocuments);
        adminTelemetryService.record("admin.support.case." + action, "support", normalizedChatId, userId);

        Chat viewerChat = findOwnerChat(updatedDocuments, userId);
        Chat responseChat = viewerChat == null ? updatedDocuments.get(0) : viewerChat;
        return toChatDto(responseChat, chatMemberUsers(List.of(responseChat)));
    }

    public ChatMessagesPageResponseDto queryMessagesPage(
            String chatId,
            String requestedUserId,
            Integer limit,
            String cursor) {
        String userId = requireResolvedUserId(requestedUserId);
        ChatDocumentsSnapshot snapshot = requireChat(chatId, userId);
        int pageSize = normalizeChatMessagesPageSize(limit);
        int startIndex = normalizeChatMessagesCursor(cursor);
        int total = normalizeLongCount(chatMessagesRepository.countByChatId(snapshot.chatId()));
        if (startIndex >= total) {
            return new ChatMessagesPageResponseDto(List.of(), total, null, null);
        }
        List<ChatMessage> messages = chatMessagesRepository
                .findByChatIdOrderBySentAtIsoDesc(snapshot.chatId(), PageRequest.of(startIndex / pageSize, pageSize))
                .stream()
                .filter(Objects::nonNull)
                .toList();
        List<String> loadedMessageIds = messages.stream()
                .map(ChatMessage::getId)
                .map(this::normalizeId)
                .filter(StringUtils::hasText)
                .toList();
        ChatReadUpdate readUpdate = startIndex == 0
                ? markChannelRead(snapshot, userId, messages)
                : markMessagesRead(snapshot, userId, loadedMessageIds, messages);
        if (readUpdate.changed() && !readUpdate.readMessageIds().isEmpty()) {
            publishChatEvent(toReadEvent(snapshot.chatId(), readUpdate));
        }
        Map<String, Users> userCache = new LinkedHashMap<>();
        List<ChatMessageDto> items = messages.stream()
                .map(message -> chatMessageMapper.toDto(message, userId, userCache))
                .toList();
        int nextIndex = startIndex + items.size();
        return new ChatMessagesPageResponseDto(
                items,
                total,
                nextIndex < total ? String.valueOf(nextIndex) : null,
                toReadReceiptDto(readUpdate));
    }

    public ChatMembersPageResponseDto queryMembersPage(
            String chatId,
            String requestedUserId,
            Integer limitValue,
            String cursor,
            Boolean pendingOnly) {
        String userId = requireResolvedUserId(requestedUserId);
        ChatDocumentsSnapshot snapshot = requireChat(chatId, userId);
        Chat memberSource = snapshot.viewerChat() == null
                ? snapshot.chatDocuments().get(0)
                : snapshot.viewerChat();
        String memberOwnerType = memberOwnerType(chatChannelType(memberSource));
        String memberOwnerId = normalizeId(memberSource.getOwnerId());
        int limit = normalizeChatPageLimit(limitValue);
        int offset = parseChatCursorOffset(cursor);
        if (StringUtils.hasText(memberOwnerType) && StringUtils.hasText(memberOwnerId)) {
            Criteria criteria = Criteria.where("ownerType").is(memberOwnerType)
                    .and("ownerId").is(memberOwnerId)
                    .and("status").in(Boolean.TRUE.equals(pendingOnly)
                            ? List.of(MEMBER_STATUS_PENDING)
                            : List.of(MEMBER_STATUS_ACCEPTED, MEMBER_STATUS_PENDING));
            long total = mongoTemplate.count(new Query(criteria), ActivityMember.class);
            Query memberPageQuery = new Query(criteria)
                    .with(Sort.by(Sort.Direction.ASC, "userId"))
                    .skip(offset)
                    .limit(limit);
            List<ActivityMember> memberRecords = mongoTemplate.find(memberPageQuery, ActivityMember.class);
            Set<String> pageMemberIds = memberRecords.stream()
                    .map(ActivityMember::getUserId)
                    .map(this::normalizeId)
                    .filter(StringUtils::hasText)
                    .collect(java.util.stream.Collectors.toCollection(LinkedHashSet::new));
            Map<String, Users> usersById = new LinkedHashMap<>();
            for (Users user : usersRepository.findByUserIdIn(pageMemberIds)) {
                String memberUserId = normalizeId(user == null ? null : user.getUserId());
                if (StringUtils.hasText(memberUserId)) {
                    usersById.put(memberUserId, user);
                }
            }
            List<ChatMemberDto> items = memberRecords.stream()
                    .map(record -> chatMapper.toMemberDto(
                            usersById.get(normalizeId(record.getUserId())),
                            safeText(record.getStatus()).toLowerCase(Locale.ROOT)))
                    .filter(Objects::nonNull)
                    .toList();
            int nextOffset = offset + memberRecords.size();
            return new ChatMembersPageResponseDto(
                    items,
                    safePageTotal(total),
                    nextOffset < total && !memberRecords.isEmpty() ? Integer.toString(nextOffset) : null);
        }

        List<String> memberIds = safeMemberIds(memberSource.getMemberIds()).stream()
                .map(this::normalizeId)
                .filter(StringUtils::hasText)
                .distinct()
                .toList();
        if (memberIds.isEmpty()) {
            return new ChatMembersPageResponseDto(List.of(), 0, null);
        }

        long total;
        List<String> pageMemberIds;
        if (Boolean.TRUE.equals(pendingOnly)) {
            return new ChatMembersPageResponseDto(List.of(), 0, null);
        } else {
            total = mongoTemplate.count(new Query(Criteria.where("userId").in(memberIds)), Users.class);
            pageMemberIds = memberIds;
        }
        Criteria memberCriteria = Criteria.where("userId").in(pageMemberIds);
        Query pageQuery = new Query(memberCriteria)
                .with(Sort.by(Sort.Direction.ASC, "userId"))
                .limit(limit);
        pageQuery.skip(offset);
        List<ChatMemberDto> items = mongoTemplate.find(pageQuery, Users.class).stream()
                .map(user -> chatMapper.toMemberDto(
                        user,
                        MEMBER_STATUS_ACCEPTED))
                .filter(Objects::nonNull)
                .toList();
        int nextOffset = offset + items.size();
        return new ChatMembersPageResponseDto(
                items,
                safePageTotal(total),
                nextOffset < total && !items.isEmpty() ? Integer.toString(nextOffset) : null);
    }

    public ChatMessageDto sendMessage(String chatId, String requestedUserId, String text) {
        return sendMessage(chatId, requestedUserId, text, null, null, List.of());
    }

    public ChatMessageDto sendMessage(String chatId, String requestedUserId, String text, String clientId) {
        return sendMessage(chatId, requestedUserId, text, clientId, null, List.of());
    }

    public ChatMessageDto postSystemMessage(String chatId, String text, String systemType) {
        String normalizedChatId = normalizeId(chatId);
        String normalizedText = normalizeText(text);
        if (!StringUtils.hasText(normalizedChatId) || !StringUtils.hasText(normalizedText)) {
            return null;
        }
        List<Chat> chatDocuments = ensureOwnerCopies(chatsRepository.findByChatId(normalizedChatId));
        if (chatDocuments.isEmpty()) {
            return null;
        }

        ChatMessage message = buildSystemMessage(normalizedText, systemType);
        ChatStreamEvent streamEvent = chatMessageMapper.toStreamEvent(normalizedChatId, message);
        CompletableFuture<Boolean> redisPublish = publishChatEventAsync(streamEvent);
        message.setChatId(normalizedChatId);
        message.setMongoId(ChatMessage.buildMongoId(normalizedChatId, message.getId()));
        message.refreshMessageSearchFields();
        chatMessagesRepository.save(message);
        List<Chat> updatedDocuments = updateChatSummaries(chatDocuments, message, "", false);
        observeChatEventPublish(redisPublish, streamEvent);
        chatPushNotificationService.notifyRecipients(updatedDocuments, streamEvent);
        adminTelemetryService.record("chat.message.system", "chats", normalizedChatId, "system");
        return chatMessageMapper.toDto(message, "");
    }

    public ChatMessageDto ensureInitialSystemMessage(String chatId, String text, String systemType) {
        return ensureInitialSystemMessageResult(chatId, text, systemType).message();
    }

    private InitialSystemMessageResult ensureInitialSystemMessageResult(
            String chatId,
            String text,
            String systemType) {
        String normalizedChatId = normalizeId(chatId);
        String normalizedText = normalizeText(text);
        String normalizedSystemType = firstNonBlank(systemType, "welcome");
        if (!StringUtils.hasText(normalizedChatId) || !StringUtils.hasText(normalizedText)) {
            return new InitialSystemMessageResult(null, false);
        }
        List<Chat> chatDocuments = ensureOwnerCopies(chatsRepository.findByChatId(normalizedChatId));
        if (chatDocuments.isEmpty()) {
            return new InitialSystemMessageResult(null, false);
        }

        String messageId = "system:" + normalizedSystemType;
        ChatMessage existing = chatMessagesRepository
                .findByChatIdAndMessageId(normalizedChatId, messageId)
                .orElse(null);
        if (existing != null) {
            return new InitialSystemMessageResult(chatMessageMapper.toDto(existing, ""), false);
        }

        ChatMessage message = buildSystemMessage(normalizedText, normalizedSystemType);
        message.setId(messageId);
        message.setSender("MyScoutee System");
        message.setChatId(normalizedChatId);
        message.setMongoId(ChatMessage.buildMongoId(normalizedChatId, messageId));
        message.refreshMessageSearchFields();
        try {
            chatMessagesRepository.insert(message);
        } catch (DuplicateKeyException duplicate) {
            ChatMessage concurrentlyInserted = chatMessagesRepository
                    .findByChatIdAndMessageId(normalizedChatId, messageId)
                    .orElseThrow(() -> duplicate);
            return new InitialSystemMessageResult(chatMessageMapper.toDto(concurrentlyInserted, ""), false);
        }

        ChatStreamEvent streamEvent = chatMessageMapper.toStreamEvent(normalizedChatId, message);
        CompletableFuture<Boolean> redisPublish = publishChatEventAsync(streamEvent);
        List<Chat> updatedDocuments = updateChatSummaries(chatDocuments, message, "", false);
        observeChatEventPublish(redisPublish, streamEvent);
        chatPushNotificationService.notifyRecipients(updatedDocuments, streamEvent);
        adminTelemetryService.record(
                "chat.message.system.initial",
                "chats",
                normalizedChatId,
                normalizedSystemType);
        return new InitialSystemMessageResult(chatMessageMapper.toDto(message, ""), true);
    }

    public ChatMessageDto sendMessage(
            String chatId,
            String requestedUserId,
            String text,
            String clientId,
            ChatMessageReplyDto replyTo,
            List<ChatMessageAttachmentDto> attachments) {
        String userId = requireResolvedUserId(requestedUserId);
        String normalizedText = normalizeText(text);
        List<ChatMessageAttachmentRecord> normalizedAttachments = normalizeAttachments(attachments);
        if (!StringUtils.hasText(normalizedText) && normalizedAttachments.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Chat message text is required.");
        }
        String normalizedChatId = normalizeId(chatId);
        if (!StringUtils.hasText(normalizedChatId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Chat not found.");
        }
        if (!accessControlService.canCurrentActorCreateChatMessage(userId, normalizedChatId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Authenticated user is not allowed to post in this chat.");
        }

        ChatDocumentsSnapshot accessSnapshot = requireChatAccessForSend(normalizedChatId, userId);
        Users sender = findUser(userId);
        ChatMessage message = buildMessage(sender, userId, normalizedText, clientId, normalizeReply(replyTo), normalizedAttachments);
        ChatStreamEvent streamEvent = chatMessageMapper.toStreamEvent(accessSnapshot.chatId(), message);
        CompletableFuture<Boolean> redisPublish = publishChatEventAsync(streamEvent);
        List<Chat> chatDocuments = chatDocumentsForMutation(accessSnapshot, userId);
        message.setChatId(accessSnapshot.chatId());
        message.setMongoId(ChatMessage.buildMongoId(accessSnapshot.chatId(), message.getId()));
        message.refreshMessageSearchFields();
        chatMessagesRepository.save(message);
        List<Chat> updatedDocuments = updateChatSummaries(chatDocuments, message, userId, true);
        observeChatEventPublish(redisPublish, streamEvent);
        chatPushNotificationService.notifyRecipients(updatedDocuments, streamEvent);
        adminTelemetryService.record("chat.message.sent", "chats", accessSnapshot.chatId(), userId);
        return chatMessageMapper.toDto(message, userId);
    }

    public ChatMessageDto editMessage(String chatId, String requestedUserId, String messageId, String text) {
        String normalizedText = normalizeText(text);
        if (!StringUtils.hasText(normalizedText)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Chat message text is required.");
        }
        return mutateMessage(chatId, requestedUserId, messageId, accessControlService::canCurrentActorEditChatMessage, (message, userId, user) -> {
            requireOwnMessage(message, userId);
            if (StringUtils.hasText(message.getDeletedAtIso())) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Deleted messages cannot be edited.");
            }
            message.setText(normalizedText);
            message.setEditedAtIso(Instant.now().toString());
        });
    }

    public ChatMessageDto deleteMessage(String chatId, String requestedUserId, String messageId) {
        return mutateMessage(chatId, requestedUserId, messageId, accessControlService::canCurrentActorDeleteChatMessage, (message, userId, user) -> {
            requireOwnMessage(message, userId);
            message.setText("");
            message.setDeletedAtIso(Instant.now().toString());
            message.setDeletedByUserId(userId);
            message.setDeletedByName(resolveUserName(user, userId));
            message.setReactions(new ArrayList<>());
            message.setReadBy(new ArrayList<>());
            message.setAttachments(new ArrayList<>());
            message.setReplyTo(null);
            message.setEditedAtIso(null);
            message.setPinnedAtIso(null);
            message.setPinnedByUserId(null);
        });
    }

    public ChatMessageDto pinMessage(String chatId, String requestedUserId, String messageId, Boolean pinned) {
        return mutateMessage(chatId, requestedUserId, messageId, accessControlService::canCurrentActorPinChatMessage, (message, userId, user) -> {
            if (Boolean.TRUE.equals(pinned)) {
                message.setPinnedAtIso(Instant.now().toString());
                message.setPinnedByUserId(userId);
            } else {
                message.setPinnedAtIso(null);
                message.setPinnedByUserId(null);
            }
        });
    }

    public ChatMessageDto reactToMessage(String chatId, String requestedUserId, String messageId, String emoji) {
        return mutateMessage(chatId, requestedUserId, messageId, accessControlService::canCurrentActorManageChatReaction, (message, userId, user) -> {
            String normalizedEmoji = normalizeText(emoji);
            List<ChatMessageReactionRecord> reactions = new ArrayList<>();
            for (ChatMessageReactionRecord reaction : safeReactions(message.getReactions())) {
                if (!userId.equals(normalizeId(reaction.getUserId()))) {
                    reactions.add(copyReactionRecords(List.of(reaction)).get(0));
                }
            }
            if (StringUtils.hasText(normalizedEmoji)) {
                ChatMessageReactionRecord reaction = new ChatMessageReactionRecord();
                reaction.setEmoji(normalizedEmoji);
                reaction.setUserId(userId);
                reaction.setUserName(resolveUserName(user, userId));
                reaction.setUserInitials(resolveUserInitials(user, userId));
                reaction.setUserGender(resolveUserGender(user));
                reaction.setReactedAtIso(Instant.now().toString());
                reactions.add(reaction);
            }
            message.setReactions(reactions);
        });
    }

    public ChatMessageDto updateMessageAttachments(
            String chatId,
            String requestedUserId,
            String messageId,
            List<ChatMessageAttachmentDto> attachments) {
        return mutateMessage(chatId, requestedUserId, messageId, accessControlService::canCurrentActorAddChatAttachment, (message, userId, user) -> {
            if (StringUtils.hasText(message.getDeletedAtIso())) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Deleted messages cannot be updated.");
            }
            message.setAttachments(normalizeAttachments(attachments));
        });
    }

    public void markMessagesRead(String chatId, String requestedUserId, List<String> messageIds) {
        String userId = requireResolvedUserId(requestedUserId);
        ChatDocumentsSnapshot snapshot = requireChat(chatId, userId);
        ChatReadUpdate readUpdate = markMessagesRead(snapshot, userId, messageIds);
        if (!readUpdate.readMessageIds().isEmpty()) {
            publishChatEvent(toReadEvent(snapshot.chatId(), readUpdate));
        }
    }

    public void sendTypingSignal(String chatId, String requestedUserId, Boolean typing) {
        String userId = requireResolvedUserId(requestedUserId);
        ChatDocumentsSnapshot snapshot = requireChat(chatId, userId);
        Users user = findUser(userId);
        publishChatEvent(ChatStreamEvent.typing(
                snapshot.chatId(),
                userId,
                resolveUserName(user, userId),
                resolveUserInitials(user, userId),
                resolveUserGender(user),
                Boolean.TRUE.equals(typing)));
    }

    public boolean hasChatAccess(String chatId, String userId) {
        String normalizedChatId = normalizeId(chatId);
        String normalizedUserId = normalizeId(userId);
        if (!StringUtils.hasText(normalizedChatId) || !StringUtils.hasText(normalizedUserId)) {
            return false;
        }
        Chat viewerChat = chatsRepository
                .findByOwnerUserIdAndChatId(normalizedUserId, normalizedChatId)
                .orElse(null);
        if (viewerChat != null) {
            return hasChatAccess(viewerChat, normalizedUserId);
        }
        return chatsRepository.findByChatId(normalizedChatId).stream()
                .anyMatch(chat -> hasChatAccess(chat, normalizedUserId));
    }

    public void upsertDevice(ChatDeviceUpsertRequestDto request) {
        if (request == null) {
            return;
        }
        String userId = resolveUserId(request.userId());
        String deviceId = normalizeText(request.deviceId());
        String firebaseToken = normalizeText(request.firebaseToken());
        if (!StringUtils.hasText(userId) || (!StringUtils.hasText(deviceId) && !StringUtils.hasText(firebaseToken))) {
            return;
        }

        Users user = usersRepository.findByUserId(userId).orElse(null);
        if (user == null) {
            return;
        }

        String nowIso = Instant.now().toString();
        List<Users.UserDeviceRecord> devices = new ArrayList<>(user.getDevices() == null ? List.of() : user.getDevices());
        Users.UserDeviceRecord target = null;
        for (Users.UserDeviceRecord device : devices) {
            if (device == null) {
                continue;
            }
            if (StringUtils.hasText(deviceId) && deviceId.equals(normalizeId(device.getDeviceId()))) {
                target = device;
                break;
            }
            if (StringUtils.hasText(firebaseToken) && firebaseToken.equals(normalizeText(device.getFirebaseToken()))) {
                target = device;
                break;
            }
        }
        if (target == null) {
            target = new Users.UserDeviceRecord();
            devices.add(target);
        }
        target.setDeviceId(StringUtils.hasText(deviceId) ? deviceId : stableDeviceId(firebaseToken));
        target.setPlatform(normalizeText(request.platform()));
        target.setFirebaseToken(firebaseToken);
        target.setNotificationsEnabled(request.notificationsEnabled() == null ? Boolean.TRUE : request.notificationsEnabled());
        target.setLastRegisteredAtIso(nowIso);
        target.setLastSeenAtIso(nowIso);
        user.setDevices(devices);
        usersRepository.save(user);
    }

    public void deleteDevice(ChatDeviceDeleteRequestDto request) {
        if (request == null) {
            return;
        }
        String userId = resolveUserId(request.userId());
        if (!StringUtils.hasText(userId)) {
            return;
        }
        String deviceId = normalizeText(request.deviceId());
        String firebaseToken = normalizeText(request.firebaseToken());
        if (!StringUtils.hasText(deviceId) && !StringUtils.hasText(firebaseToken)) {
            return;
        }

        Users user = usersRepository.findByUserId(userId).orElse(null);
        if (user == null || user.getDevices() == null || user.getDevices().isEmpty()) {
            return;
        }

        List<Users.UserDeviceRecord> retained = user.getDevices().stream()
                .filter(Objects::nonNull)
                .filter(device -> !matchesDevice(device, deviceId, firebaseToken))
                .toList();
        if (retained.size() == user.getDevices().size()) {
            return;
        }
        user.setDevices(new ArrayList<>(retained));
        usersRepository.save(user);
    }

    private ChatDocumentsSnapshot requireChat(String chatId, String userId) {
        return requireChat(chatId, userId, false);
    }

    private ChatDocumentsSnapshot requireChat(String chatId, String userId, boolean prepareOwnerCopies) {
        String normalizedChatId = normalizeId(chatId);
        if (!StringUtils.hasText(normalizedChatId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Chat not found.");
        }
        List<Chat> chatDocuments = prepareOwnerCopies
                ? ensureOwnerCopies(chatsRepository.findByChatId(normalizedChatId))
                : chatsRepository.findByChatId(normalizedChatId);
        if (chatDocuments.isEmpty() || chatDocuments.stream().noneMatch(chat -> hasChatAccess(chat, userId))) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Chat not found.");
        }
        Chat viewerChat = findOwnerChat(chatDocuments, userId);
        if (prepareOwnerCopies && viewerChat == null) {
            Chat baseChat = chatDocuments.get(0);
            Chat createdViewerChat = createOwnerCopy(baseChat, userId);
            chatsRepository.save(createdViewerChat);
            chatDocuments = new ArrayList<>(chatDocuments);
            chatDocuments.add(createdViewerChat);
            viewerChat = createdViewerChat;
        }
        return new ChatDocumentsSnapshot(normalizedChatId, viewerChat, chatDocuments);
    }

    private ChatDocumentsSnapshot requireChatAccessForSend(String chatId, String userId) {
        return requireChat(chatId, userId, true);
    }

    private List<Chat> chatDocumentsForMutation(ChatDocumentsSnapshot snapshot, String userId) {
        if (snapshot != null && snapshot.chatDocuments() != null && !snapshot.chatDocuments().isEmpty()) {
            return snapshot.chatDocuments();
        }
        return requireChatAccessForSend(snapshot == null ? "" : snapshot.chatId(), userId).chatDocuments();
    }

    private List<Chat> ensureOwnerCopies(List<Chat> chatDocuments) {
        if (chatDocuments == null || chatDocuments.isEmpty()) {
            return List.of();
        }
        Map<String, List<Chat>> chatsByChatId = groupChatsByChatId(chatDocuments);

        List<Chat> created = new ArrayList<>();
        for (List<Chat> chatsWithSameId : chatsByChatId.values()) {
            if (chatsWithSameId.isEmpty()) {
                continue;
            }
            Chat baseChat = chatsWithSameId.get(0);
            String chatId = normalizeId(baseChat.getChatId());
            if (!StringUtils.hasText(chatId)) {
                continue;
            }
            Set<String> ownerUserIds = new LinkedHashSet<>();
            Set<String> participantUserIds = new LinkedHashSet<>();
            for (Chat chat : chatsRepository.findByChatId(chatId)) {
                if (chat != null && StringUtils.hasText(chat.getOwnerUserId())) {
                    ownerUserIds.add(normalizeId(chat.getOwnerUserId()));
                }
            }
            collectChatOwnersAndParticipants(chatsWithSameId, ownerUserIds, participantUserIds);
            for (String participantUserId : participantUserIds) {
                if (ownerUserIds.contains(participantUserId)) {
                    continue;
                }
                Chat createdChat = createOwnerCopy(baseChat, participantUserId);
                created.add(createdChat);
                chatsWithSameId.add(createdChat);
                ownerUserIds.add(participantUserId);
            }
        }
        if (!created.isEmpty()) {
            chatsRepository.saveAll(created);
        }
        return flattenChatGroups(chatsByChatId);
    }

    private Map<String, List<Chat>> groupChatsByChatId(List<Chat> chatDocuments) {
        Map<String, List<Chat>> chatsByChatId = new LinkedHashMap<>();
        for (Chat chat : chatDocuments == null ? List.<Chat>of() : chatDocuments) {
            if (chat == null || !StringUtils.hasText(chat.getChatId())) {
                continue;
            }
            String chatId = normalizeId(chat.getChatId());
            chatsByChatId.computeIfAbsent(chatId, key -> new ArrayList<>()).add(chat);
        }
        return chatsByChatId;
    }

    private void collectChatOwnersAndParticipants(
            List<Chat> chatsWithSameId,
            Set<String> ownerUserIds,
            Set<String> participantUserIds) {
        for (Chat chat : chatsWithSameId == null ? List.<Chat>of() : chatsWithSameId) {
            if (StringUtils.hasText(chat.getOwnerUserId())) {
                String ownerUserId = normalizeId(chat.getOwnerUserId());
                ownerUserIds.add(ownerUserId);
                participantUserIds.add(ownerUserId);
            }
            for (String memberId : chat.getMemberIds() == null ? List.<String>of() : chat.getMemberIds()) {
                if (StringUtils.hasText(memberId)) {
                    participantUserIds.add(normalizeId(memberId));
                }
            }
        }
    }

    private List<Chat> flattenChatGroups(Map<String, List<Chat>> chatsByChatId) {
        List<Chat> flattened = new ArrayList<>();
        for (List<Chat> sameChatId : chatsByChatId.values()) {
            flattened.addAll(sameChatId);
        }
        return flattened;
    }

    private ChatReadUpdate markMessagesRead(
            ChatDocumentsSnapshot snapshot,
            String viewerUserId,
            List<String> requestedMessageIds) {
        return markMessagesRead(snapshot, viewerUserId, requestedMessageIds, null);
    }

    private ChatReadUpdate markMessagesRead(
            ChatDocumentsSnapshot snapshot,
            String viewerUserId,
            List<String> requestedMessageIds,
            List<ChatMessage> preloadedMessages) {
        Set<String> targetMessageIds = requestedMessageIds == null
                ? Set.of()
                : requestedMessageIds.stream()
                        .map(this::normalizeId)
                        .filter(StringUtils::hasText)
                        .collect(java.util.stream.Collectors.toCollection(LinkedHashSet::new));
        Set<String> readMessageIds = new LinkedHashSet<>();
        String readAtIso = Instant.now().toString();
        Users viewer = null;
        ChatReadAvatarRecord reader = null;
        List<ChatMessage> messages = preloadedMessages != null
                ? preloadedMessages
                : chatMessagesRepository.findByChatIdAndMessageIds(snapshot.chatId(), targetMessageIds);
        List<ChatMessage> changedMessages = new ArrayList<>();
        for (ChatMessage message : messages) {
            if (message == null) {
                continue;
            }
            String senderId = message.getSenderAvatar() == null ? "" : normalizeId(message.getSenderAvatar().getId());
            boolean matchesTarget = targetMessageIds.contains(normalizeId(message.getId()));
            if (!matchesTarget || viewerUserId.equals(senderId) || hasReader(message, viewerUserId)) {
                continue;
            }
            if (reader == null) {
                viewer = findUser(viewerUserId);
                reader = buildReadAvatarRecord(viewer, viewerUserId);
            }
            if (addReader(message, reader)) {
                message.refreshMessageSearchFields();
                readMessageIds.add(normalizeId(message.getId()));
                changedMessages.add(message);
            }
        }
        Chat viewerChat = snapshot.viewerChat();
        if (!changedMessages.isEmpty()) {
            chatMessagesRepository.saveAll(changedMessages);
        }
        if (viewerChat != null && !changedMessages.isEmpty()) {
            int unread = Math.max(0, normalizeCount(viewerChat.getUnread()) - changedMessages.size());
            if (normalizeCount(viewerChat.getUnread()) != unread) {
                int unreadDelta = unread - normalizeCount(viewerChat.getUnread());
                Chat nextViewerChat = copyChat(viewerChat);
                nextViewerChat.setUnread(unread);
                viewerChat = chatsRepository.save(nextViewerChat);
                incrementStoredChatCounters(nextViewerChat, unreadDelta);
                homeUserProfileService.evictUserReadCaches(viewerUserId);
            }
        }
        return new ChatReadUpdate(
                viewerChat,
                List.copyOf(readMessageIds),
                reader == null ? chatMessageMapper.emptyReadAvatarDto() : chatMessageMapper.toReadAvatarDto(reader, viewer),
                readAtIso,
                viewerChat == null ? 0 : normalizeCount(viewerChat.getUnread()),
                !changedMessages.isEmpty());
    }

    private ChatReadUpdate markChannelRead(
            ChatDocumentsSnapshot snapshot,
            String viewerUserId,
            List<ChatMessage> loadedMessages) {
        String readAtIso = Instant.now().toString();
        List<String> loadedUnreadIds = (loadedMessages == null ? List.<ChatMessage>of() : loadedMessages).stream()
                .filter(Objects::nonNull)
                .filter(message -> message.getSenderAvatar() == null
                        || !viewerUserId.equals(normalizeId(message.getSenderAvatar().getId())))
                .filter(message -> !hasReader(message, viewerUserId))
                .map(ChatMessage::getId)
                .map(this::normalizeId)
                .filter(StringUtils::hasText)
                .toList();
        Chat viewerChat = snapshot.viewerChat();
        int previousUnread = viewerChat == null ? 0 : normalizeCount(viewerChat.getUnread());
        if (previousUnread == 0 && loadedUnreadIds.isEmpty()) {
            return new ChatReadUpdate(
                    viewerChat,
                    List.of(),
                    chatMessageMapper.emptyReadAvatarDto(),
                    readAtIso,
                    0,
                    false);
        }
        Users viewer = findUser(viewerUserId);
        ChatReadAvatarRecord reader = buildReadAvatarRecord(viewer, viewerUserId);
        Query unreadMessages = new Query(Criteria.where("chatId").is(snapshot.chatId())
                .and("senderAvatar.id").ne(viewerUserId)
                .and("messageReadByUserIds").ne(viewerUserId));
        Update readUpdate = new Update()
                .addToSet("readBy", reader)
                .addToSet("messageReadByUserIds", viewerUserId);
        var updateResult = mongoTemplate.updateMulti(unreadMessages, readUpdate, ChatMessage.class);
        long changedMessageCount = updateResult == null ? 0 : updateResult.getModifiedCount();

        if (viewerChat != null && previousUnread > 0) {
            Chat nextViewerChat = copyChat(viewerChat);
            nextViewerChat.setUnread(0);
            viewerChat = chatsRepository.save(nextViewerChat);
            incrementStoredChatCounters(nextViewerChat, -previousUnread);
            homeUserProfileService.evictUserReadCaches(viewerUserId);
        }
        boolean changed = changedMessageCount > 0 || previousUnread > 0;
        return new ChatReadUpdate(
                viewerChat,
                loadedUnreadIds,
                chatMessageMapper.toReadAvatarDto(reader, viewer),
                readAtIso,
                0,
                changed);
    }

    private ChatMessageDto mutateMessage(
            String chatId,
            String requestedUserId,
            String messageId,
            BiPredicate<String, String> policyGuard,
            ChatMessageMutator mutator) {
        String userId = requireResolvedUserId(requestedUserId);
        String normalizedMessageId = normalizeId(messageId);
        if (!StringUtils.hasText(normalizedMessageId)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Message id is required.");
        }
        String normalizedChatId = normalizeId(chatId);
        if (!StringUtils.hasText(normalizedChatId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Chat not found.");
        }
        if (policyGuard != null && !policyGuard.test(userId, normalizedChatId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Authenticated user is not allowed to change messages in this chat.");
        }
        ChatDocumentsSnapshot snapshot = requireChat(normalizedChatId, userId);
        Users user = findUser(userId);
        ChatMessage message = chatMessagesRepository
                .findByChatIdAndMessageId(snapshot.chatId(), normalizedMessageId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Message not found."));
        mutator.apply(message, userId, user);
        message.refreshMessageSearchFields();
        ChatMessage updatedMessage = chatMessagesRepository.save(message);
        refreshChatSummaries(snapshot.chatId(), snapshot.chatDocuments());
        publishChatEvent(chatMessageMapper.toStreamEvent(snapshot.chatId(), updatedMessage));
        return chatMessageMapper.toDto(updatedMessage, userId);
    }

    private void requireOwnMessage(ChatMessage message, String userId) {
        ChatAvatarRecord senderAvatar = message == null ? null : message.getSenderAvatar();
        String senderId = senderAvatar == null ? "" : normalizeId(senderAvatar.getId());
        if (!userId.equals(senderId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only your own messages can be changed.");
        }
    }

    private List<Chat> updateChatSummaries(
            List<Chat> chatDocuments,
            ChatMessage message,
            String lastSenderId,
            boolean clearUnreadForSender) {
        if (chatDocuments == null || chatDocuments.isEmpty() || message == null) {
            return List.of();
        }
        List<Chat> updatedDocuments = new ArrayList<>(chatDocuments.size());
        List<ChatCounterChange> counterChanges = new ArrayList<>();
        BulkOperations bulk = mongoTemplate.bulkOps(BulkOperations.BulkMode.UNORDERED, Chat.class);
        boolean hasBulkUpdates = false;
        String summary = chatMessageMapper.summary(message);
        String sentAtIso = message.getSentAtIso();
        String normalizedLastSenderId = normalizeId(lastSenderId);
        for (Chat existing : chatDocuments) {
            if (existing == null || !StringUtils.hasText(existing.getMongoId())) {
                continue;
            }
            Chat next = copyChat(existing);
            next.setLastMessage(summary);
            next.setLastSenderId(normalizedLastSenderId);
            next.setDateIso(sentAtIso);
            boolean senderCopy = clearUnreadForSender && normalizedLastSenderId.equals(normalizeId(next.getOwnerUserId()));
            next.setUnread(senderCopy ? 0 : normalizeCount(existing.getUnread()) + 1);
            updatedDocuments.add(next);
            int unreadDelta = normalizeCount(next.getUnread()) - normalizeCount(existing.getUnread());
            if (unreadDelta != 0) {
                counterChanges.add(new ChatCounterChange(next, unreadDelta));
            }

            Update update = new Update()
                    .set("lastMessage", next.getLastMessage())
                    .set("lastSenderId", next.getLastSenderId())
                    .set("dateIso", next.getDateIso())
                    .set("unread", next.getUnread());
            bulk.updateOne(Query.query(Criteria.where("_id").is(existing.getMongoId())), update);
            hasBulkUpdates = true;
        }
        if (hasBulkUpdates) {
            bulk.execute();
            incrementStoredChatCounters(counterChanges);
            evictChatOwnerReadCaches(updatedDocuments);
        }
        return updatedDocuments;
    }

    private void incrementStoredChatCounters(Collection<ChatCounterChange> changes) {
        List<ChatCounterChange> applicable = changes == null
                ? List.of()
                : changes.stream()
                        .filter(Objects::nonNull)
                        .filter(change -> change.chat() != null)
                        .filter(change -> change.delta() != 0)
                        .filter(change -> StringUtils.hasText(normalizeId(change.chat().getOwnerUserId())))
                        .toList();
        if (applicable.isEmpty()) {
            return;
        }
        BulkOperations bulk = mongoTemplate.bulkOps(BulkOperations.BulkMode.UNORDERED, Users.class);
        for (ChatCounterChange change : applicable) {
            Chat chat = change.chat();
            Update update = storedChatCounterUpdate(chat, change.delta());
            bulk.updateOne(
                    Query.query(Criteria.where("userId").is(normalizeId(chat.getOwnerUserId()))),
                    update);
        }
        bulk.execute();
    }

    private void incrementStoredChatCounters(Chat chat, int unreadDelta) {
        String ownerUserId = normalizeId(chat == null ? null : chat.getOwnerUserId());
        if (!StringUtils.hasText(ownerUserId) || unreadDelta == 0) {
            return;
        }
        mongoTemplate.updateFirst(
                Query.query(Criteria.where("userId").is(ownerUserId)),
                storedChatCounterUpdate(chat, unreadDelta),
                Users.class);
    }

    private Update storedChatCounterUpdate(Chat chat, int unreadDelta) {
        Update update = new Update()
                .inc("activities.chats", unreadDelta)
                .inc("activities.chat.all", unreadDelta);
        String contextField = chatCounterContextField(chat.getChannelType());
        if (StringUtils.hasText(contextField)) {
            update.inc("activities.chat." + contextField, unreadDelta);
        }
        return update;
    }

    private String chatCounterContextField(String channelType) {
        return switch (safeText(channelType)) {
            case CHAT_CHANNEL_MAIN_EVENT -> "event";
            case CHAT_CHANNEL_OPTIONAL_SUB_EVENT -> "subEvent";
            case CHAT_CHANNEL_GROUP_SUB_EVENT -> "group";
            case CHAT_CHANNEL_SERVICE_EVENT -> "service";
            case CHAT_CHANNEL_APP_SUPPORT, CHAT_CHANNEL_SUPPORT_CASE -> "appSupport";
            default -> "";
        };
    }

    private void evictChatOwnerReadCaches(List<Chat> chatDocuments) {
        Set<String> ownerUserIds = new LinkedHashSet<>();
        for (Chat chat : chatDocuments == null ? List.<Chat>of() : chatDocuments) {
            if (chat != null && StringUtils.hasText(chat.getOwnerUserId())) {
                ownerUserIds.add(normalizeId(chat.getOwnerUserId()));
            }
        }
        homeUserProfileService.evictUserReadCaches(ownerUserIds);
    }

    private void refreshChatSummaries(String chatId, List<Chat> chatDocuments) {
        String normalizedChatId = normalizeId(chatId);
        if (!StringUtils.hasText(normalizedChatId)) {
            return;
        }
        ChatMessage latest = chatMessagesRepository
                .findByChatIdOrderBySentAtIsoDesc(normalizedChatId, PageRequest.of(0, 1))
                .stream()
                .findFirst()
                .orElse(null);
        List<Chat> sourceDocuments = chatDocuments == null || chatDocuments.isEmpty()
                ? chatsRepository.findByChatId(normalizedChatId)
                : chatDocuments;
        if (sourceDocuments.isEmpty()) {
            return;
        }
        List<Chat> updatedDocuments = new ArrayList<>();
        for (Chat existing : sourceDocuments) {
            if (existing == null) {
                continue;
            }
            Chat next = copyChat(existing);
            if (latest == null) {
                next.setLastMessage("");
                next.setLastSenderId("");
            } else {
                next.setLastMessage(chatMessageMapper.summary(latest));
                ChatAvatarRecord latestSender = latest.getSenderAvatar();
                next.setLastSenderId(latestSender == null ? "" : normalizeId(latestSender.getId()));
                next.setDateIso(latest.getSentAtIso());
            }
            updatedDocuments.add(next);
        }
        if (!updatedDocuments.isEmpty()) {
            chatsRepository.saveAll(updatedDocuments);
        }
    }

    @FunctionalInterface
    private interface ChatMessageMutator {
        void apply(ChatMessage message, String userId, Users user);
    }

    private record ChatCounterChange(Chat chat, int delta) {
    }

    private boolean addReader(ChatMessage message, ChatReadAvatarRecord reader) {
        if (message == null || reader == null || !StringUtils.hasText(reader.getId())) {
            return false;
        }
        List<ChatReadAvatarRecord> readBy = new ArrayList<>(safeReadBy(message.getReadBy()));
        for (ChatReadAvatarRecord existingReader : readBy) {
            if (existingReader != null && reader.getId().equals(normalizeId(existingReader.getId()))) {
                return false;
            }
        }
        readBy.add(copyReadAvatarRecord(reader));
        message.setReadBy(readBy);
        return true;
    }

    private boolean hasReader(ChatMessage message, String viewerUserId) {
        String normalizedViewerUserId = normalizeId(viewerUserId);
        if (message == null || !StringUtils.hasText(normalizedViewerUserId)) {
            return false;
        }
        return safeReadBy(message.getReadBy()).stream()
                .map(ChatReadAvatarRecord::getId)
                .map(this::normalizeId)
                .anyMatch(normalizedViewerUserId::equals);
    }

    private boolean matchesDevice(Users.UserDeviceRecord device, String deviceId, String firebaseToken) {
        if (device == null) {
            return false;
        }
        if (StringUtils.hasText(deviceId) && deviceId.equals(normalizeId(device.getDeviceId()))) {
            return true;
        }
        return StringUtils.hasText(firebaseToken) && firebaseToken.equals(normalizeText(device.getFirebaseToken()));
    }

    private ChatDto toChatDto(Chat chat) {
        return chatMapper.toDto(chat);
    }

    private ChatDto toChatDto(Chat chat, Map<String, Users> usersById) {
        return chatMapper.toDto(chat, usersById);
    }

    private List<ChatDto> chatDtosWithMetrics(List<Chat> records) {
        List<Chat> safeRecords = records == null ? List.of() : records;
        Map<String, Users> usersById = chatMemberUsers(safeRecords);
        List<Chat> metricRecords = safeRecords.stream()
                .filter(this::metricChatRecord)
                .toList();
        Map<String, ChatDto> dtoByOwnerId = chatMapper.toMap(metricRecords, usersById);
        patchChatDtosWithMetrics(metricRecords, dtoByOwnerId);
        List<ChatDto> result = new ArrayList<>();
        for (Chat record : safeRecords) {
            ChatDto dto = toChatDto(record, usersById);
            String ownerId = normalizeId(dto == null ? null : dto.ownerId());
            if (StringUtils.hasText(ownerId) && supportsChatMetrics(chatChannelType(record))) {
                result.add(dtoByOwnerId.getOrDefault(ownerId, dto));
            } else if (dto != null) {
                result.add(dto);
            }
        }
        return patchChatDtosWithNavigationContext(safeRecords, result);
    }

    private List<ChatDto> patchChatDtosWithNavigationContext(List<Chat> records, List<ChatDto> dtos) {
        if (records == null || records.isEmpty() || dtos == null || dtos.isEmpty()) {
            return dtos == null ? List.of() : dtos;
        }
        Set<String> eventIds = new LinkedHashSet<>();
        for (Chat record : records) {
            ChatOwnerParts parts = chatOwnerParts(record);
            String channelType = chatChannelType(record);
            if ((CHAT_CHANNEL_OPTIONAL_SUB_EVENT.equals(channelType)
                    || CHAT_CHANNEL_GROUP_SUB_EVENT.equals(channelType))
                    && StringUtils.hasText(parts.eventId())) {
                eventIds.add(parts.eventId());
            }
        }
        if (eventIds.isEmpty()) {
            return dtos;
        }

        Query eventQuery = Query.query(Criteria.where("sourceId").in(eventIds));
        eventQuery.fields()
                .include("sourceId")
                .include("ownerUserId")
                .include("creatorUserId")
                .include("admins")
                .include("title")
                .include("pendingMembers")
                .include("subEvents");
        List<ActivityEvent> eventRecords = mongoTemplate.find(eventQuery, ActivityEvent.class);
        Map<String, ActivityEvent> eventsByViewerAndId = new LinkedHashMap<>();
        Map<String, ActivityEvent> fallbackEventsById = new LinkedHashMap<>();
        for (ActivityEvent event : eventRecords == null ? List.<ActivityEvent>of() : eventRecords) {
            String eventId = normalizeId(event == null ? null : event.getSourceId());
            if (!StringUtils.hasText(eventId)) {
                continue;
            }
            fallbackEventsById.putIfAbsent(eventId, event);
            String ownerUserId = normalizeId(event.getOwnerUserId());
            if (StringUtils.hasText(ownerUserId)) {
                eventsByViewerAndId.put(ownerUserId + ":" + eventId, event);
            }
        }

        List<ChatDto> result = new ArrayList<>(dtos.size());
        for (int index = 0; index < dtos.size(); index += 1) {
            ChatDto dto = dtos.get(index);
            Chat record = index < records.size() ? records.get(index) : null;
            ChatOwnerParts parts = chatOwnerParts(record);
            String eventId = parts.eventId();
            ActivityEvent event = eventsByViewerAndId.get(normalizeId(record == null ? null : record.getOwnerUserId())
                    + ":" + eventId);
            if (event == null) {
                event = fallbackEventsById.get(eventId);
            }
            result.add(chatMapper.withNavigationContext(
                    dto,
                    chatNavigationContext(record, dto, event, parts)));
        }
        return result;
    }

    private ChatNavigationContextDto chatNavigationContext(
            Chat chat,
            ChatDto dto,
            ActivityEvent event,
            ChatOwnerParts parts) {
        String channelType = chatChannelType(chat);
        if (event == null
                || (!CHAT_CHANNEL_OPTIONAL_SUB_EVENT.equals(channelType)
                        && !CHAT_CHANNEL_GROUP_SUB_EVENT.equals(channelType))) {
            return null;
        }
        SubEventItem subEvent = (event.getSubEvents() == null ? List.<SubEventItem>of() : event.getSubEvents())
                .stream()
                .filter(Objects::nonNull)
                .filter(item -> parts.subEventId().equals(normalizeId(item.id())))
                .findFirst()
                .orElse(null);
        if (subEvent == null) {
            return null;
        }
        String viewerUserId = normalizeId(chat == null ? null : chat.getOwnerUserId());
        boolean canManage = viewerUserId.equals(normalizeId(event.getCreatorUserId()))
                || (event.getAdmins() != null && event.getAdmins().stream()
                        .map(this::normalizeId)
                        .anyMatch(viewerUserId::equals));
        return new ChatNavigationContextDto(
                parts.eventId(),
                safeText(event.getTitle()),
                canManage ? "hosting" : "events",
                normalizeCount(event.getPendingMembers()),
                SubEventItemMapper.toDto(subEvent),
                CHAT_CHANNEL_GROUP_SUB_EVENT.equals(channelType)
                        ? toChatGroupContext(subEvent, parts.groupId(), dto == null ? null : dto.metrics())
                        : null);
    }

    private ChatGroupContextDto toChatGroupContext(SubEventItem subEvent, String groupId, ChatMetricsDto metrics) {
        ChatMetricBucketDto members = metrics == null ? null : metrics.members();
        SubEventGroupItemDto group = (subEvent == null || subEvent.groups() == null
                ? List.<SubEventGroupItemDto>of()
                : subEvent.groups()).stream()
                .filter(Objects::nonNull)
                .filter(item -> normalizeId(groupId).equals(normalizeId(item.id())))
                .findFirst()
                .orElse(null);
        if (group == null) {
            return null;
        }
        return new ChatGroupContextDto(
                normalizeId(group.id()),
                safeText(group.name()),
                safeText(group.source()),
                members == null ? 0 : members.accepted(),
                members == null ? 0 : members.pending(),
                normalizeCount(group.capacityMin()),
                normalizeCount(group.capacityMax()));
    }

    private Map<String, Users> chatMemberUsers(Collection<Chat> records) {
        Set<String> memberIds = new LinkedHashSet<>();
        for (Chat record : records == null ? List.<Chat>of() : records) {
            for (String memberId : safeMemberIds(record == null ? null : record.getMemberIds())) {
                String normalizedMemberId = normalizeId(memberId);
                if (StringUtils.hasText(normalizedMemberId)) {
                    memberIds.add(normalizedMemberId);
                }
            }
        }
        if (memberIds.isEmpty()) {
            return Map.of();
        }
        Map<String, Users> usersById = new LinkedHashMap<>();
        for (Users user : usersRepository.findByUserIdIn(memberIds)) {
            String userId = normalizeId(user == null ? null : user.getUserId());
            if (StringUtils.hasText(userId)) {
                usersById.put(userId, user);
            }
        }
        return usersById;
    }

    private void patchChatDtosWithMetrics(List<Chat> records, Map<String, ChatDto> dtoByOwnerId) {
        if (records == null || records.isEmpty() || dtoByOwnerId == null || dtoByOwnerId.isEmpty()) {
            return;
        }
        Map<String, ChatMetricLookup> lookupByOwnerId = new LinkedHashMap<>();
        Map<String, MemberOwnerLookup> memberOwnersByKey = new LinkedHashMap<>();
        Set<String> resourceOwnerIds = new LinkedHashSet<>();
        Set<String> resourceViewerUserIds = new LinkedHashSet<>();
        Set<String> stageRuntimeOwnerIds = new LinkedHashSet<>();

        for (Chat record : records) {
            String ownerId = normalizeId(record == null ? null : record.getOwnerId());
            String channelType = chatChannelType(record);
            if (!StringUtils.hasText(ownerId)
                    || !dtoByOwnerId.containsKey(ownerId)
                    || !supportsChatMetrics(channelType)) {
                continue;
            }
            ChatOwnerParts parts = chatOwnerParts(record);
            String viewerUserId = normalizeId(record.getOwnerUserId());
            lookupByOwnerId.put(ownerId, new ChatMetricLookup(channelType, ownerId, viewerUserId, parts));

            String memberOwnerType = memberOwnerType(channelType);
            if (StringUtils.hasText(memberOwnerType)) {
                memberOwnersByKey.put(memberOwnerType + ":" + ownerId, new MemberOwnerLookup(memberOwnerType, ownerId));
            }
            if ((CHAT_CHANNEL_OPTIONAL_SUB_EVENT.equals(channelType) || CHAT_CHANNEL_GROUP_SUB_EVENT.equals(channelType))
                    && StringUtils.hasText(parts.subEventId())) {
                if (StringUtils.hasText(parts.eventId())) {
                    resourceOwnerIds.add(parts.eventId());
                    stageRuntimeOwnerIds.add(parts.eventId());
                }
                resourceOwnerIds.add(ownerId);
                if (StringUtils.hasText(viewerUserId)) {
                    resourceViewerUserIds.add(viewerUserId);
                }
                stageRuntimeOwnerIds.add(ownerId);
            }
        }

        Map<String, List<ActivityMember>> membersByOwnerKey = activityMembersByOwnerKey(memberOwnersByKey.values());
        Set<String> acceptedMemberIds = membersByOwnerKey.values().stream()
                .flatMap(Collection::stream)
                .filter(record -> MEMBER_STATUS_ACCEPTED.equals(
                        safeText(record == null ? null : record.getStatus()).toLowerCase(Locale.ROOT)))
                .map(ActivityMember::getUserId)
                .map(this::normalizeId)
                .filter(StringUtils::hasText)
                .collect(java.util.stream.Collectors.toCollection(LinkedHashSet::new));
        Map<String, Users> activityMemberUsersById = new LinkedHashMap<>();
        if (!acceptedMemberIds.isEmpty()) {
            for (Users user : usersRepository.findByUserIdIn(acceptedMemberIds)) {
                String memberUserId = normalizeId(user == null ? null : user.getUserId());
                if (StringUtils.hasText(memberUserId)) {
                    activityMemberUsersById.put(memberUserId, user);
                }
            }
        }
        Map<String, List<ActivitySubEventResource>> resourcesByMetricKey = resourceRecordsByMetricKey(
                resourceOwnerIds,
                resourceViewerUserIds);
        Map<String, Asset> assetsByOwnerAndId = assetsByOwnerAndId(resourcesByMetricKey.values());
        Map<String, ActivitySubEventStageRuntime> stageRuntimeByMetricKey = stageRuntimeByMetricKey(stageRuntimeOwnerIds);

        for (Map.Entry<String, ChatMetricLookup> entry : lookupByOwnerId.entrySet()) {
            String ownerIdKey = entry.getKey();
            ChatMetricLookup lookup = entry.getValue();
            String memberOwnerType = memberOwnerType(lookup.channelType());
            ChatMetricBucketDto members = StringUtils.hasText(memberOwnerType)
                    ? memberBucket(membersByOwnerKey.getOrDefault(memberOwnerType + ":" + lookup.ownerId(), List.of()))
                    : null;
            ChatMetricsDto metrics = buildChatMetrics(
                    lookup,
                    members,
                    resourcesByMetricKey,
                    assetsByOwnerAndId,
                    stageRuntimeByMetricKey);
            ChatDto dto = dtoByOwnerId.get(ownerIdKey);
            if (dto != null) {
                List<String> authoritativeMemberIds = StringUtils.hasText(memberOwnerType)
                        ? membersByOwnerKey.getOrDefault(
                                        memberOwnerType + ":" + lookup.ownerId(),
                                        List.of()).stream()
                                .filter(record -> MEMBER_STATUS_ACCEPTED.equals(
                                        safeText(record == null ? null : record.getStatus()).toLowerCase(Locale.ROOT)))
                                .map(ActivityMember::getUserId)
                                .map(this::normalizeId)
                                .filter(StringUtils::hasText)
                                .distinct()
                                .toList()
                        : dto.memberIds();
                ChatDto withMembers = chatMapper.withMembers(dto, authoritativeMemberIds, activityMemberUsersById);
                dtoByOwnerId.put(ownerIdKey, chatMapper.withMetrics(withMembers, metrics));
            }
        }
    }

    private ChatMetricsDto buildChatMetrics(
            ChatMetricLookup lookup,
            ChatMetricBucketDto members,
            Map<String, List<ActivitySubEventResource>> resourcesByMetricKey,
            Map<String, Asset> assetsByOwnerAndId,
            Map<String, ActivitySubEventStageRuntime> stageRuntimeByMetricKey) {
        ChatMetricBucketDto transport = null;
        ChatMetricBucketDto accommodation = null;
        ChatMetricBucketDto supplies = null;
        Integer groupsCount = null;
        int pendingTotal = countValue(members == null ? null : members.pending());

        if (lookup != null
                && (CHAT_CHANNEL_OPTIONAL_SUB_EVENT.equals(lookup.channelType())
                        || CHAT_CHANNEL_GROUP_SUB_EVENT.equals(lookup.channelType()))
                && StringUtils.hasText(lookup.parts().subEventId())) {
            List<ActivitySubEventResource> resources = metricResourceRecords(
                    resourcesByMetricKey,
                    lookup.viewerUserId(),
                    CHAT_CHANNEL_GROUP_SUB_EVENT.equals(lookup.channelType()) ? "" : lookup.parts().eventId(),
                    lookup.ownerId(),
                    lookup.parts().subEventId());
            transport = assetBucket(resources, ASSET_TYPE_TRANSPORT, assetsByOwnerAndId);
            accommodation = assetBucket(resources, ASSET_TYPE_ACCOMMODATION, assetsByOwnerAndId);
            supplies = assetBucket(resources, ASSET_TYPE_SUPPLIES, assetsByOwnerAndId);
            ActivitySubEventStageRuntime stageRuntime = firstStageRuntime(
                    stageRuntimeByMetricKey,
                    lookup.parts().eventId(),
                    lookup.ownerId(),
                    lookup.parts().subEventId());
            groupsCount = stageRuntime == null ? null : countValue(stageRuntime.getGroupsCount());
            pendingTotal += countValue(transport.pending())
                    + countValue(accommodation.pending())
                    + countValue(supplies.pending());
        }

        return new ChatMetricsDto(
                members,
                transport,
                accommodation,
                supplies,
                groupsCount,
                pendingTotal);
    }

    private Map<String, List<ActivityMember>> activityMembersByOwnerKey(Collection<MemberOwnerLookup> lookups) {
        Map<String, Set<String>> ownerIdsByType = new LinkedHashMap<>();
        for (MemberOwnerLookup lookup : lookups == null ? List.<MemberOwnerLookup>of() : lookups) {
            if (lookup == null || !StringUtils.hasText(lookup.ownerType()) || !StringUtils.hasText(lookup.ownerId())) {
                continue;
            }
            ownerIdsByType.computeIfAbsent(lookup.ownerType(), ignored -> new LinkedHashSet<>()).add(lookup.ownerId());
        }

        Map<String, List<ActivityMember>> result = new LinkedHashMap<>();
        for (Map.Entry<String, Set<String>> entry : ownerIdsByType.entrySet()) {
            if (entry.getValue().isEmpty()) {
                continue;
            }
            List<ActivityMember> records = activityMembersRepository.findByOwnerTypeAndOwnerIdIn(entry.getKey(), entry.getValue());
            for (ActivityMember record : records == null ? List.<ActivityMember>of() : records) {
                String ownerType = safeText(record == null ? null : record.getOwnerType());
                String ownerId = normalizeId(record == null ? null : record.getOwnerId());
                if (!StringUtils.hasText(ownerType) || !StringUtils.hasText(ownerId)) {
                    continue;
                }
                result.computeIfAbsent(ownerType + ":" + ownerId, ignored -> new ArrayList<>()).add(record);
            }
        }
        return result;
    }

    private Map<String, List<ActivitySubEventResource>> resourceRecordsByMetricKey(
            Set<String> ownerIds,
            Set<String> viewerUserIds) {
        if (ownerIds == null || ownerIds.isEmpty() || viewerUserIds == null || viewerUserIds.isEmpty()) {
            return Map.of();
        }
        List<ActivitySubEventResource> records = activitySubEventResourcesRepository
                .findByOwnerIdInAndAssetOwnerUserIdInAndStatusNot(
                        ownerIds,
                        viewerUserIds,
                        RUNTIME_STATUS_DELETED);
        Map<String, List<ActivitySubEventResource>> result = new LinkedHashMap<>();
        for (ActivitySubEventResource record : records == null ? List.<ActivitySubEventResource>of() : records) {
            String ownerId = normalizeId(record == null ? null : record.getOwnerId());
            String subEventId = normalizeId(record == null ? null : record.getSubEventId());
            if (!StringUtils.hasText(ownerId) || !StringUtils.hasText(subEventId)) {
                continue;
            }
            String assetOwnerUserId = normalizeId(record.getAssetOwnerUserId());
            if (StringUtils.hasText(assetOwnerUserId)) {
                result.computeIfAbsent(
                        assetOwnerUserId + ":" + ownerId + ":" + subEventId,
                        ignored -> new ArrayList<>()).add(record);
            }
        }
        return result;
    }

    private Map<String, Asset> assetsByOwnerAndId(Collection<List<ActivitySubEventResource>> resourceBuckets) {
        Set<String> ownerUserIds = new LinkedHashSet<>();
        Set<String> assetIds = new LinkedHashSet<>();
        for (List<ActivitySubEventResource> bucket : resourceBuckets == null
                ? List.<List<ActivitySubEventResource>>of()
                : resourceBuckets) {
            for (ActivitySubEventResource record : bucket == null ? List.<ActivitySubEventResource>of() : bucket) {
                String ownerUserId = normalizeId(record == null ? null : record.getAssetOwnerUserId());
                if (StringUtils.hasText(ownerUserId)) {
                    ownerUserIds.add(ownerUserId);
                }
                if (record != null && record.getAssetAssignmentIds() != null) {
                    record.getAssetAssignmentIds().values().stream()
                            .filter(Objects::nonNull)
                            .flatMap(Collection::stream)
                            .map(this::normalizeId)
                            .filter(StringUtils::hasText)
                            .forEach(assetIds::add);
                }
            }
        }
        if (ownerUserIds.isEmpty() || assetIds.isEmpty()) {
            return Map.of();
        }
        Query query = new Query(Criteria.where("ownerUserId").in(ownerUserIds).and("assetId").in(assetIds));
        Map<String, Asset> result = new LinkedHashMap<>();
        for (Asset asset : mongoTemplate.find(query, Asset.class)) {
            String ownerUserId = normalizeId(asset == null ? null : asset.getOwnerUserId());
            String assetId = normalizeId(asset == null ? null : asset.getAssetId());
            if (StringUtils.hasText(ownerUserId) && StringUtils.hasText(assetId)) {
                result.put(ownerUserId + ":" + assetId, asset);
            }
        }
        return result;
    }

    private Map<String, ActivitySubEventStageRuntime> stageRuntimeByMetricKey(Set<String> ownerIds) {
        if (ownerIds == null || ownerIds.isEmpty()) {
            return Map.of();
        }
        List<ActivitySubEventStageRuntime> records = activitySubEventStageRuntimeRepository.findByOwnerIdInAndStatusNot(ownerIds, RUNTIME_STATUS_DELETED);
        Map<String, ActivitySubEventStageRuntime> result = new LinkedHashMap<>();
        for (ActivitySubEventStageRuntime record : records == null ? List.<ActivitySubEventStageRuntime>of() : records) {
            String ownerId = normalizeId(record == null ? null : record.getOwnerId());
            String subEventId = normalizeId(record == null ? null : record.getSubEventId());
            if (StringUtils.hasText(ownerId) && StringUtils.hasText(subEventId)) {
                result.put(ownerId + ":" + subEventId, record);
            }
        }
        return result;
    }

    private List<ActivitySubEventResource> metricResourceRecords(
            Map<String, List<ActivitySubEventResource>> recordsByKey,
            String viewerUserId,
            String eventId,
            String ownerId,
            String subEventId) {
        Map<String, ActivitySubEventResource> result = new LinkedHashMap<>();
        List<String> keys = new ArrayList<>();
        if (StringUtils.hasText(eventId)) {
            keys.add(viewerUserId + ":" + eventId + ":" + subEventId);
        }
        if (StringUtils.hasText(ownerId)) {
            keys.add(viewerUserId + ":" + ownerId + ":" + subEventId);
        }
        for (String key : keys) {
            for (ActivitySubEventResource record : recordsByKey.getOrDefault(key, List.of())) {
                String recordKey = firstNonBlank(
                        record == null ? null : record.getRecordId(),
                        record == null ? null : record.getId(),
                        key + ":" + normalizeId(record == null ? null : record.getAssetOwnerUserId()));
                if (StringUtils.hasText(recordKey)) {
                    result.put(recordKey, record);
                }
            }
        }
        return new ArrayList<>(result.values());
    }

    private ActivitySubEventStageRuntime firstStageRuntime(
            Map<String, ActivitySubEventStageRuntime> recordsByKey,
            String eventId,
            String ownerId,
            String subEventId) {
        if (StringUtils.hasText(eventId)) {
            ActivitySubEventStageRuntime record = recordsByKey.get(eventId + ":" + subEventId);
            if (record != null) {
                return record;
            }
        }
        return StringUtils.hasText(ownerId) ? recordsByKey.get(ownerId + ":" + subEventId) : null;
    }

    private ChatMetricBucketDto memberBucket(List<ActivityMember> records) {
        int accepted = 0;
        int pending = 0;
        for (ActivityMember record : records == null ? List.<ActivityMember>of() : records) {
            String status = safeText(record == null ? null : record.getStatus()).toLowerCase(Locale.ROOT);
            if (MEMBER_STATUS_ACCEPTED.equals(status)) {
                accepted += 1;
            } else if (MEMBER_STATUS_PENDING.equals(status)) {
                pending += 1;
            }
        }
        return new ChatMetricBucketDto(accepted, pending, 0, Math.max(accepted, accepted + pending));
    }

    private ChatMetricBucketDto assetBucket(
            List<ActivitySubEventResource> records,
            String type,
            Map<String, Asset> assetsByOwnerAndId) {
        int accepted = 0;
        int pending = 0;
        int capacityMin = 0;
        int capacityMax = 0;
        for (ActivitySubEventResource record : records == null ? List.<ActivitySubEventResource>of() : records) {
            Map<String, Map<String, SubEventAssignedAssetSettingsRecord>> settingsByType =
                    record == null || record.getAssetSettingsByType() == null
                            ? Map.of()
                            : record.getAssetSettingsByType();
            Map<String, SubEventAssignedAssetSettingsRecord> settingsByAssetId = settingsByType.getOrDefault(type, Map.of());
            List<String> assignedIds = record == null || record.getAssetAssignmentIds() == null
                    ? List.of()
                    : record.getAssetAssignmentIds().getOrDefault(type, List.of());
            List<String> assetIds = assignedIds == null || assignedIds.isEmpty()
                    ? new ArrayList<>(settingsByAssetId.keySet())
                    : assignedIds;
            for (String assetId : assetIds) {
                SubEventAssignedAssetSettingsRecord settings = settingsByAssetId.get(assetId);
                capacityMin += countValue(settings == null ? null : settings.capacityMin());
                Asset asset = assetsByOwnerAndId.get(
                        normalizeId(record.getAssetOwnerUserId()) + ":" + normalizeId(assetId));
                capacityMax += countValue(settings != null && settings.capacityMax() != null
                        ? settings.capacityMax()
                        : asset == null ? null : asset.getCapacityTotal());
                if (ASSET_TYPE_SUPPLIES.equals(type)) {
                    accepted += supplyContributionQuantity(record, assetId);
                } else if (asset != null) {
                    int[] requestCounts = assetRequestCountsForMetric(
                            asset,
                            record.getSubEventId(),
                            record.getOwnerId());
                    accepted += requestCounts[0];
                    pending += requestCounts[1];
                }
            }
        }
        return new ChatMetricBucketDto(
                accepted,
                pending,
                capacityMin,
                Math.max(Math.max(capacityMin, capacityMax), accepted + pending));
    }

    private int[] assetRequestCountsForMetric(Asset asset, String subEventId, String ownerId) {
        String normalizedSubEventId = normalizeId(subEventId);
        String normalizedOwnerId = normalizeId(ownerId);
        Map<String, String> statusByMemberIdentity = new LinkedHashMap<>();
        for (AssetRequestRecord request : asset == null || asset.getRequests() == null
                ? List.<AssetRequestRecord>of()
                : asset.getRequests()) {
            String bookingSubEventId = normalizeId(
                    request == null || request.booking() == null ? null : request.booking().subEventId());
            String bookingOwnerId = normalizeId(
                    request == null || request.booking() == null ? null : request.booking().eventId());
            if (!normalizedSubEventId.equals(bookingSubEventId)
                    || !normalizedOwnerId.equals(bookingOwnerId)) {
                continue;
            }
            String status = safeText(request.status()).toLowerCase(Locale.ROOT);
            if (!MEMBER_STATUS_ACCEPTED.equals(status) && !MEMBER_STATUS_PENDING.equals(status)) {
                continue;
            }
            String identity = firstNonBlank(
                    normalizeId(request.userId()),
                    normalizeId(request.id()));
            if (!StringUtils.hasText(identity)) {
                continue;
            }
            String existing = statusByMemberIdentity.get(identity);
            if (!MEMBER_STATUS_ACCEPTED.equals(existing) || MEMBER_STATUS_ACCEPTED.equals(status)) {
                statusByMemberIdentity.put(identity, status);
            }
        }
        int accepted = (int) statusByMemberIdentity.values().stream()
                .filter(MEMBER_STATUS_ACCEPTED::equals)
                .count();
        int pending = (int) statusByMemberIdentity.values().stream()
                .filter(MEMBER_STATUS_PENDING::equals)
                .count();
        return new int[] {accepted, pending};
    }

    private int supplyContributionQuantity(ActivitySubEventResource record, String assetId) {
        if (record == null || record.getSupplyContributionEntriesByAssetId() == null) {
            return 0;
        }
        int total = 0;
        for (SubEventSupplyContributionEntryRecord entry : record.getSupplyContributionEntriesByAssetId()
                .getOrDefault(assetId, List.of())) {
            total += countValue(entry == null ? null : entry.quantity());
        }
        return total;
    }

    private ChatMessage buildMessage(
            Users sender,
            String senderUserId,
            String text,
            String clientId,
            ChatMessageReplyRecord replyTo,
            List<ChatMessageAttachmentRecord> attachments) {
        Instant sentAt = Instant.now();
        ChatMessage message = new ChatMessage();
        message.setId(UUID.randomUUID().toString());
        message.setClientId(normalizeText(clientId));
        message.setSender(resolveUserName(sender, senderUserId));
        message.setSenderAvatar(buildSenderAvatarRecord(sender, senderUserId));
        message.setText(text);
        message.setTime(CHAT_TIME_FORMATTER.format(sentAt));
        message.setSentAtIso(sentAt.toString());
        message.setMine(Boolean.FALSE);
        message.setReadBy(new ArrayList<>());
        message.setReplyTo(copyReplyRecord(replyTo));
        message.setReactions(new ArrayList<>());
        message.setAttachments(copyAttachmentRecords(attachments));
        return message;
    }

    private ChatMessage buildSystemMessage(String text, String systemType) {
        Instant sentAt = Instant.now();
        ChatAvatarRecord avatar = new ChatAvatarRecord();
        avatar.setId("");
        avatar.setInitials("MS");
        avatar.setGender("system");
        ChatMessage message = new ChatMessage();
        message.setId(UUID.randomUUID().toString());
        message.setClientId(firstNonBlank(systemType, "system"));
        message.setSender("System");
        message.setSenderAvatar(avatar);
        message.setText(text);
        message.setTime(CHAT_TIME_FORMATTER.format(sentAt));
        message.setSentAtIso(sentAt.toString());
        message.setMine(Boolean.FALSE);
        message.setReadBy(new ArrayList<>());
        message.setReplyTo(null);
        message.setReactions(new ArrayList<>());
        message.setAttachments(new ArrayList<>());
        return message;
    }

    private ChatStreamEvent toReadEvent(String chatId, ChatReadUpdate readUpdate) {
        return ChatStreamEvent.read(
                chatId,
                readUpdate.reader().id(),
                readUpdate.reader().initials(),
                readUpdate.reader().gender(),
                readUpdate.readMessageIds(),
                readUpdate.readAtIso(),
                readUpdate.unread());
    }

    private ChatReadReceiptDto toReadReceiptDto(ChatReadUpdate readUpdate) {
        if (readUpdate == null || !readUpdate.changed()) {
            return null;
        }
        return new ChatReadReceiptDto(
                readUpdate.reader().id(),
                readUpdate.reader().initials(),
                readUpdate.reader().gender(),
                readUpdate.readMessageIds(),
                readUpdate.readAtIso(),
                readUpdate.unread());
    }

    private void publishChatEvent(ChatStreamEvent streamEvent) {
        chatStreamPublisher.publish(streamEvent);
    }

    private CompletableFuture<Boolean> publishChatEventAsync(ChatStreamEvent streamEvent) {
        return CompletableFuture.supplyAsync(() -> chatStreamPublisher.publish(streamEvent), chatWriteExecutor);
    }

    private void observeChatEventPublish(CompletableFuture<Boolean> redisPublish, ChatStreamEvent streamEvent) {
        if (redisPublish == null) {
            return;
        }
        redisPublish.whenComplete((published, exception) -> {
            if (exception != null) {
                LOGGER.warn("Unable to publish chat event to Redis for chat {}.", streamEvent == null ? null : streamEvent.chatId(), exception);
                return;
            }
            if (!Boolean.TRUE.equals(published)) {
                LOGGER.warn("Chat event was persisted to Mongo but not published to Redis for chat {}.", streamEvent == null ? null : streamEvent.chatId());
            }
        });
    }

    private Chat findOwnerChat(List<Chat> chats, String ownerUserId) {
        String normalizedOwnerUserId = normalizeId(ownerUserId);
        Chat selected = null;
        for (Chat chat : chats) {
            if (chat == null || !normalizedOwnerUserId.equals(normalizeId(chat.getOwnerUserId()))) {
                continue;
            }
            if (selected == null) {
                selected = chat;
                continue;
            }

            long candidateDate = sortableDate(chat.getDateIso());
            long selectedDate = sortableDate(selected.getDateIso());
            if (candidateDate > selectedDate) {
                selected = chat;
                continue;
            }
            if (candidateDate < selectedDate) {
                continue;
            }

            int candidateMessageCount = messageCount(chat);
            int selectedMessageCount = messageCount(selected);
            if (candidateMessageCount > selectedMessageCount) {
                selected = chat;
            }
        }
        return selected;
    }

    private int messageCount(Chat chat) {
        if (chat == null) {
            return 0;
        }
        int transientMessageCount = safeMessages(chat.getMessages()).size();
        if (transientMessageCount > 0) {
            return transientMessageCount;
        }
        String chatId = normalizeId(chat.getChatId());
        if (!StringUtils.hasText(chatId)) {
            return 0;
        }
        return normalizeLongCount(chatMessagesRepository.countByChatId(chatId));
    }

    private boolean hasChatAccess(Chat chat, String userId) {
        if (chat == null || !StringUtils.hasText(userId)) {
            return false;
        }
        String normalizedUserId = normalizeId(userId);
        if (normalizedUserId.equals(normalizeId(chat.getOwnerUserId()))) {
            return true;
        }
        if (isSupportCaseChat(chat) && isAdminUser(findUser(normalizedUserId))) {
            return true;
        }
        if (chat.getMemberIds() == null) {
            return false;
        }
        return chat.getMemberIds().stream()
                .map(this::normalizeId)
                .anyMatch(normalizedUserId::equals);
    }

    private Chat createOwnerCopy(Chat baseChat, String ownerUserId) {
        Chat copy = copyChat(baseChat);
        copy.setMongoId(buildMongoId(ownerUserId, baseChat.getChatId()));
        copy.setOwnerUserId(ownerUserId);
        copy.setUnread(countUnreadMessages(baseChat.getChatId(), ownerUserId));
        return copy;
    }

    private int countUnreadMessages(String chatId, String viewerUserId) {
        String normalizedChatId = normalizeId(chatId);
        String normalizedViewerUserId = normalizeId(viewerUserId);
        if (!StringUtils.hasText(normalizedChatId) || !StringUtils.hasText(normalizedViewerUserId)) {
            return 0;
        }
        Query unreadQuery = Query.query(Criteria.where("chatId").is(normalizedChatId)
                .and("senderAvatar.id").ne(normalizedViewerUserId)
                .and("readBy.id").ne(normalizedViewerUserId));
        return normalizeLongCount(mongoTemplate.count(unreadQuery, ChatMessage.class));
    }

    private Chat copyChat(Chat source) {
        Chat copy = new Chat();
        copy.setMongoId(source.getMongoId());
        copy.setChatId(source.getChatId());
        copy.setOwnerUserId(source.getOwnerUserId());
        copy.setAvatar(source.getAvatar());
        copy.setTitle(source.getTitle());
        copy.setLastMessage(source.getLastMessage());
        copy.setLastSenderId(source.getLastSenderId());
        copy.setMemberIds(new ArrayList<>(source.getMemberIds() == null ? List.of() : source.getMemberIds()));
        copy.setUnread(source.getUnread());
        copy.setDateIso(source.getDateIso());
        copy.setChannelType(source.getChannelType());
        copy.setOwnerId(source.getOwnerId());
        copy.setEventId(source.getEventId());
        copy.setOwnerStatus(source.getOwnerStatus());
        copy.setRevision(normalizeChatRevision(source.getRevision()));
        copy.setSubEventId(source.getSubEventId());
        copy.setGroupId(source.getGroupId());
        copy.setDistanceKm(null);
        copy.setDistanceMetersExact(null);
        copy.setSupportCase(copySupportCase(source.getSupportCase()));
        return copy;
    }

    private long normalizeChatRevision(Long value) {
        return value == null || value < 1L ? 1L : value;
    }

    private ChatMessageReplyRecord normalizeReply(ChatMessageReplyDto replyTo) {
        if (replyTo == null || !StringUtils.hasText(replyTo.id())) {
            return null;
        }
        ChatMessageReplyRecord record = new ChatMessageReplyRecord();
        record.setId(safeText(replyTo.id()));
        record.setSender(safeText(replyTo.sender()));
        record.setText(safeText(replyTo.text()));
        return record;
    }

    private ChatMessageReplyRecord copyReplyRecord(ChatMessageReplyRecord source) {
        if (source == null) {
            return null;
        }
        ChatMessageReplyRecord copy = new ChatMessageReplyRecord();
        copy.setId(source.getId());
        copy.setSender(source.getSender());
        copy.setText(source.getText());
        return copy;
    }

    private List<ChatMessageAttachmentRecord> normalizeAttachments(List<ChatMessageAttachmentDto> attachments) {
        if (attachments == null || attachments.isEmpty()) {
            return List.of();
        }
        List<ChatMessageAttachmentRecord> normalized = new ArrayList<>();
        for (ChatMessageAttachmentDto attachment : attachments) {
            if (attachment == null) {
                continue;
            }
            String type = safeText(attachment.type());
            String title = safeText(attachment.title());
            String url = safeText(attachment.url());
            String previewUrl = safeText(attachment.previewUrl());
            if (!StringUtils.hasText(type) || (!StringUtils.hasText(title) && !StringUtils.hasText(url) && !StringUtils.hasText(previewUrl))) {
                continue;
            }
            ChatMessageAttachmentRecord record = new ChatMessageAttachmentRecord();
            record.setId(StringUtils.hasText(attachment.id()) ? safeText(attachment.id()) : UUID.randomUUID().toString());
            record.setType(type);
            record.setTitle(title);
            record.setEntityId(safeText(attachment.entityId()));
            record.setAssetType(safeText(attachment.assetType()));
            record.setOwnerUserId(safeText(attachment.ownerUserId()));
            record.setStatus(normalizeAttachmentStatus(attachment.status()));
            record.setUnavailableReason(safeText(attachment.unavailableReason()));
            record.setSubtitle(safeText(attachment.subtitle()));
            record.setDescription(safeText(attachment.description()));
            record.setUrl(url);
            record.setPreviewUrl(previewUrl);
            record.setMimeType(safeText(attachment.mimeType()));
            record.setSizeBytes(attachment.sizeBytes() == null ? null : Math.max(0L, attachment.sizeBytes()));
            normalized.add(record);
        }
        return normalized;
    }

    private List<ChatMessageAttachmentRecord> copyAttachmentRecords(List<ChatMessageAttachmentRecord> attachments) {
        List<ChatMessageAttachmentRecord> copied = new ArrayList<>();
        for (ChatMessageAttachmentRecord attachment : safeAttachments(attachments)) {
            ChatMessageAttachmentRecord copy = new ChatMessageAttachmentRecord();
            copy.setId(attachment.getId());
            copy.setType(attachment.getType());
            copy.setTitle(attachment.getTitle());
            copy.setEntityId(attachment.getEntityId());
            copy.setAssetType(attachment.getAssetType());
            copy.setOwnerUserId(attachment.getOwnerUserId());
            copy.setStatus(normalizeAttachmentStatus(attachment.getStatus()));
            copy.setUnavailableReason(attachment.getUnavailableReason());
            copy.setSubtitle(attachment.getSubtitle());
            copy.setDescription(attachment.getDescription());
            copy.setUrl(attachment.getUrl());
            copy.setPreviewUrl(attachment.getPreviewUrl());
            copy.setMimeType(attachment.getMimeType());
            copy.setSizeBytes(attachment.getSizeBytes());
            copied.add(copy);
        }
        return copied;
    }

    private List<ChatMessageReactionRecord> copyReactionRecords(List<ChatMessageReactionRecord> reactions) {
        List<ChatMessageReactionRecord> copied = new ArrayList<>();
        for (ChatMessageReactionRecord reaction : safeReactions(reactions)) {
            ChatMessageReactionRecord copy = new ChatMessageReactionRecord();
            copy.setEmoji(reaction.getEmoji());
            copy.setUserId(reaction.getUserId());
            copy.setUserName(reaction.getUserName());
            copy.setUserInitials(reaction.getUserInitials());
            copy.setUserGender(reaction.getUserGender());
            copy.setReactedAtIso(reaction.getReactedAtIso());
            copied.add(copy);
        }
        return copied;
    }

    private ChatAvatarRecord buildSenderAvatarRecord(Users sender, String senderUserId) {
        ChatAvatarRecord avatar = new ChatAvatarRecord();
        avatar.setId(senderUserId);
        avatar.setInitials(resolveUserInitials(sender, senderUserId));
        avatar.setGender(resolveUserGender(sender));
        return avatar;
    }

    private ChatAvatarRecord copySenderAvatarRecord(ChatAvatarRecord source) {
        if (source == null) {
            return null;
        }
        ChatAvatarRecord copy = new ChatAvatarRecord();
        copy.setId(source.getId());
        copy.setInitials(source.getInitials());
        copy.setGender(source.getGender());
        return copy;
    }

    private ChatReadAvatarRecord buildReadAvatarRecord(Users user, String userId) {
        ChatReadAvatarRecord record = new ChatReadAvatarRecord();
        record.setId(userId);
        record.setInitials(resolveUserInitials(user, userId));
        record.setGender(resolveUserGender(user));
        return record;
    }

    private ChatReadAvatarRecord copyReadAvatarRecord(ChatReadAvatarRecord source) {
        if (source == null) {
            return null;
        }
        ChatReadAvatarRecord copy = new ChatReadAvatarRecord();
        copy.setId(source.getId());
        copy.setInitials(source.getInitials());
        copy.setGender(source.getGender());
        return copy;
    }

    private Users findUser(String userId) {
        if (!StringUtils.hasText(userId)) {
            return null;
        }
        return usersRepository.findByUserId(userId).orElse(null);
    }

    private String requireResolvedUserId(String requestedUserId) {
        String userId = resolveUserId(requestedUserId);
        if (!StringUtils.hasText(userId)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Missing authenticated user.");
        }
        return userId;
    }

    private String resolveUserId(String requestedUserId) {
        String resolvedUserId = normalizeId(homeUserProfileService.resolveSelectedUserId(requestedUserId));
        if (StringUtils.hasText(resolvedUserId)) {
            return resolvedUserId;
        }
        String normalizedRequestedUserId = normalizeId(requestedUserId);
        if (MongoSessionModeContext.currentMode() == MongoSessionMode.DEMO
                && normalizedRequestedUserId.startsWith("admin-demo-")) {
            return normalizedRequestedUserId;
        }
        return "";
    }

    private String resolveUserName(Users user, String fallbackUserId) {
        if (user != null && StringUtils.hasText(user.getName())) {
            return user.getName().trim();
        }
        return StringUtils.hasText(fallbackUserId) ? fallbackUserId.trim() : "User";
    }

    private String resolveUserInitials(Users user, String fallbackUserId) {
        if (user != null && StringUtils.hasText(user.getInitials())) {
            return user.getInitials().trim();
        }
        if (user != null && StringUtils.hasText(user.getName())) {
            return buildInitials(user.getName());
        }
        return buildInitials(fallbackUserId);
    }

    private String resolveUserGender(Users user) {
        return normalizeGender(user == null ? null : user.getGender());
    }

    private String buildInitials(String value) {
        String normalized = safeText(value);
        if (!StringUtils.hasText(normalized)) {
            return "CH";
        }
        String[] parts = normalized.split("\\s+");
        if (parts.length == 1) {
            return parts[0].substring(0, Math.min(2, parts[0].length())).toUpperCase(Locale.US);
        }
        return (parts[0].substring(0, 1) + parts[parts.length - 1].substring(0, 1)).toUpperCase(Locale.US);
    }

    private String normalizeGender(String value) {
        String normalized = safeText(value).toLowerCase(Locale.US);
        if ("deleted".equals(normalized)) {
            return "deleted";
        }
        if (normalized.startsWith("w") || normalized.startsWith("f")) {
            return "woman";
        }
        return "man";
    }

    private String normalizeAttachmentStatus(String value) {
        return "unavailable".equals(safeText(value)) ? "unavailable" : "available";
    }

    private List<? extends ChatMessage> safeMessages(List<? extends ChatMessage> messages) {
        return messages == null ? List.of() : messages;
    }

    private List<String> safeMemberIds(List<String> memberIds) {
        return memberIds == null ? List.of() : memberIds;
    }

    private List<ChatReadAvatarRecord> safeReadBy(List<ChatReadAvatarRecord> readBy) {
        return readBy == null ? List.of() : readBy;
    }

    private List<ChatMessageAttachmentRecord> safeAttachments(List<ChatMessageAttachmentRecord> attachments) {
        return attachments == null ? List.of() : attachments;
    }

    private List<ChatMessageReactionRecord> safeReactions(List<ChatMessageReactionRecord> reactions) {
        return reactions == null ? List.of() : reactions;
    }

    private int normalizeCount(Integer value) {
        return Math.max(0, value == null ? 0 : value);
    }

    private int normalizeLongCount(long value) {
        if (value <= 0L) {
            return 0;
        }
        return value > Integer.MAX_VALUE ? Integer.MAX_VALUE : (int) value;
    }

    private int normalizeChatMessagesPageSize(Integer value) {
        if (value == null) {
            return DEFAULT_CHAT_MESSAGES_PAGE_SIZE;
        }
        return Math.max(1, Math.min(MAX_CHAT_MESSAGES_PAGE_SIZE, value));
    }

    private int normalizeChatMessagesCursor(String cursor) {
        if (!StringUtils.hasText(cursor)) {
            return 0;
        }
        try {
            return Math.max(0, Integer.parseInt(cursor.trim()));
        } catch (NumberFormatException ignored) {
            return 0;
        }
    }

    private String normalizeText(String value) {
        return value == null ? "" : value.trim();
    }

    private String normalizeId(String value) {
        return value == null ? "" : value.trim();
    }

    private String safeText(String value) {
        return value == null ? "" : value.trim();
    }

    private String firstNonBlank(String... values) {
        for (String value : values == null ? new String[0] : values) {
            String normalized = safeText(value);
            if (StringUtils.hasText(normalized)) {
                return normalized;
            }
        }
        return "";
    }

    private boolean supportsChatMetrics(String channelType) {
        return CHAT_CHANNEL_MAIN_EVENT.equals(channelType)
                || CHAT_CHANNEL_OPTIONAL_SUB_EVENT.equals(channelType)
                || CHAT_CHANNEL_GROUP_SUB_EVENT.equals(channelType);
    }

    private boolean metricChatRecord(Chat record) {
        return StringUtils.hasText(normalizeId(record == null ? null : record.getOwnerId()))
                && supportsChatMetrics(chatChannelType(record));
    }

    private String memberOwnerType(String channelType) {
        if (CHAT_CHANNEL_MAIN_EVENT.equals(channelType)) {
            return OWNER_TYPE_EVENT;
        }
        if (CHAT_CHANNEL_OPTIONAL_SUB_EVENT.equals(channelType)) {
            return OWNER_TYPE_SUB_EVENT;
        }
        if (CHAT_CHANNEL_GROUP_SUB_EVENT.equals(channelType)) {
            return OWNER_TYPE_GROUP;
        }
        return "";
    }

    private String chatChannelType(Chat record) {
        String channelType = safeText(record == null ? null : record.getChannelType());
        if (CHAT_CHANNEL_MAIN_EVENT.equals(channelType)
                || CHAT_CHANNEL_OPTIONAL_SUB_EVENT.equals(channelType)
                || CHAT_CHANNEL_GROUP_SUB_EVENT.equals(channelType)
                || CHAT_CHANNEL_SERVICE_EVENT.equals(channelType)
                || CHAT_CHANNEL_APP_SUPPORT.equals(channelType)
                || CHAT_CHANNEL_SUPPORT_CASE.equals(channelType)) {
            return channelType;
        }
        List<String> parts = splitOwnerId(record == null ? null : record.getOwnerId());
        if (parts.size() >= 3) {
            return CHAT_CHANNEL_GROUP_SUB_EVENT;
        }
        if (parts.size() == 2) {
            return CHAT_CHANNEL_OPTIONAL_SUB_EVENT;
        }
        return parts.size() == 1 ? CHAT_CHANNEL_MAIN_EVENT : "general";
    }

    private ChatOwnerParts chatOwnerParts(Chat record) {
        String channelType = chatChannelType(record);
        String ownerId = normalizeId(record == null ? null : record.getOwnerId());
        String eventId = normalizeId(record == null ? null : record.getEventId());
        String subEventId = normalizeId(record == null ? null : record.getSubEventId());
        String groupId = normalizeId(record == null ? null : record.getGroupId());
        List<String> parts = splitOwnerId(ownerId);
        if (CHAT_CHANNEL_GROUP_SUB_EVENT.equals(channelType)) {
            return new ChatOwnerParts(
                    StringUtils.hasText(eventId) ? eventId : parts.isEmpty() ? "" : parts.get(0),
                    StringUtils.hasText(subEventId) ? subEventId : parts.size() > 1 ? parts.get(1) : "",
                    StringUtils.hasText(groupId)
                            ? groupId
                            : parts.size() > 2 ? String.join(":", parts.subList(2, parts.size())) : "");
        }
        if (CHAT_CHANNEL_OPTIONAL_SUB_EVENT.equals(channelType)) {
            return new ChatOwnerParts(
                    StringUtils.hasText(eventId) ? eventId : parts.size() > 1 ? parts.get(0) : "",
                    StringUtils.hasText(subEventId)
                            ? subEventId
                            : parts.size() > 1 ? String.join(":", parts.subList(1, parts.size())) : ownerId,
                    "");
        }
        if (CHAT_CHANNEL_MAIN_EVENT.equals(channelType)) {
            return new ChatOwnerParts(StringUtils.hasText(eventId) ? eventId : ownerId, "", "");
        }
        return new ChatOwnerParts("", "", "");
    }

    private List<String> splitOwnerId(String ownerId) {
        String normalizedOwnerId = normalizeId(ownerId);
        if (!StringUtils.hasText(normalizedOwnerId)) {
            return List.of();
        }
        List<String> parts = new ArrayList<>();
        for (String part : normalizedOwnerId.split(":")) {
            String normalizedPart = normalizeId(part);
            if (StringUtils.hasText(normalizedPart)) {
                parts.add(normalizedPart);
            }
        }
        return parts;
    }

    private int countValue(Integer value) {
        return normalizeCount(value);
    }

    private String normalizeChatContextFilter(String value) {
        String normalized = safeText(value);
        if ("event".equalsIgnoreCase(normalized)
                || "subEvent".equalsIgnoreCase(normalized)
                || "group".equalsIgnoreCase(normalized)
                || "service".equalsIgnoreCase(normalized)
                || "appSupport".equalsIgnoreCase(normalized)) {
            return normalized;
        }
        return "all";
    }

    private boolean matchesChatContextFilter(ChatDto item, String contextFilter) {
        if (!StringUtils.hasText(contextFilter) || "all".equalsIgnoreCase(contextFilter)) {
            return true;
        }
        String channelType = safeText(item == null ? null : item.channelType());
        if ("event".equalsIgnoreCase(contextFilter)) {
            return "mainEvent".equalsIgnoreCase(channelType);
        }
        if ("subEvent".equalsIgnoreCase(contextFilter)) {
            return "optionalSubEvent".equalsIgnoreCase(channelType);
        }
        if ("group".equalsIgnoreCase(contextFilter)) {
            return "groupSubEvent".equalsIgnoreCase(channelType);
        }
        if ("service".equalsIgnoreCase(contextFilter)) {
            return "serviceEvent".equalsIgnoreCase(channelType);
        }
        if ("appSupport".equalsIgnoreCase(contextFilter)) {
            return "appSupport".equalsIgnoreCase(channelType)
                    || "supportCase".equalsIgnoreCase(channelType);
        }
        return true;
    }

    private boolean matchesSupportCaseFilter(ChatDto item, String supportCaseFilter) {
        String normalizedFilter = normalizeSupportCaseFilter(supportCaseFilter);
        if (SUPPORT_CASE_FILTER_ALL.equals(normalizedFilter)) {
            return true;
        }
        return normalizedFilter.equals(normalizeSupportCaseStatus(item == null || item.supportCase() == null
                ? null
                : item.supportCase().status()));
    }

    private boolean isSupportCaseChat(Chat chat) {
        if (chat == null) {
            return false;
        }
        return "supportCase".equalsIgnoreCase(safeText(chat.getChannelType()))
                || StringUtils.hasText(supportStatus(chat))
                || normalizeId(chat.getChatId()).startsWith("c-support-admin-");
    }

    private boolean isAdminUser(Users user) {
        return adminMenuCounterService.isAdminUser(user);
    }

    private SupportCaseRecord toSupportCaseRecord(SupportCaseState state) {
        SupportCaseRecord supportCase = new SupportCaseRecord();
        supportCase.setStatus(normalizeSupportCaseStatus(state == null ? null : state.status()));
        supportCase.setUpdatedAtIso(state == null ? "" : safeText(state.updatedAtIso()));
        String assigneeUserId = normalizeId(state == null ? null : state.assigneeUserId());
        if (StringUtils.hasText(assigneeUserId)) {
            SupportCaseAssigneeRecord assignee = new SupportCaseAssigneeRecord();
            assignee.setUserId(assigneeUserId);
            assignee.setName(state == null ? "" : safeText(state.assigneeName()));
            assignee.setInitials(state == null ? "" : safeText(state.assigneeInitials()));
            supportCase.setAssignee(assignee);
        }
        return supportCase;
    }

    private SupportCaseRecord copySupportCase(SupportCaseRecord source) {
        if (source == null) {
            return null;
        }
        SupportCaseRecord copy = new SupportCaseRecord();
        copy.setStatus(source.getStatus());
        copy.setUpdatedAtIso(source.getUpdatedAtIso());
        SupportCaseAssigneeRecord sourceAssignee = source.getAssignee();
        if (sourceAssignee != null) {
            SupportCaseAssigneeRecord assignee = new SupportCaseAssigneeRecord();
            assignee.setUserId(sourceAssignee.getUserId());
            assignee.setName(sourceAssignee.getName());
            assignee.setInitials(sourceAssignee.getInitials());
            copy.setAssignee(assignee);
        }
        return copy;
    }

    private String supportStatus(Chat chat) {
        SupportCaseRecord supportCase = chat == null ? null : chat.getSupportCase();
        return safeText(supportCase == null ? null : supportCase.getStatus());
    }

    private String normalizeSupportCaseStatus(String value) {
        String normalized = safeText(value).toLowerCase(Locale.ROOT);
        return switch (normalized) {
            case SUPPORT_CASE_STATUS_WARNED, SUPPORT_CASE_STATUS_PICKED, SUPPORT_CASE_STATUS_SOLVED, SUPPORT_CASE_STATUS_BLOCKED -> normalized;
            default -> SUPPORT_CASE_STATUS_PENDING;
        };
    }

    private String normalizeSupportCaseFilter(String value) {
        String normalized = safeText(value).toLowerCase(Locale.ROOT);
        return switch (normalized) {
            case SUPPORT_CASE_STATUS_PENDING, SUPPORT_CASE_STATUS_WARNED, SUPPORT_CASE_STATUS_PICKED, SUPPORT_CASE_STATUS_SOLVED, SUPPORT_CASE_STATUS_BLOCKED -> normalized;
            default -> SUPPORT_CASE_FILTER_ALL;
        };
    }

    private String normalizeSupportCaseAction(String value) {
        String normalized = safeText(value).toLowerCase(Locale.ROOT);
        return switch (normalized) {
            case "pick", "unpick", "solve", "block", "reopen" -> normalized;
            default -> "";
        };
    }

    private SupportCaseState nextSupportCaseState(String action, String actorUserId, Users actor) {
        String nowIso = Instant.now().toString();
        return switch (action) {
            case "pick" -> assignedSupportCaseState(SUPPORT_CASE_STATUS_PICKED, actorUserId, actor, nowIso);
            case "solve" -> assignedSupportCaseState(SUPPORT_CASE_STATUS_SOLVED, actorUserId, actor, nowIso);
            case "block" -> assignedSupportCaseState(SUPPORT_CASE_STATUS_BLOCKED, actorUserId, actor, nowIso);
            case "unpick", "reopen" -> new SupportCaseState(SUPPORT_CASE_STATUS_PENDING, "", "", "", nowIso);
            default -> throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unsupported support case action.");
        };
    }

    private SupportCaseState assignedSupportCaseState(String status, String actorUserId, Users actor, String nowIso) {
        return new SupportCaseState(
                status,
                normalizeId(actorUserId),
                resolveUserName(actor, actorUserId),
                resolveUserInitials(actor, actorUserId),
                nowIso);
    }

    private void applySupportCaseState(Chat chat, SupportCaseState state) {
        chat.setChannelType(CHAT_CHANNEL_APP_SUPPORT);
        if (!StringUtils.hasText(normalizeId(chat.getOwnerId()))) {
            chat.setOwnerId(normalizeId(chat.getChatId()));
        }
        chat.setSupportCase(toSupportCaseRecord(state));
    }

    private String normalizeChatQuerySort(String sortValue, String secondaryFilterValue) {
        String normalizedSort = safeText(sortValue).toLowerCase(Locale.ROOT);
        if ("relevance".equals(normalizedSort)) {
            return normalizedSort;
        }
        if ("relevant".equalsIgnoreCase(safeText(secondaryFilterValue))) {
            return "relevance";
        }
        return "date";
    }

    private boolean resolveChatSortAscending(String sort, String sortDirectionValue) {
        String normalizedDirection = safeText(sortDirectionValue);
        if ("asc".equalsIgnoreCase(normalizedDirection)) {
            return true;
        }
        if ("desc".equalsIgnoreCase(normalizedDirection)) {
            return false;
        }
        return false;
    }

    private int normalizeChatPageLimit(Integer limitValue) {
        if (limitValue == null || limitValue.intValue() <= 0) {
            return 10;
        }
        return Math.min(100, limitValue.intValue());
    }

    private Criteria chatPageCriteria(
            String userId,
            String contextFilter,
            String rangeStartIso,
            String rangeEndIso,
            boolean supportCasesOnly,
            String supportCaseFilter) {
        List<Criteria> criteria = new ArrayList<>();
        criteria.add(Criteria.where("ownerUserId").is(normalizeId(userId)));
        String normalizedContext = normalizeChatContextFilter(contextFilter);
        if ("event".equals(normalizedContext)) {
            criteria.add(Criteria.where("channelType").is(CHAT_CHANNEL_MAIN_EVENT));
        } else if ("subEvent".equals(normalizedContext)) {
            criteria.add(Criteria.where("channelType").is(CHAT_CHANNEL_OPTIONAL_SUB_EVENT));
        } else if ("group".equals(normalizedContext)) {
            criteria.add(Criteria.where("channelType").is(CHAT_CHANNEL_GROUP_SUB_EVENT));
        } else if ("service".equals(normalizedContext)) {
            criteria.add(Criteria.where("channelType").is(CHAT_CHANNEL_SERVICE_EVENT));
        } else if ("appSupport".equals(normalizedContext)) {
            criteria.add(Criteria.where("channelType").in(CHAT_CHANNEL_APP_SUPPORT, CHAT_CHANNEL_SUPPORT_CASE));
        }
        if (supportCasesOnly) {
            criteria.add(Criteria.where("supportCase.status").exists(true));
            String normalizedSupportFilter = normalizeSupportCaseFilter(supportCaseFilter);
            if (!SUPPORT_CASE_FILTER_ALL.equals(normalizedSupportFilter)) {
                criteria.add(Criteria.where("supportCase.status").is(normalizedSupportFilter));
            }
        }
        String normalizedRangeStart = safeText(rangeStartIso);
        String normalizedRangeEnd = safeText(rangeEndIso);
        if (StringUtils.hasText(normalizedRangeStart) || StringUtils.hasText(normalizedRangeEnd)) {
            Criteria dateCriteria = Criteria.where("dateIso");
            if (StringUtils.hasText(normalizedRangeStart)) {
                dateCriteria = dateCriteria.gte(normalizedRangeStart);
            }
            if (StringUtils.hasText(normalizedRangeEnd)) {
                dateCriteria = dateCriteria.lte(normalizedRangeEnd);
            }
            criteria.add(dateCriteria);
        }
        return new Criteria().andOperator(criteria.toArray(Criteria[]::new));
    }

    private Sort chatPageSort(String sort, boolean ascending) {
        if ("relevance".equals(sort)) {
            Sort.Direction relevanceDirection = ascending ? Sort.Direction.ASC : Sort.Direction.DESC;
            return Sort.by(
                    new Sort.Order(relevanceDirection, "unread"),
                    new Sort.Order(Sort.Direction.DESC, "dateIso"),
                    new Sort.Order(Sort.Direction.ASC, "chatId"));
        }
        Sort.Direction dateDirection = ascending ? Sort.Direction.ASC : Sort.Direction.DESC;
        return Sort.by(
                new Sort.Order(dateDirection, "dateIso"),
                new Sort.Order(Sort.Direction.ASC, "chatId"));
    }

    private Document chatPageSortDocument(String sort, boolean ascending) {
        if ("relevance".equals(sort)) {
            return new Document()
                    .append("unread", ascending ? 1 : -1)
                    .append("dateIso", -1)
                    .append("id", 1);
        }
        return new Document()
                .append("dateIso", ascending ? 1 : -1)
                .append("id", 1);
    }

    private Document supportCaseSelectionMatchDocument(
            long rangeStartMs,
            long rangeEndMs,
            String supportCaseFilter) {
        List<Document> criteria = new ArrayList<>();
        String normalizedSupportFilter = normalizeSupportCaseFilter(supportCaseFilter);
        if (!SUPPORT_CASE_FILTER_ALL.equals(normalizedSupportFilter)) {
            criteria.add(new Document("supportCase.status", normalizedSupportFilter));
        }
        Document dateRange = new Document();
        String rangeStartIso = rangeStartIsoFromMillis(rangeStartMs);
        String rangeEndIso = rangeEndIsoFromMillis(rangeEndMs);
        if (StringUtils.hasText(rangeStartIso)) {
            dateRange.append("$gte", rangeStartIso);
        }
        if (StringUtils.hasText(rangeEndIso)) {
            dateRange.append("$lte", rangeEndIso);
        }
        if (!dateRange.isEmpty()) {
            criteria.add(new Document("dateIso", dateRange));
        }
        if (criteria.isEmpty()) {
            return new Document();
        }
        return criteria.size() == 1
                ? criteria.get(0)
                : new Document("$and", criteria);
    }

    private List<Document> aggregationDocuments(Object value) {
        if (!(value instanceof List<?> values)) {
            return List.of();
        }
        return values.stream()
                .filter(Document.class::isInstance)
                .map(Document.class::cast)
                .toList();
    }

    private long aggregationNumber(Object value) {
        return value instanceof Number number ? Math.max(0L, number.longValue()) : 0L;
    }

    private int parseChatCursorOffset(String cursor) {
        try {
            return Math.max(0, Integer.parseInt(safeText(cursor)));
        } catch (NumberFormatException ignored) {
            return 0;
        }
    }

    private int safePageTotal(long total) {
        return total >= Integer.MAX_VALUE ? Integer.MAX_VALUE : Math.max(0, (int) total);
    }

    private String rangeStartIsoFromMillis(long value) {
        return value == Long.MIN_VALUE ? null : Instant.ofEpochMilli(value).toString();
    }

    private String rangeEndIsoFromMillis(long value) {
        return value == Long.MAX_VALUE ? null : Instant.ofEpochMilli(value).toString();
    }

    private long sortableDate(String value) {
        String normalized = safeText(value);
        if (!StringUtils.hasText(normalized)) {
            return 0L;
        }
        try {
            return Instant.parse(normalized).toEpochMilli();
        } catch (Exception exception) {
            // Some Mongo seed dates are stored as ISO local date-times without a zone.
        }
        try {
            return OffsetDateTime.parse(normalized).toInstant().toEpochMilli();
        } catch (Exception exception) {
            // Fall through to local date-time parsing.
        }
        try {
            return LocalDateTime.parse(normalized, DateTimeFormatter.ISO_LOCAL_DATE_TIME)
                    .toInstant(ZoneOffset.UTC)
                    .toEpochMilli();
        } catch (Exception exception) {
            return 0L;
        }
    }

    private long parseIsoMillis(String value, long fallback) {
        if (!StringUtils.hasText(value)) {
            return fallback;
        }
        try {
            return Instant.parse(value.trim()).toEpochMilli();
        } catch (Exception exception) {
            return fallback;
        }
    }

    private String stableDeviceId(String firebaseToken) {
        return UUID.nameUUIDFromBytes(normalizeText(firebaseToken).getBytes()).toString();
    }

    private String buildMongoId(String ownerUserId, String chatId) {
        String stableKey = normalizeId(ownerUserId) + "|" + normalizeId(chatId);
        return "chat-owner-copy:" + UUID.nameUUIDFromBytes(stableKey.getBytes(StandardCharsets.UTF_8));
    }

    public record PublishedMainEventChatResult(String chatId, Set<String> createdOwnerUserIds) {
        public PublishedMainEventChatResult {
            createdOwnerUserIds = createdOwnerUserIds == null ? Set.of() : Set.copyOf(createdOwnerUserIds);
        }
    }

    private record MainEventChatDocumentsResult(String chatId, List<Chat> createdDocuments) {
    }

    private record InitialSystemMessageResult(ChatMessageDto message, boolean inserted) {
    }

    private record ChatMetricLookup(
            String channelType,
            String ownerId,
            String viewerUserId,
            ChatOwnerParts parts) {
    }

    private record MemberOwnerLookup(
            String ownerType,
            String ownerId) {
    }

    private record ChatOwnerParts(
            String eventId,
            String subEventId,
            String groupId) {
    }

    private record ChatReadUpdate(
            Chat viewerChat,
            List<String> readMessageIds,
            ChatReadAvatarDto reader,
            String readAtIso,
            Integer unread,
            boolean changed) {
    }

    private record ChatDocumentsSnapshot(String chatId, Chat viewerChat, List<Chat> chatDocuments) {
    }

    private record SupportCaseState(
            String status,
            String assigneeUserId,
            String assigneeName,
            String assigneeInitials,
            String updatedAtIso) {
    }
}
