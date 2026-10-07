package com.raxim.myscoutee.domain.accounts.service;

import static com.raxim.myscoutee.domain.accounts.dto.NavigatorContactsDtos.NavigatorContactDeleteRequestDto;
import static com.raxim.myscoutee.domain.accounts.dto.NavigatorContactsDtos.NavigatorContactDto;
import static com.raxim.myscoutee.domain.accounts.dto.NavigatorContactsDtos.NavigatorContactMethodDto;
import static com.raxim.myscoutee.domain.accounts.dto.NavigatorContactsDtos.NavigatorContactsSaveRequestDto;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.raxim.myscoutee.domain.accounts.document.NavigatorContactsProfile;
import com.raxim.myscoutee.domain.accounts.document.Users;
import com.raxim.myscoutee.domain.accounts.repository.NavigatorContactsProfilesRepository;
import com.raxim.myscoutee.domain.accounts.repository.UsersRepository;
import com.raxim.myscoutee.domain.access.security.AccessControlService;
import com.raxim.myscoutee.domain.accounts.service.FriendshipFacts;
import com.raxim.myscoutee.domain.accounts.dto.ExperienceDtos.ExperienceEntryDto;

@ExtendWith(MockitoExtension.class)
@org.junit.jupiter.api.Tag("standard")
class NavigatorContactsServiceTest {
    @Mock
    private NavigatorContactsProfilesRepository navigatorContactsProfilesRepository;
    @Mock
    private HomeUserProfileService homeUserProfileService;
    @Mock
    private UserExperienceProfilesService userExperienceProfilesService;
    @Mock
    private UsersRepository usersRepository;
    @Mock
    private AccessControlService accessControlService;
    @Mock
    private FriendshipFacts friendshipFacts;

    @Mock private com.raxim.myscoutee.domain.chat.repository.ContactChatAccessRepository chatAccess;
    @Mock private com.raxim.myscoutee.domain.notifications.service.NotificationOutboxService notifications;
    @Mock private org.springframework.data.mongodb.core.MongoTemplate mongo;
    private NavigatorContactsService service;

    @BeforeEach
    void setUp() {
        service = new NavigatorContactsService(
                navigatorContactsProfilesRepository,
                homeUserProfileService,
                userExperienceProfilesService,
                usersRepository, accessControlService, friendshipFacts, new com.raxim.myscoutee.domain.chat.service.ContactPermissionService(chatAccess), notifications, mongo);
    }

    @Test
    void requestWritesPendingCounterAndNotifiesOnlyRecipientWithoutCopyingPrivateMethods() {
        prepareChatActors("a", "b");
        var profile = contactProfile("a", "b");
        when(navigatorContactsProfilesRepository.findByUserId("a")).thenReturn(Optional.of(profile));
        when(chatAccess.save(any())).thenAnswer(call -> call.getArgument(0));
        var result = service.changeChatAccess("b", new com.raxim.myscoutee.domain.accounts.dto.NavigatorContactsDtos.ContactChatAccessCommand("request", null));
        assertThat(result.status()).isEqualTo("pending");
        assertThat(result.requestedBy()).isEqualTo("a");
        assertThat(result.contact().methods()).isEmpty();
        var query = ArgumentCaptor.forClass(org.springframework.data.mongodb.core.query.Query.class);
        var update = ArgumentCaptor.forClass(org.springframework.data.mongodb.core.query.Update.class);
        verify(mongo).updateFirst(query.capture(), update.capture(), org.mockito.ArgumentMatchers.eq(Users.class));
        assertThat(query.getValue().getQueryObject().getString("userId")).isEqualTo("b");
        assertThat(update.getValue().getUpdateObject().get("$inc", org.bson.Document.class).getInteger("contactRequestsPending")).isEqualTo(1);
        var intent = ArgumentCaptor.forClass(com.raxim.myscoutee.domain.notifications.api.NotificationDelivery.NotificationIntent.class);
        verify(notifications).enqueue(intent.capture());
        assertThat(intent.getValue().recipientUserIds()).containsExactly("b");
        assertThat(intent.getValue().createdUser()).isEqualTo("a");
    }

