package com.raxim.myscoutee.profile.service;

import static com.raxim.myscoutee.profile.data.dto.navigator.NavigatorContactsDtos.NavigatorContactDeleteRequestDto;
import static com.raxim.myscoutee.profile.data.dto.navigator.NavigatorContactsDtos.NavigatorContactDto;
import static com.raxim.myscoutee.profile.data.dto.navigator.NavigatorContactsDtos.NavigatorContactMethodDto;
import static com.raxim.myscoutee.profile.data.dto.navigator.NavigatorContactsDtos.NavigatorContactProfileDto;
import static com.raxim.myscoutee.profile.data.dto.navigator.NavigatorContactsDtos.NavigatorContactsSaveRequestDto;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.util.StringUtils;

import com.raxim.myscoutee.profile.data.document.NavigatorContactsProfile;
import com.raxim.myscoutee.profile.data.document.Users;
import com.raxim.myscoutee.profile.data.dto.auth.AuthDtos.UserDto;
import com.raxim.myscoutee.profile.data.dto.experience.ExperienceDtos.ExperienceEntryDto;
import com.raxim.myscoutee.profile.repository.NavigatorContactsProfilesRepository;
import com.raxim.myscoutee.profile.repository.UsersRepository;
import com.raxim.myscoutee.profile.security.AccessControlService;
import com.raxim.myscoutee.profile.security.FriendshipFacts;

@Service
public class NavigatorContactsService {
    private static final Set<String> SELECTABLE_BASIC_FIELDS = Set.of(
            "profile.profession", "profile.experience.workplace", "profile.experience.school");
    private static final Set<String> METHOD_TYPES = Set.of(
            "phone",
            "sms",
            "whatsapp",
            "email",
            "facebook",
            "instagram",
            "telegram",
            "linkedin",
            "website");

    private final NavigatorContactsProfilesRepository navigatorContactsProfilesRepository;
    private final HomeUserProfileService homeUserProfileService;
    private final UserExperienceProfilesService userExperienceProfilesService;
    private final UsersRepository usersRepository;
    private final AccessControlService accessControlService;
    private final FriendshipFacts friendshipFacts;

    public NavigatorContactsService(
            NavigatorContactsProfilesRepository navigatorContactsProfilesRepository,
            HomeUserProfileService homeUserProfileService,
            UserExperienceProfilesService userExperienceProfilesService,
            UsersRepository usersRepository,
            AccessControlService accessControlService,
            FriendshipFacts friendshipFacts) {
        this.navigatorContactsProfilesRepository = navigatorContactsProfilesRepository;
        this.homeUserProfileService = homeUserProfileService;
        this.userExperienceProfilesService = userExperienceProfilesService;
        this.usersRepository = usersRepository;
        this.accessControlService = accessControlService;
        this.friendshipFacts = friendshipFacts;
    }

    public List<NavigatorContactDto> loadContacts(String requestedUserId) {
        String resolvedUserId = resolveUserId(requestedUserId);
        if (!StringUtils.hasText(resolvedUserId)) {
            return List.of();
        }
        return navigatorContactsProfilesRepository.findByUserId(resolvedUserId)
                .map(NavigatorContactsProfile::getContacts)
                .map(this::toDtos)
                .orElseGet(List::of);
    }

    public NavigatorContactProfileDto loadContactProfile(String userId) {
        String targetUserId = safeText(userId);
        if (!StringUtils.hasText(targetUserId)) {
            return new NavigatorContactProfileDto(null, List.of(), List.of());
        }
        Users record = usersRepository.findByUserId(targetUserId).orElse(null);
        if (record == null) {
            return new NavigatorContactProfileDto(null, List.of(), List.of());
        }
        String viewer = accessControlService.resolveActorUserId(SecurityContextHolder.getContext().getAuthentication());
        boolean owner = targetUserId.equals(viewer);
        boolean friend = !owner && friendshipFacts.areFriends(targetUserId, viewer);
        Set<String> hidden = new LinkedHashSet<>();
        // Sanitize the response before mapping it. Never save this viewer-specific projection.
        record.setProfileDetails((record.getProfileDetails() == null ? List.<Users.ProfileDetailGroupRecord>of()
                : record.getProfileDetails()).stream().filter(Objects::nonNull).map(group -> new Users.ProfileDetailGroupRecord(
                        group.title(), (group.rows() == null ? List.<Users.ProfileDetailRowRecord>of() : group.rows())
                        .stream().filter(Objects::nonNull).filter(row -> {
                            String key = safeText(row.labelKey());
                            boolean selectable = key.startsWith("profile.details.") || SELECTABLE_BASIC_FIELDS.contains(key);
                            boolean visible = !selectable || owner || "Public".equals(row.privacy())
                                    || (friend && "Friends".equals(row.privacy()));
                            if (!visible) hidden.add(key);
                            return visible;
                        }).toList())).toList());
        UserDto user = homeUserProfileService.toUserDto(record);
        List<ExperienceEntryDto> experiences = userExperienceProfilesService.queryEntriesByUserId(targetUserId).stream()
                .filter(entry -> !("Workspace".equals(entry.type()) && hidden.contains("profile.experience.workplace")))
                .filter(entry -> !("School".equals(entry.type()) && hidden.contains("profile.experience.school")))
                .toList();
        return new NavigatorContactProfileDto(user, experiences, List.copyOf(hidden));
    }

