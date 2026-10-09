package com.raxim.myscoutee.domain.assets.api;

/** Existing integration change payload fields; no owner persistence handle. */
public interface AssetChangeView {
    String getId();
    String getAssetId();
    String getOwnerUserId();
    String getTitle();
    String getType();
    String getStatus();
    Integer getCapacityTotal();
    Integer getQuantity();
}
