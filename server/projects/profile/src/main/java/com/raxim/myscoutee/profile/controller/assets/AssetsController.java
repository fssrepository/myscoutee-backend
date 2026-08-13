package com.raxim.myscoutee.profile.controller.assets;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.raxim.myscoutee.profile.data.dto.assets.AssetsDtos.AssetDeleteRequestDto;
import com.raxim.myscoutee.profile.data.dto.assets.AssetsDtos.AssetDetailDto;
import com.raxim.myscoutee.profile.data.dto.assets.AssetsDtos.AssetDto;
import com.raxim.myscoutee.profile.data.dto.assets.AssetsDtos.AssetExplorePageDto;
import com.raxim.myscoutee.profile.data.dto.assets.AssetsDtos.AssetMakeManagerRequestDto;
import com.raxim.myscoutee.profile.data.dto.assets.AssetsDtos.AssetMemberStatusChangeDto;
import com.raxim.myscoutee.profile.data.dto.assets.AssetsDtos.AssetMemberStatusChangeRequestDto;
import com.raxim.myscoutee.profile.data.dto.assets.AssetsDtos.AssetOccupancyPageDto;
import com.raxim.myscoutee.profile.data.dto.assets.AssetsDtos.AssetOccupancyStatsPageDto;
import com.raxim.myscoutee.profile.data.dto.assets.AssetsDtos.AssetReplaceRequestDto;
import com.raxim.myscoutee.profile.data.dto.assets.AssetsDtos.AssetTicketsPageDto;
import com.raxim.myscoutee.profile.data.dto.assets.AssetsDtos.AssetTicketSyncRequestDto;
import com.raxim.myscoutee.profile.data.dto.assets.AssetsDtos.AssetTicketSyncResponseDto;
import com.raxim.myscoutee.profile.data.dto.assets.AssetsDtos.AssetTicketValidationDto;
import com.raxim.myscoutee.profile.data.dto.assets.AssetsDtos.AssetTicketValidationRequestDto;
import com.raxim.myscoutee.profile.data.dto.assets.AssetsDtos.AssetUpsertRequestDto;
import com.raxim.myscoutee.profile.security.AccessPolicyKeys;
import com.raxim.myscoutee.profile.security.RequiresPolicy;
import com.raxim.myscoutee.profile.service.AssetAvailabilityService;
import com.raxim.myscoutee.profile.service.AssetsService;

@RestController
@RequestMapping("/assets")
public class AssetsController {
    private final AssetsService assetsService;
    private final AssetAvailabilityService assetAvailabilityService;

    public AssetsController(
            AssetsService assetsService,
            AssetAvailabilityService assetAvailabilityService) {
        this.assetsService = assetsService;
        this.assetAvailabilityService = assetAvailabilityService;
    }

    @GetMapping
    public List<AssetDto> queryAssets(@RequestParam(value = "userId", required = false) String userId) {
        return assetsService.queryAssets(userId);
    }

    @GetMapping("/{assetId}")
    public AssetDetailDto queryAssetDetail(
            @PathVariable("assetId") String assetId,
            @RequestParam(value = "userId", required = false) String userId) {
        return assetsService.queryAssetDetail(userId, assetId);
    }

    @GetMapping("/{assetId}/availability")
    public AssetOccupancyPageDto loadOccupancyByAssetId(
            @PathVariable("assetId") String assetId,
            @RequestParam(value = "userId", required = false) String userId,
            @RequestParam(value = "dateIso", required = false) String dateIso,
            @RequestParam(value = "rangeStart", required = false) String rangeStart,
            @RequestParam(value = "rangeEnd", required = false) String rangeEnd,
            @RequestParam(value = "filter", required = false) String filter,
            @RequestParam(value = "order", required = false) String order,
            @RequestParam(value = "page", defaultValue = "0") Integer page,
            @RequestParam(value = "pageSize", defaultValue = "20") Integer pageSize,
            @RequestParam(value = "cursor", required = false) String cursor) {
        return assetAvailabilityService.loadOccupancyByAssetId(
                userId,
                assetId,
                dateIso,
                rangeStart,
                rangeEnd,
                filter,
                order,
                page,
                pageSize,
                cursor);
    }

    @GetMapping("/{assetId}/availability/stats")
    public AssetOccupancyStatsPageDto loadStatByAssetId(
            @PathVariable("assetId") String assetId,
            @RequestParam(value = "userId", required = false) String userId,
            @RequestParam(value = "rangeStart", required = false) String rangeStart,
            @RequestParam(value = "rangeEnd", required = false) String rangeEnd,
            @RequestParam(value = "filter", required = false) String filter,
            @RequestParam(value = "order", required = false) String order,
            @RequestParam(value = "page", defaultValue = "0") Integer page,
            @RequestParam(value = "pageSize", defaultValue = "60") Integer pageSize,
            @RequestParam(value = "cursor", required = false) String cursor) {
        return assetAvailabilityService.loadStatByAssetId(
                userId,
                assetId,
                rangeStart,
                rangeEnd,
                filter,
                order,
                page,
                pageSize,
                cursor);
    }

