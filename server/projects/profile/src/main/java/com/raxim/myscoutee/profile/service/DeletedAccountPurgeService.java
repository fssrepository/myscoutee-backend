package com.raxim.myscoutee.profile.service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Collection;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.regex.Pattern;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import org.bson.Document;
import com.raxim.myscoutee.profile.data.document.ActivityChat;
import com.raxim.myscoutee.profile.data.document.ActivityChat.ChatAvatarRecord;
import com.raxim.myscoutee.profile.data.document.ActivityChat.ChatMessageAttachmentRecord;
import com.raxim.myscoutee.profile.data.document.ActivityChat.ChatMessageReactionRecord;
import com.raxim.myscoutee.profile.data.document.ActivityChat.ChatMessageRecord;
import com.raxim.myscoutee.profile.data.document.ActivityChat.ChatMessageReplyRecord;
import com.raxim.myscoutee.profile.data.document.ActivityChat.ChatReadAvatarRecord;
import com.raxim.myscoutee.profile.data.document.ActivityEvent;
import com.raxim.myscoutee.profile.data.document.ActivityMember;
import com.raxim.myscoutee.profile.data.document.ActivitySubEventResource;
import com.raxim.myscoutee.profile.data.document.Asset;
import com.raxim.myscoutee.profile.data.document.IdeaPost;
import com.raxim.myscoutee.profile.data.document.Users;
import com.raxim.myscoutee.profile.repository.ActivityChatsRepository;
import com.raxim.myscoutee.profile.repository.ActivityEventsRepository;
import com.raxim.myscoutee.profile.repository.ActivityMembersRepository;
import com.raxim.myscoutee.profile.repository.AssetsRepository;
import com.raxim.myscoutee.profile.repository.UsersRepository;

@Service
public class DeletedAccountPurgeService {
    private static final int DELETE_GRACE_DAYS = 30;
    private static final String OWNER_TYPE_EVENT = "event";
    private static final String OWNER_TYPE_ASSET = "asset";

    private final UsersRepository usersRepository;
    private final ActivityChatsRepository activityChatsRepository;
    private final ActivityEventsRepository activityEventsRepository;
    private final AssetsRepository assetsRepository;
    private final ActivityMembersRepository activityMembersRepository;
    private final MediaStorageService mediaStorageService;
    private final MongoTemplate mongoTemplate;

    public DeletedAccountPurgeService(
            UsersRepository usersRepository,
            ActivityChatsRepository activityChatsRepository,
            ActivityEventsRepository activityEventsRepository,
            AssetsRepository assetsRepository,
            ActivityMembersRepository activityMembersRepository,
            MediaStorageService mediaStorageService,
            MongoTemplate mongoTemplate) {
        this.usersRepository = usersRepository;
        this.activityChatsRepository = activityChatsRepository;
        this.activityEventsRepository = activityEventsRepository;
        this.assetsRepository = assetsRepository;
        this.activityMembersRepository = activityMembersRepository;
        this.mediaStorageService = mediaStorageService;
        this.mongoTemplate = mongoTemplate;
    }

    @Scheduled(fixedDelayString = "${users.deleted-account-purge-delay-ms:3600000}")
    public void purgeExpiredDeletedAccounts() {
        String purgeBeforeIso = Instant.now().minus(DELETE_GRACE_DAYS, ChronoUnit.DAYS).toString();
        List<Users> users = usersRepository.findByProfileStatusAndDeletedAtIsoLessThanEqual("deleted", purgeBeforeIso);
        for (Users user : users) {
            purgeUser(user);
        }
    }

    private void purgeUser(Users user) {
        String userId = user == null ? "" : safeText(user.getId());
        if (!StringUtils.hasText(userId)) {
            return;
        }
        purgeUserMedia(user);
        List<String> ownedEventIds = purgeOwnedEvents(userId);
        List<String> ownedAssetIds = purgeOwnedAssets(userId);
        purgeActivityMemberships(userId);
        purgeRemainingAssetRequests(userId);
        purgeActivityResources(userId, ownedEventIds, ownedAssetIds);
        purgeIdeaPosts(userId);
        purgeUserChatActivity(userId);
        purgeUserReferencedDocuments(userId);
        usersRepository.delete(user);
    }

