package com.raxim.myscoutee.domain.accounts.service;

import static com.raxim.myscoutee.domain.accounts.service.AccountCounterMapper.*;
import static com.raxim.myscoutee.domain.accounts.service.ProfileStatusValues.*;
import static com.raxim.myscoutee.domain.accounts.service.AccountLocationService.toLocationCoordinatesDto;
import static com.raxim.myscoutee.domain.accounts.service.AccountLocationService.toLocationCoordinatesRecord;

import com.raxim.myscoutee.domain.groups.api.BaseGroups;

import com.raxim.myscoutee.domain.groups.api.WorkspaceContext;

import com.raxim.myscoutee.domain.administration.api.AdministratorClassification;
import com.raxim.myscoutee.domain.administration.api.OperationalTelemetry;
import com.raxim.myscoutee.domain.affinity.api.UserAffinityScores;
import com.raxim.myscoutee.domain.affinity.api.UserAffinityChanges;
import com.raxim.myscoutee.domain.assets.api.TicketReads;
import com.raxim.myscoutee.domain.content.api.ContentRegistration;
import com.raxim.myscoutee.domain.email.api.UserActivityScheduling;
import com.raxim.myscoutee.domain.payments.api.AffiliateRegistrations;
import com.raxim.myscoutee.domain.payments.api.PaymentMethods;

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
import java.util.concurrent.ConcurrentHashMap;
import java.time.Instant;
import java.util.UUID;

import org.bson.types.ObjectId;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.server.ResponseStatusException;

import com.raxim.myscoutee.domain.accounts.security.firebase.DevelopmentIdentityEmail;
import com.raxim.myscoutee.domain.accounts.security.firebase.dto.FirebasePrincipal;
import com.raxim.myscoutee.domain.assets.api.AssetCatalog;
import com.raxim.myscoutee.domain.events.api.EventHomeReads.Event;
import static com.raxim.myscoutee.domain.events.api.EventOwnership.Event.STATUS_ACTIVE;
import com.raxim.myscoutee.domain.events.api.MemberDirectory.Member;
import com.raxim.myscoutee.domain.feedback.api.FeedbackDirectory.Answer;
import com.raxim.myscoutee.domain.accounts.document.UserFilterPreferences;
import com.raxim.myscoutee.domain.accounts.document.UserExperienceProfile;
import com.raxim.myscoutee.domain.affinity.api.EdgeView;
import com.raxim.myscoutee.domain.accounts.document.UserFriendship;
import com.raxim.myscoutee.domain.affinity.api.RatingView;
import com.raxim.myscoutee.domain.accounts.document.Users;
import com.raxim.myscoutee.domain.accounts.dto.AuthDtos.UserActivitiesDto;
import com.raxim.myscoutee.domain.accounts.dto.AuthDtos.UserAssetCountersDto;
import com.raxim.myscoutee.domain.accounts.dto.AuthDtos.UserByIdResponseDto;
import com.raxim.myscoutee.domain.accounts.dto.AuthDtos.UserChatCountersDto;
import com.raxim.myscoutee.domain.accounts.dto.AuthDtos.UserSupportCaseCountersDto;
import com.raxim.myscoutee.domain.accounts.dto.AuthDtos.UserDeleteRequestDto;
import com.raxim.myscoutee.domain.accounts.dto.AuthDtos.ProfileExtDto;
import com.raxim.myscoutee.domain.accounts.dto.AuthDtos.ProfileExtByIdResponseDto;
import com.raxim.myscoutee.domain.accounts.dto.AuthDtos.UserDto;
import com.raxim.myscoutee.domain.accounts.dto.AuthDtos.UserNotificationDeviceDto;
import com.raxim.myscoutee.domain.accounts.dto.AuthDtos.UserEventCountersDto;
import com.raxim.myscoutee.domain.accounts.dto.AuthDtos.UserFeedbackCountersDto;
import com.raxim.myscoutee.domain.accounts.dto.AuthDtos.UserGameFilterPreferencesDto;
import com.raxim.myscoutee.domain.accounts.dto.AuthDtos.UserImpressionsDto;
import com.raxim.myscoutee.domain.accounts.dto.AuthDtos.UserImpressionsSectionDto;
import com.raxim.myscoutee.domain.accounts.dto.AuthDtos.ProfileDetailGroupDto;
import com.raxim.myscoutee.domain.accounts.dto.AuthDtos.ProfileDetailRowDto;
import com.raxim.myscoutee.domain.accounts.dto.AuthDtos.UserLogoutRequestDto;
import com.raxim.myscoutee.domain.accounts.dto.AuthDtos.DemoUserListItemDto;
import com.raxim.myscoutee.domain.accounts.dto.AuthDtos.UserMenuCountersDto;
import com.raxim.myscoutee.domain.accounts.dto.AuthDtos.UserNotificationPreferencesDto;
import com.raxim.myscoutee.domain.accounts.dto.AuthDtos.UserPaymentTotalsDto;
import com.raxim.myscoutee.domain.accounts.dto.AuthDtos.UserPersonalityTraitDto;
import com.raxim.myscoutee.domain.accounts.dto.AuthDtos.UserLocationEligibilityResponseDto;
import com.raxim.myscoutee.domain.accounts.dto.AuthDtos.UserRealtimeCountersDto;
import com.raxim.myscoutee.domain.accounts.dto.AuthDtos.UserRealtimeLongPollRequestDto;
import com.raxim.myscoutee.domain.accounts.dto.AuthDtos.UserRealtimeLongPollResponseDto;
import com.raxim.myscoutee.domain.accounts.dto.AuthDtos.UserSubmitActionResponseDto;
import com.raxim.myscoutee.domain.assets.dto.AssetsDtos.AssetTicketsPageDto;
import com.raxim.myscoutee.domain.accounts.dto.ExperienceDtos.ExperienceEntryDto;
import com.raxim.myscoutee.common.dto.SharedDtos.LocationCoordinatesDto;
import com.raxim.myscoutee.domain.events.api.EventHomeReads;
import com.raxim.myscoutee.domain.events.api.MemberDirectory;
import com.raxim.myscoutee.domain.feedback.api.FeedbackDirectory;
import com.raxim.myscoutee.domain.accounts.repository.UserFilterPreferencesRepository;
import com.raxim.myscoutee.domain.accounts.repository.UserExperienceProfilesRepository;
import com.raxim.myscoutee.domain.affinity.api.EdgeDirectory;
import com.raxim.myscoutee.domain.accounts.repository.UserFriendshipsRepository;
import com.raxim.myscoutee.domain.affinity.api.RatingDirectory;
import com.raxim.myscoutee.domain.accounts.repository.UsersRepository;
import com.raxim.myscoutee.domain.access.api.AccessPermissions;

