package com.raxim.myscoutee.domain.assets.api;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import com.raxim.myscoutee.domain.events.api.MemberDirectory.Member;
import com.raxim.myscoutee.domain.assets.dto.AssetsDtos.AssetDetailDto;
import com.raxim.myscoutee.domain.assets.dto.AssetsDtos.AssetDto;
import com.raxim.myscoutee.domain.assets.dto.AssetsDtos.AssetExplorePageDto;
import com.raxim.myscoutee.domain.assets.dto.AssetsDtos.AssetUpsertRequestDto;
import com.raxim.myscoutee.common.dto.SharedDtos.ActivityMemberEntryDto;
public interface Assets {
    boolean canManageScopedAssetMembers(
            String assetId,
            String eventId,
            String subEventId,
            String userId);
    Optional<? extends AssetOwnership.Asset> findAssetByAssetId(String assetId);
    Optional<? extends AssetOwnership.Asset> findAssetByAssetIdWithScopedRequests(
            String assetId,
            String eventId,
            String subEventId,
            String requestStatus);
    Optional<? extends AssetOwnership.Asset> findAssetByAssetIdWithScopedRequests(
            String assetId,
            String eventId,
            String subEventId,
            String requestStatus,
            String assetRequestId);
    AssetDetailDto queryAssetDetail(String userId, String assetId);
    AssetDetailDto queryAssetDetail(String userId, String assetId, String eventId, String subEventId);
    Map<String, AssetDetailDto> queryAssignableAssetDetails(
            String userId,
            String eventId,
            String subEventId,
            Collection<String> assetIds);
    Map<String, AssetDetailDto> queryReferencedAssetDetails(
            String viewerUserId,
            Collection<String> assetIds);
    AssetExplorePageDto queryVisibleAssetsPage(
            String userId,
            String type,
            String category,
            String startAtIso,
            String endAtIso,
            Integer page,
            Integer pageSize,
            String cursor,
            String order);
    void statusDeleteAssignmentScopeRequests(
            String assetOwnerUserId,
            Collection<String> assetIds,
            String ownerId,
            String authorizationEventId,
            String subEventId,
            String actorUserId,
            String deletedAtIso);
    Set<String> statusDeleteEventAssignmentRequestsForUsers(
            Collection<String> assetIds,
            Collection<String> userIds,
            String eventId,
            String actorUserId,
            String deletedAtIso);
    void syncRequestsFromMembers(String assetId, List<? extends Member> members);
    String syncScopedRequestsFromMemberEntries(
            String assetId,
            String eventId,
            String subEventId,
            List<ActivityMemberEntryDto> members,
            String actorUserId);
    AssetDto upsert(AssetUpsertRequestDto request);
}
