package com.raxim.myscoutee.profile.service;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.time.Instant;
import java.util.UUID;

import org.bson.types.ObjectId;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.server.ResponseStatusException;

import com.raxim.myscoutee.common.config.firebase.dto.FirebasePrincipal;
import com.raxim.myscoutee.common.config.properties.RegionSecurityProperties;
import com.raxim.myscoutee.profile.data.document.ActivityChat;
import com.raxim.myscoutee.profile.data.document.ActivityEvent;
import com.raxim.myscoutee.profile.data.document.ActivityMember;
import com.raxim.myscoutee.profile.data.document.Asset;
import com.raxim.myscoutee.profile.data.document.EventFeedbackAnswer;
import com.raxim.myscoutee.profile.data.document.EventFeedbackState;
import com.raxim.myscoutee.profile.data.document.UserFeedbackSubmission;
import com.raxim.myscoutee.profile.data.document.UserFilterPreferences;
import com.raxim.myscoutee.profile.data.document.UserAffinityEdge;
import com.raxim.myscoutee.profile.data.document.UserRate;
import com.raxim.myscoutee.profile.data.document.UserReportSubmission;
import com.raxim.myscoutee.profile.data.document.UserSessionAction;
import com.raxim.myscoutee.profile.data.document.Users;
import com.raxim.myscoutee.profile.data.dto.auth.AuthDtos.UserActivitiesDto;
import com.raxim.myscoutee.profile.data.dto.auth.AuthDtos.UserAssetCountersDto;
import com.raxim.myscoutee.profile.data.dto.auth.AuthDtos.UserByIdResponseDto;
import com.raxim.myscoutee.profile.data.dto.auth.AuthDtos.UserDeleteRequestDto;
import com.raxim.myscoutee.profile.data.dto.auth.AuthDtos.UserDto;
import com.raxim.myscoutee.profile.data.dto.auth.AuthDtos.UserEventCountersDto;
import com.raxim.myscoutee.profile.data.dto.auth.AuthDtos.UserEventFeedbackCountersDto;
import com.raxim.myscoutee.profile.data.dto.auth.AuthDtos.UserFeedbackSubmitRequestDto;
import com.raxim.myscoutee.profile.data.dto.auth.AuthDtos.UserGameFilterPreferencesDto;
import com.raxim.myscoutee.profile.data.dto.auth.AuthDtos.UserImpressionsDto;
import com.raxim.myscoutee.profile.data.dto.auth.AuthDtos.UserImpressionsSectionDto;
import com.raxim.myscoutee.profile.data.dto.auth.AuthDtos.ProfileDetailGroupDto;
import com.raxim.myscoutee.profile.data.dto.auth.AuthDtos.ProfileDetailRowDto;
import com.raxim.myscoutee.profile.data.dto.auth.AuthDtos.UserLogoutRequestDto;
import com.raxim.myscoutee.profile.data.dto.auth.AuthDtos.DemoUserListItemDto;
import com.raxim.myscoutee.profile.data.dto.auth.AuthDtos.UserMenuCountersDto;
import com.raxim.myscoutee.profile.data.dto.auth.AuthDtos.UserPersonalityTraitDto;
import com.raxim.myscoutee.profile.data.dto.auth.AuthDtos.UserLocationEligibilityResponseDto;
import com.raxim.myscoutee.profile.data.dto.auth.AuthDtos.UserRealtimeCountersDto;
import com.raxim.myscoutee.profile.data.dto.auth.AuthDtos.UserRealtimeLongPollRequestDto;
import com.raxim.myscoutee.profile.data.dto.auth.AuthDtos.UserRealtimeLongPollResponseDto;
import com.raxim.myscoutee.profile.data.dto.auth.AuthDtos.UserReportUserSubmitRequestDto;
import com.raxim.myscoutee.profile.data.dto.auth.AuthDtos.UserSubmitActionResponseDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.LocationCoordinatesDto;
import com.raxim.myscoutee.profile.repository.ActivityChatMessagesRepository;
import com.raxim.myscoutee.profile.repository.ActivityChatsRepository;
import com.raxim.myscoutee.profile.repository.ActivityEventsRepository;
import com.raxim.myscoutee.profile.repository.ActivityMembersRepository;
import com.raxim.myscoutee.profile.repository.AssetsRepository;
import com.raxim.myscoutee.profile.repository.EventFeedbackAnswersRepository;
import com.raxim.myscoutee.profile.repository.EventFeedbackStatesRepository;
import com.raxim.myscoutee.profile.repository.UserFeedbackSubmissionsRepository;
import com.raxim.myscoutee.profile.repository.UserFilterPreferencesRepository;
import com.raxim.myscoutee.profile.repository.UserAffinityEdgesRepository;
import com.raxim.myscoutee.profile.repository.UserRatesRepository;
import com.raxim.myscoutee.profile.repository.UserReportSubmissionsRepository;
import com.raxim.myscoutee.profile.repository.UserSessionActionsRepository;
import com.raxim.myscoutee.profile.repository.UsersRepository;
import com.raxim.myscoutee.profile.security.AccessControlService;

@Service
public class HomeUserProfileService {
    private static final List<String> HOME_GAME_PROFILE_STATUSES = List.of("public", "friends only");
    private static final Set<String> INSIDE_NETWORK_GAME_PROFILE_STATUSES = Set.of("public", "friends only");
    private static final String PROFILE_STATUS_ONBOARDING = "onboarding";
    private static final Set<String> HARD_HIDDEN_PROFILE_STATUSES = Set.of("blocked", "inactive", "deleted", PROFILE_STATUS_ONBOARDING);
    private static final long EVENT_FEEDBACK_UNLOCK_DELAY_MS = 2L * 60L * 60L * 1000L;
    private static final String DEFAULT_SEED_PARTITION_KEY = "country:hu";
    private static final String SEED_USER_IMAGE_HOST = "randomuser.me/";
    private static final String INELIGIBLE_REGION_MESSAGE = "Login is currently unavailable from your country or region for security reasons. Please come back later.";
    private static final String OWNER_TYPE_EVENT = "event";
    private static final String ASSET_TYPE_CAR = "Car";
    private static final String ASSET_TYPE_ACCOMMODATION = "Accommodation";
    private static final String ASSET_TYPE_SUPPLIES = "Supplies";
    private static final String STATUS_ACCEPTED = "accepted";
    private static final String STATUS_PENDING = "pending";
    private static final String STATUS_DELETED = "deleted";
    private static final String ASSET_STATUS_DELETED = "D";
    private static final String STATUS_TRASHED = "T";
    private static final double HOME_KNOWN_EDGE_SCORE = 1_000_000d;
    private static final double HOME_BRIDGE_COUNT_SCORE = 1_000_000d;
    private static final double HOME_BRIDGE_EDGE_SCORE = 250_000d;
    private static final double HOME_DISTANCE_SCORE = 120_000d;
    private static final double HOME_FRESHNESS_SCORE = 120_000d;
    private static final double HOME_DISTANCE_BUCKET_KM = 5d;
    private static final double HOME_DISTANCE_MAX_BUCKETS = 12d;
    private static final double HOME_FRESHNESS_HALF_LIFE_DAYS = 14d;
    private static final long MILLIS_PER_DAY = 24L * 60L * 60L * 1000L;
    private static final long USER_READ_SNAPSHOT_CACHE_TTL_MS = 5_000L;
    private static final List<PersonalityTraitDefinition> PERSONALITY_TRAIT_DEFINITIONS = List.of(
            new PersonalityTraitDefinition(
                    "social-charmer",
                    "Social Charmer",
                    "Warm, magnetic, easy to talk to",
                    List.of("Friendly", "Outgoing", "Funny"),
                    List.of("social charmer", "the social charmer")),
            new PersonalityTraitDefinition(
                    "deep-thinker",
                    "Deep Thinker",
                    "Reflective, intellectual, meaningful",
                    List.of("Thoughtful", "Curious", "Insightful"),
                    List.of("deep thinker", "the deep thinker")),
            new PersonalityTraitDefinition(
                    "adventurer",
                    "Adventurer",
                    "Energetic, bold, spontaneous",
                    List.of("Spontaneous", "Brave", "Active"),
                    List.of("adventurer", "the adventurer")),
            new PersonalityTraitDefinition(
                    "reliable-one",
                    "Reliable One",
                    "Stable, trustworthy, grounded",
                    List.of("Loyal", "Honest", "Dependable"),
                    List.of("reliable one", "the reliable one", "megbízható", "megbizhato")),
            new PersonalityTraitDefinition(
                    "creative-soul",
                    "Creative Soul",
                    "Expressive, imaginative, artistic",
                    List.of("Artistic", "Unique", "Visionary"),
                    List.of("creative soul", "the creative soul", "kreatív", "kreativ")),
            new PersonalityTraitDefinition(
                    "empath",
                    "Empath",
                    "Kind, emotionally safe, nurturing",
                    List.of("Caring", "Supportive", "Patient"),
                    List.of("empath", "the empath", "empatikus")),
            new PersonalityTraitDefinition(
                    "ambitious-go-getter",
                    "Ambitious Go-Getter",
                    "Driven, goal-oriented, high standards",
                    List.of("Motivated", "Focused", "Strategic thinker"),
                    List.of("ambitious go-getter", "ambitious go getter", "the ambitious go-getter")),
            new PersonalityTraitDefinition(
                    "playful-spirit",
                    "Playful Spirit",
                    "Lighthearted, fun, youthful",
                    List.of("Silly", "Optimistic", "Witty"),
                    List.of("playful spirit", "the playful spirit")));
    private static final Map<String, PersonalityTraitDefinition> PERSONALITY_TRAIT_DEFINITION_BY_ID = buildPersonalityTraitDefinitionById();
    private static final Map<String, String> PERSONALITY_TRAIT_ID_BY_TOKEN = buildPersonalityTraitIdByToken();
    private static final Map<String, String> LEGACY_FEEDBACK_TRAIT_ID_BY_TOKEN = Map.ofEntries(
            Map.entry("communication", "social-charmer"),
            Map.entry("coordination", "reliable-one"),
            Map.entry("host vibe", "social-charmer"),
            Map.entry("host reliability", "reliable-one"),
            Map.entry("host consistency", "reliable-one"),
            Map.entry("host quality", "ambitious-go-getter"),
            Map.entry("host organization", "reliable-one"),
            Map.entry("host communication", "social-charmer"),
            Map.entry("host planning", "ambitious-go-getter"),
            Map.entry("attendee teamwork", "empath"),
            Map.entry("attendee reliability", "reliable-one"),
            Map.entry("attendee neutrality", "deep-thinker"),
            Map.entry("attendee fit", "adventurer"),
            Map.entry("attendee trust", "empath"),
            Map.entry("attendee compatibility", "social-charmer"),
            Map.entry("attendee risk", "ambitious-go-getter"),
            Map.entry("attendee role-fit", "deep-thinker"));

    private final UsersRepository usersRepository;
    private final UserFilterPreferencesRepository userFilterPreferencesRepository;
    private final UserAffinityEdgesRepository userAffinityEdgesRepository;
    private final UserRatesRepository userRatesRepository;
    private final ActivityChatsRepository activityChatsRepository;
    private final ActivityChatMessagesRepository activityChatMessagesRepository;
    private final ActivityEventsRepository activityEventsRepository;
    private final ActivityMembersRepository activityMembersRepository;
    private final AssetsRepository assetsRepository;
    private final EventParticipationTicketService eventParticipationTicketService;
    private final EventFeedbackStatesRepository eventFeedbackStatesRepository;
    private final EventFeedbackAnswersRepository eventFeedbackAnswersRepository;
    private final UserFeedbackSubmissionsRepository userFeedbackSubmissionsRepository;
    private final UserReportSubmissionsRepository userReportSubmissionsRepository;
    private final UserSessionActionsRepository userSessionActionsRepository;
    private final ScheduledMessageTaskService scheduledMessageTaskService;
    private final CountryPartitionService countryPartitionService;
    private final RegionSecurityProperties regionSecurityProperties;
    private final AbsoluteAffinityService absoluteAffinityService;
    private final AffinityRecomputeTaskService affinityRecomputeTaskService;
    private final AdminTelemetryService adminTelemetryService;
    private final AdminMenuCounterService adminMenuCounterService;
    private final AccessControlService accessControlService;
    private final Map<String, CacheEntry<UserImpressionsDto>> userImpressionsCacheByUserId = new ConcurrentHashMap<>();
    private final Map<String, CacheEntry<Map<String, Double>>> affinityWeightsCacheByUserIdsKey = new ConcurrentHashMap<>();
    private final Map<String, Object> userReadCacheLocksByUserId = new ConcurrentHashMap<>();
    private final Object gameStackSnapshotCacheLock = new Object();
    private volatile CacheEntry<GameStackSnapshot> gameStackSnapshotCache;

    public HomeUserProfileService(
            UsersRepository usersRepository,
            UserFilterPreferencesRepository userFilterPreferencesRepository,
            UserAffinityEdgesRepository userAffinityEdgesRepository,
            UserRatesRepository userRatesRepository,
            ActivityChatsRepository activityChatsRepository,
            ActivityChatMessagesRepository activityChatMessagesRepository,
            ActivityEventsRepository activityEventsRepository,
            ActivityMembersRepository activityMembersRepository,
            AssetsRepository assetsRepository,
            EventParticipationTicketService eventParticipationTicketService,
            EventFeedbackStatesRepository eventFeedbackStatesRepository,
            EventFeedbackAnswersRepository eventFeedbackAnswersRepository,
            UserFeedbackSubmissionsRepository userFeedbackSubmissionsRepository,
            UserReportSubmissionsRepository userReportSubmissionsRepository,
            UserSessionActionsRepository userSessionActionsRepository,
            ScheduledMessageTaskService scheduledMessageTaskService,
            CountryPartitionService countryPartitionService,
            RegionSecurityProperties regionSecurityProperties,
            AbsoluteAffinityService absoluteAffinityService,
            AffinityRecomputeTaskService affinityRecomputeTaskService,
            AdminTelemetryService adminTelemetryService,
            AdminMenuCounterService adminMenuCounterService,
            AccessControlService accessControlService) {
        this.usersRepository = usersRepository;
        this.userFilterPreferencesRepository = userFilterPreferencesRepository;
        this.userAffinityEdgesRepository = userAffinityEdgesRepository;
        this.userRatesRepository = userRatesRepository;
        this.activityChatsRepository = activityChatsRepository;
        this.activityChatMessagesRepository = activityChatMessagesRepository;
        this.activityEventsRepository = activityEventsRepository;
        this.activityMembersRepository = activityMembersRepository;
        this.assetsRepository = assetsRepository;
        this.eventParticipationTicketService = eventParticipationTicketService;
        this.eventFeedbackStatesRepository = eventFeedbackStatesRepository;
        this.eventFeedbackAnswersRepository = eventFeedbackAnswersRepository;
        this.userFeedbackSubmissionsRepository = userFeedbackSubmissionsRepository;
        this.userReportSubmissionsRepository = userReportSubmissionsRepository;
        this.userSessionActionsRepository = userSessionActionsRepository;
        this.scheduledMessageTaskService = scheduledMessageTaskService;
        this.countryPartitionService = countryPartitionService;
        this.regionSecurityProperties = regionSecurityProperties;
        this.absoluteAffinityService = absoluteAffinityService;
        this.affinityRecomputeTaskService = affinityRecomputeTaskService;
        this.adminTelemetryService = adminTelemetryService;
        this.adminMenuCounterService = adminMenuCounterService;
        this.accessControlService = accessControlService;
    }

    public UserByIdResponseDto queryUserById(String requestedUserId) {
        String resolvedUserId = resolveSelectedUserId(requestedUserId);
        if (!StringUtils.hasText(resolvedUserId)) {
            return StringUtils.hasText(requestedUserId) ? null : buildCurrentAdminPrincipalResponse();
        }

        Users user = findUser(resolvedUserId);
        if (user == null) {
            return buildCurrentAdminPrincipalResponse();
        }
        if (!StringUtils.hasText(requestedUserId)) {
            scheduledMessageTaskService.touchUserActivity(resolvedUserId);
        }

        UserDto userDto = toUserDto(user);
        UserMenuCountersDto menuCounters = buildMenuCounters(user);
        int filterCount = menuCounters.game();
        UserGameFilterPreferencesDto filterPreferences = resolveFilterPreferences(resolvedUserId, user);

        return new UserByIdResponseDto(
                userDto.id(),
                userDto.name(),
                userDto.age(),
                userDto.birthday(),
                userDto.city(),
                userDto.height(),
                userDto.physique(),
                userDto.languages(),
                userDto.horoscope(),
                userDto.initials(),
                userDto.gender(),
                userDto.statusText(),
                userDto.hostTier(),
                userDto.traitLabel(),
                userDto.completion(),
                userDto.profileFormVersion(),
                userDto.headline(),
                userDto.about(),
                userDto.affinity(),
                userDto.locationCoordinates(),
                userDto.partitionKey(),
                userDto.images(),
                userDto.profileDetails(),
                userDto.impressions(),
                userDto.profileStatus(),
                userDto.previousProfileStatus(),
                userDto.deletedAtIso(),
                isCurrentRequestAdmin(),
                userDto.activities(),
                filterCount,
                filterPreferences,
                menuCounters);
    }

