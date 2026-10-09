package com.raxim.myscoutee.domain.platform.dto;

import java.util.List;
import com.raxim.myscoutee.domain.platform.api.ModelStatusChanges;

/** Existing changed-target/conflict outcome, without owner implementation types. */
public record ModelStatusOutcomeDto(List<String> eventSourceIds, List<String> assetIds, @com.fasterxml.jackson.annotation.JsonProperty(required = true)
        @com.fasterxml.jackson.annotation.JsonSetter(nulls = com.fasterxml.jackson.annotation.Nulls.FAIL) boolean hasConflicts)
        implements ModelStatusChanges.Outcome {
    public ModelStatusOutcomeDto { eventSourceIds = List.copyOf(eventSourceIds); assetIds = List.copyOf(assetIds); }
    public static ModelStatusOutcomeDto from(ModelStatusChanges.Outcome value) {
        return new ModelStatusOutcomeDto(value.eventSourceIds(), value.assetIds(), value.hasConflicts());
    }
}
