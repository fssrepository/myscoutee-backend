package com.raxim.myscoutee.domain.assets.document;
import com.raxim.myscoutee.domain.assets.dto.AssetDetails.*;

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
@lombok.Getter @lombok.Setter
public class Asset implements com.raxim.myscoutee.domain.assets.api.AssetOwnership.Asset {
    @org.springframework.data.annotation.Version private Long version;
    private java.util.List<com.raxim.myscoutee.domain.assets.dto.AssetLifecycleWorkDto> lifecycleWork = new java.util.ArrayList<>();
    public Long getVersion() { return version; }
    public void setVersion(Long value) { version = value; }
    public java.util.List<com.raxim.myscoutee.domain.assets.dto.AssetLifecycleWorkDto> getLifecycleWork() { return lifecycleWork == null ? java.util.List.of() : lifecycleWork; }
    public void setLifecycleWork(java.util.List<com.raxim.myscoutee.domain.assets.dto.AssetLifecycleWorkDto> value) { lifecycleWork = new java.util.ArrayList<>(value); }

    @org.springframework.data.mongodb.core.index.Indexed
    private String workspaceGroupId;
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
    private String statusBeforeSuppression;
    private String ownerReleasedAtIso;
    private String trashedAtIso;
    private Double affinity;
    private Double boost;
    private String createdDate;
    private String createdUser;
    private String updatedDate;
    private String updatedUser;

    public String getStatus() {
        return normalizeStatus(status);
    }

    public void setStatus(String status) {
        this.status = normalizeStatus(status);
    }

    public void setStatusBeforeSuppression(String statusBeforeSuppression) {
        this.statusBeforeSuppression = hasText(statusBeforeSuppression) ? normalizeStatus(statusBeforeSuppression) : null;
    }

    public void setOwnerReleasedAtIso(String ownerReleasedAtIso) {
        this.ownerReleasedAtIso = hasText(ownerReleasedAtIso) ? ownerReleasedAtIso.trim() : null;
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