    private void purgeUserMedia(Users user) {
        if (user == null) {
            return;
        }
        for (String imageUrl : user.getImages() == null ? List.<String>of() : user.getImages()) {
            mediaStorageService.deletePublicObject(imageUrl);
        }
    }

    private List<String> purgeOwnedEvents(String userId) {
        List<ActivityEvent> ownedEvents = activityEventsRepository.findByCreatorUserId(userId);
        if (ownedEvents.isEmpty()) {
            return List.of();
        }
        List<String> sourceIds = ownedEvents.stream()
                .map(ActivityEvent::getSourceId)
                .map(this::safeText)
                .filter(StringUtils::hasText)
                .distinct()
                .toList();
        for (ActivityEvent event : ownedEvents) {
            if (event != null) {
                mediaStorageService.deletePublicObject(event.getImageUrl());
            }
        }
        if (!sourceIds.isEmpty()) {
            activityMembersRepository.deleteAll(activityMembersRepository.findByOwnerTypeAndOwnerIdIn(OWNER_TYPE_EVENT, sourceIds));
        }
        activityEventsRepository.deleteAll(ownedEvents);
        return sourceIds;
    }

    private List<String> purgeOwnedAssets(String userId) {
        List<Asset> ownedAssets = assetsRepository.findByOwnerUserId(userId);
        if (ownedAssets.isEmpty()) {
            return List.of();
        }
        List<String> assetIds = ownedAssets.stream()
                .map(Asset::getAssetId)
                .map(this::safeText)
                .filter(StringUtils::hasText)
                .distinct()
                .toList();
        for (Asset asset : ownedAssets) {
            if (asset != null) {
                mediaStorageService.deletePublicObject(asset.getImageUrl());
            }
        }
        if (!assetIds.isEmpty()) {
            activityMembersRepository.deleteAll(activityMembersRepository.findByOwnerTypeAndOwnerIdIn(OWNER_TYPE_ASSET, assetIds));
        }
        assetsRepository.deleteAll(ownedAssets);
        return assetIds;
    }

    private void purgeActivityMemberships(String userId) {
        Map<String, ActivityMember> membershipsByKey = new LinkedHashMap<>();
        addMemberships(membershipsByKey, activityMembersRepository.findByOwnerTypeAndUserId(OWNER_TYPE_EVENT, userId));
        addMemberships(membershipsByKey, activityMembersRepository.findByOwnerTypeAndUserId(OWNER_TYPE_ASSET, userId));
        if (!membershipsByKey.isEmpty()) {
            activityMembersRepository.deleteAll(membershipsByKey.values());
        }
    }

    private void addMemberships(Map<String, ActivityMember> membershipsByKey, List<ActivityMember> memberships) {
        for (ActivityMember membership : memberships == null ? List.<ActivityMember>of() : memberships) {
            if (membership == null) {
                continue;
            }
            String key = safeText(membership.getId());
            if (!StringUtils.hasText(key)) {
                key = safeText(membership.getOwnerType()) + ":" + safeText(membership.getOwnerId()) + ":" + safeText(membership.getUserId());
            }
            if (StringUtils.hasText(key)) {
                membershipsByKey.putIfAbsent(key, membership);
            }
        }
    }

    private void purgeRemainingAssetRequests(String userId) {
        List<Asset> assetsWithRequests = mongoTemplate.find(
                Query.query(Criteria.where("requests.userId").is(userId)),
                Asset.class);
        List<Asset> changedAssets = new ArrayList<>();
        for (Asset asset : assetsWithRequests == null ? List.<Asset>of() : assetsWithRequests) {
            if (asset == null || asset.getRequests() == null || asset.getRequests().isEmpty()) {
                continue;
            }
            List<Asset.AssetRequestRecord> retainedRequests = asset.getRequests().stream()
                    .filter(request -> request != null && !userId.equals(safeText(request.userId())))
                    .toList();
            if (retainedRequests.size() != asset.getRequests().size()) {
                asset.setRequests(new ArrayList<>(retainedRequests));
                changedAssets.add(asset);
            }
        }
        if (!changedAssets.isEmpty()) {
            assetsRepository.saveAll(changedAssets);
        }
    }

