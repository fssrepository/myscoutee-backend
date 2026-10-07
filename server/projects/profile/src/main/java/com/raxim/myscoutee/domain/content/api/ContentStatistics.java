package com.raxim.myscoutee.domain.content.api;
public interface ContentStatistics {
    long unresolvedReports(); long unresolvedFeedback();
    java.util.Map<String, Long> feedCounts(String userId);
}
