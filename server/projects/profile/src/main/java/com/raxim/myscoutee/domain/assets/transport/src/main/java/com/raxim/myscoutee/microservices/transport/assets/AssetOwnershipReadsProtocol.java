package com.raxim.myscoutee.microservices.transport.assets;

import java.util.Collection;
import com.raxim.myscoutee.domain.assets.dto.AssetOwnershipDto;

public final class AssetOwnershipReadsProtocol {
    public static final String ROOT = "/_internal/v1/assets/ownership";
    public static final int MAX_REQUEST_BYTES = 2 * 1024 * 1024, MAX_RESPONSE_BYTES = 16 * 1024 * 1024;
    private AssetOwnershipReadsProtocol() {}
    public static final String BY_ID = ROOT + "/by-id";
    public static final String BY_ASSET_ID = ROOT + "/by-asset-id";
    public static final String BY_OWNER = ROOT + "/by-owner";
    public static final String ALL = ROOT + "/all";
    public static final String BY_ASSET_IDS = ROOT + "/by-asset-ids";
    public static final String OWNED = ROOT + "/owned";
    public static final String OWNER_UPDATED = ROOT + "/owner-updated";
    public static final String ID_OR_ASSET_ID = ROOT + "/id-or-asset-id";
    public static final String FIRST_ASSET_ID = ROOT + "/first-asset-id";
    public static final String OWNERS_AND_IDS = ROOT + "/owners-and-ids";
    public static final String OWNED_EXISTS = ROOT + "/owned-exists";
    public static String[] paths() { return new String[]{BY_ID, BY_ASSET_ID, BY_OWNER, ALL, BY_ASSET_IDS, OWNED, OWNER_UPDATED, ID_OR_ASSET_ID, FIRST_ASSET_ID, OWNERS_AND_IDS, OWNED_EXISTS}; }
    public record IdQuery(String id) {}
    public record IdsQuery(Collection<String> ids) {}
    public record OwnedQuery(String owner, String id) {}
    public record OwnersIdsQuery(Collection<String> owners, Collection<String> ids) {}
    public record EmptyQuery() {}
    public record SingleResult(Boolean resolved, AssetOwnershipDto value) {}
    public record Decision(Boolean value) {}
    public record Error(String code) {}
    private static boolean id(String value) { return value == null || value.length() <= 512; }
    private static boolean ids(Collection<String> values) { return values != null && values.size() <= 4096 && values.stream().allMatch(AssetOwnershipReadsProtocol::id); }
    public static boolean valid(IdQuery q) { return q != null && id(q.id()); }
    public static boolean valid(IdsQuery q) { return q != null && ids(q.ids()); }
    public static boolean valid(OwnedQuery q) { return q != null && id(q.owner()) && id(q.id()); }
    public static boolean valid(OwnersIdsQuery q) { return q != null && ids(q.owners()) && ids(q.ids()); }
    public static boolean valid(EmptyQuery q) { return q != null; }
}