    private void purgeActivityResources(String userId, Collection<String> ownedEventIds, Collection<String> ownedAssetIds) {
        deleteDocumentsByAnyField(
                "activityResources",
                List.of("assetOwnerUserId", "createdUser", "updatedUser"),
                userId);
        if (ownedEventIds != null && !ownedEventIds.isEmpty()) {
            mongoTemplate.remove(Query.query(Criteria.where("ownerId").in(ownedEventIds)), "activityResources");
        }
        List<ActivitySubEventResource> resources = mongoTemplate.find(
                Query.query(new Criteria().orOperator(
                        Criteria.where("supplyContributionEntriesByAssetId").exists(true),
                        Criteria.where("assetSettingsByType").exists(true),
                        Criteria.where("assetAssignmentIds").exists(true))),
                ActivitySubEventResource.class);
        List<ActivitySubEventResource> changedResources = new ArrayList<>();
        LinkedHashSet<String> ownedAssetIdSet = new LinkedHashSet<>(ownedAssetIds == null ? List.<String>of() : ownedAssetIds);
        for (ActivitySubEventResource resource : resources == null ? List.<ActivitySubEventResource>of() : resources) {
            if (resource == null) {
                continue;
            }
            boolean changed = removeSupplyContributionsByUser(resource, userId);
            changed = removeSettingsByUser(resource, userId) || changed;
            if (!ownedAssetIdSet.isEmpty()) {
                changed = removeOwnedAssetReferences(resource, ownedAssetIdSet) || changed;
            }
            if (changed) {
                changedResources.add(resource);
            }
        }
        if (!changedResources.isEmpty()) {
            for (ActivitySubEventResource resource : changedResources) {
                mongoTemplate.save(resource);
            }
        }
    }

    private boolean removeSupplyContributionsByUser(ActivitySubEventResource resource, String userId) {
        Map<String, List<ActivitySubEventResource.SubEventSupplyContributionEntryRecord>> entriesByAssetId =
                resource.getSupplyContributionEntriesByAssetId();
        if (entriesByAssetId == null || entriesByAssetId.isEmpty()) {
            return false;
        }
        boolean changed = false;
        Map<String, List<ActivitySubEventResource.SubEventSupplyContributionEntryRecord>> next = new LinkedHashMap<>();
        for (Map.Entry<String, List<ActivitySubEventResource.SubEventSupplyContributionEntryRecord>> entry : entriesByAssetId.entrySet()) {
            List<ActivitySubEventResource.SubEventSupplyContributionEntryRecord> retained = (entry.getValue() == null
                    ? List.<ActivitySubEventResource.SubEventSupplyContributionEntryRecord>of()
                    : entry.getValue()).stream()
                    .filter(item -> item != null && !userId.equals(safeText(item.userId())))
                    .toList();
            if (retained.size() != (entry.getValue() == null ? 0 : entry.getValue().size())) {
                changed = true;
            }
            if (!retained.isEmpty()) {
                next.put(entry.getKey(), new ArrayList<>(retained));
            } else if (entry.getValue() != null && !entry.getValue().isEmpty()) {
                changed = true;
            }
        }
        if (changed) {
            resource.setSupplyContributionEntriesByAssetId(next);
        }
        return changed;
    }

