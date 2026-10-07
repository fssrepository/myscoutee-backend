package com.raxim.myscoutee.domain.assets.document;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import com.raxim.myscoutee.common.dto.SharedDtos.PricingConfigDto;

@Document(collection = "assets")
@CompoundIndexes({
        @CompoundIndex(name = "asset_owner_asset_id", def = "{'ownerUserId': 1, 'assetId': 1}", unique = true),
        @CompoundIndex(name = "asset_owner_updated", def = "{'ownerUserId': 1, 'updatedDate': -1}")
})
public class Asset implements com.raxim.myscoutee.domain.assets.api.AssetOwnership.Asset {
    @org.springframework.data.mongodb.core.index.Indexed
    private String workspaceGroupId;
    public String getWorkspaceGroupId() { return workspaceGroupId; }
    public void setWorkspaceGroupId(String value) { workspaceGroupId = value; }
    private static final String STATUS_ACTIVE = "A";
    private static final String STATUS_UNDER_REVIEW = "UR";
    private static final String STATUS_BLOCKED = "B";
    private static final String STATUS_DELETED = "D";
    private static final String STATUS_INACTIVE = "I";
    private static final String STATUS_TRASHED = "T";

    @Id
    private String id;

    @Indexed(name = "asset_sync_key", unique = true, sparse = true)
    private String syncKey;

    @Indexed(name = "asset_logical_id")
    private String assetId;

    private String ownerUserId;
    private String type;
    private String title;
    private String subtitle;
    private String category;
    private String city;
    private Integer capacityTotal;
    private Integer quantity;
    private String details;
    private String imageUrl;
    private String sourceLink;
    private List<String> routes = new ArrayList<>();
    private Boolean policiesEnabled = Boolean.FALSE;
    private List<AssetPolicyRecord> policies = new ArrayList<>();
    private PricingConfigDto pricing;
    private List<AssetRequestRecord> requests = new ArrayList<>();
    private String visibility;
    private String status;
    private String moderationStatus;
    private String moderationPreviousStatus;
    private Long moderationVersion;
    public String getModerationStatus() { return moderationStatus; }
    public void setModerationStatus(String value) { moderationStatus = value; }
    public String getModerationPreviousStatus() { return moderationPreviousStatus; }
    public void setModerationPreviousStatus(String value) { moderationPreviousStatus = value; }
    public Long getModerationVersion() { return moderationVersion; }
    public void setModerationVersion(Long value) { moderationVersion = value; }
    private String statusBeforeSuppression;
    private String ownerReleasedAtIso;
    private String trashedAtIso;
    private Double affinity;
    private Double boost;
    private String createdDate;
    private String createdUser;
    private String updatedDate;
    private String updatedUser;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getSyncKey() {
        return syncKey;
    }

    public void setSyncKey(String syncKey) {
        this.syncKey = syncKey;
    }

    public String getAssetId() {
        return assetId;
    }

    public void setAssetId(String assetId) {
        this.assetId = assetId;
    }

    public String getOwnerUserId() {
        return ownerUserId;
    }