    private UserByIdResponseDto buildCurrentAdminPrincipalResponse() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null
                || !(authentication.getPrincipal() instanceof FirebasePrincipal firebasePrincipal)
                || !isCurrentRequestAdmin()) {
            return null;
        }
        String userId = normalizeId(firebasePrincipal.getUserId());
        if (!StringUtils.hasText(userId)) {
            return null;
        }
        String email = safeText(firebasePrincipal.getEmail());
        String name = adminDisplayName(email);
        UserActivitiesDto activities = toUserActivitiesDto(null);
        UserMenuCountersDto menuCounters = emptyMenuCounters();
        return new UserByIdResponseDto(
                userId,
                name,
                0,
                "",
                "",
                "",
                "",
                List.of(),
                "",
                adminInitials(name),
                "man",
                "",
                "",
                "",
                0,
                0,
                "",
                "",
                null,
                null,
                "",
                List.of(),
                List.of(),
                null,
                "public",
                "",
                "",
                true,
                activities,
                0,
                null,
                menuCounters);
    }

    public UserRealtimeLongPollResponseDto queryRealtimeSnapshot(UserRealtimeLongPollRequestDto request) {
        String resolvedUserId = resolveSelectedUserId(request == null ? null : request.userId());
        if (!StringUtils.hasText(resolvedUserId)) {
            return null;
        }

        Users user = findUser(resolvedUserId);
        if (user == null) {
            return null;
        }

        UserImpressionsDto impressions = resolveMergedUserImpressions(user);
        UserRealtimeCountersDto counters = buildRealtimeCounters(user, request == null ? null : request.cursor(), impressions);
        return new UserRealtimeLongPollResponseDto(
                resolvedUserId,
                counters,
                impressions,
                buildRealtimeCursor(user, counters, impressions),
                Instant.now().toString());
    }

    public UserLocationEligibilityResponseDto queryLocationEligibility(Double latitude, Double longitude) {
        if (!regionSecurityProperties.isEnabled()) {
            return new UserLocationEligibilityResponseDto(true, null, null, false, false);
        }

        if (latitude == null || longitude == null || !Double.isFinite(latitude) || !Double.isFinite(longitude)) {
            return new UserLocationEligibilityResponseDto(false, null, null, true, false);
        }

        LocationCoordinatesDto coordinates = new LocationCoordinatesDto(latitude, longitude);
        String partitionKey = countryPartitionService.resolvePartitionKey(coordinates);
        return new UserLocationEligibilityResponseDto(
                StringUtils.hasText(partitionKey),
                partitionKey,
                StringUtils.hasText(partitionKey) ? null : INELIGIBLE_REGION_MESSAGE,
                true,
                false);
    }

    public UserGameFilterPreferencesDto resolveFilterPreferences(String requestedUserId) {
        String resolvedUserId = resolveSelectedUserId(requestedUserId);
        if (!StringUtils.hasText(resolvedUserId)) {
            return null;
        }

        return resolveFilterPreferences(resolvedUserId, findUser(resolvedUserId));
    }

    public void saveUserFilterPreferences(String requestedUserId, UserGameFilterPreferencesDto preferences) {
        String resolvedUserId = resolveSelectedUserId(requestedUserId);
        if (!StringUtils.hasText(resolvedUserId) || preferences == null) {
            return;
        }

        String nowIso = Instant.now().toString();
        UserFilterPreferences document = userFilterPreferencesRepository.findByUserId(resolvedUserId)
                .orElseGet(UserFilterPreferences::new);
        document.setId(StringUtils.hasText(document.getId()) ? document.getId() : new ObjectId().toHexString());
        document.setSyncKey(StringUtils.hasText(document.getSyncKey()) ? document.getSyncKey() : UUID.randomUUID().toString());
        document.setUserId(resolvedUserId);
        applyPreferences(document, preferences);
        document.setCreatedDate(StringUtils.hasText(document.getCreatedDate()) ? document.getCreatedDate() : nowIso);
        document.setCreatedUser(StringUtils.hasText(document.getCreatedUser()) ? document.getCreatedUser() : resolvedUserId);
        document.setUpdatedDate(nowIso);
        document.setUpdatedUser(resolvedUserId);
        userFilterPreferencesRepository.save(document);
    }

    @CacheEvict(value = "demo_users", allEntries = true)
    public UserDto saveUserProfile(UserDto user) {
        if (user == null || !StringUtils.hasText(user.id())) {
            return null;
        }

        String normalizedUserId = normalizeId(user.id());
        if (!accessControlService.canCurrentActorEditProfile(normalizedUserId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Authenticated user is not allowed to edit this profile.");
        }
        evictUserReadCaches(normalizedUserId);
        Users existing = usersRepository.findByUserId(normalizedUserId).orElse(null);
        Users saved = usersRepository.save(mergeUserDocument(existing, user));
        Users resolved = syncCurrentUserEmail(syncComputedUserPartition(saved));
        affinityRecomputeTaskService.enqueueUserChanged(normalizeId(resolved == null ? null : resolved.getId()));
        String resolvedUserId = normalizeId(resolved == null ? null : resolved.getId());
        adminTelemetryService.record(
                existing == null ? "profile.registered" : "profile.fill.sampled",
                "profiles",
                resolvedUserId,
                resolvedUserId,
                1L,
                profileTelemetryTags(resolved));
        return toUserDto(resolved);
    }

    public UserSubmitActionResponseDto submitFeedback(UserFeedbackSubmitRequestDto request) {
        Users currentUser = resolveCurrentUser(request == null ? null : request.userId());
        String userId = normalizeId(currentUser == null ? null : currentUser.getId());
        if (!StringUtils.hasText(userId) || request == null) {
            return new UserSubmitActionResponseDto(false, "Unable to send feedback.");
        }

        String nowIso = Instant.now().toString();
        UserFeedbackSubmission document = new UserFeedbackSubmission();
        document.setId(new ObjectId().toHexString());
        document.setSyncKey(UUID.randomUUID().toString());
        document.setUserId(userId);
        document.setCategory(safeText(request.category()));
        document.setSubject(safeText(request.subject()));
        document.setDetails(safeText(request.details()));
        document.setCreatedDate(nowIso);
        document.setCreatedUser(userId);
        document.setUpdatedDate(nowIso);
        document.setUpdatedUser(userId);
        userFeedbackSubmissionsRepository.save(document);
        adminTelemetryService.record("feedback.submitted", "moderation", document.getId(), userId);
        return new UserSubmitActionResponseDto(true, null);
    }

    public UserSubmitActionResponseDto submitReport(UserReportUserSubmitRequestDto request) {
        Users currentUser = resolveCurrentUser(request == null ? null : request.userId());
        String userId = normalizeId(currentUser == null ? null : currentUser.getId());
        if (!StringUtils.hasText(userId) || request == null) {
            return new UserSubmitActionResponseDto(false, "Unable to submit report.");
        }

        String targetUserId = normalizeId(request.targetUserId());
        String eventId = normalizeId(request.eventId());
        if (!StringUtils.hasText(targetUserId)
                || !StringUtils.hasText(eventId)
                || userId.equals(targetUserId)) {
            return new UserSubmitActionResponseDto(false, "Reports can only be submitted for members you shared an event with.");
        }

        ActivityEvent eventRecord = resolvePreferredEventRecord(eventId);
        ActivityMember reporterMembership = resolveAcceptedReportMember(eventId, userId, eventRecord);
        ActivityMember targetMembership = resolveAcceptedReportMember(eventId, targetUserId, eventRecord);
        if (reporterMembership == null || targetMembership == null) {
            return new UserSubmitActionResponseDto(false, "Reports can only be submitted for members you shared an event with.");
        }

        String requestMemberEntryId = normalizeId(request.memberEntryId());
        String resolvedTargetMemberEntryId = resolveActivityMemberEntryId(targetMembership);
        if (StringUtils.hasText(requestMemberEntryId) && !requestMemberEntryId.equals(resolvedTargetMemberEntryId)) {
            return new UserSubmitActionResponseDto(false, "Reports can only be submitted for members you shared an event with.");
        }

        String sourceType = normalizeOptionalText(request.sourceType());
        String sourceId = normalizeOptionalText(request.sourceId());
        String sourceText = normalizeOptionalText(request.sourceText());
        String chatId = normalizeOptionalText(request.chatId());
        String messageId = normalizeOptionalText(request.messageId());
        String assetId = normalizeOptionalText(request.assetId());
        String assetType = normalizeOptionalText(request.assetType());
        ActivityChat.ChatMessageRecord reportedChatMessage = null;
        if (StringUtils.hasText(chatId) || "chat".equalsIgnoreCase(safeText(sourceType))) {
            ActivityChat reportedChat = resolveReportableChat(userId, targetUserId, chatId, messageId);
            if (reportedChat == null) {
                return new UserSubmitActionResponseDto(false, "Reports can only include chat messages you can view.");
            }
            reportedChatMessage = findChatMessage(reportedChat.getChatId(), messageId);
            chatId = normalizeOptionalText(reportedChat.getChatId());
            messageId = normalizeOptionalText(reportedChatMessage == null ? messageId : reportedChatMessage.getId());
            sourceType = "chat";
            sourceId = normalizeOptionalText(firstNonBlank(sourceId, messageId));
            sourceText = normalizeOptionalText(firstNonBlank(sourceText, reportedChatMessage == null ? null : reportedChatMessage.getText()));
        }

        String nowIso = Instant.now().toString();
        UserReportSubmission document = new UserReportSubmission();
        document.setId(new ObjectId().toHexString());
        document.setSyncKey(UUID.randomUUID().toString());
        document.setUserId(userId);
        document.setHandle(safeText(request.handle()));
        document.setReason(safeText(request.reason()));
        document.setDetails(safeText(request.details()));
        document.setTargetUserId(targetUserId);
        document.setMemberEntryId(resolvedTargetMemberEntryId);
        document.setEventId(eventId);
        document.setEventTitle(normalizeOptionalText(firstNonBlank(
                eventRecord == null ? null : eventRecord.getTitle(),
                request.eventTitle())));
        document.setEventStartAtIso(normalizeOptionalText(firstNonBlank(
                eventRecord == null ? null : eventRecord.getStartAtIso(),
                request.eventStartAtIso())));
        document.setSourceType(sourceType);
        document.setSourceId(sourceId);
        document.setSourceText(sourceText);
        document.setChatId(chatId);
        document.setMessageId(messageId);
        document.setAssetId(assetId);
        document.setAssetType(assetType);
        document.setCreatedDate(nowIso);
        document.setCreatedUser(userId);
        document.setUpdatedDate(nowIso);
        document.setUpdatedUser(userId);
        userReportSubmissionsRepository.save(document);
        adminTelemetryService.record("report.submitted", "moderation", document.getId(), userId);
        return new UserSubmitActionResponseDto(true, null);
    }

    public UserSubmitActionResponseDto logout(UserLogoutRequestDto request) {
        String resolvedUserId = resolveSelectedUserId(request == null ? null : request.userId());
        if (!StringUtils.hasText(resolvedUserId)) {
            return new UserSubmitActionResponseDto(false, "Unable to logout.");
        }
        recordSessionAction(resolvedUserId, "logout", "session");
        return new UserSubmitActionResponseDto(true, null);
    }

    @CacheEvict(value = "demo_users", allEntries = true)
    public UserSubmitActionResponseDto deleteUser(UserDeleteRequestDto request) {
        String resolvedUserId = resolveSelectedUserId(request == null ? null : request.userId());
        if (!StringUtils.hasText(resolvedUserId)) {
            return new UserSubmitActionResponseDto(false, "Unable to delete user.");
        }
        if (!accessControlService.canCurrentActorDeleteProfile(resolvedUserId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Authenticated user is not allowed to delete this profile.");
        }
        return scheduleUserDeletionByUserId(resolvedUserId, "status:D");
    }

    @CacheEvict(value = "demo_users", allEntries = true)
    public UserSubmitActionResponseDto scheduleUserDeletionByUserId(String userId, String source) {
        String resolvedUserId = normalizeId(userId);
        if (!StringUtils.hasText(resolvedUserId)) {
            return new UserSubmitActionResponseDto(false, "Unable to delete user.");
        }

        Users user = usersRepository.findByUserId(resolvedUserId)
                .or(() -> usersRepository.findById(resolvedUserId))
                .orElse(null);
        if (user == null) {
            return new UserSubmitActionResponseDto(false, "Unable to delete user.");
        }

        String previousProfileStatus = resolveProfileStatus(user);
        evictUserReadCaches(resolvedUserId);
        user.setStatus("D");
        user.setProfileStatus("deleted");
        user.setPreviousProfileStatus("deleted".equals(previousProfileStatus) ? user.getPreviousProfileStatus() : previousProfileStatus);
        user.setDeletedAtIso(Instant.now().toString());
        usersRepository.save(user);
        affinityRecomputeTaskService.enqueueAdminStatusChanged(resolvedUserId);
        recordSessionAction(resolvedUserId, "delete", StringUtils.hasText(source) ? source : "status:D");
        adminTelemetryService.record("profile.deleted", "profiles", resolvedUserId, resolvedUserId);
        return new UserSubmitActionResponseDto(true, null);
    }

    public List<Users> queryGameStackUserRecords(String activeUserId) {
        String normalizedUserId = normalizeId(activeUserId);
        if (!StringUtils.hasText(normalizedUserId)) {
            return List.of();
        }
        GameStackSnapshot snapshot = resolveGameStackSnapshot();
        Users activeUser = snapshot.usersById().get(normalizedUserId);
        if (!isPublicGameUser(activeUser)) {
            return List.of();
        }

        Set<String> ratedUserIds = queryRatedUserIds(normalizedUserId);
        Set<String> metUserIds = snapshot.socialGraph().neighborsByUserId().getOrDefault(normalizedUserId, Set.of());
        Set<String> friendsInCommonCandidateIds = queryFriendsInCommonCandidateIds(
                normalizedUserId,
                snapshot.visibleGameUsers(),
                snapshot.socialGraph(),
                ratedUserIds);
        Map<String, Double> edgeWeightsByPairKey = queryAffinityEdgeWeights(List.of(normalizedUserId));
        HomeRankingContext rankingContext = new HomeRankingContext(
                activeUser,
                snapshot.latestActivityMsByUserId(),
                Instant.now().toEpochMilli());
        return snapshot.visibleGameUsers().stream()
                .filter(Objects::nonNull)
                .filter(this::isPublicGameUser)
                .filter(user -> !normalizedUserId.equals(normalizeId(user.getId())))
                .filter(user -> !metUserIds.contains(normalizeId(user.getId())))
                .filter(user -> !ratedUserIds.contains(normalizeId(user.getId())))
                .filter(user -> !friendsInCommonCandidateIds.contains(normalizeId(user.getId())))
                .sorted(homeUserComparator(normalizedUserId, edgeWeightsByPairKey, rankingContext))
                .toList();
    }

    public List<GameSocialCardCandidate> querySeparatedFriendCards(String activeUserId) {
        List<Users> users = orderedUsers();
        return querySeparatedFriendCards(activeUserId, users, buildActivitySocialGraph(), queryAffinityEdgeWeights(userIds(users)));
    }

    List<GameSocialCardCandidate> querySeparatedFriendCards(
            String activeUserId,
            List<Users> users,
            ActivitySocialGraph graph) {
        return querySeparatedFriendCards(activeUserId, users, graph, Map.of());
    }

    List<GameSocialCardCandidate> querySeparatedFriendCards(
            String activeUserId,
            List<Users> users,
            ActivitySocialGraph graph,
            Map<String, Double> edgeWeightsByPairKey) {
        String normalizedUserId = normalizeId(activeUserId);
        if (!StringUtils.hasText(normalizedUserId)) {
            return List.of();
        }

        Map<String, Users> usersById = indexUsersById(users);
        if (!isPublicGameUser(usersById.get(normalizedUserId))) {
            return List.of();
        }
        List<String> neighbors = new ArrayList<>(graph.neighborsByUserId().getOrDefault(normalizedUserId, Set.of()));
        neighbors = neighbors.stream()
                .filter(userId -> isInsideNetworkGameUser(usersById.get(userId)))
                .sorted((left, right) -> compareUsersForSuggestions(usersById.get(left), usersById.get(right)))
                .toList();

        Set<String> ratedPairKeys = queryRatedPairKeys(normalizedUserId);
        List<GameSocialCardCandidate> candidates = new ArrayList<>();
        for (int leftIndex = 0; leftIndex < neighbors.size(); leftIndex += 1) {
            String leftUserId = neighbors.get(leftIndex);
            for (int rightIndex = leftIndex + 1; rightIndex < neighbors.size(); rightIndex += 1) {
                String rightUserId = neighbors.get(rightIndex);
                if (!StringUtils.hasText(leftUserId)
                        || !StringUtils.hasText(rightUserId)
                        || leftUserId.equals(rightUserId)
                        || graph.hasDirectEdge(leftUserId, rightUserId)
                        || ratedPairKeys.contains(pairKey(leftUserId, rightUserId))) {
                    continue;
                }
                double score = separatedFriendsScore(
                        normalizedUserId,
                        leftUserId,
                        rightUserId,
                        usersById,
                        edgeWeightsByPairKey);
                String eventName = firstNonBlank(
                        graph.latestEventNameByEdgeKey().get(pairKey(normalizedUserId, leftUserId)),
                        graph.latestEventNameByEdgeKey().get(pairKey(normalizedUserId, rightUserId)),
                        "Separated friends");
                candidates.add(new GameSocialCardCandidate(
                        "separated-friends:" + normalizedUserId + ":" + pairKey(leftUserId, rightUserId),
                        leftUserId,
                        rightUserId,
                        "separated-friends",
                        null,
                        2,
                        eventName,
                        score));
            }
        }

        return candidates.stream()
                .sorted(Comparator
                        .comparingDouble(GameSocialCardCandidate::score).reversed()
                        .thenComparing(GameSocialCardCandidate::id))
                .toList();
    }

    public List<GameSocialCardCandidate> queryFriendsInCommonCards(String activeUserId) {
        List<Users> users = orderedUsers();
        return queryFriendsInCommonCards(activeUserId, users, buildActivitySocialGraph(), queryAffinityEdgeWeights(userIds(users)));
    }

    public List<GameSocialCardCandidate> queryOutsideNetworkCards(String activeUserId) {
        List<Users> users = orderedUsers();
        return queryOutsideNetworkCards(activeUserId, users, buildActivitySocialGraph());
    }

    List<GameSocialCardCandidate> queryFriendsInCommonCards(
            String activeUserId,
            List<Users> users,
            ActivitySocialGraph graph) {
        return queryFriendsInCommonCards(activeUserId, users, graph, Map.of());
    }

    List<GameSocialCardCandidate> queryFriendsInCommonCards(
            String activeUserId,
            List<Users> users,
            ActivitySocialGraph graph,
            Map<String, Double> edgeWeightsByPairKey) {
        String normalizedUserId = normalizeId(activeUserId);
        if (!StringUtils.hasText(normalizedUserId)) {
            return List.of();
        }

        Map<String, Users> usersById = indexUsersById(users);
        if (!isPublicGameUser(usersById.get(normalizedUserId))) {
            return List.of();
        }
        Set<String> activeNeighbors = graph.neighborsByUserId().getOrDefault(normalizedUserId, Set.of());
        if (activeNeighbors.isEmpty()) {
            return List.of();
        }

        Set<String> ratedUserIds = queryRatedUserIds(normalizedUserId);
        List<GameSocialCardCandidate> candidates = new ArrayList<>();
        for (Users user : users) {
            String candidateUserId = normalizeId(user.getId());
            if (!StringUtils.hasText(candidateUserId)
                    || normalizedUserId.equals(candidateUserId)
                    || activeNeighbors.contains(candidateUserId)
                    || ratedUserIds.contains(candidateUserId)
                    || !isPublicGameUser(user)) {
                continue;
            }

            Set<String> candidateNeighbors = graph.neighborsByUserId().getOrDefault(candidateUserId, Set.of());
            if (candidateNeighbors.isEmpty()) {
                continue;
            }

            List<String> bridges = activeNeighbors.stream()
                    .filter(candidateNeighbors::contains)
                    .filter(bridgeId -> isInsideNetworkGameUser(usersById.get(bridgeId)))
                    .sorted((left, right) -> compareUsersForSuggestions(usersById.get(left), usersById.get(right)))
                    .toList();
            if (bridges.isEmpty()) {
                continue;
            }

            String bridgeUserId = bridges.stream()
                    .max(Comparator
                            .comparingDouble((String bridgeId) -> bridgeSupportScore(
                                    normalizedUserId,
                                    candidateUserId,
                                    bridgeId,
                                    usersById,
                                    edgeWeightsByPairKey))
                            .thenComparing(bridgeId -> bridgeId))
                    .orElse(bridges.get(0));
            String eventName = firstNonBlank(
                    graph.latestEventNameByEdgeKey().get(pairKey(normalizedUserId, bridgeUserId)),
                    graph.latestEventNameByEdgeKey().get(pairKey(candidateUserId, bridgeUserId)),
                    "Friends in common");
            double score = friendsInCommonScore(
                    normalizedUserId,
                    candidateUserId,
                    bridges,
                    usersById,
                    edgeWeightsByPairKey);
            candidates.add(new GameSocialCardCandidate(
                    "friends-in-common:" + normalizedUserId + ":" + candidateUserId,
                    candidateUserId,
                    null,
                    "friends-in-common",
                    bridgeUserId,
                    bridges.size(),
                    eventName,
                    score));
        }

        return candidates.stream()
                .sorted(Comparator
                        .comparingDouble(GameSocialCardCandidate::score).reversed()
                        .thenComparing(GameSocialCardCandidate::id))
                .toList();
    }

    List<GameSocialCardCandidate> queryOutsideNetworkCards(
            String activeUserId,
            List<Users> users,
            ActivitySocialGraph graph) {
        String normalizedUserId = normalizeId(activeUserId);
        if (!StringUtils.hasText(normalizedUserId)) {
            return List.of();
        }

        Map<String, Users> usersById = indexUsersById(users);
        if (!isPublicGameUser(usersById.get(normalizedUserId))) {
            return List.of();
        }

        Set<String> activeNeighbors = graph.neighborsByUserId().getOrDefault(normalizedUserId, Set.of());
        Set<String> ratedPairKeys = queryRatedPairKeys(normalizedUserId);
        List<String> publicUserIds = (users == null ? List.<Users>of() : users).stream()
                .map(user -> normalizeId(user == null ? null : user.getId()))
                .filter(StringUtils::hasText)
                .filter(userId -> !normalizedUserId.equals(userId))
                .filter(userId -> !activeNeighbors.contains(userId))
                .filter(userId -> isPublicGameUser(usersById.get(userId)))
                .distinct()
                .sorted((left, right) -> compareUsersForSuggestions(usersById.get(left), usersById.get(right)))
                .toList();

        List<GameSocialCardCandidate> candidates = new ArrayList<>();
        for (int leftIndex = 0; leftIndex < publicUserIds.size(); leftIndex += 1) {
            String leftUserId = publicUserIds.get(leftIndex);
            for (int rightIndex = leftIndex + 1; rightIndex < publicUserIds.size(); rightIndex += 1) {
                String rightUserId = publicUserIds.get(rightIndex);
                if (!StringUtils.hasText(leftUserId)
                        || !StringUtils.hasText(rightUserId)
                        || leftUserId.equals(rightUserId)
                        || graph.hasDirectEdge(leftUserId, rightUserId)
                        || ratedPairKeys.contains(pairKey(leftUserId, rightUserId))) {
                    continue;
                }
                OrderedPair orderedPair = orderedPairUserIds(leftUserId, rightUserId, usersById);
                String orderedPairKey = pairKey(orderedPair.leftUserId(), orderedPair.rightUserId());
                double score = homePairDistanceScore(
                        normalizedUserId,
                        orderedPair.leftUserId(),
                        orderedPair.rightUserId(),
                        usersById)
                        + resolveUserAffinity(usersById.get(orderedPair.leftUserId()))
                        + resolveUserAffinity(usersById.get(orderedPair.rightUserId()));
                candidates.add(new GameSocialCardCandidate(
                        "outside-network:" + normalizedUserId + ":" + orderedPairKey,
                        orderedPair.leftUserId(),
                        orderedPair.rightUserId(),
                        null,
                        null,
                        null,
                        null,
                        score));
            }
        }

        return candidates.stream()
                .sorted(Comparator
                        .comparingDouble(GameSocialCardCandidate::score).reversed()
                        .thenComparing(GameSocialCardCandidate::id))
                .toList();
    }

    private Set<String> queryFriendsInCommonCandidateIds(
            String activeUserId,
            List<Users> users,
            ActivitySocialGraph graph,
            Set<String> ratedUserIds) {
        String normalizedUserId = normalizeId(activeUserId);
        if (!StringUtils.hasText(normalizedUserId)) {
            return Set.of();
        }

        Map<String, Users> usersById = indexUsersById(users);
        if (!isPublicGameUser(usersById.get(normalizedUserId))) {
            return Set.of();
        }

        Set<String> activeNeighbors = graph.neighborsByUserId().getOrDefault(normalizedUserId, Set.of());
        if (activeNeighbors.isEmpty()) {
            return Set.of();
        }

        Set<String> excludedRatedUserIds = ratedUserIds == null ? Set.of() : ratedUserIds;
        Set<String> candidateIds = new LinkedHashSet<>();
        for (Users user : users) {
            String candidateUserId = normalizeId(user == null ? null : user.getId());
            if (!StringUtils.hasText(candidateUserId)
                    || normalizedUserId.equals(candidateUserId)
                    || activeNeighbors.contains(candidateUserId)
                    || excludedRatedUserIds.contains(candidateUserId)
                    || !isPublicGameUser(user)) {
                continue;
            }

            Set<String> candidateNeighbors = graph.neighborsByUserId().getOrDefault(candidateUserId, Set.of());
            if (activeNeighbors.stream()
                    .filter(candidateNeighbors::contains)
                    .anyMatch(bridgeId -> isInsideNetworkGameUser(usersById.get(bridgeId)))) {
                candidateIds.add(candidateUserId);
            }
        }
        return candidateIds;
    }

    public List<UserDto> queryDemoUsers() {
        return orderedUsers().stream()
                .filter(Objects::nonNull)
                .map(this::toUserDto)
                .filter(Objects::nonNull)
                .toList();
    }

    List<Users> queryOrderedUserRecords() {
        return orderedUsers();
    }

    ActivitySocialGraph queryActivitySocialGraph() {
        return buildActivitySocialGraph();
    }

    @Cacheable(value = "demo_users", key = "'all'")
    public List<DemoUserListItemDto> queryDemoUserListItems() {
        return queryDemoUserListItems(null, "member");
    }

    public List<DemoUserListItemDto> queryDemoUserListItems(Integer limit) {
        return queryDemoUserListItems(limit, "member");
    }

    @Cacheable(value = "demo_users", key = "(#role == null ? 'member' : #role) + ':' + (#limit == null ? 'all' : #limit)")
    public List<DemoUserListItemDto> queryDemoUserListItems(Integer limit, String role) {
        String selectorRole = normalizeDemoSelectorRole(role);
        return usersRepository.findAllByOrderByNameAscUserIdAsc().stream()
                .filter(user -> isSelectableDemoUserDocument(user, selectorRole))
                .limit(resolveDemoUserListLimit(limit))
                .map(this::toDemoUserListItemDto)
                .filter(Objects::nonNull)
                .toList();
    }

    public List<UserDto> queryUsersByIds(Collection<String> userIds) {
        if (userIds == null || userIds.isEmpty()) {
            return List.of();
        }

        List<String> normalizedUserIds = userIds.stream()
                .map(this::normalizeId)
                .filter(StringUtils::hasText)
                .distinct()
                .toList();
        if (normalizedUserIds.isEmpty()) {
            return List.of();
        }

        Map<String, Users> usersById = usersRepository.findByUserIdIn(normalizedUserIds).stream()
                .filter(this::isUsableUserDocument)
                .collect(LinkedHashMap::new, (target, user) -> target.put(normalizeId(user.getId()), user), Map::putAll);

        return normalizedUserIds.stream()
                .map(usersById::get)
                .filter(Objects::nonNull)
                .map(this::toGameCardUserDto)
                .filter(Objects::nonNull)
                .toList();
    }

    public UserDto toUserDto(Users user) {
        return toUserDto(user, true);
    }

    UserDto toGameCardUserDto(Users user) {
        return toUserDto(user, false);
    }

    private UserDto toUserDto(Users user, boolean includeImpressions) {
        if (user == null) {
            return null;
        }
        return new UserDto(
                normalizeId(user.getId()),
                nullToEmpty(user.getName()),
                normalizeCount(user.getAge()),
                nullToEmpty(user.getBirthday()),
                nullToEmpty(user.getCity()),
                nullToEmpty(user.getHeight()),
                nullToEmpty(user.getPhysique()),
                normalizeStrings(user.getLanguages()),
                nullToEmpty(user.getHoroscope()),
                nullToEmpty(user.getInitials()),
                nullToEmpty(user.getGender()),
                nullToEmpty(user.getStatusText()),
                nullToEmpty(user.getHostTier()),
                nullToEmpty(user.getTraitLabel()),
                normalizeCount(user.getCompletion()),
                normalizeCount(user.getProfileFormVersion()),
                nullToEmpty(user.getHeadline()),
                nullToEmpty(user.getAbout()),
                user.getAffinity(),
                toLocationCoordinatesDto(user.getLocationCoordinates()),
                nullToEmpty(user.getPartitionKey()),
                normalizeStrings(user.getImages()),
                toProfileDetailsDto(user.getProfileDetails()),
                includeImpressions ? resolveMergedUserImpressions(user) : null,
                resolveProfileStatus(user),
                nullToEmpty(user.getPreviousProfileStatus()),
                nullToEmpty(user.getDeletedAtIso()),
                false,
                toUserActivitiesDto(user.getActivities()));
    }

    private boolean isCurrentRequestAdmin() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null) {
            return false;
        }
        return authentication.getAuthorities().stream()
                .anyMatch(authority -> "A".equals(authority.getAuthority()));
    }

    private DemoUserListItemDto toDemoUserListItemDto(Users user) {
        if (user == null) {
            return null;
        }
        return new DemoUserListItemDto(
                normalizeId(user.getId()),
                nullToEmpty(user.getName()),
                nullToEmpty(user.getCity()),
                nullToEmpty(user.getInitials()),
                normalizeUserListGender(user.getGender()),
                nullToEmpty(user.getStatusText()),
                normalizeCount(user.getCompletion()),
                normalizeCount(user.getProfileFormVersion()),
                resolveProfileStatus(user),
                nullToEmpty(user.getDeletedAtIso()));
    }

    public Users resolveCurrentUser(String requestedUserId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof FirebasePrincipal firebasePrincipal) {
            Users principalUser = firebasePrincipal.getUser();
            String principalUserId = principalUser != null
                    ? normalizeId(principalUser.getId())
                    : normalizeId(firebasePrincipal.getUserId());
            if (StringUtils.hasText(principalUserId)) {
                Users refreshedPrincipalUser = findUser(principalUserId);
                if (refreshedPrincipalUser != null) {
                    return refreshedPrincipalUser;
                }
            }
            if (isUsableUserDocument(principalUser)) {
                return principalUser;
            }
        }

        String normalizedRequestedUserId = normalizeId(requestedUserId);
        if (StringUtils.hasText(normalizedRequestedUserId)) {
            return findUser(normalizedRequestedUserId);
        }

        return null;
    }

    public String resolveSelectedUserId(String requestedUserId) {
        Users currentUser = resolveCurrentUser(requestedUserId);
        return currentUser == null ? null : normalizeId(currentUser.getId());
    }

    private Users findUser(String userId) {
        if (!StringUtils.hasText(userId)) {
            return null;
        }
        Users user = usersRepository.findByUserId(userId).orElse(null);
        return isUsableUserDocument(user) ? user : null;
    }

    private List<Users> orderedUsers() {
        return usersRepository.findAll().stream()
                .filter(this::isUsableUserDocument)
                .filter(Objects::nonNull)
                .sorted(userComparator())
                .toList();
    }

    private Map<String, String> profileTelemetryTags(Users user) {
        Map<String, String> tags = new LinkedHashMap<>();
        tags.put("profileFillPercent", Long.toString(profileFillPercent(user)));
        return tags;
    }

    private long profileFillPercent(Users user) {
        if (user == null) {
            return 0L;
        }
        Integer completion = user.getCompletion();
        if (completion != null && completion.intValue() >= 0) {
            return Math.max(0L, Math.min(100L, completion.longValue()));
        }

        int total = 0;
        int filled = 0;
        total++;
        filled += StringUtils.hasText(user.getName()) ? 1 : 0;
        total++;
        filled += user.getAge() != null || StringUtils.hasText(user.getBirthday()) ? 1 : 0;
        total++;
        filled += StringUtils.hasText(user.getGender()) ? 1 : 0;
        total++;
        filled += StringUtils.hasText(user.getCity()) ? 1 : 0;
        total++;
        filled += StringUtils.hasText(user.getHeadline()) ? 1 : 0;
        total++;
        filled += StringUtils.hasText(user.getAbout()) ? 1 : 0;
        total++;
        filled += user.getImages() != null && !user.getImages().isEmpty() ? 1 : 0;
        total++;
        filled += user.getProfileDetails() != null && !user.getProfileDetails().isEmpty() ? 1 : 0;
        total++;
        filled += user.getLanguages() != null && !user.getLanguages().isEmpty() ? 1 : 0;
        total++;
        filled += user.getLocationCoordinates() != null ? 1 : 0;
        return Math.round((filled * 100d) / Math.max(1, total));
    }

    private UserGameFilterPreferencesDto resolveFilterPreferences(String resolvedUserId, Users user) {
        if (!StringUtils.hasText(resolvedUserId) || user == null) {
            return null;
        }
        UserGameFilterPreferencesDto filterPreferences = queryStoredFilterPreferences(resolvedUserId);
        return filterPreferences != null ? filterPreferences : buildDefaultFilterPreferences(user);
    }

    private Comparator<Users> userComparator() {
        return Comparator.comparing(Users::getAffinity, Comparator.nullsLast(Comparator.reverseOrder()))
                .thenComparing(user -> normalizeId(user.getId()));
    }

    private Comparator<Users> homeUserComparator(
            String activeUserId,
            Map<String, Double> edgeWeightsByPairKey,
            HomeRankingContext rankingContext) {
        return Comparator
                .comparingDouble((Users user) -> homeUserScore(activeUserId, user, edgeWeightsByPairKey, rankingContext))
                .reversed()
                .thenComparing(user -> normalizeId(user == null ? null : user.getId()));
    }

    private double homeUserScore(
            String activeUserId,
            Users user,
            Map<String, Double> edgeWeightsByPairKey,
            HomeRankingContext rankingContext) {
        String candidateUserId = normalizeId(user == null ? null : user.getId());
        return edgeWeight(activeUserId, candidateUserId, edgeWeightsByPairKey) * HOME_KNOWN_EDGE_SCORE
                + resolveUserAffinity(user)
                + homeDistanceScore(rankingContext == null ? null : rankingContext.activeUser(), user)
                + homeFreshnessScore(candidateUserId, rankingContext);
    }

    private Map<String, Users> indexUsersById(List<Users> users) {
        return (users == null ? List.<Users>of() : users).stream()
                .filter(Objects::nonNull)
                .collect(LinkedHashMap::new, (target, user) -> target.put(normalizeId(user.getId()), user), Map::putAll);
    }

    private List<String> userIds(List<Users> users) {
        return (users == null ? List.<Users>of() : users).stream()
                .map(user -> normalizeId(user == null ? null : user.getId()))
                .filter(StringUtils::hasText)
                .distinct()
                .toList();
    }

    private Map<String, Double> queryAffinityEdgeWeights(Collection<String> userIds) {
        List<String> normalizedUserIds = userIds == null
                ? List.of()
                : userIds.stream()
                        .map(this::normalizeId)
                        .filter(StringUtils::hasText)
                        .distinct()
                        .toList();
        if (normalizedUserIds.isEmpty()) {
            return Map.of();
        }

        String cacheKey = String.join("\n", normalizedUserIds);
        long nowMs = System.currentTimeMillis();
        CacheEntry<Map<String, Double>> cached = affinityWeightsCacheByUserIdsKey.get(cacheKey);
        if (cached != null) {
            if (cached.expiresAtMs() > nowMs) {
                return cached.value();
            }
            affinityWeightsCacheByUserIdsKey.remove(cacheKey, cached);
        }

        Map<String, Double> weightsByPairKey = new LinkedHashMap<>();
        for (UserAffinityEdge edge : userAffinityEdgesRepository.findRelevantByUserIds(normalizedUserIds)) {
            String leftUserId = normalizeId(edge == null ? null : edge.getLeftUserId());
            String rightUserId = normalizeId(edge == null ? null : edge.getRightUserId());
            if (!StringUtils.hasText(leftUserId) || !StringUtils.hasText(rightUserId) || leftUserId.equals(rightUserId)) {
                continue;
            }
            double edgeWeight = resolveAffinityEdgeWeight(edge);
            if (edgeWeight <= 0d) {
                continue;
            }
            String key = pairKey(leftUserId, rightUserId);
            Double existingWeight = weightsByPairKey.get(key);
            if (existingWeight == null || edgeWeight > existingWeight.doubleValue()) {
                weightsByPairKey.put(key, edgeWeight);
            }
        }
        Map<String, Double> resolved = Map.copyOf(weightsByPairKey);
        affinityWeightsCacheByUserIdsKey.put(cacheKey, new CacheEntry<>(resolved, nowMs + USER_READ_SNAPSHOT_CACHE_TTL_MS));
        return resolved;
    }

    private Map<String, Long> queryLatestHomeActivityMsByUserId() {
        Map<String, Long> latestByUserId = new LinkedHashMap<>();
        for (UserRate record : userRatesRepository.findAll()) {
            if (record == null) {
                continue;
            }
            long timestampMs = parseIsoMillis(firstNonBlank(
                    record.getUpdatedDate(),
                    record.getCreatedDate()));
            if (timestampMs <= 0L) {
                continue;
            }
            rememberLatestActivityMs(latestByUserId, record.getOwnerUserId(), timestampMs);
            rememberLatestActivityMs(latestByUserId, record.getRelatedUserId(), timestampMs);
            rememberLatestActivityMs(latestByUserId, record.getSecondaryRelatedUserId(), timestampMs);
        }
        for (ActivityMember member : activityMembersRepository.findAll()) {
            if (member == null) {
                continue;
            }
            long timestampMs = parseIsoMillis(firstNonBlank(
                    member.getActionAtIso(),
                    member.getUpdatedDate(),
                    member.getCreatedDate()));
            if (timestampMs <= 0L) {
                continue;
            }
            rememberLatestActivityMs(latestByUserId, member.getUserId(), timestampMs);
        }
        return latestByUserId;
    }

    private void rememberLatestActivityMs(Map<String, Long> latestByUserId, String userId, long timestampMs) {
        String normalizedUserId = normalizeId(userId);
        if (!StringUtils.hasText(normalizedUserId) || timestampMs <= 0L) {
            return;
        }
        Long currentMs = latestByUserId.get(normalizedUserId);
        if (currentMs == null || timestampMs > currentMs.longValue()) {
            latestByUserId.put(normalizedUserId, timestampMs);
        }
    }

    private double homeDistanceScore(Users activeUser, Users candidateUser) {
        return homeDistanceBucketScore(activeUser, candidateUser, HOME_DISTANCE_SCORE);
    }

    private double homeDistanceBucketScore(Users left, Users right, double scoreMultiplier) {
        Double distanceMeters = distanceMeters(left, right);
        if (distanceMeters == null) {
            return 0d;
        }
        double distanceKm = Math.max(0d, distanceMeters.doubleValue() / 1000d);
        double bucketIndex = Math.floor(distanceKm / HOME_DISTANCE_BUCKET_KM);
        double signal = Math.max(0d, 1d - (Math.min(bucketIndex, HOME_DISTANCE_MAX_BUCKETS) / HOME_DISTANCE_MAX_BUCKETS));
        return signal * scoreMultiplier;
    }

    private Double distanceMeters(Users left, Users right) {
        if (left == null || right == null || left.getLocationCoordinates() == null || right.getLocationCoordinates() == null) {
            return null;
        }
        Double leftLat = left.getLocationCoordinates().latitude();
        Double leftLon = left.getLocationCoordinates().longitude();
        Double rightLat = right.getLocationCoordinates().latitude();
        Double rightLon = right.getLocationCoordinates().longitude();
        if (leftLat == null || leftLon == null || rightLat == null || rightLon == null
                || !Double.isFinite(leftLat) || !Double.isFinite(leftLon)
                || !Double.isFinite(rightLat) || !Double.isFinite(rightLon)) {
            return null;
        }
        double earthRadiusMeters = 6371000d;
        double latitudeDelta = Math.toRadians(rightLat - leftLat);
        double longitudeDelta = Math.toRadians(rightLon - leftLon);
        double leftLatitude = Math.toRadians(leftLat);
        double rightLatitude = Math.toRadians(rightLat);
        double haversine = Math.sin(latitudeDelta / 2d) * Math.sin(latitudeDelta / 2d)
                + Math.cos(leftLatitude) * Math.cos(rightLatitude)
                * Math.sin(longitudeDelta / 2d) * Math.sin(longitudeDelta / 2d);
        return earthRadiusMeters * 2d * Math.atan2(Math.sqrt(haversine), Math.sqrt(1d - haversine));
    }

    private double homeFreshnessScore(String candidateUserId, HomeRankingContext rankingContext) {
        if (rankingContext == null || rankingContext.latestActivityMsByUserId().isEmpty()) {
            return 0d;
        }
        Long latestActivityMs = rankingContext.latestActivityMsByUserId().get(normalizeId(candidateUserId));
        if (latestActivityMs == null || latestActivityMs.longValue() <= 0L) {
            return 0d;
        }
        long ageMs = Math.max(0L, rankingContext.nowMs() - latestActivityMs.longValue());
        double ageDays = ageMs / (double) MILLIS_PER_DAY;
        double signal = 1d / (1d + (ageDays / HOME_FRESHNESS_HALF_LIFE_DAYS));
        return signal * HOME_FRESHNESS_SCORE;
    }

    private long parseIsoMillis(String value) {
        try {
            String normalized = normalizeOptionalText(value);
            return StringUtils.hasText(normalized) ? Instant.parse(normalized).toEpochMilli() : 0L;
        } catch (Exception exception) {
            return 0L;
        }
    }

    private double resolveAffinityEdgeWeight(UserAffinityEdge edge) {
        if (edge == null) {
            return 0d;
        }
        Double edgeWeight = edge.getEdgeWeight();
        if (edgeWeight == null || !Double.isFinite(edgeWeight) || edgeWeight <= 0d) {
            edgeWeight = edge.getAffinityScore();
        }
        if (edgeWeight == null || !Double.isFinite(edgeWeight)) {
            return 0d;
        }
        return Math.max(0d, Math.min(1d, edgeWeight));
    }

    private boolean isUsableUserDocument(Users user) {
        if (user == null || !StringUtils.hasText(normalizeId(user.getId()))) {
            return false;
        }
        return PROFILE_STATUS_ONBOARDING.equals(resolveProfileStatus(user))
                || StringUtils.hasText(user.getName())
                || user.getAge() != null
                || user.getLocationCoordinates() != null
                || !normalizeStrings(user.getImages()).isEmpty();
    }

    private boolean isSelectableDemoUserDocument(Users user) {
        return isSelectableDemoUserDocument(user, "member");
    }

    private boolean isSelectableDemoUserDocument(Users user, String selectorRole) {
        return isUsableUserDocument(user)
                && !PROFILE_STATUS_ONBOARDING.equals(resolveProfileStatus(user))
                && ("admin".equals(selectorRole) == isDemoAdminUserDocument(user));
    }

    private boolean isDemoAdminUserDocument(Users user) {
        return user != null
                && (normalizeId(user.getId()).startsWith("admin-demo-")
                        || "admin".equalsIgnoreCase(safeText(user.getHostTier())));
    }

    private String normalizeDemoSelectorRole(String role) {
        return "admin".equalsIgnoreCase(safeText(role)) ? "admin" : "member";
    }

    boolean isPublicGameUser(Users user) {
        return isUsableUserDocument(user)
                && "public".equals(resolveProfileStatus(user));
    }

    boolean isInsideNetworkGameUser(Users user) {
        return isUsableUserDocument(user)
                && INSIDE_NETWORK_GAME_PROFILE_STATUSES.contains(resolveProfileStatus(user));
    }

    boolean isActivityRateVisibleUser(Users user) {
        return isUsableUserDocument(user)
                && !HARD_HIDDEN_PROFILE_STATUSES.contains(resolveProfileStatus(user));
    }

    private String normalizeUserListGender(String gender) {
        return "man".equalsIgnoreCase(safeText(gender)) ? "man" : "woman";
    }

    private UserGameFilterPreferencesDto queryStoredFilterPreferences(String userId) {
        if (!StringUtils.hasText(userId)) {
            return null;
        }
        return userFilterPreferencesRepository.findByUserId(userId)
                .map(this::toUserGameFilterPreferencesDto)
                .orElse(null);
    }

    private Set<String> queryRatedUserIds(String raterUserId) {
        String normalizedRaterUserId = normalizeId(raterUserId);
        if (!StringUtils.hasText(normalizedRaterUserId)) {
            return Set.of();
        }
        Set<String> ratedUserIds = new LinkedHashSet<>();
        for (UserRate record : userRatesRepository.findByOwnerUserId(normalizedRaterUserId)) {
            if (!hasOwnRecordedActivityRate(record, normalizedRaterUserId)) {
                continue;
            }
            addRatedUserId(ratedUserIds, normalizedRaterUserId, record.getRelatedUserId());
            addRatedUserId(ratedUserIds, normalizedRaterUserId, record.getSecondaryRelatedUserId());
        }
        return Set.copyOf(ratedUserIds);
    }

    private Set<String> queryRatedPairKeys(String raterUserId) {
        Set<String> ratedPairKeys = new LinkedHashSet<>();
        if (!StringUtils.hasText(raterUserId)) {
            return ratedPairKeys;
        }
        for (UserRate record : userRatesRepository.findByOwnerUserIdAndMode(raterUserId, "pair")) {
            if (!hasOwnRecordedActivityRate(record, raterUserId)) {
                continue;
            }
            String firstUserId = normalizeId(record.getRelatedUserId());
            String secondUserId = normalizeId(record.getSecondaryRelatedUserId());
            if (!StringUtils.hasText(firstUserId)
                    || !StringUtils.hasText(secondUserId)
                    || firstUserId.equals(secondUserId)) {
                continue;
            }
            ratedPairKeys.add(pairKey(firstUserId, secondUserId));
        }
        return ratedPairKeys;
    }

    private void addRatedUserId(Set<String> ratedUserIds, String ownerUserId, String candidateUserId) {
        String normalizedCandidateUserId = normalizeId(candidateUserId);
        if (StringUtils.hasText(normalizedCandidateUserId) && !ownerUserId.equals(normalizedCandidateUserId)) {
            ratedUserIds.add(normalizedCandidateUserId);
        }
    }

    private boolean hasOwnRecordedActivityRate(UserRate record, String ownerUserId) {
        if (record == null || !ownerUserId.equals(normalizeId(record.getOwnerUserId()))) {
            return false;
        }
        if (Boolean.TRUE.equals(record.getMet())) {
            return true;
        }
        Integer scoreGiven = record.getScoreGiven();
        return scoreGiven != null && scoreGiven > 0;
    }

    private ActivitySocialGraph buildActivitySocialGraph() {
        Map<String, Set<String>> neighborsByUserId = new LinkedHashMap<>();
        Map<String, String> latestEventNameByEdgeKey = new LinkedHashMap<>();
        Map<String, Long> latestTimestampByEdgeKey = new LinkedHashMap<>();
        Map<String, List<ActivityMember>> acceptedMembersByOwnerKey = new LinkedHashMap<>();

        for (ActivityMember member : activityMembersRepository.findAll()) {
            if (member == null
                    || !isSocialGraphMemberOwner(member.getOwnerType())
                    || !STATUS_ACCEPTED.equals(safeText(member.getStatus()))) {
                continue;
            }
            String ownerId = normalizeId(member.getOwnerId());
            String userId = normalizeId(member.getUserId());
            if (!StringUtils.hasText(ownerId) || !StringUtils.hasText(userId)) {
                continue;
            }
            String ownerKey = safeText(member.getOwnerType()) + ":" + ownerId;
            acceptedMembersByOwnerKey.computeIfAbsent(ownerKey, ignored -> new ArrayList<>()).add(member);
        }

        for (List<ActivityMember> members : acceptedMembersByOwnerKey.values()) {
            for (int leftIndex = 0; leftIndex < members.size(); leftIndex += 1) {
                ActivityMember left = members.get(leftIndex);
                for (int rightIndex = leftIndex + 1; rightIndex < members.size(); rightIndex += 1) {
                    ActivityMember right = members.get(rightIndex);
                    registerSocialEdge(
                            neighborsByUserId,
                            latestEventNameByEdgeKey,
                            latestTimestampByEdgeKey,
                            normalizeId(left.getUserId()),
                            normalizeId(right.getUserId()),
                            firstNonBlank(left.getMetWhere(), right.getMetWhere()),
                            Math.max(resolveMemberRecordTimestampMs(left), resolveMemberRecordTimestampMs(right)));
                }
            }
        }

        return new ActivitySocialGraph(neighborsByUserId, latestEventNameByEdgeKey);
    }

    private boolean isSocialGraphMemberOwner(String ownerType) {
        String normalizedOwnerType = safeText(ownerType);
        return OWNER_TYPE_EVENT.equals(normalizedOwnerType)
                || "subEvent".equals(normalizedOwnerType)
                || "group".equals(normalizedOwnerType);
    }

    private GameStackSnapshot resolveGameStackSnapshot() {
        long nowMs = System.currentTimeMillis();
        CacheEntry<GameStackSnapshot> cached = gameStackSnapshotCache;
        if (cached != null && cached.expiresAtMs() > nowMs) {
            return cached.value();
        }

        synchronized (gameStackSnapshotCacheLock) {
            cached = gameStackSnapshotCache;
            if (cached != null && cached.expiresAtMs() > nowMs) {
                return cached.value();
            }

            List<Users> visibleGameUsers = usersRepository.findByProfileStatusIn(HOME_GAME_PROFILE_STATUSES).stream()
                    .filter(Objects::nonNull)
                    .filter(this::isUsableUserDocument)
                    .toList();
            GameStackSnapshot snapshot = new GameStackSnapshot(
                    List.copyOf(visibleGameUsers),
                    indexUsersById(visibleGameUsers),
                    buildActivitySocialGraph(),
                    Map.copyOf(queryLatestHomeActivityMsByUserId()));
            gameStackSnapshotCache = new CacheEntry<>(snapshot, nowMs + USER_READ_SNAPSHOT_CACHE_TTL_MS);
            return snapshot;
        }
    }

    private void registerSocialEdge(
            Map<String, Set<String>> neighborsByUserId,
            Map<String, String> latestEventNameByEdgeKey,
            Map<String, Long> latestTimestampByEdgeKey,
            String leftUserId,
            String rightUserId,
            String eventName,
            long happenedAtMs) {
        if (!StringUtils.hasText(leftUserId)
                || !StringUtils.hasText(rightUserId)
                || leftUserId.equals(rightUserId)) {
            return;
        }
        neighborsByUserId.computeIfAbsent(leftUserId, ignored -> new LinkedHashSet<>()).add(rightUserId);
        neighborsByUserId.computeIfAbsent(rightUserId, ignored -> new LinkedHashSet<>()).add(leftUserId);

        String normalizedEventName = normalizeOptionalText(eventName);
        if (!StringUtils.hasText(normalizedEventName)) {
            return;
        }
        String edgeKey = pairKey(leftUserId, rightUserId);
        Long currentMs = latestTimestampByEdgeKey.get(edgeKey);
        if (currentMs == null || happenedAtMs >= currentMs.longValue()) {
            latestTimestampByEdgeKey.put(edgeKey, happenedAtMs);
            latestEventNameByEdgeKey.put(edgeKey, normalizedEventName);
        }
    }

    private long resolveMemberRecordTimestampMs(ActivityMember member) {
        try {
            return Instant.parse(firstNonBlank(
                    member == null ? null : member.getActionAtIso(),
                    member == null ? null : member.getMetAtIso(),
                    member == null ? null : member.getUpdatedDate(),
                    member == null ? null : member.getCreatedDate(),
                    Instant.EPOCH.toString())).toEpochMilli();
        } catch (Exception exception) {
            return 0L;
        }
    }

    private int compareUsersForSuggestions(Users left, Users right) {
        double affinityDelta = resolveUserAffinity(right) - resolveUserAffinity(left);
        if (affinityDelta > 0d) {
            return 1;
        }
        if (affinityDelta < 0d) {
            return -1;
        }
        return normalizeId(left == null ? null : left.getId()).compareTo(normalizeId(right == null ? null : right.getId()));
    }

    private double separatedFriendsScore(
            String activeUserId,
            String leftUserId,
            String rightUserId,
            Map<String, Users> usersById,
            Map<String, Double> edgeWeightsByPairKey) {
        return edgeWeight(leftUserId, rightUserId, edgeWeightsByPairKey) * HOME_KNOWN_EDGE_SCORE
                + edgeWeight(activeUserId, leftUserId, edgeWeightsByPairKey) * HOME_BRIDGE_EDGE_SCORE
                + edgeWeight(activeUserId, rightUserId, edgeWeightsByPairKey) * HOME_BRIDGE_EDGE_SCORE
                + homePairDistanceScore(activeUserId, leftUserId, rightUserId, usersById)
                + resolveUserAffinity(usersById.get(leftUserId))
                + resolveUserAffinity(usersById.get(rightUserId));
    }

    private double homePairDistanceScore(
            String activeUserId,
            String leftUserId,
            String rightUserId,
            Map<String, Users> usersById) {
        Users activeUser = usersById.get(normalizeId(activeUserId));
        Users leftUser = usersById.get(normalizeId(leftUserId));
        Users rightUser = usersById.get(normalizeId(rightUserId));
        double pairDistanceScore = homeDistanceBucketScore(leftUser, rightUser, HOME_DISTANCE_SCORE);
        double triangleDistanceScore = (
                homeDistanceBucketScore(activeUser, leftUser, HOME_DISTANCE_SCORE)
                        + homeDistanceBucketScore(activeUser, rightUser, HOME_DISTANCE_SCORE))
                / 2d;
        return pairDistanceScore + (triangleDistanceScore * 0.35d);
    }

    private double friendsInCommonScore(
            String activeUserId,
            String candidateUserId,
            List<String> bridgeUserIds,
            Map<String, Users> usersById,
            Map<String, Double> edgeWeightsByPairKey) {
        double bestBridgeSupport = bridgeUserIds == null
                ? 0d
                : bridgeUserIds.stream()
                        .mapToDouble(bridgeId -> bridgeSupportScore(activeUserId, candidateUserId, bridgeId, usersById, edgeWeightsByPairKey))
                        .max()
                        .orElse(0d);
        int bridgeCount = bridgeUserIds == null ? 0 : bridgeUserIds.size();
        return bridgeCount * HOME_BRIDGE_COUNT_SCORE
                + edgeWeight(activeUserId, candidateUserId, edgeWeightsByPairKey) * HOME_KNOWN_EDGE_SCORE
                + bestBridgeSupport
                + homeDistanceScore(usersById.get(normalizeId(activeUserId)), usersById.get(candidateUserId))
                + resolveUserAffinity(usersById.get(candidateUserId));
    }

    private double bridgeSupportScore(
            String activeUserId,
            String candidateUserId,
            String bridgeUserId,
            Map<String, Users> usersById,
            Map<String, Double> edgeWeightsByPairKey) {
        return edgeWeight(activeUserId, bridgeUserId, edgeWeightsByPairKey) * HOME_BRIDGE_EDGE_SCORE
                + edgeWeight(candidateUserId, bridgeUserId, edgeWeightsByPairKey) * HOME_BRIDGE_EDGE_SCORE
                + resolveUserAffinity(usersById.get(bridgeUserId));
    }

    private double edgeWeight(String leftUserId, String rightUserId, Map<String, Double> edgeWeightsByPairKey) {
        String normalizedLeft = normalizeId(leftUserId);
        String normalizedRight = normalizeId(rightUserId);
        if (!StringUtils.hasText(normalizedLeft)
                || !StringUtils.hasText(normalizedRight)
                || normalizedLeft.equals(normalizedRight)
                || edgeWeightsByPairKey == null
                || edgeWeightsByPairKey.isEmpty()) {
            return 0d;
        }
        return Math.max(0d, Math.min(1d, edgeWeightsByPairKey.getOrDefault(pairKey(normalizedLeft, normalizedRight), 0d)));
    }

    private double resolveUserAffinity(Users user) {
        if (user == null || user.getAffinity() == null || !Double.isFinite(user.getAffinity())) {
            return 0d;
        }
        return Math.max(0d, user.getAffinity());
    }

    private OrderedPair orderedPairUserIds(
            String leftUserId,
            String rightUserId,
            Map<String, Users> usersById) {
        Users leftUser = usersById.get(normalizeId(leftUserId));
        Users rightUser = usersById.get(normalizeId(rightUserId));
        if ("woman".equals(safeText(leftUser == null ? null : leftUser.getGender()))
                && !"woman".equals(safeText(rightUser == null ? null : rightUser.getGender()))) {
            return new OrderedPair(leftUserId, rightUserId);
        }
        if ("woman".equals(safeText(rightUser == null ? null : rightUser.getGender()))
                && !"woman".equals(safeText(leftUser == null ? null : leftUser.getGender()))) {
            return new OrderedPair(rightUserId, leftUserId);
        }
        return normalizeId(leftUserId).compareTo(normalizeId(rightUserId)) <= 0
                ? new OrderedPair(leftUserId, rightUserId)
                : new OrderedPair(rightUserId, leftUserId);
    }

    private String pairKey(String leftUserId, String rightUserId) {
        String normalizedLeft = normalizeId(leftUserId);
        String normalizedRight = normalizeId(rightUserId);
        if (normalizedLeft.compareTo(normalizedRight) <= 0) {
            return normalizedLeft + ":" + normalizedRight;
        }
        return normalizedRight + ":" + normalizedLeft;
    }

    private String firstNonBlank(String... values) {
        for (String value : values) {
            String normalized = normalizeOptionalText(value);
            if (StringUtils.hasText(normalized)) {
                return normalized;
            }
        }
        return null;
    }

    private UserGameFilterPreferencesDto buildDefaultFilterPreferences(Users user) {
        return new UserGameFilterPreferencesDto(
                18,
                120,
                40,
                250,
                List.of(),
                List.of(),
                List.of(),
                List.of(),
                List.of(),
                List.of(),
                List.of(),
                List.of(),
                List.of(),
                List.of(),
                List.of(),
                List.of(),
                List.of(),
                List.of(),
                List.of(),
                List.of(),
                List.of());
    }

    private UserMenuCountersDto buildMenuCounters(Users user) {
        Users.UserActivitiesRecord activities = user.getActivities();
        return new UserMenuCountersDto(
                activities == null ? 0 : normalizeCount(activities.game()),
                activities == null ? 0 : normalizeCount(activities.chat()),
                activities == null ? 0 : normalizeCount(activities.invitations()),
                activities == null ? 0 : normalizeCount(activities.events()),
                activities == null ? 0 : normalizeCount(activities.hosting()),
                activities == null ? 0 : normalizeCount(activities.cars()),
                activities == null ? 0 : normalizeCount(activities.accommodation()),
                activities == null ? 0 : normalizeCount(activities.supplies()),
                activities == null ? 0 : normalizeCount(activities.tickets()),
                activities == null ? 0 : normalizeCount(activities.contacts()),
                activities == null ? 0 : normalizeCount(activities.feedback()),
                toUserEventCountersDto(activities == null ? null : activities.event()),
                toUserAssetCountersDto(activities == null ? null : activities.asset()),
                toUserEventFeedbackCountersDto(activities == null ? null : activities.eventFeedback()),
                activities == null ? 0 : normalizeCount(activities.adminJobs()),
                activities == null ? 0 : normalizeCount(activities.adminMetrics()));
    }

    private UserMenuCountersDto emptyMenuCounters() {
        return new UserMenuCountersDto(
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                new UserEventCountersDto(0, 0, 0, 0, 0, 0, 0),
                new UserAssetCountersDto(0, 0, 0, 0),
                new UserEventFeedbackCountersDto(0, 0, 0, 0),
                0, 0);
    }

    private String adminDisplayName(String email) {
        String normalizedEmail = safeText(email);
        if (!StringUtils.hasText(normalizedEmail)) {
            return "Admin";
        }
        int atIndex = normalizedEmail.indexOf('@');
        String localPart = atIndex > 0 ? normalizedEmail.substring(0, atIndex) : normalizedEmail;
        String normalizedName = localPart.replaceAll("[^A-Za-z0-9]+", " ").trim();
        return StringUtils.hasText(normalizedName) ? normalizedName : "Admin";
    }

    private String adminInitials(String name) {
        String[] words = safeText(name).split("\\s+");
        List<String> usableWords = java.util.Arrays.stream(words)
                .filter(StringUtils::hasText)
                .toList();
        if (usableWords.isEmpty()) {
            return "A";
        }
        if (usableWords.size() == 1) {
            String word = usableWords.get(0);
            return word.substring(0, Math.min(2, word.length())).toUpperCase();
        }
        return (usableWords.get(0).substring(0, 1) + usableWords.get(1).substring(0, 1)).toUpperCase();
    }

    private Users mergeUserDocument(Users current, UserDto user) {
        Users document = current == null ? new Users() : current;
        document.setMongoId(current != null && StringUtils.hasText(current.getMongoId()) ? current.getMongoId() : new ObjectId().toHexString());
        document.setSyncKey(current != null && StringUtils.hasText(current.getSyncKey()) ? current.getSyncKey() : UUID.randomUUID().toString());
        document.setUserId(normalizeId(user.id()));
        document.setEmail(resolveStoredEmail(normalizeId(user.id()), current == null ? null : current.getEmail()));
        document.setName(nullToEmpty(user.name()));
        document.setAge(normalizeCount(user.age()));
        document.setBirthday(nullToEmpty(user.birthday()));
        document.setCity(nullToEmpty(user.city()));
        document.setHeight(nullToEmpty(user.height()));
        document.setPhysique(nullToEmpty(user.physique()));
        document.setLanguages(normalizeStrings(user.languages()));
        document.setHoroscope(nullToEmpty(user.horoscope()));
        document.setInitials(nullToEmpty(user.initials()));
        document.setGender(nullToEmpty(user.gender()));
        document.setStatusText(nullToEmpty(user.statusText()));
        document.setHostTier(nullToEmpty(user.hostTier()));
        document.setTraitLabel(nullToEmpty(user.traitLabel()));
        document.setCompletion(normalizeCount(user.completion()));
        document.setProfileFormVersion(normalizeCount(user.profileFormVersion()));
        document.setHeadline(nullToEmpty(user.headline()));
        document.setAbout(nullToEmpty(user.about()));
        document.setAffinity(absoluteAffinityService.resolveUserAffinity(user));
        document.setLocationCoordinates(toLocationCoordinatesRecord(user.locationCoordinates()));
        String resolvedPartitionKey = countryPartitionService.resolvePartitionKey(user.locationCoordinates());
        if (regionSecurityProperties.isEnabled() && user.locationCoordinates() != null && !StringUtils.hasText(resolvedPartitionKey)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, INELIGIBLE_REGION_MESSAGE);
        }
        document.setPartitionKey(resolveStoredPartitionKey(
                user.locationCoordinates(),
                current == null ? null : current.getPartitionKey(),
                current));
        document.setImages(normalizeStrings(user.images()));
        document.setProfileDetails(toProfileDetailRecords(user.profileDetails()));
        document.setImpressions(toUserImpressionsRecord(user.impressions()));
        boolean reactivatingDeletedUser = current != null
                && "D".equalsIgnoreCase(safeText(current.getStatus()))
                && !"deleted".equals(safeText(user.profileStatus()));
        String previousProfileStatus = current == null ? "" : safeText(current.getPreviousProfileStatus());
        if ("deleted".equals(safeText(user.profileStatus()))) {
            previousProfileStatus = StringUtils.hasText(user.previousProfileStatus())
                    ? safeText(user.previousProfileStatus())
                    : resolveProfileStatus(current);
        } else if (reactivatingDeletedUser) {
            previousProfileStatus = "";
        }
        String status = current != null && "D".equalsIgnoreCase(safeText(current.getStatus())) && !reactivatingDeletedUser
                ? current.getStatus()
                : resolveStatusCode(user.profileStatus(), current == null ? null : current.getStatus());
        document.setStatus(status);
        String resolvedProfileStatus = resolveProfileStatus(status, user.profileStatus());
        document.setProfileStatus(resolvedProfileStatus);
        document.setPreviousProfileStatus(previousProfileStatus);
        if ("D".equalsIgnoreCase(safeText(status))) {
            document.setDeletedAtIso(StringUtils.hasText(user.deletedAtIso())
                    ? user.deletedAtIso()
                    : (current == null ? Instant.now().toString() : current.getDeletedAtIso()));
        } else if (PROFILE_STATUS_ONBOARDING.equals(resolvedProfileStatus)) {
            document.setDeletedAtIso(StringUtils.hasText(user.deletedAtIso())
                    ? user.deletedAtIso()
                    : (current != null && StringUtils.hasText(current.getDeletedAtIso())
                            ? current.getDeletedAtIso()
                            : Instant.now().toString()));
        } else {
            document.setDeletedAtIso(null);
        }
        document.setActivities(current == null ? toUserActivitiesRecord(user.activities()) : current.getActivities());
        return document;
    }

    private Users syncCurrentUserEmail(Users user) {
        if (user == null) {
            return null;
        }
        String resolvedEmail = resolveAuthenticatedEmailForUser(normalizeId(user.getId()));
        if (!StringUtils.hasText(resolvedEmail) || Objects.equals(safeText(user.getEmail()), resolvedEmail)) {
            return user;
        }
        user.setEmail(resolvedEmail);
        return usersRepository.save(user);
    }

    void evictUserReadCaches(Collection<String> userIds) {
        for (String userId : userIds == null ? List.<String>of() : userIds) {
            evictUserReadCaches(userId);
        }
    }

    void evictUserReadCaches(String userId) {
        String normalizedUserId = normalizeId(userId);
        if (!StringUtils.hasText(normalizedUserId)) {
            return;
        }
        userImpressionsCacheByUserId.remove(normalizedUserId);
        affinityWeightsCacheByUserIdsKey.clear();
        gameStackSnapshotCache = null;
    }

    private Users syncComputedUserPartition(Users user) {
        if (user == null) {
            return null;
        }

        if (StringUtils.hasText(safeText(user.getPartitionKey()))) {
            return user;
        }

        String resolvedPartitionKey = resolveStoredPartitionKey(
                toLocationCoordinatesDto(user.getLocationCoordinates()),
                null,
                user);
        if (Objects.equals(nullToEmpty(user.getPartitionKey()), nullToEmpty(resolvedPartitionKey))) {
            return user;
        }

        user.setPartitionKey(resolvedPartitionKey);
        return usersRepository.save(user);
    }

    private String resolveStoredPartitionKey(
            LocationCoordinatesDto coordinates,
            String currentPartitionKey,
            Users partitionOwner) {
        String resolvedPartitionKey = countryPartitionService.resolvePartitionKey(coordinates);
        if (StringUtils.hasText(resolvedPartitionKey)) {
            return resolvedPartitionKey;
        }

        String normalizedCurrentPartitionKey = safeText(currentPartitionKey);
        if (StringUtils.hasText(normalizedCurrentPartitionKey)) {
            return normalizedCurrentPartitionKey;
        }

        return isSeedLikeHungaryUser(partitionOwner) ? DEFAULT_SEED_PARTITION_KEY : null;
    }

    private String resolveStoredEmail(String userId, String fallbackEmail) {
        String resolvedPrincipalEmail = resolveAuthenticatedEmailForUser(userId);
        if (StringUtils.hasText(resolvedPrincipalEmail)) {
            return resolvedPrincipalEmail;
        }
        return safeText(fallbackEmail);
    }

    private String resolveAuthenticatedEmailForUser(String userId) {
        String normalizedUserId = normalizeId(userId);
        if (!StringUtils.hasText(normalizedUserId)) {
            return "";
        }
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof FirebasePrincipal firebasePrincipal)) {
            return "";
        }
        String principalUserId = firebasePrincipal.getUser() != null
                ? normalizeId(firebasePrincipal.getUser().getId())
                : normalizeId(firebasePrincipal.getUserId());
        if (!normalizedUserId.equals(principalUserId)) {
            return "";
        }
        return safeText(firebasePrincipal.getEmail());
    }

    private boolean isSeedLikeHungaryUser(Users user) {
        if (user == null) {
            return false;
        }

        return normalizeStrings(user.getImages()).stream()
                .anyMatch(this::isSeedImageUrl);
    }

    private boolean isSeedImageUrl(String value) {
        return safeText(value).contains(SEED_USER_IMAGE_HOST);
    }

    private ActivityEvent resolvePreferredEventRecord(String eventId) {
        String normalizedEventId = normalizeId(eventId);
        if (!StringUtils.hasText(normalizedEventId)) {
            return null;
        }
        return preferredEventRecordsBySourceId(activityEventsRepository.findBySourceId(normalizedEventId)).get(normalizedEventId);
    }

    private ActivityMember resolveAcceptedReportMember(String eventId, String userId, ActivityEvent eventRecord) {
        String normalizedEventId = normalizeId(eventId);
        String normalizedUserId = normalizeId(userId);
        if (!StringUtils.hasText(normalizedEventId) || !StringUtils.hasText(normalizedUserId)) {
            return null;
        }

        ActivityMember storedMember = activityMembersRepository
                .findByOwnerTypeAndOwnerIdAndUserId(OWNER_TYPE_EVENT, normalizedEventId, normalizedUserId)
                .orElse(null);
        if (storedMember != null) {
            return STATUS_ACCEPTED.equals(normalizeMemberStatus(storedMember.getStatus()))
                    ? storedMember
                    : null;
        }
        return null;
    }

    private ActivityChat resolveReportableChat(
            String reporterUserId,
            String targetUserId,
            String chatId,
            String messageId) {
        String normalizedReporterUserId = normalizeId(reporterUserId);
        String normalizedTargetUserId = normalizeId(targetUserId);
        String normalizedChatId = normalizeId(chatId);
        String normalizedMessageId = normalizeId(messageId);
        if (!StringUtils.hasText(normalizedReporterUserId)
                || !StringUtils.hasText(normalizedTargetUserId)
                || !StringUtils.hasText(normalizedChatId)
                || !StringUtils.hasText(normalizedMessageId)) {
            return null;
        }
        ActivityChat chat = activityChatsRepository
                .findByOwnerUserIdAndChatId(normalizedReporterUserId, normalizedChatId)
                .orElse(null);
        if (chat == null || !chatHasMember(chat, normalizedTargetUserId)) {
            return null;
        }
        ActivityChat.ChatMessageRecord message = findChatMessage(normalizedChatId, normalizedMessageId);
        if (message == null || message.getSenderAvatar() == null) {
            return null;
        }
        return normalizedTargetUserId.equals(normalizeId(message.getSenderAvatar().getId())) ? chat : null;
    }

    private boolean chatHasMember(ActivityChat chat, String userId) {
        String normalizedUserId = normalizeId(userId);
        if (chat == null || !StringUtils.hasText(normalizedUserId)) {
            return false;
        }
        return chat.getMemberIds().stream()
                .map(this::normalizeId)
                .anyMatch(normalizedUserId::equals);
    }

    private ActivityChat.ChatMessageRecord findChatMessage(String chatId, String messageId) {
        String normalizedChatId = normalizeId(chatId);
        String normalizedMessageId = normalizeId(messageId);
        if (!StringUtils.hasText(normalizedChatId) || !StringUtils.hasText(normalizedMessageId)) {
            return null;
        }
        return activityChatMessagesRepository.findByChatIdAndMessageId(normalizedChatId, normalizedMessageId)
                .map(message -> (ActivityChat.ChatMessageRecord) message)
                .orElse(null);
    }

    private String resolveActivityMemberEntryId(ActivityMember member) {
        if (member == null) {
            return null;
        }
        String syncKey = normalizeId(member.getSyncKey());
        if (StringUtils.hasText(syncKey)) {
            return syncKey;
        }
        String id = normalizeId(member.getId());
        return StringUtils.hasText(id) ? id : null;
    }

    private String normalizeMemberStatus(String status) {
        String normalizedStatus = safeText(status);
        if (STATUS_PENDING.equals(normalizedStatus)) {
            return STATUS_PENDING;
        }
        if (STATUS_DELETED.equals(normalizedStatus)) {
            return STATUS_DELETED;
        }
        return STATUS_ACCEPTED;
    }

    private Map<String, ActivityEvent> preferredEventRecordsBySourceId(List<ActivityEvent> records) {
        LinkedHashMap<String, ActivityEvent> preferredBySourceId = new LinkedHashMap<>();
        for (ActivityEvent record : records == null ? List.<ActivityEvent>of() : records) {
            if (record == null) {
                continue;
            }
            String sourceId = normalizeId(record.getSourceId());
            if (!StringUtils.hasText(sourceId)) {
                continue;
            }
            ActivityEvent current = preferredBySourceId.get(sourceId);
            if (current == null || shouldPreferEventRecord(record, current)) {
                preferredBySourceId.put(sourceId, record);
            }
        }
        return preferredBySourceId;
    }

    private boolean shouldPreferEventRecord(ActivityEvent next, ActivityEvent current) {
        boolean nextActive = "A".equals(safeText(next == null ? null : next.getStatus()));
        boolean currentActive = "A".equals(safeText(current == null ? null : current.getStatus()));
        if (nextActive != currentActive) {
            return nextActive;
        }
        return normalizeCount(next.getAcceptedMembers()) >= normalizeCount(current.getAcceptedMembers());
    }

    private boolean isHostingRecordForUser(ActivityEvent record, String userId) {
        if (record == null || !StringUtils.hasText(userId) || Boolean.TRUE.equals(record.getIsTrashed())) {
            return false;
        }
        if (userId.equals(normalizeId(record.getCreatorUserId()))) {
            return true;
        }
        return record.getAdmins().stream()
                .map(this::normalizeId)
                .filter(StringUtils::hasText)
                .anyMatch(userId::equals);
    }

    private UserRealtimeCountersDto buildRealtimeCounters(
            Users user,
            String requestCursor,
            UserImpressionsDto impressions) {
        UserMenuCountersDto counters = buildMenuCounters(user);
        int cursorPartCount = cursorPartCount(requestCursor);
        int fingerprintOffset = cursorPartCount >= 31 ? 29 : cursorPartCount >= 16 ? 14 : 10;
        String previousHostHash = cursorPart(requestCursor, fingerprintOffset);
        String previousMemberHash = cursorPart(requestCursor, fingerprintOffset + 1);
        String nextHostHash = impressionsFingerprint(impressions == null ? null : impressions.host());
        String nextMemberHash = impressionsFingerprint(impressions == null ? null : impressions.member());
        return new UserRealtimeCountersDto(
                counters.game(),
                counters.chat(),
                counters.invitations(),
                counters.events(),
                counters.hosting(),
                counters.cars(),
                counters.accommodation(),
                counters.supplies(),
                counters.tickets(),
                counters.contacts(),
                counters.feedback(),
                counters.event(),
                counters.asset(),
                counters.eventFeedback(),
                counters.adminJobs(),
                counters.adminMetrics(),
                StringUtils.hasText(previousHostHash) && !Objects.equals(previousHostHash, nextHostHash),
                StringUtils.hasText(previousMemberHash) && !Objects.equals(previousMemberHash, nextMemberHash));
    }

    private String buildRealtimeCursor(
            Users user,
            UserRealtimeCountersDto counters,
            UserImpressionsDto impressions) {
        return String.join(":",
                normalizeId(user.getId()),
                String.valueOf(normalizeCount(counters.game())),
                String.valueOf(normalizeCount(counters.chat())),
                String.valueOf(normalizeCount(counters.invitations())),
                String.valueOf(normalizeCount(counters.events())),
                String.valueOf(normalizeCount(counters.hosting())),
                String.valueOf(normalizeCount(counters.cars())),
                String.valueOf(normalizeCount(counters.accommodation())),
                String.valueOf(normalizeCount(counters.supplies())),
                String.valueOf(normalizeCount(counters.tickets())),
                String.valueOf(normalizeCount(counters.contacts())),
                String.valueOf(normalizeCount(counters.feedback())),
                String.valueOf(normalizeCount(counters.event() == null ? null : counters.event().all())),
                String.valueOf(normalizeCount(counters.event() == null ? null : counters.event().active())),
                String.valueOf(normalizeCount(counters.event() == null ? null : counters.event().pending())),
                String.valueOf(normalizeCount(counters.event() == null ? null : counters.event().invitations())),
                String.valueOf(normalizeCount(counters.event() == null ? null : counters.event().hosting())),
                String.valueOf(normalizeCount(counters.event() == null ? null : counters.event().drafts())),
                String.valueOf(normalizeCount(counters.event() == null ? null : counters.event().trash())),
                String.valueOf(normalizeCount(counters.asset() == null ? null : counters.asset().cars())),
                String.valueOf(normalizeCount(counters.asset() == null ? null : counters.asset().accommodation())),
                String.valueOf(normalizeCount(counters.asset() == null ? null : counters.asset().supplies())),
                String.valueOf(normalizeCount(counters.asset() == null ? null : counters.asset().tickets())),
                String.valueOf(normalizeCount(counters.eventFeedback() == null ? null : counters.eventFeedback().ownEvents())),
                String.valueOf(normalizeCount(counters.eventFeedback() == null ? null : counters.eventFeedback().pending())),
                String.valueOf(normalizeCount(counters.eventFeedback() == null ? null : counters.eventFeedback().feedbacked())),
                String.valueOf(normalizeCount(counters.eventFeedback() == null ? null : counters.eventFeedback().removed())),
                String.valueOf(normalizeCount(counters.adminJobs())),
                String.valueOf(normalizeCount(counters.adminMetrics())),
                impressionsFingerprint(impressions == null ? null : impressions.host()),
                impressionsFingerprint(impressions == null ? null : impressions.member()));
    }

    private void recordSessionAction(String userId, String action, String metadata) {
        String normalizedUserId = normalizeId(userId);
        if (!StringUtils.hasText(normalizedUserId)) {
            return;
        }
        String nowIso = Instant.now().toString();
        UserSessionAction document = new UserSessionAction();
        document.setId(new ObjectId().toHexString());
        document.setSyncKey(UUID.randomUUID().toString());
        document.setUserId(normalizedUserId);
        document.setAction(safeText(action));
        document.setMetadata(safeText(metadata));
        document.setCreatedDate(nowIso);
        document.setCreatedUser(normalizedUserId);
        document.setUpdatedDate(nowIso);
        document.setUpdatedUser(normalizedUserId);
        userSessionActionsRepository.save(document);
    }

    private String resolveProfileStatus(Users user) {
        return resolveProfileStatus(user == null ? null : user.getStatus(), user == null ? null : user.getProfileStatus());
    }

    private String resolveProfileStatus(String status, String fallbackProfileStatus) {
        String normalizedProfileStatus = safeText(fallbackProfileStatus);
        if ("blocked".equals(normalizedProfileStatus)) {
            return "blocked";
        }
        if (PROFILE_STATUS_ONBOARDING.equals(normalizedProfileStatus)) {
            return PROFILE_STATUS_ONBOARDING;
        }
        return switch (safeText(status)) {
            case "D" -> "deleted";
            case "B" -> "blocked";
            case "I" -> "inactive";
            case "F" -> "friends only";
            case "H" -> "host only";
            case "A" -> "public";
            default -> {
                yield StringUtils.hasText(normalizedProfileStatus) ? normalizedProfileStatus : "public";
            }
        };
    }

    private String resolveStatusCode(String profileStatus, String fallbackStatus) {
        return switch (safeText(profileStatus)) {
            case "deleted" -> "D";
            case "blocked" -> "B";
            case PROFILE_STATUS_ONBOARDING -> "A";
            case "inactive" -> "I";
            case "friends only" -> "F";
            case "host only" -> "H";
            case "public" -> "A";
            default -> StringUtils.hasText(safeText(fallbackStatus)) ? safeText(fallbackStatus) : "A";
        };
    }

    private void applyPreferences(UserFilterPreferences document, UserGameFilterPreferencesDto preferences) {
        document.setAgeMin(preferences.ageMin());
        document.setAgeMax(preferences.ageMax());
        document.setHeightMinCm(preferences.heightMinCm());
        document.setHeightMaxCm(preferences.heightMaxCm());
        document.setInterests(normalizeStrings(preferences.interests()));
        document.setValues(normalizeStrings(preferences.values()));
        document.setPhysiques(normalizeStrings(preferences.physiques()));
        document.setLanguages(normalizeStrings(preferences.languages()));
        document.setGenders(normalizeStrings(preferences.genders()));
        document.setHoroscopes(normalizeStrings(preferences.horoscopes()));
        document.setTraitLabels(normalizeStrings(preferences.traitLabels()));
        document.setSmoking(normalizeStrings(preferences.smoking()));
        document.setDrinking(normalizeStrings(preferences.drinking()));
        document.setWorkout(normalizeStrings(preferences.workout()));
        document.setPets(normalizeStrings(preferences.pets()));
        document.setFamilyPlans(normalizeStrings(preferences.familyPlans()));
        document.setChildren(normalizeStrings(preferences.children()));
        document.setLoveStyles(normalizeStrings(preferences.loveStyles()));
        document.setCommunicationStyles(normalizeStrings(preferences.communicationStyles()));
        document.setSexualOrientations(normalizeStrings(preferences.sexualOrientations()));
        document.setReligions(normalizeStrings(preferences.religions()));
    }

    private UserGameFilterPreferencesDto toUserGameFilterPreferencesDto(UserFilterPreferences preferences) {
        return new UserGameFilterPreferencesDto(
                preferences.getAgeMin(),
                preferences.getAgeMax(),
                preferences.getHeightMinCm(),
                preferences.getHeightMaxCm(),
                normalizeStrings(preferences.getInterests()),
                normalizeStrings(preferences.getValues()),
                normalizeStrings(preferences.getPhysiques()),
                normalizeStrings(preferences.getLanguages()),
                normalizeStrings(preferences.getGenders()),
                normalizeStrings(preferences.getHoroscopes()),
                normalizeStrings(preferences.getTraitLabels()),
                normalizeStrings(preferences.getSmoking()),
                normalizeStrings(preferences.getDrinking()),
                normalizeStrings(preferences.getWorkout()),
                normalizeStrings(preferences.getPets()),
                normalizeStrings(preferences.getFamilyPlans()),
                normalizeStrings(preferences.getChildren()),
                normalizeStrings(preferences.getLoveStyles()),
                normalizeStrings(preferences.getCommunicationStyles()),
                normalizeStrings(preferences.getSexualOrientations()),
                normalizeStrings(preferences.getReligions()));
    }

    private UserActivitiesDto toUserActivitiesDto(Users.UserActivitiesRecord activities) {
        if (activities == null) {
            return new UserActivitiesDto(
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    new UserEventCountersDto(0, 0, 0, 0, 0, 0, 0),
                    new UserAssetCountersDto(0, 0, 0, 0),
                    new UserEventFeedbackCountersDto(0, 0, 0, 0),
                    0, 0);
        }
        return new UserActivitiesDto(
                normalizeCount(activities.game()),
                normalizeCount(activities.chat()),
                normalizeCount(activities.invitations()),
                normalizeCount(activities.events()),
                normalizeCount(activities.hosting()),
                normalizeCount(activities.cars()),
                normalizeCount(activities.accommodation()),
                normalizeCount(activities.supplies()),
                normalizeCount(activities.tickets()),
                normalizeCount(activities.contacts()),
                normalizeCount(activities.feedback()),
                toUserEventCountersDto(activities.event()),
                toUserAssetCountersDto(activities.asset()),
                toUserEventFeedbackCountersDto(activities.eventFeedback()),
                normalizeCount(activities.adminJobs()),
                normalizeCount(activities.adminMetrics()));
    }

    private Users.UserActivitiesRecord toUserActivitiesRecord(UserActivitiesDto activities) {
        if (activities == null) {
            return new Users.UserActivitiesRecord(
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    new Users.UserEventCountersRecord(0, 0, 0, 0, 0, 0, 0),
                    new Users.UserAssetCountersRecord(0, 0, 0, 0),
                    new Users.UserEventFeedbackCountersRecord(0, 0, 0, 0),
                    0, 0);
        }
        return new Users.UserActivitiesRecord(
                normalizeCount(activities.game()),
                normalizeCount(activities.chat()),
                normalizeCount(activities.invitations()),
                normalizeCount(activities.events()),
                normalizeCount(activities.hosting()),
                normalizeCount(activities.cars()),
                normalizeCount(activities.accommodation()),
                normalizeCount(activities.supplies()),
                normalizeCount(activities.tickets()),
                normalizeCount(activities.contacts()),
                normalizeCount(activities.feedback()),
                toUserEventCountersRecord(activities.event()),
                toUserAssetCountersRecord(activities.asset()),
                toUserEventFeedbackCountersRecord(activities.eventFeedback()),
                normalizeCount(activities.adminJobs()),
                normalizeCount(activities.adminMetrics()));
    }

    private UserEventCountersDto toUserEventCountersDto(Users.UserEventCountersRecord event) {
        return new UserEventCountersDto(
                event == null ? 0 : normalizeCount(event.all()),
                event == null ? 0 : normalizeCount(event.active()),
                event == null ? 0 : normalizeCount(event.pending()),
                event == null ? 0 : normalizeCount(event.invitations()),
                event == null ? 0 : normalizeCount(event.hosting()),
                event == null ? 0 : normalizeCount(event.drafts()),
                event == null ? 0 : normalizeCount(event.trash()));
    }

    private UserAssetCountersDto toUserAssetCountersDto(Users.UserAssetCountersRecord asset) {
        return new UserAssetCountersDto(
                asset == null ? 0 : normalizeCount(asset.cars()),
                asset == null ? 0 : normalizeCount(asset.accommodation()),
                asset == null ? 0 : normalizeCount(asset.supplies()),
                asset == null ? 0 : normalizeCount(asset.tickets()));
    }

    private UserEventFeedbackCountersDto toUserEventFeedbackCountersDto(Users.UserEventFeedbackCountersRecord feedback) {
        return new UserEventFeedbackCountersDto(
                feedback == null ? 0 : normalizeCount(feedback.ownEvents()),
                feedback == null ? 0 : normalizeCount(feedback.pending()),
                feedback == null ? 0 : normalizeCount(feedback.feedbacked()),
                feedback == null ? 0 : normalizeCount(feedback.removed()));
    }

    private Users.UserEventCountersRecord toUserEventCountersRecord(UserEventCountersDto event) {
        return new Users.UserEventCountersRecord(
                event == null ? 0 : normalizeCount(event.all()),
                event == null ? 0 : normalizeCount(event.active()),
                event == null ? 0 : normalizeCount(event.pending()),
                event == null ? 0 : normalizeCount(event.invitations()),
                event == null ? 0 : normalizeCount(event.hosting()),
                event == null ? 0 : normalizeCount(event.drafts()),
                event == null ? 0 : normalizeCount(event.trash()));
    }

    private Users.UserAssetCountersRecord toUserAssetCountersRecord(UserAssetCountersDto asset) {
        return new Users.UserAssetCountersRecord(
                asset == null ? 0 : normalizeCount(asset.cars()),
                asset == null ? 0 : normalizeCount(asset.accommodation()),
                asset == null ? 0 : normalizeCount(asset.supplies()),
                asset == null ? 0 : normalizeCount(asset.tickets()));
    }

    private Users.UserEventFeedbackCountersRecord toUserEventFeedbackCountersRecord(UserEventFeedbackCountersDto feedback) {
        return new Users.UserEventFeedbackCountersRecord(
                feedback == null ? 0 : normalizeCount(feedback.ownEvents()),
                feedback == null ? 0 : normalizeCount(feedback.pending()),
                feedback == null ? 0 : normalizeCount(feedback.feedbacked()),
                feedback == null ? 0 : normalizeCount(feedback.removed()));
    }

    private LocationCoordinatesDto toLocationCoordinatesDto(Users.LocationCoordinatesRecord record) {
        if (record == null) {
            return null;
        }
        return new LocationCoordinatesDto(record.latitude(), record.longitude());
    }

    private Users.LocationCoordinatesRecord toLocationCoordinatesRecord(LocationCoordinatesDto dto) {
        if (dto == null) {
            return null;
        }
        return new Users.LocationCoordinatesRecord(dto.latitude(), dto.longitude());
    }

    private List<ProfileDetailGroupDto> toProfileDetailsDto(List<Users.ProfileDetailGroupRecord> records) {
        if (records == null || records.isEmpty()) {
            return List.of();
        }
        return records.stream()
                .filter(Objects::nonNull)
                .map(group -> {
                    String title = safeText(group.title());
                    if (!StringUtils.hasText(title)) {
                        return null;
                    }
                    List<ProfileDetailRowDto> rows = (group.rows() == null ? List.<Users.ProfileDetailRowRecord>of() : group.rows()).stream()
                            .filter(Objects::nonNull)
                            .map(row -> {
                                String labelKey = safeText(row.labelKey());
                                if (!StringUtils.hasText(labelKey)) {
                                    return null;
                                }
                                return new ProfileDetailRowDto(
                                        labelKey,
                                        safeText(row.value()),
                                        safeText(row.privacy()),
                                        normalizeStrings(row.options()));
                            })
                            .filter(Objects::nonNull)
                            .toList();
                    return new ProfileDetailGroupDto(title, rows);
                })
                .filter(Objects::nonNull)
                .toList();
    }

    private List<Users.ProfileDetailGroupRecord> toProfileDetailRecords(List<ProfileDetailGroupDto> groups) {
        if (groups == null || groups.isEmpty()) {
            return List.of();
        }
        return groups.stream()
                .filter(Objects::nonNull)
                .map(group -> {
                    String title = safeText(group.title());
                    if (!StringUtils.hasText(title)) {
                        return null;
                    }
                    List<Users.ProfileDetailRowRecord> rows = (group.rows() == null ? List.<ProfileDetailRowDto>of() : group.rows()).stream()
                            .filter(Objects::nonNull)
                            .map(row -> {
                                String labelKey = safeText(row.labelKey());
                                if (!StringUtils.hasText(labelKey)) {
                                    return null;
                                }
                                return new Users.ProfileDetailRowRecord(
                                        labelKey,
                                        safeText(row.value()),
                                        safeText(row.privacy()),
                                        normalizeStrings(row.options()));
                            })
                            .filter(Objects::nonNull)
                            .toList();
                    return new Users.ProfileDetailGroupRecord(title, rows);
                })
                .filter(Objects::nonNull)
                .toList();
    }

    private Users.UserImpressionsRecord toUserImpressionsRecord(UserImpressionsDto dto) {
        if (dto == null) {
            return null;
        }
        return new Users.UserImpressionsRecord(
                toUserImpressionsSectionRecord(dto.host()),
                toUserImpressionsSectionRecord(dto.member()));
    }

    private Users.UserImpressionsSectionRecord toUserImpressionsSectionRecord(UserImpressionsSectionDto dto) {
        if (dto == null) {
            return null;
        }
        return new Users.UserImpressionsSectionRecord(
                dto.unreadCount(),
                dto.averageRating(),
                dto.peopleMet(),
                dto.totalEvents(),
                dto.repeatCount(),
                dto.noShowCount(),
                normalizeStrings(dto.vibeBadges()),
                normalizeStrings(dto.personalityBadges()),
                toUserPersonalityTraitRecords(dto.personalityTraits()),
                normalizeStrings(dto.categoryBadges()));
    }

    private UserImpressionsDto resolveMergedUserImpressions(Users user) {
        String userId = normalizeId(user == null ? null : user.getId());
        if (user == null || !StringUtils.hasText(userId)) {
            return null;
        }
        long nowMs = System.currentTimeMillis();
        CacheEntry<UserImpressionsDto> cached = userImpressionsCacheByUserId.get(userId);
        if (cached != null) {
            if (cached.expiresAtMs() > nowMs) {
                return cached.value();
            }
            userImpressionsCacheByUserId.remove(userId, cached);
        }

        Object lock = userReadCacheLocksByUserId.computeIfAbsent(userId, key -> new Object());
        synchronized (lock) {
            cached = userImpressionsCacheByUserId.get(userId);
            if (cached != null) {
                if (cached.expiresAtMs() > nowMs) {
                    return cached.value();
                }
                userImpressionsCacheByUserId.remove(userId, cached);
            }
            UserImpressionsDto resolved = resolveMergedUserImpressionsUncached(user);
            userImpressionsCacheByUserId.put(userId, new CacheEntry<>(resolved, nowMs + USER_READ_SNAPSHOT_CACHE_TTL_MS));
            return resolved;
        }
    }

    private UserImpressionsDto resolveMergedUserImpressionsUncached(Users user) {
        List<EventFeedbackAnswer> feedbackAnswers = eventFeedbackAnswersRepository
                .findByTargetUserIdOrderBySubmittedAtIsoDesc(normalizeId(user.getId()));
        UserImpressionsSectionDto host = resolveMergedImpressionsSection(user, user.getImpressions() == null ? null : user.getImpressions().host(), "event", feedbackAnswers);
        UserImpressionsSectionDto member = resolveMergedImpressionsSection(user, user.getImpressions() == null ? null : user.getImpressions().member(), "attendee", feedbackAnswers);
        if (host == null && member == null) {
            return null;
        }
        return new UserImpressionsDto(host, member);
    }

    private record CacheEntry<T>(T value, long expiresAtMs) {
    }

    private UserImpressionsSectionDto resolveMergedImpressionsSection(
            Users user,
            Users.UserImpressionsSectionRecord record,
            String feedbackKind,
            List<EventFeedbackAnswer> feedbackAnswers) {
        boolean hasStoredData = hasImpressionsSectionRecordData(record);
        if (!hasStoredData
                && !hasImpressionActivity(user, feedbackKind)
                && !hasFeedbackAnswerSignals(feedbackKind, feedbackAnswers)) {
            return null;
        }
        List<UserPersonalityTraitDto> personalityTraits = resolvePersonalityTraits(user, record, feedbackKind, feedbackAnswers);
        if (!hasStoredData && personalityTraits.isEmpty()) {
            return null;
        }
        return new UserImpressionsSectionDto(
                record == null ? 0 : record.unreadCount(),
                record == null ? null : record.averageRating(),
                record == null ? null : record.peopleMet(),
                record == null ? null : record.totalEvents(),
                record == null ? null : record.repeatCount(),
                record == null ? null : record.noShowCount(),
                normalizeStrings(record == null ? null : record.vibeBadges()),
                personalityTraits.isEmpty()
                        ? normalizeStrings(record == null ? null : record.personalityBadges())
                        : toPersonalityBadges(personalityTraits),
                personalityTraits,
                normalizeStrings(record == null ? null : record.categoryBadges()));
    }

    private boolean hasImpressionActivity(Users user, String feedbackKind) {
        if (user == null || user.getActivities() == null) {
            return false;
        }
        Users.UserActivitiesRecord activities = user.getActivities();
        String normalizedKind = normalizeToken(feedbackKind);
        if ("event".equals(normalizedKind)) {
            return normalizeCount(activities.events()) > 0
                    || normalizeCount(activities.hosting()) > 0;
        }
        if ("attendee".equals(normalizedKind)) {
            return normalizeCount(activities.chat()) > 0
                    || normalizeCount(activities.invitations()) > 0
                    || normalizeCount(activities.tickets()) > 0
                    || normalizeCount(activities.feedback()) > 0;
        }
        return false;
    }

    private boolean hasImpressionsSectionRecordData(Users.UserImpressionsSectionRecord record) {
        if (record == null) {
            return false;
        }
        return (record.averageRating() != null && record.averageRating() > 0d)
                || normalizeCount(record.peopleMet()) > 0
                || normalizeCount(record.totalEvents()) > 0
                || normalizeCount(record.repeatCount()) > 0
                || normalizeCount(record.noShowCount()) > 0
                || !normalizeStrings(record.vibeBadges()).isEmpty()
                || !normalizeStrings(record.personalityBadges()).isEmpty()
                || !normalizeStrings(record.categoryBadges()).isEmpty()
                || safeList(record.personalityTraits()).stream()
                        .filter(Objects::nonNull)
                        .anyMatch(trait -> StringUtils.hasText(resolvePersonalityTraitId(trait.id(), trait.label()))
                                && (normalizeCount(trait.percent()) > 0 || normalizeCount(trait.evidenceCount()) > 0));
    }

    private boolean hasFeedbackAnswerSignals(String feedbackKind, List<EventFeedbackAnswer> feedbackAnswers) {
        String expectedKind = normalizeToken(feedbackKind);
        return safeList(feedbackAnswers).stream()
                .filter(Objects::nonNull)
                .anyMatch(answer -> Objects.equals(expectedKind, normalizeToken(answer.getKind()))
                        && (
                            !normalizeStrings(answer.getPersonalityTraitIds()).isEmpty()
                            || !normalizeStrings(answer.getTags()).isEmpty()
                            || StringUtils.hasText(normalizeOptionalText(answer.getPrimaryValue()))
                            || StringUtils.hasText(normalizeOptionalText(answer.getSecondaryValue()))
                        ));
    }

    private List<UserPersonalityTraitDto> resolvePersonalityTraits(
            Users user,
            Users.UserImpressionsSectionRecord record,
            String feedbackKind,
            List<EventFeedbackAnswer> feedbackAnswers) {
        Map<String, Double> scoreByTraitId = new LinkedHashMap<>();
        Map<String, Integer> evidenceByTraitId = new LinkedHashMap<>();
        Map<String, String> lastRatedAtByTraitId = new LinkedHashMap<>();
        boolean seeded = applySeededPersonalityTraitRecords(scoreByTraitId, evidenceByTraitId, lastRatedAtByTraitId, record);
        if (!seeded) {
            seeded = applyLegacyPersonalityBadgeScores(scoreByTraitId, record);
        }
        if (!seeded) {
            applyFallbackPersonalityBaseline(user, scoreByTraitId);
        }
        applyFeedbackAnswerTraitSignals(feedbackKind, feedbackAnswers, scoreByTraitId, evidenceByTraitId, lastRatedAtByTraitId);
        return toResolvedPersonalityTraits(scoreByTraitId, evidenceByTraitId, lastRatedAtByTraitId);
    }

    private boolean applySeededPersonalityTraitRecords(
            Map<String, Double> scoreByTraitId,
            Map<String, Integer> evidenceByTraitId,
            Map<String, String> lastRatedAtByTraitId,
            Users.UserImpressionsSectionRecord record) {
        boolean applied = false;
        if (record == null) {
            return false;
        }
        for (Users.UserPersonalityTraitRecord traitRecord : safeList(record.personalityTraits())) {
            String traitId = resolvePersonalityTraitId(traitRecord.id(), traitRecord.label());
            if (!StringUtils.hasText(traitId)) {
                continue;
            }
            addTraitScore(scoreByTraitId, traitId, Math.max(1d, normalizeCount(traitRecord.percent())));
            addTraitEvidence(evidenceByTraitId, traitId, normalizeCount(traitRecord.evidenceCount()));
            mergeLastRatedAt(lastRatedAtByTraitId, traitId, traitRecord.lastRatedAtIso());
            applied = true;
        }
        return applied;
    }

    private boolean applyLegacyPersonalityBadgeScores(
            Map<String, Double> scoreByTraitId,
            Users.UserImpressionsSectionRecord record) {
        boolean applied = false;
        if (record == null) {
            return false;
        }
        for (String badge : normalizeStrings(record.personalityBadges())) {
            LegacyTraitBadgeSignal signal = parseLegacyTraitBadgeSignal(badge);
            if (signal == null) {
                continue;
            }
            addTraitScore(scoreByTraitId, signal.traitId(), Math.max(1d, signal.percent()));
            applied = true;
        }
        return applied;
    }

    private void applyFallbackPersonalityBaseline(Users user, Map<String, Double> scoreByTraitId) {
        for (PersonalityTraitDefinition definition : PERSONALITY_TRAIT_DEFINITIONS) {
            scoreByTraitId.putIfAbsent(definition.id(), 1d);
        }
        List<String> orderedTraitIds = PERSONALITY_TRAIT_DEFINITIONS.stream()
                .map(PersonalityTraitDefinition::id)
                .toList();
        String dominantTraitId = resolvePersonalityTraitId(null, user == null ? null : user.getTraitLabel());
        if (!StringUtils.hasText(dominantTraitId)) {
            dominantTraitId = orderedTraitIds.get(Math.floorMod(Objects.hash(normalizeId(user == null ? null : user.getId())), orderedTraitIds.size()));
        }
        int dominantIndex = orderedTraitIds.indexOf(dominantTraitId);
        if (dominantIndex < 0) {
            dominantIndex = 0;
            dominantTraitId = orderedTraitIds.get(0);
        }
        String secondaryTraitId = orderedTraitIds.get((dominantIndex + 2) % orderedTraitIds.size());
        String tertiaryTraitId = orderedTraitIds.get((dominantIndex + 5) % orderedTraitIds.size());
        addTraitScore(scoreByTraitId, dominantTraitId, 48d);
        addTraitScore(scoreByTraitId, secondaryTraitId, 20d);
        addTraitScore(scoreByTraitId, tertiaryTraitId, 12d);
    }

    private void applyFeedbackAnswerTraitSignals(
            String feedbackKind,
            List<EventFeedbackAnswer> feedbackAnswers,
            Map<String, Double> scoreByTraitId,
            Map<String, Integer> evidenceByTraitId,
            Map<String, String> lastRatedAtByTraitId) {
        String expectedKind = normalizeToken(feedbackKind);
        for (EventFeedbackAnswer answer : safeList(feedbackAnswers)) {
            if (answer == null || !Objects.equals(expectedKind, normalizeToken(answer.getKind()))) {
                continue;
            }
            Set<String> signaledTraitIds = new LinkedHashSet<>();
            for (String traitId : safeList(answer.getPersonalityTraitIds())) {
                String resolvedTraitId = resolvePersonalityTraitId(traitId, traitId);
                if (StringUtils.hasText(resolvedTraitId)) {
                    signaledTraitIds.add(resolvedTraitId);
                }
            }
            for (String tag : safeList(answer.getTags())) {
                String resolvedTraitId = resolveLegacyFeedbackTraitId(tag);
                if (StringUtils.hasText(resolvedTraitId)) {
                    signaledTraitIds.add(resolvedTraitId);
                }
            }
            for (String traitId : signaledTraitIds) {
                addTraitScore(scoreByTraitId, traitId, 18d);
                addTraitEvidence(evidenceByTraitId, traitId, 1);
                mergeLastRatedAt(lastRatedAtByTraitId, traitId, answer.getSubmittedAtIso());
            }
        }
    }

    private List<UserPersonalityTraitDto> toResolvedPersonalityTraits(
            Map<String, Double> scoreByTraitId,
            Map<String, Integer> evidenceByTraitId,
            Map<String, String> lastRatedAtByTraitId) {
        if (scoreByTraitId.isEmpty()) {
            return List.of();
        }
        List<String> orderedTraitIds = scoreByTraitId.entrySet().stream()
                .filter(entry -> entry.getValue() != null && entry.getValue() > 0d)
                .sorted((left, right) -> {
                    int scoreCompare = Double.compare(right.getValue(), left.getValue());
                    if (scoreCompare != 0) {
                        return scoreCompare;
                    }
                    int evidenceCompare = Integer.compare(
                            evidenceByTraitId.getOrDefault(right.getKey(), 0),
                            evidenceByTraitId.getOrDefault(left.getKey(), 0));
                    if (evidenceCompare != 0) {
                        return evidenceCompare;
                    }
                    PersonalityTraitDefinition leftDefinition = PERSONALITY_TRAIT_DEFINITION_BY_ID.get(left.getKey());
                    PersonalityTraitDefinition rightDefinition = PERSONALITY_TRAIT_DEFINITION_BY_ID.get(right.getKey());
                    return nullToEmpty(leftDefinition == null ? left.getKey() : leftDefinition.label())
                            .compareTo(nullToEmpty(rightDefinition == null ? right.getKey() : rightDefinition.label()));
                })
                .map(Map.Entry::getKey)
                .toList();
        if (orderedTraitIds.isEmpty()) {
            return List.of();
        }
        double total = orderedTraitIds.stream()
                .map(scoreByTraitId::get)
                .filter(Objects::nonNull)
                .mapToDouble(Double::doubleValue)
                .sum();
        if (total <= 0d) {
            return List.of();
        }

        List<Integer> percents = new ArrayList<>();
        int percentTotal = 0;
        for (String traitId : orderedTraitIds) {
            int percent = (int) Math.round((scoreByTraitId.getOrDefault(traitId, 0d) * 100d) / total);
            percents.add(percent);
            percentTotal += percent;
        }
        if (!percents.isEmpty() && percentTotal != 100) {
            percents.set(0, Math.max(0, percents.get(0) + (100 - percentTotal)));
        }

        List<UserPersonalityTraitDto> traits = new ArrayList<>();
        for (int index = 0; index < orderedTraitIds.size(); index += 1) {
            String traitId = orderedTraitIds.get(index);
            PersonalityTraitDefinition definition = PERSONALITY_TRAIT_DEFINITION_BY_ID.get(traitId);
            if (definition == null) {
                continue;
            }
            traits.add(new UserPersonalityTraitDto(
                    definition.id(),
                    definition.label(),
                    percents.get(index),
                    evidenceByTraitId.getOrDefault(traitId, 0),
                    safeText(lastRatedAtByTraitId.get(traitId))));
        }
        return traits;
    }

    private List<String> toPersonalityBadges(List<UserPersonalityTraitDto> traits) {
        return safeList(traits).stream()
                .filter(Objects::nonNull)
                .sorted(Comparator.comparing(UserPersonalityTraitDto::percent, Comparator.nullsLast(Comparator.reverseOrder())))
                .limit(3)
                .map(trait -> String.format("%s %d%%", trait.label(), normalizeCount(trait.percent())))
                .toList();
    }

    private List<Users.UserPersonalityTraitRecord> toUserPersonalityTraitRecords(List<UserPersonalityTraitDto> dtos) {
        if (dtos == null || dtos.isEmpty()) {
            return List.of();
        }
        return dtos.stream()
                .filter(Objects::nonNull)
                .map(dto -> {
                    String traitId = resolvePersonalityTraitId(dto.id(), dto.label());
                    PersonalityTraitDefinition definition = PERSONALITY_TRAIT_DEFINITION_BY_ID.get(traitId);
                    String resolvedLabel = definition == null ? safeText(dto.label()) : definition.label();
                    String resolvedId = definition == null ? safeText(dto.id()) : definition.id();
                    if (!StringUtils.hasText(resolvedId) || !StringUtils.hasText(resolvedLabel)) {
                        return null;
                    }
                    return new Users.UserPersonalityTraitRecord(
                            resolvedId,
                            resolvedLabel,
                            normalizeCount(dto.percent()),
                            normalizeCount(dto.evidenceCount()),
                            safeText(dto.lastRatedAtIso()));
                })
                .filter(Objects::nonNull)
                .toList();
    }

    private String resolvePersonalityTraitId(String id, String label) {
        String normalizedId = normalizeToken(id);
        if (PERSONALITY_TRAIT_DEFINITION_BY_ID.containsKey(normalizedId)) {
            return normalizedId;
        }
        return resolvePersonalityTraitIdFromLabel(label);
    }

    private String resolvePersonalityTraitIdFromLabel(String label) {
        String normalizedLabel = normalizeToken(label);
        if (!StringUtils.hasText(normalizedLabel)) {
            return null;
        }
        String resolved = PERSONALITY_TRAIT_ID_BY_TOKEN.get(normalizedLabel);
        if (StringUtils.hasText(resolved)) {
            return resolved;
        }
        String[] words = normalizedLabel.split("\\s+");
        for (int start = 0; start < words.length; start += 1) {
            String candidate = String.join(" ", java.util.Arrays.copyOfRange(words, start, words.length));
            resolved = PERSONALITY_TRAIT_ID_BY_TOKEN.get(candidate);
            if (StringUtils.hasText(resolved)) {
                return resolved;
            }
        }
        return LEGACY_FEEDBACK_TRAIT_ID_BY_TOKEN.get(normalizedLabel);
    }

    private String resolveLegacyFeedbackTraitId(String tag) {
        String normalizedTag = normalizeToken(tag);
        if (!StringUtils.hasText(normalizedTag)) {
            return null;
        }
        String resolved = LEGACY_FEEDBACK_TRAIT_ID_BY_TOKEN.get(normalizedTag);
        if (StringUtils.hasText(resolved)) {
            return resolved;
        }
        return resolvePersonalityTraitIdFromLabel(tag);
    }

    private LegacyTraitBadgeSignal parseLegacyTraitBadgeSignal(String badge) {
        String normalizedBadge = safeText(badge);
        if (!StringUtils.hasText(normalizedBadge)) {
            return null;
        }
        java.util.regex.Matcher matcher = java.util.regex.Pattern.compile("^(.*?)(\\d{1,3})%$").matcher(normalizedBadge);
        if (!matcher.find()) {
            String traitId = resolvePersonalityTraitIdFromLabel(normalizedBadge);
            return StringUtils.hasText(traitId) ? new LegacyTraitBadgeSignal(traitId, 1) : null;
        }
        String traitId = resolvePersonalityTraitIdFromLabel(matcher.group(1));
        if (!StringUtils.hasText(traitId)) {
            return null;
        }
        return new LegacyTraitBadgeSignal(traitId, normalizeCount(Integer.parseInt(matcher.group(2))));
    }

    private void mergeLastRatedAt(Map<String, String> lastRatedAtByTraitId, String traitId, String candidateIso) {
        String normalizedCandidate = safeText(candidateIso);
        if (!StringUtils.hasText(traitId) || !StringUtils.hasText(normalizedCandidate)) {
            return;
        }
        String current = lastRatedAtByTraitId.get(traitId);
        if (!StringUtils.hasText(current) || toSortableDate(normalizedCandidate) >= toSortableDate(current)) {
            lastRatedAtByTraitId.put(traitId, normalizedCandidate);
        }
    }

    private void addTraitScore(Map<String, Double> scoreByTraitId, String traitId, double amount) {
        scoreByTraitId.put(traitId, scoreByTraitId.getOrDefault(traitId, 0d) + amount);
    }

    private void addTraitEvidence(Map<String, Integer> evidenceByTraitId, String traitId, int amount) {
        evidenceByTraitId.put(traitId, evidenceByTraitId.getOrDefault(traitId, 0) + amount);
    }

    private String cursorPart(String cursor, int index) {
        String normalizedCursor = safeText(cursor);
        if (!StringUtils.hasText(normalizedCursor)) {
            return "";
        }
        String[] parts = normalizedCursor.split(":", -1);
        return parts.length > index ? safeText(parts[index]) : "";
    }

    private int cursorPartCount(String cursor) {
        String normalizedCursor = safeText(cursor);
        if (!StringUtils.hasText(normalizedCursor)) {
            return 0;
        }
        return normalizedCursor.split(":", -1).length;
    }

    private String impressionsFingerprint(UserImpressionsSectionDto section) {
        if (section == null) {
            return "";
        }
        String personalityTraitToken = safeList(section.personalityTraits()).stream()
                .filter(Objects::nonNull)
                .map(trait -> String.join("~",
                        safeText(trait.id()),
                        String.valueOf(normalizeCount(trait.percent())),
                        String.valueOf(normalizeCount(trait.evidenceCount())),
                        safeText(trait.lastRatedAtIso())))
                .reduce("", (left, right) -> left.isEmpty() ? right : left + "," + right);
        String fingerprintSource = String.join("|",
                String.valueOf(normalizeCount(section.unreadCount())),
                String.valueOf(section.averageRating() == null ? 0d : section.averageRating()),
                String.valueOf(normalizeCount(section.peopleMet())),
                String.valueOf(normalizeCount(section.totalEvents())),
                String.valueOf(normalizeCount(section.repeatCount())),
                String.valueOf(normalizeCount(section.noShowCount())),
                String.join(",", normalizeStrings(section.vibeBadges())),
                String.join(",", normalizeStrings(section.personalityBadges())),
                personalityTraitToken,
                String.join(",", normalizeStrings(section.categoryBadges())));
        return Integer.toHexString(fingerprintSource.hashCode());
    }

    private static Map<String, PersonalityTraitDefinition> buildPersonalityTraitDefinitionById() {
        Map<String, PersonalityTraitDefinition> next = new LinkedHashMap<>();
        for (PersonalityTraitDefinition definition : PERSONALITY_TRAIT_DEFINITIONS) {
            next.put(definition.id(), definition);
        }
        return Map.copyOf(next);
    }

    private static Map<String, String> buildPersonalityTraitIdByToken() {
        Map<String, String> next = new LinkedHashMap<>();
        for (PersonalityTraitDefinition definition : PERSONALITY_TRAIT_DEFINITIONS) {
            next.put(definition.id(), definition.id());
            next.put(definition.label().toLowerCase(), definition.id());
            for (String alias : definition.aliases()) {
                next.put(alias.toLowerCase(), definition.id());
            }
        }
        return Map.copyOf(next);
    }

    private <T> List<T> safeList(List<T> source) {
        return source == null ? List.of() : source;
    }

    private List<String> normalizeStrings(List<String> values) {
        if (values == null || values.isEmpty()) {
            return List.of();
        }
        return values.stream()
                .filter(Objects::nonNull)
                .map(String::trim)
                .filter(StringUtils::hasText)
                .toList();
    }

    private int normalizeCount(Integer value) {
        return value == null ? 0 : Math.max(0, value);
    }

    private long resolveDemoUserListLimit(Integer value) {
        if (value == null) {
            return Long.MAX_VALUE;
        }
        return Math.min(500L, Math.max(1L, value.longValue()));
    }

    private String normalizeId(String value) {
        return value == null ? "" : value.trim();
    }

    private String normalizeOptionalText(String value) {
        String normalized = normalizeId(value);
        return StringUtils.hasText(normalized) ? normalized : null;
    }

    private String normalizeToken(String value) {
        return normalizeId(value).toLowerCase();
    }

    private String safeText(String value) {
        return normalizeId(value);
    }

    private long toSortableDate(String value) {
        try {
            return Instant.parse(safeText(value)).toEpochMilli();
        } catch (Exception ignored) {
            return 0L;
        }
    }

    private String nullToEmpty(String value) {
        return value == null ? "" : value;
    }

    public record GameSocialCardCandidate(
            String id,
            String userId,
            String secondaryUserId,
            String socialContext,
            String bridgeUserId,
            Integer bridgeCount,
            String eventName,
            Double score) {
    }

    record ActivitySocialGraph(
            Map<String, Set<String>> neighborsByUserId,
            Map<String, String> latestEventNameByEdgeKey) {
        private boolean hasDirectEdge(String leftUserId, String rightUserId) {
            return neighborsByUserId.getOrDefault(leftUserId, Set.of()).contains(rightUserId);
        }
    }

    private record HomeRankingContext(
            Users activeUser,
            Map<String, Long> latestActivityMsByUserId,
            long nowMs) {
    }

    private record OrderedPair(
            String leftUserId,
            String rightUserId) {
    }

    private record GameStackSnapshot(
            List<Users> visibleGameUsers,
            Map<String, Users> usersById,
            ActivitySocialGraph socialGraph,
            Map<String, Long> latestActivityMsByUserId) {
    }

    private record PersonalityTraitDefinition(
            String id,
            String label,
            String coreVibe,
            List<String> highlights,
            List<String> aliases) {
    }

    private record LegacyTraitBadgeSignal(
            String traitId,
            Integer percent) {
    }

}