    private boolean removeSettingsByUser(ActivitySubEventResource resource, String userId) {
        Map<String, Map<String, ActivitySubEventResource.SubEventAssignedAssetSettingsRecord>> settingsByType =
                resource.getAssetSettingsByType();
        if (settingsByType == null || settingsByType.isEmpty()) {
            return false;
        }
        boolean changed = false;
        Map<String, Map<String, ActivitySubEventResource.SubEventAssignedAssetSettingsRecord>> next = new LinkedHashMap<>();
        for (Map.Entry<String, Map<String, ActivitySubEventResource.SubEventAssignedAssetSettingsRecord>> typeEntry : settingsByType.entrySet()) {
            Map<String, ActivitySubEventResource.SubEventAssignedAssetSettingsRecord> retainedByAsset = new LinkedHashMap<>();
            for (Map.Entry<String, ActivitySubEventResource.SubEventAssignedAssetSettingsRecord> assetEntry
                    : (typeEntry.getValue() == null ? Map.<String, ActivitySubEventResource.SubEventAssignedAssetSettingsRecord>of() : typeEntry.getValue()).entrySet()) {
                ActivitySubEventResource.SubEventAssignedAssetSettingsRecord settings = assetEntry.getValue();
                if (settings != null && userId.equals(safeText(settings.addedByUserId()))) {
                    changed = true;
                    continue;
                }
                retainedByAsset.put(assetEntry.getKey(), settings);
            }
            if (!retainedByAsset.isEmpty()) {
                next.put(typeEntry.getKey(), retainedByAsset);
            } else if (typeEntry.getValue() != null && !typeEntry.getValue().isEmpty()) {
                changed = true;
            }
        }
        if (changed) {
            resource.setAssetSettingsByType(next);
        }
        return changed;
    }

    private boolean removeOwnedAssetReferences(ActivitySubEventResource resource, Collection<String> ownedAssetIds) {
        Map<String, List<String>> assignments = resource.getAssetAssignmentIds();
        if (assignments == null || assignments.isEmpty()) {
            return false;
        }
        boolean changed = false;
        Map<String, List<String>> next = new LinkedHashMap<>();
        for (Map.Entry<String, List<String>> entry : assignments.entrySet()) {
            List<String> retained = (entry.getValue() == null ? List.<String>of() : entry.getValue()).stream()
                    .filter(assetId -> !ownedAssetIds.contains(safeText(assetId)))
                    .toList();
            if (retained.size() != (entry.getValue() == null ? 0 : entry.getValue().size())) {
                changed = true;
            }
            if (!retained.isEmpty()) {
                next.put(entry.getKey(), new ArrayList<>(retained));
            }
        }
        if (changed) {
            resource.setAssetAssignmentIds(next);
        }
        return changed;
    }

    private void purgeIdeaPosts(String userId) {
        List<IdeaPost> posts = mongoTemplate.find(
                Query.query(new Criteria().orOperator(
                        Criteria.where("createdUser").is(userId),
                        Criteria.where("updatedUser").is(userId),
                        Criteria.where("trashedByUserId").is(userId))),
                IdeaPost.class);
        for (IdeaPost post : posts == null ? List.<IdeaPost>of() : posts) {
            if (post == null) {
                continue;
            }
            mediaStorageService.deletePublicObject(post.getImageUrl());
            for (String imageUrl : post.getImageUrls() == null ? List.<String>of() : post.getImageUrls()) {
                mediaStorageService.deletePublicObject(imageUrl);
            }
        }
        if (posts != null && !posts.isEmpty()) {
            mongoTemplate.remove(Query.query(Criteria.where("_id").in(posts.stream().map(IdeaPost::getId).toList())), IdeaPost.class);
        }
    }

    private void purgeUserReferencedDocuments(String userId) {
        deleteDocumentsByAnyField("userRates", List.of("ownerUserId", "relatedUserId", "secondaryRelatedUserId", "bridgeUserId", "createdUser", "updatedUser"), userId);
        deleteDocumentsByAnyField("userAffinityEdges", List.of("leftUserId", "rightUserId"), userId);
        deleteDocumentsByAnyField("userExperienceProfiles", List.of("userId"), userId);
        deleteDocumentsByAnyField("userFilterPreferences", List.of("userId", "createdUser", "updatedUser"), userId);
        deleteDocumentsByAnyField("privacyConsents", List.of("userId"), userId);
        deleteDocumentsByAnyField("userFeedback", List.of("userId", "createdUser", "updatedUser"), userId);
        deleteDocumentsByAnyField("userReports", List.of("userId", "targetUserId", "createdUser", "updatedUser"), userId);
        deleteDocumentsByAnyField("userSessionActions", List.of("userId", "createdUser", "updatedUser"), userId);
        deleteDocumentsByAnyField("payments", List.of("userId"), userId);
        deleteDocumentsByAnyField("scheduledMessageTasks", List.of("userId", "createdUser", "updatedUser"), userId);
        deleteDocumentsByAnyField("scheduledMessageDeliveries", List.of("userId", "createdUser"), userId);
        deleteDocumentsByAnyField("emailOutbox", List.of("userId", "createdUser", "updatedUser"), userId);
        deleteDocumentsByAnyField("notificationOutbox", List.of("recipientUserIds", "createdUser", "updatedUser"), userId);
        deleteDocumentsByAnyField("shareTokens", List.of("ownerUserId"), userId);
        deleteDocumentsByAnyField("eventFeedbackAnswers", List.of("viewerUserId", "targetUserId", "createdUser", "updatedUser"), userId);
        deleteDocumentsByAnyField("eventFeedbackStates", List.of("viewerUserId", "createdUser", "updatedUser"), userId);
        deleteDocumentsByAnyField("affinityRecomputeTasks", List.of("targetId", "createdUser", "updatedUser"), userId);
    }