    public List<NavigatorContactDto> saveContacts(NavigatorContactsSaveRequestDto request) {
        String resolvedUserId = resolveUserId(request == null ? null : request.userId());
        if (!StringUtils.hasText(resolvedUserId)) {
            return List.of();
        }

        NavigatorContactsProfile profile = navigatorContactsProfilesRepository.findByUserId(resolvedUserId)
                .orElseGet(NavigatorContactsProfile::new);
        String nowIso = nowIso();
        List<NavigatorContactsProfile.NavigatorContactRecord> contacts = normalizeContacts(
                request == null ? null : request.contacts(),
                nowIso);
        profile.setUserId(resolvedUserId);
        profile.setUpdatedAtIso(nowIso);
        profile.setContacts(contacts);

        NavigatorContactsProfile saved = navigatorContactsProfilesRepository.save(profile);
        updateContactsCounter(resolvedUserId, saved.getContacts().size());
        return toDtos(saved.getContacts());
    }

    public List<NavigatorContactDto> deleteContact(String contactId, NavigatorContactDeleteRequestDto request) {
        String resolvedUserId = resolveUserId(request == null ? null : request.userId());
        String normalizedContactId = safeText(contactId);
        if (!StringUtils.hasText(resolvedUserId) || !StringUtils.hasText(normalizedContactId)) {
            return List.of();
        }

        NavigatorContactsProfile profile = navigatorContactsProfilesRepository.findByUserId(resolvedUserId)
                .orElse(null);
        if (profile == null) {
            return List.of();
        }

        List<NavigatorContactsProfile.NavigatorContactRecord> nextContacts = profile.getContacts().stream()
                .filter(contact -> contact != null && !normalizedContactId.equals(safeText(contact.getId())))
                .toList();
        profile.setUpdatedAtIso(nowIso());
        profile.setContacts(nextContacts);
        NavigatorContactsProfile saved = navigatorContactsProfilesRepository.save(profile);
        updateContactsCounter(resolvedUserId, saved.getContacts().size());
        return toDtos(saved.getContacts());
    }

    private List<NavigatorContactDto> toDtos(List<NavigatorContactsProfile.NavigatorContactRecord> contacts) {
        if (contacts == null || contacts.isEmpty()) {
            return List.of();
        }
        List<NavigatorContactDto> next = new ArrayList<>();
        for (NavigatorContactsProfile.NavigatorContactRecord contact : contacts) {
            if (contact == null) {
                continue;
            }
            next.add(new NavigatorContactDto(
                    safeText(contact.getId()),
                    safeText(contact.getUserId()),
                    contactName(contact.getName()),
                    safeText(contact.getInitials()),
                    normalizeGender(contact.getGender()),
                    safeText(contact.getCity()),
                    safeText(contact.getAvatarUrl()),
                    safeText(contact.getHeadline()),
                    safeText(contact.getCreatedAtIso()),
                    safeText(contact.getUpdatedAtIso()),
                    toMethodDtos(contact.getMethods())));
        }
        return List.copyOf(next);
    }

    private List<NavigatorContactMethodDto> toMethodDtos(
            List<NavigatorContactsProfile.NavigatorContactMethodRecord> methods) {
        if (methods == null || methods.isEmpty()) {
            return List.of();
        }
        List<NavigatorContactMethodDto> next = new ArrayList<>();
        for (NavigatorContactsProfile.NavigatorContactMethodRecord method : methods) {
            if (method == null || !StringUtils.hasText(safeText(method.getValue()))) {
                continue;
            }
            next.add(new NavigatorContactMethodDto(
                    safeText(method.getId()),
                    normalizeMethodType(method.getType()),
                    safeText(method.getValue())));
        }
        return List.copyOf(next);
    }

    private List<NavigatorContactsProfile.NavigatorContactRecord> normalizeContacts(
            List<NavigatorContactDto> contacts,
            String nowIso) {
        if (contacts == null || contacts.isEmpty()) {
            return List.of();
        }

        Map<String, NavigatorContactsProfile.NavigatorContactRecord> next = new LinkedHashMap<>();
        for (NavigatorContactDto contact : contacts) {
            if (contact == null) {
                continue;
            }
            String contactId = safeText(contact.id());
            String contactUserId = safeText(contact.userId());
            String normalizedId = StringUtils.hasText(contactId) ? contactId : contactUserId;
            if (!StringUtils.hasText(normalizedId)) {
                continue;
            }

            NavigatorContactsProfile.NavigatorContactRecord record = new NavigatorContactsProfile.NavigatorContactRecord();
            record.setId(normalizedId);
            record.setUserId(contactUserId);
            record.setName(contactName(contact.name()));
            record.setInitials(safeText(contact.initials()));
            record.setGender(normalizeGender(contact.gender()));
            record.setCity(safeText(contact.city()));
            record.setAvatarUrl(safeText(contact.avatarUrl()));
            record.setHeadline(safeText(contact.headline()));
            record.setCreatedAtIso(timestampOrNow(contact.createdAtIso(), nowIso));
            record.setUpdatedAtIso(timestampOrNow(contact.updatedAtIso(), nowIso));
            record.setMethods(normalizeMethods(contact.methods()));
            next.put(normalizedId, record);
        }
        return List.copyOf(next.values());
    }

