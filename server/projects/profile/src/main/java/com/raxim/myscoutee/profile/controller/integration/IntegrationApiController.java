package com.raxim.myscoutee.profile.controller.integration;

import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import com.raxim.myscoutee.profile.service.IntegrationEventQueryService;
import com.raxim.myscoutee.profile.data.dto.integration.IntegrationDtos.IntegrationEventDto;
import com.raxim.myscoutee.profile.data.dto.integration.IntegrationDtos.IntegrationEncountersDto;
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
import com.raxim.myscoutee.profile.data.dto.integration.IntegrationDtos.IntegrationWatchRequestDto;
import com.raxim.myscoutee.profile.data.dto.integration.IntegrationDtos.IntegrationWatchResponseDto;
import com.raxim.myscoutee.profile.security.AccessControlService;
import com.raxim.myscoutee.profile.service.IntegrationSyncService;
import com.raxim.myscoutee.profile.service.IntegrationTokenService;
import com.raxim.myscoutee.profile.service.IntegrationTokenService.AuthenticatedIntegrationClient;
import com.raxim.myscoutee.profile.service.IntegrationWebhookService;

@RestController
@RequestMapping("/integrations/v1")
public class IntegrationApiController {
    private final IntegrationSyncService syncService;
    private final IntegrationEventQueryService eventQueries;
    private final AccessControlService accessControlService;
    private final IntegrationWebhookService webhookService;

    public IntegrationApiController(
            IntegrationSyncService syncService,
            IntegrationEventQueryService eventQueries,
            AccessControlService accessControlService,
            IntegrationWebhookService webhookService) {
        this.syncService = syncService;
        this.eventQueries = eventQueries;
        this.accessControlService = accessControlService;
        this.webhookService = webhookService;
    }

    @PostMapping("/connect")
    public IntegrationConnectDto connect() {
        return new IntegrationConnectDto(true, IntegrationTokenService.MAX_BATCH_SIZE);
    }

    @PostMapping(path = "/watch", consumes = MediaType.APPLICATION_JSON_VALUE)
    public IntegrationWatchResponseDto watch(
            Authentication authentication,
            @RequestBody IntegrationWatchRequestDto request) {
        String actorUserId = actorUserId(authentication);
        Object details = authentication == null ? null : authentication.getDetails();
        if (!(details instanceof AuthenticatedIntegrationClient client)
                || !actorUserId.equals(client.ownerUserId())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "An authenticated integration client is required.");
        }
        return webhookService.configure(client, request);
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

    @GetMapping("/events/{eventId}")
    public IntegrationEventDto event(Authentication authentication, @PathVariable String eventId) {
        return eventQueries.event(actorUserId(authentication), eventId);
    }

    @GetMapping("/events/{eventId}/encounters")
    public IntegrationEncountersDto encounters(Authentication authentication, @PathVariable String eventId,
            @RequestParam(defaultValue = "0") int offset, @RequestParam(defaultValue = "1000") int limit) {
        return eventQueries.encounters(actorUserId(authentication), eventId, offset, limit);
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
