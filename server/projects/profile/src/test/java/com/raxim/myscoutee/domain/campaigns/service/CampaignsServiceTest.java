package com.raxim.myscoutee.domain.campaigns.service;

import com.raxim.myscoutee.domain.accounts.repository.UsersRepository;
import com.raxim.myscoutee.domain.accounts.api.SelectedProfile;
import com.raxim.myscoutee.domain.affinity.repository.UserRatesRepository;
import com.raxim.myscoutee.domain.campaigns.repository.CampaignsRepository;
import com.raxim.myscoutee.domain.chat.repository.ChatsRepository;
import com.raxim.myscoutee.domain.groups.repository.CommunityGroupsRepository;
import com.raxim.myscoutee.domain.accounts.service.CommunityGroupProfilesService;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;
import java.util.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.web.server.ResponseStatusException;
import com.raxim.myscoutee.domain.campaigns.document.Campaign;
import com.raxim.myscoutee.domain.accounts.document.Users;
import com.raxim.myscoutee.domain.affinity.document.UserRate;
import com.raxim.myscoutee.domain.campaigns.dto.CampaignDtos.*;

@org.junit.jupiter.api.Tag("standard")
class CampaignsServiceTest {
    final CampaignsRepository repository = mock(CampaignsRepository.class);
    final UsersRepository users = mock(UsersRepository.class);
    final UserRatesRepository rates = mock(UserRatesRepository.class);
    final ChatsRepository chats = mock(ChatsRepository.class);
    final Map<String, Campaign> records = new LinkedHashMap<>();
    final com.raxim.myscoutee.domain.accounts.api.MenuCounterUpdates counterOwner = mock(com.raxim.myscoutee.domain.accounts.api.MenuCounterUpdates.class);
    final CampaignCounterWork counterWork = new CampaignCounterWork(repository, counterOwner,
            mock(org.springframework.data.mongodb.core.MongoTemplate.class));
    CampaignsService service;
    Users owner = user("owner", "work");
    Users member = user("member", "work");
    @BeforeEach void setup() {
        service = new CampaignsService(new com.raxim.myscoutee.domain.affinity.service.CampaignRatingEvidenceService(rates),
                new com.raxim.myscoutee.domain.chat.service.CampaignConversationService(chats), repository,
                new com.raxim.myscoutee.domain.accounts.service.ProfileDirectoryService(users, null),
                new com.raxim.myscoutee.domain.groups.service.GroupDirectoryService(mock(CommunityGroupsRepository.class), null),
                mock(CommunityGroupProfilesService.class), mock(SelectedProfile.class), counterWork);
        when(counterOwner.apply(any())).thenAnswer(call -> {
            com.raxim.myscoutee.domain.accounts.api.MenuCounterUpdates.Change change = call.getArgument(0);
            var user = change.userId().equals("owner") ? owner : member;
            var values = new HashMap<>(user.getMenuCounters());
            if (user.getMenuCounterVersions().getOrDefault(change.sourceKey(), 0L) < change.revision()) {
                change.deltas().forEach((key, delta) -> values.merge(key, delta, Integer::sum));
                var versions = new HashMap<>(user.getMenuCounterVersions()); versions.put(change.sourceKey(), change.revision());
                user.setMenuCounterVersions(versions); user.setMenuCounters(values);
            }
            return new com.raxim.myscoutee.domain.accounts.api.MenuCounterUpdates.Snapshot(
                    com.raxim.myscoutee.domain.accounts.dto.DiscoveryProfileDto.from(user), Map.copyOf(user.getMenuCounters()));
        });
        when(repository.findById(anyString())).thenAnswer(call -> Optional.ofNullable(records.get(call.getArgument(0))));
        when(repository.save(any())).thenAnswer(call -> {
            Campaign c = call.getArgument(0);
            Campaign saved = new Campaign(c.id(), c.workspaceGroupId(), c.ownerUserId(), c.title(), c.description(), c.kind(), c.category(),
                    c.imageUrls(), c.attachments(), c.status(), c.createdAtIso(), c.updatedAtIso(), c.version() == null ? 0L : c.version() + 1, c.counterRevision(), c.counterChange());
            records.put(c.id(), saved); return saved;
        });
        when(users.findByUserId("owner")).thenReturn(Optional.of(owner));
        when(users.findByUserId("member")).thenReturn(Optional.of(member));
    }
    @Test void ordinaryMemberCanOrganizeAndParticipateWithoutAppAdminPrivileges() {
        Item first = service.save(owner, draft("owner"));
        Item second = service.save(member, draft("member"));
        assertThat(second.ownerUserId()).isEqualTo("member");
        assertThat(member.getHostTier()).isNull();
        assertThatThrownBy(() -> service.detail(member, first.id())).isInstanceOf(ResponseStatusException.class);
        Item published = service.action(owner, first.id(), new Command("owner", "publish", first.version()));
        assertThat(service.detail(member, published.id()).title()).isEqualTo("A practical idea");
        assertThatThrownBy(() -> service.action(member, first.id(), new Command("member", "trash", published.version())))
                .isInstanceOf(ResponseStatusException.class);
        assertThat(member.getHostTier()).isNull();
    }
    @Test void campaignLifecycleAndVersionsAreIndependentOfEvents() {
        Item first = service.save(owner, draft("owner"));
        Item published = service.action(owner, first.id(), new Command("owner", "publish", first.version()));
        assertThat(first.ownCounters()).containsEntry("draft", 1).containsEntry("published", 0);
        assertThat(published.ownCounters()).containsEntry("draft", 0).containsEntry("published", 1);
        Item trash = service.action(owner, first.id(), new Command("owner", "trash", first.version()));
        assertThatThrownBy(() -> service.detail(member, first.id())).isInstanceOf(ResponseStatusException.class);
        assertThat(trash.ownCounters()).containsEntry("published", 0).containsEntry("trash", 1);
        var restored = service.action(owner, first.id(), new Command("owner", "restore", first.version()));
        assertThat(restored.status()).isEqualTo("draft");
        assertThat(restored.ownCounters()).containsEntry("draft", 1).containsEntry("trash", 0);
    }
    @Test void allLifecycleCommandsKeepCurrentContentButRejectStaleEditorsAndInvalidTransitions() {
        Item original = service.save(owner, draft("owner"));
        var form = draft("owner");
        var edited = service.save(owner, new Save("owner", original.id(), "Updated title", form.description(), form.kind(), form.category(), form.imageUrls(), form.attachments(), original.version()));
        for (String action : List.of("publish", "unpublish", "publish", "trash", "restore")) {
            var changed = service.action(owner, original.id(), new Command("owner", action, original.version()));
            assertThat(changed.title()).isEqualTo(edited.title());
            assertThat(changed.version()).isGreaterThan(edited.version());
            assertThatThrownBy(() -> service.action(owner, original.id(), new Command("owner", action, original.version())))
                    .isInstanceOf(ResponseStatusException.class);
        }
        assertThatThrownBy(() -> service.save(owner, new Save("owner", original.id(), "Stale title", form.description(), form.kind(), form.category(), form.imageUrls(), form.attachments(), original.version())))
                .isInstanceOfSatisfying(ResponseStatusException.class, e -> assertThat(e.getStatusCode().value()).isEqualTo(409));
    }
    @Test void publishedCampaignDoesNotCrossWorkspaceBoundary() {
        Item first = service.save(owner, draft("owner"));
        service.action(owner, first.id(), new Command("owner", "publish", first.version()));
        assertThatThrownBy(() -> service.detail(user("outside", "dating"), first.id()))
                .isInstanceOfSatisfying(ResponseStatusException.class, e -> assertThat(e.getStatusCode().value()).isEqualTo(404));
    }
    @Test void detailAndHistoryExposeTheViewersCampaignRatingInsteadOfThePeersScore() {
        Item draft = service.save(owner, draft("owner"));
        Item published = service.action(owner, draft.id(), new Command("owner", "publish", draft.version()));
        UserRate given = rating("member", "owner", published.id(), 6, "2026-10-06T08:00:00Z");
        UserRate received = rating("owner", "member", published.id(), 9, "2026-10-06T09:00:00Z");
        when(rates.findRelevantInCampaign("member", published.id())).thenReturn(List.of(given, received));
        when(rates.findEvidenceForPair("member", "owner")).thenReturn(List.of(given, received));
        when(repository.findAllById(any())).thenReturn(List.of(records.get(published.id())));
        assertThat(service.detail(member, published.id()).viewerRating()).isEqualTo(6d);
        var history = service.history(member, "owner", 5, null);
        assertThat(history.items()).hasSize(1);
        assertThat(history.items().getFirst().campaign().viewerRating()).isEqualTo(6d);
        assertThat(history.items().getFirst().lastInteractionAtIso()).isEqualTo("2026-10-06T09:00:00Z");
        verify(rates, times(1)).findEvidenceForPair("member", "owner");
        verify(rates, never()).findByOwnerUserId(anyString());
    }
    @Test void actorResolutionKeepsWorkMembershipAndAccountChecks() {
        var profiles = mock(com.raxim.myscoutee.domain.accounts.api.SelectedProfile.class);
        var groups = mock(com.raxim.myscoutee.domain.groups.api.GroupDirectory.class);
        var workspaces = mock(com.raxim.myscoutee.domain.groups.api.WorkspaceMembership.class);
        var isolated = new CampaignsService(mock(com.raxim.myscoutee.domain.affinity.api.CampaignRatings.class),
                mock(com.raxim.myscoutee.domain.chat.api.CampaignConversations.class), repository,
                mock(com.raxim.myscoutee.domain.accounts.api.DiscoveryProfiles.class), groups, workspaces, profiles, counterWork);
        when(profiles.resolveSelectedIdentity("owner")).thenAnswer(call -> new com.raxim.myscoutee.domain.accounts.dto.ProfileIdentityDto(
                owner.getUserId(), owner.getAccountUserId(), owner.getWorkspaceGroupId()));
        when(groups.type("work")).thenReturn(Optional.of(new com.raxim.myscoutee.domain.groups.api.GroupDirectory.GroupType("work", "community")));
        assertThatThrownBy(() -> isolated.actor("owner")).isInstanceOfSatisfying(ResponseStatusException.class,
                error -> assertThat(error.getStatusCode().value()).isEqualTo(403));
        verifyNoInteractions(workspaces);
        when(groups.type("work")).thenReturn(Optional.of(new com.raxim.myscoutee.domain.groups.api.GroupDirectory.GroupType("work", "work")));
        owner.setAccountUserId("account");
        when(workspaces.select("account", "work")).thenReturn(owner);
        assertThat(isolated.actor("owner")).isSameAs(owner);
        owner.setAccountUserId(null);
        assertThatThrownBy(() -> isolated.actor("owner")).isInstanceOfSatisfying(ResponseStatusException.class,
                error -> assertThat(error.getStatusCode().value()).isEqualTo(403));
        verify(workspaces, times(1)).select("account", "work");
    }

    private static UserRate rating(String actor, String target, String campaignId, int score, String date) {
        UserRate rate = new UserRate(); rate.setOwnerUserId(actor); rate.setRelatedUserId(target);
        rate.setMode("single"); rate.setCampaignId(campaignId); rate.setScoreGiven(score); rate.setUpdatedDate(date);
        return rate;
    }
    private static Save draft(String userId) {
        return new Save(userId, null, "A practical idea", "Build a team", "business", "technology", List.of(), List.of(), null);
    }
    private static Users user(String id, String groupId) {
        Users user = new Users(); user.setUserId(id); user.setWorkspaceGroupId(groupId); user.setName(id); return user;
    }
}
