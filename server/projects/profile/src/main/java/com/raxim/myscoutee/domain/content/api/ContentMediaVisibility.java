package com.raxim.myscoutee.domain.content.api;

import java.util.List;

public interface ContentMediaVisibility {
    FeedPost feedPost(List<String> urls);
    record FeedPost(String moderationStatus) {}
}
