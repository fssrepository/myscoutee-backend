package com.raxim.myscoutee.microservices.transport.events;

import java.io.IOException;
import java.util.Collection;
import java.util.List;
import com.raxim.myscoutee.microservices.transport.common.ReadQueryBodies;
import com.raxim.myscoutee.microservices.transport.common.ReadQueryBodies.RejectedQuery;
import jakarta.servlet.http.HttpServletRequest;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

public final class MemberDirectoryProtocol {
    public static final String ROOT = "/_internal/v1/events/members/";
    public static final String ENTRY = ROOT + "entry", OWNER = ROOT + "owner", USER = ROOT + "user",
            ALL = ROOT + "all", VIP = ROOT + "vip-pricing", PAGE = ROOT + "page",
            OWNERS = ROOT + "owners", ACCEPTED = ROOT + "accepted";
    public static final int MAX_QUERY_BYTES = 1024 * 1024, MAX_RESPONSE_BYTES = 2 * 1024 * 1024;
    private MemberDirectoryProtocol() {}
    public record Error(String code) {}
    // Transport query envelopes, not new domain operations.
    record OwnerQuery(String ownerType, List<String> ownerIds) {}
    record AcceptedQuery(String ownerType, List<String> ownerIds, String userId, String status) {}
    public static String[] paths() { return new String[]{ENTRY, OWNER, USER, ALL, VIP, PAGE, OWNERS, ACCEPTED}; }
    static boolean validIds(String... values) {
        for (var value : values) if (value != null && value.length() > 512) return false;
        return true;
    }
    private static boolean validIdNode(JsonNode node) {
        return node != null && (node.isNull() || node.isString() && validIds(node.asString()));
    }
    static JsonNode read(HttpServletRequest request, ObjectMapper mapper, boolean accepted) throws IOException {
        var query = ReadQueryBodies.read(request, mapper, MAX_QUERY_BYTES);
        if (query == null || !query.isObject() || query.size() != (accepted ? 4 : 2)
                || !validIdNode(query.get("ownerType")) || !query.has("ownerIds")
                || accepted && (!validIdNode(query.get("userId")) || !validIdNode(query.get("status"))))
            throw new RejectedQuery(400, "INVALID_REQUEST");
        var ids = query.get("ownerIds");
        if (!ids.isNull()) {
            if (!ids.isArray() || ids.size() > 4096) throw new RejectedQuery(400, "INVALID_REQUEST");
            for (var id : ids) if (!validIdNode(id)) throw new RejectedQuery(400, "INVALID_REQUEST");
        }
        return query;
    }
    static byte[] encode(Object query, Collection<String> ids, ObjectMapper mapper, String... values) {
        if (!validIds(values) || ids != null && (ids.size() > 4096 || ids.stream().anyMatch(id -> !validIds(id))))
            throw new IllegalArgumentException("Invalid member directory query.");
        var body = mapper.writeValueAsBytes(query);
        if (body.length > MAX_QUERY_BYTES) throw new IllegalArgumentException("Member directory query exceeds size limit.");
        return body;
    }
    static boolean validPage(int offset, int limit) { return offset >= 0 && limit > 0 && limit <= 1000; }
}