    private void deleteDocumentsByAnyField(String collectionName, List<String> fields, String userId) {
        if (!StringUtils.hasText(collectionName) || fields == null || fields.isEmpty() || !StringUtils.hasText(userId)) {
            return;
        }
        List<Criteria> criteria = fields.stream()
                .filter(StringUtils::hasText)
                .map(field -> Criteria.where(field).is(userId))
                .toList();
        if (criteria.isEmpty()) {
            return;
        }
        mongoTemplate.remove(Query.query(new Criteria().orOperator(criteria.toArray(Criteria[]::new))), collectionName);
    }

    private void purgeUserChatActivity(String userId) {
        Map<String, ActivityChat> chatsByKey = new LinkedHashMap<>();
        addChats(chatsByKey, activityChatsRepository.findByMemberIdsContaining(userId));
        addChats(chatsByKey, activityChatsRepository.findByMessageSenderUserId(userId));
        addChats(chatsByKey, activityChatsRepository.findByMessageReadByUserId(userId));
        addChats(chatsByKey, activityChatsRepository.findByMessageReactionUserId(userId));
        addChats(chatsByKey, activityChatsRepository.findByPollAttachmentDescriptionMatching(pollVoteUserPattern(userId)));
        if (chatsByKey.isEmpty()) {
            return;
        }

        String purgeAtIso = Instant.now().toString();
        List<ActivityChat> changedChats = new ArrayList<>();
        for (ActivityChat chat : chatsByKey.values()) {
            if (chat == null) {
                continue;
            }
            Set<String> purgedMessageIds = collectSentMessageIds(chat, userId);
            boolean changed = removeMember(chat, userId);
            for (ChatMessageRecord message : chat.getMessages() == null ? List.<ChatMessageRecord>of() : chat.getMessages()) {
                if (message == null) {
                    continue;
                }
                boolean sentByUser = isSentByUser(message, userId);
                if (sentByUser) {
                    purgeMessageMedia(message);
                    scrubSentMessage(message, userId, purgeAtIso);
                    changed = true;
                }
                changed = removeReadsByUser(message, userId) || changed;
                changed = removeReactionsByUser(message, userId) || changed;
                changed = removePollVotesByUser(message, userId) || changed;
                changed = scrubReplyToPurgedMessage(message, purgedMessageIds) || changed;
                changed = clearPinByUser(message, userId) || changed;
                if (userId.equals(safeText(message.getDeletedByUserId()))) {
                    message.setDeletedByName("Deleted user");
                    changed = true;
                }
            }
            if (changed) {
                refreshChatSummary(chat);
                changedChats.add(chat);
            }
        }
        if (!changedChats.isEmpty()) {
            activityChatsRepository.saveAll(changedChats);
        }
    }

    private void addChats(Map<String, ActivityChat> chatsByKey, List<ActivityChat> chats) {
        for (ActivityChat chat : chats == null ? List.<ActivityChat>of() : chats) {
            if (chat == null) {
                continue;
            }
            String key = safeText(chat.getMongoId());
            if (!StringUtils.hasText(key)) {
                key = safeText(chat.getOwnerUserId()) + ":" + safeText(chat.getChatId());
            }
            if (StringUtils.hasText(key)) {
                chatsByKey.putIfAbsent(key, chat);
            }
        }
    }

