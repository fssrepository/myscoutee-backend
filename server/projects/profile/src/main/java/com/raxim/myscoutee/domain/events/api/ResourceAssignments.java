package com.raxim.myscoutee.domain.events.api;
public interface ResourceAssignments {
    String scopedAssetManagerUserId(String ownerId, String subEventId, String assetId);
    boolean removeScopedAssetAssignment(
            String ownerId,
            String subEventId,
            String assetId,
            String expectedManagerUserId,
            String actorUserId);
    boolean transferScopedAssetManager(
            String ownerId,
            String subEventId,
            String assetId,
            String expectedManagerUserId,
            String successorUserId);
    void removeAssetFromResourceAssignments(String assetId, String actorUserId);
    void refreshResourceMetricsForScope(
            String ownerId,
            String subEventId,
            String actorUserId);
    void removeCancelledBorrowAssignment(String ownerId, String subEventId, String assetId, String borrowerId, String actorUserId);
}
