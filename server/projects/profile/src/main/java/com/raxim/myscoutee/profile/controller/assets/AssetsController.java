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
import com.raxim.myscoutee.profile.data.dto.assets.AssetsDtos.AssetMakeManagerRequestDto;
import com.raxim.myscoutee.profile.data.dto.assets.AssetsDtos.AssetReplaceRequestDto;
import com.raxim.myscoutee.profile.data.dto.assets.AssetsDtos.AssetSourceRefreshRequestDto;
import com.raxim.myscoutee.profile.data.dto.assets.AssetsDtos.AssetSourceRefreshResponseDto;
import com.raxim.myscoutee.profile.data.dto.assets.AssetsDtos.AssetTicketsPageDto;
import com.raxim.myscoutee.profile.data.dto.assets.AssetsDtos.AssetUpsertRequestDto;
import com.raxim.myscoutee.profile.security.AccessPolicyKeys;
import com.raxim.myscoutee.profile.security.RequiresPolicy;
import com.raxim.myscoutee.profile.service.AssetsService;

@RestController
@RequestMapping("/assets")
public class AssetsController {
    private final AssetsService assetsService;

    public AssetsController(AssetsService assetsService) {
        this.assetsService = assetsService;
    }

    @GetMapping
    public List<AssetDto> queryAssets(@RequestParam(value = "userId", required = false) String userId) {
        return assetsService.queryAssets(userId);
    }

    @GetMapping("/{assetId}")
    public AssetDetailDto queryAssetDetail(@PathVariable("assetId") String assetId) {
        return assetsService.queryAssetDetail(assetId);
    }

    @GetMapping("/explore")
    public List<AssetDto> queryVisibleAssets(
            @RequestParam(value = "userId", required = false) String userId,
            @RequestParam("type") String type,
            @RequestParam(value = "category", required = false) String category) {
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

    @PostMapping("/upsert")
    public AssetDto upsert(@RequestBody AssetUpsertRequestDto request) {
        return assetsService.upsert(request);
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

    @PostMapping("/refresh-from-source")
    @RequiresPolicy(
            key = AccessPolicyKeys.ASSET_SOURCE_REFRESH,
            subject = "#request?.userId()",
            resourceId = "#request?.assetId() ?: #request?.userId()",
            skipWhenAuthenticationOptional = true)
    public AssetSourceRefreshResponseDto refreshFromSource(@RequestBody AssetSourceRefreshRequestDto request) {
        return assetsService.refreshFromSource(request);
    }
}
