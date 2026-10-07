package com.raxim.myscoutee.domain.affinity.api;

import com.raxim.myscoutee.domain.administration.dto.AdminDtos.AdminAffinityGraphDto;
import com.raxim.myscoutee.domain.administration.dto.AdminDtos.AdminAffinityGraphForestsDto;
import com.raxim.myscoutee.domain.administration.dto.AdminDtos.AdminAffinityGraphMetaDto;
import com.raxim.myscoutee.domain.administration.dto.AdminDtos.AdminAffinityGraphNeighborhoodDto;
import com.raxim.myscoutee.domain.administration.dto.AdminDtos.AdminAffinityGraphTileDto;
public interface AffinityGraph {
    AdminAffinityGraphMetaDto meta(String adminUserId, Double minWeight, Double maxWeight);
    AdminAffinityGraphDto full(String adminUserId, Double minWeight, Double maxWeight);
    AdminAffinityGraphNeighborhoodDto neighborhood(
            String adminUserId,
            String userId,
            Integer depth,
            Double minWeight,
            Double maxWeight);
    AdminAffinityGraphForestsDto forests(
            String adminUserId,
            Double minWeight,
            Double maxWeight,
            Integer forestLevel,
            Integer limit,
            Integer offset);
    AdminAffinityGraphTileDto tile(
            String adminUserId,
            String layoutVersion,
            Integer z,
            Integer x,
            Integer y,
            Double minWeight,
            Double maxWeight,
            String componentId);
    AdminAffinityGraphMetaDto rebuildLayout(String adminUserId);
}
