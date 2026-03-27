package com.raxim.myscoutee.profile.controller.media;

import java.time.Duration;

import org.springframework.http.CacheControl;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import com.raxim.myscoutee.profile.dto.media.MediaDtos.MediaImageUploadResponseDto;
import com.raxim.myscoutee.profile.service.MediaStorageService;
import com.raxim.myscoutee.profile.service.MediaStorageService.StoredMediaObject;

@RestController
@RequestMapping("/media")
public class MediaController {
    private final MediaStorageService mediaStorageService;

    public MediaController(MediaStorageService mediaStorageService) {
        this.mediaStorageService = mediaStorageService;
    }

    @PostMapping(path = "/images", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public MediaImageUploadResponseDto uploadImage(
            @RequestParam("scope") String scope,
            @RequestParam("ownerId") String ownerId,
            @RequestParam(value = "entityId", required = false) String entityId,
            @RequestParam("image") MultipartFile image) {
        String imageUrl = mediaStorageService.storeImage(scope, ownerId, entityId, image);
        if (imageUrl == null) {
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, "Image upload unavailable.");
        }
        return new MediaImageUploadResponseDto(true, imageUrl, imageUrl);
    }

    @GetMapping("/public")
    public ResponseEntity<byte[]> loadPublic(@RequestParam("key") String key) {
        StoredMediaObject stored = mediaStorageService.loadPublicObject(key);
        if (stored == null || stored.bytes() == null || stored.bytes().length == 0) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Media not found.");
        }
        return ResponseEntity.ok()
                .contentType(resolveMediaType(stored.contentType()))
                .cacheControl(CacheControl.maxAge(Duration.ofDays(365)).cachePublic())
                .body(stored.bytes());
    }

    private MediaType resolveMediaType(String value) {
        try {
            return MediaType.parseMediaType(value);
        } catch (Exception ex) {
            return MediaType.APPLICATION_OCTET_STREAM;
        }
    }
}
