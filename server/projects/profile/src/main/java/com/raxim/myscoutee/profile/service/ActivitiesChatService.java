package com.raxim.myscoutee.profile.service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Comparator;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.raxim.myscoutee.common.config.properties.ConfigProperties;
import com.raxim.myscoutee.profile.data.document.mongo.DBMessage;
import com.raxim.myscoutee.profile.data.document.mongo.Event;
import com.raxim.myscoutee.profile.data.document.mongo.Member;
import com.raxim.myscoutee.profile.data.document.mongo.Profile;
import com.raxim.myscoutee.profile.data.dto.chat.ActivitiesChatMessageDto;
import com.raxim.myscoutee.profile.data.dto.chat.ActivitiesChatSummaryDto;
import com.raxim.myscoutee.profile.data.dto.chat.ChatStreamEvent;
import com.raxim.myscoutee.profile.repository.mongo.EventRepository;
import com.raxim.myscoutee.profile.repository.mongo.MessageRepository;
import com.raxim.myscoutee.profile.repository.mongo.ProfileRepository;

@Service
public class ActivitiesChatService {
    private static final int MAX_CHAT_LIST_SIZE = 40;

    private final EventRepository eventRepository;
    private final MessageRepository messageRepository;
    private final ProfileRepository profileRepository;
    private final ConfigProperties configProperties;
    private final ChatStreamPublisher chatStreamPublisher;

    public ActivitiesChatService(EventRepository eventRepository,
            MessageRepository messageRepository,
            ProfileRepository profileRepository,
            ConfigProperties configProperties,
            ChatStreamPublisher chatStreamPublisher) {
        this.eventRepository = eventRepository;
        this.messageRepository = messageRepository;
        this.profileRepository = profileRepository;
        this.configProperties = configProperties;
        this.chatStreamPublisher = chatStreamPublisher;
    }

    public Profile resolveActorProfile(Profile authenticatedProfile, String requestedFrontendUserId) {
        if (configProperties.isFirebaseEnabled()) {
            return authenticatedProfile;
        }
        UUID requestedProfileId = DevChatSeedData.findProfileIdForFrontendUser(requestedFrontendUserId);
        if (requestedProfileId == null) {
            return authenticatedProfile;
        }
        return profileRepository.findById(requestedProfileId).orElse(authenticatedProfile);
    }

    public List<ActivitiesChatSummaryDto> getChats(Profile viewerProfile) {
        UUID viewerProfileId = requireProfileId(viewerProfile);
        String viewerFrontendUserId = DevChatSeedData.frontendUserId(viewerProfileId);
        return eventRepository.findAll().stream()
                .filter(event -> event.getId() != null)
                .filter(event -> isVisibleChat(event, viewerProfileId, viewerFrontendUserId))
                .map(event -> toChatSummary(event, viewerProfileId, viewerFrontendUserId))
                .sorted(Comparator.comparing(this::summarySortInstant, Comparator.nullsLast(Instant::compareTo)).reversed())
                .limit(MAX_CHAT_LIST_SIZE)
                .toList();
    }

    public List<ActivitiesChatMessageDto> getChatMessages(String chatId, Profile viewerProfile) {
        Event event = requireAccessibleEvent(chatId, viewerProfile);
        UUID viewerProfileId = requireProfileId(viewerProfile);
        return messageRepository.findByEventId(event.getId()).stream()
                .filter(this::isChatMessage)
                .sorted(Comparator.comparing(DBMessage::getCreatedDate,
                        Comparator.nullsLast(LocalDateTime::compareTo)))
                .map(message -> toChatMessage(message, viewerProfileId))
                .toList();
    }

    public ActivitiesChatMessageDto sendChatMessage(String chatId, Profile senderProfile, String text) {
        Event event = requireAccessibleEvent(chatId, senderProfile);
        String normalizedText = normalizeText(text);
        if (normalizedText.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Chat message text is required.");
        }

        UUID senderProfileId = requireProfileId(senderProfile);
        LocalDateTime sentAt = LocalDateTime.now();
        DBMessage message = new DBMessage();
        UUID messageId = UUID.randomUUID();
        message.setId(messageId);
        message.setEventId(event.getId());
        message.setFrom(senderProfileId);
        message.setTos(resolveMemberProfileIds(event));
        message.setType("p");
        message.setValue(normalizedText);
        message.setRef(messageId);
        message.setCreatedDate(sentAt);
        messageRepository.save(message);

        ChatStreamEvent streamEvent = toStreamEvent(message, senderProfile);
        chatStreamPublisher.publish(streamEvent);
        return streamEvent.toMessage(senderProfileId.toString());
    }