    private Set<String> collectSentMessageIds(ActivityChat chat, String userId) {
        Set<String> ids = new LinkedHashSet<>();
        for (ChatMessageRecord message : chat == null || chat.getMessages() == null ? List.<ChatMessageRecord>of() : chat.getMessages()) {
            String messageId = safeText(message == null ? null : message.getId());
            if (StringUtils.hasText(messageId) && isSentByUser(message, userId)) {
                ids.add(messageId);
            }
        }
        return ids;
    }

    private boolean removeMember(ActivityChat chat, String userId) {
        List<String> members = chat.getMemberIds() == null ? List.of() : chat.getMemberIds();
        List<String> retained = members.stream()
                .filter(memberId -> !userId.equals(safeText(memberId)))
                .toList();
        if (retained.size() == members.size()) {
            return false;
        }
        chat.setMemberIds(new ArrayList<>(retained));
        return true;
    }

    private boolean isSentByUser(ChatMessageRecord message, String userId) {
        ChatAvatarRecord senderAvatar = message == null ? null : message.getSenderAvatar();
        return senderAvatar != null && userId.equals(safeText(senderAvatar.getId()));
    }

    private void purgeMessageMedia(ChatMessageRecord message) {
        for (ChatMessageAttachmentRecord attachment : message.getAttachments() == null ? List.<ChatMessageAttachmentRecord>of() : message.getAttachments()) {
            if (attachment == null) {
                continue;
            }
            String type = safeText(attachment.getType()).toLowerCase();
            if ("voice".equals(type) || "image".equals(type)) {
                mediaStorageService.deletePublicObject(attachment.getUrl());
                mediaStorageService.deletePublicObject(attachment.getPreviewUrl());
            }
        }
    }

    private void scrubSentMessage(ChatMessageRecord message, String userId, String purgeAtIso) {
        message.setSender("Deleted user");
        ChatAvatarRecord senderAvatar = message.getSenderAvatar();
        if (senderAvatar != null) {
            senderAvatar.setInitials("DU");
            senderAvatar.setGender("deleted");
        }
        message.setText("");
        message.setAttachments(new ArrayList<>());
        message.setReadBy(new ArrayList<>());
        message.setReactions(new ArrayList<>());
        message.setEditedAtIso(null);
        message.setPinnedAtIso(null);
        message.setPinnedByUserId(null);
        if (!StringUtils.hasText(message.getDeletedAtIso())) {
            message.setDeletedAtIso(purgeAtIso);
            message.setDeletedByUserId(userId);
        }
        message.setDeletedByName("Deleted user");
    }

    private boolean removeReadsByUser(ChatMessageRecord message, String userId) {
        List<ChatReadAvatarRecord> readBy = message.getReadBy() == null ? List.of() : message.getReadBy();
        List<ChatReadAvatarRecord> retained = readBy.stream()
                .filter(reader -> reader != null && !userId.equals(safeText(reader.getId())))
                .toList();
        if (retained.size() == readBy.size()) {
            return false;
        }
        message.setReadBy(new ArrayList<>(retained));
        return true;
    }

    private boolean removeReactionsByUser(ChatMessageRecord message, String userId) {
        List<ChatMessageReactionRecord> reactions = message.getReactions() == null ? List.of() : message.getReactions();
        List<ChatMessageReactionRecord> retained = reactions.stream()
                .filter(reaction -> reaction != null && !userId.equals(safeText(reaction.getUserId())))
                .toList();
        if (retained.size() == reactions.size()) {
            return false;
        }
        message.setReactions(new ArrayList<>(retained));
        return true;
    }

    private boolean removePollVotesByUser(ChatMessageRecord message, String userId) {
        boolean changed = false;
        for (ChatMessageAttachmentRecord attachment : message.getAttachments() == null ? List.<ChatMessageAttachmentRecord>of() : message.getAttachments()) {
            if (attachment == null || !"poll".equalsIgnoreCase(safeText(attachment.getType()))) {
                continue;
            }
            String nextDescription = removePollVotes(attachment.getDescription(), userId);
            if (nextDescription != null && !Objects.equals(safeText(attachment.getDescription()), nextDescription)) {
                attachment.setDescription(nextDescription);
                changed = true;
            }
        }
        return changed;
    }

