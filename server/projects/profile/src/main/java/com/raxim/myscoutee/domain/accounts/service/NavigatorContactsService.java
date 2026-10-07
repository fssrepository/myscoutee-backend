package com.raxim.myscoutee.domain.accounts.service;

import com.raxim.myscoutee.domain.groups.api.WorkspaceContext;

import com.raxim.myscoutee.domain.accounts.dto.NavigatorContactsDtos.ContactChatAccessDto;
import com.raxim.myscoutee.domain.accounts.dto.NavigatorContactsDtos.ContactChatAccessSnapshot;
import com.raxim.myscoutee.domain.accounts.dto.NavigatorContactsDtos.ContactChatAccessCommand;
import com.raxim.myscoutee.domain.chat.api.ContactPermissions.Permission;
import com.raxim.myscoutee.domain.chat.api.ContactPermissions;
import com.raxim.myscoutee.domain.notifications.api.NotificationDelivery.NotificationIntent;
import com.raxim.myscoutee.domain.notifications.api.NotificationDelivery;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import static com.raxim.myscoutee.domain.accounts.dto.NavigatorContactsDtos.NavigatorContactDeleteRequestDto;
import static com.raxim.myscoutee.domain.accounts.dto.NavigatorContactsDtos.NavigatorContactDto;
import static com.raxim.myscoutee.domain.accounts.dto.NavigatorContactsDtos.NavigatorContactMethodDto;
import static com.raxim.myscoutee.domain.accounts.dto.NavigatorContactsDtos.NavigatorContactProfileDto;
import static com.raxim.myscoutee.domain.accounts.dto.NavigatorContactsDtos.NavigatorContactsSaveRequestDto;

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

