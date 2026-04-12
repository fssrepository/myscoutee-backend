package com.raxim.myscoutee.profile.controller.assets;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.raxim.myscoutee.profile.data.dto.assets.AssetsDtos.AssetDeleteRequestDto;
import com.raxim.myscoutee.profile.data.dto.assets.AssetsDtos.AssetReplaceRequestDto;
import com.raxim.myscoutee.profile.data.dto.assets.AssetsDtos.AssetSourceRefreshRequestDto;
import com.raxim.myscoutee.profile.data.dto.assets.AssetsDtos.AssetSourceRefreshResponseDto;
import com.raxim.myscoutee.profile.data.dto.assets.AssetsDtos.AssetTicketsPageDto;
import com.raxim.myscoutee.profile.data.dto.assets.AssetsDtos.AssetUpsertRequestDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.AssetCardDto;
import com.raxim.myscoutee.profile.service.AssetsService;

@RestController
@RequestMapping("/assets")
public class AssetsController {
    private final AssetsService assetsService;

    public AssetsController(AssetsService assetsService) {
        this.assetsService = assetsService;
    }

    @GetMapping
    public List<AssetCardDto> queryAssets(@RequestParam("userId") String userId) {
        return assetsService.queryAssets(userId);
    }

    @GetMapping("/explore")
    public List<AssetCardDto> queryVisibleAssets(
            @RequestParam("userId") String userId,
            @RequestParam("type") String type,
            @RequestParam(value = "category", required = false) String category) {
        return assetsService.queryVisibleAssets(userId, type, category);
    }

    @GetMapping("/tickets")
    public AssetTicketsPageDto queryTickets(
            @RequestParam("userId") String userId,
            @RequestParam(value = "page", defaultValue = "0") Integer page,
            @RequestParam(value = "pageSize", defaultValue = "20") Integer pageSize,
            @RequestParam(value = "order", defaultValue = "upcoming") String order) {
        return assetsService.queryTicketPage(userId, page, pageSize, order);
    }

    @PostMapping("/upsert")
    public void upsert(@RequestBody AssetUpsertRequestDto request) {
        assetsService.upsert(request);
    }

    @PostMapping("/replace")
    public void replace(@RequestBody AssetReplaceRequestDto request) {
        assetsService.replace(request);
    }

    @PostMapping("/delete")
    public void delete(@RequestBody AssetDeleteRequestDto request) {
        assetsService.delete(request);
    }

    @PostMapping("/refresh-from-source")
    public AssetSourceRefreshResponseDto refreshFromSource(@RequestBody AssetSourceRefreshRequestDto request) {
        return assetsService.refreshFromSource(request);
    }
}