    @Test
    void repeatedPendingRequestDoesNotIncrementOrNotifyAgain() {
        prepareChatActors("a", "b");
        when(navigatorContactsProfilesRepository.findByUserId("a")).thenReturn(Optional.of(contactProfile("a", "b")));
        when(chatAccess.findById("1:ab")).thenReturn(Optional.of(pendingRequest()));
        service.changeChatAccess("b", new com.raxim.myscoutee.domain.accounts.dto.NavigatorContactsDtos.ContactChatAccessCommand("request", null));
        verify(chatAccess, never()).save(any());
        verify(notifications, never()).enqueue(any());
        org.mockito.Mockito.verifyNoInteractions(mongo);
    }

    @Test
    void onlyRecipientCanDecideAndStaleVersionCannotChangePendingRequest() {
        prepareChatActors("a", "b");
        when(chatAccess.findById("1:ab")).thenReturn(Optional.of(pendingRequest()));
        org.assertj.core.api.Assertions.assertThatThrownBy(() -> service.changeChatAccess("b",
                new com.raxim.myscoutee.domain.accounts.dto.NavigatorContactsDtos.ContactChatAccessCommand("approve", 0L)))
                .isInstanceOf(org.springframework.web.server.ResponseStatusException.class).hasMessageContaining("403");
        when(homeUserProfileService.resolveSelectedUserId(null)).thenReturn("b");
        org.assertj.core.api.Assertions.assertThatThrownBy(() -> service.changeChatAccess("a",
                new com.raxim.myscoutee.domain.accounts.dto.NavigatorContactsDtos.ContactChatAccessCommand("approve", 9L)))
                .isInstanceOf(org.springframework.web.server.ResponseStatusException.class).hasMessageContaining("409");
        verify(chatAccess, never()).save(any());
        verify(notifications, never()).enqueue(any());
    }

    @Test
    void approvalSavesPublicContactAndRemovesPendingBadgeForRecipient() {
        prepareChatActors("b", "a");
        when(chatAccess.findById("1:ab")).thenReturn(Optional.of(pendingRequest()));
        when(chatAccess.save(any())).thenAnswer(call -> call.getArgument(0));
        when(navigatorContactsProfilesRepository.save(any())).thenAnswer(call -> call.getArgument(0));
        var approved = service.changeChatAccess("a",
                new com.raxim.myscoutee.domain.accounts.dto.NavigatorContactsDtos.ContactChatAccessCommand("approve", 0L));
        assertThat(approved.status()).isEqualTo("approved");
        var profile = ArgumentCaptor.forClass(NavigatorContactsProfile.class);
        verify(navigatorContactsProfilesRepository).save(profile.capture());
        assertThat(profile.getValue().getUserId()).isEqualTo("b");
        assertThat(profile.getValue().getContacts()).extracting(NavigatorContactsProfile.NavigatorContactRecord::getUserId).containsExactly("a");
        assertThat(profile.getValue().getContacts().get(0).getMethods()).isEmpty();
        var update = ArgumentCaptor.forClass(org.springframework.data.mongodb.core.query.Update.class);
        verify(mongo).updateFirst(any(), update.capture(), org.mockito.ArgumentMatchers.eq(Users.class));
        assertThat(update.getValue().getUpdateObject().get("$inc", org.bson.Document.class).getInteger("contactRequestsPending")).isEqualTo(-1);
        var intent = ArgumentCaptor.forClass(com.raxim.myscoutee.domain.notifications.api.NotificationDelivery.NotificationIntent.class);
        verify(notifications).enqueue(intent.capture());
        assertThat(intent.getValue().recipientUserIds()).containsExactly("a");
    }

