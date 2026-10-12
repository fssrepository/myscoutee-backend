package com.raxim.myscoutee.domain.chat.service;

import static com.raxim.myscoutee.domain.chat.service.ChatRecordContext.*;
import static com.raxim.myscoutee.domain.chat.service.ChatActivityContext.*;

import java.time.Instant;
import java.util.*;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.BulkOperations;
import org.springframework.data.mongodb.core.query.*;
import com.raxim.myscoutee.domain.chat.api.EventConversations;
import com.raxim.myscoutee.domain.chat.api.CaseConversations;
import com.raxim.myscoutee.domain.chat.document.Chat;
import com.raxim.myscoutee.domain.chat.dto.ChatDtos.*;
import com.raxim.myscoutee.domain.chat.repository.ChatsRepository;
import com.raxim.myscoutee.domain.chat.service.ChatService.ChatCounterChange;
import com.raxim.myscoutee.domain.accounts.api.ProfileSummaries;
import com.raxim.myscoutee.domain.accounts.api.ProfileSummary;
import com.raxim.myscoutee.domain.events.api.EventOwnershipReads;
import com.raxim.myscoutee.domain.events.api.EventOwnership.Event;
import com.raxim.myscoutee.domain.events.api.EventOwnership.SubEvent;
import com.raxim.myscoutee.domain.events.api.MemberDirectory;
import com.raxim.myscoutee.domain.assets.api.AssetOwnershipReads;
import com.raxim.myscoutee.domain.assets.api.AssetOwnership.Asset;
import com.raxim.myscoutee.domain.groups.api.GroupDirectory;
import com.raxim.myscoutee.domain.groups.api.BaseGroups;
import com.raxim.myscoutee.domain.community.api.CaseParticipants;
import com.raxim.myscoutee.domain.community.api.AnnouncementDirectory;
import com.raxim.myscoutee.domain.community.dto.CaseConversation;
import com.raxim.myscoutee.domain.campaigns.api.CampaignCatalog;

/** Existing product-owned conversation creation; generic message/counter operations stay in ChatService. */
@Service
public class ResourceConversationService implements EventConversations, CaseConversations {
    private final ChatService chatService;
    private final ChatsRepository chatsRepository;
    private final MongoTemplate mongoTemplate;
    private final ProfileSummaries profileDirectory;
    private final MemberDirectory memberDirectory;
    private final EventOwnershipReads eventOwnership;
    private final AssetOwnershipReads assetOwnership;
    private final GroupDirectory groupDirectory;
    private final CaseParticipants cases;
    private final AnnouncementDirectory announcements;
    private final CampaignCatalog campaignCatalog;

    public ResourceConversationService(ChatService chatService, ChatsRepository chatsRepository,
            MongoTemplate mongoTemplate, ProfileSummaries profileDirectory, MemberDirectory memberDirectory,
            EventOwnershipReads eventOwnership, AssetOwnershipReads assetOwnership, GroupDirectory groupDirectory,
            CaseParticipants cases, AnnouncementDirectory announcements, CampaignCatalog campaignCatalog) {
        this.chatService = chatService; this.chatsRepository = chatsRepository; this.mongoTemplate = mongoTemplate;
        this.profileDirectory = profileDirectory; this.memberDirectory = memberDirectory;
        this.eventOwnership = eventOwnership; this.assetOwnership = assetOwnership; this.groupDirectory = groupDirectory;
        this.cases = cases; this.announcements = announcements; this.campaignCatalog = campaignCatalog;
    }

    @Override
    public ChatMessageDto postSystemMessage(String chatId, String text, String systemType) {
        return chatService.postSystemMessage(chatId, text, systemType);
    }

    @Override
    public ChatMessageDto ensureInitialSystemMessage(String chatId, String text, String systemType) {
        return chatService.ensureInitialSystemMessage(chatId, text, systemType);
    }

    public String ensureMainEventChat(com.raxim.myscoutee.domain.events.api.EventChatContext event, Collection<String> participantUserIds) {
        return ensureMainEventChatDocuments(event, participantUserIds).chatId();
    }