    private ActivitiesChatSummaryDto toChatSummary(Event event, UUID viewerProfileId, String viewerFrontendUserId) {
        DevChatSeedData.SeedChat seedChat = DevChatSeedData.chat(event.getId());
        DBMessage lastMessage = findLastChatMessage(event.getId());
        String title = seedChat != null ? seedChat.title() : normalizeTitle(event.getName());
        String chatId = seedChat != null ? seedChat.chatId() : event.getId().toString();
        String avatar = seedChat != null ? seedChat.avatar() : buildInitials(title);
        String lastMessageText = seedChat != null
                ? seedChat.lastMessage()
                : (lastMessage != null && lastMessage.getValue() != null && !lastMessage.getValue().isBlank()
                        ? lastMessage.getValue().trim()
                        : "Start the conversation.");
        String lastSenderId = seedChat != null
                ? seedChat.lastSenderFrontendUserId()
                : (lastMessage != null && lastMessage.getFrom() != null
                        ? DevChatSeedData.frontendUserId(lastMessage.getFrom())
                        : DevChatSeedData.frontendUserId(viewerProfileId));
        String dateIso = seedChat != null
                ? toIso(buildSeedAnchorDate(seedChat))
                : (lastMessage != null && lastMessage.getCreatedDate() != null
                        ? toIso(lastMessage.getCreatedDate())
                        : resolveEventDateIso(event));
        double distanceKm = seedChat != null ? buildSeedDistanceKm(seedChat) : 5d;
        return new ActivitiesChatSummaryDto(
                chatId,
                avatar,
                title,
                lastMessageText,
                lastSenderId,
                seedChat != null ? resolveSeedSummaryMemberIds(seedChat, viewerFrontendUserId) : resolveMemberFrontendIds(event),
                seedChat != null ? seedChat.unread() : 0,
                dateIso,
                seedChat != null ? seedChat.channelType() : "general",
                event.getId().toString(),
                distanceKm,
                Math.max(0, (int) Math.round(distanceKm * 1000)));
    }

    private ActivitiesChatMessageDto toChatMessage(DBMessage message, UUID viewerProfileId) {
        Profile senderProfile = resolveProfile(message.getFrom());
        String senderName = resolveProfileName(senderProfile, message.getFrom());
        String senderId = DevChatSeedData.frontendUserId(message.getFrom());
        return new ActivitiesChatMessageDto(
                message.getId() != null ? message.getId().toString() : UUID.randomUUID().toString(),
                senderId,
                senderName,
                buildInitials(senderName),
                normalizeGender(senderProfile != null ? senderProfile.getGender() : null),
                message.getValue() != null ? message.getValue() : "",
                toIso(message.getCreatedDate()),
                Objects.equals(message.getFrom(), viewerProfileId),
                List.of());
    }

    private ChatStreamEvent toStreamEvent(DBMessage message, Profile senderProfile) {
        String senderName = resolveProfileName(senderProfile, message.getFrom());
        return new ChatStreamEvent(
                resolvePublicChatId(message.getEventId()),
                message.getId().toString(),
                message.getFrom() != null ? message.getFrom().toString() : "",
                DevChatSeedData.frontendUserId(message.getFrom()),
                senderName,
                buildInitials(senderName),
                normalizeGender(senderProfile != null ? senderProfile.getGender() : null),
                message.getValue(),
                toIso(message.getCreatedDate()));
    }

