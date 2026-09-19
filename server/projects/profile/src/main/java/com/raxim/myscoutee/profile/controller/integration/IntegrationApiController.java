package com.raxim.myscoutee.profile.controller.integration;

import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.web.server.ResponseStatusException;

import com.raxim.myscoutee.profile.data.dto.integration.IntegrationDtos.IntegrationAssetSyncRequestDto;
import com.raxim.myscoutee.profile.data.dto.integration.IntegrationDtos.IntegrationConnectDto;
import com.raxim.myscoutee.profile.data.dto.integration.IntegrationDtos.IntegrationEventSyncRequestDto;
import com.raxim.myscoutee.profile.data.dto.integration.IntegrationDtos.IntegrationSyncResponseDto;
import com.raxim.myscoutee.profile.security.AccessControlService;
import com.raxim.myscoutee.profile.service.IntegrationSyncService;
import com.raxim.myscoutee.profile.service.IntegrationTokenService;

@RestController
@RequestMapping("/integrations/v1")
public class IntegrationApiController {
    private final IntegrationSyncService syncService;
    private final AccessControlService accessControlService;

    public IntegrationApiController(
            IntegrationSyncService syncService,
            AccessControlService accessControlService) {
        this.syncService = syncService;
        this.accessControlService = accessControlService;
    }

    @PostMapping("/connect")
    public IntegrationConnectDto connect() {
        return new IntegrationConnectDto(true, IntegrationTokenService.MAX_BATCH_SIZE);
    }

    @PostMapping(path = "/assets", consumes = MediaType.APPLICATION_JSON_VALUE)
    public IntegrationSyncResponseDto createAssets(
            Authentication authentication,
            @RequestBody IntegrationAssetSyncRequestDto request) {
        return syncService.createAssets(actorUserId(authentication), request);
    }

    @PostMapping(path = "/assets", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public IntegrationSyncResponseDto createAssetsWithImages(
            Authentication authentication,
            @RequestPart("request") IntegrationAssetSyncRequestDto request,
            MultipartHttpServletRequest multipartRequest) {
        return syncService.createAssets(
                actorUserId(authentication),
                request,
                imageFiles(multipartRequest));
    }

    @PostMapping(path = "/events", consumes = MediaType.APPLICATION_JSON_VALUE)
    public IntegrationSyncResponseDto createEvents(
            Authentication authentication,
            @RequestBody IntegrationEventSyncRequestDto request) {
        return syncService.createEvents(actorUserId(authentication), request);
    }

    @PostMapping(path = "/events", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public IntegrationSyncResponseDto createEventsWithImages(
            Authentication authentication,
            @RequestPart("request") IntegrationEventSyncRequestDto request,
            MultipartHttpServletRequest multipartRequest) {
        return syncService.createEvents(
                actorUserId(authentication),
                request,
                imageFiles(multipartRequest));
    }

    private Map<String, MultipartFile> imageFiles(MultipartHttpServletRequest request) {
        Map<String, MultipartFile> files = new LinkedHashMap<>();
        request.getMultiFileMap().forEach((itemId, parts) -> {
            if (parts == null || parts.size() != 1 || files.putIfAbsent(itemId, parts.get(0)) != null) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Each item id can have exactly one image part.");
            }
        });
        return files;
    }

    private String actorUserId(Authentication authentication) {
        return accessControlService.resolveActorUserId(authentication);
    }
}
