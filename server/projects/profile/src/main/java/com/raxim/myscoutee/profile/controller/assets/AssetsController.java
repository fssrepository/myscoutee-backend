package com.raxim.myscoutee.profile.controller.assets;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.raxim.myscoutee.profile.dto.assets.AssetsDtos.AssetDeleteRequestDto;
import com.raxim.myscoutee.profile.dto.assets.AssetsDtos.AssetReplaceRequestDto;
import com.raxim.myscoutee.profile.dto.assets.AssetsDtos.AssetUpsertRequestDto;
import com.raxim.myscoutee.profile.dto.shared.SharedDtos.AssetCardDto;
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
}
