package com.raxim.myscoutee.profile.data.dto.community;
import java.util.List;
import com.raxim.myscoutee.profile.data.document.ServiceOffering;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.EventSlotTemplateDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.PricingConfigDto;
public final class ServiceOfferingDtos {
    private ServiceOfferingDtos() {}
    public record Item(ServiceOffering service, String ownerUserId, String ownerName, String ownerAvatarUrl,
            Double distanceKm, double viewerRating, boolean canManage) {}
    public record Save(String userId, String id, String title, String description, String category, List<String> imageUrls,
            Double maxDistanceKm, List<String> languages, List<String> staffAccountIds,
            boolean slotsEnabled, String startAtIso, String endAtIso, String frequency, int durationMinutes,
            List<EventSlotTemplateDto> slotTemplates, PricingConfigDto pricing, Long version, String sourceLink) {}
    public record Command(String userId, String action, Long version) {}
}
