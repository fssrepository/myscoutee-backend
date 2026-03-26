package com.raxim.myscoutee.profile.service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.time.Instant;
import java.util.UUID;

import org.bson.types.ObjectId;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.raxim.myscoutee.common.config.firebase.dto.FirebasePrincipal;
import com.raxim.myscoutee.profile.data.document.mongo.UserFilterPreferences;
import com.raxim.myscoutee.profile.data.document.mongo.UserFeedbackSubmission;
import com.raxim.myscoutee.profile.data.document.mongo.UserRate;
import com.raxim.myscoutee.profile.data.document.mongo.UserReportSubmission;
import com.raxim.myscoutee.profile.data.document.mongo.UserSessionAction;
import com.raxim.myscoutee.profile.data.document.mongo.Users;
import com.raxim.myscoutee.profile.dto.auth.AuthDtos.UserDeleteRequestDto;
import com.raxim.myscoutee.profile.dto.auth.AuthDtos.UserActivitiesDto;
import com.raxim.myscoutee.profile.dto.auth.AuthDtos.UserByIdResponseDto;
import com.raxim.myscoutee.profile.dto.auth.AuthDtos.UserFeedbackSubmitRequestDto;
import com.raxim.myscoutee.profile.dto.auth.AuthDtos.UserDto;
import com.raxim.myscoutee.profile.dto.auth.AuthDtos.UserGameFilterPreferencesDto;
import com.raxim.myscoutee.profile.dto.auth.AuthDtos.UserImpressionsDto;
import com.raxim.myscoutee.profile.dto.auth.AuthDtos.UserImpressionsSectionDto;
import com.raxim.myscoutee.profile.dto.auth.AuthDtos.UserLogoutRequestDto;
import com.raxim.myscoutee.profile.dto.auth.AuthDtos.UserMenuCountersDto;
import com.raxim.myscoutee.profile.dto.auth.AuthDtos.UserRealtimeCountersDto;
import com.raxim.myscoutee.profile.dto.auth.AuthDtos.UserRealtimeLongPollRequestDto;
import com.raxim.myscoutee.profile.dto.auth.AuthDtos.UserRealtimeLongPollResponseDto;
import com.raxim.myscoutee.profile.dto.auth.AuthDtos.UserReportUserSubmitRequestDto;
import com.raxim.myscoutee.profile.dto.auth.AuthDtos.UserSubmitActionResponseDto;
import com.raxim.myscoutee.profile.dto.shared.SharedDtos.LocationCoordinatesDto;
import com.raxim.myscoutee.profile.data.document.mongo.ActivityEvent;
import com.raxim.myscoutee.profile.data.document.mongo.EventFeedbackAnswer;
import com.raxim.myscoutee.profile.data.document.mongo.EventFeedbackState;
import com.raxim.myscoutee.profile.repository.mongo.ActivityChatsRepository;
import com.raxim.myscoutee.profile.repository.mongo.ActivityEventsRepository;
import com.raxim.myscoutee.profile.repository.mongo.EventFeedbackAnswersRepository;
import com.raxim.myscoutee.profile.repository.mongo.EventFeedbackStatesRepository;
import com.raxim.myscoutee.profile.repository.mongo.UserFilterPreferencesRepository;
import com.raxim.myscoutee.profile.repository.mongo.UserFeedbackSubmissionsRepository;
import com.raxim.myscoutee.profile.repository.mongo.UserReportSubmissionsRepository;
import com.raxim.myscoutee.profile.repository.mongo.UserRatesRepository;
import com.raxim.myscoutee.profile.repository.mongo.UserSessionActionsRepository;
import com.raxim.myscoutee.profile.repository.mongo.UsersRepository;
import com.raxim.myscoutee.profile.dto.auth.AuthDtos.UserPersonalityTraitDto;

