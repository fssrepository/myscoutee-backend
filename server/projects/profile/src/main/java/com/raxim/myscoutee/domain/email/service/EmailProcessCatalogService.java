package com.raxim.myscoutee.domain.email.service;

import java.util.List;
import org.springframework.stereotype.Service;
import com.raxim.myscoutee.domain.email.api.EmailProcessCatalog;
import com.raxim.myscoutee.domain.email.repository.EmailTemplatesRepository;
import com.raxim.myscoutee.domain.email.repository.ScheduledMessageTasksRepository;

@Service
public class EmailProcessCatalogService implements EmailProcessCatalog {
    private final EmailTemplatesRepository templates;
    private final ScheduledMessageTasksRepository tasks;

    public EmailProcessCatalogService(EmailTemplatesRepository templates, ScheduledMessageTasksRepository tasks) {
        this.templates = templates;
        this.tasks = tasks;
    }

    @Override
    public List<TemplateOption> enabledTemplates(String baseGroupId) {
        return templates.findByBaseGroupIdAndEnabledTrueOrderByTemplateKeyAsc(baseGroupId).stream()
                .map(template -> new TemplateOption(template.getTemplateKey(), template.getName(),
                        template.getCategory(), template.getDescription())).toList();
    }

    @Override
    public List<TaskResult> recentTaskResults(String baseGroupId) {
        return tasks.findTop12ByBaseGroupIdAndLastRunAtIsoNotNullOrderByLastRunAtIsoDesc(baseGroupId).stream()
                .map(task -> new TaskResult(task.getTaskKey(), task.getLastRunAtIso(), task.getLastRunStatus(),
                        task.getLastRunDetail(), task.getLastRunCount(),
                        "scheduled".equals(task.getStatus()) ? task.getDueAtIso() : "")).toList();
    }
}