    @Test
    void foreignWorkspaceCannotRequestOrReceiveChatAccess() {
        prepareChatActors("a", "b");
        Users foreign = new Users(); foreign.setUserId("b"); foreign.setWorkspaceGroupId("foreign");
        when(usersRepository.findByUserId("b")).thenReturn(Optional.of(foreign));
        org.assertj.core.api.Assertions.assertThatThrownBy(() -> service.changeChatAccess("b",
                new com.raxim.myscoutee.domain.accounts.dto.NavigatorContactsDtos.ContactChatAccessCommand("request", null)))
                .isInstanceOf(org.springframework.web.server.ResponseStatusException.class).hasMessageContaining("404");
        verify(chatAccess, never()).save(any());
        verify(notifications, never()).enqueue(any());
    }

    private void prepareChatActors(String actor, String peer) {
        when(homeUserProfileService.resolveSelectedUserId(null)).thenReturn(actor);
        for (String id : List.of(actor, peer)) {
            Users user = new Users(); user.setUserId(id); user.setName(id);
            when(usersRepository.findByUserId(id)).thenReturn(Optional.of(user));
        }
    }

    private com.raxim.myscoutee.domain.chat.document.ContactChatAccess pendingRequest() {
        return new com.raxim.myscoutee.domain.chat.document.ContactChatAccess("1:ab", "a", "b", "a", "pending", "2026-09-26T10:00:00Z", null, 0L);
    }

    private NavigatorContactsProfile contactProfile(String owner, String peer) {
        var profile = new NavigatorContactsProfile(); profile.setUserId(owner);
        var contact = new NavigatorContactsProfile.NavigatorContactRecord(); contact.setUserId(peer); contact.setId(peer);
        profile.setContacts(List.of(contact)); return profile;
    }

    @Test
    void profileViewDoesNotExposePrivateExperiencesOrLegacyHostFieldsToFriends() {
        Users target = visibilityProfile();
        when(usersRepository.findByUserId("target")).thenReturn(Optional.of(target));
        when(accessControlService.resolveActorUserId(any())).thenReturn("friend");
        when(friendshipFacts.areFriends("target", "friend")).thenReturn(true);
        when(userExperienceProfilesService.queryEntriesByUserId("target")).thenReturn(visibilityExperiences());

        var result = service.loadContactProfile("target");

        assertThat(result.hiddenFields()).containsExactly("profile.experience.workplace", "profile.details.loveStyle");
        assertThat(result.experiences()).extracting(ExperienceEntryDto::type).containsExactly("School");
        assertThat(target.getProfileDetails().get(0).rows()).extracting(Users.ProfileDetailRowRecord::labelKey)
                .containsExactly("profile.gender", "profile.profession", "profile.experience.school");
        verify(usersRepository, never()).save(any());
    }

    @Test
    void unrelatedViewerDoesNotReceiveFriendsOnlyFieldValues() {
        Users target = visibilityProfile();
        when(usersRepository.findByUserId("target")).thenReturn(Optional.of(target));
        when(accessControlService.resolveActorUserId(any())).thenReturn("other");
        when(userExperienceProfilesService.queryEntriesByUserId("target")).thenReturn(visibilityExperiences());

        var result = service.loadContactProfile("target");

        assertThat(result.hiddenFields()).contains("profile.experience.school", "profile.profession");
        assertThat(result.experiences()).isEmpty();
        assertThat(target.getProfileDetails().get(0).rows()).extracting(Users.ProfileDetailRowRecord::labelKey)
                .containsExactly("profile.gender");
    }

    @Test
    void ownerRetainsAllProfileFieldsAndExperiences() {
        Users target = visibilityProfile();
        when(usersRepository.findByUserId("target")).thenReturn(Optional.of(target));
        when(accessControlService.resolveActorUserId(any())).thenReturn("target");
        when(userExperienceProfilesService.queryEntriesByUserId("target")).thenReturn(visibilityExperiences());

        var result = service.loadContactProfile("target");

        assertThat(result.hiddenFields()).isEmpty();
        assertThat(result.experiences()).hasSize(2);
        assertThat(target.getProfileDetails().get(0).rows()).hasSize(5);
        verify(friendshipFacts, never()).areFriends(any(), any());
        verify(usersRepository, never()).save(any());
    }