@Service
public class HomeUserProfileService {
    private static final long EVENT_FEEDBACK_UNLOCK_DELAY_MS = 2L * 60L * 60L * 1000L;
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
    private final UserRatesRepository userRatesRepository;
    private final ActivityChatsRepository activityChatsRepository;
    private final ActivityEventsRepository activityEventsRepository;
    private final EventParticipationTicketService eventParticipationTicketService;
    private final EventFeedbackStatesRepository eventFeedbackStatesRepository;
    private final EventFeedbackAnswersRepository eventFeedbackAnswersRepository;
    private final UserFeedbackSubmissionsRepository userFeedbackSubmissionsRepository;
    private final UserReportSubmissionsRepository userReportSubmissionsRepository;
    private final UserSessionActionsRepository userSessionActionsRepository;

    public HomeUserProfileService(
            UsersRepository usersRepository,
            UserFilterPreferencesRepository userFilterPreferencesRepository,
            UserRatesRepository userRatesRepository,
            ActivityChatsRepository activityChatsRepository,
            ActivityEventsRepository activityEventsRepository,
            EventParticipationTicketService eventParticipationTicketService,
            EventFeedbackStatesRepository eventFeedbackStatesRepository,
            EventFeedbackAnswersRepository eventFeedbackAnswersRepository,
            UserFeedbackSubmissionsRepository userFeedbackSubmissionsRepository,
            UserReportSubmissionsRepository userReportSubmissionsRepository,
            UserSessionActionsRepository userSessionActionsRepository) {
        this.usersRepository = usersRepository;
        this.userFilterPreferencesRepository = userFilterPreferencesRepository;
        this.userRatesRepository = userRatesRepository;
        this.activityChatsRepository = activityChatsRepository;
        this.activityEventsRepository = activityEventsRepository;
        this.eventParticipationTicketService = eventParticipationTicketService;
        this.eventFeedbackStatesRepository = eventFeedbackStatesRepository;
        this.eventFeedbackAnswersRepository = eventFeedbackAnswersRepository;
        this.userFeedbackSubmissionsRepository = userFeedbackSubmissionsRepository;
        this.userReportSubmissionsRepository = userReportSubmissionsRepository;
        this.userSessionActionsRepository = userSessionActionsRepository;
    }