    public void setOwnerUserId(String ownerUserId) {
        this.ownerUserId = ownerUserId;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getSubtitle() {
        return subtitle;
    }

    public void setSubtitle(String subtitle) {
        this.subtitle = subtitle;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public Integer getCapacityTotal() {
        return capacityTotal;
    }

    public void setCapacityTotal(Integer capacityTotal) {
        this.capacityTotal = capacityTotal;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public String getDetails() {
        return details;
    }

    public void setDetails(String details) {
        this.details = details;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getSourceLink() {
        return sourceLink;
    }

    public void setSourceLink(String sourceLink) {
        this.sourceLink = sourceLink;
    }

    public List<String> getRoutes() {
        return routes;
    }

    public void setRoutes(List<String> routes) {
        this.routes = routes;
    }

    public PricingConfigDto getPricing() {
        return pricing;
    }

    public void setPricing(PricingConfigDto pricing) {
        this.pricing = pricing;
    }

    public List<AssetPolicyRecord> getPolicies() {
        return policies;
    }

    public Boolean getPoliciesEnabled() {
        return policiesEnabled;
    }

    public void setPoliciesEnabled(Boolean policiesEnabled) {
        this.policiesEnabled = policiesEnabled;
    }

    public void setPolicies(List<AssetPolicyRecord> policies) {
        this.policies = policies;
    }

    public List<AssetRequestRecord> getRequests() {
        return requests;
    }

    public void setRequests(List<AssetRequestRecord> requests) {
        this.requests = requests;
    }

    public String getVisibility() {
        return visibility;
    }

    public void setVisibility(String visibility) {
        this.visibility = visibility;
    }

    public String getStatus() {
        return normalizeStatus(status);
    }

    public void setStatus(String status) {
        this.status = normalizeStatus(status);
    }

    public String getStatusBeforeSuppression() {
        return statusBeforeSuppression;
    }

    public void setStatusBeforeSuppression(String statusBeforeSuppression) {
        this.statusBeforeSuppression = hasText(statusBeforeSuppression) ? normalizeStatus(statusBeforeSuppression) : null;
    }

    public String getOwnerReleasedAtIso() {
        return ownerReleasedAtIso;
    }

    public void setOwnerReleasedAtIso(String ownerReleasedAtIso) {
        this.ownerReleasedAtIso = hasText(ownerReleasedAtIso) ? ownerReleasedAtIso.trim() : null;
    }

    public String getTrashedAtIso() {
        return trashedAtIso;
    }

    public void setTrashedAtIso(String trashedAtIso) {
        this.trashedAtIso = trashedAtIso;
    }

    public Double getAffinity() {
        return affinity;
    }

    public void setAffinity(Double affinity) {
        this.affinity = affinity;
    }

    public Double getBoost() {
        return boost;
    }

    public void setBoost(Double boost) {
        this.boost = boost;
    }

    public String getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(String createdDate) {
        this.createdDate = createdDate;
    }

    public String getCreatedUser() {
        return createdUser;
    }

    public void setCreatedUser(String createdUser) {
        this.createdUser = createdUser;
    }

    public String getUpdatedDate() {
        return updatedDate;
    }

    public void setUpdatedDate(String updatedDate) {
        this.updatedDate = updatedDate;
    }

    public String getUpdatedUser() {
        return updatedUser;
    }

    public void setUpdatedUser(String updatedUser) {
        this.updatedUser = updatedUser;
    }

    public record AssetRequestRecord(
            String id,
            String userId,
            String name,
            String initials,
            String gender,
            String status,
            String note,
            String requestKind,
            String requestedAtIso,
            AssetRequestBookingRecord booking) implements com.raxim.myscoutee.domain.assets.api.AssetOwnership.Request {
    }

    public record AssetRequestBookingRecord(
            String eventId,
            String eventTitle,
            String subEventId,
            String subEventTitle,
            String slotKey,
            String slotLabel,
            String timeframe,
            String startAtIso,
            String endAtIso,
            Integer quantity,
            Double totalAmount,
            Double previousTotalAmount,
            String currency,
            List<String> acceptedPolicyIds,
            String paymentSessionId,
            Boolean inventoryApplied) {
        public AssetRequestBookingRecord(
                String eventId,
                String eventTitle,
                String subEventId,
                String subEventTitle,
                String slotKey,
                String slotLabel,
                String timeframe,
                String startAtIso,
                String endAtIso,
                Integer quantity,
                Double totalAmount,
                String currency,
                List<String> acceptedPolicyIds,
                String paymentSessionId,
                Boolean inventoryApplied) {
            this(
                    eventId,
                    eventTitle,
                    subEventId,
                    subEventTitle,
                    slotKey,
                    slotLabel,
                    timeframe,
                    startAtIso,
                    endAtIso,
                    quantity,
                    totalAmount,
                    null,
                    currency,
                    acceptedPolicyIds,
                    paymentSessionId,
                    inventoryApplied);
        }
    }

    public record AssetPolicyRecord(
            String id,
            String title,
            String description,
            Boolean required) {
    }

    private static boolean hasText(String value) {
        return value != null && !value.isBlank();
    }

    private static String normalizeStatus(String value) {
        String normalized = value == null ? "" : value.trim();
        return switch (normalized) {
            case STATUS_ACTIVE, STATUS_UNDER_REVIEW, STATUS_BLOCKED, STATUS_DELETED, STATUS_INACTIVE, STATUS_TRASHED -> normalized;
            case "active" -> STATUS_ACTIVE;
            case "under-review", "under review" -> STATUS_UNDER_REVIEW;
            case "blocked" -> STATUS_BLOCKED;
            case "inactive" -> STATUS_INACTIVE;
            case "deleted" -> STATUS_DELETED;
            case "trashed", "trash" -> STATUS_TRASHED;
            default -> STATUS_ACTIVE;
        };
    }
}
