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

@RestController
@RequestMapping("/assets")
public class AssetsController {

    @GetMapping
    public List<AssetCardDto> queryAssets(@RequestParam("userId") String userId) {
        return List.of();
    }

    @PostMapping("/upsert")
    public void upsert(@RequestBody AssetUpsertRequestDto request) {
        // no-op skeleton
    }

    @PostMapping("/replace")
    public void replace(@RequestBody AssetReplaceRequestDto request) {
        // no-op skeleton
    }

    @PostMapping("/delete")
    public void delete(@RequestBody AssetDeleteRequestDto request) {
        // no-op skeleton
    }
}
