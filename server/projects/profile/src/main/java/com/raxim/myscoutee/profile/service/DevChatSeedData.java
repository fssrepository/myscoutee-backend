package com.raxim.myscoutee.profile.service;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

final class DevChatSeedData {
    static final String DEFAULT_DEV_USER_EMAIL = "dev@myscoutee.local";

    private static final SeedProfile DEV_PROFILE = new SeedProfile(
            uuid("00000000-0000-0000-0000-000000000001"),
            uuid("00000000-0000-0000-0000-00000000d001"),
            "u1",
            DEFAULT_DEV_USER_EMAIL,
            "Farkas Anna",
            "woman");

    private static final List<SeedProfile> PROFILES = List.of(
            DEV_PROFILE,
            new SeedProfile(uuid("00000000-0000-0000-0000-000000000002"), null, "u2", null, "Kiss Balazs", "man"),
            new SeedProfile(uuid("00000000-0000-0000-0000-000000000003"), null, "u3", null, "Nagy Eszter", "woman"),
            new SeedProfile(uuid("00000000-0000-0000-0000-000000000004"), null, "u4", null, "Maya Stone", "woman"),
            new SeedProfile(uuid("00000000-0000-0000-0000-000000000005"), null, "u5", null, "Lina Park", "woman"),
            new SeedProfile(uuid("00000000-0000-0000-0000-000000000006"), null, "u6", null, "Iris Bloom", "woman"),
            new SeedProfile(uuid("00000000-0000-0000-0000-000000000007"), null, "u7", null, "Noah Hart", "man"),
            new SeedProfile(uuid("00000000-0000-0000-0000-000000000008"), null, "u8", null, "Evan Reed", "man"),
            new SeedProfile(uuid("00000000-0000-0000-0000-00000000000a"), null, "u10", null, "Luca Hale", "man"),
            new SeedProfile(uuid("00000000-0000-0000-0000-00000000000b"), null, "u11", null, "Theo Lane", "man"),
            new SeedProfile(uuid("00000000-0000-0000-0000-00000000000c"), null, "u12", null, "Milo Grant", "man"));

    private static final Map<UUID, SeedProfile> PROFILES_BY_ID = indexProfilesById(PROFILES);
    private static final Map<String, SeedProfile> PROFILES_BY_FRONTEND_USER_ID = PROFILES.stream()
            .collect(Collectors.toMap(SeedProfile::frontendUserId, profile -> profile, (left, _right) -> left, LinkedHashMap::new));

    private static final List<SeedChat> CHATS = List.of(
            new SeedChat(
                    "u1",
                    "c1",
                    uuid("00000000-0000-0000-0000-0000000000c1"),
                    "MS",
                    "Driver Split - Alpine Weekend",
                    "I can take one extra seat from downtown pickup.",
                    "u5",
                    5,
                    "general",
                    List.of(
                            profileIdForFrontendUser("u1"),
                            profileIdForFrontendUser("u5"),
                            profileIdForFrontendUser("u4"),
                            profileIdForFrontendUser("u10"),
                            profileIdForFrontendUser("u7"))),
            new SeedChat(
                    "u1",
                    "c2",
                    uuid("00000000-0000-0000-0000-0000000000c2"),
                    "NH",
                    "Padel Night Pair Room",
                    "Pair mode starts in 20 mins.",
                    "u7",
                    2,
                    "general",
                    List.of(
                            profileIdForFrontendUser("u1"),
                            profileIdForFrontendUser("u7"),
                            profileIdForFrontendUser("u6"),
                            profileIdForFrontendUser("u10"),
                            profileIdForFrontendUser("u3"),
                            profileIdForFrontendUser("u11"))),
            new SeedChat(
                    "u1",
                    "c3",
                    uuid("00000000-0000-0000-0000-0000000000c3"),
                    "LH",
                    "Host Circle Ops",
                    "2 invites timed out. Should we rerun now?",
                    "u10",
                    1,
                    "general",
                    List.of(
                            profileIdForFrontendUser("u1"),
                            profileIdForFrontendUser("u10"),
                            profileIdForFrontendUser("u12"),
                            profileIdForFrontendUser("u8"))),
            new SeedChat(
                    "u2",
                    "c4",
                    uuid("00000000-0000-0000-0000-0000000000c4"),
                    "IB",
                    "City Brunch - Main Room",
                    "Table booked for 12:30.",
                    "u6",
                    2,
                    "general",
                    List.of(
                            profileIdForFrontendUser("u2"),
                            profileIdForFrontendUser("u6"),
                            profileIdForFrontendUser("u4"),
                            profileIdForFrontendUser("u1"))),
            new SeedChat(
                    "u3",
                    "c5",
                    uuid("00000000-0000-0000-0000-0000000000c5"),
                    "LP",
                    "Trail Group - Transport",
                    "Need one more car seat.",
                    "u5",
                    4,
                    "general",
                    List.of(
                            profileIdForFrontendUser("u3"),
                            profileIdForFrontendUser("u5"),
                            profileIdForFrontendUser("u7"),
                            profileIdForFrontendUser("u10"),
                            profileIdForFrontendUser("u1"))));

