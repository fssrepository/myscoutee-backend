package com.raxim.myscoutee.domain.integrations.service;

import org.springframework.stereotype.Service;
import com.raxim.myscoutee.domain.accounts.api.WorkspaceProfile.ChatCounts;
import com.raxim.myscoutee.domain.content.api.ContentStatistics;

@Service
class AdminModerationAttentionService implements AdminModerationAttention {
    private final ContentStatistics content;
    AdminModerationAttentionService(ContentStatistics content) { this.content = content; }

    public Counts counts(ChatCounts chat) {
        var support = chat == null ? null : chat.supportCases();
        return new Counts(content.unresolvedReports(), content.unresolvedFeedback(),
                support == null ? 0 : count(support.pending()) + count(support.warned()) + count(support.picked()));
    }

    private static long count(Integer value) { return value == null ? 0 : Math.max(0, value); }
}
