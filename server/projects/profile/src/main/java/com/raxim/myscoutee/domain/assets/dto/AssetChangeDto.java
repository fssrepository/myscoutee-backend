package com.raxim.myscoutee.domain.assets.dto;

import com.raxim.myscoutee.domain.assets.api.AssetChangeView;

public record AssetChangeDto(String id, String assetId, String ownerUserId, String title, String type, String status, Integer capacityTotal, Integer quantity) implements AssetChangeView {
    public static AssetChangeDto from(AssetChangeView value) {
        return value == null ? null : new AssetChangeDto(value.getId(), value.getAssetId(), value.getOwnerUserId(), value.getTitle(), value.getType(), value.getStatus(), value.getCapacityTotal(), value.getQuantity());
    }
    @Override public String getId() { return id; }
    @Override public String getAssetId() { return assetId; }
    @Override public String getOwnerUserId() { return ownerUserId; }
    @Override public String getTitle() { return title; }
    @Override public String getType() { return type; }
    @Override public String getStatus() { return status; }
    @Override public Integer getCapacityTotal() { return capacityTotal; }
    @Override public Integer getQuantity() { return quantity; }
}
