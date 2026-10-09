package com.raxim.myscoutee.microservices.transport.media;

import java.net.URI;
import java.time.Duration;
import com.raxim.myscoutee.domain.media.api.ImageUploads;
import com.raxim.myscoutee.domain.media.api.MediaStorage.StoredImageSet;
import com.raxim.myscoutee.microservices.transport.common.RemoteReadTransport;
import io.micrometer.core.instrument.MeterRegistry;
import org.springframework.web.multipart.MultipartFile;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

/** One image upload, without retry after an unknown storage outcome. */
public final class RemoteImageUploads extends RemoteReadTransport implements ImageUploads {
    private final ObjectMapper mapper;
    private final java.util.concurrent.Semaphore uploadSlots = new java.util.concurrent.Semaphore(1);
    public RemoteImageUploads(URI origin, String token, boolean allowHttp, Duration connectTimeout,
            Duration requestTimeout, ObjectMapper mapper, MeterRegistry metrics) {
        super(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics, Duration.ofSeconds(60)); this.mapper = mapper;
    }
    @Override public StoredImageSet storeImageSet(String ownerId, String entityId, MultipartFile image) {
        if (image == null || image.isEmpty()) return null;
        if (!uploadSlots.tryAcquire()) throw new RemoteReadException("BUSY", 0);
        try { return upload(ownerId, entityId, image); }
        finally { uploadSlots.release(); }
    }
    @Override public StoredImageSet storeImportedImageSet(String ownerId, String entityId, MultipartFile image) {
        return storeImageSet(ownerId, entityId, image);
    }
    private StoredImageSet upload(String ownerId, String entityId, MultipartFile image) {
        if (image.getSize() > ImageUploadsProtocol.MAX_IMAGE_BYTES) throw new IllegalArgumentException("Image exceeds production upload limit");
        byte[] imageBytes;
        try { imageBytes = image.getBytes(); }
        catch (java.io.IOException unreadable) { return null; }
        var command = new ImageUploadsProtocol.Upload(ownerId, entityId, image.getOriginalFilename(), image.getContentType(), imageBytes);
        if (!ImageUploadsProtocol.valid(command)) throw new IllegalArgumentException("Invalid integration image upload");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > ImageUploadsProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("Image upload exceeds byte limit");
        return exchange(ImageUploadsProtocol.PATH, bytes, new TypeReference<ImageUploadsProtocol.Result>() {},
                "image-uploads.store", ImageUploadsProtocol.MAX_RESPONSE_BYTES, ImageUploadsProtocol::valid).imageSet();
    }
}
