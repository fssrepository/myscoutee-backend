package com.raxim.myscoutee.profile.data.document;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "notificationRuleConfigs")
public class NotificationRuleConfig {
    @Id
    private String id;

    @Indexed(name = "notification_rule_config_sync_key", unique = true, sparse = true)
    private String syncKey;

    @Indexed(name = "notification_rule_config_rule_key", unique = true)
    private String ruleKey;

    private String label;
    private String category;
    private String description;
    private String actionKey;
    private String triggerKind;
    private Boolean enabled;
    private Boolean manualRunEnabled;
    private Integer priority;
    private DeliveryChannels channels = new DeliveryChannels();
    private Timing timing = new Timing();
    private MessageTemplate message = new MessageTemplate();
    private RunState runState = new RunState();
    private String createdDate;
    private String createdUser;
    private String updatedDate;
    private String updatedUser;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getSyncKey() {
        return syncKey;
    }

    public void setSyncKey(String syncKey) {
        this.syncKey = syncKey;
    }

    public String getRuleKey() {
        return ruleKey;
    }

    public void setRuleKey(String ruleKey) {
        this.ruleKey = ruleKey;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getActionKey() {
        return actionKey;
    }

    public void setActionKey(String actionKey) {
        this.actionKey = actionKey;
    }

    public String getTriggerKind() {
        return triggerKind;
    }

    public void setTriggerKind(String triggerKind) {
        this.triggerKind = triggerKind;
    }

    public Boolean getEnabled() {
        return enabled;
    }

    public void setEnabled(Boolean enabled) {
        this.enabled = enabled;
    }

    public Boolean getManualRunEnabled() {
        return manualRunEnabled;
    }

    public void setManualRunEnabled(Boolean manualRunEnabled) {
        this.manualRunEnabled = manualRunEnabled;
    }

    public Integer getPriority() {
        return priority;
    }

    public void setPriority(Integer priority) {
        this.priority = priority;
    }

    public DeliveryChannels getChannels() {
        return channels;
    }

    public void setChannels(DeliveryChannels channels) {
        this.channels = channels == null ? new DeliveryChannels() : channels;
    }

    public Timing getTiming() {
        return timing;
    }

    public void setTiming(Timing timing) {
        this.timing = timing == null ? new Timing() : timing;
    }

    public MessageTemplate getMessage() {
        return message;
    }

    public void setMessage(MessageTemplate message) {
        this.message = message == null ? new MessageTemplate() : message;
    }

    public RunState getRunState() {
        return runState;
    }

    public void setRunState(RunState runState) {
        this.runState = runState == null ? new RunState() : runState;
    }

    public String getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(String createdDate) {
        this.createdDate = createdDate;
    }

    public String getCreatedUser() {
        return createdUser;
    }

    public void setCreatedUser(String createdUser) {
        this.createdUser = createdUser;
    }

    public String getUpdatedDate() {
        return updatedDate;
    }

    public void setUpdatedDate(String updatedDate) {
        this.updatedDate = updatedDate;
    }

    public String getUpdatedUser() {
        return updatedUser;
    }

    public void setUpdatedUser(String updatedUser) {
        this.updatedUser = updatedUser;
    }

    public static class DeliveryChannels {
        private Boolean pushEnabled;
        private Boolean emailEnabled;
        private Boolean inAppEnabled;
        private Boolean supportChatEnabled;

        public Boolean getPushEnabled() {
            return pushEnabled;
        }

        public void setPushEnabled(Boolean pushEnabled) {
            this.pushEnabled = pushEnabled;
        }

        public Boolean getEmailEnabled() {
            return emailEnabled;
        }

        public void setEmailEnabled(Boolean emailEnabled) {
            this.emailEnabled = emailEnabled;
        }

        public Boolean getInAppEnabled() {
            return inAppEnabled;
        }

        public void setInAppEnabled(Boolean inAppEnabled) {
            this.inAppEnabled = inAppEnabled;
        }

        public Boolean getSupportChatEnabled() {
            return supportChatEnabled;
        }

        public void setSupportChatEnabled(Boolean supportChatEnabled) {
            this.supportChatEnabled = supportChatEnabled;
        }
    }

    public static class Timing {
        private String mode;
        private Integer delayMinutes;
        private Integer intervalMinutes;
        private Integer month;
        private Integer dayOfMonth;
        private String time;
        private String timezone;

        public String getMode() {
            return mode;
        }

        public void setMode(String mode) {
            this.mode = mode;
        }

        public Integer getDelayMinutes() {
            return delayMinutes;
        }

        public void setDelayMinutes(Integer delayMinutes) {
            this.delayMinutes = delayMinutes;
        }

        public Integer getIntervalMinutes() {
            return intervalMinutes;
        }

        public void setIntervalMinutes(Integer intervalMinutes) {
            this.intervalMinutes = intervalMinutes;
        }

        public Integer getMonth() {
            return month;
        }

        public void setMonth(Integer month) {
            this.month = month;
        }

        public Integer getDayOfMonth() {
            return dayOfMonth;
        }

        public void setDayOfMonth(Integer dayOfMonth) {
            this.dayOfMonth = dayOfMonth;
        }

        public String getTime() {
            return time;
        }

        public void setTime(String time) {
            this.time = time;
        }

        public String getTimezone() {
            return timezone;
        }

        public void setTimezone(String timezone) {
            this.timezone = timezone;
        }
    }

    public static class MessageTemplate {
        private String pushTitle;
        private String pushBody;
        private String emailTemplateKey;
        private String emailSubject;
        private String emailBody;
        private String ctaPath;

        public String getPushTitle() {
            return pushTitle;
        }

        public void setPushTitle(String pushTitle) {
            this.pushTitle = pushTitle;
        }

        public String getPushBody() {
            return pushBody;
        }

        public void setPushBody(String pushBody) {
            this.pushBody = pushBody;
        }

        public String getEmailTemplateKey() {
            return emailTemplateKey;
        }

        public void setEmailTemplateKey(String emailTemplateKey) {
            this.emailTemplateKey = emailTemplateKey;
        }

        public String getEmailSubject() {
            return emailSubject;
        }

        public void setEmailSubject(String emailSubject) {
            this.emailSubject = emailSubject;
        }

        public String getEmailBody() {
            return emailBody;
        }

        public void setEmailBody(String emailBody) {
            this.emailBody = emailBody;
        }

        public String getCtaPath() {
            return ctaPath;
        }

        public void setCtaPath(String ctaPath) {
            this.ctaPath = ctaPath;
        }
    }

    public static class RunState {
        private String lastRunAtIso;
        private String lastRunStatus;
        private String lastRunDetail;
        private Integer lastRunCount;
        private String lastRunUser;

        public String getLastRunAtIso() {
            return lastRunAtIso;
        }

        public void setLastRunAtIso(String lastRunAtIso) {
            this.lastRunAtIso = lastRunAtIso;
        }

        public String getLastRunStatus() {
            return lastRunStatus;
        }

        public void setLastRunStatus(String lastRunStatus) {
            this.lastRunStatus = lastRunStatus;
        }

        public String getLastRunDetail() {
            return lastRunDetail;
        }

        public void setLastRunDetail(String lastRunDetail) {
            this.lastRunDetail = lastRunDetail;
        }

        public Integer getLastRunCount() {
            return lastRunCount;
        }

        public void setLastRunCount(Integer lastRunCount) {
            this.lastRunCount = lastRunCount;
        }

        public String getLastRunUser() {
            return lastRunUser;
        }

        public void setLastRunUser(String lastRunUser) {
            this.lastRunUser = lastRunUser;
        }
    }
}
