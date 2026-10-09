package com.raxim.myscoutee.domain.assets.api;

import java.util.List;

/** Asset-owned content/capacity inputs read by the existing affinity formulas. */
public interface AssetScoringFacts {
    String getType();
    String getTitle();
    String getSubtitle();
    String getCategory();
    String getCity();
    String getVisibility();
    String getDetails();
    List<String> getRoutes();
    List<? extends Policy> getPolicies();
    List<? extends Request> getRequests();
    Integer getCapacityTotal();
    Integer getQuantity();
    String getUpdatedDate();
    String getCreatedDate();
    interface Policy { String title(); String description(); Boolean required(); }
    interface Request { String status(); }
}
