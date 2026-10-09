package com.raxim.myscoutee.domain.assets.dto;

import java.util.List;
import com.raxim.myscoutee.domain.assets.api.AssetScoringFacts;

public record AssetScoringFactsDto(String type, String title, String subtitle, String category, String city,
        String visibility, String details, List<String> routes, List<PolicyDto> policies, List<RequestDto> requests,
        Integer capacityTotal, Integer quantity, String updatedDate, String createdDate) implements AssetScoringFacts {
    public record PolicyDto(String title, String description, Boolean required) implements AssetScoringFacts.Policy {}
    public record RequestDto(String status) implements AssetScoringFacts.Request {}
    public static AssetScoringFactsDto from(AssetScoringFacts value) {
        if (value == null) return null;
        return new AssetScoringFactsDto(value.getType(), value.getTitle(), value.getSubtitle(), value.getCategory(), value.getCity(),
                value.getVisibility(), value.getDetails(), value.getRoutes(),
                value.getPolicies() == null ? null : value.getPolicies().stream().map(p -> p == null ? null : new PolicyDto(p.title(), p.description(), p.required())).toList(),
                value.getRequests() == null ? null : value.getRequests().stream().map(r -> r == null ? null : new RequestDto(r.status())).toList(),
                value.getCapacityTotal(), value.getQuantity(), value.getUpdatedDate(), value.getCreatedDate());
    }
    @Override public String getType() { return type; }
    @Override public String getTitle() { return title; }
    @Override public String getSubtitle() { return subtitle; }
    @Override public String getCategory() { return category; }
    @Override public String getCity() { return city; }
    @Override public String getVisibility() { return visibility; }
    @Override public String getDetails() { return details; }
    @Override public List<String> getRoutes() { return routes; }
    @Override public List<PolicyDto> getPolicies() { return policies; }
    @Override public List<RequestDto> getRequests() { return requests; }
    @Override public Integer getCapacityTotal() { return capacityTotal; }
    @Override public Integer getQuantity() { return quantity; }
    @Override public String getUpdatedDate() { return updatedDate; }
    @Override public String getCreatedDate() { return createdDate; }
}
