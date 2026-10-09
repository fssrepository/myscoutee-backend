package com.raxim.myscoutee.domain.community.dto;
import com.raxim.myscoutee.domain.community.api.ServiceOfferingView;
import java.util.List;
import com.raxim.myscoutee.common.dto.SharedDtos.EventSlotTemplateDto;
import com.raxim.myscoutee.common.dto.SharedDtos.PricingConfigDto;
/** Detached public service offering, without persistence annotations. */
public record ServiceOfferingDto(
        String id,
        String baseGroupId,
        String ownerAccountId,
        String title,
        String description,
        String category,
        List<String> imageUrls,
        Double maxDistanceKm,
        List<String> languages,
        List<String> staffAccountIds,
        boolean slotsEnabled,
        String startAtIso,
        String endAtIso,
        String frequency,
        int durationMinutes,
        List<EventSlotTemplateDto> slotTemplates,
        PricingConfigDto pricing,
        String status,
        String createdAtIso,
        String updatedAtIso,
        Long version,
        String sourceLink) implements ServiceOfferingView {
    public static ServiceOfferingDto from(ServiceOfferingView value) {
        return value == null ? null : new ServiceOfferingDto(value.id(), value.baseGroupId(), value.ownerAccountId(), value.title(), value.description(), value.category(), value.imageUrls(), value.maxDistanceKm(), value.languages(), value.staffAccountIds(), value.slotsEnabled(), value.startAtIso(), value.endAtIso(), value.frequency(), value.durationMinutes(), value.slotTemplates(), value.pricing(), value.status(), value.createdAtIso(), value.updatedAtIso(), value.version(), value.sourceLink());
    }
}