import com.raxim.myscoutee.domain.accounts.document.NavigatorContactsProfile;
import com.raxim.myscoutee.domain.accounts.document.Users;
import com.raxim.myscoutee.domain.accounts.dto.AuthDtos.UserDto;
import com.raxim.myscoutee.domain.accounts.dto.ExperienceDtos.ExperienceEntryDto;
import com.raxim.myscoutee.domain.accounts.repository.NavigatorContactsProfilesRepository;
import com.raxim.myscoutee.domain.accounts.repository.UsersRepository;
import com.raxim.myscoutee.domain.access.api.AccessPermissions;
import com.raxim.myscoutee.domain.accounts.api.Friendships;

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
    private final AccessPermissions accessControlService;
    private final MongoTemplate mongo;
    private final Friendships friendshipFacts;
    private final ContactPermissions chatAccess;
    private final NotificationDelivery notifications;

    public NavigatorContactsService(
            NavigatorContactsProfilesRepository navigatorContactsProfilesRepository,
            HomeUserProfileService homeUserProfileService,
            UserExperienceProfilesService userExperienceProfilesService,
            UsersRepository usersRepository,
            AccessPermissions accessControlService,
            Friendships friendshipFacts,
            ContactPermissions chatAccess,
            NotificationDelivery notifications,
            MongoTemplate mongo) {
        this.navigatorContactsProfilesRepository = navigatorContactsProfilesRepository;
        this.homeUserProfileService = homeUserProfileService;
        this.userExperienceProfilesService = userExperienceProfilesService;
        this.usersRepository = usersRepository;
        this.accessControlService = accessControlService;
        this.friendshipFacts = friendshipFacts;
        this.chatAccess = chatAccess;
        this.notifications = notifications;
        this.mongo = mongo;
    }

    public ContactChatAccessSnapshot chatAccessSnapshot() {
        String actor = requireChatAccessActor();
        return new ContactChatAccessSnapshot(loadChatAccess(),
                usersRepository.findByUserId(actor).map(user -> count(user.getContactRequestsPending())).orElse(0), loadContacts(null));
    }

    public List<ContactChatAccessDto> loadChatAccess() {
        String actor = requireChatAccessActor();
        var records = chatAccess.findForUser(actor);
        var peers = usersRepository.findByUserIdIn(records.stream()
                .map(value -> actor.equals(value.leftUserId()) ? value.rightUserId() : value.leftUserId()).toList());
        Users owner = usersRepository.findByUserId(actor).orElse(null);
        Map<String, Users> byId = new LinkedHashMap<>();
        for (Users peer : peers) if (availableChatPeer(owner, peer)) byId.put(peer.getUserId(), peer);
        return records.stream().filter(value -> byId.containsKey(actor.equals(value.leftUserId()) ? value.rightUserId() : value.leftUserId()))
                .map(value -> chatAccessDto(value, byId.get(actor.equals(value.leftUserId()) ? value.rightUserId() : value.leftUserId())))
                .sorted(java.util.Comparator.comparing(ContactChatAccessDto::requestedAtIso).reversed())
                .toList();
    }

    public ContactChatAccessDto changeChatAccess(
            String peerId, ContactChatAccessCommand command) {
        String actor = requireChatAccessActor();
        String target = safeText(peerId);
        Users owner = usersRepository.findByUserId(actor).orElse(null);
        Users peer = usersRepository.findByUserId(target).orElse(null);
        if (actor.equals(target) || !availableChatPeer(owner, peer)) throw chatAccessError(404, "Contact unavailable.");
        String id = chatAccess.pairId(actor, target);
        var current = chatAccess.findById(id).orElse(null);
        String action = command == null ? "" : safeText(command.action());
        String status;
        String requester;
        String requestedAt;
        String now = nowIso();
        if ("request".equals(action)) {
            boolean savedContact = navigatorContactsProfilesRepository.findByUserId(actor)
                    .map(value -> value.getContacts().stream().anyMatch(contact -> target.equals(contact.getUserId()))).orElse(false);
            if (!savedContact) throw chatAccessError(403, "Save the contact before requesting chat access.");
            if (current != null && !"rejected".equals(current.status())) return chatAccessDto(current, peer);
            status = "pending"; requester = actor; requestedAt = now;
        } else if ("approve".equals(action) || "reject".equals(action)) {
            if (current == null || actor.equals(current.requestedBy())) throw chatAccessError(403, "Only the recipient can decide.");
            status = "approve".equals(action) ? "approved" : "rejected";
            if (status.equals(current.status())) return chatAccessDto(current, peer);
            if (!"pending".equals(current.status()) || !Objects.equals(current.version(), command.version()))
                throw chatAccessError(409, "The request has changed.");
            requester = current.requestedBy(); requestedAt = current.requestedAtIso();
        } else throw chatAccessError(400, "Unknown chat access action.");
        var draft = new ContactPermissions.Change(id,
                actor.compareTo(target) < 0 ? actor : target, actor.compareTo(target) < 0 ? target : actor,
                requester, status, requestedAt, "pending".equals(status) ? null : now, current == null ? null : current.version());
        Permission next;
        try { next = chatAccess.save(draft); }
        catch (org.springframework.dao.OptimisticLockingFailureException | org.springframework.dao.DuplicateKeyException conflict) {
            throw chatAccessError(409, "The request has changed.");
        }
        if ("approved".equals(status)) {
            List<NavigatorContactDto> contacts = new ArrayList<>(loadContacts(null));
            if (contacts.stream().noneMatch(contact -> target.equals(contact.userId()))) {
                contacts.add(chatAccessDto(next, peer).contact());
                saveContacts(new NavigatorContactsSaveRequestDto(null, contacts));
            }
        }
        String counterOwner = "pending".equals(status) ? target : actor;
        var counterCriteria = Criteria.where("userId").is(counterOwner);
        if (!"pending".equals(status)) counterCriteria.and("contactRequestsPending").gt(0);
        mongo.updateFirst(Query.query(counterCriteria),
                new Update().inc("contactRequestsPending", "pending".equals(status) ? 1 : -1), Users.class);
        String kind = "contact-chat-" + ("pending".equals(status) ? "requested" : status);
        String messageKey = "notification.kind." + kind + ".message";
        notifications.enqueue(new NotificationIntent(
                kind, "contact", id, "users", List.of(target), "MyScoutee", messageKey, "/game",
                "/assets/logo/heart.webp", "/assets/logo/heart.webp", kind + "-" + id,
                Map.of("notification_message_key", messageKey, "senderUserId", actor,
                        "contactUserId", actor, "requestVersion", String.valueOf(next.version())), actor));
        return chatAccessDto(next, peer);
    }

    private String requireChatAccessActor() {
        String actor = resolveUserId(null);
        if (!StringUtils.hasText(actor) || "anonymousUser".equals(actor)) throw chatAccessError(401, "Sign in required.");
        return actor;
    }

    private boolean availableChatPeer(Users owner, Users peer) {
        return owner != null && peer != null && !StringUtils.hasText(peer.getDeletedAtIso())
                && !"deleted".equalsIgnoreCase(peer.getProfileStatus()) && WorkspaceContext.sameWorkspace(owner, peer);
    }

    private ContactChatAccessDto chatAccessDto(
            Permission value, Users peer) {
        var contact = new NavigatorContactDto(peer.getUserId(), peer.getUserId(), contactName(peer.getName()),
                safeText(peer.getInitials()), normalizeGender(peer.getGender()), safeText(peer.getCity()),
                peer.getImages() == null || peer.getImages().isEmpty() ? "" : peer.getImages().get(0),
                "", value.requestedAtIso(), value.decidedAtIso() == null ? value.requestedAtIso() : value.decidedAtIso(), List.of());
        return new ContactChatAccessDto(
                value.id(), value.requestedBy(), value.status(), value.requestedAtIso(), value.decidedAtIso(), value.version(), contact);
    }

    private ResponseStatusException chatAccessError(int status, String message) {
        return new ResponseStatusException(HttpStatus.valueOf(status), message);
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
        if (record == null || record.getWorkspaceGroupId() != null && !WorkspaceContext.allows(record.getWorkspaceGroupId())) {
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
                count(safe.notifications()),
                count(safe.serviceFeedbackPending()));
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
