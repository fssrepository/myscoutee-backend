package com.raxim.myscoutee.microservices.transport.affinity;

import java.net.URI;
import java.time.Duration;
import java.util.List;
import com.raxim.myscoutee.domain.affinity.api.RatingDirectory;
import com.raxim.myscoutee.domain.affinity.dto.RatingDirectoryEntryDto;
import com.raxim.myscoutee.microservices.transport.common.RemoteReadTransport;
import io.micrometer.core.instrument.MeterRegistry;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

public final class RemoteRatingDirectory extends RemoteReadTransport implements RatingDirectory {
    private final ObjectMapper mapper;
    public RemoteRatingDirectory(URI origin,String token,boolean allowHttp,Duration connectTimeout,
            Duration requestTimeout,ObjectMapper mapper,MeterRegistry metrics) {
        super(origin,token,allowHttp,connectTimeout,requestTimeout,mapper,metrics);this.mapper=mapper;
    }
    @Override public List<RatingDirectoryEntryDto> findAll() {
        return exchange(RatingDirectoryProtocol.ALL,new TypeReference<List<RatingDirectoryEntryDto>>() {},
                "affinity.ratings-all",RatingDirectoryProtocol.MAX_RESPONSE_BYTES,value -> true);
    }
    @Override public List<RatingDirectoryEntryDto> findRelevantByUserIds(List<String> ids) {
        return exchange(RatingDirectoryProtocol.RELEVANT,RatingDirectoryProtocol.encode(ids,mapper),
                new TypeReference<List<RatingDirectoryEntryDto>>() {},"affinity.ratings-relevant",RatingDirectoryProtocol.MAX_RESPONSE_BYTES,value -> true);
    }
    @Override public List<RatingDirectoryEntryDto> findHomeGameExclusionProjections(String userId) {
        return exchange(queryPath(RatingDirectoryProtocol.EXCLUSIONS,"userId",userId),
                new TypeReference<List<RatingDirectoryEntryDto>>() {},"affinity.ratings-exclusions",RatingDirectoryProtocol.MAX_RESPONSE_BYTES,value -> true);
    }
    @Override public boolean hasPositiveCampaignRating(String campaignId,String viewerId,String organizerId) {
        return exchange(queryPath(RatingDirectoryProtocol.POSITIVE,"campaignId",campaignId,"viewerId",viewerId,"organizerId",organizerId),
                new TypeReference<Boolean>() {},"affinity.ratings-positive",RatingDirectoryProtocol.MAX_RESPONSE_BYTES,value -> true);
    }
}
