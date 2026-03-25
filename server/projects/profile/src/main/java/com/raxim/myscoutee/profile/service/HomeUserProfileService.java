package com.raxim.myscoutee.profile.service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.raxim.myscoutee.common.config.firebase.dto.FirebasePrincipal;
import com.raxim.myscoutee.profile.data.document.mongo.UserFilterPreferences;
import com.raxim.myscoutee.profile.data.document.mongo.UserRates;
import com.raxim.myscoutee.profile.data.document.mongo.Users;
import com.raxim.myscoutee.profile.dto.auth.AuthDtos.UserActivitiesDto;
import com.raxim.myscoutee.profile.dto.auth.AuthDtos.UserByIdResponseDto;
import com.raxim.myscoutee.profile.dto.auth.AuthDtos.UserDto;
import com.raxim.myscoutee.profile.dto.auth.AuthDtos.UserGameFilterPreferencesDto;
import com.raxim.myscoutee.profile.dto.auth.AuthDtos.UserImpressionsDto;
import com.raxim.myscoutee.profile.dto.auth.AuthDtos.UserImpressionsSectionDto;
import com.raxim.myscoutee.profile.dto.auth.AuthDtos.UserMenuCountersDto;
import com.raxim.myscoutee.profile.dto.shared.SharedDtos.LocationCoordinatesDto;
import com.raxim.myscoutee.profile.repository.mongo.UserFilterPreferencesRepository;
import com.raxim.myscoutee.profile.repository.mongo.UserRatesRepository;
import com.raxim.myscoutee.profile.repository.mongo.UsersRepository;

@Service
public class HomeUserProfileService {
    private static final String USER_FILTER_PREFERENCES_DOCUMENT_ID = "userFilterPreferences";
    private static final String USER_RATES_DOCUMENT_ID = "userRates";

    private final UsersRepository usersRepository;
    private final UserFilterPreferencesRepository userFilterPreferencesRepository;
    private final UserRatesRepository userRatesRepository;

    public HomeUserProfileService(
            UsersRepository usersRepository,
            UserFilterPreferencesRepository userFilterPreferencesRepository,
            UserRatesRepository userRatesRepository) {
        this.usersRepository = usersRepository;
        this.userFilterPreferencesRepository = userFilterPreferencesRepository;
        this.userRatesRepository = userRatesRepository;
    }

    public UserByIdResponseDto queryUserById(String requestedUserId) {
        String resolvedUserId = resolveSelectedUserId(requestedUserId);
        if (!StringUtils.hasText(resolvedUserId)) {
            return null;
        }

        Users user = findUser(resolvedUserId);
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

        UserFilterPreferences document = userFilterPreferencesDocument();
        Map<String, UserFilterPreferences.UserFilterPreferencesRecord> byId =
                new LinkedHashMap<>(safeMap(document.getById()));
        List<String> ids = new ArrayList<>(safeList(document.getIds()));

        byId.put(resolvedUserId, toPreferencesRecord(preferences));
        if (!ids.contains(resolvedUserId)) {
            ids.add(resolvedUserId);
        }

        document.setById(byId);
        document.setIds(ids);
        userFilterPreferencesRepository.save(document);
    }