    public UserByIdResponseDto queryUserById(String requestedUserId) {
        String resolvedUserId = resolveSelectedUserId(requestedUserId);
        if (!StringUtils.hasText(resolvedUserId)) {
            return null;
        }

        Users user = syncComputedUserActivities(findUser(resolvedUserId));
        if (user == null) {
            return null;
        }

        UserDto userDto = toUserDto(user);
        int filterCount = queryGameStackUserRecords(resolvedUserId).size();
        UserGameFilterPreferencesDto filterPreferences = resolveFilterPreferences(resolvedUserId);

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
                userDto.headline(),
                userDto.about(),
                userDto.affinity(),
                userDto.locationCoordinates(),
                userDto.images(),
                userDto.impressions(),
                userDto.profileStatus(),
                userDto.activities(),
                filterCount,
                filterPreferences,
                buildMenuCounters(user));
    }

    public UserRealtimeLongPollResponseDto queryRealtimeSnapshot(UserRealtimeLongPollRequestDto request) {
        String resolvedUserId = resolveSelectedUserId(request == null ? null : request.userId());
        if (!StringUtils.hasText(resolvedUserId)) {
            return null;
        }

        Users user = syncComputedUserActivities(findUser(resolvedUserId));
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

    public UserGameFilterPreferencesDto resolveFilterPreferences(String requestedUserId) {
        String resolvedUserId = resolveSelectedUserId(requestedUserId);
        if (!StringUtils.hasText(resolvedUserId)) {
            return null;
        }

        Users user = findUser(resolvedUserId);
        if (user == null) {
            return null;
        }

        UserGameFilterPreferencesDto filterPreferences = queryStoredFilterPreferences(resolvedUserId);
        return filterPreferences != null ? filterPreferences : buildDefaultFilterPreferences(user);
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

    public UserDto saveUserProfile(UserDto user) {
        if (user == null || !StringUtils.hasText(user.id())) {
            return null;
        }

        Users existing = usersRepository.findByUserId(normalizeId(user.id())).orElse(null);
        Users saved = usersRepository.save(mergeUserDocument(existing, user));
        return toUserDto(syncComputedUserActivities(saved));
    }

    public UserSubmitActionResponseDto submitFeedback(UserFeedbackSubmitRequestDto request) {
        Users currentUser = resolveCurrentUser(null);
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
        return new UserSubmitActionResponseDto(true, null);
    }

    public UserSubmitActionResponseDto submitReport(UserReportUserSubmitRequestDto request) {
        Users currentUser = resolveCurrentUser(null);
        String userId = normalizeId(currentUser == null ? null : currentUser.getId());
        if (!StringUtils.hasText(userId) || request == null) {
            return new UserSubmitActionResponseDto(false, "Unable to submit report.");
        }

        String nowIso = Instant.now().toString();
        UserReportSubmission document = new UserReportSubmission();
        document.setId(new ObjectId().toHexString());
        document.setSyncKey(UUID.randomUUID().toString());
        document.setUserId(userId);
        document.setHandle(safeText(request.handle()));
        document.setReason(safeText(request.reason()));
        document.setDetails(safeText(request.details()));
        document.setCreatedDate(nowIso);
        document.setCreatedUser(userId);
        document.setUpdatedDate(nowIso);
        document.setUpdatedUser(userId);
        userReportSubmissionsRepository.save(document);
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

    public UserSubmitActionResponseDto deleteUser(UserDeleteRequestDto request) {
        String resolvedUserId = resolveSelectedUserId(request == null ? null : request.userId());
        if (!StringUtils.hasText(resolvedUserId)) {
            return new UserSubmitActionResponseDto(false, "Unable to delete user.");
        }

        Users user = usersRepository.findByUserId(resolvedUserId).orElse(null);
        if (user == null) {
            return new UserSubmitActionResponseDto(false, "Unable to delete user.");
        }

        user.setStatus("D");
        user.setProfileStatus("deleted");
        usersRepository.save(user);
        recordSessionAction(resolvedUserId, "delete", "status:D");
        return new UserSubmitActionResponseDto(true, null);
    }

    public List<Users> queryGameStackUserRecords(String activeUserId) {
        String normalizedUserId = normalizeId(activeUserId);
        if (!StringUtils.hasText(normalizedUserId)) {
            return List.of();
        }

        Set<String> ratedUserIds = queryRatedGameCardUserIds(normalizedUserId);
        return orderedUsers().stream()
                .filter(Objects::nonNull)
                .filter(user -> !normalizedUserId.equals(normalizeId(user.getId())))
                .filter(user -> !ratedUserIds.contains(normalizeId(user.getId())))
                .toList();
    }

    public UserDto toUserDto(Users user) {
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
                nullToEmpty(user.getHeadline()),
                nullToEmpty(user.getAbout()),
                user.getAffinity(),
                toLocationCoordinatesDto(user.getLocationCoordinates()),
                normalizeStrings(user.getImages()),
                resolveMergedUserImpressions(user),
                resolveProfileStatus(user),
                toUserActivitiesDto(user.getActivities()));
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
                .sorted(userComparator())
                .toList();
    }

    private Comparator<Users> userComparator() {
        return Comparator.comparing(Users::getAffinity, Comparator.nullsLast(Comparator.reverseOrder()))
                .thenComparing(user -> normalizeId(user.getId()));
    }

    private boolean isUsableUserDocument(Users user) {
        if (user == null || !StringUtils.hasText(normalizeId(user.getId()))) {
            return false;
        }
        return StringUtils.hasText(user.getName())
                || user.getAge() != null
                || user.getLocationCoordinates() != null
                || !normalizeStrings(user.getImages()).isEmpty();
    }

    private UserGameFilterPreferencesDto queryStoredFilterPreferences(String userId) {
        if (!StringUtils.hasText(userId)) {
            return null;
        }
        return userFilterPreferencesRepository.findByUserId(userId)
                .map(this::toUserGameFilterPreferencesDto)
                .orElse(null);
    }

    private Set<String> queryRatedGameCardUserIds(String raterUserId) {
        Set<String> ratedUserIds = new LinkedHashSet<>();
        if (!StringUtils.hasText(raterUserId)) {
            return ratedUserIds;
        }

        for (UserRate record : userRatesRepository.findBySourceAndFromUserId("game-card", raterUserId)) {
            String ratedUserId = normalizeId(record.getToUserId());
            if (StringUtils.hasText(ratedUserId) && !raterUserId.equals(ratedUserId)) {
                ratedUserIds.add(ratedUserId);
            }
        }

        for (UserRate record : userRatesRepository.findBySourceAndModeAndOwnerUserId("game-card", "pair", raterUserId)) {
            String firstUserId = normalizeId(record.getFromUserId());
            String secondUserId = normalizeId(record.getToUserId());
            if (StringUtils.hasText(firstUserId) && !raterUserId.equals(firstUserId)) {
                ratedUserIds.add(firstUserId);
            }
            if (StringUtils.hasText(secondUserId) && !raterUserId.equals(secondUserId)) {
                ratedUserIds.add(secondUserId);
            }
        }
        return ratedUserIds;
    }

    private UserGameFilterPreferencesDto buildDefaultFilterPreferences(Users user) {
        int baseAge = normalizeCount(user.getAge());
        if (baseAge <= 0) {
            baseAge = 30;
        }
        Integer heightCm = parseHeightCm(user.getHeight());
        int baseHeightCm = heightCm == null ? 170 : heightCm;
        return new UserGameFilterPreferencesDto(
                Math.max(18, baseAge - 5),
                Math.min(120, baseAge + 5),
                Math.max(40, baseHeightCm - 10),
                Math.min(250, baseHeightCm + 10),
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

    private Integer parseHeightCm(String value) {
        try {
            int parsed = Integer.parseInt(nullToEmpty(value).replaceAll("[^0-9]", ""));
            return Math.max(40, Math.min(250, parsed));
        } catch (NumberFormatException exception) {
            return null;
        }
    }

    private UserMenuCountersDto buildMenuCounters(Users user) {
        Users.UserActivitiesRecord activities = user.getActivities();
        return new UserMenuCountersDto(
                activities == null ? 0 : normalizeCount(activities.game()),
                activities == null ? 0 : normalizeCount(activities.chat()),
                activities == null ? 0 : normalizeCount(activities.invitations()),
                activities == null ? 0 : normalizeCount(activities.events()),
                activities == null ? 0 : normalizeCount(activities.hosting()),
                activities == null ? 0 : normalizeCount(activities.tickets()),
                activities == null ? 0 : normalizeCount(activities.feedback()));
    }

    private Users mergeUserDocument(Users current, UserDto user) {
        Users document = current == null ? new Users() : current;
        document.setMongoId(current != null && StringUtils.hasText(current.getMongoId()) ? current.getMongoId() : new ObjectId().toHexString());
        document.setSyncKey(current != null && StringUtils.hasText(current.getSyncKey()) ? current.getSyncKey() : UUID.randomUUID().toString());
        document.setUserId(normalizeId(user.id()));
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
        document.setHeadline(nullToEmpty(user.headline()));
        document.setAbout(nullToEmpty(user.about()));
        document.setAffinity(user.affinity());
        document.setLocationCoordinates(toLocationCoordinatesRecord(user.locationCoordinates()));
        document.setImages(normalizeStrings(user.images()));
        document.setImpressions(toUserImpressionsRecord(user.impressions()));
        String status = current != null && "D".equalsIgnoreCase(safeText(current.getStatus()))
                ? current.getStatus()
                : resolveStatusCode(user.profileStatus(), current == null ? null : current.getStatus());
        document.setStatus(status);
        document.setProfileStatus(resolveProfileStatus(status, user.profileStatus()));
        document.setActivities(current == null ? toUserActivitiesRecord(user.activities()) : current.getActivities());
        return document;
    }

    private Users syncComputedUserActivities(Users user) {
        if (user == null || !StringUtils.hasText(normalizeId(user.getId()))) {
            return user;
        }

        Users.UserActivitiesRecord computed = buildComputedUserActivities(normalizeId(user.getId()), user.getActivities());
        if (activitiesEqual(user.getActivities(), computed)) {
            return user;
        }

        user.setActivities(computed);
        return usersRepository.save(user);
    }

    private Users.UserActivitiesRecord buildComputedUserActivities(String userId, Users.UserActivitiesRecord existing) {
        List<ActivityEvent> eventRecords = queryEventRecords(userId);
        return new Users.UserActivitiesRecord(
                queryGameStackUserRecords(userId).size(),
                countUnreadChats(userId),
                countEventsByType(eventRecords, "invitations"),
                countEventsByType(eventRecords, "events"),
                countEventsByType(eventRecords, "hosting"),
                countTicketRecords(userId),
                countPendingEventFeedback(userId, eventRecords));
    }

    private List<ActivityEvent> queryEventRecords(String userId) {
        if (!StringUtils.hasText(userId)) {
            return List.of();
        }
        return activityEventsRepository.findByOwnerUserId(userId).stream()
                .filter(Objects::nonNull)
                .toList();
    }

    private int countUnreadChats(String userId) {
        if (!StringUtils.hasText(userId)) {
            return 0;
        }
        return activityChatsRepository.findByOwnerUserId(userId).stream()
                .filter(Objects::nonNull)
                .map(chat -> normalizeCount(chat.getUnread()))
                .reduce(0, Integer::sum);
    }

    private int countEventsByType(List<ActivityEvent> eventRecords, String type) {
        return Math.toIntExact(eventRecords.stream()
                .filter(record -> type.equals(safeText(record.getType())))
                .filter(record -> !Boolean.TRUE.equals(record.getIsTrashed()))
                .count());
    }

    private int countTicketRecords(String userId) {
        if (!StringUtils.hasText(userId)) {
            return 0;
        }
        return eventParticipationTicketService.queryTicketRecordsForUser(userId).size();
    }

    private int countPendingEventFeedback(String userId, List<ActivityEvent> eventRecords) {
        long nowMs = Instant.now().toEpochMilli();
        Set<String> hiddenEventIds = eventFeedbackStatesRepository.findByViewerUserIdOrderByUpdatedDateDesc(userId).stream()
                .filter(Objects::nonNull)
                .filter(state -> Boolean.TRUE.equals(state.getRemoved()) || StringUtils.hasText(safeText(state.getSubmittedAtIso())))
                .map(EventFeedbackState::getEventId)
                .map(this::normalizeId)
                .filter(StringUtils::hasText)
                .collect(LinkedHashSet::new, Set::add, Set::addAll);
        return Math.toIntExact(eventRecords.stream()
                .filter(record -> "events".equals(safeText(record.getType())))
                .filter(record -> !Boolean.TRUE.equals(record.getIsTrashed()))
                .filter(record -> !Boolean.TRUE.equals(record.getIsAdmin()))
                .filter(record -> !hiddenEventIds.contains(normalizeId(record.getSourceId())))
                .map(ActivityEvent::getStartAtIso)
                .map(this::toSortableDate)
                .filter(startAtMs -> startAtMs > 0L && nowMs >= startAtMs + EVENT_FEEDBACK_UNLOCK_DELAY_MS)
                .count());
    }

    private UserRealtimeCountersDto buildRealtimeCounters(
            Users user,
            String requestCursor,
            UserImpressionsDto impressions) {
        UserMenuCountersDto counters = buildMenuCounters(user);
        String previousHostHash = cursorPart(requestCursor, 8);
        String previousMemberHash = cursorPart(requestCursor, 9);
        String nextHostHash = impressionsFingerprint(impressions == null ? null : impressions.host());
        String nextMemberHash = impressionsFingerprint(impressions == null ? null : impressions.member());
        return new UserRealtimeCountersDto(
                counters.game(),
                counters.chat(),
                counters.invitations(),
                counters.events(),
                counters.hosting(),
                counters.tickets(),
                counters.feedback(),
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
                String.valueOf(normalizeCount(counters.tickets())),
                String.valueOf(normalizeCount(counters.feedback())),
                impressionsFingerprint(impressions == null ? null : impressions.host()),
                impressionsFingerprint(impressions == null ? null : impressions.member()));
    }

    private boolean activitiesEqual(Users.UserActivitiesRecord left, Users.UserActivitiesRecord right) {
        if (left == right) {
            return true;
        }
        if (left == null || right == null) {
            return false;
        }
        return normalizeCount(left.game()) == normalizeCount(right.game())
                && normalizeCount(left.chat()) == normalizeCount(right.chat())
                && normalizeCount(left.invitations()) == normalizeCount(right.invitations())
                && normalizeCount(left.events()) == normalizeCount(right.events())
                && normalizeCount(left.hosting()) == normalizeCount(right.hosting())
                && normalizeCount(left.tickets()) == normalizeCount(right.tickets())
                && normalizeCount(left.feedback()) == normalizeCount(right.feedback());
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
        return switch (safeText(status)) {
            case "D" -> "deleted";
            case "I" -> "inactive";
            case "F" -> "friends only";
            case "H" -> "host only";
            case "A" -> "public";
            default -> {
                String normalizedProfileStatus = safeText(fallbackProfileStatus);
                yield StringUtils.hasText(normalizedProfileStatus) ? normalizedProfileStatus : "public";
            }
        };
    }

    private String resolveStatusCode(String profileStatus, String fallbackStatus) {
        return switch (safeText(profileStatus)) {
            case "deleted" -> "D";
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
            return new UserActivitiesDto(0, 0, 0, 0, 0, 0, 0);
        }
        return new UserActivitiesDto(
                normalizeCount(activities.game()),
                normalizeCount(activities.chat()),
                normalizeCount(activities.invitations()),
                normalizeCount(activities.events()),
                normalizeCount(activities.hosting()),
                normalizeCount(activities.tickets()),
                normalizeCount(activities.feedback()));
    }

    private Users.UserActivitiesRecord toUserActivitiesRecord(UserActivitiesDto activities) {
        if (activities == null) {
            return new Users.UserActivitiesRecord(0, 0, 0, 0, 0, 0, 0);
        }
        return new Users.UserActivitiesRecord(
                normalizeCount(activities.game()),
                normalizeCount(activities.chat()),
                normalizeCount(activities.invitations()),
                normalizeCount(activities.events()),
                normalizeCount(activities.hosting()),
                normalizeCount(activities.tickets()),
                normalizeCount(activities.feedback()));
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

    private UserImpressionsDto toUserImpressionsDto(Users.UserImpressionsRecord record) {
        if (record == null) {
            return null;
        }
        return new UserImpressionsDto(
                toUserImpressionsSectionDto(record.host()),
                toUserImpressionsSectionDto(record.member()));
    }

    private Users.UserImpressionsRecord toUserImpressionsRecord(UserImpressionsDto dto) {
        if (dto == null) {
            return null;
        }
        return new Users.UserImpressionsRecord(
                toUserImpressionsSectionRecord(dto.host()),
                toUserImpressionsSectionRecord(dto.member()));
    }

    private UserImpressionsSectionDto toUserImpressionsSectionDto(Users.UserImpressionsSectionRecord record) {
        if (record == null) {
            return null;
        }
        return new UserImpressionsSectionDto(
                record.unreadCount(),
                record.averageRating(),
                record.peopleMet(),
                record.totalEvents(),
                record.repeatCount(),
                record.noShowCount(),
                normalizeStrings(record.vibeBadges()),
                normalizeStrings(record.personalityBadges()),
                toUserPersonalityTraitDtos(record.personalityTraits()),
                normalizeStrings(record.categoryBadges()));
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
        if (user == null || !StringUtils.hasText(normalizeId(user.getId()))) {
            return null;
        }
        List<EventFeedbackAnswer> feedbackAnswers = eventFeedbackAnswersRepository
                .findByTargetUserIdOrderBySubmittedAtIsoDesc(normalizeId(user.getId()));
        UserImpressionsSectionDto host = resolveMergedImpressionsSection(user, user.getImpressions() == null ? null : user.getImpressions().host(), "event", feedbackAnswers);
        UserImpressionsSectionDto member = resolveMergedImpressionsSection(user, user.getImpressions() == null ? null : user.getImpressions().member(), "attendee", feedbackAnswers);
        if (host == null && member == null) {
            return null;
        }
        return new UserImpressionsDto(host, member);
    }

    private UserImpressionsSectionDto resolveMergedImpressionsSection(
            Users user,
            Users.UserImpressionsSectionRecord record,
            String feedbackKind,
            List<EventFeedbackAnswer> feedbackAnswers) {
        List<UserPersonalityTraitDto> personalityTraits = resolvePersonalityTraits(user, record, feedbackKind, feedbackAnswers);
        if (record == null && personalityTraits.isEmpty()) {
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
            scoreByTraitId.merge(traitId, Math.max(1d, normalizeCount(traitRecord.percent())), Double::sum);
            evidenceByTraitId.merge(traitId, normalizeCount(traitRecord.evidenceCount()), Integer::sum);
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
            scoreByTraitId.merge(signal.traitId(), Math.max(1d, signal.percent()), Double::sum);
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
        scoreByTraitId.merge(dominantTraitId, 48d, Double::sum);
        scoreByTraitId.merge(secondaryTraitId, 20d, Double::sum);
        scoreByTraitId.merge(tertiaryTraitId, 12d, Double::sum);
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
                scoreByTraitId.merge(traitId, 18d, Double::sum);
                evidenceByTraitId.merge(traitId, 1, Integer::sum);
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

    private List<UserPersonalityTraitDto> toUserPersonalityTraitDtos(List<Users.UserPersonalityTraitRecord> records) {
        if (records == null || records.isEmpty()) {
            return List.of();
        }
        return records.stream()
                .filter(Objects::nonNull)
                .map(record -> {
                    String traitId = resolvePersonalityTraitId(record.id(), record.label());
                    PersonalityTraitDefinition definition = PERSONALITY_TRAIT_DEFINITION_BY_ID.get(traitId);
                    String resolvedLabel = definition == null ? safeText(record.label()) : definition.label();
                    String resolvedId = definition == null ? safeText(record.id()) : definition.id();
                    if (!StringUtils.hasText(resolvedId) || !StringUtils.hasText(resolvedLabel)) {
                        return null;
                    }
                    return new UserPersonalityTraitDto(
                            resolvedId,
                            resolvedLabel,
                            normalizeCount(record.percent()),
                            normalizeCount(record.evidenceCount()),
                            safeText(record.lastRatedAtIso()));
                })
                .filter(Objects::nonNull)
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

    private String cursorPart(String cursor, int index) {
        String normalizedCursor = safeText(cursor);
        if (!StringUtils.hasText(normalizedCursor)) {
            return "";
        }
        String[] parts = normalizedCursor.split(":", -1);
        return parts.length > index ? safeText(parts[index]) : "";
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

    private <T> Map<String, T> safeMap(Map<String, T> source) {
        return source == null ? Map.of() : source;
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

    private String normalizeId(String value) {
        return value == null ? "" : value.trim();
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
