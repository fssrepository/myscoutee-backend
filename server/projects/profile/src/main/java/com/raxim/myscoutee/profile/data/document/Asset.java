package com.raxim.myscoutee.profile.data.document;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.PricingConfigDto;

@Document(collection = "assets")
@CompoundIndexes({
        @CompoundIndex(name = "asset_owner_asset_id", def = "{'ownerUserId': 1, 'assetId': 1}", unique = true),
        @CompoundIndex(name = "asset_owner_updated", def = "{'ownerUserId': 1, 'updatedDate': -1}")
})
public class Asset {
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
    private String city;
    private Integer capacityTotal;
    private String details;
    private String imageUrl;
    private String sourceLink;
    private List<String> routes = new ArrayList<>();
    private List<AssetPolicyRecord> policies = new ArrayList<>();
    private PricingConfigDto pricing;
    private List<AssetRequestRecord> requests = new ArrayList<>();
    private String visibility;
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

    public Integer getCapacityTotal() {
        return capacityTotal;
    }

    public void setCapacityTotal(Integer capacityTotal) {
        this.capacityTotal = capacityTotal;
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
            String note) {
    }

    public record AssetPolicyRecord(
            String id,
            String title,
            String description,
            Boolean required) {
    }
}
