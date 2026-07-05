package com.raxim.myscoutee.profile.service;

import org.springframework.stereotype.Service;

import java.util.List;

import com.raxim.myscoutee.profile.data.document.AssetRequest;
import com.raxim.myscoutee.profile.data.dto.assets.AssetsDtos.AssetOccupancyPageDto;
import com.raxim.myscoutee.profile.data.dto.assets.AssetsDtos.AssetOccupancyStatsPageDto;
import com.raxim.myscoutee.profile.repository.AssetAvailabilityRepository;
import com.raxim.myscoutee.profile.service.mapper.AssetAvailabilityMapper;

@Service
public class AssetAvailabilityService {
    private final AssetAvailabilityRepository availabilityRepository;
    private final AssetAvailabilityMapper availabilityMapper;

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
            String filter,
            String order,
            Integer page,
            Integer pageSize,
            String cursor) {
        List<AssetRequest> requests = availabilityRepository.findRequestsByOwnerAsset(userId, assetId);
        return availabilityMapper.toOccupancyPage(userId, assetId, requests, dateIso, filter, order, page, pageSize, cursor);
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
        List<AssetRequest> requests = availabilityRepository.findRequestsByOwnerAsset(userId, assetId);
        return availabilityMapper.toStatsPage(userId, assetId, requests, rangeStart, rangeEnd, filter, order, page, pageSize, cursor);
    }
}