    private Users visibilityProfile() {
        Users target = new Users();
        target.setUserId("target");
        target.setProfileDetails(List.of(new Users.ProfileDetailGroupRecord("Basics", List.of(
                new Users.ProfileDetailRowRecord("profile.gender", "Woman", "Private", List.of()),
                new Users.ProfileDetailRowRecord("profile.profession", "Engineer", "Friends", List.of()),
                new Users.ProfileDetailRowRecord("profile.experience.workplace", "", "Private", List.of()),
                new Users.ProfileDetailRowRecord("profile.experience.school", "", "Friends", List.of()),
                new Users.ProfileDetailRowRecord("profile.details.loveStyle", "Hidden legacy value", "Hosts", List.of())))));
        return target;
    }

    private List<ExperienceEntryDto> visibilityExperiences() {
        return List.of(
                new ExperienceEntryDto("work", "Workspace", "Engineer", "Private workplace", "", "2024-01-01", "Present", ""),
                new ExperienceEntryDto("school", "School", "Student", "Friends school", "", "2020-01-01", "2024-01-01", ""));
    }

    @Test
    void saveContactsReplacesOwnerContactsAndUpdatesUserCounter() {
        when(homeUserProfileService.resolveSelectedUserId("owner")).thenReturn("owner");
        when(navigatorContactsProfilesRepository.findByUserId("owner")).thenReturn(Optional.empty());
        when(navigatorContactsProfilesRepository.save(any(NavigatorContactsProfile.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));
        Users user = new Users();
        user.setUserId("owner");
        user.setActivities(new Users.UserActivitiesRecord(
                2,
                4,
                6,
                8,
                10,
                1,
                1,
                1,
                1,
                0,
                3,
                new Users.UserChatCountersRecord(4, 1, 1, 1, 1, 0),
                new Users.UserEventCountersRecord(8, 4, 1, 1, 2, 0, 0),
                new Users.UserAssetCountersRecord(1, 1, 1, 1),
                new Users.UserEventFeedbackCountersRecord(1, 2, 3, 4),
                5,
                7));
        when(usersRepository.findByUserId("owner")).thenReturn(Optional.of(user));

        List<NavigatorContactDto> response = service.saveContacts(new NavigatorContactsSaveRequestDto(
                "owner",
                List.of(new NavigatorContactDto(
                        "contact-1",
                        "member-1",
                        "  Iris Bloom  ",
                        "IB",
                        "woman",
                        "Miami",
                        "https://example.test/iris.jpg",
                        "Adventurer",
                        "2026-04-01T00:00:00Z",
                        "2026-04-02T00:00:00Z",
                        List.of(
                                new NavigatorContactMethodDto("email-1", "email", " iris@example.test "),
                                new NavigatorContactMethodDto("bad-1", "unknown", "+1 555 0101"),
                                new NavigatorContactMethodDto("blank-1", "phone", "   "))))));

        assertThat(response).hasSize(1);
        NavigatorContactDto savedContact = response.get(0);
        assertThat(savedContact.id()).isEqualTo("contact-1");
        assertThat(savedContact.userId()).isEqualTo("member-1");
        assertThat(savedContact.name()).isEqualTo("Iris Bloom");
        assertThat(savedContact.gender()).isEqualTo("woman");
        assertThat(savedContact.methods()).extracting(NavigatorContactMethodDto::type)
                .containsExactly("email", "phone");
        assertThat(savedContact.methods()).extracting(NavigatorContactMethodDto::value)
                .containsExactly("iris@example.test", "+1 555 0101");

        ArgumentCaptor<NavigatorContactsProfile> contactsCaptor = ArgumentCaptor.forClass(NavigatorContactsProfile.class);
        verify(navigatorContactsProfilesRepository).save(contactsCaptor.capture());
        assertThat(contactsCaptor.getValue().getUserId()).isEqualTo("owner");
        assertThat(contactsCaptor.getValue().getContacts()).hasSize(1);

        ArgumentCaptor<Users> userCaptor = ArgumentCaptor.forClass(Users.class);
        verify(usersRepository).save(userCaptor.capture());
        assertThat(userCaptor.getValue().getActivities().contacts()).isEqualTo(1);
        assertThat(userCaptor.getValue().getActivities().events()).isEqualTo(8);
        assertThat(userCaptor.getValue().getActivities().feedback()).isEqualTo(3);
    }

    @Test
    void deleteContactRemovesOneStoredContactAndUpdatesUserCounter() {
        when(homeUserProfileService.resolveSelectedUserId("owner")).thenReturn("owner");
        NavigatorContactsProfile profile = new NavigatorContactsProfile();
        profile.setUserId("owner");
        profile.setContacts(List.of(
                contactRecord("contact-1", "member-1", "Iris Bloom"),
                contactRecord("contact-2", "member-2", "Noah Lane")));
        when(navigatorContactsProfilesRepository.findByUserId("owner")).thenReturn(Optional.of(profile));
        when(navigatorContactsProfilesRepository.save(any(NavigatorContactsProfile.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));
        Users user = new Users();
        user.setUserId("owner");
        user.setActivities(null);
        when(usersRepository.findByUserId("owner")).thenReturn(Optional.of(user));

        List<NavigatorContactDto> response = service.deleteContact(
                "contact-1",
                new NavigatorContactDeleteRequestDto("owner"));

        assertThat(response).extracting(NavigatorContactDto::id).containsExactly("contact-2");
        ArgumentCaptor<Users> userCaptor = ArgumentCaptor.forClass(Users.class);
        verify(usersRepository).save(userCaptor.capture());
        assertThat(userCaptor.getValue().getActivities().contacts()).isEqualTo(1);
        assertThat(userCaptor.getValue().getActivities().event().all()).isZero();
        assertThat(userCaptor.getValue().getActivities().asset().tickets()).isZero();
    }

    @Test
    void loadContactsReturnsStoredContactsForResolvedUser() {
        when(homeUserProfileService.resolveSelectedUserId("requested")).thenReturn("owner");
        NavigatorContactsProfile profile = new NavigatorContactsProfile();
        profile.setUserId("owner");
        profile.setContacts(List.of(contactRecord("contact-1", "member-1", "Iris Bloom")));
        when(navigatorContactsProfilesRepository.findByUserId("owner")).thenReturn(Optional.of(profile));

        List<NavigatorContactDto> response = service.loadContacts("requested");

        assertThat(response).hasSize(1);
        assertThat(response.get(0).id()).isEqualTo("contact-1");
        assertThat(response.get(0).userId()).isEqualTo("member-1");
        assertThat(response.get(0).methods()).extracting(NavigatorContactMethodDto::type)
                .containsExactly("email");
    }

    private NavigatorContactsProfile.NavigatorContactRecord contactRecord(String id, String userId, String name) {
        NavigatorContactsProfile.NavigatorContactRecord record = new NavigatorContactsProfile.NavigatorContactRecord();
        record.setId(id);
        record.setUserId(userId);
        record.setName(name);
        record.setInitials("IB");
        record.setGender("woman");
        record.setCity("Miami");
        record.setAvatarUrl("https://example.test/avatar.jpg");
        record.setHeadline("Adventurer");
        record.setCreatedAtIso("2026-04-01T00:00:00Z");
        record.setUpdatedAtIso("2026-04-02T00:00:00Z");
        NavigatorContactsProfile.NavigatorContactMethodRecord method = new NavigatorContactsProfile.NavigatorContactMethodRecord();
        method.setId("email");
        method.setType("email");
        method.setValue("iris@example.test");
        record.setMethods(List.of(method));
        return record;
    }
}
