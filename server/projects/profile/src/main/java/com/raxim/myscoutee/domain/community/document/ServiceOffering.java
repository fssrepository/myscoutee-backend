package com.raxim.myscoutee.domain.community.document;

import java.util.List;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Version;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import com.raxim.myscoutee.common.dto.SharedDtos.EventSlotTemplateDto;
import com.raxim.myscoutee.common.dto.SharedDtos.PricingConfigDto;

@Document("serviceOfferings")
@CompoundIndex(name="service_base_status_owner", def="{'baseGroupId':1,'status':1,'ownerAccountId':1,'updatedAtIso':-1}")
public record ServiceOffering(@Id String id, String baseGroupId, String ownerAccountId,
        String title, String description, String category, @Indexed(name="service_images") List<String> imageUrls,
        Double maxDistanceKm, List<String> languages, List<String> staffAccountIds,
        boolean slotsEnabled, String startAtIso, String endAtIso, String frequency, int durationMinutes,
        List<EventSlotTemplateDto> slotTemplates, PricingConfigDto pricing, String status,
        String createdAtIso, String updatedAtIso, @Version Long version, String sourceLink) implements com.raxim.myscoutee.domain.community.api.ServiceOfferingView {}
