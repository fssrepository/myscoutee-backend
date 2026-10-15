package com.raxim.myscoutee.domain.campaigns.document;

import com.raxim.myscoutee.domain.media.dto.DocumentAttachment;

import java.util.List;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Version;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.mapping.Document;

@Document("campaigns")
@CompoundIndex(name = "campaign_workspace_status_owner", def = "{'workspaceGroupId':1,'status':1,'ownerUserId':1,'updatedAtIso':-1}")
public record Campaign(@Id String id, String workspaceGroupId, String ownerUserId,
        String title, String description, String kind, String category, @org.springframework.data.mongodb.core.index.Indexed(name="campaign_images") List<String> imageUrls, List<DocumentAttachment> attachments,
        String status,
        String createdAtIso, String updatedAtIso, @Version Long version,
        Long counterRevision, com.raxim.myscoutee.domain.accounts.api.MenuCounterUpdates.Change counterChange)
        implements com.raxim.myscoutee.domain.campaigns.api.CampaignView {
    public Campaign(String id, String workspaceGroupId, String ownerUserId, String title, String description,
            String kind, String category, List<String> imageUrls, List<DocumentAttachment> attachments,
            String status, String createdAtIso, String updatedAtIso, Long version) {
        this(id, workspaceGroupId, ownerUserId, title, description, kind, category, imageUrls, attachments,
                status, createdAtIso, updatedAtIso, version, 0L, null);
    }
}
