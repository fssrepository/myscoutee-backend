package com.raxim.myscoutee.domain.assets.api;
public interface AssetModerationProjection {
    void apply(String sourceId, long version, String status);
}
