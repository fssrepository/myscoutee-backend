package com.raxim.myscoutee.domain.campaigns.repository;

import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;
import com.raxim.myscoutee.domain.campaigns.document.Campaign;

public interface CampaignsRepository extends MongoRepository<Campaign, String> {
    List<Campaign> findByWorkspaceGroupIdAndStatus(String workspaceGroupId, String status);
    List<Campaign> findByWorkspaceGroupIdAndOwnerUserIdAndStatus(String workspaceGroupId, String ownerUserId, String status);
}