    @GetMapping("/explore")
    public Object queryVisibleAssets(
            @RequestParam(value = "userId", required = false) String userId,
            @RequestParam("type") String type,
            @RequestParam(value = "category", required = false) String category,
            @RequestParam(value = "startAtIso", required = false) String startAtIso,
            @RequestParam(value = "endAtIso", required = false) String endAtIso,
            @RequestParam(value = "page", required = false) Integer page,
            @RequestParam(value = "pageSize", required = false) Integer pageSize,
            @RequestParam(value = "cursor", required = false) String cursor,
            @RequestParam(value = "order", required = false) String order) {
        if (page != null || pageSize != null || hasText(cursor) || hasText(order) || hasText(startAtIso) || hasText(endAtIso)) {
            AssetExplorePageDto result = assetsService.queryVisibleAssetsPage(
                    userId,
                    type,
                    category,
                    startAtIso,
                    endAtIso,
                    page,
                    pageSize,
                    cursor,
                    order);
            return result;
        }
        return assetsService.queryVisibleAssets(userId, type, category);
    }

    @GetMapping("/tickets")
    public AssetTicketsPageDto queryTickets(
            @RequestParam(value = "userId", required = false) String userId,
            @RequestParam(value = "page", defaultValue = "0") Integer page,
            @RequestParam(value = "pageSize", defaultValue = "20") Integer pageSize,
            @RequestParam(value = "order", defaultValue = "upcoming") String order) {
        return assetsService.queryTicketPage(userId, page, pageSize, order);
    }

    @PostMapping("/tickets/sync")
    public AssetTicketSyncResponseDto syncTickets(
            @RequestBody AssetTicketSyncRequestDto request) {
        return assetsService.syncTickets(request);
    }

    @PostMapping("/tickets/validate")
    public AssetTicketValidationDto validateTicket(
            @RequestBody AssetTicketValidationRequestDto request) {
        return assetsService.validateTicket(request);
    }

    @PostMapping("/upsert")
    public AssetDto upsert(@RequestBody AssetUpsertRequestDto request) {
        return assetsService.upsert(request);
    }

    @PostMapping("/members/action")
    public AssetMemberStatusChangeDto applyMemberStatusChange(
            @RequestBody AssetMemberStatusChangeRequestDto request) {
        return assetsService.applyMemberStatusChange(request);
    }

    @PostMapping("/replace")
    @RequiresPolicy(
            key = AccessPolicyKeys.ASSET_REPLACE,
            subject = "#request?.userId()",
            resourceId = "#request?.userId()",
            skipWhenAuthenticationOptional = true)
    public void replace(@RequestBody AssetReplaceRequestDto request) {
        assetsService.replace(request);
    }

    @PostMapping("/delete")
    @RequiresPolicy(
            key = AccessPolicyKeys.ASSET_DELETE,
            subject = "#request?.userId()",
            resourceId = "#request?.assetId()",
            skipWhenAuthenticationOptional = true)
    public void delete(@RequestBody AssetDeleteRequestDto request) {
        assetsService.delete(request);
    }

    @PostMapping("/restore")
    @RequiresPolicy(
            key = AccessPolicyKeys.ASSET_RESTORE,
            subject = "#request?.userId()",
            resourceId = "#request?.assetId()",
            skipWhenAuthenticationOptional = true)
    public AssetDto restore(@RequestBody AssetDeleteRequestDto request) {
        return assetsService.restore(request);
    }

    @PostMapping("/take-over")
    @RequiresPolicy(
            key = AccessPolicyKeys.ASSET_TAKEOVER,
            subject = "#request?.userId()",
            resourceId = "#request?.assetId()",
            skipWhenAuthenticationOptional = true)
    public AssetDto takeOver(@RequestBody AssetDeleteRequestDto request) {
        return assetsService.takeOver(request);
    }

    @PostMapping("/make-manager")
    @RequiresPolicy(
            key = AccessPolicyKeys.ASSET_MANAGER_PROMOTE_ACTOR,
            subject = "#request?.userId()",
            resourceId = "#request?.assetId()",
            skipWhenAuthenticationOptional = true)
    public AssetDto makeManager(@RequestBody AssetMakeManagerRequestDto request) {
        return assetsService.makeManager(request);
    }

    @PostMapping("/revoke-manager")
    @RequiresPolicy(
            key = AccessPolicyKeys.ASSET_MANAGER_PROMOTE_ACTOR,
            subject = "#request?.userId()",
            resourceId = "#request?.assetId()",
            skipWhenAuthenticationOptional = true)
    public AssetDto revokeManager(@RequestBody AssetMakeManagerRequestDto request) {
        return assetsService.revokeManager(request);
    }

    private boolean hasText(String value) {
        return value != null && !value.isBlank();
    }

}
