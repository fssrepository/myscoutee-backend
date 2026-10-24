package com.raxim.myscoutee.microservices.transport.affinity;

import java.io.IOException;
import java.util.List;
import java.util.function.Supplier;
import com.raxim.myscoutee.domain.affinity.api.RatingDirectory;
import com.raxim.myscoutee.domain.affinity.api.RatingView;
import com.raxim.myscoutee.domain.affinity.dto.RatingDirectoryEntryDto;
import com.raxim.myscoutee.microservices.transport.common.ReadQueryBodies.RejectedQuery;
import com.raxim.myscoutee.microservices.transport.affinity.RatingDirectoryProtocol.Error;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.CacheControl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tools.jackson.databind.ObjectMapper;

@RestController
public final class RatingDirectoryEndpoint {
    private final RatingDirectory ratings;
    private final ObjectMapper mapper;
    public RatingDirectoryEndpoint(RatingDirectory ratings, ObjectMapper mapper) { this.ratings=ratings; this.mapper=mapper; }
    @GetMapping(value=RatingDirectoryProtocol.ALL, produces="application/json")
    public ResponseEntity<?> all() { return read(ratings::findAll); }
    @PostMapping(value=RatingDirectoryProtocol.RELEVANT, produces="application/json")
    public ResponseEntity<?> relevant(HttpServletRequest request) throws IOException {
        try {
            var ids=RatingDirectoryProtocol.readIds(request,mapper);
            return read(()->ratings.findRelevantByUserIds(ids));
        } catch (RejectedQuery invalid) { return response(invalid.status(),new Error(invalid.code())); }
    }
    @GetMapping(value=RatingDirectoryProtocol.EXCLUSIONS, produces="application/json")
    public ResponseEntity<?> exclusions(@RequestParam(required=false) String userId) {
        if (!RatingDirectoryProtocol.validId(userId)) return response(400,new Error("INVALID_REQUEST"));
        return read(()->ratings.findHomeGameExclusionProjections(userId));
    }
    @GetMapping(value=RatingDirectoryProtocol.POSITIVE, produces="application/json")
    public ResponseEntity<?> positive(@RequestParam(required=false) String campaignId,
            @RequestParam(required=false) String viewerId,@RequestParam(required=false) String organizerId) {
        if (!RatingDirectoryProtocol.validId(campaignId)||!RatingDirectoryProtocol.validId(viewerId)||!RatingDirectoryProtocol.validId(organizerId))
            return response(400,new Error("INVALID_REQUEST"));
        try { return response(200,ratings.hasPositiveCampaignRating(campaignId,viewerId,organizerId)); }
        catch (RuntimeException unavailable) { return response(503,new Error("RATING_DIRECTORY_UNAVAILABLE")); }
    }
    private ResponseEntity<?> read(Supplier<? extends List<? extends RatingView>> action) {
        try { return response(200,action.get().stream().map(RatingDirectoryEntryDto::from).toList()); }
        catch (RuntimeException unavailable) { return response(503,new Error("RATING_DIRECTORY_UNAVAILABLE")); }
    }
    private ResponseEntity<?> response(int status,Object body) { return ResponseEntity.status(status).cacheControl(CacheControl.noStore()).body(body); }
}