    private Event requireAccessibleEvent(String chatId, Profile viewerProfile) {
        UUID eventId = resolveEventId(chatId);
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Chat not found."));
        if (!isChatAccessible(event, requireProfileId(viewerProfile))) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Chat not found.");
        }
        return event;
    }

    private UUID resolveEventId(String chatId) {
        DevChatSeedData.SeedChat seedChat = DevChatSeedData.chat(chatId);
        if (seedChat != null) {
            return seedChat.eventId();
        }
        try {
            return UUID.fromString(chatId);
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Chat not found.");
        }
    }

    private boolean isVisibleChat(Event event, UUID viewerProfileId, String viewerFrontendUserId) {
        if (!configProperties.isFirebaseEnabled()) {
            DevChatSeedData.SeedChat seedChat = DevChatSeedData.chat(event.getId());
            return seedChat != null && Objects.equals(seedChat.ownerFrontendUserId(), viewerFrontendUserId);
        }
        return isChatAccessible(event, viewerProfileId);
    }

    private boolean isChatAccessible(Event event, UUID viewerProfileId) {
        if (!configProperties.isFirebaseEnabled()) {
            return true;
        }
        return isProfileMember(event, viewerProfileId);
    }

    private boolean isProfileMember(Event event, UUID viewerProfileId) {
        return event.getMembers() != null && event.getMembers().stream()
                .map(Member::getProfile)
                .filter(Objects::nonNull)
                .map(Profile::getId)
                .filter(Objects::nonNull)
                .anyMatch(viewerProfileId::equals);
    }

    private DBMessage findLastChatMessage(UUID eventId) {
        return messageRepository.findByEventId(eventId).stream()
                .filter(this::isChatMessage)
                .max(Comparator.comparing(DBMessage::getCreatedDate,
                        Comparator.nullsLast(LocalDateTime::compareTo)))
                .orElse(null);
    }

    private boolean isChatMessage(DBMessage message) {
        return message != null && Objects.equals("p", message.getType());
    }

    private List<UUID> resolveMemberProfileIds(Event event) {
        if (event.getMembers() == null) {
            return List.of();
        }
        return event.getMembers().stream()
                .map(Member::getProfile)
                .filter(Objects::nonNull)
                .map(Profile::getId)
                .filter(Objects::nonNull)
                .distinct()
                .toList();
    }

    private List<String> resolveMemberFrontendIds(Event event) {
        return resolveMemberProfileIds(event).stream()
                .map(DevChatSeedData::frontendUserId)
                .distinct()
                .toList();
    }

    private List<String> resolveSeedSummaryMemberIds(DevChatSeedData.SeedChat seedChat, String viewerFrontendUserId) {
        return seedChat.participantProfileIds().stream()
                .map(DevChatSeedData::frontendUserId)
                .filter(frontendUserId -> !Objects.equals(frontendUserId, viewerFrontendUserId))
                .distinct()
                .toList();
    }

    private Profile resolveProfile(UUID profileId) {
        if (profileId == null) {
            return null;
        }
        return profileRepository.findById(profileId).orElse(null);
    }

    private UUID requireProfileId(Profile profile) {
        if (profile == null || profile.getId() == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Missing authenticated profile.");
        }
        return profile.getId();
    }

    private String resolvePublicChatId(UUID eventId) {
        DevChatSeedData.SeedChat seedChat = DevChatSeedData.chat(eventId);
        return seedChat != null ? seedChat.chatId() : (eventId != null ? eventId.toString() : "");
    }

    private Instant summarySortInstant(ActivitiesChatSummaryDto summary) {
        try {
            return summary != null && summary.dateIso() != null ? Instant.parse(summary.dateIso()) : Instant.EPOCH;
        } catch (Exception ignored) {
            return Instant.EPOCH;
        }
    }

    private String normalizeText(String value) {
        return value == null ? "" : value.trim();
    }

    private String normalizeTitle(String value) {
        String normalized = value == null ? "" : value.trim();
        return normalized.isBlank() ? "Event Chat" : normalized;
    }

    private String resolveEventDateIso(Event event) {
        if (event.getRange() != null && event.getRange().getStart() != null) {
            return toIso(event.getRange().getStart());
        }
        if (event.getCreatedDate() != null) {
            return toIso(event.getCreatedDate());
        }
        return Instant.now().toString();
    }

    private String toIso(LocalDateTime value) {
        if (value == null) {
            return Instant.now().toString();
        }
        return value.atZone(ZoneId.systemDefault()).toInstant().toString();
    }

    private String resolveProfileName(Profile profile, UUID fallbackId) {
        if (profile != null && profile.getFirstName() != null && !profile.getFirstName().isBlank()) {
            return profile.getFirstName().trim();
        }
        if (fallbackId == null) {
            return "User";
        }
        String raw = fallbackId.toString().replace("-", "");
        return "User " + raw.substring(Math.max(0, raw.length() - 4));
    }

    private String buildInitials(String value) {
        String normalized = value == null ? "" : value.trim();
        if (normalized.isBlank()) {
            return "CH";
        }
        String[] parts = normalized.split("\\s+");
        if (parts.length == 1) {
            return parts[0].substring(0, Math.min(2, parts[0].length())).toUpperCase();
        }
        String first = parts[0].substring(0, 1);
        String last = parts[parts.length - 1].substring(0, 1);
        return (first + last).toUpperCase();
    }

    private String normalizeGender(String value) {
        String normalized = value == null ? "" : value.trim().toLowerCase();
        if (normalized.startsWith("w") || normalized.startsWith("f")) {
            return "woman";
        }
        return "man";
    }

    private LocalDateTime buildSeedAnchorDate(DevChatSeedData.SeedChat seedChat) {
        int seed = hashText("chat-date:" + seedChat.ownerFrontendUserId() + ":" + seedChat.chatId() + ":" + seedChat.title());
        return LocalDateTime.of(2026, 2, 21, 9, 0)
                .plusDays(seed % 9)
                .withHour(8 + (seed % 11))
                .withMinute((seed % 4) * 15)
                .withSecond(0)
                .withNano(0);
    }

    private double buildSeedDistanceKm(DevChatSeedData.SeedChat seedChat) {
        return 2 + (hashText("chat-distance:" + seedChat.ownerFrontendUserId() + ":" + seedChat.chatId() + ":" + seedChat.title()) % 18);
    }

    private int hashText(String value) {
        int hash = 0;
        for (int index = 0; index < value.length(); index += 1) {
            hash = (hash * 31 + value.charAt(index)) % 104729;
        }
        return Math.abs(hash);
    }
}
