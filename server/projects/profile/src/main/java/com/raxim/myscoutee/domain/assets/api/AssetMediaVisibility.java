package com.raxim.myscoutee.domain.assets.api;

import java.util.List;

public interface AssetMediaVisibility {
    Asset asset(List<String> urls);
    record Asset(String ownerUserId, String visibility, String status, String moderationStatus) {}
}