    public PublishedMainEventChatResult ensurePublishedMainEventChat(
            com.raxim.myscoutee.domain.events.api.EventChatContext event,
            Collection<String> participantUserIds) {
        MainEventChatDocumentsResult result = ensureMainEventChatDocuments(event, participantUserIds);
        Set<String> createdOwnerUserIds = result.createdDocuments().stream()
                .map(Chat::getOwnerUserId)
                .map(ChatRecordContext::normalizeId)
                .filter(StringUtils::hasText)
                .collect(java.util.stream.Collectors.toCollection(LinkedHashSet::new));
        return new PublishedMainEventChatResult(result.chatId(), createdOwnerUserIds);
    }

    private MainEventChatDocumentsResult ensureMainEventChatDocuments(
            com.raxim.myscoutee.domain.events.api.EventChatContext event,
            Collection<String> participantUserIds) {
        String eventId = normalizeId(event == null ? null : event.getSourceId());
        List<String> memberUserIds = participantUserIds == null
                ? List.of()
                : participantUserIds.stream()
                        .map(ChatRecordContext::normalizeId)
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
            Chat document = current == null ? new Chat() : chatService.copyChat(current);
            boolean contextWindowChanged = current != null
                    && (!Objects.equals(current.getContextStartAtIso(), event.getStartAtIso())
                            || !Objects.equals(current.getContextEndAtIso(), event.getEndAtIso()));
            document.setMongoId(current == null
                    ? chatService.buildMongoId(memberUserId, chatId)
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
            document.setContextStartAtIso(event.getStartAtIso());
            document.setContextEndAtIso(event.getEndAtIso());
            document.setChannelType(CHAT_CHANNEL_MAIN_EVENT);
            document.setOwnerId(eventId);
            document.setEventId(eventId);
            document.setOwnerStatus("A");
            document.setRevision(current == null
                    ? 1L
                    : contextWindowChanged
                            ? chatService.nextChatRevision(current)
                            : chatService.normalizeChatRevision(current.getRevision()));
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
            chatService.incrementStoredChatCounters(staleDocuments.stream()
                    .map(document -> new ChatCounterChange(document, -normalizeCount(document.getUnread())))
                    .toList());
        }
        chatService.evictChatOwnerReadCaches(documentsToSave);
        chatService.evictChatOwnerReadCaches(staleDocuments);

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
            chatService.evictChatOwnerReadCaches(chatDocuments);
        }
        return modifiedCount;
    }

    public ChatDto ensureServiceChat(ChatServiceEnsureRequestDto request, String requestedUserId) {
        String userId = chatService.requireResolvedUserId(requestedUserId);
        if (request == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Service chat request is required.");
        }
        String serviceContext = safeText(request.serviceContext()).toLowerCase(Locale.US);
        if ("campaign".equals(serviceContext)) return ensureCampaignChat(request, userId);
        if ("case".equals(serviceContext)) return ensureCaseChat(request, userId);
        if ("groupsupport".equals(serviceContext)) return ensureAnnouncementFeedbackChat(request, userId);
        if (!"event".equals(serviceContext) && !"asset".equals(serviceContext)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unsupported service chat context.");
        }
        String eventId = normalizeId(request.eventId());
        if (!StringUtils.hasText(eventId)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Event id is required.");
        }
        Event event = findServiceChatEvent(eventId);
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
            asset = findServiceChatAsset(assetId);
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
        ProfileSummary targetUser = StringUtils.hasText(targetUserId) ? chatService.findUser(targetUserId) : null;
        if (targetUser == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Service chat recipient not found.");
        }
        if (!"asset".equals(serviceContext)
                && StringUtils.hasText(requestedTargetUserId)
                && !targetUserId.equals(requestedTargetUserId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "The selected service chat recipient is not the resource owner.");
        }
        if (targetUserId.equals(userId)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "The resource owner cannot open a service chat with themselves.");
        }

        SubEvent contextSubEvent = findChatContextSubEvent(event, subEventId);
        String contextStartAtIso = firstNonBlank(
                contextSubEvent == null ? null : contextSubEvent.startAt(),
                event.getStartAtIso());
        String contextEndAtIso = firstNonBlank(
                contextSubEvent == null ? null : contextSubEvent.endAt(),
                event.getEndAtIso());

        List<Chat> chatDocuments = chatsRepository.findByChatId(chatId);
        if (chatDocuments.isEmpty()) {
            Chat baseChat = new Chat();
            baseChat.setMongoId(chatService.buildMongoId(userId, chatId));
            baseChat.setChatId(chatId);
            baseChat.setOwnerUserId(userId);
            baseChat.setAvatar(chatService.resolveUserInitials(targetUser, targetUserId));
            baseChat.setTitle(serviceChatTitle(request.title(), serviceContext, asset, event));
            baseChat.setLastMessage(serviceChatLastMessage(request.lastMessage(), serviceContext, asset, event));
            baseChat.setLastSenderId(targetUserId);
            baseChat.setMemberIds(List.of(userId, targetUserId));
            baseChat.setUnread(0);
            baseChat.setDateIso(Instant.now().toString());
            baseChat.setContextStartAtIso(contextStartAtIso);
            baseChat.setContextEndAtIso(contextEndAtIso);
            baseChat.setChannelType(CHAT_CHANNEL_SERVICE_EVENT);
            baseChat.setOwnerId(eventId);
            baseChat.setEventId(eventId);
            baseChat.setOwnerStatus(event.getStatus());
            baseChat.setSubEventId(StringUtils.hasText(subEventId) ? subEventId : null);
            chatsRepository.save(baseChat);
            chatDocuments = List.of(baseChat);
        } else {
            chatDocuments = reconcileServiceChatParticipants(
                    chatDocuments,
                    userId,
                    targetUserId,
                    chatService.resolveUserInitials(targetUser, targetUserId),
                    contextStartAtIso,
                    contextEndAtIso);
        }
        chatDocuments = chatService.ensureOwnerCopies(chatDocuments);
        Chat viewerChat = chatService.findOwnerChat(chatDocuments, userId);
        Chat responseChat = viewerChat == null ? chatDocuments.get(0) : viewerChat;
        return chatService.toChatDto(responseChat, chatService.chatMemberUsers(List.of(responseChat)));
    }

    private ChatDto ensureAnnouncementFeedbackChat(ChatServiceEnsureRequestDto request, String userId) {
        var a = announcements.find(normalizeId(request.announcementId())).orElse(null);
        ProfileSummary actor = chatService.findUser(userId);
        if (a == null || actor == null || !"published".equals(a.status()) || !a.communityId().equals(actor.getWorkspaceGroupId()))
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Announcement unavailable.");
        var group = groupDirectory.findById(a.communityId()).orElse(null);
        var roster = memberDirectory.findByOwnerTypeAndOwnerId("community", a.communityId());
        String account = firstNonBlank(actor.getAccountUserId(), userId);
        if (group == null || group.deleted() || group.awaitingOwner() || !roster.stream().anyMatch(m -> account.equals(m.getUserId()) && "accepted".equals(m.getStatus())))
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Announcement unavailable.");
        String adminId = "group:" + group.id() + ":" + group.ownerUserId();
        if (adminId.equals(userId) || chatService.findUser(adminId) == null
                || !roster.stream().anyMatch(m -> group.ownerUserId().equals(m.getUserId()) && "Admin".equals(m.getRole()) && "accepted".equals(m.getStatus())))
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Group manager unavailable.");
        String chatId = "c-moderation-group-" + userId;
        Chat viewer = chatService.findOwnerChat(syncResourceChat(chatId, CHAT_CHANNEL_GROUP_SUPPORT, null, group.name(), List.of(userId, adminId)), userId);
        return chatService.toChatDto(viewer, chatService.chatMemberUsers(List.of(viewer)));
    }

    private ChatDto ensureCampaignChat(ChatServiceEnsureRequestDto request, String userId) {
        ProfileSummary actor = chatService.findUser(userId);
        var contact = actor == null ? null : campaignCatalog.organizerContact(
                normalizeId(request.campaignId()), userId, actor.getWorkspaceGroupId());
        if (contact == null)
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Campaign unavailable.");
        if (!contact.positivelyRated())
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Rate the campaign before asking its organizer.");
        var campaign = contact.campaign();
        String chatId = "c-campaign-" + campaign.id() + "-" + userId;
        List<Chat> copies = syncResourceChat(chatId, "campaign", campaign.id(), campaign.title(),
                List.of(userId, campaign.ownerUserId()));
        Chat viewer = chatService.findOwnerChat(copies, userId);
        return chatService.toChatDto(viewer, chatService.chatMemberUsers(List.of(viewer)));
    }

    private ChatDto ensureCaseChat(ChatServiceEnsureRequestDto request, String userId) {
        CaseConversation serviceCase = cases.conversation(normalizeId(request.caseId())).orElse(null);
        if (!CaseChatAccessRestriction.caseChatAccess(serviceCase, chatService.findUser(userId), request.caseOfferId()))
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Case unavailable.");
        syncCaseChat(serviceCase);
        List<Chat> copies = chatsRepository.findByChatId(StringUtils.hasText(request.caseOfferId())
                ? "c-case-offer-" + serviceCase.id() + "-" + request.caseOfferId() : "c-case-" + serviceCase.id());
        Chat viewer = chatService.findOwnerChat(copies, userId);
        if (viewer == null) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Case unavailable.");
        return chatService.toChatDto(viewer, chatService.chatMemberUsers(List.of(viewer)));
    }

    /** Case and quotation groups share the existing Cases channel and membership lifecycle. */
    @Override public void synchronizeCase(CaseConversation serviceCase) { syncCaseChat(serviceCase); }
    public List<Chat> syncCaseChat(CaseConversation serviceCase) {
        var profiles = profileDirectory.findByWorkspaceGroupIdAndAccountUserIdIn(
                BaseGroups.COMMUNITY_BASE_ID, serviceCase.activeParticipantAccountIds());
        var byAccount = profiles.stream().collect(java.util.stream.Collectors.toMap(
                u -> StringUtils.hasText(u.getAccountUserId()) ? u.getAccountUserId() : u.getUserId(), ProfileSummary::getUserId, (a,b) -> a));
        java.util.function.Function<List<String>, List<String>> memberProfiles = ids -> ids.stream().map(byAccount::get).filter(Objects::nonNull).toList();
        var main = syncResourceChat("c-case-" + serviceCase.id(), "case", serviceCase.id(), serviceCase.title(), memberProfiles.apply(serviceCase.chatParticipantAccountIds()));
        for (var offer : serviceCase.offers()) {
            syncResourceChat("c-case-offer-" + serviceCase.id() + "-" + offer.id(), "case", serviceCase.id(),
                    serviceCase.title() + " · " + java.math.BigDecimal.valueOf(offer.amount()).stripTrailingZeros().toPlainString() + " " + offer.currency(),
                    memberProfiles.apply(serviceCase.offerChatParticipantAccountIds(offer.id())), offer.id());
        }
        return main;
    }

    private List<Chat> syncResourceChat(String chatId, String channel, String ownerId, String title, List<String> members) {
        return syncResourceChat(chatId, channel, ownerId, title, members, null);
    }
    private List<Chat> syncResourceChat(String chatId, String channel, String ownerId, String title, List<String> members, String caseOfferId) {
        List<Chat> existing = chatsRepository.findByChatId(chatId);
        List<Chat> saved = new ArrayList<>();
        for (String member : members) {
            Chat copy = chatService.findOwnerChat(existing, member);
            if (copy == null) {
                copy = new Chat(); copy.setMongoId(chatService.buildMongoId(member, chatId)); copy.setChatId(chatId);
                copy.setOwnerUserId(member); copy.setUnread(0); copy.setLastMessage(""); copy.setLastSenderId("");
                copy.setDateIso(Instant.now().toString()); copy.setAvatar("case".equals(channel) ? "C" : "W");
            }
            copy.setChannelType(channel); copy.setOwnerId(ownerId); copy.setTitle(title); copy.setCaseOfferId(caseOfferId);
            copy.setMemberIds(List.copyOf(members)); copy.setRevision(chatService.nextChatRevision(copy)); saved.add(copy);
        }
        if (!saved.isEmpty()) {
            BulkOperations writes = mongoTemplate.bulkOps(BulkOperations.BulkMode.UNORDERED, Chat.class);
            for (Chat copy : saved) writes.upsert(Query.query(Criteria.where("_id").is(copy.getMongoId())),
                    new Update().setOnInsert("id", chatId).setOnInsert("ownerUserId", copy.getOwnerUserId())
                            .setOnInsert("unread", 0).setOnInsert("lastMessage", "").setOnInsert("lastSenderId", "")
                            .setOnInsert("dateIso", copy.getDateIso()).setOnInsert("avatar", copy.getAvatar())
                            .set("channelType", channel).set("ownerId", ownerId).set("title", title).set("caseOfferId", caseOfferId)
                            .set("memberIds", members).inc("revision", 1));
            writes.execute();
        }
        List<Chat> removed = existing.stream().filter(c -> !members.contains(c.getOwnerUserId())).toList();
        if (!removed.isEmpty()) {
            chatsRepository.deleteAll(removed);
            chatService.incrementStoredChatCounters(removed.stream().map(c -> new ChatCounterChange(c, -normalizeCount(c.getUnread()))).toList());
        }
        chatService.evictChatOwnerReadCaches(saved); chatService.evictChatOwnerReadCaches(removed);
        return saved;
    }


    private Event findServiceChatEvent(String eventId) {
        return eventOwnership.findByIdOrSourceId(eventId);
    }

    private Asset findServiceChatAsset(String assetId) {
        return assetOwnership.findByIdOrAssetId(assetId);
    }

    private List<Chat> reconcileServiceChatParticipants(
            List<Chat> existingDocuments,
            String requesterUserId,
            String targetUserId,
            String targetAvatar,
            String contextStartAtIso,
            String contextEndAtIso) {
        List<String> memberUserIds = List.of(requesterUserId, targetUserId);
        List<Chat> activeDocuments = new ArrayList<>();
        List<Chat> staleDocuments = new ArrayList<>();
        List<Chat> changedDocuments = new ArrayList<>();
        for (Chat existing : existingDocuments == null ? List.<Chat>of() : existingDocuments) {
            if (existing == null) {
                continue;
            }
            if (!memberUserIds.contains(normalizeId(existing.getOwnerUserId()))) {
                staleDocuments.add(existing);
                continue;
            }
            Chat next = chatService.copyChat(existing);
            boolean changed = !memberUserIds.equals(existing.getMemberIds())
                    || !Objects.equals(existing.getAvatar(), targetAvatar)
                    || !Objects.equals(existing.getContextStartAtIso(), contextStartAtIso)
                    || !Objects.equals(existing.getContextEndAtIso(), contextEndAtIso);
            next.setMemberIds(new ArrayList<>(memberUserIds));
            next.setAvatar(targetAvatar);
            next.setContextStartAtIso(contextStartAtIso);
            next.setContextEndAtIso(contextEndAtIso);
            if (changed) {
                next.setRevision(chatService.nextChatRevision(existing));
                changedDocuments.add(next);
            }
            activeDocuments.add(next);
        }
        if (!changedDocuments.isEmpty()) {
            chatsRepository.saveAll(changedDocuments);
        }
        if (!staleDocuments.isEmpty()) {
            chatsRepository.deleteAll(staleDocuments);
            chatService.incrementStoredChatCounters(staleDocuments.stream()
                    .map(document -> new ChatCounterChange(document, -normalizeCount(document.getUnread())))
                    .toList());
        }
        chatService.evictChatOwnerReadCaches(changedDocuments);
        chatService.evictChatOwnerReadCaches(staleDocuments);
        return activeDocuments;
    }

    private String serviceChatTitle(
            String requestedTitle,
            String serviceContext,
            Asset asset,
            Event event) {
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
            Event event) {
        String lastMessage = safeText(requestedLastMessage);
        if (StringUtils.hasText(lastMessage)) {
            return lastMessage;
        }
        String subject = "asset".equals(serviceContext)
                ? safeText(asset == null ? null : asset.getTitle())
                : safeText(event == null ? null : event.getTitle());
        return "Service chat for " + (StringUtils.hasText(subject) ? subject : serviceContext) + ".";
    }

    private record MainEventChatDocumentsResult(String chatId, List<Chat> createdDocuments) {
    }

}
