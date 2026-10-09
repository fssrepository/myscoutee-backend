package com.raxim.myscoutee.microservices.transport.accounts;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import com.raxim.myscoutee.microservices.transport.common.ReadQueryBodies;
import com.raxim.myscoutee.microservices.transport.common.ReadQueryBodies.RejectedQuery;
import jakarta.servlet.http.HttpServletRequest;
import tools.jackson.databind.ObjectMapper;

public final class RatingProfilesProtocol {
    public static final String PATH = "/_internal/v1/accounts/rating-profiles";
    public static final int MAX_QUERY_BYTES=1024*1024, MAX_RESPONSE_BYTES=2*1024*1024;
    private RatingProfilesProtocol() {}
    public record Error(String code) {}
    record IdsQuery(List<String> ids) {}
    public static String[] paths() { return new String[]{PATH}; }
    static boolean validId(String id) { return id == null || id.length() <= 512; }
    static List<String> readIds(HttpServletRequest request, ObjectMapper mapper) throws IOException {
        var query=ReadQueryBodies.read(request, mapper, MAX_QUERY_BYTES);
        if (query == null || !query.isObject() || query.size()!=1 || !query.has("ids")) throw new RejectedQuery(400,"INVALID_REQUEST");
        var ids=query.get("ids");
        if (ids.isNull()) return null;
        if (!ids.isArray() || ids.size()>4096) throw new RejectedQuery(400,"INVALID_REQUEST");
        var result=new ArrayList<String>();
        for (var id:ids) {
            if (!id.isNull() && (!id.isString() || !validId(id.asString()))) throw new RejectedQuery(400,"INVALID_REQUEST");
            result.add(id.isNull()?null:id.asString());
        }
        return result;
    }
    static byte[] encode(Iterable<String> ids, ObjectMapper mapper) {
        List<String> bounded=null;
        if (ids!=null) {
            bounded=new ArrayList<>();
            for (var id:ids) {
                if (bounded.size()==4096 || !validId(id)) throw new IllegalArgumentException("Invalid rating profile IDs.");
                bounded.add(id);
            }
        }
        var body=mapper.writeValueAsBytes(new IdsQuery(bounded));
        if (body.length>MAX_QUERY_BYTES) throw new IllegalArgumentException("Rating profile query exceeds size limit.");
        return body;
    }
}
