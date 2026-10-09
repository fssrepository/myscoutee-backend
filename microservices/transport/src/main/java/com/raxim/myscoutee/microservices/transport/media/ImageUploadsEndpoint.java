package com.raxim.myscoutee.microservices.transport.media;

import com.raxim.myscoutee.domain.media.api.ImageUploads;
import com.raxim.myscoutee.microservices.transport.common.ReadQueryBodies;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import tools.jackson.databind.*;

@RestController
public final class ImageUploadsEndpoint {
    private final ImageUploads owner;
    private final ObjectMapper mapper;
    private final java.util.concurrent.Semaphore uploadSlots = new java.util.concurrent.Semaphore(1);
    public ImageUploadsEndpoint(ImageUploads owner, ObjectMapper mapper) { this.owner = owner; this.mapper = mapper; }
    @PostMapping(value = ImageUploadsProtocol.PATH, produces = "application/json")
    public ResponseEntity<?> upload(HttpServletRequest request) throws java.io.IOException {
        if (!uploadSlots.tryAcquire()) return response(503, new ImageUploadsProtocol.Error("IMAGE_UPLOAD_BUSY"));
        try {
            var bytes = ReadQueryBodies.readBytes(request, ImageUploadsProtocol.MAX_REQUEST_BYTES);
            ImageUploadsProtocol.Upload command;
            try {
                command = mapper.readerFor(ImageUploadsProtocol.Upload.class).with(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES)
                        .with(DeserializationFeature.FAIL_ON_TRAILING_TOKENS).readValue(bytes);
            } catch (RuntimeException invalid) { throw new ReadQueryBodies.RejectedQuery(400, "INVALID_REQUEST"); }
            if (!ImageUploadsProtocol.valid(command)) throw new ReadQueryBodies.RejectedQuery(400, "INVALID_REQUEST");
            return response(200, new ImageUploadsProtocol.Result(true,
                    owner.storeImportedImageSet(command.ownerId(), command.entityId(), new UploadedImage(command))));
        } catch (ReadQueryBodies.RejectedQuery invalid) { return response(invalid.status(), new ImageUploadsProtocol.Error(invalid.code())); }
        catch (RuntimeException unavailable) { return response(503, new ImageUploadsProtocol.Error("IMAGE_UPLOAD_OUTCOME_UNKNOWN")); }
        finally { uploadSlots.release(); }
    }
    private ResponseEntity<?> response(int status, Object body) { return ResponseEntity.status(status).cacheControl(CacheControl.noStore()).body(body); }

    /** Multipart metadata adapter only; validation, conversion and storage stay in the canonical owner. */
    private record UploadedImage(ImageUploadsProtocol.Upload value) implements MultipartFile {
        public String getName() { return "image"; }
        public String getOriginalFilename() { return value.originalFilename(); }
        public String getContentType() { return value.contentType(); }
        public boolean isEmpty() { return value.bytes().length == 0; }
        public long getSize() { return value.bytes().length; }
        public byte[] getBytes() { return value.bytes(); }
        public java.io.InputStream getInputStream() { return new java.io.ByteArrayInputStream(value.bytes()); }
        public void transferTo(java.io.File destination) throws java.io.IOException { java.nio.file.Files.write(destination.toPath(), value.bytes()); }
    }
}
