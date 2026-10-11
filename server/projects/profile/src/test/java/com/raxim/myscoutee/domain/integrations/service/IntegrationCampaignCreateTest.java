package com.raxim.myscoutee.domain.integrations.service;

import com.raxim.myscoutee.domain.accounts.document.Users;
import com.raxim.myscoutee.domain.assets.service.AssetsService;
import com.raxim.myscoutee.domain.campaigns.document.Campaign;
import com.raxim.myscoutee.domain.campaigns.service.CampaignsService;
import com.raxim.myscoutee.domain.events.service.ActivitiesEventsService;
import com.raxim.myscoutee.domain.integrations.document.IntegrationExternalId;
import com.raxim.myscoutee.domain.media.service.MediaStorageService;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.FindAndModifyOptions;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import com.raxim.myscoutee.domain.campaigns.dto.CampaignDtos;
import com.raxim.myscoutee.domain.integrations.dto.IntegrationDtos.*;
import com.raxim.myscoutee.domain.integrations.repository.IntegrationExternalIdsRepository;

@org.junit.jupiter.api.Tag("standard")
class IntegrationCampaignCreateTest {
    private final IntegrationExternalIdsRepository mappings = mock(IntegrationExternalIdsRepository.class);
    private final MongoTemplate mongo = mock(MongoTemplate.class);
    private final CampaignsService campaigns = mock(CampaignsService.class);
    private final IntegrationSyncService service = campaignAware(new IntegrationSyncService(mappings, mongo,
            mock(AssetsService.class), mock(ActivitiesEventsService.class), mock(MediaStorageService.class), mock(com.raxim.myscoutee.domain.media.api.MediaCleanup.class), campaigns), mongo);
    private final String externalId = UUID.randomUUID().toString();
    private final IntegrationCampaignSyncItemDto item = new IntegrationCampaignSyncItemDto(externalId,
            "Build a useful tool", "Looking for collaborators", "business", "technology");
    private Users actor() {
        var actor = new Users(); actor.setUserId("work-profile"); actor.setWorkspaceGroupId("myscoutee-work");
        when(campaigns.actor("work-profile")).thenReturn(actor); return actor;
    }
    @Test void createsThroughCampaignDomainAndReturnsStableIdOnRetry() {
        var actor = actor(); var mapping = new IntegrationExternalId(); mapping.setExternalId(externalId); mapping.setInternalId("campaign-id");
        when(mongo.findAndModify(any(Query.class), any(Update.class), any(FindAndModifyOptions.class), eq(IntegrationExternalId.class))).thenReturn(mapping);
        when(campaigns.createImported(eq(actor), any(), eq("campaign-id"))).thenAnswer(invocation -> {
            var save = invocation.getArgument(1, CampaignDtos.Save.class);
            assertThat(save.userId()).isEqualTo("work-profile");
            assertThat(save.imageUrls()).isEmpty();
            return new CampaignDtos.Item("campaign-id", "myscoutee-work", "work-profile", "Owner", null, null, null,
                    save.title(), save.description(), save.kind(), save.category(), save.imageUrls(), save.attachments(), "draft", "now", "now", 0L, 0d, null);
        });
        var request = new IntegrationCampaignSyncRequestDto(List.of(item));
        assertThat(service.createCampaigns("work-profile", request).items().getFirst().result()).isEqualTo("created");
        when(mappings.findByOwnerUserIdAndResourceTypeAndExternalIdIn(eq("work-profile"), eq("campaign"), any())).thenReturn(List.of(mapping));
        when(mongo.exists(any(Query.class), eq(Campaign.class))).thenReturn(true);
        var retry = service.createCampaigns("work-profile", request).items().getFirst();
        assertThat(retry.result()).isEqualTo("existing"); assertThat(retry.externalId()).isEqualTo("campaign-id");
        verify(campaigns, times(1)).createImported(eq(actor), any(), anyString());
    }
    @Test void rejectsNonWorkOrUnacceptedProfileBeforeAllocation() {
        when(campaigns.actor("dating-profile")).thenThrow(new ResponseStatusException(HttpStatus.FORBIDDEN));
        assertThatThrownBy(() -> service.createCampaigns("dating-profile", new IntegrationCampaignSyncRequestDto(List.of(item))))
                .isInstanceOf(ResponseStatusException.class);
        verifyNoInteractions(mongo, mappings);
    }
    @Test void rejectsInvalidIdAndDoesNotAllocateIt() {
        actor();
        var invalid = new IntegrationCampaignSyncItemDto("bad", item.title(), item.description(), item.kind(), item.category());
        assertThat(service.createCampaigns("work-profile", new IntegrationCampaignSyncRequestDto(List.of(invalid))).items().getFirst().error())
                .isEqualTo("id_must_be_uuid");
        verifyNoInteractions(mongo, mappings);
    }

    private static IntegrationSyncService campaignAware(IntegrationSyncService service, org.springframework.data.mongodb.core.MongoTemplate mongo) {
        org.springframework.test.util.ReflectionTestUtils.setField(service, "campaignCatalog",
                new com.raxim.myscoutee.domain.campaigns.service.CampaignCatalogService(mongo, org.mockito.Mockito.mock(com.raxim.myscoutee.domain.affinity.api.RatingDirectory.class)));
        return service;
    }
}
