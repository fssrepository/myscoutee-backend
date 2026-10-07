package com.raxim.myscoutee.domain.assets.service;

import org.springframework.stereotype.Service;

import java.util.List;

import com.raxim.myscoutee.domain.assets.document.AssetRequest;
import com.raxim.myscoutee.domain.assets.dto.AssetsDtos.AssetOccupancyPageDto;
import com.raxim.myscoutee.domain.assets.dto.AssetsDtos.AssetOccupancyStatsPageDto;
import com.raxim.myscoutee.domain.assets.repository.AssetAvailabilityRepository;
import com.raxim.myscoutee.domain.assets.mapper.AssetAvailabilityMapper;

@Service
public class AssetAvailabilityService {
    private final AssetAvailabilityRepository availabilityRepository;
    private final AssetAvailabilityMapper availabilityMapper;
    @org.springframework.beans.factory.annotation.Autowired
    private com.raxim.myscoutee.domain.events.repository.ActivityEventsRepository events;
    @org.springframework.beans.factory.annotation.Autowired
    private com.raxim.myscoutee.domain.groups.api.GroupDirectory groups;
    @org.springframework.beans.factory.annotation.Autowired
    private com.raxim.myscoutee.domain.access.api.AccessPermissions access;

    public AssetAvailabilityService(
            AssetAvailabilityRepository availabilityRepository,
            AssetAvailabilityMapper availabilityMapper) {
        this.availabilityRepository = availabilityRepository;
        this.availabilityMapper = availabilityMapper;
    }

    public AssetOccupancyPageDto loadOccupancyByAssetId(
            String userId,
            String assetId,
            String dateIso,
            String rangeStart,
            String rangeEnd,
            String filter,
            String order,
            Integer page,
            Integer pageSize,
            String cursor) {
        userId = readActor(userId);
        List<AssetRequest> requests = availabilityRepository.findRequestsByOwnerAsset(userId, assetId);
        var result = availabilityMapper.toOccupancyPage(userId, assetId, requests, dateIso, rangeStart, rangeEnd, filter, order, page, pageSize, cursor);
        var ids = result.items().stream().map(row -> row.eventId()).filter(java.util.Objects::nonNull).distinct().toList();
        if (ids.isEmpty()) return result;
        var records = events.findBySourceIdIn(ids);
        var groupIds = records.stream().map(event -> event.getWorkspaceGroupId()).filter(java.util.Objects::nonNull).distinct().toList();
        var names = new java.util.HashMap<String, String>();
        groups.findAllById(groupIds).forEach(group -> names.put(group.id(), group.name()));
        var eventGroups = new java.util.HashMap<String, String>();
        records.forEach(event -> { if (event.getWorkspaceGroupId() != null) eventGroups.put(event.getSourceId(), event.getWorkspaceGroupId()); });
        return new AssetOccupancyPageDto(result.items().stream().map(row -> {
            String groupId = eventGroups.get(row.eventId());
            return row.withWorkspace(groupId, names.get(groupId));
        }).toList(), result.total(), result.nextCursor());
    }

    public AssetOccupancyStatsPageDto loadStatByAssetId(
            String userId,
            String assetId,
            String rangeStart,
            String rangeEnd,
            String filter,
            String order,
            Integer page,
            Integer pageSize,
            String cursor) {
        userId = readActor(userId);
        List<AssetRequest> requests = availabilityRepository.findRequestsByOwnerAsset(userId, assetId);
        return availabilityMapper.toStatsPage(userId, assetId, requests, rangeStart, rangeEnd, filter, order, page, pageSize, cursor);
    }

    private String readActor(String requested) {
        if (access == null || !access.requiresAuthenticatedActor()) return requested;
        return access.resolveActorUserId(org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication());
    }
}