    private static final Map<UUID, SeedChat> CHATS_BY_EVENT_ID = CHATS.stream()
            .collect(Collectors.toMap(SeedChat::eventId, chat -> chat, (left, _right) -> left, LinkedHashMap::new));
    private static final Map<String, SeedChat> CHATS_BY_CHAT_ID = CHATS.stream()
            .collect(Collectors.toMap(SeedChat::chatId, chat -> chat, (left, _right) -> left, LinkedHashMap::new));

    private DevChatSeedData() {
    }

    static SeedProfile devProfile() {
        return DEV_PROFILE;
    }

    static List<SeedProfile> profiles() {
        return PROFILES;
    }

    static List<SeedChat> chats() {
        return CHATS;
    }

    static List<SeedChat> chatsForFrontendUser(String frontendUserId) {
        String normalized = frontendUserId == null ? "" : frontendUserId.trim();
        if (normalized.isBlank()) {
            return List.of();
        }
        return CHATS.stream()
                .filter(chat -> chat.ownerFrontendUserId().equals(normalized))
                .toList();
    }

    static SeedChat chat(UUID eventId) {
        return CHATS_BY_EVENT_ID.get(eventId);
    }

    static SeedChat chat(String chatId) {
        return chatId == null ? null : CHATS_BY_CHAT_ID.get(chatId.trim());
    }

    static String frontendUserId(UUID profileId) {
        SeedProfile seedProfile = PROFILES_BY_ID.get(profileId);
        return seedProfile != null ? seedProfile.frontendUserId() : (profileId != null ? profileId.toString() : "");
    }

    static UUID profileIdForFrontendUser(String frontendUserId) {
        SeedProfile seedProfile = findProfileByFrontendUser(frontendUserId);
        if (seedProfile == null) {
            throw new IllegalArgumentException("Unknown frontend user id: " + frontendUserId);
        }
        return seedProfile.profileId();
    }

    static UUID findProfileIdForFrontendUser(String frontendUserId) {
        SeedProfile seedProfile = findProfileByFrontendUser(frontendUserId);
        return seedProfile != null ? seedProfile.profileId() : null;
    }

    private static SeedProfile findProfileByFrontendUser(String frontendUserId) {
        if (frontendUserId == null) {
            return null;
        }
        return PROFILES_BY_FRONTEND_USER_ID.get(frontendUserId.trim());
    }

    private static Map<UUID, SeedProfile> indexProfilesById(List<SeedProfile> profiles) {
        Map<UUID, SeedProfile> indexed = new LinkedHashMap<>();
        for (SeedProfile profile : profiles) {
            indexed.put(profile.profileId(), profile);
        }
        return indexed;
    }

    private static UUID uuid(String value) {
        return UUID.fromString(value);
    }

    record SeedProfile(UUID profileId, UUID userId, String frontendUserId, String email, String fullName, String gender) {
    }

    record SeedChat(
            String ownerFrontendUserId,
            String chatId,
            UUID eventId,
            String avatar,
            String title,
            String lastMessage,
            String lastSenderFrontendUserId,
            int unread,
            String channelType,
            List<UUID> participantProfileIds) {
    }
}
