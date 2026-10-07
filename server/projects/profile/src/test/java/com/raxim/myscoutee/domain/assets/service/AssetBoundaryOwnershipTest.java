package com.raxim.myscoutee.domain.assets.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;
import static org.mockito.ArgumentMatchers.*;
import org.bson.Document;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.mapping.event.AfterSaveEvent;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import com.mongodb.client.result.UpdateResult;
import com.raxim.myscoutee.domain.assets.document.Asset;
import com.raxim.myscoutee.domain.events.document.ActivityMember;
import com.raxim.myscoutee.domain.events.repository.ActivityMembersRepository;
import com.raxim.myscoutee.domain.events.service.AssetMembershipService;
import com.raxim.myscoutee.domain.integrations.api.AssetChanges;

@Tag("standard")
class AssetBoundaryOwnershipTest {
    @Test void promotionRejectsStaleMembershipWithoutChangingTheSnapshot() {
        var repository = mock(ActivityMembersRepository.class);
        var mongo = mock(MongoTemplate.class);
        var service = new AssetMembershipService(repository, mongo);
        var member = new ActivityMember();
        member.setId("member"); member.setSyncKey("sync"); member.setRole("Member");
        member.setStatus("pending"); member.setUpdatedDate("revision");
        member.setCreatedDate("created"); member.setCreatedUser("creator");
        when(mongo.updateFirst(any(Query.class), any(Update.class), eq(ActivityMember.class)))
                .thenReturn(UpdateResult.acknowledged(0, 0L, null), UpdateResult.acknowledged(1, 1L, null));
        assertThat(service.promote(member, "asset", "target", "actor", "now")).isNull();
        assertThat(member.getRole()).isEqualTo("Member");
        var promoted = service.promote(member, "asset", "target", "actor", "now");
        assertThat(promoted.getRole()).isEqualTo("Manager");
        assertThat(promoted.getCreatedDate()).isEqualTo("created");
        assertThat(promoted.getCreatedUser()).isEqualTo("creator");
        assertThat(promoted.getSyncKey()).isEqualTo("sync");
        var query = ArgumentCaptor.forClass(Query.class); var update = ArgumentCaptor.forClass(Update.class);
        verify(mongo, times(2)).updateFirst(query.capture(), update.capture(), eq(ActivityMember.class));
        assertThat(query.getValue().getQueryObject()).isEqualTo(new Document("_id", "member")
                .append("updatedDate", "revision").append("role", "Member").append("status", "pending"));
        assertThat(update.getValue().getUpdateObject().get("$unset", Document.class).keySet())
                .containsExactlyInAnyOrder("pendingSource", "requestKind", "invitedByUserId");
        verifyNoInteractions(repository);
    }

    @Test void racingCreationKeepsTheDuplicateConflictResult() {
        var repository = mock(ActivityMembersRepository.class); var mongo = mock(MongoTemplate.class);
        when(repository.save(any(ActivityMember.class))).thenThrow(new DuplicateKeyException("racing creation"));
        assertThat(new AssetMembershipService(repository, mongo).promote(null, "asset", "target", "actor", "now")).isNull();
        verifyNoInteractions(mongo);
    }

    @Test void assetSaveHasExactlyOneIntegrationProducer() {
        var changes = mock(AssetChanges.class); var asset = new Asset(); asset.setAssetId("asset");
        new AssetIntegrationChangeListener(changes).onAfterSave(new AfterSaveEvent<>(asset, new Document(), "assets"));
        verify(changes).enqueue(asset); verifyNoMoreInteractions(changes);
        var webhook = mock(com.raxim.myscoutee.domain.integrations.service.IntegrationWebhookService.class);
        new com.raxim.myscoutee.domain.events.service.EventIntegrationChangeListener(webhook)
                .onAfterSave(new AfterSaveEvent<>(asset, new Document(), "assets"));
        verifyNoInteractions(webhook);
    }
}