    private String removePollVotes(String description, String userId) {
        String normalizedDescription = safeText(description);
        if (!StringUtils.hasText(normalizedDescription) || !normalizedDescription.contains(userId)) {
            return null;
        }
        try {
            Document root = Document.parse(normalizedDescription);
            Object optionsValue = root.get("options");
            if (!(optionsValue instanceof List<?> optionNodes)) {
                return null;
            }
            boolean changed = false;
            for (Object option : optionNodes) {
                if (!(option instanceof Document optionDocument)) {
                    continue;
                }
                Object votesValue = optionDocument.get("votes");
                if (!(votesValue instanceof List<?> voteNodes)) {
                    continue;
                }
                List<Object> mutableVotes = new ArrayList<>(voteNodes);
                int previousSize = mutableVotes.size();
                mutableVotes.removeIf(vote -> vote instanceof Document voteDocument
                        && userId.equals(safeText(Objects.toString(voteDocument.get("userId"), ""))));
                if (mutableVotes.size() != previousSize) {
                    optionDocument.put("votes", mutableVotes);
                    changed = true;
                }
            }
            return changed ? root.toJson() : null;
        } catch (Exception ignored) {
            return null;
        }
    }

    private boolean scrubReplyToPurgedMessage(ChatMessageRecord message, Set<String> purgedMessageIds) {
        ChatMessageReplyRecord replyTo = message.getReplyTo();
        if (replyTo == null || !purgedMessageIds.contains(safeText(replyTo.getId()))) {
            return false;
        }
        replyTo.setSender("Deleted user");
        replyTo.setText("Message unavailable");
        return true;
    }

    private boolean clearPinByUser(ChatMessageRecord message, String userId) {
        if (!userId.equals(safeText(message.getPinnedByUserId()))) {
            return false;
        }
        message.setPinnedAtIso(null);
        message.setPinnedByUserId(null);
        return true;
    }

    private void refreshChatSummary(ActivityChat chat) {
        ChatMessageRecord latest = latestMessage(chat.getMessages());
        if (latest == null) {
            chat.setLastMessage("");
            chat.setLastSenderId("");
            return;
        }
        ChatAvatarRecord senderAvatar = latest.getSenderAvatar();
        chat.setLastSenderId(senderAvatar == null ? "" : safeText(senderAvatar.getId()));
        chat.setLastMessage(messageSummary(latest));
    }

    private ChatMessageRecord latestMessage(List<ChatMessageRecord> messages) {
        return (messages == null ? List.<ChatMessageRecord>of() : messages).stream()
                .filter(Objects::nonNull)
                .reduce((first, second) -> second)
                .orElse(null);
    }

    private String messageSummary(ChatMessageRecord message) {
        if (StringUtils.hasText(message.getDeletedAtIso())) {
            return "Deleted a message";
        }
        String text = safeText(message.getText());
        if (StringUtils.hasText(text)) {
            return text;
        }
        ChatMessageAttachmentRecord attachment = message.getAttachments() == null || message.getAttachments().isEmpty()
                ? null
                : message.getAttachments().get(0);
        if (attachment == null) {
            return "";
        }
        return switch (safeText(attachment.getType()).toLowerCase()) {
            case "image" -> "Sent an image";
            case "event" -> "Shared an event";
            case "asset" -> "Shared an asset";
            case "voice" -> "Sent a voice clip";
            case "poll" -> "Created a poll";
            case "link" -> "Shared a link";
            default -> StringUtils.hasText(attachment.getTitle()) ? safeText(attachment.getTitle()) : "Shared an attachment";
        };
    }

    private String pollVoteUserPattern(String userId) {
        return "\\\"userId\\\"\\s*:\\s*\\\"" + Pattern.quote(userId) + "\\\"";
    }

    private String safeText(String value) {
        return value == null ? "" : value.trim();
    }
}