    public UserDto saveUserProfile(UserDto user) {
        if (user == null || !StringUtils.hasText(user.id())) {
            return null;
        }

        Users saved = usersRepository.save(toUsersDocument(user));
        return toUserDto(saved);
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
                toUserImpressionsDto(user.getImpressions()),
                nullToEmpty(user.getProfileStatus()),
                toUserActivitiesDto(user.getActivities()));
    }

    public String resolveSelectedUserId(String requestedUserId) {
        String normalizedRequestedUserId = normalizeId(requestedUserId);
        if (StringUtils.hasText(normalizedRequestedUserId)
                && findUser(normalizedRequestedUserId) != null) {
            return normalizedRequestedUserId;
        }

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof FirebasePrincipal firebasePrincipal) {
            String principalUserId = normalizeId(firebasePrincipal.getUserId());
            if (StringUtils.hasText(principalUserId) && findUser(principalUserId) != null) {
                return principalUserId;
            }
        }

        return null;
    }

    private UserFilterPreferences userFilterPreferencesDocument() {
        return userFilterPreferencesRepository.findById(USER_FILTER_PREFERENCES_DOCUMENT_ID)
                .orElseGet(() -> {
                    UserFilterPreferences document = new UserFilterPreferences();
                    document.setId(USER_FILTER_PREFERENCES_DOCUMENT_ID);
                    return document;
                });
    }

    private UserRates userRatesDocument() {
        return userRatesRepository.findById(USER_RATES_DOCUMENT_ID)
                .orElseGet(() -> {
                    UserRates document = new UserRates();
                    document.setId(USER_RATES_DOCUMENT_ID);
                    return document;
                });
    }

    private Users findUser(String userId) {
        if (!StringUtils.hasText(userId)) {
            return null;
        }
        Users user = usersRepository.findById(userId).orElse(null);
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
        UserFilterPreferences.UserFilterPreferencesRecord stored =
                safeMap(userFilterPreferencesDocument().getById()).get(userId);
        return stored == null ? null : toUserGameFilterPreferencesDto(stored);
    }

    private Set<String> queryRatedGameCardUserIds(String raterUserId) {
        Set<String> ratedUserIds = new LinkedHashSet<>();
        if (!StringUtils.hasText(raterUserId)) {
            return ratedUserIds;
        }

        UserRates document = userRatesDocument();
        Map<String, UserRates.UserRateRecord> byId = safeMap(document.getById());
        for (String id : safeList(document.getIds())) {
            UserRates.UserRateRecord record = byId.get(id);
            if (record == null || !"game-card".equals(normalizeToken(record.source()))) {
                continue;
            }
            if ("pair".equals(normalizeToken(record.mode())) && raterUserId.equals(normalizeId(record.ownerUserId()))) {
                String firstUserId = normalizeId(record.fromUserId());
                String secondUserId = normalizeId(record.toUserId());
                if (StringUtils.hasText(firstUserId)) {
                    ratedUserIds.add(firstUserId);
                }
                if (StringUtils.hasText(secondUserId)) {
                    ratedUserIds.add(secondUserId);
                }
                continue;
            }
            if (raterUserId.equals(normalizeId(record.fromUserId()))) {
                String ratedUserId = normalizeId(record.toUserId());
                if (StringUtils.hasText(ratedUserId)) {
                    ratedUserIds.add(ratedUserId);
                }
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
                0,
                0);
    }

    private Users toUsersDocument(UserDto user) {
        Users document = new Users();
        document.setId(normalizeId(user.id()));
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
        document.setProfileStatus(nullToEmpty(user.profileStatus()));
        document.setActivities(toUserActivitiesRecord(user.activities()));
        return document;
    }

    private UserFilterPreferences.UserFilterPreferencesRecord toPreferencesRecord(
            UserGameFilterPreferencesDto preferences) {
        return new UserFilterPreferences.UserFilterPreferencesRecord(
                preferences.ageMin(),
                preferences.ageMax(),
                preferences.heightMinCm(),
                preferences.heightMaxCm(),
                normalizeStrings(preferences.interests()),
                normalizeStrings(preferences.values()),
                normalizeStrings(preferences.physiques()),
                normalizeStrings(preferences.languages()),
                normalizeStrings(preferences.genders()),
                normalizeStrings(preferences.horoscopes()),
                normalizeStrings(preferences.traitLabels()),
                normalizeStrings(preferences.smoking()),
                normalizeStrings(preferences.drinking()),
                normalizeStrings(preferences.workout()),
                normalizeStrings(preferences.pets()),
                normalizeStrings(preferences.familyPlans()),
                normalizeStrings(preferences.children()),
                normalizeStrings(preferences.loveStyles()),
                normalizeStrings(preferences.communicationStyles()),
                normalizeStrings(preferences.sexualOrientations()),
                normalizeStrings(preferences.religions()));
    }

    private UserGameFilterPreferencesDto toUserGameFilterPreferencesDto(
            UserFilterPreferences.UserFilterPreferencesRecord preferences) {
        return new UserGameFilterPreferencesDto(
                preferences.ageMin(),
                preferences.ageMax(),
                preferences.heightMinCm(),
                preferences.heightMaxCm(),
                normalizeStrings(preferences.interests()),
                normalizeStrings(preferences.values()),
                normalizeStrings(preferences.physiques()),
                normalizeStrings(preferences.languages()),
                normalizeStrings(preferences.genders()),
                normalizeStrings(preferences.horoscopes()),
                normalizeStrings(preferences.traitLabels()),
                normalizeStrings(preferences.smoking()),
                normalizeStrings(preferences.drinking()),
                normalizeStrings(preferences.workout()),
                normalizeStrings(preferences.pets()),
                normalizeStrings(preferences.familyPlans()),
                normalizeStrings(preferences.children()),
                normalizeStrings(preferences.loveStyles()),
                normalizeStrings(preferences.communicationStyles()),
                normalizeStrings(preferences.sexualOrientations()),
                normalizeStrings(preferences.religions()));
    }

    private UserActivitiesDto toUserActivitiesDto(Users.UserActivitiesRecord activities) {
        if (activities == null) {
            return new UserActivitiesDto(0, 0, 0, 0, 0);
        }
        return new UserActivitiesDto(
                normalizeCount(activities.game()),
                normalizeCount(activities.chat()),
                normalizeCount(activities.invitations()),
                normalizeCount(activities.events()),
                normalizeCount(activities.hosting()));
    }

    private Users.UserActivitiesRecord toUserActivitiesRecord(UserActivitiesDto activities) {
        if (activities == null) {
            return new Users.UserActivitiesRecord(0, 0, 0, 0, 0);
        }
        return new Users.UserActivitiesRecord(
                normalizeCount(activities.game()),
                normalizeCount(activities.chat()),
                normalizeCount(activities.invitations()),
                normalizeCount(activities.events()),
                normalizeCount(activities.hosting()));
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
                normalizeStrings(dto.categoryBadges()));
    }

    private <T> Map<String, T> safeMap(Map<String, T> source) {
        return source == null ? Map.of() : source;
    }

    private List<String> safeList(List<String> source) {
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

    private String nullToEmpty(String value) {
        return value == null ? "" : value;
    }
}
