package com.raxim.myscoutee.domain.assets.api;

import java.util.List;
import com.raxim.myscoutee.domain.assets.dto.AssetMediaVisibilityDto;

public interface AssetMediaVisibility {
    AssetMediaVisibilityDto asset(List<String> urls);
}
