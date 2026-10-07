package com.raxim.myscoutee.domain.email.api;

import java.util.List;

/** Bounded read contract for the existing notification administration screen. */
public interface EmailProcessCatalog {
    List<TemplateOption> enabledTemplates(String baseGroupId);
    List<TaskResult> recentTaskResults(String baseGroupId);

    record TemplateOption(String key, String name, String category, String description) {}
    record TaskResult(String key, String ranAtIso, String status, String detail, Integer count, String nextRunAtIso) {}
}
