package com.raxim.myscoutee.microservices.transport.media;

import static org.junit.jupiter.api.Assertions.*;
import java.nio.charset.StandardCharsets;
import org.junit.jupiter.api.Test;

class ImageUploadsProtocolTest {
    @Test void uploadEqualityUsesContentAndJsonRetainsTheOriginalBytes() {
        byte[] bytes = "private-image-content".getBytes(StandardCharsets.UTF_8);
        var upload = new ImageUploadsProtocol.Upload("owner", "asset-1", "picture.png", "image/png", bytes);
        var mapper = new com.raxim.myscoutee.common.config.JsonConfig().objectMapper();
        var decoded = mapper.readValue(mapper.writeValueAsBytes(upload), ImageUploadsProtocol.Upload.class);
        assertEquals(upload, decoded);
        assertEquals(upload.hashCode(), decoded.hashCode());
        assertArrayEquals(bytes, decoded.bytes());
        assertFalse(upload.toString().contains("private-image-content"));
        assertNotEquals(upload, new ImageUploadsProtocol.Upload("other", "asset-1", "picture.png", "image/png", bytes));
        assertNotEquals(upload, new ImageUploadsProtocol.Upload("owner", "asset-1", "picture.png", "image/png", new byte[0]));
        assertEquals(new ImageUploadsProtocol.Upload(null, null, null, null, null),
                new ImageUploadsProtocol.Upload(null, null, null, null, null));
    }
}
