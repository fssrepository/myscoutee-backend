package com.raxim.myscoutee.domain.email.document;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "emailCampaignRules")
@lombok.Getter @lombok.Setter
public class EmailCampaignRule {
    @Id
    private String id;
    private String baseGroupId;

    @Indexed(name = "email_campaign_rule_sync_key", unique = true, sparse = true)
    private String syncKey;

    private String ruleKey;

    private String name;
    private String description;
    private String templateKey;
    private String notificationTemplateKey;
    private String triggerType;
    private Boolean enabled;
    private Boolean suspended;
    private String scheduleType;
    private String cronExpression;
    private String timezone;
    private String oneTimeAtIso;
    private String audienceScope;
    private String eventId;
    private Boolean running;
    private String lastRunAtIso;
    private String nextRunAtIso;
    private String lastRunStatus;
    private String lastRunDetail;
    private Integer lastRunCount;
    private Integer priority;
    private Integer cooldownHours;
    private Integer maxDeliveriesPerUser;
    private Integer minProfileCompletion;
    private Integer maxProfileCompletion;
    private Integer minEventCount;
    private Integer maxEventCount;
    private Integer minHostingCount;
    private Integer maxHostingCount;
    private Integer minInactiveDays;
    private Integer maxInactiveDays;
    private Boolean requirePublicProfile;
    private Boolean requireMissingRegisteredDevice;
    private List<String> countryCodes = new ArrayList<>();
    private String ctaPath;
    private Map<String, String> templateVariables = new LinkedHashMap<>();
    private String createdDate;
    private String createdUser;
    private String updatedDate;
    private String updatedUser;

    public void setCountryCodes(List<String> countryCodes) {
        this.countryCodes = countryCodes == null ? new ArrayList<>() : new ArrayList<>(countryCodes);
    }

    public void setTemplateVariables(Map<String, String> templateVariables) {
        this.templateVariables = templateVariables == null ? new LinkedHashMap<>() : new LinkedHashMap<>(templateVariables);
    }

}
