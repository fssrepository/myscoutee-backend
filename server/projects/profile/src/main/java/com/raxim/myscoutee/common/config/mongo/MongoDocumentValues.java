package com.raxim.myscoutee.common.config.mongo;
import java.util.*;
import org.bson.Document;
import org.springframework.util.StringUtils;
/** Shared read interpretation of embedded asset/resource Mongo values. */
public final class MongoDocumentValues {
    private MongoDocumentValues() {}
    public static Document toDocument(Object raw) {
        if (raw instanceof Document document) {
            return document;
        }
        if (raw instanceof Map<?, ?> map) {
            Document document = new Document();
            for (Map.Entry<?, ?> entry : map.entrySet()) {
                if (entry.getKey() instanceof String key) {
                    document.put(key, entry.getValue());
                }
            }
            return document;
        }
        return new Document();
    }
    public static List<String> normalizeStrings(Object rawValues) {
        if (!(rawValues instanceof Collection<?> values)) {
            return List.of();
        }
        LinkedHashSet<String> next = new LinkedHashSet<>();
        for (Object rawValue : values) {
            String value = com.raxim.myscoutee.common.util.TextValues.trim(String.valueOf(rawValue));
            if (StringUtils.hasText(value)) {
                next.add(value);
            }
        }
        return new ArrayList<>(next);
    }
}
