package com.raxim.myscoutee.domain.community.api;
import java.util.List;
import com.raxim.myscoutee.common.dto.SharedDtos.EventSlotTemplateDto;
import com.raxim.myscoutee.common.dto.SharedDtos.PricingConfigDto;
public interface ServiceOfferingView {
    String id();
    String baseGroupId();
    String ownerAccountId();
    String title();
    String description();
    String category();
    List<String> imageUrls();
    Double maxDistanceKm();
    List<String> languages();
    List<String> staffAccountIds();
    boolean slotsEnabled();
    String startAtIso();
    String endAtIso();
    String frequency();
    int durationMinutes();
    List<EventSlotTemplateDto> slotTemplates();
    PricingConfigDto pricing();
    String status();
    String createdAtIso();
    String updatedAtIso();
    Long version();
    String sourceLink();
}