@Service
public class HomeUserProfileService implements com.raxim.myscoutee.domain.accounts.api.ProfilePresentation, com.raxim.myscoutee.domain.accounts.api.RatingProfiles,
        ProfileReadCache,
        com.raxim.myscoutee.domain.accounts.api.RatingSession, com.raxim.myscoutee.domain.accounts.api.FeedbackSession, com.raxim.myscoutee.domain.accounts.api.ProfileCards {

    private static final List<String> HOME_GAME_PROFILE_STATUSES = List.of("public", "friends only");
    private static final Set<String> INSIDE_NETWORK_GAME_PROFILE_STATUSES = Set.of("public", "friends only");
    private static final Set<String> HARD_HIDDEN_PROFILE_STATUSES = Set.of("blocked", "inactive", "deleted", PROFILE_STATUS_ONBOARDING);
    private static final long FEEDBACK_UNLOCK_DELAY_MS = 2L * 60L * 60L * 1000L;
    private static final String OWNER_TYPE_EVENT = "event";
    private static final String ASSET_TYPE_TRANSPORT = AssetCatalog.TYPE_TRANSPORT;
    private static final String ASSET_TYPE_ACCOMMODATION = AssetCatalog.TYPE_ACCOMMODATION;
    private static final String ASSET_TYPE_SUPPLIES = AssetCatalog.TYPE_SUPPLIES;
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
    private static final int OFFLINE_TICKET_SNAPSHOT_PAGE_SIZE = 18;
    public static final int HOME_GAME_RATE_PROJECTION_VERSION = com.raxim.myscoutee.domain.accounts.api.AccountAffinityProjections.RATING_VERSION;
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

    @org.springframework.beans.factory.annotation.Autowired
    @org.springframework.context.annotation.Lazy
    private ContentRegistration contentModeration;
    @org.springframework.beans.factory.annotation.Autowired
    @org.springframework.context.annotation.Lazy
    private PaymentMethods savedPaymentMethods;

    private final com.raxim.myscoutee.domain.groups.api.GroupDirectory communityGroupsRepository;
    @org.springframework.beans.factory.annotation.Autowired
    private ProfileMenuCountersService menuCounters;
    private final UsersRepository usersRepository;
    private final SelectedProfileService selectedProfile;
    private final UserFilterPreferencesRepository userFilterPreferencesRepository;
    private final UserExperienceProfilesRepository userExperienceProfilesRepository;
    @org.springframework.beans.factory.annotation.Autowired private AccountLifecycleService lifecycle;
    @org.springframework.beans.factory.annotation.Autowired private AccountLocationService locations;
    private final EdgeDirectory userAffinityEdgesRepository;
    private final UserFriendshipsRepository userFriendshipsRepository;
    private final RatingDirectory userRatesRepository;
    private final EventHomeReads activityEventsRepository;
    private final MemberDirectory activityMembersRepository;
    private final FeedbackDirectory feedbackAnswersRepository;
    private final UserActivityScheduling scheduledMessageTaskService;
    private final UserAffinityScores absoluteAffinityService;
    private final UserAffinityChanges affinityRecomputeTaskService;
    private final OperationalTelemetry adminTelemetryService;
    private final AdministratorClassification adminMenuCounterService;
    private final AccessPermissions accessControlService;
    private final TicketReads assetsService;
    private final AffiliateRegistrations affiliateService;
    private com.raxim.myscoutee.domain.notifications.api.RoleNotifications roleNotifications;

    @org.springframework.beans.factory.annotation.Autowired
    void setRoleNotifications(com.raxim.myscoutee.domain.notifications.api.RoleNotifications value) {
        this.roleNotifications = value;
    }
    private final Map<UserReadCacheKey, CacheEntry<UserImpressionsDto>> userImpressionsCacheByUserId = new ConcurrentHashMap<>();
    private final Map<AffinityReadCacheKey, CacheEntry<Map<String, Double>>> affinityWeightsCacheByUserIdsKey = new ConcurrentHashMap<>();
    private final Map<UserReadCacheKey, Object> userReadCacheLocksByUserId = new ConcurrentHashMap<>();
    private final Object gameStackSnapshotCacheLock = new Object();
    private final Map<ReadCacheScope, CacheEntry<GameStackSnapshot>> gameStackSnapshotCache = new ConcurrentHashMap<>();
    private final java.util.concurrent.atomic.AtomicLong readCacheRevision = new java.util.concurrent.atomic.AtomicLong();

    private record ReadCacheScope(com.raxim.myscoutee.common.config.mongo.MongoSessionMode mode, boolean active, String groupId) {}
    private record UserReadCacheKey(ReadCacheScope scope, String userId) {}
    private record AffinityReadCacheKey(ReadCacheScope scope, List<String> userIds) {}
    private ReadCacheScope readCacheScope() {
        return new ReadCacheScope(com.raxim.myscoutee.common.config.mongo.MongoSessionModeContext.currentMode(),
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.isActive(),
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.groupId());
    }

    @org.springframework.beans.factory.annotation.Autowired
    void watchProfileCache(com.raxim.myscoutee.common.config.mongo.MongoChangeStreamService changes) {
        changes.watch("profile-read-cache", Set.of("users"), Set.of(), () -> { clearUserReadCaches(); return null; }, this::clearUserReadCaches, this::clearUserReadCaches);
    }

    private void clearUserReadCaches() {
        readCacheRevision.incrementAndGet();
        userImpressionsCacheByUserId.clear();
        affinityWeightsCacheByUserIdsKey.clear();
        gameStackSnapshotCache.clear();
    }

    public HomeUserProfileService(
            UsersRepository usersRepository,
            SelectedProfileService selectedProfile,
            UserFilterPreferencesRepository userFilterPreferencesRepository,
            UserExperienceProfilesRepository userExperienceProfilesRepository,
            EdgeDirectory userAffinityEdgesRepository,
            UserFriendshipsRepository userFriendshipsRepository,
            RatingDirectory userRatesRepository,
            EventHomeReads activityEventsRepository,
            MemberDirectory activityMembersRepository,
            FeedbackDirectory feedbackAnswersRepository,
            UserActivityScheduling scheduledMessageTaskService,
            UserAffinityScores absoluteAffinityService,
            UserAffinityChanges affinityRecomputeTaskService,
            OperationalTelemetry adminTelemetryService,
            AdministratorClassification adminMenuCounterService,
            AccessPermissions accessControlService,
            TicketReads assetsService,
            AffiliateRegistrations affiliateService,
            com.raxim.myscoutee.domain.groups.api.GroupDirectory communityGroupsRepository) {
        this.communityGroupsRepository = communityGroupsRepository;
        this.usersRepository = usersRepository;
        this.selectedProfile = selectedProfile;
        this.userFilterPreferencesRepository = userFilterPreferencesRepository;
        this.userExperienceProfilesRepository = userExperienceProfilesRepository;
        this.userAffinityEdgesRepository = userAffinityEdgesRepository;
        this.userFriendshipsRepository = userFriendshipsRepository;
        this.userRatesRepository = userRatesRepository;
        this.activityEventsRepository = activityEventsRepository;
        this.activityMembersRepository = activityMembersRepository;
        this.feedbackAnswersRepository = feedbackAnswersRepository;
        this.scheduledMessageTaskService = scheduledMessageTaskService;
        this.absoluteAffinityService = absoluteAffinityService;
        this.affinityRecomputeTaskService = affinityRecomputeTaskService;
        this.adminTelemetryService = adminTelemetryService;
        this.adminMenuCounterService = adminMenuCounterService;
        this.accessControlService = accessControlService;
        this.assetsService = assetsService;
        this.affiliateService = affiliateService;
    }

    public UserByIdResponseDto queryUserById(String requestedUserId) {
        String resolvedUserId = resolveSelectedUserId(requestedUserId);
        if (!StringUtils.hasText(resolvedUserId)) {
            return StringUtils.hasText(requestedUserId) ? null : buildCurrentPrivilegedPrincipalResponse();
        }

        Users user = findUser(resolvedUserId);
        if (user == null) {
            return buildCurrentPrivilegedPrincipalResponse();
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
                isCurrentRequestOperator(),
                userDto.activities(),
                userDto.notificationPreferences(),
                filterCount,
                filterPreferences,
                menuCounters);
    }

    // Initial avatar persistence changes the selector's location-required badge too.
    @CacheEvict(value = "demo_users", allEntries = true, condition = "#latitude != null || #longitude != null")
    public ProfileExtByIdResponseDto loadProfileExtById(String requestedUserId, Double latitude, Double longitude) {
        locations.updateLoadedLocation(requestedUserId, latitude, longitude);
        return loadProfileExtById(requestedUserId);
    }

    public ProfileExtByIdResponseDto loadProfileExtById(String requestedUserId) {
        UserByIdResponseDto response = queryUserById(requestedUserId);
        if (response == null) {
            return null;
        }
        UserDto profile = toUserDto(response);
        return new ProfileExtByIdResponseDto(
                new ProfileExtDto(profile, queryUserExperienceEntries(profile.id())),
                response.filterCount(),
                response.filterPreferences(),
                response.counterOverrides());
    }

    private UserByIdResponseDto buildCurrentPrivilegedPrincipalResponse() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        boolean admin = isCurrentRequestAdmin();
        boolean operator = isCurrentRequestOperator();
        if (authentication == null
                || !(authentication.getPrincipal() instanceof FirebasePrincipal firebasePrincipal)
                || (!admin && !operator)) {
            return null;
        }
        String userId = normalizeId(firebasePrincipal.getUserId());
        if (!StringUtils.hasText(userId)) {
            return null;
        }
        String email = safeText(firebasePrincipal.getEmail());
        String name = admin ? adminDisplayName(email) : "Operator";
        UserActivitiesDto activities = toUserActivitiesDto(null, 0, 0);
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
                operator ? "Operator workspace" : "",
                operator ? "Operator" : "",
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
                admin,
                operator,
                activities,
                new UserNotificationPreferencesDto(false),
                0,
                null,
                menuCounters);
    }

    private UserDto toUserDto(UserByIdResponseDto response) {
        return new UserDto(
                response.id(),
                response.name(),
                response.age(),
                response.birthday(),
                response.city(),
                response.height(),
                response.physique(),
                response.languages(),
                response.horoscope(),
                response.initials(),
                response.gender(),
                response.statusText(),
                response.hostTier(),
                response.traitLabel(),
                response.completion(),
                response.profileFormVersion(),
                response.headline(),
                response.about(),
                response.affinity(),
                response.locationCoordinates(),
                response.partitionKey(),
                response.images(),
                response.profileDetails(),
                response.impressions(),
                response.profileStatus(),
                response.previousProfileStatus(),
                response.deletedAtIso(),
                response.admin(),
                response.operator(),
                response.activities(),
                response.notificationPreferences());
    }

    private List<ExperienceEntryDto> queryUserExperienceEntries(String userId) {
        String resolvedUserId = normalizeId(userId);
        if (!StringUtils.hasText(resolvedUserId)) {
            return List.of();
        }
        return userExperienceProfilesRepository.findByUserId(resolvedUserId)
                .map(UserExperienceProfile::getEntries)
                .map(this::toExperienceEntryDtos)
                .orElseGet(List::of);
    }

    private List<ExperienceEntryDto> toExperienceEntryDtos(List<UserExperienceProfile.ExperienceItemRecord> entries) {
        if (entries == null || entries.isEmpty()) {
            return List.of();
        }
        return entries.stream()
                .filter(Objects::nonNull)
                .map(entry -> new ExperienceEntryDto(
                        safeText(entry.getId()),
                        normalizeExperienceType(entry.getType()),
                        safeText(entry.getTitle()),
                        safeText(entry.getOrg()),
                        safeText(entry.getCity()),
                        safeText(entry.getDateFrom()),
                        normalizeExperienceDateTo(entry.getDateTo()),
                        safeText(entry.getDescription())))
                .toList();
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
        Users account = StringUtils.hasText(user.getAccountUserId()) ? findUser(user.getAccountUserId()) : user;
        UserRealtimeCountersDto counters = buildRealtimeCounters(user, request == null ? null : request.cursor(), account);
        AssetTicketsPageDto offlineTicketSnapshot = assetsService.queryTicketPage(
                resolvedUserId,
                0,
                OFFLINE_TICKET_SNAPSHOT_PAGE_SIZE,
                "upcoming");
        var following = OrganizerFollowingService.state(user);
        var paymentOptions = savedPaymentMethods == null ? null : savedPaymentMethods.options();
        return new UserRealtimeLongPollResponseDto(
                resolvedUserId,
                safeText(user.getProfileStatus()),
                toLocationCoordinatesDto(user.getLocationCoordinates()),
                counters,
                impressions,
                offlineTicketSnapshot,
                paymentTotalsDto(user),
                (user.getDevices() == null ? List.<Users.UserDeviceRecord>of() : user.getDevices()).stream()
                        .filter(Objects::nonNull)
                        .map(device -> new UserNotificationDeviceDto(
                                device.getDeviceId(), Boolean.TRUE.equals(device.getNotificationsEnabled())))
                        .toList(),
                buildRealtimeCursor(user, counters),
                Instant.now().toString(),
                new com.raxim.myscoutee.domain.accounts.dto.AuthDtos.UserFollowingDto(
                        following.organizerIds(), following.eventCount(), following.nextExpiryAtIso()),
                contentModeration != null && adminMenuCounterService.isAdminUser(user) ? contentModeration.snapshot() : null,
                user.getFeedCounters() == null ? com.raxim.myscoutee.domain.accounts.dto.FeedCountersRecord.empty() : user.getFeedCounters(),
                paymentOptions != null && paymentOptions.cardsAvailable(),
                paymentOptions == null ? List.of() : paymentOptions.currencies(),
                paymentOptions == null ? java.util.Map.of("EUR", 1D) : paymentOptions.eurRates(),
                StringUtils.hasText(user.getSummaryCurrency()) ? user.getSummaryCurrency() : "EUR",
                account != null && account != user ? buildMenuCounters(account, account) : null);
    }

    public UserLocationEligibilityResponseDto queryLocationEligibility(Double latitude, Double longitude) {
        return locations.queryLocationEligibility(latitude, longitude);
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
        persistUserFilterPreferences(resolvedUserId, preferences);
    }

    private void persistUserFilterPreferences(String resolvedUserId, UserGameFilterPreferencesDto preferences) {
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
        return saveUserProfile(user, null);
    }

    private UserDto saveUserProfile(UserDto user, String affiliateCode) {
        if (user == null || !StringUtils.hasText(user.id())) {
            return null;
        }

        String normalizedUserId = normalizeId(user.id());
        if (!accessControlService.canCurrentActorEditProfile(normalizedUserId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Authenticated user is not allowed to edit this profile.");
        }
        Users existing = usersRepository.findByUserId(normalizedUserId).orElse(null);
        boolean wasTrackedForAccountPurge = existing != null
                && Boolean.TRUE.equals(existing.getAccountPurgePendingCounterTracked());
        boolean completingRegistration = existing == null || PROFILE_STATUS_ONBOARDING.equals(existing.getProfileStatus());
        Users merged = mergeUserDocument(existing, user);
        if (existing == null) {
            merged.setAffiliateRegistration(affiliateService.resolveRegistration(affiliateCode, normalizedUserId));
        }
        requireUniqueEmailOwner(merged);
        boolean shouldTrackForAccountPurge = isAccountPurgeCandidate(merged);
        merged.setAccountPurgePendingCounterTracked(shouldTrackForAccountPurge);
        Users saved;
        try {
            saved = usersRepository.save(merged);
        } catch (DataIntegrityViolationException exception) {
            throwEmailConflictIfPresent(merged, exception);
            throw exception;
        }
        affiliateService.recordRegistration(saved.getAffiliateRegistration());
        if (completingRegistration && !PROFILE_STATUS_ONBOARDING.equals(saved.getProfileStatus())
                && "A".equals(saved.getStatus()) && roleNotifications != null) {
            roleNotifications.memberJoined(new com.raxim.myscoutee.domain.notifications.api.RoleNotifications.MemberRegistration(
                    saved.getUserId(), saved.getEmail(), saved.isOperator(),
                    StringUtils.hasText(saved.getWorkspaceGroupId()) || StringUtils.hasText(saved.getAccountUserId())));
        }
        if (existing == null && userFilterPreferencesRepository.findByUserId(normalizedUserId).isEmpty()) {
            persistUserFilterPreferences(normalizedUserId, buildDefaultFilterPreferences(saved));
        }
        if (wasTrackedForAccountPurge != shouldTrackForAccountPurge) {
            lifecycle.adjustAccountPurgePendingCount(saved.getUserId(), shouldTrackForAccountPurge ? 1 : -1);
        }
        Users resolved = syncCurrentUserEmail(syncComputedUserPartition(saved));
        evictUserReadCaches(normalizedUserId);
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

    @CacheEvict(value = "demo_users", allEntries = true)
    public UserDto saveUserProfileExt(ProfileExtDto request) {
        if (request == null || request.profile() == null) {
            return null;
        }

        UserDto savedUser = saveUserProfile(request.profile(), request.affiliateCode());
        String resolvedUserId = normalizeId(savedUser == null ? null : savedUser.id());
        if (StringUtils.hasText(resolvedUserId)) {
            saveUserExperienceProfile(resolvedUserId, request.experienceEntries());
        }
        return savedUser;
    }

    public UserSubmitActionResponseDto logout(UserLogoutRequestDto request) {
        return lifecycle.logout(request);
    }

    public UserSubmitActionResponseDto deleteUser(UserDeleteRequestDto request) {
        return lifecycle.deleteUser(request);
    }

    public UserSubmitActionResponseDto scheduleUserDeletionByUserId(String userId, String source) {
        return lifecycle.scheduleUserDeletionByUserId(userId, source);
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

        Set<String> ratedUserIds = queryRatedUserIds(normalizedUserId, activeUser);
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
                .filter(user -> WorkspaceContext.sameWorkspace(activeUser, user))
                .filter(user -> !normalizedUserId.equals(normalizeId(user.getId())))
                .filter(user -> !metUserIds.contains(normalizeId(user.getId())))
                .filter(user -> !ratedUserIds.contains(normalizeId(user.getId())))
                .filter(user -> !friendsInCommonCandidateIds.contains(normalizeId(user.getId())))
                .sorted(homeUserComparator(normalizedUserId, edgeWeightsByPairKey, rankingContext))
                .toList();
    }

    public List<GameSocialCardCandidate> querySeparatedFriendCards(String activeUserId) {
        GameStackSnapshot snapshot = resolveGameStackSnapshot();
        List<Users> users = snapshot.visibleGameUsers();
        return querySeparatedFriendCards(
                activeUserId,
                users,
                snapshot.socialGraph(),
                queryAffinityEdgeWeights(userIds(users)));
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

        Set<String> ratedPairKeys = queryRatedPairKeys(normalizedUserId, usersById.get(normalizedUserId));
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
        GameStackSnapshot snapshot = resolveGameStackSnapshot();
        List<Users> users = snapshot.visibleGameUsers();
        return queryFriendsInCommonCards(
                activeUserId,
                users,
                snapshot.socialGraph(),
                queryAffinityEdgeWeights(userIds(users)));
    }

    public List<GameSocialCardCandidate> queryOutsideNetworkCards(String activeUserId) {
        GameStackSnapshot snapshot = resolveGameStackSnapshot();
        return queryOutsideNetworkCards(activeUserId, snapshot.visibleGameUsers(), snapshot.socialGraph());
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

        Set<String> ratedUserIds = queryRatedUserIds(normalizedUserId, usersById.get(normalizedUserId));
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
        Set<String> ratedPairKeys = queryRatedPairKeys(normalizedUserId, usersById.get(normalizedUserId));
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
        return resolveGameStackSnapshot().visibleGameUsers();
    }

    ActivitySocialGraph queryActivitySocialGraph() {
        return resolveGameStackSnapshot().socialGraph();
    }

    public List<DemoUserListItemDto> queryDemoUserListItems() {
        return queryDemoUserListItems(null, "member");
    }

    public List<DemoUserListItemDto> queryDemoUserListItems(Integer limit) {
        return queryDemoUserListItems(limit, "member");
    }

    public List<DemoUserListItemDto> queryDemoUserListItems(Integer limit, String role) {
        String selectorRole = normalizeDemoSelectorRole(role);
        Map<LocationCoordinatesDto, Boolean> locationChecks = new java.util.HashMap<>();
        var allUsers = usersRepository.findAllByOrderByNameAscUserIdAsc();
        var baseIds = com.raxim.myscoutee.domain.groups.api.BaseGroups.BASE_IDS;
        var baseTypes = new java.util.HashMap<String, String>();
        communityGroupsRepository.findByIdIn(baseIds).stream()
                .filter(group -> !group.deleted() && group.policy().workspace())
                .forEach(group -> baseTypes.put(group.id(), group.effectiveType()));
        Set<String> profileKeys = allUsers.stream().filter(user -> baseTypes.containsKey(user.getWorkspaceGroupId()))
                .map(user -> user.getWorkspaceGroupId() + ":" + user.getAccountUserId()).collect(java.util.stream.Collectors.toSet());
        var memberships = new java.util.HashMap<String, List<String>>();
        activityMembersRepository.findByOwnerTypeAndOwnerIdIn("community", baseTypes.keySet()).stream()
                .filter(member -> "accepted".equals(member.getStatus())
                    && profileKeys.contains(member.getOwnerId() + ":" + member.getUserId()))
                .forEach(member -> memberships.computeIfAbsent(member.getUserId(), ignored -> new java.util.ArrayList<>(List.of("dating")))
                    .add(baseTypes.get(member.getOwnerId())));
        return allUsers.stream()
                .filter(user -> user.getWorkspaceGroupId() == null)
                .filter(user -> isSelectableDemoUserDocument(user, selectorRole))
                .limit(resolveDemoUserListLimit(limit))
                .map(user -> toDemoUserListItemDto(user, "member".equals(selectorRole)
                        && demoLocationRequired(user, locationChecks), memberships.getOrDefault(user.getUserId(), List.of("dating"))))
                .filter(Objects::nonNull)
                .toList();
    }

    @Override public com.raxim.myscoutee.domain.accounts.dto.FeedbackSessionDto resolveFeedbackSession(String requestedUserId) {
        return com.raxim.myscoutee.domain.accounts.dto.FeedbackSessionDto.from(resolveCurrentUser(requestedUserId));
    }

    @Override public com.raxim.myscoutee.domain.accounts.dto.RatingSessionDto resolveRatingSession(String requestedUserId) {
        var user = resolveCurrentUser(requestedUserId);
        if (user == null) return null;
        var location = user.getLocationCoordinates();
        return new com.raxim.myscoutee.domain.accounts.dto.RatingSessionDto(
                new com.raxim.myscoutee.domain.accounts.dto.ProfileIdentityDto(
                        normalizeId(user.getUserId()), user.getAccountUserId(), user.getWorkspaceGroupId()),
                location == null ? null : new LocationCoordinatesDto(location.latitude(), location.longitude()),
                user.getActivities() == null ? null : user.getActivities().game());
    }

    @Override public List<UserDto> presentProfiles(Collection<String> userIds) {
        if (userIds == null || userIds.isEmpty()) return List.of();
        return usersRepository.findByUserIdIn(userIds).stream().filter(Objects::nonNull)
                .map(this::toUserDto).toList();
    }

    @Override public List<UserDto> presentGameCards(Collection<String> userIds) {
        if (userIds == null || userIds.isEmpty()) return List.of();
        return usersRepository.findByUserIdIn(userIds).stream().filter(Objects::nonNull)
                .map(this::toGameCardUserDto).toList();
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

    @Override public UserDto present(com.raxim.myscoutee.domain.accounts.api.WorkspaceProfile profile) {
        return toUserDto((Users) profile);
    }

    public UserDto toUserDto(Users user) {
        return toUserDto(user, true);
    }

    public UserDto toGameCardUserDto(Users user) {
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
                user.isOperator(),
                toUserActivitiesDto(user.getActivities(), user.getPaymentRefundsPending(), user.getContactRequestsPending()),
                includeImpressions
                        ? new UserNotificationPreferencesDto(
                                user.getNotificationPreferences() != null
                                        && Boolean.TRUE.equals(user.getNotificationPreferences().muted()))
                        : null);
    }

    private boolean isCurrentRequestAdmin() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null) {
            return false;
        }
        return authentication.getAuthorities().stream()
                .anyMatch(authority -> "A".equals(authority.getAuthority()));
    }

    private boolean isCurrentRequestOperator() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null) {
            return false;
        }
        return authentication.getAuthorities().stream()
                .anyMatch(authority -> "O".equals(authority.getAuthority()));
    }

    private boolean isCurrentRequestOperatorForUser(String userId) {
        String normalizedUserId = normalizeId(userId);
        if (!StringUtils.hasText(normalizedUserId) || !isCurrentRequestOperator()) {
            return false;
        }
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof FirebasePrincipal firebasePrincipal)) {
            return false;
        }
        return normalizedUserId.equals(normalizeId(firebasePrincipal.getUserId()));
    }

    private boolean demoLocationRequired(Users user, Map<LocationCoordinatesDto, Boolean> checks) {
        LocationCoordinatesDto point = toLocationCoordinatesDto(user.getLocationCoordinates());
        if (point == null || point.latitude() == null || point.longitude() == null
                || !Double.isFinite(point.latitude()) || !Double.isFinite(point.longitude())
                || Math.abs(point.latitude()) > 90 || Math.abs(point.longitude()) > 180) return true;
        // The existing cached selector checks shared seed coordinates once, not once per profile.
        return checks.computeIfAbsent(point, coordinates ->
                !queryLocationEligibility(coordinates.latitude(), coordinates.longitude()).eligible());
    }

    private DemoUserListItemDto toDemoUserListItemDto(Users user, boolean locationRequired, List<String> baseGroupTypes) {
        if (user == null) {
            return null;
        }
        return new DemoUserListItemDto(
                normalizeId(user.getId()),
                toLocationCoordinatesDto(user.getLocationCoordinates()),
                locationRequired,
                nullToEmpty(user.getName()),
                nullToEmpty(user.getCity()),
                nullToEmpty(user.getInitials()),
                resolveDemoUserAvatarUrl(user),
                normalizeUserListGender(user.getGender()),
                nullToEmpty(user.getStatusText()),
                normalizeCount(user.getCompletion()),
                normalizeCount(user.getProfileFormVersion()),
                safeText(user.getStatus()),
                safeText(user.getProfileStatus()),
                nullToEmpty(user.getDeletedAtIso()),
                baseGroupTypes);
    }

    private String resolveDemoUserAvatarUrl(Users user) {
        return normalizeStrings(user.getImages()).stream()
                .findFirst()
                .map(imageUrl -> imageUrl.endsWith("/large.webp")
                        ? imageUrl.substring(0, imageUrl.length() - "/large.webp".length()) + "/small.webp"
                        : imageUrl)
                .orElse("");
    }

    public Users resolveCurrentUser(String requestedUserId) {
        return selectedProfile.resolveCurrentUser(requestedUserId);
    }

    public String resolveSelectedUserId(String requestedUserId) {
        return selectedProfile.resolveSelectedUserId(requestedUserId);
    }

    public com.raxim.myscoutee.domain.accounts.dto.ProfileIdentityDto resolveSelectedIdentity(String requestedUserId) {
        return selectedProfile.resolveSelectedIdentity(requestedUserId);
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

        var cacheKey = new AffinityReadCacheKey(readCacheScope(), List.copyOf(normalizedUserIds));
        long revision = readCacheRevision.get();
        long nowMs = System.currentTimeMillis();
        CacheEntry<Map<String, Double>> cached = affinityWeightsCacheByUserIdsKey.get(cacheKey);
        if (cached != null) {
            if (cached.expiresAtMs() > nowMs && cached.revision() == readCacheRevision.get()) {
                return cached.value();
            }
            affinityWeightsCacheByUserIdsKey.remove(cacheKey, cached);
        }

        Map<String, Double> weightsByPairKey = new LinkedHashMap<>();
        for (EdgeView edge : userAffinityEdgesRepository.findRelevantByUserIds(normalizedUserIds)) {
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
        affinityWeightsCacheByUserIdsKey.put(cacheKey, new CacheEntry<>(resolved, nowMs + USER_READ_SNAPSHOT_CACHE_TTL_MS, revision));
        return resolved;
    }

    private Map<String, Long> queryLatestHomeActivityMsByUserId(
            List<Users> visibleGameUsers,
            List<? extends Event> memberProjections) {
        Map<String, Long> latestByUserId = new LinkedHashMap<>();
        boolean allRateProjectionsCurrent = visibleGameUsers != null
                && !visibleGameUsers.isEmpty()
                && visibleGameUsers.stream().allMatch(this::hasCurrentHomeGameRateProjection);
        if (allRateProjectionsCurrent) {
            for (Users user : visibleGameUsers) {
                rememberLatestActivityMs(
                        latestByUserId,
                        user == null ? null : user.getId(),
                        user == null || user.getHomeGameLastRateActivityMs() == null
                                ? 0L
                                : user.getHomeGameLastRateActivityMs().longValue());
            }
        } else {
            for (RatingView record : userRatesRepository.findAll()) {
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
        }

        if (hasHomeGameMemberProjections(memberProjections)) {
            for (Event event : memberProjections) {
                long timestampMs = homeGameEventActivityMillis(event);
                for (String userId : normalizeStrings(event == null ? null : event.getAcceptedMemberUserIds())) {
                    rememberLatestActivityMs(latestByUserId, userId, timestampMs);
                }
            }
        } else {
            for (Member member : activityMembersRepository.findAll()) {
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

    private double resolveAffinityEdgeWeight(EdgeView edge) {
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
        return SelectedProfileService.isUsableUserDocument(user);
    }

    private boolean isSelectableDemoUserDocument(Users user) {
        return isSelectableDemoUserDocument(user, "member");
    }

    private boolean isSelectableDemoUserDocument(Users user, String selectorRole) {
        if (!isUsableUserDocument(user)
                || PROFILE_STATUS_ONBOARDING.equals(resolveProfileStatus(user))) {
            return false;
        }
        return switch (selectorRole) {
            case "admin" -> isDemoAdminUserDocument(user);
            case "operator" -> isDemoOperatorUserDocument(user);
            default -> !isDemoAdminUserDocument(user) && !isDemoOperatorUserDocument(user);
        };
    }

    private boolean isDemoAdminUserDocument(Users user) {
        return user != null
                && (normalizeId(user.getId()).startsWith("admin-demo-")
                        || "admin".equalsIgnoreCase(safeText(user.getHostTier())));
    }

    private boolean isDemoOperatorUserDocument(Users user) {
        return user != null && user.isOperator();
    }

    private String normalizeDemoSelectorRole(String role) {
        String normalized = safeText(role).toLowerCase(Locale.ROOT);
        return switch (normalized) {
            case "admin", "operator" -> normalized;
            default -> "member";
        };
    }

    boolean isPublicGameUser(Users user) {
        return isUsableUserDocument(user)
                && !isDemoOperatorUserDocument(user)
                && "public".equals(resolveProfileStatus(user));
    }

    boolean isInsideNetworkGameUser(Users user) {
        return isUsableUserDocument(user)
                && !isDemoOperatorUserDocument(user)
                && INSIDE_NETWORK_GAME_PROFILE_STATUSES.contains(resolveProfileStatus(user));
    }

    @Override public boolean activityRateVisible(com.raxim.myscoutee.domain.accounts.api.WorkspaceProfile profile) {
        return isActivityRateVisibleUser((Users) profile);
    }

    @Override
    public List<com.raxim.myscoutee.domain.accounts.dto.RatingProfileDto> queryRatingProfiles(java.util.Collection<String> userIds) {
        return usersRepository.findByUserIdIn(userIds).stream().map(user -> {
            if (user == null) return (com.raxim.myscoutee.domain.accounts.dto.RatingProfileDto) null;
            var coordinates = user.getLocationCoordinates();
            return new com.raxim.myscoutee.domain.accounts.dto.RatingProfileDto(user.getId(), user.getUserId(),
                    user.getWorkspaceGroupId(), coordinates == null ? null
                            : new LocationCoordinatesDto(coordinates.latitude(), coordinates.longitude()),
                    activityRateVisible(user));
        }).toList();
    }
    public boolean isActivityRateVisibleUser(Users user) {
        return isUsableUserDocument(user)
                && !isDemoOperatorUserDocument(user)
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

    private Set<String> queryRatedUserIds(String raterUserId, Users rater) {
        String normalizedRaterUserId = normalizeId(raterUserId);
        if (!StringUtils.hasText(normalizedRaterUserId)) {
            return Set.of();
        }
        if (hasCurrentHomeGameRateProjection(rater)) {
            return normalizeStrings(rater.getHomeGameRatedUserIds()).stream()
                    .filter(userId -> !normalizedRaterUserId.equals(userId))
                    .collect(LinkedHashSet::new, Set::add, Set::addAll);
        }

        Set<String> ratedUserIds = new LinkedHashSet<>();
        for (RatingView record : userRatesRepository.findHomeGameExclusionProjections(normalizedRaterUserId)) {
            if (!hasOwnRecordedActivityRate(record, normalizedRaterUserId)) {
                continue;
            }
            addRatedUserId(ratedUserIds, normalizedRaterUserId, record.getRelatedUserId());
            addRatedUserId(ratedUserIds, normalizedRaterUserId, record.getSecondaryRelatedUserId());
        }
        return Set.copyOf(ratedUserIds);
    }

    private Set<String> queryRatedPairKeys(String raterUserId, Users rater) {
        Set<String> ratedPairKeys = new LinkedHashSet<>();
        if (!StringUtils.hasText(raterUserId)) {
            return ratedPairKeys;
        }
        if (hasCurrentHomeGameRateProjection(rater)) {
            for (String ratedPairKey : normalizeStrings(rater.getHomeGameRatedPairKeys())) {
                int separator = ratedPairKey.indexOf(':');
                if (separator <= 0 || separator >= ratedPairKey.length() - 1) {
                    continue;
                }
                ratedPairKeys.add(pairKey(
                        ratedPairKey.substring(0, separator),
                        ratedPairKey.substring(separator + 1)));
            }
            return Set.copyOf(ratedPairKeys);
        }

        for (RatingView record : userRatesRepository.findHomeGameExclusionProjections(raterUserId)) {
            if (!"pair".equals(safeText(record == null ? null : record.getMode()))) {
                continue;
            }
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

    private boolean hasCurrentHomeGameRateProjection(Users user) {
        return user != null
                && user.getHomeGameRateProjectionVersion() != null
                && user.getHomeGameRateProjectionVersion().intValue() == HOME_GAME_RATE_PROJECTION_VERSION
                && user.getHomeGameRatedUserIds() != null
                && user.getHomeGameRatedPairKeys() != null;
    }

    private void addRatedUserId(Set<String> ratedUserIds, String ownerUserId, String candidateUserId) {
        String normalizedCandidateUserId = normalizeId(candidateUserId);
        if (StringUtils.hasText(normalizedCandidateUserId) && !ownerUserId.equals(normalizedCandidateUserId)) {
            ratedUserIds.add(normalizedCandidateUserId);
        }
    }

    private boolean hasOwnRecordedActivityRate(RatingView record, String ownerUserId) {
        if (record == null || !ownerUserId.equals(normalizeId(record.getOwnerUserId()))) {
            return false;
        }
        if (Boolean.TRUE.equals(record.getMet())) {
            return true;
        }
        Double scoreGiven = record.getScoreGiven();
        return scoreGiven != null && scoreGiven > 0;
    }

    private ActivitySocialGraph buildActivitySocialGraph(List<Users> visibleUsers) {
        List<String> userIds = visibleUsers.stream().map(Users::getId).filter(StringUtils::hasText).distinct().toList();
        Map<String, Set<String>> neighborsByUserId = new LinkedHashMap<>();
        Map<String, String> latestEventNameByEdgeKey = new LinkedHashMap<>();
        Map<String, Long> latestTimestampByEdgeKey = new LinkedHashMap<>();
        if (!userIds.isEmpty()) {
            for (UserFriendship friendship : userFriendshipsRepository.findRelevantByUserIds(userIds)) {
                registerSocialEdge(neighborsByUserId, latestEventNameByEdgeKey, latestTimestampByEdgeKey,
                        friendship.leftUserId(), friendship.rightUserId(), friendship.lastEventName(),
                        friendship.lastMetAt() == null ? 0L : friendship.lastMetAt().toEpochMilli());
            }
        }
        return new ActivitySocialGraph(neighborsByUserId, latestEventNameByEdgeKey);
    }

    private boolean hasHomeGameMemberProjections(List<? extends Event> memberProjections) {
        return memberProjections != null
                && memberProjections.stream()
                        .filter(Objects::nonNull)
                        .map(Event::getAcceptedMemberUserIds)
                        .filter(Objects::nonNull)
                        .anyMatch(userIds -> !userIds.isEmpty());
    }

    private long homeGameEventActivityMillis(Event event) {
        return parseIsoMillis(firstNonBlank(
                event == null ? null : event.getStartAtIso(),
                event == null ? null : event.getUpdatedDate(),
                event == null ? null : event.getCreatedDate(),
                event == null ? null : event.getEndAtIso()));
    }

    private GameStackSnapshot resolveGameStackSnapshot() {
        long nowMs = System.currentTimeMillis();
        long revision = readCacheRevision.get();
        var scope = readCacheScope();
        CacheEntry<GameStackSnapshot> cached = gameStackSnapshotCache.get(scope);
        if (cached != null && cached.expiresAtMs() > nowMs && cached.revision() == readCacheRevision.get()) {
            return cached.value();
        }

        synchronized (gameStackSnapshotCacheLock) {
            cached = gameStackSnapshotCache.get(scope);
            if (cached != null && cached.expiresAtMs() > nowMs && cached.revision() == readCacheRevision.get()) {
                return cached.value();
            }

            List<Users> visibleGameUsers = usersRepository.findByProfileStatusIn(HOME_GAME_PROFILE_STATUSES).stream()
                    .filter(Objects::nonNull)
                    .filter(this::isUsableUserDocument)
                    .toList();
            List<? extends Event> homeGameMemberProjections = activityEventsRepository.findHomeGameMemberProjections();
            GameStackSnapshot snapshot = new GameStackSnapshot(
                    List.copyOf(visibleGameUsers),
                    indexUsersById(visibleGameUsers),
                    buildActivitySocialGraph(visibleGameUsers),
                    Map.copyOf(queryLatestHomeActivityMsByUserId(
                            visibleGameUsers,
                            homeGameMemberProjections)));
            gameStackSnapshotCache.put(scope, new CacheEntry<>(snapshot, nowMs + USER_READ_SNAPSHOT_CACHE_TTL_MS, revision));
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

    private long resolveMemberRecordTimestampMs(Member member) {
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
        String gender = user == null ? "" : safeText(user.getGender());
        List<String> genders = switch (gender) {
            case "man" -> List.of("woman");
            case "woman" -> List.of("man");
            default -> List.of();
        };
        return new UserGameFilterPreferencesDto(
                18,
                120,
                40,
                250,
                List.of(),
                List.of(),
                List.of(),
                List.of(),
                genders,
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
        LocationCoordinatesDto requestedLocation = user.locationCoordinates();
        String locationPartition = locations.validatedLocationPartition(current, requestedLocation);

        Users document = current == null ? new Users() : current;
        document.setMongoId(current != null && StringUtils.hasText(current.getMongoId()) ? current.getMongoId() : new ObjectId().toHexString());
        document.setSyncKey(current != null && StringUtils.hasText(current.getSyncKey()) ? current.getSyncKey() : UUID.randomUUID().toString());
        document.setUserId(normalizeId(user.id()));
        document.setEmail(current != null && StringUtils.hasText(current.getWorkspaceGroupId())
                ? null : resolveStoredEmail(normalizeId(user.id()), current == null ? null : current.getEmail()));
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
        document.setOperator((current != null && current.isOperator())
                || isCurrentRequestOperatorForUser(user.id()));
        document.setTraitLabel(nullToEmpty(user.traitLabel()));
        document.setCompletion(normalizeCount(user.completion()));
        document.setProfileFormVersion(normalizeCount(user.profileFormVersion()));
        document.setHeadline(nullToEmpty(user.headline()));
        document.setAbout(nullToEmpty(user.about()));
        document.setAffinity(absoluteAffinityService.resolveUserAffinity(user));
        document.setLocationCoordinates(toLocationCoordinatesRecord(requestedLocation));
        document.setPartitionKey(locationPartition);
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
        if (current == null) {
            document.setHomeGameRatedUserIds(List.of());
            document.setHomeGameRatedPairKeys(List.of());
            document.setHomeGameRateProjectionVersion(HOME_GAME_RATE_PROJECTION_VERSION);
            document.setHomeGameRateProjectionUpdatedAtIso(Instant.now().toString());
        }
        return document;
    }

    private boolean isAccountPurgeCandidate(Users user) {
        String profileStatus = safeText(user == null ? null : user.getProfileStatus());
        return user != null
                && StringUtils.hasText(safeText(user.getDeletedAtIso()))
                && ("deleted".equals(profileStatus) || PROFILE_STATUS_ONBOARDING.equals(profileStatus));
    }

    private void saveUserExperienceProfile(String userId, List<ExperienceEntryDto> entries) {
        String resolvedUserId = normalizeId(userId);
        if (!StringUtils.hasText(resolvedUserId)) {
            return;
        }
        UserExperienceProfile profile = userExperienceProfilesRepository.findByUserId(resolvedUserId)
                .orElseGet(UserExperienceProfile::new);
        profile.setUserId(resolvedUserId);
        profile.setUpdatedAtIso(Instant.now().toString());
        profile.setEntries(toExperienceItemRecords(entries));
        userExperienceProfilesRepository.save(profile);
        affinityRecomputeTaskService.enqueueUserChanged(resolvedUserId);
    }

    private List<UserExperienceProfile.ExperienceItemRecord> toExperienceItemRecords(List<ExperienceEntryDto> entries) {
        if (entries == null || entries.isEmpty()) {
            return List.of();
        }
        List<UserExperienceProfile.ExperienceItemRecord> records = new ArrayList<>();
        for (ExperienceEntryDto entry : entries) {
            if (entry == null) {
                continue;
            }
            UserExperienceProfile.ExperienceItemRecord record = new UserExperienceProfile.ExperienceItemRecord();
            String normalizedId = normalizeId(entry.id());
            record.setId(StringUtils.hasText(normalizedId) ? normalizedId : "exp-" + UUID.randomUUID());
            record.setType(normalizeExperienceType(entry.type()));
            record.setTitle(safeText(entry.title()));
            record.setOrg(safeText(entry.org()));
            record.setCity(safeText(entry.city()));
            record.setDateFrom(safeText(entry.dateFrom()));
            record.setDateTo(normalizeExperienceDateTo(entry.dateTo()));
            record.setDescription(safeText(entry.description()));
            records.add(record);
        }
        return List.copyOf(records);
    }

    private String normalizeExperienceType(String value) {
        String normalized = safeText(value);
        return switch (normalized) {
            case "School", "Online Session", "Additional Project" -> normalized;
            default -> "Workspace";
        };
    }

    private String normalizeExperienceDateTo(String value) {
        String normalized = safeText(value);
        return StringUtils.hasText(normalized) ? normalized : "Present";
    }

    private Users syncCurrentUserEmail(Users user) {
        if (user == null) {
            return null;
        }
        // A workspace profile belongs to the account and never owns its login email.
        if (StringUtils.hasText(user.getWorkspaceGroupId())) return user;
        String resolvedEmail = resolveAuthenticatedEmailForUser(normalizeId(user.getId()));
        if (!StringUtils.hasText(resolvedEmail) || Objects.equals(safeText(user.getEmail()), resolvedEmail)) {
            return user;
        }
        user.setEmail(resolvedEmail);
        requireUniqueEmailOwner(user);
        try {
            return usersRepository.save(user);
        } catch (DataIntegrityViolationException exception) {
            throwEmailConflictIfPresent(user, exception);
            throw exception;
        }
    }

    private void requireUniqueEmailOwner(Users user) {
        if (user == null) {
            return;
        }
        String normalizedEmail = normalizeUserEmail(user.getEmail());
        user.setEmail(StringUtils.hasText(normalizedEmail) ? normalizedEmail : null);
        if (!StringUtils.hasText(normalizedEmail)) {
            return;
        }
        Users currentOwner = usersRepository.findFirstByEmail(normalizedEmail).orElse(null);
        if (currentOwner != null
                && !normalizeId(currentOwner.getId()).equals(normalizeId(user.getId()))) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "This email address is already registered.");
        }
    }

    private void throwEmailConflictIfPresent(
            Users attemptedUser,
            DataIntegrityViolationException exception) {
        String normalizedEmail = normalizeUserEmail(
                attemptedUser == null ? null : attemptedUser.getEmail());
        if (!StringUtils.hasText(normalizedEmail)) {
            return;
        }
        Users currentOwner = usersRepository.findFirstByEmail(normalizedEmail).orElse(null);
        if (currentOwner != null
                && !normalizeId(currentOwner.getId()).equals(
                        normalizeId(attemptedUser.getId()))) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "This email address is already registered.",
                    exception);
        }
    }

    private String normalizeUserEmail(String email) {
        return safeText(email).toLowerCase(Locale.ROOT);
    }

    public void evictUserReadCaches(Collection<String> userIds) {
        for (String userId : userIds == null ? List.<String>of() : userIds) {
            evictUserReadCaches(userId);
        }
    }

    public void evictUserReadCaches(String userId) {
        String normalizedUserId = normalizeId(userId);
        if (!StringUtils.hasText(normalizedUserId)) {
            return;
        }
        readCacheRevision.incrementAndGet();
        userImpressionsCacheByUserId.keySet().removeIf(key -> normalizedUserId.equals(key.userId()));
        affinityWeightsCacheByUserIdsKey.clear();
        gameStackSnapshotCache.clear();
    }

    private Users syncComputedUserPartition(Users user) {
        if (user == null) {
            return null;
        }

        if (StringUtils.hasText(safeText(user.getPartitionKey()))) {
            return user;
        }

        String resolvedPartitionKey = locations.resolveStoredPartitionKey(
                toLocationCoordinatesDto(user.getLocationCoordinates()),
                null,
                user);
        if (Objects.equals(nullToEmpty(user.getPartitionKey()), nullToEmpty(resolvedPartitionKey))) {
            return user;
        }

        user.setPartitionKey(resolvedPartitionKey);
        return usersRepository.save(user);
    }

    private String resolveStoredEmail(String userId, String fallbackEmail) {
        String resolvedPrincipalEmail = resolveAuthenticatedEmailForUser(userId);
        if (StringUtils.hasText(resolvedPrincipalEmail)) {
            return normalizeUserEmail(resolvedPrincipalEmail);
        }
        if (!StringUtils.hasText(fallbackEmail) && userId.startsWith("demo-profile-")) {
            return DevelopmentIdentityEmail.forProfile(userId);
        }
        return normalizeUserEmail(fallbackEmail);
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

    private boolean isHostingRecordForUser(Event record, String userId) {
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
            String requestCursor, Users account) {
        UserMenuCountersDto counters = buildMenuCounters(user, account);
        // Group profile IDs contain ':', which is also the cursor delimiter.
        // Normalize retained cursors too, before locating impression fingerprints.
        String profileId = normalizeId(user.getId());
        if (requestCursor != null && requestCursor.startsWith(profileId + ":")) {
            requestCursor = profileId.replace(":", "%3A") + requestCursor.substring(profileId.length());
        }
        int cursorPartCount = cursorPartCount(requestCursor);
        int fingerprintOffset = cursorPartCount >= 45
                ? 43
                : cursorPartCount >= 44
                ? 42
                : cursorPartCount >= 43
                ? 41
                : cursorPartCount >= 42
                ? 40
                : cursorPartCount >= 39
                ? 37
                : cursorPartCount >= 38 ? 36
                : cursorPartCount >= 37 ? 35 : cursorPartCount >= 31 ? 29 : cursorPartCount >= 16 ? 14 : 10;
        String previousHostHash = cursorPart(requestCursor, fingerprintOffset);
        String previousMemberHash = cursorPart(requestCursor, fingerprintOffset + 1);
        Users.UserImpressionsRecord storedImpressions = user == null ? null : user.getImpressions();
        String nextHostHash = storedImpressionsFingerprint(storedImpressions == null ? null : storedImpressions.host());
        String nextMemberHash = storedImpressionsFingerprint(storedImpressions == null ? null : storedImpressions.member());
        boolean hasPreviousImpressionFingerprints = cursorPartCount >= fingerprintOffset + 2;
        return new UserRealtimeCountersDto(
                counters.game(),
                counters.chats(),
                counters.invitations(),
                counters.events(),
                counters.hosting(),
                counters.cars(),
                counters.accommodation(),
                counters.supplies(),
                counters.tickets(),
                counters.contacts(),
                counters.feedback(),
                counters.chat(),
                counters.event(),
                counters.asset(),
                counters.feedbackCounts(),
                counters.adminJobs(),
                counters.adminMetrics(),
                counters.paymentRefundsPending(),
                counters.contactRequestsPending(),
                normalizeCount(counters.notifications()),
                hasPreviousImpressionFingerprints && !Objects.equals(previousHostHash, nextHostHash),
                hasPreviousImpressionFingerprints && !Objects.equals(previousMemberHash, nextMemberHash), counters.menuCounters());
    }

    private String buildRealtimeCursor(
            Users user,
            UserRealtimeCountersDto counters) {
        Users.UserImpressionsRecord storedImpressions = user == null ? null : user.getImpressions();
        return String.join(":",
                normalizeId(user.getId()).replace(":", "%3A"),
                String.valueOf(normalizeCount(counters.game())),
                String.valueOf(normalizeCount(counters.chats())),
                String.valueOf(normalizeCount(counters.invitations())),
                String.valueOf(normalizeCount(counters.events())),
                String.valueOf(normalizeCount(counters.hosting())),
                String.valueOf(normalizeCount(counters.cars())),
                String.valueOf(normalizeCount(counters.accommodation())),
                String.valueOf(normalizeCount(counters.supplies())),
                String.valueOf(normalizeCount(counters.tickets())),
                String.valueOf(normalizeCount(counters.contacts())),
                String.valueOf(normalizeCount(counters.feedback())),
                String.valueOf(normalizeCount(counters.chat() == null ? null : counters.chat().all())),
                String.valueOf(normalizeCount(counters.chat() == null ? null : counters.chat().event())),
                String.valueOf(normalizeCount(counters.chat() == null ? null : counters.chat().subEvent())),
                String.valueOf(normalizeCount(counters.chat() == null ? null : counters.chat().group())),
                String.valueOf(normalizeCount(counters.chat() == null ? null : counters.chat().service())),
                String.valueOf(normalizeCount(counters.chat() == null ? null : counters.chat().appSupport())),
                String.valueOf(normalizeCount(counters.chat() == null ? null : counters.chat().groupSupport())),
                String.valueOf(normalizeCount(counters.chat() == null ? null : counters.chat().contacts())),
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
                String.valueOf(normalizeCount(counters.asset() == null ? null : counters.asset().carsPending())),
                String.valueOf(normalizeCount(counters.asset() == null ? null : counters.asset().accommodationPending())),
                String.valueOf(normalizeCount(counters.asset() == null ? null : counters.asset().suppliesPending())),
                String.valueOf(normalizeCount(counters.feedbackCounts() == null ? null : counters.feedbackCounts().ownEvents())),
                String.valueOf(normalizeCount(counters.feedbackCounts() == null ? null : counters.feedbackCounts().pending())),
                String.valueOf(normalizeCount(counters.feedbackCounts() == null ? null : counters.feedbackCounts().feedbacked())),
                String.valueOf(normalizeCount(counters.feedbackCounts() == null ? null : counters.feedbackCounts().removed())),
                String.valueOf(normalizeCount(counters.adminJobs())),
                String.valueOf(normalizeCount(counters.adminMetrics())),
                String.valueOf(normalizeCount(counters.paymentRefundsPending())),
                String.valueOf(normalizeCount(counters.notifications())),
                paymentTotalsFingerprint(user),
                storedImpressionsFingerprint(storedImpressions == null ? null : storedImpressions.host()),
                storedImpressionsFingerprint(storedImpressions == null ? null : storedImpressions.member()),
                String.valueOf(normalizeCount(counters.contactRequestsPending())), "0",
                String.valueOf(normalizeCount(counters.chat() == null ? null : counters.chat().campaign())),
                String.valueOf(normalizeCount(counters.chat() == null ? null : counters.chat().cases())),
                new java.util.TreeMap<>(counters.menuCounters() == null ? java.util.Map.of() : counters.menuCounters()).toString().replace(":", "%3A"),
                "0", "0");
    }

    private UserPaymentTotalsDto paymentTotalsDto(Users user) {
        return new UserPaymentTotalsDto(
                normalizedPaymentTotals(user == null ? null : user.getPaymentSpentTotals()),
                normalizedPaymentTotals(user == null ? null : user.getPaymentIncomeTotals()),
                normalizedPaymentTotals(user == null ? null : user.getPaymentAllTotals()));
    }

    private Map<String, Double> normalizedPaymentTotals(Map<String, Double> source) {
        Map<String, Double> normalized = new LinkedHashMap<>();
        (source == null ? Map.<String, Double>of() : source).entrySet().stream()
                .sorted(Map.Entry.comparingByKey())
                .forEach(entry -> {
                    String currency = safeText(entry.getKey()).toUpperCase(Locale.ROOT);
                    double amount = entry.getValue() == null ? 0D : Math.max(0D, entry.getValue());
                    if (currency.matches("[A-Z]{3}")) {
                        normalized.put(currency, Math.round(amount * 100D) / 100D);
                    }
                });
        return Map.copyOf(normalized);
    }

    private String paymentTotalsFingerprint(Users user) {
        UserPaymentTotalsDto totals = paymentTotalsDto(user);
        return Integer.toHexString(Objects.hash(totals.outgoing(), totals.incoming(), totals.all()));
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

    private UserActivitiesDto toUserActivitiesDto(
            Users.UserActivitiesRecord activities,
            Integer paymentRefundsPending, Integer contactRequestsPending) {
        if (activities == null) {
            return new UserActivitiesDto(
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    new UserChatCountersDto(0, 0, 0, 0, 0, 0),
                    new UserEventCountersDto(0, 0, 0, 0, 0, 0, 0),
                    new UserAssetCountersDto(0, 0, 0, 0),
                    new UserFeedbackCountersDto(0, 0, 0, 0),
                    0, 0, normalizeCount(paymentRefundsPending), normalizeCount(contactRequestsPending), 0);
        }
        return new UserActivitiesDto(
                normalizeCount(activities.game()),
                normalizeCount(activities.chats()),
                normalizeCount(activities.invitations()),
                normalizeCount(activities.events()),
                normalizeCount(activities.hosting()),
                normalizeCount(activities.cars()),
                normalizeCount(activities.accommodation()),
                normalizeCount(activities.supplies()),
                normalizeCount(activities.tickets()),
                normalizeCount(activities.contacts()),
                normalizeCount(activities.feedback()),
                toUserChatCountersDto(activities.chat()),
                toUserEventCountersDto(activities.event()),
                toUserAssetCountersDto(activities.asset()),
                toUserFeedbackCountersDto(activities.feedbackCounts()),
                normalizeCount(activities.adminJobs()),
                normalizeCount(activities.adminMetrics()),
                normalizeCount(paymentRefundsPending), normalizeCount(contactRequestsPending),
                normalizeCount(activities.notifications()));
    }

    private Users.UserActivitiesRecord toUserActivitiesRecord(UserActivitiesDto activities) {
        if (activities == null) {
            return new Users.UserActivitiesRecord(
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    new Users.UserChatCountersRecord(0, 0, 0, 0, 0, 0),
                    new Users.UserEventCountersRecord(0, 0, 0, 0, 0, 0, 0),
                    new Users.UserAssetCountersRecord(0, 0, 0, 0),
                    new Users.UserFeedbackCountersRecord(0, 0, 0, 0),
                    0, 0, 0);
        }
        return new Users.UserActivitiesRecord(
                normalizeCount(activities.game()),
                normalizeCount(activities.chats()),
                normalizeCount(activities.invitations()),
                normalizeCount(activities.events()),
                normalizeCount(activities.hosting()),
                normalizeCount(activities.cars()),
                normalizeCount(activities.accommodation()),
                normalizeCount(activities.supplies()),
                normalizeCount(activities.tickets()),
                normalizeCount(activities.contacts()),
                normalizeCount(activities.feedback()),
                toUserChatCountersRecord(activities.chat()),
                toUserEventCountersRecord(activities.event()),
                toUserAssetCountersRecord(activities.asset()),
                toUserFeedbackCountersRecord(activities.feedbackCounts()),
                normalizeCount(activities.adminJobs()),
                normalizeCount(activities.adminMetrics()),
                normalizeCount(activities.notifications()));
    }

    private Users.UserEventCountersRecord toUserEventCountersRecord(UserEventCountersDto event) {
        return new Users.UserEventCountersRecord(
                event == null ? 0 : normalizeCount(event.all()),
                event == null ? 0 : normalizeCount(event.active()),
                event == null ? 0 : normalizeCount(event.pending()),
                event == null ? 0 : normalizeCount(event.invitations()),
                event == null ? 0 : normalizeCount(event.hosting()),
                event == null ? 0 : normalizeCount(event.drafts()),
                event == null ? 0 : normalizeCount(event.trash()),
                event == null ? 0 : normalizeCount(event.watchlist()));
    }

    private Users.UserChatCountersRecord toUserChatCountersRecord(UserChatCountersDto chat) {
        return new Users.UserChatCountersRecord(
                chat == null ? 0 : normalizeCount(chat.all()),
                chat == null ? 0 : normalizeCount(chat.event()),
                chat == null ? 0 : normalizeCount(chat.subEvent()),
                chat == null ? 0 : normalizeCount(chat.group()),
                chat == null ? 0 : normalizeCount(chat.service()),
                chat == null ? 0 : normalizeCount(chat.appSupport()),
                toUserSupportCaseCountersRecord(chat == null ? null : chat.supportCases()),
                chat == null ? 0 : normalizeCount(chat.groupSupport()),
                chat == null ? 0 : normalizeCount(chat.contacts()),
                chat == null ? 0 : normalizeCount(chat.campaign()),
                chat == null ? 0 : normalizeCount(chat.cases()));
    }

    private Users.UserSupportCaseCountersRecord toUserSupportCaseCountersRecord(
            UserSupportCaseCountersDto supportCases) {
        return new Users.UserSupportCaseCountersRecord(
                supportCases == null ? 0 : normalizeCount(supportCases.pending()),
                supportCases == null ? 0 : normalizeCount(supportCases.warned()),
                supportCases == null ? 0 : normalizeCount(supportCases.picked()),
                supportCases == null ? 0 : normalizeCount(supportCases.solved()),
                supportCases == null ? 0 : normalizeCount(supportCases.blocked()),
                supportCases == null ? 0 : normalizeCount(supportCases.all()));
    }

    private Users.UserAssetCountersRecord toUserAssetCountersRecord(UserAssetCountersDto asset) {
        return new Users.UserAssetCountersRecord(
                asset == null ? 0 : normalizeCount(asset.cars()),
                asset == null ? 0 : normalizeCount(asset.accommodation()),
                asset == null ? 0 : normalizeCount(asset.supplies()),
                asset == null ? 0 : normalizeCount(asset.tickets()),
                asset == null ? 0 : normalizeCount(asset.carsPending()),
                asset == null ? 0 : normalizeCount(asset.accommodationPending()),
                asset == null ? 0 : normalizeCount(asset.suppliesPending()));
    }

    private Users.UserFeedbackCountersRecord toUserFeedbackCountersRecord(UserFeedbackCountersDto feedback) {
        return new Users.UserFeedbackCountersRecord(
                feedback == null ? 0 : normalizeCount(feedback.ownEvents()),
                feedback == null ? 0 : normalizeCount(feedback.pending()),
                feedback == null ? 0 : normalizeCount(feedback.feedbacked()),
                feedback == null ? 0 : normalizeCount(feedback.removed()));
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
                                        "profile.gender".equals(labelKey) ? "Public"
                                                : "Hosts".equals(row.privacy()) ? "Private" : safeText(row.privacy()),
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
                                        "profile.gender".equals(labelKey) ? "Public"
                                                : "Hosts".equals(row.privacy()) ? "Private" : safeText(row.privacy()),
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
        long revision = readCacheRevision.get();
        var cacheKey = new UserReadCacheKey(readCacheScope(), userId);
        CacheEntry<UserImpressionsDto> cached = userImpressionsCacheByUserId.get(cacheKey);
        if (cached != null) {
            if (cached.expiresAtMs() > nowMs && cached.revision() == readCacheRevision.get()) {
                return cached.value();
            }
            userImpressionsCacheByUserId.remove(cacheKey, cached);
        }

        Object lock = userReadCacheLocksByUserId.computeIfAbsent(cacheKey, key -> new Object());
        synchronized (lock) {
            cached = userImpressionsCacheByUserId.get(cacheKey);
            if (cached != null) {
                if (cached.expiresAtMs() > nowMs && cached.revision() == readCacheRevision.get()) {
                    return cached.value();
                }
                userImpressionsCacheByUserId.remove(cacheKey, cached);
            }
            UserImpressionsDto resolved = resolveMergedUserImpressionsUncached(user);
            userImpressionsCacheByUserId.put(cacheKey, new CacheEntry<>(resolved, nowMs + USER_READ_SNAPSHOT_CACHE_TTL_MS, revision));
            return resolved;
        }
    }

    private UserImpressionsDto resolveMergedUserImpressionsUncached(Users user) {
        List<? extends Answer> feedbackAnswers = feedbackAnswersRepository
                .findByTargetUserIdOrderBySubmittedAtIsoDesc(normalizeId(user.getId()));
        UserImpressionsSectionDto host = resolveMergedImpressionsSection(user, user.getImpressions() == null ? null : user.getImpressions().host(), "event", feedbackAnswers);
        UserImpressionsSectionDto member = resolveMergedImpressionsSection(user, user.getImpressions() == null ? null : user.getImpressions().member(), "attendee", feedbackAnswers);
        return new UserImpressionsDto(host, member);
    }

    private record CacheEntry<T>(T value, long expiresAtMs, long revision) {
    }

    private UserImpressionsSectionDto resolveMergedImpressionsSection(
            Users user,
            Users.UserImpressionsSectionRecord record,
            String feedbackKind,
            List<? extends Answer> feedbackAnswers) {
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
            Users.UserFeedbackCountersRecord feedbackCounts = activities.feedbackCounts();
            return normalizeCount(activities.chats()) > 0
                    || normalizeCount(activities.invitations()) > 0
                    || normalizeCount(activities.tickets()) > 0
                    || normalizeCount(activities.feedback()) > 0
                    || normalizeCount(feedbackCounts == null ? null : feedbackCounts.pending()) > 0
                    || normalizeCount(feedbackCounts == null ? null : feedbackCounts.feedbacked()) > 0
                    || normalizeCount(feedbackCounts == null ? null : feedbackCounts.removed()) > 0;
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

    private boolean hasFeedbackAnswerSignals(String feedbackKind, List<? extends Answer> feedbackAnswers) {
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
            List<? extends Answer> feedbackAnswers) {
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
            List<? extends Answer> feedbackAnswers,
            Map<String, Double> scoreByTraitId,
            Map<String, Integer> evidenceByTraitId,
            Map<String, String> lastRatedAtByTraitId) {
        String expectedKind = normalizeToken(feedbackKind);
        for (Answer answer : safeList(feedbackAnswers)) {
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

    static String resolvePersonalityTraitId(String id, String label) {
        String normalizedId = normalizeToken(id);
        if (PERSONALITY_TRAIT_DEFINITION_BY_ID.containsKey(normalizedId)) {
            return normalizedId;
        }
        return resolvePersonalityTraitIdFromLabel(label);
    }

    private static String resolvePersonalityTraitIdFromLabel(String label) {
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

    private String storedImpressionsFingerprint(Users.UserImpressionsSectionRecord section) {
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

    private static String normalizeToken(String value) {
        return value == null ? "" : value.trim().toLowerCase();
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

    @Override public UserDto presentGameCard(com.raxim.myscoutee.domain.accounts.api.WorkspaceProfile profile) { return toGameCardUserDto((Users) profile); }

    public UserMenuCountersDto queryMenuCounters(String requestedUserId) {
        return menuCounters.queryMenuCounters(requestedUserId);
    }

    private UserMenuCountersDto buildMenuCounters(Users user) {
        return menuCounters.buildMenuCounters(user);
    }

    private UserMenuCountersDto buildMenuCounters(Users user, Users account) {
        return menuCounters.buildMenuCounters(user, account);
    }
}