    private List<NavigatorContactsProfile.NavigatorContactMethodRecord> normalizeMethods(
            List<NavigatorContactMethodDto> methods) {
        if (methods == null || methods.isEmpty()) {
            return List.of();
        }

        List<NavigatorContactsProfile.NavigatorContactMethodRecord> next = new ArrayList<>();
        for (NavigatorContactMethodDto method : methods) {
            if (method == null) {
                continue;
            }
            String methodValue = safeText(method.value());
            if (!StringUtils.hasText(methodValue)) {
                continue;
            }
            NavigatorContactsProfile.NavigatorContactMethodRecord record = new NavigatorContactsProfile.NavigatorContactMethodRecord();
            String methodId = safeText(method.id());
            record.setId(StringUtils.hasText(methodId) ? methodId : "method-" + UUID.randomUUID());
            record.setType(normalizeMethodType(method.type()));
            record.setValue(methodValue);
            next.add(record);
        }
        return List.copyOf(next);
    }

    private void updateContactsCounter(String userId, int contactsCount) {
        usersRepository.findByUserId(userId).ifPresent(user -> {
            user.setActivities(withContactsCount(user.getActivities(), contactsCount));
            usersRepository.save(user);
        });
    }

    private Users.UserActivitiesRecord withContactsCount(Users.UserActivitiesRecord current, int contactsCount) {
        Users.UserActivitiesRecord safe = current == null ? emptyActivities() : current;
        return new Users.UserActivitiesRecord(
                count(safe.game()),
                count(safe.chats()),
                count(safe.invitations()),
                count(safe.events()),
                count(safe.hosting()),
                count(safe.cars()),
                count(safe.accommodation()),
                count(safe.supplies()),
                count(safe.tickets()),
                Math.max(0, contactsCount),
                count(safe.feedback()),
                safe.chat() == null ? emptyChatCounters() : safe.chat(),
                safe.event() == null ? emptyEventCounters() : safe.event(),
                safe.asset() == null ? emptyAssetCounters() : safe.asset(),
                safe.eventFeedback() == null ? emptyEventFeedbackCounters() : safe.eventFeedback(),
                count(safe.adminJobs()),
                count(safe.adminMetrics()),
                count(safe.notifications()));
    }

    private Users.UserActivitiesRecord emptyActivities() {
        return new Users.UserActivitiesRecord(
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                emptyChatCounters(),
                emptyEventCounters(),
                emptyAssetCounters(),
                emptyEventFeedbackCounters(),
                0,
                0,
                0);
    }

    private Users.UserChatCountersRecord emptyChatCounters() {
        return new Users.UserChatCountersRecord(0, 0, 0, 0, 0, 0);
    }

    private Users.UserEventCountersRecord emptyEventCounters() {
        return new Users.UserEventCountersRecord(0, 0, 0, 0, 0, 0, 0);
    }

    private Users.UserAssetCountersRecord emptyAssetCounters() {
        return new Users.UserAssetCountersRecord(0, 0, 0, 0);
    }

    private Users.UserEventFeedbackCountersRecord emptyEventFeedbackCounters() {
        return new Users.UserEventFeedbackCountersRecord(0, 0, 0, 0);
    }

    private String resolveUserId(String requestedUserId) {
        return safeText(homeUserProfileService.resolveSelectedUserId(requestedUserId));
    }

    private String normalizeGender(String value) {
        return "woman".equals(safeText(value)) ? "woman" : "man";
    }

    private String normalizeMethodType(String value) {
        String normalized = safeText(value);
        return METHOD_TYPES.contains(normalized) ? normalized : "phone";
    }

    private String contactName(String value) {
        String normalized = safeText(value);
        return StringUtils.hasText(normalized) ? normalized : "Contact";
    }

    private String timestampOrNow(String value, String nowIso) {
        String normalized = safeText(value);
        return StringUtils.hasText(normalized) ? normalized : nowIso;
    }

    private int count(Integer value) {
        return Math.max(0, value == null ? 0 : value);
    }

    private String nowIso() {
        return OffsetDateTime.now(ZoneOffset.UTC).toString();
    }

    private String safeText(String value) {
        return value == null ? "" : value.trim();
    }
}
