package com.raxim.myscoutee.domain.assets.document;

import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.mapping.Document;

import com.raxim.myscoutee.domain.assets.dto.AssetDetails.AssetRequestBookingRecord;

@Document(collection = "assetRequests")
@CompoundIndexes({
        @CompoundIndex(name = "asset_request_owner_asset", def = "{'ownerUserId': 1, 'assetId': 1}"),
        @CompoundIndex(name = "asset_request_asset_updated", def = "{'assetId': 1, 'updatedDate': -1}"),
        @CompoundIndex(name = "asset_request_qmau_booking_window", def = "{'status': 1, 'requestedAtIso': 1, 'userId': 1}")
})
public record AssetRequest(
        @Id String id,
        String requestId,
        String assetId,
        String ownerUserId,
        String ownerKey,
        Integer assetCapacity,
        String userId,
        String name,
        String initials,
        String gender,
        String status,
        String note,
        String requestKind,
        String requestedAtIso,
        AssetRequestBookingRecord booking,
        List<String> menuActions,
        String createdDate,
        String updatedDate) {
}
